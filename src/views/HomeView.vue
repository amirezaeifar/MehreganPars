<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowUpLeft, ArrowLeft, Plus, Video, Check, Activity, CalendarDays, ShoppingBag, Search } from 'lucide-vue-next'
import { platforms } from '../data'
import { t } from '../i18n'
import { useArticles } from '../store'
import PlatformIcon from '../components/PlatformIcon.vue'
import SlidingIndicator from '../components/SlidingIndicator.vue'
import ArticleCard from '../components/ArticleCard.vue'
const {published}=useArticles()
const ecosystemPlatforms=platforms.filter(platform=>platform.slug!=='hydrotherapy')
const railItems=[
  {slug:'health-center',label:'پلتفرم سلامت',en:'Health platform'},
  {slug:'physiopars',label:'فیزیوتراپی',en:'Physiotherapy'},
  {slug:'hydrotherapy',label:'آب‌درمانی',en:'Hydrotherapy'},
  {slug:'shop',label:'فروشگاه',en:'Shop'},
]
const selected=ref(1)
const active=computed(()=>ecosystemPlatforms[selected.value]!)
</script>
<template>
<div class="holding-home">

<section class="campaign-hero"><img class="campaign-photo" src="/images/care-session.jpg" :alt="t('همراهی متخصص با مراجعه‌کننده در تمرین بازتوانی','A specialist supporting a patient through a rehabilitation exercise')" fetchpriority="high"/><div class="campaign-shade"></div><div class="wide campaign-content"><span class="editorial-eyebrow">{{t('این‌جا، زندگی جریان دارد','HERE’S TO LIVING WELL')}}</span><h1>{{t('کنار شما،','By your side,')}}<br><span>{{t('برای روزهای بهتر','for better days')}}</span></h1><p>{{t('از حرکت و آب‌درمانی تا آرامش ذهن؛ در مهرگان، مراقبت متناسب با زندگی شماست','From movement and hydrotherapy to mental wellbeing, care at Mehregan fits your life')}}</p><a href="#ecosystem" class="pill pill-red">{{t('دنیای مهرگان را کشف کنید','Explore our world')}}<ArrowUpLeft :size="19"/></a></div><span class="hero-side-label">{{t('خانواده سلامت مهرگان','THE MEHREGAN FAMILY')}}</span></section>
<section class="brand-rail wide"><span>{{t('یک خانواده، چهار مسیر برای شما','ONE FAMILY, FOUR WAYS TO CARE')}}</span><div><RouterLink v-for="item in railItems" :key="item.slug" :to="item.slug==='hydrotherapy'?'/platforms/hydrotherapy':'/#ecosystem'" @click="selected=Math.max(0,ecosystemPlatforms.findIndex(platform=>platform.slug===item.slug))"><PlatformIcon :name="platforms.find(platform=>platform.slug===item.slug)?.icon||'heart'" :size="23"/><b>{{t(item.label,item.en)}}</b></RouterLink></div></section>
<section id="ecosystem" class="product-universe"><div class="wide"><div class="editorial-heading"><div><span class="editorial-eyebrow">{{t('دنیای به‌هم‌پیوسته ما','OUR CONNECTED WORLD')}}</span><h2>{{t('برای هر بُعد از شما','For every part of you')}}</h2></div><p>{{t('پنج برند با تخصص‌های متفاوت، از ملاقات حضوری تا همراهی در خانه و فروشگاه','Five specialist brands, from in-person care to support at home and the shop')}}</p></div>
<div class="universe-tabs" role="tablist" :aria-label="t('انتخاب پلتفرم','Choose a brand')"><button v-for="(p,i) in ecosystemPlatforms" :key="p.slug" :id="`brand-tab-${i}`" role="tab" :aria-selected="selected===i" aria-controls="brand-panel" :tabindex="selected===i?0:-1" :class="[{active:selected===i},'brand-'+p.slug]" @click="selected=i" @keydown.right.prevent="selected=(selected+1)%ecosystemPlatforms.length" @keydown.left.prevent="selected=(selected+ecosystemPlatforms.length-1)%ecosystemPlatforms.length"><PlatformIcon :name="p.icon" :size="20"/>{{t(p.name)}}</button><SlidingIndicator :active-key="selected" selector="button.active"/></div>
<div id="brand-panel" role="tabpanel" :aria-labelledby="`brand-tab-${selected}`" :class="['universe-stage',`universe-${active.slug}`,`brand-${active.slug}`]"><div class="product-story" :key="active.slug"><span class="product-wordmark">{{t(active.eyebrow)}}</span><h3>{{t(active.name)}}</h3><p>{{t(active.description)}}</p><div class="service-tags"><span v-for="s in active.services.slice(0,3)" :key="s">{{t(s)}}</span></div><RouterLink :to="active.slug==='shop'?'/shop':`/platforms/${active.slug}`" class="pill pill-dark">{{active.slug==='shop'?t('ورود به فروشگاه','Visit the shop'):t('ورود به دنیای','Discover')}} {{active.slug==='shop'?'':t(active.name)}} <ArrowUpLeft :size="19"/></RouterLink><span class="product-parent">{{t('عضوی از خانواده مهرگان پارس','PART OF THE MEHREGAN FAMILY')}}</span></div>
<div class="product-scene" :key="'scene-'+active.slug">
  <div class="scene-orbit"></div><div class="scene-orbit orbit-second"></div>
  <div class="floating-card progress-widget"><span class="widget-icon"><ShoppingBag v-if="active.slug==='shop'" :size="19"/><Activity v-else :size="19"/></span><div><b>{{active.slug==='shop'?t('ابزار مناسب برای مراقبت','Tools for everyday care'):t('همراه شما در مسیر','With you on your journey')}}</b><small>{{active.slug==='shop'?t('کمر، گردن و زانو','Back, neck and knee'):t('ارزیابی، برنامه‌ریزی، پیگیری','Assess, plan, follow up')}}</small></div><svg viewBox="0 0 150 40" aria-hidden="true"><path d="M0 30 Q20 30 27 21 T52 25 T78 13 T105 16 T150 4"/></svg></div>
  <div class="app-device" :class="{'shop-phone':active.slug==='shop'}">
    <div class="device-top"><span>9:41</span><span>••• ▰</span></div>
    <div class="app-brand"><PlatformIcon :name="active.icon" :size="29"/><b>{{t(active.name)}}</b></div>
    <span class="app-greeting">{{active.slug==='shop'?t('مراقبت، تا خانه شما','Care, all the way home'):t('سلام، به مسیر خودت خوش آمدی','Welcome to your care journey')}}</span>
    <h4>{{active.slug==='shop'?t('انتخاب بهتر،','Better choices,'):t('حال خوب،','Your wellbeing,')}}<br>{{active.slug==='shop'?t('برای حرکت بهتر','for better movement'):t('از همین‌جا','starts here')}}</h4>
    <div class="app-illustration"><PlatformIcon :name="active.icon" :size="58"/><span></span><span></span></div>
    <div class="app-visit" v-if="active.slug==='shop'"><span><ShoppingBag :size="17"/>{{t('پک‌های فیزیوتراپی','Physiotherapy kits')}}</span><b>{{t('پک کمر، گردن و زانو','Back, neck and knee kits')}}</b><RouterLink to="/shop">{{t('دیدن محصولات فروشگاه','Explore the shop')}}<ArrowLeft :size="15"/></RouterLink></div>
    <div class="app-visit" v-else><span><Video :size="17"/>{{t('ویزیت آنلاین','Online visit')}}</span><b>{{t('یک گفت‌وگو، یک شروع تازه','A conversation, a fresh start')}}</b><RouterLink :to="'/platforms/'+active.slug+'#booking'">{{t('انتخاب متخصص و زمان','Choose a specialist & time')}}<ArrowLeft :size="15"/></RouterLink></div>
    <div class="app-bottom"><span>⌂</span><ShoppingBag v-if="active.slug==='shop'" :size="18"/><CalendarDays v-else :size="18"/><Search v-if="active.slug==='shop'" :size="18"/><Activity v-else :size="18"/><span>◉</span></div>
  </div>
  <div class="floating-card appointment-widget"><span class="appointment-check"><Check :size="21"/></span><div><b>{{active.slug==='shop'?t('همراه تمرین‌های روزمره','Made for your daily routine'):t('مراقبت، با ریتم زندگی شما','Care that fits your life')}}</b><small>{{active.slug==='shop'?t('لوازم و پک‌های مراقبت در خانه','Supplies and kits for care at home'):t('انتخاب زمان دلخواه','Choose a time that works')}}</small></div></div>
