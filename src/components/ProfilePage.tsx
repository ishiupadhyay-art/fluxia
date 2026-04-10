'use client';
import { useAuth } from '@/lib/auth';
import { ArrowLeft, LogOut, Mail, Calendar, Shield, ChevronRight } from 'lucide-react';

interface ProfilePageProps {
  onBack: () => void;
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const { user, signOut } = useAuth();

  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || 'Fluxia User';
  const email = user?.email || '';
  const createdAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  const handleSignOut = async () => {
    await signOut();
  };

  const menuItems = [
    { icon: Shield, label: 'Connected Accounts', value: 'Google', action: () => {} },
    { icon: Mail, label: 'Notifications', value: 'On', action: () => {} },
    { icon: Calendar, label: 'Billing Cycle', value: 'Monthly', action: () => {} },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto">
      <div className="h-12 flex-shrink-0" />

      {/* Header */}
      <div className="px-5 pb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
        </button>
        <h1 className="text-lg font-bold text-white">Profile</h1>
      </div>

      <div className="px-5 flex flex-col gap-6">
        {/* Avatar & Info Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f1a2e] to-[#162040] p-6 border border-white/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />

          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-lg" />
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="relative w-16 h-16 rounded-full border-2 border-amber-400/30 object-cover"
                />
              ) : (
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center border-2 border-amber-400/30">
                  <span className="text-2xl font-bold text-black">
                    {fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#162040]" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white">{fullName}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{email}</p>
              {createdAt && (
                <p className="text-[10px] text-slate-600 mt-1">Member since {createdAt}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/[0.03] rounded-2xl p-4 text-center border border-white/5">
            <p className="text-2xl font-bold text-amber-400">12</p>
            <p className="text-[10px] text-slate-500 mt-1">Tracked</p>
          </div>
          <div className="bg-white/[0.03] rounded-2xl p-4 text-center border border-white/5">
            <p className="text-2xl font-bold text-emerald-400">3</p>
            <p className="text-[10px] text-slate-500 mt-1">Paused</p>
          </div>
          <div className="bg-white/[0.03] rounded-2xl p-4 text-center border border-white/5">
            <p className="text-2xl font-bold text-emerald-400">{'$'}247</p>
            <p className="text-[10px] text-slate-500 mt-1">Saved</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-1">
          <p className="text-xs text-slate-600 font-medium uppercase tracking-wider mb-2 px-1">Settings</p>
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-300">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">{item.value}</span>
                <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-slate-500 transition-colors" />
              </div>
            </button>
          ))}
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all duration-200 mt-2"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span className="text-sm font-medium text-rose-400">Sign Out</span>
        </button>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-700 pb-8">
          Fluxia v0.1.0 — Financial Clarity Engine
        </p>
      </div>
    </div>
  );
}
