# Skill: WIKI_INGEST

New transcript → structured wiki page.

## Trigger
A file exists in `wiki/raw/transcripts/` with no corresponding page in `wiki/episodes/`.

## Steps

1. Find the most recently modified uningest file in `wiki/raw/transcripts/`
2. Read the transcript or show notes. Extract:
   - Show name, episode title, episode number (if available), date published
   - Host(s) and guest(s) (full names)
   - Episode duration (if present in the file)
   - Key topics discussed (3–7 topics)
   - Key insights and takeaways (5 bullet points)
   - Memorable quotes (2–3 direct quotes worth saving)
   - Resources, books, tools, or people mentioned
   - Concepts introduced or explored in depth
   - Open questions or disagreements left unresolved
3. Write `wiki/episodes/YYYY-MM-DD-show-slug-epN.md` (SCHEMA.md format):
   - Frontmatter: title, show, episode_number, guests, hosts, date, tags, source (raw file path), status: active
   - Sections: Summary, Key Topics, Key Insights, Quotes, Resources Mentioned, Open Questions, Sources, Related
4. For the show: create or update `wiki/shows/show-name.md`
   - Bidirectional link: show → episode, episode → show
5. For each guest: create or update `wiki/guests/firstname-lastname.md`
   - Bidirectional link: guest → episode, episode → guest
6. For each recurring topic: create or update `wiki/topics/topic-name.md`
7. For each high-level concept explored in depth: create or update `wiki/concepts/concept-name.md`
8. Update `wiki/index.md` — add new pages to the relevant categories
9. Write to `wiki/log.md`:
   ```
   ## [YYYY-MM-DD] ingest | show-slug-epN
   Pages touched: episodes/X, shows/Y, guests/A B, topics/C
   ```

## Rules
- Never modify files in `wiki/raw/` — read only
- Every claim in an episode page must link back to its transcript source
- If an episode is already ingested: update the existing page, do not create a new one
- If a transcript is unreadable: log to `journal/`, skip, continue to next episode
- All wiki writes go through the locker
