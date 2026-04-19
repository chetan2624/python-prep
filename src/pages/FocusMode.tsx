/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Timer as TimerIcon, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Code2, 
  Maximize2, 
  Minimize2,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Wind,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QUESTIONS_DATA } from '../data/questions';
import { xpGainEvent } from '../App';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ProgressRing = ({ progress, isActive }: { progress: number, isActive: boolean }) => {
  const size = 280;
  const stroke = 8;
  const radius = (size / 2) - (stroke * 2);
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center group" style={{ width: size, height: size }}>
       {/* Outer Glow */}
      <div className={cn(
        "absolute inset-0 rounded-full blur-[40px] transition-all duration-1000",
        isActive ? "bg-orange-500/20 scale-110" : "bg-blue-500/10 scale-100"
      )} />
      
      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          className="text-white/5 dark:text-white/5"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "linear" }}
          strokeLinecap="round"
          className={cn(
            "transition-colors duration-1000",
            isActive ? "text-orange-500" : "text-blue-500"
          )}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
         <motion.div 
           animate={isActive ? { scale: [1, 1.05, 1] } : {}}
           transition={{ repeat: Infinity, duration: 2 }}
           className="flex flex-col items-center"
         >
            <TimerIcon size={32} className={cn("mb-2 transition-colors duration-1000", isActive ? "text-orange-500 animate-pulse" : "text-blue-500")} />
            <span className="text-6xl font-black tracking-tighter tabular-nums drop-shadow-2xl">
              {Math.floor(progress / 4)}:{(progress % 4 * 15).toString().padStart(2, '0')}
            </span>
         </motion.div>
      </div>
    </div>
  );
};

export default function FocusMode() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(QUESTIONS_DATA[Math.floor(Math.random() * QUESTIONS_DATA.length)]);
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
      xpGainEvent(50); // Big XP boost for completion
      if (timerRef.current) clearInterval(timerRef.current);
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
      "transition-all duration-700 flex flex-col",
      isFullScreen ? "fixed inset-0 z-[200] bg-bg p-8 lg:p-20 overflow-hidden" : "space-y-12 pb-24"
    )}>
      {isFullScreen && (
        <>
          <div className="bg-atmospheric opacity-20" style={{ backgroundImage: 'url("https://picsum.photos/seed/stars/1920/1080")' }} />
          <div className="bg-overlay" />
        </>
      )}

      {/* Header Module */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-orange-600/10 rounded-[1.5rem] border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-2xl">
            <TimerIcon size={32} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-text-primary uppercase italic">The Void.</h1>
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] mt-1">Deep Architecture Session</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-4 rounded-2xl glass-morphism border border-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-all shadow-2xl"
          >
            {isFullScreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 flex-1 relative z-10">
        {/* Core Interaction Shell */}
        <div className="lg:col-span-5 space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-morphism p-12 rounded-[4rem] border border-white/5 flex flex-col items-center justify-center text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-purple-600/5 pointer-events-none" />
            
            <div className="mb-12">
               <ProgressRing progress={(timeLeft / (25 * 60)) * 100} isActive={isActive} />
            </div>

            <div className="flex items-center gap-6 relative z-10">
              <button 
                onClick={toggleTimer}
                className={cn(
                  "w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all shadow-2xl",
                  isActive 
                    ? "bg-surface-hover/50 text-text-primary hover:bg-surface-hover border border-white/5" 
                    : "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-600/40 hover:scale-105 active:scale-95"
                )}
              >
                {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </button>
              <button 
                onClick={resetTimer}
                className="w-20 h-20 rounded-[2rem] glass-morphism text-text-secondary hover:bg-white/10 hover:text-text-primary border border-white/5 transition-all flex items-center justify-center hover:scale-105 active:scale-95"
              >
                <RotateCcw size={32} />
              </button>
            </div>
            
            <div className="mt-12 flex flex-col gap-2">
              <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em]">Current Status</span>
              <p className={cn(
                "text-sm font-black transition-all duration-1000",
                isActive ? "text-orange-500 animate-pulse" : "text-text-secondary opacity-60"
              )}>
                {isActive ? "COGNITIVE SYNC ENGAGED" : "SYSTEM IDLE • READY FOR DEEP WORK"}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            <motion.button 
              whileHover={{ y: -5 }}
              onClick={changeQuestion}
              className="p-8 rounded-[2.5rem] glass-morphism border border-white/5 text-left transition-all group overflow-hidden relative shadow-2xl"
            >
              <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                <Sparkles size={20} />
              </div>
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1 opacity-60">Challenge Hook</p>
              <p className="text-sm font-black text-text-primary">Next Logic Protocol</p>
            </motion.button>
            
            <motion.button 
              whileHover={{ y: -5 }}
              onClick={() => setShowHint(!showHint)}
              className="p-8 rounded-[2.5rem] glass-morphism border border-white/5 text-left transition-all group overflow-hidden relative shadow-2xl"
            >
              <div className="absolute inset-x-0 bottom-0 h-1 bg-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <div className="w-10 h-10 bg-orange-600/10 rounded-xl flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform">
                <Lightbulb size={20} />
              </div>
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1 opacity-60">System Aid</p>
              <p className="text-sm font-black text-text-primary">Access Hint Layer</p>
            </motion.button>
          </div>
        </div>

        {/* Neural Workspace */}
        <div className="lg:col-span-7 flex flex-col gap-12">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-morphism p-10 lg:p-16 rounded-[4rem] border border-white/5 flex-1 flex flex-col shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center justify-between mb-12 relative z-10">
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                 <h2 className="text-3xl font-black tracking-tighter text-text-primary uppercase italic">{currentQuestion.title}</h2>
              </div>
              <span className="px-4 py-1.5 bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-500/20 shadow-2xl">
                {currentQuestion.topic}
              </span>
            </div>

            <div className="mb-12 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <Wind size={16} className="text-text-secondary" />
                 <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Environment Statement</span>
              </div>
              <p className="text-xl lg:text-2xl font-bold leading-relaxed text-text-primary opacity-90 drop-shadow-sm">
                {currentQuestion.statement}
              </p>
            </div>

            <AnimatePresence>
              {showHint && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="mb-12 p-8 glass-morphism bg-orange-600/5 border border-orange-600/20 rounded-[2.5rem] text-lg font-bold text-orange-200 flex items-start gap-5 shadow-2xl"
                >
                  <motion.div 
                    animate={{ rotate: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Lightbulb size={28} className="text-orange-500 shrink-0" />
                  </motion.div>
                  <p>{currentQuestion.hints[0]}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Code2 size={16} className="text-text-secondary" />
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Logic Archive</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   <span className="text-[8px] font-black text-text-secondary uppercase">Sync Live</span>
                </div>
              </div>
              <textarea 
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                placeholder="Declare your logic patterns here. Pseudo-code or structural Python accepted."
                className="flex-1 w-full bg-black/20 border border-white/5 rounded-[3rem] p-10 font-mono text-lg focus:outline-none focus:border-blue-500 transition-all resize-none text-text-primary placeholder:opacity-30 leading-relaxed shadow-inner"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Micro-elements */}
      {!isFullScreen && (
        <div className="fixed top-1/2 left-4 -translate-y-1/2 flex flex-col gap-8 opacity-20 pointer-events-none">
          <Moon size={40} className="animate-float" />
          <Wind size={40} className="animate-float" style={{ animationDelay: '1s' }} />
        </div>
      )}
    </div>
  );
}
