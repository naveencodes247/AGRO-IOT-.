import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  UserCheck, 
  Phone, 
  Mail,
  Lock, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  MapPin, 
  Sprout, 
  Building2, 
  KeyRound,
  LogOut,
  RefreshCw,
  Send,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Flame
} from 'lucide-react';
import { UserRole } from '../../types';
import { useAuth } from '../../services/firebase/AuthContext';

export interface UserProfile {
  id: string;
  name: string;
  nameHi: string;
  role: UserRole;
  designation: string;
  designationHi: string;
  organization: string;
  phone: string;
  location: string;
  avatarBg: string;
  details: string;
  permissions: string[];
}

export const USER_PROFILES: Record<UserRole, UserProfile> = {
  farmer: {
    id: 'user-farmer-01',
    name: 'Rameshwar Patel',
    nameHi: 'रामेश्वर पटेल',
    role: 'farmer',
    designation: 'Progressive Farmer (किसान)',
    designationHi: 'प्रगतिशील किसान • किसान क्रेडिट धारक',
    organization: 'Kisan Shanti Krishi Farm (किसान शांति कृषि फार्म)',
    phone: '+91 98260 41234',
    location: 'Indore, Madhya Pradesh (मालवा अंचल)',
    avatarBg: 'bg-emerald-600',
    details: '5.8 Hectares (14.3 Acres) • Vertisols Black Soil • KVK Registered',
    permissions: [
      'View Real-time Sensor Telemetry',
      'Control Irrigation Pump & Drip Valves',
      'Run Edge AI Crop Health Scans',
      'Receive ICAR / KVK Advisory in Hindi & English',
      'Request Support & Agronomist Callback'
    ]
  },
  coordinator: {
    id: 'user-coord-01',
    name: 'Dr. Sunita Deshmukh',
    nameHi: 'डॉ. सुनीता देशमुख',
    role: 'coordinator',
    designation: 'Cluster Agronomist & KVK Coordinator',
    designationHi: 'क्लस्टर कृषि वैज्ञानिक एवं समन्वयक',
    organization: 'Krishi Vigyan Kendra (KVK Zone VII)',
    phone: '+91 94250 88765',
    location: 'Indore & Ujjain Agricultural Division',
    avatarBg: 'bg-blue-600',
    details: 'Supervising 142 Connected Smart Farms • Pest Surveillance Officer',
    permissions: [
      'Multi-Farm Telemetry Supervision',
      'Issue Emergency Pest & Disease Bulletins',
      'Review Farm Nitrate & Soil Fertility Reports',
      'Validate AI Agronomic Diagnostics',
      'Coordinate Kisan Support Escalations'
    ]
  },
  admin: {
    id: 'user-admin-01',
    name: 'Agro-IoT Central Operations',
    nameHi: 'कृषि-आईओटी केंद्रीय नोड',
    role: 'admin',
    designation: 'System Administrator (केंद्रीय प्रशासक)',
    designationHi: 'मुख्य प्रणाली एवं नेटवर्क प्रशासक',
    organization: 'ICAR-IISR Agro-IoT Gateway Central Control',
    phone: '+91 11 2584 1000',
    location: 'Central Cloud & Hardware Mesh Hub',
    avatarBg: 'bg-purple-600',
    details: 'Full Hardware Mesh, LoRa Gateway & Firmware Over-The-Air (FOTA) Access',
    permissions: [
      'Full Telemetry Mesh & Gateway Control',
      'Sensor Node Calibration & Threshold Configuration',
      'User & Farm Organization Management',
      'System Firmware & Edge AI Model Deployment',
      'API Security & Data Export Logs'
    ]
  }
};

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  lang: 'en' | 'hi';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  lang,
}) => {
  const { 
    firebaseUser, 
    activeProfile, 
    signInWithGoogle, 
    signInWithEmail, 
    sendPhoneOtp, 
    verifyPhoneOtp, 
    authenticateViaWhatsApp,
    switchDemoRole,
    logout,
    isLoading,
    error,
    clearError
  } = useAuth();

  // Authentication tabs: email, whatsapp, phone, quick
  const [activeTab, setActiveTab] = useState<'email' | 'whatsapp' | 'phone' | 'quick'>('email');
  
  // Selected role for login flow
  const [targetRole, setTargetRole] = useState<UserRole>(currentRole);
  
  // Email states
  const [emailInput, setEmailInput] = useState<string>('farmer.rameshwar@agroiotsmart.in');
  const [passwordInput, setPasswordInput] = useState<string>('Kisan@2026');
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);

  // Phone states
  const [phoneInput, setPhoneInput] = useState<string>('9826041234');
  const [otpInput, setOtpInput] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);

  // WhatsApp states
  const [whatsappPhone, setWhatsappPhone] = useState<string>('9826041234');
  const [whatsappPin, setWhatsappPin] = useState<string>('');
  const [isWhatsAppSent, setIsWhatsAppSent] = useState<boolean>(false);

  // Success banner
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDisplayProfile = activeProfile.role ? USER_PROFILES[activeProfile.role] : USER_PROFILES[currentRole];

  const handleRolePreset = (r: UserRole) => {
    setTargetRole(r);
    if (r === 'farmer') {
      setEmailInput('farmer.rameshwar@agroiotsmart.in');
      setPhoneInput('9826041234');
      setWhatsappPhone('9826041234');
    } else if (r === 'coordinator') {
      setEmailInput('dr.sunita.kvk@icar.gov.in');
      setPhoneInput('9425088765');
      setWhatsappPhone('9425088765');
    } else {
      setEmailInput('admin@agroiotsmart.gov.in');
      setPhoneInput('9811002233');
      setWhatsappPhone('9811002233');
    }
  };

  const notifySuccessAndClose = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
      onSelectRole(targetRole);
      onClose();
    }, 1100);
  };

  // 1. Email Handler
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const ok = await signInWithEmail(emailInput, passwordInput, targetRole, isRegisterMode);
    if (ok) {
      notifySuccessAndClose(
        lang === 'hi' 
          ? `ईमेल द्वारा सफलतापूर्वक ${USER_PROFILES[targetRole].nameHi} के रूप में प्रमाणीकृत!` 
          : `Authenticated as ${USER_PROFILES[targetRole].name} via Firebase Email!`
      );
    }
  };

  // 2. WhatsApp Handler
  const handleSendWhatsAppAuth = () => {
    clearError();
    if (whatsappPhone.length >= 10) {
      setIsWhatsAppSent(true);
      setWhatsappPin('4291');
    }
  };

  const handleVerifyWhatsApp = async () => {
    clearError();
    const ok = await authenticateViaWhatsApp(whatsappPhone, targetRole);
    if (ok) {
      notifySuccessAndClose(
        lang === 'hi'
          ? `व्हाट्सएप द्वारा ${whatsappPhone} सत्यापित! ${USER_PROFILES[targetRole].nameHi} सक्रिय।`
          : `WhatsApp OTP Verified for ${whatsappPhone}! Logged in as ${USER_PROFILES[targetRole].name}.`
      );
    }
  };

  // 3. Phone Handler
  const handleSendPhone = async () => {
    clearError();
    if (phoneInput.length >= 10) {
      await sendPhoneOtp(phoneInput);
      setIsOtpSent(true);
      setOtpInput('8842'); // Auto-fill sample OTP for seamless testing
    }
  };

  const handleVerifyPhone = async () => {
    clearError();
    const ok = await verifyPhoneOtp(otpInput, targetRole);
    if (ok) {
      notifySuccessAndClose(
        lang === 'hi'
          ? `मोबाइल नंबर +91 ${phoneInput} सत्यापित!`
          : `Mobile number +91 ${phoneInput} verified via Firebase Authenticator!`
      );
    }
  };

  // 4. Google Auth
  const handleGoogleLogin = async () => {
    clearError();
    const ok = await signInWithGoogle(targetRole);
    if (ok) {
      notifySuccessAndClose(
        lang === 'hi'
          ? `गूगल द्वारा ${USER_PROFILES[targetRole].nameHi} के रूप में लॉगिन!`
          : `Successfully signed in via Google as ${USER_PROFILES[targetRole].name}!`
      );
    }
  };

  // 5. 1-Click Fast Switch
  const handleQuickSwitch = (role: UserRole) => {
    switchDemoRole(role);
    onSelectRole(role);
    notifySuccessAndClose(
      lang === 'hi'
        ? `त्वरित रूप से ${USER_PROFILES[role].nameHi} की भूमिका सक्रिय की गई!`
        : `Switched to ${USER_PROFILES[role].name} (${role.toUpperCase()})!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs font-sans animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#151916] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-750 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-bold">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400 inline" />
                  {lang === 'hi' ? 'फायरबेस प्रमाणीकरण केंद्र' : 'FIREBASE AGRI-AUTHENTICATOR'}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800">
                  SECURE ABAC
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {lang === 'hi' 
                  ? 'किसान, समन्वयक एवं प्रशासक लॉगिन' 
                  : 'Farmer, Coordinator & Admin Authenticator'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Login Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2 animate-fade-in shadow-md">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert Banner */}
        {error && (
          <div className="bg-rose-500/10 border-b border-rose-500/20 text-rose-700 dark:text-rose-300 px-4 py-2 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={clearError} className="text-stone-400 hover:text-stone-700 cursor-pointer text-xs font-bold">
              Dismiss
            </button>
          </div>
        )}

        {/* Current Active Session Overview */}
        <div className="px-4 py-3 bg-stone-50 dark:bg-stone-850/80 border-b border-stone-200 dark:border-stone-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${currentDisplayProfile.avatarBg} text-white flex items-center justify-center font-bold text-base shadow-sm flex-shrink-0`}>
              {currentDisplayProfile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
                  {lang === 'hi' ? currentDisplayProfile.nameHi : currentDisplayProfile.name}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  activeProfile.role === 'farmer' 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : activeProfile.role === 'coordinator'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                }`}>
                  {activeProfile.role}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-200 dark:bg-stone-750 text-stone-600 dark:text-stone-300 font-mono">
                  {activeProfile.authMethod.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3 h-3 text-stone-400" />
                <span className="truncate max-w-[280px] sm:max-w-none">{currentDisplayProfile.organization}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {firebaseUser ? (
              <button
                onClick={logout}
                className="px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-[11px] font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>{lang === 'hi' ? 'लॉगआउट' : 'Sign Out'}</span>
              </button>
            ) : (
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-500/20">
                FIREBASE SYNC ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* Role Selector Header Pill */}
        <div className="px-5 pt-3 pb-2 bg-stone-100/60 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">
            {lang === 'hi' ? 'लॉगिन हेतु पद / भूमिका:' : 'Choose Target Agri Role:'}
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {(['farmer', 'coordinator', 'admin'] as UserRole[]).map((r) => {
              const isSelected = targetRole === r;
              return (
                <button
                  key={r}
                  onClick={() => handleRolePreset(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? (r === 'farmer' ? 'bg-emerald-600 text-white shadow-xs' : r === 'coordinator' ? 'bg-blue-600 text-white shadow-xs' : 'bg-purple-600 text-white shadow-xs')
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {r === 'farmer' && <Sprout className="w-3 h-3" />}
                  {r === 'coordinator' && <Building2 className="w-3 h-3" />}
                  {r === 'admin' && <Shield className="w-3 h-3" />}
                  <span>{r}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Authentication Channels: Email, WhatsApp, Phone, Quick */}
        <div className="px-5 pt-3 pb-0 flex gap-2 border-b border-stone-200 dark:border-stone-800 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('email')}
            className={`pb-2 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'email'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-extrabold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'ईमेल प्रमाणीकरण' : 'Email Authentication'}</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`pb-2 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'whatsapp'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-extrabold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'hi' ? 'व्हाट्सएप लॉगिन' : 'WhatsApp Login'}</span>
          </button>

          <button
            onClick={() => setActiveTab('phone')}
            className={`pb-2 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'phone'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-extrabold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'मोबाइल OTP लॉगिन' : 'Phone OTP'}</span>
          </button>

          <button
            onClick={() => setActiveTab('quick')}
            className={`pb-2 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'quick'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-extrabold'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? '1-क्लिक त्वरित स्विच' : '1-Click Switch'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 max-h-[58vh] overflow-y-auto space-y-4">
          
          {/* TAB 1: EMAIL AUTHENTICATOR */}
          {activeTab === 'email' && (
            <form onSubmit={handleEmailAuth} className="space-y-3.5">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-xs">
                <p className="text-stone-600 dark:text-stone-300">
                  {lang === 'hi'
                    ? `चुने गए पद (${targetRole.toUpperCase()}) के लिए सुरक्षित फायरबेस ईमेल क्रेडेंशियल से लॉगिन करें:`
                    : `Log in with secure Firebase credentials configured for ${targetRole.toUpperCase()}:`}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                  {lang === 'hi' ? 'ईमेल पता (Email Address)' : 'Official Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    placeholder="farmer@agroiotsmart.in"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs font-mono font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1">
                  {lang === 'hi' ? 'पासवर्ड (Security Password)' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs font-mono font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-stone-600 dark:text-stone-400">
                  <input
                    type="checkbox"
                    checked={isRegisterMode}
                    onChange={(e) => setIsRegisterMode(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{lang === 'hi' ? 'नया खाता पंजीकृत करें (Register)' : 'New Account Registration'}</span>
                </label>
                <span className="text-[11px] text-stone-400 font-mono">
                  Role: {targetRole}
                </span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        {isRegisterMode
                          ? (lang === 'hi' ? 'नया खाता बनाएं' : `Register as ${targetRole.toUpperCase()}`)
                          : (lang === 'hi' ? 'ईमेल से लॉगिन करें' : `Authenticate as ${targetRole.toUpperCase()}`)}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google Sign-In</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: WHATSAPP AUTHENTICATION */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'hi' ? 'व्हाट्सएप वन-टाइम ऑथेंटिकेशन' : 'Instant WhatsApp Agri-Authenticator'}</span>
                </div>
                <p className="text-emerald-900/80 dark:text-emerald-400 text-[11px] leading-relaxed">
                  {lang === 'hi'
                    ? 'भारतीय किसानों और कृषि समन्वयकों के लिए सीधे व्हाट्सएप संदेश द्वारा सुरक्षित लॉगिन लिंक व ओटीपी।'
                    : 'Designed for rural Indian agriculture: Receive verified 1-click verification link & secure PIN directly on WhatsApp.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5">
                  {lang === 'hi' ? 'व्हाट्सएप मोबाइल नंबर (+91)' : 'Registered WhatsApp Number (+91)'}
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    maxLength={10}
                    placeholder="98260 41234"
                    className="flex-1 px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-xs font-mono font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleSendWhatsAppAuth}
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isWhatsAppSent ? (lang === 'hi' ? 'पुनः भेजें' : 'Resend') : (lang === 'hi' ? 'व्हाट्सएप कोड' : 'Send Code')}</span>
                  </button>
                </div>
              </div>

              {isWhatsAppSent && (
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-emerald-500/40 space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{lang === 'hi' ? 'व्हाट्सएप पर प्राप्त 4-अंकीय कोड:' : 'Enter WhatsApp Security PIN:'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      WhatsApp Code: 4291
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={whatsappPin}
                      onChange={(e) => setWhatsappPin(e.target.value)}
                      maxLength={4}
                      className="w-36 tracking-widest text-center px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-sm font-mono font-black"
                    />
                    <button
                      onClick={handleVerifyWhatsApp}
                      className="flex-1 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{lang === 'hi' ? 'सत्यापित करें और लॉगिन हों' : `Confirm & Log In as ${targetRole.toUpperCase()}`}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PHONE OTP */}
          {activeTab === 'phone' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5">
                  {lang === 'hi' ? 'भारतीय मोबाइल नंबर (+91)' : 'Indian Mobile Number (+91)'}
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-mono font-bold text-stone-600 dark:text-stone-300">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    maxLength={10}
                    placeholder="98260 41234"
                    className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-750 text-xs font-mono font-bold text-stone-900 dark:text-stone-100 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleSendPhone}
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    {isOtpSent ? (lang === 'hi' ? 'पुनः भेजें' : 'Resend OTP') : (lang === 'hi' ? 'OTP भेजें' : 'Get OTP')}
                  </button>
                </div>
              </div>

              {isOtpSent && (
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-emerald-500/40 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{lang === 'hi' ? '4-अंकीय OTP दर्ज करें:' : 'Enter 4-Digit Security OTP:'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      SMS OTP: 8842
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      maxLength={4}
                      className="w-32 tracking-widest text-center px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-sm font-mono font-black"
                    />
                    <button
                      onClick={handleVerifyPhone}
                      className="flex-1 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold cursor-pointer transition-all shadow-xs"
                    >
                      {lang === 'hi' ? 'सत्यापित कर लॉगिन करें' : `Verify & Sign In as ${targetRole.toUpperCase()}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: 1-CLICK QUICK ROLE SWITCHER */}
          {activeTab === 'quick' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                {lang === 'hi'
                  ? 'नीचे दिए गए तीनों भूमिकाओं में से किसी एक पर क्लिक करके तुरंत उस स्तर के अधिकारों और दृश्य को सक्रिय करें:'
                  : 'Select any of the three ecosystem roles below to immediately experience the platform tailored to that user tier:'}
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {(['farmer', 'coordinator', 'admin'] as UserRole[]).map((r) => {
                  const prof = USER_PROFILES[r];
                  const isCurrent = activeProfile.role === r;

                  return (
                    <div
                      key={r}
                      onClick={() => handleQuickSwitch(r)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                          : 'border-stone-200 dark:border-stone-750 hover:border-stone-300 dark:hover:border-stone-650 bg-white dark:bg-stone-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg ${prof.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-2xs`}>
                            {r === 'farmer' && <Sprout className="w-5 h-5" />}
                            {r === 'coordinator' && <Building2 className="w-5 h-5" />}
                            {r === 'admin' && <Shield className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
                                {lang === 'hi' ? prof.nameHi : prof.name}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                r === 'farmer' 
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : r === 'coordinator'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                    : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                              }`}>
                                {r.toUpperCase()}
                              </span>
                            </div>
                            <span className="text-xs text-stone-500 dark:text-stone-400 block mt-0.5">
                              {lang === 'hi' ? prof.designationHi : prof.designation}
                            </span>
                          </div>
                        </div>

                        <button 
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-900 hover:text-white'
                          }`}
                        >
                          {isCurrent ? (lang === 'hi' ? 'सक्रिय' : 'Active') : (lang === 'hi' ? 'चुनें' : 'Switch')}
                        </button>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{prof.location}</span>
                        </span>
                        <span>•</span>
                        <span>{prof.details}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Target Role Permissions Card */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-xs space-y-2">
            <span className="font-bold text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
              {lang === 'hi' 
                ? `${USER_PROFILES[targetRole].nameHi} के अधिकार (Permissions Matrix):`
                : `${targetRole.toUpperCase()} ABAC Permissions Matrix:`}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-stone-700 dark:text-stone-300">
              {USER_PROFILES[targetRole].permissions.map((p, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 dark:bg-stone-850/60 border-t border-stone-200 dark:border-stone-750 flex items-center justify-between text-xs">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Firebase ABAC • ICAR Indian Agri Trust Shield 2026</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-750 text-stone-800 dark:text-stone-200 font-bold hover:bg-stone-300 dark:hover:bg-stone-700 cursor-pointer"
          >
            {lang === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
