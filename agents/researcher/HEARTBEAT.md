---
schedule: "0 9 * * 2-5"
token_limit: 8000
---

# Researcher Heartbeat

Runs Tuesday–Friday at 09:00.

## Each Cycle

### 1. Read Context
- `memory/status.md` and recent journal entries
- `wiki/index.md` — current state of the knowledge base
- Own `MEMORY.md` — patterns from previous cycles

### 2. Assess
- Are there uningest transcripts in `wiki/raw/transcripts/`?
  - Yes → run WIKI_INGEST skill
  - No → run Wakeup routine

### 3. Wakeup (when queue is empty)
1. Scan `wiki/episodes/` — identify episodes with no linked guest or show page
2. Scan `wiki/topics/` — find topics mentioned in only one episode; check for cross-episode patterns
3. Review `scratch/ideas.md` — open questions, episodes flagged for deeper review
4. Write to `journal/YYYY-MM-DD.md`: "Topics worth exploring this week" based on gaps and recurring themes found

### 4. Log
- Operation record to `wiki/log.md`
- Confirmed new patterns to `MEMORY.md`

## Escalation
- `wiki/raw/transcripts/` empty for 2+ weeks → write warning to `memory/status.md`
- Transcript unreadable during INGEST → log to `journal/`, continue to next episode
