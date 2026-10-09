import React, { useEffect, useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { FieldCaptureView } from './components/FieldCaptureView';
import { EvidenceExplorerView, LoadingStage } from './components/EvidenceExplorerView';
import { FieldJournalView } from './components/FieldJournalView';
import { DiscoveryAndClustersView } from './components/DiscoveryAndClustersView';
import { analyzeObservationLocally, FieldPreset } from './lib/ai/analyzer';
import { traceEvidenceWithSerpApi } from './lib/evidence/processor';
import {
  deleteFieldExploration,
  INITIAL_SEED_EXPLORATIONS,
  loadExplorationsFromIndexedDB,
  loadFieldJournal,
  saveFieldExploration,
} from './lib/storage/offlineJournal';
import { useOnlineStatus } from './lib/pwa/usePWAInstall';
import {
  FieldExploration,
  ObservationCategory,
  OpenWeightModelId,
} from './types/traceback';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [explorations, setExplorations] = useState<FieldExploration[]>(() =>
    loadFieldJournal()
  );
  const [currentExploration, setCurrentExploration] = useState<FieldExploration>(
    () => loadFieldJournal()[0] || INITIAL_SEED_EXPLORATIONS[0]
  );
  const [selectedModel, setSelectedModel] = useState<OpenWeightModelId>(
    'gemma3:4b-vision-q4'
  );
  const [loadingStage, setLoadingStage] = useState<LoadingStage>(null);
  const [activeSimulationMode, setActiveSimulationMode] = useState<
    'standard' | 'contradiction' | 'insufficient'
  >('standard');
  const [serpApiConfigured, setSerpApiConfigured] = useState<boolean>(false);
  const [measuredSessionSeconds, setMeasuredSessionSeconds] = useState<number>(18);

  const { isOnline, simulatedOffline, setSimulatedOffline } = useOnlineStatus();

  // Hydrate from IndexedDB on initial load and start session interaction timer
  useEffect(() => {
    void loadExplorationsFromIndexedDB().then((idbItems) => {
      if (idbItems && idbItems.length > 0) {
        setExplorations(idbItems);
      }
    });

    const timer = window.setInterval(() => {
      setMeasuredSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/api/config-status')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.serpApiConfigured === 'boolean') {
          setSerpApiConfigured(data.serpApiConfigured);
        }
      })
      .catch(() => {
        // Offline or unreachable
      });
  }, []);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const generatePassportId = () => {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    return `TB-2026-${suffix}`;
  };

  const handleRunCaptureAndAnalyze = async (payload: {
    observationText: string;
    category: ObservationCategory;
    location: string;
    imageUrl: string;
    screenFreeMinutes: number;
  }) => {
    setActiveTab('trace');
    setActiveSimulationMode('standard');

    setLoadingStage('Analyzing your observation…');
    await sleep(450);

    const aiAnalysis = await analyzeObservationLocally({
      observationText: payload.observationText,
      category: payload.category,
      location: payload.location,
      imageUrl: payload.imageUrl,
      modelId: selectedModel,
    });

    const observedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const measuredMinutes = Math.max(1, Math.round(measuredSessionSeconds / 60));

    if (!isOnline) {
      const offlineExploration: FieldExploration = {
        id: `exp-${Date.now()}`,
        passportId: generatePassportId(),
        title: aiAnalysis.possibleIdentification,
        category: payload.category,
        observationText: payload.observationText,
        location: payload.location,
        observedDate,
        imageUrl: payload.imageUrl,
        screenFreeMinutes: payload.screenFreeMinutes,
        screenTimeMinutes: measuredMinutes,
        measuredInteractionSeconds: measuredSessionSeconds,
        aiAnalysis,
        evidenceTrace: null,
        syncStatus: 'pending_online_trace',
      };

      const updated = saveFieldExploration(offlineExploration);
      setExplorations(updated);
      setCurrentExploration(offlineExploration);
      setLoadingStage(null);
      return;
    }

    setLoadingStage('Finding evidence…');
    await sleep(450);

    setLoadingStage('Comparing sources…');
    const evidenceTrace = await traceEvidenceWithSerpApi({
      aiAnalysis,
      observedDate,
      simulationMode: 'standard',
    });
    await sleep(350);

    setLoadingStage('Building your trace…');
    await sleep(300);

    const newExploration: FieldExploration = {
      id: `exp-${Date.now()}`,
      passportId: generatePassportId(),
      title: aiAnalysis.possibleIdentification,
      category: payload.category,
      observationText: payload.observationText,
      location: payload.location,
      observedDate,
      imageUrl: payload.imageUrl,
      screenFreeMinutes: payload.screenFreeMinutes,
      screenTimeMinutes: measuredMinutes,
      measuredInteractionSeconds: measuredSessionSeconds,
      aiAnalysis,
      evidenceTrace,
      syncStatus: 'synced',
    };

    const updated = saveFieldExploration(newExploration);
    setExplorations(updated);
    setCurrentExploration(newExploration);
    setLoadingStage(null);
  };

  const handleLaunchMission = (preset: FieldPreset) => {
    void handleRunCaptureAndAnalyze({
      observationText: preset.observationText,
      category: preset.category,
      location: preset.location,
      imageUrl: preset.imageUrl,
      screenFreeMinutes: preset.screenFreeMinutes,
    });
  };

  const handleTriggerDemo = async () => {
    setActiveTab('trace');
    setActiveSimulationMode('standard');

    setLoadingStage('Analyzing your observation…');
    await sleep(400);

    setLoadingStage('Finding evidence…');
    await sleep(400);

    setLoadingStage('Comparing sources…');
    await sleep(350);

    setLoadingStage('Building your trace…');
    await sleep(300);

    const demoItem = INITIAL_SEED_EXPLORATIONS[0];
    const updated = saveFieldExploration(demoItem);
    setExplorations(updated);
    setCurrentExploration(demoItem);
    setLoadingStage(null);
  };

  const handleRetraceWithMode = async (
    mode: 'standard' | 'contradiction' | 'insufficient'
  ) => {
    setActiveSimulationMode(mode);
    setLoadingStage('Comparing sources…');
    await sleep(300);

    const updatedTrace = await traceEvidenceWithSerpApi({
      aiAnalysis: currentExploration.aiAnalysis,
      observedDate: currentExploration.observedDate,
      simulationMode: mode,
    });

    const updatedExploration: FieldExploration = {
      ...currentExploration,
      evidenceTrace: updatedTrace,
      syncStatus: 'synced',
    };

    const updatedList = saveFieldExploration(updatedExploration);
    setExplorations(updatedList);
    setCurrentExploration(updatedExploration);
    setLoadingStage(null);
  };

  const handleSyncOfflineExploration = async () => {
    if (!isOnline) return;
    await handleRetraceWithMode('standard');
  };

  const handleDeleteExploration = (id: string) => {
    const updated = deleteFieldExploration(id);
    setExplorations(updated);
    if (currentExploration.id === id && updated.length > 0) {
      setCurrentExploration(updated[0]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F7F5F0] text-[#1C241E]">
      <div>
        <Navbar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onTriggerDemo={handleTriggerDemo}
          journalCount={explorations.length}
        />

        <div className="md:hidden flex items-center justify-around border-b border-[#E2DDD2] bg-white px-2 py-2 text-xs font-medium overflow-x-auto">
          {[
            { id: 'home', label: 'Overview' },
            { id: 'capture', label: 'Capture' },
            { id: 'trace', label: 'Evidence' },
            { id: 'discover', label: 'Missions' },
            { id: 'journal', label: `Journal (${explorations.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#1E4620] text-white font-semibold'
                  : 'text-[#545E56]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <main>
          {(activeTab === 'home' || activeTab === 'how-it-works') && (
            <LandingView
              explorations={explorations}
              isOnline={isOnline}
              serpApiConfigured={serpApiConfigured}
              onStartExploration={() => setActiveTab('capture')}
              onTryDemo={handleTriggerDemo}
              onHowItWorks={() => {
                setActiveTab('how-it-works');
                window.scrollTo({ top: 520, behavior: 'smooth' });
              }}
              onSelectExploration={(exp) => {
                setCurrentExploration(exp);
                setActiveTab('trace');
              }}
              onOpenJournal={() => setActiveTab('journal')}
              onOpenDiscoveryMissions={() => setActiveTab('discover')}
            />
          )}

          {activeTab === 'capture' && (
            <FieldCaptureView
              isOnline={isOnline}
              simulatedOffline={simulatedOffline}
              onToggleSimulatedOffline={() => setSimulatedOffline(!simulatedOffline)}
              selectedModel={selectedModel}
              onChangeModel={setSelectedModel}
              onRunCaptureAndAnalyze={handleRunCaptureAndAnalyze}
              onRunInstantDemo={handleTriggerDemo}
            />
          )}

          {activeTab === 'trace' && (
            <EvidenceExplorerView
              exploration={currentExploration}
              loadingStage={loadingStage}
              isOnline={isOnline}
              measuredSessionSeconds={measuredSessionSeconds}
              activeSimulationMode={activeSimulationMode}
              onRetraceWithMode={handleRetraceWithMode}
              onSyncOfflineExploration={handleSyncOfflineExploration}
              onOpenJournal={() => setActiveTab('journal')}
              onStartNewCapture={() => setActiveTab('capture')}
            />
          )}

          {activeTab === 'discover' && (
            <DiscoveryAndClustersView onLaunchMission={handleLaunchMission} />
          )}

          {activeTab === 'journal' && (
            <FieldJournalView
              explorations={explorations}
              onSelectExploration={(exp) => {
                setCurrentExploration(exp);
                setActiveTab('trace');
              }}
              onDeleteExploration={handleDeleteExploration}
              onStartNewExploration={() => setActiveTab('capture')}
            />
          )}
        </main>
      </div>

      <footer className="border-t border-[#E2DDD2] bg-[#F7F5F0] py-8 px-4 sm:px-8 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#545E56]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-serif-display font-semibold text-[#1C241E]">
              TraceBack — Field Evidence Explorer
            </span>
            <span aria-hidden="true">·</span>
            <span>Hacktoberfest 2026 “Touch Grass” Open-Source AI Challenge</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('capture')}
              className="hover:text-[#1C241E] transition-colors cursor-pointer"
            >
              Field Capture
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('journal')}
              className="hover:text-[#1C241E] transition-colors cursor-pointer"
            >
              Field Journal
            </button>
            <button
              type="button"
              onClick={handleTriggerDemo}
              className="font-semibold text-[#1E4620] hover:underline cursor-pointer"
            >
              Try Demo
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
