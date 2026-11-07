<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ArrowUpLeft, Plus } from 'lucide-vue-next'
import { platforms } from '../data'
import { t, language } from '../i18n'
import { useArticles } from '../store'
import PlatformIcon from '../components/PlatformIcon.vue'
import PlatformSequence from '../components/PlatformSequence.vue'
import ArticleCard from '../components/ArticleCard.vue'
const {published}=useArticles()
const railItems=[
  {slug:'health-center',label:'پلتفرم سلامت',en:'Health platform'},
  {slug:'physiopars',label:'فیزیوتراپی',en:'Physiotherapy'},
  {slug:'hydrotherapy',label:'آب‌درمانی',en:'Hydrotherapy'},
  {slug:'shop',label:'فروشگاه',en:'Shop'},
]
const modes = [
  { label:'خدمات حضوری', en:'In-person', title:'در مجتمع سلامت مهرگان', heading:'At the health centre',
    text:'برای ارزیابی حرکت، فیزیوتراپی و آب‌درمانی به مجتمع سلامت مهرگان مراجعه کنید.',
    copy:'Visit Mehregan Health Centre for movement assessment, physiotherapy and hydrotherapy.',
    image:'shoulder-evaluation.webp', alt:'ارزیابی حرکت شانه', altEn:'Assessing shoulder movement', altAr:'تقييم حركة الكتف',
    path:'/platforms/health-center' },
  { label:'خدمات آنلاین', en:'Online', title:'فیزیوپارس در خانه', heading:'Physiopars at home',
    text:'با فیزیوپارس، مسیرهای مراقبت از کمر و زانو و فیزیوتراپی از راه دور را بررسی کنید.',
    copy:'Explore back and knee care programmes and remote physiotherapy through Physiopars.',
    image:'video-consultation.webp', alt:'متخصص در جلسهٔ آنلاین', altEn:'A clinician during a virtual visit', altAr:'اختصاصي خلال استشارة عبر الإنترنت',
    path:'/platforms/physiopars' },
]
const selected=ref(0)
async function navigateMode(event:KeyboardEvent){
 const direction=language.value==='en'?1:-1
 let index=selected.value
 if(event.key==='Home')index=0
 else if(event.key==='End')index=modes.length-1
 else if(event.key==='ArrowDown')index++
 else if(event.key==='ArrowUp')index--
 else if(event.key==='ArrowRight')index+=direction
 else if(event.key==='ArrowLeft')index-=direction
 else return
 event.preventDefault()
 selected.value=(index+modes.length)%modes.length
 await nextTick()
 document.getElementById('mode-tab-'+selected.value)?.focus()
}
</script>
<template>
<div class="holding-home home-editorial">

<section class="campaign-hero"><img class="campaign-photo" src="/images/home/band-training.webp" :alt="language==='ar' ? 'تمرين للكتفين باستخدام شريط مقاومة' : t('تمرین شانه با کش مقاومتی','A shoulder exercise with a resistance band')" fetchpriority="high" width="1920" height="1080"/><div class="campaign-shade"></div><div class="wide campaign-content"><span class="editorial-eyebrow">{{t('این‌جا، زندگی جریان دارد','HERE’S TO LIVING WELL')}}</span><h1>{{t('کنار شما،','By your side,')}}<br><span>{{t('برای روزهای بهتر','for better days')}}</span></h1><p>{{t('از حرکت و آب‌درمانی تا آرامش ذهن؛ در مهرگان، مراقبت متناسب با زندگی شماست','From movement and hydrotherapy to mental wellbeing, care at Mehregan fits your life')}}</p><a href="#ecosystem" class="pill pill-red">{{t('دنیای مهرگان را کشف کنید','Explore our world')}}<ArrowUpLeft :size="19"/></a></div><span class="hero-side-label">{{t('خانواده سلامت مهرگان','THE MEHREGAN FAMILY')}}</span></section>
<nav class="brand-rail wide" :aria-label="t('مسیرهای مراقبت','Care paths')">
  <div><RouterLink v-for="item in railItems" :key="item.slug" :class="'brand-'+item.slug"
    :to="item.slug==='hydrotherapy'?'/platforms/hydrotherapy':'/#ecosystem'" @click="selected=item.slug==='health-center'?0:1">
    <PlatformIcon :name="platforms.find(platform=>platform.slug===item.slug)?.icon||'heart'" :size="23"/>
    <b>{{t(item.label,item.en)}}</b>
  </RouterLink></div>
