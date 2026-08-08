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
  Layers,
  Star,
  Quote,
  Users,
  Play,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Award,
  Activity,
  Globe,
  Lock,
  LogIn
} from 'lucide-react';

interface VisitorLandingViewProps {
  onOpenSubscribeModal: () => void;
  onOpenLoginModal: () => void;
}

// 1. Testimonials Data
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
    comment: 'La précision des signaux sur XAU/USD est impressionnante. Les Stop Loss sont stricts et le ratio risque/rendement de 1:2.5 est régulièrement atteint. Une plateforme indispensable.'
  },
  {
    id: '2',
    name: 'Yves K.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    country: 'Côte d\'Ivoire',
    flag: '🇨🇮',
    level: 'Professionnel',
    rating: 5,
    date: 'Il y a 3 jours',
    badge: 'Avis vérifié',
    comment: 'Les confluences M1 et M5 pendant la session de Londres font toute la différence. Plus de trades pris au hasard, uniquement des setups filtrés par l\'IA.'
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
    comment: 'En tant que débutante, la clarté des prix d\'entrée et des objectifs TP1/TP2 m\'a permis de gérer mon risque très facilement. Je recommande à 100%.'
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
    comment: 'Excellente discipline de risk management. Chris partage des plans clairs et structurés. C\'est un véritable terminal institutionnel pour l\'Or.'
  },
  {
    id: '5',
    name: 'Karim B.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    country: 'Maroc',
    flag: '🇲🇦',
    level: 'Professionnel',
    rating: 5,
    date: 'Il y a 1 semaine',
    badge: 'Avis vérifié',
    comment: 'Interface réactive, zéro bruit inutile. L\'exécution des notifications est instantanée dès que la confluence SMC est validée.'
  },
  {
    id: '6',
    name: 'Cédric N.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    country: 'Gabon',
    flag: '🇬🇦',
    level: 'Confirmé',
    rating: 5,
    date: 'Il y a 2 semaines',
    badge: 'Avis vérifié',
    comment: 'Très bonne expérience. Les niveaux de Take Profit et Stop Loss sont clairement indiqués en pips. Un outil de trading d\'une grande qualité.'
  }
];

// 2. Inspiring Trader Quotes
interface InspirationalQuote {
  id: string;
  author: string;
  role: string;
  quote: string;
  image: string;
}

const INSPIRATIONAL_QUOTES: InspirationalQuote[] = [
  {
    id: 'q1',
    author: 'Warren Buffett',
    role: 'Président de Berkshire Hathaway',
    quote: 'La règle n°1 est de ne jamais perdre d\'argent. La règle n°2 est de ne jamais oublier la règle n°1.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'q2',
    author: 'Ray Dalio',
    role: 'Fondateur de Bridgewater Associates',
    quote: 'Si vous n\'êtes pas agressif, vous ne ferez pas d\'argent ; et si vous n\'avez pas de gestion du risque, vous ne garderez pas votre argent.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'q3',
    author: 'Paul Tudor Jones',
    role: 'Fondateur de Tudor Investment',
    quote: 'L\'élément le plus important dans le trading est la gestion du risque. Je cherche toujours un ratio Risque/Rendement de 1 à 5.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'q4',
    author: 'Jesse Livermore',
    role: 'Légende du Trading',
    quote: 'Les marchés ne se trompent jamais, les opinions si. L\'argent se fait en sachant analyser la tendance et attendre le bon moment.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'q5',
    author: 'Mark Douglas',
    role: 'Auteur de Trading in the Zone',
    quote: 'Un trader d\'élite n\'essaie pas de prédire le marché. Il exécute un avantage statistique sans hésitation ni émotion.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'q6',
    author: 'Stanley Druckenmiller',
    role: 'Gérant de Duquesne Capital',
    quote: 'Ce n\'est pas d\'avoir raison ou tort qui compte, c\'est combien vous gagnez quand vous avez raison et combien vous perdez quand vous avez tort.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'
  }
];

