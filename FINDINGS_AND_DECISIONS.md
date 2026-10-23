# Revenue Intelligence Findings & Rejected Architectural Decisions

**Submission Document:** Antigravity Revenue Intelligence Workspace  
**Date of Audited Dataset:** 21 August 2026 (Asia/Kolkata / IST)  
**Dataset Universe:** 44 interactions (30 telephony calls, 14 calendar meetings)

---

## Part 1: Three Most Important Findings

### Finding 1: Cedarwave Distribution (`M04`) Masks an Existential Account Churn Threat Behind a "Routine Migration" Label

- **What Was Noticed:**  
  Calendar meeting `M04` was originally titled *"Cedarwave Distribution / SpendNest discussion"* and framed by the rep as an operational card migration (transitioning away from SpendNest's older card network due to card acceptance failures). However, conversational analysis of the client's finance leadership reveals that Cedarwave holds an existing **INR 1.3 crore corporate credit facility** with their commercial bank. Cedarwave firmly refused another prepaid card program and actively challenged SpendNest's value proposition when informed that SpendNest cannot offer native credit lines or real-time limit controls over external bank cards.
- **Supporting Source Passages:**  
  - *Meeting M04, Turn 9 (Customer A):*  
    > "Also, will the replacement be a proper credit card? We do not really want another prepaid arrangement indefinitely."
  - *Meeting M04, Turn 11 (Customer A):*  
    > "Give me a moment to check internally. Okay, I have confirmed it: moving from prepaid to credit is the main issue for us. At some stage we will have to consider another option for that."
  - *Meeting M04, Turn 22 (Customer B - Credit Lead):*  
    > "We already have a corporate credit line of about INR 1.3 crore. Cards are issued to only a few people so far... If your platform can sit in between, we should understand that route."
  - *Meeting M04, Turn 26 (Customer B):*  
    > "Then what do we gain by adding SpendNest? We can already see transactions in the bank portal."
- **Exact Screen, Rule, and Product Impact:**  
  - **Screen:** Executive Dashboard (`Urgent Commercial Escalations`), Conversation Inbox (`Customer Success / Churn Alert`), and Manager Daily Brief (`Section 1: Item 1`).  
  - **Rule:** Rule `CHURN_ESCALATION_PREPAID_MISMATCH` multi-routes `M04` into both `customer_success` (Primary) and `deal_next_steps` (Secondary), triggering an immediate escalation badge for the Head of Bank Partnerships.  
  - **Export Output:** Generated files `exports/customer_success/M04_Cedarwave_Distribution.md` and `exports/deal_next_steps/M04_Cedarwave_Distribution_deal_next_steps.md` with explicit sister document cross-references.

---

### Finding 2: Harborpath Advisory (`M01`) is a High-Volume Channel Distribution Agreement, Not an End-User Deal

- **What Was Noticed:**  
  Meeting `M01` was scheduled as an exploratory discussion, but examination of the transcript shows the counterpart is an advisory partner seeking to monetize cross-border corporate incorporations. A critical misconception had to be resolved: the partner believed SpendNest opened personal bank accounts remotely for foreign individuals. Once corrected to registered US entities, the parties negotiated commercial partner commissions ($260 activation commission per approved entity, plus card spend tiers up to $390 bonus and recurring interchange share) and agreed on a unique referral tracking workflow.
- **Supporting Source Passages:**  
  - *Meeting M01, Turn 1 (Partner A):*  
    > "My understanding was that you help people open bank accounts remotely. That is what I wanted to explore for the clients coming through Harborpath Advisory."
  - *Meeting M01, Turn 2 (Team Member A):*  
    > "Yes, with one important boundary: we work with registered businesses, not individuals opening personal accounts. Is the business use case what you had in mind?"
  - *Meeting M01, Turn 9 (Team Member A):*  
    > "The activation payment is USD 260 when a referred company gets its account approved by our compliance partners. The cards option also has an interchange revenue share and a bonus based on the customer's spending during the first 60 days... USD 6,500–32,500 of spend earns a USD 195 bonus; the next bracket through USD 130,000 earns USD 390."
  - *Meeting M01, Turn 21 (Team Member A):*  
    > "Then let us use the unique link. They fill in the business information, then go through to arranging a demo with our team."
- **Exact Screen, Rule, and Product Impact:**  
  - **Screen:** Conversation Inbox & Detail Inspector (`Partner Onboarding & Referral Agreement`), Manager Daily Brief (`Section 3: Strategic Channel Pipeline`).  
  - **Rule:** Rule `PARTNER_REFERRAL_CHANNEL` classifies `M01` as `vendor_partner_ops` with a compliance requirement flag (`US Entity Verification Required`), preventing it from inflating direct AE customer quota.  
  - **Export Output:** Exported to `exports/vendor_partner_ops/M01_Harborpath_Advisory.md` and cross-referenced in `exports/deal_next_steps/M01_Harborpath_Advisory_deal_next_steps.md`.

---

### Finding 3: Staged Update Meeting `M07` (Willowfield Trust) Uncovers Three Replicable Production UI Defects

- **What Was Noticed:**  
  In the initial delivery (`01_initial.json`), `M07` arrived with no usable transcript, correctly placing it in an `intake_awaiting_processing` state. In the update delivery (`02_update.json`), the late transcript arrived (27 turn exchanges). Customer A shared their screen to demonstrate three severe application bugs: (1) Editing event payment descriptions fails to persist to the database upon clicking Save; (2) Reimbursement transaction selector freezes on the first page of records; (3) Direct file attachments crash the UI, necessitating an external workaround.
- **Supporting Source Passages:**  
  - *Meeting M07, Turn 2 (Customer A):*  
    > "The first one is editing the description. I am changing this event-payment description to a short reference and clicking Save changes. Now look at the displayed description again."
  - *Meeting M07, Turn 3 (Team Member A) & Turn 4 (Customer A):*  
    > "The field still shows the earlier wording. So the change is not appearing after you save, is that right? Yes, it is still the old description. That is why I sent it across."
  - *Meeting M07, Turn 16 (Customer A):*  
    > "The next issue is in reimbursements. I cannot select the first group of transactions on this screen."
  - *Meeting M07, Turn 27 (Team Member A):*  
    > "I will send the details to the team, get their confirmation and come back to you. Thank you for showing the actual steps rather than only the final screen."
- **Exact Screen, Rule, and Product Impact:**  
  - **Screen:** Replay Console (`Step 4: Update Batch Test`) and Conversation Inspector (`Product Bug & Escalation Checklist`).  
  - **Rule:** Rule `LATE_TRANSCRIPT_REVISION_INGESTION` transitions `M07` from `intake_awaiting_processing` to `customer_success` (or preserves any manual route assigned by the manager), while marking the analysis state as `current` (v2) and generating high-priority engineering bug tickets.  
  - **Export Output:** Exported to `exports/customer_success/M07_Willowfield_Trust.md`.

---

## Part 2: One Deliberately Rejected Architectural Decision

### Rejected Decision: Cross-Person Sales Leaderboards & Synthetic Opportunity Dollar Valuations

- **Alternative Considered:**  
  We evaluated building a traditional sales CRM dashboard that:
  1. Aggregated total interaction minutes into a unified "rep performance ranking", comparing Call Reps (Arun, Meera, Kiran, Dev) directly against Meeting Organisers (`team06` through `team12`).
  2. Extracted monetary numbers mentioned in transcripts (e.g. Cedarwave's INR 1.3 crore bank credit line from `M04`, Harborpath's $260 activation bonus from `M01`, Asterloom's 500-invoice tier from `M03`, or cash application amounts in `M06`) and summed them into an executive "Total Pipeline Value ($)" headline KPI.
- **Why It Was Deliberately Rejected:**  
  1. **Role Incommensurability:** As highlighted in `DATA_DICTIONARY.md`, meeting organisers are calendar event creators, *not* verified sales account executives or attendees. Conversely, call reps are active outbound/inbound telephone reps whose telephony system records talk-time seconds. Comparing an organiser's 30-minute scheduled calendar block against a rep's 40-second cold call creates fundamentally meaningless and distorted rankings.
  2. **Invented Pipeline Hallucination:** The supplied dataset contains no CRM opportunity table, win probability, or verified contract values. Cedarwave's INR 1.3 crore is an external bank credit line, *not* SpendNest revenue; Harborpath's $260 is an outgoing commission expense, not ARR. Summing these unverified conversational numbers produces a fraudulent pipeline metric that violates the core principle of evidence-based revenue intelligence.
- **Accepted Trade-Off:**  
  We sacrificed having a flashy "Pipeline ARR Total" bar chart and "Rep Leaderboard" widget in favor of total metric integrity.
- **Resulting Choice in the Product:**  
  - We engineered an **Explicit Role Separation Table** in the Executive Dashboard that categorizes individuals into **Call Reps** vs **Meeting Organisers**, displaying role-appropriate metrics (e.g. Talk Time is reported strictly for telephony reps, while calendar organisers show meeting coverage and review queues).
  - Replaced speculative revenue figures with rigorous operational and evidence coverage metrics: **Total Selected Records (44)**, **Usable Supplied Transcript Coverage (18/44 = 40.9%)**, **Total Stored Duration (hours)**, and an **Interactive Metric Definitions Modal** specifying exact numerators, denominators, and measurement boundaries.
