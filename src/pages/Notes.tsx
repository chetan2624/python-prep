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
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProgress, saveNote, deleteNote } from '../utils/storage';
import { ROADMAP_DATA } from '../data/roadmap';
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
    return { id, content, title: topic?.title || id, category: topic?.category || "General" };
  });

  const filteredNotes = savedNotes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (n.content as string).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedTopic || !noteContent) return;
    saveNote(selectedTopic, noteContent);
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
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight text-text-primary">Personal Notes</h1>
          <p className="text-text-secondary max-w-xl leading-relaxed">
            Keep track of your learnings, snippets, and important concepts. 
            Organize your thoughts per topic for quick revision.
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
        >
          <Plus size={18} /> New Note
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input 
            type="text" 
            placeholder="Search your notes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-600/50 transition-colors text-text-primary"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredNotes.map(note => (
            <motion.div 
              key={note.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-surface p-6 rounded-3xl border border-border hover:border-blue-600/30 transition-all flex flex-col h-full group shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1 block">{note.category}</span>
                  <h3 className="text-lg font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-text-primary">{note.title}</h3>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(note.id, note.content)}
                    className="p-2 rounded-lg bg-surface-hover hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => setNoteToDelete(note.id)}
                    className="p-2 rounded-lg bg-surface-hover hover:bg-red-600/20 text-red-600 dark:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed flex-1 line-clamp-4 whitespace-pre-wrap">
                {note.content}
              </p>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Last updated {new Date().toLocaleDateString()}</span>
                <button 
                  onClick={() => handleEdit(note.id, note.content)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                >
                  Read More <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredNotes.length === 0 && !isAdding && (
        <div className="text-center py-20 bg-surface rounded-3xl border border-dashed border-border">
          <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-4 text-text-secondary">
            <Notebook size={32} />
          </div>
          <h3 className="text-xl font-bold text-text-primary">No notes found</h3>
          <p className="text-text-secondary mt-2">Start writing notes to keep track of your learning.</p>
          <button 
            onClick={() => setIsAdding(true)}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Create First Note
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative bg-surface w-full max-w-2xl rounded-3xl border border-border shadow-2xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black tracking-tight text-text-primary">
                  {editingTopic ? "Edit Note" : "New Note"}
                </h2>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-surface-hover rounded-lg text-text-secondary">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest block mb-2">Select Topic</label>
                  <select 
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    disabled={!!editingTopic}
                    className="w-full bg-surface-hover border border-border rounded-xl p-4 focus:outline-none focus:border-blue-600/50 transition-colors text-text-primary disabled:opacity-50"
                  >
                    <option value="" disabled>Choose a topic...</option>
                    {ROADMAP_DATA.map(cat => (
                      <optgroup key={cat.id} label={cat.title}>
                        {cat.topics.map(t => (
                          <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest block mb-2">Note Content</label>
                  <textarea 
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Write your notes, code snippets, or reminders here..."
                    className="w-full h-64 bg-surface-hover border border-border rounded-xl p-6 font-sans text-sm focus:outline-none focus:border-blue-600/50 transition-colors resize-none text-text-primary"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="px-6 py-3 rounded-xl font-bold text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={!selectedTopic || !noteContent}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={18} /> Save Note
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {noteToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setNoteToDelete(null)} />
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative bg-surface w-full max-w-md rounded-3xl border border-border shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                <Trash2 size={32} />
              </div>
              <h2 className="text-2xl font-black mb-2 text-text-primary">Delete Note?</h2>
              <p className="text-text-secondary mb-8">
                Are you sure you want to delete this note? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setNoteToDelete(null)}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-text-secondary bg-surface-hover hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
