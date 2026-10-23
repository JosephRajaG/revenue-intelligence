import {
  DashboardMetrics,
  PersonMetrics,
  ProcessedRecord,
  RouteCategory,
  ReviewState
} from '../types';

export interface MetricDefinition {
  id: string;
  label: string;
  category: 'Volume' | 'Coverage' | 'Duration' | 'Governance';
  formula: string;
  numerator: string;
  denominator: string;
  unit: string;
  interpretation: string;
  caveat_or_limitation: string;
}

export const METRIC_DEFINITIONS: Record<string, MetricDefinition> = {
  total_selected_records: {
    id: 'total_selected_records',
    label: 'Total Selected Records',
    category: 'Volume',
    formula: 'Count of unique (source_type, source_id) pairs in workspace',
    numerator: '44 source records',
    denominator: 'N/A (discrete count)',
    unit: 'records',
    interpretation: 'The full universe of interactions delivered in the assessment package for 21 August 2026 (Asia/Kolkata).',
    caveat_or_limitation: 'Deliberately selected extract for assessment; not a complete or representative census of the whole sales organization.'
  },
  transcript_coverage: {
    id: 'transcript_coverage',
    label: 'Usable Supplied Transcript Coverage',
    category: 'Coverage',
    formula: '(Records with usable text or turns) / (Total selected records) * 100',
    numerator: '18 records with text (10 calls with transcript text + 8 meetings with turns array > 0)',
    denominator: '44 total selected records',
    unit: 'percentage (%)',
    interpretation: 'Proportion of records that have verifiable conversation evidence available for substantive AI/manager analysis.',
    caveat_or_limitation: 'Initial import contains 17/44 (38.6%); after applying update-002 (M07 late delivery), coverage reaches 18/44 (40.9%). A missing transcript does not prove a call never occurred.'
  },
  total_duration_hours: {
    id: 'total_duration_hours',
    label: 'Total Stored Interaction Duration',
    category: 'Duration',
    formula: 'Sum(payload.duration_seconds) across all 44 records / 3600',
    numerator: 'Sum of upstream duration seconds across 30 calls and 14 meetings',
    denominator: '3600 seconds per hour',
    unit: 'hours',
    interpretation: 'Total elapsed time upstream systems captured for calls and scheduled/recorded calendar sessions.',
    caveat_or_limitation: 'Call duration includes ringing and hold time; meeting duration represents scheduled/captured time and cannot be summed as verified attended human conversation.'
  },
  total_talk_time_hours: {
    id: 'total_talk_time_hours',
    label: 'Reported Rep Talk Time (Calls Only)',
    category: 'Duration',
    formula: 'Sum(call_payload.talk_time_seconds) across 30 calls / 3600',
    numerator: 'Sum of upstream reported talk_time_seconds on call objects',
    denominator: '3600 seconds per hour',
    unit: 'hours',
    interpretation: 'Active acoustic speech detected by telephony system across outbound/inbound phone calls.',
    caveat_or_limitation: 'Telephony estimate only; meeting records do not provide a comparable talk_time field. Do not infer per-speaker ratios from abridged transcripts.'
  },
  manual_overrides_count: {
    id: 'manual_overrides_count',
    label: 'Manual Routing Overrides',
    category: 'Governance',
    formula: 'Count of records where is_manually_overridden == true',
    numerator: 'User-corrected records',
    denominator: 'Total assigned routes',
    unit: 'records',
    interpretation: 'Number of automated classifications corrected by a manager, preserved across subsequent batch replays.',
    caveat_or_limitation: 'Reflects human judgment modifying automated routing taxonomy.'
  }
};

