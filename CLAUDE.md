# CLAUDE.md — Marketing Agency

> **This file is the primary context for Claude Code when working in this project.**
> **Port allocation:** See [PORTS.md](PORTS.md) before changing any docker-compose ports. All ports outside the assigned ranges are taken by other projects.
> Last updated: 2026-04-07

---

## Git Commit Rules

- Commit as **Armando Gonzalez** (armandogon94@gmail.com)
- **Do NOT add "Co-Authored-By: Claude"** or any AI co-author credits to commits
- Write clear, conventional commit messages: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`
- Keep commits atomic (one logical change per commit)
- Ensure commit messages are concise and descriptive

---

## Project Overview

**Marketing Agency** — A Claude Code-powered multi-agent marketing content creation platform. Orchestrates 7 specialist agents to plan, write, design, produce, research, optimize, and distribute marketing content across all major platforms.

**Integrations:** Remotion video factory, HeyGen avatar videos, Higgsfield AI video generation, Gemini image generation (banana-claude), Formula 100K content methodology, content humanization, NotebookLM source-grounded research, and 35+ marketing skills.

**Pipeline:** Research → Strategy → Copy → Visual Assets → Video Production → QA → Multi-Platform Export

**Primary use case:** Generating marketing content (video, images, email, social copy) for brands using AI-powered agents with human-in-the-loop quality gates.

---

## CRITICAL CONSTRAINTS

### Local-Only Development
- **This project runs ONLY on macOS Apple Silicon (M1/M2/M3/M4)**
- **NOT deployed to any server** — video rendering and AI generation require local GPU/CPU resources
- **DO NOT** create: Traefik labels, VPS deployment configs, production Docker Compose, systemd services, Nginx configs
- `docker-compose.dev.yml` is for LOCAL development convenience only (Redis for future job queues)

### Brand Assets
- **ALL brand assets go in `brand/assets/`** — never scatter logos, fonts, or images in source code
- `brand/default.json` is the single source of truth for brand configuration
- Logos in `brand/assets/logos/`, fonts in `brand/assets/fonts/`, images in `brand/assets/images/`

### Memory Storage
- **ALL project memory goes in `.claude/` within THIS project directory**
- **NEVER** write to `~/.claude/` or any global location
- **START HERE in a new session:** Read `.claude/scratchpad.md` first for quick context
- Skills live in `.claude/skills/` (7 directories — see Skills section below)

---

## Tech Stack (Pinned Versions)

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Video Rendering | Remotion (all packages) | 4.0.443 (`--save-exact`) | React-based, free for individuals (<$1M rev) |
| Captions | @remotion/captions | 4.0.443 | TikTok-style word-by-word animated captions |
| UI/React | React | 19.2.4 | Required by Remotion, strict TypeScript |
| Schema Validation | Zod | 4.3.6 | Validated input props for all compositions |
| CLI Framework | Commander.js | 14.0.3 | Command-line interface with subcommands |
| TTS | Edge-TTS | 7.2.8 (Python) | Free, 45+ Spanish neural voices, sentence-level timestamps |
| Transcription | faster-whisper | 1.2.1 (Python) | CTranslate2, word-level timestamps, CPU int8 on ARM64 |
| Browser Automation | Patchright | 1.55.2 (Python) | NotebookLM interaction, headless Chromium |
| Image Generation | @google/generative-ai | ^0.24.0 | Gemini Nano Banana Pro image generation |
| AI Video | @higgsfield/client | ^2.0.0 | Cinematic AI video generation (Node.js SDK) |
| Avatar Video | HeyGen MCP | v1 | Digital twin via MCP server + API |
| Post-Processing | FFmpeg | 8.x (Homebrew) | Normalize, resize, crop, export, subtitle burn-in |
| Image Processing | ImageMagick | 7.x (Homebrew) | Compositing, watermarks, text overlays, format conversion |
| Runtime (JS) | Node.js | 22+ | LTS for Remotion + pipeline orchestration |
| Runtime (Python) | Python | 3.11+ | For TTS, transcription, browser automation |
| Pipeline Exec | tsx | 4.21.0 | TypeScript execution engine |
| Subprocess Mgmt | execa | 9.6.1 | ESM-only subprocess management |
| Package Manager (JS) | npm | latest (with lock) | For Node.js dependencies |
| Package Manager (Python) | uv | latest | Fast Python package manager with lock |
| Testing (JS) | vitest | 4.1.2 | Remotion composition snapshot tests |
| Testing (Python) | pytest | 9.0.2+ | TTS/transcription/browser wrapper tests |
| TypeScript | TypeScript | 6.0.2 | Strict mode enabled, ES2022 target |

**Key:** All Remotion packages pinned to v4.0.443 exactly (`--save-exact`). Do NOT mix versions.

---

## Project Structure

```
16-Marketing-Agency/
├── CLAUDE.md                        # This file — primary context for Claude Code
├── AGENTS.md                        # 7 marketing specialist agent role definitions
├── package.json                     # Node.js dependencies (Remotion, Gemini, Higgsfield, etc.)
├── pyproject.toml                   # Python dependencies (edge-tts, faster-whisper, patchright)
├── tsconfig.json                    # TypeScript configuration (strict, ES2022, bundler)
├── remotion.config.ts               # Remotion CLI config (JPEG output, overwrite enabled)
├── Makefile                         # Dev commands (install, dev, build, render, campaign, test)
├── Dockerfile                       # Local dev container (optional)
├── docker-compose.dev.yml           # LOCAL dev only — Redis for future job queues
├── .gitignore                       # Excludes: node_modules, .venv, output/*, .env, dist
├── .env.example                     # Documented environment variables (no secrets)
├── .claude/                         # Local Claude Code memory + skills (committed to git)
│   ├── scratchpad.md                # Session handoff — current state, what's next, commands
│   └── skills/                      # 7 skill directories
│       ├── marketing/               # 35+ marketing sub-skills (copywriting, SEO, email, etc.)
│       │   ├── ab-test-setup/       #   A/B test design and analysis
│       │   ├── ad-creative/         #   Ad creative for paid platforms
│       │   ├── ai-seo/              #   AI-native SEO patterns
│       │   ├── analytics-tracking/  #   GA4, GTM, event tracking
│       │   ├── churn-prevention/    #   Retention and dunning flows
│       │   ├── cold-email/          #   Outbound email frameworks
│       │   ├── community-marketing/ #   Community-led growth
│       │   ├── competitor-alternatives/ # Competitor gap analysis
│       │   ├── content-strategy/    #   Editorial planning, pillar-cluster
│       │   ├── copy-editing/        #   Plain English, content refresh
│       │   ├── copywriting/         #   Copy frameworks (AIDA, PAS, BAB)
│       │   ├── customer-research/   #   Personas, voice-of-customer
│       │   ├── email-sequence/      #   Welcome, nurture, sales sequences
│       │   ├── form-cro/            #   Form conversion optimization
│       │   ├── free-tool-strategy/  #   Lead-gen tool strategy
│       │   ├── launch-strategy/     #   Product launch playbooks
│       │   └── ...                  #   (20+ more sub-skills)
│       ├── banana/                  # Gemini image generation (banana-claude)
│       ├── humanizer/               # AI-writing fingerprint removal
│       ├── notebooklm/              # NotebookLM browser automation + queries
│       ├── heygen/                  # HeyGen avatar video skills
│       ├── remotion/                # Remotion video composition patterns
│       └── formula100k/             # Formula 100K content methodology
├── brand/                           # Brand configuration and assets
│   ├── default.json                 # Brand config (colors, fonts, logos, voice, style)
│   └── assets/                      # All brand media assets
│       ├── logos/                   #   SVG/PNG logos for watermarks, intros (.gitkeep)
│       ├── fonts/                   #   Custom font files (.gitkeep)
│       ├── colors/                  #   Color palette exports (.gitkeep)
│       ├── images/                  #   Product shots, headshots, backgrounds (.gitkeep)
│       ├── videos/                  #   B-roll, intros, outros, transitions (.gitkeep)
│       ├── audio/                   #   Jingles, SFX, background music (.gitkeep)
│       └── templates/               #   Reusable design templates (.gitkeep)
├── src/
│   ├── index.ts                     # Remotion entry point → Root.tsx
│   ├── Root.tsx                     # Compositions registry (all video templates)
│   ├── compositions/                # Remotion React video templates
│   │   ├── index.ts                 #   Barrel exports
│   │   ├── schemas.ts              #   Zod prop schemas for all compositions
│   │   ├── ExplainerVideo.tsx       #   Gradient bg + animated title + captions (16:9)
│   │   ├── TalkingHead.tsx          #   Speaker image + overlay + name tag + captions
│   │   ├── Listicle.tsx             #   Numbered items with slide-in animation
│   │   └── QuoteCard.tsx            #   Animated quote mark + italic text + author
│   ├── components/                  # Shared React components
│   │   ├── AnimatedText.tsx         #   Spring-animated fade + translateY text
│   │   ├── Background.tsx           #   Gradient background fill
│   │   └── Caption.tsx              #   Word-by-word highlight captions (6-word window)
│   ├── pipeline/                    # Orchestration & CLI (TypeScript)
│   │   ├── generate.ts              #   Commander.js CLI entry point (npm run generate)
│   │   ├── pipeline.ts              #   Orchestrator: TTS → render → normalize → export
│   │   ├── voices.ts                #   List available TTS voices
│   │   └── templates.ts             #   List available video templates
│   ├── animation/                   # Animation utilities and presets (planned)
│   ├── avatar/                      # HeyGen/Higgsfield avatar integration (planned)
│   ├── copy/                        # Copywriting generation utilities (planned)
│   ├── images/                      # Image generation pipeline (planned)
│   ├── qa/                          # Quality assurance pipeline (planned)
│   ├── research/                    # NotebookLM research integration (planned)
│   ├── tts/                         # Edge-TTS wrapper (Python)
│   │   └── generate.py              #   TTS generation with sentence→word timing
│   ├── transcribe/                  # faster-whisper wrapper (Python)
│   │   └── transcribe.py            #   Audio transcription with word-level timestamps
│   └── ffmpeg/                      # FFmpeg command builders (TypeScript)
│       └── commands.ts              #   resize, normalize, export, thumbnail, etc.
├── templates/                       # Video template JSON configs
│   ├── explainer.json               #   Config for ExplainerVideo template
│   ├── talking-head.json            #   Config for TalkingHead template
│   └── listicle.json                #   Config for Listicle template
├── campaigns/                       # Campaign working directories (gitignored content)
│   └── .gitkeep
├── reference-videos/                # Animation style references for replication
│   └── .gitkeep
├── tests/                           # Test suites
│   └── .gitkeep
├── output/                          # Generated assets (gitignored)
│   └── .gitkeep
└── public/                          # Static assets (used by Remotion staticFile())
    └── .gitkeep
