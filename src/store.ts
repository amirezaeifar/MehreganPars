import { computed, ref, watch } from 'vue'
import { initialArticles, type Article } from './data'
import { articleBodies } from './articleBodies'

const key = 'mehregan-magazine-v1'
function readArticles(): Article[] {
  try {
    const saved = localStorage.getItem(key)
    const articles = saved ? JSON.parse(saved) as Article[] : initialArticles
    return articles.map(article => articleBodies[article.slug] && (article.body === initialArticles.find(item => item.slug === article.slug)?.body || article.body === articleBodies[article.slug]!.replace(/^#{2,3} .*\n\n/gm, ''))
      ? { ...article, body: articleBodies[article.slug]!, readMinutes: 8 }
      : article)
  } catch {
    return initialArticles.map(article => articleBodies[article.slug]
      ? { ...article, body: articleBodies[article.slug]!, readMinutes: 8 }
      : article)
  }
}

const articles = ref<Article[]>(readArticles())
watch(articles, value => localStorage.setItem(key, JSON.stringify(value)), { deep: true })

export function useArticles() {
  const published = computed(() => articles.value.filter(article => article.status === 'published'))
  function save(article: Article) {
    const index = articles.value.findIndex(item => item.id === article.id)
    if (index >= 0) articles.value[index] = article
    else articles.value.unshift(article)
  }
  function remove(id: string) {
    articles.value = articles.value.filter(article => article.id !== id)
  }
  return { articles, published, save, remove }
}
