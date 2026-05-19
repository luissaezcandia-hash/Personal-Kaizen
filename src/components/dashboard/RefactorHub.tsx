import React from 'react';
import { useStore } from '@/store/useStore';
import { RefactorCard } from '@/components/ui/RefactorCard';
import { BrainCircuit } from 'lucide-react';

export const RefactorHub: React.FC = () => {
  const { aiSuggestions, executeRefactor, dismissAISuggestion } = useStore();

  if (aiSuggestions.length === 0) return null;

  return (
    <section className="space-y-4 animate-in fade-in duration-700">
      <div className="flex items-center gap-2 px-1">
        <BrainCircuit className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg">Estratega KAIZEN</h3>
      </div>
      
      <div className="space-y-3">
        {aiSuggestions.map((suggestion) => (
          <RefactorCard
            key={suggestion.id}
            suggestion={suggestion}
            onAccept={executeRefactor}
            onDismiss={dismissAISuggestion}
          />
        ))}
      </div>
    </section>
  );
};
