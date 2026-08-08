// Terminal color themes — ported from gitswitch-web-v2, the palette is part of
// the product's identity (the TUI ships these same themes). `c` cycles them
// site-wide; choice persists in localStorage and syncs across tabs.

export type Theme = {
  name: string
  bg: string
  bg2: string
  bg3: string
  border: string
  accent: string
  cursor: string
  title: string
  text: string
  text2: string
  muted: string
  check: string
  dot: string
}

// `muted` is brightened per theme so it hits WCAG AA (>=4.5:1 normal text)
// against `bg3`, the lightest of the three background layers in every
// theme — meeting that also clears the darker `bg`/`bg2` automatically.
// Blended toward each theme's own `text` color so the hue is unchanged.
export const THEMES: Array<Theme> = [
  { name: 'Nord',        bg: '#2e3440', bg2: '#3b4252', bg3: '#434c5e', border: '#4c566a', accent: '#88c0d0', cursor: '#88c0d0', title: '#d8dee9', text: '#e5e9f0', text2: '#d8dee9', muted: '#b6bcc7', check: '#a3be8c', dot: '#88c0d0' },
  { name: 'Dracula',     bg: '#282a36', bg2: '#343746', bg3: '#3d3f4f', border: '#44475a', accent: '#bd93f9', cursor: '#ff79c6', title: '#f8f8f2', text: '#f8f8f2', text2: '#d6d3c8', muted: '#a1abc5', check: '#50fa7b', dot: '#bd93f9' },
  { name: 'Catppuccin',  bg: '#1e1e2e', bg2: '#262637', bg3: '#313244', border: '#45475a', accent: '#cba6f7', cursor: '#cba6f7', title: '#cdd6f4', text: '#cdd6f4', text2: '#bac2de', muted: '#949ab3', check: '#a6e3a1', dot: '#cba6f7' },
  { name: 'Tokyo Night', bg: '#1a1b26', bg2: '#1f202e', bg3: '#24283b', border: '#3b4261', accent: '#7aa2f7', cursor: '#bb9af7', title: '#c0caf5', text: '#c0caf5', text2: '#a9b1d6', muted: '#848eb8', check: '#9ece6a', dot: '#7aa2f7' },
  { name: 'Gruvbox',     bg: '#282828', bg2: '#32302f', bg3: '#3c3836', border: '#504945', accent: '#fabd2f', cursor: '#fe8019', title: '#ebdbb2', text: '#ebdbb2', text2: '#d5c4a1', muted: '#aea087', check: '#b8bb26', dot: '#fabd2f' },
  { name: 'One Dark',    bg: '#282c34', bg2: '#2c313a', bg3: '#353b45', border: '#3e4451', accent: '#61afef', cursor: '#c678dd', title: '#abb2bf', text: '#abb2bf', text2: '#9ba0a8', muted: '#9ea5b2', check: '#98c379', dot: '#61afef' },
  { name: 'Solarized',   bg: '#002b36', bg2: '#04313c', bg3: '#073642', border: '#0e4855', accent: '#268bd2', cursor: '#2aa198', title: '#93a1a1', text: '#93a1a1', text2: '#839496', muted: '#8c9b9b', check: '#859900', dot: '#268bd2' },
  { name: 'Monokai',     bg: '#272822', bg2: '#2f3029', bg3: '#3e3d32', border: '#49483e', accent: '#f92672', cursor: '#66d9e8', title: '#f8f8f2', text: '#f8f8f2', text2: '#cfcfc2', muted: '#a9a799', check: '#a6e22e', dot: '#ae81ff' },
  { name: 'Material',    bg: '#212121', bg2: '#272727', bg3: '#303030', border: '#37474f', accent: '#82aaff', cursor: '#c792ea', title: '#eeffff', text: '#eeffff', text2: '#b0bec5', muted: '#839ba3', check: '#c3e88d', dot: '#82aaff' },
  { name: 'Ayu Dark',    bg: '#0b0e14', bg2: '#11151c', bg3: '#1a1f29', border: '#272d38', accent: '#e6b450', cursor: '#e6b450', title: '#bfbdb6', text: '#bfbdb6', text2: '#b3b1ad', muted: '#848689', check: '#aad94c', dot: '#e6b450' },
  { name: 'Everforest',  bg: '#2d353b', bg2: '#343f44', bg3: '#3d484d', border: '#4f585e', accent: '#a7c080', cursor: '#dbbc7f', title: '#d3c6aa', text: '#d3c6aa', text2: '#c5b990', muted: '#bab49c', check: '#a7c080', dot: '#a7c080' },
  { name: 'Synthwave',   bg: '#262335', bg2: '#2d2845', bg3: '#3a2d4a', border: '#4a3d5c', accent: '#ff7edb', cursor: '#36f9f6', title: '#ffffff', text: '#ffffff', text2: '#e2d9f3', muted: '#a095b3', check: '#72f1b8', dot: '#ff7edb' },
]

