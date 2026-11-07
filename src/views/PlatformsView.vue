<script setup lang="ts">
import { platforms } from '../data'
import { t } from '../i18n'
import { ArrowUpLeft, ArrowLeft } from 'lucide-vue-next'
import PlatformIcon from '../components/PlatformIcon.vue'

const photography: Record<string, string> = {
  'health-center': 'brands/health.webp', hydrotherapy: 'brands/hydrotherapy.webp',
  physiopars: 'brands/physio.webp', oncopars: 'brands/onco.webp',
  psychopars: 'brands/psycho.webp', shop: 'brands/shop.webp',
}
const collections = [
  { id: 'clinic', title: ['مراقبت حضوری', 'In-person care'] as const },
  { id: 'digital', title: ['همراهی دیجیتال', 'Digital support'] as const },
].map(group => ({ ...group, brands: platforms.filter(brand => brand.category === group.id) }))
</script>

<template>
  <div class="brands-directory">
    <section class="brands-cover">
      <div class="cover-inner">
        <div class="cover-copy">
          <span class="cover-caption">{{ t('خانواده سلامت مهرگان', 'THE MEHREGAN FAMILY') }}</span>
          <h1>{{ t('راه‌های متفاوت،', 'Different paths.') }}<br>{{ t('برای حالِ بهتر.', 'A better everyday.') }}</h1>
          <p>{{ t('گاهی یک قدم، گاهی یک گفت‌وگو، گاهی یک عادت تازه. برای هر بخش از زندگی، مسیری برای مراقبت هست.', 'Sometimes a step. Sometimes a conversation. Sometimes a new habit. There is a path to care for every part of life.') }}</p>
          <nav :aria-label="t('مسیرهای مراقبت', 'Care paths')">
            <a v-for="group in collections" :key="group.id" :href="'#brands-'+group.id">{{ t(group.title[0], group.title[1]) }} <ArrowLeft :size="15"/></a>
          </nav>
        </div>
        <div class="cover-art" aria-hidden="true">
          <img class="cover-portrait" src="/images/brands/health.webp" alt="" fetchpriority="high"/>
          <img class="cover-detail" src="/images/brands/physio.webp" alt=""/>
        </div>
      </div>
    </section>
    <section v-for="group in collections" :id="'brands-'+group.id" :key="group.id" class="brand-collection">
      <h2>{{ t(group.title[0], group.title[1]) }}</h2>
      <div class="collection-grid">
      <article v-for="platform in group.brands" :key="platform.slug" class="directory-entry">
        <RouterLink class="entry-image" :to="`/platforms/${platform.slug}/overview`" :aria-label="t(platform.name)">
          <img :src="'/images/'+photography[platform.slug]" alt="" loading="lazy"/>
        </RouterLink>
        <div class="entry-copy">
          <span class="entry-kicker"><PlatformIcon :name="platform.icon" :size="18"/>{{ t(platform.eyebrow) }}</span>
          <h3>{{ t(platform.name) }}</h3>
          <p>{{ t(platform.longDescription) }}</p>
        </div>
        <div class="entry-links">
          <RouterLink :to="`/platforms/${platform.slug}/overview`">{{ t('بیشتر آشنا شوید', 'Take a closer look') }} <ArrowLeft :size="16"/></RouterLink>
          <RouterLink :to="`/platforms/${platform.slug}`">{{ t('ورود به سایت', 'Visit site') }} <ArrowUpLeft :size="16"/></RouterLink>
        </div>
      </article>
      </div>
    </section>
    <section class="directory-help"><div><h2>{{ t('هنوز نمی‌دانید از کجا شروع کنید؟', 'Not sure where to begin?') }}</h2><RouterLink to="/contact">{{ t('ارتباط با مهرگان', 'Contact Mehregan') }} <ArrowLeft :size="18"/></RouterLink></div></section>
  </div>
