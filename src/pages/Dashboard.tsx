/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Trophy, 
  CheckCircle2, 
  Target, 
  ArrowRight, 
  Quote,
  Zap,
  BookOpen,
  Code2,
  Timer,
  Notebook,
  Map as MapIcon,
  Plus,
  Trash2,
  Circle,
  ChevronRight,
  TrendingUp,
  User,
  Star,
  Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { getProgress, toggleTask, addTask, deleteTask } from '../utils/storage';
import { QUOTES } from '../data/quotes';
import { QUESTIONS_DATA } from '../data/questions';
import { ROADMAP_DATA } from '../data/roadmap';
import { xpGainEvent } from '../App';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AVATARS = [
  { id: 'hacker', icon: '🧑‍💻', label: 'Hacker', color: 'bg-blue-600' },
  { id: 'student', icon: '👨‍🎓', label: 'Student', color: 'bg-emerald-600' },
  { id: 'bot', icon: '🤖', label: 'AI Bot', color: 'bg-indigo-600' },
  { id: 'wizard', icon: '🧙', label: 'Wizard', color: 'bg-purple-600' },
];

const ProgressRing = ({ progress, size = 60, stroke = 4, color = "text-blue-600" }: { progress: number, size?: number, stroke?: number, color?: string }) => {
  const radius = (size / 2) - (stroke * 2);
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          className="text-black/5 dark:text-white/5"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("progress-ring__circle", color)}
        />
      </svg>
      <span className="absolute text-[10px] font-black tracking-tighter">{Math.round(progress)}%</span>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, delay = 0, bgImage }: { icon: any, label: string, value: string | number, color: string, delay?: number, bgImage: string }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="relative group h-full"
  >
    <div className="bg-surface/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 hover:border-blue-600/30 transition-all shadow-2xl h-full flex flex-col justify-between overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-cover bg-center" 
        style={{ backgroundImage: `url("${bgImage}")` }}
      />
      <div className={cn("absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 blur-3xl transition-transform group-hover:scale-150", color)} />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl", color)}>
          <Icon size={28} className="group-hover:scale-110 transition-transform" />
        </div>
        <TrendingUp size={18} className="text-text-secondary opacity-40 shrink-0" />
      </div>
      
      <div className="relative z-10">
        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-1">{label}</p>
        <h3 className="text-4xl font-black text-text-primary tracking-tighter flex items-end gap-2">
          {value}
          <span className="text-xs font-bold text-emerald-500 mb-1">↑ 12%</span>
        </h3>
      </div>
    </div>
  </motion.div>
);

const NavCard = ({ to, icon: Icon, title, desc, color }: { to: string, icon: any, title: string, desc: string, color: string }) => (
  <Link to={to} className="group relative">
    <div className="bg-surface/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 hover:border-blue-600/30 transition-all h-full flex flex-col shadow-2xl group-hover:shadow-blue-600/10 group-hover:-translate-y-2">
      <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-2xl relative overflow-hidden", color)}>
        <div className="absolute inset-0 bg-white/20 animate-pulse" />
        <Icon size={32} className="text-white relative z-10" />
      </div>
      <h3 className="text-2xl font-black mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-text-primary tracking-tighter">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed flex-1 font-medium">{desc}</p>
      <div className="mt-8 flex items-center gap-3 text-blue-600 dark:text-blue-400 text-sm font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
        Launch Module <ChevronRight size={18} />
      </div>
    </div>
  </Link>
);

