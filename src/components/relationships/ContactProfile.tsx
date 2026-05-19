import React, { useState } from 'react';
import type { Contact } from '@/store/useStore';
import { useStore } from '@/store/useStore';
import { Camera, MessageCircle, Gift, FileText, Send, Calendar } from 'lucide-react';
import { InteractionLog } from './InteractionLog';

interface ContactProfileProps {
  contact: Contact;
}

export const ContactProfile: React.FC<ContactProfileProps> = ({ contact }) => {
  const { addInteraction } = useStore();
  const [newNote, setNewNote] = useState('');

  const handleAddInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    await addInteraction(contact.id, {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('en-CA'),
      notes: newNote
    });
    setNewNote('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Cabecera */}
      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center border-2 border-blue-500/20">
            <span className="text-2xl font-bold text-blue-500">{contact.name.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Perfil de {contact.name}</h2>
            <div className="flex gap-2 mt-1">
              <span className="text-xs font-bold px-2 py-1 rounded bg-secondary text-muted-foreground border border-border uppercase">
                {contact.relationshipType}
              </span>
              <span className="text-xs font-bold px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20 uppercase">
                {contact.contactFrequency}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="space-y-3">
            {contact.instagram && (
              <div className="flex items-center gap-3 text-sm">
                <Camera className="w-4 h-4 text-pink-500" />
                <span>{contact.instagram}</span>
              </div>
            )}
            {contact.whatsapp && (
              <div className="flex items-center gap-3 text-sm">
                <MessageCircle className="w-4 h-4 text-green-500" />
                <span>{contact.whatsapp}</span>
              </div>
            )}
            {contact.birthday && (
              <div className="flex items-center gap-3 text-sm">
                <Gift className="w-4 h-4 text-orange-500" />
                <span>{contact.birthday}</span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
              <p className="italic text-muted-foreground">{contact.notes || 'Sin notas adicionales'}</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Última: {contact.lastInteraction || 'Nunca'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Registrar Interacción */}
      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Send className="w-4 h-4 text-primary" />
          Registrar Nueva Interacción
        </h3>
        <form onSubmit={handleAddInteraction} className="space-y-3">
          <textarea 
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="¿De qué hablaron?"
            className="w-full bg-secondary border border-border p-3 rounded-xl outline-none focus:border-primary transition-all resize-none min-h-[80px] text-sm"
          />
          <button 
            type="submit"
            className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
          >
            Registrar Interacción
          </button>
        </form>
      </div>

      {/* Historial */}
      <div className="space-y-4">
        <h3 className="font-bold px-1">Historial de Interacciones</h3>
        <InteractionLog interactions={contact.interactions} />
      </div>
    </div>
  );
};
