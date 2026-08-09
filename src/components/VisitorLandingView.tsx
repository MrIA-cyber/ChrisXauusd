import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
  CheckCircle2,
  Target,
  Shield,
  Clock,
  Bot,
  BarChart3,
  Bell,
  Star,
  Quote,
  Users,
  Play,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Award,
  Activity,
  Lock,
  LogIn,
  Brain,
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
  {
    author: 'Ray Dalio',
    quote: 'Si vous n\'avez pas de gestion du risque, vous ne garderez pas votre argent sur le long terme.',
  },
  {
    author: 'Mark Douglas',
    quote: 'Un trader d\'élite exécute un avantage statistique sans hésitation ni émotion.',
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
    <div className="space-y-6 sm:space-y-8 py-2 font-sans max-w-2xl mx-auto px-1 sm:px-0">
      
      {/* 1. COMPACT ELEGANT HERO HEADER */}
      <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden space-y-5 text-center">
        {/* Glow backdrop */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-[11px] font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Terminal Institutionnel • XAU/USD</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight leading-snug">
            Signaux XAU/USD à Haute Probabilité
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            Scalping continu M1 & M5 filtré par intelligence artificielle, confluences SMC et gestion stricte du risque.
          </p>
        </div>

        {/* Highlight Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
          <div className="bg-slate-50 dark:bg-[#060D1E] p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-left">
            <div className="text-[10px] text-slate-400 font-sans">Taux de Réussite</div>
            <div className="text-xs font-black text-emerald-500 mt-0.5">88.4% Verified</div>
          </div>
          <div className="bg-slate-50 dark:bg-[#060D1E] p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-left">
            <div className="text-[10px] text-slate-400 font-sans">Ratio Risque/Rend.</div>
            <div className="text-xs font-black text-amber-500 mt-0.5">1 : 2.50</div>
          </div>
          <div className="bg-slate-50 dark:bg-[#060D1E] p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-left">
            <div className="text-[10px] text-slate-400 font-sans">Fréquence</div>
            <div className="text-xs font-black text-blue-500 mt-0.5">3 - 5 / jour</div>
          </div>
          <div className="bg-slate-50 dark:bg-[#060D1E] p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-left">
            <div className="text-[10px] text-slate-400 font-sans">Exécution</div>
            <div className="text-xs font-black text-purple-500 mt-0.5">&lt; 1 sec Instant</div>
          </div>
        </div>

        {/* Primary Call To Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onOpenSubscribeModal}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer font-mono active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>REJOINDRER L'ESPACE VIP (700K FCFA/MOIS)</span>
          </button>
          <button
            onClick={onOpenLoginModal}
            className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
          >
            <LogIn className="w-4 h-4 text-amber-500" />
            <span>CONNEXION</span>
          </button>
        </div>
      </div>

      {/* 2. GLOBAL RANKING PERFORMANCE CARD */}
      <GlobalRankingCard />

      {/* 3. DUAL-TAB DEMONSTRATION & SIGNAL SHOWCASE */}
      <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        
        {/* Switcher Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase">
              Aperçu Interactif du Terminal
            </span>
          </div>

          <div className="flex bg-slate-100 dark:bg-[#060D1E] p-1 rounded-xl text-[11px] font-mono">
            <button
              onClick={() => setActiveDemoTab('signal')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeDemoTab === 'signal'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Signal Exemple
            </button>
            <button
              onClick={() => setActiveDemoTab('terminal')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeDemoTab === 'terminal'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Moteur Live
            </button>
          </div>
        </div>

        {/* Tab 1: Signal Exemple */}
        {activeDemoTab === 'signal' && (
          <div className="space-y-3 font-mono">
            <div className="bg-slate-50 dark:bg-[#060D1E] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-md">
                    BUY ACHAT
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">XAU/USD (Or)</span>
                </div>
                <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Démonstration VIP
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white dark:bg-[#0B132B] p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 font-sans">Entrée</div>
                  <div className="font-bold text-slate-900 dark:text-white">2 742.50 $</div>
                </div>
                <div className="bg-rose-500/10 p-2 rounded-xl border border-rose-500/30 text-rose-500">
                  <div className="text-[10px] font-sans">Stop Loss</div>
                  <div className="font-bold">2 737.50 $</div>
                </div>
                <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/30 text-emerald-500">
                  <div className="text-[10px] font-sans">Take Profit 1</div>
                  <div className="font-bold">2 750.00 $</div>
                </div>
                <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/30 text-emerald-500">
                  <div className="text-[10px] font-sans">Take Profit 2</div>
                  <div className="font-bold">2 760.00 $</div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-sans flex items-center justify-between pt-1">
                <span>Confluences : Order Block M5 + Liquidity Sweep London + RSI Div</span>
                <span className="text-emerald-500 font-mono font-bold">+75 Pips Max</span>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-center text-[11px] text-amber-600 dark:text-amber-300 font-sans">
              🔒 <strong>Accès Instantané :</strong> Les signaux actifs en temps réel et les notifications directes sont débloqués pour les membres VIP.
            </div>
          </div>
        )}

        {/* Tab 2: Moteur IA Live */}
        {activeDemoTab === 'terminal' && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs space-y-3 text-slate-200">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Moteur SMC ChrisXAUUSD v4.2
              </span>
              <span>NY Session Open</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Paire / Instrument :</span>
                <span className="text-amber-400 font-bold">XAU/USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Analyse de Confluence :</span>
                <span className="text-emerald-400 font-bold">94% Valide (High Probability)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Order Block Actif :</span>
                <span className="text-white font-bold">2,742.50 USD</span>
              </div>
            </div>

            <div className="bg-emerald-950/60 border border-emerald-500/40 p-2.5 rounded-xl space-y-1 text-[11px]">
              <div className="text-emerald-400 font-bold flex justify-between">
                <span>🟢 SIGNAL VIP GÉNÉRÉ</span>
                <span>En direct</span>
              </div>
              <p className="text-[10px] text-slate-300 font-sans">
                Alerte push diffusée sur les terminaux abonnés.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. KEY ADVANTAGES (COMPACT GRID) */}
      <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
          Avantages de la Suite ChrisXAUUSD
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
          {[
            {
              title: 'Analyse M1 & M5 Continue',
              desc: 'Detection chirurgicale des cassures de structure.',
              icon: Clock,
              color: 'text-amber-500',
            },
            {
              title: 'Stop Loss Strict & Calculé',
              desc: 'Protection absolue du capital à chaque trade.',
              icon: Shield,
              color: 'text-rose-500',
            },
            {
              title: 'Ratio Risque/Rendement &ge; 1:1.5',
              desc: 'Seuls les setups à haut rendement sont retenus.',
              icon: Target,
              color: 'text-emerald-500',
            },
            {
              title: 'Notifications Directes Terminal',
              desc: 'Diffusion instantanee sonore et visuelle.',
              icon: Bell,
              color: 'text-purple-500',
            },
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="p-3 bg-slate-50 dark:bg-[#060D1E] border border-slate-200/80 dark:border-slate-800 rounded-2xl flex items-start gap-3"
              >
                <div className={`p-2 rounded-xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 ${item.color} shrink-0`}>
                  <IconComp className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white font-mono text-xs">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. STREAMLINED TESTIMONIALS CAROUSEL */}
      <div
        className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase">
              Avis Membres Vérifiés
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setActiveTestimonialIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-slate-400 px-1">
              {activeTestimonialIdx + 1}/{TESTIMONIALS.length}
            </span>
            <button
              onClick={() => setActiveTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Active Testimonial Card */}
        {(() => {
          const t = TESTIMONIALS[activeTestimonialIdx];
          return (
            <div className="bg-slate-50 dark:bg-[#060D1E] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2.5 font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-xl object-cover border border-amber-500/40"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                      <span>{t.name}</span>
                      <span>{t.flag}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {t.country} • <span className="text-amber-500 font-semibold">{t.level}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ✓ {t.badge}
                </span>
              </div>

              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                ))}
                <span className="text-[10px] text-slate-400 font-mono ml-2">{t.date}</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "{t.comment}"
              </p>
            </div>
          );
        })()}
      </div>

      {/* 6. INSPIRATIONAL QUOTES BAR */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-4 shadow-xs space-y-2 font-mono text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-[11px] uppercase">
          <Quote className="w-3.5 h-3.5" />
          <span>Discipline & Philosophie de Risque</span>
        </div>
        <p className="text-slate-300 italic font-sans text-xs leading-relaxed">
          "{INSPIRATIONAL_QUOTES[0].quote}"
        </p>
        <div className="text-right text-[10px] text-slate-400">
          — {INSPIRATIONAL_QUOTES[0].author}
        </div>
      </div>

      {/* 7. FINAL CONVERSION BANNER */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-slate-950 rounded-3xl p-5 shadow-lg text-center space-y-3 font-sans">
        <h3 className="text-base font-extrabold font-mono uppercase tracking-tight">
          Prêt à Débloquer Tous les Signaux En Temps Réel ?
        </h3>
        <p className="text-xs text-slate-900 font-medium max-w-md mx-auto leading-relaxed">
          Rejoignez la communauté VIP ChrisXAUUSD dès aujourd'hui. Accès immédiat aux ordres d'achat/vente, SL, TP et analyses live.
        </p>
        <button
          onClick={onOpenSubscribeModal}
          className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer font-mono active:scale-98"
        >
          S'ABONNER MAINTENANT — 700 000 FCFA / MOIS
        </button>
      </div>

    </div>
  );
};
