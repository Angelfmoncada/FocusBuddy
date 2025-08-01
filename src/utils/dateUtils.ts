// Date utilities for statistics calculations

export interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

export type StatsPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semester';

/**
 * Get the current week range (Monday to Sunday)
 */
export const getCurrentWeekRange = (): DateRange => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  const startStr = monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  return {
    start: monday,
    end: sunday,
    label: `${startStr} - ${endStr}`
  };
};

/**
 * Get the current month range
 */
export const getCurrentMonthRange = (): DateRange => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  
  const label = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return { start, end, label };
};

/**
 * Get the current quarter range
 */
export const getCurrentQuarterRange = (): DateRange => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
  
  const start = new Date(today.getFullYear(), quarterStartMonth, 1);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(today.getFullYear(), quarterStartMonth + 3, 0);
  end.setHours(23, 59, 59, 999);
  
  const quarterNumber = Math.floor(currentMonth / 3) + 1;
  const label = `Q${quarterNumber} ${today.getFullYear()}`;
  
  return { start, end, label };
};

/**
 * Get the current semester range (Jan-Jun or Jul-Dec)
 */
export const getCurrentSemesterRange = (): DateRange => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const isFirstSemester = currentMonth < 6;
  
  const start = new Date(today.getFullYear(), isFirstSemester ? 0 : 6, 1);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(today.getFullYear(), isFirstSemester ? 6 : 12, 0);
  end.setHours(23, 59, 59, 999);
  
  const semesterName = isFirstSemester ? 'First' : 'Second';
  const label = `${semesterName} Semester ${today.getFullYear()}`;
  
  return { start, end, label };
};

/**
 * Get today's range
 */
export const getTodayRange = (): DateRange => {
  const today = new Date();
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);
  
  const label = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return { start, end, label };
};

/**
 * Get date range based on period
 */
export const getDateRangeForPeriod = (period: StatsPeriod): DateRange => {
  switch (period) {
    case 'daily':
      return getTodayRange();
    case 'weekly':
      return getCurrentWeekRange();
    case 'monthly':
      return getCurrentMonthRange();
    case 'quarterly':
      return getCurrentQuarterRange();
    case 'semester':
      return getCurrentSemesterRange();
    default:
      return getTodayRange();
  }
};

/**
 * Check if a date is within a range
 */
export const isDateInRange = (date: Date | string, range: DateRange): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj >= range.start && dateObj <= range.end;
};

/**
 * Format date to YYYY-MM-DD string
 */
export const formatDateToString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Get active days count (days with at least 1 pomodoro)
 */
export const getActiveDaysCount = (sessions: Array<{ date: string; pomodorosCompleted: number }>): number => {
  return sessions.filter(session => session.pomodorosCompleted > 0).length;
};

/**
 * Calculate total focus time in hours and minutes
 */
export const formatFocusTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}m`;
  }
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};