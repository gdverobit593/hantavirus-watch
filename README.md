# Hantavirus Watch

A RU+EN "reference + news" site scaffold for hantavirus updates: daily digest posts, a simple map page, and evergreen explainers.

## Local development

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000/en`
- `http://localhost:3000/ru`

## Content

Content lives in MDX files:

- `src/content/news/{en,ru}/*.mdx`
- `src/content/reference/{en,ru}/*.mdx`

Each news item supports frontmatter fields:

- `title`
- `date` (YYYY-MM-DD)
- `summary`
- `sources[]` (optional)

## SEO

- Sitemap is generated on build via `next-sitemap`:
  - `npm run build` -> `postbuild` -> sitemap files in `public/`
- RSS feed is available at `/rss.xml`

## Environment variables

- `SITE_URL` (recommended for correct absolute URLs in sitemap + RSS)
  - Example: `https://your-domain.com`

