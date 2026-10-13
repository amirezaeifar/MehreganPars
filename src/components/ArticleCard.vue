<script setup lang="ts">
import { t, locale, publicationDate } from '../i18n'
import { ArrowUpLeft, Clock3 } from 'lucide-vue-next'
import type { Article } from '../data'
import { articleImage } from '../articleImages'
defineProps<{ article: Article }>()
</script>

<template>
  <RouterLink :to="`/magazine/${article.slug}`" class="article-card">
    <div :class="['article-cover', `cover-${article.cover}`, { 'article-cover-image': articleImage(article) }]"><img v-if="articleImage(article)" :src="articleImage(article)" :alt="t(article.title)" loading="lazy" /><template v-else><span class="cover-circle circle-one"></span><span class="cover-circle circle-two"></span><span class="cover-symbol">✳</span></template><span class="cover-label">{{ t("مجله سلامت مهرگان") }}</span></div>
    <div class="article-content"><div class="article-meta"><span>{{ t(article.category || '') }}</span><span><Clock3 :size="14" /> {{ article.readMinutes.toLocaleString(locale()) }} {{ t("دقیقه مطالعه") }}</span></div><h3>{{ t(article.title || '') }}</h3><p>{{ t(article.excerpt || '') }}</p><div class="article-bottom"><span>{{ publicationDate(article.publishedAt) }}</span><span class="round-arrow"><ArrowUpLeft :size="18" /></span></div></div>
  </RouterLink>
</template>