// Picks whichever of black/white has higher WCAG contrast against `hex` — used
// where an accent color becomes a background (e.g. the active-tab chip in
// TuiWidget), so the text stays readable across all 13 themes without having
// to hand-tune each one like `muted` above.
export function readableOn(hex: string): string {
  const n = parseInt(hex.slice(1), 16)
  const channel = (v: number) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(channel)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  const contrastWithBlack = (luminance + 0.05) / 0.05
  const contrastWithWhite = 1.05 / (luminance + 0.05)
  return contrastWithBlack > contrastWithWhite ? '#000000' : '#ffffff'
}

export const STORAGE_KEY = 'gitswitch:theme-idx'

export const DEFAULT_THEME_IDX = THEMES.findIndex((t) => t.name === 'Dracula')

export function applyTheme(t: Theme) {
  const r = document.documentElement.style
  r.setProperty('--bg', t.bg)
  r.setProperty('--bg2', t.bg2)
  r.setProperty('--bg3', t.bg3)
  r.setProperty('--border', t.border)
  r.setProperty('--muted', t.muted)
  r.setProperty('--text', t.text)
  r.setProperty('--text2', t.text2)
  r.setProperty('--title', t.title)
  r.setProperty('--accent', t.accent)
  r.setProperty('--cursor', t.cursor)
  r.setProperty('--check', t.check)
  r.setProperty('--dot', t.dot)
  // Keep Fumadocs color tokens in sync — they use --color-fd-* which Tailwind
  // resolves at parse time from @theme, but inline style overrides win at runtime.
  r.setProperty('--color-fd-background', t.bg)
  r.setProperty('--color-fd-foreground', t.text)
  r.setProperty('--color-fd-card', t.bg2)
  r.setProperty('--color-fd-card-foreground', t.text)
  r.setProperty('--color-fd-popover', t.bg2)
  r.setProperty('--color-fd-popover-foreground', t.text)
  r.setProperty('--color-fd-muted', t.bg2)
  r.setProperty('--color-fd-muted-foreground', t.muted)
  r.setProperty('--color-fd-border', t.border)
  r.setProperty('--color-fd-ring', t.accent)
  r.setProperty('--color-fd-primary', t.accent)
  r.setProperty('--color-fd-primary-foreground', t.bg)
  r.setProperty('--color-fd-secondary', t.bg3)
  r.setProperty('--color-fd-secondary-foreground', t.text2)
  r.setProperty('--color-fd-accent', t.bg3)
  r.setProperty('--color-fd-accent-foreground', t.text)
}

export function getStoredThemeIdx(): number {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v !== null) {
      const i = parseInt(v, 10)
      if (!isNaN(i) && i >= 0 && i < THEMES.length) return i
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME_IDX
}

export function setStoredThemeIdx(i: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(i))
  } catch {
    /* ignore */
  }
}

// Inlined into <head> before paint so SSR'd markup never flashes the wrong theme.
// Also sets --color-fd-* so Fumadocs components use our palette immediately.
export const THEME_INIT_SCRIPT = `(function(){try{
var T=${JSON.stringify(
  THEMES.map((t) => ({ bg: t.bg, bg2: t.bg2, bg3: t.bg3, border: t.border, muted: t.muted, text: t.text, text2: t.text2, title: t.title, accent: t.accent, cursor: t.cursor, check: t.check, dot: t.dot })),
)};
var i=${DEFAULT_THEME_IDX};try{var v=localStorage.getItem('${STORAGE_KEY}');if(v!==null){var n=parseInt(v,10);if(!isNaN(n)&&n>=0&&n<T.length)i=n}}catch(e){}
var t=T[i];var s=document.documentElement.style;
for(var k in t){s.setProperty('--'+k,t[k])}
s.setProperty('--color-fd-background',t.bg);
s.setProperty('--color-fd-foreground',t.text);
s.setProperty('--color-fd-card',t.bg2);
s.setProperty('--color-fd-card-foreground',t.text);
s.setProperty('--color-fd-popover',t.bg2);
s.setProperty('--color-fd-popover-foreground',t.text);
s.setProperty('--color-fd-muted',t.bg2);
s.setProperty('--color-fd-muted-foreground',t.muted);
s.setProperty('--color-fd-border',t.border);
s.setProperty('--color-fd-ring',t.accent);
s.setProperty('--color-fd-primary',t.accent);
s.setProperty('--color-fd-primary-foreground',t.bg);
s.setProperty('--color-fd-secondary',t.bg3);
s.setProperty('--color-fd-secondary-foreground',t.text2);
s.setProperty('--color-fd-accent',t.bg3);
s.setProperty('--color-fd-accent-foreground',t.text);
}catch(e){}})();`
