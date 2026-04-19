/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Circle, 
  Search, 
  Filter,
  BookOpen,
  Zap,
  Trophy,
  ArrowRight,
  Sparkles,
  Compass,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ROADMAP_DATA } from '../data/roadmap';
import { getProgress, toggleSubtopic } from '../utils/storage';
import { xpGainEvent } from '../App';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ProgressRing = ({ progress, size = 48, stroke = 3, color = "text-blue-600" }: { progress: number, size?: number, stroke?: number, color?: string }) => {
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
          className={cn("transition-all duration-700", color)}
        />
      </svg>
      <span className="absolute text-[8px] font-black tracking-tighter">{Math.round(progress)}%</span>
    </div>
  );
};

interface CategoryCardProps {
  category: any;
  completedSubtopics: string[];
  onToggle: (id: string) => void;
  isRevisionMode: boolean;
  index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  completedSubtopics, 
  onToggle, 
  isRevisionMode,
  index
}) => {
  const [isOpen, setIsOpen] = useState(index === 0);
  
  const totalSubtopics = category.topics.reduce((acc: number, t: any) => acc + t.subtopics.length, 0);
  const completedCount = category.topics.reduce((acc: number, t: any) => {
    return acc + t.subtopics.filter((st: string) => completedSubtopics.includes(`${category.id}-${t.id}-${st}`)).length;
  }, 0);
  
  const progressPercent = Math.round((completedCount / totalSubtopics) * 100);

  const filteredTopics = isRevisionMode 
    ? category.topics.map((t: any) => ({
        ...t,
        subtopics: t.subtopics.filter((st: string) => completedSubtopics.includes(`${category.id}-${t.id}-${st}`))
      })).filter((t: any) => t.subtopics.length > 0)
    : category.topics;

  if (isRevisionMode && filteredTopics.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-surface/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden mb-8 transition-all hover:border-blue-600/30 shadow-2xl relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div 
        className="p-8 flex items-center justify-between cursor-pointer group/header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            <ProgressRing progress={progressPercent} color={progressPercent === 100 ? "text-emerald-500" : "text-blue-500"} size={64} stroke={4} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Layers size={20} className={cn("transition-colors", progressPercent === 100 ? "text-emerald-500" : "text-blue-500")} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-text-primary tracking-tighter group-hover/header:text-blue-500 transition-colors uppercase italic">{category.title}</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60">
                Phase {index + 1} • {completedCount}/{totalSubtopics} Topics Mastered
              </span>
              {progressPercent === 100 && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                  <CheckCircle2 size={10} /> Certified
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="p-3 bg-surface-hover/50 rounded-2xl border border-white/5 text-text-secondary group-hover/header:text-blue-500 group-hover/header:scale-110 transition-all">
          {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5"
          >
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              {filteredTopics.map((topic: any) => (
                <div key={topic.id} className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    <Zap size={14} className="animate-pulse" /> {topic.title}
                  </h3>
                  <div className="space-y-3">
                    {topic.subtopics.map((subtopic: string) => {
                      const id = `${category.id}-${topic.id}-${subtopic}`;
                      const isCompleted = completedSubtopics.includes(id);
                      return (
                        <motion.div 
                          key={subtopic}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onToggle(id)}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-[1.25rem] border transition-all cursor-pointer group/item relative overflow-hidden",
                            isCompleted 
                              ? "bg-emerald-600/10 border-emerald-500/30 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.05)]" 
                              : "bg-surface-hover/30 border-white/5 text-text-secondary hover:border-blue-500/30 hover:bg-surface-hover/60"
                          )}
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className={cn(
                              "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                              isCompleted ? "bg-emerald-500 text-white shadow-lg" : "bg-black/20 border border-white/10"
                            )}>
                              {isCompleted && <CheckCircle2 size={12} />}
                            </div>
                            <span className={cn("text-sm font-bold tracking-tight", isCompleted ? "text-emerald-500" : "text-text-primary")}>{subtopic}</span>
                          </div>
                          {isCompleted && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative z-10">
                              <Sparkles size={14} className="text-emerald-500 opacity-60" />
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Roadmap() {
  const [progress, setProgress] = useState(getProgress());
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggle = (id: string) => {
    const isNowCompleted = !progress.completedSubtopics.includes(id);
    if (isNowCompleted) {
      xpGainEvent(10);
    }
    toggleSubtopic(id);
    setProgress(getProgress());
  };

  const totalTopics = ROADMAP_DATA.reduce((acc, cat) => 
    acc + cat.topics.reduce((tAcc, topic) => tAcc + topic.subtopics.length, 0), 0
  );
  const completedTopics = progress.completedSubtopics.length;
  const overallProgress = Math.round((completedTopics / totalTopics) * 100);

  return (
    <div className="space-y-12 pb-24">
      {/* Immersive Header */}
      <section className="relative overflow-hidden rounded-[3rem] bg-surface/30 backdrop-blur-xl p-10 lg:p-16 border border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="px-3 py-1 bg-blue-600/10 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-blue-500/20">Learning Protocol Alpha</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tighter text-text-primary leading-none uppercase italic">Master <br />The <span className="text-blue-500">Path.</span></h1>
            <p className="text-lg text-text-secondary font-medium leading-relaxed opacity-80">
              A concept-driven architectural blueprint designed to bridge the gap between amateur coding and professional engineering. Your progress is the only obstacle.
            </p>
          </div>
          
          <div className="relative flex flex-col items-center">
            <div className="w-40 h-40 relative group">
              <div className="absolute inset-0 bg-blue-600/20 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
              <ProgressRing progress={overallProgress} size={160} stroke={6} color="text-blue-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Compass size={40} className="text-blue-500 mb-1 animate-float" />
                <span className="text-xs font-black text-text-secondary uppercase tracking-widest">Global</span>
              </div>
            </div>
            <div className="mt-8 flex flex-col items-center">
              <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] mb-2">XP Threshold</span>
              <div className="flex items-center gap-3">
                <Trophy size={20} className="text-yellow-500" />
                <span className="text-3xl font-black tracking-tighter">{completedTopics} / {totalTopics}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Control Module */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sticky top-24 z-30">
        <div className="md:col-span-8 relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="text-text-secondary group-focus-within:text-blue-500 transition-colors" size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search the blueprint for specific logic patterns..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 bg-surface/80 backdrop-blur-xl border border-white/5 rounded-[2rem] pl-16 pr-8 focus:outline-none focus:border-blue-500 transition-all text-text-primary font-bold shadow-2xl"
          />
        </div>
        <button 
          onClick={() => setIsRevisionMode(!isRevisionMode)}
          className={cn(
            "md:col-span-4 flex items-center justify-center gap-4 h-16 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl relative overflow-hidden group",
            isRevisionMode 
              ? "bg-blue-600 text-white" 
              : "bg-surface/80 backdrop-blur-xl border border-white/5 text-text-secondary hover:text-text-primary"
          )}
        >
          <Filter size={20} className={cn("transition-transform group-hover:rotate-12", isRevisionMode ? "animate-pulse" : "")} />
          <span>{isRevisionMode ? "Focus: Active" : "Filter Protocols"}</span>
          {isRevisionMode && <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />}
        </button>
      </div>

      {/* Roadmap Feed */}
      <motion.div layout className="space-y-4">
        {ROADMAP_DATA.map((category, idx) => (
          <CategoryCard 
            key={category.id} 
            category={category} 
            completedSubtopics={progress.completedSubtopics}
            onToggle={handleToggle}
            isRevisionMode={isRevisionMode}
            index={idx}
          />
        ))}
      </motion.div>

      {isRevisionMode && progress.completedSubtopics.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 bg-surface/30 backdrop-blur-xl rounded-[4rem] border border-dashed border-white/10 shadow-2xl"
        >
          <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-blue-500 shadow-inner">
            <Compass size={48} className="animate-float" />
          </div>
          <h3 className="text-3xl font-black text-text-primary tracking-tighter uppercase italic">Coordinate Mismatch</h3>
          <p className="text-text-secondary mt-4 font-medium max-w-md mx-auto opacity-70">
            Revision mode requires completed sub-protocols. Resume active learning to populate your review link.
          </p>
          <button 
            onClick={() => setIsRevisionMode(false)}
            className="mt-12 px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-600/20"
          >
            Re-engage System
          </button>
        </motion.div>
      )}
    </div>
  );
}
