import React from 'react';
import { Edit3, X, Trash2 } from 'lucide-react';

interface ScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: string;
  onChange: (notes: string) => void;
}

export const ScratchpadModal: React.FC<ScratchpadModalProps> = ({
  isOpen,
  onClose,
  notes,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Edit3 className="w-4 h-4 text-cyan-400" />
            <span>Candidate Scratchpad / Rough Work</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChange('')}
              title="Clear Scratchpad"
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          Your notes are saved in your local session. They are not evaluated as test responses.
        </p>

        <textarea
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Draft thoughts, pseudo-code, variable traces, or memory offsets here..."
          rows={10}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none resize-none leading-relaxed"
        />

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
          >
            Close Scratchpad
          </button>
        </div>
      </div>
    </div>
  );
};