</nav>
<section id="ecosystem" class="care-modes">
  <div class="wide">
    <div class="family-introduction">
      <span class="editorial-eyebrow">{{t('خانواده سلامت مهرگان','THE MEHREGAN FAMILY')}}</span>
      <p>{{t('مهرگان، مراقبت حضوری در مرکز و توانبخشی آنلاین را کنار هم آورده است.','Mehregan brings care at the centre and online rehabilitation together.')}}</p>
    </div>
    <div class="care-selector">
    <div class="mode-choices"><h2>{{t('چطور از خدمات مهرگان استفاده کنم؟','How can I access care?')}}</h2>
    <div class="mode-tabs" role="tablist" aria-orientation="vertical" :aria-label="t('مسیرهای مراقبت','Care paths')">
      <button v-for="(mode,i) in modes" :key="mode.path" :id="'mode-tab-'+i" role="tab"
        :aria-selected="selected===i" aria-controls="mode-panel" :tabindex="selected===i?0:-1"
        @click="selected=i" @keydown="navigateMode">{{t(mode.label,mode.en)}}</button>
    </div>
    </div>
    <div id="mode-panel" class="mode-panel" role="tabpanel" :aria-labelledby="'mode-tab-'+selected">
      <div class="mode-photo">
        <img v-for="(mode,i) in modes" :key="mode.image" :src="'/images/home/'+mode.image" :alt="language==='ar' ? mode.altAr : t(mode.alt,mode.altEn)"
          :aria-hidden="selected!==i" :class="{visible:selected===i}" loading="lazy"/>
      </div>
      <div class="mode-stories">
        <div v-for="(mode,i) in modes" :key="mode.path" class="mode-story" :class="{visible:selected===i}" :inert="selected!==i">
          <h3>{{t(mode.title,mode.heading)}}</h3><p>{{t(mode.text,mode.copy)}}</p>
        </div>
      </div>
    </div>
    </div>
  </div>
</section>
<section class="care-quote">
  <div class="wide">
    <span class="editorial-eyebrow">{{t('مسیرهای مراقبت','Care paths')}}</span>
    <h2>{{t('کنار شما،','By your side,')}}<br>{{t('برای روزهای بهتر','for better days')}}</h2>
    <p>{{t('حرکت، تغذیه و سلامت روان در خانوادهٔ مهرگان به هم می‌رسند.','Movement, nutrition and mental health come together in the Mehregan family.')}}</p>
  </div>
</section>
<PlatformSequence/>
<section class="care-experience">
  <div class="wide experience-head">
    <span class="editorial-eyebrow">{{t('درباره مهرگان','ABOUT MEHREGAN')}}</span>
    <div><h2>{{t('سلامت، بخشی از زندگی','Care is part of living')}}</h2>
    <p>{{t('در صفحهٔ هر خدمت، با متخصصان آشنا شوید و زمان‌های در دسترس را ببینید. سپس متخصص و زمان مناسب خود را انتخاب کنید.','On each care page, meet the specialists and see available appointments. Choose the person and time that suit you.')}}</p></div>
  </div>
  <div class="experience-gallery"><img src="/images/home/knee-consultation.webp" :alt="language==='ar' ? 'طبيب يشرح مفصل الركبة للمريض' : t('پزشک با مدل زانو برای بیمار توضیح می‌دهد','A doctor explains the knee joint to a patient')" loading="lazy"/>
    <RouterLink to="/about">{{t('داستان مهرگان','Our story')}} <ArrowUpLeft :size="20"/></RouterLink>
    </div>
</section>
<section class="journal-section"><div class="wide"><div class="editorial-heading"><div><span class="editorial-eyebrow">{{t('مجله سلامت','THE HEALTH JOURNAL')}}</span><h2>{{t('برای بهتر زندگی کردن.','A little more life.')}}</h2></div><RouterLink to="/magazine" class="editorial-link">{{t('همهٔ مقاله‌ها','All articles')}} <ArrowUpLeft :size="20"/></RouterLink></div><div class="article-grid"><ArticleCard v-for="a in published.slice(0,3)" :key="a.id" :article="a"/></div></div></section>
<section class="red-invitation"><div class="wide"><span class="invitation-plus"><Plus :size="120" :stroke-width="1"/></span><div><span class="editorial-eyebrow">{{t('آینده سلامت را با هم می‌سازیم','LET’S SHAPE WHAT COMES NEXT')}}</span><h2>{{t('همراه مسیر ما باشید.','Let’s do good. Together.')}}</h2><p>{{t('پزشک، متخصص یا مجموعه‌ای هم‌مسیر هستید؟ گفت‌وگو را شروع کنیم.','A clinician, specialist or like-minded organisation? Let’s start a conversation.')}}</p></div><RouterLink to="/contact" class="pill pill-white">{{t('با هم شروع کنیم','Let’s connect')}}<ArrowUpLeft :size="20"/></RouterLink></div></section>
</div>
</template>



<style scoped src="./home-editorial.css"></style>


