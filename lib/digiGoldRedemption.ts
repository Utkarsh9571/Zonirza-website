import dbConnect from '@/lib/db';
import DigitalGoldWallet from '@/models/DigitalGoldWallet';
import DigitalGoldTransaction from '@/models/DigitalGoldTransaction';
import { getLiveGoldRate } from '@/lib/goldRates';
import { formatFinance } from '@/lib/digiGoldValuation';
import mongoose from 'mongoose';

/**
 * Calculates how much INR value the user can redeem from their wallet.
 * Value is based on (totalGrams - lockedGrams) * liveSellRate.
 */
export async function getEligibleRedemptionAmount(userId: string) {
  await dbConnect();
  const wallet = await DigitalGoldWallet.findOne({ userId });
  if (!wallet) return { amount: 0, grams: 0, rate: 0 };

  const liveRate = await getLiveGoldRate();
  if (!liveRate) return { amount: 0, grams: 0, rate: 0 };

  const availableGrams = wallet.totalGrams - wallet.lockedGrams;
  if (availableGrams <= 0) return { amount: 0, grams: 0, rate: liveRate.sellRate24K };

  const amount = formatFinance(availableGrams * liveRate.sellRate24K, 2);
  
  return {
    amount,
    grams: availableGrams,
    rate: liveRate.sellRate24K
  };
}

/**
 * Temporarily locks a specific INR amount of gold in the user's wallet for checkout.
 * Returns the exact grams locked and the transaction ID.
 */
export async function lockWalletBalance(userId: string, orderId: string, requestedInrAmount: number) {
  await dbConnect();
  
  const liveRate = await getLiveGoldRate();
  if (!liveRate) throw new Error('Live rate unavailable');

  const wallet = await DigitalGoldWallet.findOne({ userId });
  if (!wallet) throw new Error('Wallet not found');

  const availableGrams = wallet.totalGrams - wallet.lockedGrams;
  const gramsToLock = formatFinance(requestedInrAmount / liveRate.sellRate24K, 4);

  if (gramsToLock > availableGrams) {
    throw new Error('Insufficient unlocked gold balance');
  }

  // Lock the grams
  wallet.lockedGrams += gramsToLock;
  await wallet.save();

  // Create audit lock transaction
  const tx = await DigitalGoldTransaction.create({
    walletId: wallet._id,
    userId: wallet.userId,
    type: 'lock',
    rupeeAmount: requestedInrAmount,
    goldGrams: gramsToLock,
    goldRateAtExecution: liveRate.sellRate24K,
    status: 'success',
    linkedOrderId: orderId
  });

  return {
    lockedGrams: gramsToLock,
    transactionId: tx._id,
    rate: liveRate.sellRate24K
  };
}

/**
 * Unlocks previously locked grams (e.g. if payment fails or order is cancelled).
 */
export async function unlockWalletBalance(userId: string, orderId: string) {
  await dbConnect();

  // Find the lock transaction
  const lockTx = await DigitalGoldTransaction.findOne({
    userId,
    linkedOrderId: orderId,
    type: 'lock'
  });

  if (!lockTx) return false;

  const wallet = await DigitalGoldWallet.findOne({ userId });
  if (!wallet) return false;

  // Unlock the grams safely (preventing negative locked amounts)
  wallet.lockedGrams = Math.max(0, wallet.lockedGrams - lockTx.goldGrams);
  await wallet.save();

  // Create unlock transaction
  await DigitalGoldTransaction.create({
    walletId: wallet._id,
    userId: wallet.userId,
    type: 'unlock',
    rupeeAmount: lockTx.rupeeAmount,
    goldGrams: lockTx.goldGrams,
    goldRateAtExecution: lockTx.goldRateAtExecution,
    status: 'success',
    linkedOrderId: orderId
  });

  return true;
}

/**
 * Finalizes the redemption after successful payment.
 * Converts 'lockedGrams' into a permanent deduction from 'totalGrams'.
 */
export async function finalizeRedemption(userId: string, orderId: string) {
  await dbConnect();

  const lockTx = await DigitalGoldTransaction.findOne({
    userId,
    linkedOrderId: orderId,
    type: 'lock'
  });

  if (!lockTx) throw new Error('Lock transaction not found');

  const wallet = await DigitalGoldWallet.findOne({ userId });
  if (!wallet) throw new Error('Wallet not found');

  // Deduct from BOTH totalGrams and lockedGrams
  wallet.totalGrams = Math.max(0, wallet.totalGrams - lockTx.goldGrams);
  wallet.lockedGrams = Math.max(0, wallet.lockedGrams - lockTx.goldGrams);
  
  // Pro-rata reduce totalInvestment so ROI calculations remain accurate
  const proportionRedeemed = lockTx.goldGrams / (wallet.totalGrams + lockTx.goldGrams); // original total
  const investmentDeduction = wallet.totalInvestment * proportionRedeemed;
  wallet.totalInvestment = Math.max(0, wallet.totalInvestment - investmentDeduction);

  await wallet.save();

  // Create the final redeem transaction
  const redeemTx = await DigitalGoldTransaction.create({
    walletId: wallet._id,
    userId: wallet.userId,
    type: 'redeem',
    rupeeAmount: lockTx.rupeeAmount,
    goldGrams: lockTx.goldGrams,
    goldRateAtExecution: lockTx.goldRateAtExecution,
    status: 'success',
    linkedOrderId: orderId
  });

  return redeemTx;
}
