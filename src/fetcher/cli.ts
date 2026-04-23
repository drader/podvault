import { fetchTranscript } from './index.js'

const url = process.argv[2]

if (!url) {
  console.error('Kullanım: npx tsx src/fetcher/cli.ts <url>')
  console.error('Örnekler:')
  console.error('  npx tsx src/fetcher/cli.ts https://www.youtube.com/watch?v=VIDEO_ID')
  console.error('  npx tsx src/fetcher/cli.ts https://feeds.example.com/podcast.rss')
  process.exit(1)
}

fetchTranscript(url)
  .then(saved => {
    console.log(`\n✓ Transcript kaydedildi: ${saved}`)
    console.log('  Şimdi /ingest çalıştırabilirsin.')
  })
  .catch(err => {
    console.error(`\n✗ Hata: ${err.message}`)
    process.exit(1)
  })
