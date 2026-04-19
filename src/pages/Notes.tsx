/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Notebook, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  BookOpen, 
  ChevronRight,
  Filter,
  Sparkles,
  Zap,
  Tag,
  Clock,
  Layout,
  StickyNote
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProgress, saveNote, deleteNote } from '../utils/storage';
import { ROADMAP_DATA } from '../data/roadmap';
import { xpGainEvent } from '../App';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Notes() {
  const [progress, setProgress] = useState(getProgress());
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const allTopics = ROADMAP_DATA.flatMap(cat => cat.topics.map(t => ({ id: t.id, title: t.title, category: cat.title })));
  
  const savedNotes = Object.entries(progress.notes).map(([id, content]) => {
    const topic = allTopics.find(t => t.id === id);
    return { id, content, title: topic?.title || id, category: topic?.category || "General Archive" };
  });

  const filteredNotes = savedNotes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (n.content as string).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedTopic || !noteContent) return;
    saveNote(selectedTopic, noteContent);
    xpGainEvent(15); // XP boost for organizing thoughts
    setProgress(getProgress());
    setIsAdding(false);
    setSelectedTopic("");
    setNoteContent("");
    setEditingTopic(null);
  };

  const handleEdit = (id: string, content: any) => {
    setSelectedTopic(id);
    setNoteContent(content as string);
    setEditingTopic(id);
    setIsAdding(true);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete);
      setProgress(getProgress());
      setNoteToDelete(null);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Neural Header */}
      <section className="relative overflow-hidden rounded-[3rem] bg-surface/30 backdrop-blur-xl p-10 lg:p-16 border border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="px-3 py-1 bg-purple-600/10 text-purple-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-purple-500/20">Archive Protocol Gamma</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tighter text-text-primary leading-none uppercase italic">The Base. <br /><span className="text-purple-500">Knowledge.</span></h1>
            <p className="text-lg text-text-secondary font-medium leading-relaxed opacity-80">
              Centralized cognitive archive. Your snippets, logic patterns, and architectural insights preserved for rapid retrieval and revision.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
             <button 
                onClick={() => setIsAdding(true)}
                className="group relative h-40 w-40 flex items-center justify-center transition-all active:scale-90"
             >
                <div className="absolute inset-0 bg-purple-600/20 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative w-24 h-24 bg-purple-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl group-hover:rotate-12 transition-transform">
                   <Plus size={48} />
                </div>
                <span className="absolute -bottom-4 text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-60">Initialize Link</span>
             </button>
          </div>
        </div>
      </section>

      {/* Access Module */}
      <div className="relative group max-w-2xl mx-auto w-full">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="text-text-secondary group-focus-within:text-purple-500 transition-colors" size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search the archive for specific neural links..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-16 bg-surface/80 backdrop-blur-xl border border-white/5 rounded-[2rem] pl-16 pr-8 focus:outline-none focus:border-purple-500 transition-all text-text-primary font-bold shadow-2xl"
        />
      </div>

      {/* Link Cards Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredNotes.map((note, idx) => (
            <motion.div 
              key={note.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-surface/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white/5 hover:border-purple-600/30 transition-all flex flex-col h-full group shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem] pointer-events-none" />
              
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-500 shadow-xl border border-purple-500/20 transition-transform group-hover:scale-110">
                    <StickyNote size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500 mb-1 block opacity-60 italic">{note.category}</span>
                    <h3 className="text-xl font-black text-text-primary tracking-tighter group-hover:text-purple-500 transition-colors uppercase italic">{note.title}</h3>
                  </div>
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0">
                  <button 
                    onClick={() => handleEdit(note.id, note.content)}
                    className="p-3 rounded-xl bg-surface/50 border border-white/5 hover:bg-purple-600/20 text-purple-500 transition-all shadow-2xl"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => setNoteToDelete(note.id)}
                    className="p-3 rounded-xl bg-surface/50 border border-white/5 hover:bg-red-600/20 text-red-500 transition-all shadow-2xl"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex-1 relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Layout size={12} className="text-text-secondary opacity-40" />
                  <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest opacity-40">Internal Data Structure</span>
                </div>
                <p className="text-sm font-bold text-text-secondary leading-relaxed line-clamp-6 whitespace-pre-wrap opacity-80 group-hover:opacity-100 transition-opacity">
                  {note.content}
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                   <Clock size={12} className="text-text-secondary opacity-30" />
                   <span className="text-[8px] font-black uppercase tracking-widest text-text-secondary opacity-30">Updated {new Date().toLocaleDateString()}</span>
                </div>
                <button 
                  onClick={() => handleEdit(note.id, note.content)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-500 hover:text-purple-400 transition-all hover:translate-x-1"
                >
                  Expand Protocol <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredNotes.length === 0 && !isAdding && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 bg-surface/30 backdrop-blur-xl rounded-[4rem] border border-dashed border-white/10 shadow-2xl"
        >
          <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-purple-500 shadow-inner">
            <Notebook size={48} className="animate-float" />
          </div>
          <h3 className="text-3xl font-black text-text-primary tracking-tighter uppercase italic">The Library is Void</h3>
          <p className="text-text-secondary mt-4 font-medium max-w-md mx-auto opacity-70">
            No neural links identified within the current archive parameters. Initialize a new link to begin preservation.
          </p>
          <button 
            onClick={() => setIsAdding(true)}
            className="mt-12 px-10 py-5 bg-purple-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-purple-600/20 flex items-center gap-3 mx-auto"
          >
            <Plus size={20} /> Initialize Link
          </button>
        </motion.div>
      )}

      {/* Add/Edit Immersion Overlay */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsAdding(false)} />
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="relative glass-morphism w-full max-w-3xl rounded-[4rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="p-10 lg:p-16">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <Sparkles size={32} className="text-purple-500 animate-pulse" />
                     <h2 className="text-4xl font-black tracking-tighter text-text-primary uppercase italic">
                      {editingTopic ? "Rewrite Protocol" : "Initialize Link"}
                    </h2>
                  </div>
                  <button onClick={() => setIsAdding(false)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-text-secondary transition-all">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-10">
                  <div className="group relative">
                    <div className="flex items-center gap-3 mb-4">
                      <Tag size={16} className="text-purple-500" />
                      <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Protocol Target</label>
                    </div>
                    <select 
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      disabled={!!editingTopic}
                      className="w-full bg-black/20 border border-white/10 rounded-[2rem] p-6 focus:outline-none focus:border-purple-500 transition-all text-text-primary disabled:opacity-50 font-bold uppercase tracking-widest text-sm"
                    >
                      <option value="" disabled className="bg-bg text-text-secondary">Choose coordinate...</option>
                      {ROADMAP_DATA.map(cat => (
                        <optgroup key={cat.id} label={cat.title} className="bg-bg text-purple-500">
                          {cat.topics.map(t => (
                            <option key={t.id} value={t.id} className="bg-bg text-text-primary">{t.title}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div className="group relative">
                     <div className="flex items-center gap-3 mb-4">
                      <Zap size={16} className="text-purple-500" />
                      <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Cognitive Payload</label>
                    </div>
                    <textarea 
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Input architectural observations, logic hooks, or system warnings..."
                      className="w-full h-80 bg-black/20 border border-white/10 rounded-[3rem] p-10 font-mono text-lg focus:outline-none focus:border-purple-500 transition-all resize-none text-text-primary placeholder:opacity-20 leading-relaxed shadow-inner"
                    />
                  </div>

                  <div className="flex justify-end gap-6 pt-6">
                    <button 
                      onClick={() => setIsAdding(false)}
                      className="px-10 py-5 rounded-[2rem] font-black uppercase text-sm tracking-widest text-text-secondary hover:text-text-primary transition-all"
                    >
                      Abort
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={!selectedTopic || !noteContent}
                      className="px-12 py-5 bg-purple-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-purple-600/40 flex items-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Save size={20} /> Preserved State
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Terminal */}
      <AnimatePresence>
        {noteToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[210] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setNoteToDelete(null)} />
            <motion.div 
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="relative glass-morphism w-full max-w-md rounded-[3rem] border border-red-500/20 shadow-2xl p-10 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent pointer-events-none" />
              
              <div className="w-20 h-20 bg-red-600/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 text-red-500 shadow-2xl border border-red-500/20">
                <Trash2 size={32} className="animate-pulse" />
              </div>
              <h2 className="text-3xl font-black mb-4 text-text-primary uppercase italic tracking-tighter">Sever Protocol?</h2>
              <p className="text-text-secondary mb-10 font-bold opacity-60 uppercase text-[10px] tracking-[0.1em]">
                Irreversible data corruption will occur. The neural link will be permanently terminated.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setNoteToDelete(null)}
                  className="flex-1 h-14 rounded-[1.25rem] font-black uppercase text-[10px] tracking-widest text-text-secondary bg-white/5 hover:bg-white/10 hover:text-text-primary transition-all"
                >
                  Preserve
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 h-14 bg-red-600 text-white rounded-[1.25rem] font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all shadow-2xl shadow-red-600/40"
                >
                  Terminate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
