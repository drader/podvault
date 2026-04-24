import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createXai } from '@ai-sdk/xai'
import { generateText } from 'ai'
import type { LanguageModel } from 'ai'

const DEFAULTS: Record<string, string> = {
  anthropic: 'claude-sonnet-4-6',
  openai:    'gpt-4o',
  google:    'gemini-1.5-pro',
  deepseek:  'deepseek-chat',
  llama:     'llama-3.3-70b-versatile',
  grok:      'grok-2-1212',
}

const OPENAI_COMPAT: Record<string, string> = {
  deepseek: 'https://api.deepseek.com/v1',
  llama:    'https://api.groq.com/openai/v1',
}

export function createModel(provider: string, apiKey: string, modelOverride?: string): LanguageModel {
  const model = modelOverride ?? DEFAULTS[provider]
  if (!model) throw new Error(`Unknown provider: "${provider}". Supported: ${Object.keys(DEFAULTS).join(', ')}`)

  if (provider === 'anthropic') return createAnthropic({ apiKey })(model)
  if (provider === 'openai')    return createOpenAI({ apiKey })(model)
  if (provider === 'google')    return createGoogleGenerativeAI({ apiKey })(model)
  if (provider === 'grok')      return createXai({ apiKey })(model)

  const baseURL = OPENAI_COMPAT[provider]
  if (baseURL) return createOpenAI({ apiKey, baseURL })(model)

  throw new Error(`Provider "${provider}" not configured`)
}

export interface ResearchUpdate {
  new_literature: Array<{
    section: string
    title: string
    journal_date: string
    authors: string
    podcast_signal: string
  }>
  new_podcasts: Array<{
    section: string
    name: string
    url: string
    periyot: string
    derinlik: string
  }>
  log_entry: string
}

export async function generateResearchUpdates(
  model: LanguageModel,
  currentFiles: { index: string; literature: string; podcasts: string; log: string },
  searchContext?: string
): Promise<ResearchUpdate> {
  const prompt = `You are a research assistant for a podcast knowledge wiki. The research topic is defined in the index.md file you will read.

Your task: identify recent (last ~30 days) developments worth adding to these research files.

${searchContext ? `## Recent Search Results\n${searchContext}\n` : ''}

## Current literature.md
${currentFiles.literature}

## Current podcasts.md
${currentFiles.podcasts}

## Current log.md (last 3 entries)
${currentFiles.log.split('\n').slice(-20).join('\n')}

## Instructions
Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "new_literature": [
    {
      "section": "<exact section header from literature.md, e.g. 'Nöromorfik + Fotonik'>",
      "title": "<paper title>",
      "journal_date": "<Journal, YYYY>",
      "authors": "<Author(s) / Institution>",
      "podcast_signal": "<podcast name if author appeared on one, else empty string>"
    }
  ],
  "new_podcasts": [
    {
      "section": "<exact section header from podcasts.md, e.g. 'Kuantum Hesaplama'>",
      "name": "<podcast name>",
      "url": "<url>",
      "periyot": "<Haftalık|Aylık|Düzensiz>",
      "derinlik": "<Akademik|Teknik|Teknik popüler>"
    }
  ],
  "log_entry": "<one-line summary of what was found>"
}

Rules:
- Only include entries NOT already present in the files above
- If nothing new was found for a category, return an empty array
- Do not invent or hallucinate papers/podcasts — only include verifiable ones
- Return raw JSON only, no code fences`

  const { text } = await generateText({ model, prompt })

  const json = text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  return JSON.parse(json) as ResearchUpdate
}
