import React, { useState } from 'react';
import { DeliveryEnvelope } from '../types';
import {
  Upload,
  X,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Shuffle,
  FileCheck,
  ArrowRight
} from 'lucide-react';

interface UploadBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyEnvelope: (
    envelope: DeliveryEnvelope,
    shuffle?: boolean
  ) => { added: number; updated: number; ignored: number };
  initialBatch: DeliveryEnvelope;
  updateBatch: DeliveryEnvelope;
}

export const UploadBatchModal: React.FC<UploadBatchModalProps> = ({
  isOpen,
  onClose,
  onApplyEnvelope,
  initialBatch,
  updateBatch
}) => {
  if (!isOpen) return null;

  const [dragActive, setDragActive] = useState<boolean>(false);
  const [parsedEnvelope, setParsedEnvelope] = useState<DeliveryEnvelope | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shuffleOrder, setShuffleOrder] = useState<boolean>(false);
  const [resultStats, setResultStats] = useState<{
    added: number;
    updated: number;
    ignored: number;
    batchId: string;
  } | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetJson = (jsonString: string) => {
    try {
      setErrorMessage(null);
      setResultStats(null);
      const parsed = JSON.parse(jsonString);

      if (!parsed.batch_id || parsed.revision === undefined || !Array.isArray(parsed.records)) {
        throw new Error(
          'Invalid delivery format. Must contain "batch_id" (string), "revision" (integer), and "records" (array).'
        );
      }

      setParsedEnvelope(parsed);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to parse JSON file.');
      setParsedEnvelope(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        validateAndSetJson(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        validateAndSetJson(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleApply = () => {
    if (!parsedEnvelope) return;
    const stats = onApplyEnvelope(parsedEnvelope, shuffleOrder);
    setResultStats({
      ...stats,
      batchId: parsedEnvelope.batch_id
    });
  };

  const handleLoadSampleInitial = () => {
    setErrorMessage(null);
    setResultStats(null);
    setParsedEnvelope(initialBatch);
  };

  const handleLoadSampleUpdate = () => {
    setErrorMessage(null);
    setResultStats(null);
    setParsedEnvelope(updateBatch);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Upload & Import Delivery Envelope</h2>
              <p className="text-xs text-slate-300">
                Import JSON delivery envelopes matching DATA_CONTRACT.md specifications.
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

        {/* Content */}
        <div className="p-6 space-y-5 bg-slate-50 text-slate-900">
          {/* Quick Sample Batch Loaders */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              Quick Test Presets (Supplied Deliveries)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={handleLoadSampleInitial}
                className="p-3 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all shadow-xs flex flex-col justify-between"
              >
                <div className="font-bold text-indigo-950 flex items-center justify-between">
                  <span>01_initial.json</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                    Rev 1
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  44 records • 17 transcripts
                </div>
              </button>

              <button
                onClick={handleLoadSampleUpdate}
                className="p-3 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all shadow-xs flex flex-col justify-between"
              >
                <div className="font-bold text-indigo-950 flex items-center justify-between">
                  <span>02_update.json</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-semibold">
                    Rev 2
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  1 record (M07 late transcript)
                </div>
              </button>
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50/60'
                : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
          >
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">
              Drag and drop your JSON delivery envelope here
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports assessment JSON schema with batch_id, revision, and records
            </p>

            <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer border border-slate-300 transition-colors shadow-xs">
              <FileCode className="w-3.5 h-3.5 text-slate-600" />
              <span>Browse Local JSON File...</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Parsed File Preview */}
          {parsedEnvelope && (
            <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  Ready to Ingest Batch: <span className="font-mono">{parsedEnvelope.batch_id}</span>
                </span>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-mono font-bold">
                  Revision {parsedEnvelope.revision}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono">
                <div>
                  <span className="text-slate-500">Records in Batch:</span>{' '}
                  <span className="font-bold text-slate-800">{parsedEnvelope.records.length}</span>
                </div>
                <div>
                  <span className="text-slate-500">Delivery Exported At:</span>{' '}
                  <span className="text-slate-700">{parsedEnvelope.exported_at?.slice(0, 10) || 'N/A'}</span>
                </div>
              </div>

              {/* Shuffle Order Option */}
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={shuffleOrder}
                  onChange={(e) => setShuffleOrder(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="flex items-center gap-1">
                  <Shuffle className="w-3.5 h-3.5 text-slate-500" />
                  Randomize / shuffle record order before importing (tests deduplication idempotency)
                </span>
              </label>

              <button
                onClick={handleApply}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Apply Ingestion Rules to Workspace</span>
              </button>
            </div>
          )}

          {/* Success Result Stats */}
          {resultStats && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Successfully Applied Delivery Batch "{resultStats.batchId}"</span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono pt-1">
                <div className="p-2 bg-white rounded border border-emerald-100 text-center">
                  <span className="text-slate-500 block text-[10px]">Added</span>
                  <span className="font-bold text-emerald-700 text-sm">{resultStats.added}</span>
                </div>
                <div className="p-2 bg-white rounded border border-emerald-100 text-center">
                  <span className="text-slate-500 block text-[10px]">Updated</span>
                  <span className="font-bold text-indigo-700 text-sm">{resultStats.updated}</span>
                </div>
                <div className="p-2 bg-white rounded border border-emerald-100 text-center">
                  <span className="text-slate-500 block text-[10px]">Ignored (Dupes)</span>
                  <span className="font-bold text-slate-600 text-sm">{resultStats.ignored}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
