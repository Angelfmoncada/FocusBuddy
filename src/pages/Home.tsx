import { motion } from 'framer-motion';
import { PomodoroTimer } from '../components/Timer/PomodoroTimer';
import { QuickStatsCard } from '../components/Stats/QuickStatsCard';
import { WeeklyProgress } from '../components/Stats/WeeklyProgress';
import { useFocusStore } from '../store/useFocusStore';

export const Home = () => {
  const focusDuration = useFocusStore((state) => state.focusDuration);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-8 pb-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4"
          >
            Welcome to FocusBuddy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Your productivity companion for focused work sessions and task management
          </motion.p>
        </div>

        {/* Quick Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <QuickStatsCard className="mb-8" />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timer Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <PomodoroTimer />
          </motion.div>

          {/* Weekly Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <WeeklyProgress />
          </motion.div>
        </div>

        {/* How Pomodoro Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              How Pomodoro Works
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Focus</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Work for {focusDuration} minutes with complete focus
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Short Break</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Take a 5-minute break to recharge
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Repeat</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Continue the cycle for maximum productivity
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Long Break</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  After 4 cycles, take a longer 15-30 minute break
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};