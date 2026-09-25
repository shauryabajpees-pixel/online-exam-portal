import React, { useState } from 'react';
import { Exam, ExamResult } from '../../types/exam';
import { CheckCircle2, XCircle, Terminal, HelpCircle, Code2, Copy, Check } from 'lucide-react';

interface SolutionReviewProps {
  exam: Exam;
  result: ExamResult;
  onBackToScorecard: () => void;
}

export const SolutionReview: React.FC<SolutionReviewProps> = ({
  exam,
  result,
  onBackToScorecard,
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct' | 'coding'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getQuestionResult = (qId: string) => {
    return result.questionDetails.find((d) => d.questionId === qId);
  };

  const filteredQuestions = exam.questions.filter((q) => {
    const qRes = getQuestionResult(q.id);
    if (filter === 'incorrect') return qRes && !qRes.isCorrect;
    if (filter === 'correct') return qRes && qRes.isCorrect;
    if (filter === 'coding') return q.type === 'coding_challenge';
    return true;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <button
            onClick={onBackToScorecard}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium mb-1.5 inline-block"
          >
            ← Return to Summary Scorecard
          </button>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Detailed Solution & Architectural Breakdown
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review your responses against ECMAScript specifications and standard runtime behaviors.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({exam.questions.length})
          </button>
          <button
            onClick={() => setFilter('incorrect')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === 'incorrect'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Needs Review ({result.questionDetails.filter((d) => !d.isCorrect).length})
          </button>
          <button
            onClick={() => setFilter('correct')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === 'correct'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Correct ({result.questionDetails.filter((d) => d.isCorrect).length})
          </button>
        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-6">
        {filteredQuestions.map((q, idx) => {
          const qRes = getQuestionResult(q.id);
          const isCorrect = qRes?.isCorrect ?? false;
          const userSelected = qRes?.userAnswer || [];
          const isCoding = q.type === 'coding_challenge';

          return (
            <div
              key={q.id}
              className={`rounded-2xl border bg-slate-900/60 p-6 space-y-5 transition-all ${
                isCorrect
                  ? 'border-slate-800'
                  : 'border-rose-500/30 bg-slate-900/80'
              }`}
            >
              {/* Question Status Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    QUESTION {idx + 1}
                  </span>
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <span className="text-xs text-slate-300 font-semibold">{q.topic}</span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  {isCorrect ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      +{qRes?.scoreEarned ?? q.points} Points
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-400 font-bold">
                      <XCircle className="w-3.5 h-3.5" />
                      {qRes?.scoreEarned ?? 0} / {q.points} Points
                    </span>
                  )}
                </div>
              </div>

              {/* Prompt */}
              <div className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                {q.prompt}
              </div>

              {/* Code Snippet for Analysis */}
              {q.codeSnippet && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-cyan-200/90 overflow-x-auto">
                  <pre>{q.codeSnippet}</pre>
                </div>
              )}

              {/* Multiple Choice Review */}
              {!isCoding && q.options && (
                <div className="space-y-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isUserChoice = userSelected.includes(optIdx);
                    const isActualCorrect = q.correctAnswers?.includes(optIdx);
                    const letter = String.fromCharCode(65 + optIdx);

                    let itemStyle = 'border-slate-800/70 bg-slate-950/40 text-slate-400';
                    if (isActualCorrect) {
                      itemStyle = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200 font-medium';
                    } else if (isUserChoice && !isActualCorrect) {
                      itemStyle = 'border-rose-500/50 bg-rose-500/10 text-rose-300 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all ${itemStyle}`}
                      >
                        <div
                          className={`w-5 h-5 shrink-0 rounded flex items-center justify-center font-mono text-xs font-bold ${
                            isActualCorrect
                              ? 'bg-emerald-500 text-slate-950'
                              : isUserChoice
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {letter}
                        </div>
                        <div className="flex-1 pt-0.5">{opt}</div>
                        {isActualCorrect && (
                          <span className="text-[11px] font-mono text-emerald-400 font-semibold shrink-0">
                            Correct Answer
                          </span>
                        )}
                        {isUserChoice && !isActualCorrect && (
                          <span className="text-[11px] font-mono text-rose-400 shrink-0">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Coding Challenge Review */}
              {isCoding && (
                <div className="space-y-3 pt-1">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                        Candidate Submitted Code
                      </span>
                      <button
                        onClick={() => handleCopy(`user-${q.id}`, qRes?.userCode || '')}
                        className="flex items-center gap-1 hover:text-white"
                      >
                        {copiedId === `user-${q.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <pre className="text-slate-300 whitespace-pre overflow-x-auto">
                      {qRes?.userCode || '// No code submitted'}
                    </pre>
                  </div>

                  {q.solutionCode && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between text-emerald-400 text-[11px] border-b border-emerald-500/20 pb-2">
                        <span>Standard Reference Solution</span>
                        <button
                          onClick={() => handleCopy(`sol-${q.id}`, q.solutionCode!)}
                          className="flex items-center gap-1 hover:text-white text-emerald-400"
                        >
                          {copiedId === `sol-${q.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>Copy Reference</span>
                        </button>
                      </div>
                      <pre className="text-emerald-200/90 whitespace-pre overflow-x-auto">
                        {q.solutionCode}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Deep Technical Explanation */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-1.5 text-xs">
                <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Technical & Specification Analysis</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[13px]">
                  {q.explanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
