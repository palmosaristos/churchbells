import { BellTraditionCard } from "@/components/BellTraditionCard";
import { bellTraditions } from "@/data/bellTraditions";
import churchBellTransparent from "@/assets/church-bell-transparent.png";
import churchBellNew from "@/assets/church-bell-new.png";
import carillonBells from "@/assets/carillon-bells.png";

interface BellSoundSelectionProps {
  selectedBellTradition: string;
  onSelect: (id: string) => void;
  onPlay: (id: string) => void;
  bellVolumes: Record<string, number>;
  onVolumeChange: (bellId: string, volume: number) => void;
  isPlaying: boolean;
  currentAudioUrl: string;
}

export const BellSoundSelection = ({ 
  selectedBellTradition, 
  onSelect, 
  onPlay,
  bellVolumes,
  onVolumeChange,
  isPlaying,
  currentAudioUrl
}: BellSoundSelectionProps) => {
  const getBellImage = (id: string) => {
    if (id === 'carillon-bell') return carillonBells;
    if (id === 'village-bell') return churchBellTransparent;
    return churchBellNew;
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
        {bellTraditions.map(tradition => (
          <BellTraditionCard
            key={tradition.id}
            title={tradition.name}
            image={getBellImage(tradition.id)}
            isSelected={selectedBellTradition === tradition.id}
            onSelect={() => onSelect(tradition.id)}
            onPlay={() => onPlay(tradition.id)}
            volume={bellVolumes[tradition.id] || 0.7}
            onVolumeChange={(volume) => onVolumeChange(tradition.id, volume)}
            isPlaying={isPlaying && currentAudioUrl === tradition.audioSample}
          />
        ))}
      </div>
    </div>
  );
};
