import { useState } from 'react'
import { CalendarIcon, Clock, Plus, Trash2, X, AlertCircle } from 'lucide-react'
import { useStore } from '@/store/useStore'

const TYPE_STYLES = {
  work: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  social: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  health: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  ritual: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
}

const TYPE_LABELS = {
  work: 'Deep Work',
  social: 'Social / Cita',
  health: 'Salud / Deporte',
  ritual: 'Ritual',
}

export function AgendaModule() {
  const { events, addEvent, deleteEvent } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Obtenemos la fecha local actual (YYYY-MM-DD)
  const todayDate = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD local
  const [selectedDate, setSelectedDate] = useState(todayDate)

  // Form states
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [type, setType] = useState<'work' | 'social' | 'health' | 'ritual'>('work')
  const [notes, setNotes] = useState('')

  // Filtrar y ordenar eventos del día
  const dailyEvents = events
    .filter(e => e.eventDate === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    await addEvent({
      title,
      eventDate: selectedDate,
      startTime,
      endTime,
      type,
      notes
    })
    setIsModalOpen(false)
    setTitle('')
    setStartTime('')
    setEndTime('')
    setNotes('')
  }

  // Utilidad para cambiar días rápidamente
  const changeDate = (days: number) => {
    const d = new Date(selectedDate)
    d.setUTCDate(d.getUTCDate() + days)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-purple-500" />
          Agenda Pro
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground p-2 rounded-xl shadow-lg active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Selector de Fechas Rápido */}
      <div className="flex items-center justify-between bg-card p-2 rounded-xl border border-border shadow-sm">
        <button onClick={() => changeDate(-1)} className="p-2 text-muted-foreground hover:text-foreground">
          Anterior
        </button>
        <div className="font-bold">
          {selectedDate === todayDate ? 'Hoy' : new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' })}
        </div>
        <button onClick={() => changeDate(1)} className="p-2 text-primary font-semibold">
          Siguiente
        </button>
      </div>

      {/* Time-Blocking Timeline */}
      <div className="space-y-3 relative">
        {dailyEvents.length === 0 ? (
          <div className="text-center p-8 bg-secondary/30 rounded-xl border border-dashed border-border mt-4">
            <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground font-medium">Día libre. No hay eventos programados.</p>
          </div>
        ) : (
          dailyEvents.map(event => (
            <div key={event.id} className={`p-4 rounded-xl border ${TYPE_STYLES[event.type]} flex items-start gap-4 shadow-sm`}>
              <div className="flex flex-col items-center justify-center pt-1 w-16 flex-shrink-0">
                <span className="text-sm font-bold">{event.startTime.slice(0, 5)}</span>
                <span className="text-xs opacity-70">{event.endTime.slice(0, 5)}</span>
              </div>
              
              <div className="w-px h-full min-h-[40px] bg-current opacity-20 hidden sm:block"></div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg leading-tight mb-1">{event.title}</h3>
                  <button 
                    onClick={() => deleteEvent(event.id)}
                    className="text-current opacity-50 hover:opacity-100 p-1 -mr-2 -mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 border border-current rounded-full px-2 py-0.5 inline-block mb-2">
                  {TYPE_LABELS[event.type]}
                </span>
                {event.notes && (
                  <p className="text-sm opacity-90 leading-snug">{event.notes}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Agregar Evento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-border bg-muted/30">
              <h3 className="font-bold text-lg">Bloquear Tiempo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddEvent} className="p-4 space-y-4 overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Título / Foco</label>
                <input 
                  type="text" 
                  required 
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-secondary p-3 rounded-xl mt-1 outline-none border border-border focus:border-primary"
                  placeholder="Ej. Junta Plus Gráfica"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Inicio
                  </label>
                  <input 
                    type="time" 
                    required 
                    value={startTime} 
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full bg-secondary p-3 rounded-xl mt-1 outline-none border border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Fin
                  </label>
                  <input 
                    type="time" 
                    required 
                    value={endTime} 
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full bg-secondary p-3 rounded-xl mt-1 outline-none border border-border focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Categoría</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(TYPE_LABELS) as Array<keyof typeof TYPE_LABELS>).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`p-2 text-sm font-bold rounded-lg border transition-all ${
                        type === t ? TYPE_STYLES[t] + ' scale-105 shadow-sm' : 'bg-secondary text-muted-foreground border-transparent'
                      }`}
                    >
                      {TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Notas (Opcional)</label>
                <textarea 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-secondary p-3 rounded-xl mt-1 outline-none border border-border focus:border-primary h-20 resize-none"
                  placeholder="Llevar laptop, revisar KPIs..."
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-lg mt-4 active:scale-[0.98] transition-transform"
              >
                Guardar Bloque
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