```

---

## Integrations

### HeyGen (Digital Twin Avatar Videos)
- **Connection:** MCP server at `https://mcp.heygen.com/mcp/v1/`
- **Auth:** `HEYGEN_API_KEY` environment variable
- **Skills:** `.claude/skills/heygen/`
- **Use cases:** Talking-head videos, personalized outreach, lip-synced avatar content
- **Flow:** Script → HeyGen API → Avatar video → FFmpeg post-processing → Export

### Higgsfield (Cinematic AI Video)
- **Connection:** Node.js SDK (`@higgsfield/client` v2.0) + Python SDK
- **Auth:** `HF_API_KEY` + `HF_API_SECRET` environment variables
- **Use cases:** B-roll generation, product showcases, cinematic clips, transitions
- **Flow:** Prompt → Higgsfield API → Raw video → FFmpeg normalize → Export

### Gemini (AI Image Generation)
- **Connection:** `@google/generative-ai` npm package (banana-claude skill)
- **Auth:** `GOOGLE_AI_API_KEY` environment variable
- **Skills:** `.claude/skills/banana/`
- **Use cases:** Thumbnails, social media graphics, product visuals, backgrounds
- **Flow:** Prompt → Gemini API → Raw image → ImageMagick post-process → Brand overlay → Export

### NotebookLM (Source-Grounded Research)
- **Connection:** Browser automation via Patchright (headless Chromium)
- **Auth:** Google account session (browser cookies)
- **Skills:** `.claude/skills/notebooklm/`
- **Use cases:** Research briefs, fact-checking, citation-backed content, competitor analysis
- **Flow:** Upload sources → Query notebook → Extract citations → Research brief

