'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { 
  Gift, 
  Loader2, 
  ChevronLeft, 
  Eye, 
  EyeOff, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Send, 
  Inbox, 
  Calendar, 
  History, 
  Sparkles,
  Printer
} from 'lucide-react';
import { Section } from '@/components/new-ui/Section';
import { Button } from '@/components/new-ui/Button';
import { cn } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function UserGiftCardsDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeSubTab, setActiveSubTab] = useState<'received' | 'sent'>('received');
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'scheduled' | 'redeemed'>('all');

  const { data: giftCardsRes, error, isLoading, mutate } = useSWR(
    status === 'authenticated' ? '/api/gift-cards/my-cards' : null,
    fetcher
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="bg-brand-bg min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-gold h-12 w-12" />
      </div>
    );
  }

  if (error || (giftCardsRes && !giftCardsRes.success)) {
    return (
      <div className="bg-brand-bg min-h-screen pt-32 text-center text-red-500">
        Failed to load Gift Cards. Please try again.
      </div>
    );
  }

  const allCards = giftCardsRes?.data || [];
  
  // Filter received cards: recipient email matches user's email
  const receivedCards = allCards.filter(
    (card: any) => card.recipientEmail.toLowerCase() === session?.user?.email?.toLowerCase()
  );

  // Filter sent cards: senderUserId matches current user's ID
  const sentCards = allCards.filter(
    (card: any) => card.senderUserId === (session?.user as any).id
  );

  let activeCardsList = activeSubTab === 'received' ? receivedCards : sentCards;

  // Apply status filter
  if (statusFilter === 'active') {
    activeCardsList = activeCardsList.filter((card: any) => (card.status === 'active' || card.status === 'partially_redeemed') && card.deliveryStatus !== 'pending');
  } else if (statusFilter === 'scheduled') {
    activeCardsList = activeCardsList.filter((card: any) => card.deliveryStatus === 'pending' && card.scheduledAt);
  } else if (statusFilter === 'redeemed') {
    activeCardsList = activeCardsList.filter((card: any) => card.status === 'redeemed');
  }

  // Calculate totals
  const totalReceivedBalance = receivedCards.reduce(
    (sum: number, card: any) => sum + (card.status === 'active' || card.status === 'partially_redeemed' ? card.currentBalance : 0),
    0
  );

  const totalSentValue = sentCards.reduce(
    (sum: number, card: any) => sum + card.initialAmount,
    0
  );

  const togglePinReveal = (code: string) => {
    setRevealedPins(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  const getStatusBadge = (card: any) => {
    if (card.status === 'cancelled') {
      return <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1"><XCircle size={10} /> Cancelled</span>;
    }
    if (card.status === 'expired') {
      return <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1"><XCircle size={10} /> Expired</span>;
    }
    if (card.deliveryStatus === 'pending' && card.scheduledAt) {
      return <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1"><Clock size={10} /> Scheduled</span>;
    }
    switch (card.status) {
      case 'active':
        return <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1"><CheckCircle2 size={10} /> Active</span>;
      case 'partially_redeemed':
        return <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1"><Clock size={10} /> Partial</span>;
      case 'redeemed':
        return <span className="px-3 py-1 bg-brand-text/10 text-brand-text/50 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">Fully Used</span>;
      default:
        return <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1"><Clock size={10} /> Pending</span>;
    }
  };

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen pt-32 pb-20 overflow-x-hidden transition-colors duration-500">
      <Section className="max-w-[1200px] mx-auto px-4 md:px-6 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => router.push('/account')}
          className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-text/40 hover:text-brand-text transition-colors"
        >
          <ChevronLeft size={14} />
          <span>My Profile</span>
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-serif text-brand-text">Gift Card Ledger</h1>
            <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold">Manage and review your luxury vouchers</p>
          </div>
          
          <Button 
            variant="primary" 
            onClick={() => router.push('/gift-cards')}
            className="shadow-premium px-8"
          >
            Send Gift Card
          </Button>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* received sum */}
          <div className="bg-[#1a1614] text-white rounded-[40px] p-8 shadow-premium relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Inbox size={150} />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-white/50 font-bold mb-1">Available Redeeming Value</p>
              <p className="text-4xl md:text-5xl font-serif text-brand-gold">₹{totalReceivedBalance.toLocaleString('en-IN')}</p>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-white/40 mt-4">Redeemable on checkout dynamically</p>
          </div>

          {/* sent sum */}
          <div className="bg-white dark:bg-brand-white rounded-[40px] p-8 border border-brand-text/5 shadow-soft flex flex-col justify-between min-h-[180px]">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Send size={150} />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold mb-1">Total Gifted Sent</p>
              <p className="text-4xl md:text-5xl font-serif text-brand-text">₹{totalSentValue.toLocaleString('en-IN')}</p>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-brand-text/30 mt-4">Calculated across {sentCards.length} shares</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-brand-text/10 pt-4">
          <button
            onClick={() => { setActiveSubTab('received'); setStatusFilter('all'); }}
            className={cn(
              "pb-4 px-6 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all flex items-center space-x-2",
              activeSubTab === 'received' ? "border-brand-gold text-brand-gold" : "border-transparent text-brand-text/40 hover:text-brand-text"
            )}
          >
            <Inbox size={14} />
            <span>Gifts Received ({receivedCards.length})</span>
          </button>
          <button
            onClick={() => { setActiveSubTab('sent'); setStatusFilter('all'); }}
            className={cn(
              "pb-4 px-6 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all flex items-center space-x-2",
              activeSubTab === 'sent' ? "border-brand-gold text-brand-gold" : "border-transparent text-brand-text/40 hover:text-brand-text"
            )}
          >
            <Send size={14} />
            <span>Gifts Sent ({sentCards.length})</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[9px] uppercase tracking-widest font-black text-brand-text/40 mr-2">Filter By Status:</span>
          {(['all', 'active', 'scheduled', 'redeemed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold border transition-all",
                statusFilter === filter
                  ? "bg-brand-text dark:bg-brand-gold text-white border-transparent shadow-sm"
                  : "bg-white dark:bg-brand-white text-brand-text/60 border-brand-text/5 hover:border-brand-gold/30"
              )}
            >
              {filter === 'active' ? 'Active / Partial' : filter}
            </button>
          ))}
        </div>

        {/* Main List */}
        <div className="space-y-8">
          {activeCardsList.length === 0 ? (
            <div className="py-24 bg-gradient-to-b from-white to-[#FAF9F6] dark:from-[#1C1A19] dark:to-[#121110] rounded-[40px] border border-brand-text/5 shadow-soft flex flex-col items-center justify-center text-center p-8 max-w-xl mx-auto space-y-6">
              <div className="w-20 h-20 rounded-full bg-brand-gold/5 flex items-center justify-center text-brand-gold border border-brand-gold/15">
                <Gift size={36} />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-xl font-serif italic text-brand-text">No Gift Cards Found</h3>
                <p className="text-[10px] uppercase tracking-widest text-brand-text/50 font-bold leading-relaxed">
                  {activeSubTab === 'received' 
                    ? "You haven't received any gift vouchers yet. Any voucher sent to your registered email will be displayed here."
                    : "You haven't sent any gift vouchers yet. Share the gift of luxury with your loved ones."}
                </p>
              </div>
              {activeSubTab === 'sent' && (
                <Button 
                  onClick={() => router.push('/gift-cards')}
                  className="shadow-premium px-8 text-[10px] tracking-widest uppercase !py-3"
                >
                  Buy First Gift Card
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {activeCardsList.map((card: any) => {
                const isRevealed = revealedPins[card.code] || false;
                // Calculate redemption percentage
                const redeemedPercent = Math.round((1 - card.currentBalance / card.initialAmount) * 100);
                
                return (
                  <div 
                    key={card._id}
                    className="bg-white dark:bg-brand-white rounded-[40px] p-8 border border-brand-text/5 shadow-soft hover:shadow-premium transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group"
                  >
                    
                    {/* Header line */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[8px] uppercase tracking-widest font-black text-brand-gold">
                          {card.theme} theme
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm font-bold tracking-widest">
                            {isRevealed ? card.code : 'ZGFT-••••-••••'}
                          </span>
                          <button 
                            onClick={() => togglePinReveal(card.code)}
                            className="text-brand-text/30 hover:text-brand-gold transition-colors"
                            title={isRevealed ? "Hide code" : "Show code"}
                          >
                            {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                      {getStatusBadge(card)}
                    </div>

                    {/* Scheduled notification */}
                    {card.deliveryStatus === 'pending' && card.scheduledAt && (
                      <div className="bg-amber-500/5 border border-amber-500/15 p-4 rounded-xl flex items-center gap-2 text-amber-600 text-[10px] uppercase font-bold tracking-wider">
                        <Clock size={14} className="shrink-0 animate-pulse" />
                        <span>Deferred Delivery Scheduled: {new Date(card.scheduledAt).toLocaleString()}</span>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[8px] uppercase tracking-widest text-brand-text/40 font-bold">
                        <span>Redemption Status</span>
                        <span>{redeemedPercent}% Used</span>
                      </div>
                      <div className="w-full h-2 bg-brand-bg rounded-full overflow-hidden border border-brand-text/5 relative">
                        <div 
                          className="h-full bg-brand-gold rounded-full transition-all duration-700" 
                          style={{ width: `${(card.currentBalance / card.initialAmount) * 100}%` }} 
                        />
                      </div>
                    </div>

                    {/* Balance Display */}
                    <div className="flex justify-between items-end bg-brand-bg/50 px-6 py-4 rounded-2xl border border-brand-text/5">
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-brand-text/40 font-bold">Current Balance</span>
                        <p className="text-2xl font-serif font-black italic mt-0.5">₹{card.currentBalance.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] uppercase tracking-widest text-brand-text/40 font-bold">Initial Value</span>
                        <p className="text-xs font-bold text-brand-text/60 mt-0.5">₹{card.initialAmount.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    {/* Recipient Activity Trackers for Sent Cards */}
                    {activeSubTab === 'sent' && (
                      <div className="grid grid-cols-3 gap-2 bg-brand-bg/30 p-3 rounded-xl border border-brand-text/5 text-center text-[8px] font-black uppercase tracking-widest">
                        <div className="space-y-1">
                          <span className="text-brand-text/40">Delivered</span>
                          <p className={cn("text-[10px] font-bold mt-0.5", card.deliveredAt ? "text-green-600" : "text-gray-400")}>
                            {card.deliveredAt ? new Date(card.deliveredAt).toLocaleDateString() : card.deliveryStatus === 'pending' ? 'Pending' : 'No'}
                          </p>
                        </div>
                        <div className="space-y-1 border-x border-brand-text/5">
                          <span className="text-brand-text/40">Opened</span>
                          <p className={cn("text-[10px] font-bold mt-0.5", card.openedAt ? "text-green-600" : "text-gray-400")}>
                            {card.openedAt ? new Date(card.openedAt).toLocaleDateString() : 'Not Yet'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-brand-text/40">Redeemed</span>
                          <p className={cn("text-[10px] font-bold mt-0.5", card.currentBalance < card.initialAmount ? "text-amber-500" : "text-gray-400")}>
                            {card.currentBalance < card.initialAmount ? `₹${(card.initialAmount - card.currentBalance).toLocaleString()}` : 'No'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Sender / Recipient */}
                    <div className="grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-widest border-b border-brand-text/5 pb-4">
                      <div>
                        <span className="text-brand-text/30">
                          {activeSubTab === 'received' ? 'Sender' : 'Recipient'}
                        </span>
                        <p className="text-brand-text dark:text-brand-text/90 mt-1 truncate">
                          {activeSubTab === 'received' ? 'Gifted to you' : `${card.recipientName} (${card.recipientEmail})`}
                        </p>
                      </div>
                      <div>
                        <span className="text-brand-text/30">Expires On</span>
                        <p className="text-brand-text dark:text-brand-text/90 mt-1 flex items-center gap-1">
                          <Calendar size={12} className="text-brand-gold" />
                          {new Date(card.expirationDate).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Messages & PIN */}
                    <div className="flex flex-col space-y-4">
                      {card.personalMessage && (
                        <p className="text-[11px] text-brand-text/60 italic leading-relaxed bg-brand-bg/20 p-4 rounded-xl">
                          "{card.personalMessage}"
                        </p>
                      )}

                      <div className="flex items-center justify-between gap-4">
                        {/* Display Pin for Received Cards so the owner can redeem it */}
                        {activeSubTab === 'received' ? (
                          <div className="flex justify-between items-center bg-brand-gold/5 border border-brand-gold/10 px-4 py-2.5 rounded-xl text-xs flex-1 mr-4">
                            <span className="font-bold text-brand-gold text-[9px] uppercase tracking-widest mr-2">Security PIN</span>
                            <span className="font-mono font-black tracking-widest text-brand-text">
                              {isRevealed ? card.pin : '••••••'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex-1" />
                        )}

                        <div className="flex items-center gap-4 shrink-0">
                          {/* Reveal Link */}
                          <Link 
                            href={`/gift-cards/redeem?code=${card.code}&pin=${card.pin}`} 
                            target="_blank"
                            className="text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:underline flex items-center gap-1.5 py-2"
                          >
                            <Eye size={13} />
                            <span>Reveal Page</span>
                          </Link>

                          {/* Print Trigger */}
                          <Link 
                            href={`/gift-cards/print?code=${card.code}&pin=${card.pin}`} 
                            target="_blank" 
                            className="text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:underline flex items-center gap-1.5 py-2"
                          >
                            <Printer size={13} />
                            <span>Print Voucher</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Transaction History Sub-Section */}
                    {card.transactions && card.transactions.length > 0 && (
                      <div className="space-y-2 border-t border-brand-text/5 pt-4">
                        <div className="flex items-center space-x-1.5 text-[9px] uppercase tracking-widest font-black text-brand-text/40">
                          <History size={12} />
                          <span>Redemption Log</span>
                        </div>
                        <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                          {card.transactions.map((tx: any) => (
                            <div key={tx._id} className="flex justify-between items-center text-[10px] p-2 bg-brand-bg/30 rounded-lg">
                              <div>
                                <span className={cn(
                                  "font-bold uppercase tracking-wider",
                                  tx.type === 'redeemed' ? "text-amber-600" : 
                                  tx.type === 'refunded' ? "text-green-600" : "text-brand-text/60"
                                )}>
                                  {tx.type}
                                </span>
                                <span className="text-brand-text/30 font-bold ml-2">
                                  {new Date(tx.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <span className="font-bold">
                                {tx.type === 'redeemed' ? '-' : '+'}${(tx.amount).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </Section>
    </div>
  );
}
