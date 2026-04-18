import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { subscriptions as mockSubscriptions } from '@/lib/mockData';
import { ArrowLeft, LogOut, Mail, Calendar, Shield, ChevronRight, CheckCircle2, Loader2, Globe } from 'lucide-react';
import { useCurrency } from '@/lib/currencyContext';

interface ProfilePageProps {
  onBack: () => void;
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const { user, signOut } = useAuth();
  const { currency, setCurrency } = useCurrency();

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
      // alert('Failed to import data. Check your Supabase tables.');
    } finally {
      setIsImporting(false);
    }
  };

  const isGuest = user?.id === 'guest';

  if (isGuest) {
    return (
      <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-[#0B1120] justify-center items-center px-6 text-center">
        <div className="w-20 h-20 mb-6 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
          <Shield className="w-10 h-10 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Create an Account</h1>
        <p className="text-slate-400 text-sm mb-8">
          Sign in to access your profile, sync data across devices, and unlock full financial clarity.
        </p>
        <button
          onClick={handleSignOut}
          className="w-full max-w-xs py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-300 transition-all duration-300 shadow-lg shadow-amber-500/20"
        >
          Sign In Now
        </button>
        <button
          onClick={onBack}
          className="mt-4 text-slate-500 text-sm hover:text-slate-300 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const menuItems = [
    { icon: Shield, label: 'Connected Accounts', value: 'Google', action: () => {}, isSelect: false },
    { icon: Mail, label: 'Notifications', value: 'On', action: () => {}, isSelect: false },
    { icon: Calendar, label: 'Billing Cycle', value: 'Monthly', action: () => {}, isSelect: false },
    { 
      icon: Globe, 
      label: 'Currency', 
      value: currency, 
      action: () => {}, 
      isSelect: true,
      options: ['USD', 'AUD', 'SGD', 'MYR', 'GBP', 'EUR', 'INR']
    },
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
            <div
              key={item.label}
              onClick={item.isSelect ? undefined : item.action}
              className={`flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 transition-all duration-200 group ${!item.isSelect && 'cursor-pointer hover:bg-white/[0.06]'}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-300">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.isSelect ? (
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="bg-[#0B1120] text-xs text-white border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:border-amber-500/50 appearance-none text-right pr-6"
                    style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right .5rem top 50%', backgroundSize: '.65rem auto' }}
                  >
                    {item.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <>
                    <span className="text-xs text-slate-600">{item.value}</span>
                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-slate-500 transition-colors" />
                  </>
                )}
              </div>
            </div>
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
      </div>
    </div>
  );
}
