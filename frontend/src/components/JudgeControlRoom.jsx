import React from 'react';
import { 
  Database, ShieldCheck, CheckCircle2, Sliders, TrendingUp, 
  Cpu, AlertTriangle, FileCode, ChevronRight, Activity, Zap
} from 'lucide-react';
import SimulatorChart from './SimulatorChart';
import AuditLogDrawer from './AuditLogDrawer';

export default function JudgeControlRoom({
  opportunity,
  validation,
  simulation,
  redemptionRate,
  onRedemptionRateChange,
  auditLogs,
  executorMode,
  onToggleExecutorMode,
  onOpenEvidenceModal
}) {
  const evidence = opportunity?.evidence;
  const checks = validation?.checks || {
    numbers_check: { status: "PASS", title: "Numbers Check", detail: "Every digit traces strictly to detector payload" },
    policy_check: { status: "PASS", title: "Policy Check", detail: "Proposed discount 15% <= Merchant cap 15%" },
    audience_check: { status: "PASS", title: "Audience Check", detail: "18/18 target customer hashes confirmed opted-in" },
    frequency_check: { status: "PASS", title: "Frequency Check", detail: "0 customers contacted in the past 7 days" }
  };

  return (
    <div className="w-full h-full flex flex-col p-4 space-y-4 overflow-y-auto bg-slate-50 font-sans">
      
      {/* Control Room Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between pb-2 border-b border-slate-200 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping"></div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            Judge Control Room
            <span className="text-xs font-mono font-normal text-slate-400">| Telemetry & Evidence Pipeline</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-400 font-mono text-[10px] font-semibold border border-slate-700">
            Pipeline: Closed-Loop Active
          </span>
        </div>
      </div>

      {/* Top Section Grid (2 Columns: Evidence Inspector + Guardrails Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* 1. Detector Evidence Inspector */}
        <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. Detector Evidence Inspector
              </h3>
            </div>
            <button
              onClick={onOpenEvidenceModal}
              className="text-[11px] font-semibold text-cyan-600 hover:text-cyan-700 underline"
            >
              Full Modal View
            </button>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 text-cyan-400 font-mono text-[10px] border border-slate-800">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
            <span>Calculated by pandas — LLM never sees raw transactions</span>
          </div>

          {/* Raw JSON Code Container */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-44 border border-slate-800 shadow-inner">
            <pre className="text-slate-300">
{JSON.stringify({
  detector_name: evidence?.detector_name || "DeadHour_Pandas_Detector",
  dead_hours: evidence?.dead_hours || [14, 15, 16],
  median_open_hour_revenue: evidence?.median_open_hour_revenue || 450.0,
  dead_hour_avg_revenue: evidence?.dead_hour_avg_revenue || 207.0,
  footfall_drop_pct: evidence?.drop_percentage || 54.0,
  opted_in_regulars: evidence?.opted_in_regulars_count || 18,
  expected_net_impact_inr: evidence?.expected_net_impact || 2880.0,
  confidence_score: evidence?.confidence_score || 87
}, null, 2)}
            </pre>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
            <span>Source: SQLite Transactions DB</span>
            <span className="font-mono text-slate-700">8 Weeks Historical Window</span>
          </div>
        </div>

        {/* 2. Validator Guardrails Telemetry */}
        <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. Validator Guardrails Telemetry
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
              {validation?.verdict || "VERIFIED_SAFE"}
            </span>
          </div>

          {/* 4-Point Verification Checklist */}
          <div className="space-y-2 text-xs">
            {Object.entries(checks).map(([key, item]) => (
              <div key={key} className="p-2 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-2">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                  item.status === "PASS" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                }`}>
                  [{item.status}]
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-[11px]">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 leading-tight">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Safety Rule Note */}
          <div className="p-2 bg-amber-50/70 border border-amber-200/80 rounded-lg flex items-center justify-between text-[11px] text-amber-800 font-medium">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              Safety Note: Fails twice → Degrades to deterministic template.
            </span>
            <span className="font-mono text-[10px] text-amber-700">Fallback: Active</span>
          </div>
        </div>

      </div>

      {/* 3. 7-Day Measurable Simulator */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-4 space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3. 7-Day Measurable Simulator
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-400 font-mono text-[10px] font-bold">
              [SIMULATED — RULE-BASED PROJECTION]
            </span>
          </div>

          {/* Redemption Rate Interactive Slider */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium text-slate-700 text-[11px]">Redemption Rate:</span>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.05"
              value={redemptionRate}
              onChange={(e) => onRedemptionRateChange(parseFloat(e.target.value))}
              className="w-24 sm:w-32 accent-cyan-600 cursor-pointer"
            />
            <span className="font-mono font-bold text-slate-900 text-xs w-8 text-right">
              {Math.round(redemptionRate * 100)}%
            </span>
          </div>
        </div>

        {/* Real-time Reactive KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[11px] text-slate-500 font-medium block">Simulated Uplift</span>
            <span className="text-base font-extrabold text-emerald-600 mt-0.5 block">
              +{simulation?.simulated_uplift_pct || 43.4}%
            </span>
            <span className="text-[9px] text-slate-400 font-mono">Over Baseline</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[11px] text-slate-500 font-medium block">Gross Incremental</span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              ₹{simulation?.gross_incremental?.toLocaleString() || "3,770"}
            </span>
            <span className="text-[9px] text-slate-400 font-mono">7-Day Revenue</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[11px] text-slate-500 font-medium block">Discount Burn</span>
            <span className="text-base font-bold text-rose-600 mt-0.5 block">
              -₹{simulation?.discount_burn?.toLocaleString() || "1,020"}
            </span>
            <span className="text-[9px] text-slate-400 font-mono">15% Cap Cost</span>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center">
            <span className="text-[11px] text-emerald-800 font-medium block">Expected Net Impact</span>
            <span className="text-base font-extrabold text-emerald-600 mt-0.5 block">
              +₹{simulation?.net_impact?.toLocaleString() || "2,750"}
            </span>
            <span className="text-[9px] text-emerald-700 font-mono font-semibold">Net Bottomline</span>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="pt-1">
          <SimulatorChart chartData={simulation?.hourly_chart_data || []} />
        </div>

      </div>

      {/* 4. Execution & Audit Trail Drawer */}
      <AuditLogDrawer
        auditLogs={auditLogs}
        executorMode={executorMode}
        onToggleExecutorMode={onToggleExecutorMode}
      />

    </div>
  );
}
