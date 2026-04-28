import { useState } from 'react'
import { Activity, CheckCircle2, Circle, Plus, Edit2, Trash2, X } from 'lucide-react'
import { useStore } from '@/store/useStore'

export function FitnessModule() {
  const { routines, toggleTask, addTask, updateTask, deleteTask } = useStore()
  
  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<{ routineId: string, taskId: string | null } | null>(null)
  const [taskTitle, setTaskTitle] = useState('')

  const openNewTaskModal = (routineId: string) => {
    setTaskTitle('')
    setEditingTask({ routineId, taskId: null })
    setShowModal(true)
  }

  const openEditTaskModal = (routineId: string, taskId: string, currentTitle: string) => {
    setTaskTitle(currentTitle)
    setEditingTask({ routineId, taskId })
    setShowModal(true)
  }

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTask) return

    if (editingTask.taskId) {
      updateTask(editingTask.routineId, editingTask.taskId, taskTitle)
    } else {
      addTask(editingTask.routineId, taskTitle)
    }
    setShowModal(false)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-8 h-8 text-orange-500" />
        <h2 className="text-2xl font-bold">Entrenamiento</h2>
      </div>

      <div className="space-y-6">
        {routines.map(routine => (
          <div key={routine.id} className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{routine.name}</h3>
              <button 
                onClick={() => openNewTaskModal(routine.id)}
                className="bg-primary/10 text-primary p-2 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {routine.tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    task.completed ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-background hover:bg-accent'
                  }`}
                >
                  <div 
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() => toggleTask(routine.id, task.id)}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 shrink-0" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground shrink-0" />
                    )}
                    <span className={`text-lg font-medium truncate ${task.completed ? 'line-through opacity-70' : ''}`}>
                      {task.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 pl-2 border-l border-border/50 ml-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEditTaskModal(routine.id, task.id, task.title); }}
                      className="text-muted-foreground hover:text-primary transition-colors p-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteTask(routine.id, task.id); }}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {routine.tasks.length === 0 && (
                <div className="text-center p-4 text-muted-foreground text-sm border border-dashed rounded-lg bg-background/50">
                  Sin ejercicios en esta rutina
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Add/Edit Task */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-border bg-muted/30 shrink-0 rounded-t-2xl">
              <h3 className="font-bold text-lg">
                {editingTask?.taskId ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-md hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveTask} className="p-4 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1">
                <label className="text-sm font-bold text-muted-foreground">Nombre del Ejercicio/Hábito</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full bg-secondary border border-border p-3 rounded-lg outline-none focus:border-primary transition-colors text-lg"
                  placeholder="Ej. 100 Flexiones"
                />
              </div>

              <div className="pt-2 pb-2 sticky bottom-0 bg-card mt-2">
                <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-md">
                  {editingTask?.taskId ? 'Actualizar' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
