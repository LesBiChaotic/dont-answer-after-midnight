import React, { useState } from 'react';
import { TopBar } from '../components/layout/TopBar';
import { BottomNav } from '../components/layout/BottomNav';
import { OldInternetTrivia } from '../components/minigames/OldInternetTrivia';
import { ArchiveRestore } from '../components/minigames/ArchiveRestore';
import { StickerBuilder } from '../components/minigames/StickerBuilder';
import { SearchChallenge } from '../components/minigames/SearchChallenge';
import { LegacyClientMatch } from '../components/minigames/LegacyClientMatch';
import { Sparkles, HelpCircle, Database, Search, Layers } from 'lucide-react';

type ActivityTab = 'trivia' | 'restore' | 'stickers' | 'search' | 'clients';

export const ActivitiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActivityTab>('trivia');

  return (
    <div className="flex-1 flex flex-col h-full bg-night-bg text-night-text select-none">
      <TopBar title="Sanctuary Activities" />

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-night-surface/60 border-b border-night-border/60 overflow-x-auto no-scrollbar shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('trivia')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap min-h-touch transition-all ${
            activeTab === 'trivia'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'bg-night-card text-night-muted hover:text-white border border-night-border'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Trivia</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('restore')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap min-h-touch transition-all ${
            activeTab === 'restore'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'bg-night-card text-night-muted hover:text-white border border-night-border'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Restore CRC</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stickers')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap min-h-touch transition-all ${
            activeTab === 'stickers'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'bg-night-card text-night-muted hover:text-white border border-night-border'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mood Stickers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap min-h-touch transition-all ${
            activeTab === 'search'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'bg-night-card text-night-muted hover:text-white border border-night-border'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search Quest</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('clients')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap min-h-touch transition-all ${
            activeTab === 'clients'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'bg-night-card text-night-muted hover:text-white border border-night-border'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Client Match</span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain">
        {activeTab === 'trivia' && <OldInternetTrivia />}
        {activeTab === 'restore' && <ArchiveRestore />}
        {activeTab === 'stickers' && <StickerBuilder />}
        {activeTab === 'search' && <SearchChallenge />}
        {activeTab === 'clients' && <LegacyClientMatch />}
      </main>

      <BottomNav />
    </div>
  );
};
