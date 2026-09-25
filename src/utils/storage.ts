import { Exam, ExamResult, ExamSessionState, CandidateInfo } from '../types/exam';
import { DEFAULT_EXAMS } from '../data/defaultExams';

const STORAGE_KEYS = {
  CUSTOM_EXAMS: 'evalscript_custom_exams',
  EXAM_RESULTS: 'evalscript_exam_results',
  CANDIDATE: 'evalscript_candidate_info',
  ACTIVE_SESSION: 'evalscript_active_session',
  SCRATCHPAD: 'evalscript_scratchpad',
};

export function getAllExams(): Exam[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_EXAMS);
    const custom: Exam[] = raw ? JSON.parse(raw) : [];
    return [...DEFAULT_EXAMS, ...custom];
  } catch {
    return DEFAULT_EXAMS;
  }
}

export function saveCustomExam(exam: Exam): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_EXAMS);
    const custom: Exam[] = raw ? JSON.parse(raw) : [];
    const updated = [exam, ...custom.filter(e => e.id !== exam.id)];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_EXAMS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save custom exam', err);
  }
}

export function deleteCustomExam(examId: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_EXAMS);
    if (!raw) return;
    const custom: Exam[] = JSON.parse(raw);
    const filtered = custom.filter(e => e.id !== examId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_EXAMS, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete custom exam', err);
  }
}

export function getExamById(id: string): Exam | undefined {
  const all = getAllExams();
  return all.find(e => e.id === id);
}

export function getExamResults(): ExamResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveExamResult(result: ExamResult): void {
  try {
    const existing = getExamResults();
    const updated = [result, ...existing];
    localStorage.setItem(STORAGE_KEYS.EXAM_RESULTS, JSON.stringify(updated));
    // Clear active session upon successful submission
    clearActiveSession();
  } catch (err) {
    console.error('Failed to save exam result', err);
  }
}

export function getCandidateInfo(): CandidateInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CANDIDATE);
    return raw ? JSON.parse(raw) : {
      fullName: 'Alex Vance',
      email: 'alex.vance@engine.dev',
      candidateId: 'DEV-2026-' + Math.floor(1000 + Math.random() * 9000),
      organization: 'V8 Systems Engineering',
    };
  } catch {
    return {
      fullName: 'Alex Vance',
      email: 'alex.vance@engine.dev',
      candidateId: 'DEV-2026-8812',
      organization: 'V8 Systems Engineering',
    };
  }
}

export function saveCandidateInfo(info: CandidateInfo): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CANDIDATE, JSON.stringify(info));
  } catch (err) {
    console.error('Failed to save candidate info', err);
  }
}

export function getActiveSession(): ExamSessionState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveActiveSession(session: ExamSessionState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save active session', err);
  }
}

export function clearActiveSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  } catch (err) {
    console.error('Failed to clear active session', err);
  }
}

export function getScratchpad(examId: string): string {
  try {
    return localStorage.getItem(`${STORAGE_KEYS.SCRATCHPAD}_${examId}`) || '';
  } catch {
    return '';
  }
}

export function saveScratchpad(examId: string, notes: string): void {
  try {
    localStorage.setItem(`${STORAGE_KEYS.SCRATCHPAD}_${examId}`, notes);
  } catch (err) {
    console.error('Failed to save scratchpad', err);
  }
}

export function generateVerificationHash(examId: string, candidateId: string, score: number): string {
  const seed = `${examId}-${candidateId}-${score}-${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return `EVAL-JS-${hex}`;
}
