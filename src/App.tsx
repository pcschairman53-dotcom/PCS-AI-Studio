import React, { useState, useEffect } from "react";
import { Language } from "./types";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SaasTool from "./components/SaaSTool";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import SaasDashboard from "./components/SaaSDashboard";
import AuthPage from "./components/AuthPage";
import SecureNodeAuth from "./components/SecureNodeAuth";
import { auth } from "./firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { RefreshCw } from "lucide-react";

export default function App() {
  const [language, setLanguage] = useState<Language>("english");
  const [view, setView] = useState<"landing" | "dashboard" | "auth">(() => {
    const path = window.location.pathname;
    if (path === "/dashboard") return "dashboard";
    if (path === "/signin") return "auth";
    return "landing";
  });
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [postAuthTarget, setPostAuthTarget] = useState<"dashboard" | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      
      const path = window.location.pathname;
      // Auto-redirect if they logged in while targeting a view or are authenticated
      if (firebaseUser) {
        if (path === "/signin" || postAuthTarget || path === "/") {
          setView("dashboard");
          window.history.pushState({}, "", "/dashboard");
          setPostAuthTarget(null);
        } else if (path === "/dashboard") {
          setView("dashboard");
        }
      } else {
        // Redirection for unauthenticated users trying to access protected workspace
        if (path === "/dashboard") {
          setPostAuthTarget("dashboard");
          setView("auth");
          window.history.pushState({}, "", "/signin");
        } else if (path === "/signin") {
          setView("auth");
        } else {
          setView("landing");
        }
      }
    });
    return unsubscribe;
  }, [postAuthTarget]);

  // Handle browser back and forward actions smoothly
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/dashboard") {
        if (auth.currentUser) {
          setView("dashboard");
        } else {
          setPostAuthTarget("dashboard");
          setView("auth");
          window.history.replaceState({}, "", "/signin");
        }
      } else if (path === "/signin") {
        setView("auth");
      } else {
        setView("landing");
      }
    };
    
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Smooth scroll handler targeting elements in the single-page layout
  const handleScrollTo = (sectionId: string) => {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLaunchDashboard = () => {
    if (user) {
      setView("dashboard");
      window.history.pushState({}, "", "/dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setPostAuthTarget("dashboard");
      setView("auth");
      window.history.pushState({}, "", "/signin");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAuthSuccess = () => {
    const target = postAuthTarget || "dashboard";
    setView(target);
    window.history.pushState({}, "", `/${target}`);
    setPostAuthTarget(null);
  };

  const handleBackToLanding = () => {
    setView("landing");
    window.history.pushState({}, "", "/");
    setPostAuthTarget(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex flex-col items-center justify-center relative overflow-hidden font-mono text-xs text-gray-500">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03),transparent_60%)] pointer-events-none" />
        <div className="z-10 flex flex-col items-center gap-4 text-center">
          <div className="p-3 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
          </div>
          <div className="space-y-1">
            <div className="text-white font-extrabold uppercase tracking-widest text-[11px]">PCS AI Studio</div>
            <div className="text-emerald-400 font-bold uppercase tracking-widest text-[9px] animate-pulse">Initializing Security Gateway...</div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "auth") {
    return (
      <AuthPage 
        language={language}
        onSuccess={handleAuthSuccess}
        onBackToLanding={handleBackToLanding}
      />
    );
  }

  if (view === "dashboard") {
    return (
      <>
        <SaasDashboard 
          language={language} 
          setLanguage={setLanguage} 
          onExit={() => setView("landing")} 
        />
        <SecureNodeAuth language={language} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-100 flex flex-col font-sans selection:bg-emerald-400 selection:text-[#090a0f]" id="app-root">
      {/* Premium Dark Tech background overlay lines */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.02),transparent_40%)] pointer-events-none" />

      {/* Header element with navigation and language controller */}
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        onScrollTo={handleScrollTo} 
        onLaunchDashboard={handleLaunchDashboard}
      />

      <main className="flex-grow z-10 relative">
        {/* Dynamic landing page components */}
        <Hero 
          language={language} 
          onExplore={handleLaunchDashboard} 
        />
        
        {/* Core Multi-Generator Workspace Playground */}
        <SaasTool 
          language={language} 
          setLanguage={setLanguage} 
          onOpenDashboard={handleLaunchDashboard}
        />
        
        {/* Features list */}
        <Features 
          language={language} 
        />
        
        {/* Corporate plans */}
        <Pricing 
          language={language} 
          onExplore={handleLaunchDashboard} 
        />
        
        {/* Contact submissions node */}
        <Contact 
          language={language} 
        />
      </main>

      {/* Corporate foot markings */}
      <Footer 
        language={language} 
        onScrollTo={handleScrollTo} 
      />
    </div>
  );
}
