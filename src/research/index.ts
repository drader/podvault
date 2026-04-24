import matter from 'gray-matter'
import { readFileSync } from 'fs'
import { join } from 'path'
import { createModel, generateResearchUpdates } from './llm.js'
import { readResearchFiles, applyUpdates, commitChanges } from './updater.js'

const ROOT = join(import.meta.dirname, '..', '..', '..')

function readSearchKeywords(topic: string): string[] {
  const indexPath = join(ROOT, 'research', topic, 'index.md')
  const { data } = matter(readFileSync(indexPath, 'utf-8'))
  return (data.search_keywords as string[] | undefined) ?? [topic.replace(/-/g, ' ')]
}

async function fetchSearchContext(keywords: string[]): Promise<string | undefined> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) return undefined

  try {
    const query = keywords.join(' ')
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, query, max_results: 8, search_depth: 'advanced' }),
    })
    const data = await res.json() as { results?: Array<{ title: string; content: string; url: string }> }
    return data.results?.map(r => `- ${r.title}\n  ${r.content.slice(0, 200)}\n  ${r.url}`).join('\n\n')
  } catch {
    console.warn('Tavily search failed, proceeding without search context.')
    return undefined
  }
}

async function main() {
  const topic    = process.env.RESEARCH_TOPIC ?? 'example-topic'
  const provider = process.env.LLM_PROVIDER  ?? ''
  const apiKey   = process.env.LLM_API_KEY   ?? ''
  const modelOverride = process.env.LLM_MODEL

  if (!provider || !apiKey) {
    console.error('LLM_PROVIDER and LLM_API_KEY environment variables are required.')
    process.exit(1)
  }

  const date = new Date().toISOString().slice(0, 10)
  console.log(`[${date}] Research runner — topic: ${topic}, provider: ${provider}`)

  const model        = createModel(provider, apiKey, modelOverride)
  const currentFiles = readResearchFiles(topic)
  const keywords     = readSearchKeywords(topic)
  const searchContext = await fetchSearchContext(keywords)

  if (searchContext) console.log('Search context loaded from Tavily.')
  else console.log('No Tavily key — using LLM knowledge only.')

  console.log('Generating research updates...')
  const updates = await generateResearchUpdates(model, currentFiles, searchContext)

  console.log(`Found: ${updates.new_literature.length} new literature, ${updates.new_podcasts.length} new podcasts`)
  applyUpdates(topic, updates, date)
  commitChanges(topic, date)
  console.log('Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