export default function Dashboard() {
  const [progress, setProgress] = useState(getProgress());
  const [quote, setQuote] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(localStorage.getItem('avatar') || 'hacker');
  const [typedQuote, setTypedQuote] = useState("");
  
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    const fullQuote = QUOTES[randomIndex];
    setQuote(fullQuote);

    // Subtle typing effect
    let i = 0;
    const interval = setInterval(() => {
      setTypedQuote(fullQuote.slice(0, i));
      i++;
      if (i > fullQuote.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const totalSubtopics = ROADMAP_DATA.reduce((acc, cat) => 
    acc + cat.topics.reduce((tAcc, topic) => tAcc + topic.subtopics.length, 0), 0
  );
  
  const topicsCompleted = progress.completedSubtopics.length;
  const questionsSolved = progress.solvedQuestions.length;
  const totalQuestions = QUESTIONS_DATA.length;

  const handleToggleTask = (id: string) => {
    const task = progress.tasks.find(t => t.id === id);
    if (task && !task.completed) {
      xpGainEvent(5); // Emit XP gain
    }
    toggleTask(id);
    setProgress(getProgress());
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addTask(newTaskText.trim());
    setNewTaskText("");
    setProgress(getProgress());
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    setProgress(getProgress());
  };

  const handleAvatarChange = (id: string) => {
    setSelectedAvatar(id);
    localStorage.setItem('avatar', id);
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
    <div className="space-y-12 pb-24">
      {/* Immersive Hero */}
      <section className="relative overflow-hidden rounded-[4rem] bg-surface/30 backdrop-blur-3xl border border-white/5 p-10 lg:p-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-800/20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[50%] h-full bg-white/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-10">
                <span className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                  <Star size={14} className="fill-current" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">
                  {progress.user?.name ? `Identity Verified: ${progress.user.name}` : "Mission Protocol Active"}
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-7xl font-black mb-10 leading-[0.95] tracking-tighter text-text-primary uppercase italic">
                {progress.user?.name ? "Master the" : "Launch Your"} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">PYTHON CORE.</span>
              </h1>
              
              <p className="text-xl lg:text-2xl font-medium text-text-secondary italic mb-12 min-h-[4rem] leading-relaxed max-w-xl">
                "{typedQuote}"
                <motion.span 
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-1 h-6 bg-blue-600 ml-1 translate-y-1"
                />
              </p>
              
              <div className="flex flex-wrap gap-6">
                {progress.user?.name ? (
                  <Link to="/roadmap" className="group px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black flex items-center gap-4 shadow-2xl shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all text-lg uppercase italic tracking-wider">
                    Initiate Path <Rocket size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                ) : (
                  <button 
                    onClick={() => {
                       // We'll use a custom event that App.tsx can listen to if needed, 
                       // but for now let's just guide the user to the header.
                       window.dispatchEvent(new CustomEvent('OPEN_LOGIN_MODAL'));
                    }}
                    className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[2rem] font-black flex items-center gap-4 shadow-2xl shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all text-lg uppercase italic tracking-wider"
                  >
                    IDENTIFY SELF <User size={24} />
                  </button>
                )}
                <div className="flex items-center gap-4 bg-surface/40 px-6 rounded-[2rem] border border-white/5 backdrop-blur-xl">
                  <ProgressRing progress={(topicsCompleted / totalSubtopics) * 100} color="text-yellow-500" size={48} stroke={3} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Overall Mastery</span>
                    <span className="text-sm font-black text-text-primary">{Math.round((topicsCompleted / totalSubtopics) * 100)}% Protocol Cleared</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="hidden lg:flex justify-center relative">
            <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
               className="relative"
            >
              <div className="w-[400px] h-[400px] bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-[80px] absolute inset-0 -z-10" />
              <div className="relative text-[200px] select-none filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                {progress.user?.name ? getAvatarIcon(progress.user.avatar) : '👨‍🚀'}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-surface shadow-2xl rounded-2xl flex items-center justify-center border border-border"
                >
                  <Trophy size={24} className="text-yellow-500 animate-float" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <Quote className="absolute right-[-60px] bottom-[-60px] w-[500px] h-[500px] text-white/5 rotate-12 pointer-events-none" />
      </section>

      {/* Profile & Streak Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatCard icon={BookOpen} label="Knowledge Points" value={topicsCompleted} color="bg-blue-600" delay={0.1} bgImage="https://picsum.photos/seed/code/400/300?blur=4" />
        <StatCard icon={Code2} label="Logic Loops" value={questionsSolved} color="bg-emerald-600" delay={0.2} bgImage="https://picsum.photos/seed/matrix/400/300?blur=4" />
        <StatCard icon={Flame} label="Velocity Streak" value={progress.streak} color="bg-orange-600" delay={0.3} bgImage="https://picsum.photos/seed/fire/400/300?blur=4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Missions & Tasks */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="bg-surface/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col h-full">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-text-primary tracking-tighter">Active Missions</h2>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mt-1">Directives for today</p>
              </div>
              <div className="w-12 h-12 flex items-center justify-center">
                <ProgressRing 
                   progress={(progress.tasks.filter(t => t.completed).length / (progress.tasks.length || 1)) * 100} 
                   color="text-emerald-500" 
                   size={48} 
                   stroke={3} 
                />
              </div>
            </div>
            
            <div className="space-y-4 flex-1">
              <AnimatePresence mode="popLayout">
                {progress.tasks.map((task) => (
                  <motion.div 
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-[2rem] border transition-all group",
                      task.completed 
                        ? "bg-emerald-600/5 border-emerald-600/20 opacity-60" 
                        : "bg-surface-hover/50 border-white/5 hover:border-blue-600/30"
                    )}
                  >
                    <button 
                      onClick={() => handleToggleTask(task.id)}
                      className={cn(
                        "w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all shrink-0",
                        task.completed ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "border-white/10 hover:border-blue-500"
                      )}
                    >
                      {task.completed ? <CheckCircle2 size={16} /> : <Circle size={16} className="text-transparent" />}
                    </button>
                    <span className={cn(
                      "text-sm font-bold flex-1 transition-all",
                      task.completed ? "text-emerald-700 dark:text-emerald-400 line-through" : "text-text-primary"
                    )}>
                      {task.text}
                    </span>
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <form onSubmit={handleAddTask} className="mt-10 flex gap-3">
              <input 
                type="text" 
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Declare new mission..."
                className="flex-1 bg-surface-hover/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-blue-600/50 transition-colors text-text-primary"
              />
              <button 
                type="submit"
                className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30"
              >
                <Plus size={24} />
              </button>
            </form>
          </div>
        </div>

        {/* Navigation Map */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <NavCard 
            to="/roadmap" 
            icon={MapIcon} 
            title="Syllabus Core" 
            desc="The master structural blueprint from fundamentals to high-level framework design." 
            color="bg-blue-600" 
          />
          <NavCard 
            to="/questions" 
            icon={Code2} 
            title="Logic Trials" 
            desc="Simulated coding environments to stress-test your knowledge of technical concepts." 
            color="bg-emerald-600" 
          />
          <NavCard 
            to="/focus" 
            icon={Timer} 
            title="Void Zone" 
            desc="Enter a distraction-free state designed for peak cognitive performance and deep work." 
            color="bg-orange-600" 
          />
          <NavCard 
            to="/notes" 
            icon={Notebook} 
            title="Neural Link" 
            desc="Your centralized archive of architectural snippets, logic patterns, and key insights." 
            color="bg-purple-600" 
          />
        </div>
      </div>
    </div>
  );
}
