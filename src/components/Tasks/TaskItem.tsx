import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { CheckCircle2, Circle, Trash2, Clock, Check, Edit2, Save, X } from 'lucide-react';
import { useFocusStore, type Task } from '../../store/useFocusStore';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const { editTask } = useFocusStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const scale = useTransform(x, [-150, 0, 150], [0.9, 1, 0.9]);
  const deleteOpacity = useTransform(x, [-150, -50, 0], [1, 0.7, 0]);
  const completeOpacity = useTransform(x, [0, 50, 150], [0, 0.7, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      // Swipe right - complete task
      if (!task.completed) {
        onToggle();
      }
    } else if (info.offset.x < -threshold) {
      // Swipe left - delete task
      handleDelete();
    }
    
    // Reset position
    x.set(0);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete();
    }, 300);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(task.title);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle.trim() !== task.title) {
      editTask(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Validate date
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return dateObj.toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-pink-500 dark:bg-pink-400';
      case 'normal':
      default:
        return 'bg-blue-500 dark:bg-blue-400';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isDeleting ? 0 : 1, 
        y: isDeleting ? -20 : 0,
        scale: isDeleting ? 0.9 : 1
      }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Background Actions */}
      <div className="absolute inset-0 flex items-center justify-between px-6 rounded-xl overflow-hidden">
        {/* Delete Action (Left) */}
        <motion.div
          style={{ opacity: deleteOpacity }}
          className="flex items-center gap-2 text-red-500 dark:text-red-400"
        >
          <Trash2 className="w-5 h-5" />
          <span className="font-medium">Delete</span>
        </motion.div>
        
        {/* Complete Action (Right) */}
        <motion.div
          style={{ opacity: completeOpacity }}
          className="flex items-center gap-2 text-green-500 dark:text-green-400"
        >
          <span className="font-medium">Complete</span>
          <CheckCircle2 className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Task Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x, opacity, scale }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative z-10 bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg 
          border border-white/10 dark:border-slate-700/50 rounded-xl p-4 
          cursor-pointer transition-all duration-200
          ${task.completed ? 'opacity-60' : ''}
        `}
      >
        <div className="flex items-center gap-4">
          {/* Checkbox */}
          <motion.button
            onClick={onToggle}
            whileTap={{ scale: 0.9 }}
            className="flex-shrink-0"
          >
            {task.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-500 dark:text-green-400" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
            )}
          </motion.button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              {/* Priority Tag */}
              <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
              
              {/* Task Title or Edit Input */}
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onBlur={handleSaveEdit}
                  autoFocus
                  className="flex-1 bg-white/10 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/50 rounded px-2 py-1 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              ) : (
                <h3 className={`
                  font-medium text-gray-900 dark:text-white truncate flex-1
                  ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}
                `}>
                  {task.title}
                </h3>
              )}
            </div>
            
            {/* Task Meta */}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{formatDate(task.createdAt)}</span>
              <span className="capitalize">{task.priority} priority</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <motion.button
                  onClick={handleSaveEdit}
                  whileTap={{ scale: 0.9 }}
                  className="flex-shrink-0 p-2 text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors"
                >
                  <Save className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={handleCancelEdit}
                  whileTap={{ scale: 0.9 }}
                  className="flex-shrink-0 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  onClick={handleEdit}
                  whileTap={{ scale: 0.9 }}
                  className="flex-shrink-0 p-2 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={handleDelete}
                  whileTap={{ scale: 0.9 }}
                  className="flex-shrink-0 p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Skeleton loader for task items
export function TaskItemSkeleton() {
  return (
    <div className="glass rounded-lg p-4 animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 bg-slate-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-slate-700 rounded w-3/4"></div>
          <div className="h-3 bg-slate-700 rounded w-1/2"></div>
        </div>
        <div className="w-8 h-8 bg-slate-700 rounded"></div>
      </div>
    </div>
  );
}

// Empty state component
export function TasksEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-fuchsia-500/20 flex items-center justify-center">
        <Check className="w-12 h-12 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        No tasks yet
      </h3>
      <p className="text-slate-400 max-w-sm mx-auto">
        Add your first task to get started with your focused work sessions.
      </p>
    </motion.div>
  );
}