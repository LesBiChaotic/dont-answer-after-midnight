import React, { useState } from 'react';
import { EndingType, EndingResult } from '../../types';
import { useContinuity } from '../../context/ContinuityContext';
import { Moon, Shield, Trash2, ShieldAlert, GitFork, MessageSquare, ArrowRight } from 'lucide-react';

interface FinalEncounterModalProps {
  onClose: () => void;
}

export const FinalEncounterModal: React.FC<FinalEncounterModalProps> = ({ onClose }) => {
  const { chooseEnding, continuityDepth, solvedCount } = useContinuity();
  const [selectedEnding, setSelectedEnding] = useState<EndingType | null>(null);
  const [endingResult, setEndingResult] = useState<EndingResult | null>(null);

  const handleConfirm = () => {
    if (!selectedEnding) return;
    const result = chooseEnding(selectedEnding);
    setEndingResult(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md p-3 animate-fade-in">
      <div className="w-full max-w-[430px] bg-night-surface border border-night-border rounded-3xl p-5 shadow-2xl space-y-4 animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* If an ending was chosen, display the ending screen */}
        {endingResult ? (
          <div className="space-y-4 text-center py-2 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-brand-950 border border-brand-800 flex items-center justify-center text-brand-300 mx-auto">
              <Moon className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-brand-400">
                CANONICAL RESOLUTION RECORDED
              </span>
              <h2 className="text-base font-bold text-white font-serif">{endingResult.title}</h2>
            </div>

            <div className="p-4 bg-night-card border border-night-border rounded-2xl text-xs text-night-text leading-relaxed text-left whitespace-pre-wrap select-text font-mono">
              {endingResult.narrativeText}
            </div>

            <div className="p-3 bg-black/40 border border-night-border rounded-xl text-[11px] text-night-muted flex items-center justify-between font-mono">
              <span>FINAL_DEPTH: Level {endingResult.continuityDepth}</span>
              <span>STATE: COMMITTED</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold min-h-touch active:scale-95 transition-transform"
            >
              Return to AFTERHOURS
            </button>
          </div>
        ) : (
          /* Decision Selection */
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-night-border/60 pb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-950/70 border border-brand-800 flex items-center justify-center text-brand-400">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white">THE THRESHOLD OF CONTINUITY</h2>
                <p className="text-[11px] text-brand-400 font-mono">@beforeyou: "do you remember me now?"</p>
              </div>
            </div>

            <p className="text-xs text-night-muted leading-relaxed">
              Based on {solvedCount} anomalies gathered and Continuity Depth Level {continuityDepth}, choose your response strategy:
            </p>

            {/* Ending Options */}
            <div className="space-y-2 text-xs">
              {/* Ending A: Do Not Reply */}
              <button
                type="button"
                onClick={() => setSelectedEnding('do_not_reply')}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 min-h-touch transition-all ${
                  selectedEnding === 'do_not_reply'
                    ? 'bg-night-card border-brand-500 ring-1 ring-brand-500 shadow-xs'
                    : 'bg-night-surface border-night-border hover:bg-night-card'
                }`}
              >
                <Shield className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white">A. Do Not Reply (Quarantine)</div>
                  <div className="text-[11px] text-night-muted leading-tight mt-0.5">
                    Silence the thread. Refuse reciprocal acknowledgment to stall the backfill.
                  </div>
                </div>
              </button>

              {/* Ending B: Delete Local Thread */}
              <button
                type="button"
                onClick={() => setSelectedEnding('delete_local')}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 min-h-touch transition-all ${
                  selectedEnding === 'delete_local'
                    ? 'bg-night-card border-brand-500 ring-1 ring-brand-500 shadow-xs'
                    : 'bg-night-surface border-night-border hover:bg-night-card'
                }`}
              >
                <Trash2 className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white">B. Delete Local Thread</div>
                  <div className="text-[11px] text-night-muted leading-tight mt-0.5">
                    Purge the thread. Experience the archive auto-restoration loop.
                  </div>
                </div>
              </button>

              {/* Ending C: Quarantine */}
              <button
                type="button"
                onClick={() => setSelectedEnding('quarantine')}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 min-h-touch transition-all ${
                  selectedEnding === 'quarantine'
                    ? 'bg-night-card border-brand-500 ring-1 ring-brand-500 shadow-xs'
                    : 'bg-night-surface border-night-border hover:bg-night-card'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white">C. Quarantine Isolation Seal</div>
                  <div className="text-[11px] text-night-muted leading-tight mt-0.5">
                    Freeze current messages in read-only status and lock depth at current level.
                  </div>
                </div>
              </button>

              {/* Ending D: Scatter */}
              <button
                type="button"
                onClick={() => setSelectedEnding('scatter')}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 min-h-touch transition-all ${
                  selectedEnding === 'scatter'
                    ? 'bg-night-card border-brand-500 ring-1 ring-brand-500 shadow-xs'
                    : 'bg-night-surface border-night-border hover:bg-night-card'
                }`}
              >
                <GitFork className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white">D. Scatter Cross-Platform Keys</div>
                  <div className="text-[11px] text-night-muted leading-tight mt-0.5">
                    Sever linkage, shattering @beforeyou into unowned historical shards.
                  </div>
                </div>
              </button>

              {/* Ending E: Answer */}
              <button
                type="button"
                onClick={() => setSelectedEnding('answer')}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 min-h-touch transition-all ${
                  selectedEnding === 'answer'
                    ? 'bg-brand-950/40 border-brand-500 ring-1 ring-brand-500 shadow-xs'
                    : 'bg-night-surface border-night-border hover:bg-night-card'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-brand-300">E. Answer: "I remember."</div>
                  <div className="text-[11px] text-night-muted leading-tight mt-0.5">
                    Full reciprocal acknowledgment. Backfills your history to November 15, 2001.
                  </div>
                </div>
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-night-border text-night-muted hover:text-white font-medium text-xs min-h-touch"
              >
                Step Back
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedEnding}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 min-h-touch shadow-md transition-all ${
                  selectedEnding
                    ? 'bg-brand-600 hover:bg-brand-500 text-white active:scale-95'
                    : 'bg-night-card text-night-muted/40 cursor-not-allowed border border-night-border'
                }`}
              >
                <span>Commit Decision</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
