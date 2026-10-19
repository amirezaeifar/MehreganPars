import { locale } from './i18n'
import { reactive, watch, ref } from 'vue'
import { platforms } from './data'

export interface Doctor { id: string; platform: string; name: string; specialty: string; bio: string; active: boolean; photo?:string }
export interface Slot { id: string; platform: string; doctor: string; date: string; time: string; duration: number; mode: string; price: number; blocked: boolean }
export interface Booking { id: string; slot: string; name: string; phone: string; note: string; status: 'confirmed' | 'cancelled' | 'completed'; created: string }
export interface Ticket { id: string; name: string; phone: string; email: string; subject: string; message: string; audience: string; specialty?: string; license?: string; city?: string; organization?: string; attachment?: { name: string; type: string; data: string }; status: string; reply: string; created: string }
interface State { doctors: Doctor[]; slots: Slot[]; bookings: Booking[]; tickets: Ticket[]; seedVersion?: number }
export const storageError = ref('')
export const today = () => new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tehran',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())
export const uid = () => crypto.randomUUID()
export const dateLabel = (date: string) => new Date(date+'T12:00:00').toLocaleDateString(locale(), { weekday: 'long', month: 'long', day: 'numeric' })
export const future = (slot: Slot) => new Date(`${slot.date}T${slot.time}:00+03:30`).getTime() > Date.now()
const names = ['دکتر نازنین مهر', 'دکتر آرمان راد', 'دکتر سارا نیک‌روش', 'دکتر کیان رستگار']
const bios = ['با تمرکز بر شنیدن دغدغه‌های شما و تنظیم مسیر مراقبت متناسب با زندگی روزمره.', 'همراه شما در شناخت نیازها، انتخاب هدف‌های روشن و پیگیری قدم‌به‌قدم برنامه.', 'با توجه به تفاوت‌های فردی و گفت‌وگوی روشن درباره انتخاب‌های پیش روی شما.', 'همراهی در ارزیابی اولیه و بازبینی برنامه با توجه به تجربه و پیشرفت شما.']
const specialties:Record<string,string[]> = {
 'health-center':['فیزیوتراپی و بازتوانی','طب ورزشی','تغذیه بالینی','ورزش درمانی'], physiopars:['فیزیوتراپی کمر','فیزیوتراپی زانو','حرکات اصلاحی','فیزیوتراپی و بازتوانی'], oncopars:['بازتوانی سرطان','ورزش و بازتوانی','حمایت روانی در بازتوانی','مراقبت حمایتی'], psychopars:['روان‌شناسی بالینی','مشاوره فردی','سلامت روان خانواده','مدیریت استرس'], hydrotherapy:['آب‌درمانی','تمرین درمانی در آب','بازتوانی حرکت','فیزیوتراپی در آب']
}
function addDays(n:number){const d=new Date(today()+'T12:00:00');d.setDate(d.getDate()+n);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function seed(): State {
 const doctors = platforms.filter(p=>p.slug!=='shop').flatMap(p => names.map((name,i) => ({ id: `${p.slug}-${i}`, platform:p.slug,name,specialty:specialties[p.slug][i],bio:bios[i],active:true })))
 const slots: Slot[]=[]
 doctors.forEach((d,index)=>{for(let day=1;day<=14;day++){if(new Date(addDays(day)+'T12:00:00').getDay()===5)continue;['09:00','10:00','11:30','16:00'].forEach((time,i)=>slots.push({id:uid(),platform:d.platform,doctor:d.id,date:addDays(day),time,duration:i===2?60:30,mode:['health-center','hydrotherapy'].includes(d.platform)?'حضوری':'آنلاین',price:350000+index%4*50000,blocked:day===3&&i===3}))}})
 const bookings:Booking[]=platforms.flatMap(p=>slots.filter(s=>s.platform===p.slug&&!s.blocked).filter((_,i)=>[2,5,8,13,17,25,33].includes(i)).map((slot,i)=>({id:uid(),slot:slot.id,name:['مریم احمدی','علی رضایی','سارا موسوی','رضا کریمی','نرگس رستمی','امیر نادری','زهرا حسینی'][i],phone:'',note:['جلسه ارزیابی اولیه','پیگیری برنامه مراقبت','بررسی روند جلسات گذشته'][i%3],status:i===5?'cancelled':'confirmed',created:new Date().toISOString()})))
 const tickets:Ticket[]=[{id:uid(),name:'مریم احمدی',phone:'',email:'',subject:'راهنمای انتخاب خدمت',message:'برای شروع فیزیوتراپی و انتخاب متخصص مناسب راهنمایی می‌خواهم. امکان مشاوره اولیه وجود دارد؟',audience:'general',status:'new',reply:'',created:new Date().toISOString()},{id:uid(),name:'دکتر سارا نیک‌روش',phone:'',email:'',subject:'گفت‌وگو درباره همکاری تخصصی',message:'مایلم درباره مسیر همکاری در ارائه خدمات و پیگیری آنلاین مراجعان اطلاعات بیشتری دریافت کنم.',audience:'doctor',specialty:'حرکات اصلاحی',status:'review',reply:'حوزه همکاری برای بررسی به مسئول مجموعه ارجاع شد.',created:new Date().toISOString()},{id:uid(),name:'علی رضایی',phone:'',email:'',subject:'تغییر زمان مشاوره',message:'لطفاً درباره روش تغییر نوبت مشاوره تغذیه راهنمایی کنید.',audience:'general',status:'closed',reply:'روش لغو نوبت و انتخاب زمان تازه توضیح داده شد.',created:new Date().toISOString()}]
 return {doctors,slots,bookings,tickets,seedVersion:3}
}
function load(): State {
 try {
  const raw=localStorage.getItem('mehregan-operations-v1')
  if(raw){
   const s=JSON.parse(raw) as State
   if(['doctors','slots','bookings','tickets'].every(k=>Array.isArray(s[k as keyof State]))){
    if(s.seedVersion!==3){
     const fresh=seed()
     for(const doctor of fresh.doctors)if(!s.doctors.some(old=>old.id===doctor.id))s.doctors.push(doctor)
     for(const p of platforms.filter(p=>p.slug!=='shop'))if(!s.slots.some(slot=>slot.platform===p.slug&&future(slot)))s.slots.push(...fresh.slots.filter(slot=>slot.platform===p.slug))
     if(!s.tickets.length)s.tickets=fresh.tickets
     s.seedVersion=3
    }
    return s
   }
  }
 }catch{storageError.value='خواندن اطلاعات ذخیره‌شده ممکن نشد.'}
 return seed()
}
export const state=reactive<State>(load())
watch(state,value=>{try{localStorage.setItem('mehregan-operations-v1',JSON.stringify(value));storageError.value=''}catch{storageError.value='ذخیره‌سازی مرورگر در دسترس نیست؛ تغییرات با بستن صفحه از دست می‌روند.'}},{deep:true,immediate:true})
export const occupied=(id:string)=>state.bookings.some(b=>b.slot===id&&b.status!=='cancelled')
export function book(slotId:string,name:string,phone:string,note:string){const slot=state.slots.find(s=>s.id===slotId);if(!slot||slot.blocked||!future(slot)||occupied(slotId)||!state.doctors.find(d=>d.id===slot.doctor)?.active)throw new Error('این زمان دیگر قابل رزرو نیست. زمان دیگری انتخاب کنید.');if(!name.trim()||!phone.trim())throw new Error('نام و شماره همراه را کامل کنید.');const booking:Booking={id:uid(),slot:slotId,name,phone,note,status:'confirmed',created:new Date().toISOString()};state.bookings.unshift(booking);return booking}
export function saveSlot(slot:Slot){if(!/^\d{4}-\d{2}-\d{2}$/.test(slot.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(slot.time)||!Number.isFinite(slot.duration)||slot.duration<10||slot.duration>180||!Number.isFinite(slot.price)||slot.price<0)throw new Error('تاریخ، ساعت، مدت و هزینه را بررسی کنید.');if(!state.doctors.some(d=>d.id===slot.doctor&&d.platform===slot.platform&&d.active))throw new Error('یک متخصص فعال از همین مجموعه انتخاب کنید.');if(!future(slot))throw new Error('تاریخ و ساعت باید در آینده باشد.');if(Number(slot.time.slice(0,2))*60+Number(slot.time.slice(3))+slot.duration>1440)throw new Error('پایان ویزیت باید در همین روز باشد.');if(state.slots.some(s=>s.id!==slot.id&&s.doctor===slot.doctor&&s.date===slot.date&&new Date(`${s.date}T${s.time}`).getTime()<new Date(`${slot.date}T${slot.time}`).getTime()+slot.duration*60000&&new Date(`${slot.date}T${slot.time}`).getTime()<new Date(`${s.date}T${s.time}`).getTime()+s.duration*60000))throw new Error('این بازه با برنامه پزشک هم‌پوشانی دارد.');if(occupied(slot.id))throw new Error('زمان رزروشده را نمی‌توان تغییر داد؛ ابتدا رزرو را لغو کنید.');const i=state.slots.findIndex(s=>s.id===slot.id);if(i<0)state.slots.push(slot);else state.slots[i]=slot}
