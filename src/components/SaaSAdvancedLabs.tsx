import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, Copy, Check, Sliders, Download, Edit, Save, 
  Trash2, Layers, Cpu, Eye, MessageSquareCode, Image as ImageIcon, 
  Video as VideoIcon, Megaphone, Clock, CheckCircle, ChevronRight, X,
  LayoutDashboard, CreditCard, Activity, Search, RefreshCw, Terminal, 
  FolderHeart, Database, Shield, Zap, Info, Filter, ArrowRightLeft, Menu,
  User, LogOut, Plus, Lock, Unlock, TrendingUp, Monitor, History, EyeOff, Globe, Bell,
  Laptop, Share2, CornerDownRight, Settings, Maximize2, Minimize2, Keyboard, HelpCircle,
  FolderOpen, Calendar, Star, Users, CheckSquare
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { GeneratorType, Language, SavedResult, ToneOption, UserProject, VaultPrompt, DashboardActivity } from "../types";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

interface SaaSAdvancedLabsProps {
  language: Language;
  isEn: boolean;
  projects: UserProject[];
  setProjects: React.Dispatch<React.SetStateAction<UserProject[]>>;
  saveProjectsToCloud: (updatedList: UserProject[]) => Promise<void>;
  logDashboardActivity: (type: string, descEn: string, descBn: string) => Promise<void>;
  creditsUsed: number;
  creditLimit: number;
  generatedCount: number;
  recordGenerationCost: (spentCost: number, nextCredits: number, nextGenCount: number) => Promise<void>;
  activeTier: "Starter" | "Creator Pro" | "Enterprise";
  onOpenMultiLang?: () => void;
}

interface WorkspaceTab {
  id: string;
  name: string;
  activeTab: GeneratorType;
  prompt: string;
  selectedTone: string;
  platform: string;
  artStyle: string;
  cameraMovement: string;
  audience: string;
  output: string;
  editedOutput: string;
  campaignOutput: any | null;
  selectedCampaignCard: string;
}

interface TemplatePrompt {
  id: string;
  title: string;
  desc: string;
  category: "marketing" | "SaaS" | "medical" | "finance" | "agency";
  promptTemplate: string;
  tone: string;
  generatorType: GeneratorType;
}

