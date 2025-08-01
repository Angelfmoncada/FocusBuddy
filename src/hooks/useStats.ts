import { useMemo } from 'react';
import { useFocusStore } from '../store/useFocusStore';
import { getDateRangeForPeriod, type StatsPeriod } from '../utils/dateUtils';

/**
 * Custom hook for managing statistics data and calculations
 */
export const useStats = (period: StatsPeriod) => {
  const { getStatsForPeriod, clearAllStats } = useFocusStore();
  
  const stats = useMemo(() => {
    return getStatsForPeriod(period);
  }, [getStatsForPeriod, period]);
  
  const currentRange = useMemo(() => {
    return getDateRangeForPeriod(period);
  }, [period]);
  
  const isEmpty = useMemo(() => {
    return stats.sessions.length === 0;
  }, [stats.sessions.length]);
  
  const averages = useMemo(() => {
    if (stats.activeDays === 0) {
      return {
        avgFocusTimePerDay: 0,
        avgPomodorosPerDay: 0,
        avgTasksPerDay: 0
      };
    }
    
    return {
      avgFocusTimePerDay: Math.round(stats.focusTime / stats.activeDays),
      avgPomodorosPerDay: Math.round(stats.totalPomodoros / stats.activeDays),
      avgTasksPerDay: Math.round(stats.tasksCompleted / stats.activeDays)
    };
  }, [stats]);
  
  const handleClearStats = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todas las estadísticas? Esta acción no se puede deshacer.')) {
      clearAllStats();
      return true;
    }
    return false;
  };
  
  return {
    stats,
    currentRange,
    isEmpty,
    averages,
    clearStats: handleClearStats
  };
};

/**
 * Hook for getting quick stats summary
 */
export const useQuickStats = () => {
  const { getStatsForPeriod } = useFocusStore();
  
  const todayStats = useMemo(() => {
    return getStatsForPeriod('daily');
  }, [getStatsForPeriod]);
  
  const weekStats = useMemo(() => {
    return getStatsForPeriod('weekly');
  }, [getStatsForPeriod]);
  
  return {
    today: todayStats,
    week: weekStats
  };
};