/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Zap, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Tag, 
  ChevronRight, 
  Lightbulb, 
  Code2, 
  ArrowLeft,
  Trophy,
  Play,
  X,
  ChevronDown,
  ChevronUp,
  Terminal,
  Cpu,
  BrainCircuit,
  Binary
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QUESTIONS_DATA } from '../data/questions';
import { getProgress, toggleQuestion } from '../utils/storage';
import { xpGainEvent } from '../App';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const QuestionItem: React.FC<{ 
  question: any, 
  isSolved: boolean, 
  onToggle: (e: React.MouseEvent) => void,
  onClick: () => void
}> = ({ 
  question, 
  isSolved, 
  onToggle,
  onClick
}) => (
  <motion.div 
    layout
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    onClick={onClick}
    className={cn(
      "flex items-center justify-between p-5 rounded-3xl border transition-all cursor-pointer group shadow-lg",
      isSolved 
        ? "bg-emerald-600/10 border-emerald-500/30 text-emerald-500" 
        : "glass-morphism border-white/5 hover:border-blue-500/40 hover:bg-white/10 text-text-primary"
    )}
  >
    <div className="flex items-center gap-5">
      <button 
        onClick={onToggle}
        className={cn(
          "w-8 h-8 rounded-xl border flex items-center justify-center transition-all shadow-inner",
          isSolved ? "bg-emerald-600 border-emerald-500 text-white" : "border-white/10 hover:border-blue-400 bg-black/20"
        )}
      >
        {isSolved && <CheckCircle2 size={16} />}
      </button>
      <div>
        <div className="flex items-center gap-3">
          <h4 className="font-black tracking-tight group-hover:text-blue-400 transition-colors uppercase italic text-sm">{question.title}</h4>
          {question.isBonus && (
            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[8px] font-black uppercase tracking-widest rounded-lg border border-orange-500/30 animate-pulse">
              HOT
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {question.tags.slice(0, 2).map((tag: string) => (
            <span key={tag} className="text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40 italic">{tag}</span>
          ))}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
       <button className="opacity-0 group-hover:opacity-100 p-2 bg-blue-600/10 text-blue-500 rounded-lg transition-all translate-x-2 group-hover:translate-x-0">
          <Play size={14} />
       </button>
       <ChevronRight size={20} className="text-text-secondary group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
    </div>
  </motion.div>
);

const CategoryBar = ({ 
  title, 
  questions, 
  solvedIds, 
  onToggle, 
  onSelect,
  icon: Icon,
  bgImage
}: { 
  title: string, 
  questions: any[], 
  solvedIds: number[], 
  onToggle: (id: number, e: React.MouseEvent) => void,
  onSelect: (q: any) => void,
  icon: any,
  bgImage: string
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const topics = questions.reduce((acc: any, q: any) => {
    if (!acc[q.topic]) acc[q.topic] = [];
    acc[q.topic].push(q);
    return acc;
  }, {});

  const solvedCount = questions.filter(q => solvedIds.includes(q.id)).length;
  const progress = (solvedCount / questions.length) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-morphism rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl relative mb-8"
    >
      {/* Background Image / Texture (Request #7 Part 2) */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none" 
        style={{ backgroundImage: `url("${bgImage}")` }}
      />

      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-8 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all relative z-10 group"
      >
        <div className="flex items-center gap-6">
          <div className="relative">
             <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Icon size={32} />
             </div>
             <div className="absolute -top-2 -right-2">
                <div className="w-8 h-8 bg-surface border border-border rounded-full flex items-center justify-center">
                   <span className="text-[10px] font-black">{Math.round(progress)}%</span>
                </div>
             </div>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tighter uppercase italic text-text-primary group-hover:text-blue-500 transition-colors uppercase italic">{title}</h2>
            <div className="flex items-center gap-3 mt-1">
               <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">{solvedCount}/{questions.length} Decrypted Protocols</span>
               <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-blue-600"
                  />
               </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {isExpanded ? <ChevronUp size={28} className="text-blue-500" /> : <ChevronDown size={28} className="text-text-secondary" />}
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-8 space-y-12 relative z-10">
              {Object.entries(topics).map(([topic, topicQuestions]: [string, any]) => (
                <div key={topic} className="space-y-6">
                  <div className="flex items-center gap-4">
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 italic opacity-60 uppercase">{topic}</span>
                     <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topicQuestions.map((q: any) => (
                      <QuestionItem 
                        key={q.id} 
                        question={q} 
                        isSolved={solvedIds.includes(q.id)}
                        onToggle={(e) => onToggle(q.id, e)}
                        onClick={() => onSelect(q)}
                      />
                    ))}
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

const QuestionView = ({ 
  question, 
  isSolved, 
  onClose, 
  onSolve 
}: { 
  question: any, 
  isSolved: boolean, 
  onClose: () => void, 
  onSolve: () => void 
}) => {
  const [showHint1, setShowHint1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [approach, setApproach] = useState("");

  const handleSolveWithXP = () => {
    onSolve();
    xpGainEvent(25);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="relative glass-morphism w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[4rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="sticky top-0 glass-morphism p-10 border-b border-white/5 flex items-center justify-between z-20">
          <button onClick={onClose} className="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-all group font-black uppercase text-[10px] tracking-widest">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> TERMINATE PROTOCOL
          </button>
          <div className="flex items-center gap-6">
            {isSolved && (
              <div className="px-4 py-1.5 bg-emerald-600/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-emerald-500/20">
                DECRYPTED
              </div>
            )}
            <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] italic">{question.category} • {question.topic}</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-12 lg:p-20 space-y-16 custom-scrollbar">
          <section>
            <div className="flex items-center gap-3 mb-6">
               <Binary size={16} className="text-blue-500" />
               <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] opacity-40">Statement Archive</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-8 tracking-tighter text-text-primary uppercase italic leading-none">{question.title}</h2>
            <div className="p-10 bg-black/20 rounded-[3rem] border border-white/5 text-xl font-bold leading-relaxed shadow-inner">
              {question.statement}
            </div>
          </section>

          <section className="space-y-6">
             <div className="flex items-center gap-3 mb-6">
               <Cpu size={16} className="text-blue-500" />
               <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] opacity-40">Your Local Shell</span>
            </div>
            <textarea 
              value={approach}
              onChange={(e) => setApproach(e.target.value)}
              placeholder="Input your architectural logic or code snippet here..."
              className="w-full h-80 bg-black/30 border border-white/5 rounded-[3rem] p-12 font-mono text-lg focus:outline-none focus:border-blue-500 transition-all resize-none text-text-primary placeholder:opacity-20 leading-relaxed shadow-inner"
            />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => setShowHint1(!showHint1)}
              className={cn(
                "p-8 rounded-[2.5rem] border transition-all flex flex-col items-center justify-center gap-4 group",
                showHint1 ? "bg-orange-600/10 border-orange-500/30 text-orange-400" : "glass-morphism border-white/5 text-text-secondary hover:bg-white/10"
              )}
            >
              <Lightbulb size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Module Aid 01</span>
            </button>
            <button 
              onClick={() => setShowHint2(!showHint2)}
              className={cn(
                "p-8 rounded-[2.5rem] border transition-all flex flex-col items-center justify-center gap-4 group",
                showHint2 ? "bg-orange-600/10 border-orange-500/30 text-orange-400" : "glass-morphism border-white/5 text-text-secondary hover:bg-white/10"
              )}
            >
              <Lightbulb size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Module Aid 02</span>
            </button>
            <button 
              onClick={() => setShowSolution(!showSolution)}
              className={cn(
                "p-8 rounded-[2.5rem] border transition-all flex flex-col items-center justify-center gap-4 group",
                showSolution ? "bg-emerald-600/10 border-emerald-500/30 text-emerald-500" : "glass-morphism border-white/5 text-text-secondary hover:bg-white/10"
              )}
            >
              <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Source Reveal</span>
            </button>
          </section>

          <AnimatePresence>
            {(showHint1 || showHint2 || showSolution) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {showHint1 && (
                  <div className="p-8 glass-morphism bg-orange-600/5 border border-orange-500/20 rounded-[2.5rem] text-lg font-bold text-orange-200 shadow-2xl">
                    <span className="font-black text-orange-500 uppercase text-[10px] tracking-[0.4em] block mb-4 italic opacity-60">System Hint A</span>
                    {question.hints[0]}
                  </div>
                )}
                {showHint2 && (
                  <div className="p-8 glass-morphism bg-orange-600/5 border border-orange-500/20 rounded-[2.5rem] text-lg font-bold text-orange-200 shadow-2xl">
                    <span className="font-black text-orange-500 uppercase text-[10px] tracking-[0.4em] block mb-4 italic opacity-60">System Hint B</span>
                    {question.hints[1]}
                  </div>
                )}
                {showSolution && (
                  <div className="p-12 glass-morphism bg-emerald-600/5 border border-emerald-500/20 rounded-[3rem] shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8">
                       <Terminal size={32} className="text-emerald-500 opacity-20" />
                    </div>
                    <span className="font-black text-emerald-500 uppercase text-[10px] tracking-[0.4em] block mb-6 italic opacity-60">Master Source Decoding</span>
                    <pre className="font-mono text-base text-emerald-200 whitespace-pre-wrap leading-relaxed">{question.solution}</pre>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-10 glass-morphism border-t border-white/5 flex flex-col sm:flex-row justify-end gap-6 z-20">
          <button 
            onClick={onClose}
            className="px-10 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest text-text-secondary hover:text-text-primary transition-all active:scale-95"
          >
            Abort Probe
          </button>
          {!isSolved && (
            <button 
              onClick={handleSolveWithXP}
              className="px-12 py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3"
            >
              <Trophy size={18} /> Solve +10 XP
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Questions() {
  const [progress, setProgress] = useState(getProgress());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuestion, setActiveQuestion] = useState<any | null>(null);
  const [challengeQuestion, setChallengeQuestion] = useState<any | null>(null);

  const filteredQuestions = QUESTIONS_DATA.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const basicQuestions = filteredQuestions.filter(q => q.category === 'Basic');
  const intermediateQuestions = filteredQuestions.filter(q => q.category === 'Intermediate');
  const advancedQuestions = filteredQuestions.filter(q => q.category === 'Advanced');

  const handleToggle = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleQuestion(id);
    setProgress(getProgress());
  };

  const handleSolve = () => {
    if (activeQuestion) {
      toggleQuestion(activeQuestion.id);
      setProgress(getProgress());
      setActiveQuestion(null);
    }
  };

  const handleChallengeMe = () => {
    const random = QUESTIONS_DATA[Math.floor(Math.random() * QUESTIONS_DATA.length)];
    setChallengeQuestion(random);
  };

  return (
    <div className="space-y-16 pb-24">
      {/* High-Fi Header */}
      <section className="relative overflow-hidden rounded-[4rem] glass-morphism p-12 lg:p-20 border border-white/5 shadow-2xl">
         <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
         
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-2xl">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 shadow-2xl border border-blue-500/20">
                     <BrainCircuit size={28} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-text-secondary opacity-60">Neural Practice Array</span>
               </div>
               <h1 className="text-5xl lg:text-7xl font-black mb-8 tracking-tighter text-text-primary uppercase italic leading-none">Logic <br /><span className="text-blue-500">Challenges.</span></h1>
               <p className="text-xl text-text-secondary font-medium leading-relaxed opacity-80">
                  Execute structural Python protocols across variant complexity tiers. Organized logic units for progressive cognitive enhancement.
               </p>
            </div>
            
            <button 
              onClick={handleChallengeMe}
              className="px-12 py-8 bg-blue-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_40px_80px_-20px_rgba(37,99,235,0.4)] flex items-center gap-6 group self-start lg:self-center"
            >
              <Zap size={32} className="group-hover:animate-pulse" />
              <div className="text-left">
                <span className="block text-xs opacity-60">Initialize</span>
                <span className="block text-xl">Random Probe</span>
              </div>
            </button>
         </div>
      </section>

      {/* Access Terminal */}
      <div className="relative group max-w-3xl mx-auto w-full">
        <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
          <Search className="text-text-secondary group-focus-within:text-blue-500 transition-colors" size={24} />
        </div>
        <input 
          type="text" 
          placeholder="Filter protocols by identification, tag, or complexity..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-20 bg-surface/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] pl-20 pr-10 focus:outline-none focus:border-blue-500 transition-all text-text-primary font-bold shadow-2xl"
        />
      </div>

      {/* Categories Bar Layout (Request #7) */}
      <div className="max-w-6xl mx-auto space-y-6">
        <CategoryBar 
          title="Basic Shell" 
          icon={Terminal}
          questions={basicQuestions} 
          solvedIds={progress.solvedQuestions}
          onToggle={handleToggle}
          onSelect={setActiveQuestion}
          bgImage="https://picsum.photos/seed/shell/1200/400"
        />
        <CategoryBar 
          title="Inter Logic" 
          icon={Cpu}
          questions={intermediateQuestions} 
          solvedIds={progress.solvedQuestions}
          onToggle={handleToggle}
          onSelect={setActiveQuestion}
          bgImage="https://picsum.photos/seed/logic/1200/400"
        />
        <CategoryBar 
          title="Deep Core" 
          icon={BrainCircuit}
          questions={advancedQuestions} 
          solvedIds={progress.solvedQuestions}
          onToggle={handleToggle}
          onSelect={setActiveQuestion}
          bgImage="https://picsum.photos/seed/braincore/1200/400"
        />
      </div>

      {/* Terminal Modals */}
      <AnimatePresence>
        {activeQuestion && (
          <QuestionView 
            question={activeQuestion}
            isSolved={progress.solvedQuestions.includes(activeQuestion.id)}
            onClose={() => setActiveQuestion(null)}
            onSolve={handleSolve}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {challengeQuestion && (
          <QuestionView 
            question={challengeQuestion}
            isSolved={progress.solvedQuestions.includes(challengeQuestion.id)}
            onClose={() => setChallengeQuestion(null)}
            onSolve={() => {
               toggleQuestion(challengeQuestion.id);
               setProgress(getProgress());
               setChallengeQuestion(null);
               xpGainEvent(25);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
