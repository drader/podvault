# podvault — Master Schema

This file is the system constitution. Read every session.

## Purpose

<!-- TODO: Describe your goal in your own words. Example: -->
<!-- "Takip ettiğim [kategori] podcastlerinden öğrendiklerimi aranabilir, bağlantılı bir kişisel wiki'ye dönüştürmek." -->

**Kategoriler:** <!-- örn. AI · Bilim · Tarih -->

**Takip edilen podcastler:**
<!-- Her podcast için aşağıdaki formatı kullan. shows-config.json ile eşleşmeli. -->
<!-- - Kategori: Podcast Adı 1, Podcast Adı 2 -->

**Dinleme sıklığı:** <!-- örn. Haftalık transcript ingest -->

**Açık sorular (baştan takip edilecek):**
<!-- Araştırmak istediğin, podcastleri dinleyerek yanıt aradığın sorular: -->
<!-- - Soru 1? -->
<!-- - Soru 2? -->

## System Architecture

```
TypeScript Motor (src/)     →  scheduler, runner, locker, validator, budget, consolidator
Markdown Content            →  wiki/, agents/, memory/, commands/
MCP Server                  →  obsidian-hybrid-search (semantic search over wiki/)
```

## Two Memory Layers

| Layer | Location | Content | Written by |
|---|---|---|---|
| Process memory | `agents/*/MEMORY.md` | Listening patterns, recurring themes, hypotheses | Each agent |
| Domain knowledge | `wiki/` | Episodes, shows, guests, topics, concepts | Agents via locker |

The weekly consolidator bridges process memory → domain knowledge automatically.

## Tier System

- **Tier 1** — Every session: `memory/`, `scratch/ideas.md`, `journal/` (last 3 days)
- **Tier 2** — When agent/domain is active: `wiki/index.md`, `agents/[active]/AGENT.md + MEMORY.md`
- **Tier 3** — Only when explicitly requested: `wiki/archive/`, `outputs/`, old `journal/`

## Operations

- **INGEST** — New transcript → structured wiki page (`/ingest`)
- **QUERY**  — Ask a question, get a wiki-backed answer with episode citations (`/query`)
- **LINT**   — Wiki health check: orphan pages, missing sources, broken links (`/lint`)
- **CONSOLIDATE** — MEMORY.md → wiki bridge (orchestrator, weekly)
- **NEW-RESEARCH** — Start a new isolated research topic (`/new-research`)

## Hard Rules

1. `wiki/raw/` is never modified — read only
2. Every claim cites a source episode — unsourced claims are forbidden
3. Contradictions are flagged with `## CONFLICT`, never deleted
4. Pages are never deleted — moved to `wiki/archive/`, status: archived
5. Every operation is logged with a timestamp to `wiki/log.md`
6. Wiki writes go through the locker — no direct writes
7. Never modify another agent's files

## Directory Guide

```
CLAUDE.md          this file — master schema
MANIFEST.md        tier routing map
CONVENTIONS.md     naming rules
AGENT_REGISTRY.md  active agents index

src/               TypeScript motor
wiki/              podcast knowledge base
  raw/transcripts/ drop episode transcripts or show notes here
  episodes/        one structured summary per episode
  shows/           podcast show profiles
  guests/          guest profiles (linked from episodes)
  topics/          recurring discussion topics and themes
  concepts/        higher-level ideas surfacing across episodes
  syntheses/       cross-episode thematic analyses
research/          topic-isolated research spaces (independent from wiki/)
  {topic}/         one folder per research topic (/new-research to create)
agents/            agent definitions and process memories
memory/            system-wide Tier 1 state
scratch/           episodes to listen to, open questions
journal/           cross-agent signal channel
commands/          slash command prompt templates
scripts/           setup and management scripts
outputs/           listening lists, weekly topic reports
```
