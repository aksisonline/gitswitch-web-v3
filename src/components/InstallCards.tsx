'use client'
import { useState } from 'react'

const METHODS: Array<{ title: string; cmd: string; note: string }> = [
  { title: 'homebrew — recommended', cmd: 'brew install aksisonline/tap/gitswitch', note: 'auto-updates with brew upgrade' },
  { title: 'curl — one-liner', cmd: 'curl -fsSL https://raw.githubusercontent.com/aksisonline/gitswitch/main/.github/install.sh | bash', note: 'works on macOS and Linux' },
  { title: 'go install', cmd: 'go install github.com/aksisonline/gitswitch@latest', note: 'requires go 1.22+' },
]

function InstallCard({ title, cmd, note }: { title: string; cmd: string; note: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(cmd).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="install-card">
      <h4>{title}</h4>
      <pre className="code-block">
        <code>{cmd}</code>
        <button
          className={`hi-copy${copied ? ' copied' : ''}`}
          onClick={copy}
          aria-label="Copy command"
        >
          {copied ? '✓' : 'copy'}
        </button>
      </pre>
      <div className="footnote">{note}</div>
    </div>
  )
}

export default function InstallCards() {
  return (
    <div className="install-grid">
      {METHODS.map((m) => (
        <InstallCard key={m.title} {...m} />
      ))}
    </div>
  )
}
