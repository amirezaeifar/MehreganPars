<script setup lang="ts">
import { platforms } from '../data'
import { platformDetails } from '../platformDetails'
import { platformStories } from '../platformStories'
import { t } from '../i18n'
import { ArrowUpLeft, ArrowLeft } from 'lucide-vue-next'
import PlatformIcon from '../components/PlatformIcon.vue'
</script>

<template>
  <div class="platforms-directory page-wrap">
    <section class="family-intro container">
      <span class="kicker"><span class="kicker-dot"></span>{{ t('خانواده سلامت مهرگان', 'THE MEHREGAN FAMILY') }}</span>
      <div class="family-intro-row"><h1>{{ t('راه‌های متفاوت،', 'Different paths.') }}<br><em>{{ t('برای حالِ بهتر.', 'A better everyday.') }}</em></h1><div><p>{{ t('گاهی یک قدم، گاهی یک گفت‌وگو، گاهی یک عادت تازه. برای هر بخش از زندگی، مسیری برای مراقبت هست.', 'Sometimes a step. Sometimes a conversation. Sometimes a new habit. There is a path to care for every part of life.') }}</p><a href="#care-paths" class="editorial-link">{{ t('مسیر خودتان را پیدا کنید', 'Find your path') }}<ArrowLeft :size="18"/></a></div></div>
      <div class="family-topics"><span>{{ t('مراقبت حضوری', 'In-person care') }}</span><span>{{ t('همراهی دیجیتال', 'Digital support') }}</span><span>{{ t('یک نگاه مشترک به شما', 'One shared focus: you') }}</span></div>
    </section>
    <section id="care-paths" class="family-grid container" :aria-label="t('پلتفرم‌های مهرگان', 'Mehregan platforms')">
      <article v-for="platform in platforms" :key="platform.slug" :class="['family-card', 'tone-'+platform.color, { 'family-featured': platform.category === 'clinic' }]">
        <RouterLink :to="`/platforms/${platform.slug}/overview`" class="family-image" :aria-label="t(platform.name)"><img :src="platformDetails[platform.slug].directory" :alt="platform.name + '؛ ' + platform.eyebrow" loading="lazy"/><span class="family-image-note">{{ t(...platformStories[platform.slug].note) }}</span></RouterLink>
        <div class="family-copy"><span class="family-category"><PlatformIcon :name="platform.icon" :size="20"/>{{ t(platform.eyebrow) }}</span><h2>{{ t(platform.name) }}</h2><h3>{{ t(...platformStories[platform.slug].title) }}</h3><p>{{ t(platform.longDescription) }}</p><div class="family-services"><span v-for="service in platform.services.slice(0,3)" :key="service">{{ t(service) }}</span></div><div class="family-actions"><RouterLink :to="`/platforms/${platform.slug}/overview`" class="editorial-link">{{ t('بیشتر آشنا شوید', 'Take a closer look') }}<ArrowLeft :size="18"/></RouterLink><RouterLink :to="`/platforms/${platform.slug}`" class="family-visit">{{ t('ورود به سایت', 'Visit site') }}<ArrowUpLeft :size="16"/></RouterLink></div></div>
      </article>
    </section>
    <section class="family-help container"><div><span class="kicker">{{ t('یک شروع روشن', 'A CLEARER START') }}</span><h2>{{ t('هنوز نمی‌دانید از کجا شروع کنید؟', 'Not sure where to begin?') }}</h2><p>{{ t('از دغدغه‌تان بگویید تا گفت‌وگو را از همان‌جا شروع کنیم.', 'Tell us what is on your mind. We can start there.') }}</p></div><RouterLink to="/contact" class="button button-primary">{{ t('ارتباط با مهرگان', 'Contact Mehregan') }}<ArrowLeft :size="18"/></RouterLink></section>
  </div>
</template>
