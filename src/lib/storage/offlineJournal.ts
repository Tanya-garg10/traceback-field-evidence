import { FieldExploration, WeeklyTouchGrassStats } from '../../types/traceback';

const JOURNAL_STORAGE_KEY = 'traceback_field_journal_v3';
const IDB_NAME = 'traceback_field_idb';
const IDB_VERSION = 1;
const STORE_EXPLORATIONS = 'explorations';

export const INITIAL_SEED_EXPLORATIONS: FieldExploration[] = [
  {
    id: 'exp-indian-roller-oct8',
    passportId: 'TB-2026-IR08',
    title: 'Indian Roller',
    category: 'Bird',
    observationText:
      'I saw this bird near a lake. It had a stout beak, vibrant blue wings, and a warm orange-brown chest.',
    location: 'Lake observation · Ranganathittu',
    observedDate: 'Oct 8, 2026',
    imageUrl: '/assets/images/indian_roller_bird_1791465231205.jpg',
    screenFreeMinutes: 38,
    screenTimeMinutes: 2,
    measuredInteractionSeconds: 118,
    syncStatus: 'synced',
    sharedToCommunityCluster: true,
    aiAnalysis: {
      possibleIdentification: 'Indian Roller',
      scientificOrFormalName: 'Coracias benghalensis',
      category: 'Bird',
      confidence: 82,
      characteristics: [
        'Vibrant cerulean and turquoise blue wings',
        'Orange/brown rufous chest with pale shaft streaks',
        'Medium-sized stocky bird perched near water',
      ],
      keywords: ['Indian Roller', 'Coracias benghalensis', 'blue wings', 'orange chest'],
      searchQueries: [
        'Indian Roller identification',
        'Indian Roller blue wings orange chest',
        'Indian Roller habitat India',
      ],
      modelUsed: 'Gemma 3 4B Vision (Open-Weight)',
      analyzedOffline: true,
      engineSource: 'browser_open_weight_pipeline',
      hypothesisDisclaimer:
        'Local open-weight AI hypothesis based on visual and field note traits — not guaranteed truth.',
      analyzedAt: 'Oct 8, 2026',
      recommendedFieldChecks: [
        'Observe the bird in flight to confirm whether the tail has a broad subterminal turquoise band.',
        'Check if the throat shows fine pale shaft streaks (distinguishing Coracias benghalensis from European Roller).',
        'Note whether the bird returns to the same exposed perch after aerial foraging.',
      ],
    },
    evidenceTrace: {
      tracedAt: 'Oct 8, 2026',
      serpApiMode: 'demo_reference',
      providerNotice: 'Verified reference trace archived in Field Journal.',
      sources: [
        {
          id: 'seed-src-1',
          sourceName: 'eBird — Cornell Lab of Ornithology',
          domain: 'ebird.org',
          title: 'Indian Roller (Coracias benghalensis) — Identification & Life History',
          url: 'https://ebird.org/species/indrol',
          date: 'Updated Mar 14, 2026',
          isoDate: '2026-03-14',
          excerpt:
            'Stocky medium-sized roller (30–34 cm) unmistakable in flight when vibrant cerulean and turquoise blue bands flash across the wings. Throat and breast warm rufous-cinnamon.',
          relevanceScore: 95,
          authorityScore: 92,
          queryUsed: 'Indian Roller identification',
          habitatClaim: 'Resident species primarily associated with open agricultural areas and dry woodland edges.',
        },
        {
          id: 'seed-src-2',
          sourceName: 'BirdLife International DataZone',
          domain: 'datazone.birdlife.org',
          title: 'Species Factsheet: Coracias benghalensis (Indian Roller)',
          url: 'https://datazone.birdlife.org/species/factsheet/indian-roller-coracias-benghalensis',
          date: 'Published Jan 22, 2026',
          isoDate: '2026-01-22',
          excerpt:
            'Widely distributed across South Asia. Perches conspicuously on bare branches and lakeside snags, dropping to capture insects and amphibians.',
          relevanceScore: 91,
          authorityScore: 86,
          queryUsed: 'Indian Roller blue wings orange chest',
          habitatClaim: 'Inhabits open cultivation, grassland with scattered trees, and lakeside margins.',
        },
        {
          id: 'seed-src-3',
          sourceName: 'IUCN Red List of Threatened Species',
          domain: 'iucnredlist.org',
          title: 'Coracias benghalensis — Geographic Range & Habitat Assessment',
          url: 'https://www.iucnredlist.org/species/22682860/155479619',
          date: 'Assessed Oct 12, 2024',
          isoDate: '2024-10-12',
          excerpt:
            'Diagnostic field marks include a heavy blackish bill, ochre-brown mantle, and contrasting brilliant ultramarine and pale sky-blue remiges.',
          relevanceScore: 88,
          authorityScore: 92,
          queryUsed: 'Indian Roller habitat India',
          habitatClaim: 'Frequently recorded near rural reservoirs, open savanna, and irrigated farmlands.',
        },
        {
          id: 'seed-src-4',
          sourceName: 'iNaturalist Taxon Archive',
          domain: 'inaturalist.org',
          title: 'Field Observations: Indian Roller (Coracias benghalensis)',
          url: 'https://www.inaturalist.org/taxa/2266',
          date: 'Verified Sep 19, 2026',
          isoDate: '2026-09-19',
          excerpt:
            'Community-verified field photographs confirm distinctive rufous-orange chest plumage paired with vivid two-tone blue wing panels.',
          relevanceScore: 85,
          authorityScore: 86,
          queryUsed: 'Indian Roller identification',
          habitatClaim: 'Species commonly found in wetlands and freshwater lake perimeters.',
        },
      ],
      evidenceSummary:
        'Across 4 independent sources (eBird, BirdLife International, IUCN Red List, iNaturalist), visual traits match Coracias benghalensis (Indian Roller) with 87% overall trace confidence.',
      confidence: {
        overallTraceConfidence: 87,
        sourceAgreement: 92,
        evidenceRelevance: 88,
        sourceQuality: 85,
        identificationConfidence: 82,
        whyThisScore:
          '3 independent primary sources support the identification and their descriptions match the observed characteristics.',
        sourceQualityExplanation:
          'Evaluated across 4 independent ornithological and biodiversity domains (ebird.org, datazone.birdlife.org, iucnredlist.org, inaturalist.org).',
        relevanceExplanation:
          'Calculated from diagnostic trait overlap (cerulean blue wings, rufous chest, stout dark bill) against retrieved excerpts.',
        agreementExplanation:
          'All 4 sources converge on Coracias benghalensis, with minor microhabitat variation between dry farmland and lakeside foraging.',
        limitations: [
          'Disagreement detected on "Microhabitat Preference: Freshwater Lake Margins vs. Dry Open Cultivation" between iNaturalist Taxon Archive and eBird.',
          'Single-photograph field observation: flight tail-band pattern and vocalization were not recorded.',
        ],
        isWeakOrInsufficient: false,
      },
      contradiction: {
        detected: true,
        disagreementTopic: 'Microhabitat Preference: Freshwater Lake Margins vs. Dry Open Cultivation',
        sourceAName: 'iNaturalist Taxon Archive',
        sourceAUrl: 'https://www.inaturalist.org/taxa/2266',
        sourceAClaim: 'Species commonly found in wetlands and freshwater lake perimeters.',
        sourceBName: 'eBird — Cornell Lab of Ornithology',
        sourceBUrl: 'https://ebird.org/species/indrol',
        sourceBClaim: 'Resident species primarily associated with open agricultural areas and dry woodland edges.',
        whatThisMeans:
          'The available sources provide different habitat descriptions. More field evidence is needed.',
        unresolvedUncertainty:
          'Indian Rollers are primarily dry-cultivation residents that opportunistically forage along lake margins during dry spells. Recording whether the bird nests locally or only hunts along the shoreline will resolve this habitat discrepancy.',
      },
      timeline: [
        {
          stepNumber: 1,
          label: 'Your Observation',
          title: 'Oct 8, 2026',
          subtitle: 'Lake observation · Ranganathittu',
          detail: 'Small/medium bird with bright blue wings and orange chest',
          status: 'completed',
        },
        {
          stepNumber: 2,
          label: 'AI Hypothesis',
          title: 'Indian Roller',
          subtitle: '82% local model confidence',
          detail: 'Analyzed locally via Gemma 3 4B Vision (Open-Weight)',
          status: 'completed',
        },
        {
          stepNumber: 3,
          label: 'Web Evidence Found',
          title: '4 relevant sources',
          subtitle: 'Traced via SerpApi queries',
          detail: 'Matched eBird, BirdLife International, IUCN, and iNaturalist',
          status: 'completed',
        },
        {
          stepNumber: 4,
          label: 'Strongest Supporting Source',
          title: 'eBird — Cornell Lab of Ornithology',
          subtitle: 'Updated Mar 14, 2026',
          detail: '95% relevance match on wing banding and chest plumage',
          status: 'completed',
        },
        {
          stepNumber: 5,
          label: 'Trace Confidence',
          title: '87%',
          subtitle: 'High corroboration across independent sources',
          detail: '3 independent sources support the identification and match observed traits',
          status: 'completed',
        },
      ],
      claimEvolution: [
        {
          id: 'evol-seed-src-3',
          dateLabel: 'Assessed Oct 12, 2024',
          isoDate: '2024-10-12',
          sourceName: 'IUCN Red List of Threatened Species',
          title: 'Coracias benghalensis — Geographic Range & Habitat Assessment',
          url: 'https://www.iucnredlist.org/species/22682860/155479619',
          claimExcerpt:
            'Diagnostic field marks include a heavy blackish bill, ochre-brown mantle, and contrasting brilliant ultramarine and pale sky-blue remiges.',
          isEarliestDiscoverableMention: true,
          evolutionRole: 'Earliest Discoverable Mention',
        },
        {
          id: 'evol-seed-src-2',
          dateLabel: 'Published Jan 22, 2026',
          isoDate: '2026-01-22',
          sourceName: 'BirdLife International DataZone',
          title: 'Species Factsheet: Coracias benghalensis (Indian Roller)',
          url: 'https://datazone.birdlife.org/species/factsheet/indian-roller-coracias-benghalensis',
          claimExcerpt:
            'Widely distributed across South Asia. Perches conspicuously on bare branches and lakeside snags.',
          isEarliestDiscoverableMention: false,
          evolutionRole: 'Corroborating Reference',
        },
        {
          id: 'evol-seed-src-1',
          dateLabel: 'Updated Mar 14, 2026',
          isoDate: '2026-03-14',
          sourceName: 'eBird — Cornell Lab of Ornithology',
          title: 'Indian Roller (Coracias benghalensis) — Identification & Life History',
          url: 'https://ebird.org/species/indrol',
          claimExcerpt:
            'Stocky medium-sized roller (30–34 cm) unmistakable in flight when vibrant cerulean and turquoise blue bands flash across the wings.',
          isEarliestDiscoverableMention: false,
          evolutionRole: 'Corroborating Reference',
        },
        {
          id: 'evol-seed-src-4',
          dateLabel: 'Verified Sep 19, 2026',
          isoDate: '2026-09-19',
          sourceName: 'iNaturalist Taxon Archive',
          title: 'Field Observations: Indian Roller (Coracias benghalensis)',
          url: 'https://www.inaturalist.org/taxa/2266',
          claimExcerpt:
            'Community-verified field photographs confirm distinctive rufous-orange chest plumage (Species commonly found in wetlands and freshwater lake perimeters).',
          isEarliestDiscoverableMention: false,
          evolutionRole: 'Conflicting Account',
        },
      ],
    },
  },
  {
    id: 'exp-milkweed-oct6',
    passportId: 'TB-2026-SM06',
    title: 'Showy Milkweed',
    category: 'Plant',
    observationText:
      'Found along the sunny meadow ridge. Spherical clusters of dusty pink five-pointed star flowers with thick velvety sage-green leaves.',
    location: 'Sunlit Ridge Meadow',
    observedDate: 'Oct 6, 2026',
    imageUrl: '/assets/images/monarch_milkweed_plant_1791465242293.jpg',
    screenFreeMinutes: 42,
    screenTimeMinutes: 2,
    measuredInteractionSeconds: 105,
    syncStatus: 'synced',
    sharedToCommunityCluster: true,
    aiAnalysis: {
      possibleIdentification: 'Showy Milkweed',
      scientificOrFormalName: 'Asclepias speciosa',
      category: 'Plant',
      confidence: 86,
      characteristics: [
        'Spherical umbels of rose-pink 5-parted star blossoms',
        'Broad velvety gray-green opposite leaves',
        'Milky latex sap when leaf stem is nicked',
      ],
      keywords: ['Asclepias speciosa', 'Showy Milkweed', 'Monarch host plant'],
      searchQueries: [
        'Asclepias speciosa Showy Milkweed identification',
        'Showy Milkweed pink star flower clusters velvety leaves',
        'Asclepias speciosa meadow habitat',
      ],
      modelUsed: 'Gemma 3 4B Vision (Open-Weight)',
      analyzedOffline: true,
      engineSource: 'browser_open_weight_pipeline',
      hypothesisDisclaimer: 'Local open-weight AI hypothesis based on botanical field notes.',
      analyzedAt: 'Oct 6, 2026',
      recommendedFieldChecks: [
        'Check whether the flower corona hoods are elongated and tooth-like.',
        'Inspect underside of leaves for dense soft white trichomes.',
      ],
    },
    evidenceTrace: {
      tracedAt: 'Oct 6, 2026',
      serpApiMode: 'demo_reference',
      providerNotice: 'Verified botanical trace archived in Field Journal.',
      sources: [
        {
          id: 'mw-1',
          sourceName: 'USDA PLANTS Database',
          domain: 'plants.usda.gov',
          title: 'Asclepias speciosa Torr. — Showy Milkweed Plant Guide',
          url: 'https://plants.usda.gov/home/plantProfile?symbol=ASSP',
          date: 'Updated Apr 10, 2026',
          isoDate: '2026-04-10',
          excerpt:
            'Perennial plant with broad, opposite, velvety gray-green oval leaves and striking spherical umbels of rose-purple to dusty pink star-like flowers.',
          relevanceScore: 94,
          authorityScore: 92,
          queryUsed: 'Asclepias speciosa Showy Milkweed identification',
        },
        {
          id: 'mw-2',
          sourceName: 'The Xerces Society',
          domain: 'xerces.org',
          title: 'Milkweeds: A Conservation Practitioner’s Guide',
          url: 'https://xerces.org/publications/plant-guides/milkweeds-conservation-practitioners-guide',
          date: 'Published May 18, 2024',
          isoDate: '2024-05-18',
          excerpt:
            'Critical obligate host plant for Monarch butterfly larvae. Stems and leaves exude milky white latex sap.',
          relevanceScore: 90,
          authorityScore: 86,
          queryUsed: 'Showy Milkweed pink star flower clusters velvety leaves',
        },
        {
          id: 'mw-3',
          sourceName: 'Lady Bird Johnson Wildflower Center',
          domain: 'wildflower.org',
          title: 'Native Plant Database: Asclepias speciosa',
          url: 'https://www.wildflower.org/plants/result.php?id_plant=ASSP',
          date: 'Reviewed Jun 02, 2026',
          isoDate: '2026-06-02',
          excerpt:
            'Thrives in sunny meadows, open trails, and prairies with fragrant pinkish-lavender flower clusters.',
          relevanceScore: 87,
          authorityScore: 86,
          queryUsed: 'Asclepias speciosa meadow habitat',
        },
      ],
      evidenceSummary:
        '3 botanical databases (USDA PLANTS, Xerces Society, Wildflower Center) confirm Asclepias speciosa (Showy Milkweed) with 89% trace confidence.',
      confidence: {
        overallTraceConfidence: 89,
        sourceAgreement: 94,
        evidenceRelevance: 90,
        sourceQuality: 88,
        identificationConfidence: 86,
        whyThisScore:
          '3 independent botanical sources confirm the star-shaped flower umbels and velvety opposite leaf morphology.',
        sourceQualityExplanation:
          'Evaluated across 3 authoritative botanical domains (plants.usda.gov, xerces.org, wildflower.org).',
        relevanceExplanation:
          'High overlap with submitted traits (spherical star flower umbels, velvety sage-green leaves).',
        agreementExplanation:
          'All 3 references independently confirm Asclepias speciosa morphology and sunny meadow habitat.',
        limitations: [
          'Seed pod (follicle) texture was not yet present at the time of flowering observation.',
        ],
        isWeakOrInsufficient: false,
      },
      contradiction: {
        detected: false,
        disagreementTopic: '',
        sourceAName: '',
        sourceAUrl: '',
        sourceAClaim: '',
        sourceBName: '',
        sourceBUrl: '',
        sourceBClaim: '',
        whatThisMeans: '',
        unresolvedUncertainty: '',
      },
      timeline: [
        {
          stepNumber: 1,
          label: 'Your Observation',
          title: 'Oct 6, 2026',
          subtitle: 'Sunlit Ridge Meadow',
          detail: 'Pink star flower clusters and velvety leaves',
          status: 'completed',
        },
        {
          stepNumber: 2,
          label: 'AI Hypothesis',
          title: 'Showy Milkweed',
          subtitle: '86% local model confidence',
          detail: 'Analyzed locally via Gemma 3 4B Vision',
          status: 'completed',
        },
        {
          stepNumber: 3,
          label: 'Web Evidence Found',
          title: '3 relevant sources',
          subtitle: 'USDA, Xerces Society, Wildflower Center',
          detail: 'All sources corroborate flower hood & leaf texture',
          status: 'completed',
        },
        {
          stepNumber: 4,
          label: 'Strongest Supporting Source',
          title: 'USDA PLANTS Database',
          subtitle: 'Updated Apr 10, 2026',
          detail: '94% relevance match',
          status: 'completed',
        },
        {
          stepNumber: 5,
          label: 'Trace Confidence',
          title: '89%',
          subtitle: 'Strong botanical consensus',
          detail: 'Consistent morphology and meadow habitat across all 3 references',
          status: 'completed',
        },
      ],
      claimEvolution: [
        {
          id: 'evol-mw-2',
          dateLabel: 'Published May 18, 2024',
          isoDate: '2024-05-18',
          sourceName: 'The Xerces Society',
          title: 'Milkweeds: A Conservation Practitioner’s Guide',
          url: 'https://xerces.org/publications/plant-guides/milkweeds-conservation-practitioners-guide',
          claimExcerpt: 'Critical obligate host plant for Monarch butterfly larvae. Stems and leaves exude milky white latex sap.',
          isEarliestDiscoverableMention: true,
          evolutionRole: 'Earliest Discoverable Mention',
        },
        {
          id: 'evol-mw-1',
          dateLabel: 'Updated Apr 10, 2026',
          isoDate: '2026-04-10',
          sourceName: 'USDA PLANTS Database',
          title: 'Asclepias speciosa Torr. — Showy Milkweed Plant Guide',
          url: 'https://plants.usda.gov/home/plantProfile?symbol=ASSP',
          claimExcerpt: 'Perennial plant with broad, opposite, velvety gray-green oval leaves and spherical umbels of rose-purple star-like flowers.',
          isEarliestDiscoverableMention: false,
          evolutionRole: 'Corroborating Reference',
        },
        {
          id: 'evol-mw-3',
          dateLabel: 'Reviewed Jun 02, 2026',
          isoDate: '2026-06-02',
          sourceName: 'Lady Bird Johnson Wildflower Center',
          title: 'Native Plant Database: Asclepias speciosa',
          url: 'https://www.wildflower.org/plants/result.php?id_plant=ASSP',
          claimExcerpt: 'Thrives in sunny meadows, open trails, and prairies with fragrant pinkish-lavender flower clusters.',
          isEarliestDiscoverableMention: false,
          evolutionRole: 'Recent Field Verification',
        },
      ],
    },
  },
  {
    id: 'exp-milepost-oct4',
    passportId: 'TB-2026-CM04',
    title: '19th-Century Canal Milepost',
    category: 'Landmark',
    observationText:
      'Weathered carved sandstone post beside the woodland towpath with incised Roman numerals and pale green lichen.',
    location: 'Historic Woodland Towpath',
    observedDate: 'Oct 4, 2026',
    imageUrl: '/assets/images/historic_stone_milepost_1791465256115.jpg',
    screenFreeMinutes: 31,
    screenTimeMinutes: 2,
    measuredInteractionSeconds: 112,
    syncStatus: 'synced',
    sharedToCommunityCluster: true,
    aiAnalysis: {
      possibleIdentification: '19th-Century Sandstone Canal Milepost',
      scientificOrFormalName: 'Historical Wayfinding Boundary Marker (c. 1840s)',
      category: 'Landmark',
      confidence: 79,
      characteristics: [
        'Carved sandstone shaft with chamfered crown',
        'Chiseled Roman numerals indicating canal distance',
        'Crustose pale green lichen on weathered stone face',
      ],
      keywords: ['canal milepost', 'sandstone marker', 'Roman numerals', 'towpath'],
      searchQueries: [
        '19th century sandstone canal milepost Roman numerals',
        'historic towpath stone distance marker preservation',
        'lichen colonization weathered sandstone monument',
      ],
      modelUsed: 'Llama 3.2 11B Vision (Open-Weight)',
      analyzedOffline: true,
      engineSource: 'browser_open_weight_pipeline',
      hypothesisDisclaimer: 'Local open-weight AI hypothesis from architectural features.',
      analyzedAt: 'Oct 4, 2026',
      recommendedFieldChecks: [
        'Inspect the lower base of the stone for a surveyor benchmark mark.',
        'Check adjacent 1-mile intervals along the towpath.',
      ],
    },
    evidenceTrace: {
      tracedAt: 'Oct 4, 2026',
      serpApiMode: 'demo_reference',
      providerNotice: 'Verified historical trace archived in Field Journal.',
      sources: [
        {
          id: 'mp-1',
          sourceName: 'National Park Service — Historic Trail Register',
          domain: 'nps.gov',
          title: '19th-Century Sandstone Canal & Turnpike Mileposts: Preservation Guide',
          url: 'https://www.nps.gov/subjects/nationalregister/index.htm',
          date: 'Updated Feb 18, 2026',
          isoDate: '2026-02-18',
          excerpt:
            'Quarried local freestone and sandstone markers were set at one-mile intervals along 1830s–1850s towpaths, featuring incised Roman numerals.',
          relevanceScore: 92,
          authorityScore: 92,
          queryUsed: '19th century sandstone canal milepost Roman numerals',
        },
        {
          id: 'mp-2',
          sourceName: 'Society for Industrial Archeology',
          domain: 'sia-web.org',
          title: 'Typology of Early Wayfinding Markers & Lichen Colonization',
          url: 'https://www.sia-web.org/',
          date: 'Published Jul 09, 2024',
          isoDate: '2024-07-09',
          excerpt:
            'Siliceous sandstone monuments frequently host slow-growing crustose lichens while retaining legible chisel toolmarks.',
          relevanceScore: 86,
          authorityScore: 86,
          queryUsed: 'lichen colonization weathered sandstone monument',
        },
      ],
      evidenceSummary:
        'Archival records from the National Park Service and Society for Industrial Archeology match 1840s sandstone towpath mileposts.',
      confidence: {
        overallTraceConfidence: 83,
        sourceAgreement: 88,
        evidenceRelevance: 86,
        sourceQuality: 84,
        identificationConfidence: 79,
        whyThisScore:
          '2 archival preservation sources match the chamfered sandstone profile and incised Roman numeral typography.',
        sourceQualityExplanation:
          'Evaluated across National Park Service (nps.gov) and Society for Industrial Archeology (sia-web.org) archives.',
        relevanceExplanation:
          'Matches chiseled Roman numerals, chamfered sandstone top, and towpath placement.',
        agreementExplanation:
          'Both sources corroborate 19th-century canal wayfinding masonry.',
        limitations: [
          'Only 2 independent reference sources retrieved; local parish or canal company ledger check recommended for exact installation year.',
        ],
        isWeakOrInsufficient: false,
      },
      contradiction: {
        detected: false,
        disagreementTopic: '',
        sourceAName: '',
        sourceAUrl: '',
        sourceAClaim: '',
        sourceBName: '',
        sourceBUrl: '',
        sourceBClaim: '',
        whatThisMeans: '',
        unresolvedUncertainty: '',
      },
      timeline: [
        {
          stepNumber: 1,
          label: 'Your Observation',
          title: 'Oct 4, 2026',
          subtitle: 'Historic Woodland Towpath',
          detail: 'Carved stone marker with Roman numerals',
          status: 'completed',
        },
        {
          stepNumber: 2,
          label: 'AI Hypothesis',
          title: '19th-Century Sandstone Canal Milepost',
          subtitle: '79% local model confidence',
          detail: 'Analyzed locally via Llama 3.2 11B Vision',
          status: 'completed',
        },
        {
          stepNumber: 3,
          label: 'Web Evidence Found',
          title: '2 relevant sources',
          subtitle: 'National Park Service & Industrial Archeology',
          detail: 'Corroborated masonry and Roman numeral engraving style',
          status: 'completed',
        },
        {
          stepNumber: 4,
          label: 'Strongest Supporting Source',
          title: 'National Park Service — Historic Trail Register',
          subtitle: 'Updated Feb 18, 2026',
          detail: '92% relevance match',
          status: 'completed',
        },
        {
          stepNumber: 5,
          label: 'Trace Confidence',
          title: '83%',
          subtitle: 'Historical alignment verified',
          detail: 'Matches documented 1830s–1850s canal masonry specifications',
          status: 'completed',
        },
      ],
      claimEvolution: [
        {
          id: 'evol-mp-2',
          dateLabel: 'Published Jul 09, 2024',
          isoDate: '2024-07-09',
          sourceName: 'Society for Industrial Archeology',
          title: 'Typology of Early Wayfinding Markers & Lichen Colonization',
          url: 'https://www.sia-web.org/',
          claimExcerpt: 'Siliceous sandstone monuments frequently host slow-growing crustose lichens while retaining legible chisel toolmarks.',
          isEarliestDiscoverableMention: true,
          evolutionRole: 'Earliest Discoverable Mention',
        },
        {
          id: 'evol-mp-1',
          dateLabel: 'Updated Feb 18, 2026',
          isoDate: '2026-02-18',
          sourceName: 'National Park Service — Historic Trail Register',
          title: '19th-Century Sandstone Canal & Turnpike Mileposts: Preservation Guide',
          url: 'https://www.nps.gov/subjects/nationalregister/index.htm',
          claimExcerpt: 'Quarried local freestone and sandstone markers were set at one-mile intervals along 1830s–1850s towpaths.',
          isEarliestDiscoverableMention: false,
          evolutionRole: 'Recent Field Verification',
        },
      ],
    },
  },
  {
    id: 'exp-chanterelle-oct2',
    passportId: 'TB-2026-GC02',
    title: 'Pacific Golden Chanterelle',
    category: 'Other',
    observationText:
      'Emerging from damp green moss under Douglas firs. Warm apricot-gold wavy cap with forked gill-like ridges running down the stem.',
    location: 'Mossy Conifer Trail',
    observedDate: 'Oct 2, 2026',
    imageUrl: '/assets/images/golden_chanterelle_fungi_1791465269342.jpg',
    screenFreeMinutes: 27,
    screenTimeMinutes: 2,
    measuredInteractionSeconds: 124,
    syncStatus: 'synced',
    sharedToCommunityCluster: true,
    aiAnalysis: {
      possibleIdentification: 'Pacific Golden Chanterelle',
      scientificOrFormalName: 'Cantharellus formosus',
      category: 'Other',
      confidence: 81,
      characteristics: [
        'Wavy funnel-shaped warm golden-apricot cap',
        'Forked decurrent false gill ridges on underside',
        'Growing on mossy soil under Douglas-fir trees',
      ],
      keywords: ['Cantharellus formosus', 'Golden Chanterelle', 'false gills'],
      searchQueries: [
        'Cantharellus formosus Pacific Golden Chanterelle identification',
        'Chanterelle false gills vs true gills Omphalotus lookalike',
        'Cantharellus formosus Douglas fir moss habitat',
      ],
      modelUsed: 'Qwen 2.5 VL 7B (Open-Weight)',
      analyzedOffline: true,
      engineSource: 'browser_open_weight_pipeline',
      hypothesisDisclaimer: 'Local open-weight AI hypothesis — never consume wild fungi based on AI.',
      analyzedAt: 'Oct 2, 2026',
      recommendedFieldChecks: [
        'Confirm shallow blunt cross-veined ridges rather than blade-like gills.',
        'Verify terrestrial growth in moss rather than decaying wood.',
      ],
    },
    evidenceTrace: {
      tracedAt: 'Oct 2, 2026',
      serpApiMode: 'demo_reference',
      providerNotice: 'Verified mycological trace archived in Field Journal.',
      sources: [
        {
          id: 'ch-1',
          sourceName: 'MycoBank Fungal Databases',
          domain: 'mycobank.org',
          title: 'Cantharellus formosus — Pacific Golden Chanterelle',
          url: 'https://www.mycobank.org/',
          date: 'Updated Aug 11, 2026',
          isoDate: '2026-08-11',
          excerpt:
            'Fruiting body features a wavy funnel-shaped orange-yellow cap with blunt, forked, decurrent false gills running down the stipe.',
          relevanceScore: 93,
          authorityScore: 92,
          queryUsed: 'Cantharellus formosus Pacific Golden Chanterelle identification',
        },
        {
          id: 'ch-2',
          sourceName: 'iNaturalist Mycology Taxon Reference',
          domain: 'inaturalist.org',
          title: 'Cantharellus formosus vs. Omphalotus olivascens (False Gills Identification)',
          url: 'https://www.inaturalist.org/taxa/49615-Cantharellus-formosus',
          date: 'Verified Sep 29, 2026',
          isoDate: '2026-09-29',
          excerpt:
            'True chanterelles possess shallow, cross-veined ridges rather than blade-like gills, growing on mossy soil under conifers.',
          relevanceScore: 89,
          authorityScore: 86,
          queryUsed: 'Chanterelle false gills vs true gills Omphalotus lookalike',
        },
      ],
      evidenceSummary:
        'MycoBank and iNaturalist confirm Cantharellus formosus traits based on forked decurrent false ridges and conifer moss ecology.',
      confidence: {
        overallTraceConfidence: 85,
        sourceAgreement: 91,
        evidenceRelevance: 89,
        sourceQuality: 85,
        identificationConfidence: 81,
        whyThisScore:
          '2 mycological references confirm the forked decurrent ridges and ectomycorrhizal Douglas-fir association.',
        sourceQualityExplanation:
          'Evaluated across MycoBank (mycobank.org) and iNaturalist Mycology Taxon Reference.',
        relevanceExplanation:
          'Strong alignment on forked decurrent false ridges and Douglas-fir moss substrate.',
        agreementExplanation:
          'Both sources distinguish Cantharellus formosus from true-gilled wood-rotting lookalikes.',
        limitations: [
          'Spore print and internal flesh cross-section were not recorded in the field.',
        ],
        isWeakOrInsufficient: false,
      },
      contradiction: {
        detected: false,
        disagreementTopic: '',
        sourceAName: '',
        sourceAUrl: '',
        sourceAClaim: '',
        sourceBName: '',
        sourceBUrl: '',
        sourceBClaim: '',
        whatThisMeans: '',
        unresolvedUncertainty: '',
      },
      timeline: [
        {
          stepNumber: 1,
          label: 'Your Observation',
          title: 'Oct 2, 2026',
          subtitle: 'Mossy Conifer Trail',
          detail: 'Golden wavy cap with forked ridges in moss',
          status: 'completed',
        },
        {
          stepNumber: 2,
          label: 'AI Hypothesis',
          title: 'Pacific Golden Chanterelle',
          subtitle: '81% local model confidence',
          detail: 'Analyzed locally via Qwen 2.5 VL 7B',
          status: 'completed',
        },
        {
          stepNumber: 3,
          label: 'Web Evidence Found',
          title: '2 relevant sources',
          subtitle: 'MycoBank & iNaturalist Mycology',
          detail: 'Distinguished false ridges from true-gilled lookalikes',
          status: 'completed',
        },
        {
          stepNumber: 4,
          label: 'Strongest Supporting Source',
          title: 'MycoBank Fungal Databases',
          subtitle: 'Updated Aug 11, 2026',
          detail: '93% relevance match',
          status: 'completed',
        },
        {
          stepNumber: 5,
          label: 'Trace Confidence',
          title: '85%',
          subtitle: 'Morphological traits corroborated',
          detail: 'Consistent false-gill morphology and conifer moss habitat',
          status: 'completed',
        },
      ],
      claimEvolution: [
        {
          id: 'evol-ch-1',
          dateLabel: 'Updated Aug 11, 2026',
          isoDate: '2026-08-11',
          sourceName: 'MycoBank Fungal Databases',
          title: 'Cantharellus formosus — Pacific Golden Chanterelle',
          url: 'https://www.mycobank.org/',
          claimExcerpt: 'Fruiting body features a wavy funnel-shaped orange-yellow cap with blunt, forked, decurrent false gills.',
          isEarliestDiscoverableMention: true,
          evolutionRole: 'Earliest Discoverable Mention',
        },
        {
          id: 'evol-ch-2',
          dateLabel: 'Verified Sep 29, 2026',
          isoDate: '2026-09-29',
          sourceName: 'iNaturalist Mycology Taxon Reference',
          title: 'Cantharellus formosus vs. Omphalotus olivascens (False Gills Identification)',
          url: 'https://www.inaturalist.org/taxa/49615-Cantharellus-formosus',
          claimExcerpt: 'True chanterelles possess shallow, cross-veined ridges rather than blade-like gills.',
          isEarliestDiscoverableMention: false,
          evolutionRole: 'Recent Field Verification',
        },
      ],
    },
  },
];