### Remotion (Data-Driven Video)
- **Connection:** Local React rendering via `@remotion/renderer`
- **Skills:** `.claude/skills/remotion/`
- **Use cases:** Explainers, listicles, quote cards, animated text content
- **Flow:** JSON props → React composition → Remotion render → FFmpeg post-process → Export

---

## Brand Assets Guide

All brand assets are centralized in `brand/` — never scatter them in source code.

| Path | Purpose | Formats |
|------|---------|---------|
| `brand/default.json` | Brand configuration (colors, fonts, logos, voice, style, social) | JSON |
| `brand/assets/logos/` | Logo files for watermarks, intros, overlays | SVG, PNG |
| `brand/assets/fonts/` | Custom font files for text rendering | TTF, OTF, WOFF2 |
| `brand/assets/colors/` | Color palette exports and swatches | JSON, ASE |
| `brand/assets/images/` | Product shots, headshots, backgrounds, textures | PNG, JPEG, WebP |
| `brand/assets/videos/` | B-roll clips, intro/outro sequences, transitions | MP4, MOV |
| `brand/assets/audio/` | Jingles, sound effects, background music | MP3, WAV, AAC |
| `brand/assets/templates/` | Reusable design templates and presets | JSON |

**Brand Config (`brand/default.json`) fields:**
- `colors` — primary, secondary, accent, background, text (hex values)
- `fonts` — heading, body, custom font list
- `logo` — paths to primary logo, icon, and watermark
- `voice` — default TTS voice, tone, language
- `broll` — paths to intro, outro, and transition clips
- `social` — handle, default hashtags
- `style` — mood, color grading preset, caption position

