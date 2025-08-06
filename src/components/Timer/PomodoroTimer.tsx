import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain, Clock } from 'lucide-react';
import { useFocusStore, useTimerProgress } from '../../store/useFocusStore';
import { ProgressRingLarge } from './ProgressRing';

export function PomodoroTimer() {
  const {
    mode,
    status,
    timeLeft,
    currentSession,
    pomodorosCompleted,
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    soundOption,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    tick
  } = useFocusStore();
  
  const progress = useTimerProgress();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isVibrating, setIsVibrating] = useState(false);
  
  // Timer tick effect
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, tick]);
  
  // Play notification sound
  const playNotificationSound = useCallback(() => {
    try {
      const soundFile = `/assets/sounds/${soundOption || 'bell'}.mp3`;
      const audio = new Audio(soundFile);
      audio.volume = 0.7;
      audio.play().catch(() => {
        // Fallback: use a simple beep or do nothing
        console.log('Audio notification not available');
      });
    } catch {
      console.log('Audio notification not available');
    }
  }, [soundOption]);
  
  // Sound notification and vibration when timer completes
  useEffect(() => {
    if (timeLeft === 0) {
      // Play notification sound
      playNotificationSound();
      
      // Trigger vibration animation
      setIsVibrating(true);
      setTimeout(() => setIsVibrating(false), 1000);
      
      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`${mode === 'focus' ? 'Focus' : 'Break'} session completed!`, {
          body: mode === 'focus' ? 'Time for a break!' : 'Ready to focus?',
          icon: '/vite.svg'
        });
      }
    }
  }, [timeLeft, mode, playNotificationSound]);
  
  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
  
  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get mode display info
  const getModeInfo = () => {
    switch (mode) {
      case 'focus':
        return {
          title: 'Focus Time',
          icon: Brain,
          description: 'Time to concentrate and get things done!'
        };
      case 'shortBreak':
        return {
          title: 'Short Break',
          icon: Coffee,
          description: 'Take a quick breather and recharge.'
        };
      case 'longBreak':
        return {
          title: 'Long Break',
          icon: Clock,
          description: 'Enjoy a longer break - you\'ve earned it!'
        };
    }
  };
  
  const modeInfo = getModeInfo();
  const ModeIcon = modeInfo.icon;
  
  const handleStartPause = () => {
    if (status === 'running') {
      pauseTimer();
    } else {
      startTimer();
    }
  };
  
  const handleReset = () => {
    resetTimer();
  };
  
  const handleModeSwitch = (newMode: typeof mode) => {
    switchMode(newMode);
  };
  
  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      {/* Mode selector */}
      <div className="flex space-x-2 p-1 glass rounded-lg">
        {(['focus', 'shortBreak', 'longBreak'] as const).map((modeOption) => {
          const isActive = mode === modeOption;
          const labels = {
            focus: 'Focus',
            shortBreak: 'Short Break',
            longBreak: 'Long Break'
          };
          
          return (
            <motion.button
              key={modeOption}
              onClick={() => handleModeSwitch(modeOption)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500 text-white shadow-glow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={status === 'running'}
            >
              {labels[modeOption]}
            </motion.button>
          );
        })}
      </div>
      
      {/* Timer display */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-3"
        >
          <ModeIcon className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold gradient-text">
            {modeInfo.title}
          </h1>
        </motion.div>
        
        <p className="text-slate-400 text-lg">
          {modeInfo.description}
        </p>
      </div>
      
      {/* Progress ring with timer */}
      <motion.div 
        className="relative"
        animate={isVibrating ? {
          scale: [1, 1.05, 1],
          boxShadow: [
            '0 0 0 rgba(59, 130, 246, 0)',
            '0 0 30px rgba(59, 130, 246, 0.5)',
            '0 0 0 rgba(59, 130, 246, 0)'
          ]
        } : {}}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <ProgressRingLarge
          progress={progress}
          isActive={status === 'running'}
          mode={mode}
          className="drop-shadow-2xl"
        >
          <div className="text-center">
            <div className="text-5xl font-mono font-bold text-white text-shadow">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-slate-400 mt-2">
              Cycle {currentSession}
            </div>
          </div>
        </ProgressRingLarge>
      </motion.div>
      
      {/* Control buttons */}
      <div className="flex items-center space-x-4">
        <motion.button
          onClick={handleStartPause}
          className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {status === 'running' ? (
            <>
              <Pause className="w-6 h-6" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              <span>{status === 'paused' ? 'Resume' : 'Start'}</span>
            </>
          )}
        </motion.button>
        
        <motion.button
          onClick={handleReset}
          className="btn-secondary flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset</span>
        </motion.button>
      </div>
      
      {/* Stats display */}
      <div className="flex items-center space-x-8 text-center">
        <div className="space-y-1">
          <div className="text-2xl font-bold font-mono gradient-text">
            {pomodorosCompleted}
          </div>
          <div className="text-sm text-slate-400">
            Completed
          </div>
        </div>
        
        <div className="w-px h-12 bg-slate-700"></div>
        
        <div className="space-y-1">
          <div className="text-2xl font-bold font-mono gradient-text">
            {Math.floor(pomodorosCompleted * (focusDuration || 25) / 60)}h {(pomodorosCompleted * (focusDuration || 25)) % 60}m
          </div>
          <div className="text-sm text-slate-400">
            Focus Time
          </div>
        </div>
      </div>
      
      {/* Session info */}
      <motion.div
        className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 rounded-xl p-6 max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          How Pomodoro Works
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          Work for {focusDuration || 25} minutes, then take a {shortBreakDuration || 5}-minute break. After 4 cycles, 
          enjoy a longer {longBreakDuration || 15}-minute break. This technique helps maintain focus 
          and prevents burnout.
        </p>
      </motion.div>
    </div>
  );
}