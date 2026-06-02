# gitswitch.dev — v3

Marketing site + documentation for [gitswitch](https://github.com/aksisonline/gitswitch),
built with **TanStack Start** (React 19, Vite) and deployed to **Cloudflare Workers**.

Replaces the v2 Astro/Starlight site. Same terminal identity (JetBrains Mono,
11-theme switcher, interactive TUI), more polished, with docs sourced from the
gitswitch repo and a few hidden easter eggs.

## How it fits together

```
git-switcher repo                         gitswitch-web-v3 (this repo)
─────────────────                         ────────────────────────────
docs/public/**.md  ─┐                     scripts/sync-content.ts
docs/public/meta.json│  build-time fetch  ─► reads docs (sibling in dev,
docs/privacy-policy.md┘                       sparse git clone in CI)
                                          ─► reads latest release tag from
GitHub Releases API ──────────────────────►  api.github.com/.../releases/latest
                                          ─► emits src/generated/content.ts
                                             (VERSION, SIDEBAR, DOCS, PRIVACY_HTML)
```

- **Docs live in the gitswitch repo** (`docs/public/`), not here. Edit them there.
- **Version** auto-tracks the latest GitHub release — no manual bumps.
- `src/generated/content.ts` is built by `prebuild`/`predev` and is gitignored.

### Content sync

```bash
bun run scripts/sync-content.ts   # runs automatically before dev/build
```

In dev it reads the sibling checkout `../git-switcher/docs/public`. In CI (no
sibling) it sparse-clones `docs/public` from GitHub.

## Develop

```bash
bun install
bun run dev      # http://localhost:3000
```

## Build & deploy

```bash
bun run build    # prerenders all pages + sitemap to dist/
bun run deploy   # build + wrangler deploy (needs wrangler auth)
```

CI (`.github/workflows/deploy.yml`) deploys on push to `main`, on
`workflow_dispatch`, and on a `repository_dispatch` of type `gitswitch-release`
fired by the gitswitch repo when a new version is tagged or docs change.

### Required GitHub secrets (this repo)

| Secret | Purpose |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Workers deploy token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account id |

### Required secret in the gitswitch repo

| Secret | Purpose |
|---|---|
| `WEBSITE_DISPATCH_PAT` | Fine-grained PAT (Actions: read/write on this repo) to trigger rebuilds from `release.yml` / `docs-sync.yml` |

## Easter eggs

- **Konami code** (anywhere): ↑↑↓↓←→←→ B A → neon palette + matrix cascade.
- **`p`** in the hero terminal: hidden `gitswitch pacman` — profile list as a
  dot-eater. Arrows/hjkl to move, Esc to quit.
- **`c`** anywhere: cycle the 11 terminal themes.

Discoverable, never intrusive — see the gitswitch arcade philosophy.

## Layout

```
scripts/sync-content.ts    build-time docs + version sync
src/lib/themes.ts          11 themes, no-flash head script
src/lib/theme-context.tsx  theme provider + `c` cycle + cross-tab sync
src/routes/index.tsx       landing page
src/routes/docs/$.tsx      docs (sidebar + content + TOC), prerendered
src/routes/privacy.tsx     privacy policy
src/components/TuiWidget.tsx  interactive hero terminal
src/components/Pacman.tsx     hidden mini-game
src/components/EasterEggs.tsx konami handler
```
