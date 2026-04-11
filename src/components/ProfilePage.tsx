import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { subscriptions as mockSubscriptions } from '@/lib/mockData';
import { ArrowLeft, LogOut, Mail, Calendar, Shield, ChevronRight, Database, CheckCircle2, Loader2 } from 'lucide-react';

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

  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleImportDemoData = async () => {
    if (!user || isImporting) return;
    
    setIsImporting(true);
    try {
      // Prepare data for Supabase
      const dataToInsert = mockSubscriptions.map(sub => ({
        user_id: user.id,
        name: sub.name,
        icon: sub.icon,
        category: sub.category,
        monthly_price: sub.monthlyPrice,
        next_billing_date: sub.nextBillingDate,
        status: sub.status,
        last_used_days_ago: sub.lastUsedDaysAgo,
        value_score: sub.valueScore
      }));

      const { error } = await supabase
        .from('subscriptions')
        .insert(dataToInsert);

      if (error) throw error;
      
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import data. Check your Supabase tables.');
    } finally {
      setIsImporting(false);
    }
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

        {/* System Status */}
        <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5 flex flex-col gap-4">
          <div>
            <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wider mb-2 px-1">System Health</p>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`} />
                <span className="text-xs text-slate-400">Supabase Connection</span>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {isSupabaseConfigured ? 'CONNECTED' : 'NOT CONFIGURED'}
              </span>
            </div>
          </div>

          {isSupabaseConfigured && user && user.id !== 'guest' && (
            <div className="pt-2 border-t border-white/5">
              <button
                onClick={handleImportDemoData}
                disabled={isImporting || importSuccess}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${
                  importSuccess 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-amber-400/10 text-amber-400 border border-amber-400/20 hover:bg-amber-400/20'
                }`}
              >
                {isImporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : importSuccess ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Database className="w-4 h-4" />
                )}
                <span className="text-xs font-semibold">
                  {isImporting ? 'Importing...' : importSuccess ? 'Demo Data Imported!' : 'Import Demo Data to Supabase'}
                </span>
              </button>
              {!importSuccess && (
                <p className="text-[10px] text-slate-600 text-center mt-2 px-2 italic">
                  One-tap copy of the 12 mock subscriptions into your database.
                </p>
              )}
            </div>
          )}
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
