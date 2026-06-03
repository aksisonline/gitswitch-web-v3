'use client'
import { useState } from 'react'

const TABS: Array<{ id: string; label: string; cmd: string }> = [
  { id: 'brew', label: 'macOS / Linux', cmd: 'brew install aksisonline/tap/gitswitch' },
  {
    id: 'curl',
    label: 'curl',
    cmd: 'curl -fsSL https://raw.githubusercontent.com/aksisonline/gitswitch/main/.github/install.sh | bash',
  },
  { id: 'windows', label: 'Windows', cmd: 'https://github.com/aksisonline/gitswitch/releases/latest' },
  { id: 'go', label: 'go install', cmd: 'go install github.com/aksisonline/gitswitch@latest' },
]

export default function InstallTabs() {
  const [active, setActive] = useState(TABS[0].id)
  const [copied, setCopied] = useState(false)
  const cmd = TABS.find((t) => t.id === active)!.cmd

  function copy() {
    navigator.clipboard.writeText(cmd).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="hero-install">
      <div className="hero-install-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            className={`hi-tab${active === t.id ? ' active' : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
        <a className="hi-tab hi-tab-link" href="#install">
          view all options →
        </a>
      </div>
      <div className="hero-install-body">
        {cmd.startsWith('http') ? (
          <a href={cmd} target="_blank" rel="noreferrer" className="install-row-link" style={{ flex: 1 }}>
            ↗ github.com/aksisonline/gitswitch/releases/latest
          </a>
        ) : (
          <>
            <span className="hi-prompt">$</span>
            <code className="hi-code">{cmd}</code>
            <button
              className={`hi-copy${copied ? ' copied' : ''}`}
              onClick={copy}
              aria-label="Copy install command"
            >
              {copied ? '✓' : 'copy'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}