# 🔍 TraceBack — Field Evidence Explorer

**TraceBack** is an AI-powered field observation tool that helps you identify birds, plants, fungi, and landmarks by tracing evidence from curated scientific databases and live web sources.

Describe what you saw in the field — TraceBack analyzes it using a local open-weight model (Ollama) or Gemini AI, then cross-references your hypothesis against authoritative sources like eBird, GBIF, iNaturalist, IUCN, and USDA PLANTS.

## ✨ Features

- 🤖 **AI-powered identification** — Uses Gemini or a local Ollama model (Gemma, Llama, Qwen) to form an identification hypothesis from your field observation
- 🌐 **Live web evidence** — Fetches real-time corroborating sources via SerpApi (optional)
- 📚 **Curated reference datasets** — Falls back to verified archival sources for birds, plants, fungi, and landmarks when SerpApi is not configured
- ⚡ **Contradiction detection** — Automatically flags conflicting habitat or trait claims across sources
- 📱 **PWA-ready** — Installable as a Progressive Web App with offline-capable icons
- 🖥️ **Local AI support** — Route inference to a local Ollama daemon (no API key needed) for privacy

## 🛠️ Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React 19, TypeScript, Tailwind CSS v4       |
| Backend    | Express.js, tsx (TypeScript runner)         |
| Build tool | Vite                                        |
| AI         | Featherless (open-weight), Ollama (local)   |
| Search     | SerpApi (optional, for live web evidence)   |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- A [Featherless API key](https://featherless.ai/) *(for cloud AI analysis)*
- [Ollama](https://ollama.com/) *(optional, for local open-weight model inference)*
- A [SerpApi key](https://serpapi.com/) *(optional, for live web evidence)*

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd traceback
npm install
```

### 2. Configure Environment

Copy the example env file and fill in your keys:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Required for AI analysis
FEATHERLESS_API_KEY="your_featherless_api_key_here"

# Optional: SerpApi key for live web evidence search
SERPAPI_KEY="your_serpapi_key_here"

# Optional: Local Ollama endpoint (default shown)
OLLAMA_BASE_URL="http://localhost:11434"
OPEN_WEIGHT_MODEL="gemma3:4b"

# The URL where this app is hosted
APP_URL="http://localhost:3000"
```

> **Note:** Without `SERPAPI_KEY`, the app uses a built-in curated reference dataset for demo purposes (clearly labeled in the UI).

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧠 How It Works

1. **Describe your observation** — Enter what you saw: a bird perched on a wire, a wildflower, a mushroom, or an old stone marker.
2. **AI hypothesis generation** — The app sends your description to Gemini (or a local Ollama model) to generate a candidate identification + diagnostic search queries.
3. **Evidence tracing** — The backend calls SerpApi (if configured) or falls back to curated reference sources from eBird, GBIF, BirdLife, USDA, iNaturalist, etc.
4. **Contradiction analysis** — Sources are compared for conflicting habitat or morphological claims, and conflicts are surfaced clearly.
5. **Results** — You get a confidence-scored identification with sourced field evidence you can explore.

## 📁 Project Structure

```
traceback/
├── server.ts          # Express backend — AI proxy, SerpApi, evidence endpoints
├── src/
│   ├── App.tsx        # Main React application
│   ├── components/    # UI components
│   ├── lib/           # Helper utilities
│   ├── types/         # TypeScript type definitions
│   └── index.css      # Global styles
├── public/            # Static assets (PWA icons auto-generated)
├── index.html         # HTML entry point
├── vite.config.ts     # Vite bundler config
├── tsconfig.json      # TypeScript config
└── .env.example       # Environment variable template
```

## 📜 Available Scripts

| Command         | Description                              |
|-----------------|------------------------------------------|
| `npm run dev`   | Start dev server (Vite + Express)        |
| `npm run build` | Build production bundle                  |
| `npm run start` | Run production server                    |
| `npm run lint`  | TypeScript type-check (no emit)          |
| `npm run clean` | Remove `dist/` and `server.js` artifacts |

## 🔑 Environment Variables

| Variable            | Required | Description                                           |
|---------------------|----------|-------------------------------------------------------|
| `FEATHERLESS_API_KEY` | ✅ Yes  | Featherless API key for open-weight cloud models     |
| `SERPAPI_KEY`       | ❌ No    | SerpApi key for live Google Search evidence           |
| `OLLAMA_BASE_URL`   | ❌ No    | Ollama daemon URL (default: `http://localhost:11434`) |
| `OPEN_WEIGHT_MODEL` | ❌ No    | Ollama model name (default: `gemma3:4b`)              |
| `APP_URL`           | ❌ No    | Public URL of the hosted app                          |

## 📄 License

This project is licensed under the [MIT License](./LICENSE) — free to use, modify, and distribute.
