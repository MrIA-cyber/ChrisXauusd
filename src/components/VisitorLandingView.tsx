import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Target,
  Shield,
  Clock,
  Bot,
  Bell,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Award,
  LogIn,
} from 'lucide-react';
import { GlobalRankingCard } from './GlobalRankingCard';

interface VisitorLandingViewProps {
  onOpenSubscribeModal: () => void;
  onOpenLoginModal: () => void;
}

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  country: string;
  flag: string;
  level: 'Débutant' | 'Confirmé' | 'Professionnel';
  rating: number;
  date: string;
  badge: 'Avis vérifié';
  comment: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Samuel M.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    country: 'Cameroun',
    flag: '🇨🇲',
    level: 'Confirmé',
    rating: 5,
    date: 'Il y a 2 jours',
    badge: 'Avis vérifié',
    comment: 'La précision des signaux sur XAU/USD est impressionnante. Les Stop Loss sont stricts et le ratio R:R de 1:2.5 est très souvent atteint.',
  },
  {
    id: '2',
    name: 'Yves K.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    country: "Côte d'Ivoire",
    flag: '🇨🇮',
    level: 'Professionnel',
    rating: 5,
    date: 'Il y a 3 jours',
    badge: 'Avis vérifié',
    comment: 'Les confluences M1 et M5 pendant la session de Londres font toute la différence. Plus de prises au hasard, uniquement des setups filtrés.',
  },
  {
    id: '3',
    name: 'Awa D.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    country: 'Sénégal',
    flag: '🇸🇳',
    level: 'Débutant',
    rating: 5,
    date: 'Il y a 5 jours',
    badge: 'Avis vérifié',
    comment: "La clarté des prix d'entrée et des TP1/TP2 m'a permis de gérer mon risque très facilement dès la première semaine.",
  },
  {
    id: '4',
    name: 'Jean-Marc B.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    country: 'France',
    flag: '🇫🇷',
    level: 'Confirmé',
    rating: 5,
    date: 'Il y a 1 semaine',
    badge: 'Avis vérifié',
    comment: 'Excellente discipline de gestion du risque. Chris partage des plans clairs. C\'est un véritable terminal institutionnel.',
  },
];

const INSPIRATIONAL_QUOTES = [
  {
    author: 'Warren Buffett',
    quote: 'La règle n°1 est de ne jamais perdre d\'argent. La règle n°2 est de ne jamais oublier la règle n°1.',
  },
];

