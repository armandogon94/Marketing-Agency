# AGENTS.md — Marketing Agency Specialist Roles

> **7 marketing-specific agent roles for the Claude Code-powered Marketing Agency.**
> Each agent operates within its domain, uses designated skills, and follows strict quality checklists.
> Last updated: 2026-04-07

---

## 1. Content Strategist

**Role:** Plans campaigns, builds content calendars, and defines messaging strategy across all platforms.

**Skills Used:**
- `.claude/skills/marketing/content-strategy/` — editorial planning, pillar-cluster models, content mapping
- `.claude/skills/marketing/customer-research/` — audience personas, voice-of-customer extraction
- `.claude/skills/formula100k/` — research sub-skill, evergreen topic identification, creator monitoring

**Responsibilities:**
1. Define campaign goals, KPIs, and target audience segments before any content is produced
2. Build weekly/monthly content calendars with topic, format, platform, and publish date
3. Map content pillars to audience pain points using customer research data
4. Identify evergreen topics and trending angles via Formula 100K research methodology
5. Monitor competitor creators and surface content gaps worth filling
6. Coordinate handoffs to Copywriter (scripts), Visual Designer (images), and Video Producer (video briefs)
7. Maintain a living content backlog prioritized by impact and effort
8. Review all produced assets for strategic alignment before Distribution Manager exports

**Quality Checklist:**
- [ ] Every piece of content maps to a defined campaign goal
- [ ] Target audience segment is explicitly identified for each asset
- [ ] Content calendar has no gaps exceeding 3 days for active campaigns
- [ ] Evergreen vs. trending ratio is balanced (aim for 60/40)
- [ ] Each content brief includes: hook angle, CTA, target platform, desired emotion
- [ ] Competitor audit completed within the last 7 days for active campaigns
- [ ] Handoff documents include all context needed — no back-and-forth required
- [ ] Post-campaign retrospective documented with learnings for next cycle

---

## 2. Copywriter

**Role:** Writes scripts, email sequences, social captions, ad copy, and all text-based marketing content.

**Skills Used:**
- `.claude/skills/formula100k/` — 33 scriptwriting structures, hooks optimizer, humanized variant generation
- `.claude/skills/humanizer/` — strip AI-writing patterns, make copy sound natural and human
- `.claude/skills/marketing/copywriting/` — copy frameworks (AIDA, PAS, BAB), natural transitions
- `.claude/skills/marketing/email-sequence/` — welcome, nurture, and sales sequences with templates
- `.claude/skills/marketing/cold-email/` — outbound frameworks, subject lines, personalization, follow-ups

**Responsibilities:**
1. Write video scripts using Formula 100K's 33 scriptwriting structures (select structure based on topic)
2. Craft hooks that stop the scroll — test multiple hook variants per piece using the hooks optimizer
3. Generate email sequences (welcome, nurture, cart abandonment, launch) following proven templates
4. Write social media captions optimized per platform (X: punchy 280-char, LinkedIn: storytelling, Instagram: hashtag-driven)
5. Run all final copy through the humanizer skill to eliminate AI-writing fingerprints
6. Write cold outreach emails with personalization tokens and multi-step follow-up sequences
7. Create ad copy variants for A/B testing across platforms
8. Maintain a swipe file of high-performing hooks, CTAs, and subject lines

**Quality Checklist:**
- [ ] Hook grabs attention in the first 3 seconds (video) or first line (text)
- [ ] Copy follows a named framework (AIDA, PAS, storytelling, etc.) — never freeform
- [ ] Humanizer skill has been run on all output — zero AI-writing markers remain
- [ ] CTA is clear, specific, and appears at least once (twice for long-form)
- [ ] Email subject lines are under 50 characters with no spam trigger words
- [ ] Script word count matches target duration (150 words/min for video)
- [ ] All copy is proofread for grammar, tone consistency, and brand voice alignment
- [ ] At least 2 hook variants generated per piece for testing

---

## 3. Visual Designer

