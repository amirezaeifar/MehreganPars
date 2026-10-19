<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Wallet, ArrowUpLeft, Clock3 } from 'lucide-vue-next'
import { state } from '../operations'
import { governance, demoBalance, requestWithdrawal } from '../governance'
import { t, locale } from '../i18n'
const props=defineProps<{platform:string}>()
const doctors=computed(()=>state.doctors.filter(d=>d.platform===props.platform))
const doctor=ref(''),amount=ref(1000000),iban=ref('IR000000000000000000000000'),notice=ref('')
watch(doctors,ds=>{doctor.value=ds[0]?.id||'';notice.value=''},{immediate:true})
const balance=computed(()=>demoBalance(doctor.value))
const requests=computed(()=>governance.withdrawals.filter(w=>w.doctor===doctor.value))
const pending=computed(()=>requests.value.filter(w=>w.status==='pending').reduce((a,w)=>a+w.amount,0))
const estimated=computed(()=>state.bookings.filter(b=>b.status==='confirmed').reduce((total,b)=>{const slot=state.slots.find(s=>s.id===b.slot&&s.doctor===doctor.value);return total+(slot?.price||0)},0))
const money=(n:number)=>n.toLocaleString(locale())+' '+t('تومان','toman')
function submit(){try{requestWithdrawal(doctor.value,amount.value,iban.value);notice.value=t('درخواست نمایشی ثبت شد؛ هیچ انتقال بانکی انجام نمی‌شود','Demo request recorded; no bank transfer is performed')}catch(e){notice.value=(e as Error).message}}
</script>
<template>
<section class="ops-panel wallet-panel"><div class="ops-panel-title"><h2><Wallet :size="23"/> {{t('کیف پول متخصص','Specialist wallet')}}</h2><label>{{t('متخصص','Specialist')}}<select v-model="doctor"><option v-for="d in doctors" :key="d.id" :value="d.id">{{d.name}}</option></select></label></div>

<template v-if="doctor"><div class="wallet-stats"><article class="wallet-balance"><Wallet :size="28"/><span>{{t('موجودی نمونه قابل برداشت','Demo available balance')}}</span><strong>{{money(balance)}}</strong></article><article><Clock3 :size="24"/><span>{{t('در انتظار تسویه نمایشی','Pending demo payout')}}</span><strong>{{money(pending)}}</strong></article><article><span>{{t('مبلغ نوبت‌های رزروشده','Booked appointment value')}}</span><strong>{{money(estimated)}}</strong><small>{{t('برآورد رزرو؛ به معنی دریافت وجه نیست','Booking estimate; not received funds')}}</small></article></div>
<div class="wallet-layout"><form class="governance-form" @submit.prevent="submit"><h3>{{t('درخواست برداشت','Request withdrawal')}}</h3><label>{{t('مبلغ (تومان)','Amount (toman)')}}<input v-model.number="amount" type="number" min="100000" :max="balance" step="1000" required/></label><label>{{t('شماره شبای نمونه','Demo IBAN')}}<input v-model.trim="iban" dir="ltr" pattern="IR[0-9]{24}" required maxlength="26"/></label><small>{{t('حداقل برداشت نمونه: ۱۰۰ هزار تومان','Minimum demo withdrawal: 100,000 toman')}}</small><button class="button brand-button" :disabled="balance<100000||!!pending">{{t('ثبت درخواست نمایشی','Submit demo request')}}<ArrowUpLeft :size="17"/></button><p role="status">{{notice}}</p></form><div class="wallet-history"><h3>{{t('تاریخچه درخواست‌ها','Request history')}}</h3><p v-if="!requests.length">{{t('هنوز درخواست برداشتی ندارید','No withdrawal requests yet')}}</p><article v-for="w in requests" :key="w.id"><div><strong>{{money(w.amount)}}</strong><small>{{new Date(w.created).toLocaleDateString(locale())}} · {{w.id.slice(0,8)}}</small><span>{{t(({pending:'در انتظار بررسی',paid:'تسویه نمایشی',cancelled:'لغوشده'})[w.status])}}</span></div><div v-if="w.status==='pending'"><button @click="w.status='paid'">{{t('شبیه‌سازی تسویه','Simulate payout')}}</button><button @click="w.status='cancelled'">{{t('لغو','Cancel')}}</button></div></article></div></div></template><p v-else>{{t('ابتدا یک متخصص اضافه کنید','Add a specialist first')}}</p></section>
</template>
