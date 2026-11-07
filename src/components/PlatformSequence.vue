<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { ArrowUpLeft } from 'lucide-vue-next'
import { platforms } from '../data'
import { t } from '../i18n'

const services = platforms.filter(platform => platform.category === 'digital')
const photos: Record<string,string> = { physiopars:'home/step-training.webp', oncopars:'home/patient-support.webp', psychopars:'home/guided-breathing.webp', shop:'directory-shop.jpg' }
const track = ref<HTMLElement>()
const pinned = ref(false)
const active = ref(0)
const position = ref(0)
let frame = 0
const desktop = window.matchMedia('(min-width: 851px) and (min-height: 610px) and (prefers-reduced-motion: no-preference)')

function scrollSpan() { return (track.value?.offsetHeight || 0) - window.innerHeight }
function sync() {
  frame = 0
  pinned.value = desktop.matches
  if (!pinned.value || !track.value) return
  const progress = -track.value.getBoundingClientRect().top / Math.max(1,scrollSpan())
  position.value = Math.min(services.length-1, Math.max(0, progress*(services.length-1)))
  active.value = Math.round(position.value)
}
function schedule() { if (!frame) frame=requestAnimationFrame(sync) }
function show(index:number) {
  if (!pinned.value || !track.value) return
  const top = window.scrollY + track.value.getBoundingClientRect().top
  window.scrollTo({top:top + scrollSpan()*index/(services.length-1), behavior:'instant'})
  active.value=index
}
onMounted(() => {
  sync()
  window.addEventListener('scroll',schedule,{passive:true})
  window.addEventListener('resize',schedule)
  desktop.addEventListener('change',schedule)
})
onUnmounted(() => {
  window.removeEventListener('scroll',schedule)
  window.removeEventListener('resize',schedule)
  desktop.removeEventListener('change',schedule)
  cancelAnimationFrame(frame)
})
</script>
<template>
<section ref="track" class="platform-track" :aria-label="t('خدمات آنلاین','Online care')">
  <div class="platform-pin"><div class="platform-deck">
    <article v-for="(service,i) in services" :key="service.slug" :style="{'--open': pinned ? Math.max(0,1-Math.abs(position-i)) : 1}">
      <h3><button v-if="pinned" :aria-expanded="active===i" :aria-controls="'service-'+service.slug" @click="show(i)">{{t(service.name)}}</button><span v-else>{{t(service.name)}}</span></h3>
      <div :id="'service-'+service.slug" class="service-details" :inert="pinned && active!==i">
        <small>{{t('کشف کنید','Discover')}}</small>
        <p>{{t(service.description)}}</p>
        <RouterLink :to="service.slug==='shop'?'/shop':'/platforms/'+service.slug">{{t(service.name)}} <ArrowUpLeft :size="17"/></RouterLink>
      </div>
      <img :src="'/images/'+photos[service.slug]" alt="" loading="lazy"/>
    </article>
  </div></div>
</section>
</template>
<style scoped>
.platform-track {background:#082f28;color:white;padding-block:4vw}
.platform-deck {width:min(88%,1440px);margin:auto}
article {position:relative;display:flex;flex-direction:column;align-items:flex-start;isolation:isolate;overflow:hidden;border-radius:8px;background:#104735;padding:24px;min-height:clamp(522px,82vw,688px);justify-content:flex-end;color:white}
article + article {margin-top:24px}
article::before {content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;background:linear-gradient(to top,#06231ef5 0%,#06231ebe 34%,transparent 80%)}
h3 {color:inherit;font-size:clamp(30px,3.8vw,66px);line-height:1.16;margin:0}
h3 button {font:inherit;color:inherit;text-align:start;border:0;padding:0;background:none;cursor:pointer}
.service-details small {display:block;margin-top:16px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.service-details p {font-size:clamp(17px,1.55vw,26px);line-height:1.45;max-width:32ch;margin:10px 0 20px}
.service-details a {display:inline-flex;align-items:center;gap:12px;padding:10px 20px;background:white;color:#153e30;border-radius:100px;font-weight:650}
article img {position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
@media(min-width:851px) and (min-height:610px) and (prefers-reduced-motion:no-preference){
 .platform-track {height:440svh;padding:0;position:relative}
 .platform-pin {position:sticky;top:0;height:100svh;display:grid;align-items:center}
 article {min-height:0;--tab:clamp(60px,9vh,108px);height:calc(var(--tab) + var(--open) * 59svh);padding:0 3.6vw;justify-content:center;box-sizing:border-box}
 article + article {margin-top:-8px}
 h3 {position:absolute;inset-inline-start:3.6vw;top:calc(var(--tab) * .5 + var(--open) * 3svh);transform:translateY(-45%);font-size:clamp(26px,3.7vw,64px)}
 .service-details {width:44%;margin-top:5svh;opacity:var(--open)}
 article::before {background:linear-gradient(var(--shade-direction,to left),#06231ef5 2%,#06231ebf 40%,#06231e21 82%)}
 article:dir(ltr) {--shade-direction:to right}
}
</style>
