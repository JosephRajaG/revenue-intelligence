# Presentation Slides: SpendNest Revenue Intelligence Inbox

Executive Presentation Deck (5 Slides)  
Candidate: Joseph Raja G  
Audited Date: 21 August 2026 (Asia/Kolkata)  
Dataset Universe: 44 interactions (30 calls, 14 meetings)

---

## Slide 1: The Manager Problem & Core Findings

### The Core Problem
Sales managers face an influx of messy, multi-channel interaction data: late-arriving transcripts, mislabeled meeting titles, unrecorded calls, and automated notes. They need an operational workspace that turns raw records into grounded, actionable revenue intelligence without hallucinating synthetic pipeline figures.

### Three Key Findings from August 21, 2026
1. **Cedarwave Distribution (`M04`): Churn Masked as "Routine Migration"**
   - *Evidence:* Turn 9 & 22 reveal client holds an existing INR 1.3 crore bank credit line and firmly rejects prepaid cards.
   - *Impact:* Multi-routed to Customer Success Churn Alert & Deal Next Steps for Head of Bank Partnerships escalation.
2. **Harborpath Advisory (`M01`): Strategic Channel Agreement, Not Direct ARR**
   - *Evidence:* Turn 1 & 9 establish partner referral model ($260 activation bonus + interchange tiers) for registered US entities.
   - *Impact:* Routed to Vendor/Partner Ops with US-entity compliance flags, avoiding AE quota inflation.
3. **Willowfield Trust (`M07`): Late-Arriving Transcript Uncovers 3 Production Bugs**
   - *Evidence:* Turn 2, 16, and 27 show payment description save failure, reimbursement selector freeze, and attachment crash.
   - *Impact:* Revision 2 ingest routes to CS bug escalation while preserving manager routing overrides.

---

## Slide 2: Interface Choices & Deliberate Omissions

### Key Interface Choices
- **Unified 4-Tab Workspace:** Executive Dashboard, Conversation Inbox, Replay Console & Verification Suite, and Export Center.
- **Evidence-Grounded Inspection Pane:** Direct transcript quotes, 1-based turn citations, and explicit boundaries of *"What evidence does NOT establish"*.
- **Interactive Metric Definitions Modal:** Explains the exact formula, numerator, denominator, and operational limitation of every metric.

### What Was Deliberately Omitted & Why
- **Rejected Synthetic Pipeline Value ($ ARR):** Transcripts mention bank credit lines (INR 1.3 Cr) and referral bonuses ($260), but no verified CRM contract value exists. Summing conversational numbers would create fraudulent pipeline metrics.
- **Rejected Unified "Rep Leaderboards":** Call reps (telephony talk-time seconds) cannot be meaningfully compared against meeting organisers (calendar event creators). Blending them creates distorted rankings.
- **Rejected Hallucinated Summaries for Missing Transcripts:** 26 records without text (silent meetings, cancelled bots, unrecorded calls) are placed in deterministic intake audit states rather than synthetic summaries.

---

## Slide 3: Routing Taxonomy, Folder Design & Difficult Case

### Routing Taxonomy & Folder Architecture
- `exports/customer_success/`: Churn risks, onboarding blockers, and critical client feedback.
- `exports/deal_next_steps/`: Qualified prospect opportunities, pricing proposals, and follow-ups.
- `exports/sales_coaching/`: Rep questioning techniques, objection handling, and pricing discussions.
- `exports/vendor_partner_ops/`: Channel partnerships, referral workflows, and technical integrations.
- `exports/intake_and_exceptions/`: Unrecorded calls, silent bots, and items requiring manual review.

### The Difficult Case: Multi-Routed Interactions (`M04` & `M01`)
- *The Challenge:* A single conversation frequently spans both deal pipeline progress and operational/churn risk.
- *The Solution:* **Dual-Routing Sister Documents**. The system outputs markdown files in both destinations with reciprocal cross-reference links (`[View Sister Customer Success Document](...)`), preserving complete context for both Account Executives and CS managers.
- *Manifest Traceability:* `manifest.json` and `manifest.csv` record both primary and secondary routes, file paths, and manual override status.

---

## Slide 4: Verification of Key Numbers & Analytical Conclusions

### Rigorous Number Verification
1. **Total Selected Records (44):**
   - Computed as unique `(source_type, source_id)` pairs across envelopes.
   - *Test:* Re-importing shuffled batches produces 0 duplicate records and 44 ignored duplicates.
2. **Usable Supplied Transcript Coverage (18 / 44 = 40.9%):**
   - Denominator strictly includes all 44 interactions (30 calls, 14 meetings).
   - Numerator tracks records with `transcript.text` or `transcript.turns >= 1` (17 in Rev 1, 18 in Rev 2).
3. **Telephony Talk Time Duration (Calls Only):**
   - Summed exclusively from `call_payload.talk_time_seconds` across 30 telephony calls. Meeting records do not report acoustic talk time and are kept separate.

### Analytical Verification Contract
- Every conclusion is tied to a specific turn number and exact quotation.
- Automated suggestions maintain a visible distinction from human manual decisions (`[Manual Override]` badge).
- Ingestion of newer revisions (`02_update.json`) merges new text without wiping prior manager overrides.

---

## Slide 5: Trade-offs, AI Usage, Limitations & Next Steps

### Trade-offs Accepted
- **Pre-Generated Analysis vs Dynamic Runtime Engine:** Analytical summaries for all 18 transcripts are pre-compiled with exact citations for maximum consistency and speed, while deduplication, revision merging, KPI calculations, and ZIP exports run dynamically in-browser.
- **Simplicity Over Bloat:** Chose a clean, responsive single-page architecture over complex backend microservices, ensuring 100% reproducible offline evaluation.

### Responsible AI Usage & Boundaries
- LLMs were utilized to extract candidate citations, identify turn numbers, and draft structured summaries.
- All extracted quotes and turn numbers were human-verified against source raw JSON payloads.

### Known Limitations & Roadmap
1. **Single-Day Cross-Section:** All activity is from 21 August 2026; future versions should support multi-day trends.
2. **Acoustic Diarization Gaps:** Telephony calls lack per-turn speaker timestamps; integrating real-time speech diarization would enhance rep-vs-prospect ratio tracking.
3. **Bidirectional CRM Sync:** Add webhook endpoints to synchronize manager routing decisions directly to Salesforce / HubSpot.
