import React, { useState } from 'react';
import { ExamResult } from '../types/exam';
import { Award, CheckCircle2, XCircle, Clock, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { CertificateModal } from './ExamResult/CertificateModal';

interface ExamHistoryProps {
  results: ExamResult[];
  onSelectResult: (res: ExamResult) => void;
  onNavigateToCatalog: () => void;
  onClearHistory: () => void;
}

export const ExamHistory: React.FC<ExamHistoryProps> = ({
  results,
  onSelectResult,
  onNavigateToCatalog,
  onClearHistory,
}) => {
  const [selectedCertResult, setSelectedCertResult] = useState<ExamResult | null>(null);

  if (results.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">No Assessment History Found</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          You haven't completed any assessments yet. Launch a standardized JavaScript benchmark to build your record.
        </p>
        <div className="pt-2">
          <button
            onClick={onNavigateToCatalog}
            className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors shadow-md shadow-cyan-500/20"
          >
            Explore Exam Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Examination History & Transcripts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Archived scorecards, accuracy rates, and cryptographic certificate IDs.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Clear all assessment history records from local storage?')) {
              onClearHistory();
            }
          }}
          className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="space-y-4">
        {results.map((res) => {
          const dateStr = new Date(res.submittedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={res.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  {res.passed ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-rose-400 font-mono">
                      <XCircle className="w-3.5 h-3.5" /> FAILED
                    </span>
                  )}
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <span className="text-xs text-slate-400 font-mono">{dateStr}</span>
                </div>

                <h3 className="text-base font-bold text-white">{res.examTitle}</h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono tabular-nums">
                  <span>Score: {res.totalScore} / {res.maxScore} ({res.percentage}%)</span>
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <span>Time: {Math.round(res.timeSpentSeconds / 60)}m</span>
                  {res.certificateId && (
                    <>
                      <span aria-hidden="true" className="text-slate-700">·</span>
                      <span className="text-cyan-400">{res.certificateId}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {res.passed && (
                  <button
                    onClick={() => setSelectedCertResult(res)}
                    className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Certificate</span>
                  </button>
                )}

                <button
                  onClick={() => onSelectResult(res)}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-white transition-colors"
                >
                  <span>Scorecard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCertResult && (
        <CertificateModal
          isOpen={Boolean(selectedCertResult)}
          onClose={() => setSelectedCertResult(null)}
          result={selectedCertResult}
        />
      )}
    </div>
  );
};