export function computeDashboardMetrics(records: Record<string, ProcessedRecord>): DashboardMetrics {
  const recordList = Object.values(records);
  const total = recordList.length;

  let totalCalls = 0;
  let totalMeetings = 0;
  let transcriptsAvailable = 0;
  let totalDurationSec = 0;
  let totalTalkTimeSec = 0;
  let manualOverrides = 0;

  const routeCounts: Record<RouteCategory, number> = {
    deal_next_steps: 0,
    sales_coaching: 0,
    customer_success: 0,
    vendor_partner_ops: 0,
    needs_review: 0
  };

  const reviewStateCounts: Record<ReviewState, number> = {
    analyzed: 0,
    needs_review: 0,
    intake_silent: 0,
    intake_no_speech: 0,
    intake_cancelled: 0,
    intake_not_scheduled: 0,
    intake_awaiting_processing: 0,
    manual_override: 0
  };

  // Group by person (Distinguishing Call Reps from Meeting Organisers)
  const personMap: Record<string, {
    name: string;
    role_type: 'Call Rep' | 'Meeting Organiser';
    email: string;
    total: number;
    transcripts: number;
    duration: number;
    talkTime: number;
    routes: Record<RouteCategory, number>;
    reviewQueue: number;
    actionItems: number;
  }> = {};

  for (const r of recordList) {
    const isMeeting = r.source_type === 'meeting';
    const cPayload = !isMeeting ? (r.payload as any) : null;
    const mPayload = isMeeting ? (r.payload as any) : null;
    const tp = r.transcript_payload;

    if (isMeeting) {
      totalMeetings++;
    } else {
      totalCalls++;
    }

    const hasText = isMeeting
      ? Boolean(tp?.turns && tp.turns.length > 0)
      : Boolean(cPayload?.transcript && cPayload.transcript.trim().length > 0);

    if (hasText) {
      transcriptsAvailable++;
    }

    const dur = r.payload.duration_seconds || 0;
    totalDurationSec += dur;

    if (!isMeeting && cPayload?.talk_time_seconds) {
      totalTalkTimeSec += cPayload.talk_time_seconds;
    }

    // Routing & State counts
    const primary = r.analysis.primary_route;
    if (routeCounts[primary] !== undefined) {
      routeCounts[primary]++;
    }

    const state = r.analysis.review_state;
    if (reviewStateCounts[state] !== undefined) {
      reviewStateCounts[state]++;
    }

    if (r.analysis.is_manually_overridden) {
      manualOverrides++;
    }

    // Person attribution
    let personName = 'Unassigned';
    let roleType: 'Call Rep' | 'Meeting Organiser' = 'Call Rep';
    let emailOrId = 'unknown';

    if (isMeeting) {
      roleType = 'Meeting Organiser';
      emailOrId = mPayload?.organizer_email || 'unknown_organizer@example.com';
      personName = emailOrId.split('@')[0]; // e.g. team06
    } else {
      roleType = 'Call Rep';
      personName = cPayload?.rep_name || (cPayload?.rep_email ? cPayload.rep_email.split('@')[0] : 'Unknown Rep');
      emailOrId = cPayload?.rep_email || cPayload?.rep_user_id || 'phone_rep';
    }

    const pKey = `${roleType}:${emailOrId}`;
    if (!personMap[pKey]) {
      personMap[pKey] = {
        name: personName,
        role_type: roleType,
        email: emailOrId,
        total: 0,
        transcripts: 0,
        duration: 0,
        talkTime: 0,
        routes: {
          deal_next_steps: 0,
          sales_coaching: 0,
          customer_success: 0,
          vendor_partner_ops: 0,
          needs_review: 0
        },
        reviewQueue: 0,
        actionItems: 0
      };
    }

    const p = personMap[pKey];
    p.total++;
    if (hasText) p.transcripts++;
    p.duration += dur;
    if (!isMeeting && cPayload?.talk_time_seconds) {
      p.talkTime += cPayload.talk_time_seconds;
    }
    p.routes[primary] = (p.routes[primary] || 0) + 1;
    if (state !== 'analyzed') {
      p.reviewQueue++;
    }
    p.actionItems += r.analysis.next_steps?.length || 0;
  }

  const persons: PersonMetrics[] = Object.values(personMap).map((p) => ({
    person_name: p.name,
    role_type: p.role_type,
    email_or_id: p.email,
    total_records: p.total,
    transcripts_available: p.transcripts,
    coverage_percentage: p.total > 0 ? Math.round((p.transcripts / p.total) * 1000) / 10 : 0,
    total_duration_minutes: Math.round(p.duration / 60),
    total_talk_time_minutes: Math.round(p.talkTime / 60),
    primary_routes_count: p.routes,
    review_queue_count: p.reviewQueue,
    action_items_count: p.actionItems
  })).sort((a, b) => {
    // Sort call reps first, then organisers
    if (a.role_type !== b.role_type) {
      return a.role_type === 'Call Rep' ? -1 : 1;
    }
    return b.total_records - a.total_records;
  });

  return {
    total_selected_records: total,
    total_calls: totalCalls,
    total_meetings: totalMeetings,
    transcripts_available: transcriptsAvailable,
    transcript_coverage_percentage: total > 0 ? Math.round((transcriptsAvailable / total) * 1000) / 10 : 0,
    total_duration_hours: Math.round((totalDurationSec / 3600) * 10) / 10,
    total_talk_time_hours: Math.round((totalTalkTimeSec / 3600) * 10) / 10,
    route_counts: routeCounts,
    review_state_counts: reviewStateCounts,
    manual_overrides_count: manualOverrides,
    persons,
    date_scope: '2026-08-21',
    time_zone: 'Asia/Kolkata (IST)'
  };
}
