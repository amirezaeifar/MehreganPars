<script setup lang="ts">
import { t } from '../i18n'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, CheckCircle2, Stethoscope, UserRound, Building2, UploadCloud, FileText, X } from 'lucide-vue-next'

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
    <div v-if="submitted" class="ticket-page page-wrap"><div class="container ticket-result" role="status"><CheckCircle2 :size="48"/><span class="kicker">{{ t("ارسال پیام", "Message sent") }}</span><h1>{{ t("پیام شما ثبت شد", "Your message has been recorded") }}</h1><p>{{ t("کد پیگیری زیر را برای مراجعه بعدی نگه دارید.", "Keep the tracking code below for future reference.") }}</p><div class="ticket-code"><span>{{ t("کد پیگیری", "Tracking code") }}</span><strong dir="ltr">{{ tracking }}</strong></div><p v-if="storageError" role="alert">{{ t(storageError) }}</p><div class="ticket-result-actions"><button class="button button-primary" @click="newMessage">{{ t("ارسال پیام تازه", "Send another message") }} <ArrowLeft :size="17"/></button><RouterLink to="/">{{ t("بازگشت به خانه", "Back home") }}</RouterLink></div></div></div><div v-else class="contact-page">
  <section class="contact-introduction">
    <h1>{{ t('ارتباط با ما', 'Contact') }}</h1>
    <p>{{ t('پرسشی دارید یا می‌خواهید با مهرگان همکاری کنید؟ مسیر مناسب خود را انتخاب کنید و برایمان بنویسید.', 'Have a question about care or working with Mehregan? Choose how you would like to get in touch.') }}</p>
  </section>
  <section id="ticket" class="ticket-layout">
    <aside class="contact-record">
      <span class="sample-label">{{ t('اطلاعات نمونه', 'Sample details') }}</span>
      <h2>{{ t('مهرگان پارس', 'Mehregan Pars') }}</h2>
      <dl>
        <dt>{{ t('شماره تماس', 'Phone') }}</dt><dd><bdi dir="ltr">+98 21 XXXX 1200</bdi></dd>
        <dt>{{ t('ایمیل', 'Email') }}</dt><dd><a dir="ltr" href="mailto:hello@mehregan.example">hello@mehregan.example</a></dd>
        <dt>{{ t('نشانی', 'Address') }}</dt><dd>{{ t('تهران، خیابان نمونه، پلاک ۱۲', '12 Example Street, Tehran, Iran') }}</dd>
      </dl>
    </aside>
    <div class="contact-form-card"><h3>{{ t("من به عنوان...") }}</h3><div class="audience-options"><button type="button" :class="{ active: audience === 'general' }" @click="selectAudience('general')"><UserRound :size="20" /> {{ t("مراجع / همراه") }}</button><button type="button" :class="{ active: audience === 'doctor' }" @click="selectAudience('doctor')"><Stethoscope :size="20" /> {{ t("پزشک / متخصص") }}</button><button type="button" :class="{ active: audience === 'organization' }" @click="selectAudience('organization')"><Building2 :size="20" /> {{ t("سازمان / مرکز") }}</button></div><form :key="audience" @submit.prevent="submit"><div class="form-heading"><h3>{{ t("اطلاعات") }} {{ t(audienceLabel || '') }}</h3><span>{{ t("فیلدهای ستاره‌دار ضروری‌اند.") }}</span></div><div class="form-grid"><label><span>{{ t("نام و نام خانوادگی *") }}</span><input v-model.trim="form.name" required autocomplete="name" :placeholder="t('نام خود را وارد کنید')" /></label><label><span>{{ t("شماره تماس *") }}</span><input v-model.trim="form.phone" required inputmode="tel" autocomplete="tel" pattern="[0-9۰-۹٠-٩+\-\s]{8,18}" :placeholder="t('مثلاً ۰۹۱۲۱۲۳۴۵۶۷')" /></label><label><span>{{ t("ایمیل") }}</span><input v-model.trim="form.email" type="email" autocomplete="email" placeholder="name@example.com" dir="ltr" /></label><label v-if="audience === 'doctor'"><span>{{ t("حوزه تخصص پزشکی *") }}</span><select v-model="form.specialty" required><option value="" disabled>{{ t("تخصص خود را انتخاب کنید") }}</option><option v-for="item in specialties" :key="item" :value="item">{{ t(item || '') }}</option></select></label><label v-if="audience === 'doctor'"><span>{{ t("شماره نظام پزشکی / پروانه حرفه‌ای *") }}</span><input v-model.trim="form.license" required :placeholder="t('شماره پروانه یا نظام پزشکی')" /></label><label v-if="audience === 'doctor'"><span>{{ t("شهر محل فعالیت *") }}</span><input v-model.trim="form.city" required :placeholder="t('مثلاً تهران')" /></label><label v-if="audience === 'organization'"><span>{{ t("نام سازمان یا مرکز *") }}</span><input v-model.trim="form.organization" required :placeholder="t('نام مجموعه')" /></label><label><span>{{ t("موضوع پیام *") }}</span><select v-model="form.subject" required><option value="" disabled>{{ t("موضوع پیام را انتخاب کنید", "Choose a subject") }}</option><option v-if="form.subject&&!subjects[audience].includes(form.subject)" :value="form.subject">{{t(form.subject)}}</option><option v-for="subject in subjects[audience]" :key="subject" :value="subject">{{ t(subject) }}</option></select></label><div class="attachment-field form-full">
  <span class="attachment-label">{{t('پیوست فایل','Attachment')}} <small>{{t('اختیاری','Optional')}}</small></span>
  <label class="upload-zone" :class="{dragging,attached:attachment}" @dragover.prevent="dragging=true" @dragleave.prevent="dragging=false" @drop.prevent="dropFile">
    <input ref="fileInput" type="file" accept=".pdf,image/png,image/jpeg,image/webp" :aria-label="t('انتخاب فایل پیوست','Choose an attachment')" aria-describedby="attachment-hint attachment-error" @change="chooseFile"/>
    <span class="upload-symbol"><FileText v-if="attachment" :size="26"/><UploadCloud v-else :size="27"/></span>
    <span class="upload-copy"><strong>{{attachment?attachment.name:t('فایل خود را اینجا اضافه کنید','Add your file here')}}</strong><span>{{attachment?t('برای تغییر فایل کلیک کنید','Click to replace this file'):t('کلیک کنید یا فایل را اینجا رها کنید','Click to browse or drop a file here')}}</span></span>
    <span class="upload-action">{{attachment?t('تغییر فایل','Replace'):t('انتخاب فایل','Choose file')}}</span>
  </label>
  <div class="upload-meta"><small id="attachment-hint">{{t('PDF، JPG، PNG یا WebP · حداکثر ۱ مگابایت','PDF, JPG, PNG or WebP · Up to 1 MB')}}</small><button v-if="attachment" type="button" class="remove-attachment" @click="removeFile"><X :size="14"/>{{t('حذف فایل','Remove file')}}</button></div>
  <p id="attachment-error" class="attachment-error" role="alert">{{t(attachmentError)}}</p>
