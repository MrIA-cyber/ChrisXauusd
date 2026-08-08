import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Newspaper,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Clock,
  ArrowRight,
  Bookmark,
  Filter,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Radio,
  RefreshCw,
  ExternalLink,
  Globe,
  Zap,
} from 'lucide-react';
import { NEWS_ARTICLES } from '../lib/newsData';
import { NewsArticle, NewsCategory } from '../types';

interface NewsAndEducationSectionProps {
  onOpenSubscribeModal: () => void;
  isVisitor: boolean;
  onOpenEbookModal?: () => void;
}

export const NewsAndEducationSection: React.FC<NewsAndEducationSectionProps> = ({
  onOpenSubscribeModal,
  isVisitor,
  onOpenEbookModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'ALL'>('ALL');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const [liveArticles, setLiveArticles] = useState<NewsArticle[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

  const fetchLiveNews = async () => {
    setIsLoadingLive(true);
    try {
      const res = await fetch('/api/news/live');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setLiveArticles(json.data);
          setLastRefreshed(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch (err) {
      console.warn('Impossible de charger les actualités live:', err);
    } finally {
      setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    fetchLiveNews();
    const interval = setInterval(() => {
      fetchLiveNews();
    }, 5 * 60 * 1000); // Auto refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Combine live articles with static guides (avoid duplicates)
  const allArticles = [...liveArticles, ...NEWS_ARTICLES];

  const filteredArticles = selectedCategory === 'ALL'
    ? allArticles
    : allArticles.filter((a) => a.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedArticleId(expandedArticleId === id ? null : id);
  };

  return (
    <section id="news-section" className="space-y-6 pt-2 font-sans">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-500/10 text-rose-600 border border-rose-500/30">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>SATELLITE FLUX EN DIRECT</span>
            </div>
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2 font-mono">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>ACTUALITÉS MARCHÉ & ÉDUCATION (XAU/USD)</span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-2">
            <span>Fil d'actualité en temps réel répertorié depuis les flux financiers internationaux (FED, Or, Forex).</span>
            {lastRefreshed && (
              <span className="text-emerald-600 font-bold hidden sm:inline">
                • Mis à jour à {lastRefreshed}
              </span>
            )}
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={fetchLiveNews}
            disabled={isLoadingLive}
            className="px-3 py-1.5 rounded-xl bg-slate-900 text-amber-300 border border-amber-500/30 hover:bg-slate-800 flex items-center gap-1.5 transition-all cursor-pointer font-bold disabled:opacity-50"
            title="Rafraîchir le flux d'actualité satellite"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoadingLive ? 'animate-spin' : ''}`} />
            <span>{isLoadingLive ? 'Chargement...' : 'Rafraîchir Live'}</span>
          </button>

          {/* Category Filters */}
          {[
            { id: 'ALL', label: 'Tout' },
            { id: 'MACRO', label: 'Contexte Macro & FED' },
            { id: 'SCALPING_GUIDE', label: 'Guides Scalping' },
            { id: 'ANALYSIS', label: 'Analyse Technique' },
            { id: 'STORIES', label: 'Marché Live' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white border-blue-700 font-bold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-950'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* E-Book PDF Banner */}
      {onOpenEbookModal && (
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white rounded-2xl p-5 border border-amber-500/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-amber-400" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                  LIVRE COMPLET PDF
                </span>
                <span className="text-xs font-mono text-amber-300 font-bold">Édition Masterclass 2026</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white font-mono">
                Manuel Officiel de Scalping XAU/USD & Guide Algorithmique
              </h3>
              <p className="text-xs text-slate-300">
                Téléchargez le livre PDF complet avec toutes les règles de stratégie, les 5 confluences et le money management.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenEbookModal}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Ouvrir / Imprimer en PDF</span>
          </button>
        </div>
      )}

      {/* Live Articles Stream Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredArticles.map((article) => {
          const isExpanded = expandedArticleId === article.id;
          const isRealLive = article.isLiveReal;

          return (
            <article
              key={article.id}
              className={`bg-white border ${
                isRealLive ? 'border-amber-400/80 shadow-amber-500/5' : 'border-slate-200/80'
              } rounded-[20px] p-6 hover:border-amber-500 transition-all duration-300 flex flex-col justify-between space-y-4 group shadow-[0_10px_30px_rgba(15,23,42,0.05)] relative overflow-hidden`}
            >
              {isRealLive && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 text-[10px] font-mono font-black px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                  <Radio className="w-3 h-3 text-slate-950 animate-pulse" />
                  <span>ACTUALITÉ RÉELLE EN DIRECT</span>
                </div>
              )}

              <div className="space-y-3 pt-1">
                
                {/* Meta Badge Bar */}
                <div className="flex items-center justify-between text-xs font-mono pr-24">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isRealLive
                      ? 'bg-amber-50 text-amber-900 border border-amber-300'
                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}>
                    {article.categoryLabel}
                  </span>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {article.readTime}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-slate-700">{article.date}</span>
                  </div>
                </div>

                {/* Article Title */}
                <h3 className="text-sm font-bold text-[#0F172A] font-mono group-hover:text-blue-700 transition-colors leading-snug">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {article.summary}
                </p>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-700 space-y-3 font-sans bg-slate-50 p-3.5 rounded-xl animate-fade-in whitespace-pre-line leading-relaxed">
                    <p>{article.content}</p>

                    {article.sourceUrl && (
                      <div className="pt-2">
                        <a
                          href={article.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-[11px] transition-colors shadow-xs"
                        >
                          <span>Consulter la source officielle</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Tags list */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {article.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

              </div>

              {/* Card Footer Read More Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-400" />
                  <span>{article.author}</span>
                </span>
                <button
                  onClick={() => toggleExpand(article.id)}
                  className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>{isExpanded ? 'Réduire' : 'Lire l\'actualité'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

            </article>
          );
        })}
      </div>

    </section>
  );
};
