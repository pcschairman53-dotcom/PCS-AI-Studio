import React from "react";
import { Sparkles, ArrowRight, Stars, CheckCircle, Video, Image, PenTool, LayoutGrid } from "lucide-react";
import { motion } from "motion/react";
import { Language } from "../types";

interface HeroProps {
  language: Language;
  onExplore: () => void;
}

export default function Hero({ language, onExplore }: HeroProps) {
  const isEn = language === "english";

  const features = isEn 
    ? ["Bengali-Optimized NLU Engine", "Imagen and Veo-Ready Templates", "Conversion Copy Frameworks", "Production-Ready Outputs"]
    : ["বাংলা-অপ্টিমাইজড এনএলইউ ইঞ্জিন", "ইমেজেন এবং ভিও-রেডি টেমপ্লেটস", "কনভার্সন কপি ফ্রেমওয়ার্ক", "প্রোডাকশন-রেডি আউটপুটস"];

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Matrix Grid and ambient blurs */}
      <div className="absolute inset-0 bg-[#090a0f] z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        {/* Glowing gradient blobs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[100px] animate-pulse delay-700" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center z-10 flex flex-col items-center">
        {/* Pill Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(16,185,129,0.05)] cursor-pointer hover:border-emerald-500/50 transition-colors"
          id="hero-tag"
        >
          <Stars className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
            {isEn ? "SaaS Landing Page & Playground" : "স্যাস ল্যান্ডিং পেজ ও প্লেগ্রাউন্ড"}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]"
          id="hero-title"
        >
          {isEn ? (
            <>
              Next-Gen <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">AI Tools</span> <br className="hidden sm:inline" /> 
              for Specialized Content Creation
            </>
          ) : (
            <>
              বিশেষায়িত কন্টেন্ট তৈরির জন্য <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">নেক্সট-জেন এআই</span> স্টুডিও
            </>
          )}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mb-10 leading-relaxed font-sans"
          id="hero-subtitle"
        >
          {isEn 
            ? "Supercharge your workflow with custom LLM generators optimized for Bengali/English content. Design viral social captions, Midjourney and Imagen poster prompts, Sora video outlines, and high-converting ad copy instantly."
            : "আমাদের অ্যাডভান্সড এআই জেনারেটর দিয়ে মাত্র কয়েক সেকেন্ডে ভাইরাল ইংরেজি বা বাংলা ক্যাপশন, মিডজার্নি বা ইমেজেনের জন্য চমৎকার পোস্টার প্রম্পট, ভিও বা সোরার জন্য হাই-কোয়ালিটি ভিডিও প্রম্পট এবং সেলস-ড্রাইভেন অ্যাড কপি তৈরি করুন।"}
        </motion.p>

        {/* Dynamic Glowing Call-to-Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12 w-full max-w-md sm:max-w-none px-4"
        >
          <button
            onClick={onExplore}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-[#090a0f] bg-emerald-400 hover:bg-emerald-300 transition-all duration-300 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] glow-button cursor-pointer font-sans"
            id="hero-primary-btn"
          >
            <Sparkles className="w-4 h-4" />
            {isEn ? "Open Interactive Playground" : "টুল প্লেগ্রাউন্ডে যান"}
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
          
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold text-gray-300 hover:text-white bg-[#121420]/80 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer font-sans"
            id="hero-secondary-btn"
          >
            {isEn ? "Explore Features" : "ফিচারগুলো দেখুন"}
          </a>
        </motion.div>

        {/* Feature Checkmarks or Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto w-full pt-8 border-t border-gray-900"
          id="hero-badges-container"
        >
          {features.map((feat, idx) => (
            <div key={idx} className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-400 bg-gray-950/45 p-3 rounded-xl border border-gray-900/60 transition-all hover:border-gray-800 hover:bg-gray-950/80">
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="font-medium text-left">{feat}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
