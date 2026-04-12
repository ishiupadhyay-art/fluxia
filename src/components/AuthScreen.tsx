'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Mail } from 'lucide-react';

type AuthMode = 'welcome' | 'login' | 'signup';

export default function AuthScreen() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInAsGuest } = useAuth();
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await signInWithGoogle();
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to authenticate with Google');
      console.error('Auth error:', error);
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
        // Supabase often requires email confirmation. If error doesn't throw, but user is null...
        alert('Signup successful! Check your email to confirm, or try logging in if auto-confirm is enabled.');
      }
    } catch (error: any) {
      setErrorMsg(error.message || `Failed to ${mode}`);
      console.error('Email Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (mode === 'welcome') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0B1120] px-6">
        {/* Background effects */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-amber-500/6 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-blue-500/5 rounded-full blur-[80px]" />

        {/* Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 w-24 h-24 mx-auto bg-amber-400/20 rounded-full blur-2xl" />
          <div className="relative w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4C20 4 8 12 8 22C8 28.627 13.373 34 20 34C26.627 34 32 28.627 32 22C32 12 20 4 20 4Z" fill="rgba(0,0,0,0.3)" />
              <path d="M20 8C20 8 12 14 12 22C12 26.418 15.582 30 20 30C24.418 30 28 26.418 28 22C28 14 20 8 20 8Z" fill="rgba(255,255,255,0.9)" />
              <circle cx="20" cy="21" r="4" fill="rgba(245,158,11,0.8)" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent mb-2">
          Fluxia
        </h1>
        <p className="text-slate-500 text-sm mb-2">Financial Clarity Engine</p>
        <p className="text-slate-600 text-xs text-center max-w-xs mb-12 leading-relaxed">
          See what&apos;s coming. Pause what&apos;s draining. Keep what matters.
        </p>

        {/* Feature highlights */}
        <div className="w-full max-w-sm flex flex-col gap-3 mb-10">
          {[
            { emoji: '📡', text: '30-day subscription radar' },
            { emoji: '👻', text: 'Ghost debt detection' },
            { emoji: '⏸️', text: 'One-tap pause & save' },
          ].map((feature) => (
            <div key={feature.text} className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-3 border border-white/5">
              <span className="text-lg">{feature.emoji}</span>
              <span className="text-sm text-slate-400">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          <button
            onClick={() => setMode('signup')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-300 transition-all duration-300 active:scale-[0.98] shadow-lg shadow-amber-500/20"
          >
            Get Started
          </button>
          <button
            onClick={() => setMode('login')}
            className="w-full py-3.5 rounded-2xl bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/10 transition-colors border border-white/5"
          >
            I already have an account
          </button>
          <button
            onClick={signInAsGuest}
            className="w-full py-3.5 rounded-2xl bg-transparent text-slate-400 text-sm font-medium hover:text-slate-300 transition-colors"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    );
  }

  // Login / Signup screen
  const isLogin = mode === 'login';

  return (
    <div className="fixed inset-0 flex flex-col bg-[#0B1120] px-6">
      {/* Background effects */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-amber-500/6 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 left-1/4 w-60 h-60 bg-blue-500/5 rounded-full blur-[80px]" />

      {/* Back button */}
      <div className="pt-14 pb-6 relative z-10">
        <button
          onClick={() => setMode('welcome')}
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full relative z-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-slate-500">
            {isLogin
              ? 'Sign in to continue managing your subscriptions'
              : 'Start your journey to financial clarity'}
          </p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-black font-medium text-sm hover:bg-gray-100 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-4 shadow-lg"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          {isLoading ? 'Connecting...' : `Continue with Google`}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-slate-600">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          onClick={signInAsGuest}
          className="w-full py-3.5 rounded-xl bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/10 transition-colors border border-white/5 mb-4"
        >
          Continue as Guest
        </button>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-xl mb-4 text-center">
            {errorMsg}
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full py-3.5 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 placeholder:text-slate-600 outline-none focus:border-amber-400/50 transition-colors"
            />
          </div>
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full py-3.5 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 placeholder:text-slate-600 outline-none focus:border-amber-400/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-amber-500/10 text-amber-400 text-sm font-medium border border-amber-500/20 hover:bg-amber-500/20 transition-colors mt-2"
          >
            {isLoading ? 'Processing...' : isLogin ? 'Log In with Email' : 'Sign Up with Email'}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-sm text-slate-600 mt-8">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(isLogin ? 'signup' : 'login')}
            className="text-amber-400 font-medium hover:text-amber-300 transition-colors"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>

      {/* Terms */}
      <div className="pb-8 pt-4 relative z-10">
        <p className="text-[10px] text-slate-700 text-center leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
