import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';
import type { DailyStats } from '../../store/useFocusStore';
import { formatFocusTime } from '../../utils/dateUtils';

interface StatsChartProps {
  sessions: DailyStats[];
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semester';
}

export const StatsChart: React.FC<StatsChartProps> = ({ sessions, period }) => {
  if (sessions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-12 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/20 dark:border-gray-700/20 backdrop-blur-sm"
      >
        <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No Data Available
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Start completing Pomodoros and tasks to see your progress here.
        </p>
      </motion.div>
    );
  }

  const maxFocusMinutes = Math.max(...sessions.map(s => s.focusMinutes));
  const maxPomodoros = Math.max(...sessions.map(s => s.pomodorosCompleted));
  const maxTasks = Math.max(...sessions.map(s => s.tasksCompleted));

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    switch (period) {
      case 'daily':
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      case 'weekly':
      case 'monthly':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'quarterly':
      case 'semester':
        return date.toLocaleDateString('en-US', { month: 'short' });
      default:
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Chart Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 rounded-lg">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Progress Overview
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Daily breakdown of your focus sessions
          </p>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/20 dark:border-gray-700/20 backdrop-blur-sm p-6">
        <div className="space-y-8">
          {/* Focus Time Chart */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Focus Time
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatFocusTime(sessions.reduce((sum, s) => sum + s.focusMinutes, 0))} total
              </span>
            </div>
            <div className="flex items-end gap-2 h-24">
              {sessions.map((session, index) => {
                const height = maxFocusMinutes > 0 ? (session.focusMinutes / maxFocusMinutes) * 100 : 0;
                return (
                  <motion.div
                    key={`focus-${session.date}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                    className="flex-1 min-w-0 group relative"
                  >
                    <div className="h-full bg-gradient-to-t from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500 rounded-t-md hover:from-blue-600 hover:to-blue-500 dark:hover:from-blue-500 dark:hover:to-blue-400 transition-colors cursor-pointer" />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {formatFocusTime(session.focusMinutes)}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center truncate">
                      {formatDateLabel(session.date)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Pomodoros Chart */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Pomodoros Completed
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {sessions.reduce((sum, s) => sum + s.pomodorosCompleted, 0)} total
              </span>
            </div>
            <div className="flex items-end gap-2 h-20">
              {sessions.map((session, index) => {
                const height = maxPomodoros > 0 ? (session.pomodorosCompleted / maxPomodoros) * 100 : 0;
                return (
                  <motion.div
                    key={`pomodoros-${session.date}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.6, ease: "easeOut" }}
                    className="flex-1 min-w-0 group relative"
                  >
                    <div className="h-full bg-gradient-to-t from-green-500 to-green-400 dark:from-green-600 dark:to-green-500 rounded-t-md hover:from-green-600 hover:to-green-500 dark:hover:from-green-500 dark:hover:to-green-400 transition-colors cursor-pointer" />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {session.pomodorosCompleted} pomodoros
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Tasks Chart */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tasks Completed
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {sessions.reduce((sum, s) => sum + s.tasksCompleted, 0)} total
              </span>
            </div>
            <div className="flex items-end gap-2 h-16">
              {sessions.map((session, index) => {
                const height = maxTasks > 0 ? (session.tasksCompleted / maxTasks) * 100 : 0;
                return (
                  <motion.div
                    key={`tasks-${session.date}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.1 + 0.4, duration: 0.6, ease: "easeOut" }}
                    className="flex-1 min-w-0 group relative"
                  >
                    <div className="h-full bg-gradient-to-t from-purple-500 to-purple-400 dark:from-purple-600 dark:to-purple-500 rounded-t-md hover:from-purple-600 hover:to-purple-500 dark:hover:from-purple-500 dark:hover:to-purple-400 transition-colors cursor-pointer" />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {session.tasksCompleted} tasks
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};