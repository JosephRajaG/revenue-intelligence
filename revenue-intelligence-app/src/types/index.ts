export type SourceType = 'call' | 'meeting';

export type RouteCategory =
  | 'deal_next_steps'
  | 'sales_coaching'
  | 'customer_success'
  | 'vendor_partner_ops'
  | 'needs_review';

export type ReviewState =
  | 'analyzed'
  | 'needs_review'
  | 'intake_silent'
  | 'intake_no_speech'
  | 'intake_cancelled'
  | 'intake_not_scheduled'
  | 'intake_awaiting_processing'
  | 'manual_override';

export type AnalysisFreshness = 'current' | 'stale_pending_review' | 'unsupported';

export interface CallPayload {
  id: string;
  external_call_id?: string;
  workspace_slug?: string;
  rep_email?: string | null;
  rep_name?: string | null;
  rep_user_id?: string | null;
  direction?: string;
  direction_raw?: string;
  from_number?: string | null;
  to_number?: string | null;
  started_at: string;
  duration_seconds: number;
  talk_time_seconds?: number | null;
  speaker_count?: number | null;
  segment_count?: number | null;
  is_connected?: boolean | null;
  is_conversation?: boolean | null;
  observed_outcome?: string | null;
  classification_reason?: string | null;
  classification_status?: string | null;
  is_campaign_call?: boolean | null;
  first_dial_ever?: boolean | null;
  first_connect_ever?: boolean | null;
  prior_dials_ever?: number | null;
  prior_connects_ever?: number | null;
  summary?: string | null;
  summary_status?: string | null;
  transcript?: string | null;
}

export interface TranscriptTurn {
  turn_number?: number;
  speaker?: string;
  text: string;
  start_time?: string;
  end_time?: string;
}

export interface MeetingTranscriptPayload {
  meeting_id?: string;
  turns?: TranscriptTurn[];
  unavailable_reason?: string | null;
}

export interface MeetingPayload {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  duration_seconds: number;
  provider?: string;
  join_url?: string;
  organizer_email?: string | null;
  attendee_count?: number | null;
  recording_status: string;
  recording_detail?: string | null;
  recording_id?: string | null;
  has_transcript: boolean;
  has_video?: boolean;
  summary?: string | null;
  summary_status?: string | null;
  redacted?: boolean;
}

export interface SourceRecord {
  record_ref: string;
  source_type: SourceType;
  source_id: string;
  payload: CallPayload | MeetingPayload;
  transcript_payload?: MeetingTranscriptPayload | null;
}

export interface DeliveryEnvelope {
  batch_id: string;
  revision: number;
  exported_at: string;
  records: SourceRecord[];
}

export interface EvidencePassage {
  turn?: number;
  quote: string;
  speaker?: string;
  context?: string;
}

export interface NextStep {
  action: string;
  owner: string | null;
  priority: 'high' | 'medium' | 'low';
  timeline?: string;
}

export interface CoachingNotes {
  strengths: string[];
  opportunities: string[];
  manager_tip: string;
}

export interface ConversationAnalysis {
  primary_route: RouteCategory;
  secondary_routes: RouteCategory[];
  route_reasoning: string;
  review_state: ReviewState;
  analysis_freshness: AnalysisFreshness;
  applied_revision: number;
  summary: string;
  why_it_matters: string;
  evidence_passages: EvidencePassage[];
  what_evidence_does_not_establish: string[];
  next_steps: NextStep[];
  coaching_notes?: CoachingNotes;
  is_manually_overridden: boolean;
  manual_route_override?: RouteCategory | null;
  manual_override_note?: string;
  last_modified_at?: string;
}

export interface ProcessedRecord extends SourceRecord {
  batch_id: string;
  revision: number;
  analysis: ConversationAnalysis;
}

export interface PersonMetrics {
  person_name: string;
  role_type: 'Call Rep' | 'Meeting Organiser';
  email_or_id: string;
  total_records: number;
  transcripts_available: number;
  coverage_percentage: number;
  total_duration_minutes: number;
  total_talk_time_minutes: number;
  primary_routes_count: Record<RouteCategory, number>;
  review_queue_count: number;
  action_items_count: number;
}

export interface DashboardMetrics {
  total_selected_records: number;
  total_calls: number;
  total_meetings: number;
  transcripts_available: number;
  transcript_coverage_percentage: number;
  total_duration_hours: number;
  total_talk_time_hours: number;
  route_counts: Record<RouteCategory, number>;
  review_state_counts: Record<ReviewState, number>;
  manual_overrides_count: number;
  persons: PersonMetrics[];
  date_scope: string;
  time_zone: string;
}

export interface ManifestEntry {
  source_type: SourceType;
  source_id: string;
  record_ref: string;
  applied_revision: number;
  primary_route: RouteCategory;
  secondary_routes: RouteCategory[];
  output_paths: string[];
  review_state: ReviewState;
  is_manually_overridden: boolean;
  analysis_freshness: AnalysisFreshness;
  rep_or_organizer: string;
  date: string;
  title_or_contact: string;
}
