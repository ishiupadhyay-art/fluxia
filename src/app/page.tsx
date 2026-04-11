'use client';
import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { subscriptions as initialSubscriptions, Subscription } from '@/lib/mockData';
import SplashScreen from '@/components/SplashScreen';
import AuthScreen from '@/components/AuthScreen';
import ProfilePage from '@/components/ProfilePage';
import RadarHome from '@/components/RadarHome';
import CategoryFeed from '@/components/CategoryFeed';
import PauseModal from '@/components/PauseModal';
import { supabase } from '@/lib/supabase';
import { Radar, LayoutGrid, User } from 'lucide-react';
import { useEffect } from 'react';

type Screen = 'home' | 'feed' | 'profile';

export default function Home() {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState<Screen>('home');
  const [subs, setSubs] = useState<Subscription[]>(initialSubscriptions);
  const [pauseTarget, setPauseTarget] = useState<Subscription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch real data from Supabase if user is logged in (and not a guest)
  useEffect(() => {
    if (user && user.id !== 'guest') {
      const fetchSubs = async () => {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id);

        if (!error && data && data.length > 0) {
          // Map DB columns to frontend Subscription interface
          const formattedSubs: Subscription[] = data.map(dbSub => ({
            id: dbSub.id,
            name: dbSub.name,
            icon: dbSub.icon,
            category: dbSub.category,
            monthlyPrice: Number(dbSub.monthly_price),
            nextBillingDate: dbSub.next_billing_date,
            daysUntilBilling: Math.max(0, Math.ceil((new Date(dbSub.next_billing_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))),
            status: dbSub.status,
            lastUsedDaysAgo: dbSub.last_used_days_ago,
            valueScore: dbSub.value_score
          }));
          setSubs(formattedSubs);
        }
      };

      fetchSubs();
    } else {
      // Revert to mock data for guest or logged out
      setSubs(initialSubscriptions);
    }
  }, [user]);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  const handlePause = (sub: Subscription) => {
    setPauseTarget(sub);
    setIsModalOpen(true);
  };

  const handleConfirmPause = async (subId: string) => {
    // Optimistic update locally
    setSubs(prev =>
      prev.map(s => (s.id === subId ? { ...s, status: 'paused' as const } : s))
    );

    // Persist to Supabase if not guest
    if (user && user.id !== 'guest') {
      await supabase
        .from('subscriptions')
        .update({ status: 'paused' })
        .eq('id', subId);
    }
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0B1120]">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-amber-400/60 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen />;
  }

  // Main app
  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto relative">
      {/* Status Bar Spacer */}
      <div className="h-12 flex-shrink-0" />

      {/* Header */}
      <header className="px-5 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
            Fluxia
          </h1>
          <p className="text-xs text-slate-500">Financial Clarity Engine</p>
        </div>
        <button
          onClick={() => setScreen('profile')}
          className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors overflow-hidden"
        >
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pb-24 overflow-y-auto">
        {screen === 'home' ? (
          <RadarHome
            subscriptions={subs}
            onViewAll={() => setScreen('feed')}
          />
        ) : screen === 'feed' ? (
          <CategoryFeed
            subscriptions={subs}
            onPause={handlePause}
            onBack={() => setScreen('home')}
          />
        ) : (
          <ProfilePage onBack={() => setScreen('home')} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-[#0B1120]/90 backdrop-blur-xl border-t border-white/5">
        <div className="flex items-center justify-around py-3 pb-6">
          <button
            onClick={() => setScreen('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${screen === 'home' ? 'text-amber-400' : 'text-slate-600'}`}
          >
            <Radar className="w-5 h-5" />
            <span className="text-[10px] font-medium">Radar</span>
          </button>
          <button
            onClick={() => setScreen('feed')}
            className={`flex flex-col items-center gap-1 transition-colors ${screen === 'feed' ? 'text-amber-400' : 'text-slate-600'}`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] font-medium">Subscriptions</span>
          </button>
          <button
            onClick={() => setScreen('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${screen === 'profile' ? 'text-amber-400' : 'text-slate-600'}`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav>

      {/* Pause Modal */}
      <PauseModal
        subscription={pauseTarget}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirmPause={handleConfirmPause}
      />
    </div>
  );
}
