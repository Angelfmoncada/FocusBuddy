import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFocusStore } from '../../store/useFocusStore';
import { Clock, Volume2, RotateCcw, Save, Play, CheckCircle, Zap, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const SettingsPanel = () => {
  const {
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    autoStartBreaks,
    autoStartPomodoros,
    longBreakInterval,
    soundOption,
    updateSettings,
    resetToDefaults,
    clearAllStats
  } = useFocusStore();
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Local state for form inputs
  const [localSettings, setLocalSettings] = useState({
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    autoStartBreaks,
    autoStartPomodoros,
    longBreakInterval,
    soundOption
  });

  // Update local settings when store changes
  useEffect(() => {
    setLocalSettings({
      focusDuration,
      shortBreakDuration,
      longBreakDuration,
      autoStartBreaks,
      autoStartPomodoros,
      longBreakInterval,
      soundOption
    });
  }, [focusDuration, shortBreakDuration, longBreakDuration, autoStartBreaks, autoStartPomodoros, longBreakInterval, soundOption]);

  // Sound options
  const soundOptions = [
    { value: 'bell', label: 'Bell', file: '/assets/sounds/bell.mp3' },
    { value: 'chime', label: 'Chime', file: '/assets/sounds/chime.mp3' },
    { value: 'notification', label: 'Notification', file: '/assets/sounds/ding.mp3' }
  ];

  // Handle input changes
  const handleDurationChange = (key: 'focusDuration' | 'shortBreakDuration' | 'longBreakDuration', value: number) => {
    if (value >= 1 && value <= 120) {
      setLocalSettings(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleSoundChange = (soundOption: string) => {
    setLocalSettings(prev => ({
      ...prev,
      soundOption: soundOption as 'bell' | 'chime' | 'notification'
    }));
  };

  const handleAutoStartBreaksChange = (autoStartBreaks: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      autoStartBreaks
    }));
  };

  const handleAutoStartPomodorosChange = (autoStartPomodoros: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      autoStartPomodoros
    }));
  };

  const handleLongBreakIntervalChange = (longBreakInterval: number) => {
    if (longBreakInterval >= 2 && longBreakInterval <= 10) {
      setLocalSettings(prev => ({
        ...prev,
        longBreakInterval
      }));
    }
  };

  // Save settings
  const handleSave = () => {
    updateSettings(localSettings);
    showToastMessage('Settings saved successfully!');
  };

  // Reset to defaults
  const handleReset = () => {
    resetToDefaults();
    showToastMessage('Settings reset to defaults!');
  };

  // Clear all statistics
  const handleClearStats = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todas las estadísticas? Esta acción no se puede deshacer.')) {
      clearAllStats();
      showToastMessage('All statistics cleared successfully!');
    }
  };

  // Play sound preview
  const playSound = (soundFile: string) => {
    try {
      const audio = new Audio(soundFile);
      audio.volume = 0.5;
      audio.play().catch(() => {
        console.log('Audio preview not available');
      });
    } catch {
      console.log('Audio preview not available');
    }
  };

  // Show toast message
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Check if settings have changed
  const hasChanges = JSON.stringify(localSettings) !== JSON.stringify({
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    autoStartBreaks,
    autoStartPomodoros,
    longBreakInterval,
    soundOption
  });

  return (
    <div className="space-y-8">
      {/* Timer Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Timer Settings
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Customize your focus and break durations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Focus Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Focus Duration
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="120"
                value={localSettings.focusDuration}
                onChange={(e) => handleDurationChange('focusDuration', parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 bg-white/5 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              />
              <span className="absolute right-3 top-3 text-sm text-gray-500 dark:text-gray-400">
                min
              </span>
            </div>
          </div>

          {/* Short Break Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Short Break
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="30"
                value={localSettings.shortBreakDuration}
                onChange={(e) => handleDurationChange('shortBreakDuration', parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 bg-white/5 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              />
              <span className="absolute right-3 top-3 text-sm text-gray-500 dark:text-gray-400">
                min
              </span>
            </div>
          </div>

          {/* Long Break Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Long Break
            </label>
            <div className="relative">
              <input
                type="number"
                min="5"
                max="60"
                value={localSettings.longBreakDuration}
                onChange={(e) => handleDurationChange('longBreakDuration', parseInt(e.target.value) || 5)}
                className="w-full px-4 py-3 bg-white/5 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              />
              <span className="absolute right-3 top-3 text-sm text-gray-500 dark:text-gray-400">
                min
              </span>
            </div>
          </div>
        </div>

        {/* Long Break Interval */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Long Break Interval
          </label>
          <div className="relative max-w-xs">
            <input
              type="number"
              min="2"
              max="10"
              value={localSettings.longBreakInterval}
              onChange={(e) => handleLongBreakIntervalChange(parseInt(e.target.value) || 2)}
              className="w-full px-4 py-3 bg-white/5 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            />
            <span className="absolute right-3 top-3 text-sm text-gray-500 dark:text-gray-400">
              sessions
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Take a long break after this many focus sessions
          </p>
        </div>
      </motion.div>

      {/* Sound Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sound Settings
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose notification sounds
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {soundOptions.map((sound) => (
            <div
              key={sound.value}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                localSettings.soundOption === sound.value
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
              }`}
              onClick={() => handleSoundChange(sound.value)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">
                  {sound.label}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound(sound.file);
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Play className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              {localSettings.soundOption === sound.value && (
                <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-blue-500" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Automation Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Automation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Auto-start sessions and breaks
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Auto-start breaks */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Auto-start breaks
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically start break sessions
              </p>
            </div>
            <button
              onClick={() => handleAutoStartBreaksChange(!localSettings.autoStartBreaks)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.autoStartBreaks ? 'bg-blue-500' : 'bg-gray-200 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.autoStartBreaks ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Auto-start pomodoros */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Auto-start focus sessions
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically start focus sessions after breaks
              </p>
            </div>
            <button
              onClick={() => handleAutoStartPomodorosChange(!localSettings.autoStartPomodoros)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.autoStartPomodoros ? 'bg-blue-500' : 'bg-gray-200 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.autoStartPomodoros ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            icon={Save}
            className="flex-1"
          >
            Save Settings
          </Button>
          
          <Button
            onClick={handleReset}
            variant="secondary"
            icon={RotateCcw}
            className="flex-1"
          >
            Reset to Defaults
          </Button>
        </div>
        
        {/* Danger Zone */}
        <div className="border-t border-red-200/20 dark:border-red-700/20 pt-4">
          <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-200/20 dark:border-red-700/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                  Danger Zone
                </h4>
                <p className="text-xs text-red-600 dark:text-red-400 mb-3">
                  This action will permanently delete all your statistics and cannot be undone.
                </p>
                <Button
                  onClick={handleClearStats}
                  variant="secondary"
                  icon={Trash2}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-700"
                >
                  Clear All Statistics
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};