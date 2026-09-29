import { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', allow: '/' }, sitemap: 'https://dk-01.netlify.app/sitemap.xml' }; }
