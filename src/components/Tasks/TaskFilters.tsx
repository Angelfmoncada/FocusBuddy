import React from 'react';
import { motion } from 'framer-motion';
import { Filter, CheckCircle2, Circle, AlertTriangle, Clock } from 'lucide-react';
import { useFocusStore } from '../../store/useFocusStore';

type FilterType = 'all' | 'active' | 'completed';
type PriorityFilter = 'all' | 'high' | 'normal';

interface TaskFiltersProps {
  activeFilter: FilterType;
  activePriority: PriorityFilter;
  onFilterChange: (filter: FilterType) => void;
  onPriorityChange: (priority: PriorityFilter) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  activeFilter,
  activePriority,
  onFilterChange,
  onPriorityChange
}) => {
  const { tasks } = useFocusStore();
  
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(task => !task.completed).length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;

  const filterOptions = [
    {
      key: 'all' as FilterType,
      label: 'All',
      count: totalTasks,
      icon: Filter,
      color: 'text-blue-500 dark:text-blue-400'
    },
    {
      key: 'active' as FilterType,
      label: 'Active',
      count: activeTasks,
      icon: Circle,
      color: 'text-orange-500 dark:text-orange-400'
    },
    {
      key: 'completed' as FilterType,
      label: 'Completed',
      count: completedTasks,
      icon: CheckCircle2,
      color: 'text-green-500 dark:text-green-400'
    }
  ];

  const priorityOptions = [
    {
      key: 'all' as PriorityFilter,
      label: 'All Priority',
      count: totalTasks,
      icon: Filter,
      color: 'text-gray-500 dark:text-gray-400'
    },
    {
      key: 'high' as PriorityFilter,
      label: 'High',
      count: highPriorityTasks,
      icon: AlertTriangle,
      color: 'text-red-500 dark:text-red-400'
    },
    {
      key: 'normal' as PriorityFilter,
      label: 'Normal',
      count: totalTasks - highPriorityTasks,
      icon: Clock,
      color: 'text-blue-500 dark:text-blue-400'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-4"
    >
      {/* Status Filters */}
      <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 rounded-xl p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter by Status
        </h3>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => {
            const Icon = option.icon;
            const isActive = activeFilter === option.key;
            
            return (
              <motion.button
                key={option.key}
                onClick={() => onFilterChange(option.key)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-500 dark:bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-white/5 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-slate-700/70'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : option.color}`} />
                <span>{option.label}</span>
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-mono
                  ${isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }
                `}>
                  {option.count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Priority Filters */}
      <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 rounded-xl p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Filter by Priority
        </h3>
        <div className="flex flex-wrap gap-2">
          {priorityOptions.map((option) => {
            const Icon = option.icon;
            const isActive = activePriority === option.key;
            
            return (
              <motion.button
                key={option.key}
                onClick={() => onPriorityChange(option.key)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-purple-500 dark:bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
                    : 'bg-white/5 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-slate-700/70'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : option.color}`} />
                <span>{option.label}</span>
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-mono
                  ${isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }
                `}>
                  {option.count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};