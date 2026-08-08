/**
 * TanStack Start's sitemap builder crawls every <a href> on the page,
 * including in-page anchors like "/#features" and "/#install" — those
 * aren't real pages, so submitting them to Google as distinct URLs is what
 * Search Console flags as duplicate/improperly-indexed. Strip them post-build.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const sitemapPath = 'dist/client/sitemap.xml'

if (existsSync(sitemapPath)) {
  const xml = readFileSync(sitemapPath, 'utf-8')
  const cleaned = xml.replace(/\s*<url>\s*<loc>[^<]*#[^<]*<\/loc>[\s\S]*?<\/url>/g, '')
  if (cleaned !== xml) {
    writeFileSync(sitemapPath, cleaned)
    const removed = xml.match(/<loc>[^<]*#[^<]*<\/loc>/g) ?? []
    console.log(`clean-sitemap: removed ${removed.length} anchor URL(s) from sitemap.xml`)
  }
}