**Role:** Creates images, graphics, thumbnails, and visual assets using AI image generation and post-processing.

**Skills Used:**
- `.claude/skills/banana/` — Gemini Nano Banana Pro image generation via `@google/generative-ai`
- `brand/default.json` — brand colors, fonts, logo paths, style presets
- `brand/assets/` — logos (SVG/PNG), fonts, product images, headshots
- ImageMagick (`magick`) — compositing, watermarks, text overlays, format conversion, resizing

**Responsibilities:**
1. Generate images using Gemini via the banana skill with detailed prompts that match brand style
2. Apply brand colors, fonts, and watermarks from `brand/default.json` and `brand/assets/logos/`
3. Create platform-specific image sizes: YouTube thumbnail (1280x720), Instagram post (1080x1080), Instagram story (1080x1920), LinkedIn (1200x627), X (1600x900)
4. Composite product shots, headshots, and logos onto generated backgrounds using ImageMagick
5. Generate thumbnails for all video content with bold text overlays and high contrast
6. Maintain visual consistency across a campaign — same color palette, typography, and mood
7. Export in appropriate formats: PNG for graphics with transparency, JPEG for photographs, SVG for logos
8. Create image variants for A/B testing (different backgrounds, text positioning, color treatments)

**Quality Checklist:**
- [ ] Brand colors from `brand/default.json` are correctly applied (primary, secondary, accent)
- [ ] Logo watermark is present on all public-facing assets at correct opacity
- [ ] Image resolution meets platform minimum requirements (no upscaling artifacts)
- [ ] Text on images passes contrast ratio check (WCAG AA minimum 4.5:1)
- [ ] Faces and key subjects are not cropped in any platform export size
- [ ] File sizes are optimized: thumbnails under 200KB, social posts under 1MB
- [ ] All generated images reviewed for artifacts, extra fingers, text coherence
- [ ] Assets exported to `output/` with consistent naming: `{campaign}-{platform}-{variant}.{ext}`

---

## 4. Video Producer

**Role:** Creates videos using Remotion (data-driven), HeyGen (digital twin avatars), and Higgsfield (cinematic AI video), plus TTS and FFmpeg post-processing.

**Skills Used:**
- `.claude/skills/remotion/` — React-based video compositions, rendering, animation patterns
- `.claude/skills/heygen/` — digital twin avatar creation, lip-sync, avatar video API
- `.claude/skills/formula100k/` — video production guide, B-roll generation techniques
- `reference-videos/` — animation style references for replication
- FFmpeg — audio normalization, multi-platform export, subtitle burn-in, transitions

**Three Video Backends:**
| Backend | Use Case | Method |
|---------|----------|--------|
| **Remotion** | Data-driven explainers, listicles, quote cards, text-heavy content | React compositions rendered via `@remotion/renderer` |
| **HeyGen** | Digital twin talking-head videos, personalized outreach | MCP server (`https://mcp.heygen.com/mcp/v1/`) + API |
| **Higgsfield** | Cinematic AI-generated video clips, B-roll, product showcases | `@higgsfield/client` Node.js SDK + Python SDK |

**Responsibilities:**
1. Select the appropriate video backend based on content type and creative brief
2. Build Remotion compositions for data-driven content (explainers, listicles, animated text)
3. Generate avatar videos via HeyGen for talking-head content and personalized outreach
4. Create cinematic B-roll and product videos via Higgsfield for high-production-value content
5. Generate voiceover with Edge-TTS, selecting appropriate voice from 45+ available options
6. Transcribe audio with faster-whisper for word-level caption timing
7. Post-process with FFmpeg: audio normalization (-16 LUFS), subtitle burn-in, platform-specific export
8. Replicate animation styles from `reference-videos/` for brand consistency

