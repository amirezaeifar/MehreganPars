<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, X, Search, ArrowUpLeft, ArrowLeft, HeartPulse, Mail, Building2, Stethoscope, BookOpenText } from 'lucide-vue-next'
import { platforms } from './data'
import { t, language } from './i18n'
import { useArticles } from './store'
import SlidingIndicator from './components/SlidingIndicator.vue'
import LanguageButton from './components/LanguageButton.vue'
const route=useRoute(), opened=ref(''), mobile=ref(false), search=ref('')
const { published } = useArticles()
const corporate=computed(()=>route.path!=='/shop'&&!route.path.startsWith('/admin')&&!/^\/platforms\/[^/]+$/.test(route.path))
const groups=computed(()=>[{id:'brands',label:t('دنیای مهرگان','Our brands'),path:'/platforms'},{id:'stories',label:t('مجله سلامت','Health journal'),path:'/magazine'}])
const categories=computed(()=>[...new Set(published.value.map(article=>article.category))])
const normalizedSearch=computed(()=>search.value.trim().toLocaleLowerCase())
const results=computed(()=>normalizedSearch.value ? platforms.filter(p=>`${t(p.name)} ${t(p.eyebrow)} ${t(p.description)} ${p.services.map(s=>t(s)).join(' ')}`.toLocaleLowerCase().includes(normalizedSearch.value)) : [])
const articleResults=computed(()=>normalizedSearch.value ? published.value.filter(a=>`${t(a.title)} ${t(a.excerpt)} ${t(a.category)}`.toLocaleLowerCase().includes(normalizedSearch.value)).slice(0,4) : [])
watch(()=>route.fullPath,()=>{opened.value='';mobile.value=false;search.value=''})
function toggle(id:string){opened.value=opened.value===id?'':id;if(id==='search'&&opened.value)nextTick(()=>document.querySelector<HTMLInputElement>('.global-search input')?.focus())}
let revealObserver: IntersectionObserver | undefined
let textObserver: MutationObserver | undefined
function normalizeHeadings() {
  document.querySelectorAll('.site-shell h1, .site-shell h2, .site-shell h3, .site-shell h4, .site-shell h5, .site-shell h6').forEach(heading => {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT)
    let node: Node | null
    while ((node = walker.nextNode())) {
      const text = node.textContent || ''
      const clean = text.replace(/[.۔]+(?=\s|$)/g, '')
      if (text !== clean) node.textContent = clean
    }
  })
}
function revealSections(){
  if(typeof IntersectionObserver==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return
  revealObserver?.disconnect()
  revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('revealed');revealObserver?.unobserve(entry.target)}
  }),{threshold:.09,rootMargin:'0px 0px -35px 0px'})
  document.querySelectorAll('main .editorial-heading, main .editorial-mission, main .journal-section .article-card, main .contact-grid > *, main .brand-services article, main .doctor-card, main .values-grid > *, main .article-body, main .brand-service-card, main .journey-strip, main .family-card').forEach(element=>{
    element.classList.add('reveal-ready');revealObserver?.observe(element)
  })
}
onMounted(()=>nextTick(()=>{revealSections();normalizeHeadings();textObserver=new MutationObserver(()=>normalizeHeadings());textObserver.observe(document.querySelector('.site-shell')!,{subtree:true,childList:true,characterData:true})}))
watch(()=>route.fullPath,()=>nextTick(()=>{revealSections();normalizeHeadings()}))
watch(language,()=>nextTick(normalizeHeadings))
onUnmounted(()=>{revealObserver?.disconnect();textObserver?.disconnect()})

