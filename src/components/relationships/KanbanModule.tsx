import { useState } from 'react'
import { Users, AlertCircle, GripVertical, Key, Zap, X, Plus, Edit2, Trash2, Camera, MessageCircle, Gift, FileText } from 'lucide-react'
import { useStore } from '@/store/useStore'

const hooksDB = [
  "¿Eres de las que se ofenden fácil o tienes sentido del humor?",
  "Pareces el tipo de persona que prefiere la pizza con piña. Dime que me equivoco.",
  "¿Aventura espontánea hoy o eres de las que planea todo con un mes de anticipación?",
  "Tengo un secreto y 5 minutos. ¿Lista?"
]

const closesDB = [
  { name: "Cierre Doble Alternativa", text: "¿Te queda mejor el jueves a las 7 o el viernes a las 8?" },
  { name: "Cierre Amarre", text: "Es importante que estemos en la misma sintonía antes de vernos, ¿verdad?" },
  { name: "Cierre Puercoespín", text: "Contacto: 'No sé si pueda esta semana.' Tú: '¿Y si lo dejamos para la próxima y así vas más relajada?'" },
  { name: "Cierre por Equivocación", text: "Entonces, ¿nos vemos en el café del centro a las 6... ah no, dijimos a las 7, cierto?" }
]

