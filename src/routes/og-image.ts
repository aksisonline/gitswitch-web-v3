import { createFileRoute } from '@tanstack/react-router'

// Lets /og-image work as an <img src> in READMEs; the page that renders the
// PNG now lives at /og-image-generator.
export const Route = createFileRoute('/og-image')({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) =>
        Response.redirect(new URL('/og-image.png', request.url), 302),
    },
  },
})
