import React, { useState, useEffect } from "react";
import { 
  Sparkles, Copy, Check, Sliders, Download, Edit, Save, 
  Trash2, Layers, Cpu, Eye, MessageSquareCode, Image as ImageIcon, 
  Video as VideoIcon, Megaphone, Clock, CheckCircle, ChevronRight, X, Lock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { GeneratorType, Language, SavedResult, ToneOption } from "../types";
import SaaSPremiumTemplates from "./SaaSPremiumTemplates";
import SaaSPromptLimitTracker, { getPromptLimit } from "./SaaSPromptLimitTracker";
import SaaSLeadCaptureCRM from "./SaaSLeadCaptureCRM";

interface SaasToolProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenDashboard?: () => void;
}

// Defining Tones
const TONES: ToneOption[] = [
  { id: "creative", nameEn: "Creative", nameBn: "সৃজনশীল", emoji: "🎨" },
  { id: "professional", nameEn: "Professional", nameBn: "পেশাদার", emoji: "💼" },
  { id: "funny", nameEn: "Witty & Funny", nameBn: "রসাত্মক", emoji: "😆" },
  { id: "bold", nameEn: "Bold & Persuasive", nameBn: "সাহসী ও প্ররোচক", emoji: "🚀" },
  { id: "empathetic", nameEn: "Empathetic", nameBn: "সহানুভূতিশীল", emoji: "❤️" },
  { id: "urgent", nameEn: "Urgent Copy", nameBn: "জরুরি", emoji: "🚨" },
];

