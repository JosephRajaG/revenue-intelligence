# 3-Minute Screen Recording Script: SpendNest Revenue Intelligence Inbox

**Target Duration:** Exactly 3 minutes (180 seconds)  
**Tone:** Professional, concise, evidence-grounded, confident  
**Setup Before Recording:**  
1. Have the application running at `http://localhost:5173/`.  
2. Open in full screen (F11) or a clean browser window.  
3. Start on the **Executive Dashboard** tab in the initial state (or click *"Reset to Step 1"* in Replay Console beforehand).  
4. Keep your mouse movements smooth and deliberate.

---

## Detailed Turn-by-Turn Script

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SECTION 1: [0:00 - 0:35] INTRODUCTION & METRIC INTEGRITY                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

**[ON SCREEN]:** Start on the **Executive Dashboard**. Move cursor smoothly over the KPI summary cards at the top.

**[SPOKEN NARRATION]:**
> *"Hello! Welcome to the SpendNest Revenue Intelligence Inbox. I built this workspace to help sales managers make sense of 44 incoming calls and meetings from August 21st, 2026.*
>
> *Let’s start with metric integrity. In this dashboard, every number is strictly grounded in evidence. Our key headline metric is **Usable Transcript Coverage: 18 out of 44 interactions**, or **40.9%** post-update. The other 26 records are unrecorded calls or silent calendar bots, which we route to explicit intake queues rather than inventing hallucinated text.*
>
> *Crucially, we deliberately rejected synthetic CRM pipeline numbers and separated telephony Call Reps from calendar Meeting Organisers, because organisers are event schedulers—not verified quota-carrying reps."*

---

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SECTION 2: [0:35 - 1:25] USEFUL WORKFLOW & DIFFICULT ROUTING CASE           │
└─────────────────────────────────────────────────────────────────────────────┘
```

**[ON SCREEN]:** Click on the **Conversation Inbox** tab. In the left conversation list, click on **Meeting M04 (Cedarwave Distribution)**. The right-hand Conversation Inspector pane opens. Scroll down to show the Key Findings and Transcript Quotations.

**[SPOKEN NARRATION]:**
> *"Now let's look at a primary manager workflow and a difficult routing decision: **Meeting M04 with Cedarwave Distribution**.*
>
> *The original title framed this as a routine operational card migration. But when we inspect the actual transcript, in Turn 9 and Turn 11, the client states that moving from prepaid cards to a true credit card is their core issue, and in Turn 22 they reveal an existing **1.3 crore rupee commercial bank credit facility**.*
>
> *Because SpendNest does not issue credit lines, this was actually an acute churn risk. Our routing engine classified M04 under **Customer Success Churn Alert**, while simultaneously linking it to **Deal Next Steps** for partner banking escalation. Notice our sister-document architecture: both destinations are linked reciprocally so context is never lost across departments."*

---

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SECTION 3: [1:25 - 2:25] THE REPLAY CONTRACT & DEDUPLICATION TEST           │
└─────────────────────────────────────────────────────────────────────────────┘
```

**[ON SCREEN]:** Click on the **Replay Console** tab. Show the current state: 44 unique records, 17 usable transcripts (Initial Batch).

**[SPOKEN NARRATION]:**
> *"Next, let's verify our import and update replay contract.*
>
> *Right now, we have the initial 44 records loaded. In Step 2, I will click **'Test Shuffle & Deduplicate'**.*

**[ON SCREEN]:** Click the blue **"Test Shuffle & Deduplicate"** button. The audit log updates instantly.

**[SPOKEN NARRATION]:**
> *Notice that all 44 incoming items were evaluated, but our record count remains strictly **44**. Zero duplicate inflation, because identity is strictly anchored to the composite key: `(source_type, source_id)`.*
>
> *Now let's demonstrate manager judgment. Record **M07 (Willowfield Trust)** initially arrived with no transcript. Let's manually override its route to **Customer Success** with a custom audit note.*

**[ON SCREEN]:** Click **"Override M07 Route"** (or change route to Customer Success). Point cursor to the orange `[Manual Override]` badge.

**[SPOKEN NARRATION]:**
> *The manual override badge is immediately active. Now watch what happens when we ingest **02_update.json**, which brings a late 27-turn transcript for M07.*

**[ON SCREEN]:** Click **"Apply 02_update.json"**.

**[SPOKEN NARRATION]:**
> *The late transcript is ingested cleanly—usable transcripts rise from 17 to **18**, total records stay at **44**, and most importantly, the manager's manual route override is preserved intact. If I refresh the browser with F5...*

**[ON SCREEN]:** Press **F5** to refresh the page. App reloads instantly in post-update state with the manual override still in place.

**[SPOKEN NARRATION]:**
> *All 44 records, 18 transcripts, and manager overrides persist seamlessly in local storage."*

---

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SECTION 4: [2:25 - 3:00] EXPORT CENTER & CONCLUSION                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

**[ON SCREEN]:** Click on the **Export Center** tab. Show the folder structure and click **"Download Export ZIP"** in the top right.

**[SPOKEN NARRATION]:**
> *"Finally, in the **Export Center**, every routed conversation produces clean, evidence-backed Markdown summaries organized into dedicated functional folders: Customer Success, Deal Pipeline, Sales Coaching, and Partner Ops.*
>
> *Everything is mapped to a machine-readable `manifest.json` and `manifest.csv`, and can be downloaded as a complete ZIP bundle with one click.*
>
> *To summarize: this workspace provides honest denominators, protects human routing decisions against automated re-imports, and extracts true commercial risks without hallucinating unverified pipeline numbers. Thank you for watching!"*

---

## Quick Timing Reference Card

| Time | Tab | Action | Core Talking Point |
|---|---|---|---|
| **0:00 - 0:35** | Dashboard | Hover over KPIs | Usable transcript coverage (18/44 = 40.9%); no fake CRM leaderboards. |
| **0:35 - 1:25** | Inbox | Click M04 (Cedarwave) | Routine title vs real INR 1.3 Cr credit churn risk; dual-routing sister docs. |
| **1:25 - 1:45** | Replay Console | Click "Shuffle & Deduplicate" | Deduplication keyed on `(source_type, source_id)`; records stay at 44. |
| **1:45 - 2:10** | Replay Console | Override M07 route | Assign manual route with audit note; show badge. |
| **2:10 - 2:25** | Replay Console | Click "Apply 02_update.json" + F5 | Late transcript arrives (18 total); override survives re-import & reload. |
| **2:25 - 3:00** | Export Center | Click "Download Export ZIP" | Machine-readable manifests, functional output packs, wrap-up. |
