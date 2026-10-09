import {
  answerEvidenceQuestion,
  buildClaimEvolutionTimeline,
  calculateDomainAuthorityScore,
  calculateEvidenceQuality,
  detectEvidenceConflicts,
} from './processor';
import { AIHypothesisResult, EvidenceSourceCard, FieldExploration } from '../../types/traceback';

export interface DiagnosticTestResult {
  name: string;
  passed: boolean;
  details: string;
}

const mockHypothesis: AIHypothesisResult = {
  possibleIdentification: 'Indian Roller',
  scientificOrFormalName: 'Coracias benghalensis',
  category: 'Bird',
  confidence: 82,
  characteristics: ['Vibrant blue wings', 'Orange-brown chest', 'Stout dark beak'],
  keywords: ['Indian Roller', 'Coracias benghalensis', 'blue wings'],
  searchQueries: ['Indian Roller identification', 'Indian Roller habitat'],
  modelUsed: 'Gemma 3 4B Vision (Open-Weight)',
  analyzedOffline: true,
  engineSource: 'browser_open_weight_pipeline',
  hypothesisDisclaimer: 'Local AI hypothesis — not guaranteed truth.',
  analyzedAt: 'Oct 8, 2026',
  recommendedFieldChecks: ['Check subterminal tail band in flight'],
};

const mockSources: EvidenceSourceCard[] = [
  {
    id: 's1',
    sourceName: 'eBird — Cornell Lab of Ornithology',
    domain: 'ebird.org',
    title: 'Indian Roller Identification',
    url: 'https://ebird.org/species/indrol',
    date: 'Updated Mar 14, 2026',
    isoDate: '2026-03-14',
    excerpt: 'Stocky roller with cerulean blue wings and rufous breast.',
    relevanceScore: 95,
    queryUsed: 'Indian Roller identification',
    habitatClaim: 'Resident in open agricultural areas.',
  },
  {
    id: 's2',
    sourceName: 'IUCN Red List',
    domain: 'iucnredlist.org',
    title: 'Coracias benghalensis Assessment',
    url: 'https://www.iucnredlist.org/species/22682860/155479619',
    date: 'Assessed Oct 12, 2024',
    isoDate: '2024-10-12',
    excerpt: 'Diagnostic blue remiges and ochre mantle.',
    relevanceScore: 88,
    queryUsed: 'Indian Roller habitat',
    habitatClaim: 'Found in permanent inland wetlands and marshes.',
  },
];

export function runTraceBackVerificationSuite(): DiagnosticTestResult[] {
  const results: DiagnosticTestResult[] = [];

  // Test 1: Deterministic Evidence Quality Meter Scoring
  const conflict = detectEvidenceConflicts(mockSources, 'Indian Roller', false);
  const quality = calculateEvidenceQuality(mockSources, mockHypothesis, conflict);
  const authScore = calculateDomainAuthorityScore('ebird.org');
  results.push({
    name: 'Evidence Quality Meter (Deterministic Authority & Relevance)',
    passed:
      authScore === 92 &&
      quality.sourceQuality > 80 &&
      quality.evidenceRelevance > 85 &&
      quality.limitations.length > 0 &&
      !quality.isWeakOrInsufficient,
    details: `Authority=${authScore}%, Quality=${quality.sourceQuality}%, Relevance=${quality.evidenceRelevance}%, Limitations=${quality.limitations.length}`,
  });

  // Test 2: Conflicting Claims Detector
  const forcedConflict = detectEvidenceConflicts(mockSources, 'Indian Roller', true);
  results.push({
    name: 'Evidence Conflict Detector (Disagreement & Source Links)',
    passed:
      forcedConflict.detected === true &&
      Boolean(forcedConflict.disagreementTopic) &&
      forcedConflict.sourceAUrl.startsWith('https://') &&
      forcedConflict.sourceBUrl.startsWith('https://') &&
      Boolean(forcedConflict.unresolvedUncertainty),
    details: `Detected="${forcedConflict.disagreementTopic}" with linked sources (${forcedConflict.sourceAName} vs ${forcedConflict.sourceBName})`,
  });

  // Test 3: Claim Evolution Timeline & Earliest Discoverable Mention
  const evolution = buildClaimEvolutionTimeline(mockSources, forcedConflict);
  results.push({
    name: 'Claim Evolution Timeline (Chronological Sort & Earliest Mention)',
    passed:
      evolution.length === 2 &&
      evolution[0].isoDate === '2024-10-12' &&
      evolution[0].isEarliestDiscoverableMention === true &&
      evolution[0].evolutionRole === 'Earliest Discoverable Mention' &&
      evolution[1].isEarliestDiscoverableMention === false,
    details: `Earliest="${evolution[0]?.sourceName} (${evolution[0]?.isoDate})" -> Latest="${evolution[1]?.sourceName} (${evolution[1]?.isoDate})"`,
  });

  // Test 4: Insufficient Evidence & Failed / Empty API Response Handling
  const emptyConflict = detectEvidenceConflicts([], 'Unknown Specimen', false);
  const emptyQuality = calculateEvidenceQuality([], mockHypothesis, emptyConflict);
  results.push({
    name: 'Failed / Empty Search & Insufficient Evidence Safeguard',
    passed:
      emptyQuality.isWeakOrInsufficient === true &&
      emptyQuality.sourceAgreement === 0 &&
      emptyQuality.whyThisScore.includes('Not enough evidence found'),
    details: `Empty sources handled safely: Confidence=${emptyQuality.overallTraceConfidence}% (isWeakOrInsufficient=true)`,
  });

  // Test 5: Ask the Evidence Source-Grounded Q&A & Offline Pending Guard
  const offlineExp: FieldExploration = {
    id: 'test-offline-1',
    passportId: 'TB-2026-TEST',
    title: 'Indian Roller',
    category: 'Bird',
    observationText: 'Blue wings near lake',
    location: 'Lake',
    observedDate: 'Oct 8, 2026',
    imageUrl: '',
    screenFreeMinutes: 35,
    screenTimeMinutes: 2,
    aiAnalysis: mockHypothesis,
    evidenceTrace: null,
    syncStatus: 'pending_online_trace',
  };
  const offlineAnswer = answerEvidenceQuestion('What supports this identification?', offlineExp);
  results.push({
    name: 'Offline Queueing & Ask-the-Evidence Insufficient Guard',
    passed:
      offlineExp.syncStatus === 'pending_online_trace' &&
      offlineAnswer.hasSufficientEvidence === false &&
      offlineAnswer.citedSources.length === 0,
    details: `Offline observation queued safely; Q&A refuses to fabricate citations when offline.`,
  });

  return results;
}
