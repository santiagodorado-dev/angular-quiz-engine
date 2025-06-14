/**
 * Represents a category or subject in the quiz system
 */
export interface Category {
  /** Unique identifier for the category */
  id: string;
  /** Display name of the category */
  name: string;
  /** Description of the category */
  description: string;
  /** List of questions in this category */
  questions: Question[];
}

/**
 * Represents a quiz question with its options and correct answer
 */
export interface Question {
  /** Unique identifier for the question */
  id: string;
  /** The question text */
  text: string;
  /** Array of possible answers */
  options: string[];
  /** The correct answer */
  correctAnswer: string;
  /** Optional explanation for the correct answer */
  explanation?: string;
}

/**
 * Represents a complete quiz
 */
export interface Quiz {
  /** Title of the quiz */
  title: string;
  /** List of questions in the quiz */
  questions: Question[];
  /** Category of the quiz */
  category: string;
}

/**
 * Represents the current state of a quiz session
 */
export interface QuizState {
  isComplete: boolean;
  currentQuestionIndex: number;
  selectedAnswers: string[];
  timeSpent: number;
  category: string;
  score: number;
  questions: QuizQuestion[];
}

/**
 * Represents the final result of a completed quiz
 */
export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  timeSpent: number;
  category: string;
  message: string;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  category: string;
} 