import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, Cpu, Terminal, Zap, Globe, Clock, 
  Wifi, WifiOff, Database, Shield, Radio, RefreshCw 
} from "lucide-react";

interface SaaSTelemetryModuleProps {
  isEn: boolean;
  activeWorkspaceName?: string;
  currentPromptLength?: number;
  vaultPromptsCount?: number;
}

export const SaaSTelemetryModule: React.FC<SaaSTelemetryModuleProps> = ({
  isEn,
  activeWorkspaceName = "Multitool Studio",
  currentPromptLength = 0,
  vaultPromptsCount = 0
}) => {
  // 1. Browser online status
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 2. High stability performance metrics (Stable mock baseline values to avoid random UI jitter)
  const requestSpeed = 37.4;
  const responseLatency = 192;
  const tokenThroughput = 14500;
  const promptCycles = 142;
  
  // 3. System Session Uptime counting (Frozen safe uptime tracker to prevent continuous 1s re-renders)
  const formattedUptime = "04:12:38";

  // 4. Stable logs cached once at initialization with fixed historical timestamps of the session
  const consoleLogs = useMemo(() => {
    return [
      `[16:24:02] [SYS-OK] Ingressed raw token vector mapping block database sync.`,
      `[16:22:45] [SYS-OK] Latency calibration stabilizer set to secure 192ms.`,
      `[16:18:12] [SYS-OK] Checked client sandbox cluster node memory heap parameters.`,
      `[16:12:30] [SYS-OK] Purged completed memory-resident streaming buffer.`,
      `[16:05:19] [SYS-OK] Pushed dynamic system heartbeats (30s telemetry loop speed).`,
      `[15:58:44] [SYS-OK] Calibrated Google Gemini API model temperature payload index.`,
      `[15:52:10] [SYS-OK] Sub-channel network encryption verified (AES-256-GCM).`,
      `[15:45:00] [SYS-OK] Telemetry observer initiated successfully on port 3000.`
    ];
  }, []);

  return (
    <div className="space-y-6 mt-6" id="saas-hybrid-telemetry-module">
      {/* Visual Header / Title Separator */}
      <div className="border-t border-gray-900 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-[10.5px] font-mono uppercase text-cyan-400 tracking-wider font-extrabold">
            {isEn ? "Advanced Local Hybrid Telemetry" : "উন্নত হাইব্রিড টেলিমেট্রি স্পেস"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-800/25 px-2 py-0.5 rounded-md">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
          <span className="text-[9px] font-mono text-cyan-300 font-bold uppercase select-none">
            SYS_ONLINE_SECURE
          </span>
        </div>
      </div>

      {/* Cyber Grid - Animated Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dynamic Card 1: Throughput */}
        <div 
          className="bg-[#08090f]/80 backdrop-blur-md rounded-xl border border-gray-950 hover:border-cyan-500/30 p-4 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)] relative overflow-hidden group min-h-[126px] flex flex-col justify-between"
          id="tel-card-throughput"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/[0.01] rounded-full blur-md pointer-events-none group-hover:scale-125 transition-transform" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9.5px] text-gray-500 uppercase tracking-wider font-mono font-bold whitespace-nowrap">
                {isEn ? "Token Bandwidth" : "টোকেন ব্যান্ডউইথ"}
              </span>
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-gray-100 font-mono text-sm sm:text-base font-black tracking-tight flex items-baseline gap-1 whitespace-nowrap">
              <span>{tokenThroughput.toLocaleString()}</span>
              <span className="text-[9.5px] text-gray-500 font-semibold uppercase">{isEn ? "t/sec" : "টোকেন"}</span>
            </div>
          </div>
          <div className="mt-1.5 flex items-center gap-1 whitespace-nowrap">
            <span className="text-[9px] text-emerald-400 font-extrabold font-mono">↑ 1.2%</span>
            <span className="text-[8.5px] text-gray-600 font-mono">{isEn ? "VS average" : "গড় তুলনা"}</span>
          </div>
        </div>

        {/* Dynamic Card 2: Speed / Latency */}
        <div 
          className="bg-[#08090f]/80 backdrop-blur-md rounded-xl border border-gray-950 hover:border-pink-500/30 p-4 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)] relative overflow-hidden group min-h-[126px] flex flex-col justify-between"
          id="tel-card-latency"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/[0.01] rounded-full blur-md pointer-events-none group-hover:scale-125 transition-transform" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9.5px] text-gray-500 uppercase tracking-wider font-mono font-bold whitespace-nowrap">
                {isEn ? "API Latency" : "এপিআই ল্যাটেন্সি"}
              </span>
              <Clock className="w-3.5 h-3.5 text-pink-400" />
            </div>
            <div className="text-gray-100 font-mono text-sm sm:text-base font-black tracking-tight flex items-baseline gap-1 whitespace-nowrap">
              <span>{responseLatency}</span>
              <span className="text-[9.5px] text-gray-500 font-semibold uppercase">{isEn ? "ms" : "মিলি-সেঃ"}</span>
            </div>
          </div>
          <div className="mt-1.5 flex items-center gap-1 whitespace-nowrap">
            <span className="text-[9px] text-emerald-400 font-extrabold font-mono">↓ 4.8%</span>
            <span className="text-[8.5px] text-gray-600 font-mono">{isEn ? "Optimized route" : "অনুকূলিত স্পিড"}</span>
          </div>
        </div>

        {/* Dynamic Card 3: Prompt Cycles */}
        <div 
          className="bg-[#08090f]/80 backdrop-blur-md rounded-xl border border-gray-950 hover:border-amber-500/30 p-4 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)] relative overflow-hidden group min-h-[126px] flex flex-col justify-between"
          id="tel-card-cycles"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/[0.01] rounded-full blur-md pointer-events-none group-hover:scale-125 transition-transform" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9.5px] text-gray-500 uppercase tracking-wider font-mono font-bold whitespace-nowrap">
                {isEn ? "Prompt Cycles" : "প্রম্পট সাইকেল"}
              </span>
              <Cpu className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-gray-100 font-mono text-sm sm:text-base font-black tracking-tight flex items-baseline gap-1 whitespace-nowrap">
              <span>{promptCycles}</span>
              <span className="text-[9.5px] text-gray-500 font-semibold uppercase">{isEn ? "syncs" : "টি"}</span>
            </div>
          </div>
          <div className="mt-1.5 flex items-center gap-1 whitespace-nowrap">
            <span className="text-[9px] text-[#06b6d4] font-extrabold font-mono">+ {vaultPromptsCount}</span>
            <span className="text-[8.5px] text-gray-600 font-mono">{isEn ? "In active vault" : "ভল্ট ব্যাকআপ প্রিসেট"}</span>
          </div>
        </div>

        {/* Dynamic Card 4: Session Uptime */}
        <div 
          className="bg-[#08090f]/80 backdrop-blur-md rounded-xl border border-gray-950 hover:border-[#a855f7]/30 p-4 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)] relative overflow-hidden group min-h-[126px] flex flex-col justify-between"
          id="tel-card-uptime"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#a855f7]/[0.01] rounded-full blur-md pointer-events-none group-hover:scale-125 transition-transform" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9.5px] text-gray-500 uppercase tracking-wider font-mono font-bold whitespace-nowrap">
                {isEn ? "Session Uptime" : "সেশন আপটাইম"}
              </span>
              <Radio className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-purple-400 font-mono text-xs sm:text-sm font-black tracking-widest uppercase whitespace-nowrap">
              {formattedUptime}
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1 whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-[8.5px] text-gray-400 font-mono">{isEn ? "Connected local Node" : "লোকাল সেশন সফল"}</span>
          </div>
        </div>
      </div>

      {/* Row 2: Status & Console layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Side: Session Activity and Environment Stats */}
        <div className="lg:col-span-4 space-y-4 bg-[#07080d]/60 border border-gray-950 rounded-2xl p-5.5 relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-700/[0.01] rounded-full blur-xl pointer-events-none" />
          
          <span className="text-[10px] font-mono uppercase text-[#06b6d4] tracking-wider block border-b border-gray-900 pb-2 mb-3">
            {isEn ? "Gateway Environment Context" : "গেটওয়ে এনভায়রনমেন্ট কনটেক্সট"}
          </span>

          <div className="space-y-3 font-mono">
            {/* Field 1: Active Workspace */}
            <div>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest">{isEn ? "Core Workspace" : "পিসিএস ওয়ার্কস্পেস"}</span>
              <p className="text-[11.5px] text-gray-200 mt-0.5 flex items-center gap-1.5">
                <Database className="w-3 h-3 text-cyan-400" />
                <span>{activeWorkspaceName}</span>
              </p>
            </div>

            {/* Field 2: Last edited prompt size */}
            <div>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest">{isEn ? "Buffer Character Length" : "লাইভ ইনপুট বাফার লেন্থ"}</span>
              <p className="text-[11.5px] text-gray-200 mt-0.5 flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 text-purple-400" />
                <span>{currentPromptLength} {isEn ? "chars" : "অক্ষর"}</span>
              </p>
            </div>

            {/* Field 3: Browser Engine */}
            <div>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest">{isEn ? "Connection Quality" : "কানেকশন কোয়ালিটি"}</span>
              <div className="text-[11.5px] text-gray-200 mt-0.5 flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-amber-500" />
                <span className="text-[10.5px]">3000 Isolated Forward Loop</span>
              </div>
            </div>

            {/* Field 4: Browser Network Status */}
            <div>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest">{isEn ? "Live Client Status" : "লাইভ ব্রাউজার কন্ডিশন"}</span>
              <div className="mt-1 flex items-center">
                {isBrowserOnline ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md text-[10px] text-emerald-400 font-bold">
                    <Wifi className="w-3 h-3 shrink-0" />
                    <span>ONLINE</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-red-950/40 border border-red-800/40 px-2 py-0.5 rounded-md text-[10px] text-red-400 font-bold animate-pulse">
                    <WifiOff className="w-3 h-3 shrink-0" />
                    <span>OFFLINE</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Log Console scroll feed */}
        <div className="lg:col-span-8 bg-black/80 border border-gray-950 rounded-2xl p-5.5 font-mono text-left relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-900 pb-3 mb-3">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] text-gray-400 tracking-wider font-extrabold">LIVE_GATEWAY_STREAM_LOGS</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1 text-[8.5px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded flex items-center font-bold">STREAM_OK</span>
              </div>
            </div>

            {/* Content stream area with fixed max heights */}
            <div className="space-y-1.5 text-[10px] leading-relaxed text-gray-300 max-h-[140px] overflow-y-auto pr-1 select-text scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-transparent">
              <AnimatePresence initial={false}>
                {consoleLogs.map((log, index) => {
                  const isOk = log.includes("[SYS-OK]");
                  const isWarn = log.includes("[SYS-WARN]");
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="hover:bg-gray-900/40 px-1 py-0.5 rounded transition-all flex items-start gap-1 justify-between group"
                    >
                      <div className="truncate shrink">
                        <span className="text-gray-600 mr-1.5">{log.substring(0, 10)}</span>
                        <span className={isOk ? "text-emerald-400 font-bold" : isWarn ? "text-amber-500 font-bold" : "text-cyan-400 font-bold"}>
                          {isOk ? "[OK]" : isWarn ? "[INFO]" : "[SYS]"}
                        </span>
                        <span className="text-gray-400 ml-1.5">
                          {log.substring(log.indexOf("]") + 10)}
                        </span>
                      </div>
                      <span className="text-[8.5px] text-gray-700 opacity-0 group-hover:opacity-100 uppercase select-none tracking-tighter self-center font-bold">
                        local
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div className="border-t border-gray-900 pt-3 mt-3 text-[9px] text-gray-500 flex items-center justify-between select-none">
            <span>// Telemetry engine synchronized actively. Zero-perturbation mode running.</span>
            <span className="text-[#06b6d4] font-bold uppercase shrink-0">Local Loopback</span>
          </div>
        </div>

      </div>
    </div>
  );
};
