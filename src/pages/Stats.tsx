import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Target, Calendar, Trash2 } from 'lucide-react';
import { StatsFilter } from '../components/Stats/StatsFilter';
import { StatsChart } from '../components/Stats/StatsChart';
import { useStats } from '../hooks/useStats';
import { formatFocusTime, type StatsPeriod } from '../utils/dateUtils';

export const Stats = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<StatsPeriod>('weekly');
  const { stats, currentRange, clearStats } = useStats(selectedPeriod);

  const statCards = [
    {
      title: 'Focus Time',
      value: formatFocusTime(stats.focusTime),
      icon: Clock,
      color: 'blue',
      description: 'Total time focused'
    },
    {
      title: 'Pomodoros',
      value: stats.totalPomodoros.toString(),
      icon: Target,
      color: 'green',
      description: 'Sessions completed'
    },
    {
      title: 'Tasks Done',
      value: stats.tasksCompleted.toString(),
      icon: BarChart3,
      color: 'purple',
      description: 'Tasks completed'
    },
    {
      title: 'Active Days',
      value: stats.activeDays.toString(),
      icon: Calendar,
      color: 'orange',
      description: 'Days with activity'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-8 pb-8"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Statistics & Analytics
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300 mb-6"
          >
            Track your productivity and focus patterns over time
          </motion.p>
          
          {/* Clear Stats Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={clearStats}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Stats
          </motion.button>
        </div>

        {/* Stats Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <StatsFilter
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            currentLabel={currentRange.label}
          />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((card, index) => {
            const Icon = card.icon;
            const colorClasses = {
              blue: 'from-blue-500/10 to-blue-600/10 dark:from-blue-400/10 dark:to-blue-500/10 border-blue-200/20 dark:border-blue-700/20 text-blue-600 dark:text-blue-400',
              green: 'from-green-500/10 to-green-600/10 dark:from-green-400/10 dark:to-green-500/10 border-green-200/20 dark:border-green-700/20 text-green-600 dark:text-green-400',
              purple: 'from-purple-500/10 to-purple-600/10 dark:from-purple-400/10 dark:to-purple-500/10 border-purple-200/20 dark:border-purple-700/20 text-purple-600 dark:text-purple-400',
              orange: 'from-orange-500/10 to-orange-600/10 dark:from-orange-400/10 dark:to-orange-500/10 border-orange-200/20 dark:border-orange-700/20 text-orange-600 dark:text-orange-400'
            };
            
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`
                  p-6 bg-gradient-to-br ${colorClasses[card.color as keyof typeof colorClasses]} 
                  border backdrop-blur-sm rounded-2xl hover:shadow-lg transition-all duration-200
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[card.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <StatsChart sessions={stats.sessions} period={selectedPeriod} />
        </motion.div>
      </div>
    </motion.div>
  );
}