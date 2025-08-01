import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
  color?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  className = '',
  showPercentage = true,
  color
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Dynamic color based on progress
  const getProgressColor = () => {
    if (color) return color;
    
    if (progress >= 80) return '#10b981'; // green-500
    if (progress >= 60) return '#3b82f6'; // blue-500
    if (progress >= 40) return '#f59e0b'; // amber-500
    if (progress >= 20) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };

  const progressColor = getProgressColor();

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ 
            duration: 1.5, 
            ease: 'easeOut',
            delay: 0.2
          }}
          style={{
            filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))'
          }}
        />
      </svg>
      
      {/* Center content */}
      {showPercentage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl font-mono font-bold text-gray-900 dark:text-white"
            style={{ color: progressColor }}
          >
            {Math.round(progress)}%
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
            className="text-xs text-gray-500 dark:text-gray-400 font-medium"
          >
            Complete
          </motion.span>
        </div>
      )}
    </div>
  );
};