</template>
<style scoped>
.brands-directory { --ink:#103f31; --paper:#f9faf4; color:var(--ink); background:var(--paper); text-align:start }
.cover-inner,.brand-collection,.directory-help > div { width:min(88%,1320px); margin-inline:auto }
.brands-cover { background:linear-gradient(125deg,#eef2e5,#f9faf4 62%); overflow:hidden }
.cover-inner { display:grid; grid-template-columns:1fr 1.12fr; align-items:center; gap:6%; padding-block-end:clamp(50px,6vw,96px) }
.cover-caption,.entry-kicker { display:flex; align-items:center; gap:.65rem; font-size:.85rem; font-weight:650 }
.cover-caption::before { content:""; width:2rem; height:2px; background:#83963f }
.cover-copy h1 { color:var(--ink); font-size:clamp(2.8rem,5.25vw,5rem); line-height:1.23; margin:20px 0 }
.cover-copy p,.entry-copy p { max-width:50ch; margin:0; line-height:1.8; text-align:start }
.cover-copy nav,.entry-links { display:flex; gap:.7rem; flex-wrap:wrap; align-items:center }
.cover-copy nav { margin-top:26px }
.cover-copy a,.entry-links a,.directory-help a { display:inline-flex; align-items:center; gap:.65rem; color:inherit; font-weight:650; text-decoration:none }
.cover-copy a { border-radius:2rem; padding:.65rem 1rem; border:1px solid #b3c3ae }
.cover-copy a:first-child,.directory-help a { color:#fff; background:var(--ink); border-color:var(--ink) }
.cover-copy nav svg { transform:rotate(-90deg) }
.cover-art { position:relative; isolation:isolate; padding:0 6% 9% 0 }
.cover-art::before { content:""; position:absolute; inset:5% 0 8% 6%; border:1px solid #91a87b; border-radius:48% 1rem 48% 1rem; z-index:-1 }
.cover-portrait { display:block; width:100%; aspect-ratio:1.32; object-fit:cover; border-radius:48% 1rem 48% 1rem }
.cover-detail { position:absolute; bottom:0; right:0; width:34%; aspect-ratio:1; object-fit:cover; border:7px solid var(--paper); border-radius:50% }
.brand-collection { padding-block-start:clamp(40px,5vw,80px); scroll-margin-top:30px }
.brand-collection h2,.directory-help h2 { color:inherit; font-size:clamp(1.85rem,3.4vw,3.4rem); line-height:1.35; margin:0 }
.brand-collection h2 { display:flex; align-items:center; gap:1.25rem; margin-bottom:1.4rem }
.brand-collection h2::after { content:""; flex:1; height:1px; background:#c1cfba }
.collection-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:clamp(18px,2.6vw,40px) }
.directory-entry { display:flex; flex-direction:column; align-items:stretch; overflow:hidden; border-radius:20px; background:#f6f2e7; box-shadow:inset 0 0 0 1px #d8dfcd }
.entry-image { display:block; overflow:hidden; position:relative }
.entry-image::after { content:""; position:absolute; inset-inline-start:0; bottom:0; width:18%; height:3px; background:#ce7649; pointer-events:none }
.entry-image img { display:block; width:100%; aspect-ratio:2.4; object-fit:cover }
.entry-copy,.entry-links { padding-inline:clamp(18px,2.3vw,36px) }
.entry-copy { padding-block:22px 16px }
.entry-kicker { color:#435e48 }
.entry-kicker svg { color:#91512f }
.entry-copy h3 { color:inherit; font-size:clamp(1.6rem,2.6vw,2.65rem); margin:.35rem 0; line-height:1.35 }
.entry-links { margin-top:auto; padding-bottom:22px; gap:1.4rem }
.entry-links a { min-height:44px }
.entry-links a:first-child { border-bottom:1px solid #b86a43 }
.entry-links a:dir(ltr) svg,.directory-help a:dir(ltr) svg { transform:scaleX(-1) }
.directory-help { background:#dce9d3; margin-top:clamp(44px,6vw,94px); padding-block:clamp(38px,5vw,76px) }
.directory-help > div { display:flex; justify-content:space-between; align-items:center; gap:1rem }
.directory-help a { border-radius:2rem; padding:.8rem 1.2rem }
.brands-directory a:focus-visible { outline:3px solid #889b34; outline-offset:-3px }
@media(hover:hover) { .cover-copy a:hover,.entry-links a:hover,.directory-help a:hover { text-decoration:underline; text-underline-offset:4px } }
@media(prefers-reduced-motion:no-preference) and (hover:hover) {
 .entry-image img { transition:transform .45s ease }
 .entry-image:hover img { transform:scale(1.035) }
}
@media(max-width:760px) {
 .cover-inner,.collection-grid { grid-template-columns:minmax(0,1fr) }
 .cover-inner { gap:30px; padding-block-end:32px }
 .cover-art { width:min(100%,480px); margin-inline:auto }
 .cover-portrait { aspect-ratio:1.75 }
 .cover-detail { width:28%; border-width:5px }
 .cover-copy h1 { margin:14px 0 }
 .directory-help > div { align-items:start; flex-direction:column }
}
</style>
