# Research Layer

wiki/'den bağımsız araştırma katmanı. Podcast ingest ile karışmaz; çapraz sorgu bilinçli ve isteğe bağlıdır.

## Amaç

Belirli bir konuyu sistematik olarak takip etmek:
- İlgili akademik yayınları izlemek (podcast keşif sinyali olarak)
- Konu odaklı podcast kataloğu oluşturmak
- Dönemsel araştırmaları loglamak

## Klasör Yapısı

```
research/
  {konu-slug}/
    index.md      — konu çerçevesi, arama keyword'leri, schedule
    papers.md     — akademik sinyal kaynakları (podcast keşfi amaçlı)
    podcasts.md   — podcast kataloğu ve ingest durumu
    log.md        — append-only araştırma geçmişi
```

## Yeni Konu Başlatmak

`/new-research` komutuyla otomatik olarak:
- Klasör ve 4 dosya oluşturulur
- GitHub Actions workflow oluşturulur
- Claude Routine kurulur

## Otomasyon

Her konu `index.md` frontmatter'ındaki `research_schedule` cron ifadesine göre otomatik çalışır.
GitHub Actions workflow → `src/research/index.ts` → papers.md ve podcasts.md güncellenir.
