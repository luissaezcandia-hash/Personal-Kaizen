import React from 'react';
import { Sunrise } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MorningRitualProps {
  onSelect: (selection: string) => void;
}

export const MorningRitual: React.FC<MorningRitualProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-md">
      <div className="max-w-sm w-full space-y-6 text-center animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto py-4">
        <Sunrise className="w-16 h-16 text-yellow-500 mx-auto" />
        <div>
          <h2 className="text-2xl font-bold mb-2">Filtro de Arranque</h2>
          <p className="text-muted-foreground">Para desbloquear el sistema, define tu enfoque.</p>
        </div>
        <div className="space-y-4 pt-4">
          <div className="text-left mb-2">
            <label className="text-sm font-bold text-muted-foreground">Selecciona tu objetivo principal:</label>
          </div>
          <Button
            onClick={() => onSelect('Plus Gráfica')}
            className="w-full py-8 rounded-xl text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
          >
            Avance en Plus Gráfica
          </Button>
          <Button
            onClick={() => onSelect('Tesis')}
            className="w-full py-8 rounded-xl text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
          >
            Avance en Tesis
          </Button>
          <Button
            onClick={() => onSelect('Otro')}
            variant="outline"
            className="w-full py-6 rounded-xl text-sm font-bold border-dashed"
          >
            Otro enfoque crítico
          </Button>
        </div>
      </div>
    </div>
  );
};
