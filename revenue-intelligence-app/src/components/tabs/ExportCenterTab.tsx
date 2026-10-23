import React, { useState } from 'react';
import { ProcessedRecord } from '../../types';
import {
  buildExportManifestAndFiles,
  downloadExportZip
} from '../../services/exportEngine';
import {
  Download,
  FolderTree,
  FileJson,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  ExternalLink,
  Layers,
  Copy,
  Check
} from 'lucide-react';

interface ExportCenterTabProps {
  records: Record<string, ProcessedRecord>;
  onSelectRecordByRef: (ref: string) => void;
}

export const ExportCenterTab: React.FC<ExportCenterTabProps> = ({
  records,
  onSelectRecordByRef
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'json' | 'csv' | 'tree'>('table');
  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const { manifestEntries, files } = buildExportManifestAndFiles(records);

  const manifestJsonText = JSON.stringify(
    {
      manifest_version: '1.0',
      exported_at: new Date().toISOString(),
      date_scope: '2026-08-21',
      time_zone: 'Asia/Kolkata (IST)',
      total_records: manifestEntries.length,
      records: manifestEntries
    },
    null,
    2
  );

  const manifestCsvText =
    `record_ref,source_type,source_id,applied_revision,primary_route,secondary_routes,output_paths,review_state,is_manually_overridden,analysis_freshness,rep_or_organizer,date,title_or_contact\n` +
    manifestEntries
      .map((m) => {
        const sec = `"${m.secondary_routes.join(';')}"`;
        const paths = `"${m.output_paths.join(';')}"`;
        const titleEsc = `"${m.title_or_contact.replace(/"/g, '""')}"`;
        return `${m.record_ref},${m.source_type},${m.source_id},${m.applied_revision},${m.primary_route},${sec},${paths},${m.review_state},${m.is_manually_overridden},${m.analysis_freshness},${m.rep_or_organizer},${m.date},${titleEsc}`;
      })
      .join('\n');

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      await downloadExportZip(records);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group files by directory
  const filesByDir = files.reduce((acc, f) => {
    const parts = f.relativePath.split('/');
    const dir = parts.length > 1 ? parts[0] : 'root';
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(parts.slice(1).join('/') || parts[0]);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                Export & Manifest Center
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Machine-Readable Manifest & Organized Output Archive
              </h2>
            </div>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Generating ZIP...' : 'Download Export ZIP'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Produces organized output files sorted into structured functional folders (<code>deal_next_steps</code>, <code>sales_coaching</code>, <code>customer_success</code>, <code>vendor_partner_ops</code>, <code>intake_and_exceptions</code>, and <code>daily_brief</code>). Each multi-routed conversation generates cross-referenced markdown documents to preserve complete context without information loss.
        </p>

        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs flex flex-wrap items-center justify-between gap-2 font-mono">
          <div className="text-slate-300">
            <span className="text-slate-400">Pre-generated Local Folder:</span>{' '}
            <code className="text-emerald-300 bg-slate-900 px-2 py-0.5 rounded">exports/</code>
          </div>
          <div className="text-slate-300">
            <span className="text-slate-400">Total Generated Outputs:</span>{' '}
            <span className="font-bold text-white">{files.length} files</span>
          </div>
        </div>
      </div>

      {/* Multi-Route Context Preservation Notice */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 text-amber-900 text-xs">
        <Layers className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Context Preservation Architecture:</span> When a conversation satisfies multiple routing criteria (e.g. <code>M01</code> is both a channel partnership agreement in <code>vendor_partner_ops</code> and a commercial commission agreement in <code>deal_next_steps</code>), the export system generates sister documents in both destination folders with explicit cross-links, ensuring no team member loses context while viewing their functional queue.
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'table' ? 'bg-indigo-600 text-white font-bold' : 'bg-white border text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Manifest Table ({manifestEntries.length})</span>
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'tree' ? 'bg-indigo-600 text-white font-bold' : 'bg-white border text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Folder Directory Tree</span>
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'json' ? 'bg-indigo-600 text-white font-bold' : 'bg-white border text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>manifest.json Preview</span>
            </button>
            <button
              onClick={() => setViewMode('csv')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'csv' ? 'bg-indigo-600 text-white font-bold' : 'bg-white border text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>manifest.csv Preview</span>
            </button>
          </div>

          {(viewMode === 'json' || viewMode === 'csv') && (
            <button
              onClick={() => handleCopy(viewMode === 'json' ? manifestJsonText : manifestCsvText)}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
          )}
        </div>

        {/* Tab 1: Manifest Table */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Ref</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Source Identity</th>
                  <th className="py-3 px-4 text-center">Applied Rev</th>
                  <th className="py-3 px-4">Primary Route</th>
                  <th className="py-3 px-4">Secondary Routes</th>
                  <th className="py-3 px-4">Generated Relative Output Paths</th>
                  <th className="py-3 px-4">Review State</th>
                  <th className="py-3 px-4 text-center">Overridden</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {manifestEntries.map((m, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onSelectRecordByRef(m.record_ref)}
                    className="hover:bg-indigo-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <span className="px-2 py-0.5 rounded bg-slate-100 group-hover:bg-indigo-100 group-hover:text-indigo-800 border border-slate-200">
                        {m.record_ref}
                      </span>
                    </td>
                    <td className="py-3 px-4 uppercase text-[11px] font-semibold text-slate-500">
                      {m.source_type}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {m.source_id.slice(0, 16)}...
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      v{m.applied_revision}
                    </td>
                    <td className="py-3 px-4 font-bold text-indigo-900">
                      {m.primary_route}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {m.secondary_routes.length > 0 ? m.secondary_routes.join(', ') : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                      {m.output_paths.join('; ')}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      {m.review_state}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {m.is_manually_overridden ? (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                          YES
                        </span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Folder Tree View */}
        {viewMode === 'tree' && (
          <div className="p-6 bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto space-y-4">
            <div className="text-slate-400 mb-2">📁 exports/ (Organized Destination Hierarchy)</div>
            <div className="pl-4 space-y-2">
              <div className="text-slate-300">├── 📄 manifest.json (Machine-readable JSON schema)</div>
              <div className="text-slate-300">├── 📄 manifest.csv (Machine-readable CSV schema)</div>
              {Object.entries(filesByDir).map(([dir, fileList], dIdx) => (
                <div key={dIdx} className="space-y-1">
                  <div className="text-indigo-400 font-bold">├── 📁 {dir}/</div>
                  <div className="pl-6 space-y-1 text-slate-300">
                    {fileList.map((f, fIdx) => (
                      <div key={fIdx}>
                        {fIdx === fileList.length - 1 ? '└──' : '├──'} 📄 {f}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: JSON Preview */}
        {viewMode === 'json' && (
          <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[600px]">
            <pre>{manifestJsonText}</pre>
          </div>
        )}

        {/* Tab 4: CSV Preview */}
        {viewMode === 'csv' && (
          <div className="p-4 bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto max-h-[600px] whitespace-pre">
            {manifestCsvText}
          </div>
        )}
      </div>
    </div>
  );
};
