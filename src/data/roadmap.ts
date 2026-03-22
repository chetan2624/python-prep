/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const ROADMAP_DATA = [
  {
    id: 'basic',
    title: 'Basic Fundamentals',
    topics: [
      {
        id: 'syntax',
        title: 'Python Syntax & Semantics',
        subtopics: [
          'Variable Declaration & Scope',
          'Dynamic Typing & Type Inference',
          'Standard Data Types (int, float, str, bool)',
          'Type Casting & Coercion'
        ]
      },
      {
        id: 'operators',
        title: 'Operators & Expressions',
        subtopics: [
          'Arithmetic & Floor Division',
          'Comparison & Identity Operators',
          'Logical & Bitwise Operations',
          'Operator Precedence & Associativity'
        ]
      },
      {
        id: 'io',
        title: 'Input / Output Management',
        subtopics: [
          'Standard Input with input()',
          'Formatted Output (f-strings)',
          'String Interpolation Methods',
          'Escape Sequences & Raw Strings'
        ]
      },
      {
        id: 'conditionals',
        title: 'Control Flow: Conditionals',
        subtopics: [
          'Boolean Evaluation Logic',
          'If-Elif-Else Branching',
          'Nested Conditional Logic',
          'Ternary Conditional Expressions'
        ]
      },
      {
        id: 'loops',
        title: 'Control Flow: Iteration',
        subtopics: [
          'For Loops & range() Function',
          'While Loops & Sentinel Values',
          'Loop Control (break, continue, pass)',
          'Else Clause in Loops'
        ]
      }
    ]
  },
  {
    id: 'intermediate',
    title: 'Intermediate Python',
    topics: [
      {
        id: 'data_structures',
        title: 'Advanced Data Structures',
        subtopics: [
          'List Methods & Slicing',
          'Tuple Immutability & Packing',
          'Set Theory & Operations',
          'Dictionary Mapping & Hashing'
        ]
      },
      {
        id: 'functional',
        title: 'Functional Programming',
        subtopics: [
          'Lambda Expressions',
          'Map, Filter, & Reduce',
          'List & Dictionary Comprehensions',
          'Higher-Order Functions'
        ]
      },
      {
        id: 'oop_basics',
        title: 'OOP: Core Principles',
        subtopics: [
          'Class Definition & Instantiation',
          'The __init__ Constructor',
          'Instance vs Static Methods',
          'Self Keyword & Attribute Access'
        ]
      },
      {
        id: 'file_handling',
        title: 'File & Resource Management',
        subtopics: [
          'Context Managers (with statement)',
          'File I/O Modes (r, w, a, b)',
          'Serialization with JSON/Pickle',
          'Directory Traversal with os/pathlib'
        ]
      },
      {
        id: 'error_handling',
        title: 'Exception Management',
        subtopics: [
          'Try-Except-Finally Blocks',
          'Raising Custom Exceptions',
          'Exception Hierarchy & Propagation',
          'Assertions & Debugging'
        ]
      }
    ]
  },
  {
    id: 'advanced',
    title: 'Advanced Python',
    topics: [
      {
        id: 'metaprogramming',
        title: 'Metaprogramming & Introspection',
        subtopics: [
          'Function Wrapping & Closures',
          'Class & Method Decorators',
          'Metaclasses & Type Creation',
          'Reflection with getattr/setattr'
        ]
      },
      {
        id: 'concurrency',
        title: 'Concurrency & Parallelism',
        subtopics: [
          'Global Interpreter Lock (GIL)',
          'Multithreading vs Multiprocessing',
          'Asyncio & Event Loops',
          'Coroutines & await/async'
        ]
      },
      {
        id: 'performance',
        title: 'Performance Optimization',
        subtopics: [
          'Memory-Efficient I/O with Generators',
          'Profiling & Benchmarking',
          'C-Extensions & Cython Intro',
          'Algorithm Complexity in Python'
        ]
      },
      {
        id: 'architecture',
        title: 'Framework Architecture',
        subtopics: [
          'WSGI vs ASGI Standards',
          'Dependency Injection Patterns',
          'Middleware & Request Lifecycle',
          'ORM Design & Database Abstraction'
        ]
      }
    ]
  }
];
