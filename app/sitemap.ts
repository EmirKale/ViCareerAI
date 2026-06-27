import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vi-career-ai.vercel.app';
  const lastModified = new Date();

  // Define routes with their priorities and change frequencies
  const routes = [
    {
      url: `${baseUrl}/tr`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tr/pricing`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/pricing`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tr/login`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/login`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tr/register`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/register`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  return routes;
}
