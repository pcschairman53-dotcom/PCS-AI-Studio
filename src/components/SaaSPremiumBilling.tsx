import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CreditCard, Sparkles, Lock, ShieldCheck, Layers, Activity,
  FileText, CheckCircle2, Wallet, History, UserCheck, Compass,
  ChevronRight, RefreshCw, Server, AlertTriangle, Zap, Info, HelpCircle
} from "lucide-react";
import { triggerSaaSToast } from "./SaaSEnterpriseModules";

interface SaaSPremiumBillingProps {
  isEn: boolean;
  activeTier: "Starter" | "Creator Pro" | "Enterprise";
  onUpgradeTier: (tier: "Starter" | "Creator Pro" | "Enterprise") => void;
  activeWorkspaceName?: string;
  totalPromptsCount?: number;
  totalCampaignsCount?: number;
}

export const SaaSPremiumBilling: React.FC<SaaSPremiumBillingProps> = ({
  isEn,
  activeTier,
  onUpgradeTier,
  activeWorkspaceName = "Multitool Studio",
  totalPromptsCount = 0,
  totalCampaignsCount = 0
}) => {
  // Local active billing sub-tab within the billing center
  const [billingSubTab, setBillingSubTab] = useState<"tiers" | "history" | "usage">("tiers");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Lightweight Local States for Enterprise Billing Compatibility
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [simulatedGateway, setSimulatedGateway] = useState<"stripe" | "razorpay" | "teambilling" | null>(null);

  // Modern Razorpay State variables
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);
  const [razorpayError, setRazorpayError] = useState<string | null>(null);

  // Advanced Secure Test Mode state values
  const [paymentStep, setPaymentStep] = useState<"choose" | "input" | "processing" | "success" | "failure">("choose");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/30");
  const [cardCvv, setCardCvv] = useState("123");
  const [cardName, setCardName] = useState("TEST USER");
  const [upiId, setUpiId] = useState("success@razorpay");
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);
  const [testPaymentStatus, setTestPaymentStatus] = useState<"IDLE" | "SUCCESS" | "FAILED">("IDLE");
  
  // Track system status elements
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [sessionCount, setSessionCount] = useState(1);
  const [storageUsageBytes, setStorageUsageBytes] = useState(0);
  const [lastBillingAction, setLastBillingAction] = useState<string>("SYSTEM_LOADED");

  // Load local telemetry & simulation on mount
  useEffect(() => {
    // 1. Browser online state listener
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 2. Local Session Tracker via sessionStorage
    try {
      const storedSess = sessionStorage.getItem("pcs_session_counter");
      const currentCount = storedSess ? parseInt(storedSess, 10) + 1 : 1;
      sessionStorage.setItem("pcs_session_counter", currentCount.toString());
      setSessionCount(currentCount);
    } catch (e) {
      // Ignored
    }

    // 3. Estimate LocalStorage footprint for billing metrics
    try {
      let totalBytes = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const val = localStorage.getItem(key);
          totalBytes += (key.length + (val ? val.length : 0)) * 2; // approximation for UTF-16
        }
      }
      setStorageUsageBytes(totalBytes);
    } catch (e) {
      // Ignored
    }

    // 4. Fetch last action from localStorage for dynamic audit log
    const savedAction = localStorage.getItem("pcs_last_billing_action");
    if (savedAction) {
      setLastBillingAction(savedAction);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Update last billing action helper
  const updateBillingAction = (action: string) => {
    setLastBillingAction(action);
    localStorage.setItem("pcs_last_billing_action", action);
  };

  // Modern pricing tiers including the requested BDT (₹) variants
  const plans = [
    {
      id: "free",
      nameEn: "FREE STANDARD PLAN",
      nameBn: "ফ্রি স্ট্যান্ডার্ড প্ল্যান",
      priceInr: "₹0",
      priceUsd: "$0",
      periodEn: "forever",
      periodBn: "আজীবন",
      tierLabel: "Starter",
      badgeColor: "bg-gray-800 text-gray-300",
      borderColor: "border-gray-800/80 hover:border-gray-700/80",
      glowColor: "rgba(100,116,139,0.1)",
      features: [
        isEn ? "15 standard campaign creations" : "১৫টি স্ট্যান্ডার্ড ক্যাম্পেইন জেনারেট",
        isEn ? "Standard translation node speed" : "মিডিয়াম অনুবাদ ইঞ্জিন স্পিড",
        isEn ? "Local client workspace indexing" : "লোকাল ড্রাফটার ওয়ার্কস্পেস অ্যাক্সেস",
        isEn ? "Offline sandbox diagnostics" : "সাধারণ স্যান্ডবক্স ডায়াগনস্টিকস"
      ],
      isPopular: false
    },
    {
      id: "creator",
      nameEn: "PRO CREATOR",
      nameBn: "প্রো ক্রিয়েটর নোড",
      priceInr: "₹99",
      priceUsd: "$11",
      periodEn: "month",
      periodBn: "মাসিক",
      tierLabel: "Creator Pro",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border border-cyan-800/30",
      borderColor: "border-cyan-500/35 hover:border-cyan-400/80",
      glowColor: "rgba(6,182,212,0.18)",
      features: [
        isEn ? "Unlimited neural model cycles" : "আনলিমিটেড মডেল রান সুবিধা",
        isEn ? "Priority 3x faster API queues" : "৩ গুণ দ্রুত প্রায়োরিটি গেটওয়ে",
        isEn ? "Pre-configured custom prompt vault" : "কাস্টম প্রম্পট ভল্ট ডিরেক্টরি",
        isEn ? "Premium video outline specs" : "১০০% প্রিমিয়াম এইচডি ভিডিও লেআউট"
      ],
      isPopular: true
    },
    {
      id: "marketing",
      nameEn: "PRO MARKETING EXPERT",
      nameBn: "প্রো মার্কেটিং এক্সপার্ট",
      priceInr: "₹299",
      priceUsd: "$29",
      periodEn: "month",
      periodBn: "মাসিক",
      tierLabel: "Creator Pro",
      badgeColor: "bg-purple-500/10 text-purple-400 border border-purple-800/30",
      borderColor: "border-purple-500/30 hover:border-purple-400/80",
      glowColor: "rgba(168,85,247,0.18)",
      features: [
        isEn ? "All Pro Creator advantages included" : "প্রো ক্রিয়েটর মডিউলের সব সুবিধা",
        isEn ? "Multi-channel scheduling blueprint" : "মাল্টি-চ্যানেল পোস্টার অ্যান্ড কন্টেন্ট প্ল্যান",
        isEn ? "Social platform LinkedIn filter tags" : "উন্নত ফিল্টার অ্যান্ড কাস্টম কি-ওয়ার্ডস",
        isEn ? "Auto tone optimizer micro-coprocessor" : "টোন অপ্টিমাইজার এবং প্রিমিয়াম এআই টুল"
      ],
      isPopular: false
    },
    {
      id: "business",
      nameEn: "Business Enterprise SaaS",
      nameBn: "বিজনেস এন্টারপ্রাইজ স্যাস",
      priceInr: "₹799",
      priceUsd: "$89",
      periodEn: "month",
      periodBn: "মাসিক",
      tierLabel: "Enterprise Level",
      badgeColor: "bg-amber-500/10 text-amber-400 border border-amber-800/30",
      borderColor: "border-amber-500/30 hover:border-amber-400/80",
      glowColor: "rgba(245,158,11,0.18)",
      features: [
        isEn ? "High-scale custom workspace API clusters" : "হাই-স্কেল কাস্টম ওয়ার্কস্পেস ক্লাস্টার",
        isEn ? "Unlimited cloud campaign seats allocation" : "টিম শেয়ারিং এবং ক্লাউড স্টোরেজ সিট",
        isEn ? "Dedicated SLA network uptime monitors" : "ডেডিকেটেড নেটওয়ার্ক লাইভ আপটাইম",
        isEn ? "Custom credentials enterprise safety vault" : "এন্টারপ্রাইজ সিকিউরিটি টোকেন সিকিউর ভল্ট"
      ],
      isPopular: false
    }
  ];

  // Calculate local browser state footprint representation
  const localStorageUsageKiloBytes = useMemo(() => {
    return parseFloat((storageUsageBytes / 1024).toFixed(2));
  }, [storageUsageBytes]);

  // Dynamically compile logs from sandbox storage if a payment succeeded
  const dynamicHistoryItems = useMemo(() => {
    const baseItems = [
      { date: "May 27, 2026", desc: "Local sandbox init telemetry handshake", ref: "TXN_774982BF", amount: "₹0.00", status: "SYSTEM_OK" },
      { date: "May 25, 2026", desc: "Automatic Quota renewal cycle node: Starter Tier", ref: "TXN_124805FA", amount: "₹0.00", status: "RENEWED" },
      { date: "Apr 25, 2026", desc: "First bootstrap gateway verification payload", ref: "TXN_987214FA", amount: "₹0.00", status: "VERIFIED" },
      { date: "Local State Check", desc: `Last Registered Action: ${lastBillingAction}`, ref: "SECURE_COOKIE", amount: "HYBRID", status: "MONITOR" }
    ];

    try {
      const activePlanId = localStorage.getItem("activePlan");
      const paymentStatusValue = localStorage.getItem("paymentStatus");
      const lastPaymentDateValue = localStorage.getItem("lastPaymentDate");

      if (activePlanId && paymentStatusValue) {
        let amountStr = "₹0.00";
        if (activePlanId === "creator") amountStr = "₹99.00";
        else if (activePlanId === "marketing") amountStr = "₹299.00";
        else if (activePlanId === "business") amountStr = "₹799.00";

        let dateStr = "Today";
        if (lastPaymentDateValue) {
          const dateObj = new Date(lastPaymentDateValue);
          dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        const newTxn = {
          date: dateStr,
          desc: `Subscription Upgrade (${activePlanId.toUpperCase()}) via Razorpay`,
          ref: "TXN_RZP_TEST",
          amount: amountStr,
          status: "SUCCESS"
        };
        return [newTxn, ...baseItems];
      }
    } catch (e) {
      // Ignored
    }

    return baseItems;
  }, [lastBillingAction]);

  // Handle plan checkout simulation
  const handleCheckoutInitiation = (plan: typeof plans[0]) => {
    setSelectedPlanId(plan.id);
    setSelectedPlan(plan.nameEn);
    setSelectedPrice(plan.priceInr);
    setIsCheckoutModalOpen(true);
    setModalOpen(true);
    setSimulatedGateway(null);
    setPaymentStep("choose");
    setTestPaymentStatus("IDLE");
    setSimulatedLogs([]);
    triggerSaaSToast(`${isEn ? "Opening secure checkout for" : "সিকিউর চেকআউট খোলা হচ্ছে"}: ${isEn ? plan.nameEn : plan.nameBn}`, "info");
  };

  // Dynamically load Razorpay SDK
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Razorpay Test Payment Success callback handler
  const handleCompleteRazorpaySuccess = (paymentId: string) => {
    const matchedPlan = plans.find(p => p.id === selectedPlanId);
    if (!matchedPlan) return;

    setSimulatedGateway("razorpay");
    setPaymentStep("processing");
    const initLogs = [
      `[0.1s] Dynamic Razorpay Payment verification callback caught. ID: ${paymentId}`,
      `[0.3s] Verified: test key [rzp_test_SuQa6SWaVYGtVh] approved.`,
      `[0.6s] Securing subscription parameters for "${matchedPlan.nameEn}"`,
      `[0.9s] Initiating auto-unlock trigger sequences...`
    ];
    setSimulatedLogs(initLogs);

    setTimeout(() => {
      setSimulatedLogs(prev => [...prev, `[1.2s] Storing localized subscription engine configurations...`]);
    }, 400);

    setTimeout(() => {
      setSimulatedLogs(prev => [...prev, `[1.5s] Updating workspace billing tier to "${matchedPlan.tierLabel}"`]);
    }, 800);

    setTimeout(() => {
      let tierToSet: "Starter" | "Creator Pro" | "Enterprise" = "Starter";
      if (matchedPlan.id === "creator" || matchedPlan.id === "marketing") {
        tierToSet = "Creator Pro";
      } else if (matchedPlan.id === "business") {
        tierToSet = "Enterprise";
      }

      onUpgradeTier(tierToSet);
      updateBillingAction(`UPGRADE_${matchedPlan.id.toUpperCase()}_SUCCESS`);
      setTestPaymentStatus("SUCCESS");
      setPaymentStep("success");

      const todayISO = new Date().toISOString();
      try {
        localStorage.setItem("pcs_premium_user_active", "true");
        localStorage.setItem("pcs_active_plan_id", matchedPlan.id);
        localStorage.setItem("pcs_payment_status", "Success (Paid via Razorpay Test Mode)");
        localStorage.setItem("activePlan", matchedPlan.id);
        localStorage.setItem("paymentStatus", "Success (Razorpay Test Mode)");
        localStorage.setItem("lastPaymentDate", todayISO);
      } catch (err) {
        // Ignored
      }

      triggerSaaSToast(
        isEn 
          ? `Successfully migrated to: ${matchedPlan.nameEn}! (Razorpay Payment ID: ${paymentId})` 
          : `অভিনন্দন! আপনার অ্যাকাউন্টটি "${matchedPlan.nameBn}" এ স্থানান্তরিত করা হয়েছে!`, 
        "success"
      );
    }, 1800);
  };

  // Open the real Razorpay payment overlay
  const handleRazorpayTestPayment = async () => {
    const matchedPlan = plans.find(p => p.id === selectedPlanId);
    if (!matchedPlan) {
      triggerSaaSToast("No selected plan found. Please select a plan first.", "warning");
      return;
    }

    setIsRazorpayLoading(true);
    setRazorpayError(null);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setIsRazorpayLoading(false);
      setRazorpayError("Failed to load Razorpay library. Check your network connection.");
      triggerSaaSToast("Failed to load Razorpay library.", "warning");
      return;
    }

    setIsRazorpayLoading(false);

    // Extract amount in paise
    let amountPaise = 0;
    if (matchedPlan.id === "creator") {
      amountPaise = 9900; // ₹99
    } else if (matchedPlan.id === "marketing") {
      amountPaise = 29900; // ₹299
    } else if (matchedPlan.id === "business") {
      amountPaise = 79900; // ₹799
    } else {
      amountPaise = 0; // Free
    }

    if (amountPaise === 0) {
      handleCompleteUpgrade("razorpay");
      return;
    }

    const options = {
      key: "rzp_test_SuQa6SWaVYGtVh",
      amount: amountPaise,
      currency: "INR",
      name: "PCS AI Studio",
      description: `Test Mode Sandbox Subscription for ${matchedPlan.nameEn}`,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=60",
      handler: function (response: any) {
        handleCompleteRazorpaySuccess(response.razorpay_payment_id || `pay_${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
      },
      prefill: {
        name: "Test User",
        email: "pcschairman53@gmail.com",
        contact: "9999999999"
      },
      notes: {
        address: "Quota Safe Sandbox Mode",
        environment: "AI Studio Build Layer"
      },
      theme: {
        color: "#06b6d4" // cyan-500
      },
      modal: {
        ondismiss: function () {
          triggerSaaSToast("Razorpay Test payment popup dismissed.", "info");
        }
      }
    };

    try {
      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.open();
    } catch (err: any) {
      setRazorpayError(err.message || "Failed to initialize Razorpay UI overlay.");
      triggerSaaSToast("Razorpay initialization failed.", "warning");
    }
  };

  const handleCompleteUpgrade = (gatewayName: "stripe" | "razorpay" | "teambilling") => {
    setSimulatedGateway(gatewayName);
    const matchedPlan = plans.find(p => p.id === selectedPlanId);
    if (!matchedPlan) return;

    setPaymentStep("processing");
    const initLogs = [
      `[0.1s] Initiating secure cryptographic connection to ${gatewayName.toUpperCase()} network...`,
      `[0.3s] Handshake received. Mode: [TEST MODE ACTIVE]`,
      `[0.5s] Resolving local workspace: "${activeWorkspaceName}"`,
      `[0.7s] Price Point validation: ${matchedPlan.priceInr} (${matchedPlan.priceUsd})`,
    ];
    setSimulatedLogs(initLogs);

    setTimeout(() => {
      setSimulatedLogs(prev => [...prev, `[1.1s] Validating credit card / sandbox wallet auth token...`]);
    }, 400);

    setTimeout(() => {
      setSimulatedLogs(prev => [...prev, `[1.3s] Applying Quota Safe bypass mechanics...`]);
    }, 800);

    setTimeout(() => {
      setSimulatedLogs(prev => [...prev, `[1.5s] Transaction authorization: GRANTED (TEST_SUCCESS)`]);
    }, 1200);

    setTimeout(() => {
      // Map to active tier
      let tierToSet: "Starter" | "Creator Pro" | "Enterprise" = "Starter";
      if (matchedPlan.id === "creator" || matchedPlan.id === "marketing") {
        tierToSet = "Creator Pro";
      } else if (matchedPlan.id === "business") {
        tierToSet = "Enterprise";
      }

      onUpgradeTier(tierToSet);
      updateBillingAction(`UPGRADE_${matchedPlan.id.toUpperCase()}_SUCCESS`);
      setTestPaymentStatus("SUCCESS");
      setPaymentStep("success");
      
      try {
        localStorage.setItem("pcs_premium_user_active", "true");
        localStorage.setItem("pcs_active_plan_id", matchedPlan.id);
        localStorage.setItem("pcs_payment_status", "Success (Paid via Test Mode)");
      } catch (err) {
        // storage disabled
      }

      triggerSaaSToast(
        isEn 
          ? `Successfully migrated to: ${matchedPlan.nameEn}! (Simulated via ${gatewayName.toUpperCase()})` 
          : `অভিনন্দন! আপনার অ্যাকাউন্টটি "${matchedPlan.nameBn}" এ স্থানান্তরিত করা হয়েছে!`, 
        "success"
      );
    }, 1700);
  };

  return (
    <div className="space-y-6 mt-4" id="saas-premium-billing-wrapper">
      
      {/* 1. TOP HEADER STATUS ROW (Quota text demands) */}
      <div className="bg-[#0b0c13]/70 border border-gray-950 rounded-2xl p-4.5 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 backdrop-blur-md relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.01] rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/30 text-cyan-400">
            <ShieldCheck className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/35 px-2 py-0.5 rounded font-extrabold tracking-wider">
                {isEn ? "Hybrid Subscription Layer Active" : "হাইব্রিড সাবস্ক্রিপশন লেয়ার সক্রিয়"}
              </span>
              <span className="text-[9.5px] font-mono text-cyan-400 tracking-wider">
                {isEn ? "Quota Safe Billing Architecture Running" : "কোটা সেফ বিলিং আর্কিটেকচার সচল"}
              </span>
              <span className="text-[9px] font-mono bg-purple-950/40 text-purple-400 border border-purple-800/65 px-2 py-0.5 rounded font-extrabold">
                {isEn ? "Premium Unlock Engine Ready" : "প্রিমিয়াম আনলক ইঞ্জিন প্রস্তুত"}
              </span>
              <span className="text-[9px] font-mono bg-indigo-950/40 text-indigo-400 border border-indigo-800/65 px-2 py-0.5 rounded font-extrabold shadow-[0_0_8px_rgba(99,102,241,0.2)]">
                {isEn ? "Hybrid Dual Currency Layer Active" : "হাইব্রিড ডুয়াল কারেন্সি লেয়ার সক্রিয়"}
              </span>
              <span className="text-[9px] font-mono bg-emerald-950/40 text-[#34d399] border border-emerald-800/65 px-2 py-0.5 rounded font-extrabold">
                {isEn ? "Quota Safe Pricing Formatter Enabled" : "কোটা সেফ প্রাইসিং ফরম্যাটার সচল"}
              </span>
            </div>
            <p className="text-[10.5px] text-gray-500 mt-1 font-mono">
              {isEn 
                ? "Quota Safe Payment Architecture Enabled. Micro-caching sandbox mirrors secure live payments safely with dual-currency INR/USD indexing." 
                : "কোটা-সেফ পেমেন্ট আর্কিটেকচার সক্রিয়। ডুয়াল কারেন্সি স্যান্ডবক্স গেটওয়ে টেস্ট পেমেন্ট প্রসেসিং সমর্থন করে।"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono shrink-0">
          <span className="text-[9px] text-gray-500 hidden sm:inline uppercase">{isEn ? "Engine Layer:" : "ইঞ্জিন লেয়ার:"}</span>
          <span className="text-[10px] bg-emerald-950/30 border border-emerald-900/40 px-2.5 py-1 rounded text-emerald-400 font-bold animate-pulse">
            {isEn ? "Hybrid Subscription Layer Active" : "হাইব্রিড সাবস্ক্রিপশন লেয়ার সক্রিয়"}
          </span>
        </div>
      </div>

      {/* 2. SUBVIEW TAB TO TOGGLE INTERFACE VIEWS */}
      <div className="flex border-b border-gray-900/40 pb-1.5 gap-2 relative z-10" id="billing-sub-tab-row">
        <button
          onClick={() => setBillingSubTab("tiers")}
          className={`py-2 px-3.5 rounded-xl text-[11px] font-bold font-mono tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 relative ${
            billingSubTab === "tiers" ? "text-cyan-400 font-extrabold" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {billingSubTab === "tiers" && (
            <motion.div
              layoutId="activeBillingSubTabGlow"
              className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/30 rounded-xl -z-10 shadow-[0_0_15px_rgba(6,182,212,0.08)]"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <Layers className="w-3.5 h-3.5" />
          <span>{isEn ? "Subscription Tiers" : "সাবস্ক্রিপশন প্ল্যানসমূহ"}</span>
        </button>

        <button
          onClick={() => setBillingSubTab("usage")}
          className={`py-2 px-3.5 rounded-xl text-[11px] font-bold font-mono tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 relative ${
            billingSubTab === "usage" ? "text-cyan-400 font-extrabold" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {billingSubTab === "usage" && (
            <motion.div
              layoutId="activeBillingSubTabGlow"
              className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/30 rounded-xl -z-10 shadow-[0_0_15px_rgba(6,182,212,0.08)]"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <Activity className="w-3.5 h-3.5" />
          <span>{isEn ? "Usage Overview" : "ব্যবহারের বিবরণী"}</span>
        </button>

        <button
          onClick={() => setBillingSubTab("history")}
          className={`py-2 px-3.5 rounded-xl text-[11px] font-bold font-mono tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 relative ${
            billingSubTab === "history" ? "text-cyan-400 font-extrabold" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {billingSubTab === "history" && (
            <motion.div
              layoutId="activeBillingSubTabGlow"
              className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/30 rounded-xl -z-10 shadow-[0_0_15px_rgba(6,182,212,0.08)]"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <History className="w-3.5 h-3.5" />
          <span>{isEn ? "Billing History" : "ট্যাক্স চালান ও বিলিং ট্র্যাকিং"}</span>
        </button>
      </div>

      {/* 3. DYNAMIC CONTENT RENDERING PANEL */}
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: PRICING CARD TIERS */}
        {billingSubTab === "tiers" && (
          <motion.div
            key="tiers-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Horizontal Active Status Bar */}
            <div className="bg-[#07080e]/95 border border-gray-950 rounded-2xl p-5.5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#06b6d4]/[0.015] rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center justify-center shrink-0 self-center">
                  <div className="w-full h-full bg-[#08090e] rounded-[10px] flex items-center justify-center text-cyan-400">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2.5">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
                      {isEn ? "Current Active Status:" : "বর্তমান সাবস্ক্রিপশন স্ট্যাটাস:"}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-extrabold border border-cyan-800/40">
                      {activeTier} Plan
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-200 mt-1 font-mono">
                    {isEn ? "Your Active Workspace: " : "আপনার একটিভ ওয়ার্কস্পেস: "}
                    <span className="text-white font-extrabold">{activeWorkspaceName}</span>
                  </h3>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end font-mono">
                <span className="text-[9.5px] text-gray-600 uppercase tracking-wider">{isEn ? "Next Renewal" : "পরবর্তী নবায়ন তারিখ"}</span>
                <span className="text-xs text-gray-300 font-bold mt-0.5">June 27, 2026 (Auto)</span>
                <span className="text-[8.5px] text-[#10b981] font-bold mt-1 inline-flex items-center gap-0.5">
                  <span className="inline-block w-1 h-1 rounded-full bg-[#10b981] animate-ping" />
                  Hybrid SaaS Subscription Active
                </span>
              </div>
            </div>

            {/* Custom 4-Column Cyber Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {plans.map((p) => {
                const isSelectedTierActive = 
                  activeTier === p.tierLabel || 
                  (activeTier === "Enterprise" && p.id === "business");
                const matchesIdActive = 
                  (activeTier === "Starter" && p.id === "free") ||
                  (activeTier === "Creator Pro" && p.id === "creator") ||
                  (activeTier === "Enterprise" && p.id === "business");

                return (
                  <motion.div
                    key={p.id}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className={`bg-[#08090f]/90 backdrop-blur-md rounded-2xl border p-5 flex flex-col justify-between relative transition-all duration-300 overflow-hidden group ${
                      matchesIdActive 
                        ? "border-[#06b6d4]/45 shadow-[0_0_20px_rgba(6,182,212,0.12)]" 
                        : p.borderColor
                    }`}
                    style={{
                      boxShadow: matchesIdActive ? `0 4px 20px -2px ${p.glowColor}, inset 0 1px 1px rgba(255,255,255,0.02)` : `inset 0 1px 1px rgba(255,255,255,0.01)`
                    }}
                  >
                    {/* Corner micro accent indicator */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/[0.01] rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/[0.03] transition-colors" />
                    
                    {matchesIdActive && (
                      <span className="absolute top-0 right-4 -translate-y-1/2 bg-cyan-400 text-black text-[8.5px] font-mono font-black tracking-widest uppercase px-2 py-0.5 rounded-full shadow-md animate-pulse">
                        {isEn ? "ACTIVE" : "সক্রিয়"}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono font-extrabold text-gray-500 uppercase tracking-widest">
                          {p.tierLabel} level
                        </span>
                        {p.isPopular && (
                          <span className="text-[7.5px] font-mono font-bold uppercase bg-cyan-400 text-black px-1.5 py-0.2 rounded">
                            Popular
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-[12px] font-mono font-bold text-white uppercase tracking-wider mb-2">
                        {isEn ? p.nameEn : p.nameBn}
                      </h4>

                      <div className="border-b border-gray-900 pb-3.5 mb-4 font-mono">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.35)]">
                            {p.priceInr}
                          </span>
                          <span className="text-[10px] text-gray-500 font-bold lowercase">
                            /{isEn ? (p.periodEn === "forever" ? "month" : p.periodEn) : (p.periodBn === "আজীবন" ? "মাস" : p.periodBn)}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400/80 mt-1 select-none font-medium">
                          ({isEn ? "approx." : "আন্দাজ"} {p.priceUsd})
                        </div>
                      </div>

                      {/* Compact Micro Features checklist */}
                      <ul className="space-y-2 mb-6 min-h-[140px] text-[10.5px] text-gray-400 leading-relaxed font-sans text-left">
                        {p.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-1.5 group-hover:text-gray-300 transition-colors">
                            <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full mt-1.5 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleCheckoutInitiation(p)}
                      disabled={matchesIdActive}
                      className={`w-full py-2.5 px-3 rounded-xl text-[10px] uppercase font-bold font-mono tracking-wider transition-all duration-300 cursor-pointer text-center border ${
                        matchesIdActive
                          ? "bg-cyan-500/5 border-cyan-500/20 text-cyan-400/60 cursor-not-allowed"
                          : "bg-gray-950 hover:bg-[#0e101b] hover:border-cyan-500/40 border-gray-800 text-gray-300 hover:text-white font-extrabold shadow-[0_0_12px_rgba(32,211,153,0.02)] hover:shadow-[0_0_15px_rgba(6,182,212,0.18)]"
                      }`}
                    >
                      {matchesIdActive ? (isEn ? "CURRENTLY ACTIVE" : "সক্রিয় রয়েছে") : (isEn ? "SELECT PLAN" : "প্ল্যান নির্বাচন করুন")}
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Custom Interactive Corporate CRM Integration Banner */}
            <div className="mt-8 bg-gradient-to-r from-emerald-950/15 via-[#0c0d15] to-cyan-950/15 border border-[#06b6d4]/20 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-5 text-left font-sans">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-cyan-400">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-505"></span>
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                    {isEn ? "Need Custom Dedicated High-Volume Enterprise SLA Quotas?" : "কাস্টম ডেডিকেটেড হাই-ভলিউম এন্টারপ্রাইজ কোটা প্রয়োজন?"}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-xl">
                    {isEn 
                      ? "Register your enterprise organization interest through our secure CRM system. Direct team coordination will enable personalized custom-domain webhook gateways instantly." 
                      : "আমাদের নিরাপদ সিআরএম রেজিস্ট্রেশন সম্পন্ন করুন। আমাদের এন্টারপ্রাইজ টিম তাৎক্ষণিকভাবে আপনার জন্য ডেডিকেটেড গেটওয়ে সক্রিয় করবে।"}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => (window as any).triggerPcsLeadCapture?.()}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#06b6d4] to-emerald-500 hover:from-emerald-400 hover:to-[#06b6d4] text-[#090a0f] font-mono font-extrabold text-xs uppercase rounded-xl tracking-wider hover:shadow-[0_0_15px_rgba(6,182,212,0.45)] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{isEn ? "Contact Sales" : "সেলস কন্টাক্ট"}</span>
                </button>
                <button
                  onClick={() => (window as any).triggerPcsLeadCapture?.()}
                  className="px-5 py-2.5 bg-[#0a0c14] hover:bg-gray-900 border border-gray-800 hover:border-gray-705 text-gray-400 hover:text-white font-mono font-bold text-xs uppercase rounded-xl transition-all cursor-pointer"
                >
                  {isEn ? "Get Premium Access" : "প্রিমিয়াম অ্যাক্সেস নিন"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: USAGE METRICS DIAGNOSIS */}
        {billingSubTab === "usage" && (
          <motion.div
            key="usage-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Realtime Resource Counter 1 */}
            <div className="bg-[#08090f]/80 border border-gray-950 rounded-2xl p-5 font-mono text-left space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
                <Server className="w-4 h-4 text-cyan-400" />
                <span className="text-[10.5px] text-white font-extrabold uppercase">{isEn ? "Local Storage Allocation" : "লোকাল স্টোরেজ ফুটপ্রিন্ট"}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">{isEn ? "Cache footprint" : "ড্রাফট ক্যাশ ফাইলঃ"}</span>
                  <span className="text-gray-300 font-bold">{localStorageUsageKiloBytes} KB</span>
                </div>
                {/* Simulated bar progress */}
                <div className="w-full bg-gray-950 h-1.5 rounded-full overflow-hidden border border-gray-900">
                  <div 
                    className="bg-cyan-500 h-full rounded-full" 
                    style={{ width: `${Math.min(100, Math.max(8, (localStorageUsageKiloBytes / 2500) * 100))}%` }} 
                  />
                </div>
                <div className="flex items-center justify-between text-[8.5px] text-gray-600">
                  <span>0.0 KB</span>
                  <span>5,120 KB Max Limit</span>
                </div>
              </div>

              <div className="pt-2 text-[10.5px] text-gray-400">
                <Info className="w-3.5 h-3.5 text-cyan-400 inline mr-1 -mt-0.5" />
                <span>
                  {isEn 
                    ? "Saves prompts automatically in browser memory loop." 
                    : "আপনার সব প্রিসেট এবং ড্রাফটস ব্রাউজার মেমোরিতে সেভ থাকে।"}
                </span>
              </div>
            </div>

            {/* Campaign Blueprints Counts */}
            <div className="bg-[#08090f]/80 border border-gray-950 rounded-2xl p-5 font-mono text-left space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
                <Compass className="w-4 h-4 text-purple-400" />
                <span className="text-[10.5px] text-white font-extrabold uppercase">{isEn ? "Campaign Blueprints" : "সক্রিয় ক্যাম্পেইন ব্লুপ্রিন্ট"}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">{isEn ? "Active files" : "ফাইল ফাইল সংখ্যাঃ"}</span>
                  <span className="text-gray-300 font-bold">{totalCampaignsCount} Blueprints</span>
                </div>
                {/* Simulated progress limit based on current tier limits */}
                <div className="w-full bg-gray-950 h-1.5 rounded-full overflow-hidden border border-gray-900">
                  <div 
                    className="bg-purple-500 h-full rounded-full animate-pulse" 
                    style={{ width: activeTier === "Starter" ? `${Math.min(100, (totalCampaignsCount / 15) * 100)}%` : `24%` }} 
                  />
                </div>
                <div className="flex items-center justify-between text-[8.5px] text-gray-600">
                  <span>0 active</span>
                  <span>{activeTier === "Starter" ? "15 Cap (Starter)" : "Unlimited Capacity"}</span>
                </div>
              </div>

              <div className="pt-2 text-[10.5px] text-gray-400">
                <Zap className="w-3.5 h-3.5 text-purple-400 inline mr-1 -mt-0.5" />
                <span>
                  {isEn 
                    ? `Unified campaigns: ${totalCampaignsCount} saved.`
                    : `${totalCampaignsCount}টি ইউনিক ক্যাম্পেইন ব্লুপ্রিন্ট সেভ করা রয়েছে।`}
                </span>
              </div>
            </div>

            {/* Prompt Preset Counts */}
            <div className="bg-[#08090f]/80 border border-gray-950 rounded-2xl p-5 font-mono text-left space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
                <FileText className="w-4 h-4 text-amber-500" />
                <span className="text-[10.5px] text-white font-extrabold uppercase">{isEn ? "Prompt Vault Storage" : "প্রম্পট ভল্ট ডিরেক্টরি"}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">{isEn ? "Vault items" : "সংরক্ষিত প্রিসেটসঃ"}</span>
                  <span className="text-gray-300 font-bold">{totalPromptsCount} presets</span>
                </div>
                {/* Simulated usage gauge */}
                <div className="w-full bg-gray-950 h-1.5 rounded-full overflow-hidden border border-gray-900">
                  <div 
                    className="bg-amber-500 h-full rounded-full" 
                    style={{ width: `${Math.min(100, Math.max(12, (totalPromptsCount / 50) * 100))}%` }} 
                  />
                </div>
                <div className="flex items-center justify-between text-[8.5px] text-gray-600">
                  <span>0 saved</span>
                  <span>Unlimited Space Max</span>
                </div>
              </div>

              <div className="pt-2 text-[10.5px] text-gray-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 inline mr-1 -mt-0.5" />
                <span>
                  {isEn 
                    ? "Syncs with Cloud databases automatically on change." 
                    : "প্রম্পটসমূহ গুগল সিকিউর ক্লাউডের সাথে সচল সিঙ্কে রয়েছে।"}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 3: SIMULATED INVOICES HISTORY */}
        {billingSubTab === "history" && (
          <motion.div
            key="history-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#08090f]/70 border border-gray-950 rounded-2xl p-5 font-mono text-left"
          >
            <div className="flex items-center justify-between border-b border-gray-900 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] text-white font-extrabold uppercase">{isEn ? "Automated Local Payment Ledgers" : "পেমেন্ট লেজার অ্যান্ড ইনভয়েস ট্র্যাকিং"}</span>
              </div>
              <span className="text-[9.5px] text-gray-500 font-mono">2026 AUDIT MATRIX</span>
            </div>

            {/* Simulated History items list */}
            <div className="space-y-2.5">
              {dynamicHistoryItems.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-black/45 border border-gray-950 rounded-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-[10.5px]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-[9.5px] font-bold">{item.date}</span>
                      <span className="text-[8px] bg-cyan-950 text-cyan-400 px-1 py-0.2 rounded border border-cyan-800/30 uppercase font-black tracking-tight">{item.ref}</span>
                    </div>
                    <p className="text-gray-300 font-semibold">{item.desc}</p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end shrink-0">
                    <span className="text-gray-200 font-black">{item.amount}</span>
                    <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 px-2 py-0.5 rounded font-black font-mono">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-[9.5px] text-gray-500 mt-4 text-center">
              * {isEn ? "This history log is compiled securely via local environment audit ledgers index." : "বিলিং ইতিহাস সম্পূর্ণ নিরাপদ লোকাল কুয়াল স্টোরেজ ইনডেক্স থেকে তৈরি হচ্ছে।"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. PREMIUM COMPRESSED PREVIEW SHOWCASING LOCKED MODULES */}
      <div className="bg-[#08090f]/60 border border-gray-950 rounded-2xl p-5.5 relative overflow-hidden text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)]" id="tel-feature-showcase">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/[0.015] rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center justify-between border-b border-gray-900 pb-2 mb-3">
          <span className="text-[9.5px] font-mono text-purple-400 uppercase tracking-widest block font-bold">
            {isEn ? "Premium Modules Status & Locks" : "প্রিমিয়াম মডিউল লক স্ট্যাটাস"}
          </span>
          {activeTier !== "Starter" ? (
            <span className="text-[9px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-800/65 px-2 py-0.5 rounded font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.25)] animate-pulse">
              ★ {isEn ? "PRO USER ACTIVE" : "প্রো সার্ভিস সচল"}
            </span>
          ) : (
            <span className="text-[9px] font-mono bg-gray-950 text-gray-500 border border-gray-900 px-2 py-0.5 rounded">
              {isEn ? "FREE ACCESS TIER LIMIT" : "ফ্রি এক্সেস লিমিট"}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Locked module box 1 */}
          <div className={`p-3.5 bg-black/35 rounded-xl border transition-all duration-500 flex items-center justify-between gap-4 group ${
            activeTier !== "Starter" 
              ? "border-cyan-500/35 bg-cyan-950/5 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
              : "border-gray-950"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center relative ${
                activeTier !== "Starter" ? "bg-cyan-950/40 text-cyan-400" : "bg-purple-950/20 text-purple-400"
              }`}>
                <Server className="w-4 h-4" />
                {activeTier !== "Starter" && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <div>
                <h5 className="text-[11.5px] font-mono font-bold text-gray-200">{isEn ? "Sora Video Generator v3" : "সোরা ভিডিও জেনারেটর ৩.০"}</h5>
                <p className="text-[9.5px] text-gray-500 mt-0.5">
                  {activeTier !== "Starter" 
                    ? (isEn ? "✓ Fully Unlocked and Ready" : "✓ সম্পূর্ণ উন্মুক্ত এবং প্রস্তুত") 
                    : (isEn ? "Unlocked on Creator Pro & Enterprise" : "ক্রিয়েটর প্রো এবং এন্টারপ্রাইজ লেভেলে উন্মুক্ত")}
                </p>
              </div>
            </div>
            {activeTier !== "Starter" ? (
              <div className="flex items-center gap-1 bg-cyan-950/50 border border-cyan-800/40 px-2' py-0.5 rounded text-[8.5px] font-mono text-cyan-400 font-extrabold uppercase mr-1">
                <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>ACTIVE</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-purple-950/20 border border-purple-900/30 px-2 py-0.5 rounded text-[8.5px] font-mono text-purple-400 font-extrabold uppercase mr-1">
                <Lock className="w-3 h-3 shrink-0" />
                <span>PRO_LOCKED</span>
              </div>
            )}
          </div>

          {/* Locked module box 2 */}
          <div className={`p-3.5 bg-black/35 rounded-xl border transition-all duration-500 flex items-center justify-between gap-4 group ${
            activeTier === "Enterprise" 
              ? "border-amber-500/35 bg-amber-950/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]" 
              : "border-gray-950"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center relative ${
                activeTier === "Enterprise" ? "bg-amber-950/40 text-amber-400" : "bg-amber-950/15 text-amber-500"
              }`}>
                <Compass className="w-4 h-4" />
                {activeTier === "Enterprise" && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>
              <div>
                <h5 className="text-[11.5px] font-mono font-bold text-gray-200">{isEn ? "AI Campaign Scheduler Pro" : "এআই ক্যাম্পেইন শিডিউলার প্রো"}</h5>
                <p className="text-[9.5px] text-gray-500 mt-0.5">
                  {activeTier === "Enterprise" 
                    ? (isEn ? "✓ Multi-Channel API Streaming Active" : "✓ মাল্টি-চ্যানেল এপিআই স্ট্রিমিং সক্রিয়") 
                    : (isEn ? "Unlocked on Enterprise Node" : "বিজনেস এন্টারপ্রাইজ ব্যবহারকারীদের জন্য উন্মুক্ত")}
                </p>
              </div>
            </div>
            {activeTier === "Enterprise" ? (
              <div className="flex items-center gap-1 bg-amber-950/50 border border-amber-800/40 px-2 py-0.5 rounded text-[8.5px] font-mono text-amber-400 font-extrabold uppercase mr-1">
                <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                <span>ACTIVE</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-amber-950/20 border border-amber-900/35 px-2 py-0.5 rounded text-[8.5px] font-mono text-amber-500/70 font-extrabold uppercase mr-1">
                <Lock className="w-3 h-3 shrink-0" />
                <span>BIZ_LOCKED</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. MULTI-GATEWAY MODAL DIALOG PREVIEW */}
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-[9999] backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0c13]/98 border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full relative shadow-2xl text-left font-mono relative overflow-hidden"
              style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8), 0 0 25px rgba(6,182,212,0.15)" }}
            >
              {/* Decorative top glass glow bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 via-emerald-500 to-purple-500" />
              
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsCheckoutModalOpen(false);
                  setModalOpen(false);
                }}
                className="absolute right-4 top-4 p-1.5 rounded hover:bg-gray-900 text-gray-400 hover:text-white cursor-pointer transition-colors"
                title="Close"
              >
                <span className="text-xs">✕</span>
              </button>

              <div className="flex items-center gap-2.5 pb-3.5 mb-4 border-b border-gray-900">
                <div className="p-1.5 bg-cyan-500/15 rounded-lg text-cyan-400 animate-pulse">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    {isEn ? "Secure Checkout Node" : "নিরাপদ পেমেন্ট নোড"}
                  </h3>
                  <span className="text-[8.5px] text-[#10b981] tracking-widest block uppercase mt-0.5 font-extrabold font-mono">TEST MODE SIMULATION ENABLED</span>
                  {selectedPlanId === "business" && (
                    <div className="mt-1 space-y-0.5 font-mono select-none">
                      <span className="text-[9px] text-cyan-400 tracking-wider block font-black uppercase">
                        “Enterprise Hybrid Checkout Active”
                      </span>
                      <span className="text-[9px] text-purple-400 tracking-wider block font-bold uppercase">
                        “Quota Safe Billing Layer Enabled”
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Plans summary */}
              {plans.find(p => p.id === selectedPlanId) && (() => {
                const p = plans.find(p => p.id === selectedPlanId)!;
                return (
                  <div className="space-y-4">
                    {/* Selected Plan Details & Indian Pricing */}
                    <div className="p-3 bg-black/45 border border-gray-900 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-cyan-500/10 border-l border-b border-cyan-500/20 text-[7px] text-cyan-400 font-bold uppercase tracking-tight">
                        {p.tierLabel} level
                      </div>
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest block">{isEn ? "Selected Plan Options" : "নির্বাচিত প্ল্যান"}</span>
                      <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wide mt-0.5">{isEn ? p.nameEn : p.nameBn}</h4>
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-2xl font-black text-gray-100">{p.priceInr}</span>
                        <span className="text-[9.5px] text-gray-500 font-mono">/ {isEn ? p.periodEn : p.periodBn}</span>
                        <span className="text-[9.5px] text-cyan-500/75 ml-auto">({p.priceUsd} USD)</span>
                      </div>
                    </div>

                    {paymentStep === "choose" && (
                      <div className="space-y-3.5">
                        <p className="text-[10px] text-gray-400 leading-relaxed bg-[#0b0c13]/40 border border-gray-900/50 p-2.5 rounded-lg">
                          {isEn 
                            ? "This application is currently configured in Quota-Safe sandbox testing form. Click any button below to trigger the integrated test payment wizard." 
                            : "এই অ্যাপ্লিকেশনটি স্যান্ডবক্স টেস্ট মোডে সাজানো রয়েছে। টেস্ট মেথডে ক্লিক করে ইনস্ট্যান্ট ট্রায়াল পেমেন্ট করুন।"}
                        </p>

                        <div className="grid grid-cols-2 gap-2.5 pt-1">
                          {/* Pay with Stripe (Test) */}
                          <button
                            type="button"
                            onClick={() => {
                              setSimulatedGateway("stripe");
                              setPaymentStep("input");
                            }}
                            className="p-3 bg-[#635bff]/10 hover:bg-[#635bff]/20 border border-[#635bff]/40 text-gray-200 hover:text-white rounded-xl text-[10px] font-bold tracking-wide transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group hover:scale-[1.01]"
                          >
                            <Wallet className="w-4 h-4 text-[#635bff] group-hover:scale-110 transition-transform" />
                            <span>Stripe (Test)</span>
                          </button>

                          {/* Pay with Razorpay (Test) */}
                          <button
                            type="button"
                            onClick={() => {
                              setSimulatedGateway("razorpay");
                              setPaymentStep("input");
                            }}
                            className="p-3 bg-[#3399ff]/10 hover:bg-[#3399ff]/20 border border-[#3399ff]/40 text-gray-200 hover:text-white rounded-xl text-[10px] font-bold tracking-wide transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group hover:scale-[1.01]"
                          >
                            <Zap className="w-4 h-4 text-[#3399ff] group-hover:scale-110 transition-transform" />
                            <span>Razorpay (Test)</span>
                          </button>
                        </div>

                        {/* Team Billing Backup */}
                        <button
                          type="button"
                          onClick={() => handleCompleteUpgrade("teambilling")}
                          className="w-full py-2.5 px-3 bg-black/40 hover:bg-[#0c0d15] border border-gray-900 hover:border-gray-800 text-[9.5px] text-gray-400 hover:text-gray-300 rounded-xl font-bold tracking-wide transition-all flex items-center justify-center gap-2"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{isEn ? "Alternative: Corporate Team Voucher" : "টিম কর্পোরেট ভাউচার পেমেন্ট"}</span>
                        </button>
                      </div>
                    )}

                    {paymentStep === "input" && simulatedGateway && (
                      <div className="space-y-3.5" id="test-sandbox-input-form">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase">
                            {simulatedGateway === "stripe" ? "Stripe Sandbox Credentials" : "Razorpay Sandbox Gateway"}
                          </span>
                          <button 
                            onClick={() => setPaymentStep("choose")}
                            className="text-[9px] text-cyan-400 hover:underline"
                          >
                            &larr; Switch Gateway
                          </button>
                        </div>

                        {simulatedGateway === "stripe" ? (
                          /* Stripe test form view */
                          <div className="space-y-2.5 bg-black/45 border border-gray-900 rounded-xl p-3 text-[10.5px]">
                            <div>
                              <span className="text-[8px] text-gray-500 block mb-1">Simulated Card Holder</span>
                              <input 
                                type="text"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-900 px-2 py-1 rounded text-white text-[11px] focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                            <div>
                              <span className="text-[8px] text-gray-500 block mb-1">Stripe Test Card Number</span>
                              <input 
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-900 px-2 py-1 rounded text-white font-mono text-[11px] focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-[8px] text-gray-500 block mb-1">Expiry Date</span>
                                <input 
                                  type="text"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  className="w-full bg-gray-950 border border-gray-900 px-2 py-1 rounded text-white text-[11px] focus:outline-none focus:border-cyan-500"
                                />
                              </div>
                              <div>
                                <span className="text-[8px] text-gray-500 block mb-1">Secure CVC</span>
                                <input 
                                  type="text"
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value)}
                                  className="w-full bg-gray-950 border border-gray-900 px-2 py-1 rounded text-white text-[11px] focus:outline-none focus:border-cyan-500"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Razorpay test form view */
                          <div className="space-y-3 bg-black/45 border border-gray-900 rounded-xl p-3 text-[10.5px]">
                            {/* Quota Safe Mode Banner */}
                            <div className="bg-emerald-950/10 border border-emerald-900/30 p-2 rounded-lg text-[9px] text-[#34d399] flex items-start gap-1.5 leading-relaxed font-sans select-none">
                              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5 animate-pulse" />
                              <div>
                                <span className="font-bold block uppercase tracking-wide">Razorpay Safe Test Layer</span>
                                Use the official Razorpay test portal key safely. Local sandbox overrides prevent actual live bank transactions.
                              </div>
                            </div>

                            {/* Live Checkout Trigger */}
                            <div className="border border-cyan-800/20 bg-cyan-950/5 hover:border-cyan-500/30 p-2.5 rounded-lg space-y-2.5 transition-all">
                              <span className="text-[9.5px] text-cyan-400 font-extrabold uppercase tracking-wider block">Option A: Launch Razorpay Test Overlay</span>
                              
                              {/* Loading Indicator */}
                              {isRazorpayLoading && (
                                <div className="flex items-center justify-center gap-2 py-1 text-cyan-400 text-[10px]">
                                  <div className="w-3.5 h-3.5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                                  <span>Lazy loading secure payment portal...</span>
                                </div>
                              )}

                              {/* Error Panel */}
                              {razorpayError && (
                                <div className="bg-red-950/20 border border-red-900/30 p-2 rounded text-[9.5px] text-red-400 flex items-start gap-1">
                                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                  <span>{razorpayError}</span>
                                </div>
                              )}

                              {/* Test payment credentials */}
                              <div className="bg-gray-950 border border-gray-900 rounded p-2 space-y-1 text-[8.5px] text-gray-500 font-mono">
                                <span className="text-[7.5px] text-gray-400 font-bold uppercase tracking-tight block">Use authorized test credentials:</span>
                                <div className="flex justify-between"><span>Test card:</span> <span className="text-white font-extrabold">4111 1111 1111 1111</span></div>
                                <div className="flex justify-between"><span>CVV:</span> <span className="text-white font-extrabold">123</span></div>
                                <div className="flex justify-between"><span>OTP / Pin:</span> <span className="text-white font-extrabold">123456</span></div>
                              </div>

                              <button
                                type="button"
                                disabled={isRazorpayLoading}
                                onClick={handleRazorpayTestPayment}
                                className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-[9.5px] uppercase tracking-wide rounded transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.15)] hover:shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                              >
                                {isRazorpayLoading ? "Loading Portal..." : "Launch Test checkout popup ↗"}
                              </button>
                            </div>

                            {/* Separator */}
                            <div className="relative flex py-1 items-center">
                              <div className="flex-grow border-t border-gray-900" />
                              <span className="flex-shrink mx-2 text-[7.5px] text-gray-600 uppercase font-bold">OR</span>
                              <div className="flex-grow border-t border-gray-900" />
                            </div>

                            {/* Fast Instant UPI Simulator */}
                            <div className="space-y-2">
                              <span className="text-[9.5px] text-gray-400 font-extrabold uppercase tracking-wider block">Option B: Instant Simulated Router</span>
                              <div>
                                <span className="text-[8px] text-gray-500 block mb-1">Simulated VPA UPI Address</span>
                                <input 
                                  type="text"
                                  value={upiId}
                                  onChange={(e) => setUpiId(e.target.value)}
                                  className="w-full bg-gray-950 border border-gray-900 px-2 py-1 rounded text-white font-mono text-[11px] focus:outline-none focus:border-cyan-500"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCompleteUpgrade("razorpay")}
                                className="w-full py-1.5 bg-gray-950 hover:bg-[#0e101b] border border-gray-800 text-gray-300 hover:text-white rounded text-[9.5px] font-bold uppercase transition-all"
                              >
                                Instant Simulated Upgrade &rarr;
                              </button>
                            </div>
                          </div>
                        )}

                        {simulatedGateway === "stripe" && (
                          <button
                            type="button"
                            onClick={() => handleCompleteUpgrade(simulatedGateway)}
                            className="w-full py-2.5 px-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-black uppercase text-[10px] tracking-widest rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all cursor-pointer text-center"
                          >
                            {isEn ? `Pay ${p.priceInr} with test client credentials` : `টেস্ট ক্রেডেনশিয়াল সহযোগে ${p.priceInr} পরিশোধ করুন`}
                          </button>
                        )}
                      </div>
                    )}

                    {paymentStep === "processing" && (
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between text-[10px] text-cyan-400">
                          <span className="flex items-center gap-1.5 animate-pulse">
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                            {isEn ? "Processing Secure Crypt-token..." : "নিরাপদ ক্রিপ্টো টোকেন প্রসেস হচ্ছে..."}
                          </span>
                          <span>{simulatedGateway?.toUpperCase()}</span>
                        </div>
                        
                        {/* Interactive Console logs */}
                        <div className="bg-black/85 border border-gray-950 rounded-lg p-3 h-28 overflow-y-auto font-mono text-[8.5px] text-gray-500 space-y-1 scrollbar-thin">
                          {simulatedLogs.map((log, lIdx) => (
                            <div key={lIdx} className="text-emerald-400/80 leading-relaxed">
                              {log}
                            </div>
                          ))}
                        </div>

                        <div className="w-full bg-gray-950 h-1.5 rounded-full overflow-hidden border border-gray-900">
                          <motion.div 
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.6 }}
                            className="bg-gradient-to-r from-cyan-500 to-[#10b981] h-full rounded-full"
                          />
                        </div>
                      </div>
                    )}

                    {paymentStep === "success" && (
                      <div className="space-y-3.5 pt-1 text-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h4 className="text-xs font-black text-emerald-400 tracking-wider uppercase font-mono">
                          {isEn ? "Test Mode Payment Completed!" : "টেস্ট পেমেন্ট সম্পন্ন হয়েছে!"}
                        </h4>
                        
                        <div className="p-3 bg-emerald-950/20 border border-emerald-900/25 rounded-xl text-[10px] text-gray-400 text-left space-y-1">
                          <div><span className="text-gray-500">{isEn ? "Subscription Status:" : "সাবস্ক্রিপশন অবস্থা:"}</span> <span className="text-white font-extrabold">{isEn ? "PRO ACTIVE" : "প্রো সচল"}</span></div>
                          <div><span className="text-gray-500">{isEn ? "Payment Gateway:" : "পেমেন্ট গেটওয়ে:"}</span> <span className="text-white uppercase font-bold">{simulatedGateway} (Test Mode)</span></div>
                          <div><span className="text-gray-500">{isEn ? "Transaction ID:" : "লেনদেন নাম্বার:"}</span> <span className="text-cyan-400 font-mono">TXN_{Math.random().toString(36).substr(2, 9).toUpperCase()}</span></div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsCheckoutModalOpen(false)}
                          className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white rounded-xl text-[10.5px] font-bold tracking-wider cursor-pointer"
                        >
                          {isEn ? "Done & Return" : "ঠিক আছে"}
                        </button>
                      </div>
                    )}

                    {/* Developer Configuration Placeholder blocks */}
                    <div className="border-t border-gray-900/60 pt-3.5 mt-2 bg-cyan-950/5 p-2 rounded-xl border border-cyan-950">
                      <span className="text-[7.5px] text-gray-500 uppercase tracking-widest block font-bold mb-2">
                        {isEn ? "🛠️ Gateway API Ready Placeholders (Future Integration)" : "🛠️ এপিআই রেডি প্লেসহোল্ডার্স (ভবিষ্যত ইন্টিগ্রেশন)"}
                      </span>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[7px] text-gray-500">
                        <div><span className="text-cyan-500">Stripe Key:</span> <span className="text-gray-600 block">pk_test_...</span></div>
                        <div><span className="text-[#3399ff]">Razorpay ID:</span> <span className="text-gray-600 block">rzp_test_...</span></div>
                        <div><span className="text-[#10b981]">Webhook URL:</span> <span className="text-gray-600 block">/api/stripe/webhook</span></div>
                        <div><span className="text-purple-500">Invoice:</span> <span className="text-gray-600 block">cron-billing_tasks</span></div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="border-t border-gray-900 pt-3 mt-4 text-[8.5px] text-gray-500 flex items-center justify-between select-none">
                <span>⚡ Quota Safe Client Simulation Ready</span>
                <span>SEC_SSL_256</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
