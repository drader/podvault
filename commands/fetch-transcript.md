# /fetch-transcript

Verilen URL'den podcast transcript'ini çek ve `wiki/raw/transcripts/` klasörüne kaydet.

## Kullanım

```
/fetch-transcript <url>
```

**Desteklenen kaynaklar:**
- YouTube video URL'si (`youtube.com/watch?v=...` veya `youtu.be/...`)
- RSS feed URL'si (`.xml`, `.rss` veya `/feed` içeren URL'ler)

## Adımlar

1. Şu komutu çalıştır:
   ```
   npx tsx src/fetcher/cli.ts <url>
   ```
2. Çıktıda kaydedilen dosya yolunu göster.
3. Başarılıysa kullanıcıya sor: "Şimdi /ingest çalıştırayım mı?"
4. Onay gelirse `/ingest <kaydedilen-dosya-yolu>` çalıştır.

## Hata Durumları

- **YouTube transcript yok**: Video'nun altyazısı kapalıysa veya auto-caption yoksa hata verir. Kullanıcıya farklı bir bölüm denemesini öner.
- **RSS boş**: Feed geçersizse veya episod yoksa hata verir.
- **Desteklenmeyen URL**: Kaynak tipi anlaşılamıyorsa kullanıcıya YouTube veya RSS URL'si vermesini söyle.

## Örnek

```
/fetch-transcript https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

Çıktı:
```
[fetcher] YouTube transcript çekiliyor...
[fetcher] Kaydedildi: wiki/raw/transcripts/2026-04-23-yt-dQw4w9WgXcQ.md
✓ Transcript kaydedildi.
```
