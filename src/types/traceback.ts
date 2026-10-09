export type ObservationCategory =
  | 'Plant'
  | 'Bird'
  | 'Animal'
  | 'Landmark'
  | 'Object'
  | 'Sign / Notice'
  | 'Other';

export type OpenWeightModelId =
  | 'gemma3:4b-vision-q4'
  | 'llama3.2-vision:11b-q4'
  | 'qwen2.5-vl:7b-q4';

export interface OpenWeightModelOption {
  id: OpenWeightModelId;
  name: string;
  family: 'Gemma' | 'Llama' | 'Qwen';
  params: string;
  quantization: string;
  offlineCapable: boolean;
  configuredOnDevice: boolean;
  description: string;
}

export interface AIHypothesisResult {
  possibleIdentification: string;
  scientificOrFormalName: string;
  category: ObservationCategory;
  confidence: number;
  characteristics: string[];
  keywords: string[];
  searchQueries: string[];
  modelUsed: string;
  analyzedOffline: boolean;
  engineSource: 'ollama_local_daemon' | 'browser_open_weight_pipeline';
  hypothesisDisclaimer: string;
  analyzedAt: string;
  recommendedFieldChecks?: string[];
}

export interface EvidenceSourceCard {
  id: string;
  sourceName: string;
  domain: string;
  title: string;
  url: string;
  date: string;
  isoDate?: string; // YYYY-MM-DD for chronological sorting in Claim Evolution Timeline
  excerpt: string;
  relevanceScore: number;
  authorityScore?: number;
  queryUsed: string;
  habitatClaim?: string;
  stance?: 'supporting' | 'conflicting' | 'neutral';
}

export interface ContradictionReport {
  detected: boolean;
  disagreementTopic: string;
  sourceAName: string;
  sourceAUrl: string;
  sourceAClaim: string;
  sourceBName: string;
  sourceBUrl: string;
  sourceBClaim: string;
  whatThisMeans: string;
  unresolvedUncertainty: string;
}

export interface ConfidenceBreakdown {
  overallTraceConfidence: number;
  sourceAgreement: number;
  evidenceRelevance: number;
  sourceQuality: number;
  identificationConfidence: number;
  whyThisScore: string;
  sourceQualityExplanation: string;
  relevanceExplanation: string;
  agreementExplanation: string;
  limitations: string[];
  isWeakOrInsufficient: boolean;
}

export interface TimelineNode {
  stepNumber: number;
  label: string;
  title: string;
  subtitle: string;
  detail: string;
  status: 'completed' | 'warning' | 'pending';
}

export interface ClaimEvolutionNode {
  id: string;
  dateLabel: string;
  isoDate: string;
  sourceName: string;
  title: string;
  url: string;
  claimExcerpt: string;
  isEarliestDiscoverableMention: boolean;
  evolutionRole: 'Earliest Discoverable Mention' | 'Corroborating Reference' | 'Recent Field Verification' | 'Conflicting Account';
}

export interface EvidenceTraceResult {
  tracedAt: string;
  serpApiMode: 'live_serpapi' | 'demo_reference' | 'insufficient_evidence' | 'offline_pending';
  providerNotice: string;
  sources: EvidenceSourceCard[];
  evidenceSummary: string;
  confidence: ConfidenceBreakdown;
  contradiction: ContradictionReport;
  timeline: TimelineNode[];
  claimEvolution: ClaimEvolutionNode[];
}

export interface FieldExploration {
  id: string;
  passportId: string;
  title: string;
  category: ObservationCategory;
  observationText: string;
  location: string;
  observedDate: string;
  imageUrl: string;
  screenFreeMinutes: number; // Manually recorded outdoor exploration time
  screenTimeMinutes: number; // Measured app interaction minutes
  measuredInteractionSeconds?: number; // Exact measured seconds spent in app during capture/investigation
  aiAnalysis: AIHypothesisResult;
  evidenceTrace: EvidenceTraceResult | null;
  syncStatus: 'synced' | 'pending_online_trace' | 'sync_failed';
  sharedToCommunityCluster?: boolean;
}

export interface WeeklyTouchGrassStats {
  explorationsCount: number;
  totalMinutesOutside: number;
  measuredAppMinutes: number;
  screenFreeRatio: number;
  discoveriesCount: number;
  evidenceTrailsCreated: number;
}

export type SimulationPresetId =
  | 'indian_roller'
  | 'showy_milkweed'
  | 'stone_milepost'
  | 'golden_chanterelle';

export interface DiscoveryMission {
  id: string;
  title: string;
  category: ObservationCategory;
  habitatTag: string;
  estimatedOutdoorMinutes: number;
  promptHint: string;
  whatToLookFor: string[];
  samplePresetId: SimulationPresetId;
}

export interface CommunityCluster {
  id: string;
  areaName: string;
  regionLabel: string;
  category: ObservationCategory;
  recentSightingsCount: number;
  dominantSpeciesOrSubject: string;
  topVerifiedTrait: string;
  averageConfidence: number;
  lastUpdated: string;
  sampleNotes: string[];
}

export interface EvidenceAnswer {
  question: string;
  answerText: string;
  citedSources: { sourceName: string; url: string; excerpt: string }[];
  hasSufficientEvidence: boolean;
  followUpFieldTip: string;
}
