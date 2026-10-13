<script setup lang="ts">
import { t, locale, publicationDate } from '../i18n'
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowRight, Clock3 } from 'lucide-vue-next'
import { useArticles } from '../store'
import ArticleCard from '../components/ArticleCard.vue'
import { articleImage } from '../articleImages'
import { parseArticle } from '../articleStructure'
const route = useRoute()
const { published } = useArticles()
const article = computed(() => published.value.find(item => item.slug === route.params.slug))
const related = computed(() => published.value.filter(item => item.id !== article.value?.id).slice(0, 2))
const blocks=computed(()=>parseArticle(article.value?.body||''))
const headings=computed(()=>blocks.value.filter(b=>b.kind!=='p'))
const activeHeading=ref(''), progress=ref(0)
let frame=0
function updateReading(){cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const body=document.querySelector('.article-body');if(!body)return;const nodes=[...body.querySelectorAll<HTMLElement>('h2[id],h3[id]')];let current=nodes[0]?.id||'';for(const node of nodes){if(node.getBoundingClientRect().top<=160)current=node.id}activeHeading.value=current;const rect=body.getBoundingClientRect();progress.value=Math.min(100,Math.max(0,(-rect.top+160)/Math.max(1,rect.height-innerHeight+160)*100))})}
onMounted(()=>{window.addEventListener('scroll',updateReading,{passive:true});window.addEventListener('resize',updateReading);nextTick(updateReading)})
watch(blocks,()=>nextTick(updateReading))
onUnmounted(()=>{window.removeEventListener('scroll',updateReading);window.removeEventListener('resize',updateReading);cancelAnimationFrame(frame)})
const sources: Record<string, { label: string; url: string }[]> = {
  'movement-for-a-better-day': [{ label: 'راهنمای فعالیت بدنی سازمان جهانی بهداشت', url: 'https://www.who.int/publications/i/item/9789240015128' }],
  'knee-health-guide': [{ label: 'راهنمای زانودرد خدمات سلامت ملی بریتانیا', url: 'https://www.nhs.uk/symptoms/knee-pain/' }],
  'mind-and-recovery': [{ label: 'راهنمای بازتوانی سازمان جهانی بهداشت', url: 'https://www.who.int/news-room/fact-sheets/detail/rehabilitation' }],
}
</script>

<template>
  <div v-if="article" class="page-wrap"><section class="article-hero"><div class="container article-hero-inner"><RouterLink to="/magazine" class="back-link"><ArrowRight :size="17" /> {{ t("بازگشت به مجله سلامت") }}</RouterLink><span class="kicker"><span class="kicker-dot"></span> {{ t(article.category || '') }}</span><h1>{{ t(article.title || '') }}</h1><p>{{ t(article.excerpt || '') }}</p><div class="article-byline"><span>{{ t(article.author || '') }}</span><span>{{ publicationDate(article.publishedAt) }}</span><span><Clock3 :size="16" /> {{ article.readMinutes.toLocaleString(locale()) }} {{ t("دقیقه مطالعه") }}</span></div></div></section><section class="article-body-section"><div class="container article-body-layout"><div :class="['article-cover', 'article-cover-large', `cover-${article.cover}`, { 'article-cover-image': articleImage(article) }]"><img v-if="articleImage(article)" :src="articleImage(article)" :alt="t(article.title)" /><template v-else><span class="cover-circle circle-one"></span><span class="cover-circle circle-two"></span><span class="cover-symbol">✳</span></template><span class="cover-label">{{ t("مجله سلامت مهرگان") }}</span></div><div class="article-reading-layout"><aside v-if="headings.length" class="article-toc"><span>در این مقاله می‌خوانید</span><div class="reading-progress" role="progressbar" aria-label="پیشرفت مطالعه" :aria-valuenow="Math.round(progress)" aria-valuemin="0" aria-valuemax="100"><i :style="{width:progress+'%'}"></i></div><nav aria-label="فهرست مقاله"><a v-for="heading in headings" :key="heading.id" :href="'#'+heading.id" :class="{active:activeHeading===heading.id,sub:heading.kind==='h3'}" :aria-current="activeHeading===heading.id?'location':undefined">{{heading.text}}</a></nav></aside><article class="article-body"><component v-for="(block,index) in blocks" :is="block.kind" :key="index" :id="block.id||undefined">{{block.text}}</component><div class="medical-note">{{ t("این مطلب برای آگاهی عمومی تهیه شده است و جایگزین ارزیابی و توصیهٔ فردی متخصص نیست.") }}</div><div v-if="sources[article.slug]" class="article-sources"><strong>{{ t("منابع این مطلب", "Sources") }}</strong><a v-for="source in sources[article.slug]" :key="source.url" :href="source.url" target="_blank" rel="noopener noreferrer">{{ t(source.label) }} ↗</a></div></article></div></div></section><section v-if="related.length" class="section related-section"><div class="container"><div class="section-head"><div><span class="kicker"><span class="kicker-dot"></span> {{ t("برای مطالعه بیشتر") }}</span><h2>{{ t("شاید این‌ها هم برایتان مفید باشد") }}</h2></div></div><div class="article-grid"><ArticleCard v-for="item in related" :key="item.id" :article="item" /></div></div></section></div><div v-else class="container not-found"><h1>{{ t("این مقاله پیدا نشد.") }}</h1><RouterLink to="/magazine" class="button button-primary">{{ t("بازگشت به مجله") }}</RouterLink></div>
</template>

