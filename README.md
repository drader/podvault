# podvault

An agentic podcast knowledge wiki. Drop episode transcripts or show notes in — agents extract insights, quotes, and resources, linking guests, shows, and topics automatically.

## What it does

- **Ingest** — Drop a transcript into `wiki/raw/transcripts/`. The researcher agent produces a structured wiki page in `wiki/episodes/`, cross-linked to show, guest, and topic pages.
- **Query** — Ask a natural-language question with `/query`. Get a wiki-backed answer with source citations.
- **Research** — Each `research/<topic>/` folder tracks a subject area across academic papers and podcasts. A scheduled agent updates it monthly.
- **Consolidate** — Weekly orchestrator promotes recurring patterns from agent process memory into `wiki/syntheses/`.

## Architecture

```
wiki/
  raw/transcripts/   drop episode transcripts or show notes here
  episodes/          one structured summary per episode
  shows/             podcast show profiles
  guests/            guest and host profiles
  topics/            recurring discussion topics and themes
  concepts/          higher-level ideas across episodes
  syntheses/         cross-episode thematic analyses
  archive/           retired pages (never deleted)

research/
  <topic>/
    index.md         topic framework + search keywords + schedule
    literature.md        academic signals for podcast discovery
    podcasts.md      podcast leads with ingest status
    log.md           append-only research history

src/           TypeScript agent runner, research motor, cascade fetcher
agents/        agent definitions and process memories
commands/      slash command templates
```

See `docs/report/index.html` for the full architecture report.

## Setup

**Prerequisites:** Node.js 20+, [Claude CLI](https://github.com/anthropics/claude-code) (`npm install -g @anthropic-ai/claude-code`), `obsidian-hybrid-search` (`npm install -g obsidian-hybrid-search`), git.

```bash
git clone https://github.com/YOUR_USERNAME/podvault my-podvault
cd my-podvault
npm install
cp .env.example .env        # fill in your API keys
npm run setup               # creates wiki directories, seeds config
```

Edit `CLAUDE.md` to set your podcast categories and open questions, then edit `shows-config.json` to list the shows you follow.

## Slash commands

| Command | Description |
|---|---|
| `/ingest` | Process a new transcript → wiki page |
| `/query <question>` | Ask a question, get a sourced answer |
| `/lint` | Check wiki health (orphan pages, missing sources) |
| `/new-research <topic>` | Create a new research folder + schedule a routine |
| `/fetch-transcript` | Fetch a transcript via YouTube → RSS → Whisper cascade |
| `/setup` | First-time intake interview |
| `/session-start` | Load context, log session open |
| `/session-end` | Flush scratch notes, log session close |

## Automation options

**Option A — GitHub Actions + BYOK:** Add your LLM API key as a repo secret (`LLM_API_KEY`) and set `LLM_PROVIDER` in the workflow file. One workflow file per research topic in `.github/workflows/`.

**Option B — Claude Routines:** If you have a Claude Pro or higher account, use `/new-research` to create a Claude Routine (CCR) that runs in Anthropic's cloud — no local machine needed.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `LLM_PROVIDER` | Yes (for GitHub Actions) | `anthropic`, `openai`, `google`, `deepseek`, `llama`, or `grok` |
| `LLM_API_KEY` | Yes (for GitHub Actions) | API key for the chosen provider |
| `LLM_MODEL` | No | Override default model for the provider |
| `TAVILY_API_KEY` | No | Enables web search during research runs |

## License

MIT
