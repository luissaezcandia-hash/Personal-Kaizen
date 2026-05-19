import React from 'react';
import { Sunset } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EveningRitualProps {
  progress: number;
  reflection: string;
  setReflection: (value: string) => void;
  onClose: () => void;
  onComplete: () => void;
}

export const EveningRitual: React.FC<EveningRitualProps> = ({
  progress,
  reflection,
  setReflection,
  onClose,
  onComplete,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-md">
      <div className="max-w-sm w-full space-y-6 text-center animate-in slide-in-from-bottom-10 duration-500 max-h-[90vh] overflow-y-auto py-4">
        <Sunset className="w-16 h-16 text-indigo-500 mx-auto" />
        <div>
          <h2 className="text-2xl font-bold mb-2">Descompresión Evaluativa</h2>
          <p className="text-muted-foreground">La teoría sin aplicación es ruido.</p>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl text-left space-y-4">
          <div>
            <p className="text-sm font-bold mb-1">Tu progreso de hoy:</p>
            <h3 className="text-3xl font-black text-primary">{progress}%</h3>
          </div>
          <div className="space-y-2 pt-2 border-t border-border">
            <label className="text-sm font-bold">¿Qué se refactoriza para mañana?</label>
            <textarea
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              placeholder="Escribe tus lecciones del día..."
              className="w-full bg-secondary border border-border p-3 rounded-lg outline-none min-h-[100px] resize-none focus:border-primary"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={onComplete} className="flex-1">
            Completar Día
          </Button>
        </div>
      </div>
    </div>
  );
};
