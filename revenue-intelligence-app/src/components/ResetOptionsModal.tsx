import React from 'react';
import {
  RotateCcw,
  X,
  AlertTriangle,
  Play,
  Trash2,
  Tag,
  CheckCircle2,
  Inbox
} from 'lucide-react';

interface ResetOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetToRev1: () => void;
  onResetToRev2: () => void;
  onResetToEmpty: () => void;
  onClearOverridesOnly: () => void;
  overridesCount: number;
}

export const ResetOptionsModal: React.FC<ResetOptionsModalProps> = ({
  isOpen,
  onClose,
  onResetToRev1,
  onResetToRev2,
  onResetToEmpty,
  onClearOverridesOnly,
  overridesCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Workspace Reset Options</h2>
              <p className="text-xs text-slate-300">
                Choose a baseline delivery state or clear previous work.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="p-6 space-y-3 bg-slate-50 text-slate-900">
          {/* Option 1: Empty Workspace (0 records) */}
          <button
            onClick={() => {
              onResetToEmpty();
              onClose();
            }}
            className="w-full p-4 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-xl text-left transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-rose-100 text-rose-800 rounded-lg">
                  <Inbox className="w-4 h-4" />
                </span>
                <span className="font-bold text-sm text-rose-950">
                  Empty Workspace (0 Records / Clean Slate)
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-rose-50 text-rose-700 border border-rose-200">
                0 Records
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Clears all records, interactions, and previous overrides completely. Leaves the dashboard at 0 so you can test importing batches from scratch.
            </p>
          </button>

          {/* Option 2: Reset to Initial Delivery (Rev 1) */}
          <button
            onClick={() => {
              onResetToRev1();
              onClose();
            }}
            className="w-full p-4 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                  <Play className="w-4 h-4" />
                </span>
                <span className="font-bold text-sm text-slate-900">
                  Reset to Initial Delivery (Revision 1)
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Rev 1 (44 Recs)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Loads <code>01_initial.json</code> (44 records, 17 transcripts) and clears any previous manual overrides. Puts <code>M07</code> into delayed-transcript hold to test the update replay.
            </p>
          </button>

          {/* Option 3: Reset to Final Post-Update State (Rev 2) */}
          <button
            onClick={() => {
              onResetToRev2();
              onClose();
            }}
            className="w-full p-4 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <span className="font-bold text-sm text-slate-900">
                  Reset to Final Post-Update State (Revision 2)
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Rev 2 (18 Texts)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Restores the complete baseline after both batches are applied (44 records, all 18 transcripts analyzed, clean automated routes without overrides).
            </p>
          </button>

          {/* Option 4: Clear Manual Overrides Only */}
          {overridesCount > 0 && (
            <button
              onClick={() => {
                onClearOverridesOnly();
                onClose();
              }}
              className="w-full p-4 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl text-left transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-purple-100 text-purple-800 rounded-lg">
                    <Tag className="w-4 h-4" />
                  </span>
                  <span className="font-bold text-sm text-slate-900">
                    Clear Manual Route Overrides ({overridesCount})
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  Overrides Only
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Keeps all currently loaded records, but resets all manual route overrides back to the original automated classification.
              </p>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
