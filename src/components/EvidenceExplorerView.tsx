import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  BookOpen,
  CalendarClock,
  Compass,
  ExternalLink,
  FileCheck2,
  HelpCircle,
  MessageSquareText,
  RefreshCw,
  Send,
  ShieldAlert,
  WifiOff,
} from 'lucide-react';
import { answerEvidenceQuestion } from '../lib/evidence/processor';
import { EvidenceAnswer, FieldExploration } from '../types/traceback';
import { EvidencePassportModal } from './EvidencePassportModal';

export type LoadingStage =
  | null
  | 'Analyzing your observation…'
  | 'Finding evidence…'
  | 'Comparing sources…'
  | 'Building your trace…';

interface EvidenceExplorerViewProps {
  exploration: FieldExploration;
  loadingStage: LoadingStage;
  isOnline: boolean;
  measuredSessionSeconds: number;
  activeSimulationMode: 'standard' | 'contradiction' | 'insufficient';
  onRetraceWithMode: (mode: 'standard' | 'contradiction' | 'insufficient') => void;
  onSyncOfflineExploration: () => void;
  onOpenJournal: () => void;
  onStartNewCapture: () => void;
}

const SUGGESTED_QUESTIONS = [
  {
    label: 'What supports this identification? (Is identification ko support kya karta hai?)',
    query: 'What supports this identification?',
  },
  {
    label: 'Which source contradicts this? (Kaunsa source isse contradict karta hai?)',
    query: 'Which source contradicts this?',
  },
  {
    label: 'What else should I observe? (Mujhe aur kya observe karna chahiye?)',
    query: 'What else should I observe in the field?',
  },
  {
    label: 'When is the earliest discoverable mention?',
    query: 'What is the earliest discoverable mention in the timeline?',
  },
];

