import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Target } from 'lucide-react';
import { useStats } from '../../hooks/useStats';
import { formatFocusTime } from '../../utils/dateUtils';

interface WeeklyProgressProps {
  className?: string;
}

export const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ className = '' }) => {
  const { stats, currentRange, averages } = useStats('weekly');
  
  const progressData = [
    {
      label: 'Focus Time',
      value: formatFocusTime(stats.focusTime),
      average: `${formatFocusTime(averages.avgFocusTimePerDay)}/day`,
      icon: Clock,
      color: 'bg-blue-500'
    },
    {
      label: 'Pomodoros',
      value: stats.totalPomodoros.toString(),
      average: `${averages.avgPomodorosPerDay}/day`,
      icon: Target,
      color: 'bg-green-500'
    },
    {
      label: 'Active Days',
      value: stats.activeDays.toString(),
      average: `${Math.round((stats.activeDays / 7) * 100)}% week`,
      icon: Calendar,
      color: 'bg-purple-500'
    }
  ];
  
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxFocusTime = Math.max(...stats.sessions.map(s => s.focusMinutes), 1);
  
  return (
    <div className={`bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 p-6 rounded-xl ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Weekly Progress
        </h3>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {currentRange.start.toLocaleDateString()} - {currentRange.end.toLocaleDateString()}
        </span>
      </div>
      
      {/* Progress Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {progressData.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <div className={`p-2 rounded-lg ${item.color}/20`}>
                  <Icon className={`w-4 h-4 ${item.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white font-mono">
                {item.value}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {item.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {item.average}
              </p>
            </motion.div>
          );
        })}
      </div>
      
      {/* Weekly Chart */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Daily Focus Time
        </h4>
        <div className="flex items-end justify-between gap-1 h-20">
          {weekDays.map((day, index) => {
            const dayData = stats.sessions.find(s => {
              const sessionDate = new Date(s.date);
              return sessionDate.getDay() === (index + 1) % 7;
            });
            
            const height = dayData ? (dayData.focusMinutes / maxFocusTime) * 100 : 0;
            
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm min-h-[2px] relative group"
                >
                  {dayData && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatFocusTime(dayData.focusMinutes)}
                    </div>
                  )}
                </motion.div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};