import { ref, watch } from 'vue'
import translations from './translations.json'
import arabic from './translations-ar.json'

function savedLanguage(): 'fa' | 'en' | 'ar' {
  try { return localStorage.getItem('mehregan-language') === 'ar' ? 'ar' : localStorage.getItem('mehregan-language') === 'en' ? 'en' : 'fa' } catch { return 'fa' }
}
export const language = ref<'fa' | 'en' | 'ar'>(savedLanguage())
export function setLanguage(value: 'fa' | 'en' | 'ar') { language.value = value }
export function t(fa: string, en?: string) {
  if (language.value === 'fa') return fa
  const key = fa.trim()
  const translated = language.value === 'ar' ? (arabic as Record<string,string>)[key] || en || (translations as Record<string,string>)[key] || staticEnglish[key] : en || (translations as Record<string, string>)[key] || staticEnglish[key]
  return translated ? fa.replace(key, translated) : fa
}
const staticEnglish: Record<string, string> = {
  'هر بار فقط یک فایل انتخاب کنید':'Choose one file at a time.',
  'مراقبت، پیوسته.':'Care, continuously.', 'تخصصی در مراقبت، نزدیک به زندگی':'Specialist care, close to life',
  'درباره مجموعه':'About this service', 'ارتباط با مهرگان':'Contact Mehregan', 'آشنایی با متخصصان':'Meet the specialists',
  'خدمات و مسیرهای مراقبت':'Care services and paths', 'انتخاب زمان ملاقات':'Choose an appointment', 'در کنار شما':'By your side',
  'بیشتر آشنا شویم':'Learn more', 'دیگر مسیرهای مهرگان':'Other Mehregan paths', 'پلتفرم پیدا نشد':'Platform not found',
  'بازگشت به دنیای مهرگان':'Back to Mehregan', 'توجه به نیازهای فردی':'Care for individual needs',
  'گفت‌وگوی روشن با متخصص':'A clear conversation with a specialist', 'همراهی در ادامه مسیر':'Support along the way',
  'از نیاز شما، تا مسیر مراقبت':'From your needs to a path of care', 'آشنایی پیش از ملاقات':'Before your appointment',
  'همراهان مسیر شما':'The people supporting your journey', 'پذیرش مراجع':'Accepting patients',
  'در حال حاضر متخصص فعالی معرفی نشده است.':'No specialists are available at the moment.',
  'یک قدم نزدیک‌تر به حال خوب':'One step closer to feeling better', 'برنامه‌ای هماهنگ با شما':'A plan that fits your life',
  'قرار ما فقط یک زمان نیست':'Care goes beyond an appointment', 'پیش از ملاقات، تا قدم بعدی':'From preparation to what comes next',
  'با آمادگی شروع کنید':'Start prepared', 'از خودتان بگویید':'Tell us about yourself', 'مسیر را پیگیری کنید':'Follow your journey',
  'آماده برای شروع':'Ready to begin', 'پیش از اولین گفت‌وگو':'Before your first conversation',
  'در این مقاله می‌خوانید':'In this article', 'نوبت‌های پیش رو':'Upcoming appointments',
  'آخرین برنامه‌های ثبت‌شده در مجموعه':'Recently scheduled appointments', 'صندوق ارتباط':'Inbox', 'مشاهده سایت':'View site',
  'بازگشت به مدیریت هولدینگ':'Back to administration', 'امروز':'Today', 'هفتگی':'Weekly', 'ماهانه':'Monthly',
  'انتخاب نوبت جدید':'Choose another appointment', 'تغییر متخصص یا زمان':'Change specialist or time',
  'درخواست خرید از فروشگاه':'Shop purchase request'
  ,'با انتخاب یک متخصص شروع کنید. زمان‌های آزاد را ببینید و در چند قدم، قرار بعدی خود را ثبت کنید.':'Start by choosing a specialist. Review available times and book your appointment in a few steps.'
  ,'با حوزه فعالیت هر متخصص آشنا شوید و زمان‌های در دسترس او را ببینید.':'Explore each specialist’s field and available appointment times.'
  ,'جزئیات جلسه و هزینه را پیش از ثبت نهایی می‌بینید. پس از ثبت نیز کد پیگیری نوبت در اختیارتان قرار می‌گیرد.':'You can review the session details and cost before booking. A tracking code is provided afterward.'
  ,'درباره قدم بعدی، زمان پیگیری و پرسش‌هایی که پس از جلسه دارید با متخصص هماهنگ شوید.':'Discuss next steps, follow-up timing and any questions with your specialist.'
  ,'شرایط روزمره و هدف‌های خود را با متخصص در میان بگذارید؛ مراقبت از شناخت شما آغاز می‌شود.':'Tell the specialist about your daily life and goals. Care begins with understanding you.'
  ,'عضوی از خانواده سلامت مهرگان پارس':'Part of the Mehregan Pars health family'
  ,'متخصص، روز و ساعت را خودتان انتخاب کنید.':'Choose your specialist, day and time.'
  ,'مدیریت مجموعه':'Service administration'
  ,'مشاهده زمان‌های متخصص':'View specialist times'
  ,'پرسش‌ها، سوابق مرتبط و انتظارتان از جلسه را یادداشت کنید تا گفت‌وگو دقیق‌تر پیش برود.':'Write down your questions, relevant history and expectations for a more focused conversation.'
  ,'یک شروع، با همراهی متخصص':'Start with a specialist'
  ,'پرسش درباره خدمات':'Question about services'
  ,'راهنمایی برای انتخاب مسیر مراقبت':'Help choosing a care path'
  ,'پیگیری درخواست':'Follow up on a request'
  ,'پیشنهاد یا انتقاد':'Suggestion or feedback'
  ,'موضوع دیگر':'Other subject'
  ,'درخواست همکاری تخصصی':'Specialist collaboration request'
  ,'معرفی تخصص و سوابق':'Introduce expertise and experience'
  ,'پرسش درباره همکاری':'Question about collaboration'
  ,'پیشنهاد علمی یا آموزشی':'Research or education proposal'
  ,'پیشنهاد همکاری سازمانی':'Organisation partnership proposal'
  ,'درخواست خدمات برای کارکنان':'Services for employees'
  ,'همکاری در رویداد یا آموزش':'Event or education collaboration'
  ,'درخواست جلسه معرفی':'Request an introductory meeting'
  ,'پیوست فایل (اختیاری)':'Attach a file (optional)'
  ,'فقط PDF یا تصویر تا حجم ۱ مگابایت پذیرفته می‌شود':'Only PDF or images up to 1 MB are accepted'
  ,'خواندن فایل ممکن نشد؛ فایل دیگری انتخاب کنید':'The file could not be read. Choose another file.'
  ,'دکتر نازنین مهر':'Dr Nazanin Mehr'
  ,'دکتر آرمان راد':'Dr Arman Rad'
  ,'دکتر سارا نیک‌روش':'Dr Sara Nikroosh'
  ,'دکتر کیان رستگار':'Dr Kian Rastegar'
  ,'فیزیوتراپی و بازتوانی':'Physiotherapy and rehabilitation'
  ,'طب ورزشی':'Sports medicine'
  ,'تغذیه بالینی':'Clinical nutrition'
  ,'ورزش درمانی':'Therapeutic exercise'
  ,'فیزیوتراپی کمر':'Back physiotherapy'
  ,'فیزیوتراپی زانو':'Knee physiotherapy'
  ,'حرکات اصلاحی':'Corrective exercise'
  ,'بازتوانی سرطان':'Cancer rehabilitation'
  ,'ورزش و بازتوانی':'Exercise and rehabilitation'
  ,'حمایت روانی در بازتوانی':'Psychological support in rehabilitation'
  ,'مراقبت حمایتی':'Supportive care'
  ,'روان‌شناسی بالینی':'Clinical psychology'
  ,'مشاوره فردی':'Individual counselling'
  ,'سلامت روان خانواده':'Family mental wellbeing'
  ,'مدیریت استرس':'Stress management'
  ,'آب‌درمانی':'Hydrotherapy'
  ,'تمرین درمانی در آب':'Therapeutic exercise in water'
  ,'بازتوانی حرکت':'Movement rehabilitation'
  ,'فیزیوتراپی در آب':'Physiotherapy in water'
  ,'با تمرکز بر شنیدن دغدغه‌های شما و تنظیم مسیر مراقبت متناسب با زندگی روزمره.':'Focused on listening to your concerns and shaping care around everyday life.'
  ,'همراه شما در شناخت نیازها، انتخاب هدف‌های روشن و پیگیری قدم‌به‌قدم برنامه.':'Helping you understand your needs, set clear goals and follow the plan step by step.'
  ,'با توجه به تفاوت‌های فردی و گفت‌وگوی روشن درباره انتخاب‌های پیش روی شما.':'Respecting individual differences and discussing your options clearly.'
  ,'همراهی در ارزیابی اولیه و بازبینی برنامه با توجه به تجربه و پیشرفت شما.':'Supporting assessment and reviewing the plan as you progress.'
  ,'ابتدا متخصص، سپس روز و ساعت مناسب خود را انتخاب کنید.':'First choose a specialist, then a suitable day and time.'
  ,'ادامه؛ مشخصات مراجعه‌کننده':'Continue to your details'
  ,'با کدام متخصص شروع می‌کنید؟':'Which specialist would you like to see?'
  ,'برای این متخصص هنوز زمان آزادی ثبت نشده است؛ متخصص دیگری را انتخاب کنید.':'No times are available for this specialist yet. Choose another specialist.'
  ,'هنوز متخصص فعالی معرفی نشده است.':'No active specialists are listed yet.'
  ,'چه چیزی را پیش از ملاقات با متخصص در میان می‌گذارید؟':'What would you like to share with your specialist?'
  ,'کد پیگیری':'Tracking code'
  ,'کمی بیشتر با شما آشنا شویم.':'Tell us a little more about yourself.'
}
export function staticTranslation(value: string) { const trimmed=value.trim(); const translated=(translations as Record<string,string>)[trimmed] || staticEnglish[trimmed]; return translated ? value.replace(trimmed,translated) : value }
export const locale = () => language.value === 'ar' ? 'ar-SA' : language.value === 'fa' ? 'fa-IR' : 'en-US'
const persianCalendar = new Intl.DateTimeFormat('en-US-u-ca-persian', {
  year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC',
})
const englishDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' })
export function publicationDate(value: string) {
  if (language.value !== 'en') return value
  const digits = value.replace(/[۰-۹٠-٩]/g, digit => String(digit.charCodeAt(0) & 15))
  const parts = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/.exec(digits.trim())
  if (!parts) return digits
  const [year, month, day] = parts.slice(1).map(Number)
  if (month < 1 || month > 12 || day < 1 || day > 31) return digits
  if (year >= 1700) return englishDate.format(Date.UTC(year, month - 1, day))
  // Find Nowruz in UTC before applying the Persian month and day offsets.
  for (let march = 19; march <= 22; march++) {
    const start = Date.UTC(year + 621, 2, march)
    if (persianCalendar.format(start) === `1/1/${year} AP`) {
      const offset = (month - 1) * 30 + Math.min(month - 1, 6) + day - 1
      return englishDate.format(start + offset * 86400000)
    }
  }
  return digits
}
watch(language, value => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = value
    document.documentElement.dir = value === 'en' ? 'ltr' : 'rtl'
    document.title = value === 'ar' ? 'مهرجان بارس | رعاية لكل يوم' : value === 'fa' ? 'مهرگان پارس | یک خانواده برای سلامت' : 'Mehregan Pars | Care for every day'
    try { localStorage.setItem('mehregan-language', value) } catch { /* The switch also works when storage is unavailable. */ }
  }
}, { immediate: true })
