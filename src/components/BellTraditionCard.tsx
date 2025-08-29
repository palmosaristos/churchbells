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
          ? 'ring-2 ring-primary shadow-sacred bg-gradient-subtle' 
          : 'hover:bg-accent/50'
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 flex items-center justify-center border border-amber-200/30 dark:border-amber-700/30">
          <img 
            src={image} 
            alt={title}
            className="w-16 h-16 object-contain"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          className="w-full justify-center gap-2 hover:bg-primary/10"
        >
          <Play className="w-4 h-4" />
          Listen
        </Button>
      </CardContent>
    </Card>
  );
};