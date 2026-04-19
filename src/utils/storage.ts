/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProgress } from '../types';

const STORAGE_KEY = 'python_learning_progress';

const DEFAULT_PROGRESS: UserProgress = {
  completedSubtopics: [],
  solvedQuestions: [],
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  notes: {},
  tasks: [
    { id: '1', text: 'Complete 2 Python topics', completed: false },
    { id: '2', text: 'Solve 1 Advanced question', completed: false },
    { id: '3', text: 'Write a summary note', completed: false }
  ],
  user: {
    name: '',
    email: '',
    avatar: 'hacker'
  }
};

export const getProgress = (): UserProgress => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return DEFAULT_PROGRESS;
  try {
    const parsed = JSON.parse(data);
    // Ensure tasks exist for older storage
    if (!parsed.tasks) {
      parsed.tasks = DEFAULT_PROGRESS.tasks;
    }
    if (!parsed.user) {
      parsed.user = DEFAULT_PROGRESS.user;
    }
    return parsed;
  } catch (e) {
    return DEFAULT_PROGRESS;
  }
};

export const saveProgress = (progress: UserProgress) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const updateUser = (name: string, email: string, avatar: string) => {
  const progress = getProgress();
  progress.user = { name, email, avatar };
  saveProgress(progress);
};

export const toggleTask = (taskId: string) => {
  const progress = getProgress();
  const task = progress.tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    if (task.completed) {
      progress.xp += 5; // Small XP boost for checking off a goal
    } else {
      progress.xp = Math.max(0, progress.xp - 5);
    }
    saveProgress(progress);
  }
};

export const addTask = (text: string) => {
  const progress = getProgress();
  const newTask = {
    id: Date.now().toString(),
    text,
    completed: false
  };
  progress.tasks.push(newTask);
  saveProgress(progress);
};

export const deleteTask = (taskId: string) => {
  const progress = getProgress();
  progress.tasks = progress.tasks.filter(t => t.id !== taskId);
  saveProgress(progress);
};

export const updateStreak = () => {
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];
  
  if (progress.lastActiveDate === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (progress.lastActiveDate === yesterdayStr) {
    progress.streak += 1;
  } else {
    progress.streak = 1;
  }
  
  progress.lastActiveDate = today;
  saveProgress(progress);
};

export const addXP = (amount: number) => {
  const progress = getProgress();
  progress.xp += amount;
  saveProgress(progress);
};

export const toggleSubtopic = (subtopicId: string) => {
  const progress = getProgress();
  const index = progress.completedSubtopics.indexOf(subtopicId);
  if (index === -1) {
    progress.completedSubtopics.push(subtopicId);
    progress.xp += 20; // XP for completing a topic
  } else {
    progress.completedSubtopics.splice(index, 1);
    progress.xp = Math.max(0, progress.xp - 20);
  }
  saveProgress(progress);
};

export const solveQuestion = (questionId: number) => {
  const progress = getProgress();
  if (!progress.solvedQuestions.includes(questionId)) {
    progress.solvedQuestions.push(questionId);
    progress.xp += 10; // XP for solving a question
    saveProgress(progress);
  }
};

export const toggleQuestion = (questionId: number) => {
  const progress = getProgress();
  const index = progress.solvedQuestions.indexOf(questionId);
  if (index === -1) {
    progress.solvedQuestions.push(questionId);
    progress.xp += 10;
  } else {
    progress.solvedQuestions.splice(index, 1);
    progress.xp = Math.max(0, progress.xp - 10);
  }
  saveProgress(progress);
};

export const saveNote = (topicId: string, content: string) => {
  const progress = getProgress();
  progress.notes[topicId] = content;
  saveProgress(progress);
};

export const deleteNote = (topicId: string) => {
  const progress = getProgress();
  delete progress.notes[topicId];
  saveProgress(progress);
};
