export type QuestionType = 'single_choice' | 'multiple_choice' | 'code_snippet' | 'coding_challenge';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface TestCase {
  id: string;
  input: string; // descriptive string, e.g. "debounce(fn, 100)"
  expected: string; // stringified or expected result
  testFnBody?: string; // code to run the assertion
  description: string;
}

export interface Question {
  id: string;
  topic: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  prompt: string;
  codeSnippet?: string; // Optional code snippet to analyze
  options?: string[]; // For single & multiple choice
  correctAnswers?: number[]; // 0-indexed indices of correct answers
  initialCode?: string; // Starter code for coding challenge
  testCases?: TestCase[]; // For coding challenge
  solutionCode?: string; // Reference solution
  explanation: string; // In-depth technical explanation
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  category: string;
  description: string;
  durationMinutes: number;
  passingScorePercent: number;
  totalMarks: number;
  negativeMarking: boolean; // deduct 0.25 points for wrong choice
  allowCalculator: boolean;
  questions: Question[];
  badgeTitle: string;
  createdAt: string;
}

export interface CandidateInfo {
  fullName: string;
  email: string;
  candidateId: string;
  organization?: string;
}

export interface IncidentRecord {
  timestamp: number;
  type: 'tab_switch' | 'fullscreen_exit' | 'window_blur';
  message: string;
}

export interface ExamSessionState {
  examId: string;
  candidate: CandidateInfo;
  startTime: number;
  durationSeconds: number;
  selectedAnswers: Record<string, number[]>; // questionId -> option indices
  codeSubmissions: Record<string, string>; // questionId -> candidate code
  testResults: Record<string, { passed: number; total: number; details: any[] }>; // questionId -> test results
  flaggedQuestionIds: string[];
  visitedQuestionIds: string[];
  currentQuestionIndex: number;
  incidents: IncidentRecord[];
  isSubmitted: boolean;
}

export interface QuestionScoreDetail {
  questionId: string;
  isCorrect: boolean;
  userAnswer?: number[];
  userCode?: string;
  scoreEarned: number;
  maxPoints: number;
  partialPassRate?: number; // for coding questions (0 to 1)
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  candidate: CandidateInfo;
  submittedAt: string;
  timeSpentSeconds: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  passingPercentage: number;
  topicBreakdown: Record<string, { earned: number; total: number; percentage: number }>;
  questionDetails: QuestionScoreDetail[];
  incidents: IncidentRecord[];
  certificateId?: string;
}
