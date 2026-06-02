import { createFileRoute } from '@tanstack/react-router'
import TuiWidget from '../components/TuiWidget'
import InstallTabs from '../components/InstallTabs'
import { VERSION } from '../generated/meta'

export const Route = createFileRoute('/')({ component: Home })

const FEATURES: Array<[string, React.ReactNode]> = [
  ['commit identity switching', <>Instantly change <code>user.name</code> and <code>user.email</code> in your global git config. No more wrong-email commits.</>],
  ['ssh key management', <>Sets <code>core.sshCommand</code> to force a specific key with <code>IdentitiesOnly=yes</code>, preventing agent fallback.</>],
  ['gpg signing', <>Per-profile GPG signing key. Switch and your verified-commit badge follows the right identity automatically.</>],
  ['github account sync', <>Keeps <code>gh</code> CLI auth in lockstep with your git identity — one switch, both updated.</>],
  ['identity awareness', <>Shell hook learns which identity you use per repo and suggests the right one when you <code>cd</code> in.</>],
  ['shell integration', <>One <code>gitswitch install</code> wires up your shell. Pin a profile to a repo and it just works.</>],
]

const COMPARE: Array<[string, string, string]> = [
  ['github api tokens', '✓', '✓ (optional)'],
  ['commit name + email', '✗', '✓'],
  ['ssh key per identity', '✗', '✓'],
  ['gpg signing key', '✗', '✓'],
  ['per-repo auto-switch', '✗', '✓'],
  ['interactive TUI', '✗', '✓'],
  ['no runtime deps', '✗', '✓ (single binary)'],
]

function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content rise-in">
          <div className="hero-badge">{VERSION} · written in go</div>
          <h1>
            git identity manager.
            <br />
            <em>done right.</em>
            <span className="blink" />
          </h1>
          <p className="hero-sub">
            <span className="comment"># Switch your name, email, SSH key, and GitHub account</span>
            <br />
            <span className="comment"># across profiles — instantly, without touching config files.</span>
            <br />A keyboard-driven TUI that gets out of your way.
          </p>
          <div className="hero-actions">
            <a href="#install" className="btn-primary">
              install now
            </a>
            <a
              href="https://github.com/aksisonline/gitswitch"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              view source
            </a>
          </div>
          <InstallTabs />
        </div>
        <TuiWidget />
      </section>

      {/* Stats */}
      <div className="stats-bar">
        {[
          ['11', 'color themes'],
          ['∞', 'git profiles'],
          ['5', 'fields per profile'],
          ['MIT', 'open source'],
        ].map(([n, l]) => (
          <div className="stat" key={l}>
            <div className="stat-num">{n}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section id="features" className="section">
        <div className="section-label">capabilities</div>
        <h2 className="section-title">
          everything <em>gh auth switch</em>
          <br />
          can't do.
        </h2>
        <p className="section-sub">
          GitHub CLI only manages API tokens. Your commit identity — the name and email
          baked into every commit — is completely separate. gitswitch handles both.
        </p>
        <div className="features-grid">
          {FEATURES.map(([title, desc], i) => (
            <div className="feature-card" key={title}>
              <div className="feature-marker">[{String(i + 1).padStart(2, '0')}]</div>
              <div className="feature-title">{title}</div>
              <div className="feature-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Compare */}
      <section className="section">
        <div className="section-label">comparison</div>
        <h2 className="section-title">
          vs <em>gh auth switch</em>
        </h2>
        <p className="section-sub">
          Two tools, two different problems. gitswitch handles what the GitHub CLI
          intentionally ignores.
        </p>
        <div className="compare-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th>capability</th>
                <th>
                  <code>gh auth switch</code>
                </th>
                <th className="col-gitswitch">
                  <code>gitswitch</code>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([cap, gh, gs]) => (
                <tr key={cap}>
                  <td>{cap}</td>
                  <td className={gh.startsWith('✗') ? 'no' : 'check'}>{gh}</td>
                  <td className="col-gitswitch check">{gs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Install */}
      <section id="install" className="section">
        <div className="section-label">install</div>
        <h2 className="section-title">up in 30 seconds.</h2>
        <p className="section-sub">
          Choose your preferred installation method. Homebrew is recommended for automatic
          updates.
        </p>
        <div className="install-grid">
          {[
            ['homebrew — recommended', 'brew install aksisonline/tap/gitswitch', 'auto-updates with brew upgrade'],
            ['curl — one-liner', 'curl -fsSL https://raw.githubusercontent.com/aksisonline/gitswitch/main/.github/install.sh | bash', 'works on macOS and Linux'],
            ['go install', 'go install github.com/aksisonline/gitswitch@latest', 'requires go 1.22+'],
          ].map(([title, cmd, note]) => (
            <div className="install-card" key={title}>
              <h4>{title}</h4>
              <pre className="code-block">
                <code>{cmd}</code>
              </pre>
              <div className="footnote">{note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="section">
        <div className="section-label">looking ahead</div>
        <h2 className="section-title">
          <em>v0.2.0</em> in progress · <em>v1.0.0</em> the milestone
        </h2>
        <p className="section-sub">What's being built now and where this is going.</p>
        <div className="roadmap-grid">
          <div className="tui-frame">
            <div className="frame-title">v0.2.0 · in development</div>
            <div className="frame-body">
              <p><strong>Multi-host profiles</strong> — one profile holds separate PATs and SSH keys for github.com and a self-hosted enterprise host.</p>
              <p><strong>Session isolation</strong> — <code>gitswitch shell</code> gives each terminal its own identity. Built for parallel AI agents.</p>
              <p><strong>Pre-commit safety net</strong> — warns before a wrong-identity commit ever lands.</p>
            </div>
          </div>
          <div className="tui-frame">
            <div className="frame-title">v1.0.0 · the milestone</div>
            <div className="frame-body">
              <p><strong>Rust rewrite</strong> reaches parity — ratatui TUI with full arcade theme + tachyonfx effects.</p>
              <p><strong>HTTPS credential helper</strong> — keychain-backed, so HTTPS cloners get the same magic as SSH users.</p>
              <p><strong>Brand launch</strong> — finalized logo, gitswitch.dev, homebrew-core submission.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
