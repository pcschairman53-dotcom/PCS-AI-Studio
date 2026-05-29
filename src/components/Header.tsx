import React, { useState, useEffect } from "react";
import { Sparkles, Globe, Shield, MessageCircle, User, LogOut, LogIn } from "lucide-react";
import { Language } from "../types";
import { auth } from "../firebase";
import { onAuthStateChanged, User as FirebaseUser, signOut } from "firebase/auth";

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onScrollTo: (sectionId: string) => void;
  onLaunchDashboard?: () => void;
}

export default function Header({ language, setLanguage, onScrollTo, onLaunchDashboard }: HeaderProps) {
  const isEn = language === "english";
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#090a0f]/80 border-b border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onScrollTo("hero")} 
          className="flex items-center gap-2.5 cursor-pointer group"
          id="nav-logo"
        >
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg group-hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              PCS <span className="text-emerald-400">AI</span> Studio
            </span>
            <span className="block text-[9px] text-gray-500 font-mono tracking-widest uppercase">
              {isEn ? "SaaS Enterprise" : "এন্টারপ্রাইজ স্যাস"}
            </span>
          </div>
        </div>

        {/* Center Nav Link */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <button 
            onClick={() => onLaunchDashboard ? onLaunchDashboard() : onScrollTo("playground")} 
            className="hover:text-emerald-400 transition-colors duration-200 cursor-pointer"
            id="nav-link-playground"
          >
            {isEn ? "Playground Dashboard" : "প্লেগ্রাউন্ড ড্যাশবোর্ড"}
          </button>
          <button 
            onClick={() => onScrollTo("features")} 
            className="hover:text-emerald-400 transition-colors duration-200 cursor-pointer"
            id="nav-link-features"
          >
            {isEn ? "Enterprise Features" : "ফিচারসমূহ"}
          </button>
          <button 
            onClick={() => onScrollTo("pricing")} 
            className="hover:text-emerald-400 transition-colors duration-200 cursor-pointer"
            id="nav-link-pricing"
          >
            {isEn ? "Pricing" : "মূল্য তালিকা"}
          </button>
          <button 
            onClick={() => onScrollTo("contact")} 
            className="hover:text-emerald-400 transition-colors duration-200 cursor-pointer"
            id="nav-link-contact"
          >
            {isEn ? "Contact" : "যোগাযোগ"}
          </button>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="bg-[#121420]/80 p-1 rounded-lg border border-gray-800 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => setLanguage("english")}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-all duration-200 cursor-pointer ${
                isEn 
                  ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
              id="lang-btn-en"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("bengali")}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-all duration-200 cursor-pointer ${
                !isEn 
                  ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
              id="lang-btn-bn"
            >
              বাংলা
            </button>
          </div>

          {/* User profile section */}
          {user ? (
            <div className="flex items-center gap-2 border-r border-gray-800/80 pr-2 lg:pr-3" id="header-profile-section">
              <div className="hidden lg:flex flex-col items-end text-right min-w-0 leading-none">
                <span className="text-[11px] font-black text-white truncate max-w-[125px]">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <span className="text-[9px] font-mono text-gray-500 mt-0.5 truncate max-w-[125px]">
                  {user.email}
                </span>
              </div>
              
              <div 
                className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-xs uppercase shadow-[0_0_10px_rgba(16,185,129,0.15)] relative group/tooltip"
                title={user.email || ""}
              >
                {user.displayName ? user.displayName.slice(0, 1) : user.email ? user.email.slice(0, 1) : "U"}
              </div>

              <button
                onClick={() => signOut(auth)}
                className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-all cursor-pointer"
                id="header-logout-btn"
                title={isEn ? "Sign Out" : "লগআউট করুন"}
              >
                <LogOut className="w-4 h-4" strokeWidth={2.4} />
              </button>
            </div>
          ) : (
            <button
              onClick={onLaunchDashboard}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/25 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all rounded-lg cursor-pointer font-mono"
              id="header-signin-btn"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isEn ? "Sign In" : "লগইন"}</span>
            </button>
          )}

          {/* Quick Action button */}
          <button
            onClick={() => onLaunchDashboard ? onLaunchDashboard() : onScrollTo("playground")}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#090a0f] bg-emerald-400 hover:bg-emerald-300 transition-all duration-300 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer animate-pulse"
            id="header-cta-btn"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isEn ? "Launch Tool" : "টুল শুরু করুন"}
          </button>
        </div>
      </div>
    </header>
  );
}
