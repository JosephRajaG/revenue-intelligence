import JSZip from 'jszip';
import { ManifestEntry, ProcessedRecord, RouteCategory } from '../types';
import { MANAGER_DAILY_BRIEF } from '../data/manager_brief_data';

export interface GeneratedExportFile {
  relativePath: string;
  content: string;
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\-\.]/g, '_').replace(/_+/g, '_');
}

export function getRouteFolder(route: RouteCategory): string {
  switch (route) {
    case 'deal_next_steps':
      return 'deal_next_steps';
    case 'sales_coaching':
      return 'sales_coaching';
    case 'customer_success':
      return 'customer_success';
    case 'vendor_partner_ops':
      return 'vendor_partner_ops';
    case 'needs_review':
    default:
      return 'intake_and_exceptions';
  }
}

export function buildExportManifestAndFiles(records: Record<string, ProcessedRecord>): {
  manifestEntries: ManifestEntry[];
  files: GeneratedExportFile[];
} {
  const manifestEntries: ManifestEntry[] = [];
  const files: GeneratedExportFile[] = [];

  // 1. Generate Daily Manager Brief file
  let briefMd = `# SpendNest Revenue Intelligence Manager Brief\n`;
  briefMd += `**Date:** ${MANAGER_DAILY_BRIEF.date} (${MANAGER_DAILY_BRIEF.time_zone})\n`;
  briefMd += `**Headline:** ${MANAGER_DAILY_BRIEF.executive_headline}\n\n`;
  briefMd += `**Coverage Summary:** ${MANAGER_DAILY_BRIEF.coverage_summary}\n\n---\n\n`;

  for (const sec of MANAGER_DAILY_BRIEF.sections) {
    briefMd += `## ${sec.title} [${sec.badge || ''}]\n`;
    briefMd += `${sec.summary}\n\n`;
    for (const it of sec.items) {
      briefMd += `### [${it.record_ref}] ${it.headline}\n`;
      briefMd += `- **Owner / Rep:** ${it.owner_or_rep}\n`;
      briefMd += `- **Urgency:** ${it.urgency.toUpperCase()}\n`;
      briefMd += `- **Key Finding:** ${it.key_finding}\n`;
      briefMd += `- **Required Action:** ${it.action_required}\n`;
      briefMd += `- **Evidence Citation:** ${it.evidence_citation}\n\n`;
    }
  }

  files.push({
    relativePath: 'daily_brief/2026-08-21_manager_brief.md',
    content: briefMd
  });

  // 2. Generate structured markdown output files for all 44 records
  const sortedRecords = Object.values(records).sort((a, b) => a.record_ref.localeCompare(b.record_ref));

  for (const r of sortedRecords) {
    const isMeeting = r.source_type === 'meeting';
    const cPayload = !isMeeting ? (r.payload as any) : null;
    const mPayload = isMeeting ? (r.payload as any) : null;
    const repOrOrg = isMeeting
      ? mPayload?.organizer_email || 'unknown_org'
      : cPayload?.rep_name || cPayload?.rep_email || 'unknown_rep';
    const titleOrContact = isMeeting
      ? mPayload?.title || 'Meeting'
      : `Call with ${cPayload?.to_number || 'Prospect'}`;

    const outputPaths: string[] = [];
    const primaryFolder = getRouteFolder(r.analysis.primary_route);
    const safeRef = sanitizeFileName(r.record_ref);
    const safeTitle = sanitizeFileName(titleOrContact).slice(0, 30);

    const primaryFileName = `${safeRef}_${safeTitle}.md`;
    const primaryRelPath = `${primaryFolder}/${primaryFileName}`;
    outputPaths.push(primaryRelPath);

    // If multi-routed, generate secondary cross-referenced output file
    const secondaryRelPaths: string[] = [];
    if (r.analysis.secondary_routes && r.analysis.secondary_routes.length > 0) {
      for (const secRoute of r.analysis.secondary_routes) {
        const secFolder = getRouteFolder(secRoute);
        const secFileName = `${safeRef}_${safeTitle}_${secRoute}.md`;
        const secRelPath = `${secFolder}/${secFileName}`;
        outputPaths.push(secRelPath);
        secondaryRelPaths.push(secRelPath);
      }
    }

    // Build primary markdown content
    let md = `# [${r.record_ref}] ${titleOrContact}\n\n`;
    md += `| Field | Value |\n|---|---|\n`;
    md += `| **Source Identity** | \`(${r.source_type}, "${r.source_id}")\` |\n`;
    md += `| **Applied Revision** | Rev ${r.revision} (Batch: ${r.batch_id}) |\n`;
    md += `| **Primary Route** | **${r.analysis.primary_route}** |\n`;
    md += `| **Secondary Routes** | ${r.analysis.secondary_routes?.join(', ') || 'None'} |\n`;
    md += `| **Review State** | \`${r.analysis.review_state}\` |\n`;
    md += `| **Manual Override** | ${r.analysis.is_manually_overridden ? 'YES (Preserved by manager)' : 'No (Automated)'} |\n`;
    md += `| **Rep / Organiser** | ${repOrOrg} (${isMeeting ? 'Meeting Organiser' : 'Call Rep'}) |\n`;
    md += `| **Date** | 2026-08-21 (Asia/Kolkata) |\n\n`;

    if (secondaryRelPaths.length > 0) {
      md += `> [!NOTE]\n> **Context Preservation:** This conversation was multi-routed. Sister output documents generated in:  \n`;
      for (const sPath of secondaryRelPaths) {
        md += `> - \`${sPath}\`\n`;
      }
      md += `\n`;
    }

    md += `## 1. What Happened & Why It Matters\n`;
    md += `**Summary:** ${r.analysis.summary}\n\n`;
    md += `**Why It Matters:** ${r.analysis.why_it_matters}\n\n`;

    md += `## 2. Supporting Evidence & Verifiable Citations\n`;
    if (r.analysis.evidence_passages && r.analysis.evidence_passages.length > 0) {
      for (const ev of r.analysis.evidence_passages) {
        const citationHeader = ev.turn ? `Turn ${ev.turn}` : 'Direct Quote';
        md += `- **${citationHeader}** (${ev.speaker || 'Speaker'}): "${ev.quote}"\n`;
        if (ev.context) md += `  *Context:* ${ev.context}\n`;
      }
    } else {
      md += `*No transcript supplied in extract. Stored metadata preserved as evidence.*\n`;
    }
    md += `\n`;

    md += `## 3. What the Evidence Does NOT Establish\n`;
    if (r.analysis.what_evidence_does_not_establish && r.analysis.what_evidence_does_not_establish.length > 0) {
      for (const noEv of r.analysis.what_evidence_does_not_establish) {
        md += `- ${noEv}\n`;
      }
    } else {
      md += `- Missing conversation text prevents verifying commercial claims or customer satisfaction.\n`;
    }
    md += `\n`;

    md += `## 4. Next Steps & Owners\n`;
    if (r.analysis.next_steps && r.analysis.next_steps.length > 0) {
      for (const ns of r.analysis.next_steps) {
        md += `- [ ] **${ns.action}**\n`;
        md += `  - **Owner:** ${ns.owner || 'Unassigned'}\n`;
        md += `  - **Priority:** ${ns.priority.toUpperCase()} | **Timeline:** ${ns.timeline || 'Immediate'}\n`;
      }
    } else {
      md += `*No immediate action assigned.*\n`;
    }
    md += `\n`;

    if (r.analysis.coaching_notes) {
      md += `## 5. Sales Coaching Feedback\n`;
      md += `**Strengths:**\n`;
      for (const s of r.analysis.coaching_notes.strengths) md += `- ${s}\n`;
      md += `**Development Opportunities:**\n`;
      for (const o of r.analysis.coaching_notes.opportunities) md += `- ${o}\n`;
      md += `**Manager Tip:** ${r.analysis.coaching_notes.manager_tip}\n\n`;
    }

    files.push({
      relativePath: primaryRelPath,
      content: md
    });

    // If secondary output files exist, write them with sister references
    for (let i = 0; i < secondaryRelPaths.length; i++) {
      const secRelPath = secondaryRelPaths[i];
      const secRoute = r.analysis.secondary_routes[i];
      let secMd = `# [${r.record_ref}] ${titleOrContact} (${secRoute})\n\n`;
      secMd += `> [!IMPORTANT]\n> Secondary routed view. Primary output document: \`${primaryRelPath}\`\n\n`;
      secMd += `**Assigned Route:** \`${secRoute}\`\n`;
      secMd += `**Source Record:** \`(${r.source_type}, "${r.source_id}")\`\n\n`;
      secMd += `## Focused Analysis for Route: ${secRoute}\n`;
      secMd += `${r.analysis.why_it_matters}\n\n`;
      secMd += `### Relevant Actions\n`;
      for (const ns of r.analysis.next_steps) {
        secMd += `- [ ] **${ns.action}** (Owner: ${ns.owner || 'Unassigned'})\n`;
      }
      files.push({
        relativePath: secRelPath,
        content: secMd
      });
    }

    manifestEntries.push({
      source_type: r.source_type,
      source_id: r.source_id,
      record_ref: r.record_ref,
      applied_revision: r.revision,
      primary_route: r.analysis.primary_route,
      secondary_routes: r.analysis.secondary_routes || [],
      output_paths: outputPaths,
      review_state: r.analysis.review_state,
      is_manually_overridden: r.analysis.is_manually_overridden,
      analysis_freshness: r.analysis.analysis_freshness,
      rep_or_organizer: repOrOrg,
      date: '2026-08-21',
      title_or_contact: titleOrContact
    });
  }

  // 3. Generate JSON Manifest file
  const manifestJsonContent = JSON.stringify(
    {
      manifest_version: '1.0',
      exported_at: new Date().toISOString(),
      date_scope: '2026-08-21',
      time_zone: 'Asia/Kolkata (IST)',
      total_records: manifestEntries.length,
      records: manifestEntries
    },
    null,
    2
  );

  files.push({
    relativePath: 'manifest.json',
    content: manifestJsonContent
  });

  // 4. Generate CSV Manifest file
  let manifestCsv = `record_ref,source_type,source_id,applied_revision,primary_route,secondary_routes,output_paths,review_state,is_manually_overridden,analysis_freshness,rep_or_organizer,date,title_or_contact\n`;

  for (const m of manifestEntries) {
    const secStr = `"${m.secondary_routes.join(';')}"`;
    const pathsStr = `"${m.output_paths.join(';')}"`;
    const titleEsc = `"${m.title_or_contact.replace(/"/g, '""')}"`;
    manifestCsv += `${m.record_ref},${m.source_type},${m.source_id},${m.applied_revision},${m.primary_route},${secStr},${pathsStr},${m.review_state},${m.is_manually_overridden},${m.analysis_freshness},${m.rep_or_organizer},${m.date},${titleEsc}\n`;
  }

  files.push({
    relativePath: 'manifest.csv',
    content: manifestCsv
  });

  return { manifestEntries, files };
}

/**
 * Generates and triggers client-side ZIP download of entire export package
 */
export async function downloadExportZip(records: Record<string, ProcessedRecord>): Promise<void> {
  const { files } = buildExportManifestAndFiles(records);
  const zip = new JSZip();

  for (const f of files) {
    zip.file(f.relativePath, f.content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `spendnest_revenue_intelligence_export_${new Date().toISOString().slice(0, 10)}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