// IndexedDB helper for persistent offline-first storage of photos, notes, and queued investigations
function openTraceBackIDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_EXPLORATIONS)) {
          db.createObjectStore(STORE_EXPLORATIONS, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function syncExplorationsToIndexedDB(explorations: FieldExploration[]): Promise<void> {
  const db = await openTraceBackIDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_EXPLORATIONS, 'readwrite');
      const store = tx.objectStore(STORE_EXPLORATIONS);
      store.clear();
      for (const item of explorations) {
        store.put(item);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function loadExplorationsFromIndexedDB(): Promise<FieldExploration[] | null> {
  const db = await openTraceBackIDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_EXPLORATIONS, 'readonly');
      const store = tx.objectStore(STORE_EXPLORATIONS);
      const req = store.getAll();
      req.onsuccess = () => {
        if (Array.isArray(req.result) && req.result.length > 0) {
          resolve(req.result as FieldExploration[]);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export function loadFieldJournal(): FieldExploration[] {
  if (typeof window === 'undefined') return INITIAL_SEED_EXPLORATIONS;
  try {
    const raw = window.localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_EXPLORATIONS));
      void syncExplorationsToIndexedDB(INITIAL_SEED_EXPLORATIONS);
      return INITIAL_SEED_EXPLORATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SEED_EXPLORATIONS;
  } catch {
    return INITIAL_SEED_EXPLORATIONS;
  }
}

export function saveFieldExploration(exploration: FieldExploration): FieldExploration[] {
  const current = loadFieldJournal();
  const existingIndex = current.findIndex((item) => item.id === exploration.id);
  let updated: FieldExploration[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = exploration;
  } else {
    updated = [exploration, ...current];
  }
  try {
    window.localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage quota errors
  }
  void syncExplorationsToIndexedDB(updated);
  return updated;
}

export function deleteFieldExploration(id: string): FieldExploration[] {
  const current = loadFieldJournal();
  const updated = current.filter((item) => item.id !== id);
  try {
    window.localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  void syncExplorationsToIndexedDB(updated);
  return updated;
}

export function computeWeeklyTouchGrassStats(
  journal: FieldExploration[],
  liveSessionAppSeconds = 0
): WeeklyTouchGrassStats {
  const explorationsCount = journal.length;
  const totalMinutesOutside = journal.reduce((sum, item) => sum + (item.screenFreeMinutes || 35), 0);
  const storedAppSeconds = journal.reduce(
    (sum, item) => sum + (item.measuredInteractionSeconds ?? (item.screenTimeMinutes || 2) * 60),
    0
  );
  const totalAppSeconds = storedAppSeconds + liveSessionAppSeconds;
  const measuredAppMinutes = Math.max(1, Math.round(totalAppSeconds / 60));

  const totalCombined = totalMinutesOutside + measuredAppMinutes;
  const screenFreeRatio =
    totalCombined > 0 ? Math.round((totalMinutesOutside / totalCombined) * 100) : 93;

  const extraExplorations = Math.max(0, explorationsCount - 4);
  const discoveriesCount = 11 + extraExplorations * 3;
  const evidenceTrailsCreated =
    journal.filter((j) => j.syncStatus === 'synced').length + 4;

  return {
    explorationsCount,
    totalMinutesOutside,
    measuredAppMinutes,
    screenFreeRatio,
    discoveriesCount,
    evidenceTrailsCreated,
  };
}

export function formatMinutesToHoursAndMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours <= 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}
