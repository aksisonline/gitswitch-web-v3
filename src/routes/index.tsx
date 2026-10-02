import { type ReactNode } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import TuiWidget from '../components/TuiWidget'
import InstallTabs from '../components/InstallTabs'
import InstallList from '../components/InstallList'
import { VERSION } from '../generated/meta'

const FAQ: Array<[string, string]> = [
  [
    'Do I need multiple GitHub accounts?',
    'No. gitswitch can also set up Git and GitHub CLI for your first commit.',
  ],
  [
    'Does gitswitch replace GitHub CLI?',
    'No. gitswitch adds repo-aware identity and session management around your existing Git and GitHub CLI workflow.',
  ],
  [
    'Do I need to create SSH keys by hand?',
    'No. Add a key to a profile if you want to use one; you can also start without configuring one.',
  ],
  [
    'Can it fix a commit I already made?',
    'Yes. gitswitch reauthor rewrites the author and committer on existing commits. If the commits are already shared, coordinate before rewriting history.',
  ],
  [
    'Is gitswitch open source?',
    'Yes. It’s written in Go and licensed under Apache-2.0.',
  ],
]

export const Route = createFileRoute('/')({
  head: () => ({
    links: [{ rel: 'canonical', href: 'https://gitswitch.dev' }],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ.map(([q, a]) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        }),
      },
    ],
  }),
  component: Home,
})

const FEATURES: Array<[string, ReactNode]> = [
  [
    'Your identity follows the repo.',
    <>
      Pin a profile once with <code>gitswitch pin work</code>. Your name and
      email stay with that repo, even if your global Git identity is different.
    </>,
  ],
  [
    'Use multiple GitHub accounts at once.',
    <>
      Each terminal resolves <code>gh</code> commands for the repo you’re
      working in. Keep work and personal sessions open at the same time—without
      one terminal changing the account another uses.
    </>,
  ],
  [
    'Match the right SSH and signing keys.',
    <>
      Attach SSH and GPG or SSH signing keys to a profile. gitswitch selects the
      matching SSH key and signing identity when you switch profiles.
    </>,
  ],
  [
    'Fix a commit made under the wrong identity.',
    <>
      Use <code>gitswitch reauthor</code> to rewrite the author and committer on
      commits that already exist. Review shared history before rewriting it.
    </>,
  ],
  [
    'Works in your terminal—and agent-launched shells.',
    <>
      Use the same repo-aware behavior in your regular shell, editor terminal,
      or a coding agent working inside a repo. <code>gitswitch claude</code> can
      install the Claude Code skill.
    </>,
  ],
]

