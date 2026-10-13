<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from 'vue'
import { ArrowLeft, ArrowRight, Check, CalendarDays, UserRound } from 'lucide-vue-next'
import { state, occupied, future, book, dateLabel, storageError } from '../operations'
const props=defineProps<{platform:string;preferredDoctor?:string;request?:number}>()
const doctors=computed(()=>state.doctors.filter(d=>d.platform===props.platform&&d.active))
const doctor=ref(''),day=ref(''),selected=ref(''),step=ref(1),error=ref(''),confirmation=ref('')
const form=reactive({name:'',phone:'',note:''})
watch(()=>[props.preferredDoctor,props.request] as const,([value])=>{if(value){doctor.value=value;step.value=1;confirmation.value=''}},{immediate:true})
watch(doctors,value=>{if(!value.some(d=>d.id===doctor.value))doctor.value=value[0]?.id||''},{immediate:true})
const available=computed(()=>state.slots.filter(s=>s.platform===props.platform&&s.doctor===doctor.value&&future(s)&&!s.blocked).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)))
const dates=computed(()=>[...new Set(available.value.map(s=>s.date))])
watch(doctor,()=>{day.value='';selected.value=''})
const activeDay=computed(()=>day.value||dates.value[0]||'')
const slots=computed(()=>available.value.filter(s=>s.date===activeDay.value))
const chosen=computed(()=>state.slots.find(s=>s.id===selected.value))
const booking=computed(()=>state.bookings.find(b=>b.id===confirmation.value))
const bookedSlot=computed(()=>state.slots.find(s=>s.id===booking.value?.slot))
const title=ref<HTMLElement>()
async function next(){error.value='';if(!chosen.value||occupied(chosen.value.id)||!future(chosen.value)){error.value='یک زمان آزاد انتخاب کنید.';return}step.value=2;await nextTick();title.value?.focus()}
async function reserve(){error.value='';try{confirmation.value=book(selected.value,form.name,form.phone,form.note).id;step.value=3;await nextTick();title.value?.focus()}catch(e){error.value=(e as Error).message;step.value=1;selected.value=''}}
function cancel(){if(booking.value&&confirm('این نوبت لغو شود؟'))booking.value.status='cancelled'}
function restart(){confirmation.value='';selected.value='';form.name='';form.phone='';form.note='';step.value=1}
</script>
<template>
<div class="appointment-flow">
 <ol class="flow-progress" aria-label="مراحل رزرو"><li v-for="(label,index) in ['انتخاب نوبت','مشخصات شما','تأیید نهایی']" :key="label" :class="{current:step===index+1,complete:step>index+1}" :aria-current="step===index+1?'step':undefined"><span><Check v-if="step>index+1" :size="15"/><template v-else>{{(index+1).toLocaleString('fa-IR')}}</template></span>{{label}}</li></ol>
 <Transition name="flow" mode="out-in">
 <section v-if="step===1" key="choose" class="flow-stage"><h3 ref="title" tabindex="-1">با کدام متخصص شروع می‌کنید؟</h3><p class="flow-hint">ابتدا متخصص، سپس روز و ساعت مناسب خود را انتخاب کنید.</p><div class="booking-doctors" role="group" aria-label="انتخاب متخصص"><button v-for="d in doctors" :key="d.id" type="button" :class="{selected:doctor===d.id}" :aria-pressed="doctor===d.id" @click="doctor=d.id"><UserRound :size="23"/><span><strong>{{d.name}}</strong><small>{{d.specialty}}</small></span><Check v-if="doctor===d.id" :size="16"/></button></div><p v-if="!doctors.length" class="empty-state">هنوز متخصص فعالی معرفی نشده است.</p><div class="date-choices" role="group" aria-label="انتخاب روز"><button v-for="date in dates" :key="date" type="button" :class="{active:date===activeDay}" :aria-pressed="date===activeDay" @click="day=date;selected=''">{{dateLabel(date)}}</button></div><Transition name="flow" mode="out-in"><div :key="doctor+activeDay" class="slot-choices"><button v-for="s in slots" :key="s.id" type="button" :disabled="occupied(s.id)" :class="{active:selected===s.id}" :aria-pressed="selected===s.id" @click="selected=s.id"><strong>{{s.time}}</strong><small>{{occupied(s.id)?'رزروشده':s.mode+' · '+s.duration.toLocaleString('fa-IR')+' دقیقه'}}</small></button><p v-if="!slots.length" class="flow-hint">برای این متخصص هنوز زمان آزادی ثبت نشده است؛ متخصص دیگری را انتخاب کنید.</p></div></Transition><div v-if="chosen" class="booking-summary"><CalendarDays :size="18"/><span>{{dateLabel(chosen.date)}} · {{chosen.time}}</span><b>{{chosen.price.toLocaleString('fa-IR')}} تومان</b></div><button type="button" class="button brand-button reserve-button" :disabled="!chosen" @click="next">ادامه؛ مشخصات مراجعه‌کننده<ArrowLeft :size="18"/></button></section>
 <form v-else-if="step===2" key="details" class="flow-stage" @submit.prevent="reserve"><button type="button" class="flow-back" @click="step=1"><ArrowRight :size="16"/>تغییر متخصص یا زمان</button><h3 ref="title" tabindex="-1">کمی بیشتر با شما آشنا شویم.</h3><div v-if="chosen" class="booking-summary"><span>{{state.doctors.find(d=>d.id===chosen?.doctor)?.name}}<br>{{dateLabel(chosen.date)}} · {{chosen.time}}</span><b>{{chosen.price.toLocaleString('fa-IR')}} تومان</b></div><div class="form-grid"><label><span>نام و نام خانوادگی *</span><input v-model.trim="form.name" required autocomplete="name"/></label><label><span>شماره همراه *</span><input v-model.trim="form.phone" required inputmode="tel" pattern="[0-9۰-۹٠-٩+\-\s]{8,18}" autocomplete="tel"/></label><label class="form-full"><span>چه چیزی را پیش از ملاقات با متخصص در میان می‌گذارید؟</span><textarea v-model.trim="form.note" rows="4" placeholder="نوشتن این توضیح اختیاری است."/></label></div><button class="button brand-button reserve-button" type="submit">تأیید و ثبت نوبت<Check :size="18"/></button></form>
 <section v-else key="success" class="flow-stage booking-confirmation" role="status"><span class="confirmation-check"><Check :size="34"/></span><h3 ref="title" tabindex="-1">{{booking?.status==='cancelled'?'نوبت شما لغو شد.':'قرار ما، یک قدم برای حال بهتر.'}}</h3><p>{{booking?.status==='cancelled'?'می‌توانید زمان مناسب دیگری انتخاب کنید.':'نوبت شما با موفقیت ثبت شد؛ کد پیگیری را نگه دارید.'}}</p><div class="confirmation-code">کد پیگیری <b dir="ltr">{{booking?.id.slice(0,8)}}</b></div><p v-if="bookedSlot">{{state.doctors.find(d=>d.id===bookedSlot?.doctor)?.name}}<br>{{dateLabel(bookedSlot.date)}} · {{bookedSlot.time}}</p><div class="confirmation-actions"><button v-if="booking?.status==='confirmed'" class="button button-ghost" @click="cancel">لغو نوبت</button><button class="button brand-button" @click="restart">انتخاب نوبت جدید</button></div></section>
 </Transition><p v-if="error||storageError" role="alert" class="editor-error">{{error||storageError}}</p>
</div>
</template>
