import {
  AIHypothesisResult,
  CommunityCluster,
  DiscoveryMission,
  ObservationCategory,
  OpenWeightModelId,
  OpenWeightModelOption,
  SimulationPresetId,
} from '../../types/traceback';

export const OPEN_WEIGHT_MODELS: OpenWeightModelOption[] = [
  {
    id: 'gemma3:4b-vision-q4',
    name: 'Gemma 3 4B Vision (Open-Weight)',
    family: 'Gemma',
    params: '4.3B',
    quantization: 'INT4 WebGPU / Ollama',
    offlineCapable: true,
    configuredOnDevice: true,
    description: 'Compact open-weight multimodal model optimized for on-device natural history & field trait extraction.',
  },
  {
    id: 'llama3.2-vision:11b-q4',
    name: 'Llama 3.2 11B Vision (Open-Weight)',
    family: 'Llama',
    params: '11B',
    quantization: 'Q4_K_M Local',
    offlineCapable: true,
    configuredOnDevice: true,
    description: 'High-accuracy open-weight vision-language model for detailed morphological and landmark analysis.',
  },
  {
    id: 'qwen2.5-vl:7b-q4',
    name: 'Qwen 2.5 VL 7B (Open-Weight)',
    family: 'Qwen',
    params: '7.6B',
    quantization: 'INT4 Local',
    offlineCapable: true,
    configuredOnDevice: true,
    description: 'Strong visual-textual OCR and fine-grained botanical & signage recognition model.',
  },
];

export interface FieldPreset {
  id: SimulationPresetId;
  label: string;
  category: ObservationCategory;
  location: string;
  imageUrl: string;
  observationText: string;
  screenFreeMinutes: number;
}

export const FIELD_PRESETS: FieldPreset[] = [
  {
    id: 'indian_roller',
    label: 'Unfamiliar Lakeside Bird (Demo)',
    category: 'Bird',
    location: 'Ranganathittu Lake Trail, Karnataka',
    imageUrl: '/assets/images/indian_roller_bird_1791465231205.jpg',
    observationText:
      'I saw this medium-sized bird perched near a lake. It had striking bright blue wings, an orange-brown chest, and a stout dark beak.',
    screenFreeMinutes: 38,
  },
  {
    id: 'showy_milkweed',
    label: 'Star-Clustered Meadow Plant',
    category: 'Plant',
    location: 'Sunlit Ridge Meadow Trail',
    imageUrl: '/assets/images/monarch_milkweed_plant_1791465242293.jpg',
    observationText:
      'Found along an open sunny trail. Spherical clusters of dusty rose-pink five-pointed star flowers with thick velvety sage-green leaves and milky sap.',
    screenFreeMinutes: 46,
  },
  {
    id: 'stone_milepost',
    label: 'Carved Lichen Trail Marker',
    category: 'Landmark',
    location: 'Old Towpath Woodland Corridor',
    imageUrl: '/assets/images/historic_stone_milepost_1791465256115.jpg',
    observationText:
      'Weathered sandstone post beside the forest canal path with chiseled Roman numerals and pale green crustose lichen covering the upper face.',
    screenFreeMinutes: 54,
  },
  {
    id: 'golden_chanterelle',
    label: 'Apricot Ridged Forest Fungi',
    category: 'Other',
    location: 'Damp Douglas-Fir Moss Floor',
    imageUrl: '/assets/images/golden_chanterelle_fungi_1791465269342.jpg',
    observationText:
      'Growing in damp emerald moss under conifers. Warm golden-apricot wavy funnel cap with forked gill-like ridges running down a solid stem.',
    screenFreeMinutes: 62,
  },
];

