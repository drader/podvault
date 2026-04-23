export type SourceType = 'youtube' | 'rss' | 'spotify' | 'unknown'

export function detectSource(url: string): SourceType {
  try {
    const { hostname, pathname } = new URL(url)
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'youtube'
    if (hostname.includes('spotify.com')) return 'spotify'
    if (pathname.endsWith('.xml') || pathname.endsWith('.rss') || url.includes('feed')) return 'rss'
    return 'unknown'
  } catch {
    return 'unknown'
  }
}

export function extractYoutubeId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.slice(1)
    return parsed.searchParams.get('v')
  } catch {
    return null
  }
}
