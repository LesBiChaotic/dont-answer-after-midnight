import React, { useEffect } from 'react';
import { Message } from '../../types';
import { History, X, AlertCircle } from 'lucide-react';
import { useContinuity } from '../../context/ContinuityContext';

interface MessageEditHistoryModalProps {
  message: Message;
  onClose: () => void;
}

export const MessageEditHistoryModal: React.FC<MessageEditHistoryModalProps> = ({
  message,
  onClose,
}) => {
  const { checkActionTrigger } = useContinuity();

  useEffect(() => {
    // Trigger puzzle trigger when user inspects the anomalous edit history
    if (message.content.includes('see you later') || (message.versions && message.versions.length > 2)) {
      checkActionTrigger('VIEW_EDIT_HISTORY');
    }
  }, [message, checkActionTrigger]);

  const versions = message.versions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ah-surface-3 backdrop-blur-xs p-3 animate-fade-in">
      <div className="w-full max-w-[420px] bg-ah-surface border border-ah-border rounded-3xl p-4 shadow-2xl space-y-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ah-border/60 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-brand-400" />
            <h3 className="text-xs font-semibold text-ah-text">Message Edit Revision History</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-ah-muted hover:text-ah-text min-h-touch min-w-touch flex items-center justify-center"
            aria-label="Close edit history"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Anomaly Hint if multi-version temporal sequence exists */}
        {versions.length > 2 && (
          <div className="p-3 bg-ah-surface-2 border border-indigo-800/50 rounded-2xl flex items-start gap-2.5 text-xs text-ah-text-2">
            <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-ah-text">Server Audit Timestamp Anomaly</span>
              <p className="text-[11px] text-ah-text-2 leading-relaxed">
                Revision logs indicate reverse temporal backfill across server timestamps.
              </p>
            </div>
          </div>
        )}

        {/* Version List */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {versions.length === 0 ? (
            <div className="p-3 bg-ah-surface-2 rounded-xl text-xs text-ah-muted text-center">
              No previous revisions recorded for this message.
            </div>
          ) : (
            versions.map((ver, idx) => {
              const isCurrent = idx === versions.length - 1;
              const formattedTime = new Date(ver.editedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <div
                  key={ver.id}
                  className={`p-3 rounded-2xl border text-xs space-y-1 ${
                    isCurrent
                      ? 'bg-brand-950/20 border-brand-800/60 ring-1 ring-brand-500/30'
                      : 'bg-ah-surface-2 border-ah-border'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-ah-muted font-mono">
                    <span className="font-semibold text-brand-300">
                      Revision {idx + 1} {isCurrent ? '(Current)' : ''}
                    </span>
                    <span>{formattedTime}</span>
                  </div>
                  <p className="text-xs text-ah-text leading-relaxed select-text">
                    "{ver.content}"
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl border border-ah-border text-ah-muted hover:text-ah-text font-medium text-xs min-h-touch active:bg-ah-surface-2 transition-colors"
        >
          Close History
        </button>
      </div>
    </div>
  );
};
