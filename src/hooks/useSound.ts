import { useRef, useCallback } from 'react';

interface UseSoundOptions {
  volume?: number;
  playbackRate?: number;
  loop?: boolean;
  preload?: boolean;
}

interface SoundControls {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  isPlaying: () => boolean;
  duration: () => number;
  currentTime: () => number;
  seek: (time: number) => void;
}

export function useSound(
  src: string,
  options: UseSoundOptions = {}
): SoundControls {
  const {
    volume = 1,
    playbackRate = 1,
    loop = false,
    preload = true
  } = options;
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.loop = loop;
      
      if (preload) {
        audioRef.current.preload = 'auto';
      }
    }
    return audioRef.current;
  }, [src, volume, playbackRate, loop, preload]);
  
  const play = useCallback(async (): Promise<void> => {
    try {
      const audio = getAudio();
      audio.currentTime = 0; // Reset to beginning
      await audio.play();
    } catch (error) {
      console.warn('Failed to play sound:', error);
      // Silently fail - audio might be blocked by browser policy
    }
  }, [getAudio]);
  
  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
    }
  }, []);
  
  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);
  
  const setVolume = useCallback((newVolume: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, newVolume));
    }
  }, []);
  
  const setPlaybackRate = useCallback((rate: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = Math.max(0.25, Math.min(4, rate));
    }
  }, []);
  
  const isPlaying = useCallback((): boolean => {
    const audio = audioRef.current;
    return audio ? !audio.paused && !audio.ended : false;
  }, []);
  
  const duration = useCallback((): number => {
    const audio = audioRef.current;
    return audio ? audio.duration || 0 : 0;
  }, []);
  
  const currentTime = useCallback((): number => {
    const audio = audioRef.current;
    return audio ? audio.currentTime : 0;
  }, []);
  
  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, Math.min(audio.duration || 0, time));
    }
  }, []);
  
  return {
    play,
    pause,
    stop,
    setVolume,
    setPlaybackRate,
    isPlaying,
    duration,
    currentTime,
    seek
  };
}

// Hook for notification sounds with built-in fallbacks
export function useNotificationSound() {
  // Create a simple notification sound using Web Audio API as fallback
  const createBeepSound = useCallback(async () => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      // Clean up
      setTimeout(() => {
        audioContext.close();
      }, 1000);
    } catch {
      console.warn('Failed to create beep sound');
    }
  }, []);
  
  const playNotification = useCallback(async () => {
    // Try to play a custom notification sound first
    try {
      // TODO: Add custom notification sound file
      // const audio = new Audio('/sounds/notification.mp3');
      // await audio.play();
      
      // For now, use the beep sound as fallback
      await createBeepSound();
    } catch {
      // If all else fails, try system notification
      try {
        await createBeepSound();
      } catch {
        console.warn('All notification sound methods failed');
      }
    }
  }, [createBeepSound]);
  
  return { playNotification };
}

// Hook for managing multiple sounds
export function useSoundManager() {
  const soundsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  
  const loadSound = useCallback((id: string, src: string, options: UseSoundOptions = {}) => {
    const audio = new Audio(src);
    audio.volume = options.volume ?? 1;
    audio.playbackRate = options.playbackRate ?? 1;
    audio.loop = options.loop ?? false;
    
    if (options.preload) {
      audio.preload = 'auto';
    }
    
    soundsRef.current.set(id, audio);
    return audio;
  }, []);
  
  const playSound = useCallback(async (id: string): Promise<void> => {
    const audio = soundsRef.current.get(id);
    if (audio) {
      try {
        audio.currentTime = 0;
        await audio.play();
      } catch (error) {
        console.warn(`Failed to play sound '${id}':`, error);
      }
    }
  }, []);
  
  const stopSound = useCallback((id: string) => {
    const audio = soundsRef.current.get(id);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);
  
  const stopAllSounds = useCallback(() => {
    soundsRef.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);
  
  const removeSound = useCallback((id: string) => {
    const audio = soundsRef.current.get(id);
    if (audio) {
      audio.pause();
      soundsRef.current.delete(id);
    }
  }, []);
  
  const setGlobalVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    soundsRef.current.forEach((audio) => {
      audio.volume = clampedVolume;
    });
  }, []);
  
  return {
    loadSound,
    playSound,
    stopSound,
    stopAllSounds,
    removeSound,
    setGlobalVolume
  };
}