---

## QA System

Quality assurance is tiered by cost and depth. Always start at Tier 1 and escalate only if issues are found.

### Tier 1 — Metadata Validation (Free)
```bash
ffprobe -v quiet -print_format json -show_format -show_streams output/video.mp4
```
Validates: resolution, frame rate, codec, duration, audio channels, file size.

### Tier 2 — Automated Defect Detection (Free)
```bash
# Black frame detection
ffmpeg -i output/video.mp4 -vf blackdetect=d=0.5:pix_th=0.10 -an -f null -

# Freeze frame detection
ffmpeg -i output/video.mp4 -vf freezedetect=n=0.003:d=2 -an -f null -

# Silence detection
ffmpeg -i output/video.mp4 -af silencedetect=n=-50dB:d=2 -f null -
```
Catches: black screens, frozen frames, dead audio, corrupted sections.

### Tier 3 — Visual Contact Sheet Review (~690 tokens)
```bash
# Generate 3x3 contact sheet (9 evenly-spaced frames)
ffmpeg -i output/video.mp4 -vf "select=not(mod(n\,$(( $(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 output/video.mp4) / 9 )))),scale=640:360,tile=3x3" -frames:v 1 output/contact-sheet.jpg
```
Send the contact sheet image to Claude Vision for visual review: composition, text readability, brand consistency, artifacts.

### Tier 4 — Deep Review (Expensive, targeted)
Only triggered if Tier 3 reveals issues. Send specific frames or segments for detailed Claude Vision analysis. Use sparingly — each review costs significant tokens.

**Escalation rule:** Tier 1 → pass? → Tier 2 → pass? → Tier 3 → pass? → Ship. If Tier 3 fails → Tier 4 on flagged segments only.

---

## Commands & Usage

### Installation

```bash
make install              # Install npm + Python deps, check FFmpeg/ImageMagick
make install-skills       # Clone and install all external skills
make check                # Verify all dependencies are present
```

### Video Generation

```bash
# Full pipeline: script → TTS → render → normalize → export
make generate-video SCRIPT="5 claves para IA en tu empresa" VOICE="es-MX-JorgeNeural" TEMPLATE="explainer"

# Or via npm directly with platform targeting
npm run generate -- \
  --script "Your script text" \
  --voice "es-MX-JorgeNeural" \
  --template "explainer" \
  --platforms youtube,tiktok,reels

# List available voices and templates
make voices
make templates
```

### Image & Avatar Generation

```bash
make generate-image       # Use Visual Designer agent (banana skill + Gemini)
make generate-avatar      # Use Video Producer agent (HeyGen/Higgsfield)
```

### Campaign Management

```bash
make campaign-create NAME="Q2-Launch" BRAND=default   # Create campaign folder structure
make campaign-plan NAME="Q2-Launch"                    # Generate content calendar
make campaign-produce NAME="Q2-Launch"                 # Generate all campaign assets
make campaign-export NAME="Q2-Launch"                  # Export for all platforms
```

### Development

```bash
make dev                  # Start Remotion Studio (visual composition preview)
make build                # Bundle Remotion for rendering
```

### Docker (Local Dev Only)

```bash
make docker               # Start containers (Redis for future job queues)
make docker-build         # Rebuild and start containers
make docker-down          # Stop containers
make docker-logs          # Tail container logs
```

### Testing & Quality

