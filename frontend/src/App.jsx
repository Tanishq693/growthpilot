import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, Database, Store, Smartphone, ShieldCheck, Zap
} from 'lucide-react';
import MerchantDashboard from './components/MerchantDashboard';
import MobileSimSection from './components/MobileSimSection';
import JudgeTelemetryDrawer from './components/JudgeTelemetryDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'mobile'
  const [demoMode, setDemoMode] = useState('dead_hour'); // 'dead_hour' or 'healthy_day'
  const [briefing, setBriefing] = useState(null);
  const [opportunity, setOpportunity] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [redemptionRate, setRedemptionRate] = useState(0.25);
  const [simulation, setSimulation] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [executorMode, setExecutorMode] = useState('MockExecutor');
  const [isJudgeDrawerOpen, setIsJudgeDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [demoMode]);

  useEffect(() => {
    fetchSimulation(redemptionRate, demoMode);
  }, [redemptionRate, demoMode]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const briefingRes = await fetch('/api/briefing');
      if (briefingRes.ok) {
        const briefingData = await briefingRes.json();
        setBriefing(briefingData);
      }

      const oppRes = await fetch(`/api/opportunities?demo_mode=${demoMode}`);
      if (oppRes.ok) {
        const oppData = await oppRes.json();
        setOpportunity(oppData);
      }

      await fetchSimulation(redemptionRate, demoMode);
      await fetchAuditLogs();
    } catch (err) {
      console.error("Failed to fetch engine data from backend:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSimulation = async (rate, mode = demoMode) => {
    try {
      const res = await fetch('/api/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redemption_rate: rate, demo_mode: mode })
      });
      if (res.ok) {
        const simData = await res.json();
        setSimulation(simData);
      }
    } catch (err) {
      console.error("Failed to run simulation:", err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/audit');
      if (res.ok) {
        const logs = await res.json();
        setAuditLogs(logs);
      }
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    }
  };

  const handleApproveAction = async (approvalSource = "UI_BUTTON") => {
    if (!opportunity?.proposal?.action_id) return;
    try {
      const res = await fetch(`/api/execution/approve?executor_mode=${executorMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_id: opportunity.proposal.action_id,
          merchant_id: "m_bandra_01",
          approval_source: approvalSource
        })
      });

      if (res.ok) {
        const execData = await res.json();
        setExecutionResult(execData);
        setIsApproved(true);
        await fetchAuditLogs();
      }
    } catch (err) {
      console.error("Execution approval failed:", err);
    }
  };

  const handleDeclineAction = () => {
    setIsApproved(false);
    setExecutionResult(null);
  };

  const handleResetDemo = async () => {
    try {
      await fetch('/api/audit/reset', { method: 'POST' });
      setIsApproved(false);
      setExecutionResult(null);
      setDemoMode('dead_hour');
      await fetchInitialData();
    } catch (err) {
      console.error("Failed to reset demo:", err);
    }
  };

  const handleFastForward = async () => {
    await fetchSimulation(redemptionRate, demoMode);
  };

  return (
    <div className="w-screen h-screen bg-slate-100 flex flex-col font-sans overflow-hidden">
      
      {/* GLOBAL TOP HEADER */}
      <header className="h-[64px] bg-slate-900 border-b-4 border-slate-900 px-4 flex items-center justify-between shrink-0 select-none z-30 shadow-[0px_4px_0px_0px_#000]">
        
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="neo-box px-3 py-1 bg-yellow-300 flex items-center gap-2">
            <Zap className="w-5 h-5 text-slate-900 fill-slate-900" />
            <h1 className="text-base font-black text-slate-900 tracking-tight">
              GrowthPilot
            </h1>
          </div>

          {/* Navigation View Tabs */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border-2 border-slate-700">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1 text-xs font-black rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? "bg-cyan-400 text-slate-900 shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Merchant Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('mobile')}
              className={`px-3 py-1 text-xs font-black rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'mobile'
                  ? "bg-cyan-400 text-slate-900 shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile APK View</span>
            </button>
          </div>
        </div>

        {/* Center Architecture Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>Demo DB: <strong className="text-yellow-300">SQLite</strong></span>
          <span className="text-slate-600">|</span>
          <span>Prod: <strong className="text-emerald-400">Paytm Event Stream</strong></span>
        </div>

        {/* Right Actions: Judge Telemetry Drawer Button & Reset */}
        <div className="flex items-center gap-2.5">
          
          <button
            onClick={() => setIsJudgeDrawerOpen(true)}
            className="neo-btn px-3.5 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-900 text-xs font-black flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-slate-900" />
            <span>🔬 JUDGE TELEMETRY & PROOF</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="neo-btn px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-900 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Reset Demo</span>
          </button>
        </div>

      </header>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 h-[calc(100vh-64px)] overflow-hidden bg-[#F4F4F0]">
        {activeTab === 'dashboard' ? (
          <MerchantDashboard
            briefing={briefing}
            opportunity={opportunity}
            demoMode={demoMode}
            isApproved={isApproved}
            executionResult={executionResult}
            onApprove={handleApproveAction}
            onDecline={handleDeclineAction}
            redemptionRate={redemptionRate}
            onRedemptionRateChange={setRedemptionRate}
            simulation={simulation}
            onFastForward={handleFastForward}
            onOpenJudgeDrawer={() => setIsJudgeDrawerOpen(true)}
          />
        ) : (
          <MobileSimSection
            briefing={briefing}
            opportunity={opportunity}
            demoMode={demoMode}
            onToggleDemoMode={setDemoMode}
            isApproved={isApproved}
            executionResult={executionResult}
            onApprove={handleApproveAction}
            onDecline={handleDeclineAction}
            simulation={simulation}
            onFastForward={handleFastForward}
            onOpenJudgeDrawer={() => setIsJudgeDrawerOpen(true)}
          />
        )}
      </main>

      {/* JUDGE TELEMETRY SLIDE-OVER DRAWER */}
      <JudgeTelemetryDrawer
        isOpen={isJudgeDrawerOpen}
        onClose={() => setIsJudgeDrawerOpen(false)}
        opportunity={opportunity}
        validation={opportunity?.validation}
        demoMode={demoMode}
        onToggleDemoMode={setDemoMode}
        auditLogs={auditLogs}
        executorMode={executorMode}
        onToggleExecutorMode={setExecutorMode}
      />

    </div>
  );
}
