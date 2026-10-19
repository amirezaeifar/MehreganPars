import { governance, snapshot, type Review } from './governance'
import { state } from './operations'
import { useArticles } from './store'

// Seed the requested approval mockups once; never replace existing submissions or public content.
export function ensureApprovalSamples(){
 if(governance.sampleVersion===1)return
 const article=useArticles().articles.value[0],doctor=state.doctors[0]
 const ago=(hours:number)=>new Date(Date.now()-hours*3600000).toISOString()
 const samples:Review[]=[]
 if(article)samples.push({id:'sample-review-article',kind:'article',target:article.id,title:'بازنگری خلاصه مقاله «'+article.title+'»',payload:{...article,excerpt:article.excerpt+' راهنمایی برای انتخاب آگاهانه و ادامه مسیر مراقبت.'},before:snapshot(article),author:'editor',status:'pending',created:ago(3),sample:true})
 if(doctor)samples.push({id:'sample-review-doctor',kind:'doctor',target:doctor.id,title:'تکمیل معرفی '+doctor.name,payload:{...doctor,bio:doctor.bio+' توجه به هدف‌های فردی و پیگیری منظم پیشرفت.'},before:snapshot(doctor),author:'editor',status:'pending',created:ago(7),sample:true})
 samples.push({id:'sample-review-history',kind:'article',target:'sample-history',title:'اصلاح دسته‌بندی مقاله آموزشی',payload:{category:'فیزیوتراپی'},before:snapshot({category:'سبک زندگی'}),author:'editor',status:'approved',created:ago(48),reviewedAt:ago(24),reviewedBy:'owner',sample:true}, {id:'sample-review-rejected',kind:'doctor',target:'sample-history-doctor',title:'بازنگری اطلاعات تخصص برای تکمیل مستندات',payload:{specialty:'طب ورزشی'},before:snapshot({specialty:'پزشکی عمومی'}),author:'editor',status:'rejected',created:ago(72),reviewedAt:ago(50),reviewedBy:'owner',note:'برای بررسی دوباره، مستندات تخصص تکمیل شود.',sample:true})
 for(const item of samples)if(!governance.reviews.some(r=>r.id===item.id))governance.reviews.push(item)
 governance.sampleVersion=1
}
