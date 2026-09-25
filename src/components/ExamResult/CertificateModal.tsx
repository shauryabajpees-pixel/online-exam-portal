import React, { useState } from 'react';
import { ExamResult } from '../../types/exam';
import { Award, Printer, X, Download, ShieldCheck } from 'lucide-react';
import certBadgeEmblem from '../../assets/images/cert_badge_emblem_1790340718009.jpg';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ExamResult;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, result }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(result.submittedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Actions header (hidden on print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <Award className="w-4 h-4" />
            <span>Official Credential Certificate</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas / Frame */}
        <div className="relative border-4 border-double border-amber-500/40 bg-radial from-slate-900 to-slate-950 p-8 sm:p-12 text-center rounded-xl overflow-hidden shadow-2xl">
          {/* Subtle watermarked corner geometry */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-500/50" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-500/50" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-500/50" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-500/50" />

          {/* Certificate Badge Image */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500/60 shadow-lg shadow-amber-500/20 bg-slate-950 flex items-center justify-center">
            <img
              src={certBadgeEmblem}
              alt="Certification Crest Emblem"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Graceful fallback to inline icon if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-semibold">
              Certificate of Technical Achievement
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              EvalScript Examination Authority
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto pt-1">
              This officially certifies that the candidate named below has satisfied all technical criteria
              and proctoring benchmarks in client-side runtime environments.
            </p>
          </div>

          {/* Candidate Name */}
          <div className="my-8 py-4 border-y border-amber-500/20 max-w-lg mx-auto">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-cyan-300 font-serif">
              {result.candidate.fullName}
            </div>
            <div className="text-xs font-mono text-slate-400 mt-1">
              Candidate ID: {result.candidate.candidateId}
              {result.candidate.organization && ` · ${result.candidate.organization}`}
            </div>
          </div>

          {/* Subject & Score */}
          <div className="space-y-2 text-sm text-slate-300 max-w-md mx-auto">
            <p>
              Successfully passed the rigorous proctored evaluation:
            </p>
            <div className="text-base font-bold text-white">
              {result.examTitle}
            </div>
            <div className="pt-2 flex items-center justify-center gap-4 text-xs font-mono text-amber-300">
              <span>Final Score: {result.percentage}%</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Pass Benchmark: {result.passingPercentage}%</span>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="mt-12 pt-6 grid grid-cols-2 gap-8 max-w-md mx-auto text-xs text-slate-400 border-t border-slate-800">
            <div>
              <div className="font-serif italic text-slate-200 text-sm h-6">Dr. K. Arisawa</div>
              <div className="border-t border-slate-700 pt-1 text-[11px]">Chair of ECMAScript Evaluation</div>
            </div>
            <div>
              <div className="font-mono text-slate-300 text-xs h-6">{formattedDate}</div>
              <div className="border-t border-slate-700 pt-1 text-[11px]">Issue Date</div>
            </div>
          </div>

          {/* Verification Code */}
          <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-900">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cryptographic Proof: {result.certificateId}</span>
            </div>
            <div>EvalScript Engine Specification 2026.1</div>
          </div>
        </div>
      </div>
    </div>
  );
};
