<script setup lang="ts">
import { t, locale } from '../i18n'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, CheckCircle2, Mail, Stethoscope, UserRound, Building2, UploadCloud, FileText, X } from 'lucide-vue-next'

import { state, uid, storageError } from '../operations'
type Audience = 'general' | 'doctor' | 'organization'
const route = useRoute()
const audience = ref<Audience>('general')
watch(() => route.query.audience, value => { audience.value = value === 'doctor' || value === 'organization' ? value : 'general' }, { immediate: true })
const submitted = ref(false)
const tracking = ref('')
const attachment = ref<File | null>(null)
const attachmentError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const form = reactive({ name: '', phone: '', email: '', specialty: '', license: '', city: '', organization: '', subject: '', message: '' })
const specialties = ['پزشکی عمومی', 'فیزیوتراپی', 'طب فیزیکی و توانبخشی', 'ارتوپدی', 'انکولوژی', 'روان‌پزشکی', 'روان‌شناسی', 'تغذیه', 'طب ورزشی', 'سایر تخصص‌ها']
const subjects: Record<Audience, string[]> = {
  general: ['پرسش درباره خدمات', 'راهنمایی برای انتخاب مسیر مراقبت', 'پیگیری درخواست', 'پیشنهاد یا انتقاد', 'موضوع دیگر'],
  doctor: ['درخواست همکاری تخصصی', 'معرفی تخصص و سوابق', 'پرسش درباره همکاری', 'پیشنهاد علمی یا آموزشی', 'موضوع دیگر'],
  organization: ['پیشنهاد همکاری سازمانی', 'درخواست خدمات برای کارکنان', 'همکاری در رویداد یا آموزش', 'درخواست جلسه معرفی', 'موضوع دیگر'],
}
const audienceLabel = computed(() => audience.value === 'doctor' ? 'پزشک یا متخصص' : audience.value === 'organization' ? 'سازمان یا مرکز درمانی' : 'مراجع یا همراه')
function selectAudience(value: Audience) { audience.value = value; form.subject = '' }
watch(() => route.query.subject, value => { if (typeof value === 'string') form.subject = value }, { immediate: true })
watch(() => route.query.message, value => { if (typeof value === 'string') form.message = value }, { immediate: true })
function setFile(file: File | null) {
  attachmentError.value = ''
  if (file && (!['application/pdf','image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 1024 * 1024)) {
    attachment.value = null
    attachmentError.value = 'فقط PDF یا تصویر تا حجم ۱ مگابایت پذیرفته می‌شود'
    if (fileInput.value) fileInput.value.value = ''
    return
  }
  attachment.value = file
}
function chooseFile(event: Event) { setFile((event.target as HTMLInputElement).files?.[0] || null) }
function dropFile(event: DragEvent) {
  dragging.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 1) { attachmentError.value = 'هر بار فقط یک فایل انتخاب کنید'; return }
  setFile(files?.[0] || null)
}
function removeFile() { setFile(null); if (fileInput.value) fileInput.value.value = '' }
async function submit() {
  let savedAttachment: { name:string; type:string; data:string } | undefined
  if (attachment.value) {
    const file = attachment.value
    try {
      const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file) })
      savedAttachment = { name:file.name, type:file.type, data }
    } catch {
      attachmentError.value = 'خواندن فایل ممکن نشد؛ فایل دیگری انتخاب کنید'
      return
    }
  }
  const id = uid(); tracking.value = id.slice(0,8)
  state.tickets.unshift({ ...form, attachment:savedAttachment, id, audience: audience.value, status: 'new', reply: '', created: new Date().toISOString() })
  submitted.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function newMessage() { submitted.value = false; attachment.value = null; attachmentError.value = ''; Object.assign(form, { name: '', phone: '', email: '', specialty: '', license: '', city: '', organization: '', subject: '', message: '' }) }
</script>

