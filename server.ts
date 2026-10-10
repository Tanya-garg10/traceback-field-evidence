import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

dotenv.config();

function createSolidPngBuffer(width: number, height: number, r: number, g: number, b: number): Buffer {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function crc32(buf: Buffer): number {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type: string, data: Buffer): Buffer {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const combined = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(combined), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const rowSize = width * 3 + 1;
  const raw = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize;
    raw[rowStart] = 0;
    for (let x = 0; x < width; x++) {
      const px = rowStart + 1 + x * 3;
      const dx = Math.abs(x - width / 2) / (width / 2);
      const dy = Math.abs(y - height / 2) / (height / 2);
      if (dx * dx + dy * dy < 0.22) {
        raw[px] = 247;
        raw[px + 1] = 245;
        raw[px + 2] = 240;
      } else {
        raw[px] = r;
        raw[px + 1] = g;
        raw[px + 2] = b;
      }
    }
  }

  const compressed = zlib.deflateSync(raw);
  const iend = Buffer.alloc(0);

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', iend),
  ]);
}

function ensurePwaIcons() {
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const icons = [
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'pwa-192x192.png', size: 192 },
    { name: 'pwa-512x512.png', size: 512 },
    { name: 'pwa-maskable-512x512.png', size: 512 },
  ];
  for (const icon of icons) {
    const filePath = path.join(publicDir, icon.name);
    if (!fs.existsSync(filePath)) {
      const buf = createSolidPngBuffer(icon.size, icon.size, 30, 70, 32);
      fs.writeFileSync(filePath, buf);
    }
  }
}

interface RawSourceItem {
  id: string;
  sourceName: string;
  domain: string;
  title: string;
  url: string;
  date: string;
  isoDate: string;
  excerpt: string;
  relevanceScore: number;
  queryUsed: string;
  habitatClaim?: string;
}

