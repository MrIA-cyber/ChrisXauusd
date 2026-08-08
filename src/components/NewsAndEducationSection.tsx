import React, { useState } from 'react';
import { BookOpen, Newspaper, TrendingUp, ShieldCheck, Sparkles, Clock, ArrowRight, Bookmark, Filter, ChevronDown, ChevronUp, Download, FileText } from 'lucide-react';
import { NEWS_ARTICLES } from '../lib/newsData';
import { NewsArticle, NewsCategory } from '../types';
import { formatFcfa, SUBSCRIPTION_PRICE_FCFA } from '../lib/subscriptionService';

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

  const filteredArticles = selectedCategory === 'ALL'
    ? NEWS_ARTICLES
    : NEWS_ARTICLES.filter((a) => a.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedArticleId(expandedArticleId === id ? null : id);
  };

  return (
    <section className="space-y-6 pt-2 font-sans">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2 font-mono">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>ACTUALITÉS & ÉDUCATION (XAU/USD & SCALPING)</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
              ACCÈS LIBRE
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Analyses macroéconomiques de l'or, guides pédagogiques de scalping et faits de marché.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {[
            { id: 'ALL', label: 'Tout' },
            { id: 'MACRO', label: 'Contexte Or & Macro' },
            { id: 'SCALPING_GUIDE', label: 'Guide Scalping' },
            { id: 'ANALYSIS', label: 'Analyse Technique' },
            { id: 'STORIES', label: 'Success Stories' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
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

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredArticles.map((article) => {
          const isExpanded = expandedArticleId === article.id;

          return (
            <article
              key={article.id}
              className="bg-white border border-slate-200/80 rounded-[20px] p-6 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between space-y-4 group shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
            >
              <div className="space-y-3">
                
                {/* Meta Badge Bar */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    {article.categoryLabel}
                  </span>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {article.readTime}
                    </span>
                    <span>•</span>
                    <span>{article.date}</span>
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

                {/* Expanded Full Content View */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-700 space-y-2 font-sans bg-slate-50 p-3.5 rounded-xl animate-fade-in whitespace-pre-line leading-relaxed">
                    {article.content}
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
                <span className="text-[11px] text-slate-500">{article.author}</span>
                <button
                  onClick={() => toggleExpand(article.id)}
                  className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  <span>{isExpanded ? 'Réduire' : 'Lire l\'article complet'}</span>
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