</div></div>
</div></section>
<section class="wide editorial-mission"><div class="mission-photo"><img src="/images/mission-care-conversation.jpg" alt="گفت‌وگوی صمیمی متخصص و مراجعه‌کننده درباره مراقبت و سلامت روزمره" loading="lazy"/><span>{{t('از نزدیک. از راه دور. در کنار شما.','In person. At a distance. By your side.')}}</span></div><div class="mission-copy"><span class="editorial-eyebrow">{{t('دلیل کنار هم بودن ما','WHY WE COME TOGETHER')}}</span><h2>{{t('سلامت، بخشی','Care is part')}}<br>{{t('از زندگی است.','of living.')}}</h2><p>{{t('زندگی در یک تخصص خلاصه نمی‌شود. حرکت، تغذیه، سلامت روان و بازتوانی به هم پیوند دارند. مهرگان این مسیرها را کنار هم قرار می‌دهد تا انتخاب و ادامه مراقبت برای شما ساده‌تر شود.','Life doesn’t fit into a single specialty. Movement, nutrition, mental wellbeing and rehabilitation are connected. We bring these paths together to make finding and continuing your care simpler.')}}</p><RouterLink to="/about" class="editorial-link">{{t('داستان مهرگان','Our story')}} <ArrowUpLeft :size="21"/></RouterLink></div></section>
<section class="journal-section"><div class="wide"><div class="editorial-heading"><div><span class="editorial-eyebrow">{{t('مجله سلامت','THE HEALTH JOURNAL')}}</span><h2>{{t('برای بهتر زندگی کردن.','A little more life.')}}</h2></div><RouterLink to="/magazine" class="editorial-link">{{t('همه داستان‌ها','All stories')}} <ArrowUpLeft :size="20"/></RouterLink></div><div class="article-grid"><ArticleCard v-for="a in published.slice(0,3)" :key="a.id" :article="a"/></div></div></section>
<section class="red-invitation"><div class="wide"><span class="invitation-plus"><Plus :size="120" :stroke-width="1"/></span><div><span class="editorial-eyebrow">{{t('آینده سلامت را با هم می‌سازیم','LET’S SHAPE WHAT COMES NEXT')}}</span><h2>{{t('همراه مسیر ما باشید.','Let’s do good. Together.')}}</h2><p>{{t('پزشک، متخصص یا مجموعه‌ای هم‌مسیر هستید؟ گفت‌وگو را شروع کنیم.','A clinician, specialist or like-minded organisation? Let’s start a conversation.')}}</p></div><RouterLink to="/contact" class="pill pill-white">{{t('با هم شروع کنیم','Let’s connect')}}<ArrowUpLeft :size="20"/></RouterLink></div></section>
</div>
</template>


