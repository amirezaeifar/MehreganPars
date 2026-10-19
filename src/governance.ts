import { computed, reactive, ref, watch } from 'vue'

export type AdminRole = 'owner' | 'editor'
export interface AdminUser { id:string; name:string; email:string; role:AdminRole; active:boolean }
export type ChangeKind = 'article' | 'article-delete' | 'doctor' | 'slot' | 'ticket' | 'booking'
export interface Review { id:string; kind:ChangeKind; target:string; title:string; payload:any; before:string; author:string; status:'pending'|'approved'|'rejected'; created:string; reviewedBy?:string; reviewedAt?:string; note?:string; sample?:boolean }
export interface Withdrawal { id:string; doctor:string; amount:number; iban:string; status:'pending'|'paid'|'cancelled'; created:string }
const defaults = () => ({ users:[{id:'owner',name:'امیر رضایی',email:'owner@example.com',role:'owner' as AdminRole,active:true},{id:'editor',name:'ویرایشگر نمونه',email:'editor@example.com',role:'editor' as AdminRole,active:true}], reviews:[] as Review[], withdrawals:[] as Withdrawal[], sampleVersion:0 })
function load(){try{const saved=JSON.parse(localStorage.getItem('mehregan-governance-demo-v1')||'null');if(saved&&Array.isArray(saved.users)&&saved.users.some((u:AdminUser)=>u.active&&u.role==='owner')&&Array.isArray(saved.reviews)&&Array.isArray(saved.withdrawals))return saved as ReturnType<typeof defaults>}catch{}return defaults()}
export const governance=reactive(load())
const defaultOwner=governance.users.find(u=>u.id==='owner'&&u.name==='مدیر اصلی')
if(defaultOwner)defaultOwner.name='امیر رضایی'
export const governanceError=ref('')
export const actingUser=ref('owner')
export const currentAdmin=computed(()=>governance.users.find(u=>u.id===actingUser.value&&u.active))
export const isOwner=computed(()=>currentAdmin.value?.role==='owner')
watch(governance,value=>{try{localStorage.setItem('mehregan-governance-demo-v1',JSON.stringify(value));governanceError.value=''}catch{governanceError.value='ذخیره‌سازی مرورگر انجام نشد؛ تغییرات ماندگار نیستند.'}},{deep:true})
export const snapshot=(value:unknown)=>JSON.stringify(value??null)
export function requireOwner(){if(!isOwner.value)throw new Error('این عملیات فقط برای مدیر اصلی است.')}
export function saveUser(user:AdminUser){requireOwner();if(!user.name.trim()||!/^\S+@\S+\.\S+$/.test(user.email))throw new Error('نام و ایمیل معتبر وارد کنید.');if(governance.users.some(u=>u.id!==user.id&&u.email.toLowerCase()===user.email.toLowerCase()))throw new Error('ایمیل تکراری است.');const old=governance.users.find(u=>u.id===user.id);if(old?.role==='owner'&&old.active&&(!user.active||user.role!=='owner')&&!governance.users.some(u=>u.id!==user.id&&u.active&&u.role==='owner'))throw new Error('حداقل یک مدیر اصلی فعال لازم است.');if(old)Object.assign(old,user);else governance.users.push({...user})}
export function queueChange(kind:ChangeKind,target:string,title:string,payload:unknown,before:unknown){
 if(!currentAdmin.value)throw new Error('یک کاربر فعال انتخاب کنید.')
 if(isOwner.value)return false
 if(governance.reviews.some(r=>r.status==='pending'&&r.kind===kind&&r.target===target))throw new Error('برای این مورد یک تغییر در انتظار بررسی وجود دارد.')
 governance.reviews.unshift({id:crypto.randomUUID(),kind,target,title,payload:JSON.parse(snapshot(payload)),before:snapshot(before),author:currentAdmin.value.id,status:'pending',created:new Date().toISOString()});return true
}
export function resolveReview(review:Review,approve:boolean,current:unknown,apply:()=>void,note=''){
 requireOwner();if(review.status!=='pending')throw new Error('این درخواست قبلاً بررسی شده است.')
 if(approve){if(snapshot(current)!==review.before)throw new Error('اطلاعات اصلی تغییر کرده؛ درخواست را رد و نسخه تازه ارسال کنید.');apply()}
 review.status=approve?'approved':'rejected';review.reviewedBy=currentAdmin.value!.id;review.reviewedAt=new Date().toISOString();review.note=note
}
// All wallet amounts are explicitly fictional. No payment or bank API is called.
export function demoBalance(doctor:string){return 4800000-governance.withdrawals.filter(w=>w.doctor===doctor&&w.status!=='cancelled').reduce((sum,w)=>sum+w.amount,0)}
export function requestWithdrawal(doctor:string,amount:number,iban:string){
 if(!doctor||!Number.isSafeInteger(amount)||amount<100000||amount>demoBalance(doctor))throw new Error('مبلغ باید بین ۱۰۰ هزار تومان و موجودی قابل برداشت باشد.')
 const normalized=iban.replace(/\s/g,'').toUpperCase();if(!/^IR\d{24}$/.test(normalized))throw new Error('شبای نمونه را با IR و ۲۴ رقم وارد کنید.')
 if(governance.withdrawals.some(w=>w.doctor===doctor&&w.status==='pending'))throw new Error('یک درخواست در انتظار دارید؛ ابتدا آن را بررسی یا لغو کنید.')
 const item:Withdrawal={id:crypto.randomUUID(),doctor,amount,iban:normalized,status:'pending',created:new Date().toISOString()};governance.withdrawals.unshift(item);return item
}
