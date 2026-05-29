import React, { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  updateProfile 
} from "firebase/auth";
import { auth } from "../firebase";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Mail, Lock, User, LogIn, ArrowLeft, AlertCircle, RefreshCw, CheckCircle } from "lucide-react";
import { Language } from "../types";

interface AuthPageProps {
  language: Language;
  onSuccess: () => void;
  onBackToLanding: () => void;
}

export default function AuthPage({ language, onSuccess, onBackToLanding }: AuthPageProps) {
  const isEn = language === "english";
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawErrorCode, setRawErrorCode] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Translate labels and helper texts
  const t = {
    titleLogin: isEn ? "Enterprise Secure Portal" : "এন্টারপ্রাইজ সিকিউর পোর্টাল",
    titleSignup: isEn ? "Create Professional Node" : "প্রফেশনাল ক্রিয়েটর অ্যাকাউন্ট",
    subLogin: isEn 
      ? "Log in to access your saved project vaults and live node statistics." 
      : "আপনার সংরক্ষিত প্রজেক্ট ডিরেক্টরি এবং ক্লাস্টার স্পিড দেখতে লগইন করুন।",
    subSignup: isEn 
      ? "Join PCS AI Studio to save campaigns, analyze live loads, and lock down secure access." 
      : "আপনার পছন্দের ক্যাম্পেইন ও প্রম্পট সংরক্ষণ করতে পিসিএস ক্রিয়েটর ক্লাস্টারে যুক্ত হন।",
    emailLabel: isEn ? "Corporate Email Address" : "কর্পোরেট ইমেইল ঠিকানা",
    passLabel: isEn ? "Secure Gateway Password" : "অনন্য সিকিউর পাসওয়ার্ড",
    nameLabel: isEn ? "Your Professional Name" : "আপনার নাম (নাম/পদবি)",
    googleBtn: isEn ? "Authorize with Google Account" : "গুগল অ্যাকাউন্ট দিয়ে অ্যাক্সেস করুন",
    loginSubmit: isEn ? "Sign In to Console" : "প্যানেলে প্রবেশ করুন",
    signupSubmit: isEn ? "Register New Account" : "নতুন অ্যাকাউন্ট নিবন্ধন করুন",
    orText: isEn ? "OR MULTI-AUTHENTICATE VIA" : "অথবা অন্যান্য সিকিউর পদ্ধতি",
    backBtn: isEn ? "Return to Main Page" : "মূল স্ক্রিনে ফিরে যান",
    tabLogin: isEn ? "Log In" : "লগইন",
    tabSignup: isEn ? "Sign Up" : "নিবন্ধন",
    weakPassword: isEn ? "Password must be at least 6 characters." : "পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।",
    fillAll: isEn ? "Please fill in all fields correctly." : "অনুগ্রহ করে সব তথ্য সঠিক উপায়ে পূরণ করুন।",
  };

  // Convert Firebase technical errors to friendly bilingual human warnings
  const getFriendlyError = (code: string) => {
    if (!isEn) {
      if (code.includes("auth/invalid-email")) return "ভুল ইমেইল ঠিকানা প্রদান করা হয়েছে। অনুগ্রহ করে সঠিক মেইল দিন।";
      if (code.includes("auth/user-not-found") || code.includes("auth/wrong-password") || code.includes("auth/invalid-credential")) {
        return "ভুল ইমেইল অথবা পাসওয়ার্ড দেওয়া হয়েছে। আবার চেষ্টা করুন।";
      }
      if (code.includes("auth/email-already-in-use")) return "এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হচ্ছে। অন্য কোনো ইমেইল ব্যবহার করুন।";
      if (code.includes("auth/network-request-failed")) return "নেটওয়ার্ক সংযোগে সমস্যা হয়েছে। ইন্টারনেট পরীক্ষা করুন।";
      if (code.includes("auth/weak-password")) return "পাসওয়ার্ডটি খুবই দুর্বল। পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের রাখুন।";
      if (code.includes("auth/popup-closed-by-user")) return "গুগল অথেনটিকেশন পপআপ উইন্ডো বন্ধ করা হয়েছে।";
      return `অনাকাঙ্ক্ষিত ত্রুটি: ${code}`;
    } else {
      if (code.includes("auth/invalid-email")) return "Invalid email address formatting.";
      if (code.includes("auth/user-not-found") || code.includes("auth/wrong-password") || code.includes("auth/invalid-credential")) {
        return "Incorrect email or password combination.";
      }
      if (code.includes("auth/email-already-in-use")) return "This email is already associated with an account.";
      if (code.includes("auth/network-request-failed")) return "Network request failed. Please check internet access.";
      if (code.includes("auth/weak-password")) return "Password is too weak. Needs at least 6 characters.";
      if (code.includes("auth/popup-closed-by-user")) return "Google sign-in popup closed before authorization.";
      return `Authorization failure: ${code}`;
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password || (activeTab === "signup" && !displayName)) {
      setError(t.fillAll);
      return;
    }

    if (password.length < 6) {
      setError(t.weakPassword);
      return;
    }

    setLoading(true);
    try {
      if (activeTab === "login") {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        setSuccess(isEn ? "Gateway Authorized! Redirecting..." : "অনুমতি নিশ্চিত! ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে...");
        setTimeout(() => {
          onSuccess();
        }, 1200);
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (userCred.user) {
          await updateProfile(userCred.user, { displayName: displayName.trim() });
        }
        setSuccess(isEn ? "Account registered! Access granted." : "নিবন্ধন সম্পন্ন! ক্রিয়েটর ক্লাস্টারে যুক্ত হয়েছেন।");
        setTimeout(() => {
          onSuccess();
        }, 1200);
      }
    } catch (err: any) {
      console.error(err);
      const code = err.code || err.message || "";
      setRawErrorCode(code);
      setError(getFriendlyError(code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setRawErrorCode(null);
    setSuccess(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setSuccess(isEn ? "Google Authorization Approved! Opening session..." : "গুগল একাউন্ট অনুমতি সফল! সেশন শুরু হচ্ছে...");
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      const code = err.code || err.message || "";
      setRawErrorCode(code);
      setError(getFriendlyError(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-emerald-400 selection:text-[#090a0f]" id="auth-root-container">
      {/* Decorative cybernetic circles */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Mini top header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-16 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={onBackToLanding} id="auth-logo">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight text-white">
              PCS <span className="text-emerald-400">AI</span> Studio
            </span>
          </div>
        </div>

        <button 
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-mono font-bold text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer px-3 py-1.5 rounded-lg border border-gray-800/60 bg-[#121420]/30"
          id="auth-back-nav"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t.backBtn}
        </button>
      </div>

      {/* Multi-mode container */}
      <div className="flex-grow flex items-center justify-center p-4 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#121420]/40 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-6 md:p-8 shadow-[0_15px_50px_rgba(0,0,0,0.6)]"
          id="auth-box-card"
        >
          {/* Header titles */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-black font-sans text-white tracking-wide uppercase flex items-center justify-center gap-2">
              <span className="text-emerald-400">●</span> 
              {activeTab === "login" ? t.titleLogin : t.titleSignup}
            </h2>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed px-2">
              {activeTab === "login" ? t.subLogin : t.subSignup}
            </p>
          </div>

          {/* Secure Tab Selection Toggle */}
          <div className="grid grid-cols-2 bg-[#090a0f] p-1 rounded-xl border border-gray-800 mb-6 shadow-inner" id="auth-tab-switch">
            <button
              onClick={() => {
                setActiveTab("login");
                setError(null);
                setRawErrorCode(null);
                setSuccess(null);
              }}
              className={`py-2 text-xs font-bold uppercase rounded-lg transition-all duration-300 cursor-pointer ${
                activeTab === "login"
                  ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_2px_10px_rgba(16,185,129,0.15)]"
                  : "text-gray-500 hover:text-gray-300"
              }`}
              id="auth-tab-login"
            >
              {t.tabLogin}
            </button>
            <button
              onClick={() => {
                setActiveTab("signup");
                setError(null);
                setRawErrorCode(null);
                setSuccess(null);
              }}
              className={`py-2 text-xs font-bold uppercase rounded-lg transition-all duration-300 cursor-pointer ${
                activeTab === "signup"
                  ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_2px_10px_rgba(16,185,129,0.15)]"
                  : "text-gray-500 hover:text-gray-300"
              }`}
              id="auth-tab-signup"
            >
              {t.tabSignup}
            </button>
          </div>

          {/* Alert Notifications */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/35 p-3 rounded-lg flex flex-col gap-2 mb-5"
                id="auth-alert-error"
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-red-300 font-medium leading-relaxed">{error}</span>
                </div>
                {rawErrorCode && rawErrorCode.includes("email-already-in-use") && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      setError(null);
                      setRawErrorCode(null);
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-mono font-bold tracking-wide uppercase text-left underline pl-7 cursor-pointer hover:underline transition-all"
                  >
                    {isEn ? "→ Switch to Log In tab now" : "→ সরাসরি লগইন ট্যাবে যান"}
                  </button>
                )}
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/35 p-3 rounded-lg flex items-start gap-2.5 mb-5"
                id="auth-alert-success"
              >
                <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
                <span className="text-xs text-emerald-300 font-semibold leading-relaxed">{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core Login/Signup Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4" id="auth-core-form">
            {activeTab === "signup" && (
              <div>
                <label className="block text-[10px] font-mono tracking-widest text-emerald-400 uppercase mb-1.5">
                  {t.nameLabel}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    placeholder={isEn ? "e.g. John Doe" : "উদা: শাহরিয়ার কবির"}
                    className="w-full bg-[#090a0f]/90 border border-gray-800/80 focus:border-emerald-500/50 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none transition-all placeholder-gray-600"
                    id="auth-input-name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono tracking-widest text-emerald-400 uppercase mb-1.5">
                {t.emailLabel}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-gray-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={isEn ? "e.g. workspace@pcs.ai" : "উদা: accounts@pcs.ai"}
                  className="w-full bg-[#090a0f]/90 border border-gray-800/80 focus:border-emerald-500/50 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none transition-all placeholder-gray-600"
                  id="auth-input-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-widest text-emerald-400 uppercase mb-1.5">
                {t.passLabel}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-gray-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#090a0f]/90 border border-gray-800/80 focus:border-emerald-500/50 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none transition-all placeholder-gray-600"
                  id="auth-input-password"
                />
              </div>
            </div>

            {/* Form Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 disabled:bg-gray-700 disabled:text-gray-500 disabled:shadow-none disabled:pointer-events-none mt-2"
              id="auth-btn-submit"
            >
              {loading ? (
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {activeTab === "login" ? t.loginSubmit : t.signupSubmit}
                </>
              )}
            </button>
          </form>

          {/* Divider line */}
          <div className="relative my-6 text-center">
            <span className="absolute left-0 top-1/2 w-full h-[1px] bg-gray-850" />
            <span className="relative bg-[#10121d] px-3 text-[9px] font-mono font-bold tracking-widest text-gray-500 uppercase">
              {t.orText}
            </span>
          </div>

          {/* Google Sign In Federated Handler */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-2.5 bg-[#090a0f] hover:bg-gray-950 border border-gray-850 hover:border-gray-700 text-xs text-gray-200 font-bold rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            id="auth-google-btn"
          >
            {/* Minimal SVG inline Google Icon */}
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.23-.67-.35-1.37-.35-2.09z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            {t.googleBtn}
          </button>
        </motion.div>
      </div>

      {/* Cyber Security Policy footer */}
      <div className="max-w-7xl mx-auto px-4 py-4 w-full text-center border-t border-gray-900/60 z-10 relative">
        <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
          {isEn 
            ? "PCS SECURE NODE SHA256 ALGORITHM // AES256 ENCRYPTED MEMORY VAULTS" 
            : "পিসিএস সিকিউর নোড SHA256 অ্যালগরিদম // এনক্রিপ্টেড মেমরি সেশন"}
        </span>
      </div>
    </div>
  );
}
