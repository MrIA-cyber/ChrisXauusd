import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Sparkles,
  ArrowRight,
  Clock,
  Zap,
  Lock,
} from 'lucide-react';
import { formatFcfa, SUBSCRIPTION_PRICE_FCFA, generateActiveSubscription } from '../lib/subscriptionService';
import { UserSubscription, AuthUser } from '../types';

type MobileOperator = 'ORANGE' | 'MTN' | 'WAVE' | 'MOOV' | 'AIRTEL' | 'MPESA';

interface CountryOption {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  placeholder: string;
  recommendedOperators: MobileOperator[];
}

const AFRICAN_COUNTRIES: CountryOption[] = [
  { code: 'CI', name: "Côte d'Ivoire", dialCode: '+225', flag: '🇨🇮', placeholder: '07 00 00 00 00', recommendedOperators: ['ORANGE', 'MTN', 'WAVE', 'MOOV'] },
  { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳', placeholder: '77 000 00 00', recommendedOperators: ['ORANGE', 'WAVE', 'MTN', 'MOOV'] },
  { code: 'CM', name: 'Cameroun', dialCode: '+237', flag: '🇨🇲', placeholder: '6 00 00 00 00', recommendedOperators: ['ORANGE', 'MTN'] },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫', placeholder: '70 00 00 00', recommendedOperators: ['ORANGE', 'MOOV', 'WAVE'] },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱', placeholder: '70 00 00 00', recommendedOperators: ['ORANGE', 'MOOV'] },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬', placeholder: '90 00 00 00', recommendedOperators: ['MOOV', 'MTN'] },
  { code: 'BJ', name: 'Bénin', dialCode: '+229', flag: '🇧🇯', placeholder: '90 00 00 00', recommendedOperators: ['MTN', 'MOOV'] },
  { code: 'GN', name: 'Guinée', dialCode: '+224', flag: '🇬🇳', placeholder: '620 00 00 00', recommendedOperators: ['ORANGE', 'MTN'] },
  { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦', placeholder: '070 00 00 00', recommendedOperators: ['AIRTEL', 'MOOV'] },
  { code: 'CG', name: 'Congo', dialCode: '+242', flag: '🇨🇬', placeholder: '06 000 00 00', recommendedOperators: ['MTN', 'AIRTEL'] },
  { code: 'CD', name: 'RDC', dialCode: '+243', flag: '🇨🇩', placeholder: '810 000 000', recommendedOperators: ['AIRTEL', 'ORANGE', 'MPESA', 'MTN'] },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪', placeholder: '90 00 00 00', recommendedOperators: ['AIRTEL', 'ORANGE', 'MOOV'] },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', placeholder: '712 345 678', recommendedOperators: ['MPESA', 'AIRTEL'] },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', placeholder: '803 123 4567', recommendedOperators: ['MTN', 'AIRTEL'] },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭', placeholder: '24 123 4567', recommendedOperators: ['MTN', 'AIRTEL', 'WAVE'] },
  { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼', placeholder: '788 000 000', recommendedOperators: ['MTN', 'AIRTEL'] },
  { code: 'TZ', name: 'Tanzanie', dialCode: '+255', flag: '🇹🇿', placeholder: '712 345 678', recommendedOperators: ['MPESA', 'AIRTEL'] },
  { code: 'UG', name: 'Ouganda', dialCode: '+256', flag: '🇺🇬', placeholder: '772 000 000', recommendedOperators: ['MTN', 'AIRTEL'] },
  { code: 'MA', name: 'Maroc', dialCode: '+212', flag: '🇲🇦', placeholder: '6 00 00 00 00', recommendedOperators: ['ORANGE'] },
];

