<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpLeft, CalendarDays, Wallet, Users, BookOpenText, MessageSquare, ClipboardCheck } from 'lucide-vue-next'
import { platforms, type Platform } from '../data'
import { state, future, occupied, dateLabel } from '../operations'
import { governance, demoBalance } from '../governance'
import { useArticles } from '../store'
import { t, locale } from '../i18n'
const props=defineProps<{platform?:Platform}>()
const emit=defineEmits<{tab:[value:string]}>()
const {articles}=useArticles()
const doctors=computed(()=>state.doctors.filter(d=>!props.platform||d.platform===props.platform.slug))
const slots=computed(()=>state.slots.filter(s=>!props.platform||s.platform===props.platform.slug))
const bookings=computed(()=>state.bookings.filter(b=>slots.value.some(s=>s.id===b.slot)))
const upcoming=computed(()=>bookings.value.filter(b=>b.status==='confirmed'&&future(slotOf(b.slot)!)).sort((a,b)=>(slotOf(a.slot)!.date+slotOf(a.slot)!.time).localeCompare(slotOf(b.slot)!.date+slotOf(b.slot)!.time)).slice(0,4))
const freeSlots=computed(()=>slots.value.filter(s=>future(s)&&!s.blocked&&!occupied(s.id)&&doctors.value.find(d=>d.id===s.doctor)?.active))
const requests=computed(()=>governance.withdrawals.filter(w=>doctors.value.some(d=>d.id===w.doctor)))
const pending=computed(()=>governance.reviews.filter(r=>r.status==='pending'))
const ticketQueue=computed(()=>state.tickets.filter(t=>t.status!=='closed'))
const balance=computed(()=>doctors.value.reduce((sum,d)=>sum+demoBalance(d.id),0))
const slotOf=(id:string)=>slots.value.find(s=>s.id===id)
const doctorName=(id:string)=>doctors.value.find(d=>d.id===id)?.name||'—'
const number=(n:number)=>n.toLocaleString(locale())
</script>
<template>
<div class="overview-dashboard">
 <div v-if="!platform" class="dashboard-metrics">
  <button @click="emit('tab','users')"><Users/><span>{{t('کاربران فعال','Active users')}}</span><strong>{{number(governance.users.filter(u=>u.active).length)}}</strong></button>
  <button @click="emit('tab','approvals')"><ClipboardCheck/><span>{{t('اصلاحات در انتظار','Pending changes')}}</span><strong>{{number(pending.length)}}</strong></button>
  <button @click="emit('tab','tickets')"><MessageSquare/><span>{{t('پیام‌های منتظر پاسخ','Awaiting response')}}</span><strong>{{number(ticketQueue.length)}}</strong></button>
  <RouterLink to="/admin/magazine"><BookOpenText/><span>{{t('مقالات منتشرشده','Published articles')}}</span><strong>{{number(articles.filter(a=>a.status==='published').length)}}</strong></RouterLink>
 </div>
 <div v-else class="dashboard-metrics">
  <button @click="emit('tab','bookings')"><CalendarDays/><span>{{t('نوبت‌های تأییدشده','Confirmed bookings')}}</span><strong>{{number(bookings.filter(b=>b.status==='confirmed').length)}}</strong></button>
  <button @click="emit('tab','slots')"><CalendarDays/><span>{{t('زمان‌های آزاد','Available slots')}}</span><strong>{{number(freeSlots.length)}}</strong></button>
  <button @click="emit('tab','doctors')"><Users/><span>{{t('متخصصان فعال','Active specialists')}}</span><strong>{{number(doctors.filter(d=>d.active).length)}}</strong></button>
  <button @click="emit('tab','wallet')"><Wallet/><span>{{t('درخواست‌های برداشت','Withdrawal requests')}}</span><strong>{{number(requests.filter(w=>w.status==='pending').length)}}</strong></button>
 </div>
 <div v-if="!platform" class="dashboard-previews">
  <section class="ops-panel"><header><h2>{{t('اصلاحات در انتظار','Awaiting approval')}}</h2><button @click="emit('tab','approvals')">{{t('مشاهده همه','View all')}}<ArrowUpLeft :size="16"/></button></header><button v-for="r in pending.slice(0,3)" :key="r.id" class="dashboard-row" @click="emit('tab','approvals')"><span><strong>{{r.title}}</strong><small>{{governance.users.find(u=>u.id===r.author)?.name}}</small></span><span class="status-pill pending">{{t('در انتظار','Pending')}}</span></button><p v-if="!pending.length" class="dashboard-empty">{{t('درخواست بررسی‌نشده‌ای ندارید','No pending requests')}}</p></section>
  <section class="ops-panel"><header><h2>{{t('صندوق ارتباط','Inbox')}}</h2><button @click="emit('tab','tickets')">{{t('مشاهده همه','View all')}}<ArrowUpLeft :size="16"/></button></header><button v-for="ticket in ticketQueue.slice(0,3)" :key="ticket.id" class="dashboard-row" @click="emit('tab','tickets')"><span><strong>{{ticket.subject}}</strong><small>{{ticket.name}}</small></span><span class="status-pill">{{t(ticket.status==='new'?'جدید':'در حال بررسی')}}</span></button><p v-if="!ticketQueue.length" class="dashboard-empty">{{t('پیامی در انتظار پاسخ نیست','No messages awaiting response')}}</p></section>
  <section class="ops-panel"><header><h2>{{t('مجله سلامت','Health journal')}}</h2><RouterLink to="/admin/magazine">{{t('مدیریت مقالات','Manage articles')}}<ArrowUpLeft :size="16"/></RouterLink></header><RouterLink v-for="a in articles.slice(0,3)" :key="a.id" class="dashboard-row" to="/admin/magazine"><span><strong>{{a.title}}</strong><small>{{a.category}}</small></span><span class="status-pill">{{t(a.status==='published'?'منتشرشده':'پیش‌نویس')}}</span></RouterLink></section>
  <section class="ops-panel"><header><h2>{{t('کاربران و نقش‌ها','Users and roles')}}</h2><button @click="emit('tab','users')">{{t('مدیریت کاربران','Manage users')}}<ArrowUpLeft :size="16"/></button></header><button v-for="u in governance.users.slice(0,3)" :key="u.id" class="dashboard-row" @click="emit('tab','users')"><span><strong>{{u.name}}</strong><small>{{u.email}}</small></span><span class="status-pill">{{t(u.role==='owner'?'مدیر اصلی':'ویرایشگر')}}</span></button></section>
 </div>
 <div v-else class="dashboard-previews">
  <section class="ops-panel"><header><h2>{{t('نوبت‌های پیش رو','Upcoming appointments')}}</h2><button @click="emit('tab','bookings')">{{t('همه نوبت‌ها','All appointments')}}<ArrowUpLeft :size="16"/></button></header><button v-for="b in upcoming" :key="b.id" class="dashboard-row" @click="emit('tab','bookings')"><span><strong>{{b.name}}</strong><small>{{doctorName(slotOf(b.slot)!.doctor)}} · {{dateLabel(slotOf(b.slot)!.date)}}</small></span><b>{{slotOf(b.slot)!.time}}</b></button><p v-if="!upcoming.length" class="dashboard-empty">{{t('نوبتی در انتظار برگزاری نیست','No upcoming appointments')}}</p></section>
  <section class="ops-panel"><header><h2>{{t('برنامه متخصصان','Specialist schedule')}}</h2><button @click="emit('tab','slots')">{{t('باز کردن تقویم','Open calendar')}}<ArrowUpLeft :size="16"/></button></header><button v-for="d in doctors.slice(0,4)" :key="d.id" class="dashboard-row" @click="emit('tab','slots')"><span><strong>{{d.name}}</strong><small>{{d.specialty}}</small></span><span>{{number(freeSlots.filter(s=>s.doctor===d.id).length)}} {{t('زمان آزاد','slots')}}</span></button></section>
  <section class="ops-panel"><header><h2>{{t('پروفایل متخصصان','Specialist profiles')}}</h2><button @click="emit('tab','doctors')">{{t('مدیریت متخصصان','Manage specialists')}}<ArrowUpLeft :size="16"/></button></header><button v-for="d in doctors.slice(0,3)" :key="d.id" class="dashboard-row" @click="emit('tab','doctors')"><span><strong>{{d.name}}</strong><small>{{d.specialty}}</small></span><span class="status-pill">{{t(d.active?'فعال':'غیرفعال')}}</span></button></section>
  <section class="ops-panel"><header><h2>{{t('خلاصه کیف پول','Wallet overview')}}</h2><button @click="emit('tab','wallet')">{{t('مشاهده کیف پول','View wallet')}}<ArrowUpLeft :size="16"/></button></header><div class="dashboard-wallet-total"><small>{{t('مجموع موجودی نمونه متخصصان','Total sample specialist balance')}}</small><strong>{{number(balance)}} {{t('تومان','toman')}}</strong></div><button v-for="w in requests.slice(0,2)" :key="w.id" class="dashboard-row" @click="emit('tab','wallet')"><span><strong>{{doctorName(w.doctor)}}</strong><small>{{t(({pending:'در انتظار',paid:'تسویه نمایشی',cancelled:'لغوشده'})[w.status])}}</small></span><b>{{number(w.amount)}}</b></button><p v-if="!requests.length" class="dashboard-empty">{{t('هنوز درخواست برداشتی ثبت نشده','No withdrawal requests yet')}}</p></section>
 </div>
 <section v-if="!platform" class="ops-panel"><header><h2>{{t('پلتفرم‌های خانواده','Family platforms')}}</h2><span>{{number(platforms.length)}} {{t('مسیر مراقبت','care paths')}}</span></header><div class="ops-platforms"><RouterLink v-for="p in platforms" :key="p.slug" :to="p.slug==='shop'?'/shop':'/admin/platforms/'+p.slug"><strong>{{t(p.name)}}</strong><span>{{t(p.eyebrow)}}</span><ArrowUpLeft :size="20"/></RouterLink></div></section>
</div>
</template>
