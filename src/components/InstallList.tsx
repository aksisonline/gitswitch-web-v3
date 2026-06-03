'use client'
import { useState } from 'react'

const METHODS = [
  { label: 'homebrew', note: 'macOS · Linux · recommended', cmd: 'brew install aksisonline/tap/gitswitch' },
  { label: 'curl', note: 'macOS · Linux · WSL', cmd: 'curl -fsSL https://raw.githubusercontent.com/aksisonline/gitswitch/main/.github/install.sh | bash' },
  { label: 'Windows', note: 'download binary from GitHub releases', cmd: 'https://github.com/aksisonline/gitswitch/releases/latest' },
  { label: 'go install', note: 'any platform · requires go 1.22+', cmd: 'go install github.com/aksisonline/gitswitch@latest' },
]

function InstallRow({ label, note, cmd }: { label: string; note: string; cmd: string }) {
  const [copied, setCopied] = useState(false)
  const isLink = cmd.startsWith('http')

  function copy() {
    navigator.clipboard.writeText(cmd).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="install-row">
      <div className="install-row-meta">
        <span className="install-row-label">{label}</span>
        <span className="install-row-note">{note}</span>
      </div>
      <div className="install-row-cmd">
        {isLink ? (
          <a href={cmd} target="_blank" rel="noreferrer" className="install-row-link">
            ↗ github.com/aksisonline/gitswitch/releases/latest
          </a>
        ) : (
          <>
            <span className="hi-prompt">$</span>
            <code className="hi-code">{cmd}</code>
            <button className={`hi-copy${copied ? ' copied' : ''}`} onClick={copy} aria-label="Copy">
              {copied ? '✓' : 'copy'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function InstallList() {
  return (
    <div className="install-list">
      {METHODS.map((m) => <InstallRow key={m.label} {...m} />)}
    </div>
  )
}
