import React, { useState } from 'react';
import {
  CheckCircle2,
  Compass,
  FlaskConical,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  COMMUNITY_CLUSTERS,
  DISCOVERY_MISSIONS,
  FIELD_PRESETS,
  FieldPreset,
} from '../lib/ai/analyzer';
import { runTraceBackVerificationSuite } from '../lib/evidence/processor.test';
import { DiscoveryMission, ObservationCategory } from '../types/traceback';

interface DiscoveryAndClustersViewProps {
  onLaunchMission: (preset: FieldPreset) => void;
}

export const DiscoveryAndClustersView: React.FC<DiscoveryAndClustersViewProps> = ({
  onLaunchMission,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [optInCommunitySharing, setOptInCommunitySharing] = useState<boolean>(true);
  const [testResults, setTestResults] = useState(() => runTraceBackVerificationSuite());

  const categories: ('All' | ObservationCategory)[] = [
    'All',
    'Bird',
    'Plant',
    'Landmark',
    'Other',
  ];

  const filteredMissions = DISCOVERY_MISSIONS.filter(
    (m) => selectedCategory === 'All' || m.category === selectedCategory
  );

  const filteredClusters = COMMUNITY_CLUSTERS.filter(
    (c) => selectedCategory === 'All' || c.category === selectedCategory
  );

  const handleStartMission = (mission: DiscoveryMission) => {
    const preset =
      FIELD_PRESETS.find((p) => p.id === mission.samplePresetId) || FIELD_PRESETS[0];
    onLaunchMission(preset);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-12">
      {/* Header & Category Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2DDD2] pb-6">
        <div className="space-y-2">
          <p className="text-xs font-mono-tabular text-[#1E4620]">
            NEARBY DISCOVERY MISSIONS & OPT-IN COMMUNITY CLUSTERS
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif-display text-[#1C241E]">
            Real-World Exploration Missions
          </h1>
          <p className="text-sm text-[#545E56] max-w-2xl leading-relaxed">
            Instead of scrolling feeds, pick a nearby habitat mission, step outside to observe diagnostic traits in person, and compare your findings with anonymous community observation clusters.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#E2DDD2] self-start">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#1E4620] text-white font-semibold'
                  : 'text-[#545E56] hover:text-[#1C241E]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: Nearby Discovery Mode (Touch Grass Missions) */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif-display text-[#1C241E]">
              1. Nearby Discovery Missions (Touch Grass Fit)
            </h2>
            <p className="text-xs text-[#545E56]">
              Structured outdoor field checklists designed to guide real-world observation before capturing a photo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMissions.map((mission) => (
            <div
              key={mission.id}
              className="bg-white rounded-3xl border border-[#E2DDD2] p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#545E56]">
                  <span>
                    {mission.category} · {mission.habitatTag}
                  </span>
                  <span className="font-mono-tabular text-[#1E4620] font-semibold">
                    🌿 ~{mission.estimatedOutdoorMinutes}m outside
                  </span>
                </div>

                <h3 className="text-xl font-serif-display font-semibold text-[#1C241E]">
                  {mission.title}
                </h3>

                <p className="text-xs text-[#2C362E] leading-relaxed">
                  {mission.promptHint}
                </p>

                <div className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#E2DDD2] space-y-1.5">
                  <p className="text-xs font-semibold text-[#1C241E]">
                    Field Checklist — What to Observe:
                  </p>
                  <ul className="space-y-1 text-xs text-[#545E56]">
                    {mission.whatToLookFor.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EBE6DC] flex items-center justify-between">
                <span className="text-xs text-[#6B746C]">
                  Works offline in the field
                </span>
                <button
                  type="button"
                  onClick={() => handleStartMission(mission)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E4620] text-white text-xs font-semibold hover:bg-[#163518] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Start Field Mission</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Community Observation Clusters */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif-display text-[#1C241E]">
              2. Community Observation Clusters
            </h2>
            <p className="text-xs text-[#545E56]">
              Opt-in anonymous observations grouped by habitat corridor and category to connect individual sightings to regional knowledge
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOptInCommunitySharing(!optInCommunitySharing)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer self-start ${
              optInCommunitySharing
                ? 'bg-[#1E4620]/8 border-[#1E4620] text-[#1E4620]'
                : 'bg-white border-[#D5CFC2] text-[#545E56]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>
              Anonymous Cluster Opt-In: <strong>{optInCommunitySharing ? 'Enabled' : 'Paused'}</strong>
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClusters.map((cluster) => (
            <div
              key={cluster.id}
              className="bg-white rounded-3xl border border-[#E2DDD2] p-6 space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-[#545E56]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1E4620]" />
                  <span>{cluster.regionLabel}</span>
                </span>
                <span className="font-mono-tabular">
                  {cluster.recentSightingsCount} anonymous observations
                </span>
              </div>

              <div>
                <h3 className="text-lg font-serif-display font-semibold text-[#1C241E]">
                  {cluster.areaName}
                </h3>
                <p className="text-xs text-[#1E4620] font-medium mt-0.5">
                  Dominant Discovery: {cluster.dominantSpeciesOrSubject} ({cluster.averageConfidence}% avg trace confidence)
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7F5F0] border border-[#E2DDD2] space-y-1.5 text-xs">
                <p className="font-semibold text-[#1C241E]">
                  Top Corroborated Trait: <span className="font-normal text-[#2C362E]">{cluster.topVerifiedTrait}</span>
                </p>
                {cluster.sampleNotes.map((note, idx) => (
                  <p key={idx} className="text-[#545E56] italic">
                    “{note}”
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Automated Verification & Scoring Test Suite */}
      <section className="bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE6DC] pb-4">
          <div className="flex items-center gap-2.5">
            <FlaskConical className="w-5 h-5 text-[#1E4620]" />
            <div>
              <h2 className="text-lg font-serif-display font-semibold text-[#1C241E]">
                Automated Evidence Scoring, Conflict & Offline Queue Test Suite
              </h2>
              <p className="text-xs text-[#545E56]">
                Verifies deterministic Evidence Quality Meter math, Conflict Detector links, Claim Evolution sorting, and Offline/Failed API guards
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTestResults(runTraceBackVerificationSuite())}
            className="px-3.5 py-2 rounded-xl bg-[#F7F5F0] border border-[#D5CFC2] text-xs font-semibold text-[#1E4620] hover:bg-[#EBE6DC] transition-colors cursor-pointer self-start whitespace-nowrap"
          >
            Re-Run Verification Suite ({testResults.filter((t) => t.passed).length}/{testResults.length} Passing)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {testResults.map((test) => (
            <div
              key={test.name}
              className="p-3.5 rounded-2xl bg-[#F7F5F0] border border-[#E2DDD2] flex items-start gap-3 text-xs"
            >
              <CheckCircle2
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  test.passed ? 'text-[#1E4620]' : 'text-[#991B1B]'
                }`}
              />
              <div className="space-y-0.5 min-w-0">
                <p className="font-semibold text-[#1C241E]">{test.name}</p>
                <p className="text-[#545E56] font-mono-tabular text-[11px] break-words">
                  {test.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
