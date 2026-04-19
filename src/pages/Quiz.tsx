/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  BrainCircuit, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Download,
  AlertCircle,
  Play,
  RotateCcw,
  Code2,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { xpGainEvent } from '../App';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { jsPDF } from 'jspdf';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Question {
  question: string;
  options: string[];
  correct: string;
}

const MOCK_QUIZ_QUESTIONS: Question[] = [
  {
    question: "What is the output of `print(type([]))` in Python?",
    options: ["<class 'list'>", "<class 'dict'>", "<class 'tuple'>", "<class 'array'>"],
    correct: "<class 'list'>"
  },
  {
    question: "Which keyword is used to define a function in Python?",
    options: ["fun", "define", "def", "func"],
    correct: "def"
  },
  {
    question: "How do you create a variable with the numeric value 5?",
    options: ["x = 5", "x : 5", "x := 5", "int x = 5"],
    correct: "x = 5"
  },
  {
    question: "What is the correct way to start a 'for' loop in Python?",
    options: ["for x in y:", "for x to y:", "for (x=0; x<y; x++)", "for each x in y"],
    correct: "for x in y:"
  },
  {
    question: "Which of these collections is ordered, changeable, and allows duplicate members?",
    options: ["Set", "List", "Dictionary", "Tuple"],
    correct: "List"
  }
];

