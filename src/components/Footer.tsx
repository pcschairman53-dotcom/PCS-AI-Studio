import React from "react";
import { Sparkles, Heart, GitBranch, ShieldCheck } from "lucide-react";
import { Language } from "../types";

interface FooterProps {
  language: Language;
  onScrollTo: (sectionId: string) => void;
}

export default function Footer({ language, onScrollTo }: FooterProps) {
  const isEn = language === "english";

  return (
    <footer className="bg-[#090a0f] border-t border-gray-900 py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-[radial-gradient(ellipse_at_bottom,rgba(6,182,212,0.05),transparent_60%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-8 border-b border-gray-901">
          
          {/* Brand Left info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2.5">
            <div className="flex items-center gap-2" id="footer-logo">
              <div className="p-1 px-1.5 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded text-[#090a0f] font-extrabold text-sm shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                PCS
              </div>
              <span className="font-display font-bold text-lg text-white">
                AI Studio
              </span>
            </div>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              {isEn 
                ? "The complete dual-language content generator and prompt design system optimized closely for South Asian and global digital markets."
                : "বাঙালী কন্টেন্ট ক্রিয়েটর ও ডিজিটাল মার্কেটারদের কাজের সুবিধার্থে তৈরি করা প্রথম দ্বিভাষিক এআই জেনারেটর প্লেগ্রাউন্ড।"}
            </p>
          </div>

          {/* Quick links Center */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-gray-400">
            <button 
              onClick={() => onScrollTo("hero")} 
              className="hover:text-emerald-400 transition-colors cursor-pointer"
              id="footer-lnk-hero"
            >
              {isEn ? "Home" : "প্রচ্ছদ"}
            </button>
            <button 
              onClick={() => onScrollTo("playground")} 
              className="hover:text-emerald-400 transition-colors cursor-pointer"
              id="footer-lnk-play"
            >
              {isEn ? "Playground" : "প্লেগ্রাউন্ড"}
            </button>
            <button 
              onClick={() => onScrollTo("features")} 
              className="hover:text-emerald-400 transition-colors cursor-pointer"
              id="footer-lnk-feat"
            >
              {isEn ? "Features" : "ফিচারসমূহ"}
            </button>
            <button 
              onClick={() => onScrollTo("pricing")} 
              className="hover:text-emerald-400 transition-colors cursor-pointer"
              id="footer-lnk-pice"
            >
              {isEn ? "Pricing" : "মূল্যতালিকা"}
            </button>
            <button 
              onClick={() => onScrollTo("contact")} 
              className="hover:text-emerald-400 transition-colors cursor-pointer"
              id="footer-lnk-cont"
            >
              {isEn ? "Contact Hub" : "যোগাযোগ বিবরণ"}
            </button>
          </div>

          {/* Verification labels Right */}
          <div className="flex items-center gap-3 bg-[#121420]/45 p-2 px-3 rounded-lg border border-gray-900 text-gray-500 text-[10px] font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isEn ? "GEMINI SERVER SECURE NODE V3" : "জেমিনি এআই সার্ভার নোড ৩"}</span>
          </div>

        </div>

        {/* Down Copyright banner */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-[11px] text-gray-600 font-mono text-center sm:text-left">
          <div>
            &copy; 2026 PCS AI Studio. All Rights Reserved. Co-powered by Gemini-3.5-Flash.
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-red-500/80 fill-red-500/10" />
            <span>for Bengali & English Markets.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
