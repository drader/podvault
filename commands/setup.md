# /setup

First-time setup — intake interview. Solves the cold start problem.

## Usage

```
/setup
```

Called by `npm run setup`. Can also be run directly inside Claude Code.

## Steps

Ask the user these 7 questions in order (wait for each answer before proceeding):

1. **Shows**: Which podcasts do you follow or want to track?
   _(List show names — as many as you want)_

2. **Goal**: What is the purpose of this vault in one sentence?
   _(e.g. "Build a searchable memory of everything I've learned from tech podcasts" or "Track AI discussions across all shows I follow")_

3. **Key topics**: List 5 recurring topics or themes you want the wiki to track from day one.

4. **Key guests or hosts**: Are there specific speakers whose episodes you always want ingested?

5. **Open questions**: What are 3 questions you frequently want to answer from podcast knowledge?
   _(e.g. "What has Andrej Karpathy said about agent architectures?")_

6. **Listening habit**: How often do you expect to drop new transcripts into `wiki/raw/transcripts/`?
   _(daily / a few per week / a few per month)_

7. **Existing transcripts**: Do you have any transcript files ready to drop in `wiki/raw/transcripts/` right now?

## Setup Output

After collecting answers:

1. `CLAUDE.md` — update Purpose with the stated goal and shows
2. `memory/status.md` — fill with project context and listening cadence
3. `memory/glossary.md` — add the 5 key topics
4. `wiki/topics/` — write a starter page for each topic (from LLM knowledge, clearly marked as unseeded)
5. `wiki/shows/` — write a stub page for each show listed
6. `wiki/guests/` — write a stub page for each key speaker
7. `wiki/index.md` — updated catalog
8. `agents/researcher/MEMORY.md` — populate Bootstrap Hypotheses with topic-specific hypotheses based on open questions
9. If existing transcripts are available: immediately start `/ingest`

## Rule
Do not fabricate or speculate in wiki pages.
Unseeded show, guest, and topic pages must include the note:
"No episodes ingested yet for this entry. This page will be enriched after the first relevant ingest."
