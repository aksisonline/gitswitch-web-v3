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
  ['gpg signing', <>Per-profile GPG — or SSH — signing key. Switch and your verified-commit badge follows the right identity automatically.</>],
  ['github account sync', <>Keeps <code>gh</code> CLI auth in lockstep with your git identity — one switch, both updated.</>],
  ['session isolation', <>Two terminals, two GitHub accounts, no fighting. Every <code>gh</code> command resolves the right account for its repo on its own — on by default for new installs.</>],
  ['mouse-driven tui', <>Click, hover, and scroll through profiles, settings, and the setup wizard — not just arrow keys and enter.</>],
  ['ai coding agent setup', <><code>gitswitch claude</code> installs a Claude Code skill; <code>gitswitch reauthor</code> fixes commits an agent already made under the wrong identity.</>],
  ['identity awareness', <>Shell hook learns which identity you use per repo and suggests the right one when you <code>cd</code> in.</>],
  ['shell integration', <>One <code>gitswitch install</code> wires up your shell. Pin a profile to a repo and it just works.</>],
  ['identity at a glance', <>Prompt and TUI mark whether you're on your global identity, a repo pin, or a session override — <code>[work]</code> vs <code>[work●]</code> vs <code>[work◆]</code> — so you always know why a commit landed the way it did.</>],
]

const COMPARE: Array<[string, string, string]> = [
  ['github api tokens', '✓', '✓ (optional)'],
  ['commit name + email', '✗', '✓'],
  ['ssh key per identity', '✗', '✓'],
  ['gpg signing key', '✗', '✓'],
  ['per-repo auto-switch', '✗', '✓'],
  ['parallel gh accounts (multi-terminal)', '✗ (one global account)', '✓ (session isolation)'],
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
            <span className="comment"># No more committing with the wrong account.</span>
            <br />Work with multiple GitHub accounts at the same time, in parallel.
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
          ['Apache-2.0', 'open source'],
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
            <div className="frame-title">shipped · stable</div>
            <div className="frame-body">
              <p><strong>Session isolation</strong> — a <code>gh</code> shell wrapper resolves the right GitHub account per repo on every call, so multiple terminals can work as different accounts in parallel without fighting over <code>gh</code>'s single global active account. On by default for new installs, and now one feature with repo pins — a pin only takes effect while it's on.</p>
              <p><strong>Pins write into the repo</strong> — <code>gitswitch pin work</code> writes the identity into that repo's own git config, so it sticks for good without touching your global identity. Your gh account, HTTPS pushes, prompt, and <code>gitswitch current</code> all follow along.</p>
              <p><strong>SSH commit signing</strong> — sign commits with an SSH key instead of GPG; <code>--sign-key</code> takes either.</p>
              <p><strong>HTTPS credential helper</strong> — gitswitch registers itself as the first helper git asks for on every host, so HTTPS pushes actually go through the active profile instead of whatever account <code>gh</code> or your keychain had cached.</p>
              <p><strong>GitHub OAuth login</strong> — <code>gitswitch login</code> authenticates via device flow, creates your profile automatically. No manual config.</p>
              <p><strong>Mouse support + TUI refresh</strong> — every screen is hit-tested against what's actually on screen, not hardcoded row offsets — profiles, utilities, settings, the setup wizard, and arcade mode all respond correctly to hover and click.</p>
              <p><strong><code>gitswitch reauthor</code></strong> — rewrites author/committer identity on commits already made under the wrong profile, in one command. Built so agents can fix their own attribution mistakes.</p>
              <p><strong>Claude Code skill</strong> — <code>gitswitch claude</code> installs an embedded skill so Claude recognizes identity mismatches and calls gitswitch itself.</p>
              <p><strong>Scriptable CLI</strong> — <code>gitswitch current --json</code> / <code>gitswitch list --json</code> for scripts; colorized output for humans, off automatically outside a real terminal.</p>
              <p><strong>Beta channel</strong> — <code>gitswitch beta</code> / <code>gitswitch stable</code> to opt in and out of canary builds from the CLI, with update checks locked to whichever channel you're on.</p>
            </div>
          </div>
          <div className="tui-frame">
            <div className="frame-title">coming up</div>
            <div className="frame-body">
              <p><strong>Multi-host profiles</strong> — one profile, multiple GitHub hosts (github.com + github.corp.com), each with its own key and token.</p>
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
