import React, { useState } from 'react';
import { 
  Volume2, Play, Pause, CheckCircle2, Flame, Copy, Check, 
  Mic, Sparkles, Smartphone, ShieldCheck, TrendingUp, ChevronDown, ChevronUp
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function MobileSimSection({
  briefing,
  opportunity,
  demoMode,
  onToggleDemoMode,
  isApproved,
  executionResult,
  onApprove,
  onDecline,
  simulation,
  onFastForward,
  onOpenJudgeDrawer
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [showMobileChart, setShowMobileChart] = useState(false);

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

  const triggerVoiceApproval = () => {
    setIsListeningVoice(true);
    if ('speechSynthesis' in window) {
      const ack = new SpeechSynthesisUtterance("Ji Rameshji. Offer Paytm par execute ho raha hai.");
      ack.lang = 'hi-IN';
      window.speechSynthesis.speak(ack);
    }
    setTimeout(() => {
      setIsListeningVoice(false);
      onApprove("VOICE_TRIGGER");
    }, 1200);
  };

  const handleCopyLink = () => {
    if (executionResult?.paytm_link) {
      navigator.clipboard.writeText(executionResult.paytm_link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleMobileFastForward = async () => {
    await onFastForward();
    setShowMobileChart(true);
  };

  const chartData = simulation?.hourly_chart_data || [];

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center bg-slate-100">
      
      <div className="text-center mb-3 space-y-1">
        <span className="neo-badge px-3 py-1 bg-cyan-400 text-slate-900 text-xs font-black inline-flex items-center gap-1.5">
          <Smartphone className="w-4 h-4" />
          PAYTM MERCHANT APP (SLIM BEZEL PHONE SIMULATOR)
        </span>
        <p className="text-xs font-bold text-slate-600">
          Simulates how the merchant sees growth offers & 7-day estimates on their phone
        </p>
      </div>

      {/* Razor-Thin Bezel Mobile Frame */}
      <div className="w-full max-w-[370px] bg-slate-900 p-1.5 rounded-[44px] border-2 border-slate-900 shadow-[6px_6px_0px_0px_#000] relative">
        
        {/* Sleek Minimal Notch */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-3.5 bg-slate-950 rounded-full z-20 flex items-center justify-center gap-1.5 border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-slate-800"></div>
          <div className="w-6 h-1 rounded-full bg-slate-800"></div>
        </div>

        {/* Screen inside thin bezel */}
        <div className="w-full bg-white rounded-[38px] overflow-y-auto pt-7 pb-4 px-3.5 space-y-3 font-sans text-slate-900 min-h-[580px] max-h-[720px] relative border border-slate-900">
          
          {/* Header Status Bar */}
          <div className="flex items-center justify-between pb-2 border-b-2 border-slate-900">
            <div>
              <h4 className="font-black text-xs">Demo Cafe</h4>
              <span className="text-[9px] font-bold text-emerald-600">● Soundbox Connected</span>
            </div>
            <span className="font-mono text-[10px] font-bold text-slate-500">09:30 AM</span>
          </div>

          {/* Voice Briefing Card */}
          <div className="neo-box p-3 bg-yellow-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-slate-900" />
                <h5 className="font-black text-xs">Morning Voice Update</h5>
              </div>
              <button
                onClick={toggleVoiceBriefing}
                className="neo-btn px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold"
              >
                {isPlayingAudio ? "Pause" : "Listen Update"}
              </button>
            </div>
            <p className="text-[11px] font-bold italic text-slate-800 leading-snug">
              "{briefing?.transcript_hi || "Namaste Rameshji. Kal ka collection ₹14,200 tha. Aaj ek high-confidence growth opportunity identify hua hai."}"
            </p>
          </div>

          {/* Opportunity View */}
          {demoMode === "healthy_day" ? (
            <div className="neo-box p-4 text-center bg-emerald-100 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-slate-900 mx-auto" />
              <h5 className="font-black text-xs">Normal Sales Day</h5>
              <p className="text-[10px] font-bold text-slate-700">Store running fine. No offer needed today.</p>
            </div>
          ) : (
            <div className="neo-box p-3 bg-white space-y-3">
              
              {!isApproved ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="neo-badge px-2 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-black">
                      ⚡ SLOW HOURS DETECTED
                    </span>
                    <button onClick={onOpenJudgeDrawer} className="text-[10px] font-bold text-cyan-600 underline">
                      [Proof]
                    </button>
                  </div>

                  <p className="text-xs font-black leading-snug">
                    Customer visits drop by half (2 PM – 5 PM).
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold text-center">
                    <div className="neo-box p-1.5 bg-slate-50">
                      <span>Extra Sales</span>
                      <p className="font-black text-slate-900 text-xs">+₹3,600</p>
                    </div>
                    <div className="neo-box p-1.5 bg-emerald-200">
                      <span>Net Profit</span>
                      <p className="font-black text-slate-900 text-xs">+₹2,880</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => onApprove("UI_BUTTON")}
                      className="neo-btn flex-1 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-900 text-xs font-black"
                    >
                      SEND OFFER NOW
                    </button>
                    <button
                      onClick={triggerVoiceApproval}
                      disabled={isListeningVoice}
                      className={`neo-btn p-2 text-slate-900 ${isListeningVoice ? "bg-emerald-500 animate-pulse" : "bg-yellow-300"}`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2 text-center">
                  <div className="neo-box p-2 bg-emerald-300">
                    <h5 className="font-black text-xs text-slate-900">PAYTM OFFER SENT!</h5>
                    <p className="font-mono text-[9px] font-bold">18 Regular Customers Queued</p>
                  </div>

                  <div className="neo-box p-2 bg-slate-900 text-white font-mono text-[10px]">
                    <p className="text-cyan-400 font-black">{executionResult?.paytm_link || "paytm.me/pay?id=cp_dh_883"}</p>
                  </div>

                  <div className="inline-block" dangerouslySetInnerHTML={{ __html: executionResult?.qr_code_svg || '' }} />

                  {/* 7-Day Estimate Toggle Button */}
                  <button
                    onClick={handleMobileFastForward}
                    className="neo-btn w-full py-2 bg-cyan-400 text-slate-900 font-black text-xs flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>See 7-Day Profit Estimate</span>
                    {showMobileChart ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

            </div>
          )}

          {/* CONCISE MOBILE 7-DAY PROFIT ESTIMATE CARD & CHART */}
          {(showMobileChart || isApproved) && (
            <div className="neo-box p-3 bg-slate-50 space-y-2.5 animate-fade-in border-2 border-slate-900">
              
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
                  7-Day Profit Estimate
                </span>
                <span className="neo-badge px-1.5 py-0.5 bg-emerald-400 text-slate-900 text-[9px] font-extrabold">
                  +{simulation?.simulated_uplift_pct || 43.4}% Growth
                </span>
              </div>

              {/* Concise 2x2 Grid with the same 4 things */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold text-center">
                <div className="neo-box p-1.5 bg-emerald-100">
                  <span className="text-slate-600 block text-[9px]">Sales Growth</span>
                  <span className="font-black text-emerald-800 text-xs">
                    +{simulation?.simulated_uplift_pct || 43.4}%
                  </span>
                </div>

                <div className="neo-box p-1.5 bg-white">
                  <span className="text-slate-600 block text-[9px]">Total Extra Sales</span>
                  <span className="font-black text-slate-900 text-xs">
                    ₹{simulation?.gross_incremental?.toLocaleString() || "3,770"}
                  </span>
                </div>

                <div className="neo-box p-1.5 bg-rose-50">
                  <span className="text-rose-700 block text-[9px]">Discount Given</span>
                  <span className="font-black text-rose-600 text-xs">
                    -₹{simulation?.discount_burn?.toLocaleString() || "1,020"}
                  </span>
                </div>

                <div className="neo-box p-1.5 bg-emerald-300">
                  <span className="text-slate-900 block text-[9px]">Net Extra Profit</span>
                  <span className="font-black text-slate-900 text-xs">
                    +₹{simulation?.net_impact?.toLocaleString() || "2,750"}
                  </span>
                </div>
              </div>

              {/* Concise Mobile Recharts Bar Chart */}
              <div className="w-full h-32 neo-box p-1 bg-white">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <XAxis dataKey="hour_label" tick={{ fontSize: 8, fill: '#0F172A', fontWeight: 'bold' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 8, fill: '#0F172A' }} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                    <Bar dataKey="baseline_revenue" fill="#94A3B8" radius={[2, 2, 0, 0]} barSize={6} />
                    <Bar dataKey="simulated_revenue" radius={[2, 2, 0, 0]} barSize={6}>
                      {chartData.map((entry, index) => (
                        <Cell key={`m-cell-${index}`} fill={entry.is_dead_hour ? '#10B981' : '#00BAF2'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          )}

          <div className="text-center text-[9px] font-mono font-bold text-slate-400 pt-1">
            Paytm Merchant App • Mobile Primitive
          </div>

        </div>
      </div>

    </div>
  );
}
