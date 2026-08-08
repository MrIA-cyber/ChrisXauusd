import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Camera,
  Upload,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Image as ImageIcon,
  Check,
  Trash2,
  Link,
  Crown,
  Calendar,
  Save,
  Clock,
  Briefcase,
  Sliders,
  DollarSign,
  ShieldCheck,
  Eye,
  EyeOff,
  Send,
  Zap,
  Activity,
  Award,
  Layers,
} from 'lucide-react';
import { AuthUser } from '../types';
import { PRESET_TRADER_AVATARS, formatDateFr, formatFcfa } from '../lib/subscriptionService';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSession: AuthUser | null;
  onSaveProfile: (updatedUser: AuthUser) => void;
  onOpenRenewalModal?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userSession,
  onSaveProfile,
  onOpenRenewalModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State initialized from userSession
  const [name, setName] = useState<string>(userSession?.name || '');
  const [email, setEmail] = useState<string>(userSession?.email || '');
  const [phone, setPhone] = useState<string>(userSession?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(userSession?.avatarUrl || '');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);

  // Advanced VIP Preferences State
  const [traderLevel, setTraderLevel] = useState<'DEBUTANT' | 'INTERMEDIAIRE' | 'SCALPER_PRO' | 'MASTER_TRADER'>(
    userSession?.traderLevel || 'SCALPER_PRO'
  );
  const [tradingAccountBalance, setTradingAccountBalance] = useState<number>(
    userSession?.tradingAccountBalance || 5000
  );
  const [preferredCurrency, setPreferredCurrency] = useState<'USD' | 'EUR' | 'FCFA' | 'NGN' | 'GBP'>(
    userSession?.preferredCurrency || 'USD'
  );
  const [preferredRiskPercentage, setPreferredRiskPercentage] = useState<number>(
    userSession?.preferredRiskPercentage || 1.0
  );
  const [tradingStyle, setTradingStyle] = useState<'SCALPING_M1_M5' | 'DAY_TRADING' | 'SWING_TRADING' | 'BREAKOUT'>(
    userSession?.tradingStyle || 'SCALPING_M1_M5'
  );
  const [telegramUsername, setTelegramUsername] = useState<string>(
    userSession?.telegramUsername || ''
  );
  const [tradingPlatform, setTradingPlatform] = useState<'MT4' | 'MT5' | 'TRADINGVIEW' | 'CTRADER'>(
    userSession?.tradingPlatform || 'MT5'
  );
  const [privacyMode, setPrivacyMode] = useState<boolean>(
    userSession?.privacyMode || false
  );

  const [activeTab, setActiveTab] = useState<'PHOTO' | 'INFO' | 'TRADING' | 'PREF'>('PHOTO');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);

  // Synchronize state if userSession changes or modal opens
  React.useEffect(() => {
    if (userSession) {
      setName(userSession.name || '');
      setEmail(userSession.email || '');
      setPhone(userSession.phone || '');
      setAvatarUrl(userSession.avatarUrl || '');
      setTraderLevel(userSession.traderLevel || 'SCALPER_PRO');
      setTradingAccountBalance(userSession.tradingAccountBalance || 5000);
      setPreferredCurrency(userSession.preferredCurrency || 'USD');
      setPreferredRiskPercentage(userSession.preferredRiskPercentage || 1.0);
      setTradingStyle(userSession.tradingStyle || 'SCALPING_M1_M5');
      setTelegramUsername(userSession.telegramUsername || '');
      setTradingPlatform(userSession.tradingPlatform || 'MT5');
      setPrivacyMode(userSession.privacyMode || false);
    }
  }, [userSession, isOpen]);

  if (!isOpen || !userSession) return null;

  // Handle local file upload (Device camera/gallery)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("La taille de la photo ne doit pas dépasser 5 Mo.");
      return;
    }

    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatarUrl(result);
      }
      setIsProcessingImage(false);
    };
    reader.onerror = () => {
      alert("Erreur lors de la lecture du fichier image.");
      setIsProcessingImage(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle saving changes
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      alert("Veuillez saisir votre nom.");
      return;
    }

    const updatedUser: AuthUser = {
      ...userSession,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatarUrl: avatarUrl.trim() || undefined,
      traderLevel,
      tradingAccountBalance: Number(tradingAccountBalance) || 5000,
      preferredCurrency,
      preferredRiskPercentage: Number(preferredRiskPercentage) || 1.0,
      tradingStyle,
      telegramUsername: telegramUsername.trim(),
      tradingPlatform,
      privacyMode,
    };

    onSaveProfile(updatedUser);
    setSaveSuccessMsg("Profil VIP mis à jour avec succès !");
    setTimeout(() => {
      setSaveSuccessMsg(null);
      onClose();
    }, 1200);
  };

  // Helper for user initials fallback
  const getInitials = (fullName: string) => {
    if (!fullName) return 'TR';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const isSubscriberActive =
    userSession.subscription.status === 'ACTIVE' ||
    userSession.subscription.status === 'EXPIRING_SOON';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto animate-fade-in cursor-pointer font-sans"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl relative text-slate-900 dark:text-white font-sans my-auto cursor-default"
      >
        {/* Header with Luxury Amber Glow */}
        <div className="relative bg-gradient-to-r from-slate-900 via-amber-950/90 to-slate-900 text-white p-6 sm:p-8 text-center overflow-hidden border-b border-amber-500/30">
          
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Background Ambient Glows */}
          <div className="absolute -top-10 -left-10 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Avatar Centered Display with Change Trigger */}
          <div className="relative z-10 flex flex-col items-center space-y-3">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-amber-400/80 shadow-2xl overflow-hidden bg-slate-800 flex items-center justify-center relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={userSession.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-300">
                    {getInitials(userSession.name)}
                  </span>
                )}

                {/* Processing Overlay */}
                {isProcessingImage && (
                  <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Quick Camera Upload Button floating */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 border-2 border-slate-900 shadow-xl transition-transform active:scale-90 cursor-pointer"
                title="Changer ma photo de profil"
              >
                <Camera className="w-4 h-4 fill-slate-950" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* User Title & Badge */}
            <div className="text-center space-y-1">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                <span>{userSession.name}</span>
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {traderLevel === 'MASTER_TRADER' && '👑 Master Elite'}
                    {traderLevel === 'SCALPER_PRO' && '⚡ Scalper Pro'}
                    {traderLevel === 'INTERMEDIAIRE' && '📈 Trader Intermédiaire'}
                    {traderLevel === 'DEBUTANT' && '🌱 Débutant VIP'}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <DollarSign className="w-3 h-3 text-emerald-400" />
                  <span>{privacyMode ? '••••••' : `$${tradingAccountBalance.toLocaleString()}`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('PHOTO')}
            className={`flex-1 min-w-[100px] py-3 text-xs font-bold font-mono text-center flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'PHOTO'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('INFO')}
            className={`flex-1 min-w-[100px] py-3 text-xs font-bold font-mono text-center flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'INFO'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Contact</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TRADING')}
            className={`flex-1 min-w-[120px] py-3 text-xs font-bold font-mono text-center flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'TRADING'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-500" />
            <span>Trading VIP</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PREF')}
            className={`flex-1 min-w-[120px] py-3 text-xs font-bold font-mono text-center flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'PREF'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Préférences</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">

          {/* Success Notification */}
          <AnimatePresence>
            {saveSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 p-3.5 rounded-2xl text-xs font-mono font-bold flex items-center gap-2.5 shadow-2xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TAB 1: Photo de Profil Options */}
          {activeTab === 'PHOTO' && (
            <div className="space-y-5">
              
              {/* Primary Action Buttons: Local Upload + URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Importer depuis ma galerie</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput((prev) => !prev)}
                  className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 active:scale-98 transition-all cursor-pointer"
                >
                  <Link className="w-4 h-4 text-amber-500" />
                  <span>Saisir un lien image URL</span>
                </button>
              </div>

              {/* Custom Image URL Input Field */}
              {showUrlInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700"
                >
                  <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    Lien direct vers votre photo (HTTPS URL) :
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://domaine.com/ma-photo.jpg"
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customUrlInput.trim()) {
                          setAvatarUrl(customUrlInput.trim());
                          setShowUrlInput(false);
                          setCustomUrlInput('');
                        }
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs rounded-xl shadow-2xs"
                    >
                      Appliquer
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Gallery of Preset VIP Trader Avatars */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ou choisissez un Avatar VIP Prédéfinie :</span>
                  </span>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-sans"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Réinitialiser la photo</span>
                    </button>
                  )}
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {PRESET_TRADER_AVATARS.map((preset) => {
                    const isSelected = avatarUrl === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setAvatarUrl(preset.url)}
                        className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all cursor-pointer group ${
                          isSelected
                            ? 'border-amber-500 ring-2 ring-amber-500/50 scale-105 shadow-md'
                            : 'border-slate-200 dark:border-slate-800 hover:border-amber-300 opacity-80 hover:opacity-100'
                        }`}
                        title={preset.name}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Edit Profile Info */}
          {activeTab === 'INFO' && (
            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span>Nom complet & Titre *</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Moussa Diop (Trader PRO)"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white font-sans outline-none transition-all"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span>Adresse Email</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: trader@xau-scalp.com"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white font-sans outline-none transition-all"
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>Numéro de Téléphone</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: +221 77 123 45 67"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white font-sans outline-none transition-all"
                />
              </div>

            </form>
          )}

          {/* TAB 3: VIP Trading Options */}
          {activeTab === 'TRADING' && (
            <div className="space-y-4">
              {/* Trader Level Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Niveau d'Expérience Trader :</span>
                  </span>
                  <span className="text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Certifié Admin
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'DEBUTANT', label: 'Débutant', icon: '🌱' },
                    { id: 'INTERMEDIAIRE', label: 'Intermédiaire', icon: '📈' },
                    { id: 'SCALPER_PRO', label: 'Scalper Pro', icon: '⚡' },
                    { id: 'MASTER_TRADER', label: 'Master Elite', icon: '👑' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setTraderLevel(lvl.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        traderLevel === lvl.id
                          ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-base">{lvl.icon}</span>
                      <span>{lvl.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Capital & Currency Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Account Balance */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Taille Compte Trading ($)</span>
                  </label>
                  <input
                    type="number"
                    value={tradingAccountBalance}
                    onChange={(e) => setTradingAccountBalance(Number(e.target.value))}
                    step="500"
                    min="100"
                    placeholder="Ex: 5000"
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono outline-none"
                  />
                  {/* Presets */}
                  <div className="flex gap-1.5 pt-0.5">
                    {[1000, 5000, 10000, 25000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTradingAccountBalance(amt)}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/20 text-[10px] font-mono text-slate-600 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700"
                      >
                        ${amt >= 1000 ? `${amt / 1000}k` : amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred Currency */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-500" />
                    <span>Devise d'Affichage</span>
                  </label>
                  <select
                    value={preferredCurrency}
                    onChange={(e) => setPreferredCurrency(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white font-mono outline-none cursor-pointer"
                  >
                    <option value="USD">USD ($) - Dollar US</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="FCFA">FCFA (CFA) - Franc CFA</option>
                    <option value="NGN">NGN (₦) - Naira</option>
                    <option value="GBP">GBP (£) - Livre Sterling</option>
                  </select>
                </div>
              </div>

              {/* Risk % & Trading Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Max Risk % */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Risque Max par Trade (% Capital)</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0.5, 1.0, 2.0, 3.0].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setPreferredRiskPercentage(r)}
                        className={`py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                          preferredRiskPercentage === r
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-2xs'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {r}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform MT4/MT5 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-500" />
                    <span>Plateforme d'Exécution</span>
                  </label>
                  <select
                    value={tradingPlatform}
                    onChange={(e) => setTradingPlatform(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white font-mono outline-none cursor-pointer"
                  >
                    <option value="MT5">MetaTrader 5 (MT5 Recommandé)</option>
                    <option value="MT4">MetaTrader 4 (MT4)</option>
                    <option value="TRADINGVIEW">TradingView Web</option>
                    <option value="CTRADER">cTrader</option>
                  </select>
                </div>
              </div>

              {/* Style de Trading */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-purple-500" />
                  <span>Style de Trading Préféré XAU/USD</span>
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {[
                    { id: 'SCALPING_M1_M5', label: 'Scalping Rapide (M1/M5)' },
                    { id: 'DAY_TRADING', label: 'Day Trading (M15/H1)' },
                    { id: 'SWING_TRADING', label: 'Swing Trading (H4/D1)' },
                    { id: 'BREAKOUT', label: 'Breakout & Rejection' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setTradingStyle(st.id as any)}
                      className={`p-2.5 rounded-xl border font-bold text-left transition-all cursor-pointer ${
                        tradingStyle === st.id
                          ? 'bg-purple-500/15 border-purple-500 text-purple-700 dark:text-purple-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Preferences & Privacy */}
          {activeTab === 'PREF' && (
            <div className="space-y-4">
              {/* Telegram Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-sky-500" />
                  <span>Nom d'utilisateur Telegram (Alertes Directes VIP)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-xs text-slate-400 font-mono">@</span>
                  <input
                    type="text"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value.replace(/^@/, ''))}
                    placeholder="votre_pseudo_telegram"
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:border-amber-500 rounded-xl pl-8 pr-4 py-2.5 text-xs text-slate-900 dark:text-white font-mono outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Permet de recevoir les notifications directement dans le canal privé Telegram.
                </p>
              </div>

              {/* Privacy Mode Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {privacyMode ? (
                      <EyeOff className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-emerald-500" />
                    )}
                    <div>
                      <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        Mode Incognito & Confidentialité
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        Masquer les montants en argent réel sur le terminal lors de vos captures d'écran.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPrivacyMode(!privacyMode)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                      privacyMode
                        ? 'bg-amber-500 text-slate-950 shadow-2xs'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {privacyMode ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                  </button>
                </div>
              </div>

              {/* Security Banner */}
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-2.5 text-xs font-mono text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Toutes vos préférences VIP sont stockées de façon cryptée et confidentielle.</span>
              </div>
            </div>
          )}

          {/* Subscription Summary Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-100 dark:via-slate-800/60 to-slate-50 dark:to-slate-800/40 border border-amber-300/40 dark:border-amber-500/30 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>Statut Abonnement Terminal</span>
              </span>

              {isSubscriberActive ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ACTIF (J-{userSession.subscription.daysRemaining})
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> EXPIRÉ
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Inscrit le : {formatDateFr(userSession.subscription.startDate)}</span>
              </div>
              <div className="flex items-center gap-1 justify-end">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Expire le : {formatDateFr(userSession.subscription.expirationDate)}</span>
              </div>
            </div>

            {/* Quick Renewal CTA if expiring or expired */}
            {onOpenRenewalModal && userSession.subscription.daysRemaining <= 5 && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRenewalModal();
                }}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>Renouveler mon abonnement VIP ({formatFcfa(userSession.subscription.amountFcfa)})</span>
              </button>
            )}
          </div>

          {/* Action Buttons Footer */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-mono font-bold transition-all cursor-pointer"
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les Modifications</span>
            </button>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
