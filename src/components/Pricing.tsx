import React from "react";
import { Check, Sparkles, Zap, ShieldAlert } from "lucide-react";
import { Language } from "../types";

interface PricingProps {
  language: Language;
  onExplore: () => void;
}

export default function Pricing({ language, onExplore }: PricingProps) {
  const isEn = language === "english";

  const plans = [
    {
      nameEn: "Starter Slate",
      nameBn: "স্টার্টার স্লেট",
      priceEn: "$0",
      priceBn: "৳০",
      periodEn: "Free / Month",
      periodBn: "ফ্রি / চিরকাল",
      taglineEn: "Basic access for individual creators.",
      taglineBn: "নতুনদের ট্রায়াল বা ব্যক্তিগত ব্যবহারের জন্য উপযুক্ত।",
      featuresEn: [
        "15 Free generations per month",
        "Standard English & Bengali parser",
        "Direct result copying and fine-tuning",
        "Saved history storage blocks"
      ],
      featuresBn: [
        "প্রতি মাসে ১৫টি ফ্রি জেনারেশন সুবিধা",
        "সাধারণ ইংরেজি ও বাংলা জেনারেটর এক্সেস",
        "রিজাল্ট কপি এবং রি-রাইটিং সুবিধা",
        "লোকাল হিস্টরি ক্যাশিং লেআউট"
      ],
      buttonTextEn: "Test Drive Free",
      buttonTextBn: "ফ্রি টেস্ট করুন",
      highlighted: false
    },
    {
      nameEn: "Creator Pro Node",
      nameBn: "ক্রিয়েটর প্রো নোড",
      priceEn: "$29",
      priceBn: "৳৩,২৯৯",
      periodEn: "Month / Account",
      periodBn: "মাসিক / অ্যাকাউন্ট",
      taglineEn: "Unlock full speed and infinite generations.",
      taglineBn: "পেশাদার ডিজাইনার ও মার্কেটারদের প্রফেশনাল চয়েস।",
      featuresEn: [
        "Unlimited generation cycles",
        "Fastest server response speeds (Priority Node)",
        "Premium platforms (LinkedIn & Social filters unlocked)",
        "Advanced midjourney lighting controls",
        "Veo and Sora Motion storyboard systems"
      ],
      featuresBn: [
        "আনলিমিটেড জেনারেশন চক্র",
        "উচ্চ গতির প্রায়োরিটি নোড এক্সেস",
        "প্রিমিয়াম সোশ্যাল প্ল্যাটফর্ম ডেডিকেটেড ফিল্টার",
        "অ্যাডভান্সড মিডজার্নি লাইটিং কন্ট্রোল প্রম্পট",
        "ভিও এবং সোরার মোশন স্টোরিবোর্ড সিস্টেম"
      ],
      buttonTextEn: "Go Pro Creator",
      buttonTextBn: "ক্রিয়েটর প্রো গ্রহণ করুন",
      highlighted: true
    },
    {
      nameEn: "Enterprise Cloud",
      nameBn: "এন্টারপ্রাইজ ক্লাউড",
      priceEn: "Custom",
      priceBn: "যোগাযোগ করুন",
      periodEn: "Yearly Agreement",
      periodBn: "বার্ষিক চুক্তি অনুযায়ী",
      taglineEn: "Designed for content scale and API bridges.",
      taglineBn: "টিম ওয়ার্ক এবং এপিআই ব্রিজ ইন্টিগ্রেশনের জন্য তৈরি।",
      featuresEn: [
        "Unlimited cloud nodes & sub-teams",
        "Custom programmatic API integration access",
        "Custom brand tone voice tuning controls",
        "Priority dedicated account support & SLA",
        "Secure local dedicated keys storage"
      ],
      featuresBn: [
        "আনলিমিটেড ক্লাউড নোড এবং সাব-টিম সুবিধা",
        "কাস্টম প্রোগ্রাম্যাটিক এপিআই ইন্টিগ্রেশন সুবিধা",
        "কাস্টম ব্র্যান্ড টোন ও ভয়েস টিউনিং সিস্টেম",
        "২৪/৭ ডেডিকেটেড অ্যাকাউন্ট সাপোর্ট এবং এসএলএ",
        "সম্পূর্ণ নিরাপদ ব্যক্তিগত সিক্রেট ক্লাউড"
      ],
      buttonTextEn: "Contact Enterprise",
      buttonTextBn: "কর্পোরেট যোগাযোগ করুন",
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-[#090a0f] border-t border-gray-900/40 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full filter blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Pricing Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-xs font-mono tracking-widest text-[#06b6d4] uppercase">
            {isEn ? "Pricing Architecture" : "মূল্য তালিকা কাঠামো"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-2 mb-4">
            {isEn ? "SaaS Plans Designed for Content Growth" : "সরাসরি ও সহজ কর্পোরেট প্ল্যান"}
          </h2>
          <p className="text-gray-400">
            {isEn 
              ? "Choose the ideal creative scale for your operations. Instantly test-drive basic generations or scale up into full team capacity."
              : "আপনার জন্য সেরা প্ল্যানটি বেছে নিন। কোনো লুকানো চার্জ ছাড়া নিশ্চিন্তে ব্যবহার শুরু করুন এবং যেকোনো সময় আপগ্রেড করুন।"}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch" id="pricing-cards-container">
          {plans.map((p, idx) => (
            <div 
              key={idx}
              className={`bg-[#121420]/75 backdrop-blur-md rounded-2xl border flex flex-col justify-between p-8 transition-all duration-300 relative ${
                p.highlighted 
                  ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] md:scale-[1.03]" 
                  : "border-gray-800/80 hover:border-gray-700/80"
              }`}
            >
              {p.highlighted && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-emerald-400 text-black text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  {isEn ? "Most Popular" : "জনপ্রিয় চয়েস"}
                </div>
              )}

              <div>
                {/* Title */}
                <h3 className="text-xl font-display font-bold text-white mb-2.5">
                  {isEn ? p.nameEn : p.nameBn}
                </h3>
                <p className="text-xs text-gray-400 min-h-[35px] leading-relaxed mb-6">
                  {isEn ? p.taglineEn : p.taglineBn}
                </p>

                {/* Pricing / rate */}
                <div className="flex items-baseline gap-2 mb-8 border-b border-gray-900 pb-6">
                  <span className="text-4xl sm:text-5xl font-display font-extrabold text-white">
                    {isEn ? p.priceEn : p.priceBn}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    / {isEn ? p.periodEn : p.periodBn}
                  </span>
                </div>

                {/* Bullet details */}
                <ul className="space-y-4 mb-10 text-xs sm:text-sm text-gray-300" id={`pricing-bullets-${idx}`}>
                  {(isEn ? p.featuresEn : p.featuresBn).map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${p.highlighted ? "text-emerald-400" : "text-cyan-400"}`} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={onExplore}
                className={`w-full py-3.5 px-4 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer text-center ${
                  p.highlighted
                    ? "bg-emerald-400 hover:bg-emerald-300 text-[#090a0f] shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-[1.01]"
                    : "bg-[#090a0f] border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white"
                }`}
                id={`btn-pricing-plan-${idx}`}
              >
                {isEn ? p.buttonTextEn : p.buttonTextBn}
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
