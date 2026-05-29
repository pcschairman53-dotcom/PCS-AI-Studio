import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Lock, 
  Unlock, 
  Cpu, 
  Terminal, 
  Key, 
  Database, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";

interface SecureNodeAuthProps {
  language: string;
}

export default function SecureNodeAuth({ language }: SecureNodeAuthProps) {
  const isEn = language === "english";
  const [isOpen, setIsOpen] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [decryptStatus, setDecryptStatus] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Check LocalStorage on Mount to see if Node is already unlocked
  useEffect(() => {
    try {
      const isUnlocked = localStorage.getItem("pcs_secure_node_unlocked");
      if (isUnlocked !== "true") {
        setIsOpen(true);
      }
    } catch (e) {
      // Fail-safe default
      setIsOpen(true);
    }
  }, []);

  const handleKeyPress = (num: string) => {
    if (passcode.length < 6) {
      setPasscode(prev => prev + num);
      setErrorMsg("");
    }
  };

  const handleBackspace = () => {
    setPasscode(prev => prev.slice(0, -1));
    setErrorMsg("");
  };

  const handleClear = () => {
    setPasscode("");
    setErrorMsg("");
  };

  // Run the simulated multi-layer quantum decryption
  const handleDecryptAndEnter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passcode.trim()) {
      setErrorMsg(isEn ? "Passcode sequence cannot be block-empty." : "পাসকোড সিকোয়েন্স খালি রাখা যাবে না।");
      return;
    }

    // Standard high-end simulation check
    const bypassCodes = ["7700", "7799", "8877", "1234"];
    const inputClean = passcode.trim();

    // We can allow any passcode for ultimate user convenience, or simulate a specific check. 
    // Let's guide the user that standard bypass is "7700", but let any 4+ digit pass!
    if (inputClean.length < 4) {
      setErrorMsg(isEn ? "Decryption require minimum 4-digit token." : "ডিক্রিপশনের জন্য ন্যূনতম ৪-ডিজিট সিকোয়েন্স প্রয়োজন।");
      return;
    }

    setIsDecrypting(true);
    setDecryptProgress(0);
    setDecryptStatus(isEn ? "Connecting to secure local sandboxed key module..." : "লোকাল সিকিউর কী মডিউলের সাথে সংযোগ করা হচ্ছে...");

    const steps = isEn ? [
      { progress: 20, msg: "Retrieving quantum block hash parameters..." },
      { progress: 45, msg: "Allocating virtual cipher arrays..." },
      { progress: 70, msg: "Decrypting node environment structures..." },
      { progress: 90, msg: "Verifying local integrity sandboxes..." },
      { progress: 100, msg: "Decryption Successful! Dynamic Core Activated." }
    ] : [
      { progress: 20, msg: "কোয়ান্টাম ব্লক হ্যাশ প্যারামিটার বের করা হচ্ছে..." },
      { progress: 45, msg: "ভার্চুয়াল সাইফার অ্যারে বরাদ্দ করা হচ্ছে..." },
      { progress: 70, msg: "নোড এনভায়রনমেন্ট ডিক্রিপ্ট করা হচ্ছে..." },
      { progress: 90, msg: "লোকাল ইন্টিগ্রিটি পরিবেশ যাচাই করা হচ্ছে..." },
      { progress: 100, msg: "ডিক্রিপশন সফল! ডাইনামিক কোর অ্যাক্টিভেটেড।" }
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      setDecryptProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSuccess(true);
          setIsDecrypting(false);
          
          // Store unlocked state in local storage
          try {
            localStorage.setItem("pcs_secure_node_unlocked", "true");
          } catch (err) {
            console.error("Local storage permission error", err);
          }

          // Smoothly close after a short delay
          setTimeout(() => {
            setIsOpen(false);
          }, 1000);

          return 100;
        }

        const nextProg = prev + 5;
        const currentStep = steps.find(s => nextProg >= s.progress - 5 && nextProg <= s.progress);
        if (currentStep) {
          setDecryptStatus(currentStep.msg);
        }
        return nextProg;
      });
    }, 120);
  };

  // Reset Lock strictly for testing or manual user lock option (no external triggers)
  const handleLockNodeNode = () => {
    localStorage.removeItem("pcs_secure_node_unlocked");
    setPasscode("");
    setSuccess(false);
    setIsOpen(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-[#020306]/95 backdrop-blur-md flex items-center justify-center p-4 z-[99999] overflow-y-auto font-mono text-xs text-gray-400 select-none"
        id="secure-node-auth-gateway"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#0b0c13]/90 rounded-3xl border border-cyan-500/30 w-full max-w-md p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden text-center"
        >
          {/* Subtle Dynamic Neon Cyan Glow Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-emerald-400 to-transparent" />
          
          {/* Glowing Animated Orbs in Background */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" />

          {/* Secure Header Indicators */}
          <div className="space-y-2">
            <div className="mx-auto w-14 h-14 rounded-full bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-center relative shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              {success ? (
                <Unlock className="w-6 h-6 text-emerald-400 animate-bounce" />
              ) : isDecrypting ? (
                <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
              ) : (
                <Lock className="w-6 h-6 text-cyan-400" />
              )}
              {/* Core pulse spot */}
              <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-cyan-500 rounded-full border-2 border-[#0b0c13] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-bold text-cyan-400 tracking-[0.2em] uppercase flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>PCS LABS SECURITY GATEWAY</span>
              </span>
              <h1 className="text-lg font-bold text-white uppercase tracking-tight">
                {isEn ? "Enterprise Secure Node Auth" : "নিরাপদ নোড অথেন্টিকেশন"}
              </h1>
              <p className="text-gray-500 text-[10px] leading-relaxed max-w-xs mx-auto">
                {isEn 
                  ? "Accessing protected laboratory parameters triggers high-level local decryption sandbox handshakes." 
                  : "সুরক্ষিত এআই ল্যাবরেটরি প্যারামিটার পরিবর্তনের পূর্বে লোকাল ডিক্রিপশন স্যান্ডবক্স গেটওয়ে ওয়ান-টাইম নোড ভেরিফিকেশন।"}
              </p>
            </div>
          </div>

          {/* SIMULATED PROCESS VIEW */}
          {isDecrypting || success ? (
            <div className="space-y-5 py-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-cyan-400">
                  <span className="uppercase tracking-wider flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{isEn ? "Neural Crypt-Matrix Setup" : "ক্রিপ্টোগ্রাফিক ডিক্রিপশন প্রোগ্রেস"}</span>
                  </span>
                  <span>{decryptProgress}%</span>
                </div>
                {/* Cyber custom progress tracking bar and glow */}
                <div className="h-2 w-full bg-[#05060a] rounded-full overflow-hidden border border-gray-900 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${decryptProgress}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                  />
                </div>
              </div>

              {/* Status stream string */}
              <div className="bg-[#05060a]/90 border border-gray-900 rounded-xl p-3 min-h-[50px] flex items-center justify-center text-center">
                {success ? (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="w-4 h-4 shrink-0 animate-bounce" />
                    <p className="text-[10px] font-bold tracking-wide uppercase">
                      {isEn ? "Authorized! Directives Core Active." : "ভেরিফায়েড! ডিরেক্টিভস কোর সক্রিয় হয়েছে।"}
                    </p>
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-400 font-mono italic animate-pulse">
                    {decryptStatus}
                  </p>
                )}
              </div>

              {/* Extra telemetry detail lines */}
              <div className="text-[8px] text-gray-600 flex items-center justify-between font-mono border-t border-gray-900/60 pt-3">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-cyan-500/40" />
                  <span>THREAD_ID: PCS_SEC_0x77A</span>
                </span>
                <span>CIPHER: QUANTUM-AES256</span>
              </div>
            </div>
          ) : (
            /* PASSPHRASE ENTRY GRID FORM */
            <form onSubmit={handleDecryptAndEnter} className="space-y-5 text-left">
              <div className="space-y-1.5 relative">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{isEn ? "Passcode Token" : "সিকিউর পাসকোড টোকেন"}</span>
                  </label>
                  <button 
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="text-gray-500 hover:text-cyan-400 transition-all p-0.5 cursor-pointer"
                    title={showPasscode ? "Hide Token" : "Show Token"}
                  >
                    {showPasscode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPasscode ? "text" : "password"}
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6));
                      setErrorMsg("");
                    }}
                    placeholder="••••••"
                    className="w-full text-center tracking-[0.6em] font-black text-lg bg-[#040508] border border-gray-850 focus:border-cyan-500/50 rounded-xl p-3 text-white outline-none placeholder:tracking-widest"
                    maxLength={6}
                    required
                  />
                  
                  {/* Subtle input corner ticks */}
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-cyan-500/40" />
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-cyan-500/40" />
                  <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-cyan-500/40" />
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-cyan-500/40" />
                </div>
                
                {/* Help hint suggestion */}
                <span className="block text-[9px] text-gray-500 italic mt-1 text-center">
                  {isEn 
                    ? "Enter Node local bypass key token: '7700' or any 4-digit code." 
                    : "সর্বজনীন বাইপাস কী টোকেন ব্যবহার করুন: '7700' অথবা যেকোনো ৪-ডিজিট কোড।"}
                </span>
              </div>

              {/* Interactive Virtual Cipher Keypad */}
              <div className="grid grid-cols-3 gap-2 py-1 max-w-[280px] mx-auto" id="secure-keypad">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeyPress(num)}
                    className="py-2.5 bg-gray-950 hover:bg-cyan-950/20 text-gray-300 hover:text-cyan-400 border border-gray-900 hover:border-cyan-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer select-none active:scale-95"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClear}
                  className="py-2.5 bg-gray-950 hover:bg-red-950/20 text-gray-500 hover:text-red-400 border border-gray-900 transition-all rounded-xl text-[10px] uppercase font-bold cursor-pointer select-none active:scale-95"
                >
                  {isEn ? "CLR" : "ক্লিয়ার"}
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyPress("0")}
                  className="py-2.5 bg-gray-950 hover:bg-cyan-950/20 text-gray-300 hover:text-cyan-400 border border-gray-900 hover:border-cyan-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer select-none active:scale-95"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="py-2.5 bg-gray-950 hover:bg-gray-900 text-gray-400 border border-gray-900 transition-all rounded-xl text-[12px] cursor-pointer select-none active:scale-100 flex items-center justify-center font-bold"
                  title="Delete character"
                >
                  ⌫
                </button>
              </div>

              {/* Error messages if any */}
              {errorMsg && (
                <div className="p-2.5 bg-red-950/30 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-[10px] animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{errorMsg}</p>
                </div>
              )}

              {/* Core interactive Decryption dispatch button */}
              <button
                type="submit"
                disabled={passcode.length < 4}
                className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-[0_0_20px_rgba(6,182,212,0.1)] relative group ${
                  passcode.length < 4
                    ? "bg-[#090a0f] border border-gray-900 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-emerald-500 text-[#090a0f] hover:brightness-110 font-black shadow-[0_0_25px_rgba(6,182,212,0.2)]"
                }`}
              >
                {/* Visual hover border shine */}
                {passcode.length >= 4 && (
                  <div className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none group-hover:scale-105 transition-all" />
                )}
                <Zap className="w-4 h-4" />
                <span>{isEn ? "DECRYPT AND ENTER CORE" : "ডিক্রিপ্ট এবং ইন্টিগ্রেশন সম্পন্ন করুন"}</span>
              </button>
            </form>
          )}

          {/* Secure Labs Telemetry Bottom Status Tag */}
          <div className="border-t border-gray-900 pt-4 flex items-center justify-between text-[9px] text-gray-600">
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-cyan-500/20" />
              <span>PCS COGNITIVE SECURE v4.1</span>
            </span>
            <span className="font-bold">STATUS: ISOLATED MOD</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
