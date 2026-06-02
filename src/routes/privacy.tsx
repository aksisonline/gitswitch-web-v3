import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { marked } from 'marked'

const loadPrivacy = createServerFn({ method: 'GET' }).handler(async () => {
  const path = join(process.cwd(), 'src', 'generated', 'privacy.md')
  if (!existsSync(path)) return '<p>Privacy policy not found.</p>'
  const raw = readFileSync(path, 'utf8')
  const body = raw.replace(/^---\n[\s\S]*?\n---\n?/, '')
  return marked.parse(body) as string
})

export const Route = createFileRoute('/privacy')({
  loader: () => loadPrivacy(),
  head: () => ({
    meta: [
      { title: 'Privacy Policy — gitswitch' },
      {
        name: 'description',
        content:
          'gitswitch runs entirely on your machine. No servers, no analytics, no telemetry.',
      },
    ],
  }),
  component: Privacy,
})

function Privacy() {
  const html = Route.useLoaderData()
  return (
    <main className="docs-layout">
      <article className="prose docs-main" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  )
}
