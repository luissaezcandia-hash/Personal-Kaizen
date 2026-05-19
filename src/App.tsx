import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { FitnessModule } from '@/components/fitness/FitnessModule';
import { CRMModule } from '@/components/relationships/CRMModule';
import { LearningModule } from '@/components/learning/LearningModule';
import { AgendaModule } from '@/components/agenda/AgendaModule';
import { OKRModule } from '@/components/okr/OKRModule';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { supabase } from '@/lib/supabase';
import { seedDemoData } from '@/utils/seedDemoData';
import { Toaster } from 'sonner';

// UI & Layouts
import { MainLayout } from '@/layouts/MainLayout';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { MorningRitual } from '@/components/rituals/MorningRitual';
import { EveningRitual } from '@/components/rituals/EveningRitual';
import { analyzePerformance } from '@/lib/ai-agent';

const ONBOARDING_KEY = 'kaizen_onboarded_v1';

function AppContent() {
  const { session, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTour, setShowTour] = useState(false); 
  const [showStartRitual, setShowStartRitual] = useState(false); 
  const [showEndRitual, setShowEndRitual] = useState(false);
  const [reflection, setReflection] = useState('');
  const [isSeedingDemo, setIsSeedingDemo] = useState(false);

  const { 
    dailyProgress, streak, events, logDayStart, saveReflection, 
    dailyLogs, todayLog, objectives, addAISuggestions, isFetching 
  } = useStore();

  // Onboarding & Initial Ritual Logic
  useEffect(() => {
    // Wait until data is fetched so we know if todayLog exists
    if (session && !isFetching) {
      if (!localStorage.getItem(ONBOARDING_KEY)) {
        setShowTour(true);
      } else if (!todayLog) {
        setShowStartRitual(true);
      } else {
        setShowStartRitual(false);
      }
    }
  }, [session, todayLog, isFetching]);

  const handleTourComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowTour(false);
    setShowStartRitual(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleStartSelection = async (selection: string) => {
    await logDayStart(selection);
    setShowStartRitual(false);
  };

  const handleCloseDay = async () => {
    await saveReflection(reflection);
    setShowEndRitual(false);
    setReflection('');

    // Trigger AI Analysis
    const suggestions = await analyzePerformance(dailyLogs, objectives);
    addAISuggestions(suggestions);
  };

  const handleSeedDemo = async () => {
    const confirmed = window.confirm(
      '¿Reemplazar todos los datos con datos de demostración?\n\nEsto eliminará tu información actual y cargará datos de ejemplo.'
    );
    if (!confirmed) return;
    setIsSeedingDemo(true);
    await seedDemoData();
    // Re-fetch handled by AuthProvider observer normally, but we fetch here for seed
    const { fetchData } = useStore.getState();
    await fetchData();
    setIsSeedingDemo(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center dark bg-background text-foreground">Cargando...</div>;
  if (!session) return <AuthScreen onAuthSuccess={() => {}} />;

  // Preview de agenda
  const todayStr = new Date().toLocaleDateString('en-CA');
  const nowTime = new Date().toTimeString().slice(0, 5);
  const todayEvents = events
    .filter(e => e.eventDate === todayStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .filter(e => e.startTime >= nowTime)
    .slice(0, 3);

  const renderContent = () => {
    switch (activeTab) {
      case 'fitness':      return <FitnessModule />;
      case 'relationships': return <CRMModule />;
      case 'learning':     return <LearningModule />;
      case 'agenda':       return <AgendaModule />;
      case 'okr':          return <OKRModule />;
      default:
        return (
          <Dashboard
            dailyProgress={dailyProgress}
            streak={streak}
            todayEvents={todayEvents}
            setActiveTab={setActiveTab}
            setShowEndRitual={setShowEndRitual}
            handleSeedDemo={handleSeedDemo}
            isSeedingDemo={isSeedingDemo}
          />
        );
    }
  };

  return (
    <MainLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      streak={streak}
      onLogout={handleLogout}
      onShowTour={() => setShowTour(true)}
    >
      {showTour && <OnboardingTour onComplete={handleTourComplete} />}
      
      {renderContent()}

      {showStartRitual && !showTour && (
        <MorningRitual onSelect={handleStartSelection} />
      )}

      {showEndRitual && (
        <EveningRitual
          progress={dailyProgress}
          reflection={reflection}
          setReflection={setReflection}
          onClose={() => setShowEndRitual(false)}
          onComplete={handleCloseDay}
        />
      )}
    </MainLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster theme="dark" position="top-center" richColors />
      <AppContent />
    </AuthProvider>
  );
}
