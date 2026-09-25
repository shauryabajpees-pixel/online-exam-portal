import React, { useState } from 'react';
import { Question } from '../../types/exam';
import { Bookmark, CheckCircle2, Circle } from 'lucide-react';

interface QuestionPaletteProps {
  questions: Question[];
  currentIndex: number;
  onSelectIndex: (idx: number) => void;
  selectedAnswers: Record<string, number[]>;
  codeSubmissions: Record<string, string>;
  testResults: Record<string, { passed: number; total: number }>;
  flaggedQuestionIds: string[];
  visitedQuestionIds: string[];
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentIndex,
  onSelectIndex,
  selectedAnswers,
  codeSubmissions,
  testResults,
  flaggedQuestionIds,
  visitedQuestionIds,
}) => {
  const [filter, setFilter] = useState<'all' | 'answered' | 'unanswered' | 'flagged'>('all');

  const isQuestionAnswered = (q: Question) => {
    if (q.type === 'coding_challenge') {
      const tr = testResults[q.id];
      const code = codeSubmissions[q.id];
      return (tr && tr.passed > 0) || (code && code.trim().length > 30);
    }
    const answers = selectedAnswers[q.id];
    return answers && answers.length > 0;
  };

  const answeredCount = questions.filter(isQuestionAnswered).length;
  const flaggedCount = flaggedQuestionIds.length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Question Palette
        </h3>
        <span className="text-xs font-mono text-cyan-400 tabular-nums">
          {answeredCount}/{questions.length} Answered
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-slate-950 text-[11px] font-medium">
        <button
          onClick={() => setFilter('all')}
          className={`py-1 rounded text-center transition-colors ${
            filter === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({questions.length})
        </button>
        <button
          onClick={() => setFilter('answered')}
          className={`py-1 rounded text-center transition-colors ${
            filter === 'answered' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Done ({answeredCount})
        </button>
        <button
          onClick={() => setFilter('unanswered')}
          className={`py-1 rounded text-center transition-colors ${
            filter === 'unanswered' ? 'bg-slate-800 text-rose-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Left ({unansweredCount})
        </button>
        <button
          onClick={() => setFilter('flagged')}
          className={`py-1 rounded text-center transition-colors ${
            filter === 'flagged' ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Flag ({flaggedCount})
        </button>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-2 max-h-[320px] overflow-y-auto pr-1">
        {questions.map((q, idx) => {
          const answered = isQuestionAnswered(q);
          const isFlagged = flaggedQuestionIds.includes(q.id);
          const isVisited = visitedQuestionIds.includes(q.id);
          const isCurrent = idx === currentIndex;

          // Apply filter
          if (filter === 'answered' && !answered) return null;
          if (filter === 'unanswered' && answered) return null;
          if (filter === 'flagged' && !isFlagged) return null;

          let colorClasses = 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700';
          if (answered && isFlagged) {
            colorClasses = 'border-amber-500/50 bg-amber-500/10 text-amber-300';
          } else if (answered) {
            colorClasses = 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300';
          } else if (isFlagged) {
            colorClasses = 'border-amber-500 bg-amber-500/20 text-amber-400';
          } else if (isVisited) {
            colorClasses = 'border-slate-700 bg-slate-800/80 text-slate-300';
          }

          if (isCurrent) {
            colorClasses += ' ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900 font-bold';
          }

          return (
            <button
              key={q.id}
              onClick={() => onSelectIndex(idx)}
              className={`relative h-10 rounded-xl border font-mono text-xs transition-all flex items-center justify-center ${colorClasses}`}
            >
              <span>{idx + 1}</span>
              {isFlagged && (
                <Bookmark className="absolute top-1 right-1 w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="space-y-1.5 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50" />
            <span>Answered</span>
          </div>
          <span className="font-mono tabular-nums text-slate-300">{answeredCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500" />
            <span>Flagged for Review</span>
          </div>
          <span className="font-mono tabular-nums text-slate-300">{flaggedCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
            <span>Visited (Unanswered)</span>
          </div>
          <span className="font-mono tabular-nums text-slate-300">
            {visitedQuestionIds.length - answeredCount > 0 ? visitedQuestionIds.length - answeredCount : 0}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-slate-950 border border-slate-800" />
            <span>Not Visited</span>
          </div>
          <span className="font-mono tabular-nums text-slate-300">
            {Math.max(0, questions.length - visitedQuestionIds.length)}
          </span>
        </div>
      </div>
    </div>
  );
};
