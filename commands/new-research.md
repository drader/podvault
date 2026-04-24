# /new-research

Yeni araştırma konusu başlat: klasör yap, GitHub Actions workflow oluştur, Claude Routine oluştur.

## Kullanım

```
/new-research Kuantum Kriptografi
```

## Adımlar

### 1. Slug, başlık ve schedule

Argümandan konu adını al. Slug kural: küçük harf, Türkçe karakter yok, boşluk → tire.
Örnek: "Kuantum Kriptografi" → `kuantum-kriptografi`

Eğer argüman verilmemişse kullanıcıya sor.

Kullanıcıya araştırma sıklığını sor:
- **Haftalık** → `0 6 * * 1` (Her Pazartesi 09:00 Istanbul)
- **İki haftada bir** → `0 6 1,15 * *` (Ayın 1'i ve 15'i)
- **Aylık** → `0 6 1 * *` (Her ayın 1'i) ← varsayılan
- **Özel** → kullanıcının verdiği cron ifadesi

### 2. Konuyu araştır

WebSearch ile konuyu hızlıca araştır:
- Ana alt alanlar ve araştırma kolları neler?
- Öne çıkan araştırmacılar, kurumlar, şirketler kimler?
- Bu konuyu kapsayan podcast türleri neler?
- En önemli 8-12 arama keyword'ü neler?

### 3. Klasörü ve dosyaları oluştur

`research/{slug}/` altında 4 dosya oluştur:

**index.md** — şu frontmatter ile:
```yaml
---
title: {Başlık}
type: research
status: active
last_researched: {bugünün tarihi YYYY-MM-DD}
research_schedule: "{cron ifadesi}"
search_keywords:
  - {araştırmadan çıkan keyword 1}
  - {araştırmadan çıkan keyword 2}
  - ... (8-12 arası)
---
```
İçerik: konunun kısa teknik çerçevesi, araştırma kolları tablosu, keyword haritası, dosya listesi.

**podcasts.md** — araştırmada bulunan ilgili podcastlerle dolu başlangıç tablosu. Hiç bulunamazsa boş tablo şablonu.

**literature.md** — araştırmada bulunan akademik sinyallerle dolu başlangıç tablosu (podcast keşif amaçlı). Hiç bulunamazsa boş tablo şablonu.

**log.md** — tek giriş:
```
## [{bugünün tarihi}] research | ilk araştırma — /new-research komutuyla oluşturuldu
```

### 4. GitHub Actions workflow oluştur

`.github/workflows/research-{slug}.yml` dosyasını oluştur:

```yaml
name: Research — {Başlık}

on:
  schedule:
    - cron: '{cron ifadesi}'   # {insan okunabilir açıklama}
  workflow_dispatch:

jobs:
  research:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Configure git
        run: |
          git config user.name  "podvault-bot"
          git config user.email "podvault-bot@users.noreply.github.com"

      - name: Run research
        env:
          LLM_PROVIDER:   ${{ secrets.LLM_PROVIDER }}
          LLM_API_KEY:    ${{ secrets.LLM_API_KEY }}
          LLM_MODEL:      ${{ secrets.LLM_MODEL }}
          TAVILY_API_KEY: ${{ secrets.TAVILY_API_KEY }}
          RESEARCH_TOPIC: {slug}
        run: npx tsx src/research/index.ts
```

### 5. Claude Routine oluştur

RemoteTrigger aracını yükle (ToolSearch ile: `select:RemoteTrigger`), ardından routine oluştur:

- **name**: `podvault-{slug}-research`
- **cron_expression**: `{cron ifadesi}` (index.md ile aynı)
- **environment_id**: `<YOUR_ENVIRONMENT_ID>`
- **model**: `claude-sonnet-4-6`
- **repo**: `https://github.com/YOUR_USERNAME/YOUR_REPO`
- **allowed_tools**: `["Bash", "Read", "Write", "Edit", "Glob", "Grep", "WebSearch", "WebFetch"]`
- **mcp_connections**: Consensus (`<YOUR_CONSENSUS_CONNECTOR_UUID>`) + Scholar-Gateway (`<YOUR_SCHOLAR_GATEWAY_CONNECTOR_UUID>`)
- **prompt**: Aşağıdaki şablonu {slug} ve {başlık} ile doldur:

```
You are a research agent for the podvault project — a personal podcast knowledge wiki.
Research topic: {başlık} ({slug})

Your task: find new developments (last ~30 days) relevant to this topic and update the research files.

Read the current state of these files first:
- research/{slug}/index.md  (topic framework and search keywords)
- research/{slug}/literature.md  (academic signals for podcast discovery)
- research/{slug}/podcasts.md (podcast catalog)
- research/{slug}/log.md  (research history)

Then search for new developments using the keywords in index.md frontmatter (search_keywords field).

Update rules:
- literature.md: append new academic publications as table rows in the correct section
- podcasts.md: append newly discovered podcasts as table rows with ☐ ingest status
- index.md: update last_researched date in frontmatter
- log.md: append a new entry: ## [YYYY-MM-DD] research | brief summary

Only include verifiable sources. Do not delete existing entries.
After updating, commit: research({slug}): update YYYY-MM-DD
```

### 6. Log yaz

`wiki/log.md`'ye ekle:
```
## [{bugünün tarihi}] new-research | {slug}
Schedule: {cron}. Dosyalar: research/{slug}/ (yeni). Workflow: .github/workflows/research-{slug}.yml
```

### 7. Kullanıcıya özet sun

- Oluşturulan klasör ve dosyalar
- GitHub Actions workflow adı ve schedule'ı
- Claude Routine ID ve linki: https://claude.ai/code/routines/{id}
- Önerilen ilk adım: ingest edilebilecek en iyi podcast episodu