</script>
<template>
<div class="site-shell" :class="{english:language==='en','corporate-site':corporate}">
<header v-if="corporate" class="global-header" @keydown.esc="opened='';mobile=false" @mouseleave="opened=''">
 <div class="global-bar"><RouterLink to="/" class="wordmark" :aria-label="t('صفحه اصلی مهرگان','Mehregan home')"><img class="wordmark-icon" src="/images/icon.png" alt="" width="42" height="42"/><b>{{t('مهرگان پارس','Mehregan Pars')}}</b></RouterLink><nav class="global-links" :aria-label="t('منوی اصلی','Main navigation')"><RouterLink to="/" @mouseenter="opened=''">{{t('خانه','Home')}}</RouterLink><RouterLink v-for="g in groups" :key="g.id" :to="g.path" :aria-expanded="opened===g.id" :aria-controls="'menu-'+g.id" @mouseenter="opened=g.id">{{g.label}}</RouterLink><RouterLink to="/about" @mouseenter="opened=''">{{t('درباره ما','About us')}}</RouterLink><RouterLink to="/contact" @mouseenter="opened=''">{{t('ارتباط با ما','Contact us')}}</RouterLink><SlidingIndicator :active-key="route.path" selector=".router-link-exact-active, a.router-link-active:not([href='/'])"/></nav><div class="global-tools"><LanguageButton/><button class="nav-icon" @click="toggle('search')" :aria-expanded="opened==='search'" :aria-label="t('جست‌وجو','Search')"><Search :size="18"/></button><button class="mobile-menu nav-icon" @click="mobile=!mobile;opened=''" :aria-expanded="mobile" :aria-label="t('منوی اصلی','Main navigation')"><X v-if="mobile" :size="20"/><Menu v-else :size="20"/></button></div></div>
 <div v-if="mobile" class="mobile-global"><RouterLink to="/">{{t('خانه','Home')}}</RouterLink><RouterLink v-for="g in groups" :key="g.id" :to="g.path">{{g.label}}</RouterLink><RouterLink to="/about">{{t('درباره ما','About us')}}</RouterLink><RouterLink to="/contact">{{t('ارتباط با ما','Contact us')}}</RouterLink></div>
 <Transition name="mega"><section v-if="opened" :id="'menu-'+opened" class="mega-panel"><div class="mega-inner">
 <template v-if="opened==='brands'"><div class="mega-primary"><span>{{t('یک خانواده، برای حال بهتر','One family. Better wellbeing.')}}</span><RouterLink to="/platforms">{{t('دنیای مهرگان را کشف کنید','Meet the Mehregan family')}} <ArrowUpLeft :size="24"/></RouterLink><p>{{t('از مراقبت حضوری تا همراهی دیجیتال؛ مسیر خودتان را پیدا کنید.','From in-person care to digital support. Find your way forward.')}}</p></div><div class="mega-brand-list"><RouterLink v-for="p in platforms" :key="p.slug" :to="`/platforms/${p.slug}`"><strong>{{t(p.name)}}</strong><small>{{t(p.eyebrow)}}</small></RouterLink></div><div class="mega-aside"><span>{{t('قدم بعدی شما','Your next step')}}</span><RouterLink to="/platforms/health-center#booking">{{t('دریافت نوبت','Book an appointment')}}</RouterLink><RouterLink to="/contact">{{t('همکاری با مهرگان','Partner with us')}}</RouterLink></div></template>
 <template v-else-if="opened==='search'"><div class="global-search"><div class="search-top"><span>{{t('در دنیای مهرگان جست‌وجو کنید','Search the Mehregan world')}}</span><small>{{t('خدمات، پلتفرم‌ها و مقاله‌ها','Services, brands and stories')}}</small></div><label class="search-input"><Search :size="23"/><input v-model="search" :placeholder="t('مثلاً فیزیوتراپی، تغذیه یا سلامت روان','Try physiotherapy, nutrition or mental wellbeing')" :aria-label="t('جست‌وجو','Search')"/><button v-if="search" type="button" @click="search=''" :aria-label="t('پاک کردن جست‌وجو','Clear search')"><X :size="17"/></button></label><div v-if="!normalizedSearch" class="search-suggestions"><span>{{t('پیشنهاد برای شروع','Popular searches')}}</span><button v-for="term in ['فیزیوتراپی','سلامت روان','تغذیه']" :key="term" @click="search=t(term)">{{t(term)}} <ArrowUpLeft :size="14"/></button></div><div v-else class="search-results"><div v-if="results.length"><span class="search-result-heading"><HeartPulse :size="17"/>{{t('خدمات و برندها','Services & brands')}}</span><RouterLink v-for="p in results" :key="p.slug" :to="`/platforms/${p.slug}`"><span><strong>{{t(p.name)}}</strong><small>{{t(p.eyebrow)}}</small></span><ArrowUpLeft :size="18"/></RouterLink></div><div v-if="articleResults.length"><span class="search-result-heading"><BookOpenText :size="17"/>{{t('از مجله سلامت','From the health journal')}}</span><RouterLink v-for="a in articleResults" :key="a.id" :to="`/magazine/${a.slug}`"><span><strong>{{t(a.title)}}</strong><small>{{t(a.category)}}</small></span><ArrowUpLeft :size="18"/></RouterLink></div><p v-if="!results.length&&!articleResults.length">{{t('نتیجه‌ای پیدا نشد. عبارت دیگری امتحان کنید.','No results found. Try a different term.')}}</p></div></div></template>
 <template v-else-if="opened==='stories'"><div class="mega-primary"><span>{{t('داستان‌ها و دانستنی‌ها','Stories & ideas')}}</span><RouterLink to="/magazine">{{t('مجله سلامت مهرگان','The health journal')}} <ArrowUpLeft :size="25"/></RouterLink><p>{{t('مطالب کاربردی درباره حرکت، بازتوانی، ذهن و تغذیه.','Useful reading about movement, recovery, mind and nutrition.')}}</p></div><div class="mega-brand-list magazine-mega-categories"><RouterLink v-for="category in categories" :key="category" :to="{path:'/magazine',query:{category}}"><strong>{{t(category)}}</strong><small>{{t('مشاهده مقاله‌ها','Browse articles')}}</small></RouterLink></div><div class="mega-aside"><span>{{t('مجله سلامت','Health journal')}}</span><RouterLink to="/magazine">{{t('همه مطالب','All stories')}}</RouterLink></div></template>
 <button class="mega-close nav-icon" @click="opened=''" :aria-label="t('بستن منو','Close menu')"><X :size="20"/></button></div></section></Transition>