```bash
make test                 # Run all tests (JS + Python)
make test-js              # Run JavaScript tests (vitest)
make test-py              # Run Python tests (pytest)
make lint                 # Run ESLint on src/
```

### Utilities

```bash
make clean                # Remove generated output and build artifacts
make help                 # Show all available commands
```

---

## Coding Conventions

### TypeScript (Remotion + Pipeline)
- **Strict TypeScript** — `strict: true` in tsconfig.json, ES2022 target
- **Functional components only** — no class components in Remotion compositions
- **Zod schemas for validation** — all input props validated with Zod before use
- **camelCase** for variables/functions, **PascalCase** for components/types/classes
- **No `any` types** — use `unknown` + type narrowing or `as const` for literals
- **ESM imports** — use `import`/`export`, never `require` (project uses `"type": "module"`)
- **No file extensions in source imports** — `import { Root } from "./Root"` not `"./Root.tsx"` (Webpack resolves)
- **Async/await over callbacks** — use modern async patterns throughout
- **Error handling** — throw typed errors with context, use try-catch judiciously

### Python (TTS + Transcription + Browser Automation)
- **Python 3.11+** with comprehensive type hints on all functions
- **snake_case** for variables, functions, modules; **SCREAMING_SNAKE_CASE** for constants
- **uv** for dependency management (not pip directly)
- **pathlib.Path** for all file paths (never string concatenation)
- **JSON output to stdout** — pipeline parses via TypeScript `JSON.parse()`
- **CLI via argparse or Click** — well-structured subcommands with help text
- **Generator patterns** — use `list(generator)` before reiterating (faster-whisper gotcha)
- **Patchright** for browser automation — headless by default, explicit waits over sleeps

### General
- **No secrets in code** — use `.env.example` for documentation, `.env` for secrets (gitignored)
- **Error messages must be actionable** — clearly state what happened + how to fix it
- **Minimal abstractions** — this is a single-developer tool; keep it readable over clever
- **Spanish content is the default** — English is secondary
- **Comments for "why" not "what"** — code should be self-documenting; comments explain intent
- **Brand assets in `brand/` only** — never embed logos, colors, or fonts in source code

---

## Environment Variables

Documented in `.env.example`. Copy to `.env` for local use (gitignored).

| Variable | Service | Required | Notes |
|----------|---------|----------|-------|
| `HEYGEN_API_KEY` | HeyGen | For avatar videos | Get at https://app.heygen.com/settings?nav=API |
| `HF_API_KEY` | Higgsfield | For AI video | Get at https://higgsfield.ai/settings/api |
| `HF_API_SECRET` | Higgsfield | For AI video | Paired with HF_API_KEY |
| `GOOGLE_AI_API_KEY` | Gemini | For image gen | Get at https://aistudio.google.com/apikey |
| `REMOTION_CONCURRENCY` | Remotion | No (default: 2) | Parallel render threads |
| `REMOTION_QUALITY` | Remotion | No (default: 80) | JPEG output quality (1-100) |
| `FFMPEG_THREADS` | FFmpeg | No (default: 4) | Parallel encoding threads |
| `DEFAULT_VOICE` | Edge-TTS | No (default: es-MX-JorgeNeural) | Default TTS voice |
| `DEFAULT_LANGUAGE` | Edge-TTS | No (default: es) | Default content language |
| `OUTPUT_DIR` | Pipeline | No (default: ./output) | Generated asset output directory |

---

## Agent Roles

See `AGENTS.md` for the complete 7 specialist role definitions and quality checklists:

1. **Content Strategist** — campaign planning, content calendars, audience research
2. **Copywriter** — scripts, email sequences, social copy, humanized writing
3. **Visual Designer** — AI image generation, brand assets, thumbnails
4. **Video Producer** — Remotion + HeyGen + Higgsfield video production
5. **Research Analyst** — NotebookLM source-grounded research, trend analysis
6. **SEO Specialist** — keyword research, audits, analytics tracking
7. **Distribution Manager** — multi-platform export, watermarking, format adaptation

---

## Required Reading (In Order)

1. **`.claude/scratchpad.md`** — Quick overview of current state, what works, what's next (5 min)
2. **This file (`CLAUDE.md`)** — Full project context, tech stack, commands, conventions (10 min)
3. **`AGENTS.md`** — 7 specialist agent roles with responsibilities and quality checklists (10 min)
4. **`brand/default.json`** — Brand configuration reference (2 min)
5. **`.env.example`** — Required API keys and configuration (2 min)
