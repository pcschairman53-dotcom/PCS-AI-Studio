import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Copy, Check, Download, Layers, Cpu, 
  Video, Image as ImageIcon, MessageSquare, Megaphone,
  CheckCircle, AlertCircle, Info, Search, X
} from "lucide-react";

// --- EVENT SYSTEM FOR TOASTS ---
export interface ToastItem {
  id: string;
  msg: string;
  type: "success" | "info" | "warning";
}

export const triggerSaaSToast = (msg: string, type: "success" | "info" | "warning" = "success") => {
  const event = new CustomEvent("pcs-saas-toast", { detail: { msg, type } });
  window.dispatchEvent(event);
};

// --- MINI ACTIVITY TOAST CONTAINER ---
export const SaaSToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ msg: string; type?: "success" | "info" | "warning" }>;
      if (customEvent.detail && customEvent.detail.msg) {
        const newToast: ToastItem = {
          id: Math.random().toString(36).substring(3, 9),
          msg: customEvent.detail.msg,
          type: customEvent.detail.type || "success"
        };
        setToasts(prev => [...prev, newToast]);

        // Auto remove toast
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== newToast.id));
        }, 3200);
      }
    };

    window.addEventListener("pcs-saas-toast", handleToastEvent);
    return () => window.removeEventListener("pcs-saas-toast", handleToastEvent);
  }, []);

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3.5 max-w-sm pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let ToastIcon = CheckCircle;
          let glowColor = "rgba(6, 182, 212, 0.25)";
          let borderColor = "border-cyan-500/35";
          let textColor = "text-cyan-400";
          let bgClass = "bg-[#090b14]/95";

          if (toast.type === "info") {
            ToastIcon = Info;
            glowColor = "rgba(168, 85, 247, 0.25)";
            borderColor = "border-purple-500/35";
            textColor = "text-purple-400";
          } else if (toast.type === "warning") {
            ToastIcon = AlertCircle;
            glowColor = "rgba(239, 68, 68, 0.25)";
            borderColor = "border-red-500/35";
            textColor = "text-red-400";
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9, transition: { duration: 0.2 } }}
              className={`p-3.5 rounded-xl border ${borderColor} ${bgClass} shadow-2xl flex items-center justify-between gap-3 pointer-events-auto backdrop-blur-md`}
              style={{ boxShadow: `0 10px 30px -5px rgba(0,0,0,0.5), 0 0 15px ${glowColor}` }}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg bg-gray-900 ${textColor}`}>
                  <ToastIcon className="w-4 h-4 shrink-0" />
                </div>
                <p className="text-[11.5px] font-mono text-gray-100 font-bold tracking-wide">
                  {toast.msg}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-gray-500 hover:text-white p-0.5 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// --- ENTERPRISE DUAL SMART SEARCH BAR ---
interface SaaSSearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  isEn: boolean;
  totalFilteredCount: number;
}

export const SaaSSearchAndFilter: React.FC<SaaSSearchAndFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  isEn,
  totalFilteredCount,
}) => {
  const categories = [
    { id: "all", nameEn: "All Modules", nameBn: "সব মডিউল", icon: Layers, glow: "hover:border-cyan-500/30 hover:shadow-[0_0_10px_rgba(6,182,212,0.1)]" },
    { id: "video", nameEn: "Video Prompt", nameBn: "ভিডিও স্ক্রিপ্ট", icon: Video, glow: "hover:border-pink-500/30 hover:shadow-[0_0_10px_rgba(236,72,153,0.1)]" },
    { id: "poster", nameEn: "Poster Prompt", nameBn: "পোস্টার বিবরণী", icon: ImageIcon, glow: "hover:border-emerald-500/30 hover:shadow-[0_0_10px_rgba(16,185,129,0.1)]" },
    { id: "caption", nameEn: "Caption", nameBn: "ক্যাপশন রাইটার", icon: MessageSquare, glow: "hover:border-amber-500/30 hover:shadow-[0_0_10px_rgba(245,158,11,0.1)]" },
    { id: "adcopy", nameEn: "Ad Copy", nameBn: "বিজ্ঞাপন কপি", icon: Megaphone, glow: "hover:border-purple-500/30 hover:shadow-[0_0_10px_rgba(168,85,247,0.1)]" },
  ];

  return (
    <div className="bg-[#0b0d19]/60 border border-gray-900 rounded-2xl p-5.5 space-y-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)] backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.015] rounded-full filter blur-xl pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Expanded Neon Cyber Search Bar */}
        <div className="relative w-full lg:max-w-md group">
          <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-purple-500/30 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <Search className="w-4 h-4 text-gray-500 group-focus-within:text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300" />
          
          <input
            type="text"
            placeholder={isEn ? "Search saved prompts & vault presets..." : "সংরক্ষিত এআই প্রম্পট ভল্ট খুঁজুন..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#05060b] border border-gray-850 rounded-xl pl-10 pr-16 py-2.5 text-xs text-gray-200 placeholder-gray-500 outline-none focus:border-cyan-500/40 transition-all duration-300"
          />
          
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
            {searchQuery && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSearchQuery(""); }}
                className="p-1 text-gray-500 hover:text-gray-300 pointer-events-auto"
                title="Clear"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <span className="text-[9.5px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/30 px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0">
              {totalFilteredCount} {isEn ? "Match" : "মেলা"}
            </span>
          </div>
        </div>

        {/* Local Category Pill Swipers */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrolls scrollbar-none select-none">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const isActive = selectedCategoryFilter === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategoryFilter(cat.id);
                  triggerSaaSToast(`${isEn ? "Filtered by" : "ফিল্টার করেছেন"}: ${isEn ? cat.nameEn : cat.nameBn}`, "info");
                }}
                className={`py-1.5 px-3 rounded-xl text-[10.5px] font-semibold font-mono tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.12)]"
                    : `bg-[#06070b]/80 border-gray-850 text-gray-400 hover:text-gray-200 ${cat.glow}`
                }`}
              >
                <CatIcon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-gray-500"}`} />
                <span>{isEn ? cat.nameEn : cat.nameBn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- LIGHTWEIGHT EXPORT BUTTON ---
interface SaaSExportButtonProps {
  onExport: () => void;
  isEn: boolean;
}

export const SaaSExportButton: React.FC<SaaSExportButtonProps> = ({ onExport, isEn }) => {
  return (
    <button
      onClick={() => {
        onExport();
        triggerSaaSToast(isEn ? "Exported Local TXT Payload!" : "লোকাল টেক্সট ফাইল এক্সপোর্ট সম্পন্ন!", "success");
      }}
      className="px-2.5 py-1.5 bg-[#090b14] hover:bg-[#121422] text-gray-400 hover:text-cyan-400 border border-gray-800 hover:border-cyan-500/30 rounded-lg text-[10px] uppercase font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 group"
    >
      <Download className="w-3 h-3 group-hover:scale-110 transition-transform" />
      <span>{isEn ? "Export" : "রপ্তানি"}</span>
    </button>
  );
};

// --- ANIMATED COPY BUTTON ---
interface SaaSCopyButtonProps {
  payload: string;
  isEn: boolean;
}

export const SaaSCopyButton: React.FC<SaaSCopyButtonProps> = ({ payload, isEn }) => {
  const [copied, setCopied] = useState(false);

  const handleAction = () => {
    if (!payload.trim()) return;
    navigator.clipboard.writeText(payload);
    setCopied(true);
    triggerSaaSToast(isEn ? "Copied Prompt to Clipboard!" : "প্রম্পট সফলভাবে কপি কপি হয়েছে!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleAction}
      className={`px-2.5 py-1.5 rounded-lg text-[10px] uppercase font-mono font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 border ${
        copied
          ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400"
          : "bg-[#090b14] hover:bg-[#121422] border-gray-800 hover:border-cyan-500/30 text-gray-400 hover:text-cyan-400"
      }`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? (isEn ? "Copied" : "কপি করেছেন") : (isEn ? "Copy" : "কপি")}</span>
    </button>
  );
};
