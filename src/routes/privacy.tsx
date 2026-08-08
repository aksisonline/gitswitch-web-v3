import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      { title: 'Privacy Policy, gitswitch' },
      {
        name: 'description',
        content: "The most honest privacy policy you'll ever read.",
      },
    ],
    links: [{ rel: 'canonical', href: 'https://gitswitch.dev/privacy' }],
  }),
  component: Privacy,
})

function Privacy() {
  return (
    <main className="privacy-page">
      <div className="privacy-container">
        <div className="privacy-header">
          <span className="prompt">$</span>
          <span className="cmd">cat privacy.txt</span>
          <span className="blink" />
        </div>

        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="privacy-meta"># last updated: never. nothing has changed. nothing will change.</p>

        <div className="privacy-body">
          <p className="big-line">We don't have your data.</p>

          <p>
            Seriously. There's no server. No database. No analytics dashboard where we watch
            you type <code>gitswitch switch work</code> at 9:02am every morning. Nothing leaves
            your machine. Ever.
          </p>

          <p>
            Your names, emails, SSH keys, and tokens live in <code>~/.config/gitswitch/</code>{' '}
            and your OS keychain. That's your machine. That's your stuff. We have no idea it
            exists.
          </p>

          <p>
            No cookies. No tracking pixels. No <em>"we may share your data with trusted partners"</em>{' '}
            because there are no partners, trusted or otherwise. There is no "we" that receives
            anything.
          </p>

          <div className="deletion-block">
            <div className="deletion-header">
              <span className="prompt">$</span>
              <span># GDPR Data Deletion Request</span>
            </div>
            <p>If you'd like to formally submit a data deletion request, please run:</p>
            <div className="code-block">
              <span className="prompt">$</span>
              <span className="cmd-text">rm -rf ~/.config/gitswitch</span>
              <span className="blink" />
            </div>
            <p className="muted-note"># your data has been deleted. you're welcome.</p>
          </div>

          <p>If you're still reading this looking for something to be concerned about:</p>

          <div className="rickroll-wrap">
            <div className="rickroll-header">
              <span className="prompt">$</span>
              <span className="cmd">display nothing-to-see-here.gif</span>
            </div>
            <img
              src="https://media.giphy.com/media/Ju7l5y9osyymQ/giphy.gif"
              alt="nothing to see here"
              className="rickroll-gif"
              loading="lazy"
            />
          </div>

          <div className="footer-note">
            <span className="muted-note"># want the boring legal version?</span>
            <span>
              it lives in{' '}
              <a
                href="https://github.com/aksisonline/gitswitch/blob/main/docs/privacy-policy.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                docs/privacy-policy.md
              </a>{' '}
              in the repo. same answer, more words.
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