export const VisitorLandingView: React.FC<VisitorLandingViewProps> = ({
  onOpenSubscribeModal,
  onOpenLoginModal,
}) => {
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [activeDemoTab, setActiveDemoTab] = useState<'terminal' | 'signal'>('signal');

  useEffect(() => {
    if (isCarouselPaused) return;
    const timer = setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isCarouselPaused]);

  return (
    <div className="space-y-4 py-2 font-sans w-full max-w-2xl mx-auto px-2 sm:px-4 min-w-0">
      
      {/* 1. HERO HEADER — Clean, focused, uncluttered */}
      <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-6 shadow-xs relative overflow-hidden space-y-4 text-center min-w-0">
        
        <div className="relative z-10 space-y-2.5 min-w-0">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-[9px] sm:text-[10px] font-bold uppercase max-w-full truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">Terminal Institutionnel • XAU/USD</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
          </div>

          <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white font-mono tracking-tight leading-snug break-words">
            Signaux XAU/USD à Haute Probabilité
          </h1>

          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Scalping M1 & M5 filtré par IA, confluences SMC et gestion stricte du risque.
          </p>
        </div>

        {/* Essential Key Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
          <div className="bg-slate-50 dark:bg-[#060D1E] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 text-left">
            <div className="text-[10px] text-slate-400 font-sans">Taux de Réussite</div>
            <div className="text-[11px] sm:text-xs font-black text-emerald-500 mt-0.5 truncate">92.4% Verified</div>
          </div>
          <div className="bg-slate-50 dark:bg-[#060D1E] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 text-left">
            <div className="text-[10px] text-slate-400 font-sans">Ratio Risque/Rend.</div>
            <div className="text-[11px] sm:text-xs font-black text-amber-500 mt-0.5 truncate">1 : 2.50</div>
          </div>
          <div className="bg-slate-50 dark:bg-[#060D1E] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 text-left">
            <div className="text-[10px] text-slate-400 font-sans">Fréquence</div>
            <div className="text-[11px] sm:text-xs font-black text-blue-500 mt-0.5 truncate">3 - 5 / jour</div>
          </div>
          <div className="bg-slate-50 dark:bg-[#060D1E] p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 text-left">
            <div className="text-[10px] text-slate-400 font-sans">Exécution</div>
            <div className="text-[11px] sm:text-xs font-black text-purple-500 mt-0.5 truncate">&lt; 1 sec Instant</div>
          </div>
        </div>

        {/* Action Call-To-Action Buttons — Responsive Stack on Mobile */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            onClick={onOpenSubscribeModal}
            className="w-full sm:w-auto flex-1 py-3 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-mono active:scale-98 text-center"
          >
            <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
            <span className="leading-tight">REJOINDRE L'ESPACE VIP (700 000 FCFA/MOIS)</span>
          </button>
          
          <button
            onClick={onOpenLoginModal}
            className="w-full sm:w-auto py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono shrink-0 text-center"
          >
            <LogIn className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>CONNEXION</span>
          </button>
        </div>
      </div>

      {/* 2. GLOBAL RANKING PERFORMANCE CARD */}
      <GlobalRankingCard />

      {/* 3. INTERACTIVE TERMINAL DEMO */}
      <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase">
              Aperçu du Terminal
            </span>
          </div>

          <div className="flex bg-slate-100 dark:bg-[#060D1E] p-1 rounded-xl text-[10px] font-mono">
            <button
              onClick={() => setActiveDemoTab('signal')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeDemoTab === 'signal'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Signal Exemple
            </button>
            <button
              onClick={() => setActiveDemoTab('terminal')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeDemoTab === 'terminal'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Moteur Live
            </button>
          </div>
        </div>

        {activeDemoTab === 'signal' ? (
          <div className="space-y-2.5 font-mono">
            <div className="bg-slate-50 dark:bg-[#060D1E] p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500 text-white font-black text-[10px] px-2 py-0.5 rounded-md">
                    BUY ACHAT
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">XAU/USD (Or)</span>
                </div>
                <span className="text-[10px] text-slate-400">Exemple VIP</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center text-xs">
                <div className="bg-white dark:bg-[#0B132B] p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="text-[9px] text-slate-400 font-sans">Entrée</div>
                  <div className="font-bold text-slate-900 dark:text-white">2 742.50 $</div>
                </div>
                <div className="bg-rose-500/10 p-2 rounded-lg border border-rose-500/30 text-rose-500">
                  <div className="text-[9px] font-sans">Stop Loss</div>
                  <div className="font-bold">2 737.50 $</div>
                </div>
                <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30 text-emerald-500">
                  <div className="text-[9px] font-sans">TP 1</div>
                  <div className="font-bold">2 750.00 $</div>
                </div>
                <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30 text-emerald-500">
                  <div className="text-[9px] font-sans">TP 2</div>
                  <div className="font-bold">2 760.00 $</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs space-y-2 text-slate-200">
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1.5">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Moteur SMC ChrisXAUUSD
              </span>
              <span>NY Session Open</span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Paire / Instrument :</span>
                <span className="text-amber-400 font-bold">XAU/USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Confluence SMC :</span>
                <span className="text-emerald-400 font-bold">94% Valide</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. KEY ADVANTAGES GRID */}
      <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
          Avantages de la Suite
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
          {[
            {
              title: 'Analyse M1 & M5 Continue',
              desc: 'Détection chirurgicale des cassures.',
              icon: Clock,
              color: 'text-amber-500',
            },
            {
              title: 'Stop Loss Strict & Calculé',
              desc: 'Protection absolue du capital.',
              icon: Shield,
              color: 'text-rose-500',
            },
            {
              title: 'Ratio Risque/Rendement ≥ 1:1.5',
              desc: 'Filtre automatique des meilleurs setups.',
              icon: Target,
              color: 'text-emerald-500',
            },
            {
              title: 'Notifications Directes Terminal',
              desc: 'Diffusion instantanée des alertes.',
              icon: Bell,
              color: 'text-purple-500',
            },
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="p-2.5 bg-slate-50 dark:bg-[#060D1E] border border-slate-200/80 dark:border-slate-800 rounded-xl flex items-start gap-2.5"
              >
                <div className={`p-1.5 rounded-lg bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 ${item.color} shrink-0`}>
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white font-mono text-[11px]">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. MEMBRES TESTIMONIALS */}
      <div
        className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase">
              Avis Membres Vérifiés
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => setActiveTestimonialIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-slate-400 px-1">
              {activeTestimonialIdx + 1}/{TESTIMONIALS.length}
            </span>
            <button
              onClick={() => setActiveTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length)}
              className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {(() => {
          const t = TESTIMONIALS[activeTestimonialIdx];
          return (
            <div className="bg-slate-50 dark:bg-[#060D1E] p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2 font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-8 h-8 rounded-lg object-cover border border-amber-500/40"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1">
                      <span>{t.name}</span>
                      <span>{t.flag}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {t.country} • <span className="text-amber-500 font-semibold">{t.level}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  ✓ Avis vérifié
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "{t.comment}"
              </p>
            </div>
          );
        })()}
      </div>

      {/* 6. INSPIRATIONAL QUOTE */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-3.5 shadow-xs flex items-center justify-between font-mono text-xs gap-3">
        <div className="flex items-center gap-2 text-slate-300 font-sans text-xs italic">
          <Quote className="w-4 h-4 text-amber-400 shrink-0" />
          <span>"{INSPIRATIONAL_QUOTES[0].quote}"</span>
        </div>
        <div className="text-[10px] text-amber-400 shrink-0 font-bold">
          — {INSPIRATIONAL_QUOTES[0].author}
        </div>
      </div>

    </div>
  );
};