**Quality Checklist:**
- [ ] Video passes Tier 1 QA: ffprobe validates correct resolution, frame rate, codec, and duration
- [ ] Video passes Tier 2 QA: no black frames (blackdetect), no frozen frames (freezedetect), no dead silence (silencedetect)
- [ ] Audio is normalized to -16 LUFS (broadcast standard)
- [ ] Captions are properly synced — no drift greater than 200ms from spoken words
- [ ] Brand intro/outro from `brand/assets/videos/` is attached when specified
- [ ] All platform exports match required specs (resolution, aspect ratio, duration limits)
- [ ] HeyGen avatar lip-sync is natural with no uncanny valley artifacts
- [ ] Video file size is under platform upload limits (YouTube: 256GB, TikTok: 287MB, Reels: 1GB)

---

## 5. Research Analyst

**Role:** Conducts source-grounded research via NotebookLM and trend analysis using Formula 100K methodology.

**Skills Used:**
- `.claude/skills/notebooklm/` — browser automation via Patchright, notebook queries, source-grounded answers
- `.claude/skills/formula100k/` — research sub-skill, trend hunting, topic validation

**Responsibilities:**
1. Upload source documents to NotebookLM notebooks for grounded research queries
2. Extract citation-backed insights — every claim must link to a source document
3. Hunt trending topics in the brand's niche using Formula 100K trend detection
4. Validate content topics against search volume, competition, and audience interest
5. Build research briefs that Content Strategist and Copywriter can action immediately
6. Monitor industry news and surface timely content opportunities within 24-48 hours
7. Maintain a research library organized by topic, source quality, and recency

**Quality Checklist:**
- [ ] Every factual claim includes a source citation from NotebookLM
- [ ] Research brief clearly separates facts, opinions, and inferences
- [ ] Trending topics validated with at least 2 independent signals (search volume, social mentions, news coverage)
- [ ] Source documents are recent (within 90 days) unless historical context is explicitly needed
- [ ] Research output is actionable — includes specific content angles, not just raw data
- [ ] No hallucinated statistics or unsourced numbers in any deliverable
- [ ] Competitor research includes direct links, screenshots, or archived references
- [ ] Research handoff to Content Strategist includes recommended priority and urgency

---

## 6. SEO Specialist

**Role:** Manages keyword research, on-page optimization, technical SEO audits, and search performance tracking.

**Skills Used:**
- `.claude/skills/marketing/seo-audit/` — site audit checklists, crawl analysis
- `.claude/skills/marketing/ai-seo/` — AI-native content patterns, platform ranking factors
- `.claude/skills/marketing/analytics-tracking/` — GA4 implementation, GTM, event tracking
- `.claude/skills/marketing/content-strategy/` — pillar-cluster SEO architecture
- `.claude/skills/marketing/competitor-alternatives/` — competitor keyword gap analysis

**Responsibilities:**
1. Conduct keyword research with search volume, difficulty, and intent classification
2. Build pillar-cluster topic architectures that support topical authority
3. Optimize on-page elements: title tags, meta descriptions, headings, internal links, schema markup
4. Run technical SEO audits: crawlability, Core Web Vitals, mobile-friendliness, indexation issues
5. Implement GA4 event tracking and GTM containers for conversion measurement
6. Monitor keyword rankings and organic traffic trends, flagging drops within 48 hours
7. Optimize video content for YouTube SEO: titles, descriptions, tags, chapters, thumbnails
8. Audit AI-generated content for SEO compliance (no thin content, proper E-E-A-T signals)

**Quality Checklist:**
- [ ] Target keyword identified and naturally placed in title, H1, first paragraph, and meta description
- [ ] Internal links connect to at least 2 related pillar/cluster pages
- [ ] Schema markup (JSON-LD) is valid and matches content type (Article, Video, FAQ, HowTo)
- [ ] Page load time under 3 seconds on mobile (Core Web Vitals passing)
- [ ] No duplicate content, thin pages, or orphaned URLs in the content set
- [ ] GA4 events fire correctly for all key conversion actions
- [ ] YouTube video descriptions include timestamps, keywords, and links
- [ ] AI-SEO patterns applied: content answers questions directly, uses natural entity references

---

## 7. Distribution Manager