export const VisitorLandingView: React.FC<VisitorLandingViewProps> = ({
  onOpenSubscribeModal,
  onOpenLoginModal
}) => {
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  useEffect(() => {
    if (isCarouselPaused) return;
    const timer = setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isCarouselPaused]);

  return (
    <div className="space-y-16 lg:space-y-24 py-6 sm:py-10 relative z-10 text-[#0F172A] font-sans max-w-7xl mx-auto px-4">
      
      {/* ==========================================
          1. HERO SECTION (Carte Premium Imposante)
      ========================================== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-[24px] bg-white border border-slate-200/80 p-5 sm:p-10 lg:p-16 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-2xl transition-all"
      >
        {/* Subtle Ambient Aura Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.04)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 sm:space-y-10">
          
          {/* Header Tag / Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-sans text-[11px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest shadow-xs">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>ChrisXauusd Premium</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          </div>

          {/* Imposing Title & Subtitle with max width constraint */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold font-sans text-[#0F172A] tracking-tight leading-[1.2] break-words">
              Signaux XAU/USD à Haute Probabilité
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-sans leading-relaxed">
              Des signaux XAU/USD générés par une intelligence artificielle spécialisée, avec validation multi-confluence et gestion avancée du risque.
            </p>
          </div>

          {/* Feature Checklist Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-2 text-left max-w-3xl mx-auto">
            {[
              { title: 'Analyse en temps réel', desc: 'M1 & M5 scalping continu' },
              { title: 'Entrées précises', desc: 'Zones d\'Order Block & SMC' },
              { title: 'Stop Loss optimisés', desc: 'Protection stricte du capital' },
              { title: 'Take Profit intelligents', desc: 'Objectifs graduels TP1/TP2' },
              { title: 'Notifications instantanées', desc: 'Alertes en direct sur terminal' },
              { title: 'Journal statistique', desc: 'Transparence totale des résultats' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-amber-400 transition-all group"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-600 mt-0.5 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] font-sans">{item.title}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-sans mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs: Primary & Secondary */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
            {/* Primary Gold Button */}
            <button
              onClick={onOpenSubscribeModal}
              className="w-full sm:w-1/2 min-h-[52px] sm:h-[58px] py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base px-4 sm:px-6 rounded-2xl shadow-[0_8px_25px_rgba(245,158,11,0.25)] hover:shadow-[0_12px_35px_rgba(245,158,11,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group relative overflow-hidden cursor-pointer"
            >
              <Sparkles className="w-5 h-5 fill-slate-950 text-slate-950 group-hover:rotate-12 transition-transform shrink-0" />
              <span>Découvrir Premium</span>
              <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            {/* Secondary Discrete Button */}
            <button
              onClick={onOpenLoginModal}
              className="w-full sm:w-1/2 min-h-[52px] sm:h-[58px] py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 hover:text-slate-950 text-xs sm:text-sm font-bold px-4 sm:px-6 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-xs cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Déjà membre ? Se connecter</span>
            </button>
          </div>

        </div>
      </motion.section>


      {/* ==========================================
          2. KPI DASHBOARD BLOCK (5 Cards with Sparkline charts & 20px corners)
      ========================================== */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-amber-600">
            DASHBOARD KPI INSTITUTIONNEL
          </h2>
          <p className="text-lg sm:text-xl font-bold text-[#0F172A]">Performance Globale de la Plateforme</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              label: 'Taux de réussite',
              value: '88.4%',
              icon: TrendingUp,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50 border-emerald-200',
              sub: 'Calculé sur +500 trades',
              sparkline: [45, 50, 62, 58, 70, 75, 88]
            },
            {
              label: 'Signaux aujourd\'hui',
              value: '3 - 5 / jour',
              icon: Activity,
              color: 'text-amber-600',
              bg: 'bg-amber-50 border-amber-200',
              sub: 'Filtrés par haute probabilité',
              sparkline: [30, 40, 35, 50, 60, 55, 70]
            },
            {
              label: 'Ratio Risque/Rendement',
              value: '1 : 2.50',
              icon: Target,
              color: 'text-blue-600',
              bg: 'bg-blue-50 border-blue-200',
              sub: 'Minimum garanti R:R 1:1.5',
              sparkline: [20, 35, 45, 40, 65, 70, 80]
            },
            {
              label: 'Temps de réaction',
              value: '< 1 sec',
              icon: Zap,
              color: 'text-purple-600',
              bg: 'bg-purple-50 border-purple-200',
              sub: 'Émetteur M1/M5 ultra rapide',
              sparkline: [80, 75, 60, 40, 25, 15, 10]
            },
            {
              label: 'Membres Premium',
              value: '1 420+',
              icon: Users,
              color: 'text-sky-600',
              bg: 'bg-sky-50 border-sky-200',
              sub: 'Traders actifs en Afrique & Europe',
              sparkline: [10, 25, 40, 60, 80, 100, 120]
            }
          ].map((stat, idx) => {
            const IconComponent = stat.icon;
            // Build sparkline path
            const sparkPoints = stat.sparkline
              .map((val, i) => `${(i / (stat.sparkline.length - 1)) * 120},${40 - (val / 120) * 32}`)
              .join(' ');

            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 p-5 rounded-[20px] shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:border-amber-400 transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
                  <div className={`p-2 rounded-xl border ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-lg sm:text-xl font-bold font-mono text-[#0F172A] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans">{stat.sub}</div>
                </div>

                {/* KPI Mini Sparkline */}
                <div className="h-8 w-full pt-1">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 120 40">
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`${stat.color} opacity-80`}
                      points={sparkPoints}
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* ==========================================
          3. SIMULATION ET TERMINAL LIVE DEMO
      ========================================== */}
      <section className="bg-white border border-slate-200/80 rounded-[24px] p-6 sm:p-10 shadow-[0_10px_35px_rgba(15,23,42,0.06)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-600 shrink-0">
              <Play className="w-5 h-5 fill-amber-500/20 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold font-sans text-[#0F172A]">Démonstration du Moteur d'Analyse</h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Simulation en direct de l'exécution algorithmique sur l'Or (XAU/USD)</p>
            </div>
          </div>
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              TERMINAL LIVE ACTIVE
            </span>
          </div>
        </div>

        {/* Animated Terminal Screen Box */}
        <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-7 font-mono text-xs space-y-4 overflow-hidden shadow-inner text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="text-slate-400 text-xs ml-2 font-mono">chrisxauusd-engine-v4.2.0</span>
            </div>
            <span className="text-xs text-amber-400 font-mono font-bold">XAU/USD M5 Scalp Radar</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
              <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-400" /> SCANNER SENSITIVE SMC
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between text-slate-400">
                  <span>Instrument :</span> <span className="text-white font-bold">XAU/USD</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Session :</span> <span className="text-amber-300 font-bold">New York Open</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Score Confluence :</span> <span className="text-emerald-400 font-bold">94% High</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Order Block M5 :</span> <span className="text-emerald-400 font-bold">2,742.50 Validé</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
              <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" /> FLUX DU PRIX TEMPS RÉEL
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Prix Actuel :</span>
                  <span className="text-emerald-400 font-bold text-base">2 748.20 $</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
                  <div className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full w-3/4 rounded-full animate-pulse" />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Entrée: 2 742.50</span>
                  <span className="text-emerald-400 font-bold">+57 Pips</span>
                  <span>TP1: 2 750.00</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
              <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-400" /> NOTIFICATIONS VIP
              </div>
              <div className="bg-emerald-950/60 border border-emerald-500/40 p-3 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold">
                  <span>🟢 SIGNAL VALIDE - BUY</span>
                  <span>14:32:05</span>
                </div>
                <p className="text-xs text-slate-200 font-sans">
                  Objectif TP1 bientôt atteint. Déplacement du Stop Loss à Break-Even recommandé.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ==========================================
          4. APERÇU D'UN SIGNAL PREMIUM
      ========================================== */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            EXEMPLE DE STRUCTURE
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
            Aperçu d'un Signal Premium
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-sans">
            Exemple illustratif de la clarté et des niveaux précis reçus par les abonnés VIP lors de l'émission d'un trade.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-slate-200/80 rounded-[24px] p-4 sm:p-6 lg:p-8 shadow-[0_10px_35px_rgba(15,23,42,0.06)] relative overflow-hidden space-y-5 sm:space-y-6">
            
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 sm:gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <span className="bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl uppercase tracking-wider shrink-0 whitespace-nowrap shadow-xs">
                  ACHAT / BUY
                </span>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold font-sans text-[#0F172A] truncate">XAU/USD (Or)</h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-sans truncate">Exemple d'Exécution Scalping M5</p>
                </div>
              </div>
              <div className="shrink-0">
                <span className="text-[11px] sm:text-xs text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-300 font-semibold shrink-0 whitespace-nowrap">
                  Aperçu de démonstration
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] sm:text-xs text-slate-500 font-sans font-bold uppercase tracking-tight block truncate">Prix d'Entrée</span>
                <span className="text-xs sm:text-base font-extrabold font-mono text-[#0F172A] whitespace-nowrap block mt-1">2 742.50 $</span>
              </div>

              <div className="bg-rose-50/90 p-2.5 sm:p-3.5 rounded-2xl border border-rose-200">
                <span className="text-[10px] sm:text-xs text-rose-700 font-sans font-bold uppercase tracking-tight block truncate">Stop Loss</span>
                <span className="text-xs sm:text-base font-extrabold font-mono text-rose-600 whitespace-nowrap block mt-1">2 737.50 $</span>
                <span className="text-[10px] sm:text-[11px] font-mono text-rose-600/90 block whitespace-nowrap mt-0.5">-50 Pips</span>
              </div>

              <div className="bg-emerald-50/90 p-2.5 sm:p-3.5 rounded-2xl border border-emerald-200">
                <span className="text-[10px] sm:text-xs text-emerald-800 font-sans font-bold uppercase tracking-tight block truncate">Take Profit 1</span>
                <span className="text-xs sm:text-base font-extrabold font-mono text-emerald-600 whitespace-nowrap block mt-1">2 750.00 $</span>
                <span className="text-[10px] sm:text-[11px] font-mono text-emerald-700 block whitespace-nowrap mt-0.5">+75 Pips (1:1.5)</span>
              </div>

              <div className="bg-emerald-50/80 p-2.5 sm:p-3.5 rounded-2xl border border-emerald-200">
                <span className="text-[10px] sm:text-xs text-emerald-800 font-sans font-bold uppercase tracking-tight block truncate">Take Profit 2</span>
                <span className="text-xs sm:text-base font-extrabold font-mono text-emerald-700 whitespace-nowrap block mt-1">2 760.00 $</span>
                <span className="text-[10px] sm:text-[11px] font-mono text-emerald-700 block whitespace-nowrap mt-0.5">+175 Pips (1:3.5)</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] sm:text-xs font-sans font-bold text-slate-500 uppercase tracking-wide block">
                Confluences Validées par l'IA :
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl text-[11px] font-sans font-semibold shrink-0 whitespace-nowrap">
                  ✓ Order Block M5
                </span>
                <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-xl text-[11px] font-sans font-semibold shrink-0 whitespace-nowrap">
                  ✓ Liquidity Sweep London
                </span>
                <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-xl text-[11px] font-sans font-semibold shrink-0 whitespace-nowrap">
                  ✓ RSI Divergence Bullish
                </span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-300 p-3 sm:p-3.5 rounded-2xl text-center text-xs text-amber-900 font-sans">
              🔒 <strong>Note :</strong> Les signaux actifs en temps réel sont réservés aux abonnés Premium.
            </div>

          </div>
        </div>
      </section>


      {/* ==========================================
          5. FONCTIONNALITÉS PREMIUM MODERNISÉES
      ========================================== */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600">
            FONCTIONNALITÉS EXCLUSIVES
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">Pourquoi Choisir ChrisXauusd Premium ?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Analyse en temps réel',
              desc: 'Scan continu M1 & M5 identifiant la structure du marché de l\'Or avec une latence ultra-faible.',
              icon: Clock,
              color: 'text-amber-600',
              bg: 'bg-amber-50 border-amber-200'
            },
            {
              title: 'Entrées Précises',
              desc: 'Niveaux d\'entrée chirurgicaux basés sur les zones d\'Order Block et la liquidité institutionnelle.',
              icon: Target,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50 border-emerald-200'
            },
            {
              title: 'Stop Loss Optimisés',
              desc: 'Définition automatique et stricte du Stop Loss pour protéger rigoureusement votre capital.',
              icon: Shield,
              color: 'text-rose-600',
              bg: 'bg-rose-50 border-rose-200'
            },
            {
              title: 'Take Profit Intelligents',
              desc: 'Objectifs de gains graduels TP1/TP2 calibrés pour maximiser le ratio Risque/Rendement.',
              icon: TrendingUp,
              color: 'text-sky-600',
              bg: 'bg-sky-50 border-sky-200'
            },
            {
              title: 'Notifications Instantanées',
              desc: 'Diffusion immédiate des signaux et alertes sonores directement sur votre terminal.',
              icon: Bell,
              color: 'text-purple-600',
              bg: 'bg-purple-50 border-purple-200'
            },
            {
              title: 'Journal Statistique',
              desc: 'Suivi transparent des performances quotidiennes et historique archivé sans aucune altération.',
              icon: BarChart3,
              color: 'text-blue-600',
              bg: 'bg-blue-50 border-blue-200'
            }
          ].map((feature, idx) => {
            const IconComp = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 p-6 sm:p-7 rounded-[20px] shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:border-amber-400 hover:-translate-y-1 transition-all group space-y-4 h-full flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-2xl border ${feature.bg} flex items-center justify-center ${feature.color} group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-mono text-[#0F172A]">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* ==========================================
          6. TÉMOIGNAGES UTILISATEURS
      ========================================== */}
      <section
        className="space-y-6 pt-4"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 uppercase">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              COMMUNAUTÉ DE TRADERS
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-sans text-[#0F172A] mt-1">
              Ils Utilisent ChrisXauusd
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={() => setActiveTestimonialIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-950 hover:border-amber-400 transition-all active:scale-95 shadow-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs text-slate-500">
              {activeTestimonialIdx + 1} / {TESTIMONIALS.length}
            </span>
            <button
              onClick={() => setActiveTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length)}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-950 hover:border-amber-400 transition-all active:scale-95 shadow-xs"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => {
            const isHighlighted = idx === activeTestimonialIdx;
            return (
              <div
                key={t.id}
                className={`bg-white border p-6 rounded-[20px] shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all space-y-4 flex flex-col justify-between ${
                  isHighlighted ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200/80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover border border-amber-300 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-[#0F172A] font-mono flex items-center gap-1.5">
                          {t.name} <span>{t.flag}</span>
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-sans">
                          <span>{t.country}</span>
                          <span>•</span>
                          <span className="text-amber-700 font-semibold">{t.level}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
                      ✓ {t.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                    <span className="text-xs text-slate-400 font-mono ml-2">{t.date}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* ==========================================
          7. CITATIONS INSPIRANTES
      ========================================== */}
      <section className="space-y-6 pt-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 uppercase">
            <Quote className="w-3.5 h-3.5 text-blue-600" />
            SOURCES D'INSPIRATION ET DISCIPLINE
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-sans text-[#0F172A]">
            Les Plus Grands Traders Nous Inspirent
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-sans">
            La philosophie de gestion du risque de ChrisXauusd s'appuie sur les principes fondamentaux établis par les légendes des marchés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INSPIRATIONAL_QUOTES.map((q) => (
            <div
              key={q.id}
              className="bg-white border border-slate-200/80 p-6 sm:p-7 rounded-[20px] shadow-[0_10px_30px_rgba(15,23,42,0.05)] space-y-4 hover:border-blue-400 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <Quote className="w-8 h-8 text-amber-500/40" />
                <p className="text-xs sm:text-sm text-slate-700 font-sans italic leading-relaxed">
                  "{q.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <img
                  src={q.image}
                  alt={q.author}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] font-mono">{q.author}</h4>
                  <p className="text-[11px] text-slate-500 font-sans">{q.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ==========================================
          8. CALL TO ACTION FINAL
      ========================================== */}
      <section className="relative overflow-hidden rounded-[24px] bg-white border border-amber-300 p-6 sm:p-12 text-center space-y-5 sm:space-y-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6 relative z-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-600 mx-auto shadow-md">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 fill-amber-500/20 text-amber-600" />
          </div>

          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold font-sans text-[#0F172A] tracking-tight leading-snug">
            Prêt à Passer au Niveau Institutionnel ?
          </h2>

          <p className="text-xs sm:text-base text-slate-600 font-sans leading-relaxed">
            Rejoignez plus de 1 420 traders VIP et débloquez immédiatement les signaux en temps réel, les prix d'entrée exacts, Stop Loss et Take Profit sur XAU/USD.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              onClick={onOpenSubscribeModal}
              className="w-full sm:w-auto min-h-[52px] sm:min-h-[58px] py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-sm sm:text-base px-5 sm:px-8 rounded-2xl shadow-[0_8px_25px_rgba(245,158,11,0.25)] hover:shadow-[0_12px_35px_rgba(245,158,11,0.35)] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 text-center cursor-pointer"
            >
              <Sparkles className="w-5 h-5 fill-slate-950 text-slate-950 shrink-0" />
              <span className="leading-snug">Découvrir ChrisXauusd Premium</span>
              <ArrowRight className="w-5 h-5 text-slate-950 shrink-0" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
