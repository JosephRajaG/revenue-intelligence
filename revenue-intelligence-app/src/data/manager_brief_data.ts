export interface BriefSection {
  title: string;
  badge?: string;
  summary: string;
  items: {
    record_ref: string;
    headline: string;
    owner_or_rep: string;
    urgency: 'high' | 'medium' | 'low';
    key_finding: string;
    action_required: string;
    evidence_citation: string;
  }[];
}

export interface ManagerDailyBrief {
  date: string;
  time_zone: string;
  executive_headline: string;
  coverage_summary: string;
  sections: BriefSection[];
}

export const MANAGER_DAILY_BRIEF: ManagerDailyBrief = {
  date: '2026-08-21',
  time_zone: 'Asia/Kolkata (IST)',
  executive_headline: 'Critical Churn Alert on Cedarwave, Willowfield Production Bugs Escalated, and 2 High-Leverage Strategic Partnerships Progressed',
  coverage_summary: '44 selected interactions audited across 4 Call Reps (30 calls) and 7 Calendar Meeting Organisers (14 meetings). Usable transcript coverage is 18 of 44 (40.9%) post-update (17 initial + late M07 delivery). 26 records routed to Intake Audit without invented text.',
  sections: [
    {
      title: '1. Urgent Commercial & Churn Escalations',
      badge: 'Immediate Action',
      summary: 'High-stakes accounts requiring immediate leadership attention before contract risk or customer dissatisfaction compounds.',
      items: [
        {
          record_ref: 'M04',
          headline: 'Cedarwave Distribution - Critical Migration Churn Risk (Credit vs Prepaid)',
          owner_or_rep: 'team09@example.com (Meeting Organiser)',
          urgency: 'high',
          key_finding: 'Cedarwave holds an existing INR 1.3 crore bank corporate credit line. They flatly reject moving to another prepaid card program as SpendNest closes its older card network. They questioned the core value of SpendNest if bank cards only provide post-settlement feeds without real-time limit controls.',
          action_required: 'Head of Product & Bank Partnerships must urgently evaluate whether Cedarwave bank-issued cards qualify for direct transaction feeds; otherwise account is at immediate risk of churning.',
          evidence_citation: 'Turn 11 ("moving from prepaid to credit is the main issue for us") and Turn 22 ("corporate credit line of about INR 1.3 crore")'
        },
        {
          record_ref: 'M07',
          headline: 'Willowfield Trust - 3 Production Platform Bugs Demonstrated via Screen Share',
          owner_or_rep: 'team09@example.com (Customer Success)',
          urgency: 'high',
          key_finding: 'Customer demonstrated 3 repeatable UI bugs during late-transcribed session: (1) Description edits fail to save; (2) Reimbursement transaction selector freezes; (3) Direct file uploads crash.',
          action_required: 'File high-priority engineering bugs; send escalation tracking numbers to customer before Monday.',
          evidence_citation: 'Turn 3 ("field still shows the earlier wording... change is not appearing after you save") and Turn 16 ("cannot select first group of transactions")'
        },
        {
          record_ref: 'M09',
          headline: 'Brookmint Holdings / Northkite - Onboarding Token Expiration & RBAC Architecture',
          owner_or_rep: 'team11@example.com (CS Onboarding)',
          urgency: 'high',
          key_finding: 'Customer onboarding halted due to expired invitation token; customer refused informal trust for cross-subsidiary permissions.',
          action_required: 'Reissue secure onboarding link today; deliver written multi-tenant isolation documentation.',
          evidence_citation: 'Turn 1 ("invitation for Brookmint Holdings did not work... expired") and Turn 17 ("I do not want this to depend on trusting someone")'
        }
      ]
    },
    {
      title: '2. High-Value Deal & Pipeline Commitments',
      badge: 'Sales Acceleration',
      summary: 'Active buyer discussions where clear next steps were agreed with committed deadlines.',
      items: [
        {
          record_ref: 'M03',
          headline: 'Asterloom Systems - Finance Director Negotiation on 500-Invoice Tier',
          owner_or_rep: 'team08@example.com (AE)',
          urgency: 'high',
          key_finding: 'Finance Director joined call to negotiate price down based on planned scale. Agreed on special 500-invoice/month pricing tier if delivered by Friday.',
          action_required: 'Send formal commercial proposal with 500-invoice tier before close of business today with 14-day validity window.',
          evidence_citation: 'Turn 1 ("finance colleague is joining... revisit price") and Turn 36 ("send revised proposal with the 500-invoice tier by Friday")'
        },
        {
          record_ref: 'C03',
          headline: 'Milan (Developer API Access) - Roaming Audio Follow-up by Email',
          owner_or_rep: 'Kiran (Call Rep)',
          urgency: 'medium',
          key_finding: 'Milan reiterated budget concerns over API access but agreed to review an email proposal before a Monday/Tuesday callback.',
          action_required: 'Send email titled "Developer access and event notifications - follow-up" containing a starter developer tier; follow up Monday morning.',
          evidence_citation: 'Call passage: "We did ask about some developer functionality, but it isn\'t essential enough for us to spend much on it... Send the email and we can speak Monday or Tuesday."'
        },
        {
          record_ref: 'C10',
          headline: 'Aniket - Invoice Automation Feature Sheet for Upcoming Director Review',
          owner_or_rep: 'Meera (Call Rep)',
          urgency: 'medium',
          key_finding: 'Prospect confirmed interest in eliminating manual invoice handling ahead of their monthly board/director evaluation.',
          action_required: 'Send invoice automation deck with tiered pricing by Monday morning; offer 15-min board prep briefing.',
          evidence_citation: 'Call passage: "Send the pricing tiers and an invoice automation feature sheet... We have a review coming up with the directors next month."'
        },
        {
          record_ref: 'M06',
          headline: 'Mapletrail Services - 65-Person Finance Org Manual Reconciliation Friction',
          owner_or_rep: 'team10@example.com (Discovery)',
          urgency: 'medium',
          key_finding: 'Uncovered high friction around TDS/withholding tax reconciliation (e.g. INR 1.3L invoice paid at 1.17L) and manual bank receipt matching.',
          action_required: 'Send dual solution brief (Cash Application Automation + Virtual Corporate Cards); ask for corporate HQ intro.',
          evidence_citation: 'Turn 4 ("Roughly 65 people across finance") and Turn 22 ("Cash application... matching receipt is not enough")'
        }
      ]
    },
    {
      title: '3. Strategic Channel & Partnerships Pipeline',
      badge: 'Partnership Growth',
      summary: 'Channel development conversations creating scalable referral pipelines for SpendNest business accounts.',
      items: [
        {
          record_ref: 'M01',
          headline: 'Harborpath Advisory - US Entity Partner Referral Agreement Finalized',
          owner_or_rep: 'team06@example.com (Channel Lead)',
          urgency: 'high',
          key_finding: 'Corrected misconception that SpendNest opens individual bank accounts; established registered US entity boundary. Agreed to commercial terms: USD 260 activation commission + interchange share + up to USD 390 spend bonus.',
          action_required: 'Dispatch Partner Memorandum and unique web referral onboarding link with compliance verification checklist.',
          evidence_citation: 'Turn 2 ("we work with registered businesses, not individuals") and Turn 9 ("activation payment is USD 260... USD 390 spend bonus")'
        },
        {
          record_ref: 'C07',
          headline: 'Willowbank Advisory - Cross-Border Incorporation Channel Outreach',
          owner_or_rep: 'Dev (Call Rep)',
          urgency: 'medium',
          key_finding: 'Aditya confirmed Willowbank assists clients with overseas incorporation and agreed to evaluate SpendNest US account referral partnership.',
          action_required: 'Email partnership overview deck and schedule review call for Wednesday 26 Aug.',
          evidence_citation: 'Call passage: "Do you help clients incorporate companies overseas as well?... Send across the partner details and we can look at it next week."'
        },
        {
          record_ref: 'M02',
          headline: 'LedgerBridge - Strategic Accounts Receivable & Webhook Integration',
          owner_or_rep: 'team07@example.com (Corporate Strategy)',
          urgency: 'low',
          key_finding: 'Exploratory session evaluating LedgerBridge API webhooks for automated invoice and accounts receivable sync.',
          action_required: 'Coordinate technical architectural scoping session between SpendNest engineering leads and LedgerBridge.',
          evidence_citation: 'Turn 1 ("we are developing accounts receivable... understand whether LedgerBridge can give us...")'
        }
      ]
    },
    {
      title: '4. Sales Rep Coaching & Execution Insights',
      badge: 'Team Enablement',
      summary: 'Behavioral observations from rep cold outreach to improve conversion and qualification rigor.',
      items: [
        {
          record_ref: 'C01',
          headline: 'Arun - Premature Automation Pitch on Cold Call',
          owner_or_rep: 'Arun (Call Rep)',
          urgency: 'medium',
          key_finding: 'Arun stayed remarkably calm under prospect pushback, but pitched automated operations before establishing whether the prospect handled finance software.',
          action_required: 'Coach Arun on the 30-second upfront permission contract and asking diagnostic questions before pitching.',
          evidence_citation: 'Call passage: "We work with outsourced finance leadership firms and look at ways to automate their finance operations. Our processes are already very automated."'
        },
        {
          record_ref: 'C06',
          headline: 'Meera - Contact Identity Mismatch & Entrenched Incumbent Handling',
          owner_or_rep: 'Meera (Call Rep)',
          urgency: 'medium',
          key_finding: 'Meera misidentified the contact name ("Mr Nikhil" instead of Ravi) due to stale lead data; then tried to overcome a complete bank lock-in without finding a wedge.',
          action_required: 'Implement lead verification before calling; coach on recognizing entrenched tier-1 bank relationships and qualifying out early.',
          evidence_citation: 'Call passage: "Good evening, Mr Nikhil. Good evening. Ravi here... We already have that set up through our existing bank."'
        },
        {
          record_ref: 'C08',
          headline: 'Meera - Exemplary Referral Extraction from Non-Buyer Executive',
          owner_or_rep: 'Meera (Call Rep)',
          urgency: 'low',
          key_finding: 'When executive Raghav clarified he does not handle expense ops, Meera smoothly secured direct email contact for the Head of Accounts.',
          action_required: 'Highlight this call snippet in weekly SDR standup as best practice for navigating executive gatekeepers.',
          evidence_citation: 'Call passage: "You should speak to our head of accounts... He handles vendor payments and invoice approvals."'
        }
      ]
    },
    {
      title: '5. Intake & Unrecorded Activity Audit',
      badge: 'Data Integrity',
      summary: 'Status of the 26 interactions without usable conversation text.',
      items: [
        {
          record_ref: 'C11-C30',
          headline: '20 Telephony Records Withheld / Unsupplied Text',
          owner_or_rep: 'Telephony Logging Engine',
          urgency: 'low',
          key_finding: 'Calls recorded duration and telephony outcome (busy, voicemail, connected), but transcripts were withheld in assessment data. No substantive claims or deal values invented.',
          action_required: 'Maintain in intake audit status; verify reps log CRM call dispositions.',
          evidence_citation: 'Dictionary: "Background calls have null text... stored outcome is upstream processing state, not independent ground truth."'
        },
        {
          record_ref: 'M05, M08, M11',
          headline: '3 Recorded Meetings with No Human Speech (Silent Rooms)',
          owner_or_rep: 'Calendar Meeting Bot',
          urgency: 'low',
          key_finding: 'Bots joined calendar meetings but recorded zero spoken turns (`unavailable_reason: "The meeting was recorded but nobody spoke."`).',
          action_required: 'Audit whether participants rescheduled outside Google Meet/Zoom without updating calendar invites.',
          evidence_citation: 'Payload: turns = [], unavailable_reason = "The meeting was recorded but nobody spoke."'
        },
        {
          record_ref: 'M12, M14',
          headline: '2 Calendar Meetings with Bot Cancelled Before Start',
          owner_or_rep: 'Calendar Meeting Bot',
          urgency: 'low',
          key_finding: 'Notetakers were cancelled prior to scheduled start. Dictionary explicitly notes: bot cancellation does not prove meeting did not happen.',
          action_required: 'Check with organisers (team12) whether client demos occurred offline.',
          evidence_citation: 'Payload: recording_status = "cancelled", recording_detail = "The notetaker was cancelled before the meeting started."'
        }
      ]
    }
  ]
};
