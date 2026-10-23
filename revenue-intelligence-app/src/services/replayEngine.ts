import {
  DeliveryEnvelope,
  ProcessedRecord,
  RouteCategory,
  SourceRecord,
  SourceType
} from '../types';
import { generateRecordAnalysis } from '../data/precomputed_analyses';
import initialBatchRaw from '../data/initial_records.json';
import updateBatchRaw from '../data/update_records.json';

const initialBatch = initialBatchRaw as DeliveryEnvelope;
const updateBatch = updateBatchRaw as DeliveryEnvelope;

export interface ManualOverrideEntry {
  source_type: SourceType;
  source_id: string;
  record_ref: string;
  route: RouteCategory;
  note?: string;
  overridden_at: string;
}

export interface ReplayState {
  records: Record<string, ProcessedRecord>; // Key is `${source_type}:${source_id}`
  applied_revisions: Record<string, number>; // Key is `${source_type}:${source_id}`
  manual_overrides: Record<string, ManualOverrideEntry>;
  last_action: string;
  action_log: string[];
  current_max_revision: number;
}

const STORAGE_KEY = 'revenue_intelligence_inbox_state_v1';

export function makeRecordKey(source_type: SourceType, source_id: string): string {
  return `${source_type}:${source_id}`;
}

export function getInitialDefaultState(): ReplayState {
  // Load post-update state by default (Revision 2 with M07 updated)
  // as per agreement: opens in final post-update state ready to inspect.
  const records: Record<string, ProcessedRecord> = {};
  const applied_revisions: Record<string, number> = {};

  // 1. Process initial batch
  for (const record of initialBatch.records) {
    const key = makeRecordKey(record.source_type, record.source_id);
    applied_revisions[key] = initialBatch.revision;
    const analysis = generateRecordAnalysis(record, initialBatch.revision);
    records[key] = {
      ...record,
      batch_id: initialBatch.batch_id,
      revision: initialBatch.revision,
      analysis
    };
  }

  // 2. Process update batch
  for (const record of updateBatch.records) {
    const key = makeRecordKey(record.source_type, record.source_id);
    applied_revisions[key] = updateBatch.revision;
    const analysis = generateRecordAnalysis(record, updateBatch.revision);
    records[key] = {
      ...record,
      batch_id: updateBatch.batch_id,
      revision: updateBatch.revision,
      analysis
    };
  }

  return {
    records,
    applied_revisions,
    manual_overrides: {},
    last_action: 'Initialized with Final Post-Update Dataset (Revision 2, 44 records, 18 transcripts)',
    action_log: [
      `[2026-08-21 09:00:00] Ingested initial batch "${initialBatch.batch_id}" (Rev 1, 44 records).`,
      `[2026-08-21 09:15:00] Applied late update batch "${updateBatch.batch_id}" (Rev 2, M07 late transcript applied).`
    ],
    current_max_revision: 2
  };
}

export function loadStoredState(): ReplayState {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      const def = getInitialDefaultState();
      saveState(def);
      return def;
    }
    return JSON.parse(serialized);
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return getInitialDefaultState();
  }
}

