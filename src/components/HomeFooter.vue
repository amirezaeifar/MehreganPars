<script setup lang="ts">
import { ArrowUpLeft } from 'lucide-vue-next'
import { platforms } from '../data'
import { t } from '../i18n'
import LanguageButton from './LanguageButton.vue'
</script>
<template>
<footer class="home-footer">
 <div class="wide">
  <div class="footer-navigation">
   <div><h2>{{t('خدمات و برندها','Services and brands')}}</h2><RouterLink v-for="p in platforms" :key="p.slug" :to="p.slug==='shop'?'/shop':'/platforms/'+p.slug">{{t(p.name)}}</RouterLink></div>
   <div><h2>{{t('درباره مهرگان','About Mehregan')}}</h2><RouterLink to="/about">{{t('داستان مهرگان','Our story')}}</RouterLink><RouterLink to="/magazine">{{t('مجله سلامت','Health journal')}}</RouterLink></div>
   <div><h2><RouterLink to="/contact">{{t('ارتباط با ما','Contact us')}}</RouterLink></h2><RouterLink to="/contact?audience=doctor">{{t('معرفی پزشک یا متخصص','Clinicians & specialists')}}</RouterLink><RouterLink to="/contact?audience=organization">{{t('همکاری سازمانی','Organisation partnerships')}}</RouterLink></div>
   <div class="footer-actions"><RouterLink to="/contact?audience=general">{{t('ارسال پیام','Send a message')}} <ArrowUpLeft :size="16"/></RouterLink><RouterLink to="/platforms">{{t('مسیرهای مراقبت','Care paths')}}</RouterLink></div>
  </div>
  <RouterLink to="/" class="footer-signature"><img src="/images/icon.png" width="256" height="256" alt=""/><b>{{t('مهرگان پارس','Mehregan Pars')}}</b></RouterLink>
  <div class="footer-utility"><small>© {{t('گروه سلامت مهرگان پارس','Mehregan Pars Health Group')}}</small><RouterLink to="/admin">{{t('پنل مدیریت','Administration')}}</RouterLink><LanguageButton public-menu/></div>
 </div>
</footer>
</template>
<style scoped>
.home-footer {background:#bfd6c6;color:#123d2d;position:relative;isolation:isolate;padding:clamp(50px,7vw,104px) 0 22px}
.home-footer::before {content:"";position:absolute;inset:0;z-index:-1;background:url('/images/mehregan-arches.svg') center/cover;opacity:.48;pointer-events:none}
.footer-navigation {display:grid;grid-template-columns:1fr .9fr 1fr 1.4fr;gap:clamp(18px,3vw,54px)}
.footer-navigation h2 {font-size:17px;margin:0 0 20px}
.home-footer a {color:inherit}
.footer-navigation>div>a {display:table;font-size:15px;margin-bottom:10px}
.home-footer a:not(.footer-signature):hover {text-decoration:underline;text-underline-offset:4px}
.footer-actions {display:flex;gap:10px;justify-content:flex-end;align-items:flex-start;flex-wrap:wrap}
.footer-actions>a {border:1px solid #174936;border-radius:8px;padding:13px 16px}
.footer-navigation .footer-actions>a:first-child {display:inline-flex;align-items:center;gap:6px;background:#123f30;color:white}
.footer-signature {display:flex;align-items:center;justify-content:center;gap:2vw;min-height:27vw;margin:5vw 0 3vw}
.home-footer .footer-signature {color:inherit;text-decoration:none}
.footer-signature img {width:clamp(64px,15vw,235px);height:auto;filter:brightness(0) saturate(100%) invert(20%) sepia(38%) saturate(698%) hue-rotate(101deg)}
.footer-signature b {font-size:clamp(46px,11vw,175px);letter-spacing:-.065em;line-height:1.2}
.footer-utility {border-top:1px solid #779987;padding-top:16px;display:flex;align-items:center;gap:20px;font-size:13px}
.footer-utility small {margin-inline-end:auto}
.footer-utility :deep(.locale-options){bottom:100%;top:auto}
@media(max-width:760px){
 .footer-navigation {grid-template-columns:1fr 1fr;gap:26px 16px}
 .footer-actions {align-content:flex-start;justify-content:start}
 .footer-signature {margin:50px 0}
 .footer-utility {flex-wrap:wrap;gap:12px}
}
</style>