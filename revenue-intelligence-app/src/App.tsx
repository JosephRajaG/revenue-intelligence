import React, { useState, useMemo } from 'react';
import {
  loadStoredState,
  saveState,
  resetToInitialBatchOnly,
  resetToFinalPostUpdateState,
  resetToEmptyWorkspace,
  applyDeliveryEnvelope,
  setManualRouteOverride,
  clearManualRouteOverride,
  clearAllManualOverrides,
  clearState,
  initialBatch,
  updateBatch,
  ReplayState
} from './services/replayEngine';
import { computeDashboardMetrics } from './services/metricsEngine';
import { downloadExportZip } from './services/exportEngine';
import { ProcessedRecord, RouteCategory, DeliveryEnvelope } from './types';
import { Header, ActiveTab } from './components/Header';
import { MetricDefinitionsModal } from './components/MetricDefinitionsModal';
import { ConversationInspector } from './components/ConversationInspector';
import { UploadBatchModal } from './components/UploadBatchModal';
import { ResetOptionsModal } from './components/ResetOptionsModal';
import { DashboardTab } from './components/tabs/DashboardTab';
import { InboxTab } from './components/tabs/InboxTab';
import { DailyBriefTab } from './components/tabs/DailyBriefTab';
import { ReplayConsoleTab } from './components/tabs/ReplayConsoleTab';
import { ExportCenterTab } from './components/tabs/ExportCenterTab';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  const [replayState, setReplayState] = useState<ReplayState>(() => loadStoredState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedRecord, setSelectedRecord] = useState<ProcessedRecord | null>(null);
  const [isDefinitionsOpen, setIsDefinitionsOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isResetOpen, setIsResetOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  // Filter pass-through state when navigating from Dashboard
  const [inboxPersonFilter, setInboxPersonFilter] = useState<string>('all');
  const [inboxRouteFilter, setInboxRouteFilter] = useState<RouteCategory | undefined>(undefined);

  // Calculate live metrics whenever records change
  const metrics = useMemo(() => {
    return computeDashboardMetrics(replayState.records);
  }, [replayState.records]);

  // Keep selected record updated if state changes
  React.useEffect(() => {
    if (selectedRecord) {
      const key = `${selectedRecord.source_type}:${selectedRecord.source_id}`;
      if (replayState.records[key]) {
        setSelectedRecord(replayState.records[key]);
      }
    }
  }, [replayState.records]);

  // Reset to Rev 1 (Initial batch only, clean without previous overrides)
  const handleResetToRev1 = () => {
    const newState = resetToInitialBatchOnly({});
    setReplayState(newState);
    setSelectedRecord(null);
    setInboxPersonFilter('all');
    setInboxRouteFilter(undefined);
    showToast('Reset to Initial Delivery (Revision 1: 44 records, 17 transcripts). Previous overrides cleared.');
  };

  // Reset to Rev 2 (Final post-update state, clean without previous overrides)
  const handleResetToRev2 = () => {
    const newState = resetToFinalPostUpdateState();
    setReplayState(newState);
    setSelectedRecord(null);
    setInboxPersonFilter('all');
    setInboxRouteFilter(undefined);
    showToast('Reset to Final Post-Update State (Revision 2: 44 records, 18 transcripts).');
  };

  // Reset to 0 records (Clean Slate)
  const handleResetToEmpty = () => {
    const newState = resetToEmptyWorkspace();
    setReplayState(newState);
    setSelectedRecord(null);
    setInboxPersonFilter('all');
    setInboxRouteFilter(undefined);
    showToast('Workspace cleared to 0 records. Ready for clean batch import.');
  };

  // Clear manual overrides only
  const handleClearOverridesOnly = () => {
    const count = Object.keys(replayState.manual_overrides).length;
    const newState = clearAllManualOverrides(replayState);
    setReplayState(newState);
    showToast(`Cleared ${count} manual route override(s). Automated classifications restored.`);
  };

  // Ingest uploaded envelope
  const handleApplyUploadedEnvelope = (envelope: DeliveryEnvelope, shuffle?: boolean) => {
    const { newState, stats } = applyDeliveryEnvelope(replayState, envelope, shuffle);
    setReplayState(newState);
    showToast(`Batch "${envelope.batch_id}" applied: ${stats.added} added, ${stats.updated} updated, ${stats.ignored} ignored.`);
    return stats;
  };

  // 1-Click ZIP Download
  const handleDownloadZip = () => {
    downloadExportZip(replayState.records);
    showToast('Generating and downloading full export archive (.zip)...');
  };

  // Handle manual route override on selected record
  const handleSaveOverride = (newRoute: RouteCategory, note?: string) => {
    if (!selectedRecord) return;
    const newState = setManualRouteOverride(
      replayState,
      selectedRecord.source_type,
      selectedRecord.source_id,
      newRoute,
      note
    );
    setReplayState(newState);
    showToast(`Saved manual override for ${selectedRecord.record_ref} -> ${newRoute}`);
  };

  // Handle clear override
  const handleClearOverride = () => {
    if (!selectedRecord) return;
    const newState = clearManualRouteOverride(
      replayState,
      selectedRecord.source_type,
      selectedRecord.source_id
    );
    setReplayState(newState);
    showToast(`Restored automated route for ${selectedRecord.record_ref}`);
  };

  // Jump from Dashboard to Inbox filtered by Person
  const handleSelectPersonFilter = (personName: string) => {
    setInboxPersonFilter(personName);
    setInboxRouteFilter(undefined);
    setActiveTab('inbox');
  };

  // Jump from Dashboard to Inbox filtered by Route
  const handleSelectRouteFilter = (route: RouteCategory) => {
    setInboxRouteFilter(route);
    setInboxPersonFilter('all');
    setActiveTab('inbox');
  };

  // Jump from Brief or Export to Record Inspector
  const handleSelectRecordByRef = (ref: string) => {
    const found = Object.values(replayState.records).find((r: ProcessedRecord) => r.record_ref === ref);
    if (found) {
      setSelectedRecord(found);
    }
  };

  const handleClearInboxFilters = () => {
    setInboxPersonFilter('all');
    setInboxRouteFilter(undefined);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans relative">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metrics={metrics}
        currentMaxRevision={replayState.current_max_revision}
        onOpenDefinitions={() => setIsDefinitionsOpen(true)}
        onOpenUploadModal={() => setIsUploadOpen(true)}
        onOpenResetModal={() => setIsResetOpen(true)}
        onDownloadZip={handleDownloadZip}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardTab
            metrics={metrics}
            records={replayState.records}
            onSelectPersonFilter={handleSelectPersonFilter}
            onSelectRouteFilter={handleSelectRouteFilter}
            onSelectRecord={(rec: ProcessedRecord) => setSelectedRecord(rec)}
            onOpenDefinitions={() => setIsDefinitionsOpen(true)}
            onLoadInitialBatch={handleResetToRev1}
            onLoadFinalBatch={handleResetToRev2}
            onOpenUploadModal={() => setIsUploadOpen(true)}
          />
        )}

        {activeTab === 'inbox' && (
          <InboxTab
            records={replayState.records}
            selectedPersonFilter={inboxPersonFilter}
            selectedRouteFilter={inboxRouteFilter}
            onSelectRecord={(rec: ProcessedRecord) => setSelectedRecord(rec)}
            onClearFilters={handleClearInboxFilters}
          />
        )}

        {activeTab === 'brief' && (
          <DailyBriefTab
            records={replayState.records}
            onSelectRecordByRef={handleSelectRecordByRef}
          />
        )}

        {activeTab === 'replay' && (
          <ReplayConsoleTab
            replayState={replayState}
            onStateUpdate={(newState) => setReplayState(newState)}
            onSelectRecordByRef={handleSelectRecordByRef}
          />
        )}

        {activeTab === 'export' && (
          <ExportCenterTab
            records={replayState.records}
            onSelectRecordByRef={handleSelectRecordByRef}
          />
        )}
      </main>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 text-base font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SpendNest Revenue Intelligence Inbox • Candidate Assessment Submission</span>
          <span className="font-mono text-slate-400">
            Records: {metrics.total_selected_records} | Transcripts: {metrics.transcripts_available} | Coverage: {metrics.transcript_coverage_percentage}%
          </span>
        </div>
      </footer>

      {/* Modals & Inspectors */}
      <MetricDefinitionsModal
        isOpen={isDefinitionsOpen}
        onClose={() => setIsDefinitionsOpen(false)}
      />

      <UploadBatchModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onApplyEnvelope={handleApplyUploadedEnvelope}
        initialBatch={initialBatch}
        updateBatch={updateBatch}
      />

      <ResetOptionsModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onResetToRev1={handleResetToRev1}
        onResetToRev2={handleResetToRev2}
        onResetToEmpty={handleResetToEmpty}
        onClearOverridesOnly={handleClearOverridesOnly}
        overridesCount={metrics.manual_overrides_count}
      />

      <ConversationInspector
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onSaveOverride={handleSaveOverride}
        onClearOverride={handleClearOverride}
      />
    </div>
  );
}

export default App;