export const EvidenceExplorerView: React.FC<EvidenceExplorerViewProps> = ({
  exploration,
  loadingStage,
  isOnline,
  measuredSessionSeconds,
  activeSimulationMode,
  onRetraceWithMode,
  onSyncOfflineExploration,
  onOpenJournal,
  onStartNewCapture,
}) => {
  const { aiAnalysis, evidenceTrace } = exploration;

  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [timelineMode, setTimelineMode] = useState<'claim_evolution' | 'process'>(
    'claim_evolution'
  );
  const [customQuestion, setCustomQuestion] = useState('');
  const [activeAnswer, setActiveAnswer] = useState<EvidenceAnswer | null>(() =>
    answerEvidenceQuestion('What supports this identification?', exploration)
  );

  // Keep default answer in sync when exploration changes
  React.useEffect(() => {
    setActiveAnswer(
      answerEvidenceQuestion('What supports this identification?', exploration)
    );
  }, [exploration]);

  const handleAskQuestion = (q: string) => {
    if (!q.trim()) return;
    const ans = answerEvidenceQuestion(q.trim(), exploration);
    setActiveAnswer(ans);
  };

  const handleCustomQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    handleAskQuestion(customQuestion);
    setCustomQuestion('');
  };

  if (loadingStage) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#1E4620]/10 border border-[#1E4620]/20 flex items-center justify-center mx-auto">
          <RefreshCw className="w-7 h-7 text-[#1E4620] animate-spin" />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-mono-tabular text-[#1E4620]">
            OPEN-WEIGHT FIELD PIPELINE ACTIVE
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif-display text-[#1C241E]">
            {loadingStage}
          </h2>
          <p className="text-sm text-[#545E56] max-w-md mx-auto">
            Extracting visual characteristics with {aiAnalysis.modelUsed} and cross-examining independent web sources via SerpApi.
          </p>
        </div>

        <div className="max-w-md mx-auto grid grid-cols-4 gap-2 pt-4">
          {[
            'Analyzing your observation…',
            'Finding evidence…',
            'Comparing sources…',
            'Building your trace…',
          ].map((stepLabel, idx) => {
            const stages = [
              'Analyzing your observation…',
              'Finding evidence…',
              'Comparing sources…',
              'Building your trace…',
            ];
            const currentIdx = stages.indexOf(loadingStage);
            const completed = idx <= currentIdx;
            return (
              <div key={stepLabel} className="space-y-1.5">
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    completed ? 'bg-[#1E4620]' : 'bg-[#E2DDD2]'
                  }`}
                />
                <p className="text-[11px] text-[#6B746C] truncate">Step {idx + 1}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const measuredInteractionLabel =
    measuredSessionSeconds >= 60
      ? `${Math.floor(measuredSessionSeconds / 60)}m ${measuredSessionSeconds % 60}s`
      : `${measuredSessionSeconds}s`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-10">
      {/* Top Progress, Evidence Passport Trigger & Scenario Switcher */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white rounded-2xl border border-[#E2DDD2] p-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#545E56]">
          <span className="font-semibold text-[#1E4620]">1. Capture ✓</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-[#1E4620]">2. Local AI Analysis ✓</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-[#1E4620]">
            3. Evidence Trace {evidenceTrace ? '✓' : '(Queued in IndexedDB)'}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-[#1E4620]">4. Discover ✓</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Interactive Evidence Scenario Switcher */}
          <div className="flex flex-wrap items-center gap-1 bg-[#F7F5F0] p-1 rounded-xl border border-[#E2DDD2]">
            <span className="text-[11px] text-[#6B746C] px-2 font-medium">
              Scenario:
            </span>
            <button
              type="button"
              onClick={() => onRetraceWithMode('standard')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeSimulationMode === 'standard'
                  ? 'bg-white text-[#1C241E] shadow-xs font-semibold'
                  : 'text-[#545E56] hover:text-[#1C241E]'
              }`}
            >
              Standard Trace
            </button>
            <button
              type="button"
              onClick={() => onRetraceWithMode('contradiction')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeSimulationMode === 'contradiction'
                  ? 'bg-white text-[#9A3412] shadow-xs font-semibold'
                  : 'text-[#545E56] hover:text-[#1C241E]'
              }`}
            >
              ⚠️ Conflict Detector
            </button>
            <button
              type="button"
              onClick={() => onRetraceWithMode('insufficient')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeSimulationMode === 'insufficient'
                  ? 'bg-white text-[#991B1B] shadow-xs font-semibold'
                  : 'text-[#545E56] hover:text-[#1C241E]'
              }`}
            >
              Weak / No Evidence
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsPassportOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E4620] text-white text-xs font-semibold hover:bg-[#163518] transition-colors cursor-pointer whitespace-nowrap shadow-xs"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Evidence Passport</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Observation + Local Open-Weight AI Hypothesis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E2DDD2] overflow-hidden flex flex-col justify-between">
          <div>
            <div className="aspect-4/3 w-full bg-[#EBE6DC] relative overflow-hidden">
              <img
                src={exploration.imageUrl}
                alt={exploration.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#545E56]">
                <span>{exploration.category}</span>
                <span aria-hidden="true">·</span>
                <span>{exploration.location}</span>
                <span aria-hidden="true">·</span>
                <span>{exploration.observedDate}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">{exploration.passportId || 'TB-2026'}</span>
              </div>
              <h2 className="text-xl font-serif-display text-[#1C241E]">
                Field Observation Record
              </h2>
              <p className="text-sm text-[#2C362E] leading-relaxed italic bg-[#F7F5F0] p-4 rounded-2xl border border-[#E2DDD2]">
                “{exploration.observationText}”
              </p>
            </div>
          </div>

          {/* Screen-Free Score: Distinguishing Manual Outdoor Time vs. Measured App Time */}
          <div className="px-6 py-4 bg-[#1E4620]/6 border-t border-[#E2DDD2] space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#1E4620]">
                🌿 {exploration.screenFreeMinutes}m outdoor exploration (manual log)
              </p>
              <span className="text-xs font-mono-tabular font-semibold text-[#1E4620]">
                Screen-Free Score
              </span>
            </div>
            <p className="text-xs text-[#545E56] font-mono-tabular">
              Measured app interaction: <strong>{measuredInteractionLabel}</strong> this session ({exploration.screenTimeMinutes}m recorded on capture)
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EBE6DC] pb-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#545E56]">
                <span className="font-semibold text-[#1E4620]">LOCAL AI ANALYSIS</span>
                <span aria-hidden="true">·</span>
                <span>{aiAnalysis.modelUsed}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {aiAnalysis.engineSource === 'ollama_local_daemon'
                    ? '🟢 Local Ollama Daemon'
                    : '🟢 On-Device Browser Engine'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPassportOpen(true)}
                className="text-xs font-semibold text-[#1E4620] hover:underline cursor-pointer"
              >
                Share Passport Report →
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <p className="text-xs text-[#6B746C]">Possible identification (AI Hypothesis):</p>
                <h1 className="text-2xl sm:text-3xl font-serif-display text-[#1C241E] mt-0.5">
                  {aiAnalysis.possibleIdentification}
                </h1>
                <p className="text-xs italic text-[#545E56] mt-0.5">
                  {aiAnalysis.scientificOrFormalName}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-3xl font-mono-tabular font-semibold text-[#1E4620]">
                  {aiAnalysis.confidence}%
                </span>
                <p className="text-[11px] text-[#6B746C]">Initial Model Confidence</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-[#545E56] uppercase tracking-wider">
                Key Extracted Characteristics
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {aiAnalysis.characteristics.map((trait, index) => (
                  <li
                    key={index}
                    className="p-3 rounded-xl bg-[#F7F5F0] border border-[#E2DDD2] text-xs text-[#1C241E] leading-relaxed"
                  >
                    {trait}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-[#545E56] uppercase tracking-wider">
                Generated Search Queries for SerpApi Discovery
              </h3>
              <div className="space-y-1.5">
                {aiAnalysis.searchQueries.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#F7F5F0] border border-[#E2DDD2] text-xs font-mono-tabular text-[#2C362E]"
                  >
                    <span className="truncate">“{q}”</span>
                    <span className="text-[11px] text-[#6B746C] shrink-0 ml-2">Query #{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#B45309]" />
            <div>
              <strong className="font-semibold">AI Hypothesis — Not Guaranteed Truth:</strong>{' '}
              {aiAnalysis.hypothesisDisclaimer}
            </div>
          </div>
        </div>
      </div>

      {/* Offline Queue Pending State */}
      {!evidenceTrace && (
        <div className="bg-white rounded-3xl border border-[#E2DDD2] p-8 text-center space-y-4">
          <WifiOff className="w-8 h-8 text-[#B45309] mx-auto" />
          <h3 className="text-xl font-serif-display text-[#1C241E]">
            Saved in IndexedDB · Queued for Online SerpApi Evidence Trace
          </h3>
          <p className="text-sm text-[#545E56] max-w-lg mx-auto">
            Your photo, field notes, and local open-weight AI hypothesis ({aiAnalysis.possibleIdentification} — {aiAnalysis.confidence}%) are persisted locally in IndexedDB. Online SerpApi evidence search is queued until internet connectivity returns.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onSyncOfflineExploration}
              disabled={!isOnline}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isOnline
                  ? 'bg-[#1E4620] text-white hover:bg-[#163518]'
                  : 'bg-[#EBE6DC] text-[#8A928B] cursor-not-allowed'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>
                {isOnline
                  ? 'Internet Connected — Run Queued SerpApi Evidence Search Now'
                  : 'Offline Mode Active — Reconnect to Process Evidence Queue'}
              </span>
            </button>
          </div>
        </div>
      )}

      {evidenceTrace && (
        <>
          {/* UPGRADED FEATURE 2: EVIDENCE CONFLICT DETECTOR */}
          {evidenceTrace.contradiction.detected && (
            <div className="bg-[#FFFBEB] rounded-3xl border border-[#F59E0B]/40 p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F59E0B]/20 pb-3.5">
                <div>
                  <span className="text-[11px] font-mono-tabular font-semibold uppercase tracking-wider text-[#B45309]">
                    EVIDENCE CONFLICT DETECTOR · SOURCES DISAGREE
                  </span>
                  <h3 className="text-lg font-serif-display font-semibold text-[#92400E] flex items-center gap-2 mt-0.5">
                    <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0" />
                    <span>Point of Disagreement: {evidenceTrace.contradiction.disagreementTopic}</span>
                  </h3>
                </div>
                <span className="text-xs font-mono-tabular text-[#92400E] shrink-0">
                  ⚠️ Cross-Source Discrepancy
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#FDE68A] flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-[#92400E]">
                      Source A · {evidenceTrace.contradiction.sourceAName}
                    </p>
                    <p className="text-sm text-[#1C241E] italic leading-relaxed">
                      “{evidenceTrace.contradiction.sourceAClaim}”
                    </p>
                  </div>
                  {evidenceTrace.contradiction.sourceAUrl && (
                    <a
                      href={evidenceTrace.contradiction.sourceAUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#92400E] hover:underline self-start"
                    >
                      <span>Verify Source A Statement</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#FDE68A] flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-[#92400E]">
                      Source B · {evidenceTrace.contradiction.sourceBName}
                    </p>
                    <p className="text-sm text-[#1C241E] italic leading-relaxed">
                      “{evidenceTrace.contradiction.sourceBClaim}”
                    </p>
                  </div>
                  {evidenceTrace.contradiction.sourceBUrl && (
                    <a
                      href={evidenceTrace.contradiction.sourceBUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#92400E] hover:underline self-start"
                    >
                      <span>Verify Source B Statement</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FEF3C7]/70 border border-[#FDE68A] space-y-1">
                  <p className="text-xs font-semibold text-[#78350F]">What this means</p>
                  <p className="text-xs text-[#78350F] leading-relaxed">
                    “{evidenceTrace.contradiction.whatThisMeans}”
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FEF3C7]/70 border border-[#FDE68A] space-y-1">
                  <p className="text-xs font-semibold text-[#78350F]">
                    Unresolved Uncertainty & Required Field Evidence
                  </p>
                  <p className="text-xs text-[#78350F] leading-relaxed">
                    {evidenceTrace.contradiction.unresolvedUncertainty}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* UPGRADED FEATURE 5 & 4: EVIDENCE QUALITY METER + CLAIM EVOLUTION TIMELINE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Evidence Quality Meter & Trace Confidence */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-start justify-between border-b border-[#EBE6DC] pb-4">
                  <div>
                    <p className="text-xs font-mono-tabular text-[#1E4620]">
                      EVIDENCE QUALITY METER
                    </p>
                    <h3 className="text-xl font-serif-display text-[#1C241E]">
                      Trace Confidence
                    </h3>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-3xl font-mono-tabular font-semibold ${
                        evidenceTrace.confidence.isWeakOrInsufficient
                          ? 'text-[#991B1B]'
                          : 'text-[#1E4620]'
                      }`}
                    >
                      {evidenceTrace.confidence.overallTraceConfidence}%
                    </span>
                  </div>
                </div>

                {/* Deterministic Quality Metrics with Explanations */}
                <div className="space-y-4">
                  {[
                    {
                      label: 'Source agreement',
                      value: evidenceTrace.confidence.sourceAgreement,
                      explanation: evidenceTrace.confidence.agreementExplanation,
                    },
                    {
                      label: 'Evidence relevance',
                      value: evidenceTrace.confidence.evidenceRelevance,
                      explanation: evidenceTrace.confidence.relevanceExplanation,
                    },
                    {
                      label: 'Source quality (Authority)',
                      value: evidenceTrace.confidence.sourceQuality,
                      explanation: evidenceTrace.confidence.sourceQualityExplanation,
                    },
                    {
                      label: 'Identification confidence (Local AI)',
                      value: evidenceTrace.confidence.identificationConfidence,
                      explanation: `Extracted by ${aiAnalysis.modelUsed} from submitted traits.`,
                    },
                  ].map((factor) => (
                    <div key={factor.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#1C241E] font-semibold">{factor.label}</span>
                        <span className="font-mono-tabular font-semibold text-[#1E4620]">
                          {factor.value}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#EBE6DC] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#1E4620] transition-all duration-300"
                          style={{ width: `${factor.value}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-[#545E56] leading-snug">
                        {factor.explanation}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Evidence Limitations */}
                <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#E2DDD2] space-y-1.5">
                  <p className="text-xs font-semibold text-[#1C241E]">
                    Evidence Limitations & Missing Information:
                  </p>
                  <ul className="space-y-1 text-xs text-[#545E56]">
                    {evidenceTrace.confidence.limitations.map((lim, i) => (
                      <li key={i} className="leading-relaxed">
                        • {lim}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1E4620]/6 border border-[#1E4620]/15 space-y-1">
                <p className="text-xs font-semibold text-[#1E4620]">Why this score?</p>
                <p className="text-xs text-[#2C362E] leading-relaxed">
                  “{evidenceTrace.confidence.whyThisScore}”
                </p>
              </div>
            </div>

            {/* Claim Evolution Timeline & Investigation Process Timeline */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE6DC] pb-4">
                <div>
                  <p className="text-xs font-mono-tabular text-[#1E4620]">
                    CHRONOLOGICAL SOURCE TRACKING
                  </p>
                  <h3 className="text-xl font-serif-display text-[#1C241E]">
                    {timelineMode === 'claim_evolution'
                      ? 'Claim Evolution Timeline'
                      : 'Evidence Investigation Timeline'}
                  </h3>
                </div>

                {/* Segmented Toggle between Claim Evolution Timeline & 5-Stage Process Timeline */}
                <div className="flex items-center gap-1 p-1 bg-[#F7F5F0] rounded-xl border border-[#E2DDD2]">
                  <button
                    type="button"
                    onClick={() => setTimelineMode('claim_evolution')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      timelineMode === 'claim_evolution'
                        ? 'bg-white text-[#1E4620] font-semibold shadow-xs'
                        : 'text-[#545E56] hover:text-[#1C241E]'
                    }`}
                  >
                    Claim Evolution (Dates)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimelineMode('process')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      timelineMode === 'process'
                        ? 'bg-white text-[#1E4620] font-semibold shadow-xs'
                        : 'text-[#545E56] hover:text-[#1C241E]'
                    }`}
                  >
                    5-Step Trace Journey
                  </button>
                </div>
              </div>

              {timelineMode === 'claim_evolution' ? (
                <div className="space-y-3">
                  <p className="text-xs text-[#545E56] leading-relaxed">
                    Organizes discovered references by actual publication or assessment dates. The oldest entry is labeled as the <strong>earliest discoverable mention</strong> in retrieved search results—never assumed to be the confirmed original historical source unless verified.
                  </p>

                  {evidenceTrace.claimEvolution.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-[#F7F5F0] border border-[#E2DDD2] text-center text-xs text-[#6B746C]">
                      No dated sources available for chronological timeline.
                    </div>
                  ) : (
                    evidenceTrace.claimEvolution.map((node, index) => (
                      <React.Fragment key={node.id}>
                        <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#E2DDD2] space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span
                              className={`font-semibold ${
                                node.isEarliestDiscoverableMention
                                  ? 'text-[#1E4620]'
                                  : node.evolutionRole === 'Conflicting Account'
                                  ? 'text-[#92400E]'
                                  : 'text-[#2C362E]'
                              }`}
                            >
                              {node.evolutionRole}
                              {node.isEarliestDiscoverableMention
                                ? ' (Not Confirmed Original Source)'
                                : ''}
                            </span>
                            <span className="font-mono-tabular text-[#545E56] flex items-center gap-1">
                              <CalendarClock className="w-3.5 h-3.5 text-[#1E4620]" />
                              <span>{node.dateLabel}</span>
                            </span>
                          </div>

                          <div className="flex items-baseline justify-between gap-2">
                            <h4 className="text-sm font-serif-display font-semibold text-[#1C241E]">
                              {node.sourceName} — {node.title}
                            </h4>
                          </div>

                          <p className="text-xs text-[#2C362E] leading-relaxed">
                            “{node.claimExcerpt}”
                          </p>

                          <div className="pt-1 flex justify-end">
                            <a
                              href={node.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E4620] hover:underline"
                            >
                              <span>Open Dated Reference</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        {index < evidenceTrace.claimEvolution.length - 1 && (
                          <div className="flex justify-center">
                            <ArrowDown className="w-4 h-4 text-[#8A928B]" />
                          </div>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {evidenceTrace.timeline.map((node, index) => (
                    <React.Fragment key={node.stepNumber}>
                      <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-[#F7F5F0] border border-[#E2DDD2]">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono-tabular font-semibold shrink-0 mt-0.5 ${
                            node.status === 'warning'
                              ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]'
                              : 'bg-[#1E4620] text-white'
                          }`}
                        >
                          0{node.stepNumber}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="text-xs font-semibold text-[#545E56] uppercase tracking-wider">
                              {node.label}
                            </p>
                            <span className="text-xs font-mono-tabular text-[#6B746C]">
                              {node.subtitle}
                            </span>
                          </div>
                          <p className="text-base font-serif-display font-semibold text-[#1C241E] mt-0.5">
                            {node.title}
                          </p>
                          <p className="text-xs text-[#545E56] mt-0.5">{node.detail}</p>
                        </div>
                      </div>
                      {index < evidenceTrace.timeline.length - 1 && (
                        <div className="flex justify-center">
                          <ArrowDown className="w-4 h-4 text-[#8A928B]" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* UPGRADED FEATURE 6: ASK THE EVIDENCE (Source-Grounded Investigation Q&A) */}
          <div className="bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EBE6DC] pb-4">
              <div className="flex items-center gap-2.5">
                <MessageSquareText className="w-5 h-5 text-[#1E4620]" />
                <div>
                  <p className="text-xs font-mono-tabular text-[#1E4620]">
                    SOURCE-GROUNDED INVESTIGATION Q&A
                  </p>
                  <h3 className="text-xl font-serif-display text-[#1C241E]">
                    Ask the Evidence
                  </h3>
                </div>
              </div>
              <span className="text-xs text-[#545E56]">
                Answers strictly cite retrieved sources — never hallucinates
              </span>
            </div>

            {/* Suggested Source Questions */}
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((item) => (
                <button
                  key={item.query}
                  type="button"
                  onClick={() => handleAskQuestion(item.query)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer text-left ${
                    activeAnswer?.question === item.query
                      ? 'bg-[#1E4620] text-white border-[#1E4620]'
                      : 'bg-[#F7F5F0] text-[#2C362E] border-[#E2DDD2] hover:bg-[#EBE6DC]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Custom Question Input */}
            <form onSubmit={handleCustomQuestionSubmit} className="flex gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Ask a question about this observation (e.g., What supports this identification? Which source contradicts it?)"
                className="flex-1 rounded-xl border border-[#D5CFC2] bg-[#F7F5F0]/60 px-4 py-2.5 text-xs text-[#1C241E] placeholder-[#8A928B] focus:outline-none focus:border-[#1E4620] focus:bg-white"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1E4620] text-white text-xs font-semibold hover:bg-[#163518] transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask Sources</span>
              </button>
            </form>

            {/* Grounded Answer Output */}
            {activeAnswer && (
              <div className="p-5 rounded-2xl bg-[#F7F5F0] border border-[#E2DDD2] space-y-4">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-[#1E4620] flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Question: “{activeAnswer.question}”</span>
                  </p>
                  <p className="text-sm text-[#1C241E] leading-relaxed">
                    {activeAnswer.answerText}
                  </p>
                </div>

                {activeAnswer.citedSources.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#E2DDD2]">
                    <p className="text-xs font-semibold text-[#545E56]">
                      Supporting Citations Used:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {activeAnswer.citedSources.map((cit, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-white border border-[#E2DDD2] flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-[#1C241E] truncate">
                              [{i + 1}] {cit.sourceName}
                            </p>
                            <p className="text-[#545E56] truncate text-[11px]">
                              “{cit.excerpt}”
                            </p>
                          </div>
                          <a
                            href={cit.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#1E4620] font-semibold hover:underline shrink-0"
                          >
                            <span>Cite</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-[#545E56] pt-1">
                  <strong>Recommended Next Field Check:</strong> {activeAnswer.followUpFieldTip}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: TRACE TRAIL & SERPAPI EVIDENCE SOURCE CARDS */}
          <div className="bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE6DC] pb-4">
              <div>
                <p className="text-xs text-[#6B746C]">
                  Observation → AI Hypothesis → Search Query → Independent Sources → Summary
                </p>
                <h3 className="text-xl font-serif-display text-[#1C241E]">
                  Trace Trail & Web Evidence Sources
                </h3>
              </div>
              <span className="text-xs text-[#545E56]">
                {evidenceTrace.providerNotice}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs bg-[#F7F5F0] p-3.5 rounded-2xl border border-[#E2DDD2] text-[#2C362E]">
              <span className="font-semibold">Observation ({exploration.category})</span>
              <span>↓</span>
              <span className="font-semibold text-[#1E4620]">
                AI Hypothesis ({aiAnalysis.possibleIdentification})
              </span>
              <span>↓</span>
              <span className="font-mono-tabular">
                Query (“{aiAnalysis.searchQueries[0]}”)
              </span>
              <span>↓</span>
              <span className="font-semibold">
                {evidenceTrace.sources.length} Sources Compared
              </span>
              <span>↓</span>
              <span className="font-semibold text-[#1E4620]">Evidence Summary</span>
            </div>

            {evidenceTrace.sources.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] text-center space-y-3">
                <AlertTriangle className="w-8 h-8 text-[#991B1B] mx-auto" />
                <h4 className="text-lg font-serif-display font-semibold text-[#991B1B]">
                  Not enough evidence found.
                </h4>
                <p className="text-xs text-[#7F1D1D] max-w-md mx-auto leading-relaxed">
                  TraceBack never fabricates sources or claims certainty when corroborating web evidence is absent. Try switching back to Standard Trace or refining your field observation notes.
                </p>
                <button
                  type="button"
                  onClick={() => onRetraceWithMode('standard')}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#991B1B] text-white text-xs font-semibold hover:bg-[#7F1D1D] transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Verified Sources</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {evidenceTrace.sources.map((src, index) => (
                  <div
                    key={src.id}
                    className="p-5 rounded-2xl bg-[#F7F5F0] border border-[#E2DDD2] flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 text-xs text-[#545E56]">
                        <span className="font-semibold text-[#1E4620] truncate">
                          Source {index + 1} · {src.sourceName}
                        </span>
                        <span className="font-mono-tabular shrink-0">{src.date}</span>
                      </div>

                      <h4 className="text-base font-serif-display font-semibold text-[#1C241E] leading-snug">
                        {src.title}
                      </h4>

                      <p className="text-xs text-[#2C362E] leading-relaxed">
                        “{src.excerpt}”
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E2DDD2] flex items-center justify-between gap-3">
                      <div className="text-xs text-[#545E56] font-mono-tabular">
                        Relevance: <strong className="text-[#1E4620]">{src.relevanceScore}%</strong> · Authority:{' '}
                        <strong>{src.authorityScore || 86}%</strong>
                      </div>

                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-[#D5CFC2] text-xs font-semibold text-[#1C241E] hover:bg-[#1E4620] hover:text-white hover:border-[#1E4620] transition-colors whitespace-nowrap"
                      >
                        <span>Open Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-5 rounded-2xl bg-[#1E4620]/6 border border-[#1E4620]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-[#1E4620] uppercase tracking-wider">
                  Evidence Summary
                </p>
                <p className="text-sm text-[#1C241E] leading-relaxed">
                  {evidenceTrace.evidenceSummary}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPassportOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1E4620] text-white text-xs font-semibold hover:bg-[#163518] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Evidence Passport</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenJournal}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#D5CFC2] text-[#1C241E] text-xs font-semibold hover:bg-[#EBE6DC] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Field Journal</span>
                </button>
                <button
                  type="button"
                  onClick={onStartNewCapture}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#D5CFC2] text-[#1C241E] text-xs font-semibold hover:bg-[#EBE6DC] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>New Exploration</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <EvidencePassportModal
        exploration={exploration}
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
      />
    </div>
  );
};
