import React, { useState } from 'react';
import { 
  Volume2, VolumeX, Play, Pause, ShieldCheck, CheckCircle2, 
  Sparkles, ArrowRight, Mic, Copy, Check, Info, Flame, AlertCircle
} from 'lucide-react';

export default function MerchantPhoneView({
  briefing,
  opportunity,
  demoMode,
  onToggleDemoMode,
  onOpenEvidence,
  onApprove,
  onDecline,
  isApproved,
  executionResult,
  onFastForward
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  // Web Speech API Voice Briefing Player
  const toggleVoiceBriefing = () => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
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
        // Fallback timer if SpeechSynthesis not supported
        setTimeout(() => setIsPlayingAudio(false), 4000);
      }
    }
  };

  // Simulated Voice Trigger ("Haan, bhejo")
  const triggerVoiceApproval = () => {
    setIsListeningVoice(true);
    if ('speechSynthesis' in window) {
      const ack = new SpeechSynthesisUtterance("Ji Rameshji. Campaign Paytm via execute ho raha hai.");
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

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4 h-full">
      {/* Sleek Mobile Phone Frame */}
      <div className="w-full max-w-[390px] bg-slate-900 p-3 rounded-[36px] shadow-2xl border-4 border-slate-800 flex flex-col h-[calc(100vh-80px)] max-h-[820px] overflow-hidden relative">
        
        {/* Phone Notch / Speaker Bar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-20 flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
          <div className="w-8 h-1 rounded-full bg-slate-800"></div>
        </div>

        {/* Phone Inner Screen Container */}
        <div className="w-full h-full bg-slate-50 rounded-[28px] overflow-y-auto flex flex-col pt-7 pb-4 px-3 font-sans text-slate-800 relative select-none">
          
          {/* Phone Header Status Bar */}
          <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/80 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900 tracking-tight">Demo Cafe</span>
              {/* Soundbox Status Badge */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Soundbox Connected
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400 font-medium">09:30 AM</span>
          </div>

          {/* Morning Voice Briefing Card */}
          <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-3.5 mb-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
                  <Volume2 className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Morning Voice Briefing</h4>
              </div>

              {/* Play / Pause Voice Button */}
              <button
                onClick={toggleVoiceBriefing}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-medium hover:bg-slate-800 transition-all shadow-xs"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-3 h-3 text-cyan-400" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                    <span>Suno Briefing</span>
                  </>
                )}
              </button>
            </div>

            {/* Audio Waveform Animation when playing */}
            {isPlayingAudio && (
              <div className="flex items-center justify-center gap-1 h-6 py-1 bg-cyan-50/50 rounded-lg">
                <div className="w-1 bg-cyan-500 rounded-full animate-wave-1"></div>
                <div className="w-1 bg-cyan-600 rounded-full animate-wave-2"></div>
                <div className="w-1 bg-cyan-400 rounded-full animate-wave-3"></div>
                <div className="w-1 bg-cyan-600 rounded-full animate-wave-4"></div>
                <div className="w-1 bg-cyan-500 rounded-full animate-wave-5"></div>
              </div>
            )}

            {/* Voice Briefing Transcript */}
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 italic leading-relaxed">
              "{briefing?.transcript_hi || "Namaste Rameshji. Kal ka collection ₹14,200 tha. Aaj ek high-confidence growth opportunity identify hua hai."}"
            </div>
          </div>

          {/* Opportunity State Toggle Control (Demo Switcher) */}
          <div className="mb-3 bg-slate-200/70 p-1 rounded-xl flex items-center gap-1 text-[11px] font-medium">
            <button
              onClick={() => onToggleDemoMode("dead_hour")}
              className={`flex-1 py-1 px-2 rounded-lg text-center transition-all ${
                demoMode === "dead_hour"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              DeadHour Opportunity
            </button>
            <button
              onClick={() => onToggleDemoMode("healthy_day")}
              className={`flex-1 py-1 px-2 rounded-lg text-center transition-all ${
                demoMode === "healthy_day"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Healthy Day / Baseline
            </button>
          </div>

          {/* Opportunity Display Area */}
          {demoMode === "healthy_day" ? (
            /* Healthy Day Peaceful Card */
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 text-center my-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Optimal Store Baseline</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Store running at optimal baseline footfall. No customer fatigue or spam campaigns recommended today.
              </p>
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-mono font-medium">
                No high-confidence action today
              </span>
            </div>
          ) : (
            /* DeadHour Opportunity Card */
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 space-y-3 text-xs">
              
              {!isApproved ? (
                /* DECISION STAGE */
                <>
                  {/* Amber DeadHour Badge */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold text-[11px]">
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      Dead Hour Detected (2:00 PM – 5:00 PM)
                    </span>
                    <button 
                      onClick={onOpenEvidence}
                      className="text-[11px] font-semibold text-cyan-600 hover:underline flex items-center gap-0.5"
                    >
                      [Why? Evidence]
                    </button>
                  </div>

                  {/* Subhead Context */}
                  <p className="text-slate-600 font-medium leading-snug">
                    Footfall down <span className="font-bold text-slate-900">54%</span> across 6 of the last 8 Tuesdays.
                  </p>

                  {/* ROI Impact Matrix (Clean 2x2 Grid) */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium block">Potential Upside</span>
                      <span className="text-xs font-bold text-slate-900">+₹3,600</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium block">Max Discount Cost</span>
                      <span className="text-xs font-bold text-rose-600">-₹720 (15% Cap)</span>
                    </div>
                    <div className="p-2 bg-emerald-50/70 rounded-lg border border-emerald-100">
                      <span className="text-[10px] text-emerald-700 font-medium block">Expected Net Impact</span>
                      <span className="text-xs font-extrabold text-emerald-600">+₹2,880</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-medium block">Confidence Score</span>
                      <span className="text-xs font-bold text-cyan-600">87% (18 Regulars)</span>
                    </div>
                  </div>

                  {/* Proposed Campaign Copy Preview */}
                  <div className="p-2.5 bg-slate-900 text-slate-100 rounded-xl space-y-1 text-[11px] font-sans">
                    <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                      <span>Target: 18 Opted-in Regulars</span>
                      <span className="text-emerald-400 font-bold">15% OFF</span>
                    </div>
                    <p className="text-slate-200 italic font-medium">
                      "Chai & Snacks Special: Dopehar 2 se 5 baje paye 15% OFF! Fast checkout via Paytm."
                    </p>
                  </div>

                  {/* Action Controls */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onApprove("UI_BUTTON")}
                        className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve Action
                      </button>

                      {/* Voice Trigger Microphone Button */}
                      <button
                        onClick={triggerVoiceApproval}
                        disabled={isListeningVoice}
                        title="Voice Trigger: 'Haan, bhejo'"
                        className={`p-2.5 rounded-xl border border-emerald-300 transition-all flex items-center justify-center ${
                          isListeningVoice 
                            ? "bg-emerald-500 text-white animate-pulse" 
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={onDecline}
                      className="w-full py-1.5 px-3 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-[11px] font-medium transition-colors"
                    >
                      Decline / Pass Today
                    </button>
                  </div>
                </>
              ) : (
                /* POST-APPROVAL EXECUTION STATE */
                <div className="space-y-3.5 py-1 animate-fade-in">
                  
                  {/* Emerald Execution Badge */}
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-xs">Action Executed via Paytm Link Primitive</h4>
                      <p className="text-[10px] text-emerald-700 font-mono">Status: ACTIVE_DISPATCHED</p>
                    </div>
                  </div>

                  {/* Generated Link Box */}
                  <div className="p-2.5 bg-slate-900 text-white rounded-xl space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-mono block uppercase">Generated Paytm Short Link</span>
                    <div className="flex items-center justify-between bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {executionResult?.paytm_link || "paytm.me/pay?id=cp_dh_883"}
                      </span>
                      <button
                        onClick={handleCopyLink}
                        className="p-1 text-slate-300 hover:text-white transition-colors"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Clean SVG QR Code Preview */}
                  <div className="text-center space-y-1 py-1">
                    <div 
                      className="inline-block"
                      dangerouslySetInnerHTML={{ __html: executionResult?.qr_code_svg || '' }} 
                    />
                    <p className="text-[10px] text-slate-500 font-medium">Dynamic Paytm Instant QR Code</p>
                  </div>

                  {/* Audience Count Summary */}
                  <div className="p-2 bg-slate-100 rounded-xl text-center text-[11px] text-slate-700 font-medium">
                    <span className="font-bold text-slate-900">18 Opted-in Regulars</span> queued for SMS/WhatsApp dispatch
                  </div>

                  {/* Fast-Forward 7 Days Button */}
                  <button
                    onClick={onFastForward}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Fast-Forward 7 Days
                  </button>

                </div>
              )}

            </div>
          )}

          {/* Footer Architecture Note inside Phone */}
          <div className="mt-auto pt-3 text-center text-[10px] text-slate-400">
            GrowthPilot Mobile Primitive • Paytm Merchant OS
          </div>

        </div>
      </div>
    </div>
  );
}
