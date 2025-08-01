import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Circle, AlertCircle, Search } from 'lucide-react';
import { useFocusStore } from '../../store/useFocusStore';
import { AddTaskModal } from './AddTaskModal';
import { TaskFilters } from './TaskFilters';
import { ProgressRing } from '../ui/ProgressRing';
import { TaskItem } from './TaskItem';
import { ToastContainer } from '../ui/Toast';
import { useToast } from '../../hooks/useToast';

type FilterType = 'all' | 'active' | 'completed';
type PriorityFilter = 'all' | 'high' | 'normal';

export const TaskBoard = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useFocusStore();
  const { toasts, removeToast, success, error } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activePriority, setActivePriority] = useState<PriorityFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  // Filter tasks based on active filters and search
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by status
    if (activeFilter === 'active') {
      filtered = filtered.filter(task => !task.completed);
    } else if (activeFilter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }

    // Filter by priority
    if (activePriority !== 'all') {
      filtered = filtered.filter(task => task.priority === activePriority);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [tasks, activeFilter, activePriority, searchQuery]);

  // Calculate progress
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTaskTitle.trim();
    
    if (!trimmedTitle) return;
    
    // Check for duplicate tasks
    const existingTask = tasks.find(task => 
      task.title.toLowerCase() === trimmedTitle.toLowerCase()
    );
    
    if (existingTask) {
      setIsDuplicate(true);
      error('Task already exists!', 'Please choose a different task name.');
      setTimeout(() => setIsDuplicate(false), 2000);
      return;
    }
    
    setIsAdding(true);
    
    try {
      addTask({
        title: trimmedTitle,
        priority: 'normal'
      });
      setNewTaskTitle('');
      setIsDuplicate(false);
      success('Task added!', `"${trimmedTitle}" has been added to your list.`);
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setTimeout(() => setIsAdding(false), 300);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center mb-8"
      >
        <div className="text-center">
          <ProgressRing 
            progress={progressPercentage} 
            size={120} 
            strokeWidth={8}
            className="mb-4"
          />
          <div className="space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {completedTasks} of {totalTasks} tasks completed
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {progressPercentage}% progress
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 rounded-xl p-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-white/5 dark:bg-slate-700/50 border border-white/10 dark:border-slate-600/50 rounded-lg pl-10 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
          />
        </div>
      </motion.div>

      {/* Task Filters */}
      <TaskFilters
        activeFilter={activeFilter}
        activePriority={activePriority}
        onFilterChange={setActiveFilter}
        onPriorityChange={setActivePriority}
      />

      {/* Quick Add Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add New Task
          </h3>
          {/* Active Tasks Counter */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-blue-500/20 dark:bg-blue-400/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
          >
            <Circle className="w-3 h-3" />
            {tasks.filter(task => !task.completed).length} active
          </motion.div>
        </div>
        
        <form onSubmit={handleQuickAdd} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className={`w-full bg-white/5 dark:bg-slate-700/50 border rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                isDuplicate 
                  ? 'border-red-500 focus:ring-red-500 dark:focus:ring-red-400' 
                  : 'border-white/10 dark:border-slate-600/50 focus:ring-blue-500 dark:focus:ring-blue-400'
              }`}
              disabled={isAdding}
            />
            {isDuplicate && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -bottom-6 left-0 text-red-500 dark:text-red-400 text-sm"
              >
                Task already exists!
              </motion.p>
            )}
          </div>
          
          <div className="flex gap-3">
            <motion.button
              type="submit"
              disabled={!newTaskTitle.trim() || isAdding}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className="flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isAdding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Task
                </>
              )}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setIsModalOpen(true)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              title="Advanced options"
            >
              <AlertCircle className="w-4 h-4" />
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                {tasks.length === 0 
                  ? 'Add your first task above to get started with your productivity journey.'
                  : 'Try adjusting your filters or search query to find tasks.'
                }
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Task Summary */}
      {tasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 dark:bg-slate-800/30 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 rounded-xl p-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-mono font-bold text-blue-500 dark:text-blue-400">
                {totalTasks}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            </div>
            <div>
              <p className="text-2xl font-mono font-bold text-green-500 dark:text-green-400">
                {completedTasks}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-mono font-bold text-orange-500 dark:text-orange-400">
                {totalTasks - completedTasks}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
            </div>
            <div>
              <p className="text-2xl font-mono font-bold text-purple-500 dark:text-purple-400">
                {filteredTasks.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Filtered</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};