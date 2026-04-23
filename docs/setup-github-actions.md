# GitHub Actions ile Otomatik Araştırma Kurulumu

Bu kılavuz, aylık araştırma rutinini GitHub Actions üzerinden BYOK (Bring Your Own Key) ile çalıştırmak içindir.

## Desteklenen LLM Sağlayıcıları

| `LLM_PROVIDER` değeri | Sağlayıcı | API Key nereden alınır |
|---|---|---|
| `anthropic` | Claude (Anthropic) | console.anthropic.com |
| `openai` | GPT-4o (OpenAI) | platform.openai.com |
| `google` | Gemini (Google) | aistudio.google.com |
| `deepseek` | DeepSeek | platform.deepseek.com |
| `llama` | Llama 3 (Groq üzerinden) | console.groq.com |
| `grok` | Grok (xAI) | console.x.ai |

## Kurulum

### 1. GitHub Secrets'a Key Ekle

Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret Adı | Açıklama | Zorunlu |
|---|---|---|
| `LLM_PROVIDER` | Yukarıdaki tablodaki değer (örn. `anthropic`) | ✅ |
| `LLM_API_KEY` | Seçilen sağlayıcının API key'i | ✅ |
| `LLM_MODEL` | Model override (boş bırakırsan default kullanılır) | ☐ |
| `TAVILY_API_KEY` | Web araması için Tavily key ([tavily.com](https://tavily.com)) | ☐ Opsiyonel |

> **`TAVILY_API_KEY` olmadan:** LLM kendi eğitim verisine dayanarak araştırma yapar. Yeni gelişmeleri yakalamak için önerilir; ücretsiz planda 1000 sorgu/ay.

### 2. Workflow'u Etkinleştir

`.github/workflows/monthly-research.yml` dosyası repo'da mevcutsa Actions otomatik aktif olur.

İlk manuel çalıştırma için:
**Actions** → **Monthly Research Update** → **Run workflow**

### 3. Varsayılan Modeller

`LLM_MODEL` secret'ı boş bırakırsan bu modeller kullanılır:

| Provider | Default Model |
|---|---|
| anthropic | claude-sonnet-4-6 |
| openai | gpt-4o |
| google | gemini-1.5-pro |
| deepseek | deepseek-chat |
| llama | llama-3.3-70b-versatile |
| grok | grok-2-1212 |

## Zamanlama

Her ayın 1'i 09:00 İstanbul (06:00 UTC). Değiştirmek için `.github/workflows/monthly-research.yml` içindeki `cron` satırını düzenle.

## Claude Routines Alternatifi

Claude Pro+ kullanıcıları için GitHub Actions yerine doğrudan Claude Routines kullanılabilir:
→ [claude.ai/code/routines](https://claude.ai/code/routines)

Claude Routines avantajı: kurulum gerekmez, MCP bağlantıları otomatik gelir.
GitHub Actions avantajı: herhangi bir LLM ile çalışır, tamamen açık kaynak.
