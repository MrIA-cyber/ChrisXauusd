import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, CheckCircle2 } from 'lucide-react';
import { useLongPress } from '../lib/useLongPress';

interface ChrisBioBubbleProps {
  isVisible: boolean;
  onClose: () => void;
  profileType?: 'VISITOR' | 'TRADER' | null;
  onTriggerSecretAdmin?: () => void;
}

export const ChrisBioBubble: React.FC<ChrisBioBubbleProps> = ({
  isVisible,
  onClose,
  profileType,
  onTriggerSecretAdmin,
}) => {
  const { isPressing, progress, handlers } = useLongPress({
    onLongPress: () => {
      if (onTriggerSecretAdmin) onTriggerSecretAdmin();
    },
    ms: 5000,
  });

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        if (!isPressing) {
          onClose();
        }
      }, 5500); // Allow enough time for 5s long press if active

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, isPressing]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="pointer-events-auto bg-white border border-blue-200 rounded-2xl p-3.5 sm:p-4 shadow-xl shadow-blue-950/15 flex items-start gap-3 relative text-slate-900 font-sans backdrop-blur-sm"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-2.5 right-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Fermer la bulle"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Avatar Circle with Initial "C" and Long Press Gesture */}
            <div
              {...handlers}
              className="relative shrink-0 mt-0.5 cursor-pointer select-none group"
              title="Trader Lead Profile"
            >
              <div className="w-11 h-11 rounded-full bg-blue-900 text-white border-2 border-blue-200 font-mono font-black text-lg flex items-center justify-center shadow-md shadow-blue-900/20">
                C
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
              </div>

              {isPressing && (
                <svg className="absolute -inset-1 w-[52px] h-[52px] pointer-events-none z-20">
                  <circle
                    cx="26"
                    cy="26"
                    r="23"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeDasharray="145"
                    strokeDashoffset={145 - (145 * progress) / 100}
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>

            {/* Bio Content */}
            <div className="pr-6 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold font-mono text-sm text-slate-900">
                  Chris Pokam
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-600" />
                  <span>Fondateur</span>
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-snug font-sans">
                Fondateur Chris Pokam, génie des temps modernes.{' '}
                <span className="text-blue-700 font-medium">
                  {profileType === 'TRADER'
                    ? 'Ravi de vous compter parmi nos Traders !'
                    : 'Bienvenue sur ChrisXauusd !'}
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
