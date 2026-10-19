<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { platforms } from '../data'
import { platformDetails } from '../platformDetails'
import { platformStories } from '../platformStories'
import { t } from '../i18n'
import { detailText } from '../platformEnglish'
import { ArrowLeft, ArrowRight, ArrowUpLeft, Check } from 'lucide-vue-next'
import ProductArt from '../components/ProductArt.vue'
import PlatformIcon from '../components/PlatformIcon.vue'
const route = useRoute()
const platform = computed(() => platforms.find(item => item.slug === route.params.slug))
const story = computed(() => platform.value ? platformStories[platform.value.slug] : undefined)
</script>

<template>
  <div v-if="platform && story" :class="['platform-overview page-wrap', 'tone-'+platform.color,'brand-'+platform.slug]">
    <section class="path-hero"><div class="container"><RouterLink to="/platforms" class="back-link"><ArrowRight :size="16"/>{{ t('همه مسیرهای مهرگان', 'All Mehregan services') }}</RouterLink><div class="path-hero-grid"><div class="path-hero-copy"><span class="family-category"><PlatformIcon :name="platform.icon" :size="23"/>{{ t(platform.name) }}</span><h1>{{ t(...story.title) }}</h1><p>{{ t(platform.longDescription) }}</p><div class="path-hero-actions"><RouterLink :to="`/platforms/${platform.slug}`" class="button button-primary">{{ t('ورود به سایت', 'Visit site') }}<ArrowUpLeft :size="18"/></RouterLink><a href="#services" class="editorial-link">{{ t('کشف خدمات', 'Explore services') }}<ArrowLeft :size="18"/></a></div><span class="path-parent">{{ t('عضوی از خانواده سلامت مهرگان پارس', 'PART OF THE MEHREGAN PARS FAMILY') }}</span></div><figure class="life-frame path-frame"><img :src="story.image" :alt="t(...story.alt)" fetchpriority="high"/><figcaption><span>{{ t(platform.eyebrow) }}</span><strong>{{ t(...story.note) }}</strong></figcaption></figure></div></div></section>
    <section v-if="platform.slug==='shop'" class="overview-products container"><div><span class="kicker">{{t('از نیاز خود شروع کنید','Start with your needs')}}</span><h2>{{t('یک مجموعه برای مراقبت در خانه','A collection for care at home')}}</h2></div><div class="overview-product-grid"><RouterLink v-for="kit in [{id:'back',fa:'مراقبت کمر',en:'Back care'},{id:'neck',fa:'مراقبت گردن',en:'Neck care'},{id:'knee',fa:'مراقبت زانو',en:'Knee care'},{id:'essentials',fa:'لوازم مصرفی',en:'Essentials'}]" :key="kit.id" to="/shop#products"><ProductArt :variant="kit.id"/><strong>{{t(kit.fa,kit.en)}}</strong><ArrowUpLeft :size="18"/></RouterLink></div></section><section class="path-context container"><span class="kicker">{{ t('این مسیر برای شماست اگر…', 'IS THIS YOUR PATH?') }}</span><h2>{{ t(...story.audience) }}</h2></section>
    <section class="overview-story container"><div><span class="kicker">{{ t("رویکرد ") }}{{platform.name}}</span><h2>{{detailText(platform.slug,'careTitle',platformDetails[platform.slug].careTitle)}}</h2><p>{{detailText(platform.slug,'careText',platformDetails[platform.slug].careText)}}</p></div><div><p v-for="paragraph in platformDetails[platform.slug].overview" :key="paragraph">{{detailText(platform.slug,'overview',paragraph,platformDetails[platform.slug].overview.indexOf(paragraph))}}</p></div></section>
    <section id="services" class="path-services container"><div class="section-head"><div><span class="kicker">{{ t('راه‌های همراهی', 'WAYS WE CAN HELP') }}</span><h2>{{ t('مراقبت، با توجه به نیاز شما.', 'Care, shaped around you.') }}</h2></div><PlatformIcon :name="platform.icon" :size="38"/></div><div class="path-service-grid"><article v-for="(service, index) in platform.services" :key="service"><Check :size="20"/><h3>{{ t(service) }}</h3><p>{{ t(...story.services[index]) }}</p></article></div></section>
    <section class="overview-prepare container"><div><span class="kicker">{{ t("آماده برای شروع") }}</span><h2>{{platform.slug==='shop'?t('پیش از انتخاب محصول','Before choosing a product'):t('پیش از اولین گفت‌وگو')}}</h2></div><ul><li v-for="item in platformDetails[platform.slug].prepare" :key="item"><Check :size="18"/>{{detailText(platform.slug,'prepare',item,platformDetails[platform.slug].prepare.indexOf(item))}}</li></ul></section>
    <section class="path-next container"><div><span class="kicker">{{ t('قدم بعدی', 'YOUR NEXT STEP') }}</span><h2>{{ t('از آشنایی، به همراهی.', 'From discovery to support.') }}</h2><p>{{ t('در سایت این مجموعه، خدمات را دقیق‌تر ببینید و راه ارتباط مناسب خودتان را انتخاب کنید.', 'Explore the service website in more detail and choose how to get in touch.') }}</p></div><RouterLink :to="`/platforms/${platform.slug}`" class="button button-primary">{{ t('ورود به سایت', 'Visit') }} {{ t(platform.name) }}<ArrowUpLeft :size="18"/></RouterLink></section>
    <div class="container path-return"><RouterLink to="/platforms" class="editorial-link">{{ t('آشنایی با دیگر مسیرهای مهرگان', 'Explore the rest of the family') }}<ArrowLeft :size="18"/></RouterLink></div>
  </div>
  <div v-else class="container empty-state"><h1>{{ t('این مجموعه پیدا نشد', 'Service not found') }}</h1><RouterLink to="/platforms">{{ t('بازگشت به دنیای مهرگان', 'Back to all services') }}</RouterLink></div>
</template>

