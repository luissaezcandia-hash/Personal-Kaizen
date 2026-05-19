import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Search, UserPlus, Users, Tag, Clock, ArrowLeft, AlertCircle } from 'lucide-react';
import { ContactProfile } from './ContactProfile';
import { isContactOverdue } from '@/utils/crm-utils';

export const CRMModule: React.FC = () => {
  const { getFilteredContacts } = useStore();
  const [search, setSearch] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const filteredContacts = getFilteredContacts(search);
  const selectedContact = filteredContacts.find(c => c.id === selectedContactId);

  if (selectedContact) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setSelectedContactId(null)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la lista
        </button>
        <ContactProfile contact={selectedContact} />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold">Personal CRM</h2>
        </div>
        <button className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text"
          placeholder="Buscar por nombre, tag o relación..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-secondary border border-border p-3 pl-10 rounded-xl outline-none focus:border-primary transition-all shadow-inner"
        />
      </div>

      <div className="space-y-3">
        {filteredContacts.map(contact => (
          <div 
            key={contact.id}
            onClick={() => setSelectedContactId(contact.id)}
            className="bg-card p-4 rounded-xl border border-border shadow-sm hover:border-primary/50 cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{contact.name}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-secondary text-muted-foreground border border-border">
                    {contact.relationshipType}
                  </span>
                  {contact.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      <Tag className="w-2.5 h-2.5 inline mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                {isContactOverdue(contact.lastInteraction, contact.contactFrequency) && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-1 rounded mb-2 border border-destructive/20">
                    <AlertCircle className="w-3 h-3" />
                    PENDIENTE
                  </div>
                )}
                <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3" />
                  {contact.lastInteraction || 'Sin registro'}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">
                  {contact.contactFrequency}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {filteredContacts.length === 0 && (
          <div className="text-center p-12 border-2 border-dashed border-border rounded-2xl bg-muted/20">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">No se encontraron contactos</p>
          </div>
        )}
      </div>
    </div>
  );
};
