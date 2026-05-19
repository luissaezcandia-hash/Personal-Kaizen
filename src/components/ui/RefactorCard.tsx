import React from 'react';
import { Lightbulb, Check, X, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { RefactorSuggestion } from '@/lib/ai-agent';

interface RefactorCardProps {
  suggestion: RefactorSuggestion;
  onAccept: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const RefactorCard: React.FC<RefactorCardProps> = ({ suggestion, onAccept, onDismiss }) => {
  return (
    <Card className="border-primary/20 bg-primary/5 p-4 animate-in slide-in-from-left duration-500">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="font-bold text-sm text-primary uppercase tracking-wider flex items-center gap-2">
            Propuesta de Refactor <ArrowRight className="w-3 h-3" /> {suggestion.intent}
          </h4>
          <p className="text-sm font-medium">{suggestion.reasoning}</p>
          <div className="pt-3 flex gap-2">
            <Button 
              onClick={() => onAccept(suggestion.id)}
              className="h-10 text-xs py-0 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Check className="w-3 h-3 mr-1" /> Aceptar Refactor
            </Button>
            <Button 
              variant="ghost"
              onClick={() => onDismiss(suggestion.id)}
              className="h-10 text-xs py-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-3 h-3 mr-1" /> Ignorar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
