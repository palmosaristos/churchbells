import { BellTraditionCard } from "@/components/BellTraditionCard";
import { bellTraditions } from "@/data/bellTraditions";
import churchBellTransparent from "@/assets/church-bell-transparent.png";
import churchBellNew from "@/assets/church-bell-new.png";
import carillonBells from "@/assets/carillon-bells.png";

interface BellSoundSelectionProps {
  selectedBellTradition: string;
  onSelect: (id: string) => void;
  onPlay: (id: string) => void;
}

export const BellSoundSelection = ({ 
  selectedBellTradition, 
  onSelect, 
  onPlay 
}: BellSoundSelectionProps) => {
  const getBellImage = (id: string) => {
    if (id === 'carillon-bell') return carillonBells;
    if (id === 'village-bell') return churchBellTransparent;
    return churchBellNew;
  };

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h2 className="text-3xl font-cormorant font-bold text-foreground mb-1">
          Choose Your Bell Sound
        </h2>
      </div>
      
      <div className="grid gap-3 md:grid-cols-3 max-w-3xl mx-auto">
        {bellTraditions.map(tradition => (
          <BellTraditionCard
            key={tradition.id}
            title={tradition.name}
            image={getBellImage(tradition.id)}
            isSelected={selectedBellTradition === tradition.id}
            onSelect={() => onSelect(tradition.id)}
            onPlay={() => onPlay(tradition.id)}
          />
        ))}
      </div>
    </div>
  );
};
