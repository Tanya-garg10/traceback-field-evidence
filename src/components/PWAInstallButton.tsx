import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Clock, Smartphone, Sparkles, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  useEffect(() => {
    if (!showComingSoonModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowComingSoonModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showComingSoonModal]);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowComingSoonModal(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E4620]/20 bg-white/80 px-3 py-2 text-xs font-medium text-[#1C241E] hover:bg-[#EBE6DC]/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        title="Offline Field App — Coming Soon"
      >
        <Smartphone className="w-3.5 h-3.5 text-[#1E4620]" />
        <span className="hidden sm:inline">Offline App</span>
      </button>

      {showComingSoonModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C241E]/50 backdrop-blur-xs p-4"
            onClick={() => setShowComingSoonModal(false)}
          >
            <div
              className="w-full max-w-md rounded-3xl bg-[#F7F5F0] border border-[#E2DDD2] p-6 sm:p-7 shadow-2xl text-[#1C241E] space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#1E4620] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono-tabular font-semibold uppercase tracking-wider text-[#1E4620]">
                      Coming Soon
                    </span>
                    <h3 className="text-xl font-semibold font-serif-display text-[#1C241E] leading-tight">
                      TraceBack Offline App
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowComingSoonModal(false)}
                  className="p-2 rounded-xl text-[#545E56] hover:text-[#1C241E] hover:bg-[#EBE6DC] transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-sm text-[#2C362E] leading-relaxed">
                <p>
                  Our dedicated standalone mobile & desktop app with pre-bundled local open-weight models (<strong>Gemma 3</strong>, <strong>Llama 3.2</strong> & <strong>Qwen 2.5</strong>) is launching very soon!
                </p>

                <div className="p-4 rounded-2xl bg-white border border-[#E2DDD2] space-y-1.5 text-xs text-[#545E56]">
                  <p className="font-semibold text-[#1E4620] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>What works right now in your browser:</span>
                  </p>
                  <p className="leading-relaxed">
                    You can already capture observations, test Offline Field Mode in the Field Capture tab, run local AI analysis, and save discoveries to your Field Journal.
                  </p>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowComingSoonModal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1E4620] text-white text-xs font-semibold hover:bg-[#163518] transition-colors cursor-pointer"
                >
                  Got It, Continue Exploring
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
