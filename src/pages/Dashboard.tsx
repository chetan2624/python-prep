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
  Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { getProgress, toggleTask, addTask, deleteTask } from '../utils/storage';
import { QUOTES } from '../data/quotes';
import { QUESTIONS_DATA } from '../data/questions';
import { ROADMAP_DATA } from '../data/roadmap';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const StatCard = ({ icon: Icon, label, value, color, delay = 0 }: { icon: any, label: string, value: string | number, color: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="relative overflow-hidden group"
  >
    <div className="bg-surface p-6 rounded-3xl border border-border hover:border-blue-600/30 transition-all shadow-sm h-full">
      {/* Decorative background element */}
      <div className={cn("absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl transition-transform group-hover:scale-150", color)} />
      
      <div className="flex flex-col gap-4 relative z-10">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">{label}</p>
          <h3 className="text-3xl font-black text-text-primary tracking-tight">{value}</h3>
        </div>
      </div>
    </div>
  </motion.div>
);

const NavCard = ({ to, icon: Icon, title, desc, color }: { to: string, icon: any, title: string, desc: string, color: string }) => (
  <Link to={to} className="group h-full">
    <div className="bg-surface p-8 rounded-[2.5rem] border border-border hover:border-blue-600/30 transition-all h-full flex flex-col shadow-sm group-hover:shadow-xl group-hover:shadow-blue-600/5 group-hover:-translate-y-1">
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg", color)}>
        <Icon size={28} className="text-white" />
      </div>
      <h3 className="text-xl font-black mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-text-primary tracking-tight">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed flex-1">{desc}</p>
      <div className="mt-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
        Explore Module <ArrowRight size={18} />
      </div>
    </div>
  </Link>
);

export default function Dashboard() {
  const [progress, setProgress] = useState(getProgress());
  const [quote, setQuote] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[randomIndex]);
  }, []);

  const totalSubtopics = ROADMAP_DATA.reduce((acc, cat) => 
    acc + cat.topics.reduce((tAcc, topic) => tAcc + topic.subtopics.length, 0), 0
  );
  
  const topicsCompleted = progress.completedSubtopics.length;
  const questionsSolved = progress.solvedQuestions.length;
  const totalQuestions = QUESTIONS_DATA.length;

  const handleToggleTask = (id: string) => {
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

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Motivation */}
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-800 p-8 lg:p-16 text-white shadow-2xl shadow-blue-600/20">
        <div className="relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-white/10">
              <Zap size={14} className="text-yellow-400" /> Daily Inspiration
            </span>
            <h1 className="text-3xl lg:text-6xl font-black mb-10 leading-[1.1] tracking-tight italic">
              "{quote}"
            </h1>
            <div className="flex flex-wrap gap-4">
              <Link to="/roadmap" className="px-8 py-4 bg-white text-blue-700 rounded-2xl font-black hover:bg-blue-50 transition-all flex items-center gap-3 shadow-xl shadow-black/10 hover:scale-105 active:scale-95">
                Continue Learning <ArrowRight size={20} />
              </Link>
              <Link to="/focus" className="px-8 py-4 bg-blue-500/20 backdrop-blur-xl text-white border border-white/20 rounded-2xl font-black hover:bg-blue-500/30 transition-all flex items-center gap-3 hover:scale-105 active:scale-95">
                <Timer size={20} /> Focus Mode
              </Link>
            </div>
          </motion.div>
        </div>
        <Quote className="absolute right-[-40px] bottom-[-40px] w-96 h-96 text-white/5 rotate-12 pointer-events-none" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={BookOpen} 
          label="Topics Mastery" 
          value={`${topicsCompleted}/${totalSubtopics}`} 
          color="bg-blue-600" 
          delay={0.1}
        />
        <StatCard 
          icon={Code2} 
          label="Problems Solved" 
          value={`${questionsSolved}/${totalQuestions}`} 
          color="bg-emerald-600" 
          delay={0.2}
        />
        <StatCard 
          icon={Flame} 
          label="Learning Streak" 
          value={`${progress.streak} Days`} 
          color="bg-orange-600" 
          delay={0.3}
        />
        <StatCard 
          icon={Trophy} 
          label="Total Experience" 
          value={`${progress.xp} XP`} 
          color="bg-purple-600" 
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Goals & Tasks */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-surface p-8 rounded-[2.5rem] border border-border shadow-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black flex items-center gap-3 text-text-primary tracking-tight">
                <Target className="text-blue-600" size={28} /> Daily Goals
              </h2>
              <div className="px-3 py-1 bg-surface-hover rounded-full border border-border">
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
                  {progress.tasks.filter(t => t.completed).length}/{progress.tasks.length}
                </span>
              </div>
            </div>
            
            <div className="space-y-3 flex-1">
              <AnimatePresence mode="popLayout">
                {progress.tasks.map((task) => (
                  <motion.div 
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border transition-all group",
                      task.completed 
                        ? "bg-emerald-600/5 border-emerald-600/20 opacity-75" 
                        : "bg-surface-hover border-border hover:border-blue-600/30"
                    )}
                  >
                    <button 
                      onClick={() => handleToggleTask(task.id)}
                      className={cn(
                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0",
                        task.completed ? "bg-emerald-600 border-emerald-600 text-white" : "border-border hover:border-blue-500"
                      )}
                    >
                      {task.completed ? <CheckCircle2 size={14} /> : <Circle size={14} className="text-transparent" />}
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
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <form onSubmit={handleAddTask} className="mt-8 flex gap-2">
              <input 
                type="text" 
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add a custom goal..."
                className="flex-1 bg-surface-hover border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-600/50 transition-colors text-text-primary"
              />
              <button 
                type="submit"
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                <Plus size={20} />
              </button>
            </form>
          </div>

          <div className="p-8 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-[2.5rem] border border-blue-600/20">
            <h4 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Zap size={16} /> Pro Tip
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed font-medium">
              Consistency is more important than intensity. Checking off small daily goals builds the momentum needed for long-term mastery.
            </p>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <NavCard 
            to="/roadmap" 
            icon={MapIcon} 
            title="Learning Roadmap" 
            desc="A concept-first structured path from syntax fundamentals to advanced framework architecture." 
            color="bg-blue-600" 
          />
          <NavCard 
            to="/questions" 
            icon={Code2} 
            title="Coding Challenges" 
            desc="Solve hand-picked problems designed to test your understanding of core Python concepts." 
            color="bg-emerald-600" 
          />
          <NavCard 
            to="/focus" 
            icon={Timer} 
            title="Deep Work Zone" 
            desc="Maximize your learning efficiency with our integrated Pomodoro timer and distraction-free workspace." 
            color="bg-orange-600" 
          />
          <NavCard 
            to="/notes" 
            icon={Notebook} 
            title="Knowledge Base" 
            desc="Organize your personal snippets, architectural notes, and key takeaways for rapid revision." 
            color="bg-purple-600" 
          />
        </div>
      </div>
    </div>
  );
}
