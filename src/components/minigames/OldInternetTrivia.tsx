import React, { useState } from 'react';
import { TRIVIA_QUESTIONS } from '../../data/lore';
import { HelpCircle, Check, X, ArrowRight, RotateCcw } from 'lucide-react';

export const OldInternetTrivia: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = TRIVIA_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < TRIVIA_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="p-4 bg-ah-surface border border-ah-border rounded-3xl space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-ah-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-brand-400" />
          <h3 className="text-xs font-semibold text-ah-text">Old Internet Trivia Challenge</h3>
        </div>
        <span className="text-[10px] font-mono text-brand-300">
          {currentIndex + 1} / {TRIVIA_QUESTIONS.length}
        </span>
      </div>

      {isFinished ? (
        <div className="text-center py-4 space-y-3">
          <h4 className="text-sm font-bold text-ah-text">Quiz Completed!</h4>
          <p className="text-xs text-ah-muted">
            You scored {score} out of {TRIVIA_QUESTIONS.length} on vintage protocol trivia.
          </p>
          <button
            type="button"
            onClick={handleRestart}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-ah-text rounded-xl text-xs font-semibold flex items-center justify-center gap-2 mx-auto min-h-touch"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Play Again</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-ah-muted uppercase tracking-wider">
              {currentQ.era}
            </span>
            <p className="text-xs font-semibold text-ah-text leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-1.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'bg-ah-surface-2 border-ah-border text-ah-text hover:bg-ah-hover';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50';
                } else if (isSelected) {
                  btnStyle = 'bg-red-950/40 border-red-500 text-red-200 ring-1 ring-red-500/50';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-medium min-h-touch flex items-center justify-between transition-all ${btnStyle}`}
                >
                  <span>{option}</span>
                  {isAnswered && isCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <X className="w-4 h-4 text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswered && (
            <div className="p-3 bg-ah-surface-2 border border-ah-border rounded-xl text-[11px] text-ah-muted space-y-2 animate-slide-up">
              <p className="leading-relaxed">{currentQ.explanation}</p>
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-ah-text rounded-lg font-semibold flex items-center justify-center gap-1.5 min-h-touch active:scale-95 transition-transform"
              >
                <span>{currentIndex + 1 < TRIVIA_QUESTIONS.length ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
