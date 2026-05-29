import React, { useState, useEffect } from "react";
import { Sparkles, HelpCircle, Lock, ArrowUpRight, Award, Flame, ShieldAlert, Zap } from "lucide-react";

interface SaaSPromptLimitTrackerProps {
  isEn: boolean;
  onOpenDashboard?: () => void;
  // Allows parent component to listen to state or check if limit is reached
  onLimitCheck?: (isLimitReached: boolean) => void;
  // Trigger to force increment from parent
  triggerCount?: number; 
}

export function getPromptLimit(planId: string): number {
  if (planId === "creator") return 200;
  if (planId === "marketing") return 1000;
  if (planId === "business") return 999999; // Represents Unlimited
  return 10; // Free plan
}

export function getPlanDisplayName(planId: string, isEn: boolean): string {
  if (planId === "creator") return isEn ? "Pro Creator" : "প্রো ক্রিয়েটর";
  if (planId === "marketing") return isEn ? "Pro Marketing" : "প্রো মার্কেটিং";
  if (planId === "business") return isEn ? "Business Enterprise" : "বিজনেস এন্টারপ্রাইজ";
  return isEn ? "Free Basic Sandbox" : "ফ্রি বেসিক স্যান্ডবক্স";
}

export default function SaaSPromptLimitTracker({ 
  isEn, 
  onOpenDashboard,
  onLimitCheck,
  triggerCount = 0
}: SaaSPromptLimitTrackerProps) {
  const [activePlan, setActivePlan] = useState<string>("free");
  const [promptsUsed, setPromptsUsed] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string>("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const getYearMonthString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  // Synchronize state from localStorage
  const syncTrackerState = () => {
    try {
      // 1. Check Active Plan
      const storedPlan = localStorage.getItem("activePlan") || "free";
      setActivePlan(storedPlan);

      // 2. Check and handle Monthly Reset
      const storedMonth = localStorage.getItem("pcs_prompts_month") || "";
      const actualMonth = getYearMonthString();
      setCurrentMonth(actualMonth);

      let used = 0;
      if (storedMonth !== actualMonth) {
        // Reset count for new month
        localStorage.setItem("pcs_prompts_month", actualMonth);
        localStorage.setItem("pcs_prompts_used", "0");
        used = 0;
      } else {
        const storedUsed = localStorage.getItem("pcs_prompts_used");
        used = storedUsed ? parseInt(storedUsed, 10) : 0;
        if (isNaN(used)) used = 0;
      }
      setPromptsUsed(used);

      // 3. Callback to parent about limit
      const limit = getPromptLimit(storedPlan);
      const isLimitReached = used >= limit;
      if (onLimitCheck) {
        onLimitCheck(isLimitReached);
      }
    } catch (e) {
      console.error("Local storage sync error", e);
    }
  };

  // Run on mount
  useEffect(() => {
    syncTrackerState();

    // Setup listener for storage updates or manual updates
    window.addEventListener("storage", syncTrackerState);
    const interval = setInterval(syncTrackerState, 1500);

    return () => {
      window.removeEventListener("storage", syncTrackerState);
      clearInterval(interval);
    };
  }, []);

  // Listen to external triggers for quick increment sync
  useEffect(() => {
    if (triggerCount > 0) {
      syncTrackerState();
    }
  }, [triggerCount]);

  const limit = getPromptLimit(activePlan);
  const promptsRemaining = Math.max(0, limit - promptsUsed);
  const isLimitReached = promptsUsed >= limit;
  const isUnlimited = limit >= 999999;
  const percentage = isUnlimited ? 0 : Math.min(100, (promptsUsed / limit) * 100);

  // Helper helper to simulate adding prompt usage for testing
  const handleSimulatePromptRun = () => {
    try {
      const nextUsedValue = promptsUsed + 1;
      localStorage.setItem("pcs_prompts_used", String(nextUsedValue));
      setPromptsUsed(nextUsedValue);
      triggerToast(isEn ? "Simulated Prompt Usage incremented!" : "প্রম্পট ব্যবহারের সিমুলেশন বৃদ্ধি করা হয়েছে!");
      syncTrackerState();
    } catch (e) {}
  };

  // Reset helper
  const handleSimulateReset = () => {
    try {
      localStorage.setItem("pcs_prompts_used", "0");
      setPromptsUsed(0);
      triggerToast(isEn ? "Prompt usage counter reset!" : "ব্যবহার কাউন্টার রিসেট করা হয়েছে!");
      syncTrackerState();
    } catch (e) {}
  };

  return (
    <div className="bg-[#121420]/80 backdrop-blur-md rounded-2xl border border-gray-800/80 p-5 shadow-[0_4px_30px_rgba(0,0,0,0.4)] relative overflow-hidden" id="pcs-prompt-limit-tracker-root text-left">
      
      {/* Decorative Ornaments */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Internal interactive toast overlay */}
      {toastMessage && (
        <div className="absolute top-3 right-3 z-50 bg-[#090a10] border border-cyan-500/50 text-cyan-300 font-mono text-[9px] uppercase font-bold py-1.5 px-3 rounded-lg shadow-[0_0_12px_rgba(6,182,212,0.3)] animate-pulse">
          ⚡ {toastMessage}
        </div>
      )}

      {/* Title block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-950 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 bg-purple-500/10 border border-purple-500/35 rounded-md text-purple-400">
              <Zap className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-widest">
              Prompt Usage Console
            </span>
          </div>
          <h4 className="text-sm font-bold text-white tracking-tight mt-1 flex items-center gap-1.5">
            {getPlanDisplayName(activePlan, isEn)} 
            {!isUnlimited && (
              <span className="text-[9px] font-mono font-normal text-gray-500">
                (Cycle: {currentMonth})
              </span>
            )}
          </h4>
        </div>

        {/* Dynamic Badge */}
        <span className={`text-[8.5px] font-mono font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
          isLimitReached && !isUnlimited
            ? "bg-red-950/20 border-red-500/35 text-red-400"
            : activePlan === "free"
              ? "bg-gray-900 border-gray-800 text-gray-400"
              : "bg-amber-950/20 border-amber-500/35 text-amber-400"
        }`}>
          {isLimitReached && !isUnlimited ? "LIMIT REACHED" : isUnlimited ? "UNLIMITED RUNS" : "ACTIVE RUNS"}
        </span>
      </div>

      {/* Progress Bars / Usage visual representation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="text-gray-400 font-mono text-[10.5px]">
            {isEn ? "Monthly Usage Rate:" : "মাসিক কোটা ব্যবহার:"}
          </span>
          <span className="text-white font-mono font-bold text-[11px]">
            {promptsUsed} / {isUnlimited ? "∞" : limit} {isEn ? "prompts" : "প্রম্পট"}
          </span>
        </div>

        {/* Visual progress track */}
        <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-gray-900">
          <div 
            className={`h-full transition-all duration-1000 rounded-full ${
              isLimitReached && !isUnlimited
                ? "bg-gradient-to-r from-red-600 to-rose-500 animate-pulse"
                : percentage > 80
                  ? "bg-gradient-to-r from-amber-600 to-yellow-400"
                  : "bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400"
            }`}
            style={{ width: `${isUnlimited ? 100 : percentage}%` }}
          />
        </div>

        {/* Numeric remaining summary */}
        <div className="flex items-center justify-between gap-4 text-[10px] text-gray-500 pt-0.5 font-mono">
          <span>{isEn ? "Cycle Resets automatically each month." : "প্রতি নতুন মাসে কোটা স্বয়ংক্রিয়ভাবে রিসেট হবে।"}</span>
          <span className={`${isLimitReached && !isUnlimited ? "text-red-400 font-bold" : "text-cyan-400 font-bold"}`}>
            {isUnlimited 
              ? (isEn ? "Unlimited quota matches active plan" : "সীমাহীন কোটা অ্যাক্সেস সক্রিয়") 
              : `${promptsRemaining} ${isEn ? "runs remaining" : "রান অবশিষ্ট আছে"}`}
          </span>
        </div>
      </div>

      {/* Danger Warnings when limit reached */}
      {isLimitReached && !isUnlimited && (
        <div className="mt-4 p-3 bg-red-950/25 border border-red-900/40 rounded-xl flex items-start gap-2 text-left">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-bounce" />
          <div>
            <span className="text-[10.5px] font-bold text-red-400 uppercase tracking-wide block">
              {isEn ? "Monthly Limit Reached" : "মাসিক লিমিট শেষ হয়েছে"}
            </span>
            <span className="text-[10px] text-gray-400 leading-normal block mt-0.5">
              {isEn 
                ? "Your current Free Basic Sandbox allowance has been fully utilized. Please upgrade your active plan to unlock up to 1000 monthly high-speed generation cycles." 
                : "আপনার ফ্রি বেসিক ড্যাশবোর্ডের লিমিট শেষ হয়েছে। কর্পোরেট প্ল্যানে আপগ্রেড করে নিরবচ্ছিন্ন সার্ভিস সচল রাখুন।"}
            </span>
          </div>
        </div>
      )}

      {/* System info status tags matching design rule */}
      <div className="mt-4 pt-3 border-t border-gray-950 flex flex-wrap items-center justify-between gap-3 text-[8.5px] font-mono text-gray-500 select-none">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Monthly Prompt Limit Engine Active
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Quota Safe Usage Layer Enabled
        </span>
      </div>

      {/* Quick Utilities / Action Bar inside component */}
      <div className="mt-4 pt-3.5 border-t border-gray-950 flex flex-wrap items-center justify-between gap-3">
        {/* Support simulators for safety/testing demo */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSimulatePromptRun}
            className="px-2 py-1 bg-black text-gray-500 hover:text-cyan-400 border border-gray-900 hover:border-cyan-500/20 text-[9px] font-mono uppercase rounded transition-all cursor-pointer"
            title="Increase simulated prompt usage"
          >
            +1 Simulate Use
          </button>
          <button
            onClick={handleSimulateReset}
            className="px-2 py-1 bg-black text-gray-500 hover:text-red-400 border border-gray-900 hover:border-red-500/20 text-[9px] font-mono uppercase rounded transition-all cursor-pointer"
            title="Reset used count to 0"
          >
            Reset Count
          </button>
        </div>

        {/* Upgrade Call-To-Action trigger redirecting to subscription flow */}
        {!isUnlimited && (
          <button
            type="button"
            onClick={() => {
              if (onOpenDashboard) {
                onOpenDashboard();
              } else {
                triggerToast("Directing to subscriber portal...");
              }
            }}
            className="px-3.5 py-1 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-[9px] uppercase rounded-lg tracking-wider transition-all flex items-center gap-0.5 cursor-pointer hover:shadow-[0_0_10px_rgba(147,51,234,0.3)] duration-300"
          >
            {isEn ? "Upgrade To Continue" : "আপগ্রেড করুন"} <ArrowUpRight className="w-2.5 h-2.5" />
          </button>
        )}
      </div>

    </div>
  );
}
