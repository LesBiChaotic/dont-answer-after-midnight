import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopBar } from '../components/layout/TopBar';
import { HELP_ARTICLES, HelpArticle } from '../data/helpCenterData';
import { Shield, MessageSquare, Archive, Smartphone, Palette, ChevronRight, HelpCircle } from 'lucide-react';

export const HelpArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const article = HELP_ARTICLES.find((a) => a.slug === slug || a.id === slug);

  if (!article) {
    return (
      <div className="flex-1 flex flex-col app-viewport bg-night-bg text-night-text">
        <TopBar showBack title="Article Not Found" />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <HelpCircle className="w-12 h-12 text-night-muted" />
          <h2 className="text-sm font-bold text-white">Help Article Not Found</h2>
          <p className="text-xs text-night-muted max-w-xs">
            The requested documentation article could not be located.
          </p>
          <button
            type="button"
            onClick={() => navigate('/help')}
            className="py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold min-h-touch"
          >
            Return to Help Center
          </button>
        </div>
      </div>
    );
  }

  const relatedArticles = HELP_ARTICLES.filter(
    (a) => a.category === article.category && a.id !== article.id
  ).slice(0, 3);

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
    <div className="flex-1 flex flex-col app-viewport bg-night-bg text-night-text select-none">
      <TopBar showBack title="Documentation" subtitle={article.category} />

      <main className="flex-1 overflow-y-auto p-4 space-y-6 max-w-md mx-auto w-full">
        {/* Article Header Card */}
        <div className="p-5 bg-night-surface border border-night-border rounded-3xl space-y-3 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-950/60 border border-brand-800/60 rounded-full text-[10px] font-mono font-semibold text-brand-300">
            {getCategoryIcon(article.category)}
            <span>{article.category}</span>
          </div>

          <h1 className="text-lg font-bold text-white font-serif tracking-tight leading-snug">
            {article.title}
          </h1>

          <p className="text-xs text-brand-200/90 leading-relaxed italic">
            "{article.summary}"
          </p>

          <div className="text-[10px] font-mono text-night-muted border-t border-night-border/40 pt-2 flex items-center justify-between">
            <span>DOC-ID: {article.id.toUpperCase()}</span>
            <span>Last Updated: {article.lastUpdated}</span>
          </div>
        </div>

        {/* Article Body */}
        <article className="p-5 bg-night-surface border border-night-border rounded-3xl space-y-4 text-xs leading-relaxed text-night-text">
          <div className="prose prose-invert prose-xs max-w-none space-y-3 whitespace-pre-line font-sans">
            {article.body}
          </div>

          {/* Keywords & Tags */}
          <div className="pt-4 border-t border-night-border/50 flex flex-wrap gap-1.5">
            {article.keywords.map((kw) => (
              <span
                key={kw}
                className="px-2.5 py-0.5 rounded-full bg-night-card border border-night-border text-[10px] text-brand-300 font-mono"
              >
                #{kw}
              </span>
            ))}
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="space-y-2.5">
            <h2 className="text-xs font-bold text-night-muted uppercase tracking-wider px-1">
              Related Documentation
            </h2>
            <div className="bg-night-surface border border-night-border rounded-3xl overflow-hidden divide-y divide-night-border/50">
              {relatedArticles.map((rel: HelpArticle) => (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => navigate(`/help/${rel.slug}`)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-night-card min-h-touch transition-colors"
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <h3 className="text-xs font-semibold text-white truncate">{rel.title}</h3>
                    <p className="text-[10px] text-night-muted truncate">{rel.summary}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-night-muted shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
