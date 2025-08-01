import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import type { StatsPeriod } from '../../utils/dateUtils';

interface StatsFilterProps {
  selectedPeriod: StatsPeriod;
  onPeriodChange: (period: StatsPeriod) => void;
  currentLabel: string;
}

const periodOptions: Array<{
  value: StatsPeriod;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    value: 'daily',
    label: 'Daily',
    icon: Clock,
    description: 'Today\'s progress'
  },
  {
    value: 'weekly',
    label: 'Weekly',
    icon: Calendar,
    description: 'This week\'s summary'
  },
  {
    value: 'monthly',
    label: 'Monthly',
    icon: TrendingUp,
    description: 'Monthly overview'
  },
  {
    value: 'quarterly',
    label: 'Quarterly',
    icon: BarChart3,
    description: 'Quarterly insights'
  },
  {
    value: 'semester',
    label: 'Semester',
    icon: BarChart3,
    description: 'Semester analysis'
  }
];

export const StatsFilter: React.FC<StatsFilterProps> = ({
  selectedPeriod,
  onPeriodChange,
  currentLabel
}) => {
  return (
    <div className="space-y-6">
      {/* Current Period Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 border border-blue-200/20 dark:border-blue-700/20 rounded-full backdrop-blur-sm">
          <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {currentLabel}
          </span>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20">
        {periodOptions.map((option, index) => {
          const Icon = option.icon;
          const isSelected = selectedPeriod === option.value;
          
          return (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPeriodChange(option.value)}
              className={`
                relative flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200
                ${isSelected
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10 dark:shadow-blue-400/10'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }
              `}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-400/5 dark:to-purple-400/5 rounded-lg border border-blue-200/20 dark:border-blue-700/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-500 dark:text-blue-400' : ''}`} />
              
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">
                  {option.label}
                </span>
                <span className="text-xs opacity-70">
                  {option.description}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};