<template>
    <div v-if="submitted" class="ticket-page page-wrap"><div class="container ticket-result" role="status"><CheckCircle2 :size="48"/><span class="kicker">{{ t("ارسال پیام", "Message sent") }}</span><h1>{{ t("پیام شما ثبت شد", "Your message has been recorded") }}</h1><p>{{ t("کد پیگیری زیر را برای مراجعه بعدی نگه دارید.", "Keep the tracking code below for future reference.") }}</p><div class="ticket-code"><span>{{ t("کد پیگیری", "Tracking code") }}</span><strong dir="ltr">{{ tracking }}</strong></div><p v-if="storageError" role="alert">{{ t(storageError) }}</p><div class="ticket-result-actions"><button class="button button-primary" @click="newMessage">{{ t("ارسال پیام تازه", "Send another message") }} <ArrowLeft :size="17"/></button><RouterLink to="/">{{ t("بازگشت به خانه", "Back home") }}</RouterLink></div></div></div><div v-else class="page-wrap"><section class="simple-hero contact-hero"><div class="container"><span class="kicker"><span class="kicker-dot"></span> {{ t("ارتباط با ما") }}</span><h1>{{ t("گفت‌وگو را از اینجا شروع کنیم", "Let us start a conversation") }}</h1><p>{{ t("پرسشی دارید یا می‌خواهید با مهرگان همکاری کنید؟ مسیر مناسب خود را انتخاب کنید و برایمان بنویسید.") }}</p></div></section><section class="section contact-section"><div class="container contact-grid"><div class="contact-sidebar"><span class="kicker"><span class="kicker-dot"></span> {{ t("مسیر ارتباط") }}</span><h2>{{ t("چطور می‌توانیم کمکتان کنیم؟") }}</h2><p>{{ t("پیام شما ثبت می‌شود و تیم مهرگان آن را بررسی می‌کند. موضوع پیام را انتخاب کنید تا درخواستتان به بخش مناسب برسد.") }}</p><div class="contact-side-card"><Mail :size="24" /><div><strong>{{ t("پیام شما برای مهرگان") }}</strong><span>{{ t("فرم مناسب خود را انتخاب و تکمیل کنید.") }}</span></div></div></div><div class="contact-form-card"><h3>{{ t("من به عنوان...") }}</h3><div class="audience-options"><button type="button" :class="{ active: audience === 'general' }" @click="selectAudience('general')"><UserRound :size="20" /> {{ t("مراجع / همراه") }}</button><button type="button" :class="{ active: audience === 'doctor' }" @click="selectAudience('doctor')"><Stethoscope :size="20" /> {{ t("پزشک / متخصص") }}</button><button type="button" :class="{ active: audience === 'organization' }" @click="selectAudience('organization')"><Building2 :size="20" /> {{ t("سازمان / مرکز") }}</button></div><form :key="audience" @submit.prevent="submit"><div class="form-heading"><h3>{{ t("اطلاعات") }} {{ t(audienceLabel || '') }}</h3><span>{{ t("فیلدهای ستاره‌دار ضروری‌اند.") }}</span></div><div class="form-grid"><label><span>{{ t("نام و نام خانوادگی *") }}</span><input v-model.trim="form.name" required autocomplete="name" :placeholder="t('نام خود را وارد کنید')" /></label><label><span>{{ t("شماره تماس *") }}</span><input v-model.trim="form.phone" required inputmode="tel" autocomplete="tel" pattern="[0-9۰-۹٠-٩+\-\s]{8,18}" :placeholder="t('مثلاً ۰۹۱۲۱۲۳۴۵۶۷')" /></label><label><span>{{ t("ایمیل") }}</span><input v-model.trim="form.email" type="email" autocomplete="email" placeholder="name@example.com" dir="ltr" /></label><label v-if="audience === 'doctor'"><span>{{ t("حوزه تخصص پزشکی *") }}</span><select v-model="form.specialty" required><option value="" disabled>{{ t("تخصص خود را انتخاب کنید") }}</option><option v-for="item in specialties" :key="item">{{ t(item || '') }}</option></select></label><label v-if="audience === 'doctor'"><span>{{ t("شماره نظام پزشکی / پروانه حرفه‌ای *") }}</span><input v-model.trim="form.license" required :placeholder="t('شماره پروانه یا نظام پزشکی')" /></label><label v-if="audience === 'doctor'"><span>{{ t("شهر محل فعالیت *") }}</span><input v-model.trim="form.city" required :placeholder="t('مثلاً تهران')" /></label><label v-if="audience === 'organization'"><span>{{ t("نام سازمان یا مرکز *") }}</span><input v-model.trim="form.organization" required :placeholder="t('نام مجموعه')" /></label><label><span>{{ t("موضوع پیام *") }}</span><select v-model="form.subject" required><option value="" disabled>{{ t("موضوع پیام را انتخاب کنید", "Choose a subject") }}</option><option v-if="form.subject&&!subjects[audience].includes(form.subject)" :value="form.subject">{{t(form.subject)}}</option><option v-for="subject in subjects[audience]" :key="subject" :value="subject">{{ t(subject) }}</option></select></label><div class="attachment-field form-full">
  <span class="attachment-label">{{t('پیوست فایل','Attachment')}} <small>{{t('اختیاری','Optional')}}</small></span>
  <label class="upload-zone" :class="{dragging,attached:attachment}" @dragover.prevent="dragging=true" @dragleave.prevent="dragging=false" @drop.prevent="dropFile">
    <input ref="fileInput" type="file" accept=".pdf,image/png,image/jpeg,image/webp" :aria-label="t('انتخاب فایل پیوست','Choose an attachment')" aria-describedby="attachment-hint attachment-error" @change="chooseFile"/>
    <span class="upload-symbol"><FileText v-if="attachment" :size="26"/><UploadCloud v-else :size="27"/></span>
    <span class="upload-copy"><strong>{{attachment?attachment.name:t('فایل خود را اینجا اضافه کنید','Add your file here')}}</strong><span>{{attachment?t('برای تغییر فایل کلیک کنید','Click to replace this file'):t('کلیک کنید یا فایل را اینجا رها کنید','Click to browse or drop a file here')}}</span></span>
    <span class="upload-action">{{attachment?t('تغییر فایل','Replace'):t('انتخاب فایل','Choose file')}}</span>
  </label>
  <div class="upload-meta"><small id="attachment-hint">{{t('PDF، JPG، PNG یا WebP · حداکثر ۱ مگابایت','PDF, JPG, PNG or WebP · Up to 1 MB')}}</small><button v-if="attachment" type="button" class="remove-attachment" @click="removeFile"><X :size="14"/>{{t('حذف فایل','Remove file')}}</button></div>
  <p id="attachment-error" class="attachment-error" role="alert">{{t(attachmentError)}}</p>
</div><label class="form-full"><span>{{ t("پیام شما *") }}</span><textarea v-model.trim="form.message" required rows="5" :placeholder="t('توضیح دهید چگونه می‌توانیم کمک کنیم...')"></textarea></label></div><div class="form-actions"><button class="button button-primary" :disabled="submitted" type="submit">{{ t("ثبت پیام") }} <ArrowLeft :size="18" /></button></div></form></div></div></section></div>
</template>



