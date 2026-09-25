import React, { useState } from 'react';
import { Exam, ExamResult } from '../../types/exam';
import { CertificateModal } from './CertificateModal';
import { 
  CheckCircle2, XCircle, Award, Clock, ArrowRight, RotateCcw, 
  ShieldCheck, AlertTriangle, FileText, ChevronRight 
} from 'lucide-react';

interface ResultDashboardProps {
  exam: Exam;
  result: ExamResult;
  onRetake: () => void;
  onReturnToCatalog: () => void;
  onOpenDetailedReview: () => void;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  exam,
  result,
  onRetake,
  onReturnToCatalog,
  onOpenDetailedReview,
}) => {
  const [showCertificate, setShowCertificate] = useState(false);

  const minutesSpent = Math.floor(result.timeSpentSeconds / 60);
  const secondsSpent = result.timeSpentSeconds % 60;
  const timeFormatted = `${minutesSpent}m ${secondsSpent}s`;

  const totalQuestions = exam.questions.length;
  const correctCount = result.questionDetails.filter((d) => d.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      {/* Top Banner: Pass or Fail */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-8 sm:p-10 ${
          result.passed
            ? 'border-emerald-500/30 bg-emerald-950/20'
            : 'border-rose-500/30 bg-rose-950/20'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold">
              {result.passed ? (
                <span className="text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                  <CheckCircle2 className="w-4 h-4" /> Benchmark Satisfied · Passed
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                  <XCircle className="w-4 h-4" /> Benchmark Not Reached · Failed
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {result.examTitle}
            </h1>

            <p className="text-sm text-slate-300">
              Candidate: <span className="font-semibold text-white">{result.candidate.fullName}</span>
              {' '}({result.candidate.candidateId})
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end">
            <div className="text-4xl sm:text-5xl font-mono font-bold tabular-nums text-white">
              {result.percentage}%
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1">
              {result.totalScore} / {result.maxScore} marks (Pass: {result.passingPercentage}%)
            </div>

            {result.passed && (
              <button
                onClick={() => setShowCertificate(true)}
                className="mt-4 flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
              >
                <Award className="w-4 h-4" />
                <span>View Official Certificate</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-xs text-slate-400">Accuracy Rate</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-2 tabular-nums">
            {accuracy}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {correctCount} of {totalQuestions} correct
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-xs text-slate-400">Time Consumed</div>
          <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">
            {timeFormatted}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Allowed: {exam.durationMinutes}m
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-xs text-slate-400">Proctoring Rating</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2 tabular-nums">
            {result.incidents.length === 0 ? '100%' : `${Math.max(40, 100 - result.incidents.length * 20)}%`}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {result.incidents.length} security alerts
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-xs text-slate-400">Credential Proof</div>
          <div className="text-xs font-mono text-cyan-300 mt-2 truncate font-semibold">
            {result.certificateId || 'N/A (Failed)'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {result.passed ? 'Verified in Registry' : 'Retake to Qualify'}
          </div>
        </div>
      </div>

      {/* Topic Mastery Breakdown */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Competency Domain Analysis</h2>
          <p className="text-xs text-slate-400 mt-1">
            Score breakdown across specific ECMAScript and architectural categories.
          </p>
        </div>

        <div className="space-y-4">
          {Object.entries(result.topicBreakdown).map(([topic, data]) => {
            return (
              <div key={topic} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{topic}</span>
                  <span className="font-mono text-slate-400 tabular-nums">
                    {data.earned} / {data.total} pts ({data.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      data.percentage >= 70
                        ? 'bg-emerald-400'
                        : data.percentage >= 40
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, data.percentage))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Proctoring Incident Audit Log (if any) */}
      {result.incidents.length > 0 && (
        <section className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Integrity Audit Incident Log</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            {result.incidents.map((inc, i) => (
              <div key={i} className="flex items-center justify-between text-slate-400 border-b border-amber-500/10 pb-1.5">
                <span className="text-amber-200/80">[{new Date(inc.timestamp).toLocaleTimeString()}] {inc.message}</span>
                <span className="uppercase text-[10px] text-slate-500">{inc.type}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToCatalog}
            className="px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
          >
            ← Return to Exam Catalog
          </button>
          <button
            onClick={onRetake}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>
        </div>

        <button
          onClick={onOpenDetailedReview}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
        >
          <FileText className="w-4 h-4" />
          <span>Review Detailed Solutions & Answers</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        result={result}
      />
    </div>
  );
};
