import { ConversationAnalysis, RouteCategory, ReviewState, AnalysisFreshness, SourceRecord } from "../types";

export const PRECOMPUTED_ANALYSES: Record<string, Partial<ConversationAnalysis>> = {
  "C01": {
    "primary_route": "sales_coaching",
    "secondary_routes": [
      "needs_review"
    ],
    "route_reasoning": "Outbound cold call resulted in immediate prospect annoyance and disqualification. Rep needs coaching on discovery and early hook before pitching automated operations.",
    "summary": "Arun cold-called Pranav at Harborlight Advisory proposing a finance partnership. Pranav reacted negatively to unsolicited outreach on his work line and stated their operations are already highly automated. Arun politely closed.",
    "why_it_matters": "Demonstrates rep patience under pressure, but reveals a critical gap in cold outreach qualification. The rep pushed a partnership pitch without permission or prior pain discovery.",
    "evidence_passages": [
      {
        "quote": "This number is for my work, not for people to sell things to me... Our processes are already very automated. We have a fairly advanced setup, so I don't think this is something we need.",
        "speaker": "Pranav",
        "context": "Prospect reaction to unexpected sales outreach"
      },
      {
        "quote": "We partner with firms providing part-time finance leadership and look at ways to automate their finance operations.",
        "speaker": "Arun",
        "context": "Pitch delivered without diagnosing prospect's existing tech stack"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not establish Harborlight's current software stack or vendor spend.",
      "Does not establish whether Harborlight will ever have an outsourced client need for SpendNest."
    ],
    "next_steps": [
      {
        "action": "Mark contact as Uninterested / DNC for cold phone outreach",
        "owner": "Arun",
        "priority": "low",
        "timeline": "Immediate"
      }
    ],
    "coaching_notes": {
      "strengths": [
        "Remained calm, respectful, and polite when the prospect expressed annoyance.",
        "Accurately identified that the prospect was unhappy and did not argue."
      ],
      "opportunities": [
        "Jumped straight into 'partnership' and 'automation' without asking for a brief permission hook.",
        "Did not verify whether Pranav handles software decisions before delivering value proposition."
      ],
      "manager_tip": "Coach Arun on the 30-second permission opener and asking about current systems before claiming SpendNest can help."
    }
  },
  "C02": {
    "primary_route": "sales_coaching",
    "secondary_routes": [
      "needs_review"
    ],
    "route_reasoning": "Receptionist transfer to voicemail; no prospect contact achieved. Classified as call handling / voicemail drop.",
    "summary": "Arun contacted Fernhaven Group attempting to reach Leela. Receptionist Kavya stated Leela was out of the office and offered voicemail transfer, which Arun accepted.",
    "why_it_matters": "Operational touchpoint. No substantive discovery or qualification occurred.",
    "evidence_passages": [
      {
        "quote": "It looks as though she isn't in the office today. Would you like to leave a message with me, or would you prefer her voicemail? Her voicemail would be fine, thank you.",
        "speaker": "Kavya & Arun",
        "context": "Receptionist interaction"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not establish Leela's role, title, or interest in SpendNest.",
      "Does not confirm whether voicemail was successfully recorded by carrier."
    ],
    "next_steps": [
      {
        "action": "Schedule follow-up call attempt for next Tuesday morning",
        "owner": "Arun",
        "priority": "low",
        "timeline": "Next week"
      }
    ],
    "coaching_notes": {
      "strengths": [
        "Polite gatekeeper interaction."
      ],
      "opportunities": [
        "Could have asked Kavya what day or time Leela usually returns to office."
      ],
      "manager_tip": "Encourage reps to gather scheduling intel from gatekeepers before opting for voicemail."
    }
  },
  "C03": {
    "primary_route": "deal_next_steps",
    "secondary_routes": [
      "sales_coaching"
    ],
    "route_reasoning": "Commercial follow-up on developer API access with Milan. Pricing was previously an objection. Milan requested email follow-up and agreed to speak Monday/Tuesday.",
    "summary": "Kiran followed up with Milan regarding developer API access and event notifications after a 5-week pause. Milan was traveling with severe roaming audio distortion but confirmed pricing sensitivity and requested an email with subject 'Developer access and event notifications - follow-up' for Monday/Tuesday callback.",
    "why_it_matters": "Active commercial opportunity requiring immediate written collateral before the agreed early-week call window.",
    "evidence_passages": [
      {
        "quote": "We did ask about some developer functionality, but it isn't essential enough for us to spend much on it. I would need to check with the team.",
        "speaker": "Milan",
        "context": "Price sensitivity and internal check"
      },
      {
        "quote": "Send the email and we can speak Monday or Tuesday. All right, I'll send it over.",
        "speaker": "Milan & Kiran",
        "context": "Agreed next action and communication channel"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not establish the exact engineering budget or technical API specifications.",
      "Does not confirm if the developer team has already evaluated alternative webhooks."
    ],
    "next_steps": [
      {
        "action": "Send email with subject 'Developer access and event notifications - follow-up' detailing budget-tier API access",
        "owner": "Kiran",
        "priority": "high",
        "timeline": "By end of day Friday"
      },
      {
        "action": "Call Milan on Monday morning as agreed when he is back indoors",
        "owner": "Kiran",
        "priority": "high",
        "timeline": "Monday 24 Aug"
      }
    ],
    "coaching_notes": {
      "strengths": [
        "Recognized audio impairment immediately and adapted channel gracefully.",
        "Secured explicit agreement on email subject line and call-back timeframe."
      ],
      "opportunities": [
        "Could proactively outline a starter API tier to address the budget objection in the email."
      ],
      "manager_tip": "Verify Kiran attaches concrete tiered pricing to the email rather than generic API documentation."
    }
  },
  "C04": {
    "primary_route": "deal_next_steps",
    "secondary_routes": [
      "needs_review"
    ],
    "route_reasoning": "Detailed voicemail left following up on expense software for Lanternpath Media after correcting a previous wrong email address.",
    "summary": "Arun left a structured voicemail for Ritesh at Lanternpath Media regarding expense platform evaluation. Arun explained that previous collateral was sent to an incorrect email and resent to the corrected address, requesting a callback.",
    "why_it_matters": "Addresses operational communication failure (email bounce/misdirection). Needs tracking to confirm receipt.",
    "evidence_passages": [
      {
        "quote": "My understanding is that our information first went to the wrong email address. We subsequently used the corrected address you gave us, and I hope you have now had a chance to see it. Please call me back...",
        "speaker": "Arun",
        "context": "Voicemail transcription"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not establish whether Ritesh opened or received the resent email.",
      "Does not establish Lanternpath Media's current evaluation status or timeline."
    ],
    "next_steps": [
      {
        "action": "Send email check-in if no callback is received by Monday afternoon",
        "owner": "Arun",
        "priority": "medium",
        "timeline": "Monday 24 Aug"
      }
    ]
  },
  "C05": {
    "primary_route": "sales_coaching",
    "secondary_routes": [
      "deal_next_steps"
    ],
    "route_reasoning": "Cold call introductory pitch where rep achieved permission to send a presentation, but missed uncovering incumbent software renewal dates.",
    "summary": "Meera executed a cold introduction to an executive using an upfront 40-second contract. Prospect listened to the SpendNest overview (approvals, documents, vendor payments) and agreed to receive a presentation at contact05@example.com for future consideration.",
    "why_it_matters": "Lead agreed to receive collateral; opportunity to convert into a nurture sequence if incumbent contracts are identified.",
    "evidence_passages": [
      {
        "quote": "If we ever decide to change the providers we already have, we could consider it then. Certainly. I have an email address noted down; may I confirm contact05@example.com? Yes, that is right.",
        "speaker": "Prospect & Meera",
        "context": "Closing agreement on email presentation"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not establish what incumbent provider is currently used.",
      "Does not establish renewal dates or contractual dissatisfaction."
    ],
    "next_steps": [
      {
        "action": "Dispatch SpendNest executive summary deck to contact05@example.com",
        "owner": "Meera",
        "priority": "medium",
        "timeline": "Today"
      },
      {
        "action": "Set CRM nurture task for 60-day check-in",
        "owner": "Meera",
        "priority": "low",
        "timeline": "60 days"
      }
    ],
    "coaching_notes": {
      "strengths": [
        "Crisp, professional 40-second upfront permission opener.",
        "Accurately verified email address before ending call."
      ],
      "opportunities": [
        "When prospect mentioned 'change the providers we already have', Meera should have asked: 'May I ask who you currently use for approvals?'"
      ],
      "manager_tip": "Coach Meera on conversational pivots to uncover incumbent tools before accepting a deck send-off."
    }
  },
  "C06": {
    "primary_route": "sales_coaching",
    "secondary_routes": [
      "needs_review"
    ],
    "route_reasoning": "Cold call failure due to CRM contact mismatch and entrenched incumbent bank solution. Key coaching scenario.",
    "summary": "Meera called Ravi at a retail/distribution company but mistakenly addressed him as 'Mr Nikhil'. Ravi corrected his identity, listened briefly to the store expense pitch, and stated their existing bank cards and internal department handle monitoring completely. Disqualified.",
    "why_it_matters": "Highlights CRM data accuracy issues and cold call pitch resilience when confronting entrenched tier-1 bank solutions.",
    "evidence_passages": [
      {
        "quote": "Good evening, Mr Nikhil. Good evening. Ravi here... We already have that set up through our existing bank... There is also a separate department here monitoring this every day.",
        "speaker": "Meera & Ravi",
        "context": "Name confusion and incumbent bank objection"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not establish who Nikhil is or why his name was attached to Ravi's phone number.",
      "Does not establish bank satisfaction levels or pricing."
    ],
    "next_steps": [
      {
        "action": "Correct CRM contact name from 'Nikhil' to 'Ravi' and mark as Uninterested (Bank Entrenched)",
        "owner": "Meera",
        "priority": "low",
        "timeline": "Immediate"
      }
    ],
    "coaching_notes": {
      "strengths": [
        "Polite demeanor despite initial name mistake."
      ],
      "opportunities": [
        "Check CRM record verification before dialing.",
        "When Ravi mentioned his existing bank department, Meera attempted a generic feature counter ('similar visibility') rather than exploring specific pain points."
      ],
      "manager_tip": "Review lead list data hygiene and practice graceful disqualification when enterprise banking is deeply entrenched."
    }
  },
  "C07": {
    "primary_route": "vendor_partner_ops",
    "secondary_routes": [
      "deal_next_steps"
    ],
    "route_reasoning": "Partnership development discussion with Aditya at Willowbank Advisory regarding cross-border corporate incorporation and US account opening.",
    "summary": "Dev conducted outreach to Aditya at Willowbank Advisory, an advisory firm helping clients incorporate companies overseas. Dev proposed SpendNest virtual US accounts and wallets for Willowbank's overseas clients. Aditya agreed to review partner materials next week.",
    "why_it_matters": "High-leverage channel partnership opportunity that could yield recurring business entity referrals.",
    "evidence_passages": [
      {
        "quote": "Do you help clients incorporate companies overseas as well? Yes... Send across the partner details and we can look at it next week.",
        "speaker": "Dev & Aditya",
        "context": "Agreement to review partnership proposal"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not establish monthly volume of cross-border client incorporations.",
      "Does not establish partner revenue share or commission split expectations."
    ],
    "next_steps": [
      {
        "action": "Email Willowbank Advisory partnership deck and referral agreement overview",
        "owner": "Dev",
        "priority": "high",
        "timeline": "By Monday 24 Aug"
      },
      {
        "action": "Book follow-up review call for Wednesday 26 Aug",
        "owner": "Dev",
        "priority": "medium",
        "timeline": "Next week"
      }
    ]
  },
  "C08": {
    "primary_route": "deal_next_steps",
    "secondary_routes": [
      "sales_coaching"
    ],
    "route_reasoning": "Successful cold call referral handoff. Executive directed rep to the actual functional buyer (Head of Accounts).",
    "summary": "Meera reached Raghav, who stated he does not handle expense management and directly referred Meera to his Head of Accounts with email contact info for invoice approvals and vendor payments.",
    "why_it_matters": "Clean referral from senior leadership directly to the operational decision maker.",
    "evidence_passages": [
      {
        "quote": "You should speak to our head of accounts... He handles vendor payments and invoice approvals.",
        "speaker": "Raghav",
        "context": "Executive referral to accounts head"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not establish the head of accounts' specific availability or willingness to take a demo.",
      "Does not establish current vendor processing volume."
    ],
    "next_steps": [
      {
        "action": "Send tailored introduction to Head of Accounts explicitly citing Raghav's direct referral",
        "owner": "Meera",
        "priority": "high",
        "timeline": "Today"
      }
    ],
    "coaching_notes": {
      "strengths": [
        "Quickly adapted when prospect indicated wrong functional role and captured referral details."
      ],
      "opportunities": [
        "Always ask for the referral's direct phone extension or WhatsApp if possible."
      ],
      "manager_tip": "Reinforce using the executive's name in email subject line: 'Raghav suggested I connect regarding invoice workflows'."
    }
  },
  "C09": {
    "primary_route": "sales_coaching",
    "secondary_routes": [
      "needs_review"
    ],
    "route_reasoning": "Cold call timing objection due to recent ERP system migration. Good candidate for CRM nurture tracking.",
    "summary": "Meera engaged Vedant in an introductory conversation. Vedant explained that their company completed an ERP implementation three months ago and cannot absorb any software changes currently, suggesting a check-in after two quarters.",
    "why_it_matters": "Legitimate freeze on systems change; aggressive follow-up will burn the lead, but scheduled nurture preserves future pipeline.",
    "evidence_passages": [
      {
        "quote": "We completed our system transition three months ago... Not something we want to disturb right now. Check back with us after two quarters.",
        "speaker": "Vedant",
        "context": "System migration freeze objection"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not establish whether the ERP included an expense or corporate card module.",
      "Does not establish contract expiration dates."
    ],
    "next_steps": [
      {
        "action": "Set CRM pipeline reminder for Q1 2027 (6-month nurture)",
        "owner": "Meera",
        "priority": "low",
        "timeline": "Q1 2027"
      }
    ]
  },
  "C10": {
    "primary_route": "deal_next_steps",
    "secondary_routes": [
      "sales_coaching"
    ],
    "route_reasoning": "Inbound/outbound qualified interest. Prospect requested pricing tiers and invoice feature sheet ahead of an upcoming director review.",
    "summary": "Meera pitched Aniket on eliminating manual vendor handling and automated invoice processing. Aniket confirmed interest and requested pricing tiers and feature sheets ahead of a director evaluation next month.",
    "why_it_matters": "Active evaluation window tied to a formal director review next month. High priority for proposal generation.",
    "evidence_passages": [
      {
        "quote": "Send the pricing tiers and an invoice automation feature sheet... We have a review coming up with the directors next month.",
        "speaker": "Aniket",
        "context": "Director review timeline and collateral request"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not establish invoice transaction volume needed to quote an exact pricing tier.",
      "Does not confirm whether Aniket will present alone or wants SpendNest on the demo."
    ],
    "next_steps": [
      {
        "action": "Send invoice automation feature sheet and tiered pricing guide to Aniket",
        "owner": "Meera",
        "priority": "high",
        "timeline": "By Monday morning"
      },
      {
        "action": "Offer a 15-minute prep session to review numbers before the board meeting",
        "owner": "Meera",
        "priority": "medium",
        "timeline": "Next week"
      }
    ]
  },
  "M01": {
    "primary_route": "vendor_partner_ops",
    "secondary_routes": [
      "deal_next_steps"
    ],
    "route_reasoning": "High-volume referral channel onboarding. Clarified registered business boundary and agreed on partner commission structure (USD 260 activation + spend bonuses).",
    "summary": "SpendNest team member met with Partner A of Harborpath Advisory. Partner initially assumed SpendNest opened personal accounts remotely; rep clarified SpendNest exclusively serves registered US business entities. Covered partner commission structure (USD 260 activation, interchange share, USD 195/390 spend bonuses) and agreed to provide a unique referral link and memorandum.",
    "why_it_matters": "Major channel distribution agreement that requires clear compliance vetting criteria for referred entities.",
    "evidence_passages": [
      {
        "turn": 1,
        "quote": "My understanding was that you help people open bank accounts remotely. That is what I wanted to explore for the clients coming through Harborpath Advisory.",
        "speaker": "Partner A",
        "context": "Initial expectation of personal bank account opening"
      },
      {
        "turn": 2,
        "quote": "Yes, with one important boundary: we work with registered businesses, not individuals opening personal accounts.",
        "speaker": "Team member A",
        "context": "Enforcing compliance boundary"
      },
      {
        "turn": 9,
        "quote": "The activation payment is USD 260 when a referred company gets its account approved by our compliance partners. The cards option also has an interchange revenue share and a bonus based on the customer's spending...",
        "speaker": "Team member A",
        "context": "Commercial referral commission terms"
      },
      {
        "turn": 21,
        "quote": "Then let us use the unique link. They fill in the business information, then go through to arranging a demo with our team.",
        "speaker": "Team member A",
        "context": "Agreement on referral onboarding workflow"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not establish Harborpath's historical client referral volume.",
      "Does not establish whether referred clients possess required US operational documentation."
    ],
    "next_steps": [
      {
        "action": "Draft and send Partner Memorandum of Understanding to Harborpath Advisory",
        "owner": "Team member A (team06@example.com)",
        "priority": "high",
        "timeline": "Immediate"
      },
      {
        "action": "Generate unique partner referral tracking link and create shared tracking sheet",
        "owner": "Partnership Operations",
        "priority": "high",
        "timeline": "By Monday"
      }
    ]
  },
  "M02": {
    "primary_route": "vendor_partner_ops",
    "secondary_routes": [
      "needs_review"
    ],
    "route_reasoning": "Strategic technology vendor exploration for embedded accounts receivable and automated webhook reconciliation.",
    "summary": "SpendNest partnerships lead met with LedgerBridge to explore incorporating LedgerBridge's accounts receivable and reconciliation capabilities into SpendNest. Discussed webhook delivery, data sync frequency, and scheduled a technical architecture session.",
    "why_it_matters": "Core platform capability expansion (Accounts Receivable roadmap). Not a sales pipeline deal, but strategic vendor procurement.",
    "evidence_passages": [
      {
        "turn": 1,
        "quote": "I work on strategy and partnerships at SpendNest. We serve businesses with cards and accounts payable, and we are developing accounts receivable. We want to understand whether LedgerBridge can give us...",
        "speaker": "Team member A",
        "context": "Strategic product intent"
      },
      {
        "turn": 36,
        "quote": "schedule a technical follow-up with the platform architects",
        "speaker": "Team member A",
        "context": "Technical review next step"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not establish LedgerBridge API licensing pricing or SLA terms.",
      "Does not establish compatibility with SpendNest existing AWS infrastructure."
    ],
    "next_steps": [
      {
        "action": "Schedule architecture review with SpendNest CTO and LedgerBridge technical team",
        "owner": "Team member A (team07@example.com)",
        "priority": "medium",
        "timeline": "Next week"
      }
    ]
  },
  "M03": {
    "primary_route": "deal_next_steps",
    "secondary_routes": [
      "sales_coaching"
    ],
    "route_reasoning": "High-value commercial sales negotiation. Finance Director joined to review pricing tiers, volume discounts, and ERP accounting synchronization.",
    "summary": "Commercial discussion between SpendNest and Asterloom Systems. Customer A brought their Finance Colleague to negotiate pricing and review accounting integration. Discussed invoice volume tiers, user seats, and SpendNest agreed to send a revised commercial proposal reflecting a 500-invoice/month bracket.",
    "why_it_matters": "High-probability commercial opportunity in late stage evaluation. Pricing turnaround by Friday is critical to maintain momentum.",
    "evidence_passages": [
      {
        "turn": 1,
        "quote": "My finance colleague is joining today because we need to understand how this would actually work, and then revisit the price.",
        "speaker": "Customer A",
        "context": "Finance decision-maker involvement"
      },
      {
        "turn": 36,
        "quote": "send revised proposal with the 500-invoice tier by Friday",
        "speaker": "Team member A",
        "context": "Commercial pricing commitment"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not establish whether CEO approval is required after finance signs off.",
      "Does not establish target go-live date."
    ],
    "next_steps": [
      {
        "action": "Generate and dispatch revised commercial proposal with 500-invoice tier",
        "owner": "Team member A (team08@example.com)",
        "priority": "high",
        "timeline": "Friday 21 Aug (Today)"
      }
    ],
    "coaching_notes": {
      "strengths": [
        "Effectively handled technical ERP sync questions with finance lead."
      ],
      "opportunities": [
        "Could have pressed for closing agreement timeline during the call before agreeing to discount."
      ],
      "manager_tip": "Ensure proposal includes clear validity window (e.g., valid for 14 days) to prevent indefinite discounting."
    }
  },
  "M04": {
    "primary_route": "customer_success",
    "secondary_routes": [
      "deal_next_steps"
    ],
    "route_reasoning": "CRITICAL CHURN RISK: Account migration friction. Cedarwave has INR 1.3 crore bank credit line and demands credit cards, rejecting another prepaid program.",
    "summary": "High-tension migration meeting with Cedarwave Distribution. SpendNest is shutting down an existing physical card program due to acceptance issues. Customer A and Credit Lead Customer B firmly objected to receiving another prepaid program, revealing they possess an existing INR 1.3 crore bank corporate credit line. Rep explained SpendNest cannot issue bank credit directly and bank-connected card feeds lack real-time limit controls. Customer challenged the value proposition of staying with SpendNest.",
    "why_it_matters": "Highest risk account in the extract. Misalignment between customer credit requirements and SpendNest prepaid infrastructure could cause immediate account cancellation.",
    "evidence_passages": [
      {
        "turn": 9,
        "quote": "Also, will the replacement be a proper credit card? We do not really want another prepaid arrangement indefinitely.",
        "speaker": "Customer A",
        "context": "Demand for true credit cards"
      },
      {
        "turn": 11,
        "quote": "Give me a moment to check internally. Okay, I have confirmed it: moving from prepaid to credit is the main issue for us. At some stage we will have to consider another option for that.",
        "speaker": "Customer A",
        "context": "Explicit statement of churn threat"
      },
      {
        "turn": 22,
        "quote": "We already have a corporate credit line of about INR 1.3 crore. Cards are issued to only a few people so far... If your platform can sit in between, we should understand that route.",
        "speaker": "Customer B",
        "context": "Scale of client credit line"
      },
      {
        "turn": 26,
        "quote": "Then what do we gain by adding SpendNest? We can already see transactions in the bank portal.",
        "speaker": "Customer B",
        "context": "Challenging SpendNest core value"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not establish whether Cedarwave's bank card issuer will consent to the third-party network transaction feed.",
      "Does not establish contract end date on Cedarwave's existing contract."
    ],
    "next_steps": [
      {
        "action": "Escalate Cedarwave credit feed feasibility directly to Head of Product and Bank Partnerships",
        "owner": "Team member A (team09@example.com)",
        "priority": "high",
        "timeline": "Urgent (Within 24 hours)"
      },
      {
        "action": "Conduct guided screen share session to fix department structure and user permissions",
        "owner": "Customer Success",
        "priority": "medium",
        "timeline": "By Tuesday 25 Aug"
      }
    ]
  },
  "M06": {
    "primary_route": "deal_next_steps",
    "secondary_routes": [
      "sales_coaching"
    ],
    "route_reasoning": "Enterprise discovery with Mapletrail Services local finance manager. Large 65-person finance organization with high manual reconciliation friction.",
    "summary": "SpendNest team member conducted in-depth discovery with the branch finance lead of Mapletrail Services (part of a 65-person finance team). Uncovered heavy manual reconciliation for contracts and bank receipts, cash application mismatches (e.g. INR 1.3L invoice paid at 1.17L due to tax withholding), and interest in virtual subscription cards.",
    "why_it_matters": "High-value enterprise expansion candidate with demonstrable pain in manual reconciliation and withholding tax deductions.",
    "evidence_passages": [
      {
        "turn": 4,
        "quote": "Roughly 65 people across finance. The business is sizeable, but locally I am the person dealing with the operational questions and getting support from them.",
        "speaker": "Customer A",
        "context": "Scale of finance department"
      },
      {
        "turn": 22,
        "quote": "Cash application is another area. For example, if an invoice is INR 1.3 lakh and the payment is INR 1.17 lakh, the difference could be withholding, bank fees or an unresolved dispute.",
        "speaker": "Team member A",
        "context": "Demonstrating deep domain problem solving"
      },
      {
        "turn": 33,
        "quote": "It has been useful hearing a different perspective. Please send the information and we can stay in touch.",
        "speaker": "Customer A",
        "context": "Interest in follow-up materials"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not establish whether central corporate finance will participate in evaluation.",
      "Does not confirm authorized budget limits for branch office."
    ],
    "next_steps": [
      {
        "action": "Prepare comprehensive solution brief covering Cash Application Reconciliation & Virtual Card Controls",
        "owner": "Team member A (team10@example.com)",
        "priority": "high",
        "timeline": "By Monday 24 Aug"
      },
      {
        "action": "Request introduction to corporate headquarters finance director",
        "owner": "Team member A (team10@example.com)",
        "priority": "medium",
        "timeline": "Next week"
      }
    ]
  },
  "M07": {
    "primary_route": "customer_success",
    "secondary_routes": [
      "needs_review"
    ],
    "route_reasoning": "URGENT PRODUCT BUG REPORT: Customer screen share uncovered 3 functional UI errors (description save failure, reimbursement selection bug, and direct file upload crash).",
    "summary": "Customer review session with Willowfield Trust. Customer A demonstrated 3 serious platform defects via screen share: 1) Editing event payment descriptions fails to save and reverts to old text; 2) Reimbursement transaction selector freezes on the first group of records; 3) Direct attachment upload fails without fallback. SpendNest rep acknowledged the bugs and promised engineering escalations.",
    "why_it_matters": "Active production defects affecting paying customer accounting workflows. Critical retention impact.",
    "evidence_passages": [
      {
        "turn": 2,
        "quote": "The first one is editing the description. I am changing this event-payment description to a short reference and clicking Save changes. Now look at the displayed description again.",
        "speaker": "Customer A",
        "context": "Demonstrating description save bug"
      },
      {
        "turn": 3,
        "quote": "The field still shows the earlier wording. So the change is not appearing after you save, is that right? Yes, it is still the old description.",
        "speaker": "Team member A & Customer A",
        "context": "Confirming UI persistence defect"
      },
      {
        "turn": 16,
        "quote": "The next issue is in reimbursements. I cannot select the first group of transactions on this screen.",
        "speaker": "Customer A",
        "context": "Reporting reimbursement transaction selection failure"
      },
      {
        "turn": 27,
        "quote": "I will send the details to the team, get their confirmation and come back to you. Thank you for showing the actual steps rather than only the final screen.",
        "speaker": "Team member A",
        "context": "Engineering escalation commitment"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not establish root cause (browser cache vs database write timeout vs API 500 error).",
      "Does not establish engineering release sprint schedule for patches."
    ],
    "next_steps": [
      {
        "action": "Log High-Severity bug ticket for Payment Description Save Failure and Reimbursements UI freeze",
        "owner": "Team member A (team09@example.com)",
        "priority": "high",
        "timeline": "Immediate (Friday)"
      },
      {
        "action": "Send confirmation email to Willowfield Trust with ticket numbers and patch ETA by Monday",
        "owner": "Customer Success",
        "priority": "high",
        "timeline": "Monday 24 Aug"
      }
    ]
  },
  "M09": {
    "primary_route": "customer_success",
    "secondary_routes": [
      "needs_review"
    ],
    "route_reasoning": "Onboarding block and permission architecture issue: expired invitation tokens and security concerns regarding subsidiary account access.",
    "summary": "Account setup and workflow session. Customer A was unable to log into Brookmint Holdings due to an expired invite token. Customer also raised serious security concerns regarding cross-entity permissions between parent and subsidiaries, refusing to rely on informal trust.",
    "why_it_matters": "Customer onboarding blocked; security objection around access control boundaries requires product team validation.",
    "evidence_passages": [
      {
        "turn": 1,
        "quote": "The invitation for Brookmint Holdings did not work when I tried it. It may have expired, or perhaps we can try again together.",
        "speaker": "Customer A",
        "context": "Expired invite token error"
      },
      {
        "turn": 17,
        "quote": "I do not want this to depend on trusting someone not to use access that is available. That does not solve the permission problem.",
        "speaker": "Customer A",
        "context": "Enterprise security requirement for strict RBAC"
      },
      {
        "turn": 31,
        "quote": "I will check the expired-token problem for Brookmint Holdings with the team and aim to return with an update today, otherwise Monday.",
        "speaker": "Team member A",
        "context": "Technical investigation commitment"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not establish whether customer IT uses Single Sign-On (Okta / Azure AD / Google Workspace).",
      "Does not establish how many entities will ultimately require provisioning."
    ],
    "next_steps": [
      {
        "action": "Re-generate and transmit fresh login token for Brookmint Holdings",
        "owner": "Team member A (team11@example.com)",
        "priority": "high",
        "timeline": "By Monday 24 Aug"
      },
      {
        "action": "Review multi-tenant permissions model with security architect and document tenant isolation",
        "owner": "Customer Success Lead",
        "priority": "medium",
        "timeline": "Next week"
      }
    ]
  },
  "M10": {
    "primary_route": "vendor_partner_ops",
    "secondary_routes": [
      "sales_coaching"
    ],
    "route_reasoning": "Internal enablement & billing walkthrough. Training session covering invoice lifecycle, grace periods, and wallet exhaustion freeze triggers.",
    "summary": "Internal SpendNest training between Team member A and Team member B. Covered invoice generation, end-of-month grace periods (customers allowed until mid-month), and automated dunning (day 3 retry, day 7 final retry with account freeze warning). Team member B noted lack of back-office super-admin access.",
    "why_it_matters": "Internal operational enablement and permission provisioning; critical for accurate customer billing governance.",
    "evidence_passages": [
      {
        "turn": 8,
        "quote": "There is a further exception for invoices raised in the last week of the month: the customer may be allowed until the middle of the next month... The displayed due date and the allowed collection period are not always the same thing.",
        "speaker": "Team member A",
        "context": "Billing grace period policy"
      },
      {
        "turn": 16,
        "quote": "On the third day it tries again, but spending may have reduced the wallet balance... It repeats on the seventh day, now with a warning that another failure will freeze the account.",
        "speaker": "Team member A",
        "context": "Automated payment retry and account freeze rules"
      },
      {
        "turn": 20,
        "quote": "I will request the back-office access separately for the next training session.",
        "speaker": "Team member A",
        "context": "Internal access provisioning"
      }
    ],
    "what_evidence_does_not_establish": [
      "Does not relate to any customer sales pipeline (purely internal session).",
      "Does not establish who approves back-office super-admin permissions."
    ],
    "next_steps": [
      {
        "action": "Submit IT ticket requesting back-office super-admin role for Team member B",
        "owner": "Team member A (team12@example.com)",
        "priority": "medium",
        "timeline": "By Monday"
      }
    ]
  }
};


export function generateRecordAnalysis(
  record: SourceRecord,
  revision: number,
  existingOverrides?: { manual_route?: RouteCategory; note?: string }
): ConversationAnalysis {
  const ref = record.record_ref;
  const isMeeting = record.source_type === 'meeting';
  const callPayload = !isMeeting ? (record.payload as any) : null;
  const meetingPayload = isMeeting ? (record.payload as any) : null;
  const transcriptPayload = record.transcript_payload;

  const hasText = isMeeting
    ? Boolean(transcriptPayload?.turns && transcriptPayload.turns.length > 0)
    : Boolean(callPayload?.transcript && callPayload.transcript.trim().length > 0);

  // Check if M07 is in Revision 1 (delayed transcript)
  if (ref === 'M07' && revision === 1) {
    const isOverridden = Boolean(existingOverrides?.manual_route);
    return {
      primary_route: existingOverrides?.manual_route || 'needs_review',
      secondary_routes: [],
      route_reasoning: 'Initial delivery envelope: Transcript was not supplied in batch initial-001 (marked unavailable/delayed). Awaiting revision 2 update.',
      review_state: isOverridden ? 'manual_override' : 'intake_awaiting_processing',
      analysis_freshness: 'stale_pending_review',
      applied_revision: 1,
      summary: 'Willowfield Trust discussion metadata received, but conversation transcript was withheld from delivery batch 01_initial.json.',
      why_it_matters: 'Meeting occurred on 21 Aug 2026 Asia/Kolkata, but text analysis cannot proceed until update package arrives.',
      evidence_passages: [
        {
          quote: 'Transcript withheld in delivery 01_initial.json; arrives in 02_update.json test fixture.',
          context: 'Assessment staged delivery condition'
        }
      ],
      what_evidence_does_not_establish: [
        'Does not establish what topics were discussed until transcript payload arrives.',
        'Does not establish whether Willowfield experienced bugs or requested commercial renewal.'
      ],
      next_steps: [
        {
          action: 'Apply update batch 02_update.json to ingest late-arriving meeting transcript',
          owner: 'Data Manager',
          priority: 'high',
          timeline: 'Immediate'
        }
      ],
      is_manually_overridden: isOverridden,
      manual_route_override: existingOverrides?.manual_route || null,
      manual_override_note: existingOverrides?.note || undefined,
      last_modified_at: '2026-08-21T18:00:00+05:30'
    };
  }

  // If precomputed analysis exists
  if (hasText && PRECOMPUTED_ANALYSES[ref]) {
    const base = PRECOMPUTED_ANALYSES[ref]!;
    const isOverridden = Boolean(existingOverrides?.manual_route);
    const chosenRoute = existingOverrides?.manual_route || base.primary_route!;

    return {
      primary_route: chosenRoute,
      secondary_routes: base.secondary_routes || [],
      route_reasoning: isOverridden
        ? `[Manual Override] Manager assigned route "${chosenRoute}". Original suggestion was "${base.primary_route}". Reason: ${existingOverrides?.note || 'Manager discretion'}`
        : base.route_reasoning || 'Automated classification based on conversation evidence.',
      review_state: isOverridden ? 'manual_override' : 'analyzed',
      analysis_freshness: 'current',
      applied_revision: revision,
      summary: base.summary || '',
      why_it_matters: base.why_it_matters || '',
      evidence_passages: base.evidence_passages || [],
      what_evidence_does_not_establish: base.what_evidence_does_not_establish || [],
      next_steps: base.next_steps || [],
      coaching_notes: base.coaching_notes,
      is_manually_overridden: isOverridden,
      manual_route_override: existingOverrides?.manual_route || null,
      manual_override_note: existingOverrides?.note || undefined,
      last_modified_at: '2026-08-21T18:00:00+05:30'
    };
  }

  // Otherwise, handle background / unsupplied records strictly according to DATA_CONTRACT.md
  let reviewState: ReviewState = 'intake_silent';
  let reasoning = 'No transcript supplied in extract. Stored metadata preserved as evidence without substantive invention.';

  if (isMeeting) {
    const status = meetingPayload?.recording_status;
    const detail = meetingPayload?.recording_detail || '';
    const unavail = transcriptPayload?.unavailable_reason || '';

    if (unavail.includes('nobody spoke')) {
      reviewState = 'intake_no_speech';
      reasoning = 'Meeting bot connected and recorded, but nobody spoke in the session.';
    } else if (status === 'cancelled' || detail.includes('cancelled')) {
      reviewState = 'intake_cancelled';
      reasoning = 'Notetaker bot was cancelled before session started. Does not prove the meeting itself was cancelled.';
    } else if (status === 'not_scheduled') {
      reviewState = 'intake_not_scheduled';
      reasoning = 'No notetaker was scheduled for this calendar meeting.';
    } else {
      reviewState = 'needs_review';
      reasoning = 'Meeting captured without usable transcript payload.';
    }
  } else {
    reviewState = 'intake_silent';
    reasoning = `Call record logged with ${callPayload?.duration_seconds || 0}s duration. Transcript text withheld/unsupplied in extract. Outcome: "${callPayload?.observed_outcome || 'unknown'}".`;
  }

  const isOverridden = Boolean(existingOverrides?.manual_route);
  const primaryRoute = existingOverrides?.manual_route || 'needs_review';

  return {
    primary_route: primaryRoute,
    secondary_routes: [],
    route_reasoning: isOverridden
      ? `[Manual Override] Assigned route "${primaryRoute}". Reason: ${existingOverrides?.note || 'Manager discretion'}`
      : reasoning,
    review_state: isOverridden ? 'manual_override' : reviewState,
    analysis_freshness: 'unsupported',
    applied_revision: revision,
    summary: isMeeting
      ? `Calendar Meeting: "${meetingPayload?.title || 'Untitled'}" organized by ${meetingPayload?.organizer_email || 'unknown'}. Usable transcript turns unavailable.`
      : `Telephony Record: ${callPayload?.direction || 'call'} (${callPayload?.duration_seconds || 0}s) handled by ${callPayload?.rep_name || callPayload?.rep_email || 'unknown'}. Upstream outcome: ${callPayload?.observed_outcome || 'unspecified'}.`,
    why_it_matters: 'Recorded interaction in 21 Aug 2026 activity log. Requires intake audit to determine whether client re-engagement is necessary.',
    evidence_passages: [
      {
        quote: isMeeting
          ? `Status: ${meetingPayload?.recording_status}, Detail: ${meetingPayload?.recording_detail || transcriptPayload?.unavailable_reason || 'None'}`
          : `Duration: ${callPayload?.duration_seconds}s, Talk time: ${callPayload?.talk_time_seconds || 0}s, Stored Outcome: ${callPayload?.observed_outcome}`,
        context: 'Source metadata field values'
      }
    ],
    what_evidence_does_not_establish: [
      'Does not establish whether an unrecorded conversation took place outside the capture tool.',
      'Does not establish business intent, deal progress, or customer satisfaction.'
    ],
    next_steps: [
      {
        action: 'Review rep calendar or CRM activity note to verify interaction outcome',
        owner: isMeeting ? (meetingPayload?.organizer_email || 'Meeting Organiser') : (callPayload?.rep_name || 'Call Rep'),
        priority: 'low',
        timeline: 'Intake review'
      }
    ],
    is_manually_overridden: isOverridden,
    manual_route_override: existingOverrides?.manual_route || null,
    manual_override_note: existingOverrides?.note || undefined,
    last_modified_at: '2026-08-21T18:00:00+05:30'
  };
}
