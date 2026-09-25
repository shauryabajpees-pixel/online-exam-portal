import React, { useState } from 'react';
import { CandidateInfo, Exam } from '../types/exam';
import { ShieldCheck, CheckCircle2, AlertTriangle, Monitor, Cpu, Sparkles, X } from 'lucide-react';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateInfo;
  onSave: (updated: CandidateInfo) => void;
  examToStart?: Exam | null;
  onConfirmStart?: () => void;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onSave,
  examToStart,
  onConfirmStart,
}) => {
  const [form, setForm] = useState<CandidateInfo>({ ...candidate });
  const [agreedToProctoring, setAgreedToProctoring] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: { fullName?: string; email?: string } = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required for certificate generation';
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Valid email is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveOnly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
    onClose();
  };

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (examToStart && !agreedToProctoring) {
      alert('Please acknowledge the proctoring integrity guidelines to proceed.');
      return;
    }
    onSave(form);
    if (onConfirmStart) {
      onConfirmStart();
    }
  };

  const isPreExamCheck = Boolean(examToStart);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-1.5">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isPreExamCheck ? 'Candidate Verification & Hall Ticket' : 'Candidate Profile'}
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            {isPreExamCheck
              ? `Review your candidate credentials before launching ${examToStart?.title}.`
              : 'Details used to personalize examination scorecards and official certificates.'}
          </p>
        </div>

        <form onSubmit={isPreExamCheck ? handleStartExam : handleSaveOnly} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Candidate Full Name
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="e.g. Elena Rostova"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
            {errors.fullName && <p className="mt-1 text-xs text-rose-400">{errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="candidate@company.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
              {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Candidate / Roll ID
              </label>
              <input
                type="text"
                value={form.candidateId}
                onChange={(e) => setForm({ ...form, candidateId: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm font-mono text-cyan-300 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Institution / Organization (Optional)
            </label>
            <input
              type="text"
              value={form.organization || ''}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
              placeholder="e.g. Stanford University or Google"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {isPreExamCheck && examToStart && (
            <div className="pt-2 space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 text-xs">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-cyan-400" />
                  System Readiness & Environment Audit
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>JavaScript Engine: Active (ES2024+)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Timer Sync: Realtime Clock</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Code Sandbox: Isolated Function</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Integrity Guard: Visibility API Ready</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-200/90 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  Exam Protocol & Proctoring Policy
                </div>
                <p className="text-slate-300 leading-relaxed">
                  During this assessment, tab switching, exiting fullscreen, or minimizing the window
                  will trigger real-time integrity alerts. Accumulating multiple violations may result
                  in automatic test submission.
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreedToProctoring}
                  onChange={(e) => setAgreedToProctoring(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-xs text-slate-300 leading-normal">
                  I agree to abide by the assessment integrity guidelines and confirm that I will not
                  use unauthorized external resources.
                </span>
              </label>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPreExamCheck && !agreedToProctoring}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                isPreExamCheck && !agreedToProctoring
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20'
              }`}
            >
              {isPreExamCheck ? 'Enter Examination Hall' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
