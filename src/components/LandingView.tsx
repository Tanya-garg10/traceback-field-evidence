import React from 'react';
import {
  ArrowDown,
  Compass,
  Play,
} from 'lucide-react';
import {
  computeWeeklyTouchGrassStats,
  formatMinutesToHoursAndMinutes,
} from '../lib/storage/offlineJournal';
import { FieldExploration } from '../types/traceback';

interface LandingViewProps {
  explorations: FieldExploration[];
  isOnline: boolean;
  serpApiConfigured: boolean;
  onStartExploration: () => void;
  onTryDemo: () => void;
  onHowItWorks: () => void;
  onSelectExploration: (exp: FieldExploration) => void;
  onOpenJournal: () => void;
  onOpenDiscoveryMissions: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  explorations,
  serpApiConfigured,
  onStartExploration,
  onTryDemo,
  onHowItWorks,
  onOpenJournal,
  onOpenDiscoveryMissions,
}) => {
  const weeklyStats = computeWeeklyTouchGrassStats(explorations);

  return (
    <div className="space-y-16 pb-16">
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#1E4620]">
              <span>Local-first AI</span>
              <span aria-hidden="true">·</span>
              <span>Open-source</span>
              <span aria-hidden="true">·</span>
              <span>Evidence-based</span>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-mono-tabular text-[#545E56]">
                HACKTOBERFEST 2026 OPEN-SOURCE AI CHALLENGE · “TOUCH GRASS”
              </p>
              <h1
                className="text-4xl sm:text-5xl font-serif-display font-normal text-[#1C241E] leading-[1.12] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Step outside. Capture something. Trace it back.
              </h1>
            </div>

            <p className="text-base text-[#2C362E] leading-relaxed max-w-xl">
              “I experienced something in the real world. Help me understand it, then show me where the evidence came from.” TraceBack pairs local open-weight vision/language models with verifiable SerpApi web evidence trails—so you spend more time on the trail and less time scrolling.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onStartExploration}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1E4620] text-white text-sm font-semibold hover:bg-[#163518] transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              >
                <Compass className="w-4 h-4" />
                <span>Start an Exploration</span>
              </button>

              <button
                type="button"
                onClick={onTryDemo}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-[#D5CFC2] text-[#1C241E] text-sm font-semibold hover:bg-[#EBE6DC] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Play className="w-4 h-4 text-[#1E4620] fill-current" />
                <span>Try Demo (Indian Roller)</span>
              </button>

              <button
                type="button"
                onClick={onOpenDiscoveryMissions}
                className="px-4 py-3.5 text-sm font-medium text-[#1E4620] hover:underline transition-colors cursor-pointer whitespace-nowrap"
              >
                Nearby Missions →
              </button>

              <button
                type="button"
                onClick={onHowItWorks}
                className="px-3 py-3.5 text-sm font-medium text-[#545E56] hover:text-[#1C241E] hover:underline transition-colors cursor-pointer whitespace-nowrap"
              >
                How It Works
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#545E56]">
              <span>🟢 AI analysis available offline</span>
              <span aria-hidden="true">·</span>
              <span>🟡 Evidence tracing requires internet</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl border border-[#E2DDD2] overflow-hidden shadow-xs">
              <div className="aspect-16/9 w-full bg-[#EBE6DC] relative overflow-hidden">
                <img
                  src="/src/assets/images/hero_field_exploration_1791465216180.jpg"
                  alt="Botanical field notebook and brass compass on a sunlit woodland trail"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <p className="text-xs font-mono-tabular text-[#E8B86D]">
                      FIELD EVIDENCE NOTEBOOK · SPECIMEN #01
                    </p>
                    <p className="text-lg font-serif-display">
                      Real-World Observation → Open-Weight Hypothesis → Multi-Source Proof
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src="/src/assets/images/indian_roller_bird_1791465231205.jpg"
                      alt="Indian Roller bird"
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-[#E2DDD2] shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#545E56]">
                        <span>Lake observation</span>
                        <span aria-hidden="true">·</span>
                        <span>Oct 8, 2026</span>
                      </div>
                      <h3 className="text-base font-serif-display font-semibold text-[#1C241E]">
                        Indian Roller (Coracias benghalensis)
                      </h3>
                      <p className="text-xs text-[#545E56]">
                        Local AI Hypothesis: <strong>82%</strong> · Trace Confidence: <strong className="text-[#1E4620]">87%</strong> (4 sources)
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onTryDemo}
                    className="px-3.5 py-2 rounded-xl bg-[#F7F5F0] border border-[#D5CFC2] text-xs font-semibold text-[#1E4620] hover:bg-[#1E4620] hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Inspect Trace →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#EBE6DC] pb-4">
            <div>
              <p className="text-xs font-mono-tabular text-[#1E4620]">
                THE TRACEBACK WORKFLOW
              </p>
              <h2 className="text-2xl font-serif-display text-[#1C241E]">
                Go Outside → Capture → Analyze Locally → Trace Evidence → Discover
              </h2>
            </div>
            <span className="text-xs text-[#6B746C]">
              Designed to minimize screen time
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                num: '01',
                title: 'Go Outside',
                desc: 'Step away from infinite feeds. Observe plants, birds, landmarks, or signs in the physical world.',
              },
              {
                num: '02',
                title: 'Capture',
                desc: 'Snap a photo and record a brief field observation with optional habitat or trail coordinates.',
              },
              {
                num: '03',
                title: 'Analyze Locally',
                desc: 'Open-weight vision/language models (Gemma, Llama, Qwen) extract traits and form an initial hypothesis.',
              },
              {
                num: '04',
                title: 'Trace Evidence',
                desc: 'SerpApi queries independent web databases, comparing sources, relevance, and contradictions.',
              },
              {
                num: '05',
                title: 'Discover',
                desc: 'Review the transparent confidence breakdown, evidence timeline, and save to your Field Journal.',
              },
            ].map((item) => (
              <div
                key={item.num}
                className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#E2DDD2] space-y-2"
              >
                <span className="text-xs font-mono-tabular font-semibold text-[#1E4620]">
                  {item.num}.
                </span>
                <h3 className="text-base font-serif-display font-semibold text-[#1C241E]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#545E56] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#EBE6DC] pb-4">
            <div>
              <p className="text-xs font-mono-tabular text-[#1E4620]">
                HACKATHON STANDOUT CAPABILITIES · 8 CORE INNOVATIONS
              </p>
              <h2 className="text-2xl font-serif-display text-[#1C241E]">
                Open-Source AI + Real-World Exploration + Evidence Tracing
              </h2>
            </div>
            <button
              type="button"
              onClick={onOpenDiscoveryMissions}
              className="text-xs font-semibold text-[#1E4620] hover:underline cursor-pointer self-start sm:self-auto"
            >
              Explore Missions & Test Suite →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                num: '01',
                tag: 'High Priority',
                title: 'Evidence Passport',
                desc: 'Shareable, printable field report with original photo, local AI hypothesis, supporting & conflicting sources, and JSON/Markdown export.',
                actionLabel: 'Inspect Passport →',
                onClick: onTryDemo,
              },
              {
                num: '02',
                tag: 'Touch Grass Fit',
                title: 'Nearby Discovery Mode',
                desc: 'Structured outdoor habitat missions for birds, plants, landmarks, and fungi so users explore the real world instead of scrolling.',
                actionLabel: 'Launch Mission →',
                onClick: onOpenDiscoveryMissions,
              },
              {
                num: '03',
                tag: 'High Priority',
                title: 'Evidence Conflict Detector',
                desc: 'Automatically highlights cross-source disagreements (e.g., wetland vs. dry agricultural habitat) with direct links to both claims.',
                actionLabel: 'Test Conflict Detector →',
                onClick: onTryDemo,
              },
              {
                num: '04',
                tag: 'Source Provenance',
                title: 'Claim Evolution Timeline',
                desc: 'Chronologically orders dated web references and marks the oldest retrieved entry as Earliest Discoverable Mention.',
                actionLabel: 'View Timeline →',
                onClick: onTryDemo,
              },
              {
                num: '05',
                tag: 'Screen-Free Score',
                title: 'Outdoor vs. App Time Tracker',
                desc: 'Clearly separates manually logged outdoor exploration minutes from measured in-app interaction seconds.',
                actionLabel: 'Open Journal Stats →',
                onClick: onOpenJournal,
              },
              {
                num: '06',
                tag: 'IndexedDB Queue',
                title: 'Offline Field Mode',
                desc: 'Persists field photos, notes, and local open-weight AI hypotheses in IndexedDB when offline and queues SerpApi search for later.',
                actionLabel: 'Test Offline Capture →',
                onClick: onStartExploration,
              },
              {
                num: '07',
                tag: 'Regional Knowledge',
                title: 'Community Clusters',
                desc: 'Opt-in anonymous regional clusters connecting individual sightings to broader habitat corridors without social-feed noise.',
                actionLabel: 'View Clusters →',
                onClick: onOpenDiscoveryMissions,
              },
              {
                num: '08',
                tag: 'Source-Grounded Q&A',
                title: 'Ask the Evidence',
                desc: 'Interactive investigation Q&A that answers strictly from retrieved SerpApi sources with inline citations—never hallucinating.',
                actionLabel: 'Ask Sources →',
                onClick: onTryDemo,
              },
            ].map((feat) => (
              <div
                key={feat.num}
                className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#E2DDD2] flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono-tabular">
                    <span className="font-semibold text-[#1E4620]">#{feat.num}</span>
                    <span className="text-[#6B746C]">{feat.tag}</span>
                  </div>
                  <h3 className="text-base font-serif-display font-semibold text-[#1C241E]">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#545E56] leading-relaxed">{feat.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={feat.onClick}
                  className="text-xs font-semibold text-[#1E4620] hover:underline text-left cursor-pointer pt-1"
                >
                  {feat.actionLabel}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-[#1E4620] text-[#F7F5F0] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-mono-tabular text-[#A7C4A0]">
                SCREEN-FREE TIME METRIC
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif-display text-white">
                🌿 42 minutes outside
              </h2>
              <p className="text-sm text-[#D8E6D5]">
                “Your screen was only needed for 2 minutes.”
              </p>
            </div>

            <p className="text-xs text-[#D8E6D5]/90 leading-relaxed border-t border-white/15 pt-4">
              TraceBack measures success by how long your phone stays in your pocket while you explore nature—not by session dwell time.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between border-b border-[#EBE6DC] pb-4">
              <div>
                <p className="text-xs text-[#6B746C]">Weekly Outdoor Balance</p>
                <h3 className="text-xl font-serif-display text-[#1C241E]">This Week</h3>
              </div>
              <button
                type="button"
                onClick={onOpenJournal}
                className="text-xs font-semibold text-[#1E4620] hover:underline cursor-pointer"
              >
                Open Field Journal →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#E2DDD2]">
                <p className="text-2xl font-mono-tabular font-semibold text-[#1C241E]">
                  {weeklyStats.explorationsCount}
                </p>
                <p className="text-xs text-[#545E56] mt-0.5">explorations</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#E2DDD2]">
                <p className="text-2xl font-mono-tabular font-semibold text-[#1E4620]">
                  {formatMinutesToHoursAndMinutes(weeklyStats.totalMinutesOutside)}
                </p>
                <p className="text-xs text-[#545E56] mt-0.5">outside</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#E2DDD2]">
                <p className="text-2xl font-mono-tabular font-semibold text-[#1C241E]">
                  {weeklyStats.discoveriesCount}
                </p>
                <p className="text-xs text-[#545E56] mt-0.5">discoveries</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#E2DDD2]">
                <p className="text-2xl font-mono-tabular font-semibold text-[#1C241E]">
                  {weeklyStats.evidenceTrailsCreated}
                </p>
                <p className="text-xs text-[#545E56] mt-0.5">evidence trails created</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 space-y-6">
            <div className="space-y-1 border-b border-[#EBE6DC] pb-4">
              <p className="text-xs font-mono-tabular text-[#1E4620]">
                OFFLINE-FIRST FIELD ARCHITECTURE
              </p>
              <h3 className="text-xl font-serif-display text-[#1C241E]">
                Built for Trails Without Cell Reception
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { label: 'Browser / PWA', detail: 'Service Worker cached shell & assets', status: '🟢 Offline Ready' },
                { label: 'Local Storage', detail: 'Photos & field notes saved on-device', status: '🟢 Offline Ready' },
                { label: 'Open-Weight AI / Local Inference', detail: 'Gemma / Llama / Qwen trait extraction', status: '🟢 Offline Ready' },
                { label: 'Observation Saved Locally', detail: 'Queued in Field Journal with hypothesis', status: '🟢 Offline Ready' },
                { label: 'When Internet Becomes Available', detail: 'Server-side SerpApi evidence tracing', status: '🟡 Requires Internet' },
                { label: 'Evidence Synchronized', detail: 'Timeline, confidence & contradictions updated', status: '🟢 Synced' },
              ].map((step, i, arr) => (
                <React.Fragment key={step.label}>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F5F0] border border-[#E2DDD2]">
                    <div>
                      <p className="font-semibold text-[#1C241E]">{step.label}</p>
                      <p className="text-[#6B746C] text-[11px]">{step.detail}</p>
                    </div>
                    <span className="font-mono-tabular text-[11px] text-[#2C362E] shrink-0">
                      {step.status}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex justify-center">
                      <ArrowDown className="w-3.5 h-3.5 text-[#8A928B]" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="space-y-1 border-b border-[#EBE6DC] pb-4">
                <p className="text-xs font-mono-tabular text-[#1E4620]">
                  LOCAL-FIRST PRIVACY GUARANTEE
                </p>
                <h3 className="text-2xl font-serif-display text-[#1C241E]">
                  Your field observations stay yours.
                </h3>
              </div>

              <p className="text-sm text-[#2C362E] leading-relaxed">
                TraceBack is designed around open-source transparency and personal data sovereignty. Exploring the outdoors should never mean surrendering your camera roll or GPS history to closed proprietary cloud brokers.
              </p>

              <div className="space-y-3">
                {[
                  {
                    title: 'Initial analysis runs locally',
                    desc: 'Feature extraction and hypothesis generation use open-weight models (Gemma, Llama, Qwen) without shipping your raw photos to a proprietary LLM.',
                  },
                  {
                    title: 'No proprietary photo uploads required',
                    desc: 'Your field photographs remain in your local browser storage and Field Journal unless you explicitly export them.',
                  },
                  {
                    title: 'Web search happens only when requested',
                    desc: 'Only short, plain-text search queries are sent to the server-side SerpApi proxy when you trace web evidence.',
                  },
                  {
                    title: 'You control what you submit',
                    desc: 'Location tags are optional, entries can be deleted at any time, and API keys remain strictly server-side.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#E2DDD2] space-y-1"
                  >
                    <p className="text-xs font-semibold text-[#1C241E]">{item.title}</p>
                    <p className="text-xs text-[#545E56] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1E4620]/6 border border-[#1E4620]/15 flex items-center justify-between text-xs">
              <span className="text-[#1C241E] font-medium">
                SerpApi Key Server Isolation: <strong>Protected (/api/trace-evidence)</strong>
              </span>
              <span className="font-mono-tabular text-[#1E4620]">
                {serpApiConfigured ? 'Live Key Active' : 'Verified Demo Dataset'}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
