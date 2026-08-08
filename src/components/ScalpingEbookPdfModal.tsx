import React from 'react';
import {
  BookOpen,
  Download,
  Printer,
  X,
  ShieldCheck,
  Zap,
  Flame,
  Award,
  TrendingUp,
  CheckCircle2,
  FileText,
  Lock,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface ScalpingEbookPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScalpingEbookPdfModal: React.FC<ScalpingEbookPdfModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Keyboard Escape listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto cursor-pointer animate-fade-in font-sans"
    >
      {/* Container - Printable Target */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#071426] text-slate-100 w-full max-w-4xl rounded-2xl border border-[#00E5FF]/30 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none cursor-default"
      >
        
        {/* Top Header Controls (Hidden when printing) */}
        <div className="p-4 bg-[#030B16] text-white flex items-center justify-between border-b border-[#00E5FF]/30 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#00E5FF]" />
            <span className="font-mono font-bold text-sm sm:text-base text-white">
              Livre Masterclass & Manuel Officiel (PDF)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
              ÉDITION VIP 2026
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPdf}
              className="px-3.5 py-1.5 rounded-xl bg-[#00E5FF] hover:bg-[#00E5FF]/80 text-[#030B16] font-mono font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              title="Télécharger ou imprimer en PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Télécharger PDF / Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ebook Printable Content Area */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-10 font-sans print:p-0 print:overflow-visible text-slate-200">
          
          {/* COVER PAGE / HEADER BANNER */}
          <div className="bg-gradient-to-br from-[#030B16] via-[#071426] to-[#030B16] text-white rounded-2xl p-8 sm:p-12 border border-[#00E5FF]/40 shadow-xl relative overflow-hidden text-center space-y-4 print:rounded-none print:border-b-2 print:border-[#00E5FF] print:bg-[#030B16] print:text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>MANUEL OFFICIEL D'UTILISATION & GUIDE DE TRADING</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-[#00E5FF] tracking-tight leading-tight">
              CHRISXAUUSD TERMINAL SCALPING PRO
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-mono">
              Le Livre Masterclass Ultime sur le Scalping M1/M5 de l'Or (XAU/USD) : Stratégie Institutionnelle, Algorithme de Confluence & Money Management Strict.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400 border-t border-[#00E5FF]/15">
              <span>Auteur : <strong>Chris (Lead Trader XAU/USD)</strong></span>
              <span>•</span>
              <span>Format : <strong>Manuel Pédagogique PDF</strong></span>
              <span>•</span>
              <span>Version : <strong>4.8 VIP Scalp Engine</strong></span>
            </div>
          </div>

          {/* TABLE OF CONTENTS */}
          <div className="bg-[#030B16] p-6 rounded-2xl border border-[#00E5FF]/20 space-y-3 font-mono print:border-slate-700">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#00E5FF] flex items-center gap-2">
              <FileText className="w-4 h-4" /> Sommaire du Manuel Masterclass
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="p-2 rounded bg-[#071426] border border-[#00E5FF]/15">
                <strong>Chapitre 1 :</strong> Architecture & Philosophie M1/M5
              </div>
              <div className="p-2 rounded bg-[#071426] border border-[#00E5FF]/15">
                <strong>Chapitre 2 :</strong> Les 5 Confluences & Score de Conviction
              </div>
              <div className="p-2 rounded bg-[#071426] border border-[#00E5FF]/15">
                <strong>Chapitre 3 :</strong> Stop Loss Ultra-Serré & Ratio R:R Asymétrique
              </div>
              <div className="p-2 rounded bg-[#071426] border border-[#00E5FF]/15">
                <strong>Chapitre 4 :</strong> Maîtrise des Chocs Économiques (CPI, NFP, FED)
              </div>
              <div className="p-2 rounded bg-[#071426] border border-[#00E5FF]/15">
                <strong>Chapitre 5 :</strong> Journal de Trading & Psychologie VIP
              </div>
              <div className="p-2 rounded bg-[#071426] border border-[#00E5FF]/15">
                <strong>Chapitre 6 :</strong> Exécution sur MT4 / MT5 / cTrader
              </div>
            </div>
          </div>

          {/* CHAPTER 1 */}
          <section className="space-y-3 print:break-inside-avoid">
            <div className="flex items-center gap-2 border-b border-[#00E5FF]/30 pb-2">
              <span className="p-1.5 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] font-mono font-black text-sm">01</span>
              <h2 className="text-lg font-bold text-white font-mono">
                Architecture & Philosophie M1/M5 du Terminal
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              Le scalping sur l’Or (XAU/USD) requiert une précision chirurgicale. Contrairement aux devises Forex classiques, XAU/USD présente une volatilité élevée et des mouvements impulsionnels rapides. L’application <strong>ChrisXauusd Terminal Scalping Pro</strong> est conçue pour exploiter les micros-inefficacités de marché dans les unités de temps M1 et M5 en associant le concept <em>Smart Money Concepts (SMC)</em> à la détection de liquidité institutionnelle.
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1 text-slate-300">
              <li><strong>Unités de temps privilégiées :</strong> M1 (entrées millimétrées) et M5 (validation de tendance micro).</li>
              <li><strong>Objectif :</strong> Capturer des mouvements de +25 à +50 pips avec un risque controlled de 10 à 15 pips.</li>
              <li><strong>Vitesse d'exécution :</strong> Prise de décision rapide sans hésitation basée sur des critères algorithmiques objectifs.</li>
            </ul>
          </section>

          {/* CHAPTER 2 */}
          <section className="space-y-3 print:break-inside-avoid">
            <div className="flex items-center gap-2 border-b border-[#00E5FF]/30 pb-2">
              <span className="p-1.5 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] font-mono font-black text-sm">02</span>
              <h2 className="text-lg font-bold text-white font-mono">
                Les 5 Critères de Confluence & Taux de Conviction (%)
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              Chaque ticket de trade généré par le terminal est audité selon <strong>5 piliers de confirmation institutionnels</strong>. La présence simultanée de ces éléments produit un score (ex: 5/5) et un pourcentage de conviction (ex: 85% - 96%) :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#030B16] border border-[#00E5FF]/20 space-y-1">
                <span className="font-bold text-[#00E5FF]">1. Liquidity Sweep M1/M5</span>
                <p className="text-[11px] text-slate-400">Purge des Stops vendeurs ou acheteurs au-dessus/en-dessous des sommets/creux récents.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#030B16] border border-[#00E5FF]/20 space-y-1">
                <span className="font-bold text-[#00E5FF]">2. Mitigation Order Block (OB)</span>
                <p className="text-[11px] text-slate-400">Rebond précis sur la zone de commande institutionnelle non testée.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#030B16] border border-[#00E5FF]/20 space-y-1">
                <span className="font-bold text-[#00E5FF]">3. Corrélation Inverse DXY (Dollar)</span>
                <p className="text-[11px] text-slate-400">Baisse de l'Indice du Dollar américain confirmant la poussée haussière du XAU/USD.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#030B16] border border-[#00E5FF]/20 space-y-1">
                <span className="font-bold text-[#00E5FF]">4. Alignement EMA 200 / Trend</span>
                <p className="text-[11px] text-slate-400">Trade pris strictement dans le sens du flux dynamique dominant M5/M15.</p>
              </div>
            </div>
          </section>

          {/* CHAPTER 3 */}
          <section className="space-y-3 print:break-inside-avoid">
            <div className="flex items-center gap-2 border-b border-[#00E5FF]/30 pb-2">
              <span className="p-1.5 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] font-mono font-black text-sm">03</span>
              <h2 className="text-lg font-bold text-white font-mono">
                Money Management & Stop Loss Ultra-Serré
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              Le secret de la rentabilité constante réside dans l'asymétrie entre le risque et la récompense. Le terminal applique une règle stricte :
            </p>
            <div className="bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-xl p-4 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-[#00E5FF] font-bold">
                <span>SL STRICT : 10 à 15 pips MAX</span>
                <span>RATIO R:R : 1:2.2 à 1:3.5</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Un Stop Loss serré de 12 pips combiné à un Take Profit de 30 à 45 pips vous permet d’être très largement profitable même avec un taux de réussite de 50%.
              </p>
            </div>
          </section>

          {/* CHAPTER 4 */}
          <section className="space-y-3 print:break-inside-avoid">
            <div className="flex items-center gap-2 border-b border-[#00E5FF]/30 pb-2">
              <span className="p-1.5 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] font-mono font-black text-sm">04</span>
              <h2 className="text-lg font-bold text-white font-mono">
                Annonces Macroéconomiques & Calendrier Réel
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              L’Or réagit violemment aux statistiques américaines (CPI, NFP, Décisions de taux de la FED). L’onglet <strong>Calendrier Économique Réel</strong> intégré au profil permet d’anticiper chaque événement :
            </p>
            <div className="bg-[#030B16] p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
              <div className="text-[#EF4444] font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4" /> Règle d'Or en Haute Volatilité :
              </div>
              <p className="text-slate-300 text-[11px]">
                Ne jamais ouvrir un nouveau scalp 15 minutes avant ou 10 minutes après une publication à impact rouge (CPI ou NFP). Laissez le premier mouvement de slippage passer avant d'intervenir.
              </p>
            </div>
          </section>

          {/* CHAPTER 5 & 6 */}
          <section className="space-y-3 print:break-inside-avoid">
            <div className="flex items-center gap-2 border-b border-[#00E5FF]/30 pb-2">
              <span className="p-1.5 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] font-mono font-black text-sm">05</span>
              <h2 className="text-lg font-bold text-white font-mono">
                Exécution Rapide sur MetaTrader 4 / MetaTrader 5 / cTrader
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              Pour copier un signal instantanément :
            </p>
            <ol className="list-decimal pl-5 text-xs sm:text-sm space-y-1.5 text-slate-300">
              <li>Cliquez sur le bouton <strong>"Copier Ticket MT4/MT5"</strong> dans le terminal.</li>
              <li>Dans votre plateforme de courtier, collez les coordonnées pré-calculées : Prix d'entrée, Stop Loss et Take Profit.</li>
              <li>Ajustez votre taille de lot (ex: 0.10 lot pour un compte de 1 000 $) conformément à la règle de risque de 1%.</li>
            </ol>
          </section>

          {/* FOOTER SIGNATURE */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-2 print:border-t-2">
            <div>© 2026 ChrisXauusd Terminal Scalping Pro — Tous Droits Réservés</div>
            <div className="text-[#00E5FF] font-bold">Trading Haute Précision XAU/USD</div>
          </div>

        </div>

        {/* Modal Footer Controls (Hidden when printing) */}
        <div className="p-4 bg-[#030B16] border-t border-[#00E5FF]/20 flex items-center justify-between shrink-0 print:hidden">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            💡 Astuce : Vous pouvez enregistrer ce livre directement au format PDF via la boîte de dialogue d'impression.
          </span>
          <button
            onClick={handlePrintPdf}
            className="ml-auto px-4 py-2 rounded-xl bg-[#00E5FF] hover:bg-[#00E5FF]/80 text-[#030B16] font-mono font-black text-xs flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Imprimer / Enregistrer en PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
