import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Video as VideoIcon, 
  Sparkles, 
  Film, 
  Clock, 
  Smartphone, 
  FolderLock, 
  CheckCircle, 
  FolderHeart, 
  RefreshCw,
  Info,
  Play,
  Pause,
  Download,
  Trash2,
  Image as ImageIcon,
  Plus,
  X,
  Tv,
  Cpu,
  Layers,
  History,
  Eye,
  Sliders,
  FileText
} from "lucide-react";
import { UserProject, Language } from "../types";

interface VideoGeneratorModuleProps {
  language: string;
  isEn: boolean;
  projects: UserProject[];
  setProjects: React.Dispatch<React.SetStateAction<UserProject[]>>;
  saveProjectsToCloud: (updated: UserProject[]) => void;
  logDashboardActivity: (type: string, descEn: string, descBn: string) => void;
  recordGenerationCost: (spentCost: number, nextCredits: number, nextGenCount: number) => Promise<void>;
  creditsUsed: number;
  generatedCount: number;
}

interface CompletedRender {
  id: string;
  concept: string;
  style: string;
  platform: string;
  duration: string;
  timestamp: string;
  prompt: string;
  previewColor: string;
  storyboards: Array<{ title: string; desc: string }>;
}

export const VideoGeneratorModule: React.FC<VideoGeneratorModuleProps> = ({
  language,
  isEn,
  projects,
  setProjects,
  saveProjectsToCloud,
  logDashboardActivity,
  recordGenerationCost,
  creditsUsed,
  generatedCount,
}) => {
  // Option Selectors States
  const [coreConcept, setCoreConcept] = useState("");
  const [cinematicStyle, setCinematicStyle] = useState("Hyper Realistic");
  const [duration, setDuration] = useState("30 sec");
  const [platform, setPlatform] = useState("YouTube Shorts");
  
  // Image Context Dropzone States
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab View for Output Area: "prompt" | "render" | "history"
  const [activeRightTab, setActiveRightTab] = useState<"prompt" | "render" | "history">("prompt");

  // Compiler State
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Simulated Renderer States
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStatus, setRenderStatus] = useState("Initializing renderer...");
  const [renderIntervalId, setRenderIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [hasCompletedRender, setHasCompletedRender] = useState(false);
  
  // Video Player Simulation States
  const [isPlayingSimulation, setIsPlayingSimulation] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [storyboards, setStoryboards] = useState<Array<{ title: string; desc: string }>>([]);

  // Render History List
  const [renderHistory, setRenderHistory] = useState<CompletedRender[]>([]);

  // Cinematic Style Metadata
  const stylesMetadata = {
    "Hyper Realistic": {
      desc: isEn ? "Ultra-rich textures, photorealistic raytracing, high-fidelity lens optics." : "বাস্তবধর্মী টেক্সচার, ফোটোরিয়ালিস্টিক রে-ট্রেসিং এবং শার্প লেন্স ফোকাস।",
      keyword: "photorealistic IMAX 8k, raytraced volumetric lighting, masterfully captured subsurface scattering, high-end RED camera lensing, rich cinematic textures",
      color: "from-cyan-500 to-blue-600"
    },
    "Corporate Ad": {
      desc: isEn ? "Sleek, highly styled modern business look with clean corporate presentation keys." : "মডার্ন বিজনেস প্রেজেন্টেশন, মসৃণ ট্রানজিশন এবং প্রফেশনাল কর্পোরেট লাইটিং।",
      keyword: "slick high-end executive look, modern minimal architecture, commercial studio 4k lighting, vibrant clean palettes, premium corporate aesthetics, professional visual flow",
      color: "from-emerald-400 to-teal-600"
    },
    "VFX Promo": {
      desc: isEn ? "Explosive volumetric particles, dramatic glows, cosmic visual effects." : "উত্তেজনাপূর্ণ পার্টিকেল ইফেক্টস, ড্রামাটিক গ্লো এবং আকর্ষণীয় ভিজ্যুয়াল ইফেক্টস।",
      keyword: "epic action sci-fi Unreal Engine 5 render, volumetric particle simulation, glowing energy lines, spectacular VFX compositing, moody dark cyberpunk contrasting lights",
      color: "from-purple-500 to-pink-600"
    },
    "Ultra HD 8K": {
      desc: isEn ? "Maximum image resolution, deep textures, cinematic depth, and raw clarity." : "সর্বোচ্চ ৮কে রেজোলিউশন, গভীর টেক্সচার এবং সিনেমাটিক ডেপথ অব ফিল্ড।",
      keyword: "raw photo detailed 8k format, pristine high dynamic range HDR, intricate micro-details, absolute clarity, 35mm master lens framing, balanced cinema aesthetics",
      color: "from-amber-400 to-orange-600"
    },
    "Product Showcase": {
      desc: isEn ? "Centering dynamic camera movement and close-up focus on luxury details." : "বিলাসবহুল প্রোডাক্ট ক্লোজ-আপ, ৩৬০ ডিগ্রী ক্যামেরা অ্যান্ড লাইট ফোকাস।",
      keyword: "centered macro product styling, studio lighting setup, elegant rotating showcase, dramatic gold highlighting, pristine clean glass and metallic textures, high-gloss micro focus",
      color: "from-rose-500 to-orange-500"
    }
  };

  // Load Render History on Mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("pcs_video_render_history");
      if (storedHistory) {
        setRenderHistory(JSON.parse(storedHistory));
      }
    } catch (err) {
      console.error("Failed to load render history:", err);
    }
  }, []);

  // Sync playback simulation slider progress
  useEffect(() => {
    if (isPlayingSimulation) {
      playbackIntervalRef.current = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            return 0; // Loop playback
          }
          return prev + 1.5;
        });
      }, 100);
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    }

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlayingSimulation]);

  // Clean active rendering timer on unmount
  useEffect(() => {
    return () => {
      if (renderIntervalId) {
        clearInterval(renderIntervalId);
      }
    };
  }, [renderIntervalId]);

  // Handle Drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      loadImageFile(file);
    }
  };

  const handleManualFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImageFile(file);
    }
  };

  const loadImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string);
      logDashboardActivity(
        "video_image_context_added", 
        `Added reference image to video dropzone: ${file.name}`, 
        `ইমেজ গাইডেন্স রেফারেন্স হিসেবে যুক্ত করেছেন: ${file.name}`
      );
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImageRef = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Compile prompt based on inputs
  const handleCompilePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coreConcept.trim()) return;

    setIsCompiling(true);
    
    setTimeout(() => {
      const selectedStyleData = stylesMetadata[cinematicStyle as keyof typeof stylesMetadata];
      const styleKeywords = selectedStyleData ? selectedStyleData.keyword : "cinematic shot, 4k ultra visual";
      
      const imgRefSection = previewImage 
        ? `\n\n[Guiding Image Texture Constraints]\n- Reference Frame Texture: Engaged and mapped onto focal meshes safely.` 
        : "";

      // Multi-layer structured prompt composition
      const compiledText = `[Video Storyboard Concept]
Platform Format: ${platform}
Estimated Duration: ${duration}
Aesthetic Style: ${cinematicStyle}

[Camera Directions & Framing]
- Lens Specification: 50mm cinematic Prime, shallow depth of field.
- Visual Texture: ${styleKeywords}.
- Camera Motion Sequence: 3D orbital sweeping track around the focal subject, smoothly shifting to a macro close-up focus pull.${imgRefSection}

[Core Scene & Action Flow]
"A highly captivating presentation: ${coreConcept.trim()}. Seamless transition elements with micro-gravity dust specs and ambient cinematic atmosphere."

--ar 16:9 --v 6.0`;

      setGeneratedPrompt(compiledText);
      setIsCompiling(false);
      setActiveRightTab("prompt");
      recordGenerationCost(2, creditsUsed + 2, generatedCount + 1); // Record nominal generation cost to sync dashboard statistics
      logDashboardActivity("video_compile", `Compiled cinematic video storyboard prompt for ${platform}`, `ভিডিও স্টোরিবোর্ড প্রম্পট তৈরি করেছেন: ${platform}`);
    }, 750);
  };

  // Start simulated render function
  const handleStartSimulatedRender = () => {
    if (!generatedPrompt) return;
    
    setActiveRightTab("render");
    setIsRendering(true);
    setRenderProgress(0);
    setRenderStatus(isEn ? "Initializing neural sandbox frame environment..." : "এআই নিউরাল স্যান্ডবক্স ফ্রেম যুক্ত করা হচ্ছে...");
    setHasCompletedRender(false);
    setIsPlayingSimulation(false);

    const statuses = isEn ? [
      { progress: 15, label: "Analyzing concept semantics & platform layout specifications..." },
      { progress: 35, label: "Baking volumetric HDR lighting and shading structures..." },
      { progress: 55, label: "Generating cinematic object motion flow vectors..." },
      { progress: 75, label: "Slicing high-fidelity camera sweep coordinates..." },
      { progress: 90, label: "Rendering final 4K video frames on dedicated render blocks..." },
      { progress: 100, label: "Simulated synthesis completed. Cinematic master frame loaded!" }
    ] : [
      { progress: 15, label: "ধারণার ভিজ্যুয়াল অবজেক্ট এবং প্ল্যাটফর্ম লেআউট বিশ্লেষণ করা হচ্ছে..." },
      { progress: 35, label: "ভলিউমেট্রিক এইচডিআর লাইটিং এবং শ্যাডো ম্যাপ তৈরি হচ্ছে..." },
      { progress: 55, label: "সিনেমাটিক অবজেক্ট মোশন ফ্লো ভ্যাক্টর নির্ধারণ করা হচ্ছে..." },
      { progress: 75, label: "উচ্চ-মানের ডায়নামিক ক্যামেরা সুইপ কোঅর্ডিনেটস যুক্ত হচ্ছে..." },
      { progress: 90, label: "ডেডিকেটেড রেন্ডার নোডে ফাইনাল ফোর-কে ফ্রেম রেন্ডারিং হচ্ছে..." },
      { progress: 100, label: "সিমুলেশন সম্পন্ন। সিনেমাটিক মাস্টার ফ্রেম লোড হয়েছে!" }
    ];

    const interval = setInterval(() => {
      setRenderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          setHasCompletedRender(true);
          setIsPlayingSimulation(true);
          setPlaybackProgress(0);

          // Build custom storyboard keyframes
          const keyframes = [
            {
              title: isEn ? "Keyframe I: Cinematic Opening Hook" : "কী-ফ্রেম ১: সিনেমাটিক ওপেনিং হুক",
              desc: isEn 
                ? `Opening scene sweeps across the canvas showcasing: "${coreConcept.slice(0, 60)}..." wrapped in ${cinematicStyle} depth.` 
                : `শুরুতে ক্যামেরা প্যানিং হয়ে "${coreConcept.slice(0, 60)}..." এবং ${cinematicStyle} স্টাইলের নিখুঁত উপস্থাপনা।`
            },
            {
              title: isEn ? "Keyframe II: Mid-Sequence Spotlight Climax" : "কী-ফ্রেম ২: মিড-সিকোয়েন্স স্পটলাইট ক্লাইম্যাক্স",
              desc: isEn 
                ? `Dramatic orbital rotation shift of camera pull, creating high contrast highlights on luxury details.` 
                : `ডাইনামিক অরবিটাল ঘূর্ণন এবং স্পটলাইট লাইটিং-এর মাধ্যমে প্রোডাক্টের মূল অংশগুলোকে হাইলাইট করার দৃশ্য।`
            },
            {
              title: isEn ? "Keyframe III: Satisfying Cinematic Outro Resolution" : "কী-ফ্রেম ৩: সিনেমাটিক আউটরো রেজোলিউশন",
              desc: isEn 
                ? `Smooth slow-motion settle as fine lighting artifacts shimmer delicately in a high-impact branding fade.` 
                : `স্লো-মোশন ফ্রেম সেটেল এবং হালকা শিমারিং ইফেক্টস-এর সাথে ব্র্যান্ডিং লোগো ফেড-ইন হয়ে দৃশ্য সমাপ্তি।`
            }
          ];
          setStoryboards(keyframes);

          // Save completed render history locally
          const updatedRender: CompletedRender = {
            id: "render-" + Date.now(),
            concept: coreConcept,
            style: cinematicStyle,
            platform,
            duration,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " // " + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
            prompt: generatedPrompt,
            previewColor: stylesMetadata[cinematicStyle as keyof typeof stylesMetadata]?.color || "from-cyan-500 to-blue-600",
            storyboards: keyframes
          };

          const nextHistory = [updatedRender, ...renderHistory];
          setRenderHistory(nextHistory);
          localStorage.setItem("pcs_video_render_history", JSON.stringify(nextHistory));
          logDashboardActivity("video_render_completed", `Rendered simulation storyboard for ${platform}`, `সিমুলেটেড সিনেমা রেন্ডারিং সম্পন্ন করেছেন: ${platform}`);
          return 100;
        }

        const nextProg = prev + 5;
        const stateMsg = statuses.find(s => nextProg >= s.progress - 5 && nextProg <= s.progress);
        if (stateMsg) {
          setRenderStatus(stateMsg.label);
        }
        return nextProg;
      });
    }, 120);

    setRenderIntervalId(interval as any);
  };

  // Cancel simulated rendering mid-way
  const handleCancelRendering = () => {
    if (renderIntervalId) {
      clearInterval(renderIntervalId);
    }
    setIsRendering(false);
    setRenderProgress(0);
    logDashboardActivity("video_render_cancelled", "User cancelled active video simulation stream", "ভিডিও রেন্ডারিং সিমুলেশন বাতিল করেছেন");
  };

  // Load Prompt back to variables from History card
  const handleLoadCompletedRender = (renderItem: CompletedRender) => {
    setCoreConcept(renderItem.concept);
    setCinematicStyle(renderItem.style);
    setPlatform(renderItem.platform);
    setDuration(renderItem.duration);
    setGeneratedPrompt(renderItem.prompt);
    setStoryboards(renderItem.storyboards);
    setHasCompletedRender(true);
    setIsPlayingSimulation(true);
    setPlaybackProgress(0);
    setActiveRightTab("render");
    logDashboardActivity("video_render_loaded", `Loaded past render parameters from list`, `অতীতের রেন্ডার সেটআপ পুনরুদ্ধার করেছেন`);
  };

  // Delete Render from local history
  const handleDeleteRenderItem = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = renderHistory.filter(item => item.id !== idToDelete);
    setRenderHistory(updated);
    localStorage.setItem("pcs_video_render_history", JSON.stringify(updated));
    logDashboardActivity("video_render_deleted", "Removed rendering record from physical memory history", "রেন্ডার রেকর্ড মুছে ফেলেছেন");
  };

  // Open save prompt modal
  const handleOpenSaveModal = () => {
    const nameProposal = coreConcept.length > 25 
      ? coreConcept.substring(0, 25) + "..." 
      : coreConcept || "Video Project";
    setSaveName(isEn ? `Video Promo: ${nameProposal}` : `ভিডিও প্রজেক্ট: ${nameProposal}`);
    setShowSaveModal(true);
  };

  // Save to general portfolio vault
  const handleSaveToVault = () => {
    if (!saveName.trim() || !generatedPrompt) return;

    const newProject: UserProject = {
      id: "video-proj-" + Math.random().toString(36).substring(2, 9),
      name: saveName,
      type: "video",
      prompt: `Style: ${cinematicStyle} | Platform: ${platform} | Concept: ${coreConcept}`,
      language: "english",
      timestamp: new Date().toLocaleDateString([], { month: "short", day: "numeric" }) + " " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      output: generatedPrompt,
      tone: cinematicStyle.toLowerCase(),
      notes: `Video Format: ${platform} (${duration})`
    };

    const updated = [newProject, ...projects];
    setProjects(updated);
    localStorage.setItem("pcs_ai_projects_guest", JSON.stringify(updated));
    saveProjectsToCloud(updated);
    
    setShowSaveModal(false);
    setSaveSuccess(true);
    logDashboardActivity("video_vault_save", `Saved project: "${saveName}" to secure vault`, `ভিডিও প্রজেক্ট সংরক্ষণ সম্পন্ন: "${saveName}"`);
    
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Copy structured prompt
  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedPrompt);
    logDashboardActivity("video_copy", "Copied generated video prompt sequence to clipboard", "ভিডিও প্রম্পট ক্লিপবোর্ডে কপি করেছেন");
    const alertId = "video-toast-copied";
    const elem = document.getElementById(alertId);
    if (elem) {
      elem.classList.remove("opacity-0");
      elem.classList.add("opacity-100");
      setTimeout(() => {
        elem.classList.remove("opacity-100");
        elem.classList.add("opacity-0");
      }, 2000);
    }
  };

  // Download export handlers
  const handleDownloadFileType = (format: "txt" | "json" | "package") => {
    if (!generatedPrompt) return;

    let mime = "text/plain";
    let extension = "txt";
    let outputText = "";
    const filename = `PCS_Cinema_Blueprint_${Date.now()}`;

    if (format === "txt") {
      outputText = `======================================================
PCS COGNITIVE VIDEO STUDIO BLUEPRINT PROMPT
======================================================
Generated On: ${new Date().toLocaleString()}
Simulated Format: ${platform}
Estimated Length: ${duration}
Aesthetic Art Prescription: ${cinematicStyle}

PROMPT DIRECTIVES:
------------------------------------------------------
${generatedPrompt}

------------------------------------------------------
SYSTEM SECURITY FOOTER // EXPORT GENERATED VIA PCS AI STUDIO`;
    } else if (format === "json") {
      mime = "application/json";
      extension = "json";
      const meta = {
        title: filename,
        concept: coreConcept,
        style: cinematicStyle,
        duration,
        platform,
        generatedPrompt,
        version: "2.4.9",
        hardwareNode: "PCS_NEURAL_SORA_CLUSTER_05"
      };
      outputText = JSON.stringify(meta, null, 2);
    } else if (format === "package") {
      mime = "text/plain";
      extension = "txt";
      outputText = `[PCS PROFESSIONAL VIDEO PROMPT PACKAGE]
======================================================
PROJECT COMPREHENSIVE ASSET MANIFEST
======================================================

1. MAIN STYLESHEET PROMPT FOR MODELS (SORA / RUNWAY V3):
${generatedPrompt}

2. GENERATION SPECIFICATIONS:
- Targeted Platforms: ${platform}
- Setup Render Target: ${duration} Real-time
- Focus Aesthetic: ${cinematicStyle}

3. MOCK KEYFRAME STORYBOARDS PROPOSAL:
${storyboards.length > 0 ? storyboards.map((s, index) => `
- STORYBOARD ${index + 1}: ${s.title}
  Description: ${s.desc}
`).join("") : "- [Compile the simulated render view inside workspace to unlock instant full storyboard keyframes package]"}

--- End of Package ---`;
    }

    const blob = new Blob([outputText], { type: mime });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    logDashboardActivity("video_download_" + format, `Exported video specifications as ${format.toUpperCase()}`, `ভিডিও স্পেসিফিকেশন ${format.toUpperCase()} ফাইল হিসেবে ডাউনলোড করেছেন`);
  };

  const activeStyleInfo = stylesMetadata[cinematicStyle as keyof typeof stylesMetadata];

  return (
    <div className="space-y-6 animate-fade-in text-left" id="video-generator-module">
      {/* Module Title Banner */}
      <div className="border-b border-gray-900 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-pink-500 tracking-widest font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span>PCS CINEMATIC VIDEO GENERATOR</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white mt-1">
            {isEn ? "Advanced Video Prompter" : "উন্নত ভিডিও প্রম্পট স্টুডিও"}
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            {isEn 
              ? "Sculpt professional high-fidelity detailed cinematographic prompts for AI models like Sora, Runway Gen-2, and Veo." 
              : "সরা এবং রানওয়ে মডেল সংগতিপূর্ণ হাই-ফিডেলিটি সিনেমাটোগ্রাফি প্রম্পট ডিজাইন স্পেস।"}
          </p>
        </div>
        
        {/* Animated indicator badge */}
        <div className="p-3 bg-pink-500/5 border border-pink-500/20 rounded-xl flex items-center gap-3 select-none self-start md:self-center">
          <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
            <VideoIcon className="w-5 h-5 animate-pulse" />
          </div>
          <div className="font-mono text-[10px]">
            <p className="text-pink-400 font-bold uppercase">RENDER ENGINE ACTIVE</p>
            <p className="text-gray-500 font-semibold">Ready to compile storyboards</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Control Board: Video Prompt Setup */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#121420]/75 backdrop-blur-md rounded-3xl border border-gray-800 p-6 space-y-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-pink-500 via-pink-400 to-transparent opacity-80" />
            
            <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
              <Film className="w-4 h-4 text-pink-400" />
              <h2 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
                {isEn ? "Generator Parameters" : "প্যারামিটার সেটিংস"}
              </h2>
            </div>

            <form onSubmit={handleCompilePrompt} className="space-y-4">
              {/* Concept Input TextArea */}
              <div className="space-y-1.5">
                <label className="block text-[10.5px] font-mono text-gray-400 uppercase font-bold">
                  {isEn ? "1. Describe the Video Concept or Action" : "১. মূল ধারণা অথবা ভিডিওর দৃশ্য লিখুন"}
                </label>
                <textarea
                  value={coreConcept}
                  onChange={(e) => setCoreConcept(e.target.value)}
                  placeholder={isEn 
                    ? "E.g. launch luxury diamond watch floating inside zero gravity water chamber..." 
                    : "যেমন: মহাকাশে ভাসমান হীরার ঘড়ির ওপর লাইটিং এবং স্লো মোশন জলের ফোঁটা..."}
                  rows={3}
                  className="w-full bg-[#090a0f] border border-gray-850 focus:border-pink-500/50 rounded-xl p-3 text-xs text-gray-200 outline-none leading-relaxed transition-all resize-none shadow-inner"
                  required
                />
              </div>

              {/* Dynamic Guidance Reference Dropzone */}
              <div className="space-y-1.5">
                <label className="block text-[10.5px] font-mono text-gray-400 uppercase font-bold">
                  {isEn ? "Image Guidance Context (Optional)" : "ইমেজ গাইডেন্স রেফারেন্স (ঐচ্ছিক)"}
                </label>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[90px] relative overflow-hidden ${
                    isDragging 
                      ? "border-pink-500 bg-pink-500/10" 
                      : previewImage 
                      ? "border-emerald-500/40 bg-emerald-500/5" 
                      : "border-gray-850 hover:border-gray-800 bg-[#090a0f]/50"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleManualFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {previewImage ? (
                    <div className="flex items-center gap-3 w-full pr-8">
                      <div className="w-12 h-12 bg-gray-950 rounded-lg overflow-hidden border border-emerald-500/30 flex-shrink-0 relative group">
                        <img 
                          src={previewImage} 
                          alt="Guidance thumbnail" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-left truncate space-y-0.5">
                        <p className="text-[10px] font-bold text-gray-200 truncate">{isEn ? "Guidance Image Loaded" : "ইমেজ রেফারেন্স যুক্ত হয়েছে"}</p>
                        <p className="text-[9px] font-mono text-emerald-400 font-bold tracking-tight">ACTIVE TEXTURE MAPPED</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImageRef();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gray-900/90 text-gray-400 hover:text-white rounded-lg border border-gray-800 cursor-pointer"
                        title={isEn ? "Remove guidance image" : "ইমেজ মুছুন"}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <div className="text-gray-500 flex justify-center">
                        <ImageIcon className={`w-5 h-5 ${isDragging ? "text-pink-400 animate-bounce" : "text-gray-600"}`} />
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold">
                        {isEn ? "Drag & Drop texture reference here" : "ট্যাক্সচার বা ভিজ্যুয়াল রেফারেন্স এখানে ড্রপ করুন"}
                      </p>
                      <p className="text-[9px] text-gray-600 font-medium font-mono">
                        {isEn ? "Supports JPG, PNG up to 5MB" : "ক্লিক অথবা ড্রপ করে লোড করুন"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cinematic Style Radio Option Cards */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[10.5px] font-mono text-gray-400 uppercase font-bold">
                    {isEn ? "2. Cinematic Art Style" : "২. সিনেমাটিক আর্ট স্টাইল"}
                  </label>
                  {cinematicStyle && (
                    <span className="text-[9.5px] font-mono font-bold text-pink-400 px-1.5 py-0.5 bg-pink-500/10 rounded border border-pink-500/25">
                      {cinematicStyle.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-1.5 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                  {Object.keys(stylesMetadata).map((stl) => {
                    const stlObj = stylesMetadata[stl as keyof typeof stylesMetadata];
                    const isSelected = cinematicStyle === stl;
                    return (
                      <div
                        key={stl}
                        onClick={() => setCinematicStyle(stl)}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isSelected 
                            ? "bg-[#181220] border-pink-500/40 shadow-[0_0_10px_rgba(236,72,153,0.08)]" 
                            : "bg-[#090a0f]/80 border-gray-900 hover:border-gray-850 hover:bg-[#0d0f17]"
                        }`}
                      >
                        <div className="space-y-0.5 truncate">
                          <p className={`text-[11px] font-bold leading-none uppercase select-none ${isSelected ? "text-pink-400" : "text-gray-300"}`}>
                            {stl}
                          </p>
                          <p className="text-[9.5px] text-gray-500 truncate">
                            {stlObj.desc}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Duration and Platform side-by-side */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Duration */}
                <div className="space-y-1">
                  <label className="block text-[10.5px] font-mono text-gray-400 uppercase font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <span>Duration</span>
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-[#090a0f] border border-gray-850 rounded-lg p-2 text-xs text-gray-300 outline-none focus:border-pink-500/40 cursor-pointer"
                  >
                    <option value="15 sec">15 Seconds (Short)</option>
                    <option value="30 sec">30 Seconds (Standard)</option>
                    <option value="60 sec">60 Seconds (Extended)</option>
                  </select>
                </div>

                {/* Platform */}
                <div className="space-y-1">
                  <label className="block text-[10.5px] font-mono text-gray-400 uppercase font-semibold flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-gray-500" />
                    <span>Social Platform</span>
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-[#090a0f] border border-gray-850 rounded-lg p-2 text-xs text-gray-300 outline-none focus:border-pink-500/40 cursor-pointer"
                  >
                    <option value="YouTube Shorts">YouTube Shorts (9:16)</option>
                    <option value="Instagram Reel">Instagram Reel (9:16)</option>
                    <option value="Facebook Ad">Facebook Ad (1:1)</option>
                    <option value="TikTok">TikTok Campaign (9:16)</option>
                  </select>
                </div>
              </div>

              {/* Generate button */}
              <button
                type="submit"
                disabled={isCompiling || !coreConcept.trim()}
                className={`w-full py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-[0_0_15px_rgba(236,72,153,0.12)] ${
                  isCompiling 
                    ? "bg-pink-500/10 text-pink-400 pointer-events-none animate-pulse" 
                    : !coreConcept.trim()
                    ? "bg-gray-950 border border-gray-900 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-extrabold"
                }`}
              >
                {isCompiling ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-pink-400" />
                    <span>SYNAPSE RENDERING PROMPT...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isEn ? "GENERATE VIDEO PROMPT" : "ভিডিও প্রম্পট জেনারেট করুন"}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Board: Output Presentation Box & Simulated Sandbox */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#121420]/75 backdrop-blur-md rounded-3xl border border-gray-800 p-6 space-y-4 shadow-lg relative min-h-[500px] flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-emerald-500 via-transparent to-transparent opacity-80" />
            
            {/* Modular Tab Deck selector */}
            <div className="flex border-b border-gray-900 pb-1.5 gap-2" id="video-right-tabs-row">
              <button
                type="button"
                onClick={() => setActiveRightTab("prompt")}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeRightTab === "prompt"
                    ? "text-white border-b-2 border-pink-500"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isEn ? "Compiled Prompt" : "কম্পাইল্ড প্রম্পট"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRightTab("render")}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeRightTab === "render"
                    ? "text-white border-b-2 border-pink-500"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <Tv className="w-3.5 h-3.5 animate-pulse" />
                <span>{isEn ? "Simulated Render" : "রেন্ডার সিমুলেশন"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRightTab("history")}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all duration-200 cursor-pointer flex items-center gap-2 relative ${
                  activeRightTab === "history"
                    ? "text-white border-b-2 border-pink-500"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>{isEn ? "Render Library" : "রেন্ডার জেন-লগ"}</span>
                {renderHistory.length > 0 && (
                  <span className="text-[8px] bg-pink-500/25 text-pink-400 font-extrabold px-1 rounded-full border border-pink-500/30">
                    {renderHistory.length}
                  </span>
                )}
              </button>
            </div>

            {/* TAB VIEW PANELS */}
            <div className="flex-grow flex flex-col">
              
              {/* Tab 1: TEXT COMPILED PROMPT VIEW */}
              {activeRightTab === "prompt" && (
                <div className="space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <h3 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                          {isEn ? "Compiled Directives & Framing Arguments" : "কম্পাইলকৃত ভিডিও প্রম্পট সিকোয়েন্স"}
                        </h3>
                      </div>
                      
                      {generatedPrompt && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleCopyText}
                            className="px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-gray-800 text-[10px] text-gray-300 font-bold font-mono rounded-lg transition-all cursor-pointer"
                          >
                            {isEn ? "COPY" : "কপি"}
                          </button>
                          
                          {/* Export dropdown mockup format downloads */}
                          <div className="relative group">
                            <button
                              type="button"
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-gray-800 text-[10px] text-pink-400 font-bold font-mono rounded-lg transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              <span>EXPORT</span>
                            </button>
                            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-[#0e1017] border border-gray-800 rounded-xl py-1 w-32 shadow-xl z-50">
                              <button
                                type="button"
                                onClick={() => handleDownloadFileType("txt")}
                                className="w-full text-left text-[9px] font-mono text-gray-300 hover:text-white hover:bg-gray-900 px-3 py-1.5"
                              >
                                .TXT Blueprint
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadFileType("json")}
                                className="w-full text-left text-[9px] font-mono text-gray-300 hover:text-white hover:bg-gray-900 px-3 py-1.5"
                              >
                                .JSON Layout
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadFileType("package")}
                                className="w-full text-left text-[9px] font-mono text-pink-400 hover:text-pink-300 hover:bg-gray-900 px-3 py-1.5 border-t border-gray-900"
                              >
                                Full Prompt Package
                              </button>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleOpenSaveModal}
                            className="p-1 px-2.5 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 text-[10px] font-bold font-mono rounded-lg transition-all cursor-pointer flex items-center gap-1"
                          >
                            <FolderLock className="w-3 h-3" />
                            <span>{isEn ? "SAVE" : "সেভ"}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="relative flex-grow">
                      {generatedPrompt ? (
                        <div className="space-y-3">
                          <textarea
                            readOnly
                            value={generatedPrompt}
                            className="w-full h-[220px] bg-[#090a0f] border border-gray-900 rounded-2xl p-4 text-xs font-mono text-cyan-300 outline-none leading-relaxed tracking-wide select-text resize-none"
                          />
                          
                          {/* Prompt to Simulated render banner */}
                          <div className="p-3 bg-gradient-to-r from-pink-500/5 to-rose-500/5 border border-pink-500/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Cpu className="w-4 h-4 text-pink-400" />
                              <div className="text-left">
                                <p className="text-[10px] font-mono text-white font-bold">{isEn ? "TEST SANDBOX RENDER" : "টেস্ট স্যান্ডবক্স রেন্ডারিং"}</p>
                                <p className="text-[9px] text-gray-500">{isEn ? "Simulate real-time video outputs frame-by-frame locally." : "এআই জেনারেটেড ক্রিয়েটিভ স্টোরিবোর্ড রান করিয়ে দেখুন।"}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleStartSimulatedRender}
                              className="px-3.5 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white text-[10px] font-bold font-mono rounded-lg transition-all cursor-pointer shadow-md select-none shrink-0"
                            >
                              {isEn ? "RUN RENDER SIMULATION" : "রেন্ডার সিমুলেশন রান করুন"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="h-[300px] border border-dashed border-gray-850 rounded-2xl bg-[#090a0f]/40 flex flex-col items-center justify-center p-6 text-center text-gray-500 space-y-3">
                          <div className="p-3 bg-gray-950 rounded-full border border-gray-900 text-gray-600">
                            <Film className="w-6 h-6 animate-pulse" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400">
                              {isEn ? "Awaiting Core Parameters Formulation" : "প্যারামিটার ইনপুট-এর অপেক্ষায়"}
                            </p>
                            <p className="text-[10px] text-gray-600 mt-1 max-w-sm">
                              {isEn 
                                ? "Add a concept description, choose an aesthetic art style, and click generate on the setup deck to compile high-fidelity prompts!" 
                                : "বামদিকের ডেক থেকে আপনার ভিডিও ধারণা এবং পছন্দসই স্টাইল সিলেক্ট করে জেনারেট বাটনে ক্লিক করুন!"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: SIMULATED VIDEO RENDER SANDBOX VIEW */}
              {activeRightTab === "render" && (
                <div className="space-y-4 flex-grow flex flex-col">
                  {/* Rendering Progress View */}
                  {isRendering && (
                    <div className="flex-grow flex flex-col items-center justify-center py-10 space-y-5 text-center">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-pink-500/20" />
                        <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
                        <Film className="w-6 h-6 text-pink-400 animate-pulse" />
                      </div>

                      <div className="space-y-2 max-w-sm">
                        <div className="flex justify-between text-[10px] font-mono font-bold text-gray-400 px-1">
                          <span>{isEn ? "RENDERING CORE FRAME" : "ভিডিও ফ্রেম রেন্ডার হচ্ছে"}</span>
                          <span className="text-pink-400">{renderProgress}%</span>
                        </div>
                        {/* Custom visual glow progress bar bar */}
                        <div className="h-2 w-64 bg-[#090a0f] rounded-full overflow-hidden border border-gray-900 relative">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                            style={{ width: `${renderProgress}%` }}
                            transition={{ ease: "easeInOut" }}
                          />
                        </div>
                        <p className="text-[9.5px] font-mono text-emerald-400 tracking-tight animate-pulse min-h-[14px]">
                          {renderStatus}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleCancelRendering}
                        className="px-4 py-1.5 bg-gray-950 hover:bg-gray-900 text-gray-400 hover:text-white border border-gray-850 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all"
                      >
                        {isEn ? "CANCEL SIMULATE RENDER" : "রেন্ডারিং সিমুলেশন বাতিল করুন"}
                      </button>
                    </div>
                  )}

                  {/* Completed Render Player Scene */}
                  {hasCompletedRender && !isRendering && (
                    <div className="space-y-5 flex-grow animate-fade-in text-left">
                      
                      {/* Interactive Visual Player */}
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#000] border border-gray-850 group flex flex-col justify-between p-4">
                        
                        {/* Simulated particle field grid in the background */}
                        <div className="absolute inset-0 opacity-40 mix-blend-screen overflow-hidden pointer-events-none">
                          <div className={`absolute inset-0 bg-gradient-to-tr ${activeStyleInfo ? activeStyleInfo.color : "from-pink-500 to-violet-600"} opacity-15 filter blur-md`} />
                          
                          {/* Animated moving vectors or dots to simulate live rendering loop */}
                          {isPlayingSimulation && (
                            <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1.5px,transparent_1.5px)] [background-size:20px_20px] bg-center animate-pulse" />
                          )}

                          {/* Sound wave overlay */}
                          {isPlayingSimulation && (
                            <div className="absolute bottom-16 left-6 right-6 flex items-end gap-[3px] h-10 opacity-30">
                              {Array.from({ length: 44 }).map((_, i) => (
                                <div 
                                  key={i} 
                                  className="w-[3px] bg-pink-400 rounded-full" 
                                  style={{ 
                                    height: `${Math.floor(Math.random() * 80) + 20}%`,
                                    animation: `pulse ${0.4 + (i % 5) * 0.1}s infinite alternate`
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Top player HUD bar */}
                        <div className="flex items-center justify-between z-10 w-full">
                          <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/5 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${isPlayingSimulation ? "bg-red-500 animate-pulse" : "bg-gray-500"}`} />
                            <span className="text-[8.5px] font-mono text-gray-300 font-bold tracking-widest uppercase">
                              {isPlayingSimulation ? "SIMULATING PLAYBACK" : "PAUSED"}
                            </span>
                          </div>
                          
                          <div className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded font-mono text-[8px] text-pink-400 border border-pink-500/20 font-bold select-none">
                            {duration.toUpperCase()} • 4K UHD • {cinematicStyle.toUpperCase()}
                          </div>
                        </div>

                        {/* Middle Center Play/Pause Floating controller */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <button
                            type="button"
                            onClick={() => setIsPlayingSimulation(!isPlayingSimulation)}
                            className="p-4 bg-pink-500 hover:bg-pink-400 text-white rounded-full shadow-2xl transition-transform hover:scale-110 cursor-pointer"
                          >
                            {isPlayingSimulation ? <Pause className="w-6 h-6 shrink-0" /> : <Play className="w-6 h-6 shrink-0 ml-0.5" />}
                          </button>
                        </div>

                        {/* Bottom Controller Hub HUD */}
                        <div className="w-full z-10 space-y-2 mt-auto">
                          
                          {/* Timeline seek progress bar slider */}
                          <div className="space-y-1">
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5 cursor-pointer relative"
                                 onClick={(e) => {
                                   const rect = e.currentTarget.getBoundingClientRect();
                                   const pct = ((e.clientX - rect.left) / rect.width) * 100;
                                   setPlaybackProgress(pct);
                                 }}
                            >
                              <div 
                                className="h-full bg-pink-500" 
                                style={{ width: `${playbackProgress}%` }}
                              />
                            </div>
                            
                            {/* Time stamps */}
                            <div className="flex justify-between font-mono text-[8.5px] text-gray-400">
                              <span>0:0{Math.floor((playbackProgress * Number(duration.split(" ")[0] || 30)) / 100)} / 0:{duration.split(" ")[0]}</span>
                              <span className="text-gray-500">FORMAT: {platform.toUpperCase()}</span>
                            </div>
                          </div>

                          {/* Control row with Play button */}
                          <div className="flex items-center justify-between border-t border-white/10 pt-1.5">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setIsPlayingSimulation(!isPlayingSimulation)}
                                className="text-white hover:text-pink-400 transition-colors cursor-pointer"
                              >
                                {isPlayingSimulation ? <Pause className="w-4 h-4 shrink-0" /> : <Play className="w-4 h-4 shrink-0" />}
                              </button>
                              
                              <p className="text-[10px] font-semibold text-gray-300 tracking-tight leading-none truncate max-w-xs sm:max-w-md">
                                {coreConcept}
                              </p>
                            </div>

                            <span className="text-[9px] font-mono text-gray-500">
                              SORA CORE v2
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mock Storyboard Visual breakdown cards */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-gray-400" />
                          <h4 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">{isEn ? "Cinematic Storyboard Sequence" : "সিনেমাটিক স্টোরিবোর্ড সিকোয়েন্স প্রস্তাবনা"}</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {storyboards.map((card, idx) => (
                            <div key={idx} className="p-3 rounded-2xl bg-[#090a0f] border border-gray-900 space-y-1.5 flex flex-col justify-between">
                              <div className="space-y-1 text-left">
                                <span className="text-[8.5px] font-mono text-pink-400 font-bold px-1.5 py-0.5 bg-pink-500/5 rounded border border-pink-500/10">
                                  KEYFRAME {idx + 1}
                                </span>
                                <h5 className="text-[10.5px] font-bold text-gray-200 mt-1 truncate" title={card.title}>{card.title}</h5>
                                <p className="text-[9.5px] text-gray-500 leading-relaxed font-sans">{card.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Render utilities logs action button */}
                      <div className="flex justify-between items-center bg-[#090a0f] border border-gray-900 rounded-xl p-3">
                        <span className="text-[9px] font-mono text-gray-500">{isEn ? "Generate complete? Download variables packet directly:" : "সিমুলেশন রেন্ডার সম্পূর্ণ? ফুল প্রম্পট ডাউনলোড করুন:"}</span>
                        <button
                          type="button"
                          onClick={() => handleDownloadFileType("package")}
                          className="px-3 py-1 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/35 text-[9.5px] font-mono font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Download className="w-3 h-3" />
                          <span>DOWNLOAD FULL DIRECTORY PACKAGE</span>
                        </button>
                      </div>

                    </div>
                  )}

                  {/* Empty state when render tab loaded with no prompts generated yet */}
                  {!generatedPrompt && !isCompiling && (
                    <div className="h-[300px] border border-dashed border-gray-850 rounded-2xl bg-[#090a0f]/40 flex flex-col items-center justify-center p-6 text-center text-gray-500 space-y-3">
                      <div className="p-3 bg-gray-950 rounded-full border border-gray-900 text-gray-600">
                        <Tv className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400">
                          {isEn ? "No Compiled Directives to Render" : "রেন্ডার করার মতো কোনো প্রম্পট নেই"}
                        </p>
                        <p className="text-[10px] text-gray-600 mt-1 max-w-sm">
                          {isEn 
                            ? "Compile your text prompt first using the parameters panel, or click restore from the Render Library logs." 
                            : "স্যান্ডবক্স রেন্ডার প্লেয়ার দেখতে প্রথমে বামপাশ থেকে প্রম্পট কম্পাইল করুন!"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: RENDER LIBRARY HISTORY LOGS */}
              {activeRightTab === "history" && (
                <div className="space-y-3 flex-grow animate-fade-in text-left">
                  <div className="flex items-center justify-between border-b border-gray-900/60 pb-2">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">{isEn ? "Render Vault Archival Ledger" : "রেন্ডার আর্কাইভ লগ বুক"}</span>
                    <span className="text-[9.5px] font-mono text-gray-500 font-semibold">{renderHistory.length} Saved Logs</span>
                  </div>

                  {renderHistory.length > 0 ? (
                    <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                      {renderHistory.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleLoadCompletedRender(item)}
                          className="p-3 rounded-2xl bg-[#090a0f] border border-gray-900 hover:border-gray-850 cursor-pointer transition-all flex items-center justify-between gap-4 group hover:bg-[#121420]/50"
                        >
                          <div className="flex items-center gap-3 truncate">
                            <div className={`p-2 rounded-lg bg-gradient-to-tr ${item.previewColor} text-white shrink-0`}>
                              <Film className="w-4 h-4" />
                            </div>
                            <div className="truncate text-left space-y-0.5">
                              <h4 className="text-[11.5px] font-bold text-gray-200 truncate group-hover:text-pink-400 transition-colors leading-normal" title={item.concept}>
                                {item.concept}
                              </h4>
                              <p className="text-[9.5px] text-gray-500 truncate font-mono">
                                {item.style.toUpperCase()} • {item.platform.toUpperCase()} ({item.duration})
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[8px] font-mono text-gray-600 font-semibold select-none">
                              {item.timestamp}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteRenderItem(item.id, e)}
                              className="p-1 text-gray-600 hover:text-red-400 rounded-lg hover:bg-gray-900/80 cursor-pointer transition-all"
                              title={isEn ? "Delete render file" : "এটি মুছুন"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[280px] border border-dashed border-gray-850 rounded-2xl bg-[#090a0f]/40 flex flex-col items-center justify-center p-6 text-center text-gray-500 space-y-3">
                      <div className="p-3 bg-gray-950 rounded-full border border-gray-900 text-gray-600">
                        <History className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400">
                          {isEn ? "Archival Logs Directory Empty" : "আপনার কোনো আর্কাইভড রেন্ডার ইতিহাস নেই"}
                        </p>
                        <p className="text-[10px] text-gray-600 mt-1 max-w-sm">
                          {isEn 
                            ? "Complete a camera storyboard render sequence and watch completed outputs persist inside local ledger storage automatically." 
                            : "একটি ভিডিও রেন্ডার শেষ করলে সেই প্রজেক্টের রেন্ডার এবং স্টোরিবোর্ড ডেটা এখানে সংরক্ষিত থাকবে!"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Bottom Status Feed Log */}
            <div className="border-t border-gray-900/60 pt-4 flex flex-col sm:flex-row items-center justify-between text-[9.5px] font-mono text-gray-500 gap-2">
              <span className="flex items-center gap-1.5">
                <Info className="w-3 h-3 text-[#06b6d4]" />
                <span>Format optimised specifically for model parsing constraints</span>
              </span>
              <span className="text-gray-600 font-semibold">PCS AI STUDIO // v2.4.9</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Alerts and Modals */}
      <AnimatePresence>
        {/* Copy Prompt Toast */}
        <div 
          id="video-toast-copied"
          className="fixed bottom-6 right-6 bg-[#10b981] text-black font-semibold text-xs py-2 px-4 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400/40 z-[9999] opacity-0 transition-opacity duration-300 pointer-events-none"
        >
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{isEn ? "Prompt text copied to secure clipboard!" : "ভিডিও প্রম্পট ক্লিপবোর্ডে কপি হয়েছে!"}</span>
        </div>

        {/* Saved Toast */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-6 right-6 bg-cyan-400 text-[#090a0f] font-semibold text-xs py-2 px-4 rounded-xl shadow-2xl flex items-center gap-2 border border-cyan-300/40 z-[9999]"
          >
            <FolderHeart className="w-4 h-4 shrink-0" />
            <span>{isEn ? "Compiled project saved securely to Vault Archive!" : "ক্যাম্পেইন প্রজেক্ট ভল্ট আর্কাইভে সেভ হয়েছে!"}</span>
          </motion.div>
        )}

        {/* Save Dialog Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-[#000]/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0e1017] border border-gray-800 rounded-3xl p-6 w-full max-w-md space-y-4"
            >
              <div className="flex items-center gap-2.5 border-b border-gray-900 pb-3">
                <FolderLock className="w-4 h-4 text-pink-400" />
                <h3 className="text-xs font-mono font-bold text-gray-200 uppercase tracking-wider">
                  {isEn ? "Save Project to Secure Vault" : "প্রজেক্ট ভল্ট সেভ ডকুমেন্ট"}
                </h3>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-gray-500 uppercase font-bold">Project File Name:</label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  className="w-full bg-[#050608] border border-gray-850 focus:border-pink-500/50 rounded-xl p-3 text-xs text-white outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-2 bg-gray-900 hover:bg-gray-850 border border-gray-800 rounded-xl text-xs font-mono font-semibold text-gray-400 cursor-pointer transition-all"
                >
                  {isEn ? "CANCEL" : "বাতিল"}
                </button>
                <button
                  type="button"
                  onClick={handleSaveToVault}
                  className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 rounded-xl text-xs font-mono font-extrabold text-white cursor-pointer transition-all shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                >
                  {isEn ? "CONFIRM SAVE" : "সংরক্ষণ নিশ্চিত করুন"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
