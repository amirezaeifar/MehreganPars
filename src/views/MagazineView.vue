<script setup lang="ts">
import { t } from '../i18n'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Search, ArrowLeft } from 'lucide-vue-next'
import { useArticles } from '../store'
import ArticleCard from '../components/ArticleCard.vue'
const { published } = useArticles()
const route = useRoute()
const activeCategory = ref('همه مطالب')
watch(() => route.query.category, value => { activeCategory.value = typeof value === 'string' ? value : 'همه مطالب' }, { immediate: true })
const query = ref('')
const categories = computed(() => ['همه مطالب', ...new Set(published.value.map(article => article.category))])
const filtered = computed(() => published.value.filter(article => (activeCategory.value === 'همه مطالب' || article.category === activeCategory.value) && (t(article.title).toLowerCase().includes(query.value.toLowerCase()) || t(article.excerpt).toLowerCase().includes(query.value.toLowerCase()))))
</script>

<template>
  <div class="page-wrap"><section class="magazine-hero"><div class="container magazine-hero-grid"><div><span class="kicker"><span class="kicker-dot"></span> {{ t('مجله سلامت مهرگان', 'Mehregan health journal') }}</span><h1>{{ t('چند دقیقه برای دانستن، یک قدم برای مراقبت.', 'A little time to learn. A better way to care.') }}</h1><p>{{ t('درباره حرکت، سلامت روان، تغذیه و بازتوانی بخوانید؛ با زبانی روشن و نزدیک به زندگی هر روز.', 'Clear, practical reading about movement, mental wellbeing, nutrition and recovery.') }}</p><a href="#articles" class="editorial-link">{{ t('خواندن مقاله‌ها', 'Browse articles') }} <ArrowLeft :size="18"/></a></div><figure class="life-frame journal-frame"><img src="/images/journal-life.jpg" :alt="t('لحظه‌ای آرام برای خواندن در نور روز', 'A quiet moment to read in daylight')" fetchpriority="high"/><figcaption><span>{{ t('کمی مکث، کمی آگاهی', 'PAUSE. READ. GROW.') }}</span><strong>{{ t('حال خوب، از توجه شروع می‌شود.', 'Wellbeing begins with attention.') }}</strong></figcaption></figure></div></section><section id="articles" class="section"><div class="container"><div class="magazine-tools"><div class="category-tabs" role="group" :aria-label="t('دسته‌بندی مقاله‌ها')"><button v-for="category in categories" :key="category" type="button" :class="{ active: activeCategory === category }" @click="activeCategory = category">{{ t(category || '') }}</button></div><label class="search-field"><Search :size="18" /><input v-model="query" type="search" :placeholder="t('جست‌وجوی مقاله')" :aria-label="t('جست‌وجوی مقاله')" /></label></div><div v-if="filtered.length" class="article-grid magazine-list"><ArticleCard v-for="article in filtered" :key="article.id" :article="article" /></div><div v-else class="empty-state">{{ t('مقاله‌ای با این جست‌وجو پیدا نشد. عبارت دیگری را امتحان کنید.') }}</div></div></section></div>
</template>
