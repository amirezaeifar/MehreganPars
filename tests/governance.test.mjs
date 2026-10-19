import assert from 'node:assert/strict'
import { build } from 'esbuild'
const {outputFiles}=await build({stdin:{contents:"export * from './src/governance'; export * from './src/store';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false})
const values=new Map();globalThis.localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)}
const g=await import('data:text/javascript;base64,'+Buffer.from(outputFiles[0].text).toString('base64'))
const {articles,save,remove}=g.useArticles()
const original={...articles.value[0]},proposed={...original,title:'Pending editorial revision'}
g.actingUser.value='editor'
assert.equal(save(proposed),true)
assert.equal(articles.value[0].title,original.title)
const review=g.governance.reviews[0]
assert.throws(()=>save(proposed),/انتظار/)
assert.throws(()=>g.resolveReview(review,true,original,()=>save(proposed)),/مدیر/)
assert.throws(()=>g.saveUser({id:'x',name:'Test',email:'test@example.com',role:'owner',active:true}),/مدیر/)
g.actingUser.value='owner'
assert.throws(()=>g.resolveReview(review,true,{...original,title:'Concurrent edit'},()=>save(proposed)),/تغییر کرده/)
assert.equal(review.status,'pending')
g.resolveReview(review,true,articles.value[0],()=>save(proposed))
assert.equal(articles.value[0].title,proposed.title)
assert.throws(()=>g.resolveReview(review,true,proposed,()=>save(proposed)),/قبلاً/)
g.actingUser.value='editor';assert.equal(remove(original.id),true);assert(articles.value.some(a=>a.id===original.id))
g.actingUser.value='owner';g.resolveReview(g.governance.reviews[0],false,proposed,()=>assert.fail('rejected changes cannot apply'))
assert(articles.value.some(a=>a.id===original.id))
assert.throws(()=>g.saveUser({...g.governance.users[0],active:false}),/حداقل/)
g.saveUser({id:'new-editor',name:'New editor',email:'new@example.com',role:'editor',active:true})
assert.throws(()=>g.saveUser({id:'duplicate',name:'Duplicate',email:'NEW@example.com',role:'editor',active:true}),/تکراری/)
g.actingUser.value='new-editor';g.governance.users.find(u=>u.id==='new-editor').active=false
assert.throws(()=>g.queueChange('doctor','test','Profile',{},null),/فعال/)
const iban='IR'+'0'.repeat(24)
assert.throws(()=>g.requestWithdrawal('d',NaN,iban))
assert.throws(()=>g.requestWithdrawal('d',-10,iban))
assert.throws(()=>g.requestWithdrawal('d',5000000,iban))
assert.throws(()=>g.requestWithdrawal('d',100000,'invalid'))
const withdrawal=g.requestWithdrawal('d',1000000,iban)
assert.equal(g.demoBalance('d'),3800000)
assert.throws(()=>g.requestWithdrawal('d',1000000,iban),/انتظار/)
assert.equal(g.demoBalance('other-doctor'),4800000)
withdrawal.status='cancelled';assert.equal(g.demoBalance('d'),4800000)
const paid=g.requestWithdrawal('d',1000000,iban);paid.status='paid';assert.equal(g.demoBalance('d'),3800000)
await new Promise(r=>setTimeout(r,0))
assert.equal(JSON.parse(values.get('mehregan-governance-demo-v1')).reviews.length,2)
console.log('PASS: approval gating, rejection, stale/repeated approvals, user roles, last owner, duplicate users, demo wallet validation, isolation and persistence')
