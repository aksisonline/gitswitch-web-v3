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
const AGENT_SETUP_URL = 'https://gitswitch.dev/docs/get-started/agent-setup'

function wantsAgentJson(request: Request): boolean {
  if (new URL(request.url).searchParams.get('format') === 'agent') return true
  const accept = request.headers.get('accept') ?? ''
  return accept.includes('application/json') && !accept.includes('text/html')
}

async function installScriptResponse(): Promise<Response> {
  const upstream = await fetch(
    INSTALL_SCRIPT_URL,
    { cf: { cacheTtl: 300, cacheEverything: true } } as RequestInit,
  )
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

const gitswitchGetGateway = createMiddleware().server(async ({ next, request }) => {
  if ((request.headers.get('host') ?? '') !== GET_HOST) return next()

  if (wantsAgentJson(request)) {
    return Response.json({
      install_command: 'curl -fsSL https://get.gitswitch.dev | bash',
      next_steps: ['gitswitch doctor --json', 'gitswitch login', 'gitswitch doctor --json'],
      docs_url: AGENT_SETUP_URL,
    })
  }

  if ((request.headers.get('accept') ?? '').includes('text/html')) {
    return Response.redirect(AGENT_SETUP_URL, 302)
  }

  return installScriptResponse()
})

export const startInstance = createStart(() => ({
  requestMiddleware: [gitswitchGetGateway],
}))
