import { useState } from 'react';
import { 
  Activity, 
  BookOpen, 
  Calendar as CalendarIcon, 
  Target, 
  Users, 
  CheckCircle2, 
  Flame,
  ChevronRight
} from 'lucide-react';

// Simplified UI Components
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'default', className = '' }: any) => {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants: Record<string, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} h-14 px-6 py-2 w-full text-lg ${className}`}>
      {children}
    </button>
  );
};

const ProgressBar = ({ value }: { value: number }) => (
  <div className="relative w-full h-4 overflow-hidden rounded-full bg-secondary">
    <div 
      className="h-full bg-primary transition-all duration-500 ease-in-out" 
      style={{ width: `${value}%` }} 
    />
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dailyProgress, setDailyProgress] = useState(35); // Mock progress

  if (activeTab !== 'dashboard') {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center dark">
        <h2 className="text-2xl font-bold mb-4">Módulo: {activeTab}</h2>
        <Button onClick={() => setActiveTab('dashboard')} className="max-w-xs">Volver al Dashboard</Button>
      </div>
    );
  }

  const modules = [
    { id: 'fitness', title: 'Entrenamiento', icon: <Activity className="w-6 h-6" />, color: 'text-orange-500' },
    { id: 'learning', title: 'Estudios & Cursos', icon: <BookOpen className="w-6 h-6" />, color: 'text-blue-500' },
    { id: 'agenda', title: 'Agenda & Citas', icon: <CalendarIcon className="w-6 h-6" />, color: 'text-purple-500' },
    { id: 'relationships', title: 'Partners Control', icon: <Users className="w-6 h-6" />, color: 'text-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0 dark">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">KAIZEN</h1>
        </div>
        <div className="flex items-center gap-1 text-orange-500 font-bold">
          <Flame className="w-5 h-5 fill-current" />
          <span>Día 12</span>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Command Center - Daily Summary */}
        <section className="space-y-4">
          <div className="text-center py-6">
            <h2 className="text-3xl font-light mb-2">Buen día, CEO.</h2>
            <p className="text-muted-foreground text-sm max-w-[280px] mx-auto italic">
              "La verdad es lo que funciona. El resto es ruido."
            </p>
          </div>

          <Card className="p-6 bg-gradient-to-br from-card to-accent/20">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">PROGRESO DIARIO</p>
                <h3 className="text-4xl font-bold">{dailyProgress}%</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <ProgressBar value={dailyProgress} />
            <p className="text-xs text-muted-foreground mt-3">2 de 5 misiones completadas hoy.</p>
          </Card>
        </section>

        {/* Quick Actions / Modules */}
        <section className="space-y-3">
          <h3 className="font-semibold text-lg px-1">Módulos de Sistema</h3>
          <div className="grid grid-cols-1 gap-3">
            {modules.map((mod) => (
              <Card key={mod.id} className="hover:border-primary/50 transition-colors cursor-pointer active:scale-[0.98]">
                <div 
                  className="p-4 flex items-center justify-between"
                  onClick={() => setActiveTab(mod.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-accent/50 ${mod.color}`}>
                      {mod.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{mod.title}</h4>
                      <p className="text-xs text-muted-foreground">Toca para gestionar</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Log Button */}
        <section className="pt-4">
          <Button 
            className="w-full text-lg py-6 rounded-xl shadow-lg bg-primary hover:bg-primary/90"
            onClick={() => setDailyProgress(prev => Math.min(prev + 10, 100))}
          >
            Registrar Victoria Rápida
          </Button>
        </section>

      </main>
    </div>
  );
}
