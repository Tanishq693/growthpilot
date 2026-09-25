import React, { useState } from 'react';
import { ShieldAlert, FileText, ChevronDown, ChevronUp, CheckCircle, Clock, Cpu } from 'lucide-react';

export default function AuditLogDrawer({ auditLogs, executorMode, onToggleExecutorMode }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white border border-slate-200 shadow-xs rounded-xl overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Execution & Audit Telemetry Log
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 text-slate-700 font-semibold">
            {auditLogs ? auditLogs.length : 0} Records
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Execution Mode Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1 text-xs">
            <span className="text-[11px] text-slate-500 font-medium pl-1 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-600" /> Mode:
            </span>
            <button
              onClick={() => onToggleExecutorMode("MockExecutor")}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                executorMode === "MockExecutor"
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              MockExecutor (Offline)
            </button>
            <button
              onClick={() => onToggleExecutorMode("PaytmStagingAPI")}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                executorMode === "PaytmStagingAPI"
                  ? "bg-cyan-600 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Paytm Staging API
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Table Body */}
      {isExpanded && (
        <div className="overflow-x-auto max-h-48 overflow-y-auto font-mono text-[11px]">
          {auditLogs && auditLogs.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 bg-slate-100">
                <tr>
                  <th className="py-2 px-3">Action ID</th>
                  <th className="py-2 px-3">Evidence Hash</th>
                  <th className="py-2 px-3">LLM Hash</th>
                  <th className="py-2 px-3">Validator Status</th>
                  <th className="py-2 px-3">Approval Time</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Executor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3 font-bold text-slate-900">{log.action_id}</td>
                    <td className="py-2 px-3 text-slate-500">{log.evidence_hash}</td>
                    <td className="py-2 px-3 text-slate-500">{log.llm_prompt_hash}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
                        log.validator_status === "VERIFIED_SAFE" 
                          ? "bg-emerald-100 text-emerald-800" 
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        <CheckCircle className="w-3 h-3" />
                        {log.validator_status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-500">
                      {log.approval_timestamp ? (
                        <span className="flex items-center gap-1 text-slate-800 font-sans">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          {log.approval_timestamp.split(" ")[1]}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Pending</span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-semibold">
                      <span className={log.execution_status.includes("EXECUTED") ? "text-emerald-600" : "text-amber-600"}>
                        {log.execution_status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-600 font-sans">{log.executor_used}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 text-center text-slate-400 font-sans text-xs">
              No execution records in telemetry log. Perform an approval to generate audit logs.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