export function saveState(state: ReplayState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function clearState(): ReplayState {
  localStorage.removeItem(STORAGE_KEY);
  const def = getInitialDefaultState();
  saveState(def);
  return def;
}

/**
 * Reset workspace to completely EMPTY (0 records)
 * Allows testing clean import from scratch.
 */
export function resetToEmptyWorkspace(): ReplayState {
  const newState: ReplayState = {
    records: {},
    applied_revisions: {},
    manual_overrides: {},
    last_action: 'Workspace cleared to 0 records (Clean Slate)',
    action_log: ['[Reset] Cleared all records and overrides. Workspace is ready for fresh batch import.'],
    current_max_revision: 0
  };
  saveState(newState);
  return newState;
}

/**
 * Reset explicitly to Initial Batch only (Revision 1)
 * Used to demonstrate the replay steps from the start.
 */
export function resetToInitialBatchOnly(existingOverrides: Record<string, ManualOverrideEntry> = {}): ReplayState {
  const records: Record<string, ProcessedRecord> = {};
  const applied_revisions: Record<string, number> = {};

  for (const record of initialBatch.records) {
    const key = makeRecordKey(record.source_type, record.source_id);
    applied_revisions[key] = initialBatch.revision;
    const override = existingOverrides[key];
    const analysis = generateRecordAnalysis(
      record,
      initialBatch.revision,
      override ? { manual_route: override.route, note: override.note } : undefined
    );

    records[key] = {
      ...record,
      batch_id: initialBatch.batch_id,
      revision: initialBatch.revision,
      analysis
    };
  }

  const newState: ReplayState = {
    records,
    applied_revisions,
    manual_overrides: existingOverrides,
    last_action: 'Reset to Initial Delivery (Revision 1, 44 records, 17 transcripts)',
    action_log: [
      `[Reset] Loaded initial batch "${initialBatch.batch_id}" (Revision 1). 44 source records present, 17 with transcripts. M07 transcript pending.`
    ],
    current_max_revision: 1
  };

  saveState(newState);
  return newState;
}

/**
 * Apply a delivery envelope following DATA_CONTRACT.md rules:
 * - (source_type, source_id) is record identity
 * - Higher revision replaces entire source record payload
 * - Same or older revision is IGNORED (no duplicates, no inflation)
 * - Manual route overrides are PRESERVED
 */
export function applyDeliveryEnvelope(
  currentState: ReplayState,
  envelope: DeliveryEnvelope,
  shuffle = false
): { newState: ReplayState; stats: { added: number; updated: number; ignored: number } } {
  let recordsToProcess = [...envelope.records];
  if (shuffle) {
    recordsToProcess = recordsToProcess.sort(() => Math.random() - 0.5);
  }

  const newRecords = { ...currentState.records };
  const newRevisions = { ...currentState.applied_revisions };
  const overrides = { ...currentState.manual_overrides };

  let addedCount = 0;
  let updatedCount = 0;
  let ignoredCount = 0;

  for (const record of recordsToProcess) {
    const key = makeRecordKey(record.source_type, record.source_id);
    const existingRevision = newRevisions[key] || 0;

    if (envelope.revision > existingRevision) {
      // Newer revision replaces entire source payload
      const override = overrides[key];
      const analysis = generateRecordAnalysis(
        record,
        envelope.revision,
        override ? { manual_route: override.route, note: override.note } : undefined
      );

      newRecords[key] = {
        ...record,
        batch_id: envelope.batch_id,
        revision: envelope.revision,
        analysis
      };
      newRevisions[key] = envelope.revision;

      if (existingRevision === 0) {
        addedCount++;
      } else {
        updatedCount++;
      }
    } else {
      // Same or older revision: strictly ignored per contract
      ignoredCount++;
    }
  }

  const newMaxRev = Math.max(currentState.current_max_revision, envelope.revision);
  const logMsg = `Applied batch "${envelope.batch_id}" (Rev ${envelope.revision}): ${addedCount} added, ${updatedCount} updated, ${ignoredCount} ignored (idempotent duplicate rejection). Total unique records: ${Object.keys(newRecords).length}.`;

  const newState: ReplayState = {
    records: newRecords,
    applied_revisions: newRevisions,
    manual_overrides: overrides,
    last_action: logMsg,
    action_log: [logMsg, ...currentState.action_log].slice(0, 50),
    current_max_revision: newMaxRev
  };

  saveState(newState);
  return { newState, stats: { added: addedCount, updated: updatedCount, ignored: ignoredCount } };
}

/**
 * Manually override a conversation's route.
 * Preserved across revisions, re-imports, and refreshes.
 */
export function setManualRouteOverride(
  currentState: ReplayState,
  source_type: SourceType,
  source_id: string,
  newRoute: RouteCategory,
  note?: string
): ReplayState {
  const key = makeRecordKey(source_type, source_id);
  const existingRecord = currentState.records[key];
  if (!existingRecord) return currentState;

  const overrideEntry: ManualOverrideEntry = {
    source_type,
    source_id,
    record_ref: existingRecord.record_ref,
    route: newRoute,
    note: note || 'Manually set by sales manager',
    overridden_at: new Date().toISOString()
  };

  const newOverrides = {
    ...currentState.manual_overrides,
    [key]: overrideEntry
  };

  // Re-generate analysis preserving source fields
  const updatedAnalysis = generateRecordAnalysis(
    existingRecord,
    existingRecord.revision,
    { manual_route: newRoute, note: overrideEntry.note }
  );

  const updatedRecord: ProcessedRecord = {
    ...existingRecord,
    analysis: updatedAnalysis
  };

  const logMsg = `Manual route override on ${existingRecord.record_ref} (${source_type} ${source_id}) -> Assigned to "${newRoute}". Note: ${overrideEntry.note}`;

  const newState: ReplayState = {
    ...currentState,
    records: {
      ...currentState.records,
      [key]: updatedRecord
    },
    manual_overrides: newOverrides,
    last_action: logMsg,
    action_log: [logMsg, ...currentState.action_log].slice(0, 50)
  };

  saveState(newState);
  return newState;
}

/**
 * Reset a manual override back to automated suggestion
 */
export function clearManualRouteOverride(
  currentState: ReplayState,
  source_type: SourceType,
  source_id: string
): ReplayState {
  const key = makeRecordKey(source_type, source_id);
  const existingRecord = currentState.records[key];
  if (!existingRecord) return currentState;

  const newOverrides = { ...currentState.manual_overrides };
  delete newOverrides[key];

  const updatedAnalysis = generateRecordAnalysis(existingRecord, existingRecord.revision);

  const updatedRecord: ProcessedRecord = {
    ...existingRecord,
    analysis: updatedAnalysis
  };

  const logMsg = `Cleared manual override on ${existingRecord.record_ref} -> Restored automated route "${updatedAnalysis.primary_route}".`;

  const newState: ReplayState = {
    ...currentState,
    records: {
      ...currentState.records,
      [key]: updatedRecord
    },
    manual_overrides: newOverrides,
    last_action: logMsg,
    action_log: [logMsg, ...currentState.action_log].slice(0, 50)
  };

  saveState(newState);
  return newState;
}

/**
 * Reset explicitly to Final Post-Update State (Revision 2)
 */
export function resetToFinalPostUpdateState(): ReplayState {
  const def = getInitialDefaultState();
  saveState(def);
  return def;
}

/**
 * Clear all manual overrides while preserving current revisions
 */
export function clearAllManualOverrides(currentState: ReplayState): ReplayState {
  const updatedRecords: Record<string, ProcessedRecord> = {};
  for (const [key, record] of Object.entries(currentState.records)) {
    const analysis = generateRecordAnalysis(record, record.revision);
    updatedRecords[key] = {
      ...record,
      analysis
    };
  }

  const logMsg = `Cleared all manual route overrides (${Object.keys(currentState.manual_overrides).length} removed). Restored automated routes.`;

  const newState: ReplayState = {
    ...currentState,
    records: updatedRecords,
    manual_overrides: {},
    last_action: logMsg,
    action_log: [logMsg, ...currentState.action_log].slice(0, 50)
  };

  saveState(newState);
  return newState;
}

export { initialBatch, updateBatch };
