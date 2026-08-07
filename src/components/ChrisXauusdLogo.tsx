import React, { useState } from 'react';
import { Copy, Check, Shield, Award, Sparkles, Download, Layers } from 'lucide-react';

export type LogoVariant = 'dark' | 'light' | 'transparent' | 'gold';

interface ChrisXauusdLogoIconProps {
  className?: string;
  variant?: LogoVariant;
  size?: number | string;
}

/**
 * NEW LUXURY FINANCIAL LOGO EMBLEM FOR CHRISXAUUSD
 * Features:
 * - Minimalist "CX" Interlocking Geometric Monogram
 * - Gold Ingot Faceted 'C' (XAU/Gold theme)
 * - Ascending Financial Arrow & Precision Vector 'X'
 * - Emerald Green Precision Execution Spark (#10B981)
 * - Deep Midnight Navy & Onyx Black Premium Background
 */
export const ChrisXauusdLogoIcon: React.FC<ChrisXauusdLogoIconProps> = ({
  className = 'w-10 h-10',
  variant = 'dark',
}) => {
  // Variant styling for the outer squircle container
  const getContainerStyle = () => {
    switch (variant) {
      case 'light':
        return 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-500/40 shadow-md shadow-amber-500/10';
      case 'transparent':
        return 'bg-transparent';
      case 'gold':
        return 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 border border-amber-300 shadow-lg shadow-amber-500/20';
      case 'dark':
      default:
        return 'bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-[#030712] border border-amber-500/30 shadow-lg shadow-black/60';
    }
  };

  return (
    <div className={`relative shrink-0 rounded-[22%] flex items-center justify-center overflow-hidden transition-all duration-300 ${getContainerStyle()} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-[8%]"
      >
        <defs>
          {/* Gold Metallic Gradients */}
          <linearGradient id="cxGoldPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE899" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          <linearGradient id="cxGoldAccent" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Deep Midnight Navy Gradients */}
          <linearGradient id="cxNavyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Emerald Green Precision Vector Gradient */}
          <linearGradient id="cxEmeraldVector" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </linearGradient>

          {/* Glow & Shadow Filters */}
          <filter id="cxGlowEmerald" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#10B981" floodOpacity="0.7" />
          </filter>

          <filter id="cxGlowGold" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#F59E0B" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* SUBTLE BACKGROUND GEOMETRIC PATTERN (Financial Grid Lines) */}
        <g opacity="0.12">
          <line x1="10" y1="50" x2="90" y2="50" stroke="#F59E0B" strokeWidth="0.75" strokeDasharray="2 3" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="#F59E0B" strokeWidth="0.75" strokeDasharray="2 3" />
          <circle cx="50" cy="50" r="36" stroke="#F59E0B" strokeWidth="0.75" strokeDasharray="3 3" />
        </g>

        {/* --- GEOMETRIC MONOGRAM 'CX' --- */}

        {/* 1. LETTER 'C' - Faceted Gold Crescent */}
        <path
          d="M 56 20 
             C 32 20, 18 34, 18 50 
             C 18 66, 32 80, 56 80 
             L 56 68 
             C 39 68, 30 59, 30 50 
             C 30 41, 39 32, 56 32 
             Z"
          fill="url(#cxGoldPrimary)"
          filter="url(#cxGlowGold)"
        />

        {/* Inner Gold Highlight Facet on 'C' */}
        <path
          d="M 56 20 
             C 34 20, 22 34, 22 50 
             C 22 52, 22.2 54, 22.5 56 
             C 24 43, 34 32, 56 32 
             Z"
          fill="url(#cxGoldAccent)"
          opacity="0.9"
        />

        {/* 2. LETTER 'X' - Descending Midnight Ray */}
        <path
          d="M 46 22 
             L 74 78 
             L 84 78 
             L 56 22 
             Z"
          fill="url(#cxNavyGradient)"
          stroke="#38BDF8"
          strokeWidth="0.5"
          opacity="0.9"
        />

        {/* 3. LETTER 'X' - Ascending Financial Bullish Vector (Emerald + Gold Arrow) */}
        {/* Main Shaft from bottom left to top right */}
        <path
          d="M 38 78 
             L 76 26"
          stroke="url(#cxEmeraldVector)"
          strokeWidth="7"
          strokeLinecap="round"
          filter="url(#cxGlowEmerald)"
        />

        {/* Gold Accent Overlay Shaft */}
        <path
          d="M 38 78 
             L 60 48"
          stroke="url(#cxGoldPrimary)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Ascending Market Arrow Tip (Flèche Ascendante - Precision Entry) */}
        <path
          d="M 64 22 L 82 22 L 82 40 Z"
          fill="url(#cxEmeraldVector)"
          filter="url(#cxGlowEmerald)"
        />

        {/* 4. EMERALD PRECISION SPARK (Center Intersection Diamond) */}
        <polygon
          points="56,42 62,48 56,54 50,48"
          fill="#34D399"
          filter="url(#cxGlowEmerald)"
        />
        <polygon
          points="56,44 60,48 56,52 52,48"
          fill="#FFFFFF"
        />

        {/* 5. TOP RIGHT ACCENT DOT (XAU Precision Market Indicator) */}
        <circle cx="82" cy="18" r="3" fill="#34D399" filter="url(#cxGlowEmerald)" />
      </svg>
    </div>
  );
};

interface ChrisXauusdHorizontalLogoProps {
  className?: string;
  variant?: LogoVariant;
  showTagline?: boolean;
}

/**
 * HORIZONTAL LOGOTYPE VERSION
 * Ideal for headers, navigation bars, banners, and social signatures.
 */
export const ChrisXauusdHorizontalLogo: React.FC<ChrisXauusdHorizontalLogoProps> = ({
  className = '',
  variant = 'dark',
  showTagline = true,
}) => {
  const isDark = variant === 'dark' || variant === 'transparent';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* CX Emblem */}
      <ChrisXauusdLogoIcon className="w-9 h-9 sm:w-10 sm:h-10" variant={variant} />

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-black font-mono tracking-tight text-base sm:text-lg leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
            CHRIS<span className="text-amber-500">XAUUSD</span>
          </span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30 uppercase tracking-widest">
            PRO
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] font-mono font-bold text-amber-500/90 tracking-wider uppercase">
              Signaux Or XAU/USD
            </span>
            <span className="text-slate-500 text-[10px]">•</span>
            <span className="text-[10px] font-mono font-bold text-emerald-500 flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              PRECISION
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * HOME / ONBOARDING HERO SHOWCASE LOGO CARD
 */
export const ChrisXauusdHomeLogo: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-[#0B0F19] via-[#0F172A] to-[#030712] border border-amber-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-xl w-full mx-auto text-center flex flex-col items-center justify-center shadow-2xl shadow-black/80 space-y-4 relative overflow-hidden group">
      
      {/* Background Gold Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/15 transition-all" />
      <div className="absolute bottom-0 right-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Brand Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Nouveau Branding Officiel</span>
      </div>

      {/* Crafted Monogram Icon (~90px desktop, ~70px mobile) */}
      <ChrisXauusdLogoIcon className="w-[72px] h-[72px] sm:w-[96px] sm:h-[96px] shadow-2xl" variant="dark" />

      {/* Wordmark & Tagline Group */}
      <div className="space-y-1 z-10">
        <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight leading-tight flex items-center justify-center gap-2">
          <span>CHRIS</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">
            XAUUSD
          </span>
        </h1>
        <p className="text-xs sm:text-sm font-bold text-amber-400/90 uppercase tracking-[0.25em] font-mono">
          SIGNAUX DE TRADING OR & HAUTE PRÉCISION
        </p>
      </div>

      {/* Separator Line */}
      <div className="w-32 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto my-1" />

      {/* Subtext */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-mono font-medium">
        <span>XAU/USD</span>
        <span className="text-amber-500/60">•</span>
        <span>Scalping M1/M5</span>
        <span className="text-amber-500/60">•</span>
        <span className="text-emerald-400 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Direct Signal
        </span>
      </div>
    </div>
  );
};

/**
 * COMPLETE LOGO BRAND SHOWCASE COMPONENT
 * Presents all 5 official brand logo versions requested by user:
 * 1. Fond Sombre (Dark Background)
 * 2. Fond Clair (Light Background)
 * 3. Fond Transparent (Transparent Background)
 * 4. Version Carrée (App Icon / Profil)
 * 5. Version Horizontale (Header & Banner)
 */
export const LogoBrandShowcase: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 max-w-5xl mx-auto my-8 text-white font-sans shadow-2xl">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Charte Graphique Officielle 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
            Nouveau Logo ChrisXauusd — Monogramme CX
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Identité visuelle haut de gamme inspirée de la finance internationale, des lingots d'or (XAU) et de la précision d'exécution des signaux de trading.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-amber-400 bg-amber-950/40 border border-amber-800/50 px-3 py-2 rounded-xl shrink-0">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Design Certifié V2.4</span>
        </div>
      </div>

      {/* Grid of 5 Versions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Version 1: Fond Sombre */}
        <div className="bg-[#0B0F19] border border-amber-500/30 rounded-2xl p-6 flex flex-col items-center text-center space-y-4 relative group hover:border-amber-400 transition-all shadow-lg">
          <span className="absolute top-3 left-3 text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-700/50 px-2 py-0.5 rounded-full">
            1. Fond Sombre
          </span>
          <div className="pt-6">
            <ChrisXauusdLogoIcon className="w-20 h-20 shadow-2xl" variant="dark" />
          </div>
          <div className="space-y-1">
            <h4 className="font-mono font-bold text-sm text-white">Dark Onyx & Gold</h4>
            <p className="text-xs text-slate-400">Pour terminaux, web-app sombre et vidéos</p>
          </div>
          <button
            onClick={() => handleCopy(1, 'ChrisXauusd Logo - Version Dark')}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedIndex === 1 ? 'Copié !' : 'Exporter Fond Sombre'}</span>
          </button>
        </div>

        {/* Version 2: Fond Clair */}
        <div className="bg-slate-100 border border-slate-300 rounded-2xl p-6 flex flex-col items-center text-center space-y-4 relative group hover:border-blue-500 transition-all shadow-lg text-slate-900">
          <span className="absolute top-3 left-3 text-[10px] font-mono font-bold text-blue-700 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded-full">
            2. Fond Clair
          </span>
          <div className="pt-6">
            <ChrisXauusdLogoIcon className="w-20 h-20 shadow-md" variant="light" />
          </div>
          <div className="space-y-1">
            <h4 className="font-mono font-bold text-sm text-slate-900">Pure Light Contrast</h4>
            <p className="text-xs text-slate-600">Pour documents PDF, factures et impressions</p>
          </div>
          <button
            onClick={() => handleCopy(2, 'ChrisXauusd Logo - Version Light')}
            className="w-full py-2 bg-white hover:bg-slate-50 text-xs font-mono text-slate-800 rounded-xl border border-slate-300 flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedIndex === 2 ? 'Copié !' : 'Exporter Fond Clair'}</span>
          </button>
        </div>

        {/* Version 3: Fond Transparent */}
        <div className="bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center space-y-4 relative group hover:border-emerald-500 transition-all shadow-lg">
          <span className="absolute top-3 left-3 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-2 py-0.5 rounded-full">
            3. Fond Transparent (PNG/SVG)
          </span>
          <div className="pt-6">
            <ChrisXauusdLogoIcon className="w-20 h-20" variant="transparent" />
          </div>
          <div className="space-y-1">
            <h4 className="font-mono font-bold text-sm text-white">Transparent Vector</h4>
            <p className="text-xs text-slate-400">Pour superposition sur n'importe quel visuel</p>
          </div>
          <button
            onClick={() => handleCopy(3, 'ChrisXauusd Logo - Version Transparent')}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedIndex === 3 ? 'Copié !' : 'Exporter Transparent'}</span>
          </button>
        </div>

        {/* Version 4: Version Carrée / Icône d'Application */}
        <div className="bg-[#030712] border border-amber-500/40 rounded-2xl p-6 flex flex-col items-center text-center space-y-4 relative group hover:border-amber-300 transition-all shadow-lg">
          <span className="absolute top-3 left-3 text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-600/50 px-2 py-0.5 rounded-full">
            4. App Icon & Profil (1:1)
          </span>
          <div className="pt-6 flex items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-2xl shadow-amber-500/20">
              <div className="w-full h-full bg-[#0B0F19] rounded-[22px] flex items-center justify-center p-2">
                <ChrisXauusdLogoIcon className="w-full h-full" variant="transparent" />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="font-mono font-bold text-sm text-white">Square App Emblem</h4>
            <p className="text-xs text-slate-400">Pour réseaux sociaux, Telegram & PWA</p>
          </div>
          <button
            onClick={() => handleCopy(4, 'ChrisXauusd Logo - Version Carrée App Icon')}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            {copiedIndex === 4 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedIndex === 4 ? 'Copié !' : 'Exporter Icône Profil'}</span>
          </button>
        </div>

        {/* Version 5: Version Horizontale Logotype */}
        <div className="md:col-span-2 bg-[#0B0F19] border border-amber-500/30 rounded-2xl p-6 flex flex-col items-center justify-between text-center space-y-4 relative group hover:border-amber-400 transition-all shadow-lg">
          <span className="absolute top-3 left-3 text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-700/50 px-2 py-0.5 rounded-full">
            5. Logotype Horizontal (Header / Web)
          </span>
          <div className="pt-6 pb-2">
            <ChrisXauusdHorizontalLogo variant="dark" />
          </div>
          <div className="space-y-1">
            <h4 className="font-mono font-bold text-sm text-white">Full Horizontal Brandmark</h4>
            <p className="text-xs text-slate-400">Pour en-tête de site, bannières et signatures officielles</p>
          </div>
          <button
            onClick={() => handleCopy(5, 'ChrisXauusd Logo - Version Horizontale')}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            {copiedIndex === 5 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedIndex === 5 ? 'Copié !' : 'Exporter Logotype Horizontal'}</span>
          </button>
        </div>

      </div>

      {/* Palette Color Specification Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-around gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-[#0B0F19] border border-slate-700 inline-block" />
          <span>Noir Onyx (#0B0F19)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-amber-500 border border-amber-300 inline-block" />
          <span>Or Métallique (#F59E0B)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-[#0F172A] border border-blue-500 inline-block" />
          <span>Bleu Nuit (#0F172A)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-emerald-500 border border-emerald-300 inline-block" />
          <span>Vert Émeraude (#10B981)</span>
        </div>
      </div>
    </div>
  );
};
