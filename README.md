# ODTREK — Sitio Web Oficial

Sitio web de ODTREK: producción de eventos de trekking, trail running, festivales y aventura.

## Estructura

## SEO

### Archivos SEO incluidos
- `/robots.txt` — Directivas para crawlers
- `/sitemap.xml` — Mapa del sitio
- `/manifest.webmanifest` — Manifest PWA
- Meta tags Open Graph + Twitter Cards en `index.html`
- Datos estructurados Schema.org (SportsOrganization + SportsEvent)

### Antes de publicar
1. Reemplazar `https://odtrek.com` por el dominio real en:
   - `robots.txt`
   - `sitemap.xml`
   - `index.html` (canonical, og:url, twitter, schema)
2. Subir favicons a `/assets/icons/`
3. Subir imagen OG (1200×630) a `/assets/og/og-odtrek.jpg`
4. Actualizar `<lastmod>` en `sitemap.xml` cuando cambies contenido

### Verificar indexación
- Google Search Console: https://search.google.com/search-console
- Enviar sitemap manualmente en GSC → Sitemaps → `sitemap.xml`
- Rich Results Test: https://search.google.com/test/rich-results