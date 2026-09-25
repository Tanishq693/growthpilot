import React, { useState, useRef } from 'react';
import { 
  Zap, CheckCircle2, TrendingUp, Sliders, Volume2, Play, Pause, 
  Copy, Check, Sparkles, AlertCircle, Store, Flame, ArrowUpRight, ShieldCheck, ArrowDown, Send, MessageSquare
} from 'lucide-react';
import SimulatorChart from './SimulatorChart';
import CustomerDispatchModal from './CustomerDispatchModal';

export default function MerchantDashboard({
  briefing,
  opportunity,
  demoMode,
  isApproved,
  executionResult,
  onApprove,
  onDecline,
  redemptionRate,
  onRedemptionRateChange,
  simulation,
  onFastForward,
  onOpenJudgeDrawer
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showSimNotification, setShowSimNotification] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

  const simulatorRef = useRef(null);

  const toggleVoiceBriefing = () => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      if ('speechSynthesis' in window) {
        const text = briefing?.transcript_hi || "Namaste Rameshji. Kal ka collection ₹14,200 tha. Aaj ek high-confidence growth opportunity identify hua hai.";
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setIsPlayingAudio(false), 4000);
      }
    }
  };

  const handleCopyLink = () => {
    if (executionResult?.paytm_link) {
      navigator.clipboard.writeText(executionResult.paytm_link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleApproveAndOpenOutbox = async (source) => {
    await onApprove(source);
    setIsDispatchModalOpen(true);
  };

  const handleFastForwardClick = async () => {
    await onFastForward();
    setShowSimNotification(true);
    if (simulatorRef.current) {
      simulatorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => setShowSimNotification(false), 4000);
  };

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* 1. Merchant Header Banner */}
      <div className="neo-box p-4 bg-yellow-300 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 neo-box bg-cyan-400 flex items-center justify-center font-black text-xl">
            <Store className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Demo Cafe — Bandra</h2>
              <span className="neo-badge px-2 py-0.5 bg-emerald-400 text-slate-900 text-xs">
                Soundbox Active
              </span>
            </div>
            <p className="text-xs font-bold text-slate-800 mt-0.5">
              Yesterday's Collection: <span className="font-extrabold text-slate-900">₹14,200</span> • Soundbox #SB-8834
            </p>
          </div>
        </div>

        {/* Voice Briefing Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleVoiceBriefing}
            className="neo-btn bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 text-xs flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>{isPlayingAudio ? "Pause Audio" : "Listen Morning Update"}</span>
          </button>
        </div>
      </div>

      {/* Audio Wave Visualizer when playing */}
      {isPlayingAudio && (
        <div className="neo-box p-3 bg-cyan-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 italic">
            "{briefing?.transcript_hi || "Namaste Rameshji. Kal ka collection ₹14,200 tha. Aaj ek high-confidence growth opportunity identify hua hai."}"
          </span>
          <div className="flex items-center gap-1 h-6">
            <div className="w-1.5 bg-cyan-600 rounded-full animate-wave-1"></div>
            <div className="w-1.5 bg-cyan-500 rounded-full animate-wave-2"></div>
            <div className="w-1.5 bg-slate-900 rounded-full animate-wave-3"></div>
            <div className="w-1.5 bg-cyan-600 rounded-full animate-wave-4"></div>
          </div>
        </div>
      )}

      {/* 2. Main Opportunity & Execution Card */}
      {demoMode === "healthy_day" ? (
        /* Healthy Day View */
        <div className="neo-box p-8 bg-white text-center space-y-4">
          <div className="w-16 h-16 neo-box bg-emerald-300 flex items-center justify-center mx-auto text-slate-900">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">Normal Sales Day</h3>
          <p className="text-sm font-bold text-slate-600 max-w-md mx-auto">
            Your daily shop sales and customer visits are running fine. No discount offer needed today.
          </p>
          <span className="inline-block neo-badge px-4 py-1.5 bg-slate-100 text-slate-700 text-xs">
            No special offers recommended today
          </span>
        </div>
      ) : (
        /* Slow Hours Opportunity Card */
        <div className="neo-box p-6 bg-white space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-slate-900 pb-4">
            <div className="flex items-center gap-2">
              <span className="neo-badge px-3 py-1 bg-amber-400 text-slate-900 text-xs font-black flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-slate-900 fill-slate-900" />
                SLOW HOURS BOOST OPPORTUNITY
              </span>
              <span className="neo-badge px-2.5 py-1 bg-slate-100 text-slate-700 text-xs">
                2:00 PM – 5:00 PM (Weekdays)
              </span>
            </div>

            <button
              onClick={onOpenJudgeDrawer}
              className="text-xs font-extrabold text-cyan-600 hover:text-cyan-700 underline flex items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4" />
              View Technical Proof & Telemetry
            </button>
          </div>

          {!isApproved ? (
            /* PRE-APPROVAL ACTION VIEW */
            <div className="space-y-6">
              
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Customer visits drop by 54% between 2:00 PM – 5:00 PM on weekdays
                </h3>
                <p className="text-xs font-bold text-slate-600 mt-1">
                  Send an exclusive afternoon tea & snacks offer to <span className="text-slate-900 font-extrabold">18 regular customers</span> who visit your shop.
                </p>
              </div>

              {/* Simple Financial Breakdown Matrix */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="neo-box p-3 bg-slate-50 text-center">
                  <span className="text-xs font-bold text-slate-500 uppercase block">Extra Sales</span>
                  <span className="text-lg font-black text-slate-900 mt-0.5 block">+₹3,600</span>
                  <span className="text-[10px] font-bold text-slate-400">18 Regulars × Avg Spend</span>
                </div>

                <div className="neo-box p-3 bg-rose-50 text-center">
                  <span className="text-xs font-bold text-rose-700 uppercase block">Discount Given</span>
                  <span className="text-lg font-black text-rose-600 mt-0.5 block">-₹720</span>
                  <span className="text-[10px] font-bold text-rose-600">15% OFF Limit</span>
                </div>

                <div className="neo-box p-3 bg-emerald-300 text-center">
                  <span className="text-xs font-black text-slate-900 uppercase block">Net Extra Profit</span>
                  <span className="text-xl font-black text-slate-900 mt-0.5 block">+₹2,880</span>
                  <span className="text-[10px] font-black text-slate-900">Clear Profit Boost</span>
                </div>

                <div className="neo-box p-3 bg-cyan-100 text-center">
                  <span className="text-xs font-bold text-slate-700 uppercase block">Success Chance</span>
                  <span className="text-lg font-black text-slate-900 mt-0.5 block">High (87%)</span>
                  <span className="text-[10px] font-bold text-emerald-700">18 Regular Customers</span>
                </div>
              </div>

              {/* Customer SMS Copy */}
              <div className="neo-box-dark p-4 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-extrabold">
                  Sample Message Sent to Customers (SMS & WhatsApp)
                </span>
                <p className="text-sm font-bold italic text-slate-100">
                  "Chai & Snacks Special: Dopehar 2 se 5 baje paye 15% OFF! Fast checkout via Paytm."
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleApproveAndOpenOutbox("UI_BUTTON")}
                  className="neo-btn px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-900 text-sm font-black flex-1 min-w-[240px] flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  APPROVE & SEND OFFER TO CUSTOMERS (15% OFF)
                </button>

                <button
                  onClick={onDecline}
                  className="neo-btn px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold"
                >
                  Pass / Skip Today
                </button>
              </div>

            </div>
          ) : (
            /* POST-APPROVAL EXECUTED VIEW */
            <div className="space-y-6 animate-fade-in">
              
              <div className="neo-box p-4 bg-emerald-300 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-slate-900 shrink-0" />
                  <div>
                    <h4 className="font-black text-base text-slate-900">Offer Sent Successfully via Paytm!</h4>
                    <p className="text-xs font-bold text-slate-800">Status: 18 SMS & WhatsApp Messages Delivered</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDispatchModalOpen(true)}
                  className="neo-btn px-3.5 py-1.5 bg-slate-900 text-white text-xs font-black flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>View 18 Customer Dispatches (Outbox)</span>
                </button>
              </div>

              {/* Paytm Short Link Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="neo-box p-4 bg-slate-900 text-white space-y-2">
                  <span className="text-xs font-mono uppercase text-cyan-400 font-extrabold">Paytm Payment Offer Link</span>
                  <div className="flex items-center justify-between bg-slate-800 p-2.5 rounded border-2 border-slate-700">
                    <span className="font-mono font-black text-sm text-cyan-400">
                      {executionResult?.paytm_link || "https://paytm.me/pay?id=cp_dh_883"}
                    </span>
                    <button
                      onClick={handleCopyLink}
                      className="p-1.5 text-white hover:text-cyan-400 transition-colors"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 font-bold">
                    Sent to: <span className="text-white">18 Regular Customers</span> on SMS & WhatsApp.
                  </p>
                </div>

                {/* SVG QR Code Preview */}
                <div className="neo-box p-4 bg-white text-center flex flex-col items-center justify-center space-y-2">
                  <div 
                    dangerouslySetInnerHTML={{ __html: executionResult?.qr_code_svg || '' }} 
                  />
                  <span className="text-xs font-bold text-slate-700">Paytm Offer QR Code for Counter</span>
                </div>
              </div>

              {/* Fast Forward Button */}
              <div className="pt-2">
                <button
                  onClick={handleFastForwardClick}
                  className="neo-btn w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-black text-sm flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-slate-900" />
                  See 7-Day Sales & Profit Estimate
                  <ArrowDown className="w-4 h-4 text-slate-900 animate-bounce" />
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* CUSTOMER DISPATCH OUTBOX MODAL */}
      <CustomerDispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        executionResult={executionResult}
      />

      {/* Notification Banner when Fast Forward is clicked */}
      {showSimNotification && (
        <div className="neo-box p-4 bg-emerald-300 flex items-center justify-between animate-fade-in shadow-[6px_6px_0px_0px_#000]">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-slate-900" />
            <div>
              <h4 className="font-black text-sm text-slate-900">✨ 7-Day Profit Estimate Calculated!</h4>
              <p className="text-xs font-bold text-slate-800">
                Hourly sales chart updated below. Green bars show extra afternoon sales.
              </p>
            </div>
          </div>
          <span className="neo-badge px-3 py-1 bg-slate-900 text-white text-xs font-mono">
            +43.4% EXTRA SALES
          </span>
        </div>
      )}

      {/* 3. 7-Day Revenue & Growth Simulator Card */}
      <div id="simulator-section" ref={simulatorRef} className="neo-box p-6 bg-white space-y-5 scroll-mt-6">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-slate-900 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-600" />
              📈 7-Day Extra Profit Calculator
            </h3>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              Estimate extra earnings based on how many customers use the offer
            </p>
          </div>

          {/* Interactive Customer Usage Rate Slider */}
          <div className="neo-box px-3.5 py-1.5 bg-yellow-200 flex items-center gap-3">
            <Sliders className="w-4 h-4 text-slate-900" />
            <span className="text-xs font-black text-slate-900">Customer Usage Rate:</span>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.05"
              value={redemptionRate}
              onChange={(e) => onRedemptionRateChange(parseFloat(e.target.value))}
              className="w-28 sm:w-36 accent-slate-900 cursor-pointer"
            />
            <span className="neo-badge px-2 py-0.5 bg-slate-900 text-white font-mono text-xs">
              {Math.round(redemptionRate * 100)}%
            </span>
          </div>
        </div>

        {/* Simple Plain-English KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="neo-box p-3 bg-emerald-100 text-center">
            <span className="text-xs font-extrabold text-slate-700 uppercase block">Sales Growth</span>
            <span className="text-xl font-black text-emerald-700 mt-0.5 block">
              +{simulation?.simulated_uplift_pct || 43.4}%
            </span>
            <span className="text-[10px] font-bold text-slate-500">Afternoon Boost</span>
          </div>

          <div className="neo-box p-3 bg-white text-center">
            <span className="text-xs font-extrabold text-slate-600 uppercase block">Total Extra Sales</span>
            <span className="text-lg font-black text-slate-900 mt-0.5 block">
              ₹{simulation?.gross_incremental?.toLocaleString() || "3,770"}
            </span>
            <span className="text-[10px] font-bold text-slate-400">7-Day Sales Volume</span>
          </div>

          <div className="neo-box p-3 bg-rose-50 text-center">
            <span className="text-xs font-extrabold text-rose-700 uppercase block">Discount Given</span>
            <span className="text-lg font-black text-rose-600 mt-0.5 block">
              -₹{simulation?.discount_burn?.toLocaleString() || "1,020"}
            </span>
            <span className="text-[10px] font-bold text-rose-600">15% Offer Cost</span>
          </div>

          <div className="neo-box p-3 bg-emerald-300 text-center">
            <span className="text-xs font-black text-slate-900 uppercase block">Net Extra Profit</span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">
              +₹{simulation?.net_impact?.toLocaleString() || "2,750"}
            </span>
            <span className="text-[10px] font-black text-slate-900">Your Take-Home Profit</span>
          </div>
        </div>

        {/* Simulator Recharts Chart */}
        <SimulatorChart chartData={simulation?.hourly_chart_data || []} />

      </div>

    </div>
  );
}
