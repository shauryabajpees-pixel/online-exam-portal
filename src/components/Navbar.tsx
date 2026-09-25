import React from 'react';
import { CandidateInfo } from '../types/exam';
import { UserCheck, ShieldAlert, Award, PlusCircle, BookOpen, Clock } from 'lucide-react';

interface NavbarProps {
  currentView: 'catalog' | 'active_exam' | 'results' | 'solution_review' | 'history' | 'builder';
  onNavigate: (view: 'catalog' | 'history' | 'builder') => void;
  candidate: CandidateInfo;
  onEditCandidate: () => void;
  hasActiveSession: boolean;
  onResumeSession?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  candidate,
  onEditCandidate,
  hasActiveSession,
  onResumeSession,
}) => {
  // If inside an active proctored exam, show a minimal distraction-free header
  if (currentView === 'active_exam') {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => onNavigate('catalog')}
          className="text-left group flex items-baseline gap-2 focus-visible:outline-none"
        >
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            EvalScript
          </span>
          <span className="text-xs text-slate-500 font-mono tracking-wider uppercase">Portal</span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onNavigate('catalog')}
            className={`transition-colors py-1 ${
              currentView === 'catalog'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Exam Catalog
          </button>

          <button
            onClick={() => onNavigate('history')}
            className={`transition-colors py-1 ${
              currentView === 'history'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            My Results & History
          </button>

          <button
            onClick={() => onNavigate('builder')}
            className={`transition-colors py-1 ${
              currentView === 'builder'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Exam Studio (Author)
          </button>
        </nav>

        {/* Zone 3: Actions & Candidate Profile */}
        <div className="flex items-center gap-3">
          {hasActiveSession && onResumeSession && (
            <button
              onClick={onResumeSession}
              className="flex items-center gap-2 rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors animate-pulse"
            >
              <Clock className="w-3.5 h-3.5" />
              Resume Active Exam
            </button>
          )}

          <button
            onClick={onEditCandidate}
            title="Update Candidate Identity"
            className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
              {candidate.fullName.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium max-w-[120px] truncate">{candidate.fullName}</span>
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
              {candidate.candidateId}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
