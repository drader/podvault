import { YoutubeTranscript } from 'youtube-transcript'
import { extractYoutubeId } from './detector.js'

export interface YoutubeResult {
  videoId: string
  transcript: string
  url: string
}

export async function fetchYoutubeTranscript(url: string): Promise<YoutubeResult> {
  const videoId = extractYoutubeId(url)
  if (!videoId) throw new Error(`YouTube video ID çıkarılamadı: ${url}`)

  const segments = await YoutubeTranscript.fetchTranscript(videoId)
  if (!segments || segments.length === 0) throw new Error(`Bu video için transcript bulunamadı: ${videoId}`)

  const transcript = segments
    .map(s => s.text.trim())
    .filter(Boolean)
    .join(' ')

  return { videoId, transcript, url }
}
