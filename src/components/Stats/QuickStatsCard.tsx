import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, Calendar, TrendingUp } from 'lucide-react';
import { useQuickStats } from '../../hooks/useStats';
import { formatFocusTime } from '../../utils/dateUtils';

interface QuickStatsCardProps {
  className?: string;
}

export const QuickStatsCard: React.FC<QuickStatsCardProps> = ({ className = '' }) => {
  const { today, week } = useQuickStats();

  const stats = [
    {
      icon: Clock,
      label: 'Today Focus',
      value: formatFocusTime(today.focusTime),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Target,
      label: 'Pomodoros',
      value: today.totalPomodoros.toString(),
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: Calendar,
      label: 'Tasks Done',
      value: today.tasksCompleted.toString(),
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: TrendingUp,
      label: 'Week Focus',
      value: formatFocusTime(week.focusTime),
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 p-4 rounded-xl hover:bg-white/20 dark:hover:bg-slate-800/70 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {stat.label}
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white font-mono">
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};