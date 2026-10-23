# SpendNest Revenue Intelligence Inbox

A comprehensive, evidence-grounded workspace designed for sales managers to triage incoming telephony calls, calendar meetings, transcripts, and operational notes across 44 interactions occurring on **21 August 2026 (Asia/Kolkata / IST)**.

Built in compliance with the **SpendNest Revenue Intelligence Assessment Specification**, **DATA_CONTRACT.md**, and **DATA_DICTIONARY.md**.

---

## Quick Start & Running the Application

### Prerequisites
- Node.js (v18+ or v20+ recommended; tested on v22.16.0)
- npm (v9+ or v10+)

### Setup Instructions
```bash
# 1. Navigate to the React application folder
cd "revenue-intelligence-app"

# 2. Install dependencies (lucide-react, jszip, tailwindcss, etc.)
npm install

# 3. Launch development server with hot-reload
npm run dev

# 4. Open the application in your browser:
# Local URL: http://localhost:5173/
```

### Production Build & Preview
```bash
npm run build
npm run preview
```

---

## Reproducing the Replay Verification Contract

The application includes an interactive **Replay & Test Suite** tab (also accessible via the top navigation bar) that demonstrates each requirement in `DATA_CONTRACT.md`:

| Step | Action in UI | Expected & Verified Behaviour |
|---|---|---|
| **1. Initial Import** | Click *"Reset to Step 1 (Rev 1)"* | Exactly 44 unique records loaded. 17 usable transcripts available (10 calls, 7 meetings). Record `M07` is in Revision 1 without transcript text. |
| **2. Repeat (Deduplication)** | Click *"Test Shuffle & Deduplicate"* | Re-imports `01_initial.json` with records shuffled in random order. Unique record count remains strictly 44 (zero duplicate inflation). System logs 44 ignored duplicates. |
| **3. Route Correction** | Click *"Override M07 Route"* (or edit any record in the Conversation Inspector) | Sets `M07`'s route to `customer_success` with a manager audit note. A persistent `[Manual Override]` badge appears. |
| **4. Ingestion of Update** | Click *"Apply 02_update.json"* | Ingests Revision 2. Applies the late transcript (27 turns) to `M07`. Usable transcript count increases from 17 to **18**. Total unique records remains strictly **44**. `M07`'s manual route override remains preserved! |
| **5. Preserve Judgment** | Click *"Re-import Older Rev 1"* | Older Revision 1 delivery is rejected by delivery versioning logic. `M07` remains at Revision 2 with transcript and manual override intact. |
| **6. Restart & Refresh** | Press `F5` / Browser Refresh | Application state is persisted in `localStorage`. All 44 records, 18 transcripts, and manual overrides reload seamlessly. |

---

## Pre-Generated vs Dynamic Analysis Architecture

- **Pre-Generated Analysis Layer:**  
  In accordance with the brief (*"Pre-generated analysis is allowed. If you use it, make clear which content is pre-generated, what the application actually computes, and how new content is handled"*), high-fidelity analytical models for all 18 transcripts are pre-compiled in `src/data/precomputed_analyses.ts`. Each analysis includes exact 1-based turn citations, direct quotes, explicit boundaries of *"What evidence does NOT establish"*, and role-assigned action items.
- **Dynamic Runtime Engine:**  
  The application dynamically computes:
  1. Record deduplication keyed strictly on the composite identity `(source_type, source_id)`.
  2. Revision comparison and payload replacement.
  3. Preservation of human manual routing overrides across re-imports and browser refreshes.
  4. Calculation of all KPI denominators, coverage percentages, and talk-time duration metrics.
  5. In-browser `.zip` archive generation and machine-readable `manifest.json` / `manifest.csv` formatting via JSZip.
- **Handling Records Without Text:**  
  The 26 records without usable transcripts (20 telephony calls without text, 3 silent meetings with 0 turns, 2 cancelled bots, 1 unscheduled) are routed to deterministic intake audit states (`intake_silent`, `intake_no_speech`, `intake_cancelled`) without hallucinating synthetic summaries.

