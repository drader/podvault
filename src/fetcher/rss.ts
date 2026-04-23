import Parser from 'rss-parser'

export interface RssResult {
  feedUrl: string
  title: string
  content: string
  pubDate: string
  episodeUrl: string
}

const parser = new Parser()

export async function fetchLatestRssEpisode(feedUrl: string): Promise<RssResult> {
  const feed = await parser.parseURL(feedUrl)
  const item = feed.items[0]
  if (!item) throw new Error(`RSS feed boş: ${feedUrl}`)

  const content = [
    item.title ?? '',
    item.contentSnippet ?? item.content ?? '',
  ].filter(Boolean).join('\n\n')

  return {
    feedUrl,
    title: item.title ?? 'Başlık yok',
    content,
    pubDate: item.pubDate ?? new Date().toISOString(),
    episodeUrl: item.link ?? feedUrl,
  }
}
