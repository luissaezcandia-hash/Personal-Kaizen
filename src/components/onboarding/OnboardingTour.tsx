import { useState } from 'react'
import {
  Target,
  Sunrise,
  CalendarDays,
  TrendingUp,
  Users,
  Flame,
  CheckCircle2,
  Activity,
} from 'lucide-react'

interface Slide {
  icon: React.ReactNode
  iconBg: string
  title: string
  body: string
  tag: string
}

const SLIDES: Slide[] = [
  {
    icon: <Target className="w-16 h-16" />,
    iconBg: 'bg-primary/10 text-primary',
    tag: 'Bienvenida',
    title: 'Tu Sistema Operativo Personal',
    body: 'Personal Kaizen no es una app de productividad genérica. Es el sistema con el que operas tu vida como CEO: con intención, métricas y sin ruido.',
  },
  {
    icon: <Sunrise className="w-16 h-16" />,
    iconBg: 'bg-yellow-500/10 text-yellow-500',
    tag: 'Cada mañana',
    title: 'Filtro de Arranque',
    body: 'Antes de abrir cualquier otra app, defines tu enfoque del día. Lo que no es prioridad, no existe. Un solo foco mueve más que diez tareas dispersas.',
  },
  {
    icon: <CalendarDays className="w-16 h-16" />,
    iconBg: 'bg-purple-500/10 text-purple-500',
    tag: 'Agenda Pro',
    title: 'Time-Blocking, No Calendarios',
    body: 'Bloquea tu tiempo en segmentos visuales antes de que otros lo hagan. Trabajo profundo, salud, rituales y vida social en una línea de tiempo limpia y accionable.',
  },
  {
    icon: <TrendingUp className="w-16 h-16" />,
    iconBg: 'bg-blue-500/10 text-blue-500',
    tag: 'OKR / Metas',
    title: 'Lo Que No Se Mide No Escala',
    body: 'Define 2-3 objetivos trimestrales con resultados clave medibles. Cada semana sabes exactamente si vas en dirección correcta o si hay que pivotar.',
  },
  {
    icon: <Users className="w-16 h-16" />,
    iconBg: 'bg-rose-500/10 text-rose-500',
    tag: 'Partners Control',
    title: 'Relaciones con Intención',
    body: 'Fase A son tus aliados clave — cuídalos. Fase B es tu red activa. Fase C está en pausa. Nunca más una relación estratégica cayendo en el olvido.',
  },
  {
    icon: <Activity className="w-16 h-16" />,
    iconBg: 'bg-orange-500/10 text-orange-500',
    tag: 'Entrenamiento',
    title: 'El Cuerpo Es Infraestructura',
    body: 'Registra rutinas, tareas y progreso físico. Un CEO con alta energía toma mejores decisiones. La salud no es opcional, es parte del sistema.',
  },
  {
    icon: <Flame className="w-16 h-16 fill-current" />,
    iconBg: 'bg-orange-500/10 text-orange-500',
    tag: 'Racha',
    title: 'La Consistencia Es La Ventaja',
    body: 'Cada día que operas el sistema, sumas un día a tu racha. No se trata de perfección — se trata de no romper la cadena. La racha es tu indicador de disciplina real.',
  },
  {
    icon: <CheckCircle2 className="w-16 h-16" />,
    iconBg: 'bg-emerald-500/10 text-emerald-500',
    tag: 'Listo',
    title: 'El Sistema Está Activo',
    body: 'Define tu enfoque de hoy y empieza. La acción imperfecta hoy supera al plan perfecto que nunca se ejecuta.',
  },
]

interface OnboardingTourProps {
  onComplete: () => void
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [current, setCurrent] = useState(0)
  const slide = SLIDES[current]
  const isLast = current === SLIDES.length - 1
  const isFirst = current === 0

  const next = () => {
    if (isLast) {
      onComplete()
    } else {
      setCurrent(c => c + 1)
    }
  }

  const prev = () => setCurrent(c => Math.max(0, c - 1))

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background dark">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {current + 1} / {SLIDES.length}
        </span>
        {!isLast && (
          <button
            onClick={onComplete}
            className="text-xs text-muted-foreground font-bold uppercase tracking-wider hover:text-foreground transition-colors"
          >
            Omitir
          </button>
        )}
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div
          key={current}
          className="flex flex-col items-center gap-6 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {/* Icon */}
          <div className={`w-28 h-28 rounded-3xl flex items-center justify-center ${slide.iconBg}`}>
            {slide.icon}
          </div>

          {/* Tag */}
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground border border-border px-3 py-1 rounded-full">
            {slide.tag}
          </span>

          {/* Text */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold leading-tight">{slide.title}</h2>
            <p className="text-muted-foreground leading-relaxed text-base">{slide.body}</p>
          </div>
        </div>
      </div>

      {/* Footer navigation */}
      <div className="px-6 pb-10 pt-4 space-y-5 shrink-0 max-w-sm mx-auto w-full">
        {/* Dot indicators */}
        <div className="flex justify-center items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 h-2 bg-primary'
                  : i < current
                  ? 'w-2 h-2 bg-primary/40'
                  : 'w-2 h-2 bg-muted-foreground/20'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {!isFirst && (
            <button
              onClick={prev}
              className="flex-1 py-4 rounded-xl border border-border font-bold text-muted-foreground hover:bg-accent transition-colors"
            >
              Anterior
            </button>
          )}
          <button
            onClick={next}
            className="flex-1 py-4 rounded-xl bg-primary text-primary-foreground font-bold active:scale-[0.98] transition-transform"
          >
            {isLast ? 'Comenzar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  )
}
