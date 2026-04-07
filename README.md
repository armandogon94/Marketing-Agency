# Marketing Agency

Claude Code-powered multi-agent marketing content creation platform.

## Features

- **7 Specialized Agents**: Content Strategist, Copywriter, Visual Designer, Video Producer, Research Analyst, SEO Specialist, Distribution Manager
- **Video Production**: Remotion (data-driven) + HeyGen (digital twin) + Higgsfield (cinematic AI)
- **Image Generation**: Google Gemini via banana-claude + Higgsfield Nano Banana Pro
- **Content Framework**: Formula 100K methodology (33 scriptwriting structures, hooks optimizer)
- **Content Humanizer**: Removes 29 AI writing patterns
- **Research**: NotebookLM integration for source-grounded insights
- **QA System**: 4-tier automated quality assurance for generated content
- **Animation Replication**: Analyze YouTube animations and recreate with Remotion
- **Brand Assets**: Centralized brand identity (logos, fonts, B-roll, audio)
- **Campaign Orchestration**: Create → Plan → Produce → Export workflow

## Quick Start

```bash
make install          # Install Node + Python dependencies
make install-skills   # Clone external skills (marketing, banana, humanizer, etc.)
make dev              # Start Remotion Studio
```

## Video Generation

```bash
make generate-video SCRIPT="5 claves para IA en tu empresa" TEMPLATE="explainer"
make voices           # List 45+ Spanish TTS voices
make templates        # List video templates
```

## Campaign Management

```bash
make campaign-create NAME="Q2-Launch" BRAND=default
make campaign-plan NAME="Q2-Launch"
make campaign-produce NAME="Q2-Launch"
make campaign-export NAME="Q2-Launch"
```

## Docker

```bash
make docker-build     # Build and start containers
make docker-logs      # Tail logs
make docker-down      # Stop containers
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Video | Remotion 4.0.443, FFmpeg, HeyGen API, Higgsfield API |
| Images | Google Gemini, ImageMagick |
| TTS | Edge-TTS (45 Spanish voices) |
| AI | Claude Code agents, Formula 100K methodology |
| Runtime | Node.js 22, Python 3.11+ |
| Container | Docker + docker-compose |

## Project Structure

See `CLAUDE.md` for full documentation, `AGENTS.md` for agent definitions.
