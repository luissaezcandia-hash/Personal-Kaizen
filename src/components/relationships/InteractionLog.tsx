import React from 'react';
import type { Interaction } from '@/store/useStore';
import { MessageSquare } from 'lucide-react';

interface InteractionLogProps {
  interactions: Interaction[];
}

export const InteractionLog: React.FC<InteractionLogProps> = ({ interactions }) => {
  if (interactions.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/20 border border-dashed border-border rounded-xl">
        <p className="text-muted-foreground text-sm">No hay interacciones registradas aún.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-border">
      {interactions.map((interaction) => (
        <div key={interaction.id} className="relative pl-10">
          <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background shadow-sm" />
          <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{interaction.date}</span>
              <MessageSquare className="w-3 h-3 text-primary opacity-50" />
            </div>
            <p className="text-sm text-foreground leading-relaxed">{interaction.notes}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