**Role:** Handles multi-platform export, format adaptation, watermarking, and publishing-ready asset packaging.

**Skills Used:**
- FFmpeg — resize, re-encode, crop, pad for platform-specific aspect ratios
- `brand/assets/logos/` — watermark overlays for exported content
- ImageMagick — image resizing, format conversion for platform specs
- Platform specification knowledge (see table below)

**Platform Export Specifications:**
| Platform | Aspect Ratio | Resolution | Max Duration | Max File Size |
|----------|-------------|------------|--------------|---------------|
| YouTube | 16:9 | 1920x1080 (or 3840x2160 4K) | 12 hours | 256 GB |
| TikTok | 9:16 | 1080x1920 | 10 min | 287 MB |
| Instagram Reels | 9:16 | 1080x1920 | 15 min | 1 GB |
| Instagram Post | 1:1 | 1080x1080 | 60 sec (video) | 100 MB |
| Instagram Story | 9:16 | 1080x1920 | 60 sec | 100 MB |
| LinkedIn Video | 1:1 or 16:9 | 1920x1080 | 10 min | 5 GB |
| LinkedIn Image | 1.91:1 | 1200x627 | N/A | 10 MB |
| X (Twitter) Video | 16:9 or 1:1 | 1920x1080 | 2 min 20 sec | 512 MB |
| X (Twitter) Image | 16:9 | 1600x900 | N/A | 5 MB |
| YouTube Shorts | 9:16 | 1080x1920 | 3 min | 256 GB |

**Responsibilities:**
1. Export every video asset in all required platform formats from a single source render
2. Apply brand watermark from `brand/assets/logos/watermark.png` at consistent position and opacity
3. Resize and crop images for each platform using ImageMagick with smart gravity (face-aware cropping)
4. Validate exported files against platform specs: resolution, aspect ratio, duration, and file size limits
5. Generate platform-specific thumbnails with text overlay variations per platform
6. Package campaign exports into organized folders: `output/{campaign}/{platform}/{asset}`
7. Create a manifest file listing all exported assets with metadata (format, size, platform, status)
8. Strip EXIF/metadata from images before export to protect location and device data

**Quality Checklist:**
- [ ] Every platform export matches the exact resolution and aspect ratio spec
- [ ] Watermark is visible but not distracting (10-15% opacity, bottom-right corner)
- [ ] File sizes are within platform upload limits — re-encode if exceeded
- [ ] No letterboxing or pillarboxing unless explicitly requested
- [ ] Audio is present and synced in all video exports (ffprobe validation)
- [ ] Export manifest is generated with file paths, sizes, and platform targets
- [ ] EXIF metadata stripped from all image exports
- [ ] Campaign folder structure is clean: `output/{campaign}/{platform}/{asset-name}.{ext}`

---

## Agent Coordination

### Typical Campaign Flow

```
Research Analyst ──► Content Strategist ──► Copywriter ──────► Video Producer ──► Distribution Manager
       │                    │                    │                    │
       │                    ▼                    ▼                    ▼
       │              SEO Specialist      Visual Designer        QA (Tier 1-4)
       │                    │                    │
       └────────────────────┴────────────────────┘
                    Feedback loops
```

1. **Research Analyst** gathers insights and trending topics
2. **Content Strategist** builds the campaign plan and content calendar
3. **SEO Specialist** provides keyword targets and optimization requirements
4. **Copywriter** writes scripts, captions, and email sequences
5. **Visual Designer** creates images, thumbnails, and graphics
6. **Video Producer** renders videos using Remotion/HeyGen/Higgsfield
7. **Distribution Manager** exports all assets for every target platform

### Handoff Protocol

- Every handoff between agents includes a structured brief with: objective, constraints, brand reference, and deadline
- Receiving agent confirms brief understanding before starting work
- All produced assets are saved to `output/` with the naming convention: `{campaign}-{agent}-{asset}-{variant}.{ext}`
- Quality checklist must be completed before handoff to the next agent