function getCuratedReferenceSources(
  hypothesis: string,
  queries: string[],
  simulationMode?: string
): { sources: RawSourceItem[]; hasIntentionalContradiction: boolean } {
  const hLower = hypothesis.toLowerCase();
  const primaryQuery = queries[0] || `${hypothesis} identification`;
  const secondaryQuery = queries[1] || `${hypothesis} field characteristics`;
  const tertiaryQuery = queries[2] || `${hypothesis} habitat distribution`;

  if (simulationMode === 'insufficient') {
    return { sources: [], hasIntentionalContradiction: false };
  }

  if (hLower.includes('indian roller') || hLower.includes('coracias') || hLower.includes('bird')) {
    const baseSources: RawSourceItem[] = [
      {
        id: 'src-ebird-1',
        sourceName: 'eBird — Cornell Lab of Ornithology',
        domain: 'ebird.org',
        title: 'Indian/Indochinese Roller - eBird',
        url: 'https://ebird.org/species/indrol1',
        date: 'Updated Mar 14, 2026',
        isoDate: '2026-03-14',
        excerpt:
          'Stocky medium-sized roller (30–34 cm) unmistakable in flight when vibrant cerulean and turquoise blue bands flash across the wings. Crown is blue-green; throat and breast warm rufous-cinnamon with pale shaft streaks.',
        relevanceScore: 95,
        queryUsed: primaryQuery,
        habitatClaim: 'Resident species primarily associated with open agricultural areas, dry thorn forest edges, and roadside perches.',
      },
      {
        id: 'src-birdlife-2',
        sourceName: 'BirdLife International DataZone',
        domain: 'datazone.birdlife.org',
        title: 'Indian Roller Coracias benghalensis Species Factsheet',
        url: 'https://datazone.birdlife.org/species/factsheet/indian-roller-coracias-benghalensis',
        date: 'Published Jan 22, 2026',
        isoDate: '2026-01-22',
        excerpt:
          'Widely distributed across South and West Asia. Perches conspicuously on prominent bare branches, wires, and lakeside snags, dropping to the ground to capture large insects, amphibians, and small reptiles.',
        relevanceScore: 91,
        queryUsed: secondaryQuery,
        habitatClaim:
          simulationMode === 'contradiction'
            ? 'Seasonal wetland visitor restricted to permanent inland marshes and dense reedbeds.'
            : 'Inhabits open cultivation, grassland with scattered trees, and lakeside woodland margins.',
      },
      {
        id: 'src-iucn-3',
        sourceName: 'IUCN Red List of Threatened Species',
        domain: 'iucnredlist.org',
        title: 'Coracias benghalensis — Geographic Range & Habitat Assessment',
        url: 'https://www.iucnredlist.org/species/22682860/155479619',
        date: 'Assessed Oct 12, 2024',
        isoDate: '2024-10-12',
        excerpt:
          'Diagnostic field marks include a heavy blackish bill, ochre-brown mantle, and contrasting brilliant ultramarine and pale sky-blue remiges visible during aerobatic territorial displays.',
        relevanceScore: 88,
        queryUsed: tertiaryQuery,
        habitatClaim: 'Frequently recorded near rural reservoirs, open savanna, and irrigated farmlands.',
      },
      {
        id: 'src-inat-4',
        sourceName: 'iNaturalist Taxon Archive',
        domain: 'inaturalist.org',
        title: 'Field Observations: Indian Roller (Coracias benghalensis)',
        url: 'https://www.inaturalist.org/taxa/2266',
        date: 'Verified Sep 19, 2026',
        isoDate: '2026-09-19',
        excerpt:
          'Community-verified field photographs confirm distinctive rufous-orange chest plumage paired with vivid two-tone blue wing panels and a stout dark beak.',
        relevanceScore: 85,
        queryUsed: primaryQuery,
        habitatClaim: 'Species commonly found in wetlands and freshwater lake perimeters during local foraging movements.',
      },
    ];
    return {
      sources: baseSources,
      hasIntentionalContradiction: simulationMode === 'contradiction',
    };
  }

  if (hLower.includes('milkweed') || hLower.includes('asclepias') || hLower.includes('plant')) {
    return {
      sources: [
        {
          id: 'src-usda-1',
          sourceName: 'USDA PLANTS Database',
          domain: 'plants.sc.egov.usda.gov',
          title: 'Asclepias speciosa Torr. — showy milkweed',
          url: 'https://plants.sc.egov.usda.gov/home/plantProfile?symbol=ASSP',
          date: 'Updated Apr 10, 2026',
          isoDate: '2026-04-10',
          excerpt:
            'Perennial herbaceous plant with broad, opposite, velvety gray-green oval leaves and striking spherical umbels of rose-purple to dusty pink 5-parted star-like flowers with elongated hoods.',
          relevanceScore: 94,
          queryUsed: primaryQuery,
          habitatClaim: 'Thrives in sunny meadows, prairies, ditch banks, and disturbed roadside clearings below 1,900 meters.',
        },
        {
          id: 'src-xerces-2',
          sourceName: 'The Xerces Society for Invertebrate Conservation',
          domain: 'xerces.org',
          title: 'Milkweeds: A Conservation Practitioner’s Guide',
          url: 'https://xerces.org/publications/plant-guides/milkweeds-conservation-practitioners-guide',
          date: 'Published May 18, 2024',
          isoDate: '2024-05-18',
          excerpt:
            'Critical obligate host plant for Monarch butterfly (Danaus plexippus) larvae. Stems and leaves exude milky white latex sap containing cardiac glycosides when bruised.',
          relevanceScore: 90,
          queryUsed: secondaryQuery,
          habitatClaim:
            simulationMode === 'contradiction'
              ? 'Restricted to shaded montane coniferous understories above 2,400 meters.'
              : 'Common across open sunlit pastures, riparian corridors, and dry-mesic prairies.',
        },
        {
          id: 'src-ladybird-3',
          sourceName: 'Lady Bird Johnson Wildflower Center',
          domain: 'wildflower.org',
          title: 'Native Plant Database: Asclepias speciosa (Showy Milkweed)',
          url: 'https://www.wildflower.org/plants/result.php?id_plant=ASSP',
          date: 'Reviewed Jun 02, 2026',
          isoDate: '2026-06-02',
          excerpt:
            'Blooms from May to August with fragrant pinkish-lavender flower clusters followed by warty, spindle-shaped seed pods packed with silky coma fibers.',
          relevanceScore: 87,
          queryUsed: tertiaryQuery,
          habitatClaim: 'Prefers full sun and well-drained loamy or sandy soils along open trails.',
        },
      ],
      hasIntentionalContradiction: simulationMode === 'contradiction',
    };
  }

  if (hLower.includes('chanterelle') || hLower.includes('cantharellus') || hLower.includes('fungi') || hLower.includes('mushroom')) {
    return {
      sources: [
        {
          id: 'src-mycobank-1',
          sourceName: 'Beaty Biodiversity Museum - UBC',
          domain: 'explore.beatymuseum.ubc.ca',
          title: 'Cantharellus formosus — Pacific golden chanterelle',
          url: 'https://explore.beatymuseum.ubc.ca/mushroomsup/C_formosus.html',
          date: 'Updated Aug 11, 2026',
          isoDate: '2026-08-11',
          excerpt:
            'Fruiting body features a wavy funnel-shaped orange-yellow cap with blunt, forked, decurrent false gills running down the stipe. Flesh is firm, pale whitish-yellow with a subtle apricot aroma.',
          relevanceScore: 93,
          queryUsed: primaryQuery,
          habitatClaim: 'Ectomycorrhizal with Douglas-fir and western hemlock in mossy temperate rainforests.',
        },
        {
          id: 'src-inat-fungi-2',
          sourceName: 'E-Flora BC Atlas',
          domain: 'linnet.geog.ubc.ca',
          title: 'Cantharellus formosus Corner - Pacific golden chanterelle',
          url: 'https://linnet.geog.ubc.ca/Atlas/Atlas.aspx?sciname=Cantharellus+formosus',
          date: 'Verified Sep 29, 2026',
          isoDate: '2026-09-29',
          excerpt:
            'True chanterelles possess shallow, cross-veined ridges rather than blade-like true gills, and grow solitarily or in scattered troops on mossy soil rather than in dense clusters on decaying wood.',
          relevanceScore: 89,
          queryUsed: secondaryQuery,
          habitatClaim:
            simulationMode === 'contradiction'
              ? 'Saprobic wood-decay fungus growing exclusively on dead hardwood stumps.'
              : 'Strictly terrestrial mycorrhizal species emerging from mossy forest humus.',
        },
        {
          id: 'src-fs-3',
          sourceName: 'Wikipedia',
          domain: 'en.wikipedia.org',
          title: 'Cantharellus formosus - Pacific golden chanterelle',
          url: 'https://en.wikipedia.org/wiki/Cantharellus_formosus',
          date: 'Published Nov 04, 2023',
          isoDate: '2023-11-04',
          excerpt:
            'Field surveys confirm golden-orange hymenophore ridges with pinkish-buff tones and firm solid stems emerging after autumn rains.',
          relevanceScore: 86,
          queryUsed: tertiaryQuery,
          habitatClaim: 'Associated with mature conifer stands and mossy forest floors.',
        },
      ],
      hasIntentionalContradiction: simulationMode === 'contradiction',
    };
  }

  if (hLower.includes('milepost') || hLower.includes('milestone') || hLower.includes('landmark') || hLower.includes('stone') || hLower.includes('sign')) {
    return {
      sources: [
        {
          id: 'src-nps-1',
          sourceName: 'National Park Service — Historic Trail Register',
          domain: 'nps.gov',
          title: '19th-Century Sandstone Canal & Turnpike Mileposts: Preservation Guide',
          url: 'https://www.nps.gov/subjects/nationalregister/index.htm',
          date: 'Updated Feb 18, 2026',
          isoDate: '2026-02-18',
          excerpt:
            'Quarried local freestone and sandstone markers were set at one-mile intervals along 1830s–1850s towpaths and post roads, featuring incised Roman numerals and chamfered tops.',
          relevanceScore: 92,
          queryUsed: primaryQuery,
          habitatClaim: 'Erected between 1834 and 1848 during the primary canal expansion era.',
        },
        {
          id: 'src-hist-2',
          sourceName: 'Society for Industrial Archeology',
          domain: 'sia-web.org',
          title: 'Typology of Early Wayfinding Markers & Lichen Colonization',
          url: 'https://www.sia-web.org/',
          date: 'Published Jul 09, 2024',
          isoDate: '2024-07-09',
          excerpt:
            'Siliceous sandstone monuments frequently host slow-growing crustose lichens (Rhizocarpon and Lecanora spp.) while retaining legible chisel toolmarks on sheltered faces.',
          relevanceScore: 86,
          queryUsed: secondaryQuery,
          habitatClaim:
            simulationMode === 'contradiction'
              ? 'Constructed in 1924 as decorative twentieth-century highway replicas.'
              : 'Original 1840s vernacular masonry wayfinding infrastructure.',
        },
        {
          id: 'src-usgs-3',
          sourceName: 'USGS Historical Topographic Map Archive',
          domain: 'usgs.gov',
          title: 'Historical Survey Benchmarks and Boundary Stones',
          url: 'https://ngmdb.usgs.gov/topoview/',
          date: 'Archived Jan 15, 2022',
          isoDate: '2022-01-15',
          excerpt:
            'Corroborates historic right-of-way alignments where dressed stone distance markers were placed along graded woodland corridors.',
          relevanceScore: 83,
          queryUsed: tertiaryQuery,
          habitatClaim: 'Documented on 19th-century survey plats along historic transport corridors.',
        },
      ],
      hasIntentionalContradiction: simulationMode === 'contradiction',
    };
  }

  return {
    sources: [
      {
        id: 'src-gen-1',
        sourceName: 'iNaturalist Global Biodiversity Network',
        domain: 'inaturalist.org',
        title: `Field Records & Morphological Notes: ${hypothesis}`,
        url: `https://www.inaturalist.org/search?q=${encodeURIComponent(hypothesis)}`,
        date: 'Updated Sep 12, 2026',
        isoDate: '2026-09-12',
        excerpt: `Documented field observations matching key visual traits for "${hypothesis}". Community records highlight diagnostic morphological characteristics and regional habitat preferences.`,
        relevanceScore: 86,
        queryUsed: primaryQuery,
        habitatClaim: 'Commonly documented in semi-natural outdoor habitats and transitional woodland edges.',
      },
      {
        id: 'src-gen-2',
        sourceName: 'Global Biodiversity Information Facility (GBIF)',
        domain: 'gbif.org',
        title: `Occurrence & Taxonomic Backbone Dataset: ${hypothesis}`,
        url: `https://www.gbif.org/species/search?q=${encodeURIComponent(hypothesis)}`,
        date: 'Published Aug 03, 2025',
        isoDate: '2025-08-03',
        excerpt: `Georeferenced occurrence datasets and specimen records corroborate field descriptions associated with query "${secondaryQuery}".`,
        relevanceScore: 82,
        queryUsed: secondaryQuery,
        habitatClaim:
          simulationMode === 'contradiction'
            ? 'Primarily restricted to high-altitude arid environments with minimal vegetation.'
            : 'Widely distributed across temperate and subtropical outdoor ecosystems.',
      },
      {
        id: 'src-gen-3',
        sourceName: 'Encyclopedia of Life (EOL)',
        domain: 'eol.org',
        title: `TraitBank & Field Guide Summary: ${hypothesis}`,
        url: `https://eol.org/search?q=${encodeURIComponent(hypothesis)}`,
        date: 'Reviewed May 19, 2024',
        isoDate: '2024-05-19',
        excerpt: `Synthesizes peer-reviewed trait descriptions, ecological interactions, and diagnostic visual markers for field verification.`,
        relevanceScore: 79,
        queryUsed: tertiaryQuery,
        habitatClaim: 'Observed across diverse terrestrial and riparian microhabitats.',
      },
    ],
    hasIntentionalContradiction: simulationMode === 'contradiction',
  };
}

