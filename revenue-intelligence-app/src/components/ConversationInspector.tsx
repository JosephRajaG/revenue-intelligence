import React, { useState } from 'react';
import { ProcessedRecord, RouteCategory } from '../types';
import {
  X,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle,
  FileText,
  User,
  Clock,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Tag,
  CheckSquare
} from 'lucide-react';

interface ConversationInspectorProps {
  record: ProcessedRecord | null;
  onClose: () => void;
  onSaveOverride: (newRoute: RouteCategory, note?: string) => void;
  onClearOverride: () => void;
}

export const ConversationInspector: React.FC<ConversationInspectorProps> = ({
  record,
  onClose,
  onSaveOverride,
  onClearOverride
}) => {
  if (!record) return null;

  const [activeTab, setActiveTab] = useState<'analysis' | 'transcript' | 'raw'>('analysis');
  const [selectedRoute, setSelectedRoute] = useState<RouteCategory>(record.analysis.primary_route);
  const [overrideNote, setOverrideNote] = useState<string>(record.analysis.manual_override_note || '');
  const [showOverrideForm, setShowOverrideForm] = useState<boolean>(false);

  const isMeeting = record.source_type === 'meeting';
  const cPayload = !isMeeting ? (record.payload as any) : null;
  const mPayload = isMeeting ? (record.payload as any) : null;
  const tp = record.transcript_payload;

  const turns = isMeeting ? tp?.turns || [] : [];
  const transcriptText = !isMeeting ? cPayload?.transcript || '' : '';
  const hasTranscript = isMeeting ? turns.length > 0 : Boolean(transcriptText.trim());

  const repOrOrg = isMeeting
    ? mPayload?.organizer_email || 'unknown_org'
    : cPayload?.rep_name || cPayload?.rep_email || 'unknown_rep';

  const titleOrContact = isMeeting
    ? mPayload?.title || 'Meeting'
    : `Call with ${cPayload?.to_number || 'Prospect'}`;

  const handleSave = () => {
    onSaveOverride(selectedRoute, overrideNote);
    setShowOverrideForm(false);
  };

  const handleClear = () => {
    onClearOverride();
    setSelectedRoute(record.analysis.primary_route);
    setShowOverrideForm(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-indigo-600 rounded text-white tracking-wider">
                {record.record_ref}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded font-medium flex items-center gap-1.5 ${
                  isMeeting ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}
              >
                {isMeeting ? <Calendar className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                {isMeeting ? 'Calendar Meeting' : 'Telephony Call'}
              </span>
              <span className="text-xs px-2.5 py-1 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700">
                Revision: Rev {record.revision}
              </span>
              {record.analysis.is_manually_overridden && (
                <span className="text-xs px-2.5 py-1 rounded font-semibold bg-rose-900/80 text-rose-200 border border-rose-700 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Manual Override
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">{titleOrContact}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
              <span>
                Identity: ({record.source_type}, "{record.source_id}")
              </span>
              <span>•</span>
              <span>
                Owner: {repOrOrg} ({isMeeting ? 'Organiser' : 'Call Rep'})
              </span>
              <span>•</span>
              <span>Duration: {formatSeconds(record.payload.duration_seconds)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Status & Quick Override Banner */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Assigned Route:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getRouteBadgeColor(record.analysis.primary_route)}`}>
              {record.analysis.primary_route.replace(/_/g, ' ')}
            </span>
            {record.analysis.secondary_routes && record.analysis.secondary_routes.length > 0 && (
              <span className="text-xs text-slate-500 font-medium">
                (Secondary: {record.analysis.secondary_routes.map((s) => s.replace(/_/g, ' ')).join(', ')})
              </span>
            )}
            <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
              State: {record.analysis.review_state}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!showOverrideForm ? (
              <button
                onClick={() => setShowOverrideForm(true)}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                Change Route / Override
              </button>
            ) : null}
            {record.analysis.is_manually_overridden && (
              <button
                onClick={handleClear}
                className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                title="Reset manual route back to automated suggestion"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restore Automated
              </button>
            )}
          </div>
        </div>

        {/* Override Form Dropdown */}
        {showOverrideForm && (
          <div className="p-4 bg-indigo-50 border-b border-indigo-200 flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-bold text-indigo-900 block">Select New Primary Destination Route:</label>
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value as RouteCategory)}
                className="w-full text-xs font-semibold p-2 bg-white border border-indigo-300 rounded-lg text-slate-900 shadow-sm"
              >
                <option value="deal_next_steps">Deal Next Steps & Pipeline</option>
                <option value="sales_coaching">Sales Coaching & Rep Guidance</option>
                <option value="customer_success">Customer Success / Support Escapes</option>
                <option value="vendor_partner_ops">Vendor, Partner & Internal Ops</option>
                <option value="needs_review">Needs Manager Review / Intake</option>
              </select>
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs font-bold text-indigo-900 block">Override Reason / Manager Note:</label>
              <input
                type="text"
                value={overrideNote}
                onChange={(e) => setOverrideNote(e.target.value)}
                placeholder="e.g., Client requested credit exception, re-routing to CS"
                className="w-full text-xs p-2 bg-white border border-indigo-300 rounded-lg text-slate-900 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-5">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow transition-colors"
              >
                Save Override
              </button>
              <button
                onClick={() => setShowOverrideForm(false)}
                className="px-3 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg text-xs hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 bg-white flex items-center gap-6">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-3.5 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'analysis'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Analysis & Actionable Guidance
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`py-3.5 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'transcript'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Conversation Transcript ({isMeeting ? `${turns.length} turns` : hasTranscript ? 'Available' : 'Silent'})
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`py-3.5 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'raw'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            Raw Source Metadata
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto bg-slate-50 space-y-6 flex-1">
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Card 1: What Happened & Why it Matters */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wide">
                  <CheckCircle className="w-4 h-4" />
                  1. Executive Context & Business Significance
                </div>
                <div className="space-y-2">
                  <p className="text-slate-900 text-sm leading-relaxed">
                    <strong>Summary:</strong> {record.analysis.summary}
                  </p>
                  <p className="text-slate-700 text-sm leading-relaxed bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                    <strong className="text-indigo-950">Why It Matters:</strong> {record.analysis.why_it_matters}
                  </p>
                  <p className="text-xs text-slate-500">
                    <strong>Route Reasoning:</strong> {record.analysis.route_reasoning}
                  </p>
                </div>
              </div>

              {/* Card 2: Supporting Evidence */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm uppercase tracking-wide">
                    <FileText className="w-4 h-4" />
                    2. Verifiable Evidence Passages & Transcript Citations
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Click "Trace" to jump directly into transcript</span>
                </div>
                <div className="space-y-2">
                  {record.analysis.evidence_passages.map((ev, idx) => (
                    <div key={idx} className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-emerald-900 font-semibold">
                        <span>{ev.turn ? `Turn #${ev.turn}` : 'Direct Quote Passage'}</span>
                        <div className="flex items-center gap-2">
                          {ev.speaker && <span className="bg-emerald-100 px-2 py-0.5 rounded text-emerald-800">{ev.speaker}</span>}
                          {ev.turn && isMeeting && (
                            <button
                              onClick={() => {
                                setActiveTab('transcript');
                                setTimeout(() => {
                                  const el = document.getElementById(`turn-${ev.turn}`);
                                  if (el) {
                                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    el.classList.add('ring-2', 'ring-indigo-500', 'bg-indigo-50');
                                    setTimeout(() => el.classList.remove('ring-2', 'ring-indigo-500', 'bg-indigo-50'), 3000);
                                  }
                                }, 150);
                              }}
                              className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 hover:bg-indigo-200 text-indigo-700 flex items-center gap-1 transition-colors shadow-2xs"
                              title={`Jump directly to Turn #${ev.turn} in transcript`}
                            >
                              <span>Trace in Transcript →</span>
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-800 italic">"{ev.quote}"</p>
                      {ev.context && <p className="text-xs text-slate-500">Context: {ev.context}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: What Evidence Does NOT Establish */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm uppercase tracking-wide">
                  <ShieldAlert className="w-4 h-4" />
                  3. What the Evidence Does NOT Establish (Honest Omissions)
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {record.analysis.what_evidence_does_not_establish.map((noEv, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{noEv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 4: Next Steps & Owners */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm uppercase tracking-wide">
                  <CheckSquare className="w-4 h-4" />
                  4. Action Items & Assigned Ownership
                </div>
                <div className="space-y-2">
                  {record.analysis.next_steps.map((ns, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg gap-2">
                      <div className="text-xs text-slate-800 font-medium">
                        • {ns.action}
                      </div>
                      <div className="flex items-center gap-2 text-xs flex-shrink-0">
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-semibold">
                          Owner: {ns.owner || 'Unassigned'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded font-bold uppercase ${
                            ns.priority === 'high'
                              ? 'bg-rose-100 text-rose-700'
                              : ns.priority === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {ns.priority}
                        </span>
                        {ns.timeline && <span className="text-slate-500 font-mono">({ns.timeline})</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 5: Coaching Notes */}
              {record.analysis.coaching_notes && (
                <div className="bg-white p-5 rounded-xl border border-purple-200 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-purple-700 font-bold text-sm uppercase tracking-wide">
                    <User className="w-4 h-4" />
                    5. Sales Rep Coaching Feedback
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg space-y-1">
                      <span className="font-bold text-emerald-900 block">Demonstrated Strengths:</span>
                      <ul className="space-y-1 text-emerald-800 list-disc list-inside">
                        {record.analysis.coaching_notes.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg space-y-1">
                      <span className="font-bold text-amber-900 block">Development Areas:</span>
                      <ul className="space-y-1 text-amber-800 list-disc list-inside">
                        {record.analysis.coaching_notes.opportunities.map((o, idx) => (
                          <li key={idx}>{o}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg text-xs text-purple-900">
                    <strong>Manager 1-on-1 Tip:</strong> {record.analysis.coaching_notes.manager_tip}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'transcript' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              {!hasTranscript ? (
                <div className="p-8 text-center space-y-2">
                  <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-base font-semibold text-slate-800">No Usable Transcript Supplied</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    This source record intentionally has no conversation text in this extract (
                    {isMeeting
                      ? tp?.unavailable_reason || 'meeting cancelled or nobody spoke'
                      : 'background telephony record unsupplied'}
                    ). Metadata is preserved as evidence.
                  </p>
                </div>
              ) : isMeeting ? (
                <div className="space-y-3">
                  <div className="text-xs text-slate-500 font-mono pb-2 border-b border-slate-100 flex justify-between">
                    <span>Meeting Transcript: {turns.length} Turn Exchanges</span>
                    <span>1-based indexed turn order</span>
                  </div>
                  {turns.map((t, idx) => {
                    const turnNum = t.turn_number || idx + 1;
                    return (
                      <div
                        key={idx}
                        id={`turn-${turnNum}`}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 font-mono">
                            Turn #{turnNum}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-700">
                            {t.speaker || 'Speaker'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed font-sans">{t.text}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs text-slate-500 font-mono pb-2 border-b border-slate-100">
                    Adapted Call Telephony Text
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                    {transcriptText}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="text-xs text-slate-500 font-mono">
                Full Unmodified Assessment JSON Envelope Payload
              </div>
              <pre className="p-4 bg-slate-900 text-emerald-400 text-xs rounded-xl overflow-x-auto font-mono max-h-96">
                {JSON.stringify(record, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
