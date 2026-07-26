import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export const RiskWarningBanner: React.FC = () => {
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs px-4 py-2 flex items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full text-left">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="leading-tight">
          <span className="font-bold text-amber-900">AVERTISSEMENT DE RISQUE :</span>{' '}
          Le trading comporte un risque de perte en capital. Ces signaux sont fournis à titre informatif, pas comme un conseil en investissement.
        </p>
      </div>
      <div className="hidden md:flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300 shrink-0 font-medium">
        <Info className="w-3 h-3 text-amber-600" />
        <span>Données simulées • Démo</span>
      </div>
    </div>
  );
};
