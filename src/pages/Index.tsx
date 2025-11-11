import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

interface AudioOptions {
  audioUrl: string;
  traditionName?: string;
  type?: 'bell' | 'prayer' | 'general';
  volume?: number;
  isScheduled?: boolean;
}

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>("");
  const volumesRef = useRef<Record<string, number>>({ 
    bell: 0.7, 
    prayer: 0.7,
    general: 0.7 
  });

  // CORRECTION : Récupération robuste du volume
  const getVolume = useCallback((type: 'bell' | 'prayer' | 'general' = 'general', override?: number): number => {
    if (override !== undefined) return Math.max(0, Math.min(1, override));
    
    const key = type === 'general' ? 'generalVolume' : `${type}BellVolume`;
    const saved = localStorage.getItem(key);
    const vol = saved ? parseFloat(saved) : 0.7;
    
    volumesRef.current[type] = vol;
    return vol;
  }, []);

  // CORRECTION : Sauvegarde du volume avec validation
  const setVolume = useCallback((volume: number, type: 'bell' | 'prayer' | 'general' = 'general') => {
    const clampedVol = Math.max(0, Math.min(1, volume));
    volumesRef.current[type] = clampedVol;
    
    const key = type === 'general' ? 'generalVolume' : `${type}BellVolume`;
    localStorage.setItem(key, clampedVol.toString());
    
    // Mettre à jour le canal audio actif si en cours de lecture
    if (audioRef.current && isPlaying) {
      audioRef.current.volume = clampedVol;
    }
  }, [isPlaying]);

  // CORRECTION : Toggle avec gestion d'erreurs complète
  const toggleAudio = useCallback(async (options: AudioOptions) => {
    const { audioUrl, traditionName, type = 'general', volume: overrideVol, isScheduled = false } = options;

    // Validation de l'URL
    if (!audioUrl || !audioUrl.startsWith('/audio/')) {
      console.error('Invalid audio URL:', audioUrl);
      if (!isScheduled) {
        toast.error("Audio file not found");
      }
      return;
    }

    try {
      const effectiveVol = getVolume(type, overrideVol);

      // Si même URL et en cours de lecture - stop
      if (audioRef.current && currentAudioUrl === audioUrl && isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setCurrentAudioUrl("");
        return;
      }

      // Stop complet de l'audio précédent
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.src = '';
        } catch (e) {
          console.warn('Error stopping previous audio:', e);
        }
        audioRef.current = null;
      }

      // Nouvel élément audio avec préchargement
      const audio = new Audio(audioUrl);
      audio.preload = 'auto';
      audio.volume = effectiveVol;
      audioRef.current = audio;
      setCurrentAudioUrl(audioUrl);

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudioUrl("");
      };
      
      audio.onerror = (e) => {
        console.error("Audio error:", e);
        setIsPlaying(false);
        setCurrentAudioUrl("");
        
        // Retry silencieux pour les sons programmés
        if (isScheduled) {
          setTimeout(() => {
            if (audioRef.current === audio) {
              audio.play().catch(() => {});
            }
          }, 1000);
        } else {
          toast.error("Unable to play audio sample");
        }
      };

      await audio.play();
      setIsPlaying(true);

      // Toast uniquement pour les prévisions manuelles
      if (traditionName && !isScheduled) {
        toast.success(`Listening to ${traditionName}`, {
          duration: 2000,
          icon: '🔔'
        });
      }

      if (import.meta.env.DEV && isScheduled) {
        console.log(`🔔 Scheduled play: ${audioUrl} (type: ${type}, vol: ${effectiveVol}) at ${new Date().toISOString()}`);
      }
    } catch (error) {
      console.error("❌ Toggle error:", error);
      setIsPlaying(false);
      setCurrentAudioUrl("");
      
      if (!isScheduled) {
        toast.error("Unable to play audio sample");
      }
    }
  }, [getVolume, isPlaying, currentAudioUrl]);

  // CORRECTION : Cleanup complet sans erreurs
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.src = '';
        } catch (e) {
          console.log("Audio cleanup:", e);
        }
        audioRef.current = null;
      }
      setIsPlaying(false);
      setCurrentAudioUrl("");
    };
  }, []);

  return { 
    toggleAudio, 
    isPlaying, 
    currentAudioUrl,
    setVolume,
    getVolume
  };
};
