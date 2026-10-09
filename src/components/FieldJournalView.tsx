import React, { useState } from 'react';
import {
  ArrowRight,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import {
  computeWeeklyTouchGrassStats,
  formatMinutesToHoursAndMinutes,
} from '../lib/storage/offlineJournal';
import { FieldExploration } from '../types/traceback';

interface FieldJournalViewProps {
  explorations: FieldExploration[];
  onSelectExploration: (exp: FieldExploration) => void;
  onDeleteExploration: (id: string) => void;
  onStartNewExploration: () => void;
}

export const FieldJournalView: React.FC<FieldJournalViewProps> = ({
  explorations,
  onSelectExploration,
  onDeleteExploration,
  onStartNewExploration,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const weeklyStats = computeWeeklyTouchGrassStats(explorations);

  const filteredExplorations = explorations.filter((exp) => {
    const matchesCategory =
      selectedCategory === 'All' || exp.category === selectedCategory;
    const matchesSearch =
      !searchTerm.trim() ||
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.observationText.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Bird', 'Plant', 'Landmark', 'Other'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E2DDD2] p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-mono-tabular text-[#1E4620]">
              PERSONAL NATURALIST NOTEBOOK · LOCAL-FIRST ARCHIVE
            </p>
            <h1 className="text-2xl sm:text-3xl font-serif-display text-[#1C241E]">
              Field Journal
            </h1>
            <p className="text-sm text-[#545E56] leading-relaxed">
              Every outdoor observation, local open-weight AI hypothesis, and corroborated web evidence trail is archived right in your browser.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onStartNewExploration}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E4620] text-white text-xs font-semibold hover:bg-[#163518] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Log New Field Observation</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 bg-[#1E4620] text-[#F7F5F0] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono-tabular text-[#A7C4A0]">
                TOUCH GRASS METRIC · SCREEN-FREE TRACKER
              </p>
              <h2 className="text-xl font-serif-display text-white mt-0.5">
                This Week
              </h2>
            </div>
            <span className="text-xs font-mono-tabular text-[#E8B86D]">
              🌿 Screen-Free Goal Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-white/15">
            <div>
              <p className="text-2xl font-mono-tabular font-semibold text-white">
                {weeklyStats.explorationsCount}
              </p>
              <p className="text-xs text-[#D8E6D5]">explorations</p>
            </div>
            <div>
              <p className="text-2xl font-mono-tabular font-semibold text-[#E8B86D]">
                {formatMinutesToHoursAndMinutes(weeklyStats.totalMinutesOutside)}
              </p>
              <p className="text-xs text-[#D8E6D5]">outside</p>
            </div>
            <div>
              <p className="text-2xl font-mono-tabular font-semibold text-white">
                {weeklyStats.discoveriesCount}
              </p>
              <p className="text-xs text-[#D8E6D5]">discoveries</p>
            </div>
            <div>
              <p className="text-2xl font-mono-tabular font-semibold text-white">
                {weeklyStats.evidenceTrailsCreated}
              </p>
              <p className="text-xs text-[#D8E6D5]">evidence trails created</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#E2DDD2] overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#1E4620] text-white font-semibold'
                  : 'text-[#545E56] hover:text-[#1C241E]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#6B746C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search field notebook…"
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E2DDD2] text-xs text-[#1C241E] placeholder-[#8A928B] focus:outline-none focus:border-[#1E4620]"
          />
        </div>
      </div>

      {filteredExplorations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E2DDD2] p-12 text-center space-y-3">
          <p className="text-base font-serif-display text-[#1C241E]">
            No field entries match your filter.
          </p>
          <p className="text-xs text-[#545E56]">
            Step outside and capture a new real-world observation to grow your journal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExplorations.map((exp) => {
            const traceConfidence =
              exp.evidenceTrace?.confidence.overallTraceConfidence ?? exp.aiAnalysis.confidence;
            const sourcesCount = exp.evidenceTrace?.sources.length ?? 0;

            return (
              <div
                key={exp.id}
                className="bg-white rounded-3xl border border-[#E2DDD2] overflow-hidden flex flex-col justify-between hover:border-[#1E4620]/50 transition-colors group"
              >
                <div>
                  <div
                    onClick={() => onSelectExploration(exp)}
                    className="aspect-16/9 w-full bg-[#EBE6DC] overflow-hidden cursor-pointer relative"
                  >
                    <img
                      src={exp.imageUrl}
                      alt={exp.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#545E56]">
                      <span>📍 {exp.location}</span>
                      <span aria-hidden="true">·</span>
                      <span>📅 {exp.observedDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>🌿 {exp.screenFreeMinutes}m outside</span>
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                      <h3
                        onClick={() => onSelectExploration(exp)}
                        className="text-xl font-serif-display font-semibold text-[#1C241E] group-hover:text-[#1E4620] transition-colors cursor-pointer"
                      >
                        {exp.title}
                      </h3>
                      <span className="text-xs italic text-[#6B746C]">
                        {exp.aiAnalysis.scientificOrFormalName}
                      </span>
                    </div>

                    <p className="text-xs text-[#2C362E] line-clamp-2 leading-relaxed">
                      “{exp.observationText}”
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-[#F7F5F0] border-t border-[#E2DDD2] flex items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono-tabular text-[#1C241E]">
                    <span>🎯 {traceConfidence}% trace confidence</span>
                    <span aria-hidden="true" className="text-[#C8C2B4]">·</span>
                    <span>
                      🔗 {sourcesCount > 0 ? `${sourcesCount} evidence sources` : 'Pending sync'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDeleteExploration(exp.id)}
                      className="p-1.5 rounded-lg text-[#6B746C] hover:text-[#991B1B] hover:bg-[#EBE6DC] transition-colors cursor-pointer"
                      title="Remove entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectExploration(exp)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1E4620] text-white text-xs font-semibold hover:bg-[#163518] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>Open Trace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
