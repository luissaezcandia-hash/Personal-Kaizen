import { useState } from 'react'
import { TrendingUp, Plus, Trash2, X, ChevronDown, ChevronUp, Target } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { Objective, KeyResult } from '@/store/useStore'

const CATEGORY_STYLES: Record<Objective['category'], string> = {
  business: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  health: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
  learning: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  personal: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
}

const PROGRESS_COLORS: Record<Objective['category'], string> = {
  business: 'bg-blue-500',
  health: 'bg-orange-500',
  learning: 'bg-emerald-500',
  personal: 'bg-purple-500',
}

const CATEGORY_LABELS: Record<Objective['category'], string> = {
  business: 'Negocio',
  health: 'Salud',
  learning: 'Aprendizaje',
  personal: 'Personal',
}

const getCurrentQuarter = () => {
  const now = new Date()
  const q = Math.ceil((now.getMonth() + 1) / 3)
  return `Q${q}-${now.getFullYear()}`
}

const MiniProgressBar = ({ value, color }: { value: number; color: string }) => (
  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
    <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${Math.min(100, value)}%` }} />
  </div>
)

export function OKRModule() {
  const { objectives, addObjective, deleteObjective, addKeyResult, updateKeyResult, deleteKeyResult } = useStore()
  const currentQuarter = getCurrentQuarter()
  const [selectedQuarter, setSelectedQuarter] = useState(currentQuarter)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [showObjModal, setShowObjModal] = useState(false)
  const [showKRModal, setShowKRModal] = useState<string | null>(null)

  // Obj form
  const [objTitle, setObjTitle] = useState('')
  const [objCategory, setObjCategory] = useState<Objective['category']>('business')

  // KR form
  const [krTitle, setKrTitle] = useState('')
  const [krTarget, setKrTarget] = useState('')
  const [krUnit, setKrUnit] = useState('%')

  const quarters = Array.from(
    new Set([currentQuarter, ...objectives.map(o => o.quarter)])
  ).sort().reverse()

  const filteredObjectives = objectives.filter(o => o.quarter === selectedQuarter)

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleAddObjective = async (e: React.FormEvent) => {
    e.preventDefault()
    await addObjective({ title: objTitle, quarter: selectedQuarter, category: objCategory })
    setShowObjModal(false)
    setObjTitle('')
    setObjCategory('business')
  }

  const handleAddKR = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showKRModal) return
    await addKeyResult({
      objectiveId: showKRModal,
      title: krTitle,
      currentValue: 0,
      targetValue: parseInt(krTarget),
      unit: krUnit
    })
    setShowKRModal(null)
    setKrTitle('')
    setKrTarget('')
    setKrUnit('%')
  }

  // Summary stats
  const totalObjs = filteredObjectives.length
  const avgProgress = totalObjs === 0 ? 0 : Math.round(filteredObjectives.reduce((acc, o) => acc + o.progress, 0) / totalObjs)

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          OKR / Metas
        </h2>
        <button
          onClick={() => setShowObjModal(true)}
          className="bg-primary text-primary-foreground p-2 rounded-xl shadow-lg active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Quarter Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {quarters.map(q => (
          <button
            key={q}
            onClick={() => setSelectedQuarter(q)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap border transition-all ${
              selectedQuarter === q
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-primary/50'
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Progress summary */}
      {totalObjs > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-bold uppercase">AVANCE {selectedQuarter}</p>
            <p className="text-3xl font-black">{avgProgress}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{totalObjs} objetivo{totalObjs !== 1 ? 's' : ''}</p>
            <p className="text-xs text-muted-foreground">{filteredObjectives.reduce((acc, o) => acc + o.keyResults.length, 0)} key results</p>
          </div>
        </div>
      )}

      {/* Objectives List */}
      <div className="space-y-3">
        {filteredObjectives.length === 0 ? (
          <div className="text-center p-8 bg-secondary/30 rounded-xl border border-dashed border-border">
            <Target className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground font-medium">Sin objetivos para {selectedQuarter}.</p>
            <p className="text-xs text-muted-foreground mt-1">Toca + para definir tus metas trimestrales.</p>
          </div>
        ) : (
          filteredObjectives.map(obj => {
            const isExpanded = expandedIds.has(obj.id)
            return (
              <div key={obj.id} className={`rounded-xl border ${CATEGORY_STYLES[obj.category]} overflow-hidden`}>
                <div className="p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 border border-current rounded-full px-2 py-0.5 inline-block mb-2">
                        {CATEGORY_LABELS[obj.category]}
                      </span>
                      <h3 className="font-bold text-base leading-tight">{obj.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-sm font-black">{obj.progress}%</span>
                      <button onClick={() => toggleExpand(obj.id)} className="p-1 opacity-70 hover:opacity-100">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <MiniProgressBar value={obj.progress} color={PROGRESS_COLORS[obj.category]} />
                </div>

                {isExpanded && (
                  <div className="border-t border-current/10 p-4 space-y-4 bg-background/30">
                    {obj.keyResults.length === 0 && (
                      <p className="text-xs text-center opacity-50">Sin key results. Añade el primero.</p>
                    )}
                    {obj.keyResults.map((kr: KeyResult) => (
                      <div key={kr.id} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium flex-1 leading-tight">{kr.title}</span>
                          <button onClick={() => deleteKeyResult(kr.id, kr.objectiveId)} className="p-1 opacity-40 hover:opacity-100 shrink-0">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateKeyResult(kr.id, kr.objectiveId, Math.max(0, kr.currentValue - 1))}
                            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-base font-bold hover:bg-accent shrink-0"
                          >−</button>
                          <div className="flex-1 space-y-1">
                            <MiniProgressBar value={(kr.currentValue / kr.targetValue) * 100} color={PROGRESS_COLORS[obj.category]} />
                            <p className="text-xs text-center opacity-60 font-medium">{kr.currentValue} / {kr.targetValue} {kr.unit}</p>
                          </div>
                          <button
                            onClick={() => updateKeyResult(kr.id, kr.objectiveId, Math.min(kr.targetValue, kr.currentValue + 1))}
                            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-base font-bold hover:bg-accent shrink-0"
                          >+</button>
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setShowKRModal(obj.id)}
                        className="flex-1 py-2 rounded-lg border border-dashed border-current/30 text-xs font-bold opacity-70 hover:opacity-100 flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Key Result
                      </button>
                      <button
                        onClick={() => deleteObjective(obj.id)}
                        className="py-2 px-3 rounded-lg border border-dashed border-destructive/30 text-destructive opacity-60 hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Add Objective Modal */}
      {showObjModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border bg-muted/30">
              <h3 className="font-bold text-lg">Nuevo Objetivo — {selectedQuarter}</h3>
              <button onClick={() => setShowObjModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddObjective} className="p-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Objetivo</label>
                <input
                  type="text"
                  required
                  value={objTitle}
                  onChange={e => setObjTitle(e.target.value)}
                  className="w-full bg-secondary p-3 rounded-xl mt-1 outline-none border border-border focus:border-primary"
                  placeholder="Ej. Escalar Plus Gráfica a 6 figuras"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Categoría</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(CATEGORY_LABELS) as Array<Objective['category']>).map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setObjCategory(c)}
                      className={`p-3 text-sm font-bold rounded-lg border transition-all ${
                        objCategory === c ? CATEGORY_STYLES[c] + ' scale-105' : 'bg-secondary text-muted-foreground border-transparent'
                      }`}
                    >
                      {CATEGORY_LABELS[c]}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl active:scale-[0.98]">
                Crear Objetivo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Key Result Modal */}
      {showKRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border bg-muted/30">
              <h3 className="font-bold text-lg">Nuevo Key Result</h3>
              <button onClick={() => setShowKRModal(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddKR} className="p-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Resultado Clave</label>
                <input
                  type="text"
                  required
                  value={krTitle}
                  onChange={e => setKrTitle(e.target.value)}
                  className="w-full bg-secondary p-3 rounded-xl mt-1 outline-none border border-border focus:border-primary"
                  placeholder="Ej. Cerrar 5 clientes nuevos"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Meta</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={krTarget}
                    onChange={e => setKrTarget(e.target.value)}
                    className="w-full bg-secondary p-3 rounded-xl mt-1 outline-none border border-border focus:border-primary"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Unidad</label>
                  <input
                    type="text"
                    value={krUnit}
                    onChange={e => setKrUnit(e.target.value)}
                    className="w-full bg-secondary p-3 rounded-xl mt-1 outline-none border border-border focus:border-primary"
                    placeholder="clientes, %, km..."
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl active:scale-[0.98]">
                Agregar Key Result
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
