# [M09] Account setup and workflow discussion

| Field | Value |
|---|---|
| **Source Identity** | `(meeting, "4b5b9192-f3fc-505a-8e77-4d2ffaa54594")` |
| **Applied Revision** | Rev 1 (Batch: initial-001) |
| **Primary Route** | **customer_success** |
| **Secondary Routes** | needs_review |
| **Review State** | `analyzed` |
| **Rep / Organiser** | team11@example.com (Meeting Organiser) |
| **Date** | 2026-08-21 (Asia/Kolkata) |

> [!NOTE]
> **Context Preservation:** This conversation was multi-routed. Sister output documents generated in:
> - `intake_and_exceptions/M09_Account_setup_and_workflow_dis_needs_review.md`

## 1. What Happened & Why It Matters
**Summary:** Account setup and workflow session. Customer A was unable to log into Brookmint Holdings due to an expired invite token. Customer also raised serious security concerns regarding cross-entity permissions between parent and subsidiaries, refusing to rely on informal trust.

**Why It Matters:** Customer onboarding blocked; security objection around access control boundaries requires product team validation.

## 2. Supporting Evidence & Verifiable Citations
- **Turn 1** (Customer A): "The invitation for Brookmint Holdings did not work when I tried it. It may have expired, or perhaps we can try again together."
  *Context:* Expired invite token error
- **Turn 17** (Customer A): "I do not want this to depend on trusting someone not to use access that is available. That does not solve the permission problem."
  *Context:* Enterprise security requirement for strict RBAC
- **Turn 31** (Team member A): "I will check the expired-token problem for Brookmint Holdings with the team and aim to return with an update today, otherwise Monday."
  *Context:* Technical investigation commitment

## 3. What the Evidence Does NOT Establish
- Does not establish whether customer IT uses Single Sign-On (Okta / Azure AD / Google Workspace).
- Does not establish how many entities will ultimately require provisioning.

## 4. Next Steps & Owners
- [ ] **Re-generate and transmit fresh login token for Brookmint Holdings** (Owner: Team member A (team11@example.com) | Priority: high)
- [ ] **Review multi-tenant permissions model with security architect and document tenant isolation** (Owner: Customer Success Lead | Priority: medium)

