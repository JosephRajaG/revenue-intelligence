import React from 'react';
import { METRIC_DEFINITIONS } from '../services/metricsEngine';
import { X, HelpCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MetricDefinitionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetricDefinitionsModal: React.FC<MetricDefinitionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const defs = Object.values(METRIC_DEFINITIONS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Metric Definitions & Measurement Boundaries</h2>
              <p className="text-xs text-slate-300">
                Rigorous definitions, explicit numerators, denominators, and limitations for 21 August 2026 (Asia/Kolkata).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 bg-slate-50">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Core Architectural Principle:</span> All selected records occurred on 21 August 2026 (Asia/Kolkata). A date filter alone is insufficient. We explicitly differentiate <strong>Call Reps</strong> (telephony sales callers) from <strong>Meeting Organisers</strong> (calendar invitation creators, not verified attendees or reps), and avoid speculative deal dollar aggregations.
            </div>
          </div>

          <div className="grid gap-4">
            {defs.map((d) => (
              <div key={d.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{d.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      {d.category}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 font-medium">
                    Unit: {d.unit}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono">
                  <div>
                    <span className="text-slate-500 block">Numerator:</span>
                    <span className="text-slate-800 font-semibold">{d.numerator}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Denominator:</span>
                    <span className="text-slate-800 font-semibold">{d.denominator}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-slate-500 block">Formula:</span>
                    <span className="text-indigo-700">{d.formula}</span>
                  </div>
                </div>

                <div className="text-sm text-slate-600 space-y-1.5">
                  <p>
                    <strong className="text-slate-800">Interpretation:</strong> {d.interpretation}
                  </p>
                  <p className="text-xs text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                    <strong>Caveat / Limitation:</strong> {d.caveat_or_limitation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Close Definitions
          </button>
        </div>
      </div>
    </div>
  );
};
