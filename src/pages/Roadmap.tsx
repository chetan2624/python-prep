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
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ROADMAP_DATA } from '../data/roadmap';
import { getProgress, toggleSubtopic } from '../utils/storage';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CategoryCard = ({ 
  category, 
  completedSubtopics, 
  onToggle, 
  isRevisionMode 
}: { 
  category: any, 
  completedSubtopics: string[], 
  onToggle: (id: string) => void,
  isRevisionMode: boolean,
  key?: any
}) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const totalSubtopics = category.topics.reduce((acc: number, t: any) => acc + t.subtopics.length, 0);
  const completedCount = category.topics.reduce((acc: number, t: any) => {
    return acc + t.subtopics.filter((st: string) => completedSubtopics.includes(`${category.id}-${t.id}-${st}`)).length;
  }, 0);
  
  const progressPercent = Math.round((completedCount / totalSubtopics) * 100);

  // Filter topics based on revision mode
  const filteredTopics = isRevisionMode 
    ? category.topics.map((t: any) => ({
        ...t,
        subtopics: t.subtopics.filter((st: string) => completedSubtopics.includes(`${category.id}-${t.id}-${st}`))
      })).filter((t: any) => t.subtopics.length > 0)
    : category.topics;

  if (isRevisionMode && filteredTopics.length === 0) return null;

  return (
    <div className="bg-surface rounded-3xl border border-border overflow-hidden mb-8 transition-all hover:border-blue-600/30 shadow-sm">
      <div 
        className="p-6 flex items-center justify-between cursor-pointer hover:bg-surface-hover transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">{category.title}</h2>
            <div className="flex items-center gap-3 mt-1">
              <div className="w-32 h-1.5 bg-surface-hover rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
              <span className="text-xs font-bold text-text-secondary">{progressPercent}% Completed</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
            {completedCount} / {totalSubtopics} Topics
          </span>
          <div className="text-text-secondary">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border"
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredTopics.map((topic: any) => (
                <div key={topic.id} className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Zap size={14} /> {topic.title}
                  </h3>
                  <div className="space-y-2">
                    {topic.subtopics.map((subtopic: string) => {
                      const id = `${category.id}-${topic.id}-${subtopic}`;
                      const isCompleted = completedSubtopics.includes(id);
                      return (
                        <div 
                          key={subtopic}
                          onClick={() => onToggle(id)}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group",
                            isCompleted 
                              ? "bg-blue-600/5 border-blue-600/20 text-blue-600 dark:text-blue-100" 
                              : "bg-surface-hover border-border text-text-secondary hover:border-blue-600/30 hover:bg-surface"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {isCompleted ? (
                              <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-400" />
                            ) : (
                              <Circle size={18} className="text-text-secondary/50 group-hover:text-text-secondary" />
                            )}
                            <span className={cn("text-sm font-medium", isCompleted ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary")}>{subtopic}</span>
                          </div>
                          {isCompleted && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600/50 dark:text-blue-400/50">Done</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Roadmap() {
  const [progress, setProgress] = useState(getProgress());
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggle = (id: string) => {
    toggleSubtopic(id);
    setProgress(getProgress());
  };

  const totalTopics = ROADMAP_DATA.reduce((acc, cat) => 
    acc + cat.topics.reduce((tAcc, topic) => tAcc + topic.subtopics.length, 0), 0
  );
  const completedTopics = progress.completedSubtopics.length;
  const overallProgress = Math.round((completedTopics / totalTopics) * 100);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight text-text-primary">Python Roadmap</h1>
          <p className="text-text-secondary max-w-xl leading-relaxed">
            Follow our structured learning path to master Python from the ground up. 
            Track your progress and stay consistent to unlock new levels.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Overall Progress</p>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{overallProgress}%</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Trophy size={32} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input 
            type="text" 
            placeholder="Search topics or concepts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-600/50 transition-colors text-text-primary"
          />
        </div>
        <button 
          onClick={() => setIsRevisionMode(!isRevisionMode)}
          className={cn(
            "flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all",
            isRevisionMode 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
              : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-blue-600/30"
          )}
        >
          <Filter size={18} />
          {isRevisionMode ? "Revision Mode: ON" : "Revision Mode"}
        </button>
      </div>

      {/* Roadmap Content */}
      <div className="space-y-2">
        {ROADMAP_DATA.map(category => (
          <CategoryCard 
            key={category.id} 
            category={category} 
            completedSubtopics={progress.completedSubtopics}
            onToggle={handleToggle}
            isRevisionMode={isRevisionMode}
          />
        ))}
      </div>

      {isRevisionMode && progress.completedSubtopics.length === 0 && (
        <div className="text-center py-20 bg-surface rounded-3xl border border-dashed border-border">
          <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-4 text-text-secondary">
            <BookOpen size={32} />
          </div>
          <h3 className="text-xl font-bold text-text-primary">No completed topics yet</h3>
          <p className="text-text-secondary mt-2">Start learning to see topics in revision mode!</p>
          <button 
            onClick={() => setIsRevisionMode(false)}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Go to Roadmap
          </button>
        </div>
      )}
    </div>
  );
}
