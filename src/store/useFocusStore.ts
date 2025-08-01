import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Local type definitions
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  priority: 'normal' | 'high';
}

export interface PomodoroSession {
  id: string;
  date: Date;
  focusMinutes: number;
  breakMinutes: number;
  completed: boolean;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD format
  focusMinutes: number;
  tasksCompleted: number;
  pomodorosCompleted: number;
}

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';
export type TimerStatus = 'idle' | 'running' | 'paused';
export type SoundOption = 'bell' | 'chime' | 'notification';
export type Theme = 'light' | 'dark';
import { 
  getDateRangeForPeriod, 
  isDateInRange, 
  formatDateToString, 
  getActiveDaysCount,
  type StatsPeriod 
} from '../utils/dateUtils';



// Store slices interfaces
interface ThemeSlice {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

interface TasksSlice {
  tasks: Task[];
  addTask: (task: { title: string; priority?: 'normal' | 'high' }) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, updates: Partial<Pick<Task, 'title' | 'priority'>>) => void;
  getCompletedTasksPercentage: () => number;
  getCompletedTasksCount: () => number;
}

interface TimerSlice {
  mode: TimerMode;
  status: TimerStatus;
  timeLeft: number;
  currentSession: number;
  totalSessions: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  switchMode: (mode: TimerMode) => void;
  tick: () => void;
}

interface TimerStatsSlice {
  dailyStats: DailyStats[];
  sessions: PomodoroSession[];
  pomodorosCompleted: number;
  addSession: (session: PomodoroSession) => void;
  updateDailyStats: (date: string, updates: Partial<DailyStats>) => void;
  incrementPomodoroCount: () => void;
  getWeeklyStats: () => DailyStats[];
  getStatsForPeriod: (period: StatsPeriod) => {
    focusTime: number;
    totalPomodoros: number;
    tasksCompleted: number;
    activeDays: number;
    sessions: DailyStats[];
  };
  clearAllStats: () => void;
  recordPomodoroCompletion: () => void;
  recordTaskCompletion: () => void;
}

interface SettingsSlice {
  focusDuration: number; // minutes
  shortBreakDuration: number; // minutes
  longBreakDuration: number; // minutes
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number; // after how many pomodoros
  soundOption: SoundOption;
  updateSettings: (settings: Partial<Omit<SettingsSlice, 'updateSettings' | 'resetToDefaults'>>) => void;
  resetToDefaults: () => void;
}

interface FocusStore extends ThemeSlice, TasksSlice, TimerSlice, TimerStatsSlice, SettingsSlice {}

// Default settings
const DEFAULT_SETTINGS = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  soundOption: 'bell' as SoundOption,
};

// Helper functions
const getTimerDuration = (mode: TimerMode, settings: SettingsSlice): number => {
  switch (mode) {
    case 'focus':
      return settings.focusDuration * 60;
    case 'shortBreak':
      return settings.shortBreakDuration * 60;
    case 'longBreak':
      return settings.longBreakDuration * 60;
    default:
      return DEFAULT_SETTINGS.focusDuration * 60;
  }
};