export default function SaasTool({ language, setLanguage, onOpenDashboard }: SaasToolProps) {
  const isEn = language === "english";
  const [activeTab, setActiveTab] = useState<GeneratorType>("campaign");
  const [prompt, setPrompt] = useState("");
  const [selectedTone, setSelectedTone] = useState("creative");

  // --- PCS AI Studio Multi Language Prompt Engine State ---
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "bn" | "hi" | "ar" | "es">(() => {
    try {
      const saved = localStorage.getItem("selectedLanguage");
      if (saved && ["en", "bn", "hi", "ar", "es"].includes(saved)) {
        return saved as any;
      }
    } catch (e) {}
    return "en";
  });

  const [lastLanguageUsed, setLastLanguageUsed] = useState<string>(() => {
    try {
      return localStorage.getItem("lastLanguageUsed") || "en";
    } catch (e) {}
    return "en";
  });

  const [languageEngineToast, setLanguageEngineToast] = useState("");

  const LANGUAGE_PRESETS = [
    {
      id: "bn" as const,
      name: "Bengali / বাংলা",
      flag: "🇧🇩",
      title: "Bengali Business Prompt",
      promptText: "একটি উচ্চ মানসম্পন্ন ডিজিটাল মার্কেটিং ক্যাম্পেইন তৈরি করো যার মূল পণ্য হলো [অর্গানিক ফুড ডেলিভারি]। এর টার্গেট কাস্টমার হচ্ছে স্থানীয় ক্রেতা ও যুবসমাজ। একটি আকর্ষণীয় স্লোগান, ফেসবুক বিজ্ঞাপন কপি এবং সামাজিক যোগাযোগ মাধ্যমে প্রচারের জন্য ৩টি ভিন্ন ভিন্ন ক্যাম্পেইন আইডিয়া প্রস্তাব করো।"
    },
    {
      id: "en" as const,
      name: "English",
      flag: "🇺🇸",
      title: "English Ad Copy Campaign",
      promptText: "Construct a highly engaging multi-channel ad copy campaign for [Eco-friendly Bamboo Toothbrush]. Incorporate an attention-grabbing hook, target clear customer pain points, outline core value propositions, and conclude with a high-converting call to action."
    },
    {
      id: "hi" as const,
      name: "Hindi / हिन्दी",
      flag: "🇮🇳",
      title: "Hindi Marketing Prompt",
      promptText: "हमारे नए [स्मार्ट वॉटर बॉटल] के लिए एक विस्तृत सोशल मीडिया मार्केटिंग योजना तैयार करें। इसमें एक आकर्षक टैगलाइन, ग्राहकों की मुख्य समस्याओं का समाधान, और विशेष रूप से भारतीय त्योहारों या अवसरों पर केंद्रित प्रचार विचार शामिल करें।"
    },
    {
      id: "ar" as const,
      name: "Arabic / العربية",
      flag: "🇸🇦",
      title: "Arabic Branding Prompt",
      promptText: "ابتكر خطة إعلانية متميزة لإطلاق منتج [القهوة الفاخرة العضوية] في الأسواق العربية. ركز على الجودة العالية واللمسة المحلية، واقترح ٣ أفكار إعلانية مع نسخة لصفحات التواصل الاجتماعي تناسب الجمهور الخليجي والعربي."
    },
    {
      id: "es" as const,
      name: "Spanish / Español",
      flag: "🇪🇸",
      title: "Spanish Creative Startup",
      promptText: "Crea una propuesta de valor súper atractiva para nuestro servicio de [Entregas a domicilio eco-amigables]. Enfócate en un tono amigable, dinámico y disruptivo adaptado a la audiencia hispanohablante mundial, con 3 pilares clave del modelo de negocio."
    }
  ];

  const localizedLabels: Record<string, {
    step1: string;
    step2: string;
    tone: string;
    platform: string;
    promptTemplate: string;
    statusActive: string;
    statusQuota: string;
  }> = {
    en: {
      step1: "STEP 1: Describe your Business Concept or Idea",
      step2: "STEP 2: Fine-Tune AI Parameters",
      tone: "Output Tone Style",
      platform: "Social Media Platform",
      promptTemplate: "Premium Template Language Mode",
      statusActive: "Multi Language Engine Active",
      statusQuota: "Quota Safe Translation Layer Enabled"
    },
    bn: {
      step1: "ধাপ ১: আপনার ব্যবসায়িক ধারণা বা টপিকটি লিখুন",
      step2: "ধাপ ২: এআই প্যারামিটার সমন্বয় করুন",
      tone: "আউটপুট টোন স্টাইল",
      platform: "সোশ্যাল মিডিয়া প্লাটফর্ম",
      promptTemplate: "প্রিমিয়াম টেমপ্লেট ল্যাঙ্গুয়েজ মোড",
      statusActive: "মাল্টি ল্যাঙ্গুয়েজ প্রম্পট ইঞ্জিন সক্রিয়",
      statusQuota: "কোটা নিরাপদ ট্রান্সলেশন লেয়ার সক্রিয়"
    },
    hi: {
      step1: "चरण १: अपने व्यावसायिक विचार या अवधारणा का वर्णन करें",
      step2: "चरण २: एआई मापदंडों को ठीक करें",
      tone: "आउटपुट टोन शैली",
      platform: "सोशल मीडिया प्लेटफॉर्म",
      promptTemplate: "प्रीमियम टेम्पलेट भाषा मोड",
      statusActive: "बहु-भाषा मुख्य इंजन सक्रिय",
      statusQuota: "कोटा सुरक्षित भाषाई परत सक्रिय"
    },
    ar: {
      step1: "الخطوة ١: صف فكرة مشروعك أو مفهومك التجاري",
      step2: "الخطوة ٢: ضبط معلمات الذكاء الاصطناعي بدقة",
      tone: "أسلوب نبرة المحتوى الإبداعي",
      platform: "منصة التواصل الاجتماعي",
      promptTemplate: "وضع لغة القالب المتميز",
      statusActive: "محرك ترجمة اللغات المتعددة نشط",
      statusQuota: "طبقة الترجمة الذكية الآمنة للحصص مفعّلة"
    },
    es: {
      step1: "PASO 1: Describa su concepto o idea de negocio",
      step2: "PASO 2: Ajustar los parámetros de IA",
      tone: "Estilo de tono del contenido",
      platform: "Plataforma de redes sociales",
      promptTemplate: "Modo de Plantilla Multi-Idioma",
      statusActive: "Motor Multi-Idioma Activo",
      statusQuota: "Capa de Traducción Segura de Cuotas"
    }
  };

  const handleLanguageChange = (lang: "en" | "bn" | "hi" | "ar" | "es") => {
    setSelectedLanguage(lang);
    setLastLanguageUsed(lang);
    try {
      localStorage.setItem("selectedLanguage", lang);
      localStorage.setItem("lastLanguageUsed", lang);
    } catch (e) {}
    
    // Smoothly show transient loading overlay label
    setLanguageEngineToast(
      lang === "bn" ? "भाषा परिवर्तन: বাংলা ল্যাঙ্গুয়েজ সক্রিয়!" :
      lang === "hi" ? "भाषा परिवर्तन: हिंदी इंजन सक्रिय!" :
      lang === "ar" ? "تغيير اللغة: المحرك العربي نشط!" :
      lang === "es" ? "Idioma cambiado: ¡Español activo!" :
      "Language set to English!"
    );
    setTimeout(() => setLanguageEngineToast(""), 2200);
  };
  
  // Custom Dynamic options based on generator selection
  const [platform, setPlatform] = useState("all-rounder");
  const [artStyle, setArtStyle] = useState("photorealistic");
  const [cameraMovement, setCameraMovement] = useState("cinematic drone shot");
  const [audience, setAudience] = useState("general consumer");

  // Interaction State
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [output, setOutput] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOutput, setEditedOutput] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [history, setHistory] = useState<SavedResult[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Monthly Prompt limits tracking states
  const [quotaLimitExceeded, setQuotaLimitExceeded] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);

  // Campaign specific output states
  const [campaignOutput, setCampaignOutput] = useState<{
    facebookCaption?: string;
    hashtags?: string;
    posterPrompt?: string;
    videoPrompt?: string;
    adCopy?: string;
    landingHeadline?: string;
  } | null>(null);
  
  const [selectedCampaignCard, setSelectedCampaignCard] = useState<"facebookCaption" | "hashtags" | "posterPrompt" | "videoPrompt" | "adCopy" | "landingHeadline">("facebookCaption");

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("pcs_ai_history");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Local storage error:", e);
    }
  }, []);

  // Multi-stage generation step sentences
  const generationStepsEn = [
    "Analyzing prompt semantics...",
    "Scanning linguistic patterns with Gemini-3.5 NLU...",
    "Injecting specified emotional tone profile...",
    "Drafting structured responses & options...",
    "Refining structural Markdown layout...",
  ];

  const generationStepsBn = [
    "ইনপুট প্রম্পট বিশ্লেষণ করা হচ্ছে...",
    "Gemini-3.5 ইঞ্জিনের সাথে ভাষা কাঠামো রিড করা হচ্ছে...",
    "নির্বাচিত টোনের আবেগী প্রভাব যুক্ত করা হচ্ছে...",
    "কন্টেন্টের বিভিন্ন বৈচিত্র্য এবং অপশন সাজানো হচ্ছে...",
    "মার্কাডাউন লেআউট ও বাংলা বানান পরিমার্জন করা হচ্ছে...",
  ];

  const campaignStepsEn = [
    "Analyzing business topic core nodes...",
    "Structuring persuasive sales Facebook copy...",
    "Formulating targeted SEO hashtag array...",
    "Configuring stylistic Midjourney visual directions...",
    "Directing fluid motion physics for cinematic video prompt...",
    "Calibrating AIDA ad layouts of high-converting copies...",
  ];

  const campaignStepsBn = [
    "ব্যবসায়িক ধারণার মূল অংশসমূহ বিশ্লেষণ করা হচ্ছে...",
    "উচ্চ রূপান্তর হারের ফেসবুক ক্যাপশন সাজানো হচ্ছে...",
    "টার্গেটেড সোশ্যাল মিডিয়া হ্যাশট্যাগ ম্যাট্রিক্স তৈরি করা হচ্ছে...",
    "মিডজার্নি এবং ডাল-ই প্রম্পটের ভিজ্যুয়াল বিবরণ লেখা হচ্ছে...",
    "ভিডিও তৈরির জন্য চমৎকার ক্যামেরা মুভমেন্ট স্পেসিফিকেশন ডিরেক্ট করা হচ্ছে...",
    "এআইডিএ ফরম্যাটে বিশ্বাসযোগ্য বিজ্ঞাপন স্ক্রিপ্ট তৈরি করা হচ্ছে...",
  ];

  const activeSteps = activeTab === "campaign"
    ? (isEn ? campaignStepsEn : campaignStepsBn)
    : (isEn ? generationStepsEn : generationStepsBn);

  // Simulate Multi-stage progress indicator during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setCurrentStepIndex(0);
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < activeSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isGenerating, activeSteps.length]);

  // Handle actual AI API call
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setErrorMessage(isEn ? "Please enter a concept or description." : "দয়া করে একটি ধারণা অথবা বিবরণ লিখুন।");
      return;
    }

    // Check if prompt limit exceeded before running
    const storedPlan = localStorage.getItem("activePlan") || "free";
    const storedUsed = localStorage.getItem("pcs_prompts_used");
    let usedInt = storedUsed ? parseInt(storedUsed, 10) : 0;
    if (isNaN(usedInt)) usedInt = 0;
    const limitMax = storedPlan === "creator" ? 200 : storedPlan === "marketing" ? 1000 : storedPlan === "business" ? 999999 : 10;
    
    if (usedInt >= limitMax) {
      setErrorMessage(isEn 
        ? "Monthly run limit reached for your active plan. Please upgrade to continue." 
        : "আপনার বর্তমান প্ল্যানের মাসিক লিমিট শেষ হয়েছে। সচল রাখতে আপগ্রেড করুন।");
      return;
    }

    setIsGenerating(true);
    setErrorMessage("");
    setOutput("");
    setIsEditing(false);

    // Prepare custom dynamic payload based on generator type
    let additionalOptions: Record<string, string> = {};
    if (activeTab === "caption") {
      additionalOptions.platform = platform;
    } else if (activeTab === "poster") {
      additionalOptions.artStyle = artStyle;
    } else if (activeTab === "video") {
      additionalOptions.cameraMovement = cameraMovement;
    } else if (activeTab === "adcopy") {
      additionalOptions.audience = audience;
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generatorType: activeTab,
          prompt,
          language,
          tone: selectedTone,
          additionalOptions,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "An error occurred during generation");
      }

      // Update prompts used limit tracker locally on success match
      try {
        const nextUsed = usedInt + 1;
        localStorage.setItem("pcs_prompts_used", String(nextUsed));
        setTriggerCount(prev => prev + 1);
      } catch (ex) {}

      if (activeTab === "campaign") {
        if (data.campaign) {
          setCampaignOutput(data.campaign);
          setSelectedCampaignCard("facebookCaption");
          setOutput(data.campaign.facebookCaption || "");
          setEditedOutput(data.campaign.facebookCaption || "");
        } else {
          // Fallback parsing
          try {
            const parsed = JSON.parse(data.output);
            setCampaignOutput(parsed);
            setSelectedCampaignCard("facebookCaption");
            setOutput(parsed.facebookCaption || "");
            setEditedOutput(parsed.facebookCaption || "");
          } catch (e) {
            const fallback = {
              facebookCaption: data.output || "",
              hashtags: "#marketing #campaign #growth",
              posterPrompt: "Sleek product showcase poster with modern dynamic lighting, studio background, ultra-hd, 4k prompt for: " + prompt,
              videoPrompt: "Slow cinematic dolly zoom-in shot, depth of field, corporate luxury commercial styling for: " + prompt,
              adCopy: data.output || "",
              landingHeadline: "Unleash " + prompt + " like never before with elite PCS AI Studio solutions."
            };
            setCampaignOutput(fallback);
            setSelectedCampaignCard("facebookCaption");
            setOutput(data.output || "");
            setEditedOutput(data.output || "");
          }
        }
      } else {
        setCampaignOutput(null);
        setOutput(data.output || "");
        setEditedOutput(data.output || "");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to connect to the Gemini API server.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy Output to Clipboard
  const handleCopy = () => {
    const textToCopy = isEditing ? editedOutput : output;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Export as text file
  const handleDownload = () => {
    const textToCopy = isEditing ? editedOutput : output;
    const blob = new Blob([textToCopy], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `PCS_AI_Studio_${activeTab}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Switch between individual campaign cards with seamless in-memory sync support
  const handleCardSelect = (cardKey: "facebookCaption" | "hashtags" | "posterPrompt" | "videoPrompt" | "adCopy" | "landingHeadline") => {
    if (activeTab === "campaign" && campaignOutput) {
      // Direct in-memory sync for any edits made on the current active card
      const currentActiveVal = isEditing ? editedOutput : output;
      const updatedCampaign = { ...campaignOutput };
      updatedCampaign[selectedCampaignCard] = currentActiveVal;
      setCampaignOutput(updatedCampaign);
      
      // Select new target card and load its content
      setSelectedCampaignCard(cardKey);
      const targetContent = updatedCampaign[cardKey] || "";
      setOutput(targetContent);
      setEditedOutput(targetContent);
      setIsEditing(false);
    }
  };

  // Save creation to personal state and local storage history
  const handleSaveToHistory = () => {
    let finalVal = isEditing ? editedOutput : output;
    
    // For campaign, pack all sub-cards so they can be re-loaded as individual active cards later!
    if (activeTab === "campaign" && campaignOutput) {
      const updatedCampaign = { ...campaignOutput };
      updatedCampaign[selectedCampaignCard] = finalVal;
      finalVal = JSON.stringify(updatedCampaign);
    }

    if (!finalVal) return;

    let optStr: Record<string, string> = {};
    if (activeTab === "caption") optStr = { platform };
    if (activeTab === "poster") optStr = { artStyle };
    if (activeTab === "video") optStr = { cameraMovement };
    if (activeTab === "adcopy") optStr = { audience };

    const newItem: SavedResult = {
      id: Math.random().toString(36).substr(2, 9),
      type: activeTab,
      prompt: prompt,
      language: language,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      output: finalVal,
      tone: selectedTone,
      options: optStr
    };

    const updatedHistory = [newItem, ...history].slice(0, 20); // Keep max 20 entries
    setHistory(updatedHistory);
    localStorage.setItem("pcs_ai_history", JSON.stringify(updatedHistory));
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Delete an item from history
  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem("pcs_ai_history", JSON.stringify(updated));
  };

  // Load a saved content from history back into playground
  const handleLoadHistoryItem = (item: SavedResult) => {
    setActiveTab(item.type);
    setPrompt(item.prompt);
    setLanguage(item.language);
    setSelectedTone(item.tone);
    setIsEditing(false);
    
    if (item.type === "campaign") {
      try {
        const parsed = JSON.parse(item.output);
        setCampaignOutput(parsed);
        setSelectedCampaignCard("facebookCaption");
        setOutput(parsed.facebookCaption || "");
        setEditedOutput(parsed.facebookCaption || "");
      } catch (e) {
        // Fallback for plain text or broken JSON
        const fallback = {
          facebookCaption: item.output,
          hashtags: "#marketing #campaign #growth",
          posterPrompt: "Sleek product showcase poster for: " + item.prompt,
          videoPrompt: "Slow camera pan highlighting detailed close-ups for: " + item.prompt,
          adCopy: item.output,
          landingHeadline: "Elite conversion performance for " + item.prompt + " utilizing PCS AI Studio."
        };
        setCampaignOutput(fallback);
        setSelectedCampaignCard("facebookCaption");
        setOutput(item.output);
        setEditedOutput(item.output);
      }
    } else {
      setCampaignOutput(null);
      setOutput(item.output);
      setEditedOutput(item.output);
    }
    
    // Restore options safely
    if (item.options) {
      if (item.type === "caption") setPlatform(item.options.platform || "all-rounder");
      if (item.type === "poster") setArtStyle(item.options.artStyle || "photorealistic");
      if (item.type === "video") setCameraMovement(item.options.cameraMovement || "cinematic drone shot");
      if (item.type === "adcopy") setAudience(item.options.audience || "general consumer");
    }
  };

  return (
    <section id="playground" className="py-24 relative overflow-hidden bg-[#090a0f] border-t border-gray-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.05),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono tracking-widest text-[#06b6d4] uppercase">
            {isEn ? "Interactive Playground" : "ইন্টারেক্টিভ প্লেগ্রাউন্ড"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-2 mb-4">
            {isEn ? "Specialized AI Production Node" : "বিশেষায়িত এআই প্রোডাকশন নোড"}
          </h2>
          <p className="text-gray-400">
            {isEn 
              ? "Select an industrial template, customize parameters, and prompt our neural engine to create enterprise-ready copies and media blueprints."
              : "আপনার জন্য উপযুক্ত টেমপ্লেট নির্বাচন করুন, প্যারামিটার কাস্টমাইজ করুন এবং আমাদের এআই ইঞ্জিন দিয়ে হাই-কোয়ালিটি কন্টেন্ট তৈরি করুন।"}
          </p>
        </div>

        {/* Core Multi-Generator Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: INPUT BUILDER (WIDTH 7 COLUMNS) */}
          <div className="lg:col-span-7 bg-[#121420]/75 backdrop-blur-md rounded-2xl border border-gray-800/80 p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
            
            {/* Tool Selection Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-8 bg-[#090a0f]/60 p-1.5 rounded-xl border border-gray-800/60" id="tool-tabs">
              
              <button
                type="button"
                onClick={() => { setActiveTab("campaign"); setErrorMessage(""); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1.5 cursor-pointer col-span-2 sm:col-span-1 ${
                  activeTab === "campaign" 
                    ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] font-extrabold" 
                    : "text-gray-400 hover:text-gray-200"
                }`}
                id="tab-campaign"
              >
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-400 animate-pulse" />
                <span className="flex items-center gap-1">
                  <span>{isEn ? "Unified Campaign" : "সমন্বিত ক্যাম্পেইন"}</span>
                  <span className="bg-emerald-500/20 text-[8px] text-emerald-400 font-mono px-1 py-0.2 rounded-md">PRO</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab("caption"); setErrorMessage(""); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1.5 cursor-pointer ${
                  activeTab === "caption" 
                    ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                    : "text-gray-400 hover:text-gray-200"
                }`}
                id="tab-caption"
              >
                <MessageSquareCode className="w-4 h-4 shrink-0" />
                <span>{isEn ? "AI Caption" : "ক্যাপশন এআই"}</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab("poster"); setErrorMessage(""); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1.5 cursor-pointer ${
                  activeTab === "poster" 
                    ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                    : "text-gray-400 hover:text-gray-200"
                }`}
                id="tab-poster"
              >
                <ImageIcon className="w-4 h-4 shrink-0" />
                <span>{isEn ? "Poster Prompt" : "পোস্টার প্রম্পট"}</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab("video"); setErrorMessage(""); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1.5 cursor-pointer ${
                  activeTab === "video" 
                    ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                    : "text-gray-400 hover:text-gray-200"
                }`}
                id="tab-video"
              >
                <VideoIcon className="w-4 h-4 shrink-0" />
                <span>{isEn ? "Video Prompt" : "ভিডিও প্রম্পট"}</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab("adcopy"); setErrorMessage(""); }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all duration-300 flex flex-col items-center gap-1.5 cursor-pointer ${
                  activeTab === "adcopy" 
                    ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                    : "text-gray-400 hover:text-gray-200"
                }`}
                id="tab-adcopy"
              >
                <Megaphone className="w-4 h-4 shrink-0" />
                <span>{isEn ? "Ad Copy" : "বিজ্ঞাপন কপি"}</span>
              </button>

            </div>

            {/* Input Form */}
            <form onSubmit={handleGenerate} className="space-y-6">

              {/* PCS MULTI-LANGUAGE PROMPT ENGINE MODULE */}
              <div className="bg-[#181a2b]/40 backdrop-blur-md rounded-2xl border border-cyan-500/20 p-4 shadow-[inner_0_0_12px_rgba(6,182,212,0.05)] space-y-3.5" id="multi-lang-engine-panel">
                
                {/* Header and Telemetry Status Indicators */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-900 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping shrink-0" />
                    <span className="text-[10px] font-mono font-black text-cyan-400 tracking-wider uppercase">
                      🌐 MULTI-LANGUAGE PROMPT ENGINE
                    </span>
                  </div>
                  
                  {/* Active engine badges */}
                  <div className="flex flex-wrap gap-2 select-none">
                    <span className="inline-flex items-center gap-1 text-[8px] font-mono font-bold text-[#10b981] bg-emerald-950/20 border border-emerald-850/40 px-2 py-0.5 rounded-full shadow-[0_0_6px_rgba(16,185,129,0.1)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {localizedLabels[selectedLanguage]?.statusActive || localizedLabels.en.statusActive}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[8px] font-mono font-bold text-cyan-400 bg-cyan-950/20 border border-cyan-850/45 px-2 py-0.5 rounded-full shadow-[0_0_6px_rgba(6,182,212,0.1)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      {localizedLabels[selectedLanguage]?.statusQuota || localizedLabels.en.statusQuota}
                    </span>
                  </div>
                </div>

                {/* Language Action Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
                  
                  {/* Selector Dropdown with Cyber Styling */}
                  <div className="sm:col-span-5 space-y-1">
                    <label className="block text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                      Select Active Input Core:
                    </label>
                    <div className="relative group">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => handleLanguageChange(e.target.value as any)}
                        className="w-full bg-[#080911]/90 border border-gray-750/80 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400 cursor-pointer transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:border-gray-500/80"
                      >
                        <option value="en">🇺🇸 English Prompt Console</option>
                        <option value="bn">🇧🇩 Bengali / বাংলা পোর্টাল</option>
                        <option value="hi">🇮🇳 Hindi / हिन्दी सर्वर</option>
                        <option value="ar">🇸🇦 Arabic / العربية المحرك</option>
                        <option value="es">🇪🇸 Spanish / Español Nodo</option>
                      </select>
                      {/* Glowing Accent strip underneath select */}
                      <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-gradient-to-r from-cyan-500 to-emerald-400 opacity-40 blur-[0.5px]" />
                    </div>
                  </div>

                  {/* Info Text block explaining instant load behavior */}
                  <div className="sm:col-span-7 bg-black/35 rounded-xl border border-gray-900/60 p-2 text-[10px] text-gray-400 leading-normal font-sans">
                    <span className="text-[8.5px] font-mono text-cyan-400 block font-bold uppercase tracking-wide mb-0.5">
                      💡 LOCAL PORTAL INTERACTION:
                    </span>
                    Selecting a language updates headers below. Click a quick template to pop corresponding structure directly into the sandbox.
                  </div>
                </div>

                {/* Quick Preset Quick Clicks */}
                <div className="space-y-1.5 pt-1">
                  <span className="block text-[8.5px] font-mono text-gray-500 uppercase tracking-widest">
                    Quick Load Translating Templates:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGE_PRESETS.map((preset) => {
                      const isActive = selectedLanguage === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setPrompt(preset.promptText);
                            handleLanguageChange(preset.id);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer border ${
                            isActive 
                              ? "bg-gradient-to-r from-cyan-500/15 to-emerald-500/15 border-cyan-400/65 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)] scale-[1.01]" 
                              : "bg-[#090a10]/50 border-gray-900 text-gray-400 hover:text-white hover:border-gray-700/60 hover:shadow-[0_0_8px_rgba(255,255,255,0.03)]"
                          }`}
                        >
                          <span className="text-[11.5px] select-none">{preset.flag}</span>
                          <span>{preset.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
              
              {/* Core Idea Prompt Input */}
              <div>
                <label className="block text-xs font-mono font-medium text-gray-400 tracking-wider uppercase mb-2">
                  {localizedLabels[selectedLanguage]?.step1 || localizedLabels.en.step1}
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      activeTab === "campaign"
                        ? (isEn ? "Enter your business idea/topic (e.g., launch eco-friendly handmade bamboo toothbrush with premium organic bristles or organic food delivery in Dhaka city)..." : "আপনার ব্যবসায়িক ধারণা বা টপিকটি লিখুন (যেমন: পরিবেশবান্ধব বাঁশের টুথব্রাশ অথবা ঢাকা শহরে অর্গানিক খাবার ডেলিভারি স্টার্টআপ)...")
                        : activeTab === "caption"
                        ? (isEn ? "Describe your photo/video/topic (e.g., launching my new coffee shop in Dhaka with organic beans)..." : "আপনার ছবি/ভিডিও/বিষয়বস্তু বর্ণনা করুন (যেমন: ঢাকায় নতুন অর্গানिक কফি শপের শুভ উদ্বোধন)...")
                        : activeTab === "poster"
                        ? (isEn ? "Describe your poster topic (e.g., retro futuristic cyber-bazaar with glowing neon storefronts)..." : "আপনার পোস্টারটির ধারণা দিন (যেমন: সাইবারপাঙ্ক শহরের রঙিন রাতের বাজার এবং আলো ঝলমলে সাইনবোর্ড)...")
                        : activeTab === "video"
                        ? (isEn ? "Describe your cinematic video scene (e.g., ancient historical temple hidden in deep misty jungles)..." : "আপনার ভিডিও দৃশ্যের বিবরণ দিন (जैसे: कुहासायुक्त वन के गहरे क्षेत्र में प्राचीन मंदिर)...")
                        : (isEn ? "Describe your product/service features (e.g., next-generation smart water bottle that track hydration in real-time)..." : "আপনার পণ্য/সার্ভিসের বিবরণ দিন (যেমন: পরবর্তী প্রজন্মের স্মার্ট ওয়াটার বোতল যা পানির চাহিদার হিসেব রাখে)...")
                    }
                    className="w-full bg-[#090a0f]/85 border border-gray-800 focus:border-cyan-400/60 rounded-xl p-4 text-sm text-gray-100 placeholder-gray-500 outline-none transition-all duration-300 shadow-inner focus:ring-1 focus:ring-cyan-500/25"
                    id="playground-input"
                  />
                  <div className="absolute right-3.5 bottom-3 text-[10px] font-mono text-gray-600">
                    {prompt.length} / 1000
                  </div>
                </div>
              </div>

              {/* Advanced Parameters section */}
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-gray-900 pb-2">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase">
                    {isEn ? "STEP 2: Fine-Tune AI Parameters" : "ধাপ ২: এআই প্যারামিটার সমন্বয় করুন"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Common: Tone Selector */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                      {isEn ? "Output Tone Style" : "আউটপুট টোন স্টাইল"}
                    </label>
                    <select
                      value={selectedTone}
                      onChange={(e) => setSelectedTone(e.target.value)}
                      className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-300 outline-none focus:border-emerald-500/65"
                      id="param-tone"
                    >
                      {TONES.map((tone) => (
                        <option key={tone.id} value={tone.id}>
                          {tone.emoji} {isEn ? tone.nameEn : tone.nameBn}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dynamic: Specific sub options */}
                  {activeTab === "caption" && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                        {isEn ? "Social Media Platform" : "সোশ্যাল মিডিয়া প্লাটফর্ম"}
                      </label>
                      <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-300 outline-none focus:border-emerald-500/65"
                        id="param-platform"
                      >
                        <option value="all-rounder">✨ All-Rounder (Viral Blend)</option>
                        <option value="facebook">👥 Facebook (Enriched Story)</option>
                        <option value="instagram">📸 Instagram (Minimal & Aesthetic)</option>
                        <option value="linkedin">💼 LinkedIn (Professional B2B)</option>
                        <option value="tiktok">🎵 TikTok / YouTube Shorts</option>
                      </select>
                    </div>
                  )}

                  {activeTab === "poster" && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                        {isEn ? "Art Visual Style" : "আর্ট ভিজ্যুয়াল স্টাইল"}
                      </label>
                      <select
                        value={artStyle}
                        onChange={(e) => setArtStyle(e.target.value)}
                        className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-300 outline-none focus:border-emerald-500/65"
                        id="param-artstyle"
                      >
                        <option value="photorealistic">📸 Photorealistic Studio Portrait</option>
                        <option value="cyberpunk">🌃 Cyberpunk Cityscape</option>
                        <option value="3D-isometric">📦 3D Isometric Minimal Vector</option>
                        <option value="oil-painting">🎨 Expressive Classical Oil Painting</option>
                        <option value="corporate-flat-vector">🏢 Clean Modern Flat Editorial Illustrator</option>
                        <option value="vintage-retro">📺 Retro Vintage 80s Synthwave Poster</option>
                      </select>
                    </div>
                  )}

                  {activeTab === "video" && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                        {isEn ? "Camera Orbit & Movement" : "ক্যামেরা মুভমেন্ট ও ডিরেকশন"}
                      </label>
                      <select
                        value={cameraMovement}
                        onChange={(e) => setCameraMovement(e.target.value)}
                        className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-300 outline-none focus:border-emerald-500/65"
                        id="param-camera"
                      >
                        <option value="cinematic drone shot">🛰️ Panoramic Slow Cinematic drone lift</option>
                        <option value="smooth gimbal dolly">🎥 Dolly zoom-in with shallow depth of field</option>
                        <option value="extreme slow motion">⏱️ Extreme 1000fps slow-motion water splash physics</option>
                        <option value="high-speed orbit">🏎️ Dynamic high-velocity orbit motion wrap</option>
                        <option value="action handheld jolt">🏃 Handheld camera shakes, intense first person focus</option>
                      </select>
                    </div>
                  )}

                  {activeTab === "adcopy" && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                        {isEn ? "Primary Target Demographics" : "মূল টার্গেট অডিয়েন্স"}
                      </label>
                      <select
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-300 outline-none focus:border-emerald-500/65"
                        id="param-audience"
                      >
                        <option value="general consumer">🌍 General Lifestyle Consumer</option>
                        <option value="enterprise-executives">👔 Bold Corporate Directors & Deciders</option>
                        <option value="gen-z-youth">⚡ Trend-Obsessed Gen-Z Social Active</option>
                        <option value="tech-enthusiasts">💻 Developers, Creators & Early Tech-adopters</option>
                        <option value="health-fitness">🏋️ Health Seekers, Dedicated Gym & Wellness Fans</option>
                      </select>
                    </div>
                  )}

                  {activeTab === "campaign" && (
                    <div className="col-span-1 sm:col-span-2 bg-emerald-500/5 rounded-xl border border-emerald-500/15 p-4 flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                          {isEn ? "All-In-One Enterprise Production Mode" : "সমন্বিত এন্টারপ্রাইজ ক্যাম্পেইন মোড"}
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-1 mt-1.5 leading-relaxed font-sans">
                          {isEn 
                            ? "Generates high-converting Facebook sales captions, viral social media hashtags, photorealistic Midjourney poster prompts, cinematic drone video instructions, and structured AIDA landing copy in a single unified operation."
                            : "একটি মাত্র ক্লিকেই ফেসবুক সেলস ক্যাপশন, টার্গেটেড হ্যাশট্যাগ মেম্বারশিপ, মিডজার্নি বা লুমো পোস্টার প্রম্পট, সিনেমাটিক ড্রোন শট ভিডিও সিনারিও এবং রিটেন বিজ্ঞাপন ড্রাফট এআই দিয়ে ডিজাইন করুন।"}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Error Alert Box */}
              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg p-3 flex items-center gap-2 font-sans" id="err-log">
                  <X className="w-4 h-4 shrink-0" onClick={() => setErrorMessage("")} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* GENERATE BUTTON CONCURRENTLY EMBEDDING PROGRESS INDICATOR */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isGenerating || quotaLimitExceeded}
                  className={`w-full py-4.5 px-6 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer ${
                    isGenerating || quotaLimitExceeded
                      ? "bg-slate-800 border border-slate-700 text-gray-500 shadow-none cursor-not-allowed"
                      : "bg-[#090a0f] border border-[#06b6d4]/40 hover:border-[#06b6d4] text-[#06b6d4] hover:text-[#090a0f] hover:bg-emerald-400 font-sans tracking-wide glow-button ease-out duration-300"
                  }`}
                  id="generate-button"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2.5 text-xs text-cyan-400 font-mono">
                      <Cpu className="w-5 h-5 animate-spin shrink-0 text-cyan-400" />
                      <span className="animate-pulse">{activeSteps[currentStepIndex]}</span>
                    </div>
                  ) : quotaLimitExceeded ? (
                    <div className="flex items-center gap-2 text-xs text-red-400 font-mono font-bold uppercase tracking-wider animate-pulse">
                      <Lock className="w-4 h-4 text-red-500" />
                      <span>{isEn ? "Monthly Limit Reached - Upgrade To Continue" : "মাসিক লিমিট শেষ - সচল রাখতে আপগ্রেড করুন"}</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {isEn ? "GENERATE INSIGHTS VIA PCS ENGINE" : "পিসিএস ইঞ্জিনে ডিজাইন জেনারেট করুন"}
                      </span>
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Safe Lightweight Monthly Prompt Limit Tracker Console */}
            <div className="mt-6">
              <SaaSPromptLimitTracker 
                isEn={isEn}
                onOpenDashboard={onOpenDashboard}
                onLimitCheck={(isReached) => setQuotaLimitExceeded(isReached)}
                triggerCount={triggerCount}
              />
            </div>

            <div className="mt-8 border-t border-gray-900 pt-6">
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span>PCS AI V1.5 // ONLINE</span>
                <span>ENG & BN SYNTACTIC PARSER</span>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: PREVIEW & OUTPUT BOX (WIDTH 5 COLUMNS) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Main Interactive Output Frame */}
            <div className="bg-[#121420]/75 backdrop-blur-md rounded-2xl border border-gray-800/80 p-6 flex flex-col min-h-[460px] relative shadow-2xl">
              
              {/* Output Header */}
              <div className="flex items-center justify-between border-b border-gray-900 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider text-gray-300 uppercase">
                    {isEn ? "Generated Blueprint" : "জেনারেটেড আউটপুট"}
                  </span>
                </div>

                {output && (
                  <div className="flex items-center gap-1.5 bg-[#090a0f]/50 p-1 rounded-lg border border-gray-800">
                    {/* Toggle Text Editor mode */}
                    <button
                      onClick={() => {
                        setEditedOutput(editedOutput || output);
                        setIsEditing(!isEditing);
                      }}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        isEditing 
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                          : "text-gray-400 hover:text-white"
                      }`}
                      title={isEn ? "Line Editor Mode" : "এডিট মুড"}
                      id="btn-toggle-edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded text-gray-400 hover:text-white cursor-pointer"
                      title={isEn ? "Copy to Clipboard" : "কপি করুন"}
                      id="btn-copy"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={handleDownload}
                      className="p-1.5 rounded text-gray-400 hover:text-white cursor-pointer"
                      title={isEn ? "Download Content (.txt)" : "ডাউনলোড ফাইল"}
                      id="btn-download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={handleSaveToHistory}
                      className="p-1.5 rounded text-gray-400 hover:text-white cursor-pointer"
                      title={isEn ? "Save to History Log" : "হিস্টরিতে সংরক্ষণ করুন"}
                      id="btn-save"
                    >
                      <Save className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* Actual Content Wrapper */}
              <div className="flex-1 flex flex-col justify-between overflow-y-auto max-h-[360px] pr-1">
                {isGenerating ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin mb-4" />
                    <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-widest font-mono">
                      {isEn ? "PCS Engine Working" : "পিসিএস ইঞ্জিন চলমান"}
                    </h4>
                    <p className="text-xs text-gray-400 max-w-xs mt-2">
                      {isEn 
                        ? "Contacting internal language nodes and styling responsive markdown headers..." 
                        : "আমাদের ভাষা নেটওয়ার্ক প্রসেস করা হচ্ছে এবং প্রতিক্রিয়া ফরম্যাট করা হচ্ছে..."}
                    </p>
                  </div>
                ) : output ? (
                  <div className="flex-1">
                    {isEditing ? (
                      <textarea
                        rows={12}
                        value={editedOutput}
                        onChange={(e) => setEditedOutput(e.target.value)}
                        className="w-full h-full min-h-[250px] bg-[#090a0f] border border-gray-800 rounded-lg p-3 text-xs md:text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-cyan-400/50 resize-y font-mono"
                        id="output-editor"
                      />
                    ) : (
                      <div className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans prose prose-invert prose-emerald max-w-none" id="output-rendered">
                        <ReactMarkdown>{output}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-800 rounded-xl bg-[#090a0f]/40">
                    <Sparkles className="w-8 h-8 text-gray-600 mb-2.5" />
                    <span className="text-xs text-gray-400 font-medium">
                      {isEn ? "Your generated draft will appear here." : "আপনার তৈরি করা কন্টেন্টটি এখানে দেখতে পাবেন।"}
                    </span>
                    <p className="text-[10px] text-gray-600 mt-1 max-w-[200px]">
                      {isEn 
                        ? "Enter prompt description on the left panel to begin creation cycle." 
                        : "শুরু করতে বাম পাশের প্যানেলে আপনার বর্ণনামূলক বাক্যটি লিখুন।"}
                    </p>
                  </div>
                )}
              </div>

              {/* Toast Messages inside Preview frame */}
              <AnimatePresence>
                {isCopied && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-4 left-4 bg-emerald-500 text-black text-xs font-bold font-sans py-1.5 px-3 rounded-lg shadow-lg flex items-center gap-1.5"
                    id="toast-copied"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isEn ? "Copied to Clipboard!" : "ক্লিপবোর্ডে কপি হয়েছে!"}</span>
                  </motion.div>
                )}

                {saveSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-4 left-4 bg-cyan-400 text-[#090a0f] text-xs font-bold font-sans py-1.5 px-3 rounded-lg shadow-lg flex items-center gap-1.5"
                    id="toast-saved"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{isEn ? "Successfully Saved!" : "হিস্টরিতে সেভ করা হয়েছে!"}</span>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Unified Campaign Content Cards Deck */}
            {activeTab === "campaign" && campaignOutput && (
              <div className="flex flex-col gap-3.5" id="campaign-cards-deck">
                <div className="flex items-center gap-2 px-1 text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{isEn ? "Marketing Deliverables (6 Cards)" : "৬টি সমন্বিত ক্যাম্পেইন কন্টেন্ট"}</span>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {/* Card 1: Facebook Sales Caption */}
                  <button
                    type="button"
                    onClick={() => handleCardSelect("facebookCaption")}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                      selectedCampaignCard === "facebookCaption"
                        ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/50 shadow-[0_4px_15px_rgba(16,185,129,0.15)]"
                        : "bg-[#121420]/55 border-[#121420] border-gray-800/80 hover:border-gray-755 hover:bg-[#121420]/80"
                    }`}
                    id="campaign-card-fb"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-[#090a0f]/80 rounded-lg text-emerald-400 border border-gray-800">
                          <MessageSquareCode className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wide font-sans">
                            {isEn ? "Facebook Sales Caption" : "ফেসবুক ক্যাপশন ও সেলস স্টোরি"}
                          </h4>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {isEn ? "Engaging narrative + CTA" : "আকর্ষণীয় সেলস স্টোরি ও কল-টু-অ্যাকশন"}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-400 py-0.5 px-2 rounded-full border border-emerald-500/20">
                        {isEn ? "Facebook" : "ফেসবুক"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                      {campaignOutput.facebookCaption}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-gray-800/40 flex items-center justify-between text-[11px] font-mono text-gray-500">
                      <span>{isEn ? "Format: Social Copy" : "কপি টাইপ: সোশ্যাল ক্যাপশন"}</span>
                      <span className="text-[#06b6d4] font-bold group-hover:underline flex items-center gap-1">
                        {isEn ? "Select To View/Edit" : "সিলেক্ট করে লাইভ এডিট করুন"} <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>

                  {/* Card 2: Marketing Hashtags */}
                  <button
                    type="button"
                    onClick={() => handleCardSelect("hashtags")}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                      selectedCampaignCard === "hashtags"
                        ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/50 shadow-[0_4px_15px_rgba(16,185,129,0.15)]"
                        : "bg-[#121420]/55 border-[#121420] border-gray-800/80 hover:border-gray-755 hover:bg-[#121420]/80"
                    }`}
                    id="campaign-card-tags"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-[#090a0f]/80 rounded-lg text-emerald-400 border border-gray-800">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wide font-sans">
                            {isEn ? "Viral Marketing Hashtags" : "ভাইরাল সোশ্যাল হ্যাশট্যাগ ম্যাট্রিক্স"}
                          </h4>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {isEn ? "Targeted discovery hashtags" : "টার্গেটেড সোশ্যাল হ্যাশট্যাগ"}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-400 py-0.5 px-2 rounded-full border border-emerald-500/20">
                        {isEn ? "SEO Tags" : "ট্যাগস"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 line-clamp-1 leading-relaxed font-mono">
                      {campaignOutput.hashtags}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-gray-800/40 flex items-center justify-between text-[11px] font-mono text-gray-500">
                      <span>{isEn ? "Format: Social Discovery" : "কপি টাইপ: ভাইরাল কিওয়ার্ডস"}</span>
                      <span className="text-[#06b6d4] font-bold group-hover:underline flex items-center gap-1">
                        {isEn ? "Select To View/Edit" : "সিলেক্ট করে লাইভ এডিট করুন"} <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>

                  {/* Card 3: AI Poster Prompt */}
                  <button
                    type="button"
                    onClick={() => handleCardSelect("posterPrompt")}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                      selectedCampaignCard === "posterPrompt"
                        ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/50 shadow-[0_4px_15px_rgba(16,185,129,0.15)]"
                        : "bg-[#121420]/55 border-[#121420] border-gray-800/80 hover:border-gray-755 hover:bg-[#121420]/80"
                    }`}
                    id="campaign-card-poster"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-[#090a0f]/80 rounded-lg text-emerald-400 border border-gray-800">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wide font-sans">
                            {isEn ? "AI Poster Prompt" : "এআই পোস্টার প্রম্পট জেনারেটর"}
                          </h4>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {isEn ? "Midjourney / DALL-E 3 syntax" : "মিডজার্নি ও ডাল-ই প্রফেশনাল আর্ট"}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-400 py-0.5 px-2 rounded-full border border-emerald-500/20">
                        {isEn ? "Midjourney" : "পোস্টার প্রম্পট"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed font-mono italic">
                      {campaignOutput.posterPrompt}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-gray-800/40 flex items-center justify-between text-[11px] font-mono text-gray-500">
                      <span>{isEn ? "Format: Visual Prompt" : "কপি টাইপ: ইমেজ প্রম্পট"}</span>
                      <span className="text-[#06b6d4] font-bold group-hover:underline flex items-center gap-1">
                        {isEn ? "Select To View/Edit" : "সিলেক্ট করে লাইভ এডিট করুন"} <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>

                  {/* Card 4: AI Video Prompt */}
                  <button
                    type="button"
                    onClick={() => handleCardSelect("videoPrompt")}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                      selectedCampaignCard === "videoPrompt"
                        ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/50 shadow-[0_4px_15px_rgba(16,185,129,0.15)]"
                        : "bg-[#121420]/55 border-[#121420] border-gray-800/80 hover:border-gray-755 hover:bg-[#121420]/80"
                    }`}
                    id="campaign-card-video"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-[#090a0f]/80 rounded-lg text-emerald-400 border border-gray-800">
                          <VideoIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wide font-sans">
                            {isEn ? "Cinematic Video Prompt" : "সিনেমাটিক ভিডিও প্রম্পট নির্দেশিকা"}
                          </h4>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {isEn ? "Sora / Runway motion specs" : "লুমা ও সরা জেনারেশন ডিরেক্টরি"}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-400 py-0.5 px-2 rounded-full border border-emerald-500/20">
                        {isEn ? "Sora/Veo" : "ভিডিও প্রম্পট"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed font-mono italic">
                      {campaignOutput.videoPrompt}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-gray-800/40 flex items-center justify-between text-[11px] font-mono text-gray-500">
                      <span>{isEn ? "Format: Camera Movement" : "কপি টাইপ: সরা ভিডিও স্ক্রিপ্ট"}</span>
                      <span className="text-[#06b6d4] font-bold group-hover:underline flex items-center gap-1">
                        {isEn ? "Select To View/Edit" : "সিলেক্ট করে লাইভ এডিট করুন"} <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>

                  {/* Card 5: Professional Ad Copy */}
                  <button
                    type="button"
                    onClick={() => handleCardSelect("adCopy")}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                      selectedCampaignCard === "adCopy"
                        ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/50 shadow-[0_4px_15px_rgba(16,185,129,0.15)]"
                        : "bg-[#121420]/55 border-[#121420] border-gray-800/80 hover:border-gray-755 hover:bg-[#121420]/80"
                    }`}
                    id="campaign-card-ad"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-[#090a0f]/80 rounded-lg text-emerald-400 border border-gray-800">
                          <Megaphone className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wide font-sans">
                            {isEn ? "High-Converting Ad Copy" : "হাই-কনভার্টিং বিজ্ঞাপন কপি স্ক্রিপ্ট"}
                          </h4>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {isEn ? "Structured sales-inducing layout" : "অডিয়েন্স রিটেনশন এআইডিএ কপি"}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-400 py-0.5 px-2 rounded-full border border-emerald-500/20">
                        {isEn ? "Ad Copy" : "বিজ্ঞাপন"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                      {campaignOutput.adCopy}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-gray-800/40 flex items-center justify-between text-[11px] font-mono text-gray-500">
                      <span>{isEn ? "Format: AIDA Copywriter" : "কপি টাইপ: এআইডিএ স্ট্রাকচারড"}</span>
                      <span className="text-[#06b6d4] font-bold group-hover:underline flex items-center gap-1">
                        {isEn ? "Select To View/Edit" : "সিলেক্ট করে লাইভ এডিট করুন"} <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>

                  {/* Card 6: Landing Page Headline */}
                  <button
                    type="button"
                    onClick={() => handleCardSelect("landingHeadline")}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                      selectedCampaignCard === "landingHeadline"
                        ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/50 shadow-[0_4px_15px_rgba(16,185,129,0.15)]"
                        : "bg-[#121420]/55 border-[#121420] border-gray-800/80 hover:border-gray-755 hover:bg-[#121420]/80"
                    }`}
                    id="campaign-card-landing"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-[#090a0f]/80 rounded-lg text-[#06b6d4] border border-gray-800">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wide font-sans">
                            {isEn ? "Landing Page Headline" : "ল্যান্ডিং পেজ হেডলাইন ও স্লোগান"}
                          </h4>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {isEn ? "High-impact conversion hero copy" : "ভিজিটরদের গ্রাহকে রূপান্তরের প্রিমিয়াম কপি"}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono bg-cyan-500/15 text-[#06b6d4] py-0.5 px-2 rounded-full border border-cyan-500/20">
                        {isEn ? "Web Headline" : "ওয়েবসাইট"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                      {campaignOutput.landingHeadline}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-gray-800/40 flex items-center justify-between text-[11px] font-mono text-gray-500">
                      <span>{isEn ? "Format: Headline & Hook" : "কপি টাইপ: হাই-কনভার্টিং হেডলাইন"}</span>
                      <span className="text-[#06b6d4] font-bold group-hover:underline flex items-center gap-1">
                        {isEn ? "Select To View/Edit" : "সিলেক্ট করে লাইভ এডিট করুন"} <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* History Panel (Saves up to 20 designs pure client side) */}
            <div className="bg-[#121420]/75 backdrop-blur-md rounded-2xl border border-gray-800/80 p-5 flex flex-col shadow-lg">
              <div className="flex items-center justify-between border-b border-gray-900 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-mono font-bold tracking-wider text-gray-300 uppercase">
                    {isEn ? "Saved History Log" : "সংরক্ষিত হিস্টরি"}
                  </span>
                </div>
                <span className="text-[10px] bg-gray-950 px-2 py-0.5 rounded border border-gray-900 text-gray-500 font-mono">
                  {history.length} {isEn ? "Items" : "টি সামগ্রী"}
                </span>
              </div>

              {history.length > 0 ? (
                <div className="max-h-[140px] overflow-y-auto space-y-2.5 pr-1" id="history-items-container">
                  {history.map((hist) => (
                    <div 
                      key={hist.id} 
                      className="bg-[#090a0f]/60 p-2.5 rounded-lg border border-gray-800/80 hover:border-gray-700 hover:bg-[#090a0f]/90 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div 
                        onClick={() => handleLoadHistoryItem(hist)}
                        className="flex-1 min-w-0 cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] font-mono tracking-widest font-bold uppercase text-emerald-400 bg-emerald-500/5 px-1 py-0.2 rounded border border-emerald-500/15">
                            {hist.type}
                          </span>
                          <span className="text-[8px] font-mono text-gray-500">
                            {hist.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-300 truncate font-sans">
                          {hist.prompt}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteHistoryItem(hist.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-1 rounded hover:bg-red-500/5 transition-all cursor-pointer"
                        title={isEn ? "Delete Log Entry" : "মুছে ফেলুন"}
                        id={`delete-hist-${hist.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-600 text-xs font-sans">
                  {isEn ? "No saved items. Click save on output preview." : "কোনো সংরক্ষিত আইটেম নেই।"}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Premium Corporate Launch Campaign Blueprints Module */}
        <div className="mt-16 pt-16 border-t border-gray-950">
          <SaaSPremiumTemplates 
            isEn={isEn} 
            onSelectTemplate={(pText, tabType) => {
              setPrompt(pText);
              setActiveTab(tabType);
              setErrorMessage("");
            }} 
            onOpenDashboard={onOpenDashboard}
          />
        </div>

        {/* Military Grade Google Sheets CRM Lead Capture Layer */}
        <div className="mt-16 pt-16 border-t border-gray-950">
          <SaaSLeadCaptureCRM isEn={isEn} />
        </div>

      </div>
    </section>
  );
}
