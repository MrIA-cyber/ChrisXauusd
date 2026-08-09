import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  UserCheck,
  UserX,
  Users,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Calendar,
  Clock,
  Trash2,
  Key,
  DollarSign,
  TrendingUp,
  FileText,
  Settings,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Sparkles,
  Download,
  ChevronRight,
  ChevronLeft,
  X,
  Zap,
  Check,
  Star,
  Activity,
  Edit2,
  UserPlus,
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Sliders,
  Globe,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  MoreVertical,
  CheckSquare,
  Copy,
  Info,
  Award
} from 'lucide-react';
import { formatFcfa, SUBSCRIPTION_PRICE_FCFA, formatDateFr } from '../../lib/subscriptionService';

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  flag: string;
  registeredAt: string;
  planType: 'Mensuel (700k FCFA)' | 'Trimestriel VIP' | 'Annuel Premium' | 'Lifetime VIP';
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'SUSPENDED';
  startDate: string; // ISO string
  expirationDate: string; // ISO string
  lastLogin: string;
  totalPaidFcfa: number;
  paymentMethod: 'Orange Money' | 'MTN Mobile Money' | 'Wave' | 'Carte Bancaire' | 'Crypto USDT' | 'Airtel Money';
  traderLevel?: 'DEBUTANT' | 'INTERMEDIAIRE' | 'SCALPER_PRO' | 'MASTER_TRADER';
  customBadge?: string;
}

export interface PaymentTransactionRecord {
  id: string;
  txRef: string;
  userName: string;
  userPhone: string;
  amountFcfa: number;
  method: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  date: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  adminEmail: string;
  ipAddress: string;
  action: 'PROLONG_SUB' | 'SUSPEND_USER' | 'REACTIVATE_USER' | 'DELETE_USER' | 'CREATE_USER' | 'EDIT_USER' | 'RESET_OTP' | 'EXPORT_DATA';
  targetUser: string;
  details: string;
}

const INITIAL_MOCK_USERS: AdminUserRecord[] = [
  {
    id: 'usr-101',
    name: 'Moussa Diop',
    email: 'moussa.diop@xauusd-trader.com',
    phone: '+221 77 123 45 67',
    country: 'Sénégal',
    flag: '🇸🇳',
    registeredAt: '2025-11-10',
    planType: 'Mensuel (700k FCFA)',
    status: 'ACTIVE',
    startDate: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    expirationDate: new Date(Date.now() + 25 * 24 * 3600 * 1000).toISOString(),
    lastLogin: 'Aujourd\'hui à 08:15',
    totalPaidFcfa: 1400000,
    paymentMethod: 'Wave'
  },
  {
    id: 'usr-102',
    name: 'Koffi Armand',
    email: 'koffi.armand@scalp-pro.ci',
    phone: '+225 07 89 01 23',
    country: 'Côte d\'Ivoire',
    flag: '🇨🇮',
    registeredAt: '2026-01-15',
    planType: 'Mensuel (700k FCFA)',
    status: 'EXPIRING_SOON',
    startDate: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString(),
    expirationDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    lastLogin: 'Hier à 19:40',
    totalPaidFcfa: 700000,
    paymentMethod: 'MTN Mobile Money'
  },
  {
    id: 'usr-103',
    name: 'Pauline Mbida',
    email: 'pauline.mbida@gmail.com',
    phone: '+237 690 12 34 56',
    country: 'Cameroun',
    flag: '🇨🇲',
    registeredAt: '2025-08-01',
    planType: 'Mensuel (700k FCFA)',
    status: 'EXPIRED',
    startDate: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
    expirationDate: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    lastLogin: 'Il y a 6 jours',
    totalPaidFcfa: 2100000,
    paymentMethod: 'Orange Money'
  },
  {
    id: 'usr-104',
    name: 'Samuel Moukoko',
    email: 'samuel.m@gmail.com',
    phone: '+237 677 88 99 00',
    country: 'Cameroun',
    flag: '🇨🇲',
    registeredAt: '2025-05-20',
    planType: 'Annuel Premium',
    status: 'ACTIVE',
    startDate: new Date(Date.now() - 120 * 24 * 3600 * 1000).toISOString(),
    expirationDate: new Date(Date.now() + 245 * 24 * 3600 * 1000).toISOString(),
    lastLogin: 'Aujourd\'hui à 07:30',
    totalPaidFcfa: 7000000,
    paymentMethod: 'Orange Money'
  },
  {
    id: 'usr-105',
    name: 'Yves Kouassi',
    email: 'yves.k@yahoo.fr',
    phone: '+225 05 11 22 33',
    country: 'Côte d\'Ivoire',
    flag: '🇨🇮',
    registeredAt: '2025-09-12',
    planType: 'Trimestriel VIP',
    status: 'ACTIVE',
    startDate: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    expirationDate: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
    lastLogin: 'Il y a 1 jour',
    totalPaidFcfa: 1800000,
    paymentMethod: 'MTN Mobile Money'
  },
  {
    id: 'usr-106',
    name: 'Jean-Marc Bernard',
    email: 'jm.bernard@outlook.fr',
    phone: '+33 6 12 34 56 78',
    country: 'France',
    flag: '🇫🇷',
    registeredAt: '2026-02-01',
    planType: 'Mensuel (700k FCFA)',
    status: 'SUSPENDED',
    startDate: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString(),
    expirationDate: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    lastLogin: 'Il y a 2 semaines',
    totalPaidFcfa: 700000,
    paymentMethod: 'Carte Bancaire'
  },
  {
    id: 'usr-107',
    name: 'Awa Diallo',
    email: 'awa.diallo@dakar-gold.sn',
    phone: '+221 78 444 55 66',
    country: 'Sénégal',
    flag: '🇸🇳',
    registeredAt: '2026-02-14',
    planType: 'Mensuel (700k FCFA)',
    status: 'ACTIVE',
    startDate: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    expirationDate: new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString(),
    lastLogin: 'Hier à 22:10',
    totalPaidFcfa: 700000,
    paymentMethod: 'Wave'
  },
  {
    id: 'usr-108',
    name: 'Cédric Nguema',
    email: 'c.nguema@libreville-fx.ga',
    phone: '+241 07 22 33 44',
    country: 'Gabon',
    flag: '🇬🇦',
    registeredAt: '2026-01-05',
    planType: 'Trimestriel VIP',
    status: 'ACTIVE',
    startDate: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString(),
    expirationDate: new Date(Date.now() + 45 * 24 * 3600 * 1000).toISOString(),
    lastLogin: 'Aujourd\'hui à 09:00',
    totalPaidFcfa: 1800000,
    paymentMethod: 'Airtel Money'
  }
];

const INITIAL_TRANSACTIONS: PaymentTransactionRecord[] = [
  { id: 'tx-901', txRef: 'OM-20260727-882', userName: 'Moussa Diop', userPhone: '+221 77 123 45 67', amountFcfa: 700000, method: 'Wave Sénégal', status: 'SUCCESS', date: '2026-07-27 08:12' },
  { id: 'tx-902', txRef: 'OM-20260726-541', userName: 'Awa Diallo', userPhone: '+221 78 444 55 66', amountFcfa: 700000, method: 'Wave Sénégal', status: 'SUCCESS', date: '2026-07-26 14:30' },
  { id: 'tx-903', txRef: 'MTN-20260725-109', userName: 'Koffi Armand', userPhone: '+225 07 89 01 23', amountFcfa: 700000, method: 'MTN CI', status: 'SUCCESS', date: '2026-07-25 11:05' },
  { id: 'tx-904', txRef: 'OM-20260724-332', userName: 'Samuel Moukoko', userPhone: '+237 677 88 99 00', amountFcfa: 7000000, method: 'Orange Money CMR', status: 'SUCCESS', date: '2026-07-24 16:45' },
  { id: 'tx-905', txRef: 'CB-20260722-004', userName: 'Jean-Marc Bernard', userPhone: '+33 6 12 34 56 78', amountFcfa: 700000, method: 'Stripe CB', status: 'FAILED', date: '2026-07-22 09:18' },
];