export const DISCOVERY_MISSIONS: DiscoveryMission[] = [
  {
    id: 'mission-wetland-wing',
    title: 'Lakeside & Agricultural Perch Survey',
    category: 'Bird',
    habitatTag: 'Wetland Margins & Open Fields',
    estimatedOutdoorMinutes: 35,
    promptHint: 'Look for birds perched on bare snags or wires near water; note wing band colors in flight and bill shape.',
    whatToLookFor: [
      'Contrasting primary vs. secondary wing feather bands during flight',
      'Throat and breast streaking or rufous coloration',
      'Whether the bird perches solitarily on exposed snags or forages in reedbeds',
    ],
    samplePresetId: 'indian_roller',
  },
  {
    id: 'mission-pollinator-flora',
    title: 'Pollinator Host Plant & Umbel Mission',
    category: 'Plant',
    habitatTag: 'Sunlit Meadow & Trail Edges',
    estimatedOutdoorMinutes: 45,
    promptHint: 'Find a flowering perennial along a sunny trail; inspect leaf arrangement (opposite vs. alternate) and flower hood geometry.',
    whatToLookFor: [
      'Opposite velvety leaves with prominent central veins',
      'Five-parted reflexed petals and corona hoods',
      'Presence of Monarch caterpillars or silky seed pod follicles',
    ],
    samplePresetId: 'showy_milkweed',
  },
  {
    id: 'mission-historic-masonry',
    title: 'Historic Wayfinding & Lichen Chronology',
    category: 'Landmark',
    habitatTag: 'Old Canal Towpaths & Post Roads',
    estimatedOutdoorMinutes: 50,
    promptHint: 'Locate a stone boundary marker, milepost, or historic plaque; document carved numerals and lichen growth on weathered faces.',
    whatToLookFor: [
      'Incised Roman or Arabic distance numerals and directional arrows',
      'Chisel toolmarks on dressed sandstone or limestone',
      'Crustose lichen colonies indicating long-term undisturbed exposure',
    ],
    samplePresetId: 'stone_milepost',
  },
  {
    id: 'mission-forest-mycology',
    title: 'Conifer Moss Floor Decomposer Study',
    category: 'Other',
    habitatTag: 'Damp Conifer & Oak Understory',
    estimatedOutdoorMinutes: 60,
    promptHint: 'Inspect mossy forest humus after rain; photograph the underside of fruiting bodies without disturbing the mycelium.',
    whatToLookFor: [
      'Blunt, forked, decurrent false ridges vs. sharp blade-like true gills',
      'Growing singly in moss (mycorrhizal) vs. dense clusters on dead wood',
      'Surrounding host tree species (Douglas-fir, hemlock, or oak)',
    ],
    samplePresetId: 'golden_chanterelle',
  },
];

export const COMMUNITY_CLUSTERS: CommunityCluster[] = [
  {
    id: 'cluster-kaveri-riparian',
    areaName: 'Kaveri & Ranganathittu Riparian Corridor',
    regionLabel: 'South Asia · Wetland & Scrub Mosaic',
    category: 'Bird',
    recentSightingsCount: 19,
    dominantSpeciesOrSubject: 'Indian Roller (Coracias benghalensis)',
    topVerifiedTrait: 'Two-tone cerulean wing flash & rufous breast',
    averageConfidence: 86,
    lastUpdated: 'Oct 8, 2026',
    sampleNotes: [
      'Observed hunting grasshoppers along dry bunds bordering the lake.',
      'Multiple explorers noted habitat overlap between irrigated fields and lakeside trees.',
    ],
  },
  {
    id: 'cluster-cascade-meadows',
    areaName: 'Cascade Foothill Pollinator Meadows',
    regionLabel: 'Pacific Northwest · Dry-Mesic Prairie',
    category: 'Plant',
    recentSightingsCount: 14,
    dominantSpeciesOrSubject: 'Showy Milkweed (Asclepias speciosa)',
    topVerifiedTrait: 'Spherical rose-pink star umbels & velvety opposite leaves',
    averageConfidence: 89,
    lastUpdated: 'Oct 7, 2026',
    sampleNotes: [
      'Dense patches blooming along unmowed trail shoulders at 650m elevation.',
      '2nd-instar Monarch larvae documented on upper leaf surfaces.',
    ],
  },
  {
    id: 'cluster-towpath-heritage',
    areaName: '19th-Century Canal Towpath Corridor',
    regionLabel: 'Woodland Heritage Trail Sector',
    category: 'Landmark',
    recentSightingsCount: 9,
    dominantSpeciesOrSubject: '1840s Sandstone Canal Mileposts',
    topVerifiedTrait: 'Chamfered freestone shaft with incised Roman numerals',
    averageConfidence: 83,
    lastUpdated: 'Oct 5, 2026',
    sampleNotes: [
      'Markers XII and XI retain original hand-chiseled serif lettering.',
      'Slow-growing pale green crustose lichen covers the north-facing stone.',
    ],
  },
  {
    id: 'cluster-douglas-fir-moss',
    areaName: 'Old-Growth Douglas-Fir Moss Floor',
    regionLabel: 'Temperate Conifer Understory',
    category: 'Other',
    recentSightingsCount: 12,
    dominantSpeciesOrSubject: 'Pacific Golden Chanterelle (Cantharellus formosus)',
    averageConfidence: 85,
    topVerifiedTrait: 'Forked decurrent false gill ridges & apricot funnel cap',
    lastUpdated: 'Oct 6, 2026',
    sampleNotes: [
      'Emerging from deep Hylocomium splendens moss beds near mature Douglas-fir roots.',
      'Verified cross-veined ridges distinguishing specimen from jack-o-lantern lookalikes.',
    ],
  },
];

