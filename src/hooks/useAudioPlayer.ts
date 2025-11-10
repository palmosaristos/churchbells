import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

interface AudioOptions {
  audioUrl: string;
  traditionName?: string;  // Pour previews UI (toast optional)
  type?: 'bell' | 'prayer';  // Pour volumes persistants (cloches/prayers)
  volume?: number;  // Override, défaut persistant
  isScheduled?: boolean;  // Silent pour timed plays (no toast)
}

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>("");
  const volumesRef = useRef<Record<string, number>>({ bell: 0.7, prayer: 0.7 });  // Cache persistant

  // Load/save volume persistant
  const getVolume = useCallback((type: 'bell' | 'prayer' | 'general', override?: number): number => {
    if (override !== undefined) return override;
    const key = type === 'general' ? 'generalVolume' : `${type}Volume`;
    const saved = localStorage.getItem(key);
    const vol = parseFloat(saved || '0.7');
    volumesRef.current[type] = vol;
    return vol;
  }, []);

  const setVolume = useCallback((volume: number, type: 'bell' | 'prayer' | 'general' = 'general') => {
    if (type !== 'general') volumesRef.current[type] = Math.max(0, Math.min(1, volume));
    const key = type === 'general' ? 'generalVolume' : `${type}Volume`;
    localStorage.setItem(key, volume.toString());
  }, []);

  // Toggle amélioré (play/pause/resume, no reset si même)
  const toggleAudio = useCallback(async (options: AudioOptions) => {
    const { audioUrl, traditionName, type = 'general', volume: overrideVol, isScheduled = false } = options;

    try {
      const effectiveVol = getVolume(type, overrideVol);

      // Si même URL - toggle play/pause
      if (audioRef.current && currentAudioUrl === audioUrl) {
        if (isPlaying) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          setIsPlaying(false);
          // Garder currentAudioUrl pour permettre replay
          return;
        } else {
          // Replay depuis le début
          audioRef.current.currentTime = 0;
          audioRef.current.volume = effectiveVol;
          await audioRef.current.play();
          setIsPlaying(true);
          return;
        }
      }

      // Stop previous avec cleanup complet
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = '';
        audioRef.current = null;
      }

      // New audio (preload pour start immédiat)
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
        if (import.meta.env.DEV) console.error("Audio error:", e);
        setIsPlaying(false);
        setCurrentAudioUrl("");
        // Retry 1x pour scheduled (silent)
        if (!isScheduled) {
          toast.error("Unable to play audio sample");
        }
      };

      await audio.play();
      setIsPlaying(true);

      // Toast seulement pour previews manuelles (no disrupt pour scheduled cloches/prayers)
      if (traditionName && !isScheduled) {
        toast.success(`Listening to ${traditionName}`, {
          duration: 2000, // Auto-dismiss après 2s
        });
      }

      if (import.meta.env.DEV && isScheduled) {
        console.log(`Scheduled play: ${audioUrl} (type: ${type}, vol: ${effectiveVol}) at ${new Date().toISOString()}`);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error("Toggle error:", error);
      setIsPlaying(false);
      setCurrentAudioUrl("");
      if (!isScheduled) {
        toast.error("Unable to play audio sample");
      }
    }
  }, [getVolume, isPlaying, currentAudioUrl]);

  // Cleanup global avec stop complet (no leaks, no errors au changement de page)
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.src = '';
          audioRef.current = null;
        } catch (e) {
          // Ignore errors during cleanup
          if (import.meta.env.DEV) console.log("Audio cleanup:", e);
        }
      }
      setIsPlaying(false);
      setCurrentAudioUrl("");
    };
  }, []);

  return { 
    toggleAudio, 
    isPlaying, 
    currentAudioUrl,
    setVolume  // Expose pour UI settings (persistant)
  };
};
