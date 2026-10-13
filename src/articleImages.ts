import type { Article } from './data'

const images: Record<string, string> = {
  'nutrition-in-recovery': '/images/article-nutrition-art.jpg',
  'movement-for-a-better-day': '/images/article-movement-art.jpg',
  'knee-health-guide': '/images/article-knee-art.jpg',
  'mind-and-recovery': '/images/article-mind-art.jpg',
}

export function articleImage(article: Article): string | undefined {
  return images[article.slug]
}
