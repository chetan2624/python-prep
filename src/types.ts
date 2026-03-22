/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Subtopic {
  id: string;
  title: string;
  completed: boolean;
}

export interface Topic {
  id: string;
  title: string;
  subtopics: Subtopic[];
}

export interface RoadmapCategory {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Question {
  id: number;
  title: string;
  category: 'Basic' | 'Intermediate' | 'Advanced';
  topic: string;
  type: 'Story' | 'Logic' | 'Pattern';
  tags: string[];
  time: string;
  statement: string;
  hints: string[];
  solution: string;
  isBonus?: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface UserProgress {
  completedSubtopics: string[]; // IDs of subtopics
  solvedQuestions: number[]; // IDs of questions
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  notes: Record<string, string>; // topicId -> note content
  tasks: Task[];
}
