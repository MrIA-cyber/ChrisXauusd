import React from 'react';
import { X, Calendar } from 'lucide-react';
import { EconomicCalendarView } from './EconomicCalendarView';

interface EconomicCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EconomicCalendarModal: React.FC<EconomicCalendarModalProps> = ({
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

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto cursor-pointer animate-fade-in font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#071426] text-slate-100 w-full max-w-4xl rounded-2xl border border-[#00E5FF]/30 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col cursor-default"
      >
        {/* Modal Header */}
        <div className="bg-[#030B16] border-b border-slate-800 p-3.5 sm:p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-mono text-white flex items-center gap-2">
                Calendrier Économique Macro XAU/USD
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Annonces haute volatilité & décisions de taux d'intérêt FED / BCE
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-5 overflow-y-auto flex-1">
          <EconomicCalendarView />
        </div>
      </div>
    </div>
  );
};
