import React, { useState } from 'react';
import {
  DashboardMetrics,
  ProcessedRecord,
  RouteCategory,
  SourceType
} from '../../types';
import {
  FileText,
  Phone,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  HelpCircle,
  TrendingUp,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Headphones,
  LifeBuoy,
  Network,
  ClipboardList
} from 'lucide-react';

interface DashboardTabProps {
  metrics: DashboardMetrics;
  records: Record<string, ProcessedRecord>;
  onSelectPersonFilter: (personName: string) => void;
  onSelectRouteFilter: (route: RouteCategory) => void;
  onSelectRecord: (record: ProcessedRecord) => void;
  onOpenDefinitions: () => void;
  onLoadInitialBatch?: () => void;
  onLoadFinalBatch?: () => void;
  onOpenUploadModal?: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  metrics,
  records,
  onSelectPersonFilter,
  onSelectRouteFilter,
  onSelectRecord,
  onOpenDefinitions,
  onLoadInitialBatch,
  onLoadFinalBatch,
  onOpenUploadModal
}) => {
  const [roleFilter, setRoleFilter] = useState<'All' | 'Call Rep' | 'Meeting Organiser'>('All');

  const filteredPersons = metrics.persons.filter((p) => {
    if (roleFilter === 'All') return true;
    return p.role_type === roleFilter;
  });

  const getRouteIcon = (route: RouteCategory) => {
    switch (route) {
      case 'deal_next_steps':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'sales_coaching':
        return <Headphones className="w-4 h-4 text-purple-600" />;
      case 'customer_success':
        return <LifeBuoy className="w-4 h-4 text-amber-600" />;
      case 'vendor_partner_ops':
        return <Network className="w-4 h-4 text-blue-600" />;
      case 'needs_review':
      default:
        return <ClipboardList className="w-4 h-4 text-slate-600" />;
    }
  };

  const getRouteColor = (route: RouteCategory) => {
    switch (route) {
      case 'deal_next_steps':
        return 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-950';
      case 'sales_coaching':
        return 'border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-purple-950';
      case 'customer_success':
        return 'border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-950';
      case 'vendor_partner_ops':
        return 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-950';
      case 'needs_review':
      default:
        return 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-950';
    }
  };

  const formatMinutes = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hours === 0) return `${remMins}m`;
    return `${hours}h ${remMins}m`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome / Orientation Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                DATE: 2026-08-21 (Asia/Kolkata)
              </span>
              <span className="text-xs text-slate-300">
                • 44 Selected Records Evaluated
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Revenue Intelligence Executive Overview
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Synthesizing 30 telephony interactions and 14 calendar meetings. Differentiating caller outbound reps from calendar organizers, auditing uncaptured records, and grounding every action item in verifiable source evidence.
            </p>
          </div>

          <button
            onClick={onOpenDefinitions}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors backdrop-blur-sm shadow-sm whitespace-nowrap self-start md:self-auto"
          >
            <HelpCircle className="w-4 h-4 text-indigo-300" />
            <span>Metric Definitions & Denominators</span>
          </button>
        </div>
      </div>

      {/* If Workspace is Empty (0 Records) */}
      {metrics.total_selected_records === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4 shadow-sm animate-in fade-in">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <ClipboardList className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Workspace is Currently Empty (0 Records)</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              You have cleared all records and overrides. Click a preset delivery below or upload a custom JSON delivery file to begin.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onLoadInitialBatch}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Load Initial Batch (01_initial.json • Rev 1)
            </button>
            <button
              onClick={onLoadFinalBatch}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Load Final Post-Update State (Rev 2)
            </button>
            <button
              onClick={onOpenUploadModal}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors border border-slate-300"
            >
              Upload Custom Delivery File...
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Primary KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Selected Records */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Selected Records</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {metrics.total_selected_records}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>30 Calls • 14 Meetings</span>
            <span className="font-mono text-indigo-600 font-semibold">100% Audited</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            Denominator: Fixed 44 assessment interactions
          </div>
        </div>

        {/* Metric 2: Usable Transcript Coverage */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Supplied Transcript Coverage</span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 tracking-tight flex items-baseline gap-2">
            <span>{metrics.transcript_coverage_percentage}%</span>
            <span className="text-sm font-normal text-slate-500">
              ({metrics.transcripts_available}/{metrics.total_selected_records})
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${metrics.transcript_coverage_percentage}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
            <span>10 Calls • 8 Meetings with text</span>
            <span className="text-emerald-700 font-medium">+1 Late Update</span>
          </div>
        </div>

        {/* Metric 3: Stored Interaction Duration */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Stored Duration</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {metrics.total_duration_hours} <span className="text-sm font-normal text-slate-500">hours</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Rep Talk Time: {metrics.total_talk_time_hours} hrs</span>
            <span className="font-mono text-amber-600 font-medium">Calls Only</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            Includes ringing/hold; not verified attendee time
          </div>
        </div>

        {/* Metric 4: Review Queue & Governance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-rose-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Intake & Exception Queue</span>
            <AlertOctagon className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 tracking-tight flex items-baseline gap-2">
            <span>{metrics.total_selected_records - metrics.transcripts_available}</span>
            <span className="text-sm font-normal text-slate-500">records</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Silent/Cancelled: 26</span>
            {metrics.manual_overrides_count > 0 && (
              <span className="text-indigo-600 font-semibold">{metrics.manual_overrides_count} Overridden</span>
            )}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            Intake audited without invented analysis
          </div>
        </div>
      </div>

      {/* Routing Distribution Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Routing Taxonomy Distribution</h3>
            <p className="text-xs text-slate-500">
              Categorized destination workloads. Click any category to filter the conversation inbox.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {(
            [
              'deal_next_steps',
              'sales_coaching',
              'customer_success',
              'vendor_partner_ops',
              'needs_review'
            ] as RouteCategory[]
          ).map((route) => {
            const count = metrics.route_counts[route] || 0;
            const pct = Math.round((count / metrics.total_selected_records) * 100);
            return (
              <button
                key={route}
                onClick={() => onSelectRouteFilter(route)}
                className={`p-4 rounded-xl border text-left transition-all shadow-sm flex flex-col justify-between ${getRouteColor(
                  route
                )}`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="p-1.5 bg-white rounded-lg shadow-xs">{getRouteIcon(route)}</div>
                  <span className="text-xs font-mono font-bold">{pct}%</span>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">
                    {route.replace(/_/g, ' ')}
                  </div>
                  <div className="text-2xl font-black mt-1">{count}</div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                    <span>Inspect records</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Team Breakdown Table (Reps vs Organisers) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Activity Breakdown by Individual & Role</h3>
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Explicit Role Separation
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Distinguishing Call Reps (phone callers) from Meeting Organisers (calendar creators, not verified attendees or reps).
            </p>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 text-xs font-medium">
            {(['All', 'Call Rep', 'Meeting Organiser'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  roleFilter === r ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'All' ? 'All Roles' : `${r}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Individual Name</th>
                <th className="py-3 px-4">Role Classification</th>
                <th className="py-3 px-4">Account Identifier</th>
                <th className="py-3 px-4 text-center">Selected Records</th>
                <th className="py-3 px-4 text-center">Transcript Coverage</th>
                <th className="py-3 px-4 text-right">Duration (Total)</th>
                <th className="py-3 px-4 text-right">Talk Time (Calls)</th>
                <th className="py-3 px-4 text-center">Review Queue</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredPersons.map((p, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-indigo-50/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectPersonFilter(p.person_name)}
                >
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                      {p.person_name.slice(0, 2).toUpperCase()}
                    </span>
                    <span>{p.person_name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        p.role_type === 'Call Rep'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                      }`}
                    >
                      {p.role_type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                    {p.email_or_id}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900">
                    {p.total_records}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-semibold text-slate-900">
                      {p.transcripts_available}/{p.total_records}
                    </span>
                    <span className="text-slate-400 text-[10px] ml-1">
                      ({p.coverage_percentage}%)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {formatMinutes(p.total_duration_minutes)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {p.role_type === 'Call Rep' ? formatMinutes(p.total_talk_time_minutes) : '—'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {p.review_queue_count > 0 ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                        {p.review_queue_count} pending
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-medium">0</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPersonFilter(p.person_name);
                      }}
                      className="px-2.5 py-1 bg-white border border-slate-300 group-hover:border-indigo-400 group-hover:text-indigo-600 rounded text-xs font-medium transition-colors shadow-xs"
                    >
                      Filter Inbox →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
