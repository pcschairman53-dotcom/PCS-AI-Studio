import React from "react";
import { 
  Sparkles, Shield, Zap, RefreshCw, Languages, Frame, LayoutGrid, CheckSquare 
} from "lucide-react";
import { Language } from "../types";

interface FeaturesProps {
  language: Language;
}

export default function Features({ language }: FeaturesProps) {
  const isEn = language === "english";

  const featureItems = [
    {
      icon: <Languages className="w-6 h-6 text-emerald-400" />,
      titleEn: "Bilingual Intelligence Engine",
      titleBn: "দ্বি-ভাষিক বুদ্ধিমত্তা ইঞ্জিন",
      descEn: "Designed natively from the ground up to understand Bengali context, cultural nuances, and idioms, alongside premium standard English.",
      descBn: "বাংলা কনটেক্সট, সামাজিক অভিব্যক্তি এবং প্রবাদের গভীর বিশ্লেষণ সহ আন্তর্জাতিক মানের ইংরেজি কন্টেন্ট জেনারেট করার জন্য ডেভেলপড।"
    },
    {
      icon: <Frame className="w-6 h-6 text-cyan-400" />,
      titleEn: "Sora & Midjourney Ready",
      titleBn: "সোরো ও মিডজার্নি রেডি",
      descEn: "Don't just write templates. Generate highly engineered technical prompt syntax explaining camera depth, art styles, framing, and lightning parameters.",
      descBn: "সাধারণ বর্ণনার বাইরে গিয়ে ক্যামেরা ডেপ্থ, আর্ট স্টাইল, লাইটিং এবং ফ্রেম ডিরেকশনের মতো গভীর টেকনিক্যাল প্রম্পট স্ট্রাকচার জেনারেট করে।"
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-400" />,
      titleEn: "Conversion Optimization Frameworks",
      titleBn: "কনভার্সন অপ্টিমাইজড ফ্রেমওয়ার্ক",
      descEn: "Your ad copies are structured using battle-tested frameworks like AIDA and PAS to maximize click-through rates and customer acquisition.",
      descBn: "ক্রেতার মনোযোগ আকর্ষণ এবং ক্লিক-থ্রু রেট বাড়ানোর জন্য অভিজ্ঞ মার্কেটারদের ব্যবহৃত AIDA এবং PAS মডেলের আদলে অ্যাড কপি জেনারেট করা হয়।"
    },
    {
      icon: <LayoutGrid className="w-6 h-6 text-cyan-400" />,
      titleEn: "Enterprise Cloud Node Core",
      titleBn: "এন্টারপ্রাইজ ক্লাউড নোড কোর",
      descEn: "Get lightning-quick responses served directly via serverless nodes. Zero browser key leakage, secure processing, and persistent local caching blocks.",
      descBn: "সার্ভারলেস সিস্টেমে বিদ্যুৎ গতিতে সরাসরি আউটপুট জেনারেশন। ব্রাউজারের গোপনীয়তা রক্ষা এবং সেভড হিস্টরি ট্র্যাকিং ফিচার।"
    }
  ];

  return (
    <section id="features" className="py-24 bg-[#090a0f] border-t border-gray-900/40 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.03),transparent_40%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Features Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase">
            {isEn ? "Corporate Capabilities" : "কর্পোরেট সক্ষমতা"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-2 mb-4">
            {isEn ? "Built for Digital Growth & Creativity" : "ডিজিটাল প্রবৃদ্ধি ও সৃজনশীলতার জন্য তৈরি"}
          </h2>
          <p className="text-gray-400">
            {isEn 
              ? "Discover how PCS AI Studio delivers enterprise-grade text generation and prompt design with bilingual optimization."
              : "জেনে নিন কীভাবে পিসিএস এআই স্টুডিও ডিজিটাল মার্কেটিং এবং ফ্রিল্যান্সিংয়ে আপনার প্রোডাক্টিভিটি ১০ গুণ পর্যন্ত বাড়িয়ে দিতে পারে।"}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="features-cards-grid">
          {featureItems.map((item, idx) => (
            <div 
              key={idx}
              className="bg-[#121420]/45 p-8 rounded-2xl border border-gray-800/80 hover:border-gray-700/80 transition-all duration-300 hover:translate-y-[-4px] relative overflow-hidden group shadow-md"
            >
              {/* Subtle glass effect highlight */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#090a0f]/80 border border-gray-800 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {isEn ? item.titleEn : item.titleBn}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {isEn ? item.descEn : item.descBn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brand stats under section */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center border-t border-gray-900 pt-10">
          <div>
            <div className="text-2xl sm:text-3.5xl font-display font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              99.8%
            </div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-gray-500 mt-1">
              {isEn ? "Linguistic Accuracy" : "ভাষা নির্ভুলতা"}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3.5xl font-display font-bold bg-gradient-to-r from-cyan-400 to-emerald-300 bg-clip-text text-transparent">
              &lt; 1.8s
            </div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-gray-500 mt-1">
              {isEn ? "Average Latency" : "গড় প্রসেসিং সময়"}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3.5xl font-display font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
              AIDA / PAS
            </div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-gray-500 mt-1">
              {isEn ? "Conversion Engines" : "মার্কেটিং মডেল সাপোর্ট"}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3.5xl font-display font-bold bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">
              100% Secure
            </div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-gray-500 mt-1">
              {isEn ? "Server Key Hiding" : "সার্ভার কি নিরাময়"}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
