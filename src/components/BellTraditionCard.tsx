import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface BellTraditionCardProps {
  title: string;
  image: string;
  isSelected: boolean;
  onSelect: () => void;
  onPlay: () => void;
}

export const BellTraditionCard = ({ 
  title, 
  image, 
  isSelected, 
  onSelect, 
  onPlay 
}: BellTraditionCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg animate-fade-in-up ${
        isSelected 
          ? 'ring-2 ring-amber-400 shadow-sacred bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200/50 dark:border-amber-800/30' 
          : 'bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/30 dark:border-amber-800/20 hover:from-amber-50/70 hover:to-orange-50/70 dark:hover:from-amber-950/25 dark:hover:to-orange-950/25'
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Sélectionner ${title}, ${isSelected ? 'actuellement sélectionné' : 'non sélectionné'}`}
    >
      <CardContent className="p-4 flex flex-row items-center justify-between gap-4">
        <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
          <img 
            src={image} 
            alt={title}
            className="w-14 h-14 object-contain"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          className="flex-1 justify-center gap-2 hover:bg-primary/10 font-cormorant text-xl text-foreground"
          aria-label={`Écouter le son de ${title}`}
        >
          <Play className="w-5 h-5" />
          Listen
        </Button>
      </CardContent>
    </Card>
  );
};