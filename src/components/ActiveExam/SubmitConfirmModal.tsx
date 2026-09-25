import React from 'react';
import { Send, AlertCircle, CheckCircle2, Bookmark, HelpCircle, X } from 'lucide-react';
import { Exam } from '../../types/exam';

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  exam: Exam;
  answeredCount: number;
  flaggedCount: number;
  unansweredCount: number;
  timeRemainingFormatted: string;
}

export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  exam,
  answeredCount,
  flaggedCount,
  unansweredCount,
  timeRemainingFormatted,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Confirm Assessment Submission
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Please verify your status summary for <span className="text-slate-200">{exam.title}</span>.
          </p>
        </div>

        {/* Tally grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-center">
            <div className="text-xs text-slate-400">Total</div>
            <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
              {exam.questions.length}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
            <div className="text-xs text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Answered</span>
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
              {answeredCount}
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-center">
            <div className="text-xs text-amber-400 flex items-center justify-center gap-1">
              <Bookmark className="w-3 h-3" />
              <span>Flagged</span>
            </div>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
              {flaggedCount}
            </div>
          </div>

          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-center">
            <div className="text-xs text-rose-400 flex items-center justify-center gap-1">
              <HelpCircle className="w-3 h-3" />
              <span>Unanswered</span>
            </div>
            <div className="text-xl font-bold font-mono text-rose-400 mt-1 tabular-nums">
              {unansweredCount}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>Remaining Time:</span>
            <span className="font-mono font-bold text-cyan-400 tabular-nums">{timeRemainingFormatted}</span>
          </div>
          {unansweredCount > 0 && (
            <div className="flex items-start gap-2 pt-1 text-amber-400/90">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}.
                Once submitted, responses cannot be amended.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Return to Questions
          </button>
          <button
            onClick={onConfirmSubmit}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
            <span>Confirm & Evaluate Exam</span>
          </button>
        </div>
      </div>
    </div>
  );
};