export function KanbanModule() {
  const { contacts, moveContact, addContact, updateContact, deleteContact } = useStore()
  const [showBoveda, setShowBoveda] = useState(false)
  const [showClosing, setShowClosing] = useState(false)
  const [randomClose, setRandomClose] = useState(closesDB[0])

  // Contact Modal State
  const [showContactModal, setShowContactModal] = useState(false)
  const [editingContactId, setEditingContactId] = useState<string | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phase: 'A' as 'A' | 'B' | 'C',
    lastInteraction: 'Hoy',
    investmentRatio: 1.0,
    instagram: '',
    whatsapp: '',
    birthday: '',
    notes: ''
  })

  const columns = [
    { id: 'A', title: 'INICIO (Sex Code)' },
    { id: 'B', title: 'DESARROLLO (Sex Crack)' },
    { id: 'C', title: 'CIERRE (NetKeizer)' }
  ]

  const triggerClosingEngine = () => {
    const random = closesDB[Math.floor(Math.random() * closesDB.length)]
    setRandomClose(random)
    setShowClosing(true)
  }

  const openNewContactModal = () => {
    setFormData({ name: '', phase: 'A', lastInteraction: 'Hoy', investmentRatio: 1.0, instagram: '', whatsapp: '', birthday: '', notes: '' })
    setEditingContactId(null)
    setShowContactModal(true)
  }

  const openEditContactModal = (contact: any) => {
    setFormData({
      name: contact.name,
      phase: contact.phase,
      lastInteraction: contact.lastInteraction,
      investmentRatio: contact.investmentRatio,
      instagram: contact.instagram || '',
      whatsapp: contact.whatsapp || '',
      birthday: contact.birthday || '',
      notes: contact.notes || ''
    })
    setEditingContactId(contact.id)
    setShowContactModal(true)
  }

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingContactId) {
      updateContact(editingContactId, formData)
    } else {
      addContact(formData)
    }
    setShowContactModal(false)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-rose-500" />
          <h2 className="text-2xl font-bold">Partners Control</h2>
        </div>
        <button 
          onClick={openNewContactModal}
          className="bg-primary text-primary-foreground p-2 rounded-lg flex items-center justify-center shadow-sm hover:bg-primary/90"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Feature Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button 
          onClick={() => setShowBoveda(true)}
          className="flex flex-col items-center justify-center p-3 bg-secondary rounded-xl border border-border hover:bg-secondary/80 transition-colors"
        >
          <Key className="w-6 h-6 mb-2 text-blue-500" />
          <span className="text-sm font-bold">Bóveda de Anzuelos</span>
        </button>
        <button 
          onClick={triggerClosingEngine}
          className="flex flex-col items-center justify-center p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 transition-colors"
        >
          <Zap className="w-6 h-6 mb-2" />
          <span className="text-sm font-bold">Closing Engine</span>
        </button>
      </div>

      <div className="space-y-6">
        {columns.map(column => (
          <div key={column.id} className="bg-muted/50 rounded-xl p-4 border border-border">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              {column.title}
            </h3>
            
            <div className="space-y-3">
              {contacts.filter(c => c.phase === column.id).map(contact => (
                <div key={contact.id} className="bg-card p-4 rounded-lg border shadow-sm flex items-start gap-3 relative">
                  <GripVertical className="w-5 h-5 text-muted-foreground mt-1 cursor-grab active:cursor-grabbing shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg truncate">{contact.name}</h4>
                      <div className="flex items-center gap-2 shrink-0">
                        {contact.investmentRatio > 2 && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-1 rounded">
                            <AlertCircle className="w-3 h-3" />
                            OVERINVEST
                          </div>
                        )}
                        <button onClick={() => openEditContactModal(contact)} className="text-muted-foreground hover:text-primary transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteContact(contact.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Detalles Sociales */}
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                      {contact.instagram && (
                        <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md"><Camera className="w-3 h-3 text-pink-500" /> {contact.instagram}</span>
                      )}
                      {contact.whatsapp && (
                        <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md"><MessageCircle className="w-3 h-3 text-green-500" /> {contact.whatsapp}</span>
                      )}
                      {contact.birthday && (
                        <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md"><Gift className="w-3 h-3 text-orange-500" /> {contact.birthday}</span>
                      )}
                    </div>
                    {contact.notes && (
                      <p className="text-xs text-muted-foreground mt-2 italic flex items-start gap-1"><FileText className="w-3 h-3 mt-0.5 shrink-0" /> {contact.notes}</p>
                    )}

                    <p className="text-sm text-muted-foreground mt-3">Última int: {contact.lastInteraction}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded">
                        Ratio: {contact.investmentRatio}:1
                      </p>
                      <select 
                        className="text-xs bg-secondary border border-border rounded-md px-2 py-1.5 outline-none font-medium"
                        value={contact.phase}
                        onChange={(e) => moveContact(contact.id, e.target.value as 'A' | 'B' | 'C')}
                      >
                        <option value="A">INICIO</option>
                        <option value="B">DESARROLLO</option>
                        <option value="C">CIERRE</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              
              {contacts.filter(c => c.phase === column.id).length === 0 && (
                <div className="text-center p-4 text-muted-foreground text-sm border border-dashed rounded-lg bg-background/50">
                  Sin contactos
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Add/Edit Contact */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-border bg-muted/30 shrink-0 rounded-t-2xl">
              <h3 className="font-bold text-lg">
                {editingContactId ? 'Editar Contacto' : 'Nuevo Contacto'}
              </h3>
              <button onClick={() => setShowContactModal(false)} className="p-1 rounded-md hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveContact} className="p-4 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1">
                <label className="text-sm font-bold text-muted-foreground">Nombre</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-secondary border border-border p-3 rounded-lg outline-none focus:border-primary transition-colors"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-bold text-muted-foreground">Fase</label>
                <select 
                  value={formData.phase}
                  onChange={e => setFormData({...formData, phase: e.target.value as 'A' | 'B' | 'C'})}
                  className="w-full bg-secondary border border-border p-3 rounded-lg outline-none focus:border-primary transition-colors"
                >
                  <option value="A">INICIO (Sex Code)</option>
                  <option value="B">DESARROLLO (Sex Crack)</option>
                  <option value="C">CIERRE (NetKeizer)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-muted-foreground">Última Interacción (Texto)</label>
                <input 
                  required
                  type="text" 
                  value={formData.lastInteraction}
                  onChange={e => setFormData({...formData, lastInteraction: e.target.value})}
                  className="w-full bg-secondary border border-border p-3 rounded-lg outline-none focus:border-primary transition-colors"
                  placeholder="Ej. Ayer, Hace 2 horas..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-muted-foreground">Ratio de Inversión (0.0 - 5.0)</label>
                <input 
                  required
                  type="number" 
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.investmentRatio}
                  onChange={e => setFormData({...formData, investmentRatio: parseFloat(e.target.value)})}
                  className="w-full bg-secondary border border-border p-3 rounded-lg outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Nuevos Campos Opcionales */}
              <div className="pt-4 border-t border-border space-y-4">
                <p className="text-xs uppercase font-bold text-muted-foreground">Datos Opcionales</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground flex items-center gap-1"><Camera className="w-3 h-3" /> Instagram</label>
                    <input 
                      type="text" 
                      value={formData.instagram}
                      onChange={e => setFormData({...formData, instagram: e.target.value})}
                      className="w-full bg-secondary border border-border p-2 text-sm rounded-lg outline-none focus:border-primary transition-colors"
                      placeholder="@usuario"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground flex items-center gap-1"><MessageCircle className="w-3 h-3" /> WhatsApp</label>
                    <input 
                      type="text" 
                      value={formData.whatsapp}
                      onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                      className="w-full bg-secondary border border-border p-2 text-sm rounded-lg outline-none focus:border-primary transition-colors"
                      placeholder="+52..."
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground flex items-center gap-1"><Gift className="w-3 h-3" /> Cumpleaños</label>
                  <input 
                    type="date" 
                    value={formData.birthday}
                    onChange={e => setFormData({...formData, birthday: e.target.value})}
                    className="w-full bg-secondary border border-border p-2 text-sm rounded-lg outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground flex items-center gap-1"><FileText className="w-3 h-3" /> Notas Rápidas</label>
                  <textarea 
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-secondary border border-border p-2 text-sm rounded-lg outline-none focus:border-primary transition-colors resize-none min-h-[60px]"
                    placeholder="Hobbies, alertas, etc."
                  />
                </div>
              </div>

              <div className="pt-2 pb-2 sticky bottom-0 bg-card mt-2">
                <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-md">
                  {editingContactId ? 'Actualizar Perfil' : 'Crear Perfil'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Bóveda de Anzuelos (Oculta si está activa otra) */}
      {showBoveda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-border bg-muted/30 shrink-0 rounded-t-2xl">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-500" /> Bóveda de Anzuelos
              </h3>
              <button onClick={() => setShowBoveda(false)} className="p-1 rounded-md hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              {hooksDB.map((hook, idx) => (
                <div key={idx} className="p-3 bg-secondary rounded-lg text-sm border border-border/50">
                  {hook}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Closing Engine (Oculta si está activa otra) */}
      {showClosing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border-2 border-rose-500/50 rounded-2xl w-full max-w-sm shadow-[0_0_40px_-10px_rgba(244,63,94,0.3)] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-border bg-rose-500/10 shrink-0 rounded-t-2xl">
              <h3 className="font-bold text-lg flex items-center gap-2 text-rose-500">
                <Zap className="w-5 h-5" /> Closing Engine
              </h3>
              <button onClick={() => setShowClosing(false)} className="p-1 rounded-md hover:bg-rose-500/20 text-rose-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-center space-y-4 overflow-y-auto flex-1">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Técnica Sugerida</p>
              <h4 className="text-xl font-black text-foreground">{randomClose.name}</h4>
              <div className="p-4 bg-secondary rounded-xl text-sm italic border border-border/50">
                "{randomClose.text}"
              </div>
              <button 
                onClick={triggerClosingEngine}
                className="w-full mt-4 bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 transition-colors"
              >
                Generar Otro Cierre
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
