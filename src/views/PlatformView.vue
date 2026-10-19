<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, ArrowUpLeft, CalendarDays, UserRound, Check } from 'lucide-vue-next'
import { platforms } from '../data'
import { state } from '../operations'
import { platformStories } from '../platformStories'
import { platformDetails } from '../platformDetails'
import PlatformIcon from '../components/PlatformIcon.vue'
import DoctorAvatar from '../components/DoctorAvatar.vue'
import BookingFlow from '../components/BookingFlow.vue'
import { t, language } from '../i18n'
import LanguageButton from '../components/LanguageButton.vue'
import { detailText } from '../platformEnglish'
const route=useRoute()
const platform=computed(()=>platforms.find(p=>p.slug===route.params.slug))
const story=computed(()=>platform.value?platformStories[platform.value.slug]:undefined)
const detail=computed(()=>platform.value?platformDetails[platform.value.slug]:undefined)
const doctors=computed(()=>state.doctors.filter(d=>d.platform===platform.value?.slug&&d.active))
const selectedDoctor=ref(''),doctorRequest=ref(0)
function chooseDoctor(id:string){selectedDoctor.value=id;doctorRequest.value++}
</script>
<template>
<div v-if="platform&&story&&detail" :class="['brand-site',`brand-${platform.slug}`,{english:language==='en'}]">
 <div class="holding-ribbon"><div class="container"><RouterLink to="/">{{ t("عضوی از خانواده مهرگان پارس") }}<ArrowUpLeft :size="13"/></RouterLink><span>{{ t("تخصصی در مراقبت، نزدیک به زندگی") }}</span></div></div>
 <header class="brand-header container"><RouterLink :to="`/platforms/${platform.slug}`" class="brand"><span class="subbrand-mark"><PlatformIcon :name="platform.icon" :size="27"/></span><span class="brand-copy"><strong>{{t(platform.name)}}</strong><small>{{t(platform.eyebrow)}}</small></span></RouterLink><nav aria-label="منوی مجموعه"><a href="#services">{{t('خدمات ما','Our services')}}</a><a href="#doctors">{{t('متخصصان','Specialists')}}</a><RouterLink :to="`/platforms/${platform.slug}/overview`">{{t('درباره مجموعه','About')}}</RouterLink></nav><LanguageButton/></header>
 <section class="brand-hero container"><div class="brand-hero-copy"><span class="brand-eyebrow">{{t(...story.note)}}</span><h1>{{detailText(platform.slug,'headline',detail.headline)}}</h1><p>{{detailText(platform.slug,'intro',detail.intro)}}</p><a href="#booking" class="button brand-button">{{ t("یک شروع، با همراهی متخصص") }}<ArrowLeft :size="18"/></a><div class="brand-assurance"><CalendarDays :size="18"/><span>{{ t("متخصص، روز و ساعت را خودتان انتخاب کنید.") }}</span></div></div><figure class="brand-photo"><img :src="detail.hero" :alt="detailText(platform.slug,'heroAlt',detail.heroAlt)" fetchpriority="high"/><figcaption><span>{{t(platform.eyebrow)}}</span><strong>{{detailText(platform.slug,'caption',detail.caption)}}</strong></figcaption></figure></section>
 <div class="brand-beliefs container"><span><Check :size="17"/>{{ t("توجه به نیازهای فردی") }}</span><span><Check :size="17"/>{{ t("گفت‌وگوی روشن با متخصص") }}</span><span><Check :size="17"/>{{ t("همراهی در ادامه مسیر") }}</span></div>
 <section id="services" class="brand-section container"><div class="brand-section-title service-section-heading"><div><span>{{ t("خدمات ") }}{{t(platform.name)}}</span><h2>{{ t("از نیاز شما، تا مسیر مراقبت") }}</h2></div><p>{{detailText(platform.slug,'serviceIntro',detail.serviceIntro)}}</p></div><div class="brand-service-list"><article v-for="(service,i) in platform.services" :key="service" class="brand-service-card"><div class="service-card-heading"><span class="service-icon"><PlatformIcon :name="['activity','heart','flower','leaf'][i%4]" :size="25"/></span><h3>{{t(service)}}</h3></div><p>{{t(...story.services[i])}}</p><span class="service-outcome">{{detailText(platform.slug,'serviceNotes',detail.serviceNotes[i]||detail.serviceNotes[0],i)}}</span><a href="#booking" @click="chooseDoctor(doctors[i%doctors.length]?.id||'')">{{ t("انتخاب متخصص و زمان") }}<ArrowLeft :size="17"/></a></article></div></section>
 <section class="brand-care-note"><div class="container"><span>{{ t("رویکرد ما در ") }}{{t(platform.name)}}</span><h2>{{detailText(platform.slug,'careTitle',detail.careTitle)}}</h2><p>{{detailText(platform.slug,'careText',detail.careText)}}</p></div></section>
 <section id="doctors" class="brand-section container"><div class="brand-section-title"><span>{{ t("آشنایی پیش از ملاقات") }}</span><h2>{{ t("همراهان مسیر شما") }}</h2><p>{{ t("با حوزه فعالیت هر متخصص آشنا شوید و زمان‌های در دسترس او را ببینید.") }}</p></div><div class="brand-doctor-grid"><article v-for="d in doctors" :key="d.id" class="doctor-card"><div class="doctor-profile-top"><DoctorAvatar :doctor="d"/><span class="doctor-available">{{ t("پذیرش مراجع") }}</span></div><h3>{{t(d.name)}}</h3><span class="doctor-specialty">{{t(d.specialty)}}</span><p>{{t(d.bio)}}</p><a href="#booking" @click="chooseDoctor(d.id)">{{ t("مشاهده زمان‌های متخصص") }}<ArrowLeft :size="16"/></a></article></div><p v-if="!doctors.length">{{ t("در حال حاضر متخصص فعالی معرفی نشده است.") }}</p></section>
 <section id="booking" class="booking-section"><div class="container booking-layout"><div class="brand-section-title booking-intro"><span>{{ t("یک قدم نزدیک‌تر به حال خوب") }}</span><h2>{{ t("زمانی برای ") }}<br>{{ t("سلامت شما.") }}</h2><p>{{ t("با انتخاب یک متخصص شروع کنید. زمان‌های آزاد را ببینید و در چند قدم، قرار بعدی خود را ثبت کنید.") }}</p><div class="booking-reassurance"><CalendarDays :size="24"/><strong>{{ t("برنامه‌ای هماهنگ با شما") }}</strong><p>{{ t("جزئیات جلسه و هزینه را پیش از ثبت نهایی می‌بینید. پس از ثبت نیز کد پیگیری نوبت در اختیارتان قرار می‌گیرد.") }}</p></div></div><div class="booking-card"><BookingFlow :platform="platform.slug" :preferred-doctor="selectedDoctor" :request="doctorRequest"/></div></div></section>
 <section class="container brand-section journey-strip"><span class="brand-eyebrow">{{ t("قرار ما فقط یک زمان نیست") }}</span><h2>{{ t("پیش از ملاقات، تا قدم بعدی") }}</h2><div><p><b>{{ t("با آمادگی شروع کنید") }}</b>{{ t("پرسش‌ها، سوابق مرتبط و انتظارتان از جلسه را یادداشت کنید تا گفت‌وگو دقیق‌تر پیش برود.") }}</p><p><b>{{ t("از خودتان بگویید") }}</b>{{ t("شرایط روزمره و هدف‌های خود را با متخصص در میان بگذارید؛ مراقبت از شناخت شما آغاز می‌شود.") }}</p><p><b>{{ t("مسیر را پیگیری کنید") }}</b>{{ t("درباره قدم بعدی، زمان پیگیری و پرسش‌هایی که پس از جلسه دارید با متخصص هماهنگ شوید.") }}</p></div></section>
 <footer class="brand-footer-new"><div class="container brand-footer-grid"><div><PlatformIcon :name="platform.icon" :size="34"/><h2>{{t(platform.name)}}</h2><p>{{t(platform.description)}}</p><small>{{ t("عضوی از خانواده سلامت مهرگان پارس") }}</small></div><nav aria-label="دسترسی‌های مجموعه"><strong>{{ t("در کنار شما") }}</strong><a href="#services">{{ t("خدمات و مسیرهای مراقبت") }}</a><a href="#doctors">{{ t("آشنایی با متخصصان") }}</a><a href="#booking">{{ t("انتخاب زمان ملاقات") }}</a></nav><nav aria-label="ارتباط با مجموعه"><strong>{{ t("بیشتر آشنا شویم") }}</strong><RouterLink :to="`/platforms/${platform.slug}/overview`">{{ t("درباره ") }}{{t(platform.name)}}</RouterLink><RouterLink to="/contact">{{ t("ارتباط با مهرگان") }}</RouterLink><RouterLink :to="`/admin/platforms/${platform.slug}`">{{ t("مدیریت مجموعه") }}</RouterLink></nav></div><div class="container brand-footer-bottom"><span>© {{t(platform.name)}}{{ t(" · مراقبت، با ریتم زندگی شما") }}</span><RouterLink to="/platforms">{{ t("دیگر مسیرهای مهرگان") }}<ArrowUpLeft :size="16"/></RouterLink></div></footer>
</div><div v-else class="container empty-state"><h1>{{ t("پلتفرم پیدا نشد") }}</h1><RouterLink to="/platforms">{{ t("بازگشت به دنیای مهرگان") }}</RouterLink></div>
</template>