</div><label class="form-full"><span>{{ t("پیام شما *") }}</span><textarea v-model.trim="form.message" required rows="5" :placeholder="t('توضیح دهید چگونه می‌توانیم کمک کنیم...')"></textarea></label></div><div class="form-actions"><button class="button button-primary" :disabled="submitted" type="submit">{{ t("ثبت پیام") }} <ArrowLeft :size="18" /></button></div></form></div></section></div>
</template>




<style scoped>
.contact-page {background:white;color:#153e30}
.contact-introduction,.ticket-layout {width:min(88%,1440px);margin-inline:auto}
.contact-introduction {padding-block:clamp(42px,5vw,78px) clamp(28px,3.2vw,48px)}
.contact-introduction h1 {font-size:clamp(38px,3.8vw,64px);line-height:1.15;margin:0}
.contact-introduction > p {margin:32px 0 0;max-width:82ch;line-height:1.65}
.ticket-layout {display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);grid-template-areas:"form details";gap:clamp(24px,6vw,92px);align-items:start;padding-bottom:clamp(54px,7vw,108px)}
.ticket-layout:dir(rtl) {grid-template-columns:minmax(0,1fr) minmax(0,1.7fr);grid-template-areas:"details form"}
.contact-form-card {grid-area:form;min-width:0}
.contact-record {grid-area:details;padding:clamp(24px,3.4vw,54px);background:#eaf1eb;color:#153e30;border-radius:6px 6px 48px 6px;text-align:start}
.contact-record h2 {margin:14px 0 28px;font-size:clamp(28px,3vw,48px);line-height:1.15}
.sample-label,.contact-record dt {font-size:.85rem;font-weight:650}
.contact-record dl {margin:0}
.contact-record dt {border-top:1px solid #b7cbbd;padding-top:18px}
.contact-record dd {margin:7px 0 20px;overflow-wrap:anywhere}
.contact-record dd:last-child {margin-bottom:0}
.contact-record a {display:inline-block;color:inherit;text-underline-offset:.2em}
@media(max-width:760px){
 .ticket-layout,.ticket-layout:dir(rtl) {grid-template-columns:minmax(0,1fr);grid-template-areas:"details" "form";gap:24px}
}
</style>
