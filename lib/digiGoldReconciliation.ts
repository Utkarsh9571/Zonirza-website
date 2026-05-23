import DigitalGoldWallet from '@/models/DigitalGoldWallet';
import DigitalGoldTransaction from '@/models/DigitalGoldTransaction';
import FinancialAuditLog from '@/models/FinancialAuditLog';

export async function runGlobalReconciliation(adminId: string) {
  const wallets = await DigitalGoldWallet.find({});
  const report = {
    totalWalletsScanned: wallets.length,
    mismatchesFound: 0,
    staleLocksReleased: 0,
    details: [] as any[]
  };

  for (const wallet of wallets) {
    let calculatedGrams = 0;
    const transactions = await DigitalGoldTransaction.find({ 
      walletId: wallet._id,
      status: 'success'
    });

    for (const tx of transactions) {
      if (tx.type === 'buy') {
        calculatedGrams += tx.goldGrams;
      } else if (tx.type === 'sell' || tx.type === 'redeem') {
        calculatedGrams -= tx.goldGrams;
      }
    }

    // Floating point math precision fix (e.g., to 4 decimal places)
    calculatedGrams = Number(calculatedGrams.toFixed(4));
    const currentGrams = Number(wallet.totalGrams.toFixed(4));

    if (calculatedGrams !== currentGrams) {
      report.mismatchesFound++;
      report.details.push({
        walletId: wallet._id.toString(),
        userId: wallet.userId.toString(),
        expected: calculatedGrams,
        actual: currentGrams,
        difference: Number((currentGrams - calculatedGrams).toFixed(4))
      });

      // Log mismatch
      await FinancialAuditLog.create({
        actor: 'SYSTEM_RECONCILIATION',
        action: 'LEDGER_MISMATCH_DETECTED',
        entityType: 'DigitalGoldWallet',
        entityId: wallet._id.toString(),
        beforeValue: currentGrams,
        afterValue: calculatedGrams,
        metadata: { diff: currentGrams - calculatedGrams }
      });
    }

    // Stale lock recovery (e.g., locks held for > 1 hour without an update)
    if (wallet.lockedGrams > 0) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (new Date(wallet.updatedAt) < oneHourAgo) {
        const released = wallet.lockedGrams;
        wallet.lockedGrams = 0;
        await wallet.save();
        
        report.staleLocksReleased++;
        report.details.push({
          walletId: wallet._id.toString(),
          type: 'STALE_LOCK_RELEASED',
          amount: released
        });

        await FinancialAuditLog.create({
          actor: 'SYSTEM_RECONCILIATION',
          action: 'STALE_LOCK_RELEASED',
          entityType: 'DigitalGoldWallet',
          entityId: wallet._id.toString(),
          beforeValue: released,
          afterValue: 0
        });
      }
    }
  }

  // Audit the run itself
  await FinancialAuditLog.create({
    actor: adminId,
    action: 'RECONCILIATION_RUN',
    entityType: 'System',
    metadata: report
  });

  return report;
}
