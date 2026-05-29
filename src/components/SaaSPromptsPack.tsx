import React, { useState, useMemo, useCallback } from "react";
import { 
  Sparkles, Shield, Download, Copy, Check, Star, 
  FolderLock, Search, Flame, Eye, Film, Image as ImageIcon, 
  MonitorSmartphone, Play, Megaphone, Mail, FileText, BookmarkPlus
} from "lucide-react";

interface VaultPrompt {
  id: string;
  title: string;
  promptText: string;
  category: string;
  timestamp: string;
}

interface SaaSPromptsPackProps {
  language: string;
  vaultPrompts: VaultPrompt[];
  setVaultPrompts: (prompts: VaultPrompt[]) => void;
  savePromptsToCloud?: (prompts: VaultPrompt[]) => void;
  currentUserUid?: string;
  triggerSaaSToast?: (msg: string, type: "success" | "info" | "warning" | "error") => void;
  logDashboardActivity?: (action: string, enMsg: string, bnMsg: string) => void;
}

export default function SaaSPromptsPack({
  language,
  vaultPrompts,
  setVaultPrompts,
  savePromptsToCloud,
  currentUserUid = "guest",
  triggerSaaSToast,
  logDashboardActivity
}: SaaSPromptsPackProps) {
  const isEn = language === "english";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [unlockedPacks, setUnlockedPacks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("pcs_unlocked_packs");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Static Premium categories & prompt packs
  const promptCategories = useMemo(() => [
    { id: "all", name: isEn ? "All Packs" : "সব প্রম্পট প্যাক" },
    { id: "video", name: isEn ? "Video Prompts" : "ভিডিও প্রম্পট", icon: Film },
    { id: "image", name: isEn ? "Image Prompts" : "ইমেজ প্রম্পট", icon: ImageIcon },
    { id: "landing", name: isEn ? "Landing Page" : "ল্যান্ডিং পেজ", icon: MonitorSmartphone },
    { id: "adcopy", name: isEn ? "Ad Copy" : "বিজ্ঞাপন কপি", icon: Megaphone },
    { id: "email", name: isEn ? "Email Promo" : "ইমেইল ক্যাম্পেইন", icon: Mail },
    { id: "storyboard", name: isEn ? "Storyboard" : "স্টোরিবোর্ড", icon: FileText }
  ], [isEn]);

  const premiumPrompts = useMemo(() => [
    // Video Prompts
    {
      id: "v-01",
      title: "Cinematic SaaS Explainer Reel",
      category: "video",
      desc: "Perfect template prompt for generating high-converting 3D-like explainer videos for SaaS platforms.",
      promptText: "Create a 30-second cinematic high-tech SaaS product explainer reel. Start with a slow pull-back of a futuristic terminal interface glowing with cyan and purple laser lines. Transition into rapid action sequences of live-updating dashboard telemetry grids. Close on a pristine glossmorphic mockup showcasing automated revenue stream numbers scaling, followed by a bold neon call to action button 'Initiate Growth Layer'. Studio lighting, octane render, 8k Resolution.",
      isPremium: false,
      savesCount: 142
    },
    {
      id: "v-02",
      title: "Cyberpunk Tech Product Ad",
      category: "video",
      desc: "Immersive commercial style prompt for modern hardware or futuristic wearable devices.",
      promptText: "A high-octane 15-second teaser for a cyberpunk minimalist smartwatch. The camera tracks slowly macro to the sleek brushed obsidian edges. Blue holographic ring projections emerge displaying heartbeat and quantum state data. Staggered light sweeps reveal key buttons with subtle chrome highlights. Ultra-fast kinetic cuts ending in a deep dark space background. Sound elements: futuristic hum, digitized static sweeps, epic reverse rise.",
      isPremium: true,
      savesCount: 98
    },
    // Image Prompts
    {
      id: "i-01",
      title: "Neon Enterprise Workspace Hero",
      category: "image",
      desc: "Generates high quality glassmorphic visual assets for startup homepages.",
      promptText: "Sleek 3D isometric mockup of a futuristic command center app dashboard floating in deep dark space. High-contrast translucent glass panels with neon cyber glow lines of turquoise, sky blue, and hot magenta. Glowing wireframe charts, glowing volumetric spheres, pristine digital typography metrics, zero clutter background. Cinematic illumination, unreal engine 5 render, highly detailed, premium visual texture.",
      isPremium: false,
      savesCount: 310
    },
    {
      id: "i-02",
      title: "Bento Grid SaaS Mobile Interface",
      category: "image",
      desc: "Stunning presentation grid suitable for App store mockup showcasing.",
      promptText: "Minimalist bento grid mobile user interface design for an AI assistant. Generous off-black dark mode spacing, pristine neon green active indicator circles, clean white sans-serif headings, soft glowing glassmorphic panels displaying workflow statistics. Captured with high fidelity product studio camera, high contrast depth of field, modern sleek layout.",
      isPremium: true,
      savesCount: 224
    },
    // Landing page prompts
    {
      id: "l-01",
      title: "Elite AI Agency Funnel",
      category: "landing",
      desc: "Strategic structure prompt to generate high-converting AI automation consulting funnels.",
      promptText: "Develop a premium Landing Page structure for an Autonomous AI Agent Agency. Section 1 (Hero): Sleek bold title 'The Autonomous Workforce is Here', obsidian dark glassy card, premium CTA 'Audit Your Workflow'. Section 2 (Bento Grid of Features): Highlights infinite agents, 0ms idle latency, secure local state. Section 3 (Social proof & pricing): Clear tier plans. Apply high-contrast twilight color palette.",
      isPremium: false,
      savesCount: 188
    },
    {
      id: "l-02",
      title: "High-Ticket Real Estate Showcase",
      category: "landing",
      desc: "Conversion-optimized layout prompt for luxurious modern properties.",
      promptText: "Create a minimalist premium real estate landing page. Hero displays luxury smart villa with absolute floor-to-ceiling glass panel facades under warm late evening sunset. Editorial serif display headings paired with clean precise mono telemetry counters showing acreage, price indices, and localized private club ratings. Call to action button 'Book Private Jet Tour' in metallic gold gradient outline.",
      isPremium: true,
      savesCount: 135
    },
    // Ad copy prompts
    {
      id: "a-01",
      title: "SaaS Enterprise Pain-Point Hook",
      category: "adcopy",
      desc: "Compelling social media copy prompt that solves typical billing & cloud hosting pain-points.",
      promptText: "Write a high-converting 3-part social media ad campaign targeting Chief Technology Officers. Pain point hook: 'Are your server nodes leaking cash during off-peak hours?'. Solution: Present an automated quantum scaling cluster layer that shuts down idle nodes instantly. CTA: 'Stop the leak today - read our open source cluster script.' Tone should be technical, highly authoritative, zero marketing fluff, absolute engineering precision.",
      isPremium: false,
      savesCount: 257
    },
    {
      id: "a-02",
      title: "Viral LinkedIn Founder Story",
      category: "adcopy",
      desc: "Emotional but highly conversion-focused copy for startups launching of fresh beta products.",
      promptText: "Draft a viral-style story prompt for LinkedIn. Topic: Transitioning from standard REST APIs to dynamic hybrid multi-modal generation engines without crashing client infrastructure. Emphasize the pivot to quota-safe local layers and achieving 10x speedups. Close on a humble yet high-authority reflection about modern web app performance and invite feedback from our tech community.",
      isPremium: true,
      savesCount: 146
    },
    // Email Campaign Prompts
    {
      id: "e-01",
      title: "AI Node Beta Launch Invite",
      category: "email",
      desc: "Welcome series email for high priority sandbox developers.",
      promptText: "Draft an exclusive beta launch invitation email for server workspace nodes. Subject: [Priority Ingress] Your isolated AI sandbox node is ready. Include a sleek terminal step guide layout, instructions to load custom local environment variables safekeeping your primary keys, and code block snippet to execute client ping tests. End with a personal signature from Saeed Developer Solutions team.",
      isPremium: false,
      savesCount: 165
    },
    // Storyboard Prompts
    {
      id: "s-01",
      title: "Sleek SaaS Corporate Storyboard",
      category: "storyboard",
      desc: "Detailed shot-by-shot prompt to outline professional team video advertisements.",
      promptText: "Write an interactive storyboard for a team project board solution. Scene 1: Office wide panning, glowing blue dynamic workflow cards updating on the projection wall. Scene 2: Tech lead zooming onto digital task details showing instant developer sync comments. Scene 3: Slow pullback showcasing integrated team members thumbs up. End with clean corporate typography 'Work synced. Mind cleared.'",
      isPremium: false,
      savesCount: 153
    }
  ], [isEn]);

  // Handle premium unlock locally
  const handleUnlockPack = useCallback((id: string) => {
    setUnlockedPacks(prev => {
      const next = { ...prev, [id]: true };
      try {
        localStorage.setItem("pcs_unlocked_packs", JSON.stringify(next));
      } catch {}
      return next;
    });

    if (triggerSaaSToast) {
      triggerSaaSToast(isEn ? "Premium Prompt Pack Unlocked successfully!" : "প্রিমিয়াম প্রম্পট প্যাক আনলক সফল হয়েছে!", "success");
    }
    if (logDashboardActivity) {
      logDashboardActivity(
        "unlock_prompt_pack",
        `Unlocked premium prompt pack: "${id}" in local space`,
        `প্রিমিয়াম প্রম্পট প্যাক আনলক হয়েছে: "${id}"`
      );
    }
  }, [isEn, triggerSaaSToast, logDashboardActivity]);

  // Handle Save to Vault
  const handleSaveToVault = useCallback((prompt: typeof premiumPrompts[0]) => {
    // Generate new VaultPrompt item
    const newPrompt: VaultPrompt = {
      id: "pp-" + Math.random().toString(36).substring(2, 9),
      title: "[Pack] " + prompt.title,
      promptText: prompt.promptText,
      category: prompt.category.toUpperCase(),
      timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }) + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [newPrompt, ...vaultPrompts];
    setVaultPrompts(updated);

    try {
      localStorage.setItem("pcs_ai_prompts_" + currentUserUid, JSON.stringify(updated));
    } catch {}

    if (savePromptsToCloud) {
      savePromptsToCloud(updated);
    }

    if (triggerSaaSToast) {
      triggerSaaSToast(isEn ? "Prompt saved to your active Workspace Vault!" : "প্রম্পটটি আপনার ওয়ার্কস্পেস ভল্টে সংরক্ষণ করা হয়েছে!", "success");
    }
    if (logDashboardActivity) {
      logDashboardActivity(
        "save_prompt_pack",
        `Added premium pack prompt to workspace vault: "${prompt.title}"`,
        `ভল্টে প্রিমিয়াম প্রম্পট প্যাক যুক্ত সম্পন্ন: "${prompt.title}"`
      );
    }
  }, [vaultPrompts, setVaultPrompts, savePromptsToCloud, currentUserUid, isEn, triggerSaaSToast, logDashboardActivity]);

  // Handle copy text
  const handleCopyText = useCallback((id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
    
    if (triggerSaaSToast) {
      triggerSaaSToast(isEn ? "Prompt copied to clipboard!" : "প্রম্পট ক্লিপবোর্ডে কপি করা হয়েছে!", "info");
    }
  }, [isEn, triggerSaaSToast]);

  // Handle download TXT
  const handleDownloadTxt = useCallback((prompt: typeof premiumPrompts[0]) => {
    const element = document.createElement("a");
    const file = new Blob([`TITLE: ${prompt.title}\nCATEGORY: ${prompt.category.toUpperCase()}\n\nPROMPT:\n${prompt.promptText}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${prompt.title.toLowerCase().replace(/\s+/g, "_")}_prompt.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    if (triggerSaaSToast) {
      triggerSaaSToast(isEn ? "TXT file download started!" : "টিএক্সটি ফাইল ডাউনলোড শুরু হয়েছে!", "success");
    }
  }, [isEn, triggerSaaSToast]);

  // Handle download JSON
  const handleDownloadJson = useCallback((prompt: typeof premiumPrompts[0]) => {
    const element = document.createElement("a");
    const jsonStr = JSON.stringify({
      title: prompt.title,
      category: prompt.category,
      promptText: prompt.promptText,
      unlockedAt: new Date().toISOString()
    }, null, 2);
    const file = new Blob([jsonStr], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${prompt.title.toLowerCase().replace(/\s+/g, "_")}_prompt.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    if (triggerSaaSToast) {
      triggerSaaSToast(isEn ? "JSON schema download initiated!" : "জেসন স্কিমা ডাউনলোড শুরু হয়েছে!", "success");
    }
  }, [isEn, triggerSaaSToast]);

  // Filter prompts based on search & category
  const filteredPrompts = useMemo(() => {
    return premiumPrompts.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategory === "all" || p.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, activeCategory, premiumPrompts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-900 pb-5">
        <div>
          <span className="text-[10px] font-mono uppercase text-teal-400 tracking-widest font-bold flex items-center gap-2">
            <FolderLock className="w-3.5 h-3.5 animate-pulse text-teal-400" /> Premium Prompt Download Layer
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            {isEn ? "Premium Prompt Vault" : "প্রিমিয়াম প্রম্পট ভল্ট"}
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            {isEn ? "Optimized local model prompts ready for instant deployment & export." : "তাত্ক্ষণিক ব্যবহারের জন্য অপ্টিমাইজড প্রম্পট কালেকশন।"}
          </p>
        </div>
      </div>

      {/* Safety telemetry markers */}
      <div className="flex flex-wrap gap-2 select-none font-mono text-[8px] font-bold">
        <span className="inline-flex items-center gap-1.5 text-teal-400 bg-teal-950/20 border border-teal-850/45 px-2.5 py-1 rounded-full shadow-[0_0_8px_rgba(20,184,166,0.05)]">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          Premium Prompt Vault Active
        </span>
        <span className="inline-flex items-center gap-1.5 text-cyan-400 bg-cyan-950/20 border border-cyan-850/45 px-2.5 py-1 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.05)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Quota Safe Prompt Layer Enabled
        </span>
        <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-950/20 border border-emerald-850/45 px-2.5 py-1 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.05)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Local Prompt Packs Loaded
        </span>
      </div>

      {/* Active layout switcher with search */}
      <div className="bg-[#0c0d16] border border-gray-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {promptCategories.map(cat => {
            const CatIcon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`py-1.5 px-3 rounded-lg text-[10px] font-bold font-mono transition-all duration-200 flex items-center gap-1.5 cursor-pointer border ${
                  isActive 
                    ? "bg-teal-950/40 text-teal-300 border-teal-500/50 shadow-[0_0_8px_rgba(20,184,166,0.15)]" 
                    : "bg-[#090a0f] border-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {CatIcon && <CatIcon className="w-3 h-3" />}
                {cat.name}
              </button>
            )
          })}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={isEn ? "Search prompt templates..." : "প্রম্পট অনুসন্ধান করুন..."}
            className="w-full bg-[#090a0f] text-xs text-white placeholder-gray-500 rounded-lg py-2 pl-9 pr-4 border border-gray-800 focus:outline-none focus:border-teal-500/50 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Pro Grid list content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-h-[300px]">
        {filteredPrompts.length > 0 ? (
          filteredPrompts.map(prompt => {
            const isLocked = prompt.isPremium && !unlockedPacks[prompt.id];
            
            return (
              <div 
                key={prompt.id} 
                className={`bg-[#0c0d16] border rounded-2xl p-5 flex flex-col justify-between transition-all relative overflow-hidden group ${
                  isLocked 
                    ? "border-gray-850 opacity-90" 
                    : "border-gray-800 hover:border-teal-500/40 hover:shadow-[0_0_20px_rgba(20,184,166,0.06)]"
                }`}
              >
                
                {/* Visual Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      {/* Category Label badge */}
                      <span className="text-[8px] font-mono font-black uppercase text-teal-400 tracking-wider bg-teal-950/20 border border-teal-900/50 px-2 py-0.5 rounded">
                        {prompt.category}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-2 group-hover:text-teal-300 transition-colors">{prompt.title}</h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] font-mono text-gray-500 flex items-center gap-0.5"><Flame className="w-3 h-3 text-amber-500" /> {prompt.savesCount}</span>
                      {prompt.isPremium && (
                        <span className="inline-flex items-center gap-1 text-[8px] font-mono font-bold text-amber-400 bg-amber-950/25 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          <Star className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                          PREMIUM
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                    {prompt.desc}
                  </p>

                  <div className="bg-black/60 border border-gray-850 p-3 rounded-xl mt-4 relative overflow-hidden">
                    {isLocked ? (
                      <div className="py-6 flex flex-col items-center justify-center text-center space-y-3 relative z-10">
                        <FolderLock className="w-8 h-8 text-amber-500/70" />
                        <div>
                          <p className="text-xs font-bold text-white">This pack requires license activation</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">Click unlock below to simulate premium credential authorization.</p>
                        </div>
                        <button 
                          onClick={() => handleUnlockPack(prompt.id)}
                          className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold px-5 py-1.5 rounded-lg text-[10px] uppercase tracking-wide transition-all duration-300 cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                        >
                          Unlock Prompt Pack
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold block mb-1">OPT-IN PROMPT TEMPLATE</span>
                        <p className="text-[11px] font-mono text-teal-300/90 leading-relaxed max-h-[85px] overflow-y-auto pr-1 whitespace-pre-wrap select-all">
                          {prompt.promptText}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer utility bar (Only active when prompt is unlocked or free) */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-900 flex-wrap gap-2">
                  <span className="text-[9px] font-mono text-gray-500">
                    {isLocked ? "🔒 Static Lock Encoded" : "✅ Available"}
                  </span>

                  <div className="flex gap-1.5">
                    {!isLocked && (
                      <>
                        <button 
                          onClick={() => handleCopyText(prompt.id, prompt.promptText)}
                          className="p-1.5 rounded bg-[#090a14] border border-gray-800 hover:border-gray-650 text-gray-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold"
                          title="Copy input string"
                        >
                          {copiedPromptId === prompt.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedPromptId === prompt.id ? "Copied" : "Copy"}</span>
                        </button>
                        
                        <button 
                          onClick={() => handleDownloadTxt(prompt)}
                          className="p-1.5 rounded bg-[#090a14] border border-gray-800 hover:border-gray-650 text-gray-400 hover:text-white transition-all cursor-pointer text-[10px] font-bold flex items-center gap-1"
                          title="Save as TXT Document"
                        >
                          <Download className="w-3.5 h-3.5" /> TXT
                        </button>

                        <button 
                          onClick={() => handleDownloadJson(prompt)}
                          className="p-1.5 rounded bg-[#090a14] border border-gray-800 hover:border-gray-650 text-gray-400 hover:text-white transition-all cursor-pointer text-[10px] font-bold flex items-center gap-1"
                          title="Download format metadata schema"
                        >
                          <Download className="w-3.5 h-3.5" /> JSON
                        </button>

                        <button 
                          onClick={() => handleSaveToVault(prompt)}
                          className="py-1.5 px-2.5 rounded bg-teal-950/20 text-teal-400 border border-teal-850/40 hover:bg-teal-500/10 cursor-pointer text-[10px] font-bold flex items-center gap-1"
                          title="Add instantly into active Workspace Custom Vault"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" /> Save To Vault
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            )
          })
        ) : (
          <div className="col-span-2 border border-gray-800 border-dashed rounded-2xl flex flex-col items-center justify-center text-gray-500 p-12 text-center min-h-[300px]">
            <FolderLock className="w-8 h-8 mb-3 opacity-30 text-teal-400" />
            <p className="text-sm">No matched prompt packs. Try altering your keyword filter parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
