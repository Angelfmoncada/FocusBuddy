import { motion } from 'framer-motion';
import { useFocusStore } from '../../store/useFocusStore';
import { Clock, Target, Zap, Calendar } from 'lucide-react';

export const WeeklyStats = () => {
  const { getWeeklyStats, pomodorosCompleted, getCompletedTasksCount } = useFocusStore();
  const weeklyData = getWeeklyStats();

  // Calculate totals for the week
  const totalFocusTime = weeklyData.reduce((sum, day) => sum + day.focusMinutes, 0);
  const activeDays = weeklyData.filter(day => day.focusMinutes > 0).length;
  
  // Get current totals
  const currentPomodoros = pomodorosCompleted;
  const currentCompletedTasks = getCompletedTasksCount();

  // Format time helper
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Get day name
  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Find max value for scaling bars
  const maxFocusTime = Math.max(...weeklyData.map(day => day.focusMinutes), 1);
  
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Focus Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-violet-500 dark:to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Weekly Focus
          </h3>
          <p className="text-xl font-mono font-bold text-gray-900 dark:text-white">
            {formatTime(totalFocusTime)}
          </p>
        </motion.div>

        {/* Pomodoros Completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300"
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-purple-500 dark:to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Total Pomodoros
          </h3>
          <p className="text-xl font-mono font-bold text-gray-900 dark:text-white">
            {currentPomodoros}
          </p>
        </motion.div>

        {/* Tasks Completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-pink-500 dark:to-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Tasks Completed
          </h3>
          <p className="text-xl font-mono font-bold text-gray-900 dark:text-white">
            {currentCompletedTasks}
          </p>
        </motion.div>

        {/* Active Days */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 rounded-xl p-6 text-center"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 dark:from-rose-500 dark:to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Active Days
          </h3>
          <p className="text-xl font-mono font-bold text-gray-900 dark:text-white">
            {activeDays}
          </p>
        </motion.div>
      </div>

      {/* Weekly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Weekly Focus Time
        </h3>
        
        <div className="space-y-4">
          {weeklyData.map((day, index) => {
            const barWidth = maxFocusTime > 0 ? (day.focusMinutes / maxFocusTime) * 100 : 0;
            
            return (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-4"
              >
                {/* Day Label */}
                <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {getDayName(day.date)}
                </div>
                
                {/* Bar Container */}
                <div className="flex-1 relative">
                  <div className="w-full h-8 bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-violet-500 dark:to-purple-500 rounded-lg"
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                  
                  {/* Time Label */}
                  {day.focusMinutes > 0 && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <span className="text-xs font-mono font-medium text-white bg-black/20 px-2 py-1 rounded">
                        {formatTime(day.focusMinutes)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Pomodoro Count */}
                <div className="w-20 text-right">
                  <div className="text-xs font-mono text-gray-600 dark:text-gray-400">
                    {day.pomodorosCompleted > 0 && (
                      <div>{day.pomodorosCompleted}🍅</div>
                    )}
                    {day.tasksCompleted > 0 && (
                      <div>{day.tasksCompleted}✓</div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Chart Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Last 7 days</span>
            <span>🍅 = Pomodoro sessions</span>
          </div>
        </div>
      </motion.div>

      {/* TODO: Monthly summary (future feature) */}
      {/* 
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Monthly Summary
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Coming soon: Monthly productivity insights and trends
        </p>
      </motion.div>
      */}
    </div>
  );
};