/**
 * Build-time content sync.
 *
 * Single source of truth for docs + version lives in the git-switcher repo:
 *   github.com/aksisonline/gitswitch  ->  docs/public/**.md  + docs/public/meta.json
 *
 * In local dev we read the sibling checkout (../git-switcher/docs/public).
 * In CI we sparse-clone just docs/public from GitHub.
 *
 * Outputs:
 *   content/docs/**       ← .mdx files for Fumadocs MDX to process (links rewritten)
 *   content/version.json  ← committed cache of the resolved version (see resolveVersion)
 *   src/generated/meta.ts ← VERSION + SIDEBAR for the landing page
 */
import { execSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative } from 'node:path'

const REPO = 'aksisonline/gitswitch'
const REPO_URL = `https://github.com/${REPO}.git`
const FALLBACK_VERSION = 'v0.1.22'

const ROOT = join(import.meta.dir, '..')
const SIBLING = join(ROOT, '..', 'git-switcher', 'docs', 'public')
const TMP = join(ROOT, '.docs-cache')
const CONTENT_OUT = join(ROOT, 'content', 'docs')
const VERSION_OUT = join(ROOT, 'content', 'version.json')
const META_OUT = join(ROOT, 'src', 'generated', 'meta.ts')

type DocMeta = { groups: Array<{ label: string; items: Array<string> }> }

function resolveDocsDir(): string {
  if (existsSync(SIBLING)) {
    console.log(`[sync] using sibling docs: ${SIBLING}`)
    return SIBLING
  }
  console.log(`[sync] sibling not found, sparse-cloning ${REPO_URL}`)
  rmSync(TMP, { recursive: true, force: true })
  execSync(
    `git clone --depth 1 --filter=blob:none --sparse ${REPO_URL} ${TMP}`,
    { stdio: 'inherit' },
  )
  execSync(`git -C ${TMP} sparse-checkout set docs/public`, { stdio: 'inherit' })
  return join(TMP, 'docs', 'public')
}

async function fetchLatestReleaseTag(): Promise<string> {
  const headers: Record<string, string> = { 'User-Agent': 'gitswitch-web-build' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = (await res.json()) as { tag_name?: string }
  if (!data.tag_name) throw new Error('no tag_name')
  return data.tag_name
}

// Cloudflare's build environment shares IPs across many customers' builds, so
// unauthenticated GitHub API calls there hit rate limits constantly and fall
// back to FALLBACK_VERSION — which is how production silently ran stale for a
// long time. Resolve in order of trust instead of always hitting the API:
//   1. RELEASE_VERSION env — set by the CI workflow from the release dispatch
//      payload, so it's exact and needs no network call.
//   2. content/version.json — committed by that same CI run, so a normal
//      build (including Cloudflare's) just reads it, no network involved.
//   3. Live API fetch — only for a first-ever run with neither of the above
//      (e.g. a fresh clone before any release has synced yet).
// Whatever is resolved gets written back to content/version.json so the next
// build in any environment can skip straight to step 2.
async function resolveVersion(): Promise<string> {
  if (process.env.RELEASE_VERSION) {
    console.log(`[sync] using RELEASE_VERSION env: ${process.env.RELEASE_VERSION}`)
    return process.env.RELEASE_VERSION
  }
  if (existsSync(VERSION_OUT)) {
    const { version } = JSON.parse(readFileSync(VERSION_OUT, 'utf8')) as { version: string }
    console.log(`[sync] using committed content/version.json: ${version}`)
    return version
  }
  try {
    const tag = await fetchLatestReleaseTag()
    console.log(`[sync] fetched latest release: ${tag}`)
    return tag
  } catch (err) {
    console.warn(`[sync] version fetch failed (${String(err)}), using ${FALLBACK_VERSION}`)
    return FALLBACK_VERSION
  }
}

function walkMarkdown(dir: string, base = dir): Array<string> {
  const out: Array<string> = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walkMarkdown(full, base))
    else if (entry.endsWith('.md')) out.push(relative(base, full).replace(/\.md$/, ''))
  }
  return out
}

function rewriteLinks(body: string, slugSet: Set<string>): string {
  // Docs were authored for root-served layout (/cli/commands). Rewrite to /docs/cli/commands.
  return body.replace(
    /\[([^\]]*)\]\(\/([^)#]+)((?:#[^)]*)?)\)/g,
    (full, text: string, path: string, hash: string) => {
      if (path.startsWith('docs/')) return full
      return slugSet.has(path) ? `[${text}](/docs/${path}${hash})` : full
    },
  )
}

async function main() {
  const docsDir = resolveDocsDir()
  const metaPath = join(docsDir, 'meta.json')
  const meta: DocMeta = existsSync(metaPath)
    ? JSON.parse(readFileSync(metaPath, 'utf8'))
    : { groups: [] }

  const slugList = walkMarkdown(docsDir).filter((s) => s !== 'meta')
  const slugSet = new Set(slugList)

  // Wipe and re-generate content/docs so stale files don't linger.
  rmSync(CONTENT_OUT, { recursive: true, force: true })
  mkdirSync(CONTENT_OUT, { recursive: true })

  for (const slug of slugList) {
    const raw = readFileSync(join(docsDir, `${slug}.md`), 'utf8')
    const rewritten = rewriteLinks(raw, slugSet)
    const outPath = join(CONTENT_OUT, `${slug}.mdx`)
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, rewritten)
  }
  console.log(`[sync] wrote ${slugList.length} MDX files to content/docs/`)

  const version = await resolveVersion()
  writeFileSync(VERSION_OUT, JSON.stringify({ version }) + '\n')

  // Sidebar ordering for use on landing page + docs nav via fumadocs.
  const sidebar = meta.groups.map((g) => ({
    label: g.label,
    items: g.items.filter((s) => slugSet.has(s)),
  }))

  mkdirSync(dirname(META_OUT), { recursive: true })
  writeFileSync(
    META_OUT,
    `// AUTO-GENERATED by scripts/sync-content.ts — do not edit\n` +
      `export const VERSION = ${JSON.stringify(version)} as const\n` +
      `export const SIDEBAR = ${JSON.stringify(sidebar)} as const\n`,
  )
  console.log(`[sync] wrote VERSION=${version} + SIDEBAR to src/generated/meta.ts`)
}

main().catch((err) => {
  console.error('[sync] fatal:', err)
  process.exit(1)
})
