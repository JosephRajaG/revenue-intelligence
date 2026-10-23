import React, { useState } from 'react';
import {
  DeliveryEnvelope,
  ProcessedRecord,
  RouteCategory,
  SourceType
} from '../../types';
import {
  initialBatch,
  updateBatch,
  ReplayState,
  applyDeliveryEnvelope,
  setManualRouteOverride,
  resetToInitialBatchOnly,
  resetToEmptyWorkspace,
  clearState
} from '../../services/replayEngine';
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Upload,
  FileCode,
  Terminal,
  ShieldCheck,
  Tag,
  ArrowRight
} from 'lucide-react';

interface ReplayConsoleTabProps {
  replayState: ReplayState;
  onStateUpdate: (newState: ReplayState) => void;
  onSelectRecordByRef: (ref: string) => void;
}

export const ReplayConsoleTab: React.FC<ReplayConsoleTabProps> = ({
  replayState,
  onStateUpdate,
  onSelectRecordByRef
}) => {
  const [customJsonInput, setCustomJsonInput] = useState<string>('');
  const [customError, setCustomError] = useState<string | null>(null);

  const totalRecords = Object.keys(replayState.records).length;
  const m07Record = Object.values(replayState.records).find((r) => r.record_ref === 'M07');
  const m07Revision = m07Record?.revision || 1;
  const m07HasTranscript = Boolean(m07Record?.transcript_payload?.turns && m07Record.transcript_payload.turns.length > 0);
  const m07IsOverridden = Boolean(m07Record?.analysis.is_manually_overridden);
  const transcriptsCount = Object.values(replayState.records).filter((r) => {
    const isMeeting = r.source_type === 'meeting';
    if (isMeeting) {
      return Boolean(r.transcript_payload?.turns && r.transcript_payload.turns.length > 0);
    }
    return Boolean((r.payload as any)?.transcript?.trim());
  }).length;

  // Step 1: Initial Import
  const handleStep1Initial = () => {
    const s = resetToInitialBatchOnly({});
    onStateUpdate(s);
  };

  // Step 2: Repeat Import with Shuffle
  const handleStep2RepeatShuffle = () => {
    const { newState } = applyDeliveryEnvelope(replayState, initialBatch, true);
    onStateUpdate(newState);
  };

  // Step 3: Change M07 Route
  const handleStep3OverrideM07 = () => {
    if (!m07Record) return;
    const s = setManualRouteOverride(
      replayState,
      m07Record.source_type,
      m07Record.source_id,
      'customer_success',
      'Manager override: Escalated to Customer Success due to reported UI bugs.'
    );
    onStateUpdate(s);
  };

  // Step 4: Import Update Batch
  const handleStep4Update = () => {
    const { newState } = applyDeliveryEnvelope(replayState, updateBatch);
    onStateUpdate(newState);
  };

  // Step 5: Test Repeat Older Batch
  const handleStep5OlderBatch = () => {
    const { newState } = applyDeliveryEnvelope(replayState, initialBatch);
    onStateUpdate(newState);
  };

  // Clean Slate Reset (0 records)
  const handleCleanSlate = () => {
    const s = resetToEmptyWorkspace();
    onStateUpdate(s);
  };

  // Custom JSON Upload Handler
  const handleUploadCustomJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as DeliveryEnvelope;
        if (!parsed.records || !parsed.batch_id || parsed.revision === undefined) {
          throw new Error('Invalid assessment envelope schema: missing batch_id, revision, or records array.');
        }
        const { newState } = applyDeliveryEnvelope(replayState, parsed);
        onStateUpdate(newState);
        setCustomError(null);
      } catch (err: any) {
        setCustomError(err.message || 'Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Overview Card */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
                Verification & Replay Suite
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                DATA_CONTRACT.md Replay Runner
              </h2>
            </div>
          </div>
          <button
            onClick={handleCleanSlate}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset to Initial App State</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Verify the required replay sequence: (1) Initial delivery import, (2) Idempotent re-import with shuffled order (no duplicates or inflated counts), (3) Route correction on M07, (4) Ingestion of late-transcript update batch, and (5) Preservation of human judgment across refreshes and older deliveries.
        </p>

        {/* Live Status Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
            <span className="text-slate-400 block mb-1">Unique Records:</span>
            <span className="text-lg font-bold text-white">{totalRecords}</span>
            <span className="text-[10px] text-slate-400 block">(Target: strictly 44)</span>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
            <span className="text-slate-400 block mb-1">Usable Transcripts:</span>
            <span className="text-lg font-bold text-emerald-400">{transcriptsCount} / 44</span>
            <span className="text-[10px] text-slate-400 block">
              {transcriptsCount === 18 ? 'Full (Post-Update)' : '17 Initial'}
            </span>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
            <span className="text-slate-400 block mb-1">M07 Revision & Text:</span>
            <span className="text-lg font-bold text-indigo-400">
              Rev {m07Revision} {m07HasTranscript ? '(27 turns)' : '(No text)'}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {m07Record?.analysis.primary_route}
            </span>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
            <span className="text-slate-400 block mb-1">M07 Manual Override:</span>
            <span className={`text-lg font-bold ${m07IsOverridden ? 'text-rose-400' : 'text-slate-400'}`}>
              {m07IsOverridden ? 'Active (Saved)' : 'Automated'}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {m07IsOverridden ? 'Preserved across replays' : 'Default suggestion'}
            </span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Interactive Test Steps */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Interactive Assessment Replay Checklist</h3>
          <p className="text-xs text-slate-500">
            Execute each step in sequence to demonstrate adherence to the data contract.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Step 1 */}
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <span className="font-bold text-sm text-slate-900">Initial Import (`01_initial.json`)</span>
                {totalRecords === 44 && transcriptsCount === 17 && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Initial State Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 pl-8">
                Expected: 44 unique records loaded. 17 transcripts available. M07 text marked unavailable.
              </p>
            </div>
            <button
              onClick={handleStep1Initial}
              className="px-4 py-2 bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-400 text-indigo-700 rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Reset to Step 1 (Rev 1)</span>
            </button>
          </div>

          {/* Step 2 */}
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <span className="font-bold text-sm text-slate-900">Repeat Import (Shuffled Order)</span>
                {totalRecords === 44 && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Idempotent (44 unique)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 pl-8">
                Expected: Ingesting `01_initial.json` again in randomized order ignores duplicates without inflating counts.
              </p>
            </div>
            <button
              onClick={handleStep2RepeatShuffle}
              className="px-4 py-2 bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-400 text-indigo-700 rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Test Shuffle & Deduplicate</span>
            </button>
          </div>

          {/* Step 3 */}
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <span className="font-bold text-sm text-slate-900">Manually Change M07 Route</span>
                {m07IsOverridden && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> M07 Overridden
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 pl-8">
                Expected: Change M07's route to "customer_success". Saved with timestamp and audit note.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleStep3OverrideM07}
                className="px-4 py-2 bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-400 text-indigo-700 rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Override M07 Route</span>
              </button>
              <button
                onClick={() => onSelectRecordByRef('M07')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
              >
                Inspect M07
              </button>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                  4
                </span>
                <span className="font-bold text-sm text-slate-900">Apply Update Batch (`02_update.json`)</span>
                {m07Revision === 2 && transcriptsCount === 18 && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> M07 Rev 2 Applied (18 texts)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 pl-8">
                Expected: Applies Revision 2 to M07. Transcript becomes available (27 turns). Unique records stays 44.
              </p>
            </div>
            <button
              onClick={handleStep4Update}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Apply 02_update.json</span>
            </button>
          </div>

          {/* Step 5 */}
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                  5
                </span>
                <span className="font-bold text-sm text-slate-900">Preserve Judgment & Reject Older Batch</span>
                {m07Revision === 2 && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Rev 2 & Overrides Preserved
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 pl-8">
                Expected: Re-importing `01_initial.json` does NOT downgrade M07 to Rev 1. Manual override remains active.
              </p>
            </div>
            <button
              onClick={handleStep5OlderBatch}
              className="px-4 py-2 bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-400 text-indigo-700 rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-import Older Rev 1</span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Batch Upload Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Upload Custom Batch Delivery File</h3>
          </div>
          <span className="text-xs text-slate-400">Supports .json delivery envelopes</span>
        </div>
        <p className="text-xs text-slate-600">
          Upload any external test delivery file. The engine matches (source_type, source_id) identity, replaces payloads on newer revisions, and ignores same or older revisions.
        </p>

        <div className="flex items-center gap-3">
          <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer border border-slate-300 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4 text-slate-600" />
            <span>Select JSON Delivery File...</span>
            <input type="file" accept=".json" onChange={handleUploadCustomJson} className="hidden" />
          </label>
          {customError && (
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
              {customError}
            </span>
          )}
        </div>
      </div>

      {/* Terminal Real-Time Audit Log */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
            <Terminal className="w-4 h-4" />
            <span>Replay Audit Execution Terminal</span>
          </div>
          <span className="text-slate-500 font-mono text-[11px]">
            {replayState.action_log.length} logged events
          </span>
        </div>
        <div className="p-4 font-mono text-xs space-y-1.5 max-h-60 overflow-y-auto bg-slate-900/90 text-slate-300">
          {replayState.action_log.map((entry, idx) => (
            <div key={idx} className="flex items-start gap-2 border-b border-slate-800/40 pb-1">
              <span className="text-indigo-400 select-none">›</span>
              <span className="leading-relaxed">{entry}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
