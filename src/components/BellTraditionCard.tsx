import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, Check } from "lucide-react";

interface BellTraditionCardProps {
  title: string;
  image: string;
  isSelected: boolean;
  onSelect: () => void;
  onPlay: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isPlaying: boolean;
}

export const BellTraditionCard = ({ 
  title, 
  image, 
  isSelected, 
  onSelect, 
  onPlay,
  volume,
  onVolumeChange,
  isPlaying
}: BellTraditionCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg animate-fade-in-up ${
        isSelected 
          ? 'ring-4 ring-amber-400 shadow-sacred bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200/50 dark:border-amber-800/30' 
          : 'bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/30 dark:border-amber-800/20 hover:from-amber-50/70 hover:to-orange-50/70 dark:hover:from-amber-950/25 dark:hover:to-orange-950/25'
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Sélectionner ${title}, ${isSelected ? 'actuellement sélectionné' : 'non sélectionné'}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
            <img 
              src={image} 
              alt={title}
              className="w-14 h-14 object-contain"
            />
          </div>
          
          <div className="flex-1 space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
              className="w-full justify-center gap-2 font-cinzel shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
              aria-label={`Écouter le son de ${title}`}
            >
              <Volume2 className="w-4 h-4" />
              {isPlaying ? "Stop" : "Listen"}
            </Button>
            
            <div 
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={[volume]}
                onValueChange={(value) => onVolumeChange(value[0])}
                className="flex-1"
                aria-label={`Adjust volume for ${title}`}
              />
              <span className="text-sm font-cormorant text-muted-foreground w-10 text-right">{Math.round(volume * 100)}%</span>
            </div>
          </div>

          {isSelected && (
            <div className="flex-shrink-0 ml-2">
              <div className="w-12 h-12 rounded-full bg-[hsl(33,92%,49%)] flex items-center justify-center">
                <Check className="w-7 h-7 text-white" strokeWidth={3} />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};