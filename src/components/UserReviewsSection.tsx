import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
  ThumbsUp,
  ShieldCheck,
  Award,
  TrendingUp,
  Users,
  Sparkles,
  Filter,
  X,
  Send,
  Lock,
  Zap,
  Globe
} from 'lucide-react';

interface Review {
  id: string;
  name: string;
  avatar?: string;
  country: string;
  flag: string;
  rating: number;
  tenure: string;
  comment: string;
  date: string;
  badge: 'Abonné vérifié' | 'Top contributeur' | 'Trader actif' | 'Premium';
  badgeColor: string;
  helpfulCount: number;
  isUserSubmitted?: boolean;
}

interface UserReviewsSectionProps {
  isVisitor: boolean;
  onOpenSubscribeModal: () => void;
  onOpenLoginModal?: () => void;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Samuel M.',
    flag: '🇨🇲',
    country: 'Cameroun',
    rating: 5,
    tenure: 'Abonné VIP depuis 1 an',
    comment: 'Très satisfait des signaux sur l\'Or (XAUUSD). L\'application est réactive, les Stop Loss sont toujours ultra précis et le ratio R:R de 1:2.5 est régulièrement atteint. J\'ai doublé la régularité de mon compte.',
    date: 'Hier',
    badge: 'Top contributeur',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    helpfulCount: 42,
  },
  {
    id: 'rev-2',
    name: 'Yves K.',
    flag: '🇨🇮',
    country: 'Côte d\'Ivoire',
    rating: 5,
    tenure: 'Abonné depuis 8 mois',
    comment: 'Les confluences M1 et M5 avec les sessions de Londres et New York font toute la différence. On ne prend pas de trades au hasard. La transparence des pertes quand un SL est touché est tout simplement exemplaire.',
    date: 'Il y a 2 jours',
    badge: 'Abonné vérifié',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    helpfulCount: 38,
  },
  {
    id: 'rev-3',
    name: 'Awa D.',
    flag: '🇸🇳',
    country: 'Sénégal',
    rating: 5,
    tenure: 'Abonnée depuis 5 mois',
    comment: 'Le calculateur de lot automatique intégré m\'évite de cramer mon capital. Les alertes de breakout sur l\'or me permettent de rentrer directement sur MT5 sans stress.',
    date: 'Il y a 3 jours',
    badge: 'Trader actif',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    helpfulCount: 29,
  },
  {
    id: 'rev-4',
    name: 'Jean-Marc B.',
    flag: '🇫🇷',
    country: 'France',
    rating: 5,
    tenure: 'Abonné VIP 6 mois',
    comment: 'Excellente discipline de risk management. Chris partage non seulement les points d\'entrée mais aussi les justifications techniques. C\'est un vrai outil pédagogique autant qu\'un service de signaux.',
    date: 'Il y a 5 jours',
    badge: 'Premium',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    helpfulCount: 51,
  },
  {
    id: 'rev-5',
    name: 'Karim B.',
    flag: '🇲🇦',
    country: 'Maroc',
    rating: 5,
    tenure: 'Abonné depuis 9 mois',
    comment: 'Service au top ! Le support par Mobile Money (Wave, Orange, MTN) rend l\'abonnement super accessible depuis l\'Afrique. Et la précision sur XAUUSD est tout simplement chirurgicale.',
    date: 'Il y a 1 semaine',
    badge: 'Abonné vérifié',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    helpfulCount: 24,
  },
  {
    id: 'rev-6',
    name: 'Cédric N.',
    flag: '🇬🇦',
    country: 'Gabon',
    rating: 4,
    tenure: 'Abonné depuis 3 mois',
    comment: 'Très bonne application. Les plans d\'achat/vente sont limpides avec les niveaux SL et TP affichés en pips. 4 étoiles bien méritées, continuez ainsi !',
    date: 'Il y a 1 semaine',
    badge: 'Trader actif',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    helpfulCount: 19,
  }
];