export default function Quiz() {
  const [stage, setStage] = useState<'intro' | 'selection' | 'playing' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startQuiz = () => {
    setQuizQuestions([...MOCK_QUIZ_QUESTIONS].sort(() => Math.random() - 0.5));
    setAnswers(new Array(MOCK_QUIZ_QUESTIONS.length).fill(null));
    setCurrentQuestionIndex(0);
    setStage('playing');
    setTimeLeft(20);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(20);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStage('results');
    const correctCount = answers.filter((ans, idx) => ans === quizQuestions[idx].correct).length;
    xpGainEvent(correctCount * 10);
  };

  useEffect(() => {
    if (stage === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            nextQuestion();
            return 20;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage, currentQuestionIndex]);

  const handleSelect = (option: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = option;
    setAnswers(newAnswers);
    // Auto jump to next question after selection or wait for timer?
    // User said: "set the timer for each question only for 20 secs and then jump on the second question do not wait for the answer"
    // I Interpreted this as: after selection, we can wait or jump. Let's wait for the timer or allow manual next.
    // Actually, "do not wait for the answer" might mean "if user doesn't answer, jump".
    // Let's jump immediately after selection for a fast-paced feel.
    setTimeout(() => nextQuestion(), 300);
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    const correctCount = answers.filter((ans, idx) => ans === quizQuestions[idx].correct).length;
    const score = Math.round((correctCount / quizQuestions.length) * 100);

    doc.setFontSize(22);
    doc.text("PYTHON PREP: QUIZ PERFORMANCE REPORT", 20, 30);
    doc.setFontSize(14);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
    doc.text(`Final Score: ${score}%`, 20, 55);
    doc.text(`Correct Answers: ${correctCount}/${quizQuestions.length}`, 20, 65);
    
    doc.text("Question Details:", 20, 85);
    quizQuestions.forEach((q, i) => {
      const y = 95 + (i * 30);
      if (y > 270) doc.addPage();
      doc.setFontSize(10);
      doc.text(`${i + 1}. ${q.question}`, 20, y);
      doc.text(`Your Answer: ${answers[i] || 'No Answer'}`, 25, y + 5);
      doc.text(`Correct Answer: ${q.correct}`, 25, y + 10);
    });

    doc.save("Python_Quiz_Report.pdf");
  };

  return (
    <div className="min-h-screen pt-4 pb-24">
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="max-w-3xl mx-auto glass-morphism p-12 rounded-[3rem] border border-white/5 shadow-2xl space-y-8"
          >
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center text-blue-500 shadow-2xl border border-blue-500/20">
                <BrainCircuit size={48} />
              </div>
              <h1 className="text-5xl font-black tracking-tighter uppercase italic text-text-primary">QUICK <span className="text-blue-600">QUIZ</span></h1>
              <p className="text-xl text-text-secondary leading-relaxed font-medium">
                Test your Python cognitive patterns in a high-speed execution environment. 
                Evaluate your architectural grasp through rapid protocols.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-surface/30 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center gap-3 text-blue-500 font-black uppercase text-xs tracking-widest">
                  <Clock size={16} /> Time Constraint
                </div>
                <p className="text-sm font-medium text-text-secondary">Execute each protocol within 20 seconds. Failure results in automatic skipping.</p>
              </div>
              <div className="p-6 bg-surface/30 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center gap-3 text-emerald-500 font-black uppercase text-xs tracking-widest">
                  <Zap size={16} /> Cognitive Gain
                </div>
                <p className="text-sm font-medium text-text-secondary">Earn 10 XP for every successful decryption. Results archived in local memory.</p>
              </div>
            </div>

            <button 
              onClick={() => setStage('selection')}
              className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center gap-4 group"
            >
              INITIALIZE CHALLENGE <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        )}

        {stage === 'selection' && (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Variant SELECTION</h2>
              <p className="text-text-secondary font-medium">Choose your testing environment</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <SelectionCard 
                title="Theory Core" 
                desc="Deep dive into Python internals and architectural concepts."
                icon={BookOpen}
                color="bg-purple-600"
                comingSoon
              />
              <SelectionCard 
                title="Coding Syntax" 
                desc="Real-word snippet analysis and syntax validation trials."
                icon={Code2}
                color="bg-emerald-600"
                comingSoon
              />
              <SelectionCard 
                title="Random Probe" 
                desc="Dynamic mix of all variants for ultimate cognitive stress-test."
                icon={Zap}
                color="bg-blue-600"
                onStart={startQuiz}
              />
            </div>

            <button 
              onClick={() => setStage('intro')}
              className="mx-auto flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-black uppercase text-xs tracking-widest"
            >
              <ArrowLeft size={16} /> RETURN TO ARCHIVE
            </button>
          </motion.div>
        )}

        {stage === 'playing' && (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black tracking-tighter text-blue-600">0{currentQuestionIndex + 1}</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60">Sequence Protocol</span>
                  <div className="flex gap-1 mt-1">
                    {quizQuestions.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          idx === currentQuestionIndex ? "w-8 bg-blue-600" : idx < currentQuestionIndex ? "w-2 bg-emerald-600 opacity-40" : "w-1.5 bg-white/10"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60">Time Remaining</span>
                <span className={cn(
                  "text-3xl font-black tracking-tighter",
                  timeLeft < 5 ? "text-red-500 animate-pulse" : "text-text-primary"
                )}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
              </div>
            </div>

            <motion.div 
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-surface/30 backdrop-blur-xl p-12 rounded-[3.5rem] border border-white/10 shadow-2xl min-h-[300px] flex flex-col justify-center"
            >
              <h3 className="text-3xl font-black leading-tight tracking-tight text-text-primary mb-12">
                {quizQuestions[currentQuestionIndex].question}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizQuestions[currentQuestionIndex].options.map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className={cn(
                      "p-6 rounded-[2rem] border text-left font-black tracking-tight transition-all text-lg group relative overflow-hidden",
                      answers[currentQuestionIndex] === opt 
                        ? "bg-blue-600 border-blue-400 text-white shadow-xl translate-y-[-4px]" 
                        : "glass-morphism border-white/5 text-text-secondary hover:border-blue-500/30 hover:text-text-primary hover:bg-white/5 active:scale-95"
                    )}
                  >
                    <span className="relative z-10">{opt}</span>
                    <div className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center opacity-10 group-hover:opacity-40 transition-opacity">
                      <span className="text-4xl italic">{i + 1}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {stage === 'results' && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto glass-morphism p-16 rounded-[4rem] border border-white/10 shadow-2xl text-center space-y-12 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-emerald-600/20 rounded-[2.5rem] flex items-center justify-center text-emerald-500 shadow-2xl border border-emerald-500/20">
                <Trophy size={48} />
              </div>
              <div>
                <h2 className="text-5xl font-black uppercase italic tracking-tighter text-text-primary">Mission <span className="text-emerald-500">COMPLETE</span></h2>
                <p className="text-text-secondary font-medium mt-2">Evaluation sequence successfully archived</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="p-8 glass-morphism rounded-[2.5rem] border border-white/5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60 block mb-4">Final Score</span>
                <span className="text-5xl font-black tracking-tighter text-blue-600">
                  {Math.round((answers.filter((ans, idx) => ans === quizQuestions[idx].correct).length / quizQuestions.length) * 100)}%
                </span>
              </div>
              <div className="p-8 glass-morphism rounded-[2.5rem] border border-white/5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-60 block mb-4">Decrypted</span>
                <span className="text-5xl font-black tracking-tighter text-emerald-600">
                  {answers.filter((ans, idx) => ans === quizQuestions[idx].correct).length}/{quizQuestions.length}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button 
                onClick={startQuiz}
                className="flex-1 py-6 bg-surface-hover/50 border border-white/5 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-surface-hover hover:border-blue-500/30 transition-all active:scale-95"
              >
                <RotateCcw size={18} /> Relaunch Trial
              </button>
              <button 
                onClick={downloadReport}
                className="flex-1 py-6 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
              >
                <Download size={18} /> Download Archive (PDF)
              </button>
            </div>

            <button 
              onClick={() => setStage('selection')}
              className="text-xs font-black text-text-secondary hover:text-text-primary uppercase tracking-widest block mx-auto underline underline-offset-8 decoration-white/10"
            >
              Back to Selection
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SelectionCard({ 
  title, 
  desc, 
  icon: Icon, 
  color, 
  onStart, 
  comingSoon 
}: { 
  title: string, 
  desc: string, 
  icon: any, 
  color: string, 
  onStart?: () => void, 
  comingSoon?: boolean 
}) {
  return (
    <div className={cn(
      "relative group transition-all",
      comingSoon ? "opacity-60 grayscale blur-[2px] pointer-events-none" : "hover:-translate-y-2"
    )}>
      <div className="glass-morphism p-8 rounded-[3rem] border border-white/10 flex flex-col h-full shadow-2xl relative overflow-hidden">
        <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 shadow-2xl relative z-10", color)}>
          <Icon size={32} className="text-white" />
        </div>
        
        <div className="relative z-10 flex-1">
          <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4 text-text-primary">{title}</h3>
          <p className="text-sm font-medium text-text-secondary leading-relaxed">{desc}</p>
        </div>

        {comingSoon ? (
          <div className="mt-10 flex items-center gap-2 text-text-secondary font-black uppercase text-[10px] tracking-widest bg-black/10 px-4 py-2 rounded-xl border border-white/5 w-fit">
            <AlertCircle size={14} /> System Encrypted
          </div>
        ) : (
          <button 
            onClick={onStart}
            className="mt-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-blue-600/10 active:scale-95"
          >
            Launch Probe <Play size={14} className="fill-current" />
          </button>
        )}
      </div>
      {comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <span className="px-6 py-2 bg-black/80 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">COMING SOON</span>
        </div>
      )}
    </div>
  );
}
