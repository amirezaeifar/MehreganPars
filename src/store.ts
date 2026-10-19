import { queueChange } from './governance'
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
    if (articles.value.some(item => item.slug === article.slug && item.id !== article.id)) throw new Error('نشانی مقاله تکراری است.')
    if(queueChange('article',article.id,article.title,article,articles.value.find(a=>a.id===article.id))) return true
    const index = articles.value.findIndex(item => item.id === article.id)
    if (index >= 0) articles.value[index] = article
    else articles.value.unshift(article)
    return false
  }
  function remove(id: string) {
    const original=articles.value.find(a=>a.id===id)
    if(queueChange('article-delete',id,original?.title||id,null,original))return true
    articles.value = articles.value.filter(article => article.id !== id)
    return false
  }
  return { articles, published, save, remove }
}
