import React from 'react';
import { Activity, BookOpen, Users, CalendarDays, TrendingUp, Clock, CheckCircle2, ChevronRight, Sunset } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { RefactorHub } from './RefactorHub';

interface DashboardProps {
  dailyProgress: number;
  streak: number;
  todayEvents: any[];
  setActiveTab: (tab: string) => void;
  setShowEndRitual: (show: boolean) => void;
  handleSeedDemo: () => void;
  isSeedingDemo: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  work: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  social: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  health: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  ritual: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
};

export const Dashboard: React.FC<DashboardProps> = ({
  dailyProgress,
  streak,
  todayEvents,
  setActiveTab,
  setShowEndRitual,
  handleSeedDemo,
  isSeedingDemo,
}) => {
  return (
    <>
      <RefactorHub />
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
};
