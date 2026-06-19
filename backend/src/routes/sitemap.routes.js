import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

const STATIC_PAGES = [
  '',
  'services/ai-chatbots',
  'services/ai-voice-agents',
  'services/crm-automation',
  'services/website-development',
  'services/video-editing-motion-design',
  'services/saas-development',
  'blog',
  'contact',
  'about',
  'locations/united-states',
  'locations/canada',
  'locations/new-york',
  'locations/california',
  'locations/texas',
  'locations/florida',
  'locations/illinois',
  'locations/ontario',
  'locations/british-columbia',
  'locations/georgia',
];

router.get('/sitemap.xml', async (_req, res) => {
  try {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true);

    const today = new Date().toISOString().split('T')[0];

    const staticUrls = STATIC_PAGES.map(
      (p) =>
        `<url><loc>https://zroxz.com/${p}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${p === '' ? '1.0' : '0.8'}</priority></url>`
    );

    const blogUrls = (posts || []).map(
      (p) =>
        `<url><loc>https://zroxz.com/blog/${p.slug}</loc><lastmod>${(p.updated_at || today).split('T')[0]}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`
    );

    const allUrls = [...staticUrls, ...blogUrls].join('\n  ');

    res.set('Content-Type', 'application/xml');
    res.send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${allUrls}\n</urlset>`
    );
  } catch (err) {
    console.error('Sitemap error:', err.message);
    res.status(500).send('Failed to generate sitemap');
  }
});

export default router;
