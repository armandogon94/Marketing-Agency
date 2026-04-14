# Port Allocation — Project 16: Marketing Agency

> All host-exposed ports are globally unique across all 16 projects so every project can run simultaneously. See `../PORT-MAP.md` for the full map.
> This project is **local-only** (MacBook Apple Silicon). It is never deployed to the VPS.

## Current Assignments

| Service | Host Port | Container Port | File |
|---------|-----------|---------------|------|
| Agency app (Remotion + pipeline) | **3160** | 3000 | docker-compose.dev.yml |
| Redis | **6385** | 6379 | docker-compose.dev.yml |

## Allowed Range for New Services

If you need to add a new service to this project, pick from these ranges **only**:

| Type | Allowed Host Ports |
|------|--------------------|
| Frontend / UI | `3160 – 3169` |
| Backend / API | `8160 – 8169` |
| PostgreSQL | Not assigned. If needed, request an assignment in `../PORT-MAP.md`. |
| Redis | `6385` (already assigned — do not spin up a second instance) |

Available slots: `3161-3169`, `8160-8169`.

## Do Not Use

Every port outside the ranges above is reserved by another project. Always check `../PORT-MAP.md` before picking a port.

Key ranges already taken:
- `3150-3159 / 8150-8159` → Project 15
- `13000-13110` → Project 13 CRM
- `5432-5439` → Projects 02-05, 11-13, 15 PostgreSQL
- `6379-6384` → Projects 02, 05, 10, 12, 13, 15 Redis
- `3000` → macOS/generic default — **never use as a host port**
