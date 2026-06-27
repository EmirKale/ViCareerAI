import { MetadataRoute } from 'next'

const BASE_URL = 'https://vi-career-ai.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/tr/dashboard',
          '/en/dashboard',
          '/dashboard',
          '/tr/cv/*',
          '/en/cv/*',
          '/cv/*',
          '/tr/cover-letter/*',
          '/en/cover-letter/*',
          '/cover-letter/*',
          '/tr/jobs/*',
          '/en/jobs/*',
          '/jobs/*',
          '/tr/skills/*',
          '/en/skills/*',
          '/skills/*',
          '/tr/roadmap/*',
          '/en/roadmap/*',
          '/roadmap/*',
          '/tr/interview',
          '/en/interview',
          '/interview',
          '/tr/profile',
          '/en/profile',
          '/profile',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
