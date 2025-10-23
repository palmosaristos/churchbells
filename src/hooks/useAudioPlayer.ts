import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export const useAudioPlayer = () => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>("");

  const toggleAudio = async (audioUrl: string, traditionName?: string) => {
    try {
      // Si on arrête le son en cours
      if (isPlaying && audioRef.current && currentAudioUrl === audioUrl) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        return;
      }

      // Si on change de son ou on démarre
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setCurrentAudioUrl(audioUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
      };

      await audio.play();
      setIsPlaying(true);
      
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
      setIsPlaying(false);
    }
  };

  return { toggleAudio, isPlaying, currentAudioUrl };
};
