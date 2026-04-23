import { execFile } from 'child_process'
import { promisify } from 'util'
import { mkdirSync, existsSync, readFileSync, unlinkSync, readdirSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

const execFileAsync = promisify(execFile)
const TMP_DIR = join(tmpdir(), 'podvault-whisper')

export interface WhisperResult {
  transcript: string
  language: string
}

async function downloadAudio(url: string): Promise<string> {
  if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true })

  const outTemplate = join(TMP_DIR, '%(id)s.%(ext)s')

  await execFileAsync('yt-dlp', [
    '--extract-audio',
    '--audio-format', 'mp3',
    '--audio-quality', '5',      // orta kalite — whisper için yeterli
    '--output', outTemplate,
    '--no-playlist',
    url,
  ], { timeout: 300_000 })

  // indirilen dosyayı bul
  const files = readdirSync(TMP_DIR).filter(f => f.endsWith('.mp3'))
  if (files.length === 0) throw new Error('Ses dosyası indirilemedi')

  // en son indirilen dosyayı döndür
  return join(TMP_DIR, files.sort().at(-1)!)
}

async function transcribeAudio(audioPath: string): Promise<WhisperResult> {
  const outDir = TMP_DIR

  // Whisper çalıştır — base model, otomatik dil tespiti
  await execFileAsync('whisper', [
    audioPath,
    '--model', 'base',
    '--output_format', 'txt',
    '--output_dir', outDir,
    '--fp16', 'False',           // CPU/MPS uyumluluğu için
    '--verbose', 'False',
  ], { timeout: 600_000 })      // 10 dakika timeout

  // .txt çıktısını oku
  const baseName = audioPath.replace(/\.[^.]+$/, '')
  const txtPath = baseName + '.txt'

  if (!existsSync(txtPath)) {
    // whisper bazen farklı isimde kaydeder
    const txtFiles = readdirSync(outDir).filter(f => f.endsWith('.txt'))
    if (txtFiles.length === 0) throw new Error('Whisper çıktı dosyası bulunamadı')
    const transcript = readFileSync(join(outDir, txtFiles.at(-1)!), 'utf-8').trim()
    return { transcript, language: 'auto' }
  }

  const transcript = readFileSync(txtPath, 'utf-8').trim()
  return { transcript, language: 'auto' }
}

function cleanup(audioPath: string): void {
  try {
    unlinkSync(audioPath)
    const txtPath = audioPath.replace(/\.[^.]+$/, '') + '.txt'
    if (existsSync(txtPath)) unlinkSync(txtPath)
  } catch { /* sessizce geç */ }
}

export async function fetchWhisperTranscript(url: string): Promise<WhisperResult> {
  console.log('[whisper] Ses indiriliyor:', url)
  const audioPath = await downloadAudio(url)

  console.log('[whisper] Transkripsiyon başlıyor (base model)...')
  const result = await transcribeAudio(audioPath)

  cleanup(audioPath)
  return result
}
