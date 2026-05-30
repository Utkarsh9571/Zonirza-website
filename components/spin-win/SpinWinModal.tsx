"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthModalStore } from "@/store/authModalStore";
import { X, Sparkles, Loader2, Ticket, CheckCircle, LogIn } from "lucide-react";

interface SanitizedPrize {
  id: string;
  index: number;
  title: string;
  displayOrder: number;
}

export default function SpinWinModal() {
  const { data: session, status } = useSession();
  const { openAuthModal } = useAuthModalStore();

  const [isOpen, setIsOpen] = useState(false);
  const [spinWinEnabled, setSpinWinEnabled] = useState<boolean>(false);
  const [prizes, setPrizes] = useState<SanitizedPrize[]>([]);
  const [canSpin, setCanSpin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Wheel interaction states
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<{
    index: number;
    title: string;
    couponCode: string | null;
    claimed: boolean;
  } | null>(null);

  const [pendingAttemptId, setPendingAttemptId] = useState<string | null>(null);
  const [claimStatus, setClaimStatus] = useState<"idle" | "claiming" | "claimed" | "error">("idle");
  const [claimError, setClaimError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Check state on mount to decide whether to show the promotional modal
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch("/api/spin-win/state");
        const data = await res.json();
        
        if (data.success && data.spinWinEnabled && data.canSpin) {
          setSpinWinEnabled(true);
          setPrizes(data.prizes || []);
          setCanSpin(true);
          
          // Check session storage to see if they already dismissed it in this session
          const dismissed = sessionStorage.getItem("spin_win_modal_dismissed");
          if (!dismissed) {
            // Trigger open after a 5 second delay to let page load first
            const timer = setTimeout(() => {
              setIsOpen(true);
            }, 5000);
            return () => clearTimeout(timer);
          }
        }
      } catch (err) {
        console.error("Error fetching spin state in modal:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchState();

    const stored = localStorage.getItem("pending_spin_attempt_id");
    if (stored) {
      setPendingAttemptId(stored);
    }
  }, []);

  // Handle claiming of guest spins when session becomes authenticated
  useEffect(() => {
    if (status === "authenticated" && pendingAttemptId && claimStatus === "idle") {
      claimReward(pendingAttemptId);
    }
  }, [status, pendingAttemptId]);

  const claimReward = async (attemptId: string) => {
    try {
      setClaimStatus("claiming");
      setClaimError(null);
      
      const res = await fetch("/api/spin-win/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId }),
      });
      
      const data = await res.json();
      if (data.success) {
        setClaimStatus("claimed");
        if (wonPrize) {
          setWonPrize(prev => prev ? { ...prev, claimed: true, couponCode: data.couponCode } : null);
        }
        localStorage.removeItem("pending_spin_attempt_id");
        setPendingAttemptId(null);
      } else {
        setClaimStatus("error");
        setClaimError(data.error || "Failed to claim reward");
      }
    } catch (err) {
      console.error("Error claiming reward in modal:", err);
      setClaimStatus("error");
      setClaimError("Network error claiming reward");
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem("spin_win_modal_dismissed", "true");
  };

  const handleSpin = async () => {
    if (spinning || !canSpin || prizes.length === 0) return;

    try {
      setSpinning(true);
      setWonPrize(null);
      setShowConfetti(false);
      
      const res = await fetch("/api/spin-win/spin", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Spin failed. Please try again.");
        setSpinning(false);
        return;
      }

      const { index, title, couponCode, attemptId, claimed } = data.data;

      const totalSlices = prizes.length;
      const sliceAngle = 360 / totalSlices;
      const centerAngle = (index * sliceAngle) + (sliceAngle / 2);
      const targetDegrees = (360 * 8) + 270 - centerAngle;
      
      setRotation(targetDegrees);

      setTimeout(() => {
        setSpinning(false);
        setCanSpin(false);
        
        setWonPrize({
          index,
          title,
          couponCode,
          claimed,
        });
        
        if (!title.toLowerCase().includes("try again") && !title.toLowerCase().includes("better luck")) {
          setShowConfetti(true);
        }

        if (!claimed && attemptId) {
          localStorage.setItem("pending_spin_attempt_id", attemptId);
          setPendingAttemptId(attemptId);
        }
      }, 5000);

    } catch (err) {
      console.error("Error spinning in modal:", err);
      alert("Something went wrong. Please try again.");
      setSpinning(false);
    }
  };

  const drawWheelSlices = () => {
    const n = prizes.length;
    if (n === 0) return null;

    const sliceAngle = 360 / n;
    
    return prizes.map((prize, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = (i + 1) * sliceAngle;
      
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      
      const cx = 150, cy = 150, r = 135;
      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      
      let sliceColor = "#1E1B18";
      let textColor = "#D4AF37";
      
      if (prize.title.toLowerCase().includes("try again") || prize.title.toLowerCase().includes("better luck")) {
        sliceColor = "#2C2621";
        textColor = "#9E8A75";
      } else if (i % 2 === 1) {
        sliceColor = "#C5A880";
        textColor = "#1E1B18";
      } else if (i % 3 === 2) {
        sliceColor = "#FAF6F0";
        textColor = "#8B2332";
      }

      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
      const midAngleDegrees = startAngle + sliceAngle / 2;

      return (
        <g key={prize.id}>
          <path d={pathData} fill={sliceColor} stroke="#D4AF37" strokeWidth="0.5" />
          <text
            x={cx + 65}
            y={cy + 3}
            textAnchor="end"
            transform={`rotate(${midAngleDegrees}, ${cx}, ${cy})`}
            fill={textColor}
            className="font-serif text-[7.5px] font-bold tracking-wide select-none"
          >
            {prize.title}
          </text>
        </g>
      );
    });
  };

  if (!isOpen || !spinWinEnabled || prizes.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      
      {/* Sparkles / Confetti animation in modal */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
          {Array.from({ length: 40 }).map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 1.5;
            const duration = 2 + Math.random() * 2.5;
            const size = 5 + Math.random() * 8;
            const colors = ["#dfb876", "#fcfaf7", "#C5A880", "#D4AF37", "#8B2332"];
            const color = colors[Math.floor(Math.random() * colors.length)];
            return (
              <div
                key={i}
                className="absolute rounded-sm animate-modal-confetti"
                style={{
                  left: `${left}%`,
                  top: `-20px`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  opacity: 0.8,
                }}
              />
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes modal-confetti {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-modal-confetti {
          animation: modal-confetti linear infinite;
        }
        @keyframes modal-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(212, 175, 55, 0.3); }
          50% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.7); }
        }
        .animate-modal-glow {
          animation: modal-glow 2s infinite;
        }
      `}</style>

      {/* Modal Dialog Body */}
      <div className="relative w-full max-w-lg bg-[#12100e] border border-brand-gold/30 rounded-[32px] overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col items-center">
        
        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-[#9E8A75] hover:text-[#D4AF37] p-2 hover:bg-white/5 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center space-x-1.5 bg-brand-gold/10 border border-brand-gold/30 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]">
            <Sparkles size={9} className="animate-spin" />
            <span>Lucky Spin</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-white tracking-tight">
            Spin the <span className="text-[#D4AF37] italic">Fortune Wheel</span>
          </h2>
          <p className="text-xs text-[#9E8A75] max-w-xs leading-relaxed">
            Unlock premium discounts and complimentary shopping codes today!
          </p>
        </div>

        {/* Interactive mini wheel */}
        <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full flex items-center justify-center bg-[#1A1614] border-[4px] border-[#D4AF37] shadow-lg select-none mb-6">
          {/* Pointer */}
          <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 z-30">
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[16px] border-t-[#D4AF37] filter drop-shadow-md"></div>
          </div>

          {/* Wheel Body */}
          <div 
            className="w-full h-full rounded-full transition-transform"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? "transform 5000ms cubic-bezier(0.1, 0.8, 0.1, 1)" : "none"
            }}
          >
            <svg viewBox="0 0 300 300" className="w-full h-full transform -rotate-90">
              {drawWheelSlices()}
              <circle cx="150" cy="150" r="135" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Center Hub */}
          <div className="absolute z-20 w-[55px] h-[55px] sm:w-[65px] sm:h-[65px] rounded-full bg-[#1E1B18] border-[2px] border-[#D4AF37] flex items-center justify-center shadow-lg">
            <button
              disabled={spinning}
              onClick={handleSpin}
              className={`w-full h-full rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-[#dfb876] to-[#b88c3a] text-black font-black uppercase text-[8px] sm:text-[9px] tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 ${
                !spinning ? "cursor-pointer animate-modal-glow" : "opacity-75 cursor-not-allowed"
              }`}
            >
              {spinning ? <Loader2 className="w-3 h-3 animate-spin" /> : "SPIN"}
            </button>
          </div>
        </div>

        {/* Status / Outcome Details */}
        <div className="w-full bg-[#1C1816] border border-brand-gold/15 rounded-2xl p-4 text-center">
          {wonPrize ? (
            <div className="space-y-3 animate-in fade-in duration-500">
              <div>
                <p className="text-[10px] text-[#9E8A75] uppercase tracking-wider">Congratulations! You won</p>
                <h4 className="font-serif text-[#D4AF37] text-base font-bold">{wonPrize.title}</h4>
              </div>

              {wonPrize.couponCode ? (
                <div className="space-y-2.5">
                  {wonPrize.claimed ? (
                    <>
                      <div className="bg-[#2C2522] border border-brand-gold/30 rounded-lg py-1.5 px-3 inline-block select-all">
                        <span className="font-mono text-sm font-bold tracking-widest text-[#D4AF37]">{wonPrize.couponCode}</span>
                      </div>
                      <p className="text-[10px] text-emerald-400 flex items-center justify-center gap-1">
                        <CheckCircle size={10} /> Saved to account! Auto-applies at checkout.
                      </p>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[10px] text-[#9E8A75] leading-relaxed">Sign in or register to claim and use your discount coupon.</p>
                      <button
                        onClick={openAuthModal}
                        className="w-full py-2 bg-[#D4AF37] hover:bg-[#C5A880] text-black font-bold uppercase text-[9px] tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <LogIn size={11} /> Log In & Claim
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[10px] text-[#9E8A75]">Better luck next time! Try again tomorrow.</p>
              )}

              {claimStatus === "claiming" && <p className="text-[10px] text-[#D4AF37] animate-pulse">Claiming reward...</p>}
              {claimStatus === "claimed" && (
                <p className="text-[10px] text-emerald-400">Coupon saved to your profile!</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#9E8A75]">
              Give it a spin! You have one free spin.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
