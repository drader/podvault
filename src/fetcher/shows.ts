import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

interface ShowConfig {
  name: string
  youtube_channel: string
  rss_feed: string
}

interface ShowsConfig {
  shows: ShowConfig[]
}

function loadConfig(): ShowsConfig {
  const configPath = join(process.cwd(), 'shows-config.json')
  if (!existsSync(configPath)) return { shows: [] }
  return JSON.parse(readFileSync(configPath, 'utf-8'))
}

export function getRssFeedsForYoutubeUrl(url: string): string[] {
  const config = loadConfig()
  const urlLower = url.toLowerCase()

  // URL'de channel ID geçiyorsa eşleştir, yoksa tüm feed'leri döndür (fallback)
  const matched = config.shows.filter(s =>
    s.youtube_channel && urlLower.includes(s.youtube_channel.toLowerCase())
  )

  // Eşleşen show varsa onun feed'ini, yoksa tüm feed'leri dön
  const feeds = (matched.length > 0 ? matched : config.shows)
    .map(s => s.rss_feed)
    .filter(Boolean)

  return feeds
}

export function getAllRssFeeds(): string[] {
  return loadConfig().shows.map(s => s.rss_feed).filter(Boolean)
}
