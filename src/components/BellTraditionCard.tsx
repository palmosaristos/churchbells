import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, Play } from "lucide-react";

interface BellTraditionCardProps {
  title: string;
  description: string;
  tradition: string;
  isSelected: boolean;
  onSelect: () => void;
  onPlay: () => void;
}

export const BellTraditionCard = ({ 
  title, 
  description, 
  tradition, 
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
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-serif">{title}</CardTitle>
          <Badge variant={isSelected ? "default" : "secondary"} className="font-medium">
            {tradition}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
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
          Listen to Sample
        </Button>
      </CardContent>
    </Card>
  );
};