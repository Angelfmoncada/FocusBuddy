import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFocusStore } from './store/useFocusStore';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Tasks } from './pages/Tasks';
import { Stats } from './pages/Stats';
import { Settings } from './pages/Settings';

function App() {
  const theme = useFocusStore((state) => state.theme);

  return (
    <Router>
      <div className={`min-h-screen transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
      }`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen backdrop-blur-sm"
        >
          <Navbar />
          
          <main className="pt-20">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </AnimatePresence>
          </main>
        </motion.div>
      </div>
    </Router>
  );
}

export default App;
