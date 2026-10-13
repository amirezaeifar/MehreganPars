<script setup lang="ts">
import { t, locale } from '../i18n'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, CheckCircle2, Mail, Stethoscope, UserRound, Building2 } from 'lucide-vue-next'

import { state, uid, storageError } from '../operations'
type Audience = 'general' | 'doctor' | 'organization'
const route = useRoute()
const audience = ref<Audience>('general')
watch(() => route.query.audience, value => { audience.value = value === 'doctor' || value === 'organization' ? value : 'general' }, { immediate: true })
const submitted = ref(false)
const tracking = ref('')
const form = reactive({ name: '', phone: '', email: '', specialty: '', license: '', city: '', organization: '', subject: '', message: '' })
const specialties = ['پزشکی عمومی', 'فیزیوتراپی', 'طب فیزیکی و توانبخشی', 'ارتوپدی', 'انکولوژی', 'روان‌پزشکی', 'روان‌شناسی', 'تغذیه', 'طب ورزشی', 'سایر تخصص‌ها']
const subjects: Record<Audience, string[]> = {
  general: ['پرسش درباره خدمات', 'راهنمایی برای انتخاب مسیر مراقبت', 'پیگیری درخواست', 'پیشنهاد یا انتقاد', 'موضوع دیگر'],
  doctor: ['درخواست همکاری تخصصی', 'معرفی تخصص و سوابق', 'پرسش درباره همکاری', 'پیشنهاد علمی یا آموزشی', 'موضوع دیگر'],
  organization: ['پیشنهاد همکاری سازمانی', 'درخواست خدمات برای کارکنان', 'همکاری در رویداد یا آموزش', 'درخواست جلسه معرفی', 'موضوع دیگر'],
}
const audienceLabel = computed(() => audience.value === 'doctor' ? 'پزشک یا متخصص' : audience.value === 'organization' ? 'سازمان یا مرکز درمانی' : 'مراجع یا همراه')
function selectAudience(value: Audience) { audience.value = value; form.subject = '' }
function submit() {
  const id = uid(); tracking.value = id.slice(0,8)
  state.tickets.unshift({ ...form, id, audience: audience.value, status: 'new', reply: '', created: new Date().toISOString() })
  submitted.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function newMessage() { submitted.value = false; Object.assign(form, { name: '', phone: '', email: '', specialty: '', license: '', city: '', organization: '', subject: '', message: '' }) }
</script>

<template>
    <div v-if="submitted" class="ticket-page page-wrap"><div class="container ticket-result" role="status"><CheckCircle2 :size="48"/><span class="kicker">{{ t("ارسال پیام", "Message sent") }}</span><h1>{{ t("پیام شما ثبت شد.", "Your message has been recorded.") }}</h1><p>{{ t("کد پیگیری زیر را برای مراجعه بعدی نگه دارید.", "Keep the tracking code below for future reference.") }}</p><div class="ticket-code"><span>{{ t("کد پیگیری", "Tracking code") }}</span><strong dir="ltr">{{ tracking }}</strong></div><p v-if="storageError" role="alert">{{ t(storageError) }}</p><div class="ticket-result-actions"><button class="button button-primary" @click="newMessage">{{ t("ارسال پیام تازه", "Send another message") }} <ArrowLeft :size="17"/></button><RouterLink to="/">{{ t("بازگشت به خانه", "Back home") }}</RouterLink></div></div></div><div v-else class="page-wrap"><section class="simple-hero contact-hero"><div class="container"><span class="kicker"><span class="kicker-dot"></span> {{ t("ارتباط با ما") }}</span><h1>{{ t("گفت‌وگو را از اینجا شروع کنیم.") }}</h1><p>{{ t("پرسشی دارید یا می‌خواهید با مهرگان همکاری کنید؟ مسیر مناسب خود را انتخاب کنید و برایمان بنویسید.") }}</p></div></section><section class="section contact-section"><div class="container contact-grid"><div class="contact-sidebar"><span class="kicker"><span class="kicker-dot"></span> {{ t("مسیر ارتباط") }}</span><h2>{{ t("چطور می‌توانیم کمکتان کنیم؟") }}</h2><p>{{ t("پیام شما ثبت می‌شود و تیم مهرگان آن را بررسی می‌کند. موضوع پیام را انتخاب کنید تا درخواستتان به بخش مناسب برسد.") }}</p><div class="contact-side-card"><Mail :size="24" /><div><strong>{{ t("پیام شما برای مهرگان") }}</strong><span>{{ t("فرم مناسب خود را انتخاب و تکمیل کنید.") }}</span></div></div></div><div class="contact-form-card"><h3>{{ t("من به عنوان...") }}</h3><div class="audience-options"><button type="button" :class="{ active: audience === 'general' }" @click="selectAudience('general')"><UserRound :size="20" /> {{ t("مراجع / همراه") }}</button><button type="button" :class="{ active: audience === 'doctor' }" @click="selectAudience('doctor')"><Stethoscope :size="20" /> {{ t("پزشک / متخصص") }}</button><button type="button" :class="{ active: audience === 'organization' }" @click="selectAudience('organization')"><Building2 :size="20" /> {{ t("سازمان / مرکز") }}</button></div><form :key="audience" @submit.prevent="submit"><div class="form-heading"><h3>{{ t("اطلاعات") }} {{ t(audienceLabel || '') }}</h3><span>{{ t("فیلدهای ستاره‌دار ضروری‌اند.") }}</span></div><div class="form-grid"><label><span>{{ t("نام و نام خانوادگی *") }}</span><input v-model.trim="form.name" required autocomplete="name" :placeholder="t('نام خود را وارد کنید')" /></label><label><span>{{ t("شماره تماس *") }}</span><input v-model.trim="form.phone" required inputmode="tel" autocomplete="tel" pattern="[0-9۰-۹٠-٩+\-\s]{8,18}" :placeholder="t('مثلاً ۰۹۱۲۱۲۳۴۵۶۷')" /></label><label><span>{{ t("ایمیل") }}</span><input v-model.trim="form.email" type="email" autocomplete="email" placeholder="name@example.com" dir="ltr" /></label><label v-if="audience === 'doctor'"><span>{{ t("حوزه تخصص پزشکی *") }}</span><select v-model="form.specialty" required><option value="" disabled>{{ t("تخصص خود را انتخاب کنید") }}</option><option v-for="item in specialties" :key="item">{{ t(item || '') }}</option></select></label><label v-if="audience === 'doctor'"><span>{{ t("شماره نظام پزشکی / پروانه حرفه‌ای *") }}</span><input v-model.trim="form.license" required :placeholder="t('شماره پروانه یا نظام پزشکی')" /></label><label v-if="audience === 'doctor'"><span>{{ t("شهر محل فعالیت *") }}</span><input v-model.trim="form.city" required :placeholder="t('مثلاً تهران')" /></label><label v-if="audience === 'organization'"><span>{{ t("نام سازمان یا مرکز *") }}</span><input v-model.trim="form.organization" required :placeholder="t('نام مجموعه')" /></label><label><span>{{ t("موضوع پیام *") }}</span><select v-model="form.subject" required><option value="" disabled>{{ t("موضوع پیام را انتخاب کنید", "Choose a subject") }}</option><option v-for="subject in subjects[audience]" :key="subject" :value="subject">{{ t(subject) }}</option></select></label><label class="form-full"><span>{{ t("پیام شما *") }}</span><textarea v-model.trim="form.message" required rows="5" :placeholder="t('توضیح دهید چگونه می‌توانیم کمک کنیم...')"></textarea></label></div><div class="form-actions"><button class="button button-primary" :disabled="submitted" type="submit">{{ t("ثبت پیام") }} <ArrowLeft :size="18" /></button></div></form></div></div></section></div>
</template>


