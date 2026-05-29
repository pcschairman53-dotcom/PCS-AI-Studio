import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, Copy, Check, Sliders, Download, Edit, Save, 
  Trash2, Layers, Cpu, Eye, MessageSquareCode, Image as ImageIcon, 
  Video as VideoIcon, Megaphone, Clock, CheckCircle, ChevronRight, X,
  LayoutDashboard, CreditCard, Activity, Search, RefreshCw, Terminal, 
  FolderHeart, Database, Shield, Zap, Info, Filter, ArrowRightLeft, Menu,
  User, LogOut, Plus, Lock, Unlock, TrendingUp, Monitor, History, EyeOff, Globe, Bell, LayoutTemplate
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { GeneratorType, Language, SavedResult, ToneOption, UserProject, VaultPrompt, DashboardActivity } from "../types";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import SaaSAdvancedLabs from "./SaaSAdvancedLabs";
import { VideoGeneratorModule } from "./VideoGeneratorModule";
import { SaaSToastContainer, SaaSSearchAndFilter, SaaSExportButton, SaaSCopyButton, triggerSaaSToast } from "./SaaSEnterpriseModules";
import { SaaSTelemetryModule } from "./SaaSTelemetryModule";
import { SaaSPremiumBilling } from "./SaaSPremiumBilling";
import SaaSLeadCaptureCRM from "./SaaSLeadCaptureCRM";
import AIEmailCampaignGenerator from "./AIEmailCampaignGenerator";
import SaasTool from "./SaaSTool";
import SaaSLandingTemplates from "./SaaSLandingTemplates";
import SaaSHybridStudio from "./SaaSHybridStudio";
import SaaSPromptsPack from "./SaaSPromptsPack";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error("Firestore Error info logged: ", JSON.stringify(errInfo));
  return errInfo;
}


interface SaasDashboardProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onExit: () => void;
}

const TONES: ToneOption[] = [
  { id: "creative", nameEn: "Creative Studio", nameBn: "সৃজনশীল স্টুডিও", emoji: "🎨" },
  { id: "professional", nameEn: "Professional B2B", nameBn: "পেশাদার বিটুবি", emoji: "💼" },
  { id: "funny", nameEn: "Witty / Hooking", nameBn: "রসাত্মক / হুকার", emoji: "😆" },
  { id: "bold", nameEn: "Bold Sales AIDA", nameBn: "সাহসী সেলস এআইডিএ", emoji: "🚀" },
  { id: "empathetic", nameEn: "Empathetic Human", nameBn: "সহানুভূতিশীল হিউম্যান", emoji: "❤️" },
  { id: "urgent", nameEn: "FOMO Trigger", nameBn: "এফওএমও ট্রিগার", emoji: "🚨" },
];

