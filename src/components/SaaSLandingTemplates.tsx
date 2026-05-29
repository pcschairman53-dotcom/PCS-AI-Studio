import React, { useState, useEffect, useCallback, useMemo } from "react";
import { LayoutTemplate, Lock, Star, Eye, MonitorSmartphone, Edit3, Save } from "lucide-react";

interface SaaSLandingTemplatesProps {
  language: string;
}

export default function SaaSLandingTemplates({ language }: SaaSLandingTemplatesProps) {
  const isEn = language === "english";
  const [activePlan, setActivePlan] = useState<string>("starter");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCta, setEditCta] = useState("");
  
  const [isEditorActive, setIsEditorActive] = useState(false);

  useEffect(() => {
    try {
      const plan = localStorage.getItem("activePlan") || "starter";
      setActivePlan(plan);
      const lastUsed = localStorage.getItem("lastUsedLandingTemplate");
      if (lastUsed) {
        const found = templates.find(t => t.id === lastUsed);
        if (found) {
          handleSelectTemplate(found.id, found.isPremium, found.title, found.desc, found.cta);
        }
      }
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const templates = useMemo(() => [
    {
      id: "ai-agency",
      title: "AI Agency Landing Page",
      desc: "Highlight AI automation services with high-tech glassmorphism.",
      cta: "Schedule AI Demo",
      isPremium: false,
      color: "from-cyan-500/20 to-blue-500/20",
      border: "border-cyan-500/30",
      text: "text-cyan-400"
    },
    {
      id: "saas-product",
      title: "SaaS Product Landing Page",
      desc: "Convert visitors with clear pricing and feature breakdowns.",
      cta: "Start Free Trial",
      isPremium: true,
      color: "from-emerald-500/20 to-teal-500/20",
      border: "border-emerald-500/30",
      text: "text-emerald-400"
    },
    {
      id: "real-estate",
      title: "Real Estate Landing Page",
      desc: "Showcase premium property listings to rich buyers.",
      cta: "View Properties",
      isPremium: true,
      color: "from-amber-500/20 to-orange-500/20",
      border: "border-amber-500/30",
      text: "text-amber-400"
    },
    {
      id: "digital-marketing",
      title: "Digital Marketing Landing Page",
      desc: "Collect high-ticket leads for marketing agencies.",
      cta: "Get Free Audit",
      isPremium: false,
      color: "from-pink-500/20 to-rose-500/20",
      border: "border-pink-500/30",
      text: "text-pink-400"
    },
    {
      id: "festival-offer",
      title: "Festival Offer Landing Page",
      desc: "Urgency-driven holiday sales and flash promotions.",
      cta: "Claim 50% Off",
      isPremium: false,
      color: "from-purple-500/20 to-fuchsia-500/20",
      border: "border-purple-500/30",
      text: "text-purple-400"
    },
    {
      id: "restaurant",
      title: "Restaurant Promotion Page",
      desc: "Mouth-watering menu showcases and table reservations.",
      cta: "Book a Table",
      isPremium: true,
      color: "from-red-500/20 to-orange-500/20",
      border: "border-red-500/30",
      text: "text-red-400"
    },
    {
      id: "gym-fitness",
      title: "Gym/Fitness Promotion Page",
      desc: "High-energy workout programs and membership signups.",
      cta: "Join the Club",
      isPremium: true,
      color: "from-indigo-500/20 to-blue-500/20",
      border: "border-indigo-500/30",
      text: "text-indigo-400"
    }
  ], []);

  const handleSelectTemplate = useCallback((id: string, isPremium: boolean, title: string, desc: string, cta: string) => {
    setSelectedTemplate(id);
    setEditTitle(title);
    setEditDescription(desc);
    setEditCta(cta);
    setIsEditorActive(false);
    try {
      localStorage.setItem("lastUsedLandingTemplate", id);
    } catch (e) {}
  }, []);

  const toggleEditor = useCallback(() => {
    setIsEditorActive(prev => !prev);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-900 pb-5">
        <div>
          <span className="text-[10px] font-mono uppercase text-[#06b6d4] tracking-widest font-bold">
            UI / UX Generation Module
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            {isEn ? "Landing Page Templates" : "ল্যান্ডিং পেজ টেমপ্লেট"}
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            {isEn ? "High-converting readymade layouts for your next campaign." : "উচ্চ রূপান্তরকারী রেডিমেড লেআউট।"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 select-none font-mono text-[8px] font-bold">
        <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-950/20 border border-emerald-850/45 px-2.5 py-1 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.05)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Interactive Template Engine Active
        </span>
        <span className="inline-flex items-center gap-1.5 text-cyan-400 bg-cyan-950/20 border border-cyan-850/45 px-2.5 py-1 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.05)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Quota Safe Local Template Editor Enabled
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Templates List */}
        <div className="lg:col-span-4 space-y-3">
          {templates.map((tpl) => {
            const isLocked = tpl.isPremium && activePlan !== "creator" && activePlan !== "marketing" && activePlan !== "business";
            const isSelected = selectedTemplate === tpl.id;
            
            return (
              <div 
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl.id, tpl.isPremium, tpl.title, tpl.desc, tpl.cta)}
                className={`p-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? `bg-gradient-to-r ${tpl.color} ${tpl.border} shadow-[0_0_15px_rgba(0,0,0,0.2)] scale-[1.02]`
                    : isLocked 
                      ? "bg-[#0c0c10] border-gray-800/50 hover:bg-[#12131a] opacity-90" 
                      : "bg-[#090a0f] border-gray-800 hover:border-gray-600 hover:bg-[#121420]"
                }`}
              >
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-black/40 border border-gray-800 ${tpl.text} shrink-0`}>
                      <LayoutTemplate className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-[13px] ${isSelected ? 'text-white' : 'text-gray-200'} flex items-center gap-1.5`}>
                        {tpl.title}
                        {tpl.isPremium && <Star className="w-3 h-3 text-amber-400" />}
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{tpl.desc}</p>
                    </div>
                  </div>
                  {isLocked && (
                    <div className="bg-gray-900/80 p-1.5 rounded border border-gray-800 text-gray-500 shrink-0">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Preview & Editor Panel */}
        <div className="lg:col-span-8">
          {selectedTemplate ? (
            <div className="bg-[#0c0d16] border border-gray-800/80 rounded-2xl overflow-hidden shadow-2xl relative sticky top-6">
              
              <div className="p-3.5 border-b border-gray-900/80 bg-[#090a0f] flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-300 font-mono">
                  <MonitorSmartphone className="w-4 h-4 text-cyan-400" />
                  {isEditorActive ? "Interactive Editor Mode" : "Wireframe Preview"}
                </div>
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
              </div>

              <div className="p-6 md:p-10 bg-gradient-to-br from-[#121420] to-[#090a0f] min-h-[450px] flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />
                
                {/* Editor Fields & Wireframe */}
                <div className="relative z-10 w-full max-w-lg space-y-6">
                  {isEditorActive ? (
                    <>
                      <div>
                        <label className="block text-left text-[9px] font-mono text-cyan-500 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Edit3 className="w-3 h-3"/> {isEn ? "Hero Headline" : "হিরো হেডলাইন"}</label>
                        <input 
                          type="text" 
                          value={editTitle} 
                          onChange={e => setEditTitle(e.target.value)}
                          className="w-full bg-black/40 border border-cyan-500/30 rounded-xl text-2xl md:text-4xl font-extrabold text-white text-center focus:outline-none focus:border-cyan-400 transition-colors py-3 px-4 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                        />
                      </div>

                      <div>
                        <label className="block text-left text-[9px] font-mono text-cyan-500 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Edit3 className="w-3 h-3"/> {isEn ? "Business Description" : "কোম্পানির বিবরণ"}</label>
                        <textarea 
                          value={editDescription} 
                          onChange={e => setEditDescription(e.target.value)}
                          rows={3}
                          className="w-full bg-black/40 border border-cyan-500/30 rounded-xl text-sm text-gray-300 text-center focus:outline-none focus:border-cyan-400 transition-colors p-4 resize-none shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                        />
                      </div>

                      <div className="pt-4">
                        <label className="block text-left text-[9px] font-mono text-cyan-500 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Edit3 className="w-3 h-3"/> {isEn ? "Call To Action Button" : "অ্যাকশন বাটন"}</label>
                        <div className="flex justify-center">
                          <input 
                            type="text" 
                            value={editCta} 
                            onChange={e => setEditCta(e.target.value)}
                            className="bg-cyan-500/10 border border-cyan-400 text-cyan-400 font-bold px-6 py-3 rounded-full text-sm text-center outline-none focus:bg-cyan-500/20 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.2)] w-auto min-w-[200px]"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h1 className="text-2xl md:text-4xl font-extrabold text-white py-2">
                          {editTitle || "Your Headline Here"}
                        </h1>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 p-3 leading-relaxed">
                          {editDescription || "Provide an engaging description of your business to attract your target audience and capture leads effectively."}
                        </p>
                      </div>
                      <div className="pt-4 flex justify-center">
                        <button className="bg-cyan-500 text-black font-bold px-8 py-3.5 rounded-full text-sm hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                          {editCta || "Click Here"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 bg-[#090a0f] border-t border-gray-900 flex justify-between items-center gap-3">
                <div className="flex items-center">
                  {isEditorActive && (
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Live Editing Active
                    </span>
                  )}
                </div>
                
                {(() => {
                  const currentTpl = templates.find(t => t.id === selectedTemplate);
                  const isLocked = currentTpl?.isPremium && activePlan !== "creator" && activePlan !== "marketing" && activePlan !== "business";
                  return (
                    <button 
                      onClick={() => {
                        if (!isLocked) toggleEditor();
                      }}
                      className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
                        isLocked 
                          ? "bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700" 
                          : isEditorActive
                            ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                            : "bg-white text-black hover:bg-gray-200"
                      }`}
                    >
                      {isLocked ? <Lock className="w-4 h-4" /> : isEditorActive ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      {isLocked 
                        ? (isEn ? "Unlock to Use" : "ব্যবহার করতে আনলক করুন") 
                        : isEditorActive 
                          ? (isEn ? "Save & Close Editor" : "সেভ করুন") 
                          : (isEn ? "Use Template" : "টেমপ্লেট ব্যবহার করুন")}
                    </button>
                  );
                })()}
              </div>

            </div>
          ) : (
            <div className="bg-[#0c0d16] border border-gray-800/80 rounded-2xl h-full min-h-[450px] flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-gray-900/50 flex items-center justify-center mb-4 border border-gray-800 text-gray-500">
                <Eye className="w-6 h-6" />
              </div>
              <p className="text-gray-400 text-sm max-w-xs">{isEn ? "Select a template from the left to preview and customize." : "প্রিভিউ দেখতে বাম দিক থেকে একটি টেমপ্লেট নির্বাচন করুন।"}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
