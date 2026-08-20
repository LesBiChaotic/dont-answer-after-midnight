import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { TopBar } from '../../components/layout/TopBar';
import { Database, Download, RefreshCw, AlertTriangle, FileJson } from 'lucide-react';
import { useContinuity } from '../../context/ContinuityContext';

export const DataExportPage: React.FC = () => {
  const { exportData, resetAllData } = useSettings();
  const { checkActionTrigger } = useContinuity();
  const [exportJson, setExportJson] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = async () => {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key.startsWith('afterhours-')).map((key) => caches.delete(key)));
    }
    const registration = await navigator.serviceWorker?.getRegistration();
    await registration?.update();
    setCacheCleared(true);
  };

  const handleGenerateExport = async () => {
    setIsExporting(true);
    try {
      const data = await exportData();
      const formatted = JSON.stringify(data, null, 2);
      setExportJson(formatted);
      checkActionTrigger('GENERATE_DATA_EXPORT');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadFile = () => {
    if (!exportJson) return;
    const blob = new Blob([exportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `afterhours_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col app-viewport bg-ah-canvas text-ah-text">
      <TopBar showBack title="Data & Storage" subtitle="Export & Database Persistence" />

      <main className="flex-1 overflow-y-auto p-4 space-y-5 max-w-md mx-auto w-full">
        {/* Data Architecture Banner */}
        <div className="p-4 bg-ah-surface border border-ah-border rounded-3xl space-y-2 text-xs">
          <div className="flex items-center gap-2 text-ah-text font-semibold">
            <Database className="w-4 h-4 text-brand-400" />
            <span>Local IndexedDB Persistence Architecture</span>
          </div>
          <p className="text-ah-muted leading-relaxed">
            All user profiles, avatars, threads, messages, draft buffers, bookmarks, and historical continuity records are securely stored locally on this device.
          </p>
        </div>

        {/* Generate Export Action */}
        <div className="p-4 bg-ah-surface border border-ah-border rounded-3xl space-y-3">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-ah-text">Full Application Data Export</h3>
            <p className="text-[11px] text-ah-muted">
              Inspect or download a complete JSON snapshot of all records.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleGenerateExport}
              disabled={isExporting}
              className="flex-1 py-3 px-4 bg-brand-600 hover:bg-brand-500 text-ah-text rounded-xl text-xs font-semibold flex items-center justify-center gap-2 min-h-touch active:scale-95 transition-all shadow-md"
            >
              <FileJson className="w-4 h-4" />
              <span>{isExporting ? 'Generating...' : 'Generate JSON View'}</span>
            </button>

            {exportJson && (
              <button
                type="button"
                onClick={handleDownloadFile}
                className="py-3 px-4 bg-ah-surface-2 hover:bg-ah-hover border border-ah-border text-brand-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 min-h-touch active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Save File</span>
              </button>
            )}
          </div>

          {/* Interactive JSON Viewer */}
          {exportJson && (
            <div className="pt-2 animate-slide-up">
              <div className="flex items-center justify-between text-[11px] text-ah-muted pb-1 font-mono">
                <span>SIMULATED_DATA_STREAM</span>
                <span>{exportJson.length} bytes</span>
              </div>
              <pre className="p-3 bg-ah-surface-3 border border-ah-border rounded-xl text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-60 overflow-y-auto leading-tight select-text">
                {exportJson}
              </pre>
            </div>
          )}
        </div>

        <div className="p-4 bg-ah-surface border border-ah-border rounded-3xl space-y-3">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-ah-text">Repair Cached Version</h3>
            <p className="text-[11px] text-ah-muted">
              Clears only downloaded application files. Your profile, messages, clues, and settings remain untouched.
            </p>
          </div>
          <button type="button" onClick={handleClearCache} className="w-full min-h-touch rounded-xl border border-ah-border bg-ah-surface-2 px-4 py-3 text-xs font-semibold text-ah-text hover:bg-ah-hover">
            {cacheCleared ? 'Cache cleared — reload when ready' : 'Clear Cached Application Files'}
          </button>
        </div>

        {/* Database Reset Danger Zone */}
        <div className="p-4 bg-ah-surface-2 border border-red-900/40 rounded-3xl space-y-3">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-ah-text flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Reset Database to Initial State</span>
            </h3>
            <p className="text-[11px] text-ah-text-2 leading-relaxed">
              Clears local IndexedDB storage and reloads the initial seeded threads and rooms.
            </p>
          </div>

          {showResetConfirm ? (
            <div className="space-y-2 pt-2 animate-slide-up">
              <p className="text-xs font-bold text-red-400">Are you sure you want to reset?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-ah-border text-xs font-medium text-ah-text min-h-touch"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={resetAllData}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-ah-text text-xs font-semibold min-h-touch shadow"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-3 px-4 bg-ah-surface-2 hover:bg-ah-surface-2 border border-red-800 text-ah-text-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 min-h-touch transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset All Application Data</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
