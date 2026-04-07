.PHONY: help install dev build docker docker-build docker-down docker-logs \
       generate-video generate-image generate-avatar voices templates \
       campaign-create campaign-plan campaign-produce campaign-export \
       install-skills test test-js test-py lint clean check

help: ## Show all commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-25s\033[0m %s\n", $$1, $$2}'

# ──────────────── Installation ────────────────

install: ## Install all dependencies (npm + uv + check tools)
	npm install
	uv sync
	@command -v ffmpeg >/dev/null 2>&1 || echo "⚠ FFmpeg not found — install with: brew install ffmpeg"
	@command -v magick >/dev/null 2>&1 || echo "⚠ ImageMagick not found — install with: brew install imagemagick"
	@echo "✓ Dependencies installed"

install-skills: ## Clone/install all external skills
	@echo "Installing marketing skills..."
	@git clone --depth 1 https://github.com/coreyhaines31/marketingskills.git /tmp/marketingskills 2>/dev/null || true
	@cp -r /tmp/marketingskills/skills/* .claude/skills/marketing/ 2>/dev/null || true
	@rm -rf /tmp/marketingskills
	@echo "Installing banana-claude (image gen)..."
	@git clone --depth 1 https://github.com/agricidaniel/banana-claude.git /tmp/banana-claude 2>/dev/null || true
	@cp -r /tmp/banana-claude/skills/banana/* .claude/skills/banana/ 2>/dev/null || true
	@rm -rf /tmp/banana-claude
	@echo "Installing humanizer..."
	@git clone --depth 1 https://github.com/blader/humanizer.git /tmp/humanizer 2>/dev/null || true
	@cp /tmp/humanizer/SKILL.md .claude/skills/humanizer/SKILL.md 2>/dev/null || true
	@rm -rf /tmp/humanizer
	@echo "Installing notebooklm-skill..."
	@git clone --depth 1 https://github.com/pleaseprompto/notebooklm-skill.git /tmp/notebooklm-skill 2>/dev/null || true
	@cp -r /tmp/notebooklm-skill/SKILL.md .claude/skills/notebooklm/ 2>/dev/null || true
	@cp -r /tmp/notebooklm-skill/scripts/ .claude/skills/notebooklm/scripts/ 2>/dev/null || true
	@rm -rf /tmp/notebooklm-skill
	@echo "Installing HeyGen skills..."
	@npx skills add heygen-com/skills 2>/dev/null || echo "⚠ HeyGen skills install requires npx skills CLI"
	@echo "✓ All skills installed"

check: ## Verify all dependencies are installed
	@echo "Checking dependencies..."
	@node --version
	@python3 --version
	@ffmpeg -version 2>/dev/null | head -1 || echo "✗ FFmpeg not found"
	@magick --version 2>/dev/null | head -1 || echo "✗ ImageMagick not found"
	@echo "✓ Check complete"

# ──────────────── Development ────────────────

dev: ## Start Remotion Studio (visual preview)
	npx remotion studio

build: ## Bundle Remotion for rendering
	npx remotion bundle

# ──────────────── Docker ────────────────

docker: ## Start containers
	docker compose -f docker-compose.dev.yml up -d

docker-build: ## Rebuild and start containers
	docker compose -f docker-compose.dev.yml up -d --build

docker-down: ## Stop containers
	docker compose -f docker-compose.dev.yml down

docker-logs: ## Tail container logs
	docker compose -f docker-compose.dev.yml logs -f

# ──────────────── Video Generation ────────────────

# Usage: make generate-video SCRIPT="Your text" VOICE="es-MX-JorgeNeural" TEMPLATE="explainer"
generate-video: ## Generate a video from script text
	npm run generate -- --script "$(SCRIPT)" --voice "$(or $(VOICE),es-MX-JorgeNeural)" --template "$(or $(TEMPLATE),explainer)"

voices: ## List available TTS voices
	npm run voices

templates: ## List available video templates
	npm run templates

# ──────────────── Avatar Videos ────────────────

generate-avatar: ## Generate an avatar video (heygen/higgsfield)
	@echo "Use Claude Code agents: ask Video Producer to create an avatar video"

# ──────────────── Image Generation ────────────────

generate-image: ## Generate an image with Gemini
	@echo "Use Claude Code agents: ask Visual Designer to create an image"

# ──────────────── Campaign Management ────────────────

# Usage: make campaign-create NAME="Q2-Launch" BRAND=default
campaign-create: ## Create a new campaign folder
	npm run campaign -- create --name "$(NAME)" --brand "$(or $(BRAND),default)"

campaign-plan: ## Generate content calendar for campaign
	npm run campaign -- plan --name "$(NAME)"

campaign-produce: ## Generate all assets for campaign
	npm run campaign -- produce --name "$(NAME)"

campaign-export: ## Export campaign assets for all platforms
	npm run campaign -- export --name "$(NAME)"

# ──────────────── Testing & Quality ────────────────

test: test-js test-py ## Run all tests

test-js: ## Run JavaScript tests (vitest)
	npm test

test-py: ## Run Python tests (pytest)
	uv run pytest

lint: ## Run linters
	npm run lint

# ──────────────── Utilities ────────────────

clean: ## Remove generated output and build artifacts
	rm -rf output/* dist/ build/ remotion-bundle/
	@echo "✓ Cleaned output and build directories"
