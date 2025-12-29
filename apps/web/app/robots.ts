import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://avenir-bank.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/dashboard/', '/api/', '/auth/confirm-email'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
