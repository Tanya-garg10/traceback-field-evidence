import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileCheck2,
  Printer,
  X,
} from 'lucide-react';
import { FieldExploration } from '../types/traceback';

interface EvidencePassportModalProps {
  exploration: FieldExploration;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidencePassportModal: React.FC<EvidencePassportModalProps> = ({
  exploration,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || typeof document === 'undefined') return null;

  const { aiAnalysis, evidenceTrace } = exploration;

  const verificationStatus = !evidenceTrace
    ? 'Pending Online Trace (Saved in IndexedDB)'
    : evidenceTrace.confidence.isWeakOrInsufficient
    ? 'Insufficient Evidence — Unverified'
    : evidenceTrace.contradiction.detected
    ? 'Corroborated with Habitat / Provenance Conflict'
    : 'Multi-Source Corroborated';

  const buildMarkdownReport = () => {
    const lines = [
      `# TRACEBACK EVIDENCE PASSPORT — ${exploration.passportId || exploration.id}`,
      `Subject: ${aiAnalysis.possibleIdentification} (${aiAnalysis.scientificOrFormalName})`,
      `Verification Status: ${verificationStatus}`,
      `Observed Date: ${exploration.observedDate} · Location: ${exploration.location}`,
      `Screen-Free Score: ${exploration.screenFreeMinutes}m manual outdoor time · ${exploration.screenTimeMinutes}m measured app interaction`,
      ``,
      `## 1. Original Field Observation`,
      `"${exploration.observationText}"`,
      ``,
      `## 2. Local Open-Weight AI Hypothesis (${aiAnalysis.modelUsed})`,
      `- Hypothesis: ${aiAnalysis.possibleIdentification} (${aiAnalysis.confidence}% initial confidence)`,
      `- Key Traits: ${aiAnalysis.characteristics.join('; ')}`,
      `- Disclaimer: ${aiAnalysis.hypothesisDisclaimer}`,
      ``,
    ];

    if (evidenceTrace) {
      lines.push(
        `## 3. Evidence Quality Meter & Trace Confidence (${evidenceTrace.confidence.overallTraceConfidence}%)`,
        `- Source Quality: ${evidenceTrace.confidence.sourceQuality}% (${evidenceTrace.confidence.sourceQualityExplanation})`,
        `- Evidence Relevance: ${evidenceTrace.confidence.evidenceRelevance}%`,
        `- Independent Agreement: ${evidenceTrace.confidence.sourceAgreement}%`,
        `- Limitations: ${evidenceTrace.confidence.limitations.join(' | ')}`,
        ``
      );

      if (evidenceTrace.contradiction.detected) {
        lines.push(
          `## 4. Evidence Conflict Detector (${evidenceTrace.contradiction.disagreementTopic})`,
          `- ${evidenceTrace.contradiction.sourceAName} (${evidenceTrace.contradiction.sourceAUrl}): "${evidenceTrace.contradiction.sourceAClaim}"`,
          `- ${evidenceTrace.contradiction.sourceBName} (${evidenceTrace.contradiction.sourceBUrl}): "${evidenceTrace.contradiction.sourceBClaim}"`,
          `- Unresolved Uncertainty: ${evidenceTrace.contradiction.unresolvedUncertainty}`,
          ``
        );
      }

      lines.push(`## 5. Verifiable Sources & Claim Evolution`);
      for (const s of evidenceTrace.sources) {
        lines.push(`- ${s.sourceName} (${s.date}) [${s.relevanceScore}% match]: ${s.title} — ${s.url}`);
      }
    }

    return lines.join('\n');
  };

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(buildMarkdownReport());
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // clipboard fallback
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(exploration, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traceback-passport-${exploration.passportId || exploration.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C241E]/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#F7F5F0] border border-[#E2DDD2] p-6 sm:p-8 shadow-2xl text-[#1C241E] space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Passport Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D5CFC2] pb-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-[#1E4620]">
              <span>EVIDENCE PASSPORT</span>
              <span aria-hidden="true">·</span>
              <span>ID: {exploration.passportId || 'TB-2026-FIELD'}</span>
              <span aria-hidden="true">·</span>
              <span>{exploration.observedDate}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-display text-[#1C241E]">
              {aiAnalysis.possibleIdentification}{' '}
              <span className="text-base italic font-normal text-[#545E56]">
                ({aiAnalysis.scientificOrFormalName})
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D5CFC2] text-xs font-semibold text-[#1C241E] hover:bg-[#EBE6DC] transition-colors cursor-pointer whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#1E4620]" />
                  <span>Copied Report</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#1E4620]" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D5CFC2] text-xs font-semibold text-[#1C241E] hover:bg-[#EBE6DC] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-[#1E4620]" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E4620] text-white text-xs font-semibold hover:bg-[#163518] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Passport</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#545E56] hover:text-[#1C241E] hover:bg-[#EBE6DC] transition-colors cursor-pointer"
              aria-label="Close passport"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Verification Status Bar */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2DDD2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[#1E4620] shrink-0" />
            <span>
              Verification Status: <strong className="text-[#1C241E]">{verificationStatus}</strong>
            </span>
          </div>
          <div className="font-mono-tabular text-[#545E56]">
            Screen-Free Ratio: <strong className="text-[#1E4620]">{exploration.screenFreeMinutes}m outdoor</strong> (manual) vs.{' '}
            <strong>{exploration.screenTimeMinutes}m app interaction</strong> (measured)
          </div>
        </div>

        {/* Original Observation + AI Hypothesis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 bg-white rounded-2xl border border-[#E2DDD2] overflow-hidden">
            <div className="aspect-4/3 w-full bg-[#EBE6DC]">
              <img
                src={exploration.imageUrl}
                alt={exploration.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 space-y-2">
              <p className="text-xs text-[#545E56]">
                {exploration.category} · {exploration.location}
              </p>
              <p className="text-xs italic text-[#1C241E] leading-relaxed">
                “{exploration.observationText}”
              </p>
            </div>
          </div>

          <div className="md:col-span-7 bg-white rounded-2xl border border-[#E2DDD2] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EBE6DC] pb-3">
              <div>
                <p className="text-xs text-[#6B746C]">Local Open-Weight AI Hypothesis</p>
                <p className="text-sm font-semibold text-[#1C241E]">{aiAnalysis.modelUsed}</p>
              </div>
              <span className="text-xl font-mono-tabular font-semibold text-[#1E4620]">
                {aiAnalysis.confidence}% hypothesis
              </span>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-[#545E56]">Observed Diagnostic Traits:</p>
              <ul className="space-y-1 text-xs text-[#2C362E]">
                {aiAnalysis.characteristics.map((c, idx) => (
                  <li key={idx}>• {c}</li>
                ))}
              </ul>
            </div>

            {evidenceTrace && (
              <div className="pt-3 border-t border-[#EBE6DC] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F7F5F0]">
                  <p className="text-[11px] text-[#6B746C]">Trace Score</p>
                  <p className="font-mono-tabular font-semibold text-[#1E4620] text-sm">
                    {evidenceTrace.confidence.overallTraceConfidence}%
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7F5F0]">
                  <p className="text-[11px] text-[#6B746C]">Source Quality</p>
                  <p className="font-mono-tabular font-semibold text-[#1C241E] text-sm">
                    {evidenceTrace.confidence.sourceQuality}%
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7F5F0]">
                  <p className="text-[11px] text-[#6B746C]">Relevance</p>
                  <p className="font-mono-tabular font-semibold text-[#1C241E] text-sm">
                    {evidenceTrace.confidence.evidenceRelevance}%
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7F5F0]">
                  <p className="text-[11px] text-[#6B746C]">Agreement</p>
                  <p className="font-mono-tabular font-semibold text-[#1C241E] text-sm">
                    {evidenceTrace.confidence.sourceAgreement}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Supporting & Contradicting Claims */}
        {evidenceTrace && (
          <div className="space-y-4">
            {evidenceTrace.contradiction.detected && (
              <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] space-y-2 text-xs">
                <div className="flex items-center gap-2 font-semibold text-[#92400E]">
                  <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                  <span>
                    Contradictory Evidence Flagged: {evidenceTrace.contradiction.disagreementTopic}
                  </span>
                </div>
                <p className="text-[#78350F]">
                  • <strong>{evidenceTrace.contradiction.sourceAName}:</strong> “
                  {evidenceTrace.contradiction.sourceAClaim}” (
                  <a
                    href={evidenceTrace.contradiction.sourceAUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Source Link
                  </a>
                  )
                </p>
                <p className="text-[#78350F]">
                  • <strong>{evidenceTrace.contradiction.sourceBName}:</strong> “
                  {evidenceTrace.contradiction.sourceBClaim}” (
                  <a
                    href={evidenceTrace.contradiction.sourceBUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Source Link
                  </a>
                  )
                </p>
                <p className="text-[#92400E] pt-1">
                  <strong>Unresolved Uncertainty:</strong>{' '}
                  {evidenceTrace.contradiction.unresolvedUncertainty}
                </p>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-[#E2DDD2] p-5 space-y-3">
              <h3 className="text-sm font-serif-display font-semibold text-[#1C241E]">
                Cited Evidence Sources ({evidenceTrace.sources.length})
              </h3>
              {evidenceTrace.sources.length === 0 ? (
                <p className="text-xs text-[#991B1B]">
                  Not enough evidence found. No corroborating sources available.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {evidenceTrace.sources.map((src) => (
                    <div
                      key={src.id}
                      className="p-3 rounded-xl bg-[#F7F5F0] border border-[#E2DDD2] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5 pr-2">
                        <p className="font-semibold text-[#1C241E]">
                          {src.sourceName} · <span className="font-normal text-[#545E56]">{src.date}</span>
                        </p>
                        <p className="text-[#2C362E] line-clamp-1">“{src.excerpt}”</p>
                      </div>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#1E4620] font-semibold hover:underline shrink-0"
                      >
                        <span>{src.domain}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
