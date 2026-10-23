import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  FileSpreadsheet,
  RefreshCw,
  Download,
  HelpCircle,
  Tag,
  ShieldCheck,
  RotateCcw,
  Upload
} from 'lucide-react';
import { DashboardMetrics } from '../types';

export type ActiveTab = 'dashboard' | 'inbox' | 'brief' | 'replay' | 'export';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  metrics: DashboardMetrics;
  currentMaxRevision: number;
  onOpenDefinitions: () => void;
  onOpenUploadModal: () => void;
  onOpenResetModal: () => void;
  onDownloadZip: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  metrics,
  currentMaxRevision,
  onOpenDefinitions,
  onOpenUploadModal,
  onOpenResetModal,
  onDownloadZip
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top Banner with Stats & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Standalone Title */}
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-wider text-white uppercase">
            REVENUE INTELLIGENCE INBOX
          </h1>
        </div>

        {/* Live Status Indicators & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-xs">
            <span className="text-slate-400">Records:</span>
            <span className="font-bold text-white">{metrics.total_selected_records}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-xs">
            <span className="text-slate-400">Transcripts:</span>
            <span className="font-bold text-emerald-400">
              {metrics.transcripts_available}/{metrics.total_selected_records} ({metrics.transcript_coverage_percentage}%)
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
              currentMaxRevision === 2
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                : 'bg-amber-950/60 text-amber-300 border-amber-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{currentMaxRevision === 2 ? 'Rev 2 (Post-Update)' : 'Rev 1 (Initial)'}</span>
          </div>

          {metrics.manual_overrides_count > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-950/60 text-rose-300 rounded-lg border border-rose-800 text-xs font-semibold">
              <Tag className="w-3 h-3" />
              <span>{metrics.manual_overrides_count} Override{metrics.manual_overrides_count > 1 ? 's' : ''}</span>
            </div>
          )}

          {/* UPLOAD BATCH BUTTON */}
          <button
            onClick={onOpenUploadModal}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow transition-colors flex items-center gap-1.5"
            title="Upload custom JSON batch or load assessment presets"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Batch</span>
          </button>

          {/* RESET OPTIONS BUTTON */}
          <button
            onClick={onOpenResetModal}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Reset options: Reset to Rev 1, Rev 2, or Full Factory Reset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Options</span>
          </button>

          {/* Help Definitions */}
          <button
            onClick={onOpenDefinitions}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
            title="Inspect Metric Definitions & Denominators"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Quick Export Button */}
          <button
            onClick={onDownloadZip}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow transition-colors flex items-center gap-1.5"
            title="Download full organized export zip"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export ZIP</span>
          </button>
        </div>
      </div>

      {/* Main Tab Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-slate-800 text-sm font-medium">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'dashboard'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Executive Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('inbox')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'inbox'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Conversation Inbox</span>
          <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
            {metrics.total_selected_records}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('brief')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'brief'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Manager Daily Brief</span>
          <span className="text-xs px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-semibold">
            21 Aug 2026
          </span>
        </button>

        <button
          onClick={() => setActiveTab('replay')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'replay'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Replay & Test Suite</span>
          <span className="text-xs px-1.5 py-0.2 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
            Data Contract
          </span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'export'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Export Center & Manifest</span>
        </button>
      </div>
    </header>
  );
};
