'use client';
import { useState, useEffect } from 'react';
import { Subscription } from '@/lib/mockData';
import { X, PartyPopper, DollarSign, Clock } from 'lucide-react';

interface PauseModalProps {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPause: (subId: string) => void;
}

export default function PauseModal({ subscription, isOpen, onClose, onConfirmPause }: PauseModalProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsPaused(false);
      setShowConfetti(false);
    }
  }, [isOpen]);

  if (!isOpen || !subscription) return null;

  const handlePause = () => {
    setIsPaused(true);
    setShowConfetti(true);
    onConfirmPause(subscription.id);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const annualSavings = subscription.monthlyPrice * 12;

  const confettiEmojis = ['✨', '🎉', '💰', '⭐', '🌟'];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Sheet */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-500 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="mx-auto max-w-lg bg-gradient-to-b from-[#141c2e] to-[#0B1120] rounded-t-3xl border-t border-x border-white/10 p-6 pb-10">
          {/* Handle */}
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>

          {!isPaused ? (
            <>
              {/* Pre-Pause State */}
              <div className="text-center mb-6">
                <span className="text-5xl mb-4 block">{subscription.icon}</span>
                <h2 className="text-xl font-bold text-white mb-1">Pause {subscription.name}?</h2>
                <p className="text-sm text-slate-400">
                  You haven&apos;t used this in <span className="text-amber-400 font-medium">{subscription.lastUsedDaysAgo} days</span>
                </p>
              </div>

              {/* Savings Preview */}
              <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <p className="text-sm font-medium text-slate-300">If you pause today, you save:</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-500/10 rounded-xl p-3 text-center border border-emerald-500/20">
                    <p className="text-2xl font-bold text-emerald-400">${subscription.monthlyPrice.toFixed(2)}</p>
                    <p className="text-xs text-slate-500">this month</p>
                  </div>
                  <div className="bg-emerald-500/10 rounded-xl p-3 text-center border border-emerald-500/20">
                    <p className="text-2xl font-bold text-emerald-400">${annualSavings.toFixed(0)}</p>
                    <p className="text-xs text-slate-500">per year</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handlePause}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-300 transition-all duration-300 active:scale-[0.98] shadow-lg shadow-amber-500/20"
                >
                  Pause Subscription
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-2xl bg-white/5 text-slate-400 text-sm hover:bg-white/10 transition-colors"
                >
                  Keep it for now
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Post-Pause Celebration */}
              <div className="text-center py-4">
                {showConfetti && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute animate-bounce"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 50}%`,
                          animationDelay: `${Math.random() * 0.5}s`,
                          animationDuration: `${1 + Math.random()}s`,
                          fontSize: `${12 + Math.random() * 14}px`,
                          opacity: 0.8,
                        }}
                      >
                        {confettiEmojis[Math.floor(Math.random() * 5)]}
                      </div>
                    ))}
                  </div>
                )}

                <PartyPopper className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Nice Move!</h2>
                <p className="text-sm text-slate-400 mb-1">
                  You just saved <span className="text-emerald-400 font-bold">${subscription.monthlyPrice.toFixed(2)}/mo</span>
                </p>
                <p className="text-xs text-slate-600 mb-6">
                  That&apos;s ${annualSavings.toFixed(0)} back in your pocket each year
                </p>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-6">
                  <Clock className="w-3.5 h-3.5" />
                  <span>You can unpause anytime</span>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl bg-white/5 text-white font-medium text-sm hover:bg-white/10 transition-colors border border-white/10"
                >
                  Done
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
