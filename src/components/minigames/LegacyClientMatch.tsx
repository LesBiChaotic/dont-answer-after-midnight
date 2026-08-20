import React, { useState } from 'react';
import { LEGACY_CLIENT_MATCHES } from '../../data/lore';
import { Layers, Check, X, ArrowRight } from 'lucide-react';
import { LegacyEra } from '../../types';

const ERA_OPTIONS: LegacyEra[] = ['2001', '2004', '2008', '2013', '2018'];

export const LegacyClientMatch: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEra, setSelectedEra] = useState<LegacyEra | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentMatch = LEGACY_CLIENT_MATCHES[currentIndex];

  const handleSelectEra = (era: LegacyEra) => {
    if (isAnswered) return;
    setSelectedEra(era);
    setIsAnswered(true);
    if (era === currentMatch.era) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < LEGACY_CLIENT_MATCHES.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedEra(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedEra(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="p-4 bg-ah-surface border border-ah-border rounded-3xl space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-ah-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-400" />
          <h3 className="text-xs font-semibold text-ah-text">Legacy Client Protocol Match</h3>
        </div>
        <span className="text-[10px] font-mono text-brand-300">
          {currentIndex + 1} / {LEGACY_CLIENT_MATCHES.length}
        </span>
      </div>

      {isFinished ? (
        <div className="text-center py-4 space-y-3">
          <h4 className="text-sm font-bold text-ah-text">Matching Completed!</h4>
          <p className="text-xs text-ah-muted">
            You accurately identified {score} of {LEGACY_CLIENT_MATCHES.length} historical platform architectures.
          </p>
          <button
            type="button"
            onClick={handleRestart}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-ah-text rounded-xl text-xs font-semibold mx-auto min-h-touch"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-3.5 bg-ah-surface-2 border border-ah-border rounded-2xl space-y-1.5">
            <span className="text-[10px] font-mono text-brand-400 font-semibold uppercase">
              {currentMatch.featureName}
            </span>
            <p className="text-xs text-ah-text leading-relaxed">
              "{currentMatch.description}"
            </p>
            <p className="text-[10px] text-ah-muted">
              Client Tag: <span className="font-mono text-brand-300">{currentMatch.clientName}</span>
            </p>
          </div>

          <p className="text-[11px] font-semibold text-ah-muted">
            Select the era this protocol interface belongs to:
          </p>

          <div className="grid grid-cols-3 gap-2">
            {ERA_OPTIONS.map((era) => {
              const isSelected = selectedEra === era;
              const isCorrect = era === currentMatch.era;

              let btnStyle = 'bg-ah-surface-2 border-ah-border text-ah-text hover:bg-ah-hover';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-ah-surface-2 border-emerald-500 text-ah-text-2 ring-1 ring-emerald-500/50';
                } else if (isSelected) {
                  btnStyle = 'bg-ah-surface-2 border-red-500 text-ah-text-2 ring-1 ring-red-500/50';
                }
              }

              return (
                <button
                  key={era}
                  type="button"
                  onClick={() => handleSelectEra(era)}
                  className={`p-3 rounded-xl border text-center text-xs font-mono font-bold min-h-touch flex items-center justify-center gap-1.5 transition-all ${btnStyle}`}
                >
                  <span>{era}</span>
                  {isAnswered && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  {isAnswered && isSelected && !isCorrect && <X className="w-3.5 h-3.5 text-red-400" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-ah-text rounded-xl text-xs font-semibold flex items-center justify-center gap-2 min-h-touch active:scale-95 transition-transform"
            >
              <span>{currentIndex + 1 < LEGACY_CLIENT_MATCHES.length ? 'Next Era Match' : 'View Results'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