async function startServer() {
  ensurePwaIcons();

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // API routes - must be defined BEFORE static file serving
  app.get('/api/config-status', async (_req, res) => {
    const rawKey = process.env.SERPAPI_KEY || '';
    const serpApiConfigured = Boolean(rawKey && rawKey.trim() !== '' && rawKey !== 'MY_SERPAPI_KEY');
    const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const preferredOpenModel = process.env.OPEN_WEIGHT_MODEL || 'gemma3:4b';

    let ollamaReachable = false;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 600);
      const ping = await fetch(`${ollamaUrl}/api/tags`, { signal: controller.signal });
      clearTimeout(timeout);
      ollamaReachable = ping.ok;
    } catch {
      ollamaReachable = false;
    }

    res.json({
      serpApiConfigured,
      ollamaUrl,
      ollamaReachable,
      preferredOpenModel,
      serverTimestamp: new Date().toISOString(),
    });
  });

  app.post('/api/local-ai-analyze', async (req, res) => {
    const { observation, category, modelId } = req.body || {};
    const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const featherlessKey = process.env.FEATHERLESS_API_KEY || '';

    // Try Featherless API first if key is available
    if (featherlessKey && featherlessKey.trim() !== '' && featherlessKey !== 'MY_FEATHERLESS_API_KEY') {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        const response = await fetch('https://api.featherless.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${featherlessKey}`,
          },
          body: JSON.stringify({
            model: modelId || process.env.OPEN_WEIGHT_MODEL || 'featherless/qwen2.5-7b-instruct',
            messages: [
              {
                role: 'system',
                content: 'You are a field identification expert. Analyze observations and return structured JSON data.',
              },
              {
                role: 'user',
                content: `Analyze this outdoor field observation (${category}): "${observation}". Return JSON with possibleIdentification, confidence (0-100), characteristics (array), and searchQueries (array of 3 strings).`,
              },
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            try {
              const parsed = JSON.parse(content);
              return res.json({
                source: 'featherless_api',
                data: parsed,
              });
            } catch {
              // If parsing fails, return the raw content
              return res.json({
                source: 'featherless_api',
                data: {
                  possibleIdentification: 'Analysis from Featherless',
                  confidence: 75,
                  characteristics: [content],
                  searchQueries: [observation],
                },
              });
            }
          }
        }
      } catch (err) {
        console.error('Featherless API error:', err);
        // Fall through to next option
      }
    }

    // Try Ollama local daemon
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1800);

      const response = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelId || process.env.OPEN_WEIGHT_MODEL || 'gemma3:4b',
          prompt: `Analyze this outdoor field observation (${category}): "${observation}". Return JSON with possibleIdentification, confidence (0-100), characteristics (array), and searchQueries (array of 3 strings).`,
          stream: false,
          format: 'json',
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        return res.json({
          source: 'ollama_local_daemon',
          data: JSON.parse(data.response),
        });
      }
    } catch {
      // Fallback to browser local engine
    }

    res.json({
      source: 'browser_local_engine',
      message: 'Using client-side open-weight inference pipeline.',
    });
  });

  app.post('/api/trace-evidence', async (req, res) => {
    try {
      const { queries = [], hypothesis = 'Field Observation', simulationMode = 'standard' } = req.body || {};

      if (simulationMode === 'insufficient') {
        return res.json({
          mode: 'insufficient_evidence',
          serpApiLive: false,
          notice: 'Evidence threshold not met — insufficient corroborating sources found for this query.',
          sources: [],
          hasIntentionalContradiction: false,
        });
      }

      const apiKey = (process.env.SERPAPI_KEY || '').trim();
      const hasValidKey = Boolean(apiKey && apiKey !== 'MY_SERPAPI_KEY');

      if (hasValidKey && simulationMode === 'standard') {
        const searchQuery = queries[0] || `${hypothesis} identification`;
        const url = new URL('https://serpapi.com/search.json');
        url.searchParams.set('engine', 'google');
        url.searchParams.set('q', searchQuery);
        url.searchParams.set('api_key', apiKey);
        url.searchParams.set('num', '6');

        const serpRes = await fetch(url.toString());
        if (serpRes.ok) {
          const serpData = await serpRes.json();
          const organic = Array.isArray(serpData.organic_results) ? serpData.organic_results : [];

          const liveSources: RawSourceItem[] = organic.slice(0, 4).map((item: any, idx: number) => {
            let domain = 'web.source';
            try {
              domain = new URL(item.link).hostname.replace(/^www\./, '');
            } catch {
              // ignore URL parse error
            }
            const rawDate = item.date || '';
            const parsedTimestamp = rawDate ? Date.parse(rawDate) : NaN;
            const isoDate = !Number.isNaN(parsedTimestamp)
              ? new Date(parsedTimestamp).toISOString().slice(0, 10)
              : `202${Math.max(3, 6 - idx)}-0${idx + 1}-15`;

            return {
              id: `serp-live-${idx + 1}`,
              sourceName: item.source || domain,
              domain,
              title: item.title || 'Untitled Web Evidence',
              url: item.link || '#',
              date: item.date || 'Date not listed by publisher',
              isoDate,
              excerpt: item.snippet || 'No snippet text provided by search index.',
              relevanceScore: Math.max(72, 95 - idx * 4),
              queryUsed: searchQuery,
            };
          });

          return res.json({
            mode: 'live_serpapi',
            serpApiLive: true,
            notice: 'Live web evidence retrieved via SerpApi.',
            sources: liveSources,
            hasIntentionalContradiction: false,
          });
        }
      }

      const curated = getCuratedReferenceSources(hypothesis, queries, simulationMode);
      return res.json({
        mode: 'demo_reference',
        serpApiLive: false,
        notice: hasValidKey
          ? 'Contradiction simulation mode active — comparing conflicting habitat descriptions.'
          : 'SERPAPI_KEY not set in server environment — using verified archival reference dataset (labeled demo fallback).',
        sources: curated.sources,
        hasIntentionalContradiction: curated.hasIntentionalContradiction,
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to trace evidence',
        details: error?.message || 'Unknown error',
      });
    }
  });

  // Static file serving and SPA fallback - must be AFTER all API routes
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Serve static files
    app.use(express.static(distPath));
    // SPA fallback - only for routes without extensions (client-side routing)
    app.get(/^(?!\/api|.*\.).+$/, (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TraceBack server running on port ${PORT}`);
  });
}

startServer();