const ALL_OPERATORS: { id: MobileOperator; name: string }[] = [
  { id: 'ORANGE', name: 'Orange' },
  { id: 'MTN', name: 'MTN MoMo' },
  { id: 'WAVE', name: 'Wave' },
  { id: 'MOOV', name: 'Moov' },
  { id: 'AIRTEL', name: 'Airtel Money' },
  { id: 'MPESA', name: 'M-Pesa' },
];

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionActivated: (newSub: UserSubscription, userDetails?: { name: string; email: string }) => void;
  onSwitchToLogin: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscriptionActivated,
  onSwitchToLogin,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'MOBILE_MONEY' | 'CARD'>('MOBILE_MONEY');
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(AFRICAN_COUNTRIES[0]);
  const [mobileOperator, setMobileOperator] = useState<MobileOperator>('ORANGE');
  const [phone, setPhone] = useState<string>('07 00 00 00 00');
  const [fullName, setFullName] = useState<string>('Trader XAU');
  const [email, setEmail] = useState<string>('trader@xau-scalp.com');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate gateway API processing (1.8s)
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const activeSub = generateActiveSubscription(
        paymentMethod === 'MOBILE_MONEY'
          ? `Mobile Money (${mobileOperator} - ${selectedCountry.dialCode})`
          : 'Carte Bancaire'
      );

      setTimeout(() => {
        onSubscriptionActivated(activeSub, { name: fullName, email });
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative text-slate-900 font-sans">
        
        {/* Header Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono text-slate-900">
                ABONNEMENT CHRISXAUUSD
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">
                ChrisXauusd — Déblocage complet des signaux Or & journal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-mono text-emerald-700">
                  PAIEMENT VALIDÉ AVEC SUCCÈS !
                </h3>
                <p className="text-xs text-slate-700 font-mono">
                  Abonnement activé pour 30 jours ({formatFcfa(SUBSCRIPTION_PRICE_FCFA)}).
                </p>
                <p className="text-[11px] text-slate-500">
                  Bienvenue dans le terminal. Redirection vers les signaux en direct...
                </p>
              </div>
            </div>
          ) : isProcessing ? (
            <div className="py-12 text-center space-y-4 font-mono">
              <div className="w-12 h-12 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-blue-900">
                  Traitement de la transaction simulée...
                </p>
                <p className="text-xs text-slate-500">
                  Validation auprès de la passerelle Mobile Money / Carte ({formatFcfa(SUBSCRIPTION_PRICE_FCFA)})
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Pricing Callout Box */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-300">
                    TARIF UNIQUE ACCÈS TOTAL
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-mono text-blue-900 mt-1">
                    {formatFcfa(SUBSCRIPTION_PRICE_FCFA)}{' '}
                    <span className="text-xs font-normal text-slate-500 font-sans">/ mois</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Accès illimité aux signaux de scalping M1/M5 pendant 30 jours.
                  </p>
                </div>

                <div className="bg-white px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-mono space-y-1 text-slate-700 text-left w-full sm:w-auto shrink-0 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>Setups d'Entrée exacts</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>Stop Loss & Take Profits</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>Journal & Stats du Jour</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <form onSubmit={handleSimulatePayment} className="space-y-4">
                
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-700 flex items-center justify-between">
                    <span>SELECTIONNEZ LE MOYEN DE PAIEMENT :</span>
                    <span className="text-blue-600 text-[11px] font-semibold">Paiement Simulé (Démo)</span>
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('MOBILE_MONEY')}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-mono transition-all ${
                        paymentMethod === 'MOBILE_MONEY'
                          ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <span>Mobile Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD')}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-mono transition-all ${
                        paymentMethod === 'CARD'
                          ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>Carte Bancaire</span>
                    </button>
                  </div>
                </div>

                {/* Operator selector if Mobile Money */}
                {paymentMethod === 'MOBILE_MONEY' && (
                  <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                      <span>Opérateur Mobile Money :</span>
                      <span className="text-slate-400 text-[10px]">
                        Disponibles pour {selectedCountry.flag} {selectedCountry.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      {ALL_OPERATORS.map((op) => {
                        const isRecommended = selectedCountry.recommendedOperators.includes(op.id);
                        return (
                          <button
                            key={op.id}
                            type="button"
                            onClick={() => setMobileOperator(op.id)}
                            className={`py-2 px-1.5 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                              mobileOperator === op.id
                                ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                                : isRecommended
                                ? 'bg-white border-blue-200 text-slate-800 hover:bg-blue-50/50'
                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 opacity-80'
                            }`}
                          >
                            <span>{op.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* User Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-mono text-slate-600 block mb-1">
                      Nom complet :
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-slate-900 font-sans outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-600 block mb-1">
                      Adresse Email :
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-slate-900 font-sans outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-mono text-slate-600 block mb-1">
                      {paymentMethod === 'MOBILE_MONEY'
                        ? 'Pays d\'Afrique & Numéro Mobile Money :'
                        : 'Numéro de carte bancaire (Démo) :'}
                    </label>

                    {paymentMethod === 'MOBILE_MONEY' ? (
                      <div className="flex gap-2">
                        {/* Country Selector Dropdown */}
                        <div className="relative shrink-0 w-36 sm:w-44">
                          <select
                            value={selectedCountry.code}
                            onChange={(e) => {
                              const country = AFRICAN_COUNTRIES.find((c) => c.code === e.target.value) || AFRICAN_COUNTRIES[0];
                              setSelectedCountry(country);
                              if (!country.recommendedOperators.includes(mobileOperator)) {
                                setMobileOperator(country.recommendedOperators[0]);
                              }
                            }}
                            className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-2.5 py-2 text-slate-900 font-sans text-xs outline-none cursor-pointer truncate pr-6"
                          >
                            {AFRICAN_COUNTRIES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.flag} {c.dialCode} ({c.name})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Phone Number Input */}
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs outline-none"
                          placeholder={selectedCountry.placeholder}
                        />
                      </div>
                    ) : (
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-2 text-slate-900 font-mono outline-none"
                        placeholder="4500 0000 0000 0000"
                      />
                    )}
                  </div>
                </div>

                {/* Trigger Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 mt-2 font-mono"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Payer maintenant ({formatFcfa(SUBSCRIPTION_PRICE_FCFA)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>

              {/* Already Subscribed Redirect Link */}
              <div className="pt-2 border-t border-slate-200 text-center text-xs font-mono">
                <span className="text-slate-500">Vous possédez déjà un compte abonné ? </span>
                <button
                  onClick={onSwitchToLogin}
                  className="text-blue-600 font-bold hover:underline ml-1"
                >
                  Se connecter
                </button>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
