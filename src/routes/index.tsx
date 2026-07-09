import { type ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import TuiWidget from '../components/TuiWidget'
import InstallTabs from '../components/InstallTabs'
import InstallList from '../components/InstallList'
import { VERSION } from '../generated/meta'

export const Route = createFileRoute('/')({
  head: () => ({
    links: [{ rel: 'canonical', href: 'https://gitswitch.dev' }],
  }),
  component: Home,
})

const LOGO = String.raw`  ___  _  _      ___        _  _      _
 / __|(_)| |_   / __| __ __ __(_)| |_  __ | |_
| (_ || ||  _|  \__ \ \ V  V /| ||  _|/ _|| ' \
 \___||_| \__|  |___/  \_/\_/ |_| \__|\__||_||_|`

const FEATURES: Array<[string, ReactNode]> = [
  ['one-login setup', <><code>gitswitch login</code> — GitHub device flow creates your profile automatically: name, email, GitHub account, token. No manual config.</>],
  ['commit identity switching', <>Instantly change <code>user.name</code> and <code>user.email</code> in your global git config. No more wrong-email commits.</>],
  ['ssh key management', <>Sets <code>core.sshCommand</code> to force a specific key with <code>IdentitiesOnly=yes</code>, preventing agent fallback.</>],
  ['gpg signing', <>Per-profile GPG signing key. Switch and your verified-commit badge follows the right identity automatically.</>],
  ['github account sync', <>Keeps <code>gh</code> CLI auth in lockstep with your git identity — one switch, both updated.</>],
  ['mouse-driven tui', <>Click, hover, and scroll through profiles, settings, and the setup wizard — not just arrow keys and enter.</>],
  ['identity awareness', <>Shell hook learns which identity you use per repo and suggests the right one when you <code>cd</code> in.</>],
  ['shell integration', <>One <code>gitswitch install</code> wires up your shell. Pin a profile to a repo and it just works.</>],
]

const COMPARE: Array<[string, string, string]> = [
  ['github api tokens', '✓', '✓ (optional)'],
  ['commit name + email', '✗', '✓'],
  ['ssh key per identity', '✗', '✓'],
  ['gpg signing key', '✗', '✓'],
  ['per-repo auto-switch', '✗', '✓'],
  ['interactive TUI (mouse + keyboard)', '✗', '✓'],
  ['no runtime deps', '✗', '✓ (single binary)'],
]

function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content rise-in">
          <pre className="hero-logo" aria-hidden="true">{LOGO}</pre>
          <div className="hero-badge">{VERSION} · written in go · insert coin</div>
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
            <br />The one-click way to set up Git and GitHub for developers.
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
        <InstallList />
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="section">
        <div className="section-label">looking ahead</div>
        <h2 className="section-title">
          what's <em>next</em>
        </h2>
        <p className="section-sub">gitswitch is Go all the way. Here's what's shipping.</p>
        <div className="roadmap-grid">
          <div className="tui-frame">
            <div className="frame-title">shipped · stable + canary</div>
            <div className="frame-body">
              <p><strong>HTTPS credential helper</strong> — keychain-backed PAT routing so HTTPS clones and pushes just work alongside SSH.</p>
              <p><strong>GitHub OAuth login</strong> — <code>gitswitch login</code> authenticates via device flow, creates your profile automatically. No manual config.</p>
              <p><strong>Mouse support + TUI refresh</strong> — full mouse interaction, alias management, shell settings, and release notes built into the TUI.</p>
              <p><strong>Beta channel</strong> — <code>gitswitch beta</code> / <code>gitswitch stable</code> to opt in and out of canary builds from the CLI.</p>
            </div>
          </div>
          <div className="tui-frame">
            <div className="frame-title">coming up</div>
            <div className="frame-body">
              <p><strong>Multi-host profiles</strong> — one profile, multiple GitHub hosts (github.com + github.corp.com), each with its own key and token.</p>
              <p><strong>Session isolation</strong> — <code>gitswitch shell</code> gives each terminal its own identity via env vars. Parallel work, zero collisions.</p>
              <p><strong>Doctor + diagnostics</strong> — per-repo identity health check with <code>--fix</code> for auto-repair and <code>--json</code> for agent use.</p>
            </div>
          </div>
          <div className="tui-frame">
            <div className="frame-title">on the horizon</div>
            <div className="frame-body">
              <p><strong>Team presets</strong> — <code>gitswitch apply &lt;url&gt;</code> bootstraps all profiles from a shared signed config. One command onboarding.</p>
              <p><strong>In-repo config</strong> — <code>.gitswitch.yaml</code> in the repo root declares required profiles and identity policies.</p>
              <p><strong>Stability guarantee</strong> — stable config schema, stable keychain key convention. No breaking CLI changes without a major bump.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
