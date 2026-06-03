// Minimal Cloudflare Pages Worker — serves every request as a static asset.
// This overrides Cloudflare's auto-generated Next.js worker which fails to
// serve .xml, .ico and other non-.txt static files (returns 500).
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
