# Wiki Schema — Constitution

This file is the wiki's constitution. The LLM follows these rules on every wiki write.

## Purpose

A permanent knowledge base for podcast episodes. Domain: defined in CLAUDE.md.

## Folder Structure

| Folder | Content | Does NOT contain |
|---|---|---|
| `raw/transcripts/` | Raw episode transcripts and show notes (.txt, .md) | Anything processed |
| `episodes/` | One structured summary per episode | Opinions, synthesis |
| `shows/` | Podcast show profiles linked from episodes | Episode content |
| `guests/` | Guest profiles linked from episodes | Abstract concepts |
| `topics/` | Recurring discussion topics and themes | High-level concepts |
| `concepts/` | High-level ideas surfacing across multiple episodes | Specific topics |
| `syntheses/` | Cross-episode thematic analyses | Raw episode summaries |
| `archive/` | Retired pages — never deleted | Active content |
| `_seed/` | Starter template pages — can be deleted after setup | Real knowledge |

## Episode Page Format

```markdown
---
title: "The Future of AI Agents"
show: Lex Fridman Podcast
episode_number: 421
guests: [Andrej Karpathy]
hosts: [Lex Fridman]
date: YYYY-MM-DD
tags: [ai-agents, llm, autonomous-systems]
source: raw/transcripts/lex-421-karpathy.txt
status: active
---

# The Future of AI Agents

One-paragraph summary of the episode's main thread.

## Key Topics
- Topic 1
- Topic 2
- Topic 3

## Key Insights
- Insight 1 [[source: this episode]]
- Insight 2
- Insight 3

## Quotes
> "Direct quote from the episode." — Guest Name

## Resources Mentioned
- Book/tool/paper/person mentioned in the episode

## Open Questions
What did the episode leave unresolved or debate without conclusion?

## CONFLICT (if any)
[[episodes/episode-a]] says X while [[episodes/episode-b]] says Y. Unresolved — YYYY-MM-DD.

## Sources
- [[raw/transcripts/filename]]

## Related
- [[shows/show-name]]
- [[guests/firstname-lastname]]
- [[topics/topic-name]]
- [[concepts/concept-name]]
```

## Naming Conventions

- File names: kebab-case
- Episode pages: `YYYY-MM-DD-show-slug-epN.md`
- Show pages: canonical show slug (`lex-fridman-podcast.md`)
- Guest pages: `firstname-lastname.md`
- Topic pages: canonical topic slug (`effective-altruism.md`)
- Concept pages: canonical concept slug (`emergence-in-llms.md`)

## Hard Rules

1. `raw/` is never modified — read only
2. Every insight or quote cites its source episode — unsourced claims are forbidden
3. Conflicts are flagged with `## CONFLICT`, never deleted
4. Pages are never deleted — moved to `archive/`, status: archived
5. Bidirectional links are required: if A links to B, B must list A in `## Related`
6. Every operation is logged to `log.md`
