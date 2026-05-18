'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sparkles, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('admin-credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/admin',
      });

      if (result?.error) {
        setError('Invalid admin credentials. Access denied.');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#12100e] flex items-center justify-center p-6">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-gold/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-gold/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Brand Identity */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-gold to-[#B4925A] flex items-center justify-center shadow-premium mx-auto mb-6">
            <Sparkles className="text-[#12100e]" size={32} />
          </div>
          <h1 className="text-4xl font-serif text-white tracking-[0.2em] uppercase italic mb-2">Zoniraz</h1>
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.5em] font-black">Management Gateway</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[40px] shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-[12px] text-center animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-gold ml-2">Secure Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-brand-gold transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@zoniraz.com"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-gold ml-2">Master Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-brand-gold transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:ring-1 focus:ring-brand-gold/50 focus:border-brand-gold/50 transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={cn(
                "w-full bg-brand-gold hover:bg-[#B4925A] text-[#12100e] py-4 rounded-2xl font-bold text-[12px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center space-x-3 shadow-premium active:scale-[0.98]",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Initialize Portal</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-brand-text/20 text-[10px] uppercase tracking-widest font-medium">
          Protected by Zoniraz Security Architecture
        </p>
      </div>
    </div>
  );
}
