import { useState } from 'react'
import { BookOpen, Trophy, Plus, Edit2, Trash2, X } from 'lucide-react'
import { useStore } from '@/store/useStore'

export function LearningModule() {
  const { courses, addCourse, updateCourse, deleteCourse } = useStore()
  
  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: '', progress: 0 })

  const openNewCourseModal = () => {
    setFormData({ title: '', progress: 0 })
    setEditingCourseId(null)
    setShowModal(true)
  }

  const openEditCourseModal = (course: { id: string, title: string, progress: number }) => {
    setFormData({ title: course.title, progress: course.progress })
    setEditingCourseId(course.id)
    setShowModal(true)
  }

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCourseId) {
      updateCourse(editingCourseId, formData.progress, formData.title)
    } else {
      addCourse(formData)
    }
    setShowModal(false)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold">Estudios & Cursos</h2>
        </div>
        <button 
          onClick={openNewCourseModal}
          className="bg-primary text-primary-foreground p-2 rounded-lg flex items-center justify-center shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {courses.map(course => (
          <div key={course.id} className="bg-card border border-border p-5 rounded-xl shadow-sm relative group">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg pr-12">{course.title}</h3>
              <div className="flex items-center gap-2 absolute top-4 right-4">
                <button 
                  onClick={() => openEditCourseModal(course)} 
                  className="text-muted-foreground hover:text-primary transition-colors p-1 bg-background rounded-md shadow-sm border border-border"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteCourse(course.id)} 
                  className="text-muted-foreground hover:text-destructive transition-colors p-1 bg-background rounded-md shadow-sm border border-border"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="relative w-full h-3 overflow-hidden rounded-full bg-secondary mt-4">
              <div 
                className="h-full bg-blue-500 transition-all duration-500 ease-in-out" 
                style={{ width: `${course.progress}%` }} 
              />
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <Trophy className={`w-5 h-5 ${course.progress >= 100 ? 'text-yellow-500' : 'text-muted-foreground/50'}`} />
              <p className="text-sm text-muted-foreground font-bold">{course.progress}% Completado</p>
            </div>
          </div>
        ))}
        
        {courses.length === 0 && (
          <div className="text-center p-8 text-muted-foreground text-sm border border-dashed rounded-xl bg-background/50">
            Aún no tienes cursos o estudios registrados.
          </div>
        )}
      </div>

      {/* MODAL: Add/Edit Course */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-border bg-muted/30 shrink-0 rounded-t-2xl">
              <h3 className="font-bold text-lg">
                {editingCourseId ? 'Editar Curso' : 'Nuevo Curso'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-md hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveCourse} className="p-4 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1">
                <label className="text-sm font-bold text-muted-foreground">Título del Estudio/Curso</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-secondary border border-border p-3 rounded-lg outline-none focus:border-primary transition-colors text-lg"
                  placeholder="Ej. Curso de React, Tesis..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-muted-foreground">Progreso ({formData.progress}%)</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={formData.progress}
                  onChange={e => setFormData({...formData, progress: parseInt(e.target.value)})}
                  className="w-full accent-blue-500 py-2"
                />
              </div>

              <div className="pt-2 pb-2 sticky bottom-0 bg-card mt-2">
                <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-md">
                  {editingCourseId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
