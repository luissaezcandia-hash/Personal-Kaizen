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
  HelpCircle,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { FitnessModule } from '@/components/fitness/FitnessModule';
import { KanbanModule } from '@/components/relationships/KanbanModule';
import { LearningModule } from '@/components/learning/LearningModule';
import { AgendaModule } from '@/components/agenda/AgendaModule';
import { OKRModule } from '@/components/okr/OKRModule';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { supabase } from '@/lib/supabase';
import { seedDemoData } from '@/utils/seedDemoData';

const ONBOARDING_KEY = 'kaizen_onboarded_v1';

const Card = ({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div onClick={onClick} className={`bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'default', className = '', disabled = false }: any) => {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  const variants: Record<string, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${variants[variant]} h-14 px-6 py-2 w-full text-lg ${className}`}>
      {children}
    </button>
  );
};

const ProgressBar = ({ value }: { value: number }) => (
  <div className="relative w-full h-4 overflow-hidden rounded-full bg-secondary">
    <div className="h-full bg-primary transition-all duration-500 ease-in-out" style={{ width: `${value}%` }} />
  </div>
);

const TYPE_COLORS: Record<string, string> = {
  work: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  social: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  health: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  ritual: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
};

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [showTour, setShowTour] = useState(false); // se activa tras auth
  const [showStartRitual, setShowStartRitual] = useState(false); // se activa tras tour o si ya onboarded
  const [showEndRitual, setShowEndRitual] = useState(false);
  const [reflection, setReflection] = useState('');
  const [isSeedingDemo, setIsSeedingDemo] = useState(false);

  const { dailyProgress, fetchData, streak, events, logDayStart, saveReflection } = useStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session) {
        fetchData();
        // Decidir si mostrar tour o ritual de arranque
        if (!localStorage.getItem(ONBOARDING_KEY)) {
          setShowTour(true);
        } else {
          setShowStartRitual(true);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData();
    });

    return () => subscription.unsubscribe();
  }, []);

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
  };

  const handleSeedDemo = async () => {
    const confirmed = window.confirm(
      '¿Reemplazar todos los datos con datos de demostración?\n\nEsto eliminará tu información actual y cargará datos de ejemplo.'
    );
    if (!confirmed) return;
    setIsSeedingDemo(true);
    await seedDemoData();
    await fetchData();
    setIsSeedingDemo(false);
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center dark bg-background text-foreground">Cargando...</div>;
  if (!session) return <AuthScreen onAuthSuccess={() => setAuthLoading(false)} />;

  // Preview de agenda: próximos eventos de hoy
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
      case 'relationships': return <KanbanModule />;
      case 'learning':     return <LearningModule />;
      case 'agenda':       return <AgendaModule />;
      case 'okr':          return <OKRModule />;
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
                  {streak > 0
                    ? `Racha activa: ${streak} día${streak !== 1 ? 's' : ''} consecutivo${streak !== 1 ? 's' : ''}.`
                    : 'Completa el ritual de cierre para iniciar tu racha.'}
                </p>
              </Card>
            </section>

            {/* Agenda Preview */}
            {todayEvents.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-3 px-1 mt-6">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" /> Próximo hoy
                  </h3>
                  <button onClick={() => setActiveTab('agenda')} className="text-xs text-primary font-bold">
                    Ver todo →
                  </button>
                </div>
                <div className="space-y-2">
                  {todayEvents.map(event => (
                    <div key={event.id} className={`flex items-center gap-3 p-3 rounded-xl border ${TYPE_COLORS[event.type]}`}>
                      <span className="text-xs font-bold w-11 shrink-0 text-center tabular-nums">
                        {event.startTime.slice(0, 5)}
                      </span>
                      <div className="w-px h-5 bg-current opacity-25" />
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
                {[
                  { tab: 'fitness',       label: 'Entrenamiento',   sub: 'Rutinas y progreso físico',   icon: <Activity className="w-6 h-6" />,    color: 'text-orange-500' },
                  { tab: 'learning',      label: 'Estudios & Cursos', sub: 'Cursos y aprendizaje activo', icon: <BookOpen className="w-6 h-6" />,    color: 'text-blue-500' },
                  { tab: 'relationships', label: 'Partners Control', sub: 'CRM de relaciones clave',     icon: <Users className="w-6 h-6" />,       color: 'text-rose-500' },
                  { tab: 'agenda',        label: 'Agenda Pro',      sub: 'Time-blocking diario',         icon: <CalendarDays className="w-6 h-6" />, color: 'text-purple-500' },
                  { tab: 'okr',           label: 'OKR / Metas',     sub: 'Objetivos del trimestre',      icon: <TrendingUp className="w-6 h-6" />,   color: 'text-blue-500' },
                ].map(({ tab, label, sub, icon, color }) => (
                  <Card key={tab} className="hover:border-primary/50 transition-colors cursor-pointer active:scale-[0.98]" onClick={() => setActiveTab(tab)}>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-accent/50 ${color}`}>{icon}</div>
                        <div>
                          <h4 className="font-bold text-lg">{label}</h4>
                          <p className="text-xs text-muted-foreground">{sub}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Cerrar Día */}
            <section className="pt-8 pb-2">
              <Button
                variant="outline"
                className="w-full py-6 rounded-xl border-dashed hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
                onClick={() => setShowEndRitual(true)}
              >
                <Sunset className="w-5 h-5 mr-2" /> Descompresión Evaluativa (Cerrar Día)
              </Button>
            </section>

            {/* Demo data link */}
            <div className="flex justify-center pb-8">
              <button
                onClick={handleSeedDemo}
                disabled={isSeedingDemo}
                className="text-xs text-muted-foreground/40 hover:text-muted-foreground underline underline-offset-2 transition-colors disabled:opacity-30"
              >
                {isSeedingDemo ? 'Cargando datos...' : 'Cargar datos de demostración'}
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0 dark font-sans">
      {/* Tour de onboarding */}
      {showTour && <OnboardingTour onComplete={handleTourComplete} />}

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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTour(true)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Tour de la app"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
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
      {showStartRitual && !showTour && (
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