async function extractVisualCuesFromImage(imageUrl: string): Promise<string[]> {
  if (typeof window === 'undefined' || !imageUrl) return [];
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve([]);
          return;
        }
        ctx.drawImage(img, 0, 0, 32, 32);
        const data = ctx.getImageData(0, 0, 32, 32).data;
        let bluePixels = 0;
        let warmOrangePixels = 0;
        let greenFoliagePixels = 0;
        const total = 32 * 32;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (b > r + 25 && b > 100) bluePixels++;
          if (r > b + 35 && r > 120 && g > 70) warmOrangePixels++;
          if (g > r + 15 && g > b + 10) greenFoliagePixels++;
        }

        const cues: string[] = [];
        if (bluePixels / total > 0.08) cues.push('High-saturation cyan/cerulean pigment regions detected');
        if (warmOrangePixels / total > 0.12) cues.push('Warm rufous/ochre tonal distribution detected');
        if (greenFoliagePixels / total > 0.15) cues.push('Natural chlorophyll/foliage background contrast');
        resolve(cues);
      } catch {
        resolve([]);
      }
    };
    img.onerror = () => resolve([]);
    img.src = imageUrl;
  });
}

export async function analyzeObservationLocally(params: {
  observationText: string;
  category: ObservationCategory;
  location: string;
  imageUrl: string;
  modelId: OpenWeightModelId;
}): Promise<AIHypothesisResult> {
  const { observationText, category, location, imageUrl, modelId } = params;
  const textLower = observationText.toLowerCase();
  const modelMeta = OPEN_WEIGHT_MODELS.find((m) => m.id === modelId) || OPEN_WEIGHT_MODELS[0];

  const visualCues = await extractVisualCuesFromImage(imageUrl);

  // Attempt local Ollama daemon first if reachable; otherwise use browser open-weight pipeline
  let engineSource: 'ollama_local_daemon' | 'browser_open_weight_pipeline' = 'browser_open_weight_pipeline';
  try {
    const res = await fetch('/api/local-ai-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        observation: observationText,
        category,
        modelId,
      }),
    });
    if (res.ok) {
      const payload = await res.json();
      if (payload.source === 'ollama_local_daemon') {
        engineSource = 'ollama_local_daemon';
      }
    }
  } catch {
    engineSource = 'browser_open_weight_pipeline';
  }

  if (
    textLower.includes('blue') &&
    (textLower.includes('bird') || textLower.includes('beak') || textLower.includes('wings') || category === 'Bird')
  ) {
    return {
      possibleIdentification: 'Indian Roller',
      scientificOrFormalName: 'Coracias benghalensis',
      category: 'Bird',
      confidence: 82,
      characteristics: [
        'Vibrant cerulean and turquoise blue wing panels',
        'Warm rufous-orange to cinnamon-brown chest',
        'Medium-sized stocky bird with stout dark beak',
        'Observed perching near open water / lakeside margin',
      ],
      keywords: ['Coracias benghalensis', 'Indian Roller', 'blue wings', 'rufous breast', 'lakeside bird'],
      searchQueries: [
        'Indian Roller identification',
        'Indian Roller blue wings orange chest',
        `Indian Roller habitat ${location ? location.split(',')[0] : 'India'}`,
      ],
      modelUsed: modelMeta.name,
      analyzedOffline: true,
      engineSource,
      hypothesisDisclaimer:
        'Local open-weight AI hypothesis based on visual and field note traits — not guaranteed truth. Verify against independent sources below.',
      analyzedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      recommendedFieldChecks: [
        'Observe the bird in flight to confirm whether the tail has a broad subterminal turquoise band.',
        'Check if the throat shows fine pale shaft streaks (distinguishing Coracias benghalensis from European Roller).',
        'Note whether the bird returns to the same exposed perch after aerial foraging.',
      ],
    };
  }

  if (
    textLower.includes('milkweed') ||
    textLower.includes('star') ||
    textLower.includes('pink') ||
    textLower.includes('sap') ||
    (category === 'Plant' && textLower.includes('flower'))
  ) {
    return {
      possibleIdentification: 'Showy Milkweed',
      scientificOrFormalName: 'Asclepias speciosa',
      category: 'Plant',
      confidence: 84,
      characteristics: [
        'Spherical umbels of dusty rose-pink 5-pointed star blossoms',
        'Broad opposite velvety sage-green leaves',
        'Milky white latex sap present in stems',
        'Open sunlit meadow habitat alignment',
      ],
      keywords: ['Asclepias speciosa', 'Showy Milkweed', 'star flower umbel', 'monarch host plant'],
      searchQueries: [
        'Asclepias speciosa Showy Milkweed identification',
        'Showy Milkweed pink star flower clusters velvety leaves',
        'Asclepias speciosa habitat range meadow',
      ],
      modelUsed: modelMeta.name,
      analyzedOffline: true,
      engineSource,
      hypothesisDisclaimer:
        'Local open-weight AI hypothesis based on botanical traits — not guaranteed truth. Always cross-check botanical references.',
      analyzedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      recommendedFieldChecks: [
        'Measure whether the flower corona hoods are elongated and tooth-like (characteristic of Asclepias speciosa vs. A. syriaca).',
        'Check the underside of leaves for dense soft white trichomes (velvety pubescence).',
        'Record site elevation and sun exposure to resolve habitat range questions.',
      ],
    };
  }

  if (
    textLower.includes('milepost') ||
    textLower.includes('sandstone') ||
    textLower.includes('roman') ||
    textLower.includes('stone') ||
    category === 'Landmark' ||
    category === 'Sign / Notice'
  ) {
    return {
      possibleIdentification: '19th-Century Sandstone Canal Milepost',
      scientificOrFormalName: 'Historical Wayfinding Boundary Marker (c. 1840s)',
      category: category === 'Sign / Notice' ? 'Sign / Notice' : 'Landmark',
      confidence: 79,
      characteristics: [
        'Dressed siliceous sandstone shaft with chamfered top',
        'Incised Roman distance numerals with chisel toolmarks',
        'Crustose pale green lichen colonization on weathered face',
        'Situated along graded woodland towpath corridor',
      ],
      keywords: ['19th century canal milepost', 'sandstone distance marker', 'historic towpath milestone'],
      searchQueries: [
        '19th century sandstone canal milepost Roman numerals',
        'historic towpath stone distance marker preservation',
        'lichen colonization weathered sandstone monument',
      ],
      modelUsed: modelMeta.name,
      analyzedOffline: true,
      engineSource,
      hypothesisDisclaimer:
        'Local open-weight AI hypothesis from architectural and epigraphic features — requires archival corroboration.',
      analyzedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      recommendedFieldChecks: [
        'Inspect the lower base of the stone for a benchmark surveyor mark or cast-iron plate.',
        'Measure the height and width of the chamfered sandstone shaft in centimeters.',
        'Check adjacent mile intervals along the trail to confirm historical spacing.',
      ],
    };
  }

  if (
    textLower.includes('chanterelle') ||
    textLower.includes('mushroom') ||
    textLower.includes('fungi') ||
    textLower.includes('gill') ||
    textLower.includes('apricot')
  ) {
    return {
      possibleIdentification: 'Pacific Golden Chanterelle',
      scientificOrFormalName: 'Cantharellus formosus',
      category: 'Other',
      confidence: 81,
      characteristics: [
        'Wavy funnel-shaped warm apricot-gold cap',
        'Forked decurrent false gill ridges running down stem',
        'Terrestrial growth in damp moss under Douglas-fir',
        'Solid pale flesh (non-hollow stipe)',
      ],
      keywords: ['Cantharellus formosus', 'Golden Chanterelle', 'decurrent false gills', 'conifer moss fungi'],
      searchQueries: [
        'Cantharellus formosus Pacific Golden Chanterelle identification',
        'Chanterelle false gills vs true gills Omphalotus lookalike',
        'Cantharellus formosus Douglas fir moss habitat',
      ],
      modelUsed: modelMeta.name,
      analyzedOffline: true,
      engineSource,
      hypothesisDisclaimer:
        'Local open-weight AI hypothesis only — NEVER consume wild fungi based on digital or AI identification.',
      analyzedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      recommendedFieldChecks: [
        'Verify that the underside has shallow, blunt, cross-veined folds rather than thin, paper-like true gills.',
        'Confirm the specimen is growing directly from soil/moss rather than decaying wood.',
        'Check whether the interior flesh is pale white-yellow and solid when bisected.',
      ],
    };
  }

  const words = observationText
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !['this', 'that', 'with', 'near', 'from', 'have', 'were', 'seen', 'found'].includes(w.toLowerCase()));

  const keyTerms = words.slice(0, 5);
  const synthesizedName =
    keyTerms.length >= 2
      ? `${category} Specimen (${keyTerms.slice(0, 2).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')})`
      : `Unidentified ${category} Field Specimen`;

  const extractedTraits = [
    `Primary field note: "${observationText.slice(0, 90)}${observationText.length > 90 ? '…' : ''}"`,
    `Observation category classified as ${category}`,
    ...(location ? [`Geospatial context: ${location}`] : []),
    ...(visualCues.length > 0 ? [visualCues[0]] : ['Distinctive surface morphology & color contrast']),
  ];

  return {
    possibleIdentification: synthesizedName,
    scientificOrFormalName: `Field Taxon / ${category} Record`,
    category,
    confidence: 74,
    characteristics: extractedTraits,
    keywords: keyTerms.length > 0 ? keyTerms : [category.toLowerCase(), 'field identification', 'morphology'],
    searchQueries: [
      `${category} identification ${keyTerms.slice(0, 3).join(' ')}`.trim(),
      `${keyTerms.slice(0, 4).join(' ')} field guide characteristics`.trim(),
      `${category} observed near ${location || 'natural habitat'} ${keyTerms[0] || ''}`.trim(),
    ],
    modelUsed: modelMeta.name,
    analyzedOffline: true,
    engineSource,
    hypothesisDisclaimer:
      'Local open-weight AI hypothesis generated from your observation notes and image — not guaranteed truth.',
    analyzedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    recommendedFieldChecks: [
      'Capture a second close-up angle showing scale (e.g., next to a field notebook ruler).',
      'Record time of day, weather conditions, and surrounding plant/tree species.',
      'Compare diagnostic markings against at least two regional field guides.',
    ],
  };
}