const ALTERNATIVES: Array<[string, string, ReactNode]> = [
  [
    'if',
    'Using includeIf?',
    <>
      Keep your existing setup or start pinning repos individually. gitswitch
      can manage Git identity, GitHub account, and keys together instead of
      requiring hand-maintained directory rules.
    </>,
  ],
  [
    'ssh',
    'Using SSH host aliases?',
    <>
      gitswitch can select a profile’s SSH key with <code>core.sshCommand</code>{' '}
      and <code>IdentitiesOnly=yes</code>, alongside the rest of that profile.
    </>,
  ],
  [
    'cli',
    'Already using another switcher?',
    <>
      Start with one repo. Add other profiles and session isolation when you
      need them.
    </>,
  ],
]

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content rise-in">
          <div className="hero-badge">
            Git identity for multi-account developers
          </div>
          <h1>
            Every repo gets the <em>right GitHub identity.</em>
            <span className="blink" />
          </h1>
          <p className="hero-sub">
            gitswitch keeps your commit author, GitHub CLI account, SSH key, and
            signing identity aligned with the repo you’re in. Run work,
            personal, and AI-agent sessions side by side—without flipping one
            shared account back and forth.
          </p>
          <div className="hero-actions">
            <a href="#install" className="btn-primary">
              Install gitswitch
            </a>
            <a href="#how-it-works" className="btn-ghost">
              See how it works
            </a>
          </div>
          <InstallTabs />
          <p className="hero-meta">
            {VERSION} · Open source · Written in Go
            <br />
            macOS, Linux, Windows
          </p>
          <p className="hero-meta">
            New to Git?{' '}
            <Link to="/docs/$" params={{ _splat: 'guides/beginners' }}>
              Get set up from scratch →
            </Link>
          </p>
        </div>
        <TuiWidget />
      </section>

      <section className="section">
        <div className="section-label">the problem</div>
        <h2 className="section-title">
          Git and GitHub don’t share <em>one identity setting.</em>
        </h2>
        <p className="section-sub">
          <code>gh auth switch</code> changes the account used by GitHub CLI.
          Git keeps your commit name and email separately, while SSH and commit
          signing use their own keys.
        </p>
        <p className="section-sub">
          When you work across accounts, switching one setting can leave another
          behind. gitswitch brings them together in a profile and applies the
          right identity for each repo.
        </p>
      </section>

      <section className="section" aria-labelledby="parallel-title">
        <div className="section-label">two terminals · two identities</div>
        <h2 id="parallel-title" className="section-title">
          Side by side. <em>Still yours.</em>
        </h2>
        <p className="section-sub">
          Pin each repo once. With session isolation enabled, each terminal’s
          GitHub commands use that repo’s account. Here’s an example with work
          and personal profiles already set up.
        </p>
        <div className="parallel-demo">
          {[
            ['work · ~/work/api', 'work', 'work-account'],
            ['personal · ~/personal/site', 'personal', 'personal-account'],
          ].map(([title, profile, account]) => (
            <div className="tui-frame" key={profile}>
              <div className="frame-title">{title}</div>
              <pre className="demo-commands">
                <code>
                  <span className="prompt">$</span> gitswitch pin {profile}
                  {'\n'}
                  <span className="prompt">$</span> git config user.email{'\n'}
                  <span className="demo-result">
                    {profile === 'work'
                      ? 'you@company.com'
                      : 'you@personal.dev'}
                  </span>
                  {'\n\n'}
                  <span className="prompt">$</span> gh api user --jq .login
                  {'\n'}
                  <span className="demo-result">{account}</span>
                </code>
              </pre>
            </div>
          ))}
        </div>
        <p className="section-sub trust-note">
          A router, not a credential vault. Your keys stay in{' '}
          <code>~/.ssh/</code>, your tokens stay in your OS keychain. gitswitch
          decides which identity applies to the repo you’re in.{' '}
          <Link to="/docs/$" params={{ _splat: 'get-started/intro' }}>
            Read how it works →
          </Link>
        </p>
      </section>

      <section id="features" className="section">
        <div className="section-label">features</div>
        <h2 className="section-title">
          Your identity <em>follows the repo.</em>
        </h2>
        <div className="features-grid reveal-group">
          {FEATURES.map(([title, desc], i) => (
            <div
              className={`feature-card reveal${i === 0 ? ' feature-card--lead' : ''}`}
              key={title}
            >
              <div className="feature-marker">
                [{String(i + 1).padStart(2, '0')}]
              </div>
              <div className="feature-title">{title}</div>
              <div className="feature-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="section">
        <div className="section-label">how it works</div>
        <h2 className="section-title">
          Log in. Pin a repo. <em>Keep working.</em>
        </h2>
        <ol className="setup-steps">
          <li>
            <strong>Log in once.</strong> <code>gitswitch login</code> hands off
            to
            <code>gh auth login</code> and creates your profile—no token to copy
            into another tool.
          </li>
          <li>
            <strong>Add your identities.</strong> Set the name and email for
            each profile; attach SSH or signing keys if you use them.
          </li>
          <li>
            <strong>Pin a repo.</strong> Run <code>gitswitch pin work</code> in
            a repo. Then keep using <code>git</code> and <code>gh</code> as
            usual.
          </li>
        </ol>
      </section>

      <section className="section">
        <div className="section-label">already have a Git setup?</div>
        <h2 className="section-title">
          Start with <em>one repo.</em>
        </h2>
        <div className="alt-list reveal-group">
          {ALTERNATIVES.map(([marker, title, desc]) => (
            <div className="alt-row reveal" key={title}>
              <div className="alt-row-marker">[{marker}]</div>
              <div className="alt-row-body">
                <div className="alt-row-title">{title}</div>
                <div className="alt-row-desc">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="install" className="section">
        <div className="section-label">install</div>
        <h2 className="section-title">
          Get <em>gitswitch.</em>
        </h2>
        <p className="section-sub">
          The Go CLI from gitswitch.dev for parallel GitHub identity isolation.
          Pick the install method for your platform.
        </p>
        <InstallList />
      </section>

      <section className="section">
        <div className="section-label">faq</div>
        <h2 className="section-title">
          Questions, <em>answered.</em>
        </h2>
        <div className="faq-list reveal-group">
          {FAQ.map(([q, a]) => (
            <div className="faq-item reveal" key={q}>
              <div className="faq-q">
                <span className="prompt">$</span> {q}
              </div>
              <div className="faq-a">{a}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
