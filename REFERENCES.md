# References & Inspiration

> GitHub repositories, internal projects, and resources used to build the Marketing Agency platform.

---

## External GitHub Repositories (Skills)

These repos were cloned into `.claude/skills/` to provide specialized capabilities:

| Repo | Skill Directory | What It Provides |
|------|----------------|------------------|
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | `.claude/skills/marketing/` | 35 marketing automation skills: A/B testing, ad creative, AI-SEO, analytics tracking, churn prevention, cold email, community marketing, competitor analysis, content strategy, copy editing, copywriting, customer research, email sequences, form CRO, free tool strategy, launch strategy, and 20+ more |
| [agricidaniel/banana-claude](https://github.com/agricidaniel/banana-claude) | `.claude/skills/banana/` | Gemini AI image generation skill with 5-component prompt formula (Subject + Action + Context + Composition + Style), brand color integration, and aspect ratio presets |
| [blader/humanizer](https://github.com/blader/humanizer) | `.claude/skills/humanizer/` | AI-writing fingerprint removal — transforms AI-generated content into natural, human-sounding text |
| [pleaseprompto/notebooklm-skill](https://github.com/pleaseprompto/notebooklm-skill) | `.claude/skills/notebooklm/` | NotebookLM browser automation for source-grounded research, podcast generation, citation extraction (11 files including Patchright scripts) |
| [heygen-com/skills](https://github.com/heygen-com/skills) | `.claude/skills/heygen/` | HeyGen avatar video generation — 73 files covering digital twin creation, lip-synced talking head videos, personalized outreach videos |
| [remotion-dev/skills](https://github.com/remotion-dev/skills) | `.claude/skills/remotion/` | Remotion video framework rules — 41 files covering compositions, sequencing, timing, transitions, text animations, captions, SRT import, asset management, parameters, Tailwind integration |

---

## Internal Projects (Source Code)

Code and patterns were adapted from these sibling projects in the Deep Research Claude Code portfolio:

| Project | Directory | What Was Imported |
|---------|-----------|-------------------|
| **10-Video-Automation-Remotion** | `../10-Video-Automation-Remotion/` | Core video factory — 20 files including 4 Remotion compositions (ExplainerVideo, TalkingHead, Listicle, QuoteCard), reusable components (AnimatedText, Background, Caption), full pipeline system (generate.ts, pipeline.ts, templates.ts, voices.ts), Python TTS wrapper (edge-tts), transcription script (faster-whisper), FFmpeg command builders, and JSON template configs |
| **09-Content-Marketing-Automation** | `../09-Content-Marketing-Automation/` | Content marketing patterns and automation workflows that informed the multi-agent architecture and campaign management system |
| **Formula 100K (ai-news-content-engine)** | `.claude/skills/formula100k/` | Content methodology skill — 33 scriptwriting structures, hooks optimizer, humanized variant generation, trend detection, creator monitoring, evergreen topic identification. Originally built for AI news content, adapted for general marketing use. Outputs in Spanish by default |

---

## Key Technologies & Documentation

| Technology | Official Docs | Used For |
|------------|--------------|----------|
| [Remotion](https://remotion.dev) | [remotion.dev/docs](https://www.remotion.dev/docs) | React-based programmatic video rendering (compositions, animations, data-driven video) |
| [HeyGen](https://heygen.com) | [docs.heygen.com](https://docs.heygen.com) | AI avatar talking-head videos, lip-sync, personalized video at scale |
| [Hedra](https://hedra.com) | [hedra.com/docs](https://www.hedra.com) | Cinematic AI video generation (replaced Higgsfield in the stack) |
| [Google Gemini](https://ai.google.dev) | [ai.google.dev/docs](https://ai.google.dev/docs) | AI image generation via `@google/generative-ai` SDK |
| [Edge-TTS](https://github.com/rany2/edge-tts) | [PyPI](https://pypi.org/project/edge-tts/) | Free neural TTS with 45+ Spanish voices, sentence-level timestamps |
| [faster-whisper](https://github.com/SYSTRAN/faster-whisper) | [GitHub](https://github.com/SYSTRAN/faster-whisper) | CTranslate2-based transcription with word-level timestamps, CPU int8 on ARM64 |
| [Patchright](https://github.com/AXJ15/patchright) | [GitHub](https://github.com/AXJ15/patchright) | Stealth browser automation for NotebookLM interaction |
| [FFmpeg](https://ffmpeg.org) | [ffmpeg.org/documentation](https://ffmpeg.org/documentation.html) | Video/audio post-processing: normalize, resize, crop, export, subtitle burn-in |
| [ImageMagick](https://imagemagick.org) | [imagemagick.org/Usage](https://imagemagick.org/Usage/) | Image compositing, watermarks, text overlays, format conversion |

---

## Architecture Inspirations

- **Multi-agent pattern**: 7 specialist agents (Strategist, Copywriter, Visual Designer, Video Producer, Research Analyst, SEO Specialist, Distribution Manager) each with defined responsibilities, tools, and quality checklists — documented in `AGENTS.md`
- **Tiered QA system**: Inspired by production video pipelines — free metadata/defect checks first, expensive vision review only when needed (see `src/qa/`)
- **Pipeline orchestration**: Script → TTS → Render → Normalize → Multi-Platform Export pattern adapted from Project 10's video factory
