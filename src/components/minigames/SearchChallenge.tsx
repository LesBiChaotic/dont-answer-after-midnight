import React, { useState } from 'react';
import { Search, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChallengeItem {
  id: string;
  task: string;
  targetKeyword: string;
  hint: string;
  completed: boolean;
}

const INITIAL_CHALLENGES: ChallengeItem[] = [
  {
    id: 'c1',
    task: 'Locate the legacy log referencing daily tape backup maintenance at 05:00 UTC.',
    targetKeyword: 'tape backup',
    hint: 'Look in 2001 Midnight Board archives or Search.',
    completed: false,
  },
  {
    id: 'c2',
    task: 'Find the message where Julian records a field sample near the radio tower.',
    targetKeyword: 'relay tower',
    hint: 'Check Julian K. direct thread or query "tower".',
    completed: false,
  },
  {
    id: 'c3',
    task: 'Search for the unindexed 2008 Hushrooms packet quote.',
    targetKeyword: 'archive should keep this',
    hint: 'Search "archive should keep this" across all versions.',
    completed: false,
  },
];

export const SearchChallenge: React.FC = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<ChallengeItem[]>(INITIAL_CHALLENGES);
  const [queryInput, setQueryInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleTestSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = queryInput.trim().toLowerCase();
    if (!clean) return;

    let matched = false;
    const updated = challenges.map((ch) => {
      if (clean.includes(ch.targetKeyword.toLowerCase()) || ch.targetKeyword.toLowerCase().includes(clean)) {
        matched = true;
        return { ...ch, completed: true };
      }
      return ch;
    });

    if (matched) {
      setChallenges(updated);
      setFeedback(`Target match confirmed for "${queryInput}"!`);
    } else {
      setFeedback(`No target match for "${queryInput}". Try different search keywords.`);
    }
  };

  return (
    <div className="p-4 bg-ah-surface border border-ah-border rounded-3xl space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-ah-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-brand-400" />
          <h3 className="text-xs font-semibold text-ah-text">Conversation Search Challenge</h3>
        </div>
        <span className="text-[10px] font-mono text-brand-300">
          {challenges.filter((c) => c.completed).length} / {challenges.length} Done
        </span>
      </div>

      <p className="text-xs text-ah-muted leading-relaxed">
        Test your indexing speed by locating specific message records and log relics across threads and archives.
      </p>

      {/* Target Goals */}
      <div className="space-y-2">
        {challenges.map((ch, idx) => (
          <div
            key={ch.id}
            className={`p-3 rounded-2xl border text-xs space-y-1 transition-all ${
              ch.completed
                ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
                : 'bg-ah-surface-2 border-ah-border text-ah-text'
            }`}
          >
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="font-semibold text-brand-300">CHALLENGE {idx + 1}</span>
              {ch.completed && (
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <Check className="w-3.5 h-3.5" /> FOUND
                </span>
              )}
            </div>
            <p className="text-xs leading-relaxed">{ch.task}</p>
            <p className="text-[10px] text-ah-muted">Hint: {ch.hint}</p>
          </div>
        ))}
      </div>

      {/* Search Input Simulation */}
      <form onSubmit={handleTestSearch} className="space-y-2">
        <div className="flex items-center gap-2 bg-ah-surface-2 border border-ah-border focus-within:border-brand-500 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-ah-muted" />
          <input
            type="text"
            placeholder="Type verification query..."
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            className="flex-1 bg-transparent text-xs text-ah-text placeholder-night-muted outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-ah-text rounded-lg text-xs font-semibold"
          >
            Verify
          </button>
        </div>

        {feedback && (
          <div className="p-2.5 bg-ah-surface-2 border border-ah-border rounded-xl text-[11px] text-brand-300 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}
      </form>

      {/* Direct link to global search */}
      <button
        type="button"
        onClick={() => navigate('/search')}
        className="w-full py-2.5 bg-ah-surface-2 hover:bg-ah-hover border border-ah-border text-ah-text rounded-xl text-xs font-medium flex items-center justify-center gap-2 min-h-touch"
      >
        <span>Open Global Search Engine</span>
        <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
      </button>
    </div>
  );
};
