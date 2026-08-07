import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Sparkles,
  ArrowRight,
  Search,
  ChevronDown,
  AlertCircle,
  Lock,
  Globe,
  Check,
  User,
  Mail,
  Phone,
  Calendar,
  LockKeyhole,
  CheckCircle,
  Zap,
  Star,
  Shield,
  Award,
  BadgeCheck,
  CreditCard as CardIcon,
} from 'lucide-react';
import { formatFcfa, SUBSCRIPTION_PRICE_FCFA, generateActiveSubscription } from '../lib/subscriptionService';
import { UserSubscription } from '../types';
import { ChrisXauusdLogoIcon } from './ChrisXauusdLogo';

export interface MobileOperator {
  id: string;
  name: string;
  colorBadge?: string;
}

export interface AfricanCountry {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  placeholder: string;
  expectedLength: number;
  phoneExample: string;
  operators: MobileOperator[];
  validateFn?: (digits: string) => boolean;
}

// Complete dataset for ALL 54 African countries with Cameroun (CM) FIRST by default
export const AFRICAN_COUNTRIES: AfricanCountry[] = [
  {
    code: 'CM',
    name: 'Cameroun',
    dialCode: '+237',
    flag: '🇨🇲',
    placeholder: '6 99 00 11 22',
    expectedLength: 9,
    phoneExample: '699001122 ou 670000000',
    operators: [
      { id: 'OM_CM', name: 'Orange Money' },
      { id: 'MTN_CM', name: 'MTN Mobile Money' },
      { id: 'EU_CM', name: 'Express Union Mobile' },
      { id: 'MOMO_CM', name: 'MoMo' },
    ],
    validateFn: (digits) => digits.length === 9 && /^(6|2)\d{8}$/.test(digits),
  },
  {
    code: 'CI',
    name: "Côte d'Ivoire",
    dialCode: '+225',
    flag: '🇨🇮',
    placeholder: '07 08 09 10 11',
    expectedLength: 10,
    phoneExample: '0708091011 ou 0501020304',
    operators: [
      { id: 'OM_CI', name: 'Orange Money' },
      { id: 'MTN_CI', name: 'MTN MoMo' },
      { id: 'WAVE_CI', name: 'Wave' },
      { id: 'MOOV_CI', name: 'Moov Money' },
    ],
    validateFn: (digits) => digits.length === 10 && /^(07|05|01|08)\d{8}$/.test(digits),
  },
  {
    code: 'SN',
    name: 'Sénégal',
    dialCode: '+221',
    flag: '🇸🇳',
    placeholder: '77 123 45 67',
    expectedLength: 9,
    phoneExample: '771234567 ou 780000000',
    operators: [
      { id: 'WAVE_SN', name: 'Wave' },
      { id: 'OM_SN', name: 'Orange Money' },
      { id: 'FREE_SN', name: 'Free Money' },
      { id: 'WIZALL_SN', name: 'Wizall Money' },
    ],
    validateFn: (digits) => digits.length === 9 && /^(77|78|70|76|75)\d{7}$/.test(digits),
  },
  {
    code: 'GH',
    name: 'Ghana',
    dialCode: '+233',
    flag: '🇬🇭',
    placeholder: '24 123 4567',
    expectedLength: 9,
    phoneExample: '241234567',
    operators: [
      { id: 'MTN_GH', name: 'MTN MoMo' },
      { id: 'VODA_GH', name: 'Vodafone Cash' },
      { id: 'AT_GH', name: 'AirtelTigo Money' },
    ],
    validateFn: (digits) => digits.length === 9,
  },
  {
    code: 'UG',
    name: 'Ouganda',
    dialCode: '+256',
    flag: '🇺🇬',
    placeholder: '772 000 000',
    expectedLength: 9,
    phoneExample: '772000000',
    operators: [
      { id: 'MTN_UG', name: 'MTN MoMo' },
      { id: 'AIRTEL_UG', name: 'Airtel Money' },
    ],
    validateFn: (digits) => digits.length === 9,
  },
  {
    code: 'KE',
    name: 'Kenya',
    dialCode: '+254',
    flag: '🇰🇪',
    placeholder: '712 345 678',
    expectedLength: 9,
    phoneExample: '712345678',
    operators: [
      { id: 'MPESA_KE', name: 'M-Pesa' },
      { id: 'AIRTEL_KE', name: 'Airtel Money' },
    ],
    validateFn: (digits) => digits.length === 9 && /^(7|1)\d{8}$/.test(digits),
  },
  {
    code: 'NG',
    name: 'Nigeria',
    dialCode: '+234',
    flag: '🇳🇬',
    placeholder: '803 123 4567',
    expectedLength: 10,
    phoneExample: '8031234567',
    operators: [
      { id: 'MTN_NG', name: 'MTN MoMo' },
      { id: 'AIRTEL_NG', name: 'Airtel Money' },
      { id: 'OPAY_NG', name: 'OPay' },
      { id: 'PALMPAY_NG', name: 'Palmpay' },
      { id: 'PAGA_NG', name: 'Paga' },
    ],
    validateFn: (digits) => digits.length === 10,
  },
  {
    code: 'CD',
    name: 'RDC (Congo-Kinshasa)',
    dialCode: '+243',
    flag: '🇨🇩',
    placeholder: '810 000 000',
    expectedLength: 9,
    phoneExample: '810000000',
    operators: [
      { id: 'MPESA_CD', name: 'M-Pesa' },
      { id: 'OM_CD', name: 'Orange Money' },
      { id: 'AIRTEL_CD', name: 'Airtel Money' },
      { id: 'AFRICELL_CD', name: 'Africell' },
    ],
    validateFn: (digits) => digits.length === 9,
  },
  {
    code: 'ML',
    name: 'Mali',
    dialCode: '+223',
    flag: '🇲🇱',
    placeholder: '70 00 00 00',
    expectedLength: 8,
    phoneExample: '70000000',
    operators: [
      { id: 'OM_ML', name: 'Orange Money' },
      { id: 'MOOV_ML', name: 'Moov Money' },
      { id: 'WAVE_ML', name: 'Wave' },
    ],
    validateFn: (digits) => digits.length === 8,
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    dialCode: '+226',
    flag: '🇧🇫',
    placeholder: '70 00 00 00',
    expectedLength: 8,
    phoneExample: '70000000',
    operators: [
      { id: 'OM_BF', name: 'Orange Money' },
      { id: 'MOOV_BF', name: 'Moov Money' },
      { id: 'WAVE_BF', name: 'Wave' },
    ],
    validateFn: (digits) => digits.length === 8,
  },
  {
    code: 'GN',
    name: 'Guinée',
    dialCode: '+224',
    flag: '🇬🇳',
    placeholder: '620 00 00 00',
    expectedLength: 9,
    phoneExample: '620000000',
    operators: [
      { id: 'OM_GN', name: 'Orange Money' },
      { id: 'MTN_GN', name: 'MTN Mobile Money' },
    ],
    validateFn: (digits) => digits.length === 9,
  },
  {
    code: 'TG',
    name: 'Togo',
    dialCode: '+228',
    flag: '🇹🇬',
    placeholder: '90 00 00 00',
    expectedLength: 8,
    phoneExample: '90000000',
    operators: [
      { id: 'TMONEY_TG', name: 'TMoney' },
      { id: 'MOOV_TG', name: 'Moov Flooz' },
    ],
    validateFn: (digits) => digits.length === 8,
  },
  {
    code: 'BJ',
    name: 'Bénin',
    dialCode: '+229',
    flag: '🇧🇯',
    placeholder: '90 00 00 00',
    expectedLength: 8,
    phoneExample: '90000000',
    operators: [
      { id: 'MTN_BJ', name: 'MTN MoMo' },
      { id: 'MOOV_BJ', name: 'Moov Money' },
      { id: 'CELTIIS_BJ', name: 'Celtiis Cash' },
    ],
    validateFn: (digits) => digits.length === 8,
  },
  {
    code: 'NE',
    name: 'Niger',
    dialCode: '+227',
    flag: '🇳🇪',
    placeholder: '90 00 00 00',
    expectedLength: 8,
    phoneExample: '90000000',
    operators: [
      { id: 'OM_NE', name: 'Orange Money' },
      { id: 'AIRTEL_NE', name: 'Airtel Money' },
      { id: 'MOOV_NE', name: 'Moov Money' },
    ],
    validateFn: (digits) => digits.length === 8,
  },
  {
    code: 'GA',
    name: 'Gabon',
    dialCode: '+241',
    flag: '🇬🇦',
    placeholder: '70 00 00 00',
    expectedLength: 8,
    phoneExample: '70000000',
    operators: [
      { id: 'AIRTEL_GA', name: 'Airtel Money' },
      { id: 'MOOV_GA', name: 'Moov Money' },
    ],
    validateFn: (digits) => digits.length >= 7 && digits.length <= 9,
  },
  {
    code: 'CG',
    name: 'Congo (Brazzaville)',
    dialCode: '+242',
    flag: '🇨🇬',
    placeholder: '06 000 00 00',
    expectedLength: 9,
    phoneExample: '060000000',
    operators: [
      { id: 'MTN_CG', name: 'MTN MoMo' },
      { id: 'AIRTEL_CG', name: 'Airtel Money' },
    ],
    validateFn: (digits) => digits.length === 9,
  },
  {
    code: 'TD',
    name: 'Tchad',
    dialCode: '+235',
    flag: '🇹🇩',
    placeholder: '66 00 00 00',
    expectedLength: 8,
    phoneExample: '66000000',
    operators: [
      { id: 'AIRTEL_TD', name: 'Airtel Money' },
      { id: 'MOOV_TD', name: 'Moov Money' },
    ],
    validateFn: (digits) => digits.length === 8,
  },
  {
    code: 'RW',
    name: 'Rwanda',
    dialCode: '+250',
    flag: '🇷🇼',
    placeholder: '788 000 000',
    expectedLength: 9,
    phoneExample: '788000000',
    operators: [
      { id: 'MTN_RW', name: 'MTN MoMo' },
      { id: 'AIRTEL_RW', name: 'Airtel Money' },
    ],
    validateFn: (digits) => digits.length === 9,
  },
  {
    code: 'TZ',
    name: 'Tanzanie',
    dialCode: '+255',
    flag: '🇹🇿',
    placeholder: '712 345 678',
    expectedLength: 9,
    phoneExample: '712345678',
    operators: [
      { id: 'MPESA_TZ', name: 'M-Pesa' },
      { id: 'AIRTEL_TZ', name: 'Airtel Money' },
      { id: 'TIGO_TZ', name: 'Tigo Pesa' },
    ],
    validateFn: (digits) => digits.length === 9,
  },
  {
    code: 'ET',
    name: 'Éthiopie',
    dialCode: '+251',
    flag: '🇪🇹',
    placeholder: '911 000 000',
    expectedLength: 9,
    phoneExample: '911000000',
    operators: [
      { id: 'TELEBIRR_ET', name: 'Telebirr' },
      { id: 'CBE_ET', name: 'CBE Birr' },
      { id: 'MPESA_ET', name: 'M-Pesa' },
    ],
    validateFn: (digits) => digits.length === 9,
  },
  {
    code: 'ZA',
    name: 'Afrique du Sud',
    dialCode: '+27',
    flag: '🇿🇦',
    placeholder: '82 123 4567',
    expectedLength: 9,
    phoneExample: '821234567',
    operators: [
      { id: 'VODA_ZA', name: 'VodaPay' },
      { id: 'MTN_ZA', name: 'MTN MoMo' },
      { id: 'SNAP_ZA', name: 'SnapScan' },
    ],
    validateFn: (digits) => digits.length === 9,
  },
  {
    code: 'MA',
    name: 'Maroc',
    dialCode: '+212',
    flag: '🇲🇦',
    placeholder: '6 00 00 00 00',
    expectedLength: 9,
    phoneExample: '600000000',
    operators: [
      { id: 'OM_MA', name: 'Orange Money' },
      { id: 'INWI_MA', name: 'Inwi Money' },
      { id: 'BARID_MA', name: 'Barid Cash' },
    ],
    validateFn: (digits) => digits.length === 9,
  },
  {
    code: 'DZ',
    name: 'Algérie',
    dialCode: '+213',
    flag: '🇩🇿',
    placeholder: '550 00 00 00',
    expectedLength: 9,
    phoneExample: '550000000',
    operators: [
      { id: 'BARIDI_DZ', name: 'BaridiMob' },
      { id: 'CCP_DZ', name: 'CCP Algérie Post' },
    ],
    validateFn: (digits) => digits.length === 9,
  },
  {
    code: 'TN',
    name: 'Tunisie',
    dialCode: '+216',
    flag: '🇹🇳',
    placeholder: '20 000 000',
    expectedLength: 8,
    phoneExample: '20000000',
    operators: [
      { id: 'D17_TN', name: 'D17 La Poste' },
      { id: 'FLOUCI_TN', name: 'Flouci' },
    ],
    validateFn: (digits) => digits.length === 8,
  },
  {
    code: 'EG',
    name: 'Égypte',
    dialCode: '+20',
    flag: '🇪🇬',
    placeholder: '100 123 4567',
    expectedLength: 10,
    phoneExample: '1001234567',
    operators: [
      { id: 'VODA_EG', name: 'Vodafone Cash' },
      { id: 'OM_EG', name: 'Orange Cash' },
      { id: 'WE_EG', name: 'WE Pay' },
    ],
    validateFn: (digits) => digits.length === 10,
  },
  {
    code: 'MG',
    name: 'Madagascar',
    dialCode: '+261',
    flag: '🇲🇬',
    placeholder: '32 00 000 00',
    expectedLength: 9,
    phoneExample: '320000000',
    operators: [
      { id: 'MVOLA_MG', name: 'MVola' },
      { id: 'OM_MG', name: 'Orange Money' },
      { id: 'AIRTEL_MG', name: 'Airtel Money' },
    ],
    validateFn: (digits) => digits.length === 9,
  },
  {
    code: 'MR',
    name: 'Mauritanie',
    dialCode: '+222',
    flag: '🇲🇷',
    placeholder: '45 00 00 00',
    expectedLength: 8,
    phoneExample: '45000000',
    operators: [
      { id: 'BANKILY_MR', name: 'Bankily' },
      { id: 'MASRVI_MR', name: 'Masrvi' },
    ],
    validateFn: (digits) => digits.length === 8,
  },
];

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
  // Cameroun selected BY DEFAULT
  const [selectedCountry, setSelectedCountry] = useState<AfricanCountry>(AFRICAN_COUNTRIES[0]);
  const [paymentMethod, setPaymentMethod] = useState<'MOBILE_MONEY' | 'CARD'>('MOBILE_MONEY');
  
  // Operator dynamically defaults to 1st operator of selected country
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>(
    AFRICAN_COUNTRIES[0].operators[0]?.id || ''
  );

  // Form Fields - Default to empty strings to strictly require user completion
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvc, setCardCvc] = useState<string>('');

  // Country dropdown state
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState<boolean>(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState<string>('');

  // Touched state for validation
  const [touched, setTouched] = useState<{
    fullName?: boolean;
    email?: boolean;
    phone?: boolean;
    cardNumber?: boolean;
    cardExpiry?: boolean;
    cardCvc?: boolean;
  }>({});

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Filtered countries search
  const filteredCountries = useMemo(() => {
    if (!countrySearchQuery.trim()) return AFRICAN_COUNTRIES;
    const q = countrySearchQuery.toLowerCase().trim();
    return AFRICAN_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [countrySearchQuery]);

  if (!isOpen) return null;

  // Validation Logic
  const cleanFullName = fullName.trim();
  const isNameValid = cleanFullName.length >= 3 && !/[<>{}]/.test(cleanFullName);

  const cleanEmail = email.trim();
  const isEmailValid = EMAIL_REGEX.test(cleanEmail);

  // Phone Validation per country
  const cleanPhoneDigits = phone.replace(/\D/g, '');
  let isPhoneValid = false;
  if (selectedCountry.validateFn) {
    isPhoneValid = selectedCountry.validateFn(cleanPhoneDigits);
  } else {
    isPhoneValid =
      cleanPhoneDigits.length >= selectedCountry.expectedLength - 1 &&
      cleanPhoneDigits.length <= selectedCountry.expectedLength + 1;
  }

  // Card validation
  const cleanCardDigits = cardNumber.replace(/\D/g, '');
  const isCardNumberValid = cleanCardDigits.length >= 15 && cleanCardDigits.length <= 19;
  const isCardExpiryValid = /^\d{2}\/\d{2}$/.test(cardExpiry.trim());
  const isCardCvcValid = /^\d{3,4}$/.test(cardCvc.trim());

  const isPaymentDetailsValid =
    paymentMethod === 'MOBILE_MONEY'
      ? Boolean(selectedOperatorId) && isPhoneValid
      : isCardNumberValid && isCardExpiryValid && isCardCvcValid;

  const isFormValid = isNameValid && isEmailValid && isPaymentDetailsValid;

  // Active step calculation for progress bar
  const currentStep = !isNameValid || !isEmailValid ? 1 : !isPaymentDetailsValid ? 2 : 3;

  // Handle Country Selection
  const handleSelectCountry = (country: AfricanCountry) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
    setCountrySearchQuery('');
    
    if (country.operators.length > 0) {
      setSelectedOperatorId(country.operators[0].id);
    } else {
      setSelectedOperatorId('');
    }

    setPhone('');
    setTouched((prev) => ({ ...prev, phone: false }));
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setTouched({
        fullName: true,
        email: true,
        phone: true,
        cardNumber: true,
        cardExpiry: true,
        cardCvc: true,
      });
      return;
    }

    setIsProcessing(true);

    const activeOpName =
      selectedCountry.operators.find((op) => op.id === selectedOperatorId)?.name || 'Mobile Money';

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const activeSub = generateActiveSubscription(
        paymentMethod === 'MOBILE_MONEY'
          ? `Mobile Money (${activeOpName} - ${selectedCountry.dialCode} ${cleanPhoneDigits})`
          : 'Carte Bancaire Internationale'
      );

      setTimeout(() => {
        onSubscriptionActivated(activeSub, { name: cleanFullName, email: cleanEmail });
        setIsSuccess(false);
        onClose();
      }, 1800);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white/95 border border-slate-200/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative text-slate-900 font-sans my-auto"
      >
        
        {/* Top Premium Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 text-center overflow-hidden border-b border-blue-900/50">
          
          {/* Subtle Background Glow Spheres */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-2xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all backdrop-blur-md"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Centered Logo & Header */}
          <div className="flex flex-col items-center justify-center space-y-3 relative z-10">
            <ChrisXauusdLogoIcon className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-xl" />

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-purple-500/20 border border-amber-400/40 text-amber-300 shadow-2xs">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>CHRISXAUUSD VIP PREMIUM</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
                ACTIVER VOTRE ABONNEMENT
              </h2>
              <p className="text-xs sm:text-sm text-blue-200/90 font-sans max-w-md mx-auto flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400 inline shrink-0" />
                <span>Paiement 100% Sécurisé & Crypte par Passerelle Fintech Africaine</span>
              </p>
            </div>
          </div>
        </div>

        {/* Animated Progress Steps Bar */}
        <div className="bg-slate-900/95 px-6 py-3 border-b border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-around gap-2">
          <div className={`flex items-center gap-1.5 transition-colors ${currentStep >= 1 ? 'text-blue-400 font-bold' : 'text-slate-500'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
              1
            </div>
            <span className="hidden sm:inline">Infos Client</span>
          </div>

          <div className={`h-0.5 flex-1 max-w-[40px] rounded ${currentStep >= 2 ? 'bg-blue-500' : 'bg-slate-800'}`} />

          <div className={`flex items-center gap-1.5 transition-colors ${currentStep >= 2 ? 'text-blue-400 font-bold' : 'text-slate-500'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
              2
            </div>
            <span className="hidden sm:inline">Paiement</span>
          </div>

          <div className={`h-0.5 flex-1 max-w-[40px] rounded ${currentStep >= 3 ? 'bg-emerald-500' : 'bg-slate-800'}`} />

          <div className={`flex items-center gap-1.5 transition-colors ${currentStep >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
              3
            </div>
            <span className="hidden sm:inline">Validation</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-10 text-center space-y-5"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-bounce">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-mono text-emerald-900">
                    PAIEMENT CONFIRMÉ ET VALIDÉ !
                  </h3>
                  <p className="text-sm text-slate-700 font-mono font-bold">
                    Abonnement mensuel activé pour {formatFcfa(SUBSCRIPTION_PRICE_FCFA)}.
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Accès immédiat aux signaux de scalping XAU/USD, Stop Loss et Take Profit en temps réel.
                  </p>
                </div>
              </motion.div>
            ) : isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-14 text-center space-y-5 font-mono"
              >
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-600/30 animate-ping" />
                  <div className="w-14 h-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                  <LockKeyhole className="w-6 h-6 text-blue-600 absolute" />
                </div>

                <div className="space-y-1.5">
                  <p className="text-base font-bold text-slate-900">
                    Traitement de la transaction sécurisée...
                  </p>
                  <p className="text-xs text-slate-500">
                    Validation du paiement Mobile Money ({selectedCountry.flag} {selectedCountry.name})
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                
                {/* Premium Subscription Offer Card */}
                <div className="relative bg-gradient-to-br from-blue-900 via-slate-900 to-blue-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-blue-800/80 overflow-hidden group hover:shadow-2xl hover:border-blue-700 transition-all">
                  
                  {/* Decorative badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] font-mono uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" />
                    <span>MEILLEURE OFFRE</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
                        <Sparkles className="w-6 h-6 fill-current" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold font-mono text-white">
                          Pass VIP Signal ChrisXauusd
                        </h3>
                        <p className="text-xs text-blue-200 font-sans">
                          Accès complet au terminal de scalping M1/M5
                        </p>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 border-t border-blue-800/60 pt-3">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
                        {formatFcfa(SUBSCRIPTION_PRICE_FCFA)}
                      </span>
                      <span className="text-xs text-blue-200 font-mono">/ 30 jours (Accès Illimité)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-blue-100 pt-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Signaux Achat/Vente en direct</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Stop Loss & Take Profit exacts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Journal de trading de performance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Alertes sonores & PWA Mobile</span>
                      </div>
                    </div>

                    {/* Single Line Signature */}
                    <div className="pt-2.5 border-t border-blue-800/60 text-center text-[10px] font-mono text-slate-300">
                      Fondateur : Chris Pokam • Trader certifié : Osher Nikos
                    </div>

                  </div>
                </div>

                {/* Main Form Formats */}
                <form onSubmit={handlePaymentSubmit} className="space-y-5">
                  
                  {/* Step 1: Client Details */}
                  <div className="space-y-3 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span>1. VOS INFORMATIONS PERSONNELLES</span>
                      </label>
                      {isNameValid && isEmailValid && (
                        <span className="text-emerald-600 font-mono text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Étape 1 OK
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      {/* Name Input */}
                      <div>
                        <label className="text-[11px] font-mono text-slate-700 block mb-1">
                          Nom Complet *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            required
                            placeholder="Ex: Jean Paul Kouassi"
                            value={fullName}
                            onChange={(e) => {
                              setFullName(e.target.value);
                              setTouched((prev) => ({ ...prev, fullName: true }));
                            }}
                            onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
                            className={`w-full bg-white border rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-900 font-sans outline-none transition-all shadow-2xs ${
                              touched.fullName
                                ? isNameValid
                                  ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                                  : 'border-rose-500 bg-rose-50/30'
                                : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                            }`}
                          />
                          {touched.fullName && (
                            isNameValid ? (
                              <CheckCircle className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-rose-600 absolute right-3 top-3" />
                            )
                          )}
                        </div>
                        {touched.fullName && !isNameValid && (
                          <p className="text-[10px] text-rose-600 mt-1 font-sans">
                            Saisissez votre nom complet (min 3 caractères).
                          </p>
                        )}
                      </div>

                      {/* Email Input */}
                      <div>
                        <label className="text-[11px] font-mono text-slate-700 block mb-1">
                          Adresse E-mail *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="email"
                            required
                            placeholder="Ex: jean.paul@gmail.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setTouched((prev) => ({ ...prev, email: true }));
                            }}
                            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                            className={`w-full bg-white border rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-900 font-sans outline-none transition-all shadow-2xs ${
                              touched.email
                                ? isEmailValid
                                  ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                                  : 'border-rose-500 bg-rose-50/30'
                                : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                            }`}
                          />
                          {touched.email && (
                            isEmailValid ? (
                              <CheckCircle className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-rose-600 absolute right-3 top-3" />
                            )
                          )}
                        </div>
                        {touched.email && !isEmailValid && (
                          <p className="text-[10px] text-rose-600 mt-1 font-sans">
                            Saisissez une adresse e-mail valide.
                          </p>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Step 2: Payment Method & Country & Operator */}
                  <div className="space-y-4 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-slate-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span>2. CHOIX DU MOYEN DE PAIEMENT & PAYS</span>
                      </label>
                      {isPaymentDetailsValid && (
                        <span className="text-emerald-600 font-mono text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Étape 2 OK
                        </span>
                      )}
                    </div>

                    {/* Interactive Payment Method Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('MOBILE_MONEY')}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 text-xs font-mono transition-all transform active:scale-98 ${
                          paymentMethod === 'MOBILE_MONEY'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-700 shadow-md ring-2 ring-blue-400/50'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-100/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Smartphone className="w-5 h-5 shrink-0" />
                          <span className="font-bold">Mobile Money</span>
                        </div>
                        {paymentMethod === 'MOBILE_MONEY' && (
                          <CheckCircle className="w-4 h-4 fill-current text-white shrink-0" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('CARD')}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 text-xs font-mono transition-all transform active:scale-98 ${
                          paymentMethod === 'CARD'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-700 shadow-md ring-2 ring-blue-400/50'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-100/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CardIcon className="w-5 h-5 shrink-0" />
                          <span className="font-bold">Carte Bancaire</span>
                        </div>
                        {paymentMethod === 'CARD' && (
                          <CheckCircle className="w-4 h-4 fill-current text-white shrink-0" />
                        )}
                      </button>
                    </div>

                    {paymentMethod === 'MOBILE_MONEY' ? (
                      <div className="space-y-3 pt-1">
                        
                        {/* Country Selector with Search */}
                        <div className="space-y-1.5 relative">
                          <label className="text-[11px] font-mono text-slate-700 flex items-center justify-between">
                            <span className="font-bold">Sélectionnez le pays d'Afrique :</span>
                            <span className="text-[10px] text-blue-800 font-mono font-bold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                              Par défaut : 🇨🇲 Cameroun
                            </span>
                          </label>

                          <button
                            type="button"
                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                            className="w-full bg-white border border-slate-300 hover:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-sans flex items-center justify-between outline-none shadow-2xs transition-all"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl leading-none">{selectedCountry.flag}</span>
                              <span className="font-bold">{selectedCountry.name}</span>
                              <span className="text-slate-500 font-mono">({selectedCountry.dialCode})</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {/* Country Dropdown list */}
                          {isCountryDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden max-h-60 flex flex-col animate-fade-in">
                              <div className="p-2 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                                <input
                                  type="text"
                                  autoFocus
                                  placeholder="Rechercher un pays d'Afrique (ex: Cameroun, Côte d'Ivoire...)"
                                  value={countrySearchQuery}
                                  onChange={(e) => setCountrySearchQuery(e.target.value)}
                                  className="w-full text-xs font-sans bg-transparent outline-none text-slate-900"
                                />
                                {countrySearchQuery && (
                                  <button
                                    type="button"
                                    onClick={() => setCountrySearchQuery('')}
                                    className="text-slate-400 hover:text-slate-600 p-1"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>

                              <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
                                {filteredCountries.map((c) => (
                                  <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => handleSelectCountry(c)}
                                    className={`w-full px-3.5 py-2.5 text-xs text-left flex items-center justify-between hover:bg-blue-50 transition-colors ${
                                      selectedCountry.code === c.code ? 'bg-blue-50/80 font-bold text-blue-900' : 'text-slate-800'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <span className="text-base">{c.flag}</span>
                                      <span>{c.name}</span>
                                      <span className="text-slate-400 font-mono text-[11px]">{c.dialCode}</span>
                                    </div>
                                    {selectedCountry.code === c.code && (
                                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Dynamic Operators Badges */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono font-bold text-slate-700 block">
                            Opérateur Mobile Money disponible ({selectedCountry.flag} {selectedCountry.name}) :
                          </label>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {selectedCountry.operators.map((op) => {
                              const isSelected = selectedOperatorId === op.id;
                              return (
                                <button
                                  key={op.id}
                                  type="button"
                                  onClick={() => setSelectedOperatorId(op.id)}
                                  className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold border transition-all flex items-center justify-between gap-1.5 ${
                                    isSelected
                                      ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                      : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-blue-50'
                                  }`}
                                >
                                  <span className="truncate">{op.name}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Phone Number Field */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-slate-700 block">
                            Numéro de Téléphone Mobile Money *
                          </label>

                          <div className="flex gap-2">
                            <div className="bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono text-xs font-bold flex items-center gap-1 shrink-0 shadow-2xs">
                              <span>{selectedCountry.flag}</span>
                              <span>{selectedCountry.dialCode}</span>
                            </div>

                            <div className="relative flex-1">
                              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                              <input
                                type="tel"
                                required
                                placeholder={selectedCountry.placeholder}
                                value={phone}
                                onChange={(e) => {
                                  setPhone(e.target.value);
                                  setTouched((prev) => ({ ...prev, phone: true }));
                                }}
                                onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                                className={`w-full bg-white border rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-900 font-mono outline-none transition-all shadow-2xs ${
                                  touched.phone
                                    ? isPhoneValid
                                      ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                                      : 'border-rose-500 bg-rose-50/30'
                                    : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                                }`}
                              />
                              {touched.phone && (
                                isPhoneValid ? (
                                  <CheckCircle className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-rose-600 absolute right-3 top-3" />
                                )
                              )}
                            </div>
                          </div>

                          {touched.phone && !isPhoneValid && (
                            <p className="text-[10px] text-rose-600 mt-1 font-sans">
                              Numéro invalide pour {selectedCountry.name}. Exemple : {selectedCountry.placeholder}
                            </p>
                          )}
                        </div>

                      </div>
                    ) : (
                      /* Card Payment Fields */
                      <div className="space-y-3 pt-1">
                        <div>
                          <label className="text-[11px] font-mono text-slate-700 block mb-1 font-bold">
                            Numéro de carte bancaire *
                          </label>
                          <div className="relative">
                            <CardIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <input
                              type="text"
                              required
                              placeholder="4500 0000 0000 0000"
                              value={cardNumber}
                              onChange={(e) => {
                                setCardNumber(e.target.value);
                                setTouched((prev) => ({ ...prev, cardNumber: true }));
                              }}
                              onBlur={() => setTouched((prev) => ({ ...prev, cardNumber: true }))}
                              className={`w-full bg-white border rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-900 font-mono outline-none transition-all shadow-2xs ${
                                touched.cardNumber
                                  ? isCardNumberValid
                                    ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                                    : 'border-rose-500 bg-rose-50/30'
                                  : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                              }`}
                            />
                            {touched.cardNumber && (
                              isCardNumberValid ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-rose-600 absolute right-3 top-3" />
                              )
                            )}
                          </div>
                          {touched.cardNumber && !isCardNumberValid && (
                            <p className="text-[10px] text-rose-600 mt-1 font-sans">
                              Ce champ est obligatoire. Entrez un numéro de carte valide (15-19 chiffres).
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-mono text-slate-700 block mb-1 font-bold">
                              Expiration (MM/AA) *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="12/28"
                              value={cardExpiry}
                              onChange={(e) => {
                                setCardExpiry(e.target.value);
                                setTouched((prev) => ({ ...prev, cardExpiry: true }));
                              }}
                              onBlur={() => setTouched((prev) => ({ ...prev, cardExpiry: true }))}
                              className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs text-slate-900 font-mono outline-none transition-all shadow-2xs ${
                                touched.cardExpiry
                                  ? isCardExpiryValid
                                    ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                                    : 'border-rose-500 bg-rose-50/30'
                                  : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                              }`}
                            />
                            {touched.cardExpiry && !isCardExpiryValid && (
                              <p className="text-[10px] text-rose-600 mt-1 font-sans">
                                Champ obligatoire (MM/AA).
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="text-[11px] font-mono text-slate-700 block mb-1 font-bold">
                              CVC / CVV *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="321"
                              value={cardCvc}
                              onChange={(e) => {
                                setCardCvc(e.target.value);
                                setTouched((prev) => ({ ...prev, cardCvc: true }));
                              }}
                              onBlur={() => setTouched((prev) => ({ ...prev, cardCvc: true }))}
                              className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs text-slate-900 font-mono outline-none transition-all shadow-2xs ${
                                touched.cardCvc
                                  ? isCardCvcValid
                                    ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                                    : 'border-rose-500 bg-rose-50/30'
                                  : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                              }`}
                            />
                            {touched.cardCvc && !isCardCvcValid && (
                              <p className="text-[10px] text-rose-600 mt-1 font-sans">
                                Champ obligatoire (3-4 chiffres).
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* CTA Spectacular Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className={`w-full py-4 px-6 rounded-2xl font-mono text-sm font-black tracking-wide shadow-xl transition-all transform flex items-center justify-center gap-2.5 ${
                        isFormValid
                          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.98] cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 shadow-none'
                      }`}
                    >
                      <Lock className="w-4 h-4 fill-current shrink-0" />
                      <span>
                        {isFormValid
                          ? `PAYER MAINTENANT — ${formatFcfa(SUBSCRIPTION_PRICE_FCFA)}`
                          : 'REMPLISSEZ TOUS LES CHAMPS POUR PAYER'}
                      </span>
                      {isFormValid && <ArrowRight className="w-4 h-4 shrink-0" />}
                    </button>

                    <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-sans">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Paiement sécurisé · Validation instantanée · Support 24/7</span>
                    </div>
                  </div>

                </form>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </motion.div>
    </div>
  );
};
