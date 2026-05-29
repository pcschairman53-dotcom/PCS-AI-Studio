import React, { useState, useEffect } from "react";
import { 
  Lock, Unlock, Sparkles, Building2, Gift, Send, Youtube, Mail, Search, Gem, Check, Info, ArrowUpRight
} from "lucide-react";
import { GeneratorType } from "../types";

interface PremiumTemplate {
  id: string;
  titleEn: string;
  titleBn: string;
  titleHi: string;
  icon: React.ComponentType<{ className?: string }>;
  targetTab: GeneratorType;
  descriptionEn: string;
  descriptionBn: string;
  descriptionHi: string;
  promptTextEn: string;
  promptTextBn: string;
  promptTextHi: string;
  colorClass: string;
  shadowClass: string;
}

interface SaaSPremiumTemplatesProps {
  isEn: boolean;
  onSelectTemplate: (prompt: string, tab: GeneratorType) => void;
  onOpenDashboard?: () => void;
}

export default function SaaSPremiumTemplates({ isEn, onSelectTemplate, onOpenDashboard }: SaaSPremiumTemplatesProps) {
  // Subscription state
  const [activePlan, setActivePlan] = useState<string>("free");
  const [premiumUnlocked, setPremiumUnlocked] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>("");

  // Loaded template transition animation helper
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Status Notification Engine
  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // Check plan subscription on mount & periodically
  useEffect(() => {
    const checkSubscription = () => {
      try {
        const storedPlan = localStorage.getItem("activePlan") || "free";
        setActivePlan(storedPlan);
        
        const isPremium = storedPlan === "creator" || storedPlan === "marketing" || storedPlan === "business";
        const forceUnlock = localStorage.getItem("pcs_force_premium_unlocked") === "true";
        setPremiumUnlocked(isPremium || forceUnlock);
      } catch (e) {
        console.error("Local storage error checking active plan", e);
      }
    };

    checkSubscription();
    // Listen for storage events or custom simulation triggers
    window.addEventListener("storage", checkSubscription);
    const interval = setInterval(checkSubscription, 2000); // periodically poll local state nicely

    return () => {
      window.removeEventListener("storage", checkSubscription);
      clearInterval(interval);
    };
  }, []);

  // Simulator Toggle to test locked vs unlocked state instantly
  const handleToggleSimulation = () => {
    try {
      const currentSim = localStorage.getItem("pcs_force_premium_unlocked") === "true";
      const nextSimState = !currentSim;
      localStorage.setItem("pcs_force_premium_unlocked", nextSimState ? "true" : "false");
      setPremiumUnlocked(nextSimState || ["creator", "marketing", "business"].includes(activePlan));
      
      triggerToast(nextSimState 
        ? "Enterprise Simulation Unlocked! (PRO Active)" 
        : "Simulation Reset to Subscription default."
      );
    } catch (e) {
      console.error(e);
    }
  };

  // High fidelity Premium templates database representing enterprise configurations
  const PREMIUM_TEMPLATES_DATA: PremiumTemplate[] = [
    {
      id: "realestatemarketing",
      titleEn: "Real Estate Marketing Pack",
      titleBn: "রিয়েল এস্টেট মার্কেটিং প্যাক",
      titleHi: "रियल एस्टेट मार्केटिंग पैक",
      icon: Building2,
      targetTab: "campaign",
      descriptionEn: "High-conversion multi-channel strategy for luxurious apartments and commercial spaces.",
      descriptionBn: "বিলাসবহুল অ্যাপার্টমেন্ট এবং বাণিজ্যিক স্পেসের জন্য আকর্ষণীয় মাল্টি-চ্যানেল বিপণন পরিকল্পনা।",
      descriptionHi: "शानदार अपार्टमेंट और व्यावसायिक स्थानों के लिए उच्च-रूपांतरण बहु-चैनल रणनीति।",
      promptTextEn: "Develop a high-converting multi-channel marketing blueprint for a premium 3-bedroom luxury condominium in Gulshan, Dhaka. Include:\n1. A compelling narrative focus targeting high-net-worth investors\n2. 3 highly optimized social media advertising captions (Instagram & Facebook)\n3. 1 professional sales email seeking site visits.",
      promptTextBn: "গুলশানের বিলাসবহুল ৩-বেডরুম কন্ডোমিনিয়ামের বিক্রির জন্য একটি উচ্চ-রূপান্তর মার্কেটিং পরিকল্পনা তৈরি করুন। বিস্তারিত অন্তর্ভুক্ত করুন:\n১. প্রবাসীদের আকর্ষণ করার মতো অত্যন্ত আকর্ষণীয় একটি প্রচারণার টপিক\n২. ২টি ফেসবুক আবাসন বিজ্ঞাপন টেক্সট\n৩. কাস্টমারদের বুকিং করার জন্য একটি ইমেইল ড্রাফট।",
      promptTextHi: "एक आलीशान ३-बेडरूम लक्जरी अपार्टमेंट की बिक्री के लिए एक उच्च-रूपांतरण बहु-चैनल विपणन ब्लूप्रिंट विकसित करें। इसमें शामिल करें:\n1. उच्च नेटवर्थ निवेशकों को लक्षित करने वाली एक आकर्षक विज्ञापन प्रतिलिपि\n2. सोशल मीडिया विज्ञापन कैप्शन।",
      colorClass: "from-amber-500/10 to-yellow-500/5 border-amber-500/30 text-amber-400",
      shadowClass: "shadow-[0_0_15px_rgba(245,158,11,0.05)]",
    },
    {
      id: "festivalpromotion",
      titleEn: "Festival Megastore Promo Pack",
      titleBn: "উৎসব মেগাস্টোর সেলস প্যাক",
      titleHi: "उत्सव मेगास्टोर प्रोमो पैक",
      icon: Gift,
      targetTab: "adcopy",
      descriptionEn: "Frictionless promotional copy formulas to trigger panic urgency during seasonal festivals.",
      descriptionBn: "উৎসবের মরসুমে তাৎক্ষণিক বিক্রি ও মেগা অফার প্রচারণার জন্য আকর্ষণীয় কন্টেন্ট ফর্মুলা।",
      descriptionHi: "त्योहारों के मौसम में तत्काल बिक्री और भारी सीजन छूट के लिए आकर्षक विज्ञापन संदेश।",
      promptTextEn: "Write 3 distinctive seasonal festival promotional copywriting scripts for an e-commerce fast-fashion store launching a '50% Flat festive discount'. The copies must generate extreme urgency, feature clear promo code directives, and have punchy calls to action.",
      promptTextBn: "একটি ফ্যাশন ই-কমার্স মেগাস্টোরের জন্য উৎসব উপলক্ষে ৫০% ফ্ল্যাট ছাড়ের জন্য ৩টি চমৎকার বিজ্ঞাপন টেক্সট লিখুন। এর মধ্যে সিজন স্পেশাল প্রোমো কোড ব্যবহার করে কাস্টমারদের মধ্যে ক্রয়ের তাগিদ তৈরি করুন।",
      promptTextHi: "किसी ई-कॉमर्स फैशन स्टोर के लिए ५०% त्योहार छूट का विज्ञापन तैयार करें। इसमें त्योहार के सीजन का उल्लेख और सीमित समय की कूपन कॉपियां शामिल होनी चाहिए।",
      colorClass: "from-pink-500/10 to-rose-500/5 border-pink-500/30 text-pink-400",
      shadowClass: "shadow-[0_0_15px_rgba(244,63,94,0.05)]",
    },
    {
      id: "corporatebranding",
      titleEn: "Corporate Identity Campaign",
      titleBn: "কর্পোরেট আইডেন্টিটি ক্যাম্পেইন",
      titleHi: "कॉर्पोरेट पहचान अभियान",
      icon: Send,
      targetTab: "campaign",
      descriptionEn: "Comprehensive premium content strategy targeting brand expansion & venture capital pitches.",
      descriptionBn: "ব্র্যান্ড সম্প্রসারণ এবং ভেঞ্চার ক্যাপিটাল পিচিংয়ের জন্য পেশাদার ও টেকসই কর্পোরেট পরিকল্পনা।",
      descriptionHi: "ब्रांड विस्तार और उद्यम पूंजी पिचों के लिए व्यापक प्रीमियम सामग्री रणनीति।",
      promptTextEn: "Design a comprehensive corporate identity roadmap for a next-generation green logistics startup. Provide a professional brand tagline, 3 thematic core values stories for press releases, and a pitch elevator summary targeting Series-A Venture Capital investors.",
      promptTextBn: "পরবর্তী প্রজন্মের গ্রিন লজিস্টিকস স্টার্টআপের জন্য একটি পূর্ণাঙ্গ কর্পোরেট ব্র্যান্ডিং রোডম্যাপ তৈরি করুন। একটি দীর্ঘস্থায়ী স্লোগান, ৩টি ব্র্যান্ডের মূল মূল্যবোধের বিষয় এবং ভিসি বিনিয়োগকারীদের জন্য একটি আকর্ষক পিচ ডেক সামারি দিন।",
      promptTextHi: "एक नई पीढ़ी के ग्रीन लॉजिस्टिक्स स्टार्टअप के लिए ब्रांड टैगलाइन और ए-सीरीज़ वेंचर निवेशकों के लिए उपयुक्त एक संक्षिप्त लिफ्ट पिचर समरी डिज़ाइन करें।",
      colorClass: "from-cyan-500/10 to-blue-500/5 border-cyan-500/30 text-cyan-400",
      shadowClass: "shadow-[0_0_15px_rgba(6,182,212,0.05)]",
    },
    {
      id: "youtubegrowthengine",
      titleEn: "YouTube Viral Hook Pack",
      titleBn: "ইউটিউব ভাইরাল হুক ইঞ্জিন",
      titleHi: "यूट्यूब वायरल हुक पैक",
      icon: Youtube,
      targetTab: "video",
      descriptionEn: "Highly polished high-engagement opening video scripts & cinematic prompts optimized for retention.",
      descriptionBn: "ভিডিওর প্রথম ১০ সেকেন্ড কাস্টমারদের আটকে রাখার জন্য অত্যন্ত কার্যকর স্ক্রিপ্টিং এবং আকর্ষণীয় দৃশ্য প্রম্পট।",
      descriptionHi: "शुरुआती १० सेकंड के जुड़ाव और अत्यधिक वायरल प्रतिधारण के लिए निर्मित यूट्यूब वीडियो हुक योजना।",
      promptTextEn: "Generate 5 ultra-compelling YouTube video intro scripts (first 15 seconds hooks) about tech product breakdowns (e.g. AI systems, microchip revolution). Ensure high energy, intriguing starting questions, and clear visual prompts to match the audio narration.",
      promptTextBn: "টেক রিভিউ চ্যানেলের জন্য ৫টি অত্যন্ত আকর্ষণীয় ইউটিউব ভিডিওর শুরুর ১৫ সেকেন্ডের স্ক্রিপ্ট বা হুক তৈরি করুন। এর মধ্যে শব্দ এবং ফ্রেম দৃশ্যের বর্ণনার চমৎকার সমন্বয় করুন যা ভিডিও রিটেনশন বাড়ায়।",
      promptTextHi: "तकनीकी रोबोटिक्स और एआई प्रवृत्तियों पर ५ अत्यधिक वायरल होने वाले यूट्यूब वीडियो हुक डिजाइन करें। पहले १५ सेकंड में दर्शकों को रोकने वाले प्रभावशाली प्रश्न शामिल करें।",
      colorClass: "from-red-500/10 to-orange-500/5 border-red-500/30 text-red-500",
      shadowClass: "shadow-[0_0_15px_rgba(239,68,68,0.05)]",
    },
    {
      id: "emailcampaignblueprint",
      titleEn: "AI Premium Newsletter Pack",
      titleBn: "এআই প্রিমিয়াম নিউজলেটার প্যাক",
      titleHi: "ऐ प्रीमियम न्यूजलेटर पैक",
      icon: Mail,
      targetTab: "adcopy",
      descriptionEn: "Sophisticated editorial format newsletters designed to nurture premium enterprise cold leads.",
      descriptionBn: "কর্পোরেট ক্লায়েন্ট এবং কোল্ড লিডদের সাথে আজীবন সংযোগ বজায় রাখার জন্য প্রফেশনাল নিউজলেটার স্ক্রিপ্ট।",
      descriptionHi: "कॉर्पोरेट ग्राहकों और कोल्ड लीडों को आकर्षित करने के लिए प्रीमियम संपादकीय न्यूजलेटर प्रारूप।",
      promptTextEn: "Generate an editorial-style industry newsletter about the future of SaaS optimization. Include a sharp current trend breakdown, 3 action items for technical founders, and a subtle conversion invitation to sign up for our custom developer-beta sandbox tools.",
      promptTextBn: "SaaS অপ্টিমাইজেশানের ভবিষৎ নিয়ে একটি অত্যন্ত জ্ঞানগর্ভ নিউজলেটার ড্রাফট তৈরি করুন। এর মূল প্রতিপাদ্য হবে টেকনোলজি প্রবৃদ্ধি, এবং ৩টি গুরুত্বপূর্ণ কর্মক্ষম কাজের তালিকা শেয়ার করুন যা কাস্টমারকে অনুপ্রাণিত করে।",
      promptTextHi: "सास (SaaS) उत्पादकता के भविष्य पर गंभीर न्यूजलेटर तैयार करें। इसमें बाजार रुझान, ३ मुख्य सलाह और अंत में मुख्य डैशबोर्ड के परीक्षण का अनुरोध शामिल करें।",
      colorClass: "from-purple-500/10 to-indigo-500/5 border-purple-500/30 text-purple-400",
      shadowClass: "shadow-[0_0_15px_rgba(168,85,247,0.05)]",
    },
    {
      id: "seocampaignstrategy",
      titleEn: "SEO Domain Dominator Blueprint",
      titleBn: "এসইও ডোমেইন ডমিনেটর ব্লুপ্রিন্ট",
      titleHi: "एसईओ डोमेन डोमिनेटर रणनीति",
      icon: Search,
      targetTab: "campaign",
      descriptionEn: "Highly integrated keywords structures, thematic cluster blueprints, and SEO hub page setups.",
      descriptionBn: "গুগলে দ্রুত সবার আগে র‍্যাঙ্ক করার জন্য অত্যন্ত সমন্বিত কিওয়ার্ড রিসার্চের ফ্রেমওয়ার্ক এবং কনটেন্ট ক্লাস্টার প্ল্যান।",
      descriptionHi: "गूगल पर तेजी से रैंक प्राप्त करने के लिए महत्वपूर्ण कीवर्ड क्लस्टर और अनुकूलित सामग्री संरचना रणनीति।",
      promptTextEn: "Draft an SEO pillar-page structure and semantic keyword cluster strategy about 'Sustainable Smart Homes Solutions'. Generate 5 secondary keywords clusters categories, a meta description pattern, and 3 blog content outlines targeting commercial intent.",
      promptTextBn: "'পরিবেশবান্ধব স্মার্ট হোম সলিউশন' বিষয়ের জন্য প্রফেশনাল এসইও পিলার পেজ স্ট্রাকচার এবং কিওয়ার্ড ক্লাস্টার পরিকল্পনা ডিজাইন করুন। এর মাধ্যমে ৫টি সাব-টপিক এবং সার্চ ইন্টেন্ট কভার করুন।",
      promptTextHi: "'सस्टेनेबल स्मार्ट होम सॉल्यूशंस' विषय पर संपूर्ण एसईओ रणनीतिक कीवर्ड सूची और उनके ५ मुख्य उप-शीर्षकों की योजना तैयार करें।",
      colorClass: "from-emerald-500/10 to-teal-500/5 border-emerald-500/30 text-emerald-400",
      shadowClass: "shadow-[0_0_15px_rgba(16,185,129,0.05)]",
    },
    {
      id: "luxuryproductadpack",
      titleEn: "Luxury Aesthetic Branding Key",
      titleBn: "লাক্সারি নান্দনিক ব্র্যান্ডিং কি",
      titleHi: "लक्जरी सौंदर्य ब्रांडिंग पैक",
      icon: Gem,
      targetTab: "adcopy",
      descriptionEn: "Elite, high-status emotional copywriting tailored exclusively for high-ticket luxury physical goods.",
      descriptionBn: "অভিজাত এবং প্রিমিয়াম ফিজিক্যাল প্রডাক্টের জন্য অত্যন্ত নিখুঁত ও মর্যাদাপূর্ণ ব্র্যান্ডিং কপি রাইটিং।",
      descriptionHi: "अभिजात और अत्यंत प्रीमियम भौतिक उत्पादों के लिए परिष्कृत ब्रांडिंग कॉपी राइटिंग फॉर्मूले।",
      promptTextEn: "Write 3 artistic premium social media advertising copy scripts for a handcrafted automatic Swiss tourbillon luxury watch. Focus on historical pedigree, exceptional micro-craftsmanship, and the subtle emotional weight of luxury, avoiding any cheap discount tags.",
      promptTextBn: "হাতে তৈরি অটোমেটিক সুইজারল্যান্ড লাক্সারি ঘড়ির ব্রান্ডিংয়ের জন্য ৩টি অত্যন্ত নান্দনিক সোশ্যাল মিডিয়া অ্যাড কপি স্ক্রিপ্ট লিখুন। এতে মাইক্রো ক্রাফট্সম্যানশিপ এবং ঐতিহ্য ফুটিয়ে তুলুন।",
      promptTextHi: "हाथ से बनी ऑटोमैटिक स्विस घड़ी के लिए ३ शानदार विज्ञापन कहानियां लिखें। उत्पाद की उच्च गुणवत्ता और उसकी ऐतिहासिक विशिष्टता का वर्णन करें।",
      colorClass: "from-violet-500/10 to-fuchsia-500/5 border-violet-500/30 text-violet-400",
      shadowClass: "shadow-[0_0_15px_rgba(139,92,246,0.05)]",
    }
  ];

  const handleApplyTemplate = (template: PremiumTemplate) => {
    if (!premiumUnlocked) {
      triggerToast("Enterprise Pro Access Required. Click Upgrade to activate!");
      return;
    }

    setSelectedTemplateId(template.id);
    setTimeout(() => setSelectedTemplateId(null), 1000);

    const promptText = isEn 
      ? template.promptTextEn 
      : template.titleBn ? template.promptTextBn : template.promptTextEn;
      
    // Callback to load into SaasTool workspace
    onSelectTemplate(promptText, template.targetTab);
    
    // Smooth scroll back to sandbox console
    const playground = document.getElementById("tool-tabs") || document.getElementById("playground-input");
    if (playground) {
      playground.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    triggerToast(isEn ? `Loaded ${template.titleEn} Template!` : `${template.titleEn} টেমপ্লেট লোড করা হয়েছে!`);
  };

  return (
    <div className="bg-[#121420]/85 backdrop-blur-md rounded-2xl border border-gray-800/80 p-5 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden text-left" id="pcs-premium-template-system">
      
      {/* Dynamic Simulation notification bubble */}
      {notification && (
        <div className="absolute top-4 right-4 z-50 bg-[#06070a] border border-amber-500/40 text-amber-300 font-mono text-[9px] uppercase font-bold py-2 px-4 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.25)] animate-pulse">
          ✦ {notification}
        </div>
      )}

      {/* Cyber Glow Ornaments */}
      <div className="absolute top-0 left-1/3 w-36 h-36 bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 right-12 w-32 h-32 bg-cyan-500/[0.03] rounded-full blur-2xl pointer-events-none" />

      {/* Primary Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-900 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-lg border border-amber-500/25 text-amber-400">
              <Gem className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              Premium Corporate Templates
              <span className="bg-amber-500/15 text-[8.5px] font-mono text-amber-400 px-1.5 py-0.2 rounded font-extrabold animate-pulse">PRO</span>
            </span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight mt-1">
            Enterprise Launch Campaign BLUEPRINTS
          </h3>
        </div>

        {/* Technical telemetry status texts mandated by prompt rules */}
        <div className="flex flex-wrap gap-2 select-none">
          <span className="inline-flex items-center gap-1 text-[8px] font-mono font-bold text-amber-400 bg-amber-950/20 border border-amber-850/45 px-2.5 py-1 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.05)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Premium Template Engine Active
          </span>
          <span className="inline-flex items-center gap-1 text-[8px] font-mono font-bold text-cyan-400 bg-cyan-950/20 border border-cyan-850/45 px-2.5 py-1 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.05)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Hybrid SaaS Access Layer Enabled
          </span>
          <span className="inline-flex items-center gap-1 text-[8px] font-mono font-bold text-emerald-400 bg-emerald-950/10 border border-emerald-850/45 px-2.5 py-1 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.05)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Quota Safe Template System Running
          </span>
        </div>
      </div>

      {/* Info Warning and Interactive Subscription Simulator Tool */}
      <div className="bg-[#181a2b]/40 backdrop-blur-md rounded-xl border border-amber-500/10 p-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex gap-2.5 items-start">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[11px] text-gray-400 leading-normal">
            <span className="text-amber-400 font-bold block uppercase tracking-wider text-[10px] mb-0.5">
              {premiumUnlocked ? "🎉 ENTERPRISE LEVEL UNLOCKED" : "🔐 SUBSCRIPTION RESTRICTED MODULE"}
            </span>
            {premiumUnlocked 
              ? (isEn ? "Premium access levels are currently active. Click any blueprint template catalog card below to instantly populate corporate sandbox configurations." : "প্রিমিয়াম অ্যাক্সেস সক্রিয় রয়েছে। নিচে যেকোনো বিবরণ বা টেমপ্লেট ক্লিক করে সরাসরি এটি মেইন বক্সে লোড করতে পারবেন।")
              : (isEn ? "Premium blueprints are locked for pro workspace directories. Review our templates in the high fidelity catalog below, or click upgrade below to unlock access." : "প্রিমিয়াম ব্লুপ্রিন্টগুলো বর্তমানে সাবস্ক্রাইবারদের জন্য লক করা রয়েছে। কুপন বা প্রো ড্যাশবোর্ড থেকে আপগ্রেড করুন।")}
          </div>
        </div>

        {/* Simulator button & Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleSimulation}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
              premiumUnlocked
                ? "bg-amber-500/10 border-amber-400/40 text-amber-400 hover:bg-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                : "bg-cyan-500/10 border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
            }`}
          >
            {premiumUnlocked ? "⚡ Lock Plan (Simulate Free)" : "⚡ Unlock Plan (Simulate Pro)"}
          </button>
        </div>
      </div>

      {/* Grid containing Premium Template cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PREMIUM_TEMPLATES_DATA.map((template) => {
          const IconComponent = template.icon;
          const isSelected = selectedTemplateId === template.id;
          
          return (
            <div
              key={template.id}
              onClick={() => handleApplyTemplate(template)}
              className={`bg-[#07080f]/90 rounded-2xl border transition-all duration-500 p-4.5 relative group flex flex-col justify-between overflow-hidden cursor-pointer ${template.colorClass} ${template.shadowClass} ${
                !premiumUnlocked 
                  ? "hover:border-gray-800" 
                  : "hover:scale-[1.01] hover:border-amber-400/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
              } ${isSelected ? "scale-[0.98] border-amber-400" : ""}`}
            >
              {/* Decorative inner pattern overlay for unlocked look */}
              {premiumUnlocked && (
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-white/[0.02] to-transparent pointer-events-none" />
              )}

              {/* Header inside the card */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-gray-900/60">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-black/40 rounded-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </span>
                    <h4 className="text-[11.5px] sm:text-xs font-bold text-white tracking-tight leading-snug">
                      {isEn ? template.titleEn : template.titleBn}
                    </h4>
                  </div>

                  {/* Lock Indicator */}
                  {premiumUnlocked ? (
                    <span className="p-1 bg-emerald-500/10 border border-emerald-500/25 rounded-md text-emerald-400" title="Unlocked & Active">
                      <Unlock className="w-3 h-3 text-emerald-400" />
                    </span>
                  ) : (
                    <span className="p-1 bg-amber-500/10 border border-amber-500/25 rounded-md text-amber-400 animate-pulse" title="Locked - Pro Subscription Required">
                      <Lock className="w-3 h-3 text-amber-400" />
                    </span>
                  )}
                </div>

                {/* Body Details with secure blurring on locked card */}
                <div className={`transition-all duration-500 ${!premiumUnlocked ? "blur-[0.5px] opacity-75 select-none" : ""}`}>
                  <p className="text-[10.5px] text-gray-400 leading-relaxed font-sans min-h-[44px]">
                    {isEn ? template.descriptionEn : template.descriptionBn}
                  </p>
                  
                  {/* Embedded code telemetry preview tag */}
                  <div className="mt-3.5 bg-black/40 p-2 rounded-lg border border-gray-900/40 text-[9.5px] font-mono text-gray-500 flex items-center justify-between">
                    <span>Target Module:</span>
                    <span className="text-cyan-400 uppercase font-black">{template.targetTab} Console</span>
                  </div>
                </div>
              </div>

              {/* Click interactive Footer Block based on state */}
              <div className="mt-4 pt-3 border-t border-gray-950 flex items-center justify-between text-[10px] font-mono">
                {premiumUnlocked ? (
                  <>
                    <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      Ready to Use
                    </span>
                    <span className="text-cyan-300 group-hover:text-amber-300 font-bold uppercase flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Use Now <ArrowUpRight className="w-3 h-3 inline" />
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-amber-400 font-extrabold uppercase animate-pulse">
                      Upgrade Required
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenDashboard) {
                          onOpenDashboard();
                        } else {
                          triggerToast("Opening Subscriptions Portal...");
                        }
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-bold uppercase underline"
                    >
                      Unlock Now
                    </button>
                  </>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* FOOTER-BELOW CARD: Lightweight Upgrade Flow promotion bar */}
      {!premiumUnlocked && (
        <div className="mt-7 p-4 bg-gradient-to-r from-amber-500/5 via-cyan-500/3 to-purple-500/5 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left transition-all hover:border-amber-500/40">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              🚀 Upgrade To Unlock Premium Templates
            </h4>
            <p className="text-[10px] text-gray-400 mt-1">
              Gain unlimited high-speed sandbox runs, fully customizable launch blueprints, and priority servers with zero API count limit constraints.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onOpenDashboard) {
                onOpenDashboard();
              } else {
                triggerToast("Routing to enterprise setup portal...");
              }
            }}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-mono font-black text-xs uppercase rounded-lg tracking-wider transition-all duration-300 cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:scale-105"
            id="premium-system-upgrade-footer-btn"
          >
            Upgrade Plan
          </button>
        </div>
      )}

    </div>
  );
}