---

## Metric Definitions & Denominators

Detailed formulas can be inspected inside the app by clicking **"Metric Definitions & Denominators"** in the top navigation bar or Executive Dashboard:

1. **Total Selected Records (44):**  
   - *Formula:* Count of unique `(source_type, source_id)` pairs in delivery envelopes.  
   - *Denominator:* Fixed 44 interactions (30 calls, 14 meetings) for 21 August 2026.  
   - *Limitation:* Selected assessment extract, not a complete census of team activity.
2. **Usable Supplied Transcript Coverage (18 / 44 = 40.9%):**  
   - *Formula:* `(Records with text or turns >= 1) / (Total selected records) * 100`  
   - *Initial:* 17 / 44 (38.6%) -> *Post-Update:* 18 / 44 (40.9%).  
   - *Limitation:* A missing transcript does not prove an unrecorded conversation never occurred.
3. **Total Stored Interaction Duration (hours):**  
   - *Formula:* `Sum(payload.duration_seconds) / 3600`  
   - *Limitation:* Includes telephony ringing and hold time; calendar meeting duration reflects scheduled/bot time, not verified human participation.
4. **Reported Rep Talk Time (hours):**  
   - *Formula:* `Sum(call_payload.talk_time_seconds) / 3600` for calls only. Telephony acoustic speech metric; meeting records do not supply a comparable talk-time field.
5. **Team Role Separation:**  
   - **Call Reps** (Arun, Meera, Kiran, Dev): Identified via `rep_name` / `rep_email`.  
   - **Meeting Organisers** (`team06`–`team12`): Calendar invitation creators. *Organisers are not automatically salespeople, attendees, or quota carriers.*

---

## Where Output Files and Manifests Are Stored

Generated outputs are organized into functional category folders with machine-readable manifests:

1. **Local Files on Disk:**  
   - `candidate/exports/` and `candidate/revenue-intelligence-app/exports/`  
   - Machine-Readable Manifests: `exports/manifest.json` and `exports/manifest.csv`  
   - Destination Directories:
     - `exports/daily_brief/2026-08-21_manager_brief.md`
     - `exports/deal_next_steps/`
     - `exports/sales_coaching/`
     - `exports/customer_success/`
     - `exports/vendor_partner_ops/`
     - `exports/intake_and_exceptions/`
2. **Context Preservation for Multi-Routed Records:**  
   When an interaction has secondary routes (e.g. `M01` is both Channel Ops and Deal Pipeline; `M04` is both Customer Success Churn Risk and Deal Next Steps), the system generates sister documents in both destination folders with reciprocal Markdown links to preserve complete context.
3. **Client-Side One-Click ZIP Download:**  
   Clicking **"Download Export ZIP"** in the app header or Export Center tab packages all output files and manifests into `spendnest_revenue_intelligence_export.zip`.

---

## Key Submission Documents

- **Three Key Findings & One Rejected Decision:**  
  Full details with exact turn numbers and quotes in [`FINDINGS_AND_DECISIONS.md`](./FINDINGS_AND_DECISIONS.md).
- **Five Presentation Slides:**  
  Available in Markdown [`SLIDES.md`](./SLIDES.md) and interactive printable HTML [`SLIDES.html`](./SLIDES.html).
- **Three-Minute Screen Recording Script:**  
  Turn-by-turn spoken narration script in [`SCREEN_RECORDING_SCRIPT.md`](./SCREEN_RECORDING_SCRIPT.md).

---

## Approximate Time Spent

- **Codebase Exploration & Data Contract Audit:** 1.5 hours  
- **Analysis Data Synthesis & Evidence Citations:** 2.0 hours  
- **React Frontend Architecture & Tab Components:** 2.5 hours  
- **Replay Verification Suite & Export Engine:** 1.0 hour  
- **Documentation, Presentation Deck & Recording Script:** 1.0 hour  
- **Total Work Time:** ~8.0 hours
