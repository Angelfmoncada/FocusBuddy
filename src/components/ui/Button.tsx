import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { type LucideProps } from 'lucide-react';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDragStart' | 'onDrop' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ComponentType<LucideProps>;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';
  
  const variantClasses = {
    primary: 'btn-primary focus:ring-blue-500',
    secondary: 'btn-secondary focus:ring-slate-500',
    ghost: 'text-slate-300 hover:text-white hover:bg-slate-700/50 focus:ring-slate-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/25 focus:ring-red-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
    xl: 'px-8 py-4 text-lg gap-3'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };
  
  const isDisabled = disabled || loading;
  
  return (
    <motion.button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={`border-2 border-current border-t-transparent rounded-full ${iconSizes[size]}`}
          />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={iconSizes[size]} />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon className={iconSizes[size]} />
          )}
        </>
      )}
    </motion.button>
  );
}

// Icon button variant
interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDragStart' | 'onDrop' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  icon: React.ComponentType<LucideProps>;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  tooltip?: string;
}

export function IconButton({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  loading = false,
  tooltip,
  className = '',
  disabled,
  ...props
}: IconButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500 text-white hover:shadow-glow focus:ring-blue-500',
    secondary: 'glass text-white hover:bg-slate-800/60 focus:ring-slate-500',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-700/50 focus:ring-slate-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
  };
  
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const isDisabled = disabled || loading;
  
  return (
    <motion.button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      whileHover={!isDisabled ? { scale: 1.1 } : undefined}
      whileTap={!isDisabled ? { scale: 0.9 } : undefined}
      disabled={isDisabled}
      title={tooltip}
      {...props}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={`border-2 border-current border-t-transparent rounded-full ${iconSizes[size]}`}
        />
      ) : (
        <Icon className={iconSizes[size]} />
      )}
    </motion.button>
  );
}

// Button group for related actions
interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md';
}

export function ButtonGroup({
  children,
  className = '',
  orientation = 'horizontal',
  spacing = 'sm'
}: ButtonGroupProps) {
  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  };
  
  const spacingClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4'
  };
  
  return (
    <div className={`
      flex 
      ${orientationClasses[orientation]} 
      ${spacingClasses[spacing]} 
      ${className}
    `}>
      {children}
    </div>
  );
}

// Floating action button
interface FABProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDragStart' | 'onDrop' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  icon: React.ComponentType<LucideProps>;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'md' | 'lg';
  tooltip?: string;
}

export function FloatingActionButton({
  icon: Icon,
  position = 'bottom-right',
  size = 'lg',
  tooltip,
  className = '',
  ...props
}: FABProps) {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };
  
  const sizeClasses = {
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  };
  
  const iconSizes = {
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };
  
  return (
    <motion.button
      className={`
        ${positionClasses[position]}
        ${sizeClasses[size]}
        bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500
        text-white rounded-full shadow-2xl hover:shadow-glow-lg
        flex items-center justify-center
        transition-all duration-300 z-50
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', duration: 0.5 }}
      title={tooltip}
      {...props}
    >
      <Icon className={iconSizes[size]} />
    </motion.button>
  );
}