export default function SaasDashboard({ language, setLanguage, onExit }: SaasDashboardProps) {
  const isEn = language === "english";
  const [activeSubView, setActiveSubView] = useState<"overview" | "hybrid" | "studio" | "video" | "email" | "multilang" | "landing-templates" | "projects" | "cluster" | "billing" | "profile" | "promptspack">("overview");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLeadCaptureModalOpen, setIsLeadCaptureModalOpen] = useState(false);

  // Set up global hook so other panels can open the lead capture popup
  useEffect(() => {
    const handleOpen = () => setIsLeadCaptureModalOpen(true);
    window.addEventListener("pcs-open-lead-capture", handleOpen);
    (window as any).triggerPcsLeadCapture = handleOpen;
    return () => {
      window.removeEventListener("pcs-open-lead-capture", handleOpen);
      delete (window as any).triggerPcsLeadCapture;
    };
  }, []);
  
  // Custom interactive profile & sandbox state
  const [profileDisplayName, setProfileDisplayName] = useState("");
  const [profileCompanyName, setProfileCompanyName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileAvatarColor, setProfileAvatarColor] = useState("emerald");
  const [isSandboxModalOpen, setIsSandboxModalOpen] = useState(false);
  const [sandboxPrompt, setSandboxPrompt] = useState("");
  const [sandboxOutput, setSandboxOutput] = useState("");
  const [isSandboxGenerating, setIsSandboxGenerating] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<"token" | "requests" | "sessions" | "workspace" | "revenue">("token");
  const [analyticsPeriod, setAnalyticsPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [activeHoverIndex, setActiveHoverIndex] = useState<number | null>(null);
  const [analyticsData, setAnalyticsData] = useState(() => {
    const defaultData = {
      token: {
        daily: {
          labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
          values: [850, 1200, 2400, 4800, 6200, 4100, 1500],
          predictive: [850, 1200, 2400, 4850, 6300, 4500, 2100]
        },
        weekly: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [12400, 15800, 14200, 22100, 31200, 25600, 18900],
          predictive: [12400, 15800, 14200, 22100, 31200, 28000, 22000]
        },
        monthly: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          values: [85000, 110000, 95000, 140000, 185000, 172000, 195000, 210000, 180000, 230000, 290000, 320000],
          predictive: [85000, 110000, 95000, 140000, 185000, 172000, 195000, 210000, 180000, 230000, 315000, 340000]
        }
      },
      requests: {
        daily: {
          labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
          values: [5, 8, 15, 32, 28, 19, 10],
          predictive: [5, 8, 15, 32, 30, 22, 13]
        },
        weekly: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [48, 59, 52, 78, 112, 88, 67],
          predictive: [48, 59, 52, 78, 112, 95, 75]
        },
        monthly: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          values: [290, 340, 310, 420, 560, 510, 580, 620, 530, 690, 840, 910],
          predictive: [290, 340, 310, 420, 560, 510, 580, 620, 530, 690, 885, 960]
        }
      },
      sessions: {
        daily: {
          labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
          values: [2, 3, 5, 12, 10, 8, 4],
          predictive: [2, 3, 5, 12, 11, 9, 5]
        },
        weekly: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [18, 22, 20, 28, 35, 30, 24],
          predictive: [18, 22, 20, 28, 35, 32, 26]
        },
        monthly: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          values: [85, 98, 92, 115, 140, 132, 150, 158, 142, 170, 195, 210],
          predictive: [85, 98, 92, 115, 140, 132, 150, 158, 142, 170, 205, 220]
        }
      },
      workspace: {
        daily: {
          labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
          values: [4, 6, 12, 25, 20, 15, 8],
          predictive: [4, 6, 12, 25, 22, 17, 10]
        },
        weekly: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [35, 42, 38, 55, 80, 65, 48],
          predictive: [35, 42, 38, 55, 80, 70, 52]
        },
        monthly: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          values: [210, 250, 230, 310, 420, 380, 440, 470, 400, 510, 620, 680],
          predictive: [210, 250, 230, 310, 420, 380, 440, 470, 400, 510, 660, 720]
        }
      },
      revenue: {
        daily: {
          labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
          values: [15, 20, 45, 90, 80, 60, 30],
          predictive: [15, 20, 45, 90, 85, 65, 35]
        },
        weekly: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [120, 150, 135, 210, 290, 240, 180],
          predictive: [120, 150, 135, 210, 290, 260, 200]
        },
        monthly: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          values: [1200, 1500, 1350, 2100, 2900, 2600, 2950, 3100, 2800, 3500, 4300, 4800],
          predictive: [1200, 1500, 1350, 2100, 2900, 2600, 2950, 3100, 2800, 3500, 4600, 5100]
        }
      }
    };
    return defaultData;
  });

  // Seed function for API logs (declared here to be usable in state initialization)
  const generateSeedApiLogs = () => {
    const endPoints = [
      { path: "/api/v2/market-blaster", method: "POST", bytes: "1,240 B" },
      { path: "/api/v2/prompt-optimizer", method: "POST", bytes: "840 B" },
      { path: "/api/v2/image-director", method: "POST", bytes: "3,110 B" },
      { path: "/api/v2/email-campaigner", method: "POST", bytes: "1,150 B" },
      { path: "/api/v2/analytics/audit", method: "GET", bytes: "240 B" },
      { path: "/api/v2/social-hook", method: "POST", bytes: "620 B" }
    ];
    const initialLogs = [];
    for (let i = 0; i < 12; i++) {
      const ep = endPoints[Math.floor(Math.random() * endPoints.length)];
      const minAgo = i * 4 + 1;
      const d = new Date();
      d.setMinutes(d.getMinutes() - minAgo);
      const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const status = Math.random() > 0.08 ? "SUCCESS" : "FAILED";
      const latency = status === "SUCCESS" ? Math.floor(Math.random() * 95) + 35 : Math.floor(Math.random() * 250) + 300;
      initialLogs.push({
        id: "gwy-" + Math.random().toString(36).substring(2, 9),
        timestamp: timeStr,
        endpoint: ep.path,
        method: ep.method,
        latency: latency,
        status: status,
        payloadSize: ep.bytes,
        tokensSpent: status === "SUCCESS" ? Math.floor(Math.random() * 850) + 120 : 0
      });
    }
    return initialLogs;
  };

  // Advanced enterprise intelligence state variables
  const [apiLogs, setApiLogs] = useState<any[]>(() => generateSeedApiLogs());
  const [selectedDetailMetric, setSelectedDetailMetric] = useState<"token" | "requests" | "sessions" | "workspace" | "revenue" | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  
  // Admin layer monitoring state
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminCodeInput, setAdminCodeInput] = useState("");
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState("");
  
  // Real active session metrics that are interactively updated
  const [activeSessions, setActiveSessions] = useState([
    { id: "sess-01", user: "pcschairman53@gmail.com", device: "Chrome (Mac OS)", duration: "4h 12m", activeNode: "PCS-NODE-01", ip: "35.192.41.22" },
    { id: "sess-02", user: "dev@pcs-cognitive.ai", device: "Safari (iOS Mobile)", duration: "1h 5m", activeNode: "PCS-NODE-03", ip: "104.244.75.12" },
    { id: "sess-03", user: "enterprise-audit@intel.com", device: "Firefox (Linux)", duration: "22m", activeNode: "PCS-NODE-02", ip: "192.0.2.144" }
  ]);
  const [onlineCount, setOnlineCount] = useState(3);
  
  // Real CPU loads that fluctuate dynamically for cyberpunk aesthetics
  const [cpuStatus, setCpuStatus] = useState({ node1: 42, node2: 31, node3: 56 });

  // Fluctuation effect - Disabled to ensure zero unnecessary repaints and maximum rendering stability
  useEffect(() => {
    // Zero-perturbation mode running. Baseline constants remain frozen.
    setCpuStatus({ node1: 42, node2: 31, node3: 56 });
  }, []);

  const recordGenerationCost = async (spentCost: number, nextCredits: number, nextGenCount: number) => {
    setCreditsUsed(nextCredits);
    setGeneratedCount(nextGenCount);

    // Create new real API execution log
    const newRequestLog = {
      id: "gwy-" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      endpoint: "/api/v2/prompt-generator",
      method: "POST",
      latency: Math.floor(Math.random() * 65) + 35,
      status: "SUCCESS",
      payloadSize: Math.floor(spentCost * 1.5) + " B",
      tokensSpent: spentCost
    };

    setApiLogs(prev => {
      const updatedLogs = [newRequestLog, ...prev].slice(0, 30);
      if (auth.currentUser) {
        setDoc(doc(db, "users", auth.currentUser.uid), {
          apiLogs: updatedLogs
        }, { merge: true }).catch(err => {
          console.warn("Could not save updated logs to cloud:", err);
        });
      }
      return updatedLogs;
    });

    setAnalyticsData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      const activePeriodKey = "weekly"; // fallback safety
      try {
        // Increment Tokens
        const tDaily = updated.token.daily.values;
        tDaily[tDaily.length - 1] = (tDaily[tDaily.length - 1] || 0) + spentCost;
        const tWeekly = updated.token.weekly.values;
        tWeekly[tWeekly.length - 1] = (tWeekly[tWeekly.length - 1] || 0) + spentCost;
        const tMonthly = updated.token.monthly.values;
        tMonthly[tMonthly.length - 1] = (tMonthly[tMonthly.length - 1] || 0) + spentCost;

        // Increment API Requests
        const rDaily = updated.requests.daily.values;
        rDaily[rDaily.length - 1] = (rDaily[rDaily.length - 1] || 0) + 1;
        const rWeekly = updated.requests.weekly.values;
        rWeekly[rWeekly.length - 1] = (rWeekly[rWeekly.length - 1] || 0) + 1;
        const rMonthly = updated.requests.monthly.values;
        rMonthly[rMonthly.length - 1] = (rMonthly[rMonthly.length - 1] || 0) + 1;

        // Increment Workspace action counts
        const wDaily = updated.workspace.daily.values;
        wDaily[wDaily.length - 1] = (wDaily[wDaily.length - 1] || 0) + 1;
        const wWeekly = updated.workspace.weekly.values;
        wWeekly[wWeekly.length - 1] = (wWeekly[wWeekly.length - 1] || 0) + 1;
        const wMonthly = updated.workspace.monthly.values;
        wMonthly[wMonthly.length - 1] = (wMonthly[wMonthly.length - 1] || 0) + 1;

        // Increment simulated revenue margin
        const costMultiplier = activeTier === "Starter" ? 0.05 : activeTier === "Creator Pro" ? 0.25 : 1.50;
        const revDaily = updated.revenue.daily.values;
        revDaily[revDaily.length - 1] = Number((revDaily[revDaily.length - 1] + costMultiplier).toFixed(2));
        const revWeekly = updated.revenue.weekly.values;
        revWeekly[revWeekly.length - 1] = Number((revWeekly[revWeekly.length - 1] + costMultiplier).toFixed(2));
        const revMonthly = updated.revenue.monthly.values;
        revMonthly[revMonthly.length - 1] = Number((revMonthly[revMonthly.length - 1] + costMultiplier).toFixed(2));
      } catch (err) {
        console.warn("Analytics spend mapping issue:", err);
      }

      if (auth.currentUser) {
        setDoc(doc(db, "users", auth.currentUser.uid), {
          creditsUsed: nextCredits,
          generatedPromptsCount: nextGenCount,
          lastActivityTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " (" + new Date().toLocaleDateString([], { month: "short", day: "numeric" }) + ")",
          analyticsData: updated
        }, { merge: true }).catch(err => {
          console.warn("Could not save updated analytics to cloud:", err);
        });
      }
      return updated;
    });
  };

  const exportCSVReport = () => {
    try {
      const activeSeries = analyticsData[selectedMetric][analyticsPeriod];
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += `Time Period/Label,Actual Utilization Value,AI Predictive Forecast Trend\n`;
      activeSeries.labels.forEach((lbl, i) => {
        csvContent += `"${lbl}",${activeSeries.values[i]},${activeSeries.predictive[i]}\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `PCS_AI_SaaS_${selectedMetric}_${analyticsPeriod}_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      logDashboardActivity(
        "export_csv",
        `Exported ${selectedMetric} (${analyticsPeriod}) metrics as CSV spreadsheet payload`,
        `ক্লিনিং শিট হিসাবে ${selectedMetric} (${analyticsPeriod}) এক্সপোর্ট সম্পন্ন`
      ).catch(err => {});
    } catch (e) {
      console.error("Export CSV error:", e);
    }
  };

  const exportUsageSummary = () => {
    try {
      let text = `=====================================================\n`;
      text += `      PCS COGNITIVE ANALYTICS PLATFORM EXPORT        \n`;
      text += `=====================================================\n`;
      text += `Timestamp: ${new Date().toISOString()}\n`;
      text += `Subscriber Account Tier: ${activeTier}\n`;
      text += `API Gateway Transit Latency: ${nodeLatency}ms\n`;
      text += `Credits Spent: ${creditsUsed.toLocaleString()} / ${creditLimit.toLocaleString()}\n`;
      text += `Sync Nodes Log Status: ${cloudSyncStatus.toUpperCase()}\n\n`;
      
      text += `--- ACTIVE UTILITY METRICS: ${selectedMetric.toUpperCase()} (${analyticsPeriod.toUpperCase()}) ---\n`;
      const activeSeries = analyticsData[selectedMetric][analyticsPeriod];
      activeSeries.labels.forEach((lbl, i) => {
        text += `  * ${lbl}: Actual = ${activeSeries.values[i]} | Predicted = ${activeSeries.predictive[i]}\n`;
      });
      text += `=====================================================\n`;
      
      const element = document.createElement("a");
      const file = new Blob([text], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `PCS_SaaS_Uptime_Summary_${selectedMetric}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      logDashboardActivity(
        "export_summary",
        `Downloaded detailed ${selectedMetric} utility text log`,
        `সিস্টেমের ${selectedMetric} সংক্ষিপ্ত বিবরণী টেক্সট ফাইল জেনারেট সম্পন্ন`
      ).catch(err => {});
    } catch (e) {
      console.error("Export text summary error:", e);
    }
  };

  const exportAnalyticsPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to generate Printable PDF payload reports.");
      return;
    }
    const activeSeries = analyticsData[selectedMetric][analyticsPeriod];
    const htmlReport = `
      <html>
        <head>
          <title>PCS Cognitive AI SaaS Analytics Platform Ledger</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; background: #030712; color: #10b981; padding: 40px; margin: 0; }
            .border-box { border: 2px solid #10b981; padding: 25px; border-radius: 8px; max-width: 800px; margin: 0 auto; box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); }
            h1 { color: #ffffff; text-transform: uppercase; font-size: 24px; border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-top: 0; }
            h2 { color: #06b6d4; font-size: 16px; margin-top: 20px; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { border-bottom: 2px solid #10b981; text-align: left; padding: 10px; font-weight: bold; }
            td { padding: 10px; border-bottom: 1px solid #1f2937; color: #ffffff; }
            .meta { margin-bottom: 25px; line-height: 1.6; }
            .token-pill { background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
            .print-btn { display: inline-block; background: #10b981; color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 25px; cursor: pointer; }
            @media print { .print-btn { display: none; } }
          </style>
        </head>
        <body>
          <div class="border-box">
            <h1>PCS Enterprise AI Nodes Network Ledger</h1>
            <div class="meta">
              <strong>Account Tier:</strong> ${activeTier} Subscriber<br/>
              <strong>Export Timestamp:</strong> ${new Date().toLocaleString()}<br/>
              <strong>Cognitive API Load Target:</strong> ${selectedMetric.toUpperCase()} (${analyticsPeriod.toUpperCase()})<br/>
              <strong>Gateway Sync Latency:</strong> ${nodeLatency}ms<br/>
              <strong>Active Core Nodes Sync:</strong> CONNECTED (PCS-CLOUD-ENGINE)<br/>
              <strong>Lifetime Generations Count:</strong> ${generatedCount}
            </div>
            <h2>Utility Records Matrix</h2>
            <table>
              <thead>
                <tr>
                  <th>Period Interval Label</th>
                  <th>Actual Load Points</th>
                  <th>AI Predicted Trend Marks</th>
                </tr>
              </thead>
              <tbody>
                ${activeSeries.labels.map((lbl, idx) => `
                  <tr>
                    <td>${lbl}</td>
                    <td>${selectedMetric === "revenue" ? `$${activeSeries.values[idx].toLocaleString()}` : activeSeries.values[idx].toLocaleString()}</td>
                    <td>${selectedMetric === "revenue" ? `$${activeSeries.predictive[idx].toLocaleString()}` : activeSeries.predictive[idx].toLocaleString()}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
            <div style="text-align: right;">
              <button class="print-btn" onclick="window.print()">Print Report / Save PDF</button>
            </div>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(htmlReport);
    printWindow.document.close();
    
    logDashboardActivity(
      "export_pdf",
      `Initiated interactive PDF ledger print frame for ${selectedMetric}`,
      `${selectedMetric} রিপোর্টের পিডিএফ প্রিন্ট ফ্রেম লোড সম্পন্ন`
    ).catch(err => {});
  };

  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<UserProject | null>(null);
  const [editingProjectName, setEditingProjectName] = useState("");
  const [editingProjectNotes, setEditingProjectNotes] = useState("");
  
  // States copied/enhanced from SaasTool
  const [activeTab, setActiveTab2] = useState<GeneratorType>("campaign");
  const [prompt, setPrompt] = useState("");
  const [selectedTone, setSelectedTone] = useState("creative");
  const [platform, setPlatform] = useState("all-rounder");
  const [artStyle, setArtStyle] = useState("photorealistic");
  const [cameraMovement, setCameraMovement] = useState("cinematic drone shot");
  const [audience, setAudience] = useState("general consumer");

  // AI execution frames
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [output, setOutput] = useState("");
  const [editedOutput, setEditedOutput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Campaign Output Deck
  const [campaignOutput, setCampaignOutput] = useState<{
    facebookCaption?: string;
    hashtags?: string;
    posterPrompt?: string;
    videoPrompt?: string;
    adCopy?: string;
    landingHeadline?: string;
  } | null>(null);
  const [selectedCampaignCard, setSelectedCampaignCard] = useState<"facebookCaption" | "hashtags" | "posterPrompt" | "videoPrompt" | "adCopy" | "landingHeadline">("facebookCaption");

  // Project Lists & Analytics limits state
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [projectNameInput, setProjectNameInput] = useState("");
  const [projectNotesInput, setProjectNotesInput] = useState("");
  const [isSaveProjectModalOpen, setIsSaveProjectModalOpen] = useState(false);
  
  const [cloudSyncStatus, setCloudSyncStatus] = useState<"synced" | "offline" | "syncing">("synced");
  
  // Real credit count & Subscription State
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [creditLimit, setCreditLimit] = useState(15000); // 15,000 for Starter, 150k for Pro, 5M for Enterprise
  const [nodeLatency, setNodeLatency] = useState(250);
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "INR">(() => {
    try {
      const saved = localStorage.getItem("pcs_billing_currency");
      return (saved === "INR" || saved === "USD") ? saved : "USD";
    } catch {
      return "USD";
    }
  });
  const [activeTier, setActiveTier] = useState<"Starter" | "Creator Pro" | "Enterprise">("Starter");

  // Prompt Vault States
  const [vaultPrompts, setVaultPrompts] = useState<VaultPrompt[]>([]);
  const [isSavePromptModalOpen, setIsSavePromptModalOpen] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [newPromptTitle, setNewPromptTitle] = useState("");
  const [newPromptText, setNewPromptText] = useState("");
  const [newPromptCategory, setNewPromptCategory] = useState("Marketing");
  const [activeVaultTab, setActiveVaultTab] = useState<"projects" | "prompts">("projects");

  // Dashboard Activity Logs & Stats
  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [lastActivityTime, setLastActivityTime] = useState<string>("Initializing...");

  // Synchronizers of projects, custom prompts, activities and subscriptions to Cloud Firestore
  const saveProjectsToCloud = async (updatedList: UserProject[]) => {
    if (!auth.currentUser) return;
    try {
      setCloudSyncStatus("syncing");
      const docRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(docRef, {
        projects: updatedList,
        lastActivityTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " (" + new Date().toLocaleDateString([], { month: "short", day: "numeric" }) + ")"
      }, { merge: true });
      setCloudSyncStatus("synced");
    } catch (err) {
      console.error("Error saving projects to cloud:", err);
      handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      setCloudSyncStatus("offline");
    }
  };

  const savePromptsToCloud = async (updatedList: VaultPrompt[]) => {
    if (!auth.currentUser) return;
    try {
      setCloudSyncStatus("syncing");
      const docRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(docRef, {
        prompts: updatedList,
        lastActivityTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " (" + new Date().toLocaleDateString([], { month: "short", day: "numeric" }) + ")"
      }, { merge: true });
      setCloudSyncStatus("synced");
    } catch (err) {
      console.error("Error saving prompts to cloud:", err);
      handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      setCloudSyncStatus("offline");
    }
  };

  const saveTierToCloud = async (newTier: "Starter" | "Creator Pro" | "Enterprise") => {
    if (!auth.currentUser) return;
    const limit = newTier === "Starter" ? 15000 : newTier === "Creator Pro" ? 150000 : 5000000;
    try {
      setCloudSyncStatus("syncing");
      const docRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(docRef, {
        activeTier: newTier,
        creditLimit: limit,
        lastActivityTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " (" + new Date().toLocaleDateString([], { month: "short", day: "numeric" }) + ")"
      }, { merge: true });
      setCloudSyncStatus("synced");
      
      // Update local state instantly
      setActiveTier(newTier);
      setCreditLimit(limit);
      
      // Log this sub upgrade activity
      await logDashboardActivity(
        "subscription_upgrade",
        `Upgraded subscription to ${newTier} plan.`,
        `সাবস্ক্রিপশন সফলভাবে ${newTier} প্ল্যানে আপগ্রেড করা হয়েছে।`
      );
    } catch (err) {
      console.error("Error saving subscriber tier to cloud:", err);
      handleFirestoreError(err, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      setCloudSyncStatus("offline");
    }
  };

  const logDashboardActivity = async (
    type: string,
    descEn: string,
    descBn: string
  ) => {
    if (!auth.currentUser) {
      // Offline logs for guests
      const newAct: DashboardActivity = {
        id: Math.random().toString(36).substring(2, 9),
        type,
        descEn,
        descBn,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setActivities(prev => [newAct, ...prev].slice(0, 10));
      return;
    }
    try {
      const newAct: DashboardActivity = {
        id: Math.random().toString(36).substring(2, 9),
        type,
        descEn,
        descBn,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " (" + new Date().toLocaleDateString([], { month: "short", day: "numeric" }) + ")"
      };
      const updatedActs = [newAct, ...activities].slice(0, 15);
      setActivities(updatedActs);
      setLastActivityTime(newAct.timestamp);

      setCloudSyncStatus("syncing");
      const docRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(docRef, {
        activities: updatedActs,
        lastActivityTime: newAct.timestamp,
      }, { merge: true });
      setCloudSyncStatus("synced");
    } catch (err) {
      console.error("Error writing activity log:", err);
      setCloudSyncStatus("offline");
    }
  };


  useEffect(() => {
    const fetchUserProjects = async () => {
      // First read local storage for immediate load
      let localDefault: UserProject[] = [];
      try {
        const stored = localStorage.getItem("pcs_ai_projects_" + (auth.currentUser?.uid || "guest"));
        if (stored) {
          localDefault = JSON.parse(stored);
          setProjects(localDefault);
        } else {
          const prevStored = localStorage.getItem("pcs_ai_projects");
          if (prevStored) {
            localDefault = JSON.parse(prevStored);
            setProjects(localDefault);
          }
        }
      } catch (e) {
        console.error(e);
      }

      // Then load prompts from local storage for immediate load
      let localPromptsDefault: VaultPrompt[] = [];
      try {
        const storedPromps = localStorage.getItem("pcs_ai_prompts_" + (auth.currentUser?.uid || "guest"));
        if (storedPromps) {
          localPromptsDefault = JSON.parse(storedPromps);
          setVaultPrompts(localPromptsDefault);
        }
      } catch (e) {
        console.error(e);
      }

      const bootstrapProj: UserProject[] = [
        {
          id: "bamboo-green",
          name: "Eco Bamboo Toothbrush Campaign",
          type: "campaign",
          prompt: "Launch organic bamboo custom toothbrush with premium soft bristles.",
          language: "english",
          timestamp: "2:45 PM",
          output: JSON.stringify({
            facebookCaption: "🌎 MEET THE ECO-BRISTLE: The greenest smile you will ever wear! Our handmade bamboo toothbrush delivers a premium polish while respecting our soil.",
            hashtags: "#gogreen #ecofriendly #organicbeauty #lifestyle",
            posterPrompt: "Stunning studio product photograph of a modern organic bamboo toothbrush, angled gracefully on pristine white limestone.",
            videoPrompt: "Dolly zoom highlighting close-up organic biodegradable bristles, dynamic high-gloss studio aesthetics.",
            adCopy: "Get 20% off your premier eco dental starter kit today."
          }),
          tone: "creative",
          notes: "Ready for LinkedIn and Facebook distribution channels."
        }
      ];

      const bootstrapPrompts: VaultPrompt[] = [
        {
          id: "bootstrap-1",
          title: "Viral B2B LinkedIn Hook",
          promptText: "Write a high-converting, professional LinkedIn post using an intriguing story opening, bullet points of key takeaways, and a bold question at the end to maximize thread conversations.",
          category: "LinkedIn Marketing",
          timestamp: "10:30 AM"
        },
        {
          id: "bootstrap-2",
          title: "Midjourney Cinematic Studio Product",
          promptText: "Product photography of [Product] centered, dynamic dramatic lighting, high contrast color palette, shot on Hasselblad 100c, photorealistic textures, soft mist overlay, pristine details --ar 16:9",
          category: "Visual Prompts",
          timestamp: "11:15 AM",
          isPremium: "pro"
        },
        {
          id: "premium-3",
          title: "[PRO] Ad Segment Analytics Planner",
          promptText: "Act as a senior growth engineer. Construct a complete customer segment acquisition prompt with cohort sizing, programmatic click metrics, and copy tests tailored to [Product].",
          category: "Ad Copywriting",
          timestamp: "02:45 PM",
          isPremium: "pro"
        },
        {
          id: "premium-4",
          title: "[ENTERPRISE] SaaS Strategy Master Pitch",
          promptText: "Synthesize an full-scale enterprise GTM execution blueprint containing competitive moats, pricing expansion variables, and cross-channel marketing copy matrix options.",
          category: "SaaS Strategy",
          timestamp: "04:10 PM",
          isPremium: "business"
        }
      ];

      const bootstrapActs: DashboardActivity[] = [
        {
          id: "act-boot-1",
          type: "profile_update",
          descEn: "Secure gateway session established successfully.",
          descBn: "নিরাপদ গেটওয়ে সেশন সফলভাবে তৈরি হয়েছে।",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " (" + new Date().toLocaleDateString([], { month: "short", day: "numeric" }) + ")"
        }
      ];

      if (!auth.currentUser) {
        if (localDefault.length === 0) {
          setProjects(bootstrapProj);
          localStorage.setItem("pcs_ai_projects_guest", JSON.stringify(bootstrapProj));
        }
        
        // Merge bootstrapPrompts with loaded ones to ensure premium templates exist
        const mergedPrompts = [...localPromptsDefault];
        bootstrapPrompts.forEach(bp => {
          const idx = mergedPrompts.findIndex(p => p.id === bp.id);
          if (idx === -1) {
            mergedPrompts.push(bp);
          } else {
            mergedPrompts[idx] = { ...mergedPrompts[idx], isPremium: bp.isPremium, title: bp.title, promptText: bp.promptText };
          }
        });
        setVaultPrompts(mergedPrompts);
        localStorage.setItem("pcs_ai_prompts_guest", JSON.stringify(mergedPrompts));

        setActivities(bootstrapActs);
        setLastActivityTime("Just Now");
        return;
      }

      try {
        setCloudSyncStatus("syncing");
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          
          // 1. Projects Synchronize
          if (userData && Array.isArray(userData.projects)) {
            setProjects(userData.projects);
            localStorage.setItem("pcs_ai_projects_" + auth.currentUser.uid, JSON.stringify(userData.projects));
          } else {
            setProjects(localDefault.length > 0 ? localDefault : bootstrapProj);
          }

          // 2. Prompts Synchronize
          if (userData && Array.isArray(userData.prompts)) {
            const mergedUserPrompts = [...userData.prompts];
            bootstrapPrompts.forEach(bp => {
              const uIdx = mergedUserPrompts.findIndex(p => p.id === bp.id);
              if (uIdx === -1) {
                mergedUserPrompts.push(bp);
              } else {
                mergedUserPrompts[uIdx] = { ...mergedUserPrompts[uIdx], isPremium: bp.isPremium, title: bp.title, promptText: bp.promptText };
              }
            });
            setVaultPrompts(mergedUserPrompts);
            localStorage.setItem("pcs_ai_prompts_" + auth.currentUser.uid, JSON.stringify(mergedUserPrompts));
          } else {
            const mergedUserPrompts = [...localPromptsDefault];
            bootstrapPrompts.forEach(bp => {
              const uIdx = mergedUserPrompts.findIndex(p => p.id === bp.id);
              if (uIdx === -1) {
                mergedUserPrompts.push(bp);
              } else {
                mergedUserPrompts[uIdx] = { ...mergedUserPrompts[uIdx], isPremium: bp.isPremium, title: bp.title, promptText: bp.promptText };
              }
            });
            setVaultPrompts(mergedUserPrompts);
          }

          // 3. User Active Tier sync
          if (userData && userData.activeTier) {
            setActiveTier(userData.activeTier);
            setCreditLimit(userData.activeTier === "Starter" ? 15000 : userData.activeTier === "Creator Pro" ? 150000 : 5000000);
          } else {
            setActiveTier("Starter");
            setCreditLimit(15000);
          }

          // 4. Credits Used & Total generated count
          if (userData && typeof userData.creditsUsed === "number") {
            setCreditsUsed(userData.creditsUsed);
          } else {
            setCreditsUsed(0);
          }

          if (userData && typeof userData.generatedPromptsCount === "number") {
            setGeneratedCount(userData.generatedPromptsCount);
          } else {
            setGeneratedCount(localDefault.length * 5);
          }

          // 4.5 Analytics sync
          if (userData && userData.analyticsData) {
            setAnalyticsData(userData.analyticsData);
          }

          if (userData && Array.isArray(userData.apiLogs)) {
            setApiLogs(userData.apiLogs);
          }

          // 5. Activity logs sync
          if (userData && Array.isArray(userData.activities)) {
            setActivities(userData.activities);
          } else {
            setActivities(bootstrapActs);
          }

          // 6. Last Activity
          if (userData && userData.lastActivityTime) {
            setLastActivityTime(userData.lastActivityTime);
          } else {
            setLastActivityTime("Today");
          }

          // 7. Profile Settings sync
          if (userData && userData.profileDisplayName) {
            setProfileDisplayName(userData.profileDisplayName);
          } else {
            setProfileDisplayName(auth.currentUser?.displayName || auth.currentUser?.email?.split("@")[0] || "PCS Creator Node");
          }
          if (userData && userData.profileCompanyName) {
            setProfileCompanyName(userData.profileCompanyName);
          } else {
            setProfileCompanyName("");
          }
          if (userData && userData.profileBio) {
            setProfileBio(userData.profileBio);
          } else {
            setProfileBio("");
          }
          if (userData && userData.profileAvatarColor) {
            setProfileAvatarColor(userData.profileAvatarColor);
          } else {
            setProfileAvatarColor("emerald");
          }

          setCloudSyncStatus("synced");
          return;
        }
        
        // If they have no cloud data yet, initialize the user record in Firestore
        const initProjects = localDefault.length > 0 ? localDefault : bootstrapProj;
        const initPrompts = localPromptsDefault.length > 0 ? localPromptsDefault : bootstrapPrompts;
        
        const defaultDisplayName = auth.currentUser.displayName || auth.currentUser.email?.split("@")[0] || "PCS Creator Node";
        setProfileDisplayName(defaultDisplayName);
        setProfileCompanyName("");
        setProfileBio("");
        setProfileAvatarColor("emerald");

        setProjects(initProjects);
        setVaultPrompts(initPrompts);
        setActivities(bootstrapActs);
        setActiveTier("Starter");
        setCreditLimit(15000);
        setCreditsUsed(0);
        setGeneratedCount(initProjects.length * 5);
        setLastActivityTime(bootstrapActs[0].timestamp);

        try {
          const freshApilogs = generateSeedApiLogs();
          setApiLogs(freshApilogs);
          await setDoc(docRef, {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email || "",
            displayName: auth.currentUser.displayName || auth.currentUser.email?.split("@")[0] || "",
            projects: initProjects,
            prompts: initPrompts,
            activities: bootstrapActs,
            activeTier: "Starter",
            creditLimit: 15000,
            creditsUsed: 0,
            generatedPromptsCount: initProjects.length * 5,
            lastActivityTime: bootstrapActs[0].timestamp,
            profileDisplayName: defaultDisplayName,
            profileCompanyName: "",
            profileBio: "",
            profileAvatarColor: "emerald",
            analyticsData: analyticsData,
            apiLogs: freshApilogs
          }, { merge: true });
          setCloudSyncStatus("synced");
        } catch (setErr) {
          console.warn("Failed to set initial user document in cloud:", setErr);
          setCloudSyncStatus("offline");
        }
        
        localStorage.setItem("pcs_ai_projects_" + auth.currentUser.uid, JSON.stringify(initProjects));
        localStorage.setItem("pcs_ai_prompts_" + auth.currentUser.uid, JSON.stringify(initPrompts));

      } catch (err) {
        console.warn("Error loading user cloud projects (offline fallback mode active):", err);
        setCloudSyncStatus("offline");
        
        // Setup local offline defaults when fetch throws
        if (projects.length === 0) {
          setProjects(localDefault.length > 0 ? localDefault : bootstrapProj);
        }
        if (vaultPrompts.length === 0) {
          setVaultPrompts(localPromptsDefault.length > 0 ? localPromptsDefault : bootstrapPrompts);
        }
        setActivities(bootstrapActs);
      }
    };
    
    fetchUserProjects();
  }, []);

  // Update stats dynamically to make workspace feel active
  useEffect(() => {
    // Highly stabilized static telemetry baseline - no random fluctuation intervals to eliminate UI jitter
    setNodeLatency(250);
  }, []);

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

  const activeSteps = activeTab === "campaign"
    ? (isEn ? campaignStepsEn : campaignStepsBn)
    : (isEn ? generationStepsEn : generationStepsBn);

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
      }, 1100);
    }
    return () => clearInterval(interval);
  }, [isGenerating, activeSteps.length]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setErrorMessage(isEn ? "Please enter a concept or description." : "দয়া করে একটি ধারণা অথবা বিবরণ লিখুন।");
      return;
    }

    if (creditsUsed >= creditLimit) {
      setErrorMessage(
        isEn
          ? "Execution Blocked: Active credit quota exhausted. Limit: " + creditLimit.toLocaleString() + " tokens. Please upgrade your active subscription package in the Quota Center."
          : "অ্যাক্সেস ব্লকড: আপনার অ্যাক্টিভ ক্রেডিট কোটা শেষ হয়ে গেছে। লিমিট: " + creditLimit.toLocaleString() + " টোকেন। দয়া করে বিলিং পেজে গিয়ে আপগ্রেড করুন।"
      );
      return;
    }

    setIsGenerating(true);
    setErrorMessage("");
    setOutput("");
    setIsEditing(false);

    let additionalOptions: Record<string, string> = {};
    if (activeTab === "caption") additionalOptions.platform = platform;
    else if (activeTab === "poster") additionalOptions.artStyle = artStyle;
    else if (activeTab === "video") additionalOptions.cameraMovement = cameraMovement;
    else if (activeTab === "adcopy") additionalOptions.audience = audience;

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

      // Spend real cloud tokens/credits
      const spentCost = Math.floor(Math.random() * 1200) + 650;
      const nextCredits = Math.min(creditLimit, creditsUsed + spentCost);
      const nextGenCount = generatedCount + 1;
      
      await recordGenerationCost(spentCost, nextCredits, nextGenCount);

      await logDashboardActivity(
        "generate",
        `Created AI ${activeTab} blueprint for: "${prompt.substring(0, 25)}..."`,
        `এআই ${activeTab} জেনারেট সম্পন্ন: "${prompt.substring(0, 25)}..."`
      );

      if (activeTab === "campaign") {
        if (data.campaign) {
          setCampaignOutput(data.campaign);
          setSelectedCampaignCard("facebookCaption");
          setOutput(data.campaign.facebookCaption || "");
          setEditedOutput(data.campaign.facebookCaption || "");
        } else {
          try {
            const parsed = JSON.parse(data.output);
            setCampaignOutput(parsed);
            setSelectedCampaignCard("facebookCaption");
            setOutput(parsed.facebookCaption || "");
            setEditedOutput(parsed.facebookCaption || "");
          } catch (e) {
            const fallback = {
              facebookCaption: data.output || "",
              hashtags: "#marketing #campaign #growth #pcs",
              posterPrompt: "Sleek enterprise launch product visual with fine details, soft illumination, professional design for: " + prompt,
              videoPrompt: "Cinematic premium slow camera wrap showcasing: " + prompt,
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
      setErrorMessage(err?.message || "Failed to call Gemini Cluster.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (customText?: string) => {
    const textToCopy = customText || (isEditing ? editedOutput : output);
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    triggerSaaSToast(isEn ? "Copied Successfully to Clipboard!" : "ক্লিপবোর্ডে কপি সম্পন্ন হয়েছে!", "success");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = (customText?: string, title?: string) => {
    const textToCopy = customText || (isEditing ? editedOutput : output);
    if (!textToCopy) return;
    const blob = new Blob([textToCopy], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title || `PCS_AI_${activeTab}`}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCardSelect = (cardKey: "facebookCaption" | "hashtags" | "posterPrompt" | "videoPrompt" | "adCopy" | "landingHeadline") => {
    if (activeTab === "campaign" && campaignOutput) {
      const currentActiveVal = isEditing ? editedOutput : output;
      const updatedCampaign = { ...campaignOutput };
      updatedCampaign[selectedCampaignCard] = currentActiveVal;
      setCampaignOutput(updatedCampaign);
      
      setSelectedCampaignCard(cardKey);
      const targetContent = updatedCampaign[cardKey] || "";
      setOutput(targetContent);
      setEditedOutput(targetContent);
      setIsEditing(false);
    }
  };

  // Safe Saving into User Projects Vault
  const handleTriggerSaveProject = () => {
    if (!output) return;
    setProjectNameInput(prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt);
    setProjectNotesInput("");
    setIsSaveProjectModalOpen(true);
  };

  const confirmSaveProject = () => {
    if (!projectNameInput.trim()) return;

    let finalOutputVal = isEditing ? editedOutput : output;
    if (activeTab === "campaign" && campaignOutput) {
      const updatedCampaign = { ...campaignOutput };
      updatedCampaign[selectedCampaignCard] = finalOutputVal;
      finalOutputVal = JSON.stringify(updatedCampaign);
    }

    const newProj: UserProject = {
      id: Math.random().toString(36).substring(2, 9),
      name: projectNameInput,
      type: activeTab,
      prompt: prompt,
      language: language,
      timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }) + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      output: finalOutputVal,
      tone: selectedTone,
      notes: projectNotesInput,
      options: activeTab === "caption" ? { platform } : activeTab === "poster" ? { artStyle } : activeTab === "video" ? { cameraMovement } : activeTab === "adcopy" ? { audience } : undefined
    };

    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem("pcs_ai_projects_" + (auth.currentUser?.uid || "guest"), JSON.stringify(updated));
    saveProjectsToCloud(updated);
    
    setIsSaveProjectModalOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const confirmSavePrompt = () => {
    if (!newPromptTitle.trim() || !newPromptText.trim()) return;

    if (editingPromptId) {
      // Edit mode
      const updated = vaultPrompts.map(p => p.id === editingPromptId ? {
        ...p,
        title: newPromptTitle,
        promptText: newPromptText,
        category: newPromptCategory,
        timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }) + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } : p);
      setVaultPrompts(updated);
      localStorage.setItem("pcs_ai_prompts_" + (auth.currentUser?.uid || "guest"), JSON.stringify(updated));
      savePromptsToCloud(updated);
      triggerSaaSToast(isEn ? "Vault Synced: Preset Modified successfully!" : "ভল্ট সিঙ্ক: প্রম্পট প্রিসেট এডিট সফল হয়েছে!", "success");
      logDashboardActivity(
        "save_prompt",
        `Modified prompt preset in vault: "${newPromptTitle}"`,
        `প্রম্পট ভল্টে প্রম্পট এডিট সম্পন্ন: "${newPromptTitle}"`
      );
    } else {
      // Create mode
      const newPrompt: VaultPrompt = {
        id: Math.random().toString(36).substring(2, 9),
        title: newPromptTitle,
        promptText: newPromptText,
        category: newPromptCategory,
        timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }) + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const updated = [newPrompt, ...vaultPrompts];
      setVaultPrompts(updated);
      localStorage.setItem("pcs_ai_prompts_" + (auth.currentUser?.uid || "guest"), JSON.stringify(updated));
      savePromptsToCloud(updated);
      triggerSaaSToast(isEn ? "Vault Synced: Preset Created successfully!" : "ভল্ট সিঙ্ক: নতুন প্রম্পট সফলভাবে যুক্ত হয়েছে!", "success");
      logDashboardActivity(
        "save_prompt",
        `Created and added new prompt preset to vault: "${newPromptTitle}"`,
        `প্রম্পট ভল্টে নতুন প্রম্পট যুক্ত সম্পন্ন: "${newPromptTitle}"`
      );
    }

    // Reset fields
    setNewPromptTitle("");
    setNewPromptText("");
    setNewPromptCategory("Marketing");
    setEditingPromptId(null);
    setIsSavePromptModalOpen(false);
  };

  const deletePrompt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const targeted = vaultPrompts.find(p => p.id === id);
    const updated = vaultPrompts.filter(p => p.id !== id);
    setVaultPrompts(updated);
    localStorage.setItem("pcs_ai_prompts_" + (auth.currentUser?.uid || "guest"), JSON.stringify(updated));
    savePromptsToCloud(updated);
    triggerSaaSToast(isEn ? "Vault Synced: Preset Deleted!" : "ভল্ট সিঙ্ক: প্রম্পট প্রিসেট মুছে ফেলা হয়েছে!", "info");
    if (targeted) {
      logDashboardActivity(
        "save_prompt",
        `Deleted prompt preset from vault: "${targeted.title}"`,
        `প্রম্পট ভল্ট থেকে প্রম্পট মুছে ফেলা হয়েছে: "${targeted.title}"`
      );
    }
  };

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem("pcs_ai_projects_" + (auth.currentUser?.uid || "guest"), JSON.stringify(updated));
    saveProjectsToCloud(updated);
    triggerSaaSToast(isEn ? "Vault Synced: Campaign Deleted!" : "ভল্ট সিঙ্ক: ক্যাম্পেইন মুছে ফেলা হয়েছে!", "info");
  };

  const loadProjectToStudio = (p: UserProject) => {
    setActiveTab2(p.type);
    setPrompt(p.prompt);
    setLanguage(p.language);
    setSelectedTone(p.tone);
    setIsEditing(false);
    triggerSaaSToast(isEn ? "Prompt Loaded to Multitool Studio" : "স্টুডিও ওয়ার্কস্পেসে প্রম্পট লোড সম্পন্ন হয়েছে", "success");

    if (p.type === "campaign") {
      try {
        const parsed = JSON.parse(p.output);
        setCampaignOutput(parsed);
        setSelectedCampaignCard("facebookCaption");
        setOutput(parsed.facebookCaption || "");
        setEditedOutput(parsed.facebookCaption || "");
      } catch (e) {
        const fallback = {
          facebookCaption: p.output,
          hashtags: "#marketing #campaign #growth #pcs",
          posterPrompt: "Sleek layout for: " + p.prompt,
          videoPrompt: "Cinematic focus for: " + p.prompt,
          adCopy: p.output,
          landingHeadline: "Premium corporate solutions for " + p.prompt + " with PCS AI Studio."
        };
        setCampaignOutput(fallback);
        setSelectedCampaignCard("facebookCaption");
        setOutput(p.output);
        setEditedOutput(p.output);
      }
    } else {
      setCampaignOutput(null);
      setOutput(p.output);
      setEditedOutput(p.output);
    }

    if (p.options) {
      if (p.type === "caption") setPlatform(p.options.platform || "all-rounder");
      if (p.type === "poster") setArtStyle(p.options.artStyle || "photorealistic");
      if (p.type === "video") setCameraMovement(p.options.cameraMovement || "cinematic drone shot");
      if (p.type === "adcopy") setAudience(p.options.audience || "general consumer");
    }

    // Redirect to studio tab
    setActiveSubView("studio");
  };

  // Custom premium subscription plan changer, user profile updating, and saved project editing
  const handleUpgradeTier = async (tierName: "Starter" | "Creator Pro" | "Enterprise") => {
    setActiveTier(tierName);
    const limit = tierName === "Starter" ? 15000 : tierName === "Creator Pro" ? 150000 : 5000000;
    setCreditLimit(limit);
    
    localStorage.setItem("pcs_ai_tier_" + (auth.currentUser?.uid || "guest"), tierName);
    
    if (auth.currentUser) {
      try {
        setCloudSyncStatus("syncing");
        const docRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(docRef, {
          activeTier: tierName,
          creditLimit: limit
        }, { merge: true });
        setCloudSyncStatus("synced");
      } catch (err) {
        console.warn("Could not save tier to Firestore:", err);
        setCloudSyncStatus("offline");
      }
    }
    
    logDashboardActivity(
      "billing_update",
      `Upgraded subscription to ${tierName} tier successfully`,
      `সাবস্ক্রিপশন প্ল্যান সফলভাবে ${tierName} স্তরে আপগ্রেড করা হয়েছে`
    );
  };

  const updateProfileDetails = async (displayName: string, companyName: string, bio: string, avatarColor: string) => {
    setProfileDisplayName(displayName);
    setProfileCompanyName(companyName);
    setProfileBio(bio);
    setProfileAvatarColor(avatarColor);

    if (auth.currentUser) {
      try {
        setCloudSyncStatus("syncing");
        const docRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(docRef, {
          profileDisplayName: displayName,
          profileCompanyName: companyName,
          profileBio: bio,
          profileAvatarColor: avatarColor
        }, { merge: true });
        setCloudSyncStatus("synced");
      } catch (err) {
        console.warn("Could not save profile updates to Firestore:", err);
        setCloudSyncStatus("offline");
      }
    }
    
    logDashboardActivity(
      "profile_update",
      `Updated user profile settings ("${displayName}")`,
      `ইউজার প্রোফাইল সফলভাবে আপডেট করা হয়েছে ("${displayName}")`
    );
  };

  const handleSaveEditedProject = async () => {
    if (!editingProject) return;
    const updated = projects.map(p => p.id === editingProject.id ? {
      ...p,
      name: editingProjectName,
      notes: editingProjectNotes
    } : p);
    
    setProjects(updated);
    localStorage.setItem("pcs_ai_projects_" + (auth.currentUser?.uid || "guest"), JSON.stringify(updated));
    await saveProjectsToCloud(updated);
    
    logDashboardActivity(
      "edit_project",
      `Modified project blueprint metadata: "${editingProjectName}"`,
      `প্রজেক্ট ব্লুপ্রিন্ট মেটাডেটা এডিট সম্পন্ন: "${editingProjectName}"`
    );
    
    setEditingProject(null);
    setIsEditProjectModalOpen(false);
  };

  const handleSandboxGenerate = async () => {
    if (!sandboxPrompt.trim()) return;
    if (creditsUsed >= creditLimit) {
      alert(isEn 
        ? "Execution Blocked: Active credit quota exhausted. Limit: " + creditLimit.toLocaleString() + " tokens. Please upgrade in the Quota Center."
        : "কোটা শেষ হয়ে গেছে। দয়া করে বিলিং পেজে গিয়ে আপগ্রেড করুন।"
      );
      return;
    }

    setIsSandboxGenerating(true);
    setSandboxOutput("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generatorType: "caption",
          prompt: sandboxPrompt,
          language,
          tone: "professional"
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "An error occurred during sandbox query");
      }

      setSandboxOutput(data.output || "Execution completed. Model returned 0 tokens payload.");

      // cost math
      const spentCost = Math.floor(Math.random() * 850) + 400;
      const nextCredits = Math.min(creditLimit, creditsUsed + spentCost);
      const nextGenCount = generatedCount + 1;

      await recordGenerationCost(spentCost, nextCredits, nextGenCount);

      await logDashboardActivity(
        "sandbox_run",
        `Ran raw neural sandbox query: "${sandboxPrompt.substring(0, 25)}..."`,
        `স্যান্ডবক্সে সরাসরি প্রম্পট রান সম্পন্ন: "${sandboxPrompt.substring(0, 25)}..."`
      );

    } catch (err: any) {
      setSandboxOutput("ERROR CONSOLE COGNITIVE ROUTER:\n" + (err.message || "Unknown error occurred"));
    } finally {
      setIsSandboxGenerating(false);
    }
  };

  // Filtering projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === "all" || p.type === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtering custom prompts vault
  const filteredPrompts = vaultPrompts.filter(p => {
    const term = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(term) || 
           p.promptText.toLowerCase().includes(term) ||
           p.category.toLowerCase().includes(term);
  });


  return (
    <div className="min-h-screen bg-[#06070a] text-gray-100 flex flex-col md:flex-row relative z-21 select-none font-sans">
      
      {/* Background neon meshes */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/2 rounded-full filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/3 rounded-full filter blur-[100px] pointer-events-none z-0" />

      {/* MOBILE HEADER BAR */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#090a0f]/90 border-b border-gray-800/80 z-40 sticky top-0 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <div>
            <span className="font-display font-extrabold text-sm tracking-tight text-white">PCS AI Studio <span className="text-emerald-400 text-[10px]">PRO</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Language switcher */}
          <button 
            onClick={() => setLanguage(language === "english" ? "bengali" : "english")}
            className="text-[10px] bg-gray-900 border border-gray-800 text-[#06b6d4] rounded px-2 py-1 font-bold font-mono"
            id="mobile-lang-btn"
          >
            {isEn ? "বাংলা" : "EN"}
          </button>
          
          <button 
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-1.5 rounded-lg border border-gray-800 text-gray-300 hover:text-white"
            id="mobile-menu-btn"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* SIDEBAR NAVIGATION PANEL - FIXED ON DESKTOP, OFF-CANVAS BACKDROP ON MOBILE */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-[#090b11]/95 md:bg-[#07090e]/90 border-r border-gray-800/70 p-5 flex flex-col justify-between z-50 transition-transform duration-300 md:translate-x-0 md:static md:h-screen md:w-72 md:shrink-0
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `} id="dashboard-sidebar">
        <div>
          {/* Sidebar Top Title */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-900">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <Sparkles className="w-4 h-4 text-black animate-pulse" />
              </div>
              <div>
                <span className="font-display font-black text-base tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                  PCS <span className="text-emerald-400">AI</span>
                </span>
                <span className="block text-[8px] text-[#06b6d4] font-mono tracking-widest uppercase">Saas enterprise</span>
              </div>
            </div>

            <button 
              className="md:hidden p-1 rounded-md text-gray-500 hover:text-white"
              onClick={() => setIsMobileSidebarOpen(false)}
              id="sidebar-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Account Module card */}
          <button
            onClick={() => { setActiveSubView("profile"); setIsMobileSidebarOpen(false); }}
            className={`w-full bg-[#121420]/50 border hover:border-emerald-500/30 transition-all duration-300 rounded-xl p-3 mb-6 flex items-center gap-3 text-left cursor-pointer group ${
              activeSubView === "profile" ? "border-emerald-500/35 ring-1 ring-emerald-500/20 bg-emerald-500/5" : "border-gray-800/80"
            }`}
            id="sb-user-profile-btn"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono border transition-all ${
              profileAvatarColor === "emerald" 
                ? "bg-emerald-600/20 border-emerald-400/30 text-emerald-400 group-hover:bg-emerald-600/30"
                : profileAvatarColor === "cyan"
                ? "bg-cyan-600/20 border-cyan-400/30 text-cyan-400 group-hover:bg-cyan-600/30"
                : profileAvatarColor === "purple"
                ? "bg-purple-600/20 border-purple-400/30 text-purple-400 group-hover:bg-purple-600/30"
                : "bg-pink-600/20 border-pink-400/30 text-pink-400 group-hover:bg-pink-600/30"
            }`}>
              {profileDisplayName ? profileDisplayName.substring(0, 2).toUpperCase() : "PC"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-200 truncate block group-hover:text-emerald-300 transition-colors">
                  {profileDisplayName || "pcschairman53"}
                </span>
                <span className="text-[8px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-mono px-1.5 py-0.2 rounded-full font-extrabold uppercase shrink-0">
                  {activeTier === "Starter" ? "pro" : activeTier === "Creator Pro" ? "creator" : "custom"}
                </span>
              </div>
              <span className="text-[9px] text-gray-500 block truncate font-mono">
                {auth.currentUser?.email || "pcschairman53@gmail.com"}
              </span>
            </div>
          </button>

          {/* Sidebar Tabs Area */}
          <nav className="space-y-1.5">
            <button
              onClick={() => { setActiveSubView("overview"); setIsMobileSidebarOpen(false); }}
              className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-3 cursor-pointer text-left ${
                activeSubView === "overview" 
                  ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 border border-emerald-500/35 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.06)]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#121420]/45"
              }`}
              id="sb-tab-overview"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>{isEn ? "Cockpit Overview" : "ককপিট ওভারভিউ"}</span>
            </button>

            <button
              onClick={() => { setActiveSubView("hybrid"); setIsMobileSidebarOpen(false); }}
              className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-3 cursor-pointer text-left ${
                activeSubView === "hybrid" 
                  ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/5 border border-cyan-500/35 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.06)] font-bold text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#121420]/45"
              }`}
              id="sb-tab-hybrid"
            >
              <Terminal className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>{isEn ? "Hybrid AI Engine" : "হাইব্রিড ইঞ্জিন"}</span>
            </button>

            <button
              onClick={() => { setActiveSubView("studio"); setIsMobileSidebarOpen(false); }}
              className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-3 cursor-pointer text-left ${
                activeSubView === "studio" 
                  ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 border border-emerald-500/35 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.06)] font-bold text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#121420]/45"
              }`}
              id="sb-tab-studio"
            >
              <Cpu className="w-4 h-4 shrink-0 text-emerald-400 animate-pulse" />
              <span>{isEn ? "AI Multitool Studio" : "এআই মাল্টিটুল স্টুডিও"}</span>
            </button>

            <button
              onClick={() => { setActiveSubView("video"); setIsMobileSidebarOpen(false); }}
              className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-3 cursor-pointer text-left ${
                activeSubView === "video" 
                  ? "bg-gradient-to-r from-pink-500/10 to-rose-500/5 border border-pink-500/35 text-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.06)] font-bold text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#121420]/45"
              }`}
              id="sb-tab-video"
            >
              <VideoIcon className="w-4 h-4 shrink-0 text-pink-400 animate-pulse" />
              <span>{isEn ? "Video Workspace" : "ভিডিও ওয়ার্কস্পেস"}</span>
            </button>

            <button
              onClick={() => { setActiveSubView("email"); setIsMobileSidebarOpen(false); }}
              className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-3 cursor-pointer text-left ${
                activeSubView === "email" 
                  ? "bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/35 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.06)] font-bold text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#121420]/45"
              }`}
              id="sb-tab-email"
            >
              <Megaphone className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{isEn ? "AI Email Campaigns" : "এআই ইমেইল ক্যাম্পেইন"}</span>
            </button>

            <button
              onClick={() => { setActiveSubView("landing-templates"); setIsMobileSidebarOpen(false); }}
              className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-3 cursor-pointer text-left ${
                activeSubView === "landing-templates" 
                  ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/5 border border-blue-500/35 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.06)] font-bold text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#121420]/45"
              }`}
              id="sb-tab-landing-templates"
            >
              <LayoutTemplate className="w-4 h-4 shrink-0 text-blue-400" />
              <span>{isEn ? "Landing Templates" : "ল্যান্ডিং টেমপ্লেট"}</span>
            </button>

            <button
              onClick={() => { setActiveSubView("promptspack"); setIsMobileSidebarOpen(false); }}
              className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-3 cursor-pointer text-left ${
                activeSubView === "promptspack" 
                  ? "bg-gradient-to-r from-teal-500/10 to-emerald-500/5 border border-teal-500/35 text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.06)] font-bold text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#121420]/45"
              }`}
              id="sb-tab-promptspack"
            >
              <Lock className="w-4 h-4 shrink-0 text-teal-400 animate-pulse" />
              <span>{isEn ? "Premium Prompt Packs" : "প্রিমিয়াম প্রম্পট প্যাক"}</span>
            </button>

            <button
              onClick={() => { setActiveSubView("projects"); setIsMobileSidebarOpen(false); }}
              className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-3 cursor-pointer text-left relative ${
                activeSubView === "projects" 
                  ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 border border-emerald-500/35 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.06)]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#121420]/45"
              }`}
              id="sb-tab-projects"
            >
              <FolderHeart className="w-4 h-4 shrink-0 text-purple-400" />
              <span>{isEn ? "Saved Project Vault" : "সংরক্ষিত প্রজেক্ট ভল্ট"}</span>
              <span className="absolute right-3.5 top-2.5 text-[8px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.2 rounded-md font-bold">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveSubView("cluster"); setIsMobileSidebarOpen(false); }}
              className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-3 cursor-pointer text-left ${
                activeSubView === "cluster" 
                  ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 border border-emerald-500/35 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.06)]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#121420]/45"
              }`}
              id="sb-tab-cluster"
            >
              <Activity className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>{isEn ? "Node Telemetry status" : "নোড টেলিমেট্রি স্ট্যাটাস"}</span>
            </button>

            <button
              onClick={() => { setActiveSubView("billing"); setIsMobileSidebarOpen(false); }}
              className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-3 cursor-pointer text-left ${
                activeSubView === "billing" 
                  ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 border border-emerald-500/35 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.06)]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#121420]/45"
              }`}
              id="sb-tab-billing"
            >
              <CreditCard className="w-4 h-4 shrink-0 text-pink-400" />
              <span>{isEn ? "Subscription & Billing" : "সাবস্ক্রিপশন এবং প্ল্যান"}</span>
            </button>

            {/* Sidebar Lead Capture CTA */}
            <button
              onClick={() => { setIsLeadCaptureModalOpen(true); setIsMobileSidebarOpen(false); }}
              className="w-full py-2.5 px-3.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 flex items-center gap-3 cursor-pointer text-left text-cyan-400 hover:text-[#090a0f] bg-cyan-950/20 hover:bg-emerald-400 border border-cyan-800/40 hover:border-emerald-500 shadow-[0_0_12px_rgba(6,182,212,0.08)]"
              id="sb-tab-lead-capture"
            >
              <Database className="w-4 h-4 shrink-0 text-cyan-400 group-hover:text-[#090a0f] animate-pulse" />
              <span>{isEn ? "Contact Sales CRM" : "কন্টাক্ট সেলস সিআরএম"}</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer area */}
        <div className="space-y-4 pt-5 mt-5 border-t border-gray-900">
          
          {/* English / Bengali language controller in sidebar */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#121420]/30 border border-gray-800/80 rounded-lg">
            <button
              onClick={() => setLanguage("english")}
              className={`py-1 rounded text-[10px] font-mono font-bold tracking-wider cursor-pointer transition-all ${
                isEn 
                  ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/25 text-emerald-400 font-extrabold" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
              id="sb-lang-en"
            >
              English
            </button>
            <button
              onClick={() => setLanguage("bengali")}
              className={`py-1 rounded text-[10px] font-mono font-bold tracking-wider cursor-pointer transition-all ${
                !isEn 
                  ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/25 text-emerald-400 font-extrabold" 
                  : "text-gray-500 hover:text-gray-300"
              }`}
              id="sb-lang-bn"
            >
              বাংলা
            </button>
          </div>

          {/* User profile section */}
          {auth.currentUser && (
            <div className="bg-[#090a0f] border border-gray-800/60 p-3 rounded-xl space-y-2 text-left mb-1.5" id="sb-profile-box">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center font-bold text-xs uppercase shadow-inner shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black text-white truncate block">
                    {auth.currentUser.displayName || auth.currentUser.email?.split("@")[0]}
                  </div>
                  <div className="text-[9px] text-gray-500 font-mono truncate block">
                    {auth.currentUser.email}
                  </div>
                </div>
              </div>
              
              {/* Cloud Synchronization Status Badge */}
              <div className="flex items-center justify-between text-[8px] font-mono border-t border-gray-800/40 pt-1.5 mt-1 pb-0.5">
                <span className="text-gray-500 uppercase tracking-wider">{isEn ? "Sync Status:" : "সিনক্রোনাইজেশন:"}</span>
                {cloudSyncStatus === "synced" ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]" />
                    {isEn ? "CLOUDSYNC ACTIVE" : "ক্লাউড সিঙ্ক অ্যাক্টিভ"}
                  </span>
                ) : cloudSyncStatus === "syncing" ? (
                  <span className="text-cyan-400 font-bold flex items-center gap-1 animate-pulse">
                    <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping shrink-0" />
                    {isEn ? "SYNCING..." : "সিঙ্কিং..."}
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                    {isEn ? "LOCAL OFFLINE VAULT" : "লোকাল অফলাইন মোড"}
                  </span>
                )}
              </div>
              
              <button
                onClick={() => {
                  signOut(auth).then(() => onExit());
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1 px-2.5 text-[9px] font-mono font-bold tracking-widest uppercase text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-md cursor-pointer transition-all duration-200"
                id="sb-logout-btn"
              >
                <LogOut className="w-2.5 h-2.5" />
                <span>{isEn ? "Sign Out" : "লগআউট"}</span>
              </button>
            </div>
          )}

          <button
            onClick={onExit}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-gray-400 hover:text-emerald-400 bg-gray-950 hover:bg-gray-900 border border-gray-800/80 rounded-lg transition-all duration-300 cursor-pointer shadow-md"
            id="sb-exit-btn"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{isEn ? "Go to Public Site" : "পাবলিক সাইটে ফিরে যান"}</span>
          </button>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/75 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* MAIN SCREEN AREA */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto z-10">

        {/* ==================== SUB-VIEW 1 : COCKPIT OVERVIEW ==================== */}
        {activeSubView === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Greeting Header Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-900 pb-5">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-widest font-bold">Workspace Cockpit App Mode</span>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                  {isEn 
                    ? `Welcome back, ${auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || "PCS Creator Node"}` 
                    : `স্বাগতম, ${auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || "পিসিএস ক্রিয়েটর নোড"}`}
                </h1>
                <p className="text-gray-400 text-xs mt-1">
                  {isEn ? "Real-time AI metrics, active credit telemetry, and unified marketing templates dashboard." : "রিয়েল-টাইম এআই ম্যাট্রিক্স, ক্রেডিট টেলিমেট্রি এবং সমন্বিত মার্কেটিং টেমপ্লেট ড্যাশবোর্ড।"}
                </p>
              </div>

              {/* Quick Generation Trigger */}
              <button
                onClick={() => setIsSandboxModalOpen(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-black text-xs font-extrabold px-4.5 py-2.5 rounded-xl shadow-lg shadow-emerald-400/10 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
                id="btn-quick-launch"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEn ? "Launch AI Studio Node" : "এআই স্টুডিও শুরু করুন"}</span>
              </button>
            </div>

            {/* Quick Access Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveSubView("hybrid")}
                className="relative overflow-hidden group bg-gradient-to-br from-[#0c0d16] to-[#090a0f] border border-gray-800/60 hover:border-cyan-500/40 p-4 rounded-2xl flex items-center gap-4 text-left transition-all duration-300 shadow-md cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 pointer-events-none transition-colors" />
                <div className="p-3 bg-cyan-950/30 text-cyan-400 rounded-xl border border-cyan-900/50 group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-wide group-hover:text-cyan-300 transition-colors">
                    {isEn ? "Open Hybrid Engine" : "হাইব্রিড ইঞ্জিন খুলুন"}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">
                    {isEn ? "Lightweight stable prompt-to-image & video tech." : "স্থায়ী হালকা ইমেজ এবং ভিডিও জেনারেটর।"}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-700 absolute right-4 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </button>
              
              <button
                onClick={() => setActiveSubView("email")}
                className="relative overflow-hidden group bg-gradient-to-br from-[#0c0d16] to-[#090a0f] border border-gray-800/60 hover:border-amber-500/40 p-4 rounded-2xl flex items-center gap-4 text-left transition-all duration-300 shadow-md cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 pointer-events-none transition-colors" />
                <div className="p-3 bg-amber-950/30 text-amber-400 rounded-xl border border-amber-900/50 group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-wide group-hover:text-amber-300 transition-colors">
                    {isEn ? "Generate AI Email Campaign" : "এআই ইমেইল ক্যাম্পেইন তৈরি করুন"}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">
                    {isEn ? "Create high-converting corporate email sequences instantly." : "উচ্চ-রূপান্তরকারী কর্পোরেট ইমেইল সিকোয়েন্স দ্রুত তৈরি করুন।"}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-700 absolute right-4 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => setActiveSubView("landing-templates")}
                className="relative overflow-hidden group bg-gradient-to-br from-[#0c0d16] to-[#090a0f] border border-gray-800/60 hover:border-blue-500/40 p-4 rounded-2xl flex items-center gap-4 text-left transition-all duration-300 shadow-md cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 pointer-events-none transition-colors" />
                <div className="p-3 bg-blue-950/30 text-blue-400 rounded-xl border border-blue-900/50 group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-wide group-hover:text-blue-300 transition-colors">
                    {isEn ? "Open Landing Templates" : "ল্যান্ডিং পেজ টেমপ্লেট"}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">
                    {isEn ? "Ready-made high converting website layouts." : "রেডিমেড উচ্চ রূপান্তরকারী ওয়েবসাইট লেআউট।"}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-700 absolute right-4 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => setActiveSubView("promptspack")}
                className="relative overflow-hidden group bg-gradient-to-br from-[#0c0d16] to-[#090a0f] border border-gray-800/60 hover:border-teal-500/40 p-4 rounded-2xl flex items-center gap-4 text-left transition-all duration-300 shadow-md cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 pointer-events-none transition-colors" />
                <div className="p-3 bg-teal-950/30 text-teal-400 rounded-xl border border-teal-900/50 group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-wide group-hover:text-teal-300 transition-colors">
                    {isEn ? "Premium Prompt Packs" : "প্রিমিয়াম প্রম্পট প্যাক"}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">
                    {isEn ? "Unlock locally persisted cyber-SaaS AI prompts." : "লোকাল প্রম্পট ও এআই প্যাকসমূহ আনলক করুন।"}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-700 absolute right-4 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            {/* Premium Stat Widget Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Dynamic remaining credits card */}
              <div className="bg-[#121420]/75 backdrop-blur-md p-5 rounded-2xl border border-gray-800/80 hover:border-emerald-500/30 transition-all duration-300 shadow-md group relative overflow-hidden min-h-[148px] flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/2 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{isEn ? "API Quota Remaining" : "এপিআই কোটা স্থিতি"}</span>
                  <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                    <Database className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black font-mono text-white">
                    {(creditLimit - creditsUsed).toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">/ {creditLimit.toLocaleString()} tokens</span>
                </div>
                {/* Credit usage visual slider block */}
                <div className="w-full bg-gray-950 h-1.5 rounded-full overflow-hidden mt-3 border border-gray-900">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-1000" 
                    style={{ width: `${((creditLimit - creditsUsed) / creditLimit) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 mt-2">
                  <span>{((creditLimit - creditsUsed) / creditLimit * 100).toFixed(1)}% {isEn ? "Left" : "বাকি আছে"}</span>
                  <span className="text-emerald-400 block group-hover:underline cursor-pointer" onClick={() => setActiveSubView("billing")}>{isEn ? "Upgrade Quota" : "কোটা বাড়ান"} &rarr;</span>
                </div>
              </div>

              {/* Node real-time speed card */}
              <div className="bg-[#121420]/75 backdrop-blur-md p-5 rounded-2xl border border-gray-800/80 hover:border-cyan-500/30 transition-all duration-300 shadow-md relative overflow-hidden group min-h-[148px] flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/2 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest whitespace-nowrap">{isEn ? "PCS AI Engine Status" : "পিসিএস এআই ইঞ্জিন স্ট্যাটাস"}</span>
                    <div className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20 shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5 select-all">
                    <span className="text-2xl font-black font-mono text-white tracking-tight">{nodeLatency}</span>
                    <span className="text-xs text-gray-500 font-mono">ms</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-emerald-400 font-mono leading-relaxed whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block shrink-0" />
                  <span>{isEn ? "Neural Engine Stable" : "নিউরাল ইঞ্জিন স্থিতিশীল"}</span>
                </div>
              </div>

              {/* Total User projects saved */}
              <div className="bg-[#121420]/75 backdrop-blur-md p-5 rounded-2xl border border-gray-800/80 hover:border-purple-500/30 transition-all duration-300 shadow-md relative overflow-hidden group min-h-[148px] flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/2 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{isEn ? "Branding Vault Folders" : "ব্র্যান্ডিং ভল্ট ফোল্ডার"}</span>
                  <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20">
                    <FolderHeart className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black font-mono text-white">{projects.length}</span>
                  <span className="text-xs text-gray-500 font-mono">{isEn ? "Active Campaigns" : "টি ক্যাম্পেইন সক্রিয়"}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-gray-400 mt-2.5 pt-1 bg-gray-950/20 rounded">
                  <span className="text-gray-500">{isEn ? "Structured local saving index" : "সম্পূর্ণ সিকিউর লোকাল স্টোরেজ"}</span>
                  <span className="text-purple-400 block group-hover:underline cursor-pointer" onClick={() => setActiveSubView("projects")}>{isEn ? "Browse Vault" : "ভল্ট দেখুন"}</span>
                </div>
              </div>

              {/* Server Active Deployment check */}
              <div className="bg-[#121420]/75 backdrop-blur-md p-5 rounded-2xl border border-gray-800/80 hover:border-indigo-500/30 transition-all duration-300 shadow-md relative overflow-hidden group min-h-[148px] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{isEn ? "Cluster Active Stack" : "ক্লাস্টার অ্যাক্টিভ স্ট্যাক"}</span>
                  <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold font-mono text-[#06b6d4]">API v1.5 // OK</span>
                </div>
                <p className="text-[9.5px] text-gray-500 mt-3.5 leading-relaxed font-sans">
                  {isEn ? "Secure isolated sandbox server with auto HTTPS proxies." : "অটোমেটেড সিকিউর আইএসও স্যান্ডবক্স গেটওয়ে প্রক্সি।"}
                </p>
              </div>

            </div>

            {/* Smart Dashboard Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-8">
              {[
                {
                  labelEn: "Active Workspace Nodes",
                  labelBn: "অ্যাক্টিভ ওয়ার্কস্পেস",
                  value: projects.length,
                  subTextEn: "Saved projects sandboxes",
                  subTextBn: "মোট অ্যাক্টিভ প্রকল্প স্যান্ডবক্স",
                  color: "border-emerald-500/10 text-emerald-400 hover:border-emerald-500/30",
                  icon: LayoutDashboard
                },
                {
                  labelEn: "Saved Prompt Blocks",
                  labelBn: "সংরক্ষিত প্রম্পট ব্লক",
                  value: vaultPrompts.length,
                  subTextEn: "Vault prompts stored",
                  subTextBn: "ভল্টে সংরক্ষিত প্রম্পট সংখ্যা",
                  color: "border-cyan-500/10 text-cyan-400 hover:border-cyan-500/30",
                  icon: FolderHeart
                },
                {
                  labelEn: "Telemetry Sync Logs",
                  labelBn: "টেলিমেট্রি সিঙ্ক লগ",
                  value: activities.length,
                  subTextEn: "Active node audit actions",
                  subTextBn: "সক্রিয় অডিট সিকয়েন্স সংখ্যা",
                  color: "border-purple-500/10 text-purple-400 hover:border-purple-500/30",
                  icon: Activity
                },
                {
                  labelEn: "Average API Transit",
                  labelBn: "গড় রেসপন্স স্পিড",
                  value: nodeLatency + "ms",
                  subTextEn: "Gateway roundtrip latency",
                  subTextBn: "লেটেন্সি রেসপন্স গেটওয়ে সময়",
                  color: "border-amber-500/10 text-amber-500 hover:border-amber-500/30",
                  icon: Zap
                },
                {
                  labelEn: "System Health Ratio",
                  labelBn: "রিসোর্স হেলথ মাত্রা",
                  value: "99.98%",
                  subTextEn: "PCS Cognitive Core uptime",
                  subTextBn: "রিসোর্স সংযোগের কার্যকারিতা হার",
                  color: "border-rose-500/10 text-rose-400 hover:border-rose-500/30",
                  icon: Shield
                },
              ].map((stat, idx) => {
                const IconComp = stat.icon;
                return (
                  <div 
                    key={idx} 
                    className={`bg-black/35 border ${stat.color} backdrop-blur-sm p-4 rounded-xl transition-all hover:scale-102 flex flex-col justify-between`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9.5px] font-mono text-gray-400 tracking-wider">
                        {isEn ? stat.labelEn : stat.labelBn}
                      </span>
                      <IconComp className="w-3.5 h-3.5 opacity-60" />
                    </div>
                    <div>
                      <div className="text-lg font-mono font-bold text-white tracking-tight leading-none my-1">
                        {stat.value}
                      </div>
                      <span className="text-[8px] text-gray-500 block leading-tight">
                        {isEn ? stat.subTextEn : stat.subTextBn}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Interactive SVG Analytics Panel Graph */}
            <div className="bg-[#121420]/75 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gray-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.4)]" id="interactive-analytics-console">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-900">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Activity className={`w-4 h-4 shrink-0 ${
                      selectedMetric === "token" ? "text-emerald-400" :
                      selectedMetric === "requests" ? "text-cyan-400" :
                      selectedMetric === "sessions" ? "text-purple-400" :
                      selectedMetric === "workspace" ? "text-amber-400" :
                      "text-rose-400"
                    }`} />
                    <span>
                      {selectedMetric === "token" ? (isEn ? "Prompt Tokens Workload" : "টোকেন জেনারেশন লোড") :
                       selectedMetric === "requests" ? (isEn ? "Cognitive API Requests" : "এপিআই রিকোয়েস্ট সংখ্যা") :
                       selectedMetric === "sessions" ? (isEn ? "Active User Run Density" : "সক্রিয় সেশন ঘনত্ব") :
                       selectedMetric === "workspace" ? (isEn ? "Workspace Launch Frequency" : "ওয়ার্কস্পেস কাজের মাত্রা") :
                       (isEn ? "SaaS Utilization Cost Value" : "সাস সার্ভিস পেমেন্ট মূল্য")}
                      {" "}
                      ({analyticsPeriod === "daily" ? (isEn ? "Daily 24H" : "দৈনিক ২৪ ঘণ্টা") :
                        analyticsPeriod === "weekly" ? (isEn ? "Weekly Core" : "সাপ্তাহিক কোর") :
                        (isEn ? "Monthly Forecast" : "মাসিক পূর্বাভাস")})
                    </span>
                  </h3>
                  <p className="text-gray-500 text-xs mt-1 font-sans">
                    {selectedMetric === "token" ? (isEn ? "Aggregated linguistic token volume spent on machine cycles." : "ভাষা সংস্করণ এপিআই কল থেকে উৎপন্ন টোকেনের গতিবেগ ও ব্যবহার পরিমাপক।") :
                     selectedMetric === "requests" ? (isEn ? "Real-time query payloads tracked across global gateway edge nodes." : "প্রতি রাউন্ড ট্রিপ রিকোয়েস্টে গেটওয়ে রেসপন্স সেকেন্ড গতি ও পরিমাণ পরিমাপক।") :
                     selectedMetric === "sessions" ? (isEn ? "Concurrent subscriber sessions logged against the authentication hub." : "আমাদের গেটওয়ে ডাটাবেজে রেকর্ডকৃত সর্বোচ্চ সেশন সংযোগ ঘনত্ব।") :
                     selectedMetric === "workspace" ? (isEn ? "Total projects created, sandboxes fired, and manual configurations synced." : "সংরক্ষিত প্রজেক্ট ও কাস্টম প্রম্পট মডিউল তৈরির মোট ব্যবহারিক কাজের হার।") :
                     (isEn ? "Estimated platform ledger valuation based on actual priority server resources." : "ক্লাউড জেনারেশন ও মেট্রিকে গ্রাহকের ধারণক্ষমতা অনুযায়ী আনুমানিক ব্যবসায়িক মূল্য।")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0 self-start lg:self-center items-center">
                  <button
                    onClick={() => setSelectedDetailMetric(selectedMetric)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 hover:border-emerald-500/35 text-emerald-400 font-mono text-[9.5px] font-bold uppercase rounded-lg transition-all cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                    <span>{isEn ? "Open Interactive IQ Details Panel" : "বিশ্লেষণ ইন্টেলিজেন্স প্যানেল"}</span>
                  </button>

                  {/* Period Selecter Toggle */}
                  <div className="flex bg-black/45 border border-gray-900 p-1 rounded-xl">
                  {[
                    { id: "daily", labelText: isEn ? "Daily 24h" : "দৈনিক" },
                    { id: "weekly", labelText: isEn ? "Weekly Core" : "সাপ্তাহিক" },
                    { id: "monthly", labelText: isEn ? "Monthly Forecast" : "মাসিক" }
                  ].map((pOpt) => (
                    <button
                      key={pOpt.id}
                      onClick={() => {
                        setAnalyticsPeriod(pOpt.id as any);
                        setActiveHoverIndex(null);
                      }}
                      className={`px-3 py-1 text-[10px] uppercase font-mono font-bold rounded-lg transition-all cursor-pointer ${
                        analyticsPeriod === pOpt.id 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" 
                          : "text-gray-500 hover:text-gray-300 border border-transparent"
                      }`}
                    >
                      {pOpt.labelText}
                    </button>
                  ))}
                </div>
              </div>
              </div>
              
              {/* Metric Selector Buttons */}
              <div className="flex flex-wrap items-center bg-black/44 border border-gray-900/60 p-1.5 rounded-xl gap-1.5 mb-6">
                {[
                  { id: "token", labelEn: "Prompt Tokens", labelBn: "টোকেনসমূহ", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:text-emerald-300" },
                  { id: "requests", labelEn: "API Requests", labelBn: "রিকোয়েস্টসমূহ", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/25 hover:text-cyan-300" },
                  { id: "sessions", labelEn: "Active Sessions", labelBn: "সেশনের ঘনত্ব", color: "bg-purple-500/10 text-purple-400 border-purple-500/25 hover:text-purple-300" },
                  { id: "workspace", labelEn: "Workspace Usage", labelBn: "ওয়ার্কস্পেস ব্যবহার", color: "bg-amber-500/10 text-amber-500 border-amber-500/25 hover:text-amber-400" },
                  { id: "revenue", labelEn: "Revenue Valuation", labelBn: "ব্যবসায়িক মূল্য", color: "bg-rose-500/10 text-rose-400 border-rose-500/25 hover:text-rose-300" },
                ].map((mOpt) => (
                  <button
                    key={mOpt.id}
                    onClick={() => {
                      setSelectedMetric(mOpt.id as any);
                      setActiveHoverIndex(null);
                      setSelectedDetailMetric(mOpt.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase font-bold transition-all cursor-pointer border ${
                      selectedMetric === mOpt.id
                        ? mOpt.color + " shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                        : "text-gray-500 hover:text-gray-300 border-transparent"
                    }`}
                  >
                    {isEn ? mOpt.labelEn : mOpt.labelBn}
                  </button>
                ))}
              </div>

              {/* Handcrafted Dynamic SVG Line Chart */}
              <div className="h-64 w-full relative mb-6" id="analytics-svg-container">
                {(() => {
                  const activeSeries = analyticsData[selectedMetric][analyticsPeriod];
                  const labels = activeSeries.labels;
                  const values = activeSeries.values;
                  const predictive = activeSeries.predictive;

                  const maxVal = Math.max(...values, ...predictive, 1);
                  const numPoints = values.length;
                  
                  // Map values to coordinates on a viewBox of 0 0 700 240
                  // Pad: X: 30 to 670, Y: 30 to 200
                  const mappedPoints = values.map((val, idx) => {
                    const x = 30 + (idx * (640 / (numPoints - 1 || 1)));
                    const y = 200 - (val / maxVal * 160);
                    return { x, y, value: val, label: labels[idx] };
                  });

                  const mappedPred = predictive.map((val, idx) => {
                    const x = 30 + (idx * (640 / (numPoints - 1 || 1)));
                    const y = 200 - (val / maxVal * 160);
                    return { x, y, value: val, label: labels[idx] };
                  });

                  // Build smooth SVG curve paths
                  const drawPath = (pts: {x: number, y: number}[]) => {
                    return pts.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                  };

                  const linePath = drawPath(mappedPoints);
                  const predPath = drawPath(mappedPred);
                  const fillPath = `${linePath} L 670,200 L 30,200 Z`;

                  // Glow color scheme
                  const schemeColor = 
                    selectedMetric === "token" ? "#10b981" :
                    selectedMetric === "requests" ? "#06b6d4" :
                    selectedMetric === "sessions" ? "#a855f7" :
                    selectedMetric === "workspace" ? "#f59e0b" :
                    "#f43f5e";

                  return (
                    <>
                      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 240">
                        <defs>
                          <linearGradient id="chart-glow-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={schemeColor} stopOpacity="0.30" />
                            <stop offset="100%" stopColor={schemeColor} stopOpacity="0.0" />
                          </linearGradient>
                          <filter id="neon-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        
                        {/* Grid lines */}
                        <line x1="30" y1="40" x2="670" y2="40" stroke="#1d2433" strokeWidth="0.8" strokeDasharray="3 3" />
                        <line x1="30" y1="120" x2="670" y2="120" stroke="#1d2433" strokeWidth="0.8" strokeDasharray="3 3" />
                        <line x1="30" y1="200" x2="670" y2="200" stroke="#374151" strokeWidth="1" />

                        {/* Standard Area Fill */}
                        <path d={fillPath} fill="url(#chart-glow-gradient)" className="transition-all duration-500 ease-in-out" />

                        {/* Predictive AI Forecast Dotted Trend Line */}
                        <path d={predPath} fill="none" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.65" className="transition-all duration-500 ease-in-out" />

                        {/* Neon Glowing Edge Line */}
                        <path d={linePath} fill="none" stroke={schemeColor} strokeWidth="3" strokeLinecap="round" filter="url(#neon-glow-filter)" className="transition-all duration-500 ease-in-out" />
                        
                        {/* Render active hover indicators */}
                        {activeHoverIndex !== null && mappedPoints[activeHoverIndex] && (
                          <g>
                            {/* Proportional vertical alignment line */}
                            <line 
                              x1={mappedPoints[activeHoverIndex].x} 
                              y1="25" 
                              x2={mappedPoints[activeHoverIndex].x} 
                              y2="200" 
                              stroke={schemeColor} 
                              strokeWidth="1" 
                              strokeDasharray="2 2" 
                              className="animate-pulse" 
                            />
                            {/* Glowing focus points */}
                            <circle cx={mappedPoints[activeHoverIndex].x} cy={mappedPoints[activeHoverIndex].y} r="7" fill={schemeColor} stroke="#030712" strokeWidth="2" className="transition-all duration-100" />
                            <circle cx={mappedPoints[activeHoverIndex].x} cy={mappedPoints[activeHoverIndex].y} r="12" fill={schemeColor} fillOpacity="0.2" className="animate-ping" />
                          </g>
                        )}

                        {/* Standard data-node markers */}
                        {mappedPoints.map((p, idx) => (
                          <circle 
                            key={idx} 
                            cx={p.x} 
                            cy={p.y} 
                            r={activeHoverIndex === idx ? "7" : "4"} 
                            fill={activeHoverIndex === idx ? schemeColor : "#0f172a"} 
                            stroke={schemeColor} 
                            strokeWidth="2" 
                            className="transition-all duration-150 cursor-pointer"
                          />
                        ))}

                        {/* Proportional Hover Overlay Hotspot Rectangles */}
                        {mappedPoints.map((p, idx) => {
                          const zoneWidth = Math.max(640 / (numPoints - 1 || 1), 10);
                          const xStart = p.x - zoneWidth / 2;
                          return (
                            <rect
                              key={idx}
                              x={xStart}
                              y="10"
                              width={zoneWidth}
                              height="190"
                              fill="transparent"
                              className="cursor-pointer"
                              onMouseEnter={() => setActiveHoverIndex(idx)}
                              onMouseLeave={() => setActiveHoverIndex(null)}
                            />
                          );
                        })}
                      </svg>

                      {/* Proportional Dynamic Day Labels Row */}
                      <div className="absolute bottom-[-14px] w-full flex justify-between px-2 text-[8.5px] font-mono text-gray-500 font-bold tracking-tight">
                        {mappedPoints.map((p, idx) => (
                          <span 
                            key={idx} 
                            style={{ 
                              left: `${(p.x / 700) * 100}%`,
                              transform: 'translateX(-50%)'
                            }}
                            className={`absolute transition-all duration-200 ${activeHoverIndex === idx ? "text-white" : ""}`}
                          >
                            {p.label}
                          </span>
                        ))}
                      </div>

                      {/* Premium Glassmorphic Hover Card Overlay Details */}
                      {activeHoverIndex !== null && mappedPoints[activeHoverIndex] && (
                        <div 
                          className="absolute bg-[#0b0c15]/95 border border-gray-800 rounded-xl p-3.5 shadow-2xl flex flex-col font-sans text-left transition-all pointer-events-none duration-150 z-20 w-44"
                          style={{
                            left: `${Math.min((mappedPoints[activeHoverIndex].x / 700) * 100 + 1.2, 70)}%`,
                            top: `${Math.max((mappedPoints[activeHoverIndex].y / 240) * 100 - 15, 6)}%`,
                          }}
                        >
                          <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-[#06b6d4]">
                            {mappedPoints[activeHoverIndex].label} Timeline
                          </span>
                          <div className="flex flex-col gap-1 mt-1.5 font-mono">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-gray-400">Actual:</span>
                              <span className="text-xs font-bold text-white leading-none">
                                {selectedMetric === "revenue" ? `$${mappedPoints[activeHoverIndex].value.toLocaleString()}` : mappedPoints[activeHoverIndex].value.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-gray-500">AI Forecast:</span>
                              <span className="text-xs font-bold text-gray-400 leading-none font-mono">
                                {selectedMetric === "revenue" ? `$${mappedPred[activeHoverIndex].value.toLocaleString()}` : mappedPred[activeHoverIndex].value.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-800 pt-1 mt-1.5 leading-none">
                              <span className="text-[8px] text-gray-600 uppercase font-mono">Trend sync:</span>
                              <span className="text-[9px] font-bold text-[#10b981] font-mono">
                                {mappedPoints[activeHoverIndex].value === 0 ? "0.0%" : 
                                 `+${Math.abs((mappedPoints[activeHoverIndex].value - mappedPred[activeHoverIndex].value) / mappedPoints[activeHoverIndex].value * 100).toFixed(1)}%`}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Advanced Enterprise Export Controller System */}
              <div className="mt-8 pt-4 border-t border-gray-900/60 flex flex-col sm:flex-row items-center justify-between gap-3.5">
                <div className="flex items-center gap-2 text-[10.5px] font-mono text-gray-400">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>{isEn ? "PCS Server Analytics Data Source Live" : "পিসিএস সার্ভার এনালাইটিক্স সোর্স সক্রিয়"}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    type="button"
                    onClick={exportCSVReport}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black border border-gray-900 hover:border-gray-850 text-[10.5px] font-mono hover:text-white transition-colors cursor-pointer text-gray-400 font-bold"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isEn ? "Export CSV spreadsheet" : "সিএসভি এক্সপোর্ট"}</span>
                  </button>
                  <button 
                    type="button"
                    onClick={exportUsageSummary}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black border border-gray-900 hover:border-gray-850 text-[10.5px] font-mono hover:text-white transition-colors cursor-pointer text-gray-400 font-bold"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isEn ? "Download Usage Text Log" : "অ্যাক্টিভিটি টেক্সট ফাইল"}</span>
                  </button>
                  <button 
                    type="button"
                    onClick={exportAnalyticsPDF}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#10b981]/10 hover:bg-[#10b981]/15 border border-emerald-500/20 hover:border-emerald-500/30 text-[10.5px] font-mono text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer font-bold"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{isEn ? "Print Ledger Invoice / PDF" : "অফিসিয়াল লেজার / PDF"}</span>
                  </button>
                </div>
              </div>

              {/* AI Workload Heatmap Monitor */}
              <div className="mt-8 border-t border-gray-900/60 pt-5 text-left font-mono">
                <span className="text-[9.5px] uppercase font-bold text-gray-500 tracking-wider block mb-3">// AI Cognitive Workload Heatmap Matrix (Core System Node Utilisation)</span>
                <div className="flex flex-col gap-1.5 p-3.5 bg-black/35 border border-gray-900 rounded-xl">
                  <div className="flex items-center justify-between text-[9.5px] text-gray-500 mb-1 font-sans">
                    <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-emerald-500" /> Active Priority Cluster nodes: <strong className="text-white">6/6 Nodes</strong></span>
                    <span>Load index: <strong>41.2% Average Capacity</strong></span>
                  </div>
                  <div className="grid grid-cols-12 sm:grid-cols-24 gap-1">
                    {Array.from({ length: 24 }).map((_, i) => {
                      const load = (i * 7 + 13) % 4; // varying workload states
                      const color = 
                        load === 0 ? "bg-emerald-950/40 border-emerald-950/20" :
                        load === 1 ? "bg-[#10b981]/15 border-emerald-500/10 animate-pulse" :
                        load === 2 ? "bg-cyan-950/45 border-cyan-900/20" :
                        "bg-[#10b981]/10 border-emerald-500/20 text-emerald-400 shadow-[inset_0_0_8px_rgba(16,185,129,0.05)]";
                      return (
                        <div 
                          key={i} 
                          title={`Hour Node ${i}: load level ${load}`}
                          className={`h-4 border rounded ${color} transition-all hover:scale-110 cursor-pointer`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-[8px] text-gray-600 mt-1 uppercase tracking-widest">
                    <span>00:00 (Lowest load)</span>
                    <span className="flex gap-2">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-950"/> Idle</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-800/40 animate-pulse"/> Medium</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-950"/> Active</span>
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500/20"/> Peak task</span>
                    </span>
                    <span>24:00 (Midnight sync)</span>
                  </div>
                </div>
              </div>

              {/* Telemetry Live Feed Block */}
              <div className="mt-8 border-t border-gray-900 pt-5 text-left font-mono">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-3">
                  <span className="text-[9.5px] uppercase font-bold text-gray-500 tracking-wider block">// Active Node & Gateway API Telemetry Feed</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Real-time Request Flow Log Feed */}
                  <div className="bg-black/35 border border-gray-900 rounded-xl p-3.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-2 border-b border-gray-900/60 pb-1.5">
                        <span className="flex items-center gap-1"><Terminal className="w-3.5 h-3.5 text-emerald-500" /> Gateway Logs</span>
                        <span className="text-emerald-400 text-[8.5px] font-normal animate-pulse bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">● Live Feed</span>
                      </div>
                      <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {apiLogs.length > 0 ? (
                          apiLogs.slice(0, 5).map((log, idx) => (
                            <div key={log.id || idx} className="flex items-center justify-between text-[10.5px] font-mono leading-none border-b border-gray-950 pb-1.5 last:border-0 hover:bg-white/5 p-1 rounded transition-colors">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className={log.status === "SUCCESS" ? "text-emerald-500 font-bold shrink-0" : "text-rose-500 font-bold shrink-0"}>
                                  {log.status === "SUCCESS" ? "● OK" : "■ ERR"}
                                </span>
                                <span className="text-gray-600 text-[8.5px] shrink-0 font-normal">{log.timestamp}</span>
                                <span className="text-[10px] font-bold text-gray-400 truncate">{log.endpoint}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-right shrink-0">
                                <span className="text-gray-500 text-[9px]">{log.latency}ms</span>
                                <span className="text-[9.5px] text-gray-400 italic bg-black/40 px-1.5 pb-0.5 rounded border border-gray-900 leading-none">{log.payloadSize}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-gray-600 italic py-2">
                            {isEn ? "No gateway logs recorded." : "কোনো গেইটওয়ে ট্রাফিকের রেকর্ড নেই।"}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminCodeInput("");
                        setIsAdminLoginModalOpen(true);
                      }}
                      className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-800/40 hover:border-cyan-500/65 text-[9px] text-[#22d3ee] font-bold uppercase rounded-md cursor-pointer transition-all"
                    >
                      <Lock className="w-3 h-3 text-[#22d3ee]" />
                      <span>{isEn ? "Access Admin Monitoring Core" : "এডমিন সিকিউর চ্যানেল"}</span>
                    </button>
                  </div>
                
                {campaignOutput && (
                  <div className="bg-[#121420]/50 border border-gray-800 rounded-xl p-4 flex flex-col justify-between mt-5 md:mt-0">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3 border-b border-gray-900/60 pb-2">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>{isEn ? "Unified AI Campaign Suite (6 Elements)" : "৬টি সমন্বিত ডিজিটাল ক্যাম্পেইন প্রজেক্ট"}</span>
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {/* Social media post card */}
                      <button
                        type="button"
                        onClick={() => handleCardSelect("facebookCaption")}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                          selectedCampaignCard === "facebookCaption"
                            ? "bg-[#10b981]/10 border-emerald-500/40 shadow-inner"
                            : "bg-[#121420]/50 border-gray-800 hover:border-gray-700 hover:bg-[#121420]/80"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">{isEn ? "Facebook Copywriter" : "ফেসবুক কন্টেন্ট কপি"}</span>
                          <span className="text-[8px] font-mono bg-[#10b981]/15 text-emerald-400 px-2 py-0.2 rounded border border-emerald-500/10">SOCIAL</span>
                        </div>
                        <p className="text-[10.5px] text-gray-400 mt-2 line-clamp-1 italic">
                          {campaignOutput.facebookCaption}
                        </p>
                      </button>

                      {/* SEO Tags */}
                      <button
                        type="button"
                        onClick={() => handleCardSelect("hashtags")}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                          selectedCampaignCard === "hashtags"
                            ? "bg-[#10b981]/10 border-emerald-500/40 shadow-inner"
                            : "bg-[#121420]/50 border-gray-800 hover:border-gray-755 hover:bg-[#121420]/80"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">{isEn ? "Targeted Keywords" : "সোশ্যাল কিওয়ার্ড হ্যাশট্যাগ"}</span>
                          <span className="text-[8px] font-mono bg-[#10b981]/15 text-emerald-400 px-2 py-0.2 rounded border border-emerald-500/10">SEO</span>
                        </div>
                        <p className="text-[10.5px] text-gray-400 mt-2 line-clamp-1 italic">
                          {campaignOutput.hashtags}
                        </p>
                      </button>

                      {/* DALL-E/Midjourney artificial visual prompter */}
                      <button
                        type="button"
                        onClick={() => handleCardSelect("posterPrompt")}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                          selectedCampaignCard === "posterPrompt"
                            ? "bg-[#10b981]/10 border-emerald-500/40 shadow-inner"
                            : "bg-[#121420]/50 border-gray-800 hover:border-gray-700 hover:bg-[#121420]/80"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">{isEn ? "AI Graphic Prompter" : "এআই ভিজিটার পোস্টার প্রম্পট"}</span>
                          <span className="text-[8px] font-mono bg-[#10b981]/15 text-emerald-400 px-2 py-0.2 rounded border border-emerald-500/10">IMAGE</span>
                        </div>
                        <p className="text-[10.5px] text-gray-400 mt-2 line-clamp-1 italic">
                          {campaignOutput.posterPrompt}
                        </p>
                      </button>

                      {/* Sora Cinematic Camera coordinates script */}
                      <button
                        type="button"
                        onClick={() => handleCardSelect("videoPrompt")}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                          selectedCampaignCard === "videoPrompt"
                            ? "bg-[#10b981]/10 border-emerald-500/40 shadow-inner"
                            : "bg-[#121420]/50 border-gray-800 hover:border-gray-700 hover:bg-[#121420]/80"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">{isEn ? "Cinematic Video story" : "৩ডি ক্যামেরা নির্দেশিকা ও স্পেসিফিকেশন"}</span>
                          <span className="text-[8px] font-mono bg-[#10b981]/15 text-emerald-400 px-2 py-0.2 rounded border border-emerald-500/10">VIDEO</span>
                        </div>
                        <p className="text-[10.5px] text-gray-400 mt-2 line-clamp-1 italic">
                          {campaignOutput.videoPrompt}
                        </p>
                      </button>

                      {/* Ad copy */}
                      <button
                        type="button"
                        onClick={() => handleCardSelect("adCopy")}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                          selectedCampaignCard === "adCopy"
                            ? "bg-[#10b981]/10 border-emerald-500/40 shadow-inner"
                            : "bg-[#121420]/50 border-gray-800 hover:border-gray-700 hover:bg-[#121420]/80"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">{isEn ? "Sales Script" : "বিজ্ঞাপন কপি স্ক্রিপ্ট"}</span>
                          <span className="text-[8px] font-mono bg-[#10b981]/15 text-emerald-400 px-2 py-0.2 rounded border border-emerald-500/10">AD COPY</span>
                        </div>
                        <p className="text-[10.5px] text-gray-400 mt-2 line-clamp-1 italic">
                          {campaignOutput.adCopy}
                        </p>
                      </button>

                      {/* Landing headline card */}
                      <button
                        type="button"
                        onClick={() => handleCardSelect("landingHeadline")}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                          selectedCampaignCard === "landingHeadline"
                            ? "bg-[#10b981]/10 border-emerald-500/40 shadow-inner"
                            : "bg-[#121420]/50 border-gray-800 hover:border-gray-700 hover:bg-[#121420]/80"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">{isEn ? "Landing Headline" : "ল্যান্ডিং পেজ স্লোগান"}</span>
                          <span className="text-[8px] font-mono bg-cyan-500/15 text-cyan-400 px-2 py-0.2 rounded border border-cyan-500/10">WEB LANDING</span>
                        </div>
                        <p className="text-[10.5px] text-gray-400 mt-2 line-clamp-1 italic">
                          {campaignOutput.landingHeadline}
                        </p>
                      </button>

                    </div>
                  </div>
                )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==================== SUB-VIEW 1.5 : HYBRID ENGINE ==================== */}
        {activeSubView === "hybrid" && (
          <div className="animate-fade-in text-left">
            <SaaSHybridStudio language={language} />
          </div>
        )}

        {/* ==================== SUB-VIEW 2 : AI MULTITOOL STUDIO ==================== */}
        {activeSubView === "studio" && (
          <SaaSAdvancedLabs
            language={language}
            isEn={isEn}
            projects={projects}
            setProjects={setProjects}
            saveProjectsToCloud={saveProjectsToCloud}
            logDashboardActivity={logDashboardActivity}
            creditsUsed={creditsUsed}
            creditLimit={creditLimit}
            generatedCount={generatedCount}
            recordGenerationCost={recordGenerationCost}
            activeTier={activeTier}
            onOpenMultiLang={() => setActiveSubView("multilang")}
          />
        )}

        {/* ==================== SUB-VIEW 2.5 : CINEMATIC VIDEO WORKSPACE ==================== */}
        {activeSubView === "video" && (
          <VideoGeneratorModule
            language={language}
            isEn={isEn}
            projects={projects}
            setProjects={setProjects}
            saveProjectsToCloud={saveProjectsToCloud}
            logDashboardActivity={logDashboardActivity}
            recordGenerationCost={recordGenerationCost}
            creditsUsed={creditsUsed}
            generatedCount={generatedCount}
          />
        )}

        {/* ==================== SUB-VIEW 2.8 : AI EMAIL CAMPAIGNS ==================== */}
        {activeSubView === "email" && (
          <div className="animate-fade-in text-left">
            <AIEmailCampaignGenerator />
          </div>
        )}

        {/* ==================== SUB-VIEW 2.9 : MULTI LANG ENGINE ==================== */}
        {activeSubView === "multilang" && (
          <div className="animate-fade-in text-left">
            <SaasTool language={language} setLanguage={setLanguage} />
          </div>
        )}

        {/* ==================== SUB-VIEW 2.10 : LANDING TARGET TEMPLATES ==================== */}
        {activeSubView === "landing-templates" && (
          <div className="animate-fade-in text-left">
            <SaaSLandingTemplates language={language} />
          </div>
        )}

        {/* ==================== SUB-VIEW 2.11 : PREMIUM PROMPT DOWNLOAD LAYER ==================== */}
        {activeSubView === "promptspack" && (
          <div className="animate-fade-in text-left">
            <SaaSPromptsPack 
              language={language}
              vaultPrompts={vaultPrompts}
              setVaultPrompts={setVaultPrompts}
              savePromptsToCloud={savePromptsToCloud}
              currentUserUid={auth.currentUser?.uid || "guest"}
              triggerSaaSToast={triggerSaaSToast}
              logDashboardActivity={logDashboardActivity}
            />
          </div>
        )}

        {/* ==================== SUB-VIEW 3 : PROJECT VAULT ARCHIVE ==================== */}
        {activeSubView === "projects" && (
          <div className="space-y-6 animate-fade-in text-left">
            
            {/* Header section  */}
            <div className="border-b border-gray-900 pb-5">
              <span className="text-[10px] font-mono uppercase text-[#06b6d4] tracking-widest font-bold">Secure Local & Cloud Document Storage</span>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
                {isEn ? "PCS Branding & Prompt Vault" : "ব্র্যান্ডিং এবং প্রম্পট ভল্ট"}
              </h1>
              <p className="text-gray-400 text-xs mt-1">
                {isEn 
                  ? "Load, customize, search, write annotations, and manage your saved campaigns or build reusable prompt instructions panels." 
                  : "সংরক্ষিত ক্যাম্পেইন ব্লুপ্রিন্ট ও এআই প্রম্পট ভল্ট ডিরেক্টরি রিয়েল-টাইম এডিট, সার্চ এবং লোড করতে পারবেন।"}
              </p>
              <div className="flex flex-wrap gap-2 mt-3 select-none">
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/30 border border-cyan-800/45 px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.15)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Premium Template Engine Active
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/10 border border-emerald-850/45 px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.15)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Hybrid SaaS Access Layer Enabled
                </span>
              </div>
            </div>

            {/* Sub-Tab Controller row */}
            <div className="flex border-b border-gray-900/50 pb-1.5 gap-2 relative z-10" id="vault-tabs-row">
              <button
                onClick={() => {
                  setActiveVaultTab("projects");
                  triggerSaaSToast(isEn ? "Browsing Campaign Blueprints" : "ক্যাম্পেইন ব্লুপ্রিন্ট ডিরেক্টরি ভিউ", "info");
                }}
                className={`py-2 px-4 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 relative ${
                  activeVaultTab === "projects"
                    ? "text-[#06b6d4] font-extrabold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {activeVaultTab === "projects" && (
                  <motion.div
                    layoutId="activeVaultTabGlow"
                    className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/30 rounded-xl -z-10 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <FolderHeart className="w-3.5 h-3.5" />
                <span>{isEn ? "Unified Blueprints (" + projects.length + ")" : "সংরক্ষিত ক্যাম্পেইনসমূহ (" + projects.length + ")"}</span>
              </button>
              <button
                onClick={() => {
                  setActiveVaultTab("prompts");
                  setNewPromptTitle("");
                  setNewPromptText("");
                  setEditingPromptId(null);
                  triggerSaaSToast(isEn ? "Browsing Enterprise Prompt Vault" : "কাস্টম প্রম্পট ভল্ট ডিরেক্টরি ভিউ", "info");
                }}
                className={`py-2 px-4 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 relative ${
                  activeVaultTab === "prompts"
                    ? "text-[#06b6d4] font-extrabold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                id="vault-tab-prompts"
              >
                {activeVaultTab === "prompts" && (
                  <motion.div
                    layoutId="activeVaultTabGlow"
                    className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/30 rounded-xl -z-10 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Cpu className="w-3.5 h-3.5" />
                <span>{isEn ? "AI Custom Prompt Vault (" + vaultPrompts.length + ")" : "কাস্টম প্রম্পট ভল্ট (" + vaultPrompts.length + ")"}</span>
              </button>
            </div>

            {/* Filter and Search Action Row */}
            <div className="space-y-3.5 my-4">
              <SaaSSearchAndFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategoryFilter={selectedCategoryFilter}
                setSelectedCategoryFilter={setSelectedCategoryFilter}
                isEn={isEn}
                totalFilteredCount={activeVaultTab === "projects" ? filteredProjects.length : filteredPrompts.length}
              />
              
              {activeVaultTab === "prompts" && (
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setEditingPromptId(null);
                      setNewPromptTitle("");
                      setNewPromptText("");
                      setNewPromptCategory("Marketing");
                      setIsSavePromptModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 bg-[#06b6d4]/10 hover:bg-[#06b6d4]/20 border border-[#06b6d4]/35 text-[#22d3ee] text-xs font-bold font-mono px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                    id="btn-add-vault-prompt"
                  >
                    <Plus className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isEn ? "Add Prompt Preset" : "নতুন প্রম্পট প্রিসেট"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* TAB CONTENT AREA 1: PROJECT CAMPAIGNS */}
            {activeVaultTab === "projects" && (
              <>
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredProjects.map((proj) => (
                      <motion.div 
                        key={proj.id}
                        whileHover={{ scale: 1.01, y: -2 }}
                        className="bg-[#0b0c13]/85 backdrop-blur-md rounded-2xl border border-gray-950 hover:border-cyan-500/40 opacity-95 hover:opacity-100 transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.12)] p-5.5 group flex flex-col justify-between relative overflow-hidden"
                      >
                        <div>
                          {/* Name Header and dynamic category pill */}
                          <div className="flex items-start justify-between gap-4 border-b border-gray-900 pb-3.5 mb-3.5">
                            <div>
                              <h3 className="text-sm font-bold text-white uppercase tracking-wide truncate max-w-[200px]">
                                {proj.name}
                              </h3>
                              <span className="text-[9.5px] font-mono text-gray-500 block mt-0.5">{proj.timestamp}</span>
                            </div>
                            <span className="text-[9px] font-mono font-bold tracking-widest uppercase bg-purple-500/10 text-purple-400 py-0.5 px-2.5 rounded-full border border-purple-500/15">
                              {proj.type}
                            </span>
                          </div>

                          {/* Source Concept details */}
                          <div className="mb-4">
                            <span className="text-[9.5px] font-mono text-gray-500 uppercase tracking-widest block mb-1">{isEn ? "Prompt concept" : "মূল ধারণা বাক্য"}</span>
                            <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed bg-[#090a0f]/40 p-2 rounded border border-gray-900">
                              {proj.prompt}
                            </p>
                          </div>

                          {/* Optional Notes Annotations */}
                          {proj.notes && (
                            <div className="mb-4">
                              <span className="text-[9.5px] font-mono text-emerald-400 uppercase tracking-widest block mb-2">{isEn ? "User Annotation / Notes" : "নোটস ও বিবরণী"}</span>
                              <p className="text-[11px] text-gray-400 italic">
                                &ldquo;{proj.notes}&rdquo;
                              </p>
                            </div>
                          )}

                        </div>

                        {/* Operational Triggers Panel */}
                        <div className="mt-5 pt-3.5 border-t border-gray-900/60 flex items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => deleteProject(proj.id, e)}
                              className="p-2 bg-red-500/5 hover:bg-red-500/10 text-red-400/80 hover:text-red-400 border border-red-500/15 rounded-lg transition-all cursor-pointer"
                              title="Delete project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingProject(proj);
                                setEditingProjectName(proj.name);
                                setEditingProjectNotes(proj.notes || "");
                                setIsEditProjectModalOpen(true);
                              }}
                              className="p-2 bg-[#10b981]/5 hover:bg-[#10b981]/15 text-emerald-400 border border-emerald-500/15 rounded-lg transition-all cursor-pointer"
                              title="Edit project"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Copy project text/JSON */}
                            <SaaSCopyButton payload={proj.output} isEn={isEn} />

                            {/* Export project TXT */}
                            <SaaSExportButton onExport={() => handleDownload(proj.output, proj.name)} isEn={isEn} />

                            {/* Load in playground workspace */}
                            <button
                              onClick={() => loadProjectToStudio(proj)}
                              className="px-3.5 py-1.5 bg-[#06b6d4] hover:bg-cyan-400 text-black rounded-lg text-[10.5px] uppercase font-mono font-bold transition-all cursor-pointer flex items-center gap-1 shadow-[0_2px_8px_rgba(6,182,212,0.15)]"
                            >
                              <ArrowRightLeft className="w-3 h-3 text-black" />
                              <span>Load Studio</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-[#121420]/30 border border-dashed border-gray-800 rounded-2xl">
                    <Trash2 className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                    <span className="text-gray-400 text-xs font-semibold block">{isEn ? "No records found in Document Vault." : "প্রজেক্ট ভল্ট খালি রয়েছে।"}</span>
                    <p className="text-gray-600 text-[10px] max-w-xs mx-auto mt-1 leading-relaxed">
                      {isEn 
                        ? "Generate models under AI Multi-tool Studio and trigger Save Project to write secure records." 
                        : "প্রজেক্ট তৈরি করে 'Save' বাটনে ক্লিক করার মাধ্যমে প্রথম প্রজেক্ট যুক্ত করুন।"}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* TAB CONTENT AREA 2: CUSTOM PROMPT VAULT */}
            {activeVaultTab === "prompts" && (
              <>
                {filteredPrompts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredPrompts.map((prom) => {
                      const activePlanIdValue = localStorage.getItem("activePlan") || "";
                      const hasPremiumActive = activePlanIdValue === "creator" || activePlanIdValue === "marketing" || activePlanIdValue === "business";
                      const hasEnterpriseActive = activePlanIdValue === "business";

                      const userHasProAccess = activeTier === "Creator Pro" || activeTier === "Enterprise" || hasPremiumActive;
                      const userHasBusinessAccess = activeTier === "Enterprise" || hasEnterpriseActive;

                      const isPromptLocked = 
                        (prom.isPremium === "pro" && !userHasProAccess) ||
                        (prom.isPremium === "business" && !userHasBusinessAccess);

                      return (
                        <motion.div 
                          key={prom.id}
                          whileHover={isPromptLocked ? {} : { scale: 1.01, y: -2 }}
                          className={`bg-[#0b0c13]/85 backdrop-blur-md rounded-2xl border transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-5.5 group flex flex-col justify-between relative overflow-hidden ${
                            isPromptLocked 
                              ? "border-gray-900/30 shadow-[inner_0_0_20px_rgba(239,68,68,0.01)]" 
                              : "border-gray-950 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.12)] opacity-95 hover:opacity-100"
                          }`}
                        >
                          <div className={isPromptLocked ? "filter blur-[3.5px] opacity-25 select-none pointer-events-none transition-all" : "transition-all"}>
                            {/* Name Header and custom category pill */}
                            <div className="flex items-start justify-between gap-4 border-b border-gray-900/80 pb-3.5 mb-3.5">
                              <div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <h3 className="text-sm font-bold text-white uppercase tracking-wide truncate max-w-[150px]">
                                    {prom.title}
                                  </h3>
                                  {prom.isPremium === "pro" && (
                                    <span className="text-[7.5px] font-mono font-black text-cyan-400 bg-cyan-950/40 border border-cyan-805/45 px-1 py-0.5 rounded shadow-[0_0_8px_rgba(6,182,212,0.25)] select-none uppercase tracking-wider">
                                      PRO TEMPLATE
                                    </span>
                                  )}
                                  {prom.isPremium === "business" && (
                                    <span className="text-[7.5px] font-mono font-black text-purple-400 bg-purple-950/40 border border-purple-805/45 px-1 py-0.5 rounded shadow-[0_0_8px_rgba(147,51,234,0.25)] select-none uppercase tracking-wider">
                                      BUSINESS TEMPLATE
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9.5px] font-mono text-gray-500 block mt-0.5">{prom.timestamp}</span>
                              </div>
                              <span className="text-[9px] font-mono font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 py-0.5 px-2.5 rounded-full border border-emerald-500/15 shrink-0">
                                {prom.category}
                              </span>
                            </div>

                            {/* Raw Prompt promptText details */}
                            <div className="mb-4">
                              <span className="text-[9.5px] font-mono text-gray-500 uppercase tracking-widest block mb-1">
                                {isEn ? "Prompt Text / Instructions Preset" : "প্রম্পট নির্দেশাবলী বিবরণ"}
                              </span>
                              <p className="text-xs text-gray-300 leading-relaxed bg-[#090a0f]/40 p-3 rounded border border-gray-900 font-mono whitespace-pre-wrap max-h-36 overflow-y-auto">
                                {prom.promptText}
                              </p>
                            </div>

                          </div>

                          {/* Actions button group Row */}
                          <div className={`mt-5 pt-3.5 border-t border-gray-900/60 flex items-center justify-between gap-2.5 ${isPromptLocked ? "filter blur-[3.5px] opacity-25 select-none pointer-events-none" : ""}`}>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingPromptId(prom.id);
                                  setNewPromptTitle(prom.title);
                                  setNewPromptText(prom.promptText);
                                  setNewPromptCategory(prom.category);
                                  setIsSavePromptModalOpen(true);
                                }}
                                className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/35 text-cyan-400 rounded-lg transition-all cursor-pointer"
                                title={isEn ? "Edit Prompt" : "সম্পাদনা করুন"}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={(e) => {
                                  if (confirm(isEn ? "Are you sure you want to delete this prompt preset?" : "আপনি কি নিশ্চিত প্রম্পটটি ভল্ট থেকে ডিলিট করতে চান?")) {
                                    deletePrompt(prom.id, e);
                                  }
                                }}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/35 text-red-400 rounded-lg transition-all cursor-pointer"
                                title={isEn ? "Delete Prompt" : "মুছে ফেলুন"}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* Copy button */}
                              <SaaSCopyButton payload={prom.promptText} isEn={isEn} />

                              {/* Load in playground workspace */}
                              <button
                                onClick={async () => {
                                  setPrompt(prom.promptText);
                                  setActiveSubView("studio");
                                  triggerSaaSToast(isEn ? "Prompt Loaded to Multitool Studio" : "স্টুডিও ওয়ার্কস্পেসে প্রম্পট লোড সম্পন্ন হয়েছে", "success");
                                  await logDashboardActivity(
                                    "generate",
                                    `Loaded Vault prompt preset: "${prom.title}"`,
                                    `ভল্ট থেকে প্রম্পট প্রিসেট লোড সম্পন্ন: "${prom.title}"`
                                  );
                                }}
                                className="px-3.5 py-1.5 bg-[#06b6d4] hover:bg-cyan-400 text-black rounded-lg text-[10.5px] uppercase font-mono font-bold transition-all cursor-pointer flex items-center gap-1 shadow-[0_2px_8px_rgba(6,182,212,0.15)]"
                              >
                                <Sparkles className="w-3 h-3 text-black" />
                                <span>Load Studio</span>
                              </button>
                            </div>
                          </div>

                          {/* Locked Hover Overlay */}
                          {isPromptLocked && (
                            <div className="absolute inset-0 bg-[#06070a]/92 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center select-none z-10 transition-all duration-300">
                              <div className="w-10 h-10 rounded-full bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-400 mb-2 shadow-[0_0_15px_rgba(239,68,68,0.35)] animate-pulse">
                                <Lock className="w-4.5 h-4.5" />
                              </div>
                              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider font-mono">
                                {isEn ? "Upgrade Required" : "আপগ্রেড প্রয়োজন"}
                              </span>
                              <p className="text-[9.5px] text-gray-400 max-w-[210px] my-1 leading-normal font-sans">
                                {prom.isPremium === "business"
                                  ? (isEn ? "Business Template: Requires active Enterprise plan." : "এন্টারপ্রাইজ টেমপ্লেট: বিজনেস প্ল্যান প্রয়োজন।")
                                  : (isEn ? "Pro Template: Requires active Creator Pro plan." : "প্রো টেমপ্লেট: ক্রিয়েটর প্রো প্ল্যান প্রয়োজন।")
                                }
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveSubView("billing");
                                  triggerSaaSToast(isEn ? "Redirecting to subscription console..." : "বিলিং কনসোল লোড হচ্ছে...", "info");
                                }}
                                className="mt-2 w-full max-w-[180px] py-1.5 bg-gradient-to-r from-red-500 to-purple-600 hover:from-cyan-400 hover:to-emerald-400 text-black font-mono font-bold text-[9px] uppercase tracking-wide tracking-wider rounded-lg transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.25)] hover:shadow-[0_0_20px_rgba(52,211,153,0.35)] hover:text-black"
                              >
                                {isEn ? "Upgrade To Unlock ↗" : "আনলক করতে আপগ্রেড করুন ↗"}
                              </button>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-[#121420]/30 border border-dashed border-gray-800 rounded-2xl">
                    <Cpu className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                    <span className="text-gray-400 text-xs font-semibold block">{isEn ? "AI Custom Prompt Vault is empty." : "প্রম্পট ভল্ট ডিরেক্টরি সম্পূর্ণ খালি রয়েছে।"}</span>
                    <p className="text-gray-600 text-[10px] max-w-xs mx-auto mt-1 leading-relaxed">
                      {isEn 
                        ? "Draft Custom Prompts or instruction blocks to save, edit, copy, and load instantly inside the Studio workspace." 
                        : "আপনার ড্রিফ্ট করা কাস্টম এআই প্রম্পটসমূহ যুক্ত ও রিয়েল-টাইম সেভ করতে ডানপাশের 'Add Prompt' এ ক্লিক করুন।"}
                    </p>
                  </div>
                )}
              </>
            )}

          </div>
        )}

        {/* ==================== SUB-VIEW 4 : CLUSTER TELEMETRY & DIAGNOSTICS ==================== */}
        {activeSubView === "cluster" && (
          <div className="space-y-6 animate-fade-in text-left">
            
            {/* Header section */}
            <div className="border-b border-gray-900 pb-5">
              <span className="text-[10px] font-mono uppercase text-[#06b6d4] tracking-widest font-bold">Priority Neural Edge Stats</span>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                {isEn ? "Gemini Node Telemetry" : "জেমিনি নোড টেলিমেট্রি"}
              </h1>
              <p className="text-gray-400 text-xs mt-1">
                {isEn 
                  ? "Operational Diagnostics, CPU core load and response health metrics for Google Gemini-3.5 Dhaka Gateway." 
                  : "ঢাকা জেমিনি-৩.৫ গেটওয়ে প্রক্সির ক্লাউড প্রসেস লোড এবং ইন্টিগ্রেশন স্পিড প্যারামিটার।"}
              </p>
            </div>

            {/* Diagnostic metrics card row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <div className="bg-[#121420]/75 backdrop-blur-md rounded-2xl border border-gray-800/80 p-5 font-mono">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10.5px] text-gray-400 uppercase font-bold tracking-wider">Gateway Status:</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-white text-base font-extrabold flex items-center gap-1.5">
                  <Cpu className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <span>SYS_ONLINE_SECURE</span>
                </div>
                <p className="text-[9.5px] text-gray-500 mt-2.5 leading-relaxed font-sans">
                  {isEn ? "Dhaka premium cluster server routes through multi-layer secure proxies seamlessly." : "সম্পূর্ণ সিকিউর নেটওয়ার্ক আইসোলেশন ও এপিআই রাউটিং সার্ভিস চলমান।"}
                </p>
              </div>

              <div className="bg-[#121420]/75 backdrop-blur-md rounded-2xl border border-gray-800/80 p-5 font-mono">
                <span className="text-[10.5px] text-gray-400 uppercase font-bold tracking-wider block mb-3">Request Payload Load:</span>
                <div className="text-amber-400 text-base font-extrabold flex items-center gap-1.5">
                  <Terminal className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                  <span>37.4 req / min</span>
                </div>
                <p className="text-[9.5px] text-gray-500 mt-2.5 leading-relaxed font-sans">
                  {isEn ? "Moderate cluster allocation rate. Free pathways available for prompt cycles." : "মাঝারি ক্লাস্টার ট্রাফিক অবস্থা। আপনার জন্য প্রাইওরিটি নোড এক্সেস বরাদ্দ আছে।"}
                </p>
              </div>

              <div className="bg-[#121420]/75 backdrop-blur-md rounded-2xl border border-gray-800/80 p-5 font-mono">
                <span className="text-[10.5px] text-gray-400 uppercase font-bold tracking-wider block mb-3">Priority Token Speed:</span>
                <div className="text-cyan-400 text-base font-extrabold flex items-center gap-1.5">
                  <Zap className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
                  <span>14,500 token / sec</span>
                </div>
                <p className="text-[9.5px] text-gray-500 mt-2.5 leading-relaxed font-sans">
                  {isEn ? "Highest priority pipeline node, optimizing complex campaign scripts speeds." : "উচ্চ গতির ক্লাউড এপিআই চ্যানেল সমন্বিত ক্যাম্পেইন জেনারেশন সম্পন্ন করে ৩ সেকেন্ডে।"}
                </p>
              </div>

            </div>

            {/* Diagnostic system terminal log trace element */}
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5.5 font-mono text-left shadow-inner">
              <div className="flex items-center justify-between border-b border-gray-900 pb-3.5 mb-3.5 select-none">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-gray-500 ml-2">PCS-AI-NODE-DIAGNOSTIC_TRACE_LOG</span>
                </div>
                <span className="text-[9px] text-[#06b6d4] font-bold">SYSTEM_ONLINE</span>
              </div>

              <div className="space-y-1.5 text-[10.5px] leading-relaxed text-gray-400 pr-1">
                <p><span className="text-emerald-400 font-bold">[OK]</span> Core Neural Network initialized. Nodes array count: 32</p>
                <p><span className="text-emerald-400 font-bold">[OK]</span> Loaded Google Gemini SDK Client @google/genai.</p>
                <p><span className="text-cyan-400 font-bold">[INFO]</span> Connected to priority node dhaka-priority-cluster-3.5-flash.</p>
                <p><span className="text-cyan-400 font-bold">[INFO]</span> Checking client user status: pcschairman53@gmail.com [PRO_TIER]</p>
                <p><span className="text-emerald-400 font-bold">[OK]</span> Synchronized localStorage history ledger items successfully.</p>
                <p><span className="text-yellow-500 font-bold">[WARN]</span> Port 3000 detected as isolated reverse proxy gateway node. Safe.</p>
                <p><span className="text-emerald-400 font-bold">[OK]</span> Latency stabilizer calibrated: 192ms base speed limits.</p>
                <p className="border-t border-gray-900 pt-1.5 text-[9.5px] text-gray-500">// End of sequence telemetry. Awaiting client interactive prompt instructions.</p>
              </div>
            </div>

            {/* Append hybrid telemetry module */}
            <SaaSTelemetryModule
              isEn={isEn}
              activeWorkspaceName={
                activeTab === "campaign" 
                  ? "Unified Campaign Builder" 
                  : activeTab === "caption" 
                  ? "AI Caption Studio" 
                  : activeTab === "poster" 
                  ? "Poster Designer" 
                  : activeTab === "video" 
                  ? "Video Coprocessor" 
                  : "Multitool Studio"
              }
              currentPromptLength={prompt?.length || 0}
              vaultPromptsCount={vaultPrompts?.length || 0}
            />

          </div>
        )}

        {/* ==================== SUB-VIEW 5 : SAAS ENTERPRISE BILLING & TIERS ==================== */}
        {activeSubView === "billing" && (
          <div className="space-y-6 animate-fade-in text-left">
            
            {/* Title section */}
            <div className="border-b border-gray-900 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#06b6d4] tracking-widest font-bold">Enterprise Quota Center</span>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                  {isEn ? "Subscription & Quota Node" : "সাবস্ক্রিপশন এবং এপিআই বিলিং"}
                </h1>
                <p className="text-gray-400 text-xs mt-1">
                  {isEn 
                    ? "Manage your subscription levels, view credit metrics, and simulator upgrade transactions." 
                    : "আপনার অ্যাক্টিভ প্ল্যান ম্যানেজ করুন, কারেন্সি ক্যাশব্যাক কাস্টমাইজ করুন এবং এআই নোড চেকআউট ট্রাই করুন।"}
                </p>
              </div>

              {/* Currency Selector Toggle */}
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex flex-wrap gap-1 items-center justify-end">
                  <span className="text-[8.5px] font-mono text-purple-400 bg-purple-950/20 border border-purple-900/35 px-1.5 py-0.5 rounded font-extrabold select-none">
                    Hybrid Dual Currency Layer Active
                  </span>
                  <span className="text-[8.5px] font-mono text-cyan-400 bg-cyan-950/20 border border-cyan-900/35 px-1.5 py-0.5 rounded font-bold select-none">
                    Quota Safe Pricing Formatter Enabled
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/35 px-2 py-0.5 rounded font-extrabold animate-pulse">
                    INR Billing Mode Enabled
                  </span>
                </div>
                <div className="flex items-center gap-1.5 p-1 bg-gray-950 border border-gray-800 rounded-lg">
                  <button
                    onClick={() => {
                      setSelectedCurrency("USD");
                      try { localStorage.setItem("pcs_billing_currency", "USD"); } catch(e){}
                    }}
                    className={`py-1 px-3 rounded text-[10px] font-mono font-bold tracking-wider cursor-pointer ${
                      selectedCurrency === "USD" 
                        ? "bg-[#06b6d4]/15 border border-[#06b6d4]/25 text-cyan-400 font-extrabold" 
                        : "text-gray-500"
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCurrency("INR");
                      try { localStorage.setItem("pcs_billing_currency", "INR"); } catch(e){}
                    }}
                    className={`py-1 px-3 rounded text-[10px] font-mono font-bold tracking-wider cursor-pointer ${
                      selectedCurrency === "INR" 
                        ? "bg-[#06b6d4]/15 border border-[#06b6d4]/25 text-cyan-400 font-extrabold" 
                        : "text-gray-500"
                    }`}
                  >
                    INR (₹)
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Subscription plan check badge */}
            <div className="bg-[#121420]/75 backdrop-blur-md rounded-2xl border border-gray-800/80 p-5 sm:p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/2 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-4 text-center sm:text-left self-stretch">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0 self-center">
                  <div className="w-full h-full bg-[#090b11] rounded-[10px] flex items-center justify-center text-emerald-400">
                    <Zap className="w-5 h-5 animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-mono">
                      {isEn ? "Your Active plan:" : "আপনার বর্তমান অ্যাক্টিভ প্ল্যান:"}
                    </h3>
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.2 rounded-full font-mono font-bold tracking-widest uppercase">
                      pro creator node
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1.5">
                    {isEn ? "Enjoy priority prompt compilers, unlimited campaigns blueprints storage and faster responses node cycle." : "সর্বোত্তম এআই প্রায়োরিটি নোড সক্রিয় রয়েছে। ৩ গুণ দ্রুত জেনারেট সুবিধা পাচ্ছেন।"}
                  </p>
                </div>
              </div>

              <div className="font-mono text-center sm:text-right shrink-0 py-2.5 px-4 bg-gray-950/40 border border-gray-900 rounded-xl min-w-[120px] self-stretch flex sm:flex-col justify-between sm:justify-center items-center">
                <span className="text-[10px] text-gray-500 block uppercase mb-1">{isEn ? "Spend Index" : "মাসিক খরচ"}</span>
                <span className="text-white text-base font-black">
                  {selectedCurrency === "USD" ? "$29 / mo" : "₹99 / mo"}
                </span>
              </div>
            </div>

            {/* Sub-tier list cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { name: "Starter Slate", usdPrice: "$0", inrPrice: "₹0", descEn: "15 Generations per month.", descBn: "পরীক্ষামূলক ব্যক্তিগত ব্যবহারের জন্য উপযুক্ত।", limit: "15 Generations", features: ["Standard translation node", "Simple outputs copying", "Client cache logs"] },
                { name: "Creator Pro", usdPrice: "$11", inrPrice: "₹99", descEn: "Unlimited neural models cycles.", descBn: "মার্কেটার এবং ডিজাইনারদের প্রফেশনাল চয়েস।", limit: "Unlimited Cycles", features: ["Priority Server cluster (Fast)", "Social LinkedIn filter tags", "Advanced Midjourney triggers", "Cinema Sora Video layout specs"] },
                { name: "Enterprise Custom", usdPrice: "$89", inrPrice: "₹799", descEn: "High-scale custom workspace API.", descBn: "কর্পোরেট টিম এবং এপিআই ব্রিজ ডিজাইনার্স।", limit: "Dedicated Server Node", features: ["Unlimited Cloud workspace seats", "Integrations API Access keys", "Dedicated SLA active monitors", "Secure custom credentials vault"] },
              ].map((tier, idx) => {
                const isActive = activeTier === (tier.name === "Enterprise Custom" ? "Enterprise" : tier.name as any);
                return (
                  <div 
                    key={idx}
                    className={`bg-[#121420]/75 backdrop-blur-md rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 relative ${
                      isActive 
                        ? "border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.08)]" 
                        : "border-gray-800/80 hover:border-gray-700/85"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute top-0 right-5 -translate-y-1/2 bg-emerald-400 text-black text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full shadow-md">
                        {isEn ? "ACTIVE" : "চলমান"}
                      </span>
                    )}

                    <div>
                      <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1.5">{tier.name}</h4>
                      <p className="text-[10.5px] text-gray-500 leading-relaxed mb-4 min-h-[30px]">
                        {isEn ? tier.descEn : tier.descBn}
                      </p>

                      <div className="border-b border-gray-900 pb-3 mb-4 font-mono">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                            {tier.inrPrice}
                          </span>
                          <span className="text-[10px] text-gray-500 font-bold lowercase">/month</span>
                        </div>
                        <div className="text-[10px] text-gray-400/80 mt-1 select-none font-medium">
                          (approx. {tier.usdPrice})
                        </div>
                      </div>

                      <ul className="space-y-2 mb-6 text-[11px] text-gray-400 leading-relaxed">
                        {tier.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2">
                            <span className="h-1 w-1 bg-emerald-400 rounded-full shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        if (tier.name !== "Enterprise Custom") {
                          handleUpgradeTier(tier.name === "Starter Slate" ? "Starter" : "Creator Pro");
                          setSaveSuccess(true);
                          setTimeout(() => setSaveSuccess(false), 3000);
                        } else {
                          triggerSaaSToast(isEn ? "Contacting Enterprise support desk simulated... Please select 'Enterprise Level' plan in the Billing Hub below to test direct Sandbox Checkout!" : "কর্পোরেট যোগাযোগ মডিউল সিম্যুলেশন সক্রিয়! সরাসরি টেস্ট চেকআউট করতে নিচের বিলিং প্যানেল থেকে Enterprise Level প্যাকেজটি নির্বাচন করুন।", "info");
                        }
                      }}
                      className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-300 cursor-pointer text-center ${
                        isActive
                          ? "bg-[#10b981]/15 border border-emerald-500/35 text-emerald-400"
                          : "bg-gray-950 hover:bg-gray-900 border border-gray-800 text-gray-300 hover:text-white"
                      }`}
                    >
                      {isActive ? (isEn ? "CURRENTLY ACTIVE" : "সক্রিয় রয়েছে") : (isEn ? "SELECT PLAN" : "প্ল্যান পরিবর্তন করুন")}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Premium billing layer simulation modules */}
            <SaaSPremiumBilling
              isEn={isEn}
              activeTier={activeTier}
              onUpgradeTier={handleUpgradeTier}
              activeWorkspaceName={
                activeTab === "campaign" 
                  ? "Unified Campaign Builder" 
                  : activeTab === "caption" 
                  ? "AI Caption Studio" 
                  : activeTab === "poster" 
                  ? "Poster Designer" 
                  : activeTab === "video" 
                  ? "Video Coprocessor" 
                  : "Multitool Studio"
              }
              totalPromptsCount={vaultPrompts?.length || 0}
              totalCampaignsCount={projects?.length || 0}
            />

          </div>
        )}

      </main>

      {/* ==================== GLOBAL LEAD CAPTURE PORTAL POPUP ==================== */}
      {isLeadCaptureModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[999] backdrop-blur-md overflow-y-auto">
          <div className="max-w-4xl w-full relative my-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] rounded-2xl">
            {/* Extremely visible close trigger */}
            <button
              onClick={() => setIsLeadCaptureModalOpen(false)}
              className="absolute right-4 top-4 z-[1001] bg-black/80 hover:bg-red-950/85 p-2 rounded-xl border border-gray-800 hover:border-red-500/40 text-gray-400 hover:text-red-400 cursor-pointer transition-all shadow-lg flex items-center justify-center"
              title="Close CRM Portal"
            >
              <X className="w-5 h-5" />
            </button>
            <SaaSLeadCaptureCRM isEn={isEn} />
          </div>
        </div>
      )}

      {/* ==================== PROJECT SAVING CONFIRMATION MODAL ==================== */}
      {isSaveProjectModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-[100] backdrop-blur-md">
          <div className="bg-[#121420] border border-gray-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl text-left font-sans">
            <button
              onClick={() => setIsSaveProjectModalOpen(false)}
              className="absolute right-4 top-4 p-1 rounded hover:bg-gray-900 text-gray-500 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-900">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                <FolderHeart className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                {isEn ? "Save to Project Vault" : "প্রজেক্ট ভল্ট স্টোরেজ"}
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10.5px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                  {isEn ? "Project Name:" : "প্রজেক্টের নাম দিন:"}
                </label>
                <input
                  type="text"
                  placeholder={isEn ? "Eco Bamboo Launch Campaign" : "যেমন: বাঁশের ব্রাশ ক্যাম্পেইন..."}
                  value={projectNameInput}
                  onChange={(e) => setProjectNameInput(e.target.value)}
                  className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-200 outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                  {isEn ? "Internal Notes / Brief:" : "মেমো বা প্রয়োজনীয় নোটস:"}
                </label>
                <textarea
                  rows={3}
                  placeholder={isEn ? "Enter notes here (e.g., Prepared for dental launch project)..." : "যেমন: জুন মাসের দাঁতের যত্ন ব্রাশ প্রমোশনের জন্য..."}
                  value={projectNotesInput}
                  onChange={(e) => setProjectNotesInput(e.target.value)}
                  className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-200 outline-none focus:border-emerald-500/60 resize-none font-sans"
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSaveProjectModalOpen(false)}
                  className="flex-1 py-2.5 px-3 bg-gray-950 hover:bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded-lg text-xs font-mono font-bold tracking-wider cursor-pointer text-center"
                >
                  {isEn ? "CANCEL" : "বাতিল"}
                </button>
                <button
                  type="button"
                  onClick={confirmSaveProject}
                  className="flex-1 py-2.5 px-3 bg-emerald-400 hover:bg-emerald-300 text-black rounded-lg text-xs font-mono font-bold tracking-wider cursor-pointer text-center"
                >
                  {isEn ? "CONFIRM SAVE" : "সংরক্ষণ করুন"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================== AI CUSTOM PROMPT VAULT DIALOG / MODAL ==================== */}
      {isSavePromptModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-[100] backdrop-blur-md">
          <div className="bg-[#121420] border border-gray-850 rounded-2xl p-6 max-w-lg w-full relative shadow-2xl text-left font-sans">
            <button
              onClick={() => setIsSavePromptModalOpen(false)}
              className="absolute right-4 top-4 p-1 rounded hover:bg-gray-900 text-gray-500 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-905">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                {editingPromptId 
                  ? (isEn ? "Modify Prompt Preset" : "প্রম্পট প্রিসেট সম্পাদনা") 
                  : (isEn ? "Create Prompt Preset" : "নতুন প্রম্পট প্রিসেট")}
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10.5px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                  {isEn ? "Prompt Title:" : "প্রম্পটের শিরোনাম:"}
                </label>
                <input
                  type="text"
                  placeholder={isEn ? "Facebook Ad copy structure" : "যেমন: ফেসবুক বিজ্ঞাপন প্রম্পট প্রিসেট..."}
                  value={newPromptTitle}
                  onChange={(e) => setNewPromptTitle(e.target.value)}
                  className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-200 outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                  {isEn ? "Instruction Category / Group:" : "গ্রুপ বা ক্যাটাগরি:"}
                </label>
                <input
                  type="text"
                  placeholder={isEn ? "LinkedIn, Copywriting, Marketing..." : "যেমন: মার্কেটিং, লিঙ্কডইন, ভিজ্যুয়াল ইত্যাদি..."}
                  value={newPromptCategory}
                  onChange={(e) => setNewPromptCategory(e.target.value)}
                  className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-200 outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                  {isEn ? "Prompt Text Instructions:" : "প্রম্পট বিবরণ ও নির্দেশমালা:"}
                </label>
                <textarea
                  rows={6}
                  placeholder={isEn ? "Write the detailed engineering prompt text with placeholders if needed..." : "ডিটেইল এআই ইঞ্জিনিয়ারিং প্রম্পট স্ট্রাকচার এখানে লিখুন..."}
                  value={newPromptText}
                  onChange={(e) => setNewPromptText(e.target.value)}
                  className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-3 text-xs text-gray-200 outline-none focus:border-emerald-500/60 resize-none font-mono"
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSavePromptModalOpen(false)}
                  className="flex-1 py-2.5 px-3 bg-gray-950 hover:bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded-lg text-xs font-mono font-bold tracking-wider cursor-pointer text-center"
                >
                  {isEn ? "CANCEL" : "বাতিল"}
                </button>
                <button
                  type="button"
                  onClick={confirmSavePrompt}
                  className="flex-1 py-2.5 px-3 bg-emerald-400 hover:bg-emerald-300 text-black rounded-lg text-xs font-mono font-bold tracking-wider cursor-pointer text-center"
                >
                  {isEn ? "SAVE PRESET" : "সংরক্ষণ করুন"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================== PROJECT EDIT MODAL ==================== */}
      {isEditProjectModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-[102] backdrop-blur-md">
          <div className="bg-[#121420] border border-gray-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl text-left font-sans">
            <button
              onClick={() => setIsEditProjectModalOpen(false)}
              className="absolute right-4 top-4 p-1 rounded hover:bg-gray-900 text-gray-500 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-900">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Edit className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                {isEn ? "Edit Project Meta" : "প্রজেক্টের তথ্য সংশোধন"}
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10.5px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                  {isEn ? "Project Name:" : "প্রজেক্টের নাম:"}
                </label>
                <input
                  type="text"
                  value={editingProjectName}
                  onChange={(e) => setEditingProjectName(e.target.value)}
                  className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-200 outline-none focus:border-emerald-500/60 font-sans"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                  {isEn ? "Internal Notes / Brief:" : "মেমো বা প্রয়োজনীয় নোটস:"}
                </label>
                <textarea
                  rows={4}
                  value={editingProjectNotes}
                  onChange={(e) => setEditingProjectNotes(e.target.value)}
                  className="w-full bg-[#090a0f] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-200 outline-none focus:border-emerald-500/60 resize-none font-sans"
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditProjectModalOpen(false)}
                  className="flex-1 py-2 px-3 bg-gray-950 hover:bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded-lg text-xs font-mono font-bold tracking-wider cursor-pointer text-center"
                >
                  {isEn ? "CANCEL" : "বাতিল"}
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditedProject}
                  className="flex-1 py-1.5 px-3 bg-[#10b981] hover:bg-emerald-400 text-black rounded-lg text-xs font-mono font-bold tracking-wider cursor-pointer text-center"
                >
                  {isEn ? "SAVE CHANGES" : "পরিবর্তন সংরক্ষণ"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================== INTERACTIVE DIRECT PLAYGROUND SANDBOX WORKSPACE MODAL ==================== */}
      {isSandboxModalOpen && (
        <div className="fixed inset-0 bg-[#090a0f]/95 z-[101] flex flex-col md:flex-row backdrop-blur-lg">
          {/* Sidebar Area */}
          <div className="w-full md:w-80 bg-[#0c0d16] border-b md:border-b-0 md:border-r border-gray-900 p-6 flex flex-col justify-between shrink-0 text-left">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-1 rounded bg-emerald-500/10 text-emerald-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="font-mono text-[10px] text-white uppercase font-black tracking-widest">Sandbox Engine Host</span>
              </div>
              
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-2">
                {isEn ? "Direct Instruction Hub" : "সরাসরি নির্দেশমালা হাব"}
              </h2>
              <p className="text-gray-450 text-xs leading-relaxed mb-6">
                {isEn 
                  ? "Bypass all workflow templates. Transmit direct cognitive requests to our dual layer priority clusters." 
                  : "কোনো টেমপ্লেট ছাড়াই জেমিনি কগনিটিভ এআই ইঞ্জিনে সরাসরি ইনপুট প্রেরণ ও কাস্টম টেস্টিং হাব।"}
              </p>
              
              <div className="space-y-3.5 font-mono">
                <div className="bg-black/40 border border-gray-900 p-3 rounded-xl">
                  <span className="text-[8.5px] font-mono uppercase text-gray-500 block mb-1">Engine Endpoint</span>
                  <span className="text-[11px] text-emerald-400 block font-bold">gemini-2.5-flash-instant</span>
                </div>
                <div className="bg-black/40 border border-gray-900 p-3 rounded-xl">
                  <span className="text-[8.5px] font-mono uppercase text-[#06b6d4] block mb-1">Routing Node Cluster</span>
                  <span className="text-[11px] text-cyan-400 block font-bold">PCS-AI-NEURAL-ROUTER</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsSandboxModalOpen(false)}
              className="mt-6 w-full py-2.5 px-3 bg-red-950/10 border border-red-950/40 rounded-xl text-xs font-mono uppercase font-bold text-red-400 hover:bg-red-950/20 transition-all cursor-pointer text-center flex items-center justify-center gap-2"
            >
              <X className="w-3.5 h-3.5" />
              <span>{isEn ? "Exit Sandbox" : "স্যান্ডবক্স বন্ধ করুন"}</span>
            </button>
          </div>
          
          {/* Workspace Area */}
          <div className="flex-1 min-w-0 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto text-left">
            <div>
              <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-900/60">
                <div>
                  <h1 className="text-lg font-black text-white uppercase tracking-widest font-mono flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <span>{isEn ? "Isolated Direct Playground" : "আইসোলেটেড ডিরেক্ট স্যান্ডবক্স"}</span>
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">
                    {isEn ? "Full direct system query and prompt testing console." : "সরাসরি এআই কুয়েরি এবং কাস্টম কগনিটিভ লজিক টেস্ট ল্যাব।"}
                  </p>
                </div>
                {/* Visual Status Tag */}
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[9px] text-emerald-400 font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SECURE CONNECTED</span>
                </div>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[10.5px] font-mono text-gray-405 uppercase tracking-widest mb-1.5">// Enter Custom System Context / Prompt</label>
                  <textarea
                    rows={6}
                    value={sandboxPrompt}
                    onChange={(e) => setSandboxPrompt(e.target.value)}
                    placeholder={isEn 
                      ? "Write any question, prompt, or instruction for Gemini to execute..." 
                      : "যেকোনো ইন্সট্রাকশন, প্রম্পট বা সরাসরি প্রশ্ন লিখুন যা আপনি টেস্ট করতে চান..."}
                    className="w-full bg-[#0c0d16] border border-gray-850 rounded-xl p-4 text-xs font-mono text-gray-200 outline-none focus:border-cyan-500/50 resize-none leading-relaxed"
                  />
                </div>
                
                {/* Run Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSandboxGenerate}
                    disabled={isSandboxGenerating}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-black px-6 py-3 rounded-xl text-xs font-bold font-mono tracking-widest uppercase shadow-lg shadow-emerald-400/5 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    {isSandboxGenerating ? (
                      <>
                        <Cpu className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>Execute Prompt</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Output Console Box */}
                {(sandboxOutput || isSandboxGenerating) && (
                  <div className="border border-gray-900 rounded-xl overflow-hidden mt-6 animate-fade-in bg-black/40 text-left">
                    <div className="bg-[#0c0d16] border-b border-gray-900 px-4 py-2.5 flex justify-between items-center text-[10px] font-mono text-gray-500">
                      <span>CONSOLE FEEDBACK RESPONSE</span>
                      {sandboxOutput && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(sandboxOutput);
                            setIsCopied(true);
                            setTimeout(() => setIsCopied(false), 2000);
                          }}
                          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{isCopied ? "Copied!" : "Copy Console"}</span>
                        </button>
                      )}
                    </div>
                    
                    <div className="p-5 font-mono text-[11px] leading-relaxed text-gray-300 whitespace-pre-wrap max-h-[300px] overflow-y-auto bg-black/20">
                      {isSandboxGenerating ? (
                        <div className="flex flex-col gap-2.5 py-4 text-gray-500 italic">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                            <span>Awaiting stream response. Generating custom token blocks...</span>
                          </div>
                        </div>
                      ) : (
                        sandboxOutput
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-[9.5px] font-mono text-gray-600 mt-8 text-center md:text-left pt-4 border-t border-gray-900/40">
              <span>PCS COGNITIVE GRID AGENT ACTIVE IN PRIVATE SUB-NETWORKS</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CYBERPUNK INTERACTIVE ANALYTICS DETAILS MODAL ==================== */}
      <AnimatePresence>
        {selectedDetailMetric && (
          <div className="fixed inset-0 bg-black/90 z-[105] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[#0b0c15] border border-gray-900 rounded-3xl w-full max-w-2xl p-6 sm:p-8 text-left shadow-[0_0_50px_rgba(16,185,129,0.08)] relative"
            >
              {/* Glowing header border */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
              
              {/* Top Row Nav */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-900/60 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">// PCS ANALYTICS DECISION CORE</span>
                  </div>
                  <h2 className="text-base font-black text-white uppercase tracking-wider font-mono">
                    {selectedDetailMetric === "token" && (isEn ? "Prompt Tokens Analysis" : "প্রম্পট টোকেন বিশ্লেষণ")}
                    {selectedDetailMetric === "requests" && (isEn ? "API Traffic Monitoring" : "এপিআই ট্রাফিক লাইভ মনিটর")}
                    {selectedDetailMetric === "sessions" && (isEn ? "Interactive Sessions Overview" : "গ্রাহক সেশন ইন্টেলিজেন্স")}
                    {selectedDetailMetric === "workspace" && (isEn ? "AI Workspace Utility Score" : "ওয়ার্কস্পেস কগনিটিভ স্কোর")}
                    {selectedDetailMetric === "revenue" && (isEn ? "SaaS Revenue Valuation Matrix" : "এসএএএস রেভিনিউ ভ্যালুয়েশন")}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setSelectedDetailMetric(null);
                    setExpandedCardId(null);
                  }}
                  className="p-1.5 rounded-lg bg-black/40 hover:bg-black border border-gray-950 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sub-text explanation */}
              <p className="text-xs text-gray-450 mb-6 font-mono leading-relaxed bg-black/20 p-3 rounded-xl border border-gray-900/40">
                {selectedDetailMetric === "token" && (isEn ? "In-depth insights tracking token utilization efficiency across deep learning generative sub-layers. High token ratios directly correlate to robust outputs." : "জেনারেটিভ এআই সাব-লেয়ার জুড়ে টোকেন ব্যবহারের দক্ষতা ট্র্যাক করুন। উচ্চ টোকেন রেশিও আউটপুট কোয়ালিটি সমৃদ্ধ করে।")}
                {selectedDetailMetric === "requests" && (isEn ? "High-performance edge routings processing external customer queries. Visualizes rate limit triggers, latency curves, and successful compilations." : "উচ্চ ক্ষমতাসম্পন্ন এজ রাউটিং প্রক্রিয়াকরণ। এখানে রেট লিমিট ট্রিগার, ল্যাটেন্সি কার্ভ এবং সফল জেনারেটিভ ট্রাফিকের তথ্য রয়েছে।")}
                {selectedDetailMetric === "sessions" && (isEn ? "Detailed customer longevity indices, geo-locations of secure tunnels, current concurrent subscriber loads, and routing nodes." : "ডিটেইল গ্রাহক সেশন ডিউরেশন ইনডেক্স, ক্লাউড কানেকশন টানেল এবং লোড ডিস্ট্রিবিউশন কগনিটিভ প্যারামিটারসমূহ।")}
                {selectedDetailMetric === "workspace" && (isEn ? "Calculated workspace utility scoring representing active engagement. Evaluates prompt templates loaded, code-executions, and custom exports." : "কগনিটিভ কর্মদক্ষতা স্কোরিং যা ব্যবহারকারীর লাইভ কাজের গতি নির্দেশ করে। টেমপ্লেট নোড, কোড রান এবং এক্সপোর্ট দ্বারা মূল্যায়িত।")}
                {selectedDetailMetric === "revenue" && (isEn ? "SaaS MRR revenue projections. Upgrade user active tiers interactively to update system-wide limits and watch the telemetry synchronize." : "মাসিক পুর্নরাবৃত্ত জেনারেটেড রেভিনিউ। আপনার সাবস্ক্রিপশন পেইড টায়ার আপগ্রেড করুন এবং লাইভ গ্লোবাল লিমিট ও ক্লাউড ডেটা পরিবর্তন দেখুন।")}
              </p>

              {/* Key Statistics Grid with Cyber visuals */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono">
                <div className="p-3 bg-black/30 border border-gray-950 text-center rounded-2xl relative overflow-hidden group">
                  <span className="text-[8px] uppercase font-bold text-gray-500 tracking-wider block mb-1">Utilization Index</span>
                  <span className="text-sm font-bold text-emerald-400 block tracking-tight">
                    {selectedDetailMetric === "token" && "78.4% Max"}
                    {selectedDetailMetric === "requests" && "98.4% Acc"}
                    {selectedDetailMetric === "sessions" && (isEn ? `${onlineCount} active` : `৩টি সেশন`)}
                    {selectedDetailMetric === "workspace" && "92.1 / 100"}
                    {selectedDetailMetric === "revenue" && (isEn ? "94.6% Upgrade" : "%৯৪.৬%") }
                  </span>
                  <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 w-1/3 group-hover:w-full transition-all duration-300" />
                </div>

                <div className="p-3 bg-black/30 border border-gray-950 text-center rounded-2xl relative overflow-hidden group">
                  <span className="text-[8px] uppercase font-bold text-gray-500 tracking-wider block mb-1">Anomaly Rate</span>
                  <span className="text-sm font-bold text-rose-500 block tracking-tight">
                    {selectedDetailMetric === "token" && "0.01% Low"}
                    {selectedDetailMetric === "requests" && "1.6% Rate"}
                    {selectedDetailMetric === "sessions" && "0.0% Node"}
                    {selectedDetailMetric === "workspace" && "0.3% Drift"}
                    {selectedDetailMetric === "revenue" && "0.0% Churn"}
                  </span>
                  <div className="absolute bottom-0 left-0 h-1 bg-rose-500 w-1/3 group-hover:w-full transition-all duration-300" />
                </div>

                <div className="p-3 bg-black/30 border border-gray-950 text-center rounded-2xl relative overflow-hidden group">
                  <span className="text-[8px] uppercase font-bold text-gray-500 tracking-wider block mb-1">Node Response</span>
                  <span className="text-sm font-bold text-cyan-400 block tracking-tight">
                    {selectedDetailMetric === "token" && "42 ms avg"}
                    {selectedDetailMetric === "requests" && "112 ms avg"}
                    {selectedDetailMetric === "sessions" && "12 ms ping"}
                    {selectedDetailMetric === "workspace" && "98 ms cycle"}
                    {selectedDetailMetric === "revenue" && "Instant Sync"}
                  </span>
                  <div className="absolute bottom-0 left-0 h-1 bg-cyan-400 w-1/3 group-hover:w-full transition-all duration-300" />
                </div>

                <div className="p-3 bg-black/30 border border-gray-950 text-center rounded-2xl relative overflow-hidden group">
                  <span className="text-[8px] uppercase font-bold text-gray-500 tracking-wider block mb-1">Sync State</span>
                  <span className="text-sm font-bold text-purple-400 block tracking-tight uppercase">
                    {cloudSyncStatus}
                  </span>
                  <div className="absolute bottom-0 left-0 h-1 bg-purple-500 w-1/3 group-hover:w-full transition-all duration-300" />
                </div>
              </div>

              {/* Expandable Factor Cards Loop */}
              <div className="space-y-3 mb-6">
                <span className="text-[9px] uppercase font-bold text-gray-500 tracking-widest block font-mono mb-2">// Expandable Analytical Sub-systems</span>
                {[
                  {
                    id: "factor-1",
                    titleEn: selectedDetailMetric === "token" ? "Cognitive Core System Overheads" : 
                             selectedDetailMetric === "requests" ? "Edge Route Latency Filter" :
                             selectedDetailMetric === "sessions" ? "Multi-Channel Subscriber Pools" :
                             selectedDetailMetric === "workspace" ? "Core Compiler Engagements" : "Monthly SaaS Recurring Yield (MRR)",
                    titleBn: selectedDetailMetric === "token" ? "কগনিটিভ কোর সিস্টেম ওভারহেড" : 
                             selectedDetailMetric === "requests" ? "এজ রুট লেটেন্সি ফিল্টার" :
                             selectedDetailMetric === "sessions" ? "মাল্টি-চ্যানেল সাবস্ক্রাইবার পুল" : 
                             selectedDetailMetric === "workspace" ? "কোর কম্পাইলার কার্যক্রম" : "মাসিক এসএএএস পুর্নরাবৃত্ত আয়",
                    previewEn: selectedDetailMetric === "token" ? "Evaluates background system instructions token spend." : 
                               selectedDetailMetric === "requests" ? "Inspects real-time edge network hop speeds." :
                               selectedDetailMetric === "sessions" ? "Tracks current active subscriber accounts." :
                               selectedDetailMetric === "workspace" ? "Evaluates usage rates inside target compilers." : "SaaS recurring streams from subscribed tier nodes.",
                    previewBn: selectedDetailMetric === "token" ? "সিস্টেমের ব্যাকগ্রাউন্ড ইন্সট্রাকশনে ব্যবহৃত টোকেন ক্ষয়।" : 
                               selectedDetailMetric === "requests" ? "রিয়েল-টাইম এজ নেটওয়ার্ক হপ স্পিড পর্যালোচনা।" :
                               selectedDetailMetric === "sessions" ? "নিবন্ধিত সক্রিয় গ্রাহকদের সেশন ও চ্যানেল মনিটর।" : 
                               selectedDetailMetric === "workspace" ? "কম্পাইলার নোড সমূহে ব্যবহারকারীর রান পরিসংখ্যান।" : "পেইড সাবস্ক্রিপশন চ্যানেল থেকে নিশ্চিত আয় ধারা।",
                    descEn: selectedDetailMetric === "token" ? "This represents the base cost of powering cognitive routing context. Our system leverages highly compressed JSON structures to maintain minimal overheads." : 
                            selectedDetailMetric === "requests" ? "Edge latency handles request validation. Typical transit speeds are bounded within 85-115ms across gateways." :
                            selectedDetailMetric === "sessions" ? "Multi-channel pipelines support collaborative features. Up to 12 concurrent WebSocket connections reside gracefully inside each container node." :
                            selectedDetailMetric === "workspace" ? "Tracks compiler activities, output sizes, copy-clipboard durations, text validation, and structural prompt audits." : "Monthly yields are calculated progressively based on user-sync upgrades.",
                    descBn: selectedDetailMetric === "token" ? "এটি কগনিটিভ রাউটিং পরিচালনার প্রাথমিক খরচ। টোকেন ওভারহেড সর্বনিম্ন রাখতে সাহায্য করে আমাদের অত্যন্ত সংকুচিত ডাটা আর্কিটেকচার।" : 
                            selectedDetailMetric === "requests" ? "এজ ল্যাটেন্সি মূলত রিকোয়েস্ট ভ্যালিডেশন করে থাকে। সিডিএন গেটওয়েতে গতিসীমা সাধারণত ৮৫-১১৫ মিলি-সেকেন্ড।" :
                            selectedDetailMetric === "sessions" ? "মাল্টি-চ্যানেল পাইপলাইন গ্লোবালি এক সাথে অনেক গ্রাহকের সমন্বিত কাজ সক্রিয় রাখে। বর্তমানে প্রতিটি কন্টেইনারে সেশন সফলভাবে চলমান।" : 
                            selectedDetailMetric === "workspace" ? "ব্যবহারকারীর তৈরি প্রম্পট কপি এবং স্যান্ডবক্স কোড রান করার মোট সময়, ডাটা সাইজ ও অডিটিং মেট্রিকে এটি হিসাব করা হয়।" : "পদ্ধতিগতভাবে অর্জিত মাসিক আয়ের হিসাব। ক্রিয়েটরদের প্রসারমাণ সুযোগের প্রভাবে আপগ্রেড প্রবণতা অত্যন্ত ইতিবাচক।"
                  },
                  {
                    id: "factor-2",
                    titleEn: selectedDetailMetric === "token" ? "User Variable Context Inputs" : 
                             selectedDetailMetric === "requests" ? "Inbound Query Validation Nodes" :
                             selectedDetailMetric === "sessions" ? "Live Administrative Terminal Sockets" :
                             selectedDetailMetric === "workspace" ? "Vault Template Utilities" : "Interactive SaaS Upgrades Layer",
                    titleBn: selectedDetailMetric === "token" ? "গ্রাহকের কাস্টম টেক্সট ইনপুট" : 
                             selectedDetailMetric === "requests" ? "ইনকামিং কুয়েরি ভ্যালিডেশন ফিল্টার" :
                             selectedDetailMetric === "sessions" ? "সরাসরি এডমিন কানেকশন সকেট" : 
                             selectedDetailMetric === "workspace" ? "সংরক্ষিত টেমপ্লেট ব্যবহার হার" : "সরাসরি পেইড টিয়ার পরিবর্তন উইজেট",
                    previewEn: selectedDetailMetric === "token" ? "Measures actual prompt input lengths inputted by you." : 
                               selectedDetailMetric === "requests" ? "Inspects incoming payload syntax and sanitisation." :
                               selectedDetailMetric === "sessions" ? "Admin sockets established for platform security." :
                               selectedDetailMetric === "workspace" ? "Saves frequency of template loads and exports." : "Modify your subscription level inside this widget live.",
                    previewBn: selectedDetailMetric === "token" ? "গ্রাহক দ্বারা লিখিত ইনপুট টেক্সটের পরিমাপ।" : 
                               selectedDetailMetric === "requests" ? "ইনকামিং পেলোড সিনট্যাক্স এবং ফিল্টারিং তথ্য।" :
                               selectedDetailMetric === "sessions" ? "নিরাপত্তার উদ্দেশ্যে এডমিন সকেট প্রক্সি নেটওয়ার্ক।" : 
                               selectedDetailMetric === "workspace" ? "সংরক্ষিত ভল্ট টেমপ্লেট লোড ও এক্সপোর্টের পরিমাণ।" : "বর্তমান কন্ট্রোল উইজেটের মাধ্যমে সাবস্ক্রিপশন আপডেট করুন।",
                    descEn: selectedDetailMetric === "token" ? "Dynamic text variables injected by user queries are parsed by the tokenizer. This value varies strongly based on user input length." : 
                            selectedDetailMetric === "requests" ? "All incoming inputs are sanitized to guarantee private secure routing. Invalid syntaxes are automatically dropped with code 400." :
                            selectedDetailMetric === "sessions" ? "Secure administrative control connections are maintained to manage CPU health, logs exports, and node synchronization parameters." :
                            selectedDetailMetric === "workspace" ? "Calculates the dynamic engagement quotient of your product. High vault frequencies correspond to maximum professional usability." : "Simulate upgrade directly below: Click to switch levels, modify active credits, change rates, and sync to Cloud Firestore live.",
                    descBn: selectedDetailMetric === "token" ? "গ্রাহকের ইনপুট টেক্সট টোকেনাইজারে ভেঙে বিশ্লেষণ করা হয়। এটি সরাসরি ব্যবহারকারীর ইনপুটের আকারের উপর নির্ভর করে পরিবর্তিত হয়।" : 
                            selectedDetailMetric === "requests" ? "নিরাপদ রাউটিং নিশ্চিত করার জন্য সকল ইনপুট ডেটা স্যানিটাইজ করা হয়। অবৈধ ইনপুট এ কোড ৪০০ সহ ড্রপ করা হয়।" :
                            selectedDetailMetric === "sessions" ? "প্ল্যাটফর্মের প্রসেসর হেলথ, ডাটা এক্সপোর্ট এবং নোড সিঙ্ক পরিচালনার জন্য বিশেষ সুরক্ষিত এডমিন সকেট অ্যাক্টিভ থাকে।" : 
                            selectedDetailMetric === "workspace" ? "ব্যবহারকারীর ভল্ট টেমপ্লেটের উপযোগিতা গণনা করে। ঘন ঘন টেমপ্লেট লোড প্লাটফর্মের পেশাদার ব্যবহার বৃদ্ধি নির্ধারণ করে।" : "সরাসরি পেইড টায়ার আপগ্রেড করুন: গ্লোবাল সিঙ্ক পরিবর্তন এবং নতুন ক্রেডিট ক্রেডিট রেঞ্জ পর্যবেক্ষণ করতে নোড সুইচার চাপুন।"
                  }
                ].map((factor) => {
                  const isOpen = expandedCardId === factor.id;
                  return (
                    <div 
                      key={factor.id}
                      className="border border-gray-900 bg-black/40 rounded-2xl overflow-hidden transition-all duration-250 hover:border-gray-800 text-left"
                    >
                      <button
                        onClick={() => setExpandedCardId(isOpen ? null : factor.id)}
                        className="w-full p-4 flex items-center justify-between text-left font-mono focus:outline-none cursor-pointer"
                      >
                        <div>
                          <span className="text-[11px] font-bold text-white block">
                            {isEn ? factor.titleEn : factor.titleBn}
                          </span>
                          <span className="text-[9.5px] text-gray-500 block leading-normal mt-0.5">
                            {isEn ? factor.previewEn : factor.previewBn}
                          </span>
                        </div>
                        <span className="text-emerald-400 font-bold font-mono text-xs shrink-0 pl-2">
                          {isOpen ? "[-] CLOSE" : "[+] EXPAND"}
                        </span>
                      </button>
                      
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1.5 border-t border-gray-950 text-gray-450 text-[10.5px] font-mono leading-relaxed bg-black/50">
                          <p>{isEn ? factor.descEn : factor.descBn}</p>
                          
                          {/* Special interactive element inside factor-2 of revenue: Instant Upgrade widget! */}
                          {selectedDetailMetric === "revenue" && factor.id === "factor-2" && (
                            <div className="mt-4 pt-4 border-t border-gray-950 flex flex-col gap-3">
                              <span className="text-[9px] uppercase font-bold text-emerald-400">// Interactive SaaS Direct Tier Selector</span>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { tier: "Starter", limit: 15000, desc: "Starter Tier" },
                                  { tier: "Creator Pro", limit: 150000, desc: "Creator Pro" },
                                  { tier: "Enterprise", limit: 5000000, desc: "Elite Corporate" }
                                ].map((tSub) => (
                                  <button
                                    key={tSub.tier}
                                    onClick={async () => {
                                      setActiveTier(tSub.tier as any);
                                      setCreditLimit(tSub.limit);
                                      // Save to database live!
                                      if (auth.currentUser) {
                                        await setDoc(doc(db, "users", auth.currentUser.uid), {
                                          activeTier: tSub.tier,
                                          creditLimit: tSub.limit
                                        }, { merge: true });
                                        // log upgrade action
                                        const upgradeAct = {
                                          id: "act-up-" + Math.random().toString(36).substring(2, 9),
                                          type: "profile_update",
                                          descEn: `Subscriber context successfully upgraded to ${tSub.tier} tier live!`,
                                          descBn: `গ্রাহক স্তরের টিয়ার সফলভাবে ${tSub.tier}-এ আপগ্রেড করা হয়েছে!`,
                                          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " (" + new Date().toLocaleDateString([], { month: "short", day: "numeric" }) + ")"
                                        };
                                        setActivities(prev => [upgradeAct, ...prev]);
                                        setDoc(doc(db, "users", auth.currentUser.uid), {
                                          activities: [upgradeAct, ...activities]
                                        }, { merge: true }).catch(err => console.warn(err));
                                      }
                                    }}
                                    className={`p-2.5 rounded-xl border text-[9.5px] font-bold uppercase transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1 leading-none ${
                                      activeTier === tSub.tier
                                        ? "bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                                        : "bg-black/60 border-gray-950 text-gray-400 hover:text-white hover:border-gray-900"
                                    }`}
                                  >
                                    <span className="block font-black text-[11px]">{tSub.tier}</span>
                                    <span className="text-[7.5px] font-normal leading-none block text-gray-500">{(tSub.limit).toLocaleString()} Cr</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Close buttons */}
              <div className="flex justify-between items-center gap-4">
                <button
                  onClick={() => {
                    setSelectedDetailMetric(null);
                    setExpandedCardId(null);
                  }}
                  className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-mono uppercase font-black text-center cursor-pointer transition-colors"
                >
                  {isEn ? "Confirm and Return to Cockpit" : "নিশ্চিত করে প্যানেলে ফিরুন"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== SECURE ADMIN ACCESS PASSCODE DIALOG ==================== */}
      <AnimatePresence>
        {isAdminLoginModalOpen && (
          <div className="fixed inset-0 bg-black/95 z-[110] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0c15] border border-gray-900 rounded-2xl w-full max-w-sm p-6 text-left relative"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold font-mono tracking-widest text-cyan-400 flex items-center gap-1.5 uppercase">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Secure Node Auth</span>
                </h3>
                <button
                  onClick={() => {
                    setIsAdminLoginModalOpen(false);
                    setAdminAuthError("");
                    setAdminCodeInput("");
                  }}
                  className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[10.5px] font-mono text-gray-400 leading-relaxed mb-4">
                {isEn 
                  ? "Enter system passcode to unlock the secure admin node control console, live sessions monitor, and Priority GPU cluster telemetry."
                  : "নিরাপদ এডমিন প্যানেল, লাইভ গ্রাহক সেশন নোড এবং জিপিইউ ক্লাস্টার মনিটর আনলক করতে সিস্টেম ডিক্রিপশন পাসকোড লিখুন।"}
              </p>

              <div className="font-mono space-y-4">
                <div>
                  <span className="text-[8px] uppercase text-gray-500 tracking-wider block mb-1">Passcode (Hint: ADMIN2026)</span>
                  <input
                    type="password"
                    value={adminCodeInput}
                    onChange={(e) => setAdminCodeInput(e.target.value)}
                    placeholder="••••••••••••••"
                    className="w-full py-2 px-3 bg-black/60 border border-gray-905 rounded-lg text-xs tracking-widest outline-none text-white focus:border-cyan-500/60 font-black text-center"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (adminCodeInput === "ADMIN2026" || adminCodeInput === "PCS-ADMIN-2026") {
                          setIsAdminUnlocked(true);
                          setIsAdminLoginModalOpen(false);
                          setAdminAuthError("");
                        } else {
                          setAdminAuthError(isEn ? "Authentication failure: Gate code unrecognized." : "অথেনটিকেশন ব্যর্থ: পাসকোড সঠিক নয়।");
                        }
                      }
                    }}
                  />
                  {adminAuthError && (
                    <span className="text-[9.5px] text-rose-500 block leading-tight mt-1 bg-rose-500/5 p-1 rounded border border-rose-500/10 text-center">{adminAuthError}</span>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (adminCodeInput === "ADMIN2026" || adminCodeInput === "PCS-ADMIN-2026") {
                      setIsAdminUnlocked(true);
                      setIsAdminLoginModalOpen(false);
                      setAdminAuthError("");
                    } else {
                      setAdminAuthError(isEn ? "Authentication failure: Passcode unrecognized." : "অথেনটিকেশন ব্যর্থ: পাসকোড সঠিক নয়।");
                    }
                  }}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase text-[10.5px] tracking-wide rounded-lg cursor-pointer transition-colors text-center"
                >
                  {isEn ? "Decrypt and Enter Core" : "ডিক্রিপ্ট করে প্রবেশ করুন"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== CORE ADMIN OVERLAY DASHBOARD PANEL ==================== */}
      <AnimatePresence>
        {isAdminUnlocked && (
          <div className="fixed inset-0 bg-[#07080d]/95 z-[109] flex flex-col justify-between p-6 sm:p-8 overflow-y-auto text-left font-mono">
            <div>
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-900/60 mb-6">
                <div>
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                    <Shield className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <span className="text-[10px] tracking-widest uppercase">// SECURE CLUSTER ROOT TERMINAL NODE</span>
                  </div>
                  <h1 className="text-xl font-bold text-white uppercase tracking-widest">
                    {isEn ? "SYSTEMS OVERSEER CONSOLE" : "সিস্টেম সুপিরিয়র এডমিন ড্যাশবোর্ড"}
                  </h1>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[8.5px] font-bold animate-pulse">● SECURED GRID ACTIVE</span>
                  <button
                    onClick={() => setIsAdminUnlocked(false)}
                    className="p-1.5 rounded-lg bg-black/40 hover:bg-black border border-gray-900 text-gray-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Visual Node Health Bars */}
                <div className="bg-black/35 border border-gray-900 rounded-2xl p-5 relative overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-4 border-b border-gray-900 pb-2 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>Cluster Hardware Loads</span>
                  </span>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>PCS-NODE-01 (Dallas, Edge Node)</span>
                        <span className="text-emerald-400 font-bold">{cpuStatus.node1}% UTIL</span>
                      </div>
                      <div className="h-2 bg-gray-950 rounded-full overflow-hidden border border-gray-900 flex">
                        <div 
                          className="bg-emerald-500 h-full transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                          style={{ width: `${cpuStatus.node1}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>PCS-NODE-02 (Frankfurt, Base Node)</span>
                        <span className="text-emerald-400 font-bold">{cpuStatus.node2}% UTIL</span>
                      </div>
                      <div className="h-2 bg-gray-950 rounded-full overflow-hidden border border-gray-900 flex">
                        <div 
                          className="bg-emerald-400 h-full transition-all duration-300 shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                          style={{ width: `${cpuStatus.node2}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>PCS-NODE-03 (Singapore, Sync Cluster)</span>
                        <span className="text-cyan-400 font-bold">{cpuStatus.node3}% UTIL</span>
                      </div>
                      <div className="h-2 bg-gray-950 rounded-full overflow-hidden border border-gray-900 flex">
                        <div 
                          className="bg-cyan-500 h-full transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                          style={{ width: `${cpuStatus.node3}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-900/40 flex justify-between items-center text-[8.5px] text-gray-500">
                    <span>GPU Nodes Utilisation Rate: <span>A100 Cluster at 12%</span></span>
                    <span className="text-emerald-400 animate-pulse">● System Stable</span>
                  </div>
                </div>

                {/* Live Active Sessions monitor */}
                <div className="bg-black/35 border border-gray-900 rounded-2xl p-5 lg:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-4 border-b border-gray-900 pb-2 flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-cyan-400" />
                      <span>{isEn ? "Live Client Enterprise Sessions List" : "সক্রিয় গ্রাহক সেশন তালিকা"}</span>
                    </span>
                    <span className="text-cyan-400 animate-pulse">{onlineCount} Active Client Connections</span>
                  </span>

                  <div className="overflow-x-auto text-left">
                    <table className="w-full text-left text-[11px] font-mono leading-none">
                      <thead>
                        <tr className="text-gray-500 border-b border-gray-900/60 pb-2">
                          <th className="font-bold pb-2">Client User</th>
                          <th className="font-bold pb-2">Device & Engine</th>
                          <th className="font-bold pb-2">Longevity</th>
                          <th className="font-bold pb-2">Sub-Node</th>
                          <th className="font-bold pb-2 text-right">IP Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeSessions.map((sess) => (
                          <tr key={sess.id} className="text-gray-300 border-b border-gray-950 last:border-0 hover:bg-white/5 py-1.5 transition-colors">
                            <td className="py-2.5 font-bold truncate max-w-[140px] text-emerald-400">{sess.user}</td>
                            <td className="py-2.5 text-gray-400">{sess.device}</td>
                            <td className="py-2.5 text-gray-500">{sess.duration}</td>
                            <td className="py-2.5 text-cyan-400 font-bold">{sess.activeNode}</td>
                            <td className="py-2.5 text-right text-gray-450">{sess.ip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Action Operations Controller pane */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0c0e18] border border-cyan-900/30 rounded-2xl p-5 md:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest block mb-1.5">// OPERATIONAL NODE ACTIONS</span>
                  <p className="text-[11px] text-gray-400 mb-5 leading-relaxed">
                    {isEn 
                      ? "Control node state triggers directly below. Test and debug pipeline stability by dispatching simulated priority loads, and sync with Firestore database live."
                      : "সিস্টেম গেটওয়ে টেস্ট অ্যাকশন। নিচের কন্ট্রোলার দিয়ে সিমুলেটেড এপিআই রিকোয়েস্ট ইনজেক্ট করুন এবং গ্লোবাল গেটওয়ে ফাইল ইন্টিগ্রেশন পর্যবেক্ষণ করুন।"}
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={async () => {
                        const randomCost = Math.floor(Math.random() * 2500) + 1200;
                        const randomCredits = Math.max(creditsUsed - randomCost, 0);
                        const randomNextGen = generatedCount + 10;
                        
                        const endpoints = ["/api/v2/market-blaster", "/api/v2/visual-studio", "/api/v2/auth/verify"];
                        const injectedLogs = endpoints.map((ep, k) => ({
                          id: "gwy-inj-" + Math.random().toString(36).substring(2, 9),
                          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
                          endpoint: ep,
                          method: "POST",
                          latency: Math.floor(Math.random() * 40) + 18,
                          status: "SUCCESS",
                          payloadSize: "1,220 B",
                          tokensSpent: Math.floor(randomCost / 3)
                        }));

                        setApiLogs(prev => [...injectedLogs, ...prev].slice(0, 30));
                        setCreditsUsed(randomCredits);
                        setGeneratedCount(randomNextGen);

                        if (auth.currentUser) {
                          setDoc(doc(db, "users", auth.currentUser.uid), {
                            creditsUsed: randomCredits,
                            generatedPromptsCount: randomNextGen,
                            apiLogs: [...injectedLogs, ...apiLogs].slice(0, 30)
                          }, { merge: true }).catch(err => console.warn(err));
                        }

                        const customAct = {
                          id: "act-inj-" + Math.random().toString(36).substring(2, 9),
                          type: "profile_update",
                          descEn: "10x Simulated API traffic injection dispatched to Dallas & Singapore nodes.",
                          descBn: "১০টি সিমুলেটেড এপিআই ট্রাফিক সফলভাবে ডালাস এবং সিঙ্গাপুর ক্লাস্টারে ইনজেক্ট করা হয়েছে।",
                          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        };
                        setActivities(prev => [customAct, ...prev]);
                        if (auth.currentUser) {
                          setDoc(doc(db, "users", auth.currentUser.uid), {
                            activities: [customAct, ...activities]
                          }, { merge: true }).catch(err => console.warn(err));
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 shadow-lg"
                    >
                      <Zap className="w-4 h-4 text-black animate-pulse" />
                      <span>{isEn ? "Inject simulated multi-traffic" : "সিমুলেটেড ট্রাফিক ইনজেক্ট করুন"}</span>
                    </button>

                    <button
                      onClick={() => {
                        setCpuStatus({
                          node1: Math.floor(Math.random() * 15) + 80,
                          node2: Math.floor(Math.random() * 20) + 65,
                          node3: Math.floor(Math.random() * 10) + 75
                        });
                        const rId = Math.floor(Math.random() * 900) + 100;
                        const mockSessInput = {
                          id: "sess-" + rId,
                          user: `corp-partner-${rId}@nvidia.com`,
                          device: "Node Process Core (Docker)",
                          duration: "1m",
                          activeNode: "PCS-NODE-01",
                          ip: "159.203." + Math.floor(Math.random() * 254) + ".81"
                        };
                        setActiveSessions(prev => [mockSessInput, ...prev]);
                        setOnlineCount(prev => prev + 1);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-black hover:bg-black/90 border border-cyan-800 text-cyan-400 hover:text-cyan-300 text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>{isEn ? "Stress-test priority nodes" : "নোডগুলোর উপর স্ট্রেস টেস্ট"}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-black/35 border border-gray-900 rounded-2xl p-5 flex flex-col justify-between text-[11px] leading-relaxed">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-2 border-b border-gray-900/50 pb-1 flex items-center gap-1">
                      <FolderHeart className="w-4 h-4 text-cyan-400" />
                      <span>Grid Integrity Status</span>
                    </span>
                    <p className="text-gray-400 leading-normal font-sans text-left">
                      {isEn 
                        ? "Gateway security layers successfully auditing and sanitizing queries continuously. Zero anomalies registered across active SSL subnets."
                        : "গেটওয়ে নিরাপত্তা অ্যালগরিদম সফলভাবে ইনপুট অডিট বিশ্লেষণ করছে। সাবনেটে কোনো নেটওয়ার্ক অসঙ্গতি পরিলক্ষিত হয়নি।"}
                    </p>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-900 mt-4 flex items-center justify-between font-mono text-[9px] text-cyan-500 shrink-0">
                    <span>PCS-GRID-STATUS-CODE-200-OK</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-[9px] font-mono text-gray-600 mt-8 text-center pt-4 border-t border-gray-900/40">
              <span>PCS SECURED SERVER AUDITOR NODE HOSTED SEAMLESSLY AT CLOUD INSTANCE GATEWAY. CODENAME: PHENIX REGIONAL CLUSTERING SYSTEMS.</span>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating CTA Button Portal HUD */}
      {!isLeadCaptureModalOpen && (
        <div className="fixed bottom-6 right-6 z-[120] flex flex-col sm:flex-row items-end sm:items-center gap-2 font-mono">
          <button
            onClick={() => setIsLeadCaptureModalOpen(true)}
            className="px-4.5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 transition-all duration-300 shadow-[0_4px_30px_rgba(147,51,234,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] cursor-pointer hover:scale-105 active:scale-95 group border border-purple-500/30"
            id="floating-cta-premium"
          >
            <Sparkles className="w-4 h-4 text-white animate-spin shrink-0 group-hover:scale-125 transition-transform" />
            <span>{isEn ? "Get Premium Access" : "প্রিমিয়াম অ্যাক্সেস নিন"}</span>
          </button>

          <button
            onClick={() => setIsLeadCaptureModalOpen(true)}
            className="px-4 py-3 rounded-xl bg-black/95 hover:bg-gray-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 font-bold text-xs tracking-wide uppercase flex items-center gap-1.5 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)] cursor-pointer"
            id="floating-cta-sales"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{isEn ? "Contact Sales" : "সেলস কন্টাক্ট"}</span>
          </button>
        </div>
      )}

      {/* Persistent Enterprise Activity Toast Overlay */}
      <SaaSToastContainer />

    </div>
  );
}