</header>

<div v-if="opened&&corporate" class="menu-scrim" @click="opened=''" aria-hidden="true"></div>
<component :is="route.path==='/shop'?'div':'main'"><RouterView v-slot="{ Component }"><Transition name="page" mode="out-in" @after-enter="revealSections"><component :is="Component" :key="route.path" /></Transition></RouterView></component>
<footer v-if="corporate" class="editorial-footer"><div class="wide footer-upper"><div class="footer-about"><RouterLink to="/" class="footer-wordmark">{{t('مهرگان','mehregan')}}</RouterLink><p>{{t('شش مسیر سلامت و مراقبت، برای همراهی در زندگی روزمره','Six paths to health and care for everyday life')}}</p><RouterLink to="/contact" class="footer-cta">{{t('گفت‌وگو را شروع کنیم','Start a conversation')}} <ArrowUpLeft :size="17"/></RouterLink></div><div><span>{{t('مهرگان پارس','Mehregan Pars')}}</span><RouterLink to="/about">{{t('درباره ما','About us')}}</RouterLink><RouterLink to="/magazine">{{t('مجله سلامت','Health journal')}}</RouterLink><RouterLink to="/contact">{{t('ارتباط با ما','Contact us')}}</RouterLink><RouterLink to="/admin">{{t('پنل مدیریت','Administration')}}</RouterLink></div><div><span>{{t('پلتفرم‌ها','Our brands')}}</span><RouterLink v-for="p in platforms" :key="p.slug" :to="`/platforms/${p.slug}`">{{t(p.name)}}</RouterLink></div><div class="footer-contact"><span>{{t('راه‌های ارتباطی','Get in touch')}}</span><RouterLink to="/contact?audience=general"><Mail :size="16"/>{{t('ارسال پیام','Send a message')}}</RouterLink><RouterLink to="/contact?audience=doctor"><Stethoscope :size="16"/>{{t('معرفی پزشک یا متخصص','Clinicians & specialists')}}</RouterLink><RouterLink to="/contact?audience=organization"><Building2 :size="16"/>{{t('همکاری سازمانی','Organisation partnerships')}}</RouterLink><p>{{t('از مسیر مناسب، پیام خود را ثبت کنید؛ درخواست شما در پنل مهرگان دریافت می‌شود.','Choose the right form. Your message will reach the Mehregan team inbox.')}}</p></div></div><div class="wide footer-base"><span>© {{t('گروه سلامت مهرگان پارس','Mehregan Pars Health Group')}}</span><span>{{ t("مراقبت، پیوسته.") }}</span></div></footer>
</div>
</template>