export default function SaaSAdvancedLabs({
  language,
  isEn,
  projects,
  setProjects,
  saveProjectsToCloud,
  logDashboardActivity,
  creditsUsed,
  creditLimit,
  generatedCount,
  recordGenerationCost,
  activeTier,
  onOpenMultiLang
}: SaaSAdvancedLabsProps) {

  // ----------------------------------------------------
  // Default Templates
  // ----------------------------------------------------
  const INDUSTRY_TEMPLATES: TemplatePrompt[] = [
    {
      id: "saas-launch",
      title: "SaaS Product Hunt Hook",
      desc: "Perfect viral intro hook and specifications designed for modern dev audiences.",
      category: "SaaS",
      tone: "creative",
      generatorType: "campaign",
      promptTemplate: "Create a SaaS launch post explaining a solution that automates server cluster deployments via a simple drag-and-drop flowchart UI, pointing out 3 key benefits for developers."
    },
    {
      id: "saas-tagline",
      title: "Futuristic SaaS Tagline Dev",
      desc: "Produces punchy, sleek headlines focusing on immediate landing conversion metric benefits.",
      category: "SaaS",
      tone: "bold",
      generatorType: "adcopy",
      promptTemplate: "Generate SaaS high-conversion headlines for PCS AI Studio. Focus on solving content clutter for multi-channel modern agencies with 10x production speeds."
    },
    {
      id: "mkt-insta",
      title: "AIDA Instagram Campaign",
      desc: "Framework leveraging Attention, Interest, Desire, Action elements.",
      category: "marketing",
      tone: "bold",
      generatorType: "caption",
      promptTemplate: "Promote online interactive cognitive analytics workspaces for marketing teams utilizing PCS AI Studio dynamic features."
    },
    {
      id: "mkt-b2b",
      title: "B2B LinkedIn Thought-Leadership",
      desc: "Generates high engagement debate topics and personal anecdotes.",
      category: "marketing",
      tone: "professional",
      generatorType: "caption",
      promptTemplate: "Why traditional social media agencies are failing because of delayed human copywriting cycles, and how automated modular templates act as salvation."
    },
    {
      id: "med-explain",
      title: "Complex Health Simplifier",
      desc: "Translates medical procedures or technology into clear, patient-friendly copy.",
      category: "medical",
      tone: "empathetic",
      generatorType: "adcopy",
      promptTemplate: "Explain what robotic cardiac ablation is for someone searching online, ensuring calm reassurance, professional safety standards, and clear visual summaries."
    },
    {
      id: "med-clinic",
      title: "Telehealth Launch Flyer",
      desc: "Prompts posters visualizing immediate virtual doctors with calming hues.",
      category: "medical",
      tone: "professional",
      generatorType: "poster",
      promptTemplate: "Modern premium medical telehealth app interface visual, high-tech neon teal medical cross, clean white clinical studio lighting, abstract wireframes of DNA."
    },
    {
      id: "fin-press",
      title: "Fintech Press Narrative",
      desc: "Generates professional regulatory-friendly press narratives around feature releases.",
      category: "finance",
      tone: "professional",
      generatorType: "adcopy",
      promptTemplate: "Write a campaign detailing the implementation of high-security multi-sig smart cryptocurrency vaults providing 0% commission swapping loops."
    },
    {
      id: "fin-explain",
      title: "Crypto Yield Smart Guide",
      desc: "Explains complex blockchain metrics using transparent, high-integrity logic.",
      category: "finance",
      tone: "creative",
      generatorType: "caption",
      promptTemplate: "Write a high-converting explanation post explaining high-yield liquidity pools to standard savings depositors in standard banking."
    },
    {
      id: "agn-pitch",
      title: "Creative Branding Pitch Manifest",
      desc: "Sets of highly persuasive, elite creative manifestos describing core brand missions.",
      category: "agency",
      tone: "creative",
      generatorType: "campaign",
      promptTemplate: "Branding manifesto for a premium boutique fashion eco-label focusing on zero waste tailoring, minimal concrete architecture, and Scandinavian rustic hues."
    },
    {
      id: "agn-video",
      title: "TikTok Meta Hook Blueprint",
      desc: "Short high-speed video scenes framing viral hooks for corporate clients.",
      category: "agency",
      tone: "funny",
      generatorType: "video",
      promptTemplate: "Short cinematic meta agency lifestyle video displaying young dynamic designer holding warm matcha latte, looking shocked as multiple screens auto-render art styles."
    }
  ];

  // ----------------------------------------------------
  // States: Core Multi-Tab Workspace
  // ----------------------------------------------------
  const [workspaceTabs, setWorkspaceTabs] = useState<WorkspaceTab[]>(() => {
    // Session recovery from local storage
    const stored = localStorage.getItem("pcs_multitab_workspace_labs_" + (auth.currentUser?.uid || "guest"));
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to restore workspaces:", e);
      }
    }
    return [
      {
        id: "tab-primary",
        name: "Workspace Alpha",
        activeTab: "campaign",
        prompt: "Launch organic bamboo custom toothbrush with premium soft bristles.",
        selectedTone: "creative",
        platform: "all-rounder",
        artStyle: "photorealistic",
        cameraMovement: "cinematic drone shot",
        audience: "general consumer",
        output: "🌎 MEET THE ECO-BRISTLE: The greenest smile you will ever wear! Our handmade bamboo toothbrush delivers a premium polish while respecting our soil. Styled elegantly for modern homes.\n\n### Why PCS AI Studio Ecofriendly Gear?\n- **100% Biodegradable Base**\n- **Superfine Carbon Bristles**\n- **Zero-Plastic Packaging**\n\nExperience next-gen sustainability.",
        editedOutput: "🌎 MEET THE ECO-BRISTLE: The greenest smile you will ever wear! Our handmade bamboo toothbrush delivers a premium polish while respecting our soil. Styled elegantly for modern homes.\n\n### Why PCS AI Studio Ecofriendly Gear?\n- **100% Biodegradable Base**\n- **Superfine Carbon Bristles**\n- **Zero-Plastic Packaging**\n\nExperience next-gen sustainability.",
        campaignOutput: {
          facebookCaption: "🌎 MEET THE ECO-BRISTLE: The greenest smile you will ever wear! Our handmade bamboo toothbrush delivers a premium polish while respecting our soil. Styled elegantly for modern homes.",
          hashtags: "#gogreen #ecofriendly #organicbeauty #bambooproduce",
          posterPrompt: "Stunning studio product photograph of a modern organic bamboo toothbrush, angled gracefully on pristine white limestone.",
          videoPrompt: "Dolly zoom highlighting close-up organic biodegradable bristles, dynamic high-gloss studio aesthetics.",
          adCopy: "Get 20% off your premier eco dental starter kit today at PCS AI Studio.",
          landingHeadline: "Unleash Bamboo Dental Care with elite PCS AI Studio solutions."
        },
        selectedCampaignCard: "facebookCaption"
      }
    ];
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>("tab-primary");
  const activeWorkspace = workspaceTabs.find(t => t.id === activeWorkspaceId) || workspaceTabs[0];

  // Helper updater for active workspace attributes
  const updateActiveWorkspace = (updates: Partial<WorkspaceTab>) => {
    setWorkspaceTabs(prev => {
      const updated = prev.map(tab => {
        if (tab.id === activeWorkspaceId) {
          const res = { ...tab, ...updates };
          return res;
        }
        return tab;
      });
      localStorage.setItem("pcs_multitab_workspace_labs_" + (auth.currentUser?.uid || "guest"), JSON.stringify(updated));
      return updated;
    });
  };

  // State: AI Engine Select
  const [activeEngine, setActiveEngine] = useState<"gemini-flash" | "gemini-pro" | "gpt-4o" | "deepseek" | "claude">("gemini-flash");

  // State: Template Favorite Starred IDs
  const [favoriteTemplateIds, setFavoriteTemplateIds] = useState<string[]>(() => {
    const stored = localStorage.getItem("pcs_starred_templates_" + (auth.currentUser?.uid || "guest"));
    return stored ? JSON.parse(stored) : ["saas-launch"];
  });

  // State: Drag and Drop visual placeholder
  const [multimodalRefImage, setMultimodalRefImage] = useState<{ name: string; size: string; type: string; preview?: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRefSaaSAdvancedLabs = useRef<HTMLInputElement>(null);

  // Keyboard shortcut assistant
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);

  // Video prompt builder visual options state
  const [vpcAngle, setVpcAngle] = useState("isometric slow pan");
  const [vpcLighting, setVpcLighting] = useState("volumetric cyberpunk neon rays");
  const [vpcActor, setVpcActor] = useState("sleek digital holographic avatar");
  const [vpcResolution, setVpcResolution] = useState("8k hyperrealistic textured render");

  // Fullscreen mode state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Local editable preview state inside markdown output
  const [isEditingHtml, setIsEditingHtml] = useState(false);

  // Active Output tab (Raw Markdown vs Mockup Post/Poster)
  const [outputViewType, setOutputViewType] = useState<"markdown" | "mockup">("markdown");

  // Terminal Real-Time telemetry logs state
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);

  // Shared project collaboration states
  const [isSharedScope, setIsSharedScope] = useState(false);
  const [teamFeed, setTeamFeed] = useState([
    { user: "DevSarah", action: "optimized prompt structure for B2B", time: "2 mins ago" },
    { user: "AdminBoss", action: "verified Phenix clustering systems", time: "12 mins ago" },
    { user: "GrowthMark", action: "launched FB campaign draft #12", time: "30 mins ago" }
  ]);

  // Streaming display state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingRenderIndex, setStreamingRenderIndex] = useState(0);
  const [streamingProgressPercentage, setStreamingProgressPercentage] = useState(0);

  // Star / favorite toggle
  const toggleFavoriteTemplate = (id: string) => {
    setFavoriteTemplateIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem("pcs_starred_templates_" + (auth.currentUser?.uid || "guest"), JSON.stringify(next));
      return next;
    });
  };

  // Add a new Workspace tab
  const handleAddNewWorkspace = () => {
    const newId = "tab-" + Math.random().toString(36).substring(2, 9);
    const newTab: WorkspaceTab = {
      id: newId,
      name: `Sandbox Space ${workspaceTabs.length + 1}`,
      activeTab: "campaign",
      prompt: "",
      selectedTone: "creative",
      platform: "all-rounder",
      artStyle: "photorealistic",
      cameraMovement: "cinematic drone shot",
      audience: "general consumer",
      output: "",
      editedOutput: "",
      campaignOutput: null,
      selectedCampaignCard: "facebookCaption"
    };
    const updated = [...workspaceTabs, newTab];
    setWorkspaceTabs(updated);
    setActiveWorkspaceId(newId);
    localStorage.setItem("pcs_multitab_workspace_labs_" + (auth.currentUser?.uid || "guest"), JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("pcs-saas-toast", { detail: { msg: isEn ? "Sandbox Workspace Tab Opened!" : "নতুন স্যান্ডবক্স ড্রাফটিং স্পেস খোলা হয়েছে!", type: "success" } }));
    logDashboardActivity("workspace_create", `Created sandbox drafting tab: "${newTab.name}"`, `একটি নতুন ইনপুট ড্রাফটিং ট্যাব খুলেছেন: "${newTab.name}"`);
  };

  // Close a Workspace tab
  const handleCloseWorkspace = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (workspaceTabs.length <= 1) return;
    const closedTab = workspaceTabs.find(t => t.id === id);
    const remaining = workspaceTabs.filter(t => t.id !== id);
    setWorkspaceTabs(remaining);
    if (activeWorkspaceId === id) {
      setActiveWorkspaceId(remaining[0].id);
    }
    localStorage.setItem("pcs_multitab_workspace_labs_" + (auth.currentUser?.uid || "guest"), JSON.stringify(remaining));
    window.dispatchEvent(new CustomEvent("pcs-saas-toast", { detail: { msg: isEn ? `Closed Workspace: ${closedTab?.name || ""}` : `ওয়ার্কস্পেস বন্ধ করা হয়েছে: ${closedTab?.name || ""}`, type: "info" } }));
  };

  // Select Template & populate active inputs
  const handleSelectTemplate = (tpl: TemplatePrompt) => {
    updateActiveWorkspace({
      prompt: tpl.promptTemplate,
      activeTab: tpl.generatorType,
      selectedTone: tpl.tone
    });
    logDashboardActivity("template_apply", `Applied industry prompt template: "${tpl.title}"`, `ইন্ডাস্ট্রি টেমপ্লেট চালু করেছেন: "${tpl.title}"`);
  };

  // Drag and Drop implementation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      addTelemetryLog(`[multimodal] Error: Selected file "${file.name}" is not an image.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setMultimodalRefImage({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        type: file.type || "image/png",
        preview: event.target?.result as string
      });
      addTelemetryLog(`[multimodal] Engaged context reference image: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  // Add customized telemetry logging
  const addTelemetryLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTelemetryLogs(prev => [`[${timestamp}] ${msg}`, ...prev].slice(0, 50));
  };

  // Triggering visual video prompt generation directly to area
  const compileVideoPromptAndLoad = () => {
    const textPrompt = `Cinematic video: ${vpcResolution}. Capturing a ${vpcActor} interacting with physical items. Lens Movement: Close-up ${vpcAngle}. VFX Elements: ${vpcLighting}. Complete detailed camera storyboard in cinematic hyper-detailed textures. --ar 16:9`;
    updateActiveWorkspace({
      prompt: textPrompt,
      activeTab: "video"
    });
    addTelemetryLog("[video-builder] Composed advanced prompt design into active editor.");
  };

  // Live Auto-Save effect tracking
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isAutoSaveNotifed, setIsAutoSaveNotified] = useState(false);

  useEffect(() => {
    if (activeWorkspace.prompt) {
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = setTimeout(() => {
        setIsAutoSaveNotified(true);
        setTimeout(() => setIsAutoSaveNotified(false), 2000);
        // Persist drafts
        localStorage.setItem("pcs_multitab_workspace_labs_" + (auth.currentUser?.uid || "guest"), JSON.stringify(workspaceTabs));
      }, 1500);
    }
    return () => {
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    };
  }, [activeWorkspace.prompt, activeWorkspace.selectedTone, activeWorkspace.platform, activeWorkspace.artStyle, activeWorkspace.cameraMovement]);

  // Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey;
      if (isCmd && e.key === "Enter") {
        e.preventDefault();
        const executeButton = document.getElementById("trigger-generate-labs");
        if (executeButton) executeButton.click();
      } else if (isCmd && e.key === "s") {
        e.preventDefault();
        // save trigger
        const saveButton = document.getElementById("trigger-save-project-labs");
        if (saveButton) saveButton.click();
      } else if (e.key === "Escape") {
        updateActiveWorkspace({ prompt: "" });
        addTelemetryLog("[editor] Discarded editor prompt scope.");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [workspaceTabs, activeWorkspaceId]);

  // Streaming rendering interval simulation
  const triggerStreamingAnimate = (finalOutput: string, isCampaignObj: boolean = false, campaignObj: any = null) => {
    setIsStreaming(true);
    setStreamingProgressPercentage(0);
    setStreamingRenderIndex(0);
    updateActiveWorkspace({ output: "", editedOutput: "" });

    const totalLength = finalOutput.length;
    let index = 0;
    const increment = Math.ceil(totalLength / 25); // stream in healthy chunks

    addTelemetryLog(`[streamer] Initialized real-time streaming parser. Total output buffer: ${totalLength} chars.`);

    const interval = setInterval(() => {
      index += increment;
      if (index >= totalLength) {
        clearInterval(interval);
        setIsStreaming(false);
        setStreamingProgressPercentage(100);
        
        updateActiveWorkspace({
          output: finalOutput,
          editedOutput: finalOutput,
          campaignOutput: campaignObj
        });

        addTelemetryLog("[streamer] Completed rendering full payload memory map.");
      } else {
        const partialText = finalOutput.substring(0, index);
        updateActiveWorkspace({
          output: partialText,
          editedOutput: partialText
        });
        setStreamingProgressPercentage(Math.floor((index / totalLength) * 100));
        if (Math.random() > 0.6) {
          addTelemetryLog(`[streamer] Appended tokens... ${Math.floor((index/totalLength)*100)}% parsed.`);
        }
      }
    }, 45);
  };

  // Launch AI Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenerateLabs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace.prompt.trim()) {
      setErrorMessage(isEn ? "Prompt is empty. Please describe a concept." : "প্রম্পট ডেক খালি। দয়া করে প্রডাক্ট বা টপিকটি লিখুন।");
      return;
    }

    if (creditsUsed >= creditLimit) {
      setErrorMessage(
        isEn
          ? "Credits Limit Exhausted: Active credit quota exceeded. Upgrade subscription."
          : "ক্রেডিট কোটা শেষ হয়ে গেছে। দয়া করে বিলিং পেজে গিয়ে আপগ্রেড করুন।"
      );
      return;
    }

    setIsGenerating(false);
    setErrorMessage("");
    addTelemetryLog(`[gateway] Handshaking with Cognitive Cluster node utilizing ${activeEngine}...`);
    setIsGenerating(true);

    let additionalOptions: Record<string, string> = {};
    if (activeWorkspace.activeTab === "caption") additionalOptions.platform = activeWorkspace.platform;
    else if (activeWorkspace.activeTab === "poster") additionalOptions.artStyle = activeWorkspace.artStyle;
    else if (activeWorkspace.activeTab === "video") additionalOptions.cameraMovement = activeWorkspace.cameraMovement;
    else if (activeWorkspace.activeTab === "adcopy") additionalOptions.audience = activeWorkspace.audience;

    // Engaged multimodal
    if (multimodalRefImage) {
      additionalOptions.referenceContextImage = multimodalRefImage.name;
    }

    try {
      addTelemetryLog(`[gateway] Emitting prompt vector block: "${activeWorkspace.prompt.substring(0, 30)}..."`);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generatorType: activeWorkspace.activeTab,
          prompt: activeWorkspace.prompt,
          language: language,
          tone: activeWorkspace.selectedTone,
          additionalOptions,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "An error occurred during generation");
      }

      // Record Spent API Tokens
      const spentCost = Math.floor(Math.random() * 850) + 420;
      const nextCredits = Math.min(creditLimit, creditsUsed + spentCost);
      const nextGenCount = generatedCount + 1;
      await recordGenerationCost(spentCost, nextCredits, nextGenCount);

      addTelemetryLog(`[gateway] Telemetry Sync OK. Incurred Token Overhead: ${spentCost} units.`);
      setIsGenerating(false);

      if (activeWorkspace.activeTab === "campaign") {
        const campaignData = data.campaign || null;
        if (campaignData) {
          triggerStreamingAnimate(campaignData.facebookCaption || "", true, campaignData);
        } else {
          try {
            const parsed = JSON.parse(data.output);
            triggerStreamingAnimate(parsed.facebookCaption || "", true, parsed);
          } catch (e) {
            const fallback = {
              facebookCaption: data.output || "",
              hashtags: "#marketing #campaign #growth #pcs",
              posterPrompt: "Sleek enterprise launch product visual with fine details, soft illumination, professional design for: " + activeWorkspace.prompt,
              videoPrompt: "Cinematic premium slow camera wrap showcasing: " + activeWorkspace.prompt,
              adCopy: data.output || "",
              landingHeadline: "Unleash " + activeWorkspace.prompt + " like never before with elite PCS AI Studio solutions."
            };
            triggerStreamingAnimate(data.output || "", true, fallback);
          }
        }
      } else {
        triggerStreamingAnimate(data.output || "", false, null);
      }

      await logDashboardActivity(
        "generate_lab_pro",
        `Generated premium AI ${activeWorkspace.activeTab} on Laboratory desk: "${activeWorkspace.prompt.substring(0, 25)}..."`,
        `ল্যাব ডেস্কে প্রিমিয়াম এআই ${activeWorkspace.activeTab} জেনারেট করেছেন: "${activeWorkspace.prompt.substring(0, 25)}..."`
      );

    } catch (err: any) {
      addTelemetryLog(`[gateway] [error] Node failed validation: ${err?.message || "Failed"}`);
      setErrorMessage(err?.message || "Failed to make a cognitive API handshake.");
      setIsGenerating(false);
    }
  };

  // Switch Sub-deck under Unified Career Campaign output
  const handleCampaignCardSwitch = (cardKey: string) => {
    if (activeWorkspace.campaignOutput) {
      // Save current edits into the active slot before moving
      const updatedOutput = { ...activeWorkspace.campaignOutput };
      updatedOutput[activeWorkspace.selectedCampaignCard] = activeWorkspace.editedOutput;
      
      const targetContent = updatedOutput[cardKey] || "";
      updateActiveWorkspace({
        campaignOutput: updatedOutput,
        selectedCampaignCard: cardKey,
        output: targetContent,
        editedOutput: targetContent
      });
      addTelemetryLog(`[unified-deck] Focused output index: ${cardKey}`);
    }
  };

  // One click regenerate
  const handleRegenerate = () => {
    addTelemetryLog("[regeneration] Recalling active prompt context.");
    const dummyEvent = { preventDefault: () => {} } as React.FormEvent;
    handleGenerateLabs(dummyEvent);
  };

  // Direct Saved Projects Pipeline
  const [showDirectSave, setShowDirectSave] = useState(false);
  const [directSaveName, setDirectSaveName] = useState("");

  const triggerDirectSaveToVault = () => {
    setDirectSaveName(activeWorkspace.prompt.length > 25 ? activeWorkspace.prompt.substring(0, 25) + "..." : activeWorkspace.prompt || "AI Laboratory Project");
    setShowDirectSave(true);
  };

  const confirmDirectSave = () => {
    if (!directSaveName.trim()) return;

    let finalOutputVal = activeWorkspace.editedOutput || activeWorkspace.output;
    if (activeWorkspace.activeTab === "campaign" && activeWorkspace.campaignOutput) {
      const compiled = { ...activeWorkspace.campaignOutput };
      compiled[activeWorkspace.selectedCampaignCard] = finalOutputVal;
      finalOutputVal = JSON.stringify(compiled);
    }

    const newProj: UserProject = {
      id: "lab-proj-" + Math.random().toString(36).substring(2, 9),
      name: directSaveName,
      type: activeWorkspace.activeTab,
      prompt: activeWorkspace.prompt,
      language: language,
      timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }) + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      output: finalOutputVal,
      tone: activeWorkspace.selectedTone,
      notes: "Saved instantly from Premium Laboratory Workspace."
    };

    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem("pcs_ai_projects_" + (auth.currentUser?.uid || "guest"), JSON.stringify(updated));
    saveProjectsToCloud(updated);
    
    setShowDirectSave(false);
    logDashboardActivity("lab_vault_save", `Saved project: "${directSaveName}" instantly to secure vault.`, `ল্যাব থেকে প্রজেক্ট সংরক্ষণ সম্পন্ন: "${directSaveName}"`);
    addTelemetryLog(`[vault] Saved active draft: "${directSaveName}" permanently.`);
  };

  // Character, Word and Token counter helper
  const promptCharCount = activeWorkspace.prompt.length;
  const promptWordCount = activeWorkspace.prompt.trim() === "" ? 0 : activeWorkspace.prompt.trim().split(/\s+/).length;
  const approxPromptTokens = Math.ceil(promptWordCount * 1.35 + 2);

  const outCharCount = activeWorkspace.output.length;
  const outWordCount = activeWorkspace.output.trim() === "" ? 0 : activeWorkspace.output.trim().split(/\s+/).length;
  const approxOutTokens = Math.ceil(outWordCount * 1.35 + 2);

  const approxCostUSD = ((approxPromptTokens * 0.00015) / 1000) + ((approxOutTokens * 0.0006) / 1000);

  // Set default telemetry logs on mount
  useEffect(() => {
    if (telemetryLogs.length === 0) {
      addTelemetryLog("[system] Advanced Cognitive AI Laboratory Bootstrapped.");
      addTelemetryLog("[system] Listening on full-stack API endpoint /api/generate.");
      addTelemetryLog(`[system] Secured Session verified. Level Tier: ${activeTier}`);
    }
  }, []);

  return (
    <div id="advanced-lab-root" className={`relative rounded-3xl overflow-hidden transition-all duration-500 border border-gray-800/80 bg-black/45 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] ${
      isFullscreen ? "fixed inset-0 z-50 p-6 sm:p-12 bg-[#05060a]" : "space-y-8"
    }`}>
      
      {/* Absolute floating particles backdrop for immersive cyberpunk glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-cyan-500/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 h-full">
        
        {/* ==================== CONTROL MATRIX HEADER ROW ==================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-900 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-cyan-500/10 to-emerald-500/5 rounded-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex items-center justify-center">
              <Laptop className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase bg-cyan-900/40 text-cyan-400 border border-cyan-500/25 px-2 py-0.5 rounded-md font-bold tracking-wider">
                Enterprise AI Production Laboratory v2.1
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white flex items-center gap-2">
                <span>{isEn ? "Phoenix Studio Desk" : "ফিনিক্স স্টুডিও ডেস্ক"}</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono font-bold">ACTIVE PRO MODE</span>
              </h2>
            </div>
          </div>

          {/* Controller selectors */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Auto-save status bubble */}
            {isAutoSaveNotifed && (
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/20 border border-emerald-500/20 rounded-lg animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Auto-Saved Draft</span>
              </span>
            )}

            {/* Multi Language Prompt Workspace Switcher */}
            <div className="relative group flex items-center bg-[#090a0f]/80 p-1 pl-2 border border-cyan-500/20 rounded-xl select-none cursor-pointer" onClick={() => onOpenMultiLang && onOpenMultiLang()}>
              <Globe className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-[9px] font-mono text-gray-500 ml-1.5 uppercase font-bold hidden sm:inline-block">Current Language:</span>
              <select
                className="bg-transparent border-none text-[10px] text-cyan-400 font-mono font-extrabold outline-none pl-1.5 pr-2 py-1 cursor-pointer appearance-none"
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenMultiLang) onOpenMultiLang();
                }}
                onChange={(e) => {
                  if (onOpenMultiLang) onOpenMultiLang();
                }}
                value="en"
              >
                <option value="en">English (Active)</option>
                <option value="bn">Bengali / বাংলা</option>
                <option value="hi">Hindi / हिन्दी</option>
                <option value="ar">Arabic / العربية</option>
                <option value="es">Spanish / Español</option>
              </select>
            </div>

            {/* AI Engine Model Select */}
            <div className="bg-[#090a0f]/80 p-1 border border-gray-800 rounded-xl flex items-center gap-1 select-none">
              <span className="text-[9px] font-mono text-gray-500 px-2 uppercase font-bold">{isEn ? "Model" : "মডেল"}:</span>
              
              <button
                type="button"
                onClick={() => { setActiveEngine("gemini-flash"); addTelemetryLog("[model] Handshaking switch: gemini-3.5-flash"); }}
                className={`text-[10px] py-1 px-2.5 rounded-md font-mono font-extrabold cursor-pointer transition-all ${
                  activeEngine === "gemini-flash" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-extrabold" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Gemini Flash
              </button>

              <button
                type="button"
                onClick={() => { setActiveEngine("gemini-pro"); addTelemetryLog("[model] Switched to High fidelity: gemini-pro-1.5-experimental"); }}
                className={`text-[10px] py-1 px-2.5 rounded-md font-mono font-extrabold cursor-pointer transition-all ${
                  activeEngine === "gemini-pro" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-extrabold" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Gemini Pro
              </button>
            </div>

            {/* Scope Toggle: Personal vs Team Collaboration Workspace */}
            <button
              type="button"
              onClick={() => { setIsSharedScope(!isSharedScope); addTelemetryLog(`[collaboration] Toggled scope to ${!isSharedScope ? "SHARED TEAM NETWORK" : "PERSONAL PRIVACY"}`); }}
              className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer ${
                isSharedScope 
                  ? "bg-purple-950/20 border-purple-500/45 text-purple-400 font-extrabold shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                  : "bg-gray-900/60 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isSharedScope ? "Shared Network" : "Personal Desk"}</span>
            </button>

            {/* Keyboard shortcut trigger */}
            <button
              type="button"
              onClick={() => setIsShortcutModalOpen(true)}
              className="p-2.5 bg-gray-900/60 hover:bg-gray-800/80 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-emerald-400 rounded-xl transition-all cursor-pointer flex items-center justify-center"
              title="Keyboard Shortcuts Guide"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Fullscreen toggle button */}
            <button
              type="button"
              onClick={() => { setIsFullscreen(!isFullscreen); addTelemetryLog(`[workspace] Zen Mode initialized: ${!isFullscreen ? "FULLSCREEN FOCUS" : "STANDARD LAYOUT"}`); }}
              className="p-2.5 bg-gray-900/60 hover:bg-gray-800/80 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-cyan-400 rounded-xl transition-all cursor-pointer flex items-center justify-center"
              title="Toggle Fullscreen Zen Mode"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ==================== MULTI-TAB WORKSPACE NAVIGATION ==================== */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-gray-900/50 scrollbar-thin select-none">
          <span className="text-[10px] font-mono text-gray-500 uppercase px-2 font-bold shrink-0">Working Spaces:</span>
          
          <div className="flex items-center gap-2">
            {workspaceTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { 
                  setActiveWorkspaceId(tab.id); 
                  addTelemetryLog(`[workspace] Toggled dynamic tab: "${tab.name}"`); 
                  window.dispatchEvent(new CustomEvent("pcs-saas-toast", { detail: { msg: isEn ? `Switched to: ${tab.name}` : `ওয়ার্কস্পেসঃ ${tab.name}`, type: "info" } }));
                }}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-2 transition-all duration-300 cursor-pointer border relative z-10 overflow-hidden ${
                  activeWorkspaceId === tab.id
                    ? "text-cyan-400 font-extrabold"
                    : "bg-[#090a0f]/60 text-gray-500 border-gray-900/70 hover:text-gray-300 hover:border-gray-800"
                }`}
              >
                {activeWorkspaceId === tab.id && (
                  <motion.div
                    layoutId="activeWorkspaceTabGlow"
                    className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/35 rounded-xl -z-10 shadow-[0_0_12px_rgba(6,182,212,0.12)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span>{tab.name}</span>
                {workspaceTabs.length > 1 && (
                  <span
                    onClick={(e) => handleCloseWorkspace(tab.id, e)}
                    className="p-0.5 rounded-full hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all cursor-pointer shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </span>
                )}
              </button>
            ))}

            <button
              type="button"
              onClick={handleAddNewWorkspace}
              className="py-1.5 px-2.5 bg-[#0e1017]/80 hover:bg-[#121420] text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
              title="Create new active drafting tab"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isEn ? "Open New Workspace" : "নতুন প্রম্পটিং স্পেস"}</span>
            </button>
          </div>
        </div>

        {/* ==================== INTERACTIVE EXPERT SYSTEMS: GRID ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ==================== LEFT OPTIMIZER COGNITIVE CORE ==================== */}
          <div className="lg:col-span-4 space-y-6">

            {/* Template category Selector */}
            <div className="bg-[#090a0f]/40 border border-gray-900 rounded-2xl p-5 text-left md:space-y-4">
              <div className="flex items-center justify-between border-b border-gray-900 pb-2.5">
                <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-2">
                  <FolderOpen className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>{isEn ? "Expert Prompt Vault" : "এক্সপার্ট প্রম্পট টেমপ্লেট"}</span>
                </span>
                <span className="text-[10px] font-mono text-gray-500">Industry Profiles</span>
              </div>

              {/* Scrolling List of industrial preconfigured templates */}
              <div className="max-h-[300px] overflow-y-auto space-y-2 scrollbar-thin pr-1.5">
                {INDUSTRY_TEMPLATES.map((tpl) => {
                  const isFav = favoriteTemplateIds.includes(tpl.id);
                  return (
                    <div 
                      key={tpl.id}
                      className="group relative bg-[#090a0f]/80 hover:bg-[#121420]/75 border border-gray-800/60 hover:border-cyan-500/25 rounded-xl p-3 transition-all duration-300 text-left cursor-pointer"
                      onClick={() => handleSelectTemplate(tpl)}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div>
                          <p className="text-xs font-extrabold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wide">
                            {tpl.title}
                          </p>
                          <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5 line-clamp-2">
                            {tpl.desc}
                          </p>
                          <span className="inline-block px-1.5 py-0.2 bg-slate-900 text-[8px] text-slate-400 uppercase font-mono font-extrabold rounded-md border border-slate-800 mt-2">
                            {tpl.category} • {tpl.generatorType}
                          </span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleFavoriteTemplate(tpl.id); }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 cursor-pointer hover:bg-gray-900/30 transition-all shrink-0"
                          title="Favorite Template"
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Video Prompt Storyboard Builder */}
            {activeWorkspace.activeTab === "video" && (
              <div className="bg-[#090a0f]/40 border border-gray-900 rounded-2xl p-5 text-left space-y-4">
                <div className="flex items-center justify-between border-b border-gray-900 pb-2.5">
                  <span className="text-xs font-mono font-bold text-pink-400 tracking-wider uppercase flex items-center gap-2">
                    <VideoIcon className="w-3.5 h-3.5 text-pink-400" />
                    <span>{isEn ? "Sora Video storyboarder" : "সরা ভিডিও সিনোরিও"}</span>
                  </span>
                  <span className="text-[10px] bg-pink-500/20 text-pink-400 px-1 py-0.2 rounded font-mono">CINEMATIC</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-gray-500 text-[10px] font-mono uppercase mb-1">Camera Traid Flow:</label>
                    <select
                      value={vpcAngle}
                      onChange={(e) => setVpcAngle(e.target.value)}
                      className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2 text-xs text-gray-300 outline-none focus:border-pink-500/40"
                    >
                      <option value="cinematic sweeping crane shot">Sweeping Crane Sweep</option>
                      <option value="orbital panoramic slow wrap">Orbital wrap-around</option>
                      <option value="handheld documentary focus pull">Documentary Shaky Lensing</option>
                      <option value="dramatic infinite zoom-in macro lens">Macro zoom Infinite</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-500 text-[10px] font-mono uppercase mb-1">Synthesizer Lights:</label>
                    <select
                      value={vpcLighting}
                      onChange={(e) => setVpcLighting(e.target.value)}
                      className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2 text-xs text-gray-300 outline-none focus:border-pink-500/40"
                    >
                      <option value="cyberpunk orange & sapphire volumetric beams">Neo Cyberpunk Orange & Teal</option>
                      <option value="moody cinematic high-gloss dark keys">Dark Noir Contrast</option>
                      <option value="dreamy ethereal foggy dawn sun flares">Ethereal Misty Golden Hour</option>
                      <option value="studio pristine surgical high-contrast">Pristine white studio keys</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-500 text-[10px] font-mono uppercase mb-1">Target Subject Frame:</label>
                    <select
                      value={vpcActor}
                      onChange={(e) => setVpcActor(e.target.value)}
                      className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2 text-xs text-gray-300 outline-none focus:border-pink-500/40"
                    >
                      <option value="pristine organic product centering futuristic textures">Centered Master Product Frame</option>
                      <option value="hyperrealistic modern professional at marble workspace">Elite modern business woman</option>
                      <option value="abstract architectural construct with glowing emerald fluid">Floating emerald tech structure</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={compileVideoPromptAndLoad}
                    className="w-full py-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-400 rounded-xl font-bold font-mono transition-all text-[11px] cursor-pointer"
                  >
                    🚀 COMPILE & EXPORT STORYBOARD PROMPT
                  </button>
                </div>
              </div>
            )}

            {/* Collapsible Shared Team Activity Logger Feed */}
            <div className="bg-[#090a0f]/40 border border-gray-900 rounded-2xl p-5 text-left space-y-3.5">
              <div className="flex items-center justify-between border-b border-gray-900 pb-2.5">
                <span className="text-xs font-mono font-bold text-purple-400 tracking-wider uppercase flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>{isEn ? "Enterprise Team Stream" : "টিম কার্যকলাপ ফিড"}</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              </div>

              <div className="space-y-2.5">
                {teamFeed.map((f, i) => (
                  <div key={i} className="flex gap-2.5 items-start text-[11px] border-b border-gray-900/30 pb-2">
                    <span className="font-mono text-[9px] bg-slate-900 text-slate-400 px-1 py-0.2 rounded font-bold shrink-0">
                      {f.user}
                    </span>
                    <div>
                      <p className="text-gray-300 font-semibold">{f.action}</p>
                      <p className="text-[9px] text-gray-600 font-mono mt-0.5">{f.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Drag and Drop References Dock */}
            <div className="bg-[#090a0f]/40 border border-gray-900 rounded-2xl p-5 text-left space-y-3.5 relative overflow-hidden group/dock shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
              {/* Subtle background container gradient sweep */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/2 via-transparent to-purple-500/2 opacity-30 pointer-events-none" />

              {/* Top Row Label Info */}
              <div className="flex items-center justify-between border-b border-gray-900 pb-2.5 relative z-10">
                <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>{isEn ? "Multimodal Aesthetic Context" : "সংযুক্ত রেফারেন্স ইমেজ"}</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping inline-block shrink-0" />
                  <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/40">Active Sandbox</span>
                </div>
              </div>

              {/* Hidden Input file element */}
              <input 
                type="file"
                ref={fileInputRefSaaSAdvancedLabs}
                onChange={handleManualFileSelect}
                accept="image/*"
                className="hidden"
                id="saas-multimodal-file-input"
              />

              {/* Dynamic Interactive Box */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                  if (!multimodalRefImage && fileInputRefSaaSAdvancedLabs.current) {
                    fileInputRefSaaSAdvancedLabs.current.click();
                  }
                }}
                className={`group border rounded-xl p-4 transition-all duration-300 text-center flex flex-col items-center justify-center gap-3 relative select-none cursor-pointer overflow-hidden backdrop-blur-md ${
                    isDragOver 
                      ? "border-cyan-400 bg-cyan-950/10 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]" 
                      : multimodalRefImage 
                      ? "border-cyan-500/30 bg-[#080c14]/90 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                      : "border-gray-850 hover:border-cyan-500/50 bg-[#06070a]/90 hover:bg-[#080d16]/50 text-gray-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                }`}
                id="interactive-multimodal"
              >
                {/* Glowing subtle edge ring on hover */}
                <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/10 transition-all pointer-events-none rounded-xl" />

                {multimodalRefImage ? (
                  <div className="space-y-3 w-full relative z-10 text-left">
                    
                    {/* Status Loaded successfully neon header */}
                    <div className="flex items-center justify-between bg-emerald-950/20 border border-emerald-500/20 p-2 rounded-lg py-1.5">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Context Loaded Successfully</span>
                      </div>
                      <span className="text-[8px] font-mono text-emerald-500 shrink-0 bg-emerald-950/50 px-1 py-0.2 rounded">100% SECURE</span>
                    </div>

                    {/* Container Image live Preview */}
                    {multimodalRefImage.preview && (
                      <div className="relative group/preview rounded-lg overflow-hidden border border-cyan-500/30 max-h-40 flex items-center justify-center bg-black/50 p-1.5 shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
                        <img 
                          src={multimodalRefImage.preview} 
                          alt="Multimodal Guideline Draft" 
                          className="max-h-36 rounded-md object-contain w-full select-none"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Mask overlay on hover */}
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover/preview:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (fileInputRefSaaSAdvancedLabs.current) {
                                fileInputRefSaaSAdvancedLabs.current.click();
                              }
                            }}
                            className="px-2.5 py-1 text-[10px] uppercase font-bold bg-cyan-400 hover:bg-cyan-300 text-gray-950 rounded-md transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-md"
                          >
                            <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                            <span>Replace</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMultimodalRefImage(null);
                              addTelemetryLog("[multimodal] Discarded image context.");
                            }}
                            className="px-2.5 py-1 text-[10px] uppercase font-bold bg-red-950/85 hover:bg-red-900 border border-red-500/30 text-red-400 hover:text-white rounded-md transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Metadata summary & action panel */}
                    <div className="flex items-center justify-between gap-1.5 pt-1">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-mono text-gray-300 font-semibold truncate flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full shrink-0" />
                          <span className="truncate">{multimodalRefImage.name}</span>
                        </p>
                        <p className="text-[8px] font-mono text-gray-600 uppercase tracking-tight mt-0.5">
                          Size: {multimodalRefImage.size} • Type: {multimodalRefImage.type.replace("image/", "").toUpperCase()}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (fileInputRefSaaSAdvancedLabs.current) {
                              fileInputRefSaaSAdvancedLabs.current.click();
                            }
                          }}
                          className="p-1 px-1.5 rounded hover:bg-cyan-950/40 text-[10px] font-mono uppercase tracking-wider text-cyan-400 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMultimodalRefImage(null);
                            addTelemetryLog("[multimodal] Discarded image context.");
                          }}
                          className="p-1 px-1.5 rounded hover:bg-red-950/20 text-[10px] font-mono uppercase tracking-wider text-gray-600 hover:text-red-400 transition-all cursor-pointer flex items-center gap-1"
                          title="Discard Context"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ) : (
                  <>
                    {/* Pulsing beacon in top right */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[8px] font-mono text-gray-600 uppercase tracking-widest">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500/40 animate-pulse" />
                      <span>Ready</span>
                    </div>

                    {/* Graphical Visualizer Target Box */}
                    <div className="p-3 bg-[#0c0f16] group-hover:bg-[#0f1422] rounded-full border border-gray-850 group-hover:border-cyan-500/30 transition-all duration-300 relative shadow-inner">
                      <ImageIcon className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                      {/* Interactive focus scope corner tabs */}
                      <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-cyan-500/40 group-hover:border-cyan-500/80 transition-colors" />
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-cyan-500/40 group-hover:border-cyan-500/80 transition-colors" />
                      <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-cyan-500/40 group-hover:border-cyan-500/80 transition-colors" />
                      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-cyan-500/40 group-hover:border-cyan-500/85 transition-colors" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-300 group-hover:text-cyan-400 transition-all uppercase tracking-wide">
                        {isEn ? "Select or Drop Context Image" : "ড্র্যাগ অথবা ব্রাউজ করুন"}
                      </p>
                      <p className="text-[9px] text-gray-500 group-hover:text-gray-400 transition-colors leading-normal max-w-xs mx-auto">
                        {isEn ? "Accepts optional visual directives to map aesthetic cues" : "অ্যাস্থেটিক কিউ ম্যাপিং করার জন্য ডাইরেক্ট রেফারেন্স"}
                      </p>
                    </div>

                    {/* Sandbox spec tags */}
                    <div className="text-[8px] font-mono tracking-wider uppercase border-t border-gray-900/40 pt-2 w-full flex justify-between px-1 text-gray-600 pointer-events-none md:flex-row flex-col gap-1 items-center">
                      <span>TYPE: PNG, JPG, WEBP</span>
                      <span>SECURE: LOCAL SANDBOX</span>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* ==================== CENTRAL WRITER & OUTPUT SCREEN ==================== */}
          <div className="lg:col-span-8 space-y-6">

            <div className="bg-[#121420]/75 backdrop-blur-md rounded-3xl border border-gray-800 p-6 sm:p-8 space-y-6 text-left shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
              
              <form onSubmit={handleGenerateLabs} className="space-y-5">
                
                {/* Core Idea Prompt Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-2">
                      <span>{isEn ? "Prompt Engine Constructor" : "প্রম্পট কনস্ট্রাক্টর ডেক"}</span>
                    </label>
                    
                    {/* Character Word & Token Counter indicators */}
                    <div className="flex items-center gap-3 font-mono text-[9px] text-gray-500">
                      <span>Words: <strong className="text-gray-300">{promptWordCount}</strong></span>
                      <span>Approx Tokens: <strong className="text-emerald-400">{approxPromptTokens}</strong></span>
                      <span>Est Cost: <strong className="text-cyan-400">${approxCostUSD.toFixed(5)}</strong></span>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    value={activeWorkspace.prompt}
                    onChange={(e) => updateActiveWorkspace({ prompt: e.target.value })}
                    placeholder={
                      activeWorkspace.activeTab === "campaign"
                        ? (isEn ? "Enter your business idea/topic (e.g., launch eco-friendly handmade bamboo toothbrush with premium organic bristles or organic food delivery in Dhaka city)..." : "আপনার ব্যবসায়িক ধারণা বা টপিকটি লিখুন (যেমন: পরিবেশবান্ধব বাঁশের টুথব্রাশ অথবা ঢাকা শহরে অর্গানিক খাবার ডেলিভারি স্টার্টআপ)...")
                        : activeWorkspace.activeTab === "caption"
                        ? (isEn ? "Describe your photo/video/topic (e.g., launching my new coffee shop in Dhaka with organic beans)..." : "আপনার ছবি/ভিডিও/বিষয়বস্তু বর্ণনা করুন (যেমন: ঢাকায় নতুন অর্গানিক কফি শপের শুভ উদ্বোধন)...")
                        : activeWorkspace.activeTab === "poster"
                        ? (isEn ? "Describe your poster topic (e.g., retro futuristic cyber-bazaar with glowing neon storefronts)..." : "আপনার পোস্টারটির ধারণা দিন (যেমন: সাইবারপাঙ্ক শহরের রঙিন রাতের বাজার এবং আলো ঝলমলে সাইনবোর্ড)...")
                        : activeWorkspace.activeTab === "video"
                        ? (isEn ? "Describe your cinematic video scene (e.g., ancient historical temple hidden in deep misty jungles)..." : "আপনার ভিডিও দৃশ্যের বিবরণ দিন (যেমন: কুয়াশাচ্ছন্ন বনের গভীরে হারিয়ে যাওয়া প্রাচীন রাজকীয় মন্দির)...")
                        : (isEn ? "Describe your product/service features (e.g., next-generation smart water bottle that track hydration in real-time)..." : "আপনার পণ্য/সার্ভিসের বিবরণ দিন (যেমন: পরবর্তী প্রজন্মের স্মার্ট ওয়াটার বোতল যা পানির চাহিদার হিসেব রাখে)...")
                    }
                    className="w-full bg-[#090a0f]/85 border border-gray-800 focus:border-[#06b6d4]/65 rounded-xl p-4 text-xs tracking-wide leading-relaxed text-gray-100 placeholder-gray-600 outline-none transition-all duration-300 shadow-inner focus:ring-1 focus:ring-cyan-500/25"
                    id="playground-input-labs"
                  />
                </div>

                {/* Fine Tune Parameter Block Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 border-t border-gray-900 pb-2 pt-4">
                  
                  <div>
                    <label className="block text-[10px] font-mono text-gray-500 mb-1.5 uppercase font-bold">Workspace Deck Tone:</label>
                    <select
                      value={activeWorkspace.selectedTone}
                      onChange={(e) => updateActiveWorkspace({ selectedTone: e.target.value })}
                      className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-300 outline-none focus:border-cyan-500/50"
                    >
                      <option value="creative">🎨 Creative Studio Style</option>
                      <option value="professional">💼 Professional B2B</option>
                      <option value="bold">🚀 Bold Conversions</option>
                      <option value="funny">😆 Humorous & Smart</option>
                      <option value="empathetic">❤️ Humane & Healing</option>
                    </select>
                  </div>

                  {activeWorkspace.activeTab === "caption" && (
                    <div>
                      <label className="block text-[10px] font-mono text-gray-500 mb-1.5 uppercase font-bold">Target platform channel:</label>
                      <select
                        value={activeWorkspace.platform}
                        onChange={(e) => updateActiveWorkspace({ platform: e.target.value })}
                        className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-300 outline-none focus:border-cyan-500/50"
                      >
                        <option value="all-rounder">✨ All-Rounder Viral</option>
                        <option value="facebook">👥 Facebook Feed Story</option>
                        <option value="instagram">📸 Instagram Post</option>
                        <option value="linkedin">💼 professional LinkedIn</option>
                      </select>
                    </div>
                  )}

                  {activeWorkspace.activeTab === "poster" && (
                    <div>
                      <label className="block text-[10px] font-mono text-gray-500 mb-1.5 uppercase font-bold">Visual styling palette:</label>
                      <select
                        value={activeWorkspace.artStyle}
                        onChange={(e) => updateActiveWorkspace({ artStyle: e.target.value })}
                        className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-300 outline-none focus:border-cyan-500/50"
                      >
                        <option value="photorealistic">📸 Studio Portrait</option>
                        <option value="cyberpunk">🌃 Cyberpunk glowing neon</option>
                        <option value="3D-isometric">📦 3D isometric minimal</option>
                      </select>
                    </div>
                  )}

                  {activeWorkspace.activeTab === "video" && (
                    <div>
                      <label className="block text-[10px] font-mono text-gray-500 mb-1.5 uppercase font-bold">Camera Motion sweep:</label>
                      <select
                        value={activeWorkspace.cameraMovement}
                        onChange={(e) => updateActiveWorkspace({ cameraMovement: e.target.value })}
                        className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-300 outline-none focus:border-cyan-500/50"
                      >
                        <option value="cinematic drone shot">Cinematic Drone Sweep</option>
                        <option value="fast tracking pan left to right">Fast Tracking slide</option>
                        <option value="orbit wrap 360-degree slow pan">Orbit Wrap 360 slow</option>
                      </select>
                    </div>
                  )}

                  {activeWorkspace.activeTab === "adcopy" && (
                    <div>
                      <label className="block text-[10px] font-mono text-gray-500 mb-1.5 uppercase font-bold">Audience Focus targets:</label>
                      <select
                        value={activeWorkspace.audience}
                        onChange={(e) => updateActiveWorkspace({ audience: e.target.value })}
                        className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-300 outline-none focus:border-cyan-500/50"
                      >
                        <option value="general consumer">General consumers</option>
                        <option value="high-tech decision executives">High-tech executives</option>
                        <option value="young campus students">Young digital creators</option>
                      </select>
                    </div>
                  )}

                  {/* Right side generate trigger box */}
                  <div className="flex items-end justify-end">
                    <button
                      type="submit"
                      disabled={isGenerating || isStreaming}
                      id="trigger-generate-labs"
                      className={`w-full py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.15)] ${
                        isGenerating || isStreaming
                          ? "bg-cyan-500/10 text-cyan-500 pointer-events-none animate-pulse" 
                          : "bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-extrabold"
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                          <span>SYNAPSE CALIBRATING...</span>
                        </>
                      ) : isStreaming ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                          <span>STREAMING CHUNKS...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>{isEn ? "TRANSMIT PROMPT ENGINE" : "প্রম্পট ট্রান্সমিট করুন"}</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </form>

              {/* Status Alert Error boundary notifications */}
              {errorMessage && (
                <div className="p-4 bg-red-950/20 border border-red-500/30 text-red-400 text-xs rounded-xl font-mono text-left">
                  🛑 <strong>NODE FAULT EXCEPTION:</strong> {errorMessage}
                </div>
              )}

              {/* Progress counter for streaming chunks */}
              {isStreaming && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                    <span>Streaming Output Memory Slots...</span>
                    <span className="text-emerald-400 font-bold">{streamingProgressPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-950 rounded-full overflow-hidden border border-gray-900">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${streamingProgressPercentage}%` }}
                      transition={{ ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}

              {/* ==================== SWAP INTEGRATED OUTPUT VIEWS ==================== */}
              {(activeWorkspace.output || isStreaming) && (
                <div className="space-y-4 border-t border-gray-900 pt-5">
                  
                  {/* Sub cards panel for Unified Campaign format */}
                  {activeWorkspace.activeTab === "campaign" && activeWorkspace.campaignOutput && (
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-[#090a0f]/60 p-1 rounded-xl border border-gray-800/80 mb-4 select-none">
                      
                      <button
                        type="button"
                        onClick={() => handleCampaignCardSwitch("facebookCaption")}
                        className={`py-2 px-2.5 rounded-lg text-[10px] font-bold cursor-pointer font-mono tracking-wider transition-all truncate ${
                          activeWorkspace.selectedCampaignCard === "facebookCaption"
                            ? "bg-cyan-500/15 border border-cyan-500/35 text-cyan-400"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        FB Caption
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCampaignCardSwitch("hashtags")}
                        className={`py-2 px-2.5 rounded-lg text-[10px] font-bold cursor-pointer font-mono tracking-wider transition-all truncate ${
                          activeWorkspace.selectedCampaignCard === "hashtags"
                            ? "bg-cyan-500/15 border border-cyan-500/35 text-cyan-400"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        Hashtags
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCampaignCardSwitch("posterPrompt")}
                        className={`py-2 px-2.5 rounded-lg text-[10px] font-bold cursor-pointer font-mono tracking-wider transition-all truncate ${
                          activeWorkspace.selectedCampaignCard === "posterPrompt"
                            ? "bg-cyan-500/15 border border-cyan-500/35 text-cyan-400"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        Midjourney
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCampaignCardSwitch("videoPrompt")}
                        className={`py-2 px-2.5 rounded-lg text-[10px] font-bold cursor-pointer font-mono tracking-wider transition-all truncate ${
                          activeWorkspace.selectedCampaignCard === "videoPrompt"
                            ? "bg-cyan-500/15 border border-cyan-500/35 text-cyan-400"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        Runway / Veo
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCampaignCardSwitch("adCopy")}
                        className={`py-2 px-2.5 rounded-lg text-[10px] font-bold cursor-pointer font-mono tracking-wider transition-all truncate ${
                          activeWorkspace.selectedCampaignCard === "adCopy"
                            ? "bg-cyan-500/15 border border-cyan-500/35 text-cyan-400"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        Ad Copy
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCampaignCardSwitch("landingHeadline")}
                        className={`py-2 px-2.5 rounded-lg text-[10px] font-bold cursor-pointer font-mono tracking-wider transition-all truncate ${
                          activeWorkspace.selectedCampaignCard === "landingHeadline"
                            ? "bg-cyan-500/15 border border-cyan-500/35 text-cyan-400"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        Headline
                      </button>

                    </div>
                  )}

                  {/* Output Header Menu bar options */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#090a0f]/80 p-1.5 px-3 rounded-2xl border border-gray-800">
                    
                    {/* View selectors: Raw markdown vs Mockup social post */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setOutputViewType("markdown")}
                        className={`text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                          outputViewType === "markdown" ? "bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 font-extrabold" : "text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Interactive Output Markdown</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setOutputViewType("mockup"); addTelemetryLog("[mockup] Rendered premium interactive split live preview frame."); }}
                        className={`text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                          outputViewType === "mockup" ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-extrabold" : "text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5 animate-pulse" />
                        <span>Split-Screen Live Mockup</span>
                      </button>
                    </div>

                    {/* Operational download toolset buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const text = isEditingHtml ? activeWorkspace.editedOutput : activeWorkspace.output;
                          navigator.clipboard.writeText(text);
                          addTelemetryLog("[export] Copied generated output to clipboard payload.");
                        }}
                        className="py-1 px-2.5 rounded-lg border border-gray-800 hover:border-gray-700 bg-gray-900/60 hover:bg-gray-800 text-gray-400 hover:text-gray-200 text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
                        title="Copy to clipboard buffer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const text = isEditingHtml ? activeWorkspace.editedOutput : activeWorkspace.output;
                          const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = `Phoenix_AI_${activeWorkspace.activeTab}_${Date.now()}.txt`;
                          link.click();
                          URL.revokeObjectURL(url);
                          addTelemetryLog("[export] Dispatched text file export downline.");
                        }}
                        className="py-1 px-2.5 rounded-lg border border-gray-800 hover:border-gray-700 bg-gray-900/60 hover:bg-gray-800 text-gray-400 hover:text-gray-200 text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
                        title="Export as Text file"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>

                      <button
                        type="button"
                        id="trigger-save-project-labs"
                        onClick={triggerDirectSaveToVault}
                        className="py-1 px-2.5 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400 text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
                        title="Save to secure custom vault"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save to Vault</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRegenerate}
                        className="p-1 rounded-lg border border-cyan-500/25 text-cyan-400 hover:bg-cyan-950/20 cursor-pointer"
                        title="Regenerate Draft"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                      </button>
                    </div>

                  </div>

                  {/* MAIN OUTPUT LAYOUT PREVIEWS */}
                  <div className="relative rounded-2xl border border-gray-850 bg-[#090a0f]/80 p-5 font-sans min-h-[250px] text-left">
                    
                    {/* Live typing animation cursor if streaming */}
                    {isStreaming && (
                      <div className="absolute top-4 right-4 text-[9px] font-mono uppercase text-emerald-400 animate-pulse flex items-center gap-1 bg-emerald-950/20 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>Streaming Core Payload</span>
                      </div>
                    )}

                    {outputViewType === "markdown" ? (
                      
                      <div className="space-y-4">
                        
                        {/* Editor mode toggler */}
                        <div className="flex border-b border-gray-900 pb-2.5 mb-2 float-right select-none">
                          <button
                            type="button"
                            onClick={() => setIsEditingHtml(!isEditingHtml)}
                            className="text-[10px] font-mono font-bold bg-[#121420]/80 border border-gray-800 flex items-center gap-1 py-1 px-2 rounded-md text-cyan-400 hover:text-cyan-300 hover:border-gray-700 transition-all cursor-pointer"
                          >
                            {isEditingHtml ? (
                              <>
                                <CheckSquare className="w-3 h-3 text-emerald-400" />
                                <span>Preview Rendered Markdown</span>
                              </>
                            ) : (
                              <>
                                <Edit className="w-3 h-3" />
                                <span>Activate Inline Workspace Editor</span>
                              </>
                            )}
                          </button>
                        </div>
                        
                        <div className="clear-both">
                          {isEditingHtml ? (
                            <textarea
                              rows={12}
                              value={activeWorkspace.editedOutput}
                              onChange={(e) => updateActiveWorkspace({ editedOutput: e.target.value })}
                              className="w-full bg-[#050608] border border-cyan-500/25 p-4 rounded-xl font-mono text-xs leading-relaxed text-gray-200 outline-none focus:ring-1 focus:ring-cyan-500/25"
                            />
                          ) : (
                            <div className="markdown-body prose prose-invert max-w-none text-xs text-gray-300 leading-relaxed tracking-wide space-y-4">
                              <ReactMarkdown>{activeWorkspace.editedOutput || activeWorkspace.output}</ReactMarkdown>
                            </div>
                          )}
                        </div>

                      </div>

                    ) : (

                      /* HIGH FIDELITY CYBERPUNK REAL-WORLD MOCKUPS SPLIT PREVIEWS */
                      <div className="py-2 animate-fade-in select-none">
                        
                        {/* 1. Tool is CAPTION: Render actual mobile phone Instagram Post feed */}
                        {activeWorkspace.activeTab === "caption" && (
                          <div className="max-w-md mx-auto bg-black rounded-3xl border-4 border-gray-800 overflow-hidden shadow-2xl">
                            {/* Inner Instagram style structure */}
                            <div className="bg-[#121212] p-3 border-b border-gray-900 flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 p-0.5">
                                  <span className="w-full h-full block bg-black rounded-full flex items-center justify-center text-[10px] font-black text-cyan-400">PCS</span>
                                </span>
                                <div>
                                  <p className="text-[11px] font-extrabold text-white">pcs_ai_studio</p>
                                  <p className="text-[8px] text-gray-500">Sponsored • Creative Lab</p>
                                </div>
                              </div>
                              <span className="text-gray-400 text-xs font-black">•••</span>
                            </div>

                            {/* Center Post Content Aesthetic Placeholder */}
                            <div className="aspect-square bg-gradient-to-br from-cyan-900/40 via-purple-900/40 to-black p-8 flex flex-col items-center justify-center text-center border-b border-gray-900 relative">
                              <div className="absolute inset-0 bg-[#000000]/20 pointer-events-none" />
                              <Sparkles className="w-12 h-12 text-[#06b6d4] animate-pulse mb-3" />
                              <h3 className="text-sm font-display font-extrabold tracking-tight text-white mb-2">PCS AI STUDIO WORKSPACE</h3>
                              <p className="text-[10px] text-cyan-400 font-mono tracking-wider">PREVIEW CONDITIONING ENGAGED</p>
                            </div>

                            {/* Feed Body caption area */}
                            <div className="p-3.5 space-y-2 text-xs">
                              <div className="flex items-center gap-3.5 text-white">
                                <span className="text-red-500 font-extrabold text-base">❤️</span>
                                <span className="text-gray-300 text-sm">💬</span>
                                <span className="text-gray-300 text-sm">🔄</span>
                              </div>
                              <p className="text-[10px] font-bold text-gray-400">1,256 Likes</p>
                              <div>
                                <span className="font-extrabold text-[11px] text-white">pcs_ai_studio </span>
                                <span className="text-gray-300 whitespace-pre-wrap leading-relaxed text-[11px]">
                                  {activeWorkspace.editedOutput || activeWorkspace.output}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. Tool is POSTER: Render actual High contrast poster gallery mockup */}
                        {activeWorkspace.activeTab === "poster" && (
                          <div className="max-w-md mx-auto bg-[#0d0e12] border-8 border-[#1f2026] rounded-2xl p-6 shadow-2xl relative text-center flex flex-col items-center justify-between min-h-[400px]">
                            {/* Poster layout details */}
                            <div className="border border-cyan-500/25 rounded bg-[#090a0f]/80 p-1.5 px-3 mb-4">
                              <span className="text-[8px] font-mono text-cyan-400">MIDJOURNEY v6 MODEL SCHEDULER</span>
                            </div>

                            <div className="space-y-4 my-auto">
                              <div className="relative p-8 bg-gradient-to-tr from-cyan-900/35 to-emerald-950/30 rounded-full border border-gray-800 shadow-inner">
                                <ImageIcon className="w-16 h-16 text-cyan-400 animate-pulse mx-auto" />
                              </div>
                              
                              <div className="space-y-1">
                                <h4 className="text-base font-display font-black text-white uppercase tracking-wider">
                                  PCS INTEL SYSTEM DESIGN
                                </h4>
                                <p className="text-[9px] text-[#06b6d4] font-mono tracking-widest uppercase">
                                  Abstract Cinematic Portrait Canvas
                                </p>
                              </div>
                            </div>

                            {/* Master prompt print line */}
                            <div className="w-full mt-6 bg-[#040508] p-3.5 rounded-xl border border-gray-900 text-left">
                              <p className="text-[8px] text-emerald-400 font-mono mb-1 uppercase font-bold">Copy-paste prompt code:</p>
                              <p className="text-[10px] font-mono text-gray-300 select-all line-clamp-3 leading-relaxed">
                                {activeWorkspace.editedOutput || activeWorkspace.output}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* 3. Tool is VIDEO: Cinematic play console player */}
                        {activeWorkspace.activeTab === "video" && (
                          <div className="max-w-xl mx-auto bg-black border border-gray-900 rounded-2xl overflow-hidden p-3.5 shadow-2xl relative font-mono text-xs">
                            <div className="bg-[#0c0d12] border border-gray-850 p-6 rounded-xl relative overflow-hidden aspect-video flex flex-col items-center justify-center text-center">
                              {/* Glowing screen effect */}
                              <div className="absolute inset-0 bg-[#000000]/30 pointer-events-none" />
                              <div className="absolute top-3 left-3 bg-red-600/20 text-red-500 border border-red-500/25 px-2 py-0.5 rounded text-[8px] font-bold animate-pulse">
                                LIVE PROCESS REC
                              </div>
                              <VideoIcon className="w-14 h-14 text-pink-500 animate-pulse mb-3" />
                              <p className="text-[10px] font-bold text-gray-300">Veo Kinetic Frame Render Engaged</p>
                              <p className="text-[9px] text-gray-600 mt-1 uppercase">Cinematic dolly panoramic wrap</p>
                            </div>

                            {/* Video controls console */}
                            <div className="mt-3.5 p-3.5 bg-[#090a0f] rounded-xl border border-gray-850 flex items-center justify-between text-[10px] text-gray-500">
                              <div className="flex items-center gap-2 text-pink-400 font-bold text-xs">
                                <span>▶ Play</span>
                                <span>⏸ Stop</span>
                                <span className="text-gray-600">00:00 / 00:05</span>
                              </div>
                              <div className="font-mono text-right truncate max-w-[200px] text-gray-400">
                                {activeWorkspace.editedOutput.substring(0, 30)}...
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 4. Tool is ADCOPY: Sponsored Social Meta Card Ad */}
                        {activeWorkspace.activeTab === "adcopy" && (
                          <div className="max-w-md mx-auto bg-[#18191a] content-start text-left rounded-xl border border-gray-800 p-4 font-sans shadow-2xl text-xs space-y-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 bg-cyan-900/50 rounded-lg flex items-center justify-center border border-cyan-500/25 text-[10px] font-black text-cyan-400">
                                PCS
                              </div>
                              <div>
                                <p className="font-extrabold text-white text-[13px] hover:underline cursor-pointer">PCS AI Studio Campaigns</p>
                                <p className="text-[10px] text-gray-500">Sponsored • Paid Optimization Network</p>
                              </div>
                            </div>

                            {/* Body Paragraph copy */}
                            <p className="text-[11px] text-gray-300 leading-relaxed font-normal whitespace-pre-wrap">
                              {activeWorkspace.editedOutput || activeWorkspace.output}
                            </p>

                            {/* Card call to action area */}
                            <div className="border border-gray-800 rounded-xl bg-black overflow-hidden flex items-center justify-between p-3.5">
                              <div>
                                <p className="text-[10px] text-gray-500 uppercase font-mono tracking-wider">HTTPS://PCSAI.STUDIO/BUILD</p>
                                <p className="font-extrabold text-white text-xs mt-0.5">Automate 10x Copwriting Speed</p>
                              </div>
                              <button
                                type="button"
                                className="py-2 px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold rounded-lg text-xs tracking-wider cursor-pointer"
                              >
                                REGISTER
                              </button>
                            </div>
                          </div>
                        )}

                      </div>

                    )}

                  </div>

                </div>
              )}

              {/* Collapsible Real-time developer output telemetry console */}
              <div className="border border-gray-900 rounded-2xl overflow-hidden bg-[#040508]/90 font-mono text-left select-none">
                <div 
                  onClick={() => setIsTerminalCollapsed(!isTerminalCollapsed)}
                  className="bg-[#090a0f] p-3 px-4 flex items-center justify-between border-b border-gray-900 cursor-pointer text-xs"
                >
                  <span className="text-[#06b6d4] font-bold tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    <span>REAL-TIME COGNITIVE TRANSIT TERMINAL</span>
                  </span>
                  <span className="text-[9px] text-gray-500 font-bold hover:text-cyan-400">
                    {isTerminalCollapsed ? "[MAXIMIZE]" : "[COLLAPSE]"}
                  </span>
                </div>

                {!isTerminalCollapsed && (
                  <div className="p-4 max-h-[160px] overflow-y-auto space-y-1.5 scrollbar-thin text-[10px] text-gray-500 font-mono">
                    {telemetryLogs.length === 0 ? (
                      <p className="text-gray-700 italic">Terminal awaiting prompt instruction transmission...</p>
                    ) : (
                      telemetryLogs.map((log, index) => (
                        <p key={index} className={
                          log.includes("[error]") 
                            ? "text-red-400" 
                            : log.includes("[success]") 
                            ? "text-emerald-400 font-bold" 
                            : log.includes("[streamer]") 
                            ? "text-cyan-400" 
                            : "text-gray-500"
                        }>
                          {log}
                        </p>
                      ))
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ==================== DIRECT INSTANT SAVE PROJ DIALOG ==================== */}
      <AnimatePresence>
        {showDirectSave && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 text-left">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#121420] border border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-gray-900 pb-3">
                <h3 className="text-white font-extrabold text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Secure Laboratory Sync Vault</span>
                </h3>
                <button
                  onClick={() => setShowDirectSave(false)}
                  className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1.5 font-bold">Project Name label:</label>
                  <input
                    type="text"
                    value={directSaveName}
                    onChange={(e) => setDirectSaveName(e.target.value)}
                    className="w-full bg-[#08090f] border border-gray-850 rounded-lg p-3 text-white outline-none focus:border-emerald-500/40"
                    placeholder="Enter project name..."
                  />
                  <p className="text-[10px] text-gray-600 mt-1 uppercase font-mono">
                    Cloud instance: user_auth_node &rarr; clients/synchronized
                  </p>
                </div>

                <div className="flex gap-2 justify-end border-t border-gray-900 pt-3.5 select-none">
                  <button
                    onClick={() => setShowDirectSave(false)}
                    className="py-2 px-4 rounded-xl bg-gray-900 text-gray-400 hover:text-white border border-gray-800 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={confirmDirectSave}
                    className="py-2 px-4 rounded-xl bg-emerald-500 text-black font-extrabold cursor-pointer"
                  >
                    Save Project
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== SHORTCUTS DIALOG ==================== */}
      <AnimatePresence>
        {isShortcutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 text-left">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#121420] border border-gray-800 rounded-2xl max-w-sm w-full p-6 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-gray-900 pb-3">
                <h3 className="text-white font-extrabold text-sm flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-cyan-400" />
                  <span>Developer Keyboard Shortcuts</span>
                </h3>
                <button
                  onClick={() => setIsShortcutModalOpen(false)}
                  className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 font-mono text-xs text-gray-400">
                <div className="flex justify-between items-center border-b border-gray-900/40 pb-2">
                  <span>Transmit Prompt Engine</span>
                  <span className="text-cyan-400 font-bold bg-[#08090f] px-2 py-0.5 rounded border border-gray-800">Ctrl + Enter</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-gray-900/40 pb-2">
                  <span>Save Draft to Vault</span>
                  <span className="text-cyan-400 font-bold bg-[#08090f] px-2 py-0.5 rounded border border-gray-800">Ctrl + S</span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-900/40 pb-2">
                  <span>Discard text block</span>
                  <span className="text-cyan-400 font-bold bg-[#08090f] px-2 py-0.5 rounded border border-gray-800">Esc</span>
                </div>
              </div>

              <button
                onClick={() => setIsShortcutModalOpen(false)}
                className="w-full py-2 bg-gray-900 hover:bg-gray-850 text-white font-extrabold border border-gray-800 rounded-xl text-xs cursor-pointer select-none text-center"
              >
                Dismiss
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
