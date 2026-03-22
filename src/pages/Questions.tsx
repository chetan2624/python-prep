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
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QUESTIONS_DATA } from '../data/questions';
import { getProgress, toggleQuestion } from '../utils/storage';
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
  <div 
    onClick={onClick}
    className={cn(
      "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group",
      isSolved 
        ? "bg-green-600/5 border-green-600/20 text-green-600 dark:text-green-400" 
        : "bg-surface border-border hover:border-blue-600/30 hover:bg-surface-hover text-text-primary"
    )}
  >
    <div className="flex items-center gap-4">
      <button 
        onClick={onToggle}
        className={cn(
          "w-6 h-6 rounded-md border flex items-center justify-center transition-all",
          isSolved ? "bg-green-600 border-green-600 text-white" : "border-border hover:border-blue-400 bg-bg"
        )}
      >
        {isSolved && <CheckCircle2 size={14} />}
      </button>
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{question.title}</h4>
          {question.isBonus && (
            <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-tighter rounded-md border border-orange-500/20">
              🔥 Bonus
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {question.tags.slice(0, 2).map((tag: string) => (
            <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-text-secondary opacity-60">{tag}</span>
          ))}
        </div>
      </div>
    </div>
    <ChevronRight size={18} className="text-text-secondary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
  </div>
);

const CategoryCard = ({ 
  title, 
  questions, 
  solvedIds, 
  onToggle, 
  onSelect 
}: { 
  title: string, 
  questions: any[], 
  solvedIds: number[], 
  onToggle: (id: number, e: React.MouseEvent) => void,
  onSelect: (q: any) => void
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Group by topic
  const topics = questions.reduce((acc: any, q: any) => {
    if (!acc[q.topic]) acc[q.topic] = [];
    acc[q.topic].push(q);
    return acc;
  }, {});

  return (
    <div className="bg-surface rounded-3xl border border-border overflow-hidden flex flex-col h-full shadow-sm">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-6 border-b border-border flex items-center justify-between cursor-pointer hover:bg-surface-hover transition-colors"
      >
        <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
          <div className="w-2 h-8 bg-blue-600 rounded-full" />
          {title}
        </h2>
        {isExpanded ? <ChevronUp size={20} className="text-text-secondary" /> : <ChevronDown size={20} className="text-text-secondary" />}
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-8">
              {Object.entries(topics).map(([topic, topicQuestions]: [string, any]) => (
                <div key={topic} className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-600 rounded-full" />
                    {topic}
                  </h3>
                  <div className="space-y-3">
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
    </div>
  );
};

const ChallengeModal = ({ 
  question, 
  onClose 
}: { 
  question: any, 
  onClose: () => void 
}) => {
  const [approach, setApproach] = useState("");
  const [showHint, setShowHint] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8"
    >
      <div className="absolute inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-xl" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative bg-surface w-full max-w-3xl max-h-[90vh] overflow-auto rounded-[2.5rem] border border-border shadow-2xl flex flex-col"
      >
        <div className="p-8 border-b border-border flex items-center justify-between sticky top-0 bg-surface/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Zap size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Random Challenge</h2>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Test your skills</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-surface-hover rounded-2xl text-text-secondary transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-600/20">
                {question.category}
              </span>
              <span className="px-3 py-1 bg-surface-hover text-text-secondary text-[10px] font-bold uppercase tracking-widest rounded-full border border-border">
                {question.topic}
              </span>
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">{question.title}</h3>
            <div className="p-6 bg-bg rounded-3xl border border-border text-lg leading-relaxed">
              {question.statement}
            </div>
          </section>

          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1.5 rounded-xl bg-blue-600/5 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-600/10">
                #{tag}
              </span>
            ))}
          </div>

          <section className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 text-text-secondary uppercase tracking-widest">
              <Code2 size={16} className="text-blue-600 dark:text-blue-400" /> Your Approach
            </h4>
            <textarea 
              value={approach}
              onChange={(e) => setApproach(e.target.value)}
              placeholder="Write your logic or code here..."
              className="w-full h-48 bg-bg border border-border rounded-3xl p-6 font-mono text-sm focus:outline-none focus:border-blue-600/50 transition-colors resize-none text-text-primary"
            />
          </section>

          {showHint && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="p-6 bg-orange-600/10 border border-orange-600/20 rounded-3xl text-sm text-slate-900 dark:text-orange-100 flex items-start gap-4"
            >
              <Lightbulb size={20} className="text-orange-600 dark:text-orange-400 shrink-0 mt-1" />
              <div>
                <span className="font-bold text-orange-600 dark:text-orange-400 uppercase text-[10px] tracking-widest block mb-1">Hint</span>
                {question.hints[0]}
              </div>
            </motion.div>
          )}

          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => setShowHint(!showHint)}
              className="flex-1 py-4 rounded-2xl bg-surface-hover border border-border font-bold text-text-secondary hover:text-text-primary transition-all flex items-center justify-center gap-2"
            >
              <Lightbulb size={18} /> {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Got it!
            </button>
          </div>
        </div>
      </motion.div>
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

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8"
    >
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-surface w-full max-w-4xl max-h-[90vh] overflow-auto rounded-[2.5rem] border border-border shadow-2xl flex flex-col">
        <div className="sticky top-0 bg-surface/80 backdrop-blur-md p-6 border-b border-border flex items-center justify-between z-10">
          <button onClick={onClose} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft size={20} /> Back to Questions
          </button>
          <div className="flex items-center gap-4">
            {isSolved && <span className="px-3 py-1 bg-green-600/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-full border border-green-600/20">Solved</span>}
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{question.category} • {question.topic}</span>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <h2 className="text-3xl font-black mb-4 tracking-tight">{question.title}</h2>
            <div className="p-6 bg-bg rounded-3xl border border-border text-lg leading-relaxed">
              {question.statement}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Code2 className="text-blue-600 dark:text-blue-400" /> Your Approach
            </h3>
            <textarea 
              value={approach}
              onChange={(e) => setApproach(e.target.value)}
              placeholder="Write your logic or code here..."
              className="w-full h-48 bg-bg border border-border rounded-3xl p-6 font-mono text-sm focus:outline-none focus:border-blue-600/50 transition-colors resize-none text-text-primary"
            />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setShowHint1(!showHint1)}
              className={cn(
                "p-4 rounded-2xl border transition-all flex flex-col items-center gap-2",
                showHint1 ? "bg-blue-600/10 border-blue-600/30 text-blue-600 dark:text-blue-400" : "bg-surface-hover border-border text-text-secondary hover:bg-surface"
              )}
            >
              <Lightbulb size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Hint 1</span>
            </button>
            <button 
              onClick={() => setShowHint2(!showHint2)}
              className={cn(
                "p-4 rounded-2xl border transition-all flex flex-col items-center gap-2",
                showHint2 ? "bg-blue-600/10 border-blue-600/30 text-blue-600 dark:text-blue-400" : "bg-surface-hover border-border text-text-secondary hover:bg-surface"
              )}
            >
              <Lightbulb size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Hint 2</span>
            </button>
            <button 
              onClick={() => setShowSolution(!showSolution)}
              className={cn(
                "p-4 rounded-2xl border transition-all flex flex-col items-center gap-2",
                showSolution ? "bg-green-600/10 border-green-600/30 text-green-600 dark:text-green-400" : "bg-surface-hover border-border text-text-secondary hover:bg-surface"
              )}
            >
              <CheckCircle2 size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Solution</span>
            </button>
          </section>

          <AnimatePresence>
            {(showHint1 || showHint2 || showSolution) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {showHint1 && (
                  <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-xl text-sm text-slate-900 dark:text-blue-100">
                    <span className="font-bold text-blue-600 dark:text-blue-400 uppercase text-[10px] tracking-widest block mb-1">Hint 1</span>
                    {question.hints[0]}
                  </div>
                )}
                {showHint2 && (
                  <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-xl text-sm text-slate-900 dark:text-blue-100">
                    <span className="font-bold text-blue-600 dark:text-blue-400 uppercase text-[10px] tracking-widest block mb-1">Hint 2</span>
                    {question.hints[1]}
                  </div>
                )}
                {showSolution && (
                  <div className="p-6 bg-green-600/10 border border-green-600/20 rounded-2xl">
                    <span className="font-bold text-green-600 dark:text-green-400 uppercase text-[10px] tracking-widest block mb-2">Reference Solution</span>
                    <pre className="font-mono text-sm text-slate-900 dark:text-green-100 whitespace-pre-wrap">{question.solution}</pre>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-8 flex justify-end gap-4">
            <button 
              onClick={onClose}
              className="px-8 py-3 rounded-xl font-bold text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            {!isSolved && (
              <button 
                onClick={onSolve}
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center gap-2"
              >
                <Trophy size={18} /> Mark as Solved (+10 XP)
              </button>
            )}
          </div>
        </div>
      </div>
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
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Practice Questions</h1>
          <p className="text-gray-500 max-w-xl leading-relaxed">
            Master Python by solving structured problems. Organized by category and topic. 
            Track your progress with checkboxes and challenge yourself randomly.
          </p>
        </div>
        <button 
          onClick={handleChallengeMe}
          className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3 group"
        >
          <Zap size={20} className="group-hover:animate-pulse" /> Challenge Me
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
        <input 
          type="text" 
          placeholder="Search by title, topic, or tags..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-600/50 transition-colors text-text-primary"
        />
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <CategoryCard 
          title="Basic Fundamentals" 
          questions={basicQuestions} 
          solvedIds={progress.solvedQuestions}
          onToggle={handleToggle}
          onSelect={setActiveQuestion}
        />
        <CategoryCard 
          title="Intermediate Python" 
          questions={intermediateQuestions} 
          solvedIds={progress.solvedQuestions}
          onToggle={handleToggle}
          onSelect={setActiveQuestion}
        />
        <CategoryCard 
          title="Advanced Python" 
          questions={advancedQuestions} 
          solvedIds={progress.solvedQuestions}
          onToggle={handleToggle}
          onSelect={setActiveQuestion}
        />
      </div>

      {/* Question Modal */}
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

      {/* Challenge Modal */}
      <AnimatePresence>
        {challengeQuestion && (
          <ChallengeModal 
            question={challengeQuestion}
            onClose={() => setChallengeQuestion(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
