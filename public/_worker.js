// Cloudflare Pages Worker — handles requests that env.ASSETS cannot serve.
// env.ASSETS.fetch() returns 500 for .xml and .ico files in this project,
// so we intercept those paths and return the content directly.

const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://calcbarn.com/</loc><changefreq>monthly</changefreq><priority>1</priority></url>
<url><loc>https://calcbarn.com/about/</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
<url><loc>https://calcbarn.com/contact/</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
<url><loc>https://calcbarn.com/privacy/</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
<url><loc>https://calcbarn.com/disclaimer/</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
<url><loc>https://calcbarn.com/paint-calculator/</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://calcbarn.com/flooring-calculator/</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://calcbarn.com/tile-calculator/</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://calcbarn.com/concrete-calculator/</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://calcbarn.com/drywall-calculator/</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://calcbarn.com/gravel-calculator/</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://calcbarn.com/mulch-calculator/</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://calcbarn.com/roof-shingles-calculator/</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://calcbarn.com/fencing-calculator/</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://calcbarn.com/deck-calculator/</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://calcbarn.com/asphalt-calculator/</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
</urlset>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Serve sitemap directly (env.ASSETS fails for .xml files)
    if (path === "/sitemap.xml") {
      return new Response(SITEMAP, {
        status: 200,
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      });
    }

    // For all other paths, use the ASSETS binding
    return env.ASSETS.fetch(request);
  },
};
