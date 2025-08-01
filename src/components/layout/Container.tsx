import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
}

export function Container({ 
  children, 
  className = '', 
  maxWidth = '7xl',
  padding = 'lg',
  center = true 
}: ContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };
  
  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-4 sm:px-6 lg:px-8 py-6',
    xl: 'px-6 sm:px-8 lg:px-12 py-8'
  };
  
  return (
    <div className={`
      ${maxWidthClasses[maxWidth]} 
      ${center ? 'mx-auto' : ''} 
      ${paddingClasses[padding]} 
      ${className}
    `}>
      {children}
    </div>
  );
}

// Page wrapper with animations
interface PageContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function PageContainer({ 
  children, 
  className = '',
  title,
  description 
}: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`min-h-screen ${className}`}
    >
      <Container>
        {(title || description) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            {title && (
              <h1 className="text-4xl font-bold gradient-text mb-2">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-slate-400 text-lg">
                {description}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </Container>
    </motion.div>
  );
}

// Card container with glassmorphism
interface CardContainerProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

export function CardContainer({ 
  children, 
  className = '',
  padding = 'lg',
  hover = false 
}: CardContainerProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };
  
  return (
    <motion.div
      className={`
        glass rounded-xl shadow-xl 
        ${paddingClasses[padding]} 
        ${hover ? 'hover:bg-slate-800/60 transition-all duration-300' : ''}
        ${className}
      `}
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

// Grid container for responsive layouts
interface GridContainerProps {
  children: ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function GridContainer({ 
  children, 
  columns = { sm: 1, md: 2, lg: 3 },
  gap = 'md',
  className = '' 
}: GridContainerProps) {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10'
  };
  
  const getGridCols = () => {
    const classes = ['grid'];
    
    if (columns.sm) classes.push(`grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    
    return classes.join(' ');
  };
  
  return (
    <div className={`${getGridCols()} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

// Flex container with common patterns
interface FlexContainerProps {
  children: ReactNode;
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  wrap?: boolean;
  className?: string;
}

export function FlexContainer({ 
  children, 
  direction = 'row',
  align = 'start',
  justify = 'start',
  gap = 'md',
  wrap = false,
  className = '' 
}: FlexContainerProps) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col'
  };
  
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };
  
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };
  
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };
  
  return (
    <div className={`
      flex 
      ${directionClasses[direction]} 
      ${alignClasses[align]} 
      ${justifyClasses[justify]} 
      ${gapClasses[gap]} 
      ${wrap ? 'flex-wrap' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}

// Section container with consistent spacing
interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

export function SectionContainer({ 
  children, 
  className = '',
  spacing = 'lg' 
}: SectionContainerProps) {
  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
    xl: 'space-y-12'
  };
  
  return (
    <section className={`${spacingClasses[spacing]} ${className}`}>
      {children}
    </section>
  );
}