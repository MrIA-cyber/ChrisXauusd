import React from 'react';

interface ChrisXauusdLogoIconProps {
  className?: string;
  size?: number | string;
}

/**
 * Iconic Logo Badge for ChrisXauusd
 * Features:
 * - Rounded square with diagonal blue gradient (#1E6FBE -> #0C447C)
 * - 2 Japanese Candlestick bars (White & Light Blue #BFDBFE)
 * - Overlay "C" stylized letter at the bottom
 */
export const ChrisXauusdLogoIcon: React.FC<ChrisXauusdLogoIconProps> = ({
  className = 'w-[70px] h-[70px] sm:w-[100px] sm:h-[100px]',
}) => {
  return (
    <div className={`relative shrink-0 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="chrisXauBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E6FBE" />
            <stop offset="100%" stopColor="#0C447C" />
          </linearGradient>
          <filter id="cLetterShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#062847" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Outer Rounded Container */}
        <rect width="100" height="100" rx="24" fill="url(#chrisXauBgGradient)" />
        
        {/* Subtle inner highlight border */}
        <rect
          x="1"
          y="1"
          width="98"
          height="98"
          rx="23"
          stroke="#FFFFFF"
          strokeOpacity="0.2"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Candlestick 1 (Bullish - Crisp White) */}
        <g id="candlestick-white">
          <line x1="36" y1="18" x2="36" y2="62" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="29" y="28" width="14" height="24" rx="3" fill="#FFFFFF" />
        </g>

        {/* Candlestick 2 (Bearish - Light Blue #BFDBFE) */}
        <g id="candlestick-lightblue">
          <line x1="64" y1="24" x2="64" y2="70" stroke="#BFDBFE" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="57" y="34" width="14" height="26" rx="3" fill="#BFDBFE" />
        </g>

        {/* Overlay "C" Letter at bottom center */}
        <text
          x="50"
          y="85"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="27"
          fontWeight="900"
          fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          filter="url(#cLetterShadow)"
          letterSpacing="-0.5"
        >
          C
        </text>
      </svg>
    </div>
  );
};

/**
 * Full Onboarding Logo Section Component
 * Styled with soft background gradient (white -> #E6F1FB), rounded corners, wordmark, tagline, separator, and subtext.
 */
export const ChrisXauusdHomeLogo: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-white via-[#E6F1FB]/80 to-[#E6F1FB] border border-[#B9D6F2]/70 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-xl w-full mx-auto text-center flex flex-col items-center justify-center shadow-xs space-y-3.5 transition-all">
      
      {/* Crafted Icon (~100px desktop, ~70px mobile) */}
      <ChrisXauusdLogoIcon className="w-[70px] h-[70px] sm:w-[100px] sm:h-[100px]" />

      {/* Wordmark & Tagline Group */}
      <div className="space-y-1">
        <h1 className="text-[20px] sm:text-[26px] font-black text-[#0C447C] font-mono tracking-tight leading-tight">
          ChrisXauusd
        </h1>
        <p className="text-[12px] sm:text-[14px] font-bold text-[#185FA5] uppercase tracking-[0.2em] font-mono">
          SIGNAUX DE TRADING OR
        </p>
      </div>

      {/* Separator Line (~120px wide, #B9D6F2) */}
      <div className="w-[120px] h-[1.5px] bg-[#B9D6F2] mx-auto my-1.5" />

      {/* Subtext */}
      <p className="text-[12px] text-[#5B87AC] font-mono font-medium">
        XAU/USD · Scalping M1/M5
      </p>
    </div>
  );
};
