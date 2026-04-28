import { useState, useEffect } from 'react';
import {
  Activity,
  BookOpen,
  Target,
  Users,
  CheckCircle2,
  Flame,
  ChevronRight,
  ChevronLeft,
  Sunrise,
  Sunset,
  CalendarDays,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { FitnessModule } from '@/components/fitness/FitnessModule';
import { KanbanModule } from '@/components/relationships/KanbanModule';
import { LearningModule } from '@/components/learning/LearningModule';
import { AgendaModule } from '@/components/agenda/AgendaModule';
import { OKRModule } from '@/components/okr/OKRModule';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { supabase } from '@/lib/supabase';

const Card = ({ children, className = '', onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div onClick={onClick} className={`bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden ${className}`}>
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

const TYPE_COLORS: Record<string, string> = {
  work: 'bg-blue-500/20 text-blue-400',
  social: 'bg-rose-500/20 text-rose-400',
  health: 'bg-orange-500/20 text-orange-400',
  ritual: 'bg-purple-500/20 text-purple-400',
};

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { dailyProgress, fetchData, streak, events, logDayStart, saveReflection } = useStore();

  const [showStartRitual, setShowStartRitual] = useState(true);
  const [showEndRitual, setShowEndRitual] = useState(false);
  const [reflection, setReflection] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session) fetchData();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData();
    });

    return () => subscription.unsubscribe();
  }, []);

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
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!session) return <AuthScreen onAuthSuccess={() => setAuthLoading(false)} />;

  // Agenda preview: eventos de hoy ordenados
  const todayStr = new Date().toLocaleDateString('en-CA');
  const todayEvents = events
    .filter(e => e.eventDate === todayStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 3);

  const renderContent = () => {
    switch (activeTab) {
      case 'fitness':
        return <FitnessModule />;
      case 'relationships':
        return <KanbanModule />;
      case 'learning':
        return <LearningModule />;
      case 'agenda':
        return <AgendaModule />;
      case 'okr':
        return <OKRModule />;
      default:
        return (
          <>
            {/* Command Center */}
            <section className="space-y-4 animate-in fade-in duration-500">
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
                <p className="text-xs text-muted-foreground mt-3">
                  {streak > 0 ? `Racha activa: ${streak} día${streak !== 1 ? 's' : ''} consecutivo${streak !== 1 ? 's' : ''}.` : 'Completa el día para iniciar tu racha.'}
                </p>
              </Card>
            </section>

            {/* Agenda Preview */}
            {todayEvents.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-2 px-1 mt-6">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" /> Hoy
                  </h3>
                  <button onClick={() => setActiveTab('agenda')} className="text-xs text-primary font-bold">
                    Ver todo →
                  </button>
                </div>
                <div className="space-y-2">
                  {todayEvents.map(event => (
                    <div key={event.id} className={`flex items-center gap-3 p-3 rounded-xl ${TYPE_COLORS[event.type]} border border-current/10`}>
                      <div className="text-xs font-bold w-10 shrink-0 text-center">
                        {event.startTime.slice(0, 5)}
                      </div>
                      <div className="w-px h-5 bg-current opacity-30" />
                      <span className="text-sm font-semibold truncate">{event.title}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Módulos */}
            <section className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h3 className="font-semibold text-lg px-1 mt-6">Módulos de Sistema</h3>
              <div className="grid grid-cols-1 gap-3">
                <Card className="hover:border-primary/50 transition-colors cursor-pointer active:scale-[0.98]" onClick={() => setActiveTab('fitness')}>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-accent/50 text-orange-500">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Entrenamiento</h4>
                        <p className="text-xs text-muted-foreground">Toca para gestionar</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>

                <Card className="hover:border-primary/50 transition-colors cursor-pointer active:scale-[0.98]" onClick={() => setActiveTab('learning')}>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-accent/50 text-blue-500">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Estudios & Cursos</h4>
                        <p className="text-xs text-muted-foreground">Toca para gestionar</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>

                <Card className="hover:border-primary/50 transition-colors cursor-pointer active:scale-[0.98]" onClick={() => setActiveTab('relationships')}>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-accent/50 text-rose-500">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Partners Control</h4>
                        <p className="text-xs text-muted-foreground">Toca para gestionar</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>

                <Card className="hover:border-primary/50 transition-colors cursor-pointer active:scale-[0.98]" onClick={() => setActiveTab('agenda')}>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-accent/50 text-purple-500">
                        <CalendarDays className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Agenda Pro</h4>
                        <p className="text-xs text-muted-foreground">Toca para gestionar</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>

                <Card className="hover:border-primary/50 transition-colors cursor-pointer active:scale-[0.98]" onClick={() => setActiveTab('okr')}>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-accent/50 text-blue-500">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">OKR / Metas</h4>
                        <p className="text-xs text-muted-foreground">Toca para gestionar</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              </div>
            </section>

            {/* Cerrar Día */}
            <section className="pt-8 pb-4">
              <Button
                variant="outline"
                className="w-full py-6 rounded-xl border-dashed hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
                onClick={() => setShowEndRitual(true)}
              >
                <Sunset className="w-5 h-5 mr-2" /> Descompresión Evaluativa (Cerrar Día)
              </Button>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0 dark font-sans">
      {/* Top Bar */}
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
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">KAIZEN</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="text-xs text-muted-foreground hover:text-destructive font-bold uppercase tracking-wider">
            Salir
          </button>
          <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-500/10 px-2 py-1 rounded-md">
            <Flame className="w-4 h-4 fill-current" />
            <span className="text-sm">Día {streak}</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        {renderContent()}
      </main>

      {/* RITUAL DE ARRANQUE */}
      {showStartRitual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-md">
          <div className="max-w-sm w-full space-y-6 text-center animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto py-4">
            <Sunrise className="w-16 h-16 text-yellow-500 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Filtro de Arranque</h2>
              <p className="text-muted-foreground">Para desbloquear el sistema, define tu enfoque.</p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="text-left mb-2">
                <label className="text-sm font-bold text-muted-foreground">Selecciona tu objetivo principal:</label>
              </div>
              <Button
                onClick={() => handleStartSelection('Plus Gráfica')}
                className="w-full py-8 rounded-xl text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              >
                Avance en Plus Gráfica
              </Button>
              <Button
                onClick={() => handleStartSelection('Tesis')}
                className="w-full py-8 rounded-xl text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              >
                Avance en Tesis
              </Button>
              <Button
                onClick={() => handleStartSelection('Otro')}
                variant="outline"
                className="w-full py-6 rounded-xl text-sm font-bold border-dashed"
              >
                Otro enfoque crítico
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* RITUAL DE CIERRE */}
      {showEndRitual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-md">
          <div className="max-w-sm w-full space-y-6 text-center animate-in slide-in-from-bottom-10 duration-500 max-h-[90vh] overflow-y-auto py-4">
            <Sunset className="w-16 h-16 text-indigo-500 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Descompresión Evaluativa</h2>
              <p className="text-muted-foreground">La teoría sin aplicación es ruido.</p>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl text-left space-y-4">
              <div>
                <p className="text-sm font-bold mb-1">Tu progreso de hoy:</p>
                <h3 className="text-3xl font-black text-primary">{dailyProgress}%</h3>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <label className="text-sm font-bold">¿Qué se refactoriza para mañana?</label>
                <textarea
                  value={reflection}
                  onChange={e => setReflection(e.target.value)}
                  placeholder="Escribe tus lecciones del día..."
                  className="w-full bg-secondary border border-border p-3 rounded-lg outline-none min-h-[100px] resize-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowEndRitual(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleCloseDay} className="flex-1">
                Completar Día
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
