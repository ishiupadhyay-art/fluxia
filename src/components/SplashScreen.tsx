'use client';
import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'logo' | 'tagline' | 'fade'>('logo');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('tagline'), 800);
    const t2 = setTimeout(() => setPhase('fade'), 2200);
    const t3 = setTimeout(() => onComplete(), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B1120] transition-opacity duration-600 ${
        phase === 'fade' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/8 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/3 left-1/3 w-60 h-60 bg-blue-500/5 rounded-full blur-[80px]" />

      {/* Logo */}
      <div
        className={`transition-all duration-700 ease-out ${
          phase === 'logo' ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{ transitionDelay: phase === 'logo' ? '0ms' : '0ms' }}
      >
        {/* Glowing orb behind logo */}
        <div className="relative">
          <div className="absolute inset-0 w-20 h-20 mx-auto bg-amber-400/20 rounded-full blur-2xl" />
          <div className="relative w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-300 to-amber-700 flex items-center justify-center shadow-2xl shadow-amber-500/30 border-4 border-amber-500/20">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" stroke="#B45309" strokeWidth="2" />
              <circle cx="20" cy="20" r="14" stroke="#B45309" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M20 10v20M10 20h20" stroke="#B45309" strokeWidth="1" />
              <circle cx="20" cy="20" r="6" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
            </svg>
          </div>
        </div>
      </div>

      {/* App Name */}
      <h1
        className={`text-4xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent transition-all duration-500 ${
          phase === 'logo' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        Fluxia
      </h1>

      {/* Tagline */}
      <p
        className={`mt-3 text-sm text-slate-500 transition-all duration-500 ${
          phase === 'tagline' || phase === 'fade' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        Financial Clarity Engine
      </p>

      {/* Loading indicator */}
      <div className="mt-12 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
