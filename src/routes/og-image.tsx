/**
 * OG image generator — NOT a real page. Visit this route, screenshot it, save
 * the screenshot as public/og-image.png. Not linked from nav, not in the
 * sitemap, marked noindex.
 *
 * Why this exists instead of a design tool: public/og-image.png is a purpose-
 * built static render of the hero (headline, sub-line, CTA, a non-interactive
 * mockup of the terminal panel) — not a raw screenshot of the live responsive
 * hero, which has chrome (view-source button, install tabs) that doesn't make
 * sense frozen in a static image. Building it as HTML means the exact Dracula
 * palette (src/lib/themes.ts) and copy can be reused/edited here directly
 * instead of hand-tweaking pixels in an image editor.
 *
 * To regenerate after a copy change:
 *   1. Update HEADLINE/SUB below to match src/routes/index.tsx's hero.
 *   2. bun run dev
 *   3. Capture at the exact native resolution with headless Chrome (a normal
 *      browser screenshot tool downscales for display, which blurs a 1200x630
 *      target):
 *        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
 *          --headless --disable-gpu --hide-scrollbars \
 *          --window-size=1200,630 --screenshot=/tmp/og-image.png \
 *          "http://localhost:3000/og-image"
 *   4. cp /tmp/og-image.png public/og-image.png
 *   5. Update OG_IMAGE_ALT in src/routes/__root.tsx to describe the new image.
 */
import { createFileRoute } from '@tanstack/react-router'
import { VERSION } from '../generated/meta'

export const Route = createFileRoute('/og-image')({
  head: () => ({
    meta: [
      { title: 'og-image generator' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: OgImage,
})

const DRACULA = {
  bg: '#282a36',
  bg2: '#343746',
  border: '#44475a',
  accent: '#bd93f9',
  cursor: '#ff79c6',
  title: '#f8f8f2',
  text2: '#d6d3c8',
  muted: '#a1abc5',
  check: '#50fa7b',
}

const HEADLINE = ['Git,', 'done right.']
const SUB = 'Run multiple GitHub accounts in parallel — or set one up for the first time.'

function OgImage() {
  const d = DRACULA
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: 1200,
        height: 630,
        background: d.bg,
        fontFamily: 'var(--font-mono, monospace)',
        display: 'flex',
        alignItems: 'center',
        padding: 56,
        boxSizing: 'border-box',
        gap: 40,
        zIndex: 9999,
      }}
    >
      {/* Left: brand, headline, CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minWidth: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, fontWeight: 700, marginBottom: 28 }}>
            <span style={{ color: d.check }}>$</span>
            <span style={{ color: d.title }}>gitswitch</span>
            <span style={{ color: d.accent }}>✦</span>
          </div>
          <div
            style={{
              display: 'inline-block',
              border: `1px solid ${d.accent}`,
              color: d.accent,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1,
              padding: '6px 14px',
              marginBottom: 32,
            }}
          >
            ✦ {VERSION} · WRITTEN IN GO · INSERT COIN
          </div>
          <div style={{ fontSize: 46, fontWeight: 700, lineHeight: 1.15, color: d.title, marginBottom: 24 }}>
            <div>{HEADLINE[0]}</div>
            <div style={{ color: d.accent }}>{HEADLINE[1]}</div>
          </div>
          <div style={{ fontSize: 19, color: d.text2, maxWidth: 480, lineHeight: 1.5 }}>{SUB}</div>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignSelf: 'flex-start',
            alignItems: 'center',
            gap: 8,
            background: d.accent,
            color: d.bg,
            fontWeight: 700,
            fontSize: 17,
            padding: '12px 22px',
            marginTop: 32,
          }}
        >
          ▸ install now
        </div>
      </div>

      {/* Right: static terminal-panel mockup — no interactivity, just the look */}
      <div
        style={{
          width: 540,
          flexShrink: 0,
          border: `1px solid ${d.border}`,
          background: d.bg,
          display: 'flex',
          flexDirection: 'column',
          fontSize: 14,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 16px',
            borderBottom: `1px solid ${d.border}`,
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5555', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f1fa8c', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.check, display: 'inline-block' }} />
          </div>
          <div style={{ position: 'absolute', inset: 0, textAlign: 'center', lineHeight: '32px', color: d.muted, fontSize: 12 }}>
            gitswitch — identity manager
          </div>
        </div>
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
          <div>
            <div style={{ color: d.accent, fontWeight: 700 }}>✦ Git-Switcher</div>
            <div style={{ color: d.muted }}>identity manager for git</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ background: d.accent, color: d.bg, fontWeight: 700, padding: '3px 10px' }}>Accounts</span>
            <span style={{ color: d.border }}>·</span>
            <span style={{ color: d.muted }}>Utilities</span>
            <span style={{ color: d.border }}>·</span>
            <span style={{ color: d.muted }}>Settings</span>
          </div>
          <div style={{ color: d.text2 }}>
            <span style={{ color: d.muted }}>Current</span> <span style={{ color: d.accent }}>aksisonline</span>{' '}
            <span style={{ color: d.muted }}>·</span> <span style={{ color: d.text2 }}>user@gmail.com</span>
          </div>
          <div style={{ borderTop: `1px solid ${d.border}`, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ color: d.muted }}>· default &nbsp;&nbsp;<span style={{ color: d.text2 }}>user@default.com</span></div>
            <div>
              <span style={{ color: '#f1fa8c' }}>❯</span> <span style={{ color: d.check }}>✓</span>{' '}
              <span style={{ color: d.accent, fontWeight: 700 }}>aksisonline</span>{' '}
              <span style={{ color: d.text2 }}>user@gmail.com</span>
            </div>
            <div style={{ color: d.muted }}>· work &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: d.text2 }}>user@company.com</span></div>
          </div>
          <div style={{ borderTop: `1px solid ${d.border}`, paddingTop: 12, color: d.muted, fontSize: 12, lineHeight: 1.8 }}>
            <div>
              <span style={{ color: d.accent }}>↑↓</span> navigate · <span style={{ color: d.accent }}>enter</span> switch ·{' '}
              <span style={{ color: d.accent }}>p</span> pin · <span style={{ color: d.accent }}>a</span> add
            </div>
            <div>
              <span style={{ color: d.accent }}>e</span> edit · <span style={{ color: d.accent }}>?</span> cli tips ·{' '}
              <span style={{ color: d.accent }}>1-3</span> tabs / click · <span style={{ color: d.accent }}>q</span> quit
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