export const useFocusStore = create<FocusStore>()(persist(
  (set, get) => ({
    // Theme slice
    theme: 'light',
    toggleTheme: () => {
      const newTheme = get().theme === 'light' ? 'dark' : 'light';
      set({ theme: newTheme });
      // Apply theme to document
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setTheme: (theme: Theme) => {
      set({ theme });
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    
    // Tasks slice
    tasks: [],
    addTask: ({ title, priority = 'normal' }: { title: string; priority?: 'normal' | 'high' }) => {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: new Date(),
        priority,
      };
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    },
    toggleTask: (id: string) => {
      const currentTask = get().tasks.find(t => t.id === id);
      if (!currentTask) return;
      
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? new Date() : undefined,
              }
            : task
        ),
      }));
      
      // Update daily stats when task is completed
      if (!currentTask.completed) {
        get().recordTaskCompletion();
      }
    },
    deleteTask: (id: string) => {
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
    },
    editTask: (id: string, updates: Partial<Pick<Task, 'title' | 'priority'>>) => {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        ),
      }));
    },
    getCompletedTasksPercentage: () => {
      const { tasks } = get();
      if (tasks.length === 0) return 0;
      const completed = tasks.filter(task => task.completed).length;
      return Math.round((completed / tasks.length) * 100);
    },
    getCompletedTasksCount: () => {
      return get().tasks.filter((task) => task.completed).length;
    },
    
    // Timer slice
    mode: 'focus',
    status: 'idle',
    timeLeft: DEFAULT_SETTINGS.focusDuration * 60,
    currentSession: 1,
    totalSessions: 4,

    startTimer: () => {
      set({ status: 'running' });
    },

    pauseTimer: () => {
      set({ status: 'paused' });
    },

    resetTimer: () => {
      const state = get();
      const duration = getTimerDuration(state.mode, state);
      set({
        status: 'idle',
        timeLeft: duration,
      });
    },

    switchMode: (mode: TimerMode) => {
      const state = get();
      const duration = getTimerDuration(mode, state);
      set({
        mode,
        status: 'idle',
        timeLeft: duration,
      });
    },

    tick: () => {
      const state = get();
      if (state.status === 'running' && state.timeLeft > 0) {
        set({ timeLeft: state.timeLeft - 1 });
        
        // Timer completed
        if (state.timeLeft - 1 === 0) {
          const { mode, currentSession } = state;
          
          if (mode === 'focus') {
            // Record pomodoro completion
            get().recordPomodoroCompletion();
            
            const session: PomodoroSession = {
              id: crypto.randomUUID(),
              date: new Date(),
              focusMinutes: state.focusDuration,
              breakMinutes: 0,
              completed: true,
            };
            get().addSession(session);
            
            // Switch to break mode
            const isLongBreak = currentSession % state.longBreakInterval === 0;
            get().switchMode(isLongBreak ? 'longBreak' : 'shortBreak');
            
            if (state.autoStartBreaks) {
              get().startTimer();
            }
          } else {
            // Break completed, switch to focus
            get().switchMode('focus');
            
            if (state.autoStartPomodoros) {
              get().startTimer();
            }
          }
          
          // Play sound notification
          // TODO: Implement sound playing based on soundOption
        }
      }
    },
    
    // Timer Stats slice
    dailyStats: [],
    sessions: [],
    pomodorosCompleted: 0,
    addSession: (session: PomodoroSession) => {
      set((state) => ({
        sessions: [...state.sessions, session],
      }));
    },
    updateDailyStats: (date: string, updates: Partial<DailyStats>) => {
      set((state) => {
        const existingIndex = state.dailyStats.findIndex(stat => stat.date === date);
        
        if (existingIndex >= 0) {
          // Update existing stats
          const updatedStats = [...state.dailyStats];
          updatedStats[existingIndex] = {
            ...updatedStats[existingIndex],
            focusMinutes: (updatedStats[existingIndex].focusMinutes || 0) + (updates.focusMinutes || 0),
            tasksCompleted: (updatedStats[existingIndex].tasksCompleted || 0) + (updates.tasksCompleted || 0),
            pomodorosCompleted: (updatedStats[existingIndex].pomodorosCompleted || 0) + (updates.pomodorosCompleted || 0),
          };
          return { dailyStats: updatedStats };
        } else {
          // Create new stats entry
          const newStats: DailyStats = {
            date,
            focusMinutes: updates.focusMinutes || 0,
            tasksCompleted: updates.tasksCompleted || 0,
            pomodorosCompleted: updates.pomodorosCompleted || 0,
          };
          return { dailyStats: [...state.dailyStats, newStats] };
        }
      });
    },
    incrementPomodoroCount: () => {
      set((state) => ({
        pomodorosCompleted: state.pomodorosCompleted + 1,
        currentSession: state.currentSession + 1,
      }));
    },
    getWeeklyStats: () => {
      const { dailyStats } = get();
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      return dailyStats.filter(stat => {
        const statDate = new Date(stat.date);
        return statDate >= weekAgo && statDate <= today;
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
    
    getStatsForPeriod: (period: StatsPeriod) => {
      const { dailyStats } = get();
      const range = getDateRangeForPeriod(period);
      
      const filteredStats = dailyStats.filter(stat => 
        isDateInRange(stat.date, range)
      );
      
      const totals = filteredStats.reduce(
        (acc, stat) => ({
          focusTime: acc.focusTime + stat.focusMinutes,
          totalPomodoros: acc.totalPomodoros + stat.pomodorosCompleted,
          tasksCompleted: acc.tasksCompleted + stat.tasksCompleted,
        }),
        { focusTime: 0, totalPomodoros: 0, tasksCompleted: 0 }
      );
      
      return {
        ...totals,
        activeDays: getActiveDaysCount(filteredStats),
        sessions: filteredStats.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      };
    },
    
    clearAllStats: () => {
      set(() => ({
        dailyStats: [],
        sessions: [],
        pomodorosCompleted: 0,
      }));
    },
    
    recordPomodoroCompletion: () => {
      const today = formatDateToString(new Date());
      const { updateDailyStats, incrementPomodoroCount } = get();
      
      updateDailyStats(today, {
        focusMinutes: 25,
        pomodorosCompleted: 1,
      });
      
      incrementPomodoroCount();
    },
    
    recordTaskCompletion: () => {
      const today = formatDateToString(new Date());
      const { updateDailyStats } = get();
      
      updateDailyStats(today, {
        tasksCompleted: 1,
      });
    },
    
    // Settings slice
    ...DEFAULT_SETTINGS,
    updateSettings: (settings) => {
      set((state) => ({ ...state, ...settings }));
      
      // If timer durations changed and timer is idle, update timeLeft
      const currentState = get();
      if (currentState.status === 'idle') {
        const newDuration = getTimerDuration(currentState.mode, currentState);
        set({ timeLeft: newDuration });
      }
    },
    resetToDefaults: () => {
      set((state) => ({ ...state, ...DEFAULT_SETTINGS }));
      
      // Reset timer if idle
      const currentState = get();
      if (currentState.status === 'idle') {
        const newDuration = getTimerDuration(currentState.mode, currentState);
        set({ timeLeft: newDuration });
      }
    },
  }),
  {
    name: 'focus-buddy-storage',
    partialize: (state) => ({
      // Persist all slices except timer state
      theme: state.theme,
      tasks: state.tasks,
      dailyStats: state.dailyStats,
      sessions: state.sessions,
      pomodorosCompleted: state.pomodorosCompleted,
      focusDuration: state.focusDuration,
      shortBreakDuration: state.shortBreakDuration,
      longBreakDuration: state.longBreakDuration,
      autoStartBreaks: state.autoStartBreaks,
      autoStartPomodoros: state.autoStartPomodoros,
      longBreakInterval: state.longBreakInterval,
      soundOption: state.soundOption,
    }),
    onRehydrateStorage: () => (state) => {
      // Apply theme on hydration
      if (state?.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Convert date strings back to Date objects
      if (state?.tasks) {
        state.tasks = state.tasks.map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        }));
      }
      
      if (state?.sessions) {
        state.sessions = state.sessions.map(session => ({
          ...session,
          date: new Date(session.date)
        }));
      }
    },
  }
));

// Selectors for computed values
export const useTimerProgress = () => {
  const { timeLeft, mode, focusDuration, shortBreakDuration, longBreakDuration } = useFocusStore();
  const totalTime = mode === 'focus' ? focusDuration * 60 : 
                   mode === 'shortBreak' ? shortBreakDuration * 60 : 
                   longBreakDuration * 60;
  return totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
};

export const useTasksProgress = () => {
  const getCompletedTasksPercentage = useFocusStore((state) => state.getCompletedTasksPercentage);
  const tasks = useFocusStore((state) => state.tasks);
  
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  
  return {
    completed,
    total,
    percentage: getCompletedTasksPercentage(),
  };
};

export const useWeeklyStats = () => {
  const getWeeklyStats = useFocusStore((state) => state.getWeeklyStats);
  return getWeeklyStats();
};

export const useFilteredTasks = () => {
  const tasks = useFocusStore((state) => state.tasks);
  return tasks;
};