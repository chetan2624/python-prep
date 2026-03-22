/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  HelpCircle, 
  Timer, 
  Notebook, 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Menu, 
  X,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Questions from './pages/Questions';
import FocusMode from './pages/FocusMode';
import Notes from './pages/Notes';

import { getProgress, updateStreak } from './utils/storage';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SidebarLink = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-blue-600/10 text-blue-500 dark:text-blue-400 border border-blue-600/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]" 
        : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
    )}
  >
    <Icon size={20} className={cn(active ? "text-blue-500 dark:text-blue-400" : "text-text-secondary group-hover:text-text-primary")} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const location = useLocation();
  const progress = getProgress();

  useEffect(() => {
    updateStreak();
    // Apply dark class to body for global theme variables
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={cn("min-h-screen transition-colors duration-300 bg-bg text-text-primary")}>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <span className="font-bold tracking-tight">Python Prep</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-surface-hover rounded-lg">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full p-6">
            <div className="hidden lg:flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="font-bold text-xl tracking-tight">Python Prep</span>
            </div>

            <nav className="flex-1 space-y-2">
              <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === "/"} />
              <SidebarLink to="/roadmap" icon={MapIcon} label="Roadmap" active={location.pathname === "/roadmap"} />
              <SidebarLink to="/questions" icon={HelpCircle} label="Questions" active={location.pathname === "/questions"} />
              <SidebarLink to="/focus" icon={Timer} label="Focus Mode" active={location.pathname === "/focus"} />
              <SidebarLink to="/notes" icon={Notebook} label="Notes" active={location.pathname === "/notes"} />
            </nav>

            <div className="mt-auto space-y-4">
              <div className="p-4 bg-surface-hover rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-orange-500 dark:text-orange-400">
                    <Flame size={18} />
                    <span className="font-bold">{progress.streak}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400">
                    <Trophy size={18} />
                    <span className="font-bold">{progress.xp} XP</span>
                  </div>
                </div>
                <div className="h-2 bg-bg rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-500" 
                    style={{ width: `${Math.min(100, (progress.xp % 100))}%` }} 
                  />
                </div>
                <p className="text-[10px] text-text-secondary mt-2 text-center uppercase tracking-widest font-semibold">
                  Level {Math.floor(progress.xp / 100) + 1}
                </p>
              </div>

              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-hover hover:bg-surface transition-colors border border-border"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span className="font-medium">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-auto h-screen p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/focus" element={<FocusMode />} />
          <Route path="/notes" element={<Notes />} />
        </Routes>
      </Layout>
    </Router>
  );
}
