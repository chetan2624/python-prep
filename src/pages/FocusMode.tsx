/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Code2, 
  Maximize2, 
  Minimize2,
  ArrowLeft,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QUESTIONS_DATA } from '../data/questions';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function FocusMode() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(QUESTIONS_DATA[0]);
  const [approach, setApproach] = useState("");
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      // Play sound or notification here
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const changeQuestion = () => {
    const random = QUESTIONS_DATA[Math.floor(Math.random() * QUESTIONS_DATA.length)];
    setCurrentQuestion(random);
    setApproach("");
    setShowHint(false);
  };

  return (
    <div className={cn(
      "transition-all duration-500 flex flex-col",
      isFullScreen ? "fixed inset-0 z-[100] bg-background p-8" : "space-y-8 pb-12"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Timer size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-text-primary">Focus Mode</h1>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Deep Work Session</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-3 rounded-xl bg-surface border border-border hover:bg-surface-hover text-text-secondary transition-colors"
          >
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Timer & Controls */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-surface p-10 rounded-3xl border border-border flex flex-col items-center justify-center text-center shadow-2xl shadow-orange-600/5">
            <div className="relative w-48 h-48 flex items-center justify-center mb-8">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle 
                  cx="96" cy="96" r="88" 
                  fill="none" stroke="currentColor" strokeWidth="8" 
                  className="text-text-secondary/10" 
                />
                <circle 
                  cx="96" cy="96" r="88" 
                  fill="none" stroke="currentColor" strokeWidth="8" 
                  strokeDasharray={553}
                  strokeDashoffset={553 - (553 * (timeLeft / (25 * 60)))}
                  className="text-orange-600 transition-all duration-1000 ease-linear" 
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-5xl font-black tracking-tighter tabular-nums text-text-primary">{formatTime(timeLeft)}</span>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTimer}
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-lg",
                  isActive 
                    ? "bg-surface-hover text-text-primary hover:bg-surface border border-border" 
                    : "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-600/20"
                )}
              >
                {isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </button>
              <button 
                onClick={resetTimer}
                className="w-16 h-16 rounded-2xl bg-surface-hover text-text-secondary hover:bg-surface hover:text-text-primary border border-border transition-all flex items-center justify-center"
              >
                <RotateCcw size={28} />
              </button>
            </div>
            
            <p className="mt-8 text-sm text-text-secondary font-medium">
              {isActive ? "Stay focused, you're doing great!" : "Ready for a deep work session?"}
            </p>
          </div>

          <div className="bg-surface p-8 rounded-3xl border border-border">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-6 flex items-center gap-2">
              <Zap size={14} /> Quick Actions
            </h3>
            <div className="space-y-4">
              <button 
                onClick={changeQuestion}
                className="w-full p-4 rounded-2xl bg-surface-hover border border-border text-left hover:bg-surface transition-all group"
              >
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">New Challenge</p>
                <p className="text-sm font-bold text-text-secondary group-hover:text-text-primary">Get Random Question</p>
              </button>
              <button 
                onClick={() => setShowHint(!showHint)}
                className="w-full p-4 rounded-2xl bg-surface-hover border border-border text-left hover:bg-surface transition-all group"
              >
                <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1">Stuck?</p>
                <p className="text-sm font-bold text-text-secondary group-hover:text-text-primary">Show Hint</p>
              </button>
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface p-8 rounded-3xl border border-border flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black tracking-tight text-text-primary">{currentQuestion.title}</h2>
              <span className="px-3 py-1 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-600/20">
                {currentQuestion.topic}
              </span>
            </div>

            <div className="p-6 bg-surface-hover rounded-2xl border border-border text-lg leading-relaxed mb-8 text-text-primary">
              {currentQuestion.statement}
            </div>

            <AnimatePresence>
              {showHint && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-4 bg-orange-600/10 border border-orange-600/20 rounded-xl text-sm text-orange-900 dark:text-orange-100 flex items-start gap-3"
                >
                  <Lightbulb size={18} className="text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                  <p>{currentQuestion.hints[0]}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">
                <Code2 size={14} /> Your Approach
              </div>
              <textarea 
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                placeholder="Type your logic, pseudo-code, or Python code here..."
                className="flex-1 w-full bg-surface-hover border border-border rounded-2xl p-6 font-mono text-sm focus:outline-none focus:border-blue-600/50 transition-colors resize-none text-text-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
