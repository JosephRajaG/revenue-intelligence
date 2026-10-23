import React, { useState, useMemo } from 'react';
import {
  ProcessedRecord,
  RouteCategory,
  ReviewState,
  SourceType
} from '../../types';
import {
  Search,
  Filter,
  Phone,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface InboxTabProps {
  records: Record<string, ProcessedRecord>;
  selectedPersonFilter?: string;
  selectedRouteFilter?: RouteCategory;
  onSelectRecord: (record: ProcessedRecord) => void;
  onClearFilters: () => void;
}

export const InboxTab: React.FC<InboxTabProps> = ({
  records,
  selectedPersonFilter,
  selectedRouteFilter,
  onSelectRecord,
  onClearFilters
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sourceTypeFilter, setSourceTypeFilter] = useState<'all' | SourceType>('all');
  const [personFilter, setPersonFilter] = useState<string>(selectedPersonFilter || 'all');
  const [routeFilter, setRouteFilter] = useState<string>(selectedRouteFilter || 'all');
  const [reviewStateFilter, setReviewStateFilter] = useState<string>('all');
  const [revisionFilter, setRevisionFilter] = useState<string>('all');

  // Sync if props change
  React.useEffect(() => {
    if (selectedPersonFilter) setPersonFilter(selectedPersonFilter);
  }, [selectedPersonFilter]);

  React.useEffect(() => {
    if (selectedRouteFilter) setRouteFilter(selectedRouteFilter);
  }, [selectedRouteFilter]);

  const recordList = useMemo(() => Object.values(records), [records]);

  // Unique persons list
  const uniquePersons = useMemo(() => {
    const set = new Set<string>();
    for (const r of recordList) {
      const isMeeting = r.source_type === 'meeting';
      const c = !isMeeting ? (r.payload as any) : null;
      const m = isMeeting ? (r.payload as any) : null;
      const name = isMeeting
        ? (m?.organizer_email ? m.organizer_email.split('@')[0] : 'unknown')
        : (c?.rep_name || (c?.rep_email ? c.rep_email.split('@')[0] : 'unknown'));
      set.add(name);
    }
    return Array.from(set).sort();
  }, [recordList]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return recordList.filter((r) => {
      const isMeeting = r.source_type === 'meeting';
      const c = !isMeeting ? (r.payload as any) : null;
      const m = isMeeting ? (r.payload as any) : null;
      const repName = isMeeting
        ? (m?.organizer_email ? m.organizer_email.split('@')[0] : 'unknown')
        : (c?.rep_name || (c?.rep_email ? c.rep_email.split('@')[0] : 'unknown'));
      const titleOrContact = isMeeting
        ? m?.title || ''
        : `Call with ${c?.to_number || ''}`;

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchRef = r.record_ref.toLowerCase().includes(query);
        const matchTitle = titleOrContact.toLowerCase().includes(query);
        const matchRep = repName.toLowerCase().includes(query);
        const matchSummary = (r.analysis.summary || '').toLowerCase().includes(query);
        if (!matchRef && !matchTitle && !matchRep && !matchSummary) return false;
      }

      // Source type
      if (sourceTypeFilter !== 'all' && r.source_type !== sourceTypeFilter) {
        return false;
      }

      // Person
      if (personFilter !== 'all' && repName !== personFilter) {
        return false;
      }

      // Route
      if (routeFilter !== 'all' && r.analysis.primary_route !== routeFilter) {
        return false;
      }

      // Review state
      if (reviewStateFilter !== 'all' && r.analysis.review_state !== reviewStateFilter) {
        return false;
      }

      // Revision
      if (revisionFilter !== 'all' && String(r.revision) !== revisionFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => a.record_ref.localeCompare(b.record_ref));
  }, [
    recordList,
    searchTerm,
    sourceTypeFilter,
    personFilter,
    routeFilter,
    reviewStateFilter,
    revisionFilter
  ]);

  const hasActiveFilters =
    Boolean(searchTerm) ||
    sourceTypeFilter !== 'all' ||
    personFilter !== 'all' ||
    routeFilter !== 'all' ||
    reviewStateFilter !== 'all' ||
    revisionFilter !== 'all';

  const resetAllFilters = () => {
    setSearchTerm('');
    setSourceTypeFilter('all');
    setPersonFilter('all');
    setRouteFilter('all');
    setReviewStateFilter('all');
    setRevisionFilter('all');
    onClearFilters();
  };

  const getRouteBadgeColor = (route: RouteCategory) => {
    switch (route) {
      case 'deal_next_steps':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'sales_coaching':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'customer_success':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'vendor_partner_ops':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'needs_review':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Filters Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ref (e.g. M07, C01), title, contact, rep, or keyword..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-indigo-500 transition-colors shadow-xs"
            />
          </div>

          {/* Quick Clear Button */}
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Source Type */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Source Type
            </label>
            <select
              value={sourceTypeFilter}
              onChange={(e) => setSourceTypeFilter(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
            >
              <option value="all">All Types (30 Calls, 14 Mtgs)</option>
              <option value="call">Calls Only (30)</option>
              <option value="meeting">Meetings Only (14)</option>
            </select>
          </div>

          {/* Person Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Rep / Organiser
            </label>
            <select
              value={personFilter}
              onChange={(e) => setPersonFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
            >
              <option value="all">All People ({uniquePersons.length})</option>
              {uniquePersons.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Route Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Assigned Route
            </label>
            <select
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
            >
              <option value="all">All Routes</option>
              <option value="deal_next_steps">Deal Next Steps</option>
              <option value="sales_coaching">Sales Coaching</option>
              <option value="customer_success">Customer Success</option>
              <option value="vendor_partner_ops">Vendor / Partner Ops</option>
              <option value="needs_review">Needs Review / Intake</option>
            </select>
          </div>

          {/* Review State Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Processing State
            </label>
            <select
              value={reviewStateFilter}
              onChange={(e) => setReviewStateFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
            >
              <option value="all">All States</option>
              <option value="analyzed">Analyzed (Text Present)</option>
              <option value="manual_override">Manual Override</option>
              <option value="intake_silent">Intake: Silent Telephony</option>
              <option value="intake_no_speech">Intake: No Speech Recorded</option>
              <option value="intake_cancelled">Intake: Bot Cancelled</option>
              <option value="intake_awaiting_processing">Intake: Awaiting Processing</option>
            </select>
          </div>

          {/* Revision Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Delivery Revision
            </label>
            <select
              value={revisionFilter}
              onChange={(e) => setRevisionFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
            >
              <option value="all">All Revisions</option>
              <option value="1">Revision 1 (Initial)</option>
              <option value="2">Revision 2 (Update Batch)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Record Counter & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">
            Showing {filteredRecords.length} of {recordList.length} interactions
          </span>
          <span className="text-slate-400 font-mono">
            Click any row to open the complete Evidence Inspector
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ref</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Title / Interaction Target</th>
                <th className="py-3 px-4">Person (Role)</th>
                <th className="py-3 px-4 text-center">Duration</th>
                <th className="py-3 px-4 text-center">Revision</th>
                <th className="py-3 px-4">Assigned Route</th>
                <th className="py-3 px-4">Processing State</th>
                <th className="py-3 px-4 text-right">Evidence Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-semibold">No interactions match the selected filters.</p>
                    <button
                      onClick={resetAllFilters}
                      className="mt-2 text-indigo-600 hover:underline font-medium text-xs"
                    >
                      Reset all filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const isMeeting = r.source_type === 'meeting';
                  const c = !isMeeting ? (r.payload as any) : null;
                  const m = isMeeting ? (r.payload as any) : null;
                  const repName = isMeeting
                    ? (m?.organizer_email ? m.organizer_email.split('@')[0] : 'unknown')
                    : (c?.rep_name || (c?.rep_email ? c.rep_email.split('@')[0] : 'unknown'));
                  const titleOrContact = isMeeting
                    ? m?.title || 'Meeting'
                    : `Call with ${c?.to_number || 'Prospect'}`;

                  return (
                    <tr
                      key={`${r.source_type}:${r.source_id}`}
                      onClick={() => onSelectRecord(r)}
                      className="hover:bg-indigo-50/50 transition-colors group cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        <span className="px-2 py-0.5 rounded bg-slate-100 group-hover:bg-indigo-100 group-hover:text-indigo-800 border border-slate-200 transition-colors">
                          {r.record_ref}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                            isMeeting
                              ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isMeeting ? <Calendar className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                          {isMeeting ? 'Meeting' : 'Call'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                        <div className="truncate">{titleOrContact}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-normal">
                          {r.source_id.slice(0, 18)}...
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        <span>{repName}</span>
                        <span className="text-[10px] text-slate-400 block">
                          {isMeeting ? 'Organiser' : 'Call Rep'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-600">
                        {formatSeconds(r.payload.duration_seconds)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                            r.revision === 2
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          v{r.revision}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getRouteBadgeColor(
                            r.analysis.primary_route
                          )}`}
                        >
                          {r.analysis.primary_route.replace(/_/g, ' ')}
                        </span>
                        {r.analysis.is_manually_overridden && (
                          <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded font-semibold border border-rose-200">
                            Override
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] text-slate-600">
                          {r.analysis.review_state}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-indigo-600 group-hover:translate-x-1 font-semibold transition-transform">
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
