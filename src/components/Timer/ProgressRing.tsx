import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  isActive?: boolean;
  mode?: 'focus' | 'shortBreak' | 'longBreak';
}

export function ProgressRing({
  progress,
  size = 200,
  strokeWidth = 8,
  className = '',
  children,
  isActive = false,
  mode = 'focus'
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Color schemes for different modes
  const colorSchemes = {
    focus: {
      track: 'stroke-slate-700/30',
      progress: 'stroke-blue-500',
      glow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]'
    },
    shortBreak: {
      track: 'stroke-slate-700/30',
      progress: 'stroke-green-500',
      glow: 'drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]'
    },
    longBreak: {
      track: 'stroke-slate-700/30',
      progress: 'stroke-purple-500',
      glow: 'drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]'
    }
  };

  const colors = colorSchemes[mode];

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="relative"
        animate={{
          scale: isActive ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 0.6,
          repeat: isActive ? Infinity : 0,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      >
        <svg
          width={size}
          height={size}
          className={`transform -rotate-90 ${isActive ? colors.glow : ''}`}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={colors.track}
            strokeWidth={strokeWidth}
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={colors.progress}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut'
            }}
          />
          
          {/* Glow effect for active state */}
          {isActive && (
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              className={colors.progress}
              strokeWidth={strokeWidth + 2}
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              opacity={0.3}
              animate={{
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          )}
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </motion.div>
      
      {/* Completion animation */}
      {progress >= 100 && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-fuchsia-500/20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 0.8,
            ease: 'easeOut'
          }}
        />
      )}
    </div>
  );
}

// Preset sizes for common use cases
export function ProgressRingLarge(props: Omit<ProgressRingProps, 'size'>) {
  return <ProgressRing {...props} size={240} strokeWidth={10} />;
}

export function ProgressRingMedium(props: Omit<ProgressRingProps, 'size'>) {
  return <ProgressRing {...props} size={160} strokeWidth={6} />;
}

export function ProgressRingSmall(props: Omit<ProgressRingProps, 'size'>) {
  return <ProgressRing {...props} size={80} strokeWidth={4} />;
}