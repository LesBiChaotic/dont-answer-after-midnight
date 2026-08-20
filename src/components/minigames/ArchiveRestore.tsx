import React, { useState } from 'react';
import { ARCHIVE_RESTORE_PACKETS } from '../../data/lore';
import { Database, Wrench, ShieldCheck } from 'lucide-react';

export const ArchiveRestore: React.FC = () => {
  const [restoredIds, setRestoredIds] = useState<string[]>([]);
  const [activeRestoring, setActiveRestoring] = useState<string | null>(null);

  const handleRestore = (id: string) => {
    setActiveRestoring(id);
    setTimeout(() => {
      setRestoredIds((prev) => [...prev, id]);
      setActiveRestoring(null);
    }, 1200);
  };

  return (
    <div className="p-4 bg-night-surface border border-night-border rounded-3xl space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-night-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-brand-400" />
          <h3 className="text-xs font-semibold text-white">Archive Partition CRC Restorer</h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400">
          {restoredIds.length}/{ARCHIVE_RESTORE_PACKETS.length} Restored
        </span>
      </div>

      <p className="text-xs text-night-muted leading-relaxed">
        Align corrupted packet frames across historical platform eras to reconstruct intact log fragments.
      </p>

      <div className="space-y-3">
        {ARCHIVE_RESTORE_PACKETS.map((pkt) => {
          const isRestored = restoredIds.includes(pkt.id);
          const isProcessing = activeRestoring === pkt.id;

          return (
            <div
              key={pkt.id}
              className={`p-3.5 rounded-2xl border text-xs space-y-2 transition-all ${
                isRestored
                  ? 'bg-emerald-950/20 border-emerald-800/60 ring-1 ring-emerald-500/20'
                  : 'bg-night-card border-night-border'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="font-semibold text-brand-300">
                  [{pkt.era}] {pkt.title}
                </span>
                <span className="text-night-muted">{pkt.checksum}</span>
              </div>

              <div className="p-2.5 bg-black/40 border border-night-border rounded-xl font-mono text-[11px] leading-relaxed select-text">
                {isRestored ? (
                  <span className="text-emerald-300">{pkt.reconstructedSnippet}</span>
                ) : (
                  <span className="text-night-muted line-through opacity-70">
                    {pkt.corruptedSnippet}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-night-muted font-mono">
                  STATUS: {isRestored ? 'VERIFIED_CLEAN' : 'CORRUPTED_CRC'}
                </span>

                <button
                  type="button"
                  disabled={isRestored || isProcessing}
                  onClick={() => handleRestore(pkt.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 min-h-touch transition-all ${
                    isRestored
                      ? 'bg-emerald-900/60 text-emerald-300 cursor-default'
                      : isProcessing
                      ? 'bg-brand-800 text-white animate-pulse'
                      : 'bg-brand-600 hover:bg-brand-500 text-white active:scale-95'
                  }`}
                >
                  {isRestored ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Aligned</span>
                    </>
                  ) : isProcessing ? (
                    <>
                      <Wrench className="w-3.5 h-3.5 animate-spin" />
                      <span>Reconstructing...</span>
                    </>
                  ) : (
                    <>
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Reconstruct</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
