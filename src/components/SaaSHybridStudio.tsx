import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Wand2, Image as ImageIcon, Video, MonitorSmartphone, 
  Lock, Edit3, Save, Download, Clock, Star, Play, Sparkles,
  Copy, Check, Code, Eye, FileText, Plus, Trash
} from "lucide-react";

interface SaaSHybridStudioProps {
  language: string;
}

export default function SaaSHybridStudio({ language }: SaaSHybridStudioProps) {
  const isEn = language === "english";
  const [activeTab, setActiveTab] = useState<"landing" | "image" | "storyboard">("landing");
  
  // =====================
  // 1. LANDING PAGE GENERATOR & EXPORT
  // =====================
  const [selectedLanding, setSelectedLanding] = useState<string | null>("ai-agency");
  const [landingTitle, setLandingTitle] = useState("AI Automation Solutions");
  const [landingDesc, setLandingDesc] = useState("Leverage cutting-edge autonomous agents to power your business workflows 24/7.");
  const [landingCta, setLandingCta] = useState("Execute Automation");
  const [isLandingEditor, setIsLandingEditor] = useState(false);
  const [landingPreviewMode, setLandingPreviewMode] = useState<"visual" | "html" | "react">("visual");
  const [copiedHTML, setCopiedHTML] = useState(false);
  const [copiedReact, setCopiedReact] = useState(false);

  const landingTemplates = useMemo(() => [
    { id: "ai-agency", title: "AI Agency", desc: "Highlight AI automation services.", cta: "Schedule AI Demo", isPremium: false },
    { id: "saas-startup", title: "SaaS Startup", desc: "Convert visitors with clear pricing.", cta: "Start Free Trial", isPremium: true },
    { id: "real-estate", title: "Real Estate", desc: "Showcase premium property listings.", cta: "View Properties", isPremium: true },
    { id: "digital-marketing", title: "Digital Marketing", desc: "Collect high-ticket leads.", cta: "Get Free Audit", isPremium: false },
    { id: "restaurant", title: "Restaurant", desc: "Table reservations and menus.", cta: "Book a Table", isPremium: true },
    { id: "fitness", title: "Fitness/Gym", desc: "Workout programs and signups.", cta: "Join the Club", isPremium: true }
  ], []);

  const handleSelectLanding = useCallback((id: string, isPremium: boolean, title: string, desc: string, cta: string) => {
    setSelectedLanding(id);
    setLandingTitle(title);
    setLandingDesc(desc);
    setLandingCta(cta);
    setIsLandingEditor(false);
    setLandingPreviewMode("visual");
  }, []);

  const generatedHTML = useMemo(() => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${landingTitle || "Landing Page"}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#030712] text-white min-h-screen flex items-center justify-center p-6 font-sans">
  <div class="max-w-2xl text-center space-y-8 bg-[#090d16] border border-gray-800 p-12 rounded-3xl shadow-2xl relative">
    <div class="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
    <h1 class="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 py-2">
      ${landingTitle || "Build Your Future"}
    </h1>
    <p class="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
      ${landingDesc || "Start building premium landing pages and converting visitors immediately."}
    </p>
    <div>
      <button class="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold px-10 py-4 rounded-full text-base transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
        ${landingCta || "Get Started"}
      </button>
    </div>
  </div>
</body>
</html>`;
  }, [landingTitle, landingDesc, landingCta]);

  const generatedReact = useMemo(() => {
    return `import React from 'react';

export default function LandingPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl text-center space-y-8 bg-slate-900 border border-slate-800 p-12 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <h1 className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 py-2">
          {"${landingTitle.replace(/"/g, '\\"') || "Build Your Future"}"}
        </h1>
        
        <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
          {"${landingDesc.replace(/"/g, '\\"') || "Start building premium landing pages and converting visitors immediately."}"}
        </p>
        
        <div>
          <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold px-10 py-4 rounded-full text-base transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            {"${landingCta.replace(/"/g, '\\"') || "Get Started"}"}
          </button>
        </div>
      </div>
    </div>
  );
}`;
  }, [landingTitle, landingDesc, landingCta]);

  const copyToClipboard = useCallback((text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  // =====================
  // 2. IMAGE GENERATION
  // =====================
  const [imagePrompt, setImagePrompt] = useState("");
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageCooldownMs, setImageCooldownMs] = useState(0);
  const [imageHistory, setImageHistory] = useState<string[]>([]);

  useEffect(() => {
    let timer: any;
    if (imageCooldownMs > 0) {
      timer = setInterval(() => {
        setImageCooldownMs(prev => Math.max(0, prev - 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [imageCooldownMs]);

  const generateImage = useCallback(() => {
    if (!imagePrompt.trim() || imageCooldownMs > 0) return;
    
    setIsGeneratingImage(true);
    setImageCooldownMs(15000);
    
    const encoded = encodeURIComponent(imagePrompt.trim());
    const randomSeed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${randomSeed}&nologo=true`;
    
    setTimeout(() => {
      setActiveImageUrl(url);
      setImageHistory(prev => [url, ...prev].slice(0, 4));
      setIsGeneratingImage(false);
    }, 2000);
  }, [imagePrompt, imageCooldownMs]);

  // =====================
  // 3. VIDEO STORYBOARD INTERACTIVE
  // =====================
  const [storyboardPrompt, setStoryboardPrompt] = useState("");
  const [generatedStoryboard, setGeneratedStoryboard] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("pcs_storyboard_data");
      return saved ? JSON.parse(saved) : {
        title: "Saeed Digital Marketing Solutions AD",
        scenes: [
          { shot: "Wide Angle Establishing", action: "Camera glides slowly across space featuring beautiful blue and turquoise panels.", voiceover: "Unlock custom marketing pipelines programmed with precision automation.", transition: "Fade In" },
          { shot: "Macro Screen Zoom", action: "Deep interaction tracking displays dashboard metric growth loading live.", voiceover: "Safe local rendering handles active client loads with absolute ease.", transition: "Whip Pan" },
          { shot: "Cinematic Outro Pull-back", action: "Pristine enterprise cyber logo and custom button glows on center stage.", voiceover: "Partner with Saeed digital solutions today.", transition: "Fade to Black" }
        ]
      };
    } catch (e) {
      return null;
    }
  });
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  useEffect(() => {
    if (generatedStoryboard) {
      try {
        localStorage.setItem("pcs_storyboard_data", JSON.stringify(generatedStoryboard));
      } catch (e) {}
    }
  }, [generatedStoryboard]);

  const generateStoryboard = useCallback(() => {
    if (!storyboardPrompt.trim()) return;
    setIsGeneratingVideo(true);

    setTimeout(() => {
      setGeneratedStoryboard({
        title: storyboardPrompt,
        scenes: [
          { shot: "Wide Angle Establishing", action: "Sleek spatial layout with soft cyber neon grids highlighting core automation modules.", voiceover: "Your dynamic vision, built with real-time stability.", transition: "Fade In" },
          { shot: "Close-up Product Detail", action: "Interactive workflow boxes and clean charts glow in dark space.", voiceover: "SaaS execution speeds that keep operations highly responsive.", transition: "Cross Dissolve" },
          { shot: "Cinematic Outro", action: "Slow container cameras pull away to central call to action button with glow.", voiceover: "Join the leading Edge, deploy your workspace today.", transition: "Fade to Black" }
        ]
      });
      setIsGeneratingVideo(false);
    }, 1500);
  }, [storyboardPrompt]);

  const handleUpdateScene = useCallback((idx: number, field: string, value: string) => {
    setGeneratedStoryboard((prev: any) => {
      if (!prev) return prev;
      const updatedScenes = [...prev.scenes];
      updatedScenes[idx] = { ...updatedScenes[idx], [field]: value };
      return { ...prev, scenes: updatedScenes };
    });
  }, []);

  const handleAddScene = useCallback(() => {
    setGeneratedStoryboard((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        scenes: [
          ...prev.scenes,
          { shot: "Mid Cut Scene", action: "Describe modern video sequence action...", voiceover: "Highlight commercial product line copywriting voiceovers...", transition: "Cut" }
        ]
      };
    });
  }, []);

  const handleDeleteScene = useCallback((idx: number) => {
    setGeneratedStoryboard((prev: any) => {
      if (!prev || prev.scenes.length <= 1) return prev;
      const updatedScenes = prev.scenes.filter((_: any, i: number) => i !== idx);
      return { ...prev, scenes: updatedScenes };
    });
  }, []);

  const exportStoryboardText = useMemo(() => {
    if (!generatedStoryboard) return "";
    let txt = `STORYBOARD SCRIPT: ${generatedStoryboard.title}\n`;
    txt += `==================================================\n\n`;
    generatedStoryboard.scenes.forEach((scene: any, idx: number) => {
      txt += `Scene #${idx + 1} [Transition: ${scene.transition || "Fade"}]\n`;
      txt += `- Shot Type: ${scene.shot}\n`;
      txt += `- Visual Action: ${scene.action}\n`;
      txt += `- Voiceover Script: "${scene.voiceover}"\n\n`;
    });
    return txt;
  }, [generatedStoryboard]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-900 pb-5">
        <div>
          <span className="text-[10px] font-mono uppercase text-[#06b6d4] tracking-widest font-bold flex items-center gap-2">
           <Sparkles className="w-3 h-3 animate-pulse text-cyan-400" /> Hybrid AI Studio Upgrade Layer
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            {isEn ? "Hybrid Generation Engine" : "হাইব্রিড জেনারেশন ইঞ্জিন"}
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            {isEn ? "Lightweight multi-modal tools for safe and fast generation." : "নিরাপদ ও দ্রুত তৈরির জন্য হালকা টুলস।"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 select-none font-mono text-[8px] font-bold">
        <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-950/20 border border-emerald-850/45 px-2.5 py-1 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.05)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Landing Generator Functional
        </span>
        <span className="inline-flex items-center gap-1.5 text-cyan-400 bg-cyan-950/20 border border-cyan-850/45 px-2.5 py-1 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.05)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Storyboard Engine Active
        </span>
        <span className="inline-flex items-center gap-1.5 text-blue-400 bg-blue-950/20 border border-blue-850/45 px-2.5 py-1 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.05)]">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          Quota Safe Creative Layer Enabled
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("landing")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
            activeTab === "landing"
              ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/10 border-blue-500/50 text-blue-400"
              : "bg-[#090a0f] border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-600"
          }`}
        >
          <MonitorSmartphone className="w-4 h-4" /> Landing Pages
        </button>
        <button
          onClick={() => setActiveTab("image")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
            activeTab === "image"
              ? "bg-gradient-to-r from-pink-500/20 to-rose-500/10 border-pink-500/50 text-pink-400"
              : "bg-[#090a0f] border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-600"
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Image Generation
        </button>
        <button
          onClick={() => setActiveTab("storyboard")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
            activeTab === "storyboard"
              ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border-emerald-500/50 text-emerald-400"
              : "bg-[#090a0f] border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-600"
          }`}
        >
          <Video className="w-4 h-4" /> Video Storyboard
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        
        {/* LANDING TAB */}
        {activeTab === "landing" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            <div className="lg:col-span-4 space-y-3">
              {landingTemplates.map(tpl => {
                const isActive = selectedLanding === tpl.id;
                return (
                  <div 
                    key={tpl.id}
                    onClick={() => handleSelectLanding(tpl.id, tpl.isPremium, tpl.title, tpl.desc, tpl.cta)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)] scale-[1.01]' 
                        : 'bg-[#090a0f] border-gray-800 hover:bg-[#12131a]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-300'}`}>{tpl.title}</h4>
                        <p className="text-[10px] text-gray-500 mt-1">{tpl.desc}</p>
                      </div>
                      {tpl.isPremium && <Star className="w-3 h-3 text-amber-500" />}
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="lg:col-span-8">
              {selectedLanding ? (
                <div className="bg-[#0c0d16] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col h-full">
                  <div className="p-3 border-b border-gray-900 bg-black flex justify-between items-center flex-wrap gap-2">
                    <span className="text-[10px] font-mono text-blue-400">{isEn ? "Local Template Editor + Preview" : "স্থানীয় টেমপ্লেট এডিটর"}</span>
                    
                    {/* Preview mode buttons */}
                    <div className="flex items-center gap-1 bg-gray-900/60 p-0.5 rounded border border-gray-800">
                      <button 
                        onClick={() => setLandingPreviewMode("visual")} 
                        className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${landingPreviewMode === "visual" ? "bg-blue-500 text-black" : "text-gray-400 hover:text-white"}`}
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </button>
                      <button 
                        onClick={() => setLandingPreviewMode("html")} 
                        className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${landingPreviewMode === "html" ? "bg-blue-500 text-black" : "text-gray-400 hover:text-white"}`}
                      >
                        <Code className="w-3.5 h-3.5" /> HTML
                      </button>
                      <button 
                        onClick={() => setLandingPreviewMode("react")} 
                        className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${landingPreviewMode === "react" ? "bg-blue-500 text-black" : "text-gray-400 hover:text-white"}`}
                      >
                        <Code className="w-3.5 h-3.5" /> React
                      </button>
                    </div>

                    <button 
                      onClick={() => setIsLandingEditor(!isLandingEditor)} 
                      className="text-gray-400 hover:text-white transition-colors bg-gray-900/60 p-1.5 rounded border border-gray-800 cursor-pointer"
                    >
                      {isLandingEditor ? <Save className="w-4 h-4 text-emerald-400 animate-pulse"/> : <Edit3 className="w-4 h-4"/>}
                    </button>
                  </div>

                  <div className="p-8 flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden bg-gradient-to-b from-[#121420] to-[#090a0f] min-h-[350px]">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="z-10 w-full max-w-lg space-y-6">
                      {isLandingEditor && landingPreviewMode === "visual" ? (
                        <div className="space-y-4 w-full text-left bg-black/50 p-5 rounded-xl border border-blue-500/25 shadow-xl">
                          <div>
                            <label className="block text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold mb-1">Landing Title Accent</label>
                            <input 
                              type="text" 
                              value={landingTitle} 
                              onChange={e => setLandingTitle(e.target.value)} 
                              className="w-full bg-black/80 border border-gray-850 rounded-lg text-sm text-white px-3 py-2 outline-none focus:border-cyan-500 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold mb-1">Headline Paragraph Pitch</label>
                            <textarea 
                              value={landingDesc} 
                              onChange={e => setLandingDesc(e.target.value)} 
                              rows={3} 
                              className="w-full bg-black/80 border border-gray-810 rounded-lg text-xs text-slate-300 px-3 py-2 outline-none focus:border-cyan-500 transition-all resize-none leading-relaxed"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold mb-1">Call-To-Action (CTA) Label</label>
                            <input 
                              type="text" 
                              value={landingCta} 
                              onChange={e => setLandingCta(e.target.value)} 
                              className="w-full bg-black/80 border border-gray-850 rounded-lg text-xs text-white px-3 py-1.5 outline-none focus:border-cyan-500 transition-all"
                            />
                          </div>
                        </div>
                      ) : landingPreviewMode === "visual" ? (
                        <div className="space-y-6 animate-fade-in">
                          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
                            {landingTitle || "Launch into Digital Prosperity"}
                          </h1>
                          <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
                            {landingDesc || "Your complete tailored landing screen designed purely within local visual containers."}
                          </p>
                          <div className="pt-2">
                            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold px-8 py-3 rounded-full text-xs transition-transform transform hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                              {landingCta || "Continue Workflow"}
                            </button>
                          </div>
                        </div>
                      ) : landingPreviewMode === "html" ? (
                        <div className="w-full text-left bg-black/90 p-4 rounded-xl border border-gray-850 max-h-[300px] overflow-y-auto relative">
                          <button 
                            onClick={() => copyToClipboard(generatedHTML, setCopiedHTML)}
                            className="absolute top-2 right-2 p-1.5 rounded bg-[#090a14] border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white transition-all flex items-center gap-1.5 text-[9px] font-mono cursor-pointer"
                          >
                            {copiedHTML ? <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedHTML ? "Copied HTML!" : "Copy Code"}
                          </button>
                          <pre className="text-[10px] font-mono text-cyan-400 leading-relaxed selection:bg-slate-800 select-all overflow-x-auto whitespace-pre">
                            <code>{generatedHTML}</code>
                          </pre>
                        </div>
                      ) : (
                        <div className="w-full text-left bg-black/90 p-4 rounded-xl border border-gray-850 max-h-[300px] overflow-y-auto relative">
                          <button 
                            onClick={() => copyToClipboard(generatedReact, setCopiedReact)}
                            className="absolute top-2 right-2 p-1.5 rounded bg-[#090a14] border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white transition-all flex items-center gap-1.5 text-[9px] font-mono cursor-pointer"
                          >
                            {copiedReact ? <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedReact ? "Copied React!" : "Copy React Code"}
                          </button>
                          <pre className="text-[10px] font-mono text-teal-400 leading-relaxed selection:bg-slate-800 select-all overflow-x-auto whitespace-pre">
                            <code>{generatedReact}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-900 bg-black flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-mono text-[9px]">Zero Network Latency • Saved to state</span>
                    <button 
                      onClick={() => {
                        const targetCode = landingPreviewMode === "react" ? generatedReact : generatedHTML;
                        navigator.clipboard.writeText(targetCode);
                        alert(isEn ? "Landing custom code exported to clipboard!" : "ল্যান্ডিং পেজ কোড ক্লিপবোর্ডে এক্সপোর্ট করা হয়েছে!");
                      }}
                      className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                       <Code className="w-4 h-4"/> Use Template
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[400px] border border-gray-800 border-dashed rounded-2xl flex flex-col items-center justify-center text-gray-500 p-6 text-center">
                  <MonitorSmartphone className="w-8 h-8 mb-3 opacity-50 text-blue-500 animate-bounce" />
                  <p className="text-sm">Select an active template component in the left view deck to start styling.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* IMAGE TAB */}
        {activeTab === "image" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            <div className="bg-[#0c0d16] border border-gray-800 rounded-2xl p-6 flex flex-col">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-pink-500"/>
                {isEn ? "Instant Prompt Generator" : "ইন্সট্যান্ট প্রম্পট জেনারেটর"}
              </h3>
              <p className="text-xs text-gray-400 mb-6">{isEn ? "Generates images via lightweight Pollinations API." : "পলিনেশন এপিআইয়ের মাধ্যমে হালকাভাবে ছবি তৈরি করে।"}</p>
              
              <textarea
                value={imagePrompt}
                onChange={e => setImagePrompt(e.target.value)}
                placeholder={isEn ? "A futuristic cyberpunk city in neon pink and cyan colors, highly detailed, 8k..." : "একটি ভবিষ্যৎ সাইবারপাঙ্ক শহর..."}
                className="w-full bg-[#090a0f] border border-gray-800 rounded-xl p-4 text-sm text-gray-200 outline-none focus:border-pink-500/50 transition-colors resize-none h-32 mb-4"
              />

              <button
                onClick={generateImage}
                disabled={isGeneratingImage || imageCooldownMs > 0 || !imagePrompt.trim()}
                className={`w-full py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.15)] ${
                  isGeneratingImage || imageCooldownMs > 0 || !imagePrompt.trim()
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-pink-600 hover:bg-pink-500 text-white"
                }`}
              >
                {isGeneratingImage ? (
                  <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"/> Generating...</>
                ) : imageCooldownMs > 0 ? (
                  <><Clock className="w-4 h-4"/> Cooldown ({Math.ceil(imageCooldownMs/1000)}s)</>
                ) : (
                  <><Wand2 className="w-4 h-4"/> Generate Image</>
                )}
              </button>

              <div className="mt-8">
                <h4 className="text-[10px] uppercase font-mono text-gray-500 mb-3">{isEn ? "Local History" : "লোকাল হিস্টরি"}</h4>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {imageHistory.length > 0 ? imageHistory.map((url, i) => (
                    <img key={i} src={url} alt="History" className="w-16 h-16 rounded-lg object-cover border border-gray-800 cursor-pointer hover:border-pink-500/50" onClick={() => setActiveImageUrl(url)} referrerPolicy="no-referrer" />
                  )) : (
                    <span className="text-xs text-gray-600">{isEn ? "No recent generations." : "নতুন কিছু তৈরি করা হয়নি।"}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[#0c0d16] border border-gray-800 rounded-2xl flex flex-col overflow-hidden min-h-[400px]">
              <div className="p-3 border-b border-gray-900 bg-black flex justify-between items-center">
                <span className="text-[10px] font-mono text-pink-400">{isEn ? "Preview Canvas" : "প্রিভিউ ক্যানভাস"}</span>
                {activeImageUrl && (
                  <a href={activeImageUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Download className="w-4 h-4"/>
                  </a>
                )}
              </div>
              <div className="flex-1 bg-black/60 flex items-center justify-center p-4 relative">
                {isGeneratingImage ? (
                  <div className="flex flex-col items-center gap-3 text-pink-500">
                    <span className="w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"/>
                    <span className="text-xs font-mono">Fetching visual stream...</span>
                  </div>
                ) : activeImageUrl ? (
                  <img src={activeImageUrl} alt="Generated" className="max-w-full max-h-full rounded-xl shadow-2xl object-contain animate-fade-in animate-pulse duration-1000" referrerPolicy="no-referrer" />
                ) : (
                  <div className="text-center text-gray-600">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs">{isEn ? "Your generated image will appear here." : "আপনার তৈরি করা ছবি এখানে দেখাবে।"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STORYBOARD TAB */}
        {activeTab === "storyboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            <div className="lg:col-span-4 space-y-4">
              
              {/* Premium Lock Widget */}
              <div className="bg-gradient-to-br from-black to-[#090a0f] border border-gray-800 rounded-2xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-4 h-4 text-purple-400"/>
                  <h3 className="text-sm font-bold text-white">Sora / GPU Render</h3>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed mb-4">
                  Full cinematic video synthesis requires enterprise GPU allocation. 
                </p>
                <div className="w-full bg-gray-900 border border-gray-800 text-gray-500 text-xs py-2 rounded-lg text-center font-bold">
                  LOCKED IN CURRENT TIER
                </div>
              </div>

              <div className="bg-[#0c0d16] border border-gray-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-emerald-500"/>
                  Text-to-Storyboard
                </h3>
                <p className="text-xs text-gray-400 mb-4">Generate cinematic scene breakdowns safely.</p>
                <textarea
                  value={storyboardPrompt}
                  onChange={e => setStoryboardPrompt(e.target.value)}
                  placeholder="A cinematic commercial for a sleek modern smartwatch..."
                  className="w-full bg-[#090a0f] border border-gray-800 rounded-xl p-3 text-sm text-gray-200 outline-none focus:border-emerald-500/50 transition-colors resize-none h-24 mb-4"
                />
                <button
                  onClick={generateStoryboard}
                  disabled={isGeneratingVideo || !storyboardPrompt.trim()}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isGeneratingVideo || !storyboardPrompt.trim()
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  }`}
                >
                  {isGeneratingVideo ? "Designing Storyboard..." : "Generate Scenes"}
                </button>
              </div>

              {/* Storyboard Action Stats Card */}
              {generatedStoryboard && (
                <div className="bg-[#0c0d16] border border-gray-800 p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-semibold text-white uppercase font-mono tracking-wider">{isEn ? "Action Deck Summary" : "ডেক সংক্ষিপ্ত বিবরণ"}</h4>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-black/40 border border-gray-850 p-2.5 rounded-lg">
                      <span className="block text-[8px] font-mono text-gray-500">SCENES COUNT</span>
                      <span className="text-base font-black text-cyan-400">{generatedStoryboard.scenes ? generatedStoryboard.scenes.length : 0}</span>
                    </div>
                    <div className="bg-black/40 border border-gray-850 p-2.5 rounded-lg">
                      <span className="block text-[8px] font-mono text-gray-500">EST DURATION</span>
                      <span className="text-base font-black text-emerald-400">~{generatedStoryboard.scenes ? generatedStoryboard.scenes.length * 6 : 0}s</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAddScene()}
                      className="w-full py-2 bg-[#090a14] border border-gray-800 text-white hover:text-cyan-400 hover:border-cyan-500/40 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-cyan-400" /> Add Scene
                    </button>
                    
                    <button 
                      onClick={() => copyToClipboard(exportStoryboardText, setCopiedScript)}
                      className="w-full py-2 bg-cyan-950/20 text-cyan-400 border border-cyan-850/40 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 hover:bg-cyan-500/10 cursor-pointer"
                    >
                      {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      {copiedScript ? "Copied Script" : "Export Script"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-8 relative">
              <div className="bg-[#0c0d16] border border-gray-800 rounded-2xl h-full min-h-[400px] flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-900 bg-black flex justify-between items-center">
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-2">
                    <Video className="w-3.5 h-3.5" />
                    Interactive Timeline Scene Editor
                  </span>
                  
                  {generatedStoryboard && (
                    <button 
                      onClick={() => {
                        if (confirm(isEn ? "Are you sure you want to restore default storyboard scenes?" : "আপনি কি স্টোরিবোর্ড প্রথমাবস্থায় ফিরিয়ে নিতে চান?")) {
                          localStorage.removeItem("pcs_storyboard_data");
                          window.location.reload();
                        }
                      }}
                      className="text-gray-400 hover:text-red-400 transition-colors text-[9px] font-mono bg-red-950/25 border border-red-900/30 px-2 py-1 rounded cursor-pointer"
                    >
                      Reset Timelines
                    </button>
                  )}
                </div>
                
                <div className="p-6 flex-1 bg-gradient-to-b from-black to-[#0c0d16] overflow-y-auto max-h-[550px]">
                  {isGeneratingVideo ? (
                     <div className="h-full flex flex-col items-center justify-center text-emerald-500 gap-3 py-12">
                        <span className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"/>
                        <span className="text-xs font-mono">Synthesizing narrative arcs...</span>
                     </div>
                  ) : generatedStoryboard ? (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex items-center gap-2 border-b border-gray-850 pb-2">
                        <span className="text-[9px] uppercase font-mono text-gray-500">Storyboard Focus:</span>
                        <input 
                          type="text" 
                          value={generatedStoryboard.title} 
                          onChange={e => setGeneratedStoryboard({ ...generatedStoryboard, title: e.target.value })}
                          className="flex-1 bg-transparent text-sm font-bold text-white focus:outline-none focus:border-b focus:border-cyan-500 px-1 py-0.5 tracking-wide text-left" 
                        />
                      </div>
                      
                      <div className="space-y-4">
                        {generatedStoryboard.scenes.map((scene: any, idx: number) => (
                          <div key={idx} className="bg-[#090a0f] border border-gray-800 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden group">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/40 group-hover:bg-emerald-400 transition-colors" />
                            
                            <div className="flex justify-between items-center gap-3 flex-wrap">
                              <span className="text-[10px] bg-emerald-950/40 text-emerald-400 px-2.5 py-0.5 rounded font-mono uppercase font-bold border border-emerald-850/40">Scene 0{idx + 1}</span>
                              
                              <div className="flex items-center gap-2 flex-1 min-w-[130px]">
                                <span className="text-[9px] font-mono text-gray-500">Camera:</span>
                                <input 
                                  type="text" 
                                  value={scene.shot} 
                                  onChange={e => handleUpdateScene(idx, "shot", e.target.value)}
                                  className="w-full bg-black/60 border border-gray-850 rounded text-[10px] px-2 py-1 outline-none text-white focus:border-cyan-500" 
                                />
                              </div>

                              <div className="flex items-center gap-2 min-w-[130px]">
                                <span className="text-[9px] font-mono text-gray-500">Transition:</span>
                                <input 
                                  type="text" 
                                  value={scene.transition || "Cross Dissolve"} 
                                  onChange={e => handleUpdateScene(idx, "transition", e.target.value)}
                                  className="w-full bg-black/60 border border-gray-850 rounded text-[10px] px-2 py-1 outline-none text-white focus:border-cyan-500" 
                                />
                              </div>

                              {generatedStoryboard.scenes.length > 1 && (
                                <button 
                                  onClick={() => handleDeleteScene(idx)}
                                  className="text-gray-500 hover:text-red-400 p-1.5 rounded transition-colors cursor-pointer hover:bg-red-950/20"
                                  title="Remove Scene"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <div className="text-left">
                              <span className="text-[9px] font-mono text-cyan-400 block mb-1">Visual Video Action Breakdown:</span>
                              <input 
                                type="text"
                                value={scene.action}
                                onChange={e => handleUpdateScene(idx, "action", e.target.value)}
                                className="w-full bg-black/50 border border-gray-850 rounded-lg p-2 text-xs text-gray-350 outline-none focus:border-cyan-500"
                              />
                            </div>

                            <div className="bg-black/55 p-3 rounded-lg border border-gray-850 flex flex-col gap-1.5 text-left">
                               <span className="text-emerald-400 text-[9px] font-mono font-bold flex items-center gap-1.5">
                                 🎤 AD SCRIPT / VOICEOVER COPY:
                               </span>
                               <textarea
                                 value={scene.voiceover}
                                 onChange={e => handleUpdateScene(idx, "voiceover", e.target.value)}
                                 rows={2}
                                 className="w-full bg-transparent outline-none border-none text-xs text-emerald-100 italic resize-none p-0 focus:ring-0 leading-relaxed"
                               />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-650 py-12">
                      <Play className="w-8 h-8 mb-3 opacity-30 text-emerald-400" />
                      <p className="text-xs max-w-sm text-center">Write a storyboard prompt on the left to start generating custom scenes.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
