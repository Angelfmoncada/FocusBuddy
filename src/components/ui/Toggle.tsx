import { motion } from 'framer-motion';
import { type LucideProps } from 'lucide-react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient';
  label?: string;
  description?: string;
  icon?: React.ComponentType<LucideProps>;
  checkedIcon?: React.ComponentType<LucideProps>;
  uncheckedIcon?: React.ComponentType<LucideProps>;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  variant = 'default',
  label,
  description,
  icon: Icon,
  checkedIcon: CheckedIcon,
  uncheckedIcon: UncheckedIcon,
  className = ''
}: ToggleProps) {
  const sizeClasses = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
      icon: 'w-2.5 h-2.5'
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
      icon: 'w-3 h-3'
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
      icon: 'w-4 h-4'
    }
  };
  
  const variantClasses = {
    default: {
      track: checked 
        ? 'bg-blue-500' 
        : 'bg-slate-600',
      thumb: 'bg-white shadow-lg'
    },
    gradient: {
      track: checked 
        ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500' 
        : 'bg-slate-600',
      thumb: 'bg-white shadow-lg'
    }
  };
  
  const sizes = sizeClasses[size];
  const variants = variantClasses[variant];
  
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };
  
  const CurrentIcon = Icon || (checked ? CheckedIcon : UncheckedIcon);
  
  return (
    <div className={`flex items-center ${className}`}>
      {/* Toggle Switch */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={handleToggle}
        className={`
          relative inline-flex items-center 
          ${sizes.track} 
          rounded-full transition-colors duration-200 ease-in-out 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900
          ${variants.track}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <motion.div
          className={`
            inline-block ${sizes.thumb} rounded-full ${variants.thumb}
            flex items-center justify-center
          `}
          animate={{
            x: checked ? sizes.translate.replace('translate-x-', '') : '0'
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {CurrentIcon && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
              key={checked ? 'checked' : 'unchecked'}
            >
              <CurrentIcon className={`${sizes.icon} text-slate-600`} />
            </motion.div>
          )}
        </motion.div>
      </button>
      
      {/* Label and Description */}
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label 
              className="text-sm font-medium text-slate-200 cursor-pointer"
              onClick={handleToggle}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Checkbox-style toggle
interface CheckboxToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient';
  className?: string;
}

export function CheckboxToggle({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  size = 'md',
  variant = 'default',
  className = ''
}: CheckboxToggleProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const variantClasses = {
    default: checked 
      ? 'bg-blue-500 border-blue-500' 
      : 'bg-transparent border-slate-400',
    gradient: checked 
      ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500 border-transparent' 
      : 'bg-transparent border-slate-400'
  };
  
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };
  
  return (
    <div className={`flex items-start ${className}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={handleToggle}
        className={`
          ${sizeClasses[size]} 
          border-2 rounded transition-all duration-200
          flex items-center justify-center
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900
          ${variantClasses[variant]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
        `}
      >
        <motion.svg
          className="w-3 h-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: checked ? 1 : 0, 
            opacity: checked ? 1 : 0 
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M5 13l4 4L19 7" 
          />
        </motion.svg>
      </button>
      
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label 
              className="text-sm font-medium text-slate-200 cursor-pointer"
              onClick={handleToggle}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Toggle group for multiple options
interface ToggleGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
    icon?: React.ComponentType<LucideProps>;
    disabled?: boolean;
  }>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient';
  className?: string;
}

export function ToggleGroup({
  value,
  onValueChange,
  options,
  size = 'md',
  variant = 'default',
  className = ''
}: ToggleGroupProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  
  return (
    <div className={`inline-flex rounded-lg glass p-1 ${className}`}>
      {options.map((option) => {
        const isSelected = value === option.value;
        const isDisabled = option.disabled;
        
        return (
          <motion.button
            key={option.value}
            type="button"
            disabled={isDisabled}
            onClick={() => !isDisabled && onValueChange(option.value)}
            className={`
              ${sizeClasses[size]}
              rounded-md font-medium transition-all duration-200
              flex items-center gap-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-slate-800
              ${
                isSelected
                  ? variant === 'gradient'
                    ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500 text-white shadow-lg'
                    : 'bg-blue-500 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            whileHover={!isDisabled && !isSelected ? { scale: 1.02 } : undefined}
            whileTap={!isDisabled ? { scale: 0.98 } : undefined}
          >
            {option.icon && (
              <option.icon className={iconSizes[size]} />
            )}
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
}