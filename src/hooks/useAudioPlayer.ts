import { useToast } from "@/hooks/use-toast";

export const useAudioPlayer = () => {
  const { toast } = useToast();

  const playAudio = async (audioUrl: string, traditionName?: string) => {
    try {
      const audio = new Audio(audioUrl);
      await audio.play();
      
      if (traditionName) {
        toast({
          title: "Playing Sample",
          description: `Listening to ${traditionName}`,
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error playing audio:", error);
      }
      toast({
        title: "Playback Error",
        description: "Unable to play audio sample",
        variant: "destructive",
      });
    }
  };

  return { playAudio };
};
