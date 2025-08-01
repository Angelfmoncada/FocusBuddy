import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, AlertCircle, Target } from 'lucide-react';
import { useFocusStore } from '../../store/useFocusStore';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const { addTask } = useFocusStore();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high'>('normal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    
    try {
      addTask({
        title: title.trim(),
        priority
      });
      
      // Reset form
      setTitle('');
      setPriority('normal');
      onClose();
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setPriority('normal');
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white/10 dark:bg-slate-800/90 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Add New Task
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Create a task to boost your productivity
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={handleClose}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Task Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your task..."
                    className="w-full bg-white/5 dark:bg-slate-700/50 border border-white/10 dark:border-slate-600/50 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    autoFocus
                    required
                  />
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Priority Level
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Normal Priority */}
                    <motion.button
                      type="button"
                      onClick={() => setPriority('normal')}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        p-4 rounded-lg border-2 transition-all duration-200 text-left
                        ${priority === 'normal'
                          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-4 h-4 bg-blue-500 dark:bg-blue-400 rounded-full" />
                        <Target className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        Normal
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Standard priority task
                      </p>
                    </motion.button>

                    {/* High Priority */}
                    <motion.button
                      type="button"
                      onClick={() => setPriority('high')}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        p-4 rounded-lg border-2 transition-all duration-200 text-left
                        ${priority === 'high'
                          ? 'border-pink-500 dark:border-pink-400 bg-pink-50 dark:bg-pink-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-4 h-4 bg-pink-500 dark:bg-pink-400 rounded-full" />
                        <AlertCircle className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        High
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Important & urgent
                      </p>
                    </motion.button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={!title.trim() || isSubmitting}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
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
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};