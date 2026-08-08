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

  const [activeTab, setActiveTab] = useState<'PHOTO' | 'INFO'>('PHOTO');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);

  // Synchronize state if userSession changes or modal opens
  React.useEffect(() => {
    if (userSession) {
      setName(userSession.name || '');
      setEmail(userSession.email || '');
      setPhone(userSession.phone || '');
      setAvatarUrl(userSession.avatarUrl || '');
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
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
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
    };

    onSaveProfile(updatedUser);
    setSaveSuccessMsg("Profil mis à jour avec succès !");
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
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Membre VIP ChrisXauusd</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => setActiveTab('PHOTO')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold font-mono text-center flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'PHOTO'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Photo de Profil</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('INFO')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold font-mono text-center flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'INFO'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Mes Informations</span>
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
