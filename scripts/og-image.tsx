// Renders public/og-image.png (1200x630) from the current VERSION. Runs in
// `prebuild` after sync-content, so every deploy ships a fresh image; /og-image
// serves it. Palette = Dracula from src/lib/themes.ts.
import { readFileSync, writeFileSync } from 'node:fs'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { VERSION } from '../src/generated/meta'

const d = {
  bg: '#282a36', border: '#44475a', accent: '#bd93f9', title: '#f8f8f2',
  text2: '#d6d3c8', muted: '#a1abc5', check: '#50fa7b', yellow: '#f1fa8c',
}
const font = (w: number) =>
  readFileSync(`node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-${w}-normal.woff`)

const row = (children: any, style: any = {}) => (
  <div style={{ display: 'flex', alignItems: 'center', ...style }}>{children}</div>
)
const T = (c: string, text: string, bold = false) => (
  <span style={{ color: c, fontWeight: bold ? 700 : 400 }}>{text}</span>
)

const card = (
  <div style={{ display: 'flex', boxSizing: 'border-box', width: 1200, height: 630, background: d.bg, alignItems: 'center', padding: 56, gap: 40, fontFamily: 'JetBrains Mono' }}>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, minWidth: 0 }}>
      {row([T(d.check, '$', true), T(d.title, 'gitswitch', true)], { gap: 8, fontSize: 20, marginBottom: 28 })}
      <div style={{ display: 'flex', alignSelf: 'flex-start', border: `1px solid ${d.accent}`, color: d.accent, fontSize: 13, fontWeight: 700, letterSpacing: 1, padding: '6px 14px', marginBottom: 32 }}>
        {`${VERSION} · WRITTEN IN GO`}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: 40, fontWeight: 700, lineHeight: 1.15, color: d.title, marginBottom: 24 }}>
        <div>Every repo gets the</div>
        <div style={{ color: d.accent }}>right GitHub identity.</div>
      </div>
      <div style={{ display: 'flex', fontSize: 19, color: d.text2, maxWidth: 520, lineHeight: 1.5 }}>
        Commit author, gh account, SSH key, and signing key, matched to the repo you’re in.
      </div>
      <div style={{ display: 'flex', alignSelf: 'flex-start', background: d.accent, color: d.bg, fontWeight: 700, fontSize: 17, padding: '12px 22px', marginTop: 32 }}>
        install now
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', width: 500, flexShrink: 0, border: `1px solid ${d.border}`, fontSize: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 16px', borderBottom: `1px solid ${d.border}`, color: d.muted, fontSize: 12 }}>
        gitswitch: identity manager
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '18px 20px', gap: 14 }}>
        {row([T(d.accent, 'Gitswitch', true)])}
        {row([
          <span style={{ background: d.accent, color: d.bg, fontWeight: 700, padding: '3px 10px' }}>Accounts</span>,
          T(d.muted, 'Utilities'), T(d.muted, 'Settings'),
        ], { gap: 14 })}
        {row([T(d.muted, 'Current'), T(d.accent, 'aksisonline'), T(d.text2, 'user@gmail.com')], { gap: 8 })}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: `1px solid ${d.border}`, paddingTop: 14 }}>
          {row([T(d.muted, 'default'), T(d.text2, 'user@default.com')], { gap: 12 })}
          {row([T(d.yellow, '>'), T(d.check, 'ok'), T(d.accent, 'aksisonline', true), T(d.text2, 'user@gmail.com')], { gap: 8 })}
          {row([T(d.muted, 'work'), T(d.text2, 'user@company.com')], { gap: 12 })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, borderTop: `1px solid ${d.border}`, paddingTop: 12, fontSize: 12 }}>
          {row([T(d.accent, 'enter'), T(d.muted, 'switch'), T(d.accent, 'p'), T(d.muted, 'pin'), T(d.accent, 'a'), T(d.muted, 'add'), T(d.accent, 'q'), T(d.muted, 'quit')], { gap: 6 })}
        </div>
      </div>
    </div>
  </div>
)

const svg = await satori(card, {
  width: 1200, height: 630,
  fonts: [
    { name: 'JetBrains Mono', data: font(400), weight: 400 },
    { name: 'JetBrains Mono', data: font(700), weight: 700 },
  ],
})
writeFileSync('public/og-image.png', new Resvg(svg).render().asPng())
console.log(`og-image.png rendered for ${VERSION}`)