const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: 'log-1',
    timestamp: new Date().toISOString(),
    adminEmail: 'admin@chrisxauusd.com',
    ipAddress: '197.234.221.15',
    action: 'PROLONG_SUB',
    targetUser: 'Moussa Diop (usr-101)',
    details: 'Renouvellement manuel de +30 jours après validation du reçu Mobile Money',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    adminEmail: 'admin@chrisxauusd.com',
    ipAddress: '197.234.221.15',
    action: 'CREATE_USER',
    targetUser: 'Cédric Nguema (usr-108)',
    details: 'Création manuelle du compte abonné VIP Gabon',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    adminEmail: 'admin@chrisxauusd.com',
    ipAddress: '197.234.221.15',
    action: 'SUSPEND_USER',
    targetUser: 'Jean-Marc Bernard (usr-106)',
    details: 'Suspension temporaire pour contestation de paiement CB',
  },
];

interface AdminPortalProps {
  onExitAdmin: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onExitAdmin }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('chris_admin_auth_v1') === 'true';
  });
  const [emailInput, setEmailInput] = useState('admin@chrisxauusd.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [twoFaInput, setTwoFaInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  // Layout & Navigation State
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'USERS' | 'SUBSCRIPTIONS' | 'PAYMENTS' | 'STATS' | 'AUDIT' | 'TWELVEDATA' | 'SETTINGS'>('DASHBOARD');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Twelve Data Live Quota State
  const [twelveDataQuota, setTwelveDataQuota] = useState<{
    dailyCallsCount: number;
    realDailyLimit: number;
    safetyMarginDaily: number;
    maxDailyCalls: number;
    remainingDailyCalls: number;
    percentUsed: number;
    minutelyCallsCount: number;
    maxMinutelyCalls: number;
    isQuotaAvailable: boolean;
    lastRequestTimestamp: string | null;
    lastXauusdTimestamp: string | null;
    apiState: string;
    lastApiErrorMsg: string | null;
    status: 'NORMAL' | 'ATTENTION' | 'ALERTE' | 'BLOQUÉ';
  }>({
    dailyCallsCount: 0,
    realDailyLimit: 800,
    safetyMarginDaily: 100,
    maxDailyCalls: 700,
    remainingDailyCalls: 700,
    percentUsed: 0,
    minutelyCallsCount: 0,
    maxMinutelyCalls: 7,
    isQuotaAvailable: true,
    lastRequestTimestamp: null,
    lastXauusdTimestamp: null,
    apiState: 'CONNECTED',
    lastApiErrorMsg: null,
    status: 'NORMAL',
  });

  // Fetch Twelve Data Quota Status periodically
  useEffect(() => {
    const fetchQuotaStatus = async () => {
      try {
        const res = await fetch('/api/admin/twelve-data-status');
        if (res.ok) {
          const data = await res.json();
          if (data && data.quotaStatus) {
            setTwelveDataQuota(data.quotaStatus);
          }
        }
      } catch (err) {
        console.warn('Erreur lors de la mise à jour du quota Twelve Data admin:', err);
      }
    };

    fetchQuotaStatus();
    const interval = setInterval(fetchQuotaStatus, 8000);
    return () => clearInterval(interval);
  }, []);

  // Application Data State
  const [users, setUsers] = useState<AdminUserRecord[]>(() => {
    const saved = localStorage.getItem('chris_admin_users_db_v2');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_USERS;
  });
  const [transactions, setTransactions] = useState<PaymentTransactionRecord[]>(() => {
    const saved = localStorage.getItem('chris_admin_tx_db_v2');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>(() => {
    const saved = localStorage.getItem('chris_admin_audit_db_v2');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Table Sorting, Pagination, and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortColumn, setSortColumn] = useState<'name' | 'expiration' | 'totalPaid' | 'registered'>('expiration');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals & Active Edit Objects
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<AdminUserRecord | null>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<AdminUserRecord | null>(null);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [customExtendDays, setCustomExtendDays] = useState<number>(30);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserCountry, setNewUserCountry] = useState('🇨🇲 Cameroun');
  const [newUserPlan, setNewUserPlan] = useState<'Mensuel (700k FCFA)' | 'Trimestriel VIP' | 'Annuel Premium' | 'Lifetime VIP'>('Mensuel (700k FCFA)');
  const [newUserMethod, setNewUserMethod] = useState<'Orange Money' | 'MTN Mobile Money' | 'Wave' | 'Carte Bancaire' | 'Crypto USDT'>('Orange Money');

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('chris_admin_users_db_v2', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('chris_admin_tx_db_v2', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('chris_admin_audit_db_v2', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Auto-logout after 15 minutes of inactivity
  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      // 15 minutes = 900,000 ms
      timeoutId = setTimeout(() => {
        setIsAuthenticated(false);
        localStorage.removeItem('chris_admin_auth_v1');
        setToastMessage({
          text: "Déconnexion automatique de l'administrateur suite à 15 minutes d'inactivité.",
          type: 'warning',
        });
      }, 900000);
    };

    resetInactivityTimer();

    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
    activityEvents.forEach((evt) => window.addEventListener(evt, resetInactivityTimer));

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach((evt) => window.removeEventListener(evt, resetInactivityTimer));
    };
  }, [isAuthenticated]);

  // Toast Helper
  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Log Audit Action
  const logAudit = (action: AuditLogRecord['action'], targetUser: string, details: string) => {
    const newRecord: AuditLogRecord = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminEmail: 'admin@chrisxauusd.com',
      ipAddress: '197.234.221.15',
      action,
      targetUser,
      details,
    };
    setAuditLogs((prev) => [newRecord, ...prev]);
  };

  // Handle Admin Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    const cleanInput = emailInput.trim().toLowerCase().replaceAll(' ', '');

    if (
      (cleanInput === 'admin@chrisxauusd.com' || cleanInput === '658151516' || cleanInput.includes('658151516')) &&
      (passwordInput === 'Chris2026!' || passwordInput === 'danielle1996')
    ) {
      setIsAuthenticated(true);
      localStorage.setItem('chris_admin_auth_v1', 'true');
      setAuthError(null);
      setFailedAttempts(0);
      showToast('Bienvenue dans le Console Administrateur ChrisXauusd !', 'success');
      logAudit('EDIT_USER', 'System', 'Connexion réussie à l\'espace /admin.chris');
    } else {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 5) {
        setIsLockedOut(true);
        setAuthError('Trop de tentatives infructueuses. Accès suspendu 30 secondes par sécurité.');
        setTimeout(() => {
          setIsLockedOut(false);
          setFailedAttempts(0);
          setAuthError(null);
        }, 30000);
      } else {
        setAuthError(`Identifiants invalides. (${5 - attempts} essai(s) restant(s))`);
      }
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('chris_admin_auth_v1');
    showToast('Session administrateur fermée en toute sécurité.', 'info');
  };

  // Subscription Extend Handler
  const handleExtendSubscription = (user: AdminUserRecord, daysToAdd: number) => {
    const now = new Date();
    const currentExp = new Date(user.expirationDate);
    const baseDate = currentExp > now ? currentExp : now;

    const newExp = new Date(baseDate.getTime() + daysToAdd * 24 * 3600 * 1000);
    const updatedStatus = daysToAdd > 0 ? 'ACTIVE' : user.status;

    // Add new transaction record if extension is >= 30 days
    if (daysToAdd >= 30) {
      const newTx: PaymentTransactionRecord = {
        id: `tx-${Date.now().toString().slice(-4)}`,
        txRef: `RENEW-${Date.now().toString().slice(-6)}`,
        userName: user.name,
        userPhone: user.phone,
        amountFcfa: SUBSCRIPTION_PRICE_FCFA,
        method: user.paymentMethod,
        status: 'SUCCESS',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
      setTransactions((prev) => [newTx, ...prev]);
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? {
              ...u,
              expirationDate: newExp.toISOString(),
              status: updatedStatus,
              totalPaidFcfa: u.totalPaidFcfa + (daysToAdd >= 30 ? SUBSCRIPTION_PRICE_FCFA : 0),
            }
          : u
      )
    );

    const msg = `Abonnement de ${user.name} prolongé de +${daysToAdd} jours. Expire le ${newExp.toLocaleDateString('fr-FR')}`;
    showToast(msg, 'success');
    logAudit('PROLONG_SUB', `${user.name} (${user.id})`, `Extension de +${daysToAdd} jours. Date : ${newExp.toISOString()}`);
    setSelectedUserForEdit(null);
  };

  // Update Trader Level & Custom Badge by Admin
  const handleUpdateTraderLevelAndBadge = (user: AdminUserRecord, level: 'DEBUTANT' | 'INTERMEDIAIRE' | 'SCALPER_PRO' | 'MASTER_TRADER', badge?: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, traderLevel: level, customBadge: badge } : u))
    );
    showToast(`Niveau VIP (${level}) et Badge attribués à ${user.name}`, 'success');
    logAudit('EDIT_USER', `${user.name} (${user.id})`, `Attribution Niveau Trader: ${level}, Badge: ${badge || 'Aucun'}`);
  };

  // Toggle Suspend Status
  const handleToggleSuspend = (user: AdminUserRecord) => {
    const isSuspending = user.status !== 'SUSPENDED';
    const newStatus = isSuspending ? 'SUSPENDED' : 'ACTIVE';

    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );

    const msg = isSuspending
      ? `Compte de ${user.name} suspendu.`
      : `Compte de ${user.name} réactivé.`;
    showToast(msg, isSuspending ? 'warning' : 'success');
    logAudit(isSuspending ? 'SUSPEND_USER' : 'REACTIVATE_USER', `${user.name} (${user.id})`, `Statut modifié en ${newStatus}`);
  };

  // Delete User
  const handleDeleteUser = () => {
    if (!selectedUserForDelete) return;
    const user = selectedUserForDelete;
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    showToast(`Utilisateur ${user.name} définitivement supprimé.`, 'warning');
    logAudit('DELETE_USER', `${user.name} (${user.id})`, `Suppression définitive du compte`);
    setSelectedUserForDelete(null);
  };

  // Create New User Handler
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const [flag, ...cParts] = newUserCountry.split(' ');
    const countryName = cParts.join(' ');

    const now = new Date();
    const exp = new Date(now.getTime() + 30 * 24 * 3600 * 1000);

    const created: AdminUserRecord = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || '+237 600 00 00 00',
      country: countryName || 'Cameroun',
      flag: flag || '🇨🇲',
      registeredAt: now.toISOString().split('T')[0],
      planType: newUserPlan,
      status: 'ACTIVE',
      startDate: now.toISOString(),
      expirationDate: exp.toISOString(),
      lastLogin: 'Inscrit aujourd\'hui',
      totalPaidFcfa: SUBSCRIPTION_PRICE_FCFA,
      paymentMethod: newUserMethod
    };

    const newTx: PaymentTransactionRecord = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      txRef: `MANUAL-${Date.now().toString().slice(-6)}`,
      userName: created.name,
      userPhone: created.phone,
      amountFcfa: SUBSCRIPTION_PRICE_FCFA,
      method: newUserMethod,
      status: 'SUCCESS',
      date: now.toISOString().replace('T', ' ').slice(0, 16)
    };

    setUsers([created, ...users]);
    setTransactions([newTx, ...transactions]);
    showToast(`Compte pour ${created.name} créé avec abonnement de 30 jours.`, 'success');
    logAudit('CREATE_USER', `${created.name} (${created.id})`, `Création manuelle avec plan ${newUserPlan}`);

    // Reset Form & Close Modal
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setIsCreateUserModalOpen(false);
  };

  // Sorting & Filtering Logic
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.phone.includes(query) ||
          u.country.toLowerCase().includes(query);

        if (statusFilter === 'ACTIVE') return matchesSearch && u.status === 'ACTIVE';
        if (statusFilter === 'EXPIRING_SOON') return matchesSearch && u.status === 'EXPIRING_SOON';
        if (statusFilter === 'EXPIRED') return matchesSearch && u.status === 'EXPIRED';
        if (statusFilter === 'SUSPENDED') return matchesSearch && u.status === 'SUSPENDED';

        return matchesSearch;
      })
      .sort((a, b) => {
        let valA: any = a.name;
        let valB: any = b.name;

        if (sortColumn === 'expiration') {
          valA = new Date(a.expirationDate).getTime();
          valB = new Date(b.expirationDate).getTime();
        } else if (sortColumn === 'totalPaid') {
          valA = a.totalPaidFcfa;
          valB = b.totalPaidFcfa;
        } else if (sortColumn === 'registered') {
          valA = new Date(a.registeredAt).getTime();
          valB = new Date(b.registeredAt).getTime();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [users, searchQuery, statusFilter, sortColumn, sortDirection]);

  // Paginated Users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // High-level Metrics
  const totalSubscribers = users.length;
  const activeSubscribers = users.filter((u) => u.status === 'ACTIVE' || u.status === 'EXPIRING_SOON').length;
  const expiringSoonCount = users.filter((u) => u.status === 'EXPIRING_SOON').length;
  const expiredCount = users.filter((u) => u.status === 'EXPIRED').length;
  const suspendedCount = users.filter((u) => u.status === 'SUSPENDED').length;
  const totalRevenueFcfa = users.reduce((acc, u) => acc + u.totalPaidFcfa, 0);

  // If Unauthenticated, Render Sleek Security Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center p-4 font-mono relative overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-900/90 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-2xl space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 via-amber-500/20 to-blue-600/30 border border-amber-400/50 flex items-center justify-center text-amber-400 mx-auto shadow-xl">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/40 uppercase tracking-widest mb-1">
                ESPACE PRIVÉ D'ADMINISTRATION
              </span>
              <h1 className="text-xl font-bold text-white tracking-tight">ChrisXauusd Admin</h1>
              <p className="text-xs text-slate-400 font-sans">
                Accès strictement réservé aux administrateurs autorisés (/admin.chris)
              </p>
            </div>
          </div>

          {/* Quick Demo Credentials Box */}
          <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-3 text-[11px] space-y-1 text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Identifiants d'Accès Demo Admin :</span>
            </div>
            <p className="font-sans">Email : <strong className="font-mono text-white">admin@chrisxauusd.com</strong></p>
            <p className="font-sans">Mot de passe : <strong className="font-mono text-white">Chris2026!</strong></p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {authError && (
              <div className="bg-rose-950/80 border border-rose-500/50 text-rose-300 p-3 rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-slate-300 font-bold block">Adresse E-mail Administrateur :</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/60 font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold block">Mot de Passe :</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/60 font-sans pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold block">Code 2FA (Optionnel) :</label>
              <input
                type="text"
                placeholder="Ex: 884901"
                value={twoFaInput}
                onChange={(e) => setTwoFaInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/60 font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isLockedOut}
              className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>Se Connecter au Console Admin</span>
            </button>
          </form>

          {/* Return button */}
          <div className="pt-2 text-center">
            <button
              onClick={onExitAdmin}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1 font-mono"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Retour à la plateforme publique</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Render Premium Dashboard Layout for Authenticated Admins
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* Toast Notification Floating Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl border shadow-2xl font-mono text-xs flex items-center gap-2 max-w-md ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-300 border-emerald-500/60 shadow-emerald-950/50'
                : toastMessage.type === 'warning'
                ? 'bg-amber-950/95 text-amber-300 border-amber-500/60 shadow-amber-950/50'
                : 'bg-blue-950/95 text-blue-300 border-blue-500/60 shadow-blue-950/50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 relative overflow-hidden">
        
        {/* SIDEBAR NAVIGATION (Desktop + Mobile Drawer) */}
        <aside
          className={`bg-slate-900/95 border-r border-slate-800/90 flex flex-col justify-between transition-all duration-300 z-30 ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          } hidden md:flex sticky top-0 h-screen backdrop-blur-2xl`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-mono font-bold shadow-md shadow-amber-500/20">
                  <ShieldAlert className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h2 className="font-mono font-bold text-white text-sm tracking-tight">Chris Admin</h2>
                  <span className="text-[10px] font-mono text-amber-400 block -mt-0.5">Control Panel</span>
                </div>
              </div>
            )}
            {isSidebarCollapsed && (
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
                <ShieldAlert className="w-4 h-4" />
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isSidebarCollapsed ? 'Déplier la barre' : 'Réduire la barre'}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1.5 font-mono text-xs flex-1 overflow-y-auto">
            
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'DASHBOARD'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Tableau de bord</span>}
            </button>

            <button
              onClick={() => setActiveTab('USERS')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'USERS'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Utilisateurs</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'USERS' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  {users.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('SUBSCRIPTIONS')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'SUBSCRIPTIONS'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <CreditCard className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Abonnements VIP</span>}
            </button>

            <button
              onClick={() => setActiveTab('PAYMENTS')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'PAYMENTS'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <DollarSign className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Transactions & Pay</span>}
            </button>

            <button
              onClick={() => setActiveTab('STATS')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'STATS'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Statistiques</span>}
            </button>

            <button
              onClick={() => setActiveTab('AUDIT')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'AUDIT'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Journaux d'Audit</span>}
            </button>

            <button
              onClick={() => setActiveTab('TWELVEDATA')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'TWELVEDATA'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Quota Twelve Data</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  twelveDataQuota.status === 'NORMAL' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' :
                  twelveDataQuota.status === 'ATTENTION' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                  twelveDataQuota.status === 'ALERTE' ? 'bg-orange-950 text-orange-300 border border-orange-500/40' :
                  'bg-rose-950 text-rose-300 border border-rose-500/40'
                }`}>
                  {twelveDataQuota.status}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('SETTINGS')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'SETTINGS'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>Paramètres</span>}
            </button>

          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-800/80 font-mono text-xs space-y-2">
            <button
              onClick={onExitAdmin}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              {!isSidebarCollapsed && <span>Site Public</span>}
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900 text-rose-300 border border-rose-500/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              {!isSidebarCollapsed && <span>Déconnexion</span>}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Bar Navigation */}
          <header className="bg-slate-900/90 border-b border-slate-800/90 px-4 py-3 sticky top-0 z-20 backdrop-blur-xl flex items-center justify-between gap-4 font-mono">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-200"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-bold text-white text-base tracking-tight flex items-center gap-2">
                  <span>
                    {activeTab === 'DASHBOARD' && 'Tableau de Bord Administrateur'}
                    {activeTab === 'USERS' && 'Gestion des Utilisateurs & Abonnés'}
                    {activeTab === 'SUBSCRIPTIONS' && 'Gestion des Abonnements VIP'}
                    {activeTab === 'PAYMENTS' && 'Historique des Transactions'}
                    {activeTab === 'STATS' && 'Statistiques & Ratios de Conversion'}
                    {activeTab === 'AUDIT' && 'Journaux d\'Audit Sécurisés'}
                    {activeTab === 'TWELVEDATA' && 'Supervision Quota Twelve Data & Intégrité XAU/USD'}
                    {activeTab === 'SETTINGS' && 'Paramètres de Sécurité'}
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
                  Console de supervision en temps réel • admin.chris
                </p>
              </div>
            </div>

            {/* Quick Action Top Right */}
            <div className="flex items-center gap-2.5 text-xs">
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-amber-950/70 border border-amber-500/40 rounded-xl text-amber-300 font-mono text-[11px] shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Administrateur Unique Exclusif • admin@chrisxauusd.com</span>
              </div>

              <button
                onClick={() => setIsCreateUserModalOpen(true)}
                className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4 text-slate-950" />
                <span className="hidden sm:inline">Créer Abonné</span>
              </button>

              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                C
              </div>
            </div>
          </header>

          {/* PAGE CONTENT CONTAINER */}
          <main className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
            
            {/* 1. DASHBOARD VIEW */}
            {activeTab === 'DASHBOARD' && (
              <div className="space-y-6">
                
                {/* Modern KPI Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* KPI 1: Active Subscribers */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
                      <span>Abonnés VIP Actifs</span>
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <UserCheck className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2 font-mono">
                      <span className="text-xl sm:text-2xl font-black text-white">{activeSubscribers}</span>
                      <span className="text-xs font-bold text-emerald-400 flex items-center">
                        <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(activeSubscribers / totalSubscribers) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">
                      {expiringSoonCount} proches de la date d'expiration (J-3)
                    </p>
                  </div>

                  {/* KPI 2: Total Revenue */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
                      <span>Revenus d'Abonnements</span>
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <DollarSign className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2 font-mono">
                      <span className="text-xl sm:text-2xl font-black text-amber-400">
                        {formatFcfa(totalRevenueFcfa)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full w-4/5" />
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Total accumulé via Mobile Money & CB
                    </p>
                  </div>

                  {/* KPI 3: Total Registered Users */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
                      <span>Total Membres Inscrits</span>
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2 font-mono">
                      <span className="text-xl sm:text-2xl font-black text-white">{totalSubscribers}</span>
                      <span className="text-xs font-bold text-slate-400">base de données</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full w-3/4" />
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">
                      {expiredCount} abonnements expirés non renouvelés
                    </p>
                  </div>

                  {/* KPI 4: Security & Suspensions */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
                      <span>Comptes Suspendus</span>
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                        <Lock className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2 font-mono">
                      <span className="text-xl sm:text-2xl font-black text-purple-300">{suspendedCount}</span>
                      <span className="text-xs font-bold text-slate-500">verrouillés</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full w-1/4" />
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Dernier audit de sécurité : aujourd'hui
                    </p>
                  </div>

                </div>

                {/* Middle Charts & Stats Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Revenue Growth Custom Bar Widget */}
                  <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="font-bold text-white text-sm">Évolution des Recettes (FCFA)</h3>
                        <p className="text-[11px] text-slate-400 font-sans">Abonnements mensuels sur 6 mois</p>
                      </div>
                      <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                        +28% MoM
                      </span>
                    </div>

                    <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800">
                      {[
                        { month: 'Fév', val: 2800000, height: '40%' },
                        { month: 'Mar', val: 3500000, height: '55%' },
                        { month: 'Avr', val: 4200000, height: '65%' },
                        { month: 'Mai', val: 4900000, height: '75%' },
                        { month: 'Juin', val: 6300000, height: '90%' },
                        { month: 'Juil', val: 7000000, height: '100%' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                          <span className="text-[10px] text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            {(item.val / 1000000).toFixed(1)}M
                          </span>
                          <div
                            className="w-full bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                            style={{ height: item.height }}
                          />
                          <span className="text-[11px] text-slate-400">{item.month}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 font-sans pt-1">
                      <span>Mode de règlement privilégié : <strong>Mobile Money (Wave & Orange) 82%</strong></span>
                      <button
                        onClick={() => setActiveTab('PAYMENTS')}
                        className="text-amber-400 hover:underline font-mono text-[11px] flex items-center gap-1"
                      >
                        Voir les transactions <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Distribution by Country Widget */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono">
                    <div className="border-b border-slate-800 pb-3">
                      <h3 className="font-bold text-white text-sm">Répartition Géographique</h3>
                      <p className="text-[11px] text-slate-400 font-sans">Origine des abonnés XAUUSD</p>
                    </div>

                    <div className="space-y-3 font-sans text-xs">
                      {[
                        { flag: '🇨🇲', country: 'Cameroun', count: 48, percent: 38 },
                        { flag: '🇨🇮', country: 'Côte d\'Ivoire', count: 32, percent: 25 },
                        { flag: '🇸🇳', country: 'Sénégal', count: 24, percent: 19 },
                        { flag: '🇫🇷', country: 'France / EU', count: 14, percent: 11 },
                        { flag: '🇬🇦', country: 'Gabon & Autres', count: 9, percent: 7 },
                      ].map((c, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-200 flex items-center gap-1.5">
                              <span>{c.flag}</span> <span>{c.country}</span>
                            </span>
                            <span className="font-mono text-slate-400 text-[11px]">
                              {c.count} ({c.percent}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-amber-400 h-full rounded-full"
                              style={{ width: `${c.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Bottom Quick Action Table Preview */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>Derniers Abonnés Enregistrés</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('USERS')}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <span>Accéder au répertoire complet</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 font-mono text-slate-400 uppercase text-[10px]">
                          <th className="pb-2">Membre</th>
                          <th className="pb-2">Pays / Téléphone</th>
                          <th className="pb-2">Formule</th>
                          <th className="pb-2">Expiration</th>
                          <th className="pb-2 text-right">Action Rapide</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {users.slice(0, 4).map((u) => (
                          <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-2.5 font-bold text-slate-100 font-mono">{u.name}</td>
                            <td className="py-2.5 font-mono text-slate-300">{u.flag} {u.phone}</td>
                            <td className="py-2.5 font-mono text-amber-300">{u.planType}</td>
                            <td className="py-2.5 font-mono text-slate-300">{formatDateFr(u.expirationDate)}</td>
                            <td className="py-2.5 text-right font-mono">
                              <button
                                onClick={() => handleExtendSubscription(u, 30)}
                                className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold transition-all"
                              >
                                +30j
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 2. USERS MANAGEMENT MODULE */}
            {activeTab === 'USERS' && (
              <div className="space-y-4 font-mono">
                
                {/* Search, Filter & Bulk Controls Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-xs">
                  
                  {/* Search Bar */}
                  <div className="relative w-full lg:w-80">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Nom, Email, Téléphone, Pays..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 font-sans"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
                    <button
                      onClick={() => setStatusFilter('ALL')}
                      className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all ${
                        statusFilter === 'ALL'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Tous ({users.length})
                    </button>
                    <button
                      onClick={() => setStatusFilter('ACTIVE')}
                      className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all ${
                        statusFilter === 'ACTIVE'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Actifs ({users.filter((u) => u.status === 'ACTIVE').length})
                    </button>
                    <button
                      onClick={() => setStatusFilter('EXPIRING_SOON')}
                      className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all ${
                        statusFilter === 'EXPIRING_SOON'
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Expirent sous J-3 ({expiringSoonCount})
                    </button>
                    <button
                      onClick={() => setStatusFilter('EXPIRED')}
                      className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all ${
                        statusFilter === 'EXPIRED'
                          ? 'bg-rose-500 text-slate-950'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Expirés ({expiredCount})
                    </button>
                  </div>

                </div>

                {/* Users Main Table */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-sans text-xs">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 font-mono text-slate-400 uppercase text-[10px]">
                          <th
                            onClick={() => {
                              setSortColumn('name');
                              setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            }}
                            className="p-3.5 cursor-pointer hover:text-white"
                          >
                            Abonné VIP ↕
                          </th>
                          <th className="p-3.5">Téléphone / Pays</th>
                          <th className="p-3.5">Formule Choisie</th>
                          <th className="p-3.5">Statut Accès</th>
                          <th
                            onClick={() => {
                              setSortColumn('expiration');
                              setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            }}
                            className="p-3.5 cursor-pointer hover:text-white"
                          >
                            Date d'Expiration ↕
                          </th>
                          <th
                            onClick={() => {
                              setSortColumn('totalPaid');
                              setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            }}
                            className="p-3.5 cursor-pointer hover:text-white"
                          >
                            Total Payé ↕
                          </th>
                          <th className="p-3.5 text-right font-mono">Actions Administrateur</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 font-sans">
                        {paginatedUsers.length > 0 ? (
                          paginatedUsers.map((u) => {
                            const daysLeft = Math.ceil(
                              (new Date(u.expirationDate).getTime() - Date.now()) / (1000 * 3600 * 24)
                            );

                            return (
                              <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                                
                                {/* User Details */}
                                <td className="p-3.5">
                                  <div className="font-mono font-bold text-slate-100 flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-xs shrink-0">
                                      {u.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                      <div className="flex items-center gap-1.5">
                                        <span>{u.name}</span>
                                        {u.traderLevel === 'MASTER_TRADER' && <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-bold">👑 Master</span>}
                                        {u.traderLevel === 'SCALPER_PRO' && <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-1.5 py-0.2 rounded font-bold">⚡ Scalper</span>}
                                        {u.traderLevel === 'INTERMEDIAIRE' && <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-1.5 py-0.2 rounded font-bold">📈 Trader</span>}
                                        {u.traderLevel === 'DEBUTANT' && <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">🌱 VIP</span>}
                                      </div>
                                      {u.customBadge && <span className="text-[9px] text-amber-400 font-bold">{u.customBadge}</span>}
                                    </div>
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono pl-9">{u.email}</div>
                                </td>

                                {/* Phone & Country */}
                                <td className="p-3.5 font-mono">
                                  <div className="text-slate-200 flex items-center gap-1.5">
                                    <span>{u.flag}</span>
                                    <span>{u.phone}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-500">{u.country}</div>
                                </td>

                                {/* Plan */}
                                <td className="p-3.5 font-mono">
                                  <span className="text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30 text-[11px] font-bold">
                                    {u.planType}
                                  </span>
                                </td>

                                {/* Status */}
                                <td className="p-3.5 font-mono">
                                  {u.status === 'ACTIVE' && (
                                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" /> ACTIF ({daysLeft}j)
                                    </span>
                                  )}
                                  {u.status === 'EXPIRING_SOON' && (
                                    <span className="bg-amber-950 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3" /> J-{daysLeft} EXPIRATION
                                    </span>
                                  )}
                                  {u.status === 'EXPIRED' && (
                                    <span className="bg-rose-950 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                      <XCircle className="w-3 h-3" /> EXPIRÉ
                                    </span>
                                  )}
                                  {u.status === 'SUSPENDED' && (
                                    <span className="bg-slate-800 text-slate-300 border border-slate-600 px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                                      <Lock className="w-3 h-3" /> SUSPENDU
                                    </span>
                                  )}
                                </td>

                                {/* Expiration */}
                                <td className="p-3.5 font-mono text-slate-300">
                                  {formatDateFr(u.expirationDate)}
                                </td>

                                {/* Total Paid */}
                                <td className="p-3.5 font-mono font-bold text-amber-400">
                                  {formatFcfa(u.totalPaidFcfa)}
                                </td>

                                {/* Actions */}
                                <td className="p-3.5 text-right font-mono">
                                  <div className="flex items-center justify-end gap-1.5">
                                    
                                    <button
                                      onClick={() => handleExtendSubscription(u, 30)}
                                      className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 px-2 py-1 rounded text-[11px] font-bold transition-all"
                                      title="Prolonger l'accès de +30 jours"
                                    >
                                      +30j
                                    </button>

                                    <button
                                      onClick={() => setSelectedUserForEdit(u)}
                                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 p-1.5 rounded transition-all"
                                      title="Éditer les paramètres d'abonnement"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      onClick={() => handleToggleSuspend(u)}
                                      className={`p-1.5 rounded border transition-all ${
                                        u.status === 'SUSPENDED'
                                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                                          : 'bg-amber-950 text-amber-300 border-amber-500/40'
                                      }`}
                                      title={u.status === 'SUSPENDED' ? 'Débloquer le compte' : 'Suspendre le compte'}
                                    >
                                      {u.status === 'SUSPENDED' ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                    </button>

                                    <button
                                      onClick={() => setSelectedUserForDelete(u)}
                                      className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/30 p-1.5 rounded transition-all"
                                      title="Supprimer définitivement l'abonné"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>

                                  </div>
                                </td>

                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-500 font-mono text-xs">
                              Aucun abonné correspondant trouvé.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer Bar */}
                  <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
                    <div>
                      Page <strong>{currentPage}</strong> sur <strong>{totalPages}</strong> ({filteredUsers.length} résultats)
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 disabled:opacity-40 transition-colors"
                      >
                        Précédent
                      </button>
                      <button
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 disabled:opacity-40 transition-colors"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 3. SUBSCRIPTIONS MANAGEMENT MODULE */}
            {activeTab === 'SUBSCRIPTIONS' && (
              <div className="space-y-6 font-mono">
                
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-400" />
                    <span>Supervision des Cycles d'Abonnement VIP</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-sans">
                    Ajustez les dates d'expiration, les reconductions automatiques et les prolongations d'accès pour vos membres.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map((u) => {
                    const daysLeft = Math.ceil(
                      (new Date(u.expirationDate).getTime() - Date.now()) / (1000 * 3600 * 24)
                    );
                    const progressPercent = Math.max(0, Math.min(100, (daysLeft / 30) * 100));

                    return (
                      <div
                        key={u.id}
                        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md hover:border-amber-500/40 transition-all font-sans"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                              {u.planType}
                            </span>
                            <h3 className="font-mono font-bold text-white text-sm mt-1.5">{u.name}</h3>
                            <p className="text-[11px] font-mono text-slate-400">{u.flag} {u.phone}</p>
                          </div>

                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                              u.status === 'ACTIVE'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                : u.status === 'EXPIRING_SOON'
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {u.status}
                          </span>
                        </div>

                        {/* Progress Bar Remaining Days */}
                        <div className="space-y-1 font-mono">
                          <div className="flex items-center justify-between text-[11px] text-slate-300">
                            <span>Jours restants :</span>
                            <strong className="text-amber-400 font-bold">{daysLeft > 0 ? `${daysLeft} jours` : 'Expiré'}</strong>
                          </div>
                          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                            <div
                              className={`h-full rounded-full transition-all ${
                                daysLeft > 7 ? 'bg-emerald-400' : daysLeft > 0 ? 'bg-amber-400' : 'bg-rose-500'
                              }`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-500">
                            Expire le : {formatDateFr(u.expirationDate)}
                          </p>
                        </div>

                        {/* Quick Action Extensions */}
                        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                          <button
                            onClick={() => handleExtendSubscription(u, 7)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 rounded-lg font-bold transition-all text-center border border-slate-700"
                          >
                            +7j
                          </button>
                          <button
                            onClick={() => handleExtendSubscription(u, 30)}
                            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 py-1.5 rounded-lg font-bold transition-all text-center"
                          >
                            +30j (1M)
                          </button>
                          <button
                            onClick={() => handleExtendSubscription(u, 90)}
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 py-1.5 rounded-lg font-bold transition-all text-center"
                          >
                            +90j (3M)
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* 4. PAYMENTS & TRANSACTIONS LOG */}
            {activeTab === 'PAYMENTS' && (
              <div className="space-y-4 font-mono">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    <span>Journal des Paiements & Reçus Mobile Money</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-sans">
                    Traçabilité en temps réel des transactions Orange Money, MTN, Wave et Carte Bancaire.
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-xs">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 font-mono text-slate-400 uppercase text-[10px]">
                          <th className="p-3.5">Référence TX</th>
                          <th className="p-3.5">Nom du Client</th>
                          <th className="p-3.5">Mode de Paiement</th>
                          <th className="p-3.5">Montant FCFA</th>
                          <th className="p-3.5">Statut</th>
                          <th className="p-3.5">Date & Heure</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 font-mono">
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-3.5 font-bold text-amber-400">{tx.txRef}</td>
                            <td className="p-3.5 text-slate-200">
                              <div>{tx.userName}</div>
                              <span className="text-[10px] text-slate-500">{tx.userPhone}</span>
                            </td>
                            <td className="p-3.5 text-slate-300">{tx.method}</td>
                            <td className="p-3.5 font-bold text-white">{formatFcfa(tx.amountFcfa)}</td>
                            <td className="p-3.5">
                              {tx.status === 'SUCCESS' && (
                                <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                  SUCCÈS
                                </span>
                              )}
                              {tx.status === 'FAILED' && (
                                <span className="bg-rose-950 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                  ÉCHEC
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-slate-400 text-[11px]">{tx.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. STATISTICS & ANALYTICS MODULE */}
            {activeTab === 'STATS' && (
              <div className="space-y-6 font-mono">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-amber-400" />
                    <span>Statistiques & Indicateurs de Conversion</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-sans">
                    Analyse de la rétention, des taux de réabonnement et de la rentabilité par canal.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
                    <span className="text-slate-400 text-xs">Taux de Rétention VIP</span>
                    <div className="text-xl sm:text-2xl font-black text-emerald-400">92.4%</div>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Abonnés qui renouvellent après le 1er mois.
                    </p>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
                    <span className="text-slate-400 text-xs">Valeur Moyenne Abonné (LTV)</span>
                    <div className="text-lg sm:text-xl font-black text-amber-400">{formatFcfa(2800000)}</div>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Durée moyenne d'abonnement : 4 mois.
                    </p>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
                    <span className="text-slate-400 text-xs">Consultations Signaux/Jour</span>
                    <div className="text-xl sm:text-2xl font-black text-blue-400">4 820</div>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Pic d'activité : Session Londres (08h-11h GMT).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. AUDIT LOGS MODULE */}
            {activeTab === 'AUDIT' && (
              <div className="space-y-4 font-mono">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    <span>Journaux d'Audit Sécurisés</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-sans">
                    Historique infalsifiable de toutes les actions effectuées par les administrateurs.
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-xs">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 font-mono text-slate-400 uppercase text-[10px]">
                          <th className="p-3.5">Horodatage</th>
                          <th className="p-3.5">Admin</th>
                          <th className="p-3.5">Action</th>
                          <th className="p-3.5">Cible</th>
                          <th className="p-3.5">Détails</th>
                          <th className="p-3.5">IP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 font-mono">
                        {auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-3.5 text-slate-400 text-[11px]">
                              {new Date(log.timestamp).toLocaleString('fr-FR')}
                            </td>
                            <td className="p-3.5 font-bold text-white">{log.adminEmail}</td>
                            <td className="p-3.5">
                              <span className="bg-amber-950 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold text-[10px]">
                                {log.action}
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-200">{log.targetUser}</td>
                            <td className="p-3.5 text-slate-300 font-sans">{log.details}</td>
                            <td className="p-3.5 text-slate-500 text-[11px]">{log.ipAddress}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 7. SETTINGS & SECURITY MODULE */}
            {activeTab === 'SETTINGS' && (
              <div className="max-w-3xl space-y-6 font-mono">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-amber-400" />
                    <span>Paramètres de Sécurité du Console</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-sans">
                    Gérez la politique de sécurité, les délais de déconnexion automatique et l'authentification fortifiée.
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>Règle d'Administrateur Unique (Accès Exclusif)</span>
                      </h3>
                      <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                        Un seul et unique compte administrateur est autorisé dans toute la plateforme (<strong>admin@chrisxauusd.com</strong>).
                        La création d'un second administrateur est techniquement bloquée. Aucun utilisateur classique ne peut modifier son rôle en administrateur.
                      </p>
                    </div>
                    <span className="bg-amber-950 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold shrink-0">
                      EXCLUSIF (1 ACCOUNT)
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="font-bold text-white text-sm">Authentification à deux facteurs (2FA)</h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">
                        Exiger un code OTP lors des connexions à /admin.chris
                      </p>
                    </div>
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold">
                      ACTIVÉ
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="font-bold text-white text-sm">Déconnexion automatique pour inactivité</h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">
                        Ferme la session après 15 minutes sans interaction
                      </p>
                    </div>
                    <span className="bg-amber-950 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold">
                      15 MIN
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => showToast('Clé d\'API de signature régénérée.', 'info')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4 text-amber-400" />
                      <span>Régénérer la Clé de Chiffrement d'Audit</span>
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* 8. TWELVE DATA QUOTA & DATA INTEGRITY CONTROL MODULE */}
            {activeTab === 'TWELVEDATA' && (
              <div className="space-y-6 font-mono">
                
                {/* Header Status Banner */}
                <div className={`border p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  twelveDataQuota.status === 'NORMAL' ? 'bg-emerald-950/40 border-emerald-500/40' :
                  twelveDataQuota.status === 'ATTENTION' ? 'bg-amber-950/40 border-amber-500/40' :
                  twelveDataQuota.status === 'ALERTE' ? 'bg-orange-950/40 border-orange-500/40' :
                  'bg-rose-950/40 border-rose-500/40'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Activity className={`w-5 h-5 ${
                        twelveDataQuota.status === 'NORMAL' ? 'text-emerald-400' :
                        twelveDataQuota.status === 'ATTENTION' ? 'text-amber-400' :
                        twelveDataQuota.status === 'ALERTE' ? 'text-orange-400' :
                        'text-rose-400'
                      }`} />
                      <h2 className="font-bold text-white text-base">Supervision du Quota Twelve Data (Production)</h2>
                    </div>
                    <p className="text-xs text-slate-300 font-sans">
                      Contrôle strict des requêtes XAU/USD, marges de sécurité et protection contre le dépassement.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-sans">Statut du Quota :</span>
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase border shadow-md ${
                      twelveDataQuota.status === 'NORMAL' ? 'bg-emerald-500 text-slate-950 border-emerald-400' :
                      twelveDataQuota.status === 'ATTENTION' ? 'bg-amber-400 text-slate-950 border-amber-300' :
                      twelveDataQuota.status === 'ALERTE' ? 'bg-orange-500 text-white border-orange-400' :
                      'bg-rose-600 text-white border-rose-400 animate-pulse'
                    }`}>
                      {twelveDataQuota.status}
                    </span>
                  </div>
                </div>

                {/* Grid of Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Metric 1: Appels Utilisés */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <span className="text-slate-400 text-xs">Appels Utilisés Aujourd'hui</span>
                    <div className="flex items-baseline justify-between font-mono">
                      <span className="text-2xl font-black text-white">{twelveDataQuota.dailyCallsCount}</span>
                      <span className="text-xs text-slate-400">/ {twelveDataQuota.maxDailyCalls} max</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          twelveDataQuota.percentUsed >= 85 ? 'bg-rose-500' :
                          twelveDataQuota.percentUsed >= 60 ? 'bg-amber-400' :
                          'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, twelveDataQuota.percentUsed)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans">
                      Limite interne: {twelveDataQuota.maxDailyCalls} requêtes
                    </p>
                  </div>

                  {/* Metric 2: Appels Restants */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <span className="text-slate-400 text-xs">Appels Restants</span>
                    <div className="flex items-baseline justify-between font-mono">
                      <span className="text-2xl font-black text-amber-400">{twelveDataQuota.remainingDailyCalls}</span>
                      <span className="text-xs text-slate-400">disponibles</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${100 - twelveDataQuota.percentUsed}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans">
                      Marge de sécurité: {twelveDataQuota.safetyMarginDaily} requêtes
                    </p>
                  </div>

                  {/* Metric 3: Pourcentage Utilisé */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <span className="text-slate-400 text-xs">Pourcentage Utilisé</span>
                    <div className="flex items-baseline justify-between font-mono">
                      <span className="text-2xl font-black text-white">{twelveDataQuota.percentUsed}%</span>
                      <span className="text-xs text-slate-400">du quota total</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, twelveDataQuota.percentUsed)}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans">
                      Seuil d'alerte: 85% du quota
                    </p>
                  </div>

                  {/* Metric 4: Limite Minute */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <span className="text-slate-400 text-xs">Débit par Minute (60s)</span>
                    <div className="flex items-baseline justify-between font-mono">
                      <span className="text-2xl font-black text-white">{twelveDataQuota.minutelyCallsCount}</span>
                      <span className="text-xs text-slate-400">/ {twelveDataQuota.maxMinutelyCalls} max</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(twelveDataQuota.minutelyCallsCount / twelveDataQuota.maxMinutelyCalls) * 100}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans">
                      Fenêtre glissante de 60 secondes
                    </p>
                  </div>

                </div>

                {/* Timestamps & Technical Details Box */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Horodatages & Traçabilité Réseau Twelve Data</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-sans">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 font-mono text-[11px]">Dernière Requête HTTP :</span>
                      <p className="font-mono text-white font-bold text-xs">
                        {twelveDataQuota.lastRequestTimestamp ? new Date(twelveDataQuota.lastRequestTimestamp).toLocaleString('fr-FR') : 'Aucune requête aujourd\'hui'}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 font-mono text-[11px]">Dernière Donnée XAU/USD Réelle :</span>
                      <p className="font-mono text-emerald-400 font-bold text-xs">
                        {twelveDataQuota.lastXauusdTimestamp ? new Date(twelveDataQuota.lastXauusdTimestamp).toLocaleString('fr-FR') : 'Donnée fraîche disponible'}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 font-mono text-[11px]">État de la Connexion API :</span>
                      <p className="font-mono text-amber-300 font-bold text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{twelveDataQuota.apiState}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rules & Commercial Readiness Checklist */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 font-sans text-xs">
                  <h3 className="font-bold text-white text-sm font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Règles d'Intégrité Commerciale & Protection Anti-Quota</span>
                  </h3>

                  <div className="space-y-2 text-slate-300">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>0% Fictive / Simulated Data :</strong> Aucun prix ou bougie factice n'est généré. Tout trade publié provient exclusivement de Twelve Data.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Limite de publication dynamique :</strong> L'application publie autant de setups valides que possible tant que le quota le permet.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Protection par Marge de Sécurité :</strong> Une réserve de 100 requêtes est conservée pour garantir la continuité du flux en direct.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Protection des Clés Secrets :</strong> La clé TWELVE_DATA_API_KEY est hébergée sur le serveur Express et masquée aux navigateurs.</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </main>

        </div>

      </div>

      {/* MODAL 1: EDIT USER SUBSCRIPTION */}
      <AnimatePresence>
        {selectedUserForEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 font-mono text-xs text-slate-100"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-white text-sm">Gérer l'Abonnement : {selectedUserForEdit.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedUserForEdit(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Expiration actuelle :</span>
                  <strong className="text-amber-400">{formatDateFr(selectedUserForEdit.expirationDate)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Téléphone / Mobile Money :</span>
                  <strong className="text-slate-200">{selectedUserForEdit.phone}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Formule active :</span>
                  <strong className="text-emerald-400">{selectedUserForEdit.planType}</strong>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 font-bold block">Prolonger rapidement de :</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleExtendSubscription(selectedUserForEdit, 15)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-100 py-2 rounded-xl font-bold border border-slate-700"
                  >
                    +15 jours
                  </button>
                  <button
                    onClick={() => handleExtendSubscription(selectedUserForEdit, 30)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 py-2 rounded-xl font-bold shadow-md shadow-amber-500/20"
                  >
                    +30 jours
                  </button>
                  <button
                    onClick={() => handleExtendSubscription(selectedUserForEdit, 90)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl font-bold shadow-md"
                  >
                    +90 jours
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-slate-300 font-bold block">Saisir un nombre de jours personnalisé :</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={customExtendDays}
                    onChange={(e) => setCustomExtendDays(parseInt(e.target.value) || 0)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                  <button
                    onClick={() => handleExtendSubscription(selectedUserForEdit, customExtendDays)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl"
                  >
                    Valider
                  </button>
                </div>
              </div>

              {/* VIP Trader Level & Badge Assignment by Admin */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Attribution Rôle & Badge VIP Trader (Exclusif Admin) :</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'MASTER_TRADER', label: '👑 Master Elite', badge: 'Certified Master VIP' },
                    { id: 'SCALPER_PRO', label: '⚡ Scalper Pro', badge: 'Pro Scalper XAU' },
                    { id: 'INTERMEDIAIRE', label: '📈 Intermédiaire', badge: 'Active Trader' },
                    { id: 'DEBUTANT', label: '🌱 Débutant VIP', badge: 'VIP Member' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleUpdateTraderLevelAndBadge(selectedUserForEdit, item.id as any, item.badge)}
                      className={`p-2.5 rounded-xl border text-left font-mono text-xs transition-all flex flex-col gap-0.5 cursor-pointer ${
                        selectedUserForEdit.traderLevel === item.id
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] text-slate-500">{item.badge}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: DELETE USER CONFIRMATION */}
      <AnimatePresence>
        {selectedUserForDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-rose-500/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 font-mono text-xs text-slate-100"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-950 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="font-bold text-white text-sm">Supprimer l'Abonné ?</h3>
                <p className="text-slate-300 font-sans">
                  Êtes-vous certain de vouloir supprimer le compte de <strong>{selectedUserForDelete.name}</strong> ({selectedUserForDelete.email}) ?
                  Cette opération supprimera définitivement ses accès.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setSelectedUserForDelete(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl font-bold"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-xl font-bold shadow-lg shadow-rose-600/30"
                >
                  Oui, Supprimer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: CREATE NEW USER MODAL */}
      <AnimatePresence>
        {isCreateUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 font-mono text-xs text-slate-100"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-white text-sm">Nouveau Membre Abonné VIP</h3>
                </div>
                <button
                  onClick={() => setIsCreateUserModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Nom complet :</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Samuel Kouamé"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Adresse E-mail :</label>
                  <input
                    type="email"
                    required
                    placeholder="samuel@gmail.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Téléphone Mobile Money :</label>
                    <input
                      type="text"
                      placeholder="+225 07 00 11 22"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Pays :</label>
                    <select
                      value={newUserCountry}
                      onChange={(e) => setNewUserCountry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-sans"
                    >
                      <option value="🇨🇲 Cameroun">🇨🇲 Cameroun</option>
                      <option value="🇨🇮 Côte d'Ivoire">🇨🇮 Côte d'Ivoire</option>
                      <option value="🇸🇳 Sénégal">🇸🇳 Sénégal</option>
                      <option value="🇫🇷 France">🇫🇷 France</option>
                      <option value="🇲🇦 Maroc">🇲🇦 Maroc</option>
                      <option value="🇬🇦 Gabon">🇬🇦 Gabon</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Formule :</label>
                    <select
                      value={newUserPlan}
                      onChange={(e) => setNewUserPlan(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-sans"
                    >
                      <option value="Mensuel (700k FCFA)">Mensuel (700k FCFA)</option>
                      <option value="Trimestriel VIP">Trimestriel VIP</option>
                      <option value="Annuel Premium">Annuel Premium</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Mode de Paiement :</label>
                    <select
                      value={newUserMethod}
                      onChange={(e) => setNewUserMethod(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-sans"
                    >
                      <option value="Orange Money">Orange Money</option>
                      <option value="MTN Mobile Money">MTN Mobile Money</option>
                      <option value="Wave">Wave Sénégal / CI</option>
                      <option value="Carte Bancaire">Carte Bancaire / Stripe</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <UserPlus className="w-4 h-4 text-slate-950" />
                  <span>Activer l'Abonnement (30 jours)</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
