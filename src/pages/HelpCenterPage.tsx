import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/layout/TopBar';
import { HELP_ARTICLES, HelpArticle } from '../data/helpCenterData';
import { Search, ChevronRight, HelpCircle, Shield, MessageSquare, Archive, Smartphone, Palette } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Safety & Privacy',
  'Messaging & Controls',
  'Archives & History',
  'App & Offline',
  'Appearance & Access',
] as const;

export const HelpCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredArticles = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return HELP_ARTICLES.filter((art) => {
      const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
      if (!matchesCat) return false;
      if (!query) return true;

      const matchesTitle = art.title.toLowerCase().includes(query);
      const matchesSummary = art.summary.toLowerCase().includes(query);
      const matchesKeywords = art.keywords.some((k) => k.toLowerCase().includes(query));
      return matchesTitle || matchesSummary || matchesKeywords;
    });
  }, [searchQuery, selectedCategory]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Safety & Privacy':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case 'Messaging & Controls':
        return <MessageSquare className="w-4 h-4 text-brand-400" />;
      case 'Archives & History':
        return <Archive className="w-4 h-4 text-amber-400" />;
      case 'App & Offline':
        return <Smartphone className="w-4 h-4 text-blue-400" />;
      case 'Appearance & Access':
        return <Palette className="w-4 h-4 text-purple-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-brand-300" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col app-viewport bg-ah-canvas text-ah-text select-none">
      <TopBar showBack title="Help Center" subtitle="Guides, FAQs & Safety Controls" />

      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-md mx-auto w-full">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-ah-muted" />
          <input
            type="text"
            placeholder="Search 30+ guides (e.g. block, export, quiet hours)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-ah-surface border border-ah-border focus:border-brand-500 rounded-2xl text-xs text-ah-text placeholder-night-muted outline-none min-h-touch"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap min-h-touch transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 border border-brand-500 text-ah-text shadow-xs'
                  : 'bg-ah-surface-2 border border-ah-border text-ah-muted hover:text-ah-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-[11px] text-ah-muted px-1">
          <span>{filteredArticles.length} articles found</span>
          {selectedCategory !== 'All' && <span>Category: {selectedCategory}</span>}
        </div>

        {/* Article List */}
        <div className="bg-ah-surface border border-ah-border rounded-3xl overflow-hidden divide-y divide-ah-border/50">
          {filteredArticles.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <HelpCircle className="w-8 h-8 text-ah-muted mx-auto" />
              <p className="text-xs text-ah-muted">No help articles found matching "{searchQuery}".</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredArticles.map((article: HelpArticle) => (
              <button
                key={article.id}
                type="button"
                onClick={() => navigate(`/help/${article.slug}`)}
                className="w-full p-4 flex items-start justify-between text-left hover:bg-ah-surface-2 min-h-touch active:bg-ah-hover transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <div className="mt-0.5 shrink-0">{getCategoryIcon(article.category)}</div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-xs font-bold text-ah-text leading-snug">{article.title}</h3>
                    <p className="text-[11px] text-ah-muted leading-relaxed line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5 text-[10px] text-ah-muted font-mono">
                      <span className="text-brand-400">{article.category}</span>
                      <span>•</span>
                      <span>Updated {article.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-ah-muted shrink-0 mt-1" />
              </button>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
