import React from 'react';
import { ChevronLeft, Target, HelpCircle, Flame } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streak: number;
  onLogout: () => void;
  onShowTour: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  streak,
  onLogout,
  onShowTour,
}) => {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0 dark font-sans">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {activeTab !== 'dashboard' && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="p-1 -ml-1 rounded-md hover:bg-accent text-muted-foreground"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <div className="flex items-center gap-2" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
            <Target className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">KAIZEN</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onShowTour}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Tour de la app"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button onClick={onLogout} className="text-xs text-muted-foreground hover:text-destructive font-bold uppercase tracking-wider">
            Salir
          </button>
          <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-500/10 px-2 py-1 rounded-md">
            <Flame className="w-4 h-4 fill-current" />
            <span className="text-sm">Día {streak}</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        {children}
      </main>
    </div>
  );
};
