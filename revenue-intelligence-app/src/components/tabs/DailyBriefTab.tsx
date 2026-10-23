import React from 'react';
import { MANAGER_DAILY_BRIEF } from '../../data/manager_brief_data';
import { ProcessedRecord } from '../../types';
import {
  FileSpreadsheet,
  AlertTriangle,
  TrendingUp,
  Network,
  Headphones,
  ClipboardList,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface DailyBriefTabProps {
  records: Record<string, ProcessedRecord>;
  onSelectRecordByRef: (ref: string) => void;
}

export const DailyBriefTab: React.FC<DailyBriefTabProps> = ({
  records,
  onSelectRecordByRef
}) => {
  const brief = MANAGER_DAILY_BRIEF;

  const getSectionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case 1:
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 2:
        return <Network className="w-5 h-5 text-blue-500" />;
      case 3:
        return <Headphones className="w-5 h-5 text-purple-500" />;
      case 4:
      default:
        return <ClipboardList className="w-5 h-5 text-slate-500" />;
    }
  };

  const getSectionBadgeColor = (badge?: string) => {
    if (badge?.includes('Immediate')) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (badge?.includes('Sales')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (badge?.includes('Partnership')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (badge?.includes('Enablement')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <FileSpreadsheet className="w-6 h-6" />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
                Daily Manager Intelligence Briefing
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Briefing for 21 August 2026
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Timezone: {brief.time_zone}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-bold text-emerald-400 leading-snug">
            {brief.executive_headline}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {brief.coverage_summary}
          </p>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {brief.sections.map((sec, secIdx) => (
          <div
            key={secIdx}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Section Header */}
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
                  {getSectionIcon(secIdx)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{sec.title}</h3>
                  <p className="text-xs text-slate-500">{sec.summary}</p>
                </div>
              </div>
              {sec.badge && (
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold border self-start sm:self-auto ${getSectionBadgeColor(
                    sec.badge
                  )}`}
                >
                  {sec.badge}
                </span>
              )}
            </div>

            {/* Section Items */}
            <div className="divide-y divide-slate-100 p-2 sm:p-4 space-y-2">
              {sec.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="p-4 rounded-xl hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-200 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
                        {item.record_ref}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{item.headline}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          item.urgency === 'high'
                            ? 'bg-rose-100 text-rose-700'
                            : item.urgency === 'medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.urgency} Urgency
                      </span>
                      {item.record_ref.includes('-') || item.record_ref.includes(',') ? null : (
                        <button
                          onClick={() => onSelectRecordByRef(item.record_ref)}
                          className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-400 text-indigo-600 rounded text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <span>Inspect Evidence</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 font-medium">
                    Owner / Point of Contact: <span className="text-slate-800">{item.owner_or_rep}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-800 leading-relaxed">
                      <strong className="text-slate-900 block mb-0.5">Key Finding:</strong>
                      {item.key_finding}
                    </div>

                    <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 text-indigo-950 leading-relaxed">
                      <strong className="text-indigo-900 block mb-0.5">Required Action:</strong>
                      {item.action_required}
                    </div>

                    <div className="text-[11px] text-slate-500 italic pl-1 flex items-center gap-1.5">
                      <span className="font-semibold not-italic text-slate-600">Verifiable Passage Citation:</span>
                      <span>{item.evidence_citation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