export const UserReviewsSection: React.FC<UserReviewsSectionProps> = ({
  isVisitor,
  onOpenSubscribeModal,
  onOpenLoginModal
}) => {
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [activeFilter, setActiveFilter] = useState<'Tous' | '5_STARS' | '4_STARS' | 'RECENT' | 'HELPFUL'>('Tous');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  // Review submission modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newCountry, setNewCountry] = useState('🇨🇲 Cameroun');
  const [newComment, setNewComment] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === '5_STARS') return r.rating === 5;
    if (activeFilter === '4_STARS') return r.rating === 4;
    return true;
  }).sort((a, b) => {
    if (activeFilter === 'HELPFUL') return b.helpfulCount - a.helpfulCount;
    return 0; // Default order
  });

  // Auto-carousel timer
  useEffect(() => {
    if (isPaused || filteredReviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, filteredReviews.length]);

  // Adjust currentIndex if out of bounds after filter change
  useEffect(() => {
    if (currentIndex >= filteredReviews.length) {
      setCurrentIndex(0);
    }
  }, [filteredReviews.length, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length);
  };

  const handleToggleLike = (id: string) => {
    const isLiked = likedReviews[id];
    setLikedReviews((prev) => ({ ...prev, [id]: !isLiked }));
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, helpfulCount: r.helpfulCount + (isLiked ? -1 : 1) } : r
      )
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newName.trim()) return;

    const [flag, ...countryParts] = newCountry.split(' ');
    const countryName = countryParts.join(' ');

    const createdReview: Review = {
      id: `rev-${Date.now()}`,
      name: newName.trim(),
      flag: flag || '🌍',
      country: countryName || 'Mondial',
      rating: newRating,
      tenure: 'Membre VIP Actif',
      comment: newComment.trim(),
      date: 'À l\'instant',
      badge: 'Abonné vérifié',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      helpfulCount: 1,
      isUserSubmitted: true
    };

    setReviews([createdReview, ...reviews]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      setNewComment('');
      setNewName('');
    }, 2000);
  };

  return (
    <section className="relative my-8 max-w-7xl mx-auto px-4 font-sans">
      {/* Container Box with Dark Sapphire Glassmorphism */}
      <div className="bg-[#071426] border border-[#00E5FF]/20 rounded-[24px] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>COMMUNAUTÉ CHRISXAUUSD</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black font-mono text-white tracking-tight flex items-center gap-2">
              <span>⭐ Ce que pensent nos abonnés</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-sans leading-relaxed">
              Plus de traders nous font confiance chaque jour grâce à nos signaux en temps réel sur l'Or (XAUUSD). Découvrez leurs retours d'expérience authentiques.
            </p>
          </div>

          {/* Action Button: Give Review */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => {
                if (isVisitor) {
                  onOpenLoginModal ? onOpenLoginModal() : onOpenSubscribeModal();
                } else {
                  setIsSubmitModalOpen(true);
                }
              }}
              className="bg-amber-400 hover:bg-amber-300 text-[#030B16] font-mono text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 group transform active:scale-95 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 text-[#030B16] group-hover:rotate-12 transition-transform" />
              <span>Donner mon avis</span>
            </button>
          </div>
        </div>

        {/* Global Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 my-6 relative z-10">
          
          {/* Rating Big Card */}
          <div className="col-span-2 sm:col-span-1 bg-amber-500/10 border border-amber-500/30 rounded-[16px] p-4 flex flex-col items-center justify-center text-center shadow-xs">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-400">4.9</span>
              <span className="text-sm font-bold font-mono text-slate-400">/ 5</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Basé sur retours abonnés
            </span>
          </div>

          {/* Metric 1: Active Subscribers */}
          <div className="bg-[#030B16] border border-slate-800 rounded-[16px] p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-mono uppercase font-semibold">Abonnés VIP</span>
              <Users className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <div className="mt-2">
              <span className="text-base sm:text-lg font-bold font-mono text-white">1 450+</span>
              <p className="text-[10px] text-[#22C55E] font-mono font-medium flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +12% ce mois
              </p>
            </div>
          </div>

          {/* Metric 2: Satisfaction Rate */}
          <div className="bg-[#030B16] border border-slate-800 rounded-[16px] p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-mono uppercase font-semibold">Satisfaction</span>
              <Award className="w-4 h-4 text-[#22C55E]" />
            </div>
            <div className="mt-2">
              <span className="text-base sm:text-lg font-bold font-mono text-[#22C55E]">98.4%</span>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Taux de réabonnement
              </p>
            </div>
          </div>

          {/* Metric 3: Success Rate */}
          <div className="bg-[#030B16] border border-slate-800 rounded-[16px] p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-mono uppercase font-semibold">Taux de TP</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2">
              <span className="text-base sm:text-lg font-bold font-mono text-amber-400">92.4%</span>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Audité en temps réel
              </p>
            </div>
          </div>

          {/* Metric 4: Signals Published */}
          <div className="bg-[#030B16] border border-slate-800 rounded-[16px] p-3.5 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-mono uppercase font-semibold">Signaux Émis</span>
              <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <div className="mt-2">
              <span className="text-base sm:text-lg font-bold font-mono text-white">3 200+</span>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Historique transparent
              </p>
            </div>
          </div>

        </div>

        {/* Filter Tabs & Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 relative z-10">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 font-mono text-xs scrollbar-none">
            <div className="flex items-center gap-1 text-slate-400 mr-2 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span className="text-[11px]">Filtrer :</span>
            </div>

            <button
              onClick={() => setActiveFilter('Tous')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 cursor-pointer ${
                activeFilter === 'Tous'
                  ? 'bg-[#00E5FF] text-[#030B16] shadow-md font-bold'
                  : 'bg-[#030B16] hover:bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              Tous ({reviews.length})
            </button>

            <button
              onClick={() => setActiveFilter('5_STARS')}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                activeFilter === '5_STARS'
                  ? 'bg-[#00E5FF] text-[#030B16] shadow-md font-bold'
                  : 'bg-[#030B16] hover:bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              <span>5 Étoiles</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </button>

            <button
              onClick={() => setActiveFilter('4_STARS')}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                activeFilter === '4_STARS'
                  ? 'bg-[#00E5FF] text-[#030B16] shadow-md font-bold'
                  : 'bg-[#030B16] hover:bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              <span>4 Étoiles</span>
            </button>

            <button
              onClick={() => setActiveFilter('HELPFUL')}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                activeFilter === 'HELPFUL'
                  ? 'bg-[#00E5FF] text-[#030B16] shadow-md font-bold'
                  : 'bg-[#030B16] hover:bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              Les plus utiles
            </button>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto font-mono text-xs">
            <span className="text-slate-400 mr-2 text-[11px]">
              {currentIndex + 1} / {filteredReviews.length}
            </span>
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-xl bg-[#030B16] hover:bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
              title="Avis précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-xl bg-[#030B16] hover:bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
              title="Avis suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Carousel Content Container */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative z-10 min-h-[220px]"
        >
          {filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Render 3 cards active window starting at currentIndex */}
              {[0, 1, 2].map((offset) => {
                const reviewIndex = (currentIndex + offset) % filteredReviews.length;
                const review = filteredReviews[reviewIndex];
                if (!review) return null;

                return (
                  <motion.div
                    key={`${review.id}-${reviewIndex}`}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-[#030B16] border rounded-[20px] p-5 flex flex-col justify-between shadow-lg transition-all duration-300 group ${
                      offset === 0 ? 'border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-slate-800 hover:border-[#00E5FF]/40'
                    }`}
                  >
                    <div>
                      {/* Top Row: User Avatar, Name, Flag, Badge */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 font-mono font-bold text-sm shadow-xs group-hover:border-amber-400 transition-colors">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-mono font-bold text-white text-sm">
                                {review.name}
                              </h3>
                              <span className="text-base" title={review.country}>
                                {review.flag}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 block">
                              {review.tenure}
                            </span>
                          </div>
                        </div>

                        {/* Verified Badge */}
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ${
                            review.badge === 'Top contributeur' 
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : review.badge === 'Abonné vérifié'
                              ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30'
                              : review.badge === 'Trader actif'
                              ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30'
                              : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{review.badge}</span>
                        </span>
                      </div>

                      {/* Stars Rating */}
                      <div className="flex items-center gap-1 mb-2.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                        <span className="text-[10px] font-mono text-slate-400 ml-1">
                          ({review.rating}/5)
                        </span>
                      </div>

                      {/* Review Comment Text */}
                      <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed line-clamp-4 italic mb-4">
                        "{review.comment}"
                      </p>
                    </div>

                    {/* Bottom Footer: Date & Helpful Count */}
                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] font-mono text-slate-400">
                      <span>{review.date}</span>

                      <button
                        onClick={() => handleToggleLike(review.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all cursor-pointer ${
                          likedReviews[review.id]
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-[#071426] hover:bg-slate-800 text-slate-300 border-slate-800'
                        }`}
                      >
                        <ThumbsUp className={`w-3 h-3 ${likedReviews[review.id] ? 'fill-current text-amber-400' : ''}`} />
                        <span>Utile ({review.helpfulCount})</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#030B16] border border-slate-800 rounded-2xl p-8 text-center text-slate-400 font-mono text-xs">
              Aucun avis correspondant aux critères de recherche.
            </div>
          )}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6 relative z-10">
          {filteredReviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'w-6 bg-amber-400'
                  : 'w-2 bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Avis page ${idx + 1}`}
            />
          ))}
        </div>

        {/* Trust Badges Footer Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono text-slate-300 relative z-10">
          <div className="flex items-center justify-center gap-2 bg-[#030B16] p-2.5 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            <span>100% Avis Vérifiés</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-[#030B16] p-2.5 rounded-xl border border-slate-800">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Mises à jour quotidiennes</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-[#030B16] p-2.5 rounded-xl border border-slate-800">
            <Globe className="w-4 h-4 text-[#00E5FF]" />
            <span>Traders d'Afrique & Europe</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-[#030B16] p-2.5 rounded-xl border border-slate-800">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Modération anti-spam</span>
          </div>
        </div>

      </div>

      {/* Modal: Submit New Review */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#071426] border border-[#00E5FF]/30 rounded-[24px] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden font-sans text-slate-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold font-mono text-white">Partager votre expérience</h3>
                </div>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold font-mono text-white">Avis transmis avec succès !</h4>
                  <p className="text-xs text-slate-300 font-sans max-w-sm mx-auto">
                    Merci pour votre retour. Votre avis apparaîtra sous peu dans la communauté après modération.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4 text-xs font-mono">
                  
                  {/* Rating selector */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Note globale :</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-amber-400 font-bold text-sm ml-2">{newRating} / 5</span>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Votre prénom ou pseudonyme :
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Samuel M."
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-[#030B16] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] font-sans"
                    />
                  </div>

                  {/* Country Selection */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Votre pays :</label>
                    <select
                      value={newCountry}
                      onChange={(e) => setNewCountry(e.target.value)}
                      className="w-full bg-[#030B16] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#00E5FF] font-sans"
                    >
                      <option value="🇨🇲 Cameroun">🇨🇲 Cameroun</option>
                      <option value="🇨🇮 Côte d'Ivoire">🇨🇮 Côte d'Ivoire</option>
                      <option value="🇸🇳 Sénégal">🇸🇳 Sénégal</option>
                      <option value="🇫🇷 France">🇫🇷 France</option>
                      <option value="🇲🇦 Maroc">🇲🇦 Maroc</option>
                      <option value="🇬🇦 Gabon">🇬🇦 Gabon</option>
                      <option value="🇧🇯 Bénin">🇧🇯 Bénin</option>
                      <option value="🇨🇬 Congo">🇨🇬 Congo</option>
                      <option value="🇹🇬 Togo">🇹🇬 Togo</option>
                      <option value="🌍 Autre Pays">🌍 Autre / International</option>
                    </select>
                  </div>

                  {/* Comment Text Area */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Votre commentaire :
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Partagez vos impressions sur la précision des signaux, les Stop Loss et le service..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full bg-[#030B16] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] font-sans text-xs leading-relaxed resize-none"
                    />
                  </div>

                  {/* Note info */}
                  <p className="text-[10px] text-slate-400 font-sans">
                    * Votre avis sera associé à votre statut d'abonné vérifié. Tous les retours sont modérés dans le respect des règles de notre communauté.
                  </p>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-amber-400 hover:bg-amber-300 text-[#030B16] font-mono font-bold py-3 px-4 rounded-xl text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-[#030B16]" />
                      <span>Publier mon avis</span>
                    </button>
                  </div>

                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
