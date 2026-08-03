/**
 * get.gitswitch.dev gateway — mirrors get.docker.com's content negotiation.
 * Runs as global request middleware so it intercepts before routing, since
 * the app router only matches on pathname and this behavior is host-based.
 *
 * DNS: get.gitswitch.dev must point at this same Worker (Cloudflare Custom
 * Domain), which is separate infra out of scope here — see chat for the plan.
 */
import { createMiddleware, createStart } from '@tanstack/react-start'

const GET_HOST = 'get.gitswitch.dev'
const INSTALL_SCRIPT_URL =
  'https://raw.githubusercontent.com/aksisonline/gitswitch/main/.github/install.sh'
const INSTALL_PS1_URL =
  'https://raw.githubusercontent.com/aksisonline/gitswitch/main/.github/install.ps1'
const AGENT_SETUP_URL = 'https://gitswitch.dev/docs/get-started/agent-setup'

// Same card as gitswitch.dev's own <head> (src/routes/__root.tsx) — same image,
// title/description scoped to this URL's one job instead of the whole product.
const OG_TITLE = 'get.gitswitch.dev — one-command gitswitch install'
const OG_DESC =
  'curl -fsSL https://get.gitswitch.dev | bash installs gitswitch and tells your coding agent exactly what to do next.'
const OG_IMAGE_ALT =
  'gitswitch terminal UI in the Dracula theme, showing the profile list next to the "Git, done right." hero headline'

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function browserLandingPage(): Response {
  const title = escapeHtml(OG_TITLE)
  const desc = escapeHtml(OG_DESC)
  const imageAlt = escapeHtml(OG_IMAGE_ALT)
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=${AGENT_SETUP_URL}">
<link rel="canonical" href="${AGENT_SETUP_URL}">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="https://get.gitswitch.dev">
<meta property="og:site_name" content="gitswitch">
<meta property="og:image" content="https://gitswitch.dev/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:image:alt" content="${imageAlt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="https://gitswitch.dev/og-image.png">
<meta name="twitter:image:alt" content="${imageAlt}">
</head>
<body>
<p>Redirecting to <a href="${AGENT_SETUP_URL}">${AGENT_SETUP_URL}</a>…</p>
</body>
</html>
`
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  })
}

function wantsAgentJson(request: Request): boolean {
  if (new URL(request.url).searchParams.get('format') === 'agent') return true
  const accept = request.headers.get('accept') ?? ''
  return accept.includes('application/json') && !accept.includes('text/html')
}

async function proxyScript(upstreamUrl: string): Promise<Response> {
  const upstream = await fetch(upstreamUrl, {
    cf: { cacheTtl: 300, cacheEverything: true },
  } as RequestInit)
  if (!upstream.ok) {
    return new Response('install script temporarily unavailable\n', {
      status: 502,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  }
  return new Response(upstream.body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  })
}

const gitswitchGetGateway = createMiddleware().server(
  async ({ next, request }) => {
    if ((request.headers.get('host') ?? '') !== GET_HOST) return next()

    // Windows: irm https://get.gitswitch.dev/install.ps1 | iex — always plain
    // text regardless of Accept, same as raw.githubusercontent.com today.
    if (new URL(request.url).pathname === '/install.ps1') {
      return proxyScript(INSTALL_PS1_URL)
    }

    if (wantsAgentJson(request)) {
      return Response.json({
        install_command: 'curl -fsSL https://get.gitswitch.dev | bash',
        next_steps: [
          'gitswitch doctor --json',
          'gitswitch login',
          'gitswitch doctor --json',
        ],
        docs_url: AGENT_SETUP_URL,
      })
    }

    if ((request.headers.get('accept') ?? '').includes('text/html')) {
      return browserLandingPage()
    }

    return proxyScript(INSTALL_SCRIPT_URL)
  },
)

export const startInstance = createStart(() => ({
  requestMiddleware: [gitswitchGetGateway],
}))
