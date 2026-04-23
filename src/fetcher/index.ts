import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { detectSource } from './detector.js'
import { fetchYoutubeTranscript } from './youtube.js'
import { fetchLatestRssEpisode } from './rss.js'
import { fetchWhisperTranscript } from './whisper.js'
import { getAllRssFeeds } from './shows.js'

const TRANSCRIPTS_DIR = join(process.cwd(), 'wiki', 'raw', 'transcripts')

type TranscriptSource = 'youtube' | 'rss' | 'spotify_rss' | 'whisper'

interface FetchResult {
  content: string
  source: TranscriptSource
  meta: Record<string, string>
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
}

function saveTranscript(filename: string, content: string): string {
  if (!existsSync(TRANSCRIPTS_DIR)) mkdirSync(TRANSCRIPTS_DIR, { recursive: true })
  const filePath = join(TRANSCRIPTS_DIR, filename)
  writeFileSync(filePath, content, 'utf-8')
  return filePath
}

function buildFrontmatter(source: TranscriptSource, url: string, extra: Record<string, string>): string {
  const lines = [
    '---',
    `transcript_source: ${source}`,
    `url: ${url}`,
    ...Object.entries(extra).map(([k, v]) => `${k}: ${v}`),
    `fetched_at: ${new Date().toISOString()}`,
    'status: raw',
    '---',
  ]
  return lines.join('\n')
}

// ── Adım 1: YouTube transcript ─────────────────────────────────────────────
async function tryYoutube(url: string): Promise<FetchResult | null> {
  const source = detectSource(url)
  if (source !== 'youtube') return null
  try {
    console.log('[fetcher] Adım 1 — YouTube transcript deneniyor...')
    const result = await fetchYoutubeTranscript(url)
    return { source: 'youtube', content: result.transcript, meta: { video_id: result.videoId } }
  } catch (err: unknown) {
    console.log(`[fetcher] YouTube transcript yok: ${(err as Error).message}`)
    return null
  }
}

// ── Adım 2: RSS / Spotify RSS ──────────────────────────────────────────────
async function tryRssFeeds(url: string): Promise<FetchResult | null> {
  const source = detectSource(url)

  // Kullanıcı doğrudan RSS URL'si verdiyse onu dene
  if (source === 'rss') {
    try {
      console.log('[fetcher] Adım 2 — RSS feed deneniyor...')
      const result = await fetchLatestRssEpisode(url)
      return {
        source: 'rss',
        content: `# ${result.title}\n\n${result.content}`,
        meta: { title: result.title, pub_date: result.pubDate, episode_url: result.episodeUrl },
      }
    } catch (err: unknown) {
      console.log(`[fetcher] RSS transcript yok: ${(err as Error).message}`)
      return null
    }
  }

  // YouTube ya da diğer URL'ler için shows-config'deki feed'leri sırayla dene
  const rssFeeds = getAllRssFeeds()
  if (rssFeeds.length === 0) return null

  console.log(`[fetcher] Adım 2 — ${rssFeeds.length} RSS feed deneniyor (shows-config.json)...`)
  for (const feedUrl of rssFeeds) {
    try {
      const result = await fetchLatestRssEpisode(feedUrl)
      const label: TranscriptSource = source === 'spotify' ? 'spotify_rss' : 'rss'
      console.log(`[fetcher] RSS bulundu: ${feedUrl}`)
      return {
        source: label,
        content: `# ${result.title}\n\n${result.content}`,
        meta: { title: result.title, pub_date: result.pubDate, episode_url: result.episodeUrl, feed_url: feedUrl },
      }
    } catch {
      // sessizce sonraki feed'e geç
    }
  }

  console.log('[fetcher] Tüm RSS feed\'leri başarısız.')
  return null
}

// ── Adım 3: Whisper ────────────────────────────────────────────────────────
async function tryWhisper(url: string): Promise<FetchResult> {
  console.log('[fetcher] Adım 3 — Whisper transkripsiyon başlıyor...')
  const result = await fetchWhisperTranscript(url)
  return { source: 'whisper', content: result.transcript, meta: { language: result.language } }
}

// ── Ana cascade ────────────────────────────────────────────────────────────
export async function fetchTranscript(url: string): Promise<string> {
  const date = new Date().toISOString().slice(0, 10)

  // 1 → 2 → 3 sırasıyla dene
  const result =
    (await tryYoutube(url)) ??
    (await tryRssFeeds(url)) ??
    (await tryWhisper(url))

  const identifier = result.meta.video_id ?? result.meta.title ?? url.split('/').at(-1) ?? 'transcript'
  const filename = `${date}-${result.source}-${slugify(identifier)}.md`
  const frontmatter = buildFrontmatter(result.source, url, result.meta)
  const saved = saveTranscript(filename, `${frontmatter}\n\n${result.content}\n`)

  console.log(`[fetcher] ✓ Kaydedildi (kaynak: ${result.source}): ${saved}`)
  return saved
}
