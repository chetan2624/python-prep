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
  Moon,
  Search,
  Zap,
  Command,
  Plus,
  Bell,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  BrainCircuit,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Questions from './pages/Questions';
import FocusMode from './pages/FocusMode';
import Notes from './pages/Notes';
import Quiz from './pages/Quiz';

import { getProgress, updateStreak, updateUser } from './utils/storage';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LoginModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("hacker");

  if (!isOpen) return null;

  const handleSave = () => {
    updateUser(name, email, avatar);
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md glass-morphism p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Initialize PERSONALITY</h2>
          <p className="text-text-secondary text-sm font-medium">Configure your core identification profile</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4">Identification Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Neo"
              className="w-full h-16 bg-surface-hover/50 border border-white/5 rounded-2xl px-6 font-bold text-text-primary focus:outline-none focus:border-blue-600/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4">Neural Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. neo@matrix.net"
              className="w-full h-16 bg-surface-hover/50 border border-white/5 rounded-2xl px-6 font-bold text-text-primary focus:outline-none focus:border-blue-600/50"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary ml-4">Signature Avatar</label>
            <div className="grid grid-cols-4 gap-3">
              {['hacker', 'student', 'bot', 'wizard'].map(a => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={cn(
                    "h-16 rounded-2xl border transition-all flex items-center justify-center text-2xl",
                    avatar === a ? "bg-blue-600 border-blue-400 shadow-lg" : "bg-surface-hover/50 border-white/5 hover:bg-white/5"
                  )}
                >
                  {a === 'hacker' && '🧑‍💻'}
                  {a === 'student' && '👨‍🎓'}
                  {a === 'bot' && '🤖'}
                  {a === 'wizard' && '🧙'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-600/20"
        >
          UPLOAD PROFILE
        </button>
      </motion.div>
    </div>
  );
};

// Global Event for XP gains
export const xpGainEvent = (amount: number) => {
  const event = new CustomEvent('xp-gain', { detail: amount });
  window.dispatchEvent(event);
};

const XpPopup = () => {
  const [popups, setPopups] = useState<{ id: number, amount: number }[]>([]);

  useEffect(() => {
    const handler = (e: any) => {
      const id = Date.now();
      setPopups(prev => [...prev.slice(-4), { id, amount: e.detail }]);
      setTimeout(() => {
        setPopups(prev => prev.filter(p => p.id !== id));
      }, 1500);
    };
    window.addEventListener('xp-gain', handler);
    return () => window.removeEventListener('xp-gain', handler);
  }, []);

  return (
    <div className="fixed top-20 right-8 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {popups.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.8 }}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-full font-black shadow-xl border border-yellow-400/50"
          >
            <Zap size={14} className="fill-current" />
            <span>+{p.amount} XP</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const SidebarLink = ({ to, icon: Icon, label, active, collapsed }: { to: string, icon: any, label: string, active: boolean, collapsed?: boolean }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
      active 
        ? "text-blue-500 dark:text-blue-400 bg-blue-600/10 shadow-inner" 
        : "text-text-secondary hover:text-text-primary hover:bg-surface-hover/50",
      collapsed && "justify-center px-0"
    )}
  >
    {active && (
      <motion.div 
        layoutId="active-nav"
        className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"
      />
    )}
    <Icon size={20} className={cn("transition-transform group-hover:scale-110", active ? "text-blue-500 active-flame" : "text-text-secondary group-hover:text-text-primary")} />
    {!collapsed && <span className="font-bold tracking-tight">{label}</span>}
  </Link>
);

const CommandPalette = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [search, setSearch] = useState("");
  const location = useLocation();

  if (!isOpen) return null;

  const items = [
    { label: "Go to Dashboard", to: "/", icon: LayoutDashboard },
    { label: "Learning Roadmap", to: "/roadmap", icon: MapIcon },
    { label: "Coding Questions", to: "/questions", icon: HelpCircle },
    { label: "Deep Work Focus", to: "/focus", icon: Timer },
    { label: "Personal Notes", to: "/notes", icon: Notebook },
  ];

  const filtered = items.filter(i => i.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search size={20} className="text-text-secondary" />
          <input 
            autoFocus
            type="text" 
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none focus:outline-none text-text-primary font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-surface-hover rounded border border-border text-[10px] font-mono text-text-secondary">
            ESC
          </div>
        </div>
        <div className="p-2 max-h-[60vh] overflow-auto">
          {filtered.map(item => (
            <Link 
              key={item.to} 
              to={item.to} 
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 p-3 rounded-2xl transition-colors group",
                location.pathname === item.to ? "bg-blue-600/10 text-blue-600" : "hover:bg-surface-hover text-text-secondary hover:text-text-primary"
              )}
            >
              <item.icon size={18} />
              <span className="font-bold flex-1">{item.label}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={14} /></span>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-text-secondary">
              No commands found for "{search}"
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();
  const progress = getProgress();

  useEffect(() => {
    updateStreak();
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const openLogin = () => setIsLoginOpen(true);
    window.addEventListener('OPEN_LOGIN_MODAL', openLogin);
    return () => window.removeEventListener('OPEN_LOGIN_MODAL', openLogin);
  }, [isDarkMode]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsCommandOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const getPageBg = () => {
    switch (location.pathname) {
      case '/': return 'url("https://picsum.photos/seed/code/1920/1080")';
      case '/roadmap': return 'url("https://picsum.photos/seed/mountain/1920/1080")';
      case '/questions': return 'url("https://picsum.photos/seed/terminal/1920/1080")';
      case '/focus': return 'url("https://picsum.photos/seed/peace/1920/1080")';
      case '/notes': return 'url("https://picsum.photos/seed/paper/1920/1080")';
      case '/quiz': return 'url("https://picsum.photos/seed/brain/1920/1080")';
      default: return 'none';
    }
  };

  const getAvatarIcon = (avatarId: string) => {
    switch (avatarId) {
      case 'student': return '👨‍🎓';
      case 'bot': return '🤖';
      case 'wizard': return '🧙';
      default: return '🧑‍💻';
    }
  };

  return (
    <div className={cn("min-h-screen relative overflow-hidden transition-colors duration-300 bg-bg text-text-primary")}>
      {/* Immersive Background */}
      <div 
        className="bg-atmospheric opacity-20 dark:opacity-40" 
        style={{ backgroundImage: getPageBg() }} 
      />
      <div className="bg-overlay" />

      <XpPopup />
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 glass-morphism transform transition-all duration-500 lg:translate-x-0 lg:static lg:block h-screen",
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
          isSidebarCollapsed ? "w-24" : "w-72"
        )}>
          <div className="flex flex-col h-full p-6 relative uppercase">
            {/* Collapse Trigger */}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="absolute -right-4 top-24 w-8 h-8 bg-surface border border-border rounded-full flex items-center justify-center text-text-secondary hover:text-blue-500 transition-all z-50 lg:flex hidden shadow-xl"
            >
              {isSidebarCollapsed ? <ChevronRightIcon size={16} /> : <ChevronLeft size={16} />}
            </button>
            
            <div className={cn("flex items-center gap-4 mb-12", isSidebarCollapsed && "justify-center")}>
              <Link to="/" className="w-12 h-12 flex items-center justify-center animate-float overflow-hidden rounded-2xl shadow-2xl shadow-blue-500/30 shrink-0">
                <img src="/logo.svg" alt="Rocket Logo" className="w-full h-full object-cover" />
              </Link>
              {!isSidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-black text-2xl tracking-tighter text-text-primary">PYTHON <span className="text-blue-600">PREP</span></span>
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Launch Pro</span>
                </div>
              )}
            </div>

            <nav className="flex-1 space-y-3">
              <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === "/"} collapsed={isSidebarCollapsed} />
              <SidebarLink to="/roadmap" icon={MapIcon} label="Roadmap" active={location.pathname === "/roadmap"} collapsed={isSidebarCollapsed} />
              <SidebarLink to="/questions" icon={HelpCircle} label="Questions" active={location.pathname === "/questions"} collapsed={isSidebarCollapsed} />
              <SidebarLink to="/quiz" icon={BrainCircuit} label="Quick Quiz" active={location.pathname === "/quiz"} collapsed={isSidebarCollapsed} />
              <SidebarLink to="/focus" icon={Timer} label="Focus Mode" active={location.pathname === "/focus"} collapsed={isSidebarCollapsed} />
              <SidebarLink to="/notes" icon={Notebook} label="Notes" active={location.pathname === "/notes"} collapsed={isSidebarCollapsed} />
            </nav>

            {!isSidebarCollapsed && (
              <div className="mt-auto space-y-6">
                <div className="p-6 bg-surface/40 backdrop-blur-md rounded-[2rem] border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-orange-500 animate-flame">
                        <Flame size={20} className="fill-current" />
                        <span className="font-black text-lg">{progress.streak}</span>
                      </div>
                      <div className="flex items-center gap-2 text-yellow-500">
                        <Trophy size={20} className="fill-current" />
                        <span className="font-black text-lg">{progress.xp}</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-black/10 dark:bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (progress.xp % 100))}%` }}
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" 
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-secondary">
                      <span>Level {Math.floor(progress.xp / 100) + 1}</span>
                      <span>{progress.xp % 100}/100 XP</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="flex flex-col items-center justify-center p-4 rounded-3xl bg-surface/30 hover:bg-surface/50 border border-white/5 transition-all group"
                  >
                    {isDarkMode ? <Sun size={20} className="text-yellow-400 group-hover:rotate-45 transition-transform" /> : <Moon size={20} className="text-blue-400 group-hover:-rotate-12 transition-transform" />}
                    <span className="text-[10px] font-black uppercase mt-2 opacity-60">Theme</span>
                  </button>
                  <button 
                    onClick={() => setIsCommandOpen(true)}
                    className="flex flex-col items-center justify-center p-4 rounded-3xl bg-surface/30 hover:bg-surface/50 border border-white/5 transition-all group"
                  >
                    <Command size={20} className="text-text-secondary group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase mt-2 opacity-60">Search</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-auto h-screen relative bg-transparent scroll-smooth">
          <header className="sticky top-0 z-[100] px-6 lg:px-12 py-6">
            <div className="max-w-7xl mx-auto glass-morphism rounded-[2.5rem] p-4 flex items-center justify-between border border-white/10 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-3 hover:bg-white/10 rounded-2xl transition-colors"
                >
                  <Menu size={24} />
                </button>
                <div className="hidden md:flex items-center gap-3 relative flex-1 max-w-sm ml-4">
                  <Search size={18} className="absolute left-6 text-text-secondary" />
                  <input 
                    onClick={() => setIsCommandOpen(true)}
                    type="text" 
                    placeholder="Quick search (Ctrl+K)..."
                    className="w-full h-12 bg-black/20 border border-white/5 rounded-full pl-16 pr-6 font-medium text-xs text-text-primary cursor-pointer hover:border-blue-600/30 transition-all"
                    readOnly
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="p-3 text-text-secondary hover:text-blue-500 hover:bg-white/10 rounded-2xl transition-all relative">
                  <Bell size={24} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface shadow-lg shadow-red-500/30" />
                </button>

                {progress.user?.name ? (
                  <div className="flex items-center gap-3 p-1.5 pr-4 border border-white/5 rounded-full bg-black/20 group cursor-pointer hover:border-blue-600/30 transition-all">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-xl shadow-xl animate-float">
                      {getAvatarIcon(progress.user.avatar)}
                    </div>
                    <div className="hidden sm:flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-primary group-hover:text-blue-400 transition-colors uppercase italic">{progress.user.name}</span>
                      <span className="text-[8px] font-black text-text-secondary opacity-40">STUDENT LEVEL {Math.floor(progress.xp / 100) + 1}</span>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsLoginOpen(true)}
                    className="px-8 h-12 bg-blue-600 text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                  >
                    INITIALIZE IDENT
                  </button>
                )}
              </div>
            </div>
          </header>

          <div className="p-4 lg:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-7xl mx-auto"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Global FAB */}
      <div className="fixed bottom-8 right-8 z-[110] flex flex-col gap-4 lg:hidden">
        <button className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-90">
          <Zap size={24} />
        </button>
      </div>

      {/* Mobile Sticky Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 glass-morphism border-t border-white/5 px-6 py-4 flex justify-between items-center z-[110]">
        {[
          { icon: LayoutDashboard, to: "/", label: "Home" },
          { icon: MapIcon, to: "/roadmap", label: "Path" },
          { icon: BrainCircuit, to: "/quiz", label: "Quiz" },
          { icon: HelpCircle, to: "/questions", label: "Trials" },
        ].map(item => (
          <Link 
            key={item.to} 
            to={item.to}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              location.pathname === item.to ? "text-blue-600 scale-110" : "text-text-secondary opacity-60"
            )}
          >
            <item.icon size={22} />
            <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
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
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/focus" element={<FocusMode />} />
          <Route path="/notes" element={<Notes />} />
        </Routes>
      </Layout>
    </Router>
  );
}
