"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useAuthModalStore } from "@/store/authModalStore";
import { AlertCircle, ArrowLeft, Loader2, Sparkles, LogIn, CheckCircle, Ticket } from "lucide-react";

interface SanitizedPrize {
  id: string;
  index: number;
  title: string;
  displayOrder: number;
}

// Module-level constants — generated once at module load, not during render
const CONFETTI_COLORS = ["#dfb876", "#fcfaf7", "#C5A880", "#D4AF37", "#8B2332"];
const CONFETTI_PARTICLES = Array.from({ length: 70 }).map((_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 2,
  duration: 2.5 + Math.random() * 3,
  size: 6 + Math.random() * 10,
  color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
}));

export default function SpinWinContent() {
  const { data: session, status } = useSession();
  const { openAuthModal } = useAuthModalStore();
  
  // Wheel states
  const [spinWinEnabled, setSpinWinEnabled] = useState<boolean | null>(null);
  const [prizes, setPrizes] = useState<SanitizedPrize[]>([]);
  const [canSpin, setCanSpin] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Interaction states
  const [spinning, setSpinning] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [wonPrize, setWonPrize] = useState<{
    index: number;
    title: string;
    couponCode: string | null;
    claimed: boolean;
  } | null>(null);
  
  const [pendingAttemptId, setPendingAttemptId] = useState<string | null>(null);
  const [claimStatus, setClaimStatus] = useState<"idle" | "claiming" | "claimed" | "error">("idle");
  const [claimError, setClaimError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // 1. Fetch Wheel state on mount
  const fetchState = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/spin-win/state");
      const data = await res.json();
      
      if (data.success) {
        setSpinWinEnabled(data.spinWinEnabled);
        setPrizes(data.prizes || []);
        setCanSpin(data.canSpin);
        setTimeLeft(data.timeLeft || 0);
      } else {
        setSpinWinEnabled(false);
      }
    } catch (err) {
      console.error("Error fetching spin state:", err);
      setSpinWinEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    
    // Read pending attempt from localStorage
    const stored = localStorage.getItem("pending_spin_attempt_id");
    if (stored) {
      setPendingAttemptId(stored);
    }
  }, []);

  // 2. Cooling down timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanSpin(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

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
      console.error("Error claiming reward:", err);
      setClaimStatus("error");
      setClaimError("Network error claiming reward");
    }
  };

  // 3. Handle claiming of guest spins when session becomes authenticated
  useEffect(() => {
    if (status === "authenticated" && pendingAttemptId && claimStatus === "idle") {
      claimReward(pendingAttemptId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pendingAttemptId]);

  // 4. Trigger spin action
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

      // Spin rotation math
      const totalSlices = prizes.length;
      const sliceAngle = 360 / totalSlices;
      const centerAngle = (index * sliceAngle) + (sliceAngle / 2);
      
      // Pointer is at the top (270 degrees in standard circle coordinates)
      // To align index 'index' with the top, rotate wheel clockwise by:
      const targetDegrees = (360 * 8) + 270 - centerAngle;
      
      setRotation(targetDegrees);

      // Wait for animation to finish (5 seconds)
      setTimeout(() => {
        setSpinning(false);
        setCanSpin(false);
        setTimeLeft(24 * 60 * 60); // 24 hours
        
        setWonPrize({
          index,
          title,
          couponCode,
          claimed,
        });
        
        if (title.toLowerCase().includes("try again") || title.toLowerCase().includes("better luck")) {
          // No confetti for losing
        } else {
          setShowConfetti(true);
        }

        // If guest (unclaimed), store attempt ID to claim after login
        if (!claimed && attemptId) {
          localStorage.setItem("pending_spin_attempt_id", attemptId);
          setPendingAttemptId(attemptId);
        }
      }, 5000);

    } catch (err) {
      console.error("Error spinning:", err);
      alert("Something went wrong. Please try again.");
      setSpinning(false);
    }
  };

  // Format time left (HH:MM:SS)
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // SVG drawing logic
  const drawWheelSlices = () => {
    const n = prizes.length;
    if (n === 0) return null;

    const sliceAngle = 360 / n;
    
    return prizes.map((prize, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = (i + 1) * sliceAngle;
      
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      
      // Arc coordinates
      const cx = 250, cy = 250, r = 230;
      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      
      // Alternating luxury colors
      let sliceColor = "#1E1B18"; // Default Charcoal
      let textColor = "#D4AF37"; // Metallic Gold
      
      if (prize.title.toLowerCase().includes("try again") || prize.title.toLowerCase().includes("better luck")) {
        sliceColor = "#2C2621"; // Lighter charcoal for loss slots
        textColor = "#9E8A75"; // Muted bronze
      } else if (i % 2 === 1) {
        sliceColor = "#C5A880"; // Luxury Champagne / Light Gold
        textColor = "#1E1B18"; // Dark text
      } else if (i % 3 === 2) {
        sliceColor = "#FAF6F0"; // Premium Cream
        textColor = "#8B2332"; // Elegant maroon highlight
      }

      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
      const midAngleDegrees = startAngle + sliceAngle / 2;

      return (
        <g key={prize.id}>
          {/* Slice segment */}
          <path 
            d={pathData} 
            fill={sliceColor} 
            stroke="#D4AF37" 
            strokeWidth="0.75" 
          />
          {/* Rotated text along sector ray */}
          <text
            x={cx + 110}
            y={cy + 4}
            textAnchor="end"
            transform={`rotate(${midAngleDegrees}, ${cx}, ${cy})`}
            fill={textColor}
            className="font-serif text-[11px] font-bold tracking-wider select-none"
          >
            {prize.title}
          </text>
        </g>
      );
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#12100e] text-white">
        <Loader2 className="w-10 h-10 text-brand-gold animate-spin mb-4" />
        <p className="font-serif tracking-widest text-sm uppercase text-brand-gold">Invoking Fortune...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12100e] text-white py-12 px-4 relative overflow-hidden flex flex-col items-center">
      {/* Dynamic CSS styles for luxury animations */}
      <style>{`
        @keyframes float-down {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-float-down {
          animation: float-down linear infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 12px rgba(212, 175, 55, 0.4), inset 0 0 8px rgba(212, 175, 55, 0.2); }
          50% { box-shadow: 0 0 28px rgba(212, 175, 55, 0.9), inset 0 0 16px rgba(212, 175, 55, 0.4); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        @keyframes border-blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-border-blink {
          animation: border-blink 1.2s infinite;
        }
      `}</style>

      {/* Floating Confetti Particle Emitter */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
          {CONFETTI_PARTICLES.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-sm animate-float-down"
              style={{
                left: `${particle.left}%`,
                top: `-20px`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      )}

      {/* Back Button */}
      <div className="w-full max-w-5xl mb-8 flex justify-start z-10">
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#9E8A75] hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Store</span>
        </Link>
      </div>

      {/* Page Content */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Column: Descriptions and Status Panel */}
        <div className="lg:col-span-5 space-y-8 text-center lg:text-left flex flex-col justify-center">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-brand-gold/10 border border-brand-gold/30 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] w-fit mx-auto lg:mx-0">
              <Sparkles size={10} className="animate-spin" />
              <span>Exclusive Member Benefit</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-white leading-tight">
              The Zoniraz <br />
              <span className="text-[#D4AF37] font-normal italic">Fortune Wheel</span>
            </h1>
            <p className="text-sm text-[#9E8A75] leading-relaxed max-w-md mx-auto lg:mx-0">
              Spin our signature wheel of fortune once every 24 hours to unlock premium rewards, complimentary shipping, and exclusive luxury vouchers to be applied at checkout.
            </p>
          </div>

          <div className="h-px bg-brand-gold/15 w-full"></div>

          {/* User Status / Notification Card */}
          <div className="bg-[#1C1816] border border-brand-gold/20 rounded-3xl p-6 shadow-premium space-y-4">
            {!spinWinEnabled ? (
              <div className="flex items-start space-x-3 text-left">
                <AlertCircle className="text-brand-gold shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="font-serif text-white font-bold text-sm">Wheel Closed</h4>
                  <p className="text-xs text-[#9E8A75] mt-1">The Lucky Wheel is currently resting. Check back soon for more rewards!</p>
                </div>
              </div>
            ) : wonPrize ? (
              // Results Display
              <div className="text-center space-y-4 animate-in fade-in duration-700">
                <div className="inline-flex p-3 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
                  <Ticket size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#9E8A75] uppercase tracking-widest">Congratulations! You won</p>
                  <h3 className="text-2xl font-serif text-[#D4AF37] font-bold">{wonPrize.title}</h3>
                </div>

                {wonPrize.couponCode ? (
                  <div className="space-y-3">
                    {/* Authenticated user gets code directly */}
                    {wonPrize.claimed ? (
                      <>
                        <div className="bg-[#2C2522] border border-brand-gold/30 rounded-xl p-3 select-all cursor-pointer inline-block">
                          <span className="font-mono text-lg font-bold tracking-widest text-[#D4AF37]">
                            {wonPrize.couponCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-400 flex items-center justify-center gap-1">
                          <CheckCircle size={12} /> Saved in your account! Applied at checkout.
                        </p>
                      </>
                    ) : (
                      // Guest user is prompted to claim
                      <div className="space-y-3">
                        <p className="text-xs text-[#9E8A75] leading-relaxed">
                          To claim and activate this coupon code, please log in or create a Zoniraz account now.
                        </p>
                        <button
                          onClick={openAuthModal}
                          className="w-full py-3 bg-[#D4AF37] hover:bg-[#C5A880] text-black font-black uppercase text-[10px] tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-soft"
                        >
                          <LogIn size={14} /> Log In & Claim Reward
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#9E8A75]">Better luck next spin! You can try again in 24 hours.</p>
                )}

                {/* Claim Loading / Success States */}
                {claimStatus === "claiming" && (
                  <p className="text-xs text-[#D4AF37] animate-pulse">Claiming your reward, please hold...</p>
                )}
                {claimStatus === "claimed" && wonPrize.couponCode && (
                  <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-3 text-xs text-emerald-400">
                    Reward claimed successfully! Coupon code added to your rewards ledger.
                  </div>
                )}
                {claimStatus === "error" && (
                  <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-3 text-xs text-red-400">
                    {claimError || "An error occurred claiming your reward."}
                  </div>
                )}
              </div>
            ) : !canSpin ? (
              // Cooling Down
              <div className="text-center py-2 space-y-3">
                <p className="text-xs text-[#9E8A75] uppercase tracking-widest">Next Spin Available In</p>
                <div className="font-mono text-3xl font-bold tracking-widest text-[#D4AF37]">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-[10px] text-[#9E8A75] italic">Spins are limited to once every 24 hours per visitor.</p>
              </div>
            ) : (
              // Ready to Spin
              <div className="text-center py-2 space-y-3">
                <p className="text-xs text-[#9E8A75] uppercase tracking-widest">Wheel is Ready!</p>
                <p className="text-sm font-serif text-white">Click SPIN in the center of the wheel to test your fortune.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Wheel Component */}
        <div className="lg:col-span-7 flex justify-center items-center py-8 relative">
          
          {/* Luxury Wheel Container */}
          <div className="relative w-85 h-85 sm:w-120 sm:h-120 rounded-full flex items-center justify-center bg-[#1A1614] border-8 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.25)] select-none">
            
            {/* Blinking outer bulb indicator lights */}
            <div className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/50 pointer-events-none animate-border-blink"></div>

            {/* Pointer Pin at top pointing down */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-30">
              <div className="w-0 h-0 border-l-14 border-l-transparent border-r-14 border-r-transparent border-t-28 border-t-[#D4AF37] filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"></div>
              {/* Little red light on pointer */}
              <div className="w-2 h-2 rounded-full bg-[#8B2332] absolute top-1 left-1/2 transform -translate-x-1/2 border border-white/30 animate-pulse"></div>
            </div>

            {/* Rotating Wheel body */}
            <div 
              className="w-full h-full rounded-full transition-transform"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? "transform 5000ms cubic-bezier(0.1, 0.8, 0.1, 1)" : "none"
              }}
            >
              <svg 
                viewBox="0 0 500 500" 
                className="w-full h-full transform -rotate-90" // Rotate SVG so math starts from bottom (actually left) or align
              >
                {/* Wheel segments */}
                {drawWheelSlices()}
                
                {/* Shiny Inner Rim */}
                <circle cx="250" cy="250" r="230" fill="none" stroke="#D4AF37" strokeWidth="3" />
                <circle cx="250" cy="250" r="238" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
              </svg>
            </div>

            {/* Center Hub & Spin Button */}
            <div className="absolute z-20 w-20 h-20 sm:w-27.5 sm:h-27.5 rounded-full bg-[#1E1B18] border-4 border-[#D4AF37] flex items-center justify-center shadow-2xl">
              <button
                disabled={spinning || !canSpin || !spinWinEnabled}
                onClick={handleSpin}
                className={`w-full h-full rounded-full flex flex-col items-center justify-center bg-linear-to-br from-[#dfb876] to-[#b88c3a] text-black font-black uppercase text-[11px] sm:text-xs tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 ${
                  canSpin && !spinning && spinWinEnabled 
                    ? "cursor-pointer animate-pulse-glow opacity-100" 
                    : "opacity-75 cursor-not-allowed text-[#4A3E39]"
                }`}
              >
                {spinning ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="leading-none mb-0.5">SPIN</span>
                    <span className="text-[7px] font-bold tracking-normal opacity-70">NOW</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
