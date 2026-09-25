import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Send, MessageSquare, PhoneCall, Smartphone, ShieldCheck, Zap } from 'lucide-react';

export default function CustomerDispatchModal({ isOpen, onClose, executionResult }) {
  if (!isOpen || !executionResult) return null;

  const customers = executionResult.dispatched_customers || [];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 25;
        });
      }, 150);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in font-sans">
      
      {/* Modal Box */}
      <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[10px_10px_0px_0px_#000] max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b-4 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 neo-box bg-emerald-400 flex items-center justify-center text-slate-900 font-black">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base uppercase text-emerald-400 tracking-tight flex items-center gap-2">
                Live Paytm Customer Dispatch Outbox
                <span className="neo-badge px-2 py-0.5 bg-cyan-400 text-slate-900 text-[10px]">
                  18 Regulars Targeted
                </span>
              </h3>
              <p className="text-xs font-mono text-slate-300">
                Action ID: <span className="text-white font-bold">{executionResult.action_id}</span> • Executor: {executionResult.executor_type}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="neo-btn p-1.5 bg-rose-500 hover:bg-rose-400 text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker Bar */}
        <div className="p-4 bg-yellow-200 border-b-3 border-slate-900 space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-slate-900">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-slate-900" />
              {progress < 100 ? "Sending SMS & WhatsApp offers to 18 regular customers..." : "All 18 Offers Delivered Successfully!"}
            </span>
            <span className="neo-badge px-2 py-0.5 bg-slate-900 text-white font-mono">
              {progress}% SENT
            </span>
          </div>

          {/* Neo Progress Bar */}
          <div className="w-full h-3 bg-white neo-box p-0.5 overflow-hidden">
            <div 
              className="h-full bg-emerald-400 transition-all duration-300 rounded-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Scrollable Outbox Customer List Table */}
        <div className="p-4 overflow-y-auto space-y-4 max-h-[50vh]">
          
          <div className="flex items-center justify-between text-xs font-black text-slate-900 uppercase tracking-wider border-b-2 border-slate-900 pb-2">
            <span>Targeted Opted-In Customers ({customers.length})</span>
            <span className="text-emerald-700 font-mono">100% Marketing Consent Verified</span>
          </div>

          <div className="space-y-2.5">
            {customers.map((cust, idx) => (
              <div 
                key={idx}
                className="neo-box p-3 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div className="w-8 h-8 neo-box bg-cyan-100 flex items-center justify-center font-black text-slate-900 text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{cust.customer_name}</h4>
                    <p className="text-[11px] font-mono font-bold text-slate-500">{cust.phone_masked}</p>
                  </div>
                </div>

                {/* Message Snippet */}
                <div className="flex-1 min-w-[220px] bg-slate-900 text-slate-100 p-2 rounded border border-slate-800 text-[11px] font-mono">
                  <p className="truncate text-slate-200">{cust.message_text}</p>
                </div>

                {/* Status Badge */}
                <div className="text-right">
                  <span className="neo-badge px-2.5 py-1 bg-emerald-400 text-slate-900 text-[10px] font-black inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
                    DELIVERED ✓✓
                  </span>
                  <span className="block text-[9px] font-mono text-slate-400 mt-0.5">{cust.delivered_at.split(' ')[1]}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 text-white border-t-4 border-slate-900 flex justify-between items-center text-xs font-bold">
          <span className="text-cyan-400 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Paytm Gateway Queue Active • 18 SMS & WhatsApp Dispatches Complete
          </span>
          <button
            onClick={onClose}
            className="neo-btn px-4 py-1.5 bg-yellow-300 text-slate-900 text-xs font-black"
          >
            Close Outbox Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
