import React, { useState } from 'react';
import { useContinuity } from '../context/ContinuityContext';
import { TopBar } from '../components/layout/TopBar';
import { BottomNav } from '../components/layout/BottomNav';
import { PuzzleDefinition, StoryAccessMode } from '../types';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
  Search,
  Bookmark,
  Database,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ClueNotebookPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    puzzles,
    storyStage,
    continuityDepth,
    accessMode,
    setAccessMode,
    revealHint,
    solvedCount,
  } = useContinuity();

  const [expandedPuzzleId, setExpandedPuzzleId] = useState<string | null>(puzzles[0]?.id || null);

  const handleToggleExpand = (id: string) => {
    setExpandedPuzzleId((prev) => (prev === id ? null : id));
  };

  const getStageTitle = (stage: number) => {
    switch (stage) {
      case 0:
      case 1:
        return 'Stage 1: First Contact (@renfieldnotes)';
      case 2:
        return 'Stage 2: Impossible Bookmark (OUR LIST)';
      case 3:
        return 'Stage 3: Invisible Quote & 2008 Hushrooms';
      case 4:
        return 'Stage 4: Edit History Inversion';
      case 5:
        return 'Stage 5: Social Memory Alignment';
      case 6:
        return 'Stage 6: Voice Note Repetition & Export Log';
      case 7:
        return 'Stage 7: Continuity Resolver & 2009 Backfill';
      case 8:
        return 'Stage 8: @beforeyou Placeholder Manifest';
      case 9:
        return 'Stage 9: Direct Encounter & Canonical Choice';
      default:
        return `Stage ${stage}`;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-night-bg text-night-text select-none">
      <TopBar title="Continuity Investigation" />

      <main className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain">
        {/* Status Dashboard Banner */}
        <div className="p-4 bg-night-surface border border-night-border rounded-3xl space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Continuity Investigation Log
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-950/60 border border-emerald-800/60 rounded-full">
              {solvedCount} / {puzzles.length} Solved
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-brand-300 font-mono">
              CURRENT STATUS: {getStageTitle(storyStage)}
            </div>
            <p className="text-[11px] text-night-muted leading-relaxed">
              Track reciprocal conversational anomalies, archive backfills, and timeline discrepancies across AFTERHOURS.
            </p>
          </div>

          {/* Depth Meter */}
          <div className="space-y-1.5 pt-2 border-t border-night-border/60">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-night-muted">CONTINUITY PROPAGATION DEPTH</span>
              <span className="text-brand-300 font-semibold">LEVEL {continuityDepth} / 5</span>
            </div>
            <div className="w-full h-2 bg-night-card rounded-full overflow-hidden border border-night-border flex">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <div
                  key={lvl}
                  className={`flex-1 border-r border-night-bg last:border-0 transition-all duration-500 ${
                    continuityDepth >= lvl ? 'bg-gradient-to-r from-brand-500 to-brand-400' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Story Access Mode Selector */}
        <div className="p-3.5 bg-night-surface/70 border border-night-border rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-night-muted uppercase tracking-wider">
              Investigation Access Mode
            </span>
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {(['spoiler_free', 'lore_preview', 'full_access'] as StoryAccessMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setAccessMode(mode)}
                className={`py-2 px-1 text-[10px] font-semibold rounded-xl border min-h-touch capitalize transition-all ${
                  accessMode === mode
                    ? 'bg-brand-600 border-brand-500 text-white shadow-xs'
                    : 'bg-night-card border-night-border text-night-muted hover:text-white'
                }`}
              >
                {mode.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Nav Shortcuts */}
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => navigate('/chats')}
            className="p-2.5 bg-night-card border border-night-border rounded-2xl flex flex-col items-center gap-1 text-[10px] font-medium text-night-muted hover:text-white min-h-touch"
          >
            <BookOpen className="w-4 h-4 text-brand-400" />
            <span>Inbox</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/bookmarks')}
            className="p-2.5 bg-night-card border border-night-border rounded-2xl flex flex-col items-center gap-1 text-[10px] font-medium text-night-muted hover:text-white min-h-touch"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>Bookmarks</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/archive')}
            className="p-2.5 bg-night-card border border-night-border rounded-2xl flex flex-col items-center gap-1 text-[10px] font-medium text-night-muted hover:text-white min-h-touch"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Archive</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/search')}
            className="p-2.5 bg-night-card border border-night-border rounded-2xl flex flex-col items-center gap-1 text-[10px] font-medium text-night-muted hover:text-white min-h-touch"
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span>Search</span>
          </button>
        </div>

        {/* Puzzles List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Native Messaging Puzzles ({puzzles.length})
          </h3>

          {puzzles.map((puz: PuzzleDefinition) => {
            const isExpanded = expandedPuzzleId === puz.id;
            const isAccessible = accessMode === 'full_access' || puz.stageRequirement <= storyStage;

            return (
              <div
                key={puz.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  puz.isSolved
                    ? 'bg-emerald-950/15 border-emerald-800/60 ring-1 ring-emerald-500/20'
                    : isAccessible
                    ? 'bg-night-surface border-night-border'
                    : 'bg-night-surface/40 border-night-border/40 opacity-70'
                }`}
              >
                {/* Header Row */}
                <button
                  type="button"
                  onClick={() => handleToggleExpand(puz.id)}
                  className="w-full p-3.5 flex items-center justify-between text-left min-h-touch"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {puz.isSolved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isAccessible ? (
                      <div className="w-4 h-4 rounded-full border border-brand-400/80 flex items-center justify-center text-[9px] font-mono text-brand-300 shrink-0">
                        {puz.number}
                      </div>
                    ) : (
                      <Lock className="w-4 h-4 text-night-muted shrink-0" />
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white truncate">
                          {puz.number}. {puz.title}
                        </span>
                        <span className="text-[9px] font-mono text-night-muted uppercase px-1.5 py-0.5 bg-night-card rounded-md border border-night-border">
                          {puz.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-night-muted truncate mt-0.5">
                        {puz.shortSummary}
                      </p>
                    </div>
                  </div>

                  <div className="text-night-muted ml-2">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-night-border/60 space-y-3 animate-fade-in text-xs">
                    {/* Clue Prompt */}
                    <div className="p-3 bg-night-card rounded-xl border border-night-border space-y-1">
                      <span className="text-[10px] font-mono text-brand-400 font-semibold uppercase">
                        ANOMALY RECORD
                      </span>
                      <p className="text-xs text-night-text leading-relaxed select-text">
                        "{puz.clueSnippet}"
                      </p>
                    </div>

                    {puz.unlockedArtifactTitle && (
                      <div className="text-[11px] text-emerald-300 flex items-center gap-1.5 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Artifact: {puz.unlockedArtifactTitle}</span>
                      </div>
                    )}

                    {/* 4-Tier Hints */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-semibold text-night-muted uppercase tracking-wider">
                        Progressive Clue Hints (No Penalty)
                      </span>

                      <div className="space-y-1.5">
                        {puz.hints.map((hint) => {
                          const isRevealed = hint.isRevealed;

                          return (
                            <div
                              key={hint.level}
                              className={`p-2.5 rounded-xl border text-xs transition-all ${
                                isRevealed
                                  ? 'bg-night-bg/80 border-night-border text-night-text'
                                  : 'bg-night-card/40 border-night-border/40 text-night-muted'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-mono font-semibold text-brand-300 uppercase">
                                  Hint {hint.level} • {hint.type.replace('_', ' ')}
                                </span>

                                {!isRevealed && (
                                  <button
                                    type="button"
                                    onClick={() => revealHint(puz.id, hint.level)}
                                    className="px-2 py-1 bg-night-surface hover:bg-night-hover border border-night-border text-[10px] text-brand-300 font-semibold rounded-lg min-h-touch flex items-center gap-1"
                                  >
                                    <HelpCircle className="w-3 h-3" />
                                    <span>Reveal</span>
                                  </button>
                                )}
                              </div>

                              {isRevealed ? (
                                <p className="text-[11px] text-night-text leading-relaxed select-text">
                                  {hint.text}
                                </p>
                              ) : (
                                <p className="text-[10px] text-night-muted italic">
                                  Tap reveal to inspect this level of clue guidance.
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
