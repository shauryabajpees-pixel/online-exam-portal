import React from 'react';
import { AlertOctagon, ShieldAlert, Check } from 'lucide-react';
import { IncidentRecord } from '../../types/exam';

interface ProctorWarningModalProps {
  isOpen: boolean;
  onAcknowledge: () => void;
  incidents: IncidentRecord[];
  maxIncidentsAllowed: number;
}

export const ProctorWarningModal: React.FC<ProctorWarningModalProps> = ({
  isOpen,
  onAcknowledge,
  incidents,
  maxIncidentsAllowed,
}) => {
  if (!isOpen) return null;

  const currentCount = incidents.length;
  const remaining = Math.max(0, maxIncidentsAllowed - currentCount);
  const latestIncident = incidents[incidents.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-rose-500/40 bg-slate-900 p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-rose-500/20 p-2.5 text-rose-400">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Proctoring Violation Alert
            </h3>
            <p className="text-xs text-rose-300 font-mono">
              Event: {latestIncident ? latestIncident.type.replace('_', ' ').toUpperCase() : 'FOCUS LOSS'}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs text-slate-300 space-y-2">
          <p className="leading-relaxed">
            The exam environment detected that window focus was lost or another tab/application was opened.
          </p>
          <div className="pt-1 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Recorded Violations:</span>
            <span className="font-bold text-rose-400 tabular-nums">
              {currentCount} / {maxIncidentsAllowed}
            </span>
          </div>
          {remaining > 0 ? (
            <p className="text-[11px] text-amber-300">
              {remaining} warning{remaining > 1 ? 's' : ''} remaining before automatic test submission.
            </p>
          ) : (
            <p className="text-[11px] text-rose-400 font-semibold">
              Violation threshold reached. The examination will be submitted automatically.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            onClick={onAcknowledge}
            className="flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
          >
            <Check className="w-4 h-4" />
            <span>I Understand & Resume Assessment</span>
          </button>
        </div>
      </div>
    </div>
  );
};
