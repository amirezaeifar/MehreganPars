import assert from 'node:assert/strict'
import { build } from 'esbuild'
const { outputFiles } = await build({ entryPoints: ['src/operations.ts'], bundle:true, platform:'node',format:'esm',write:false })
const values=new Map(); globalThis.localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)}
const {state,book,occupied,saveSlot,uid}=await import('data:text/javascript;base64,'+Buffer.from(outputFiles[0].text).toString('base64'))
const baseline=state.bookings.length
assert.equal(state.doctors.length,20)
const slot=state.slots[0]
const b=book(slot.id,'Test Patient','09123456789','Follow-up')
assert.equal(occupied(slot.id),true)
assert.throws(()=>book(slot.id,'Duplicate','09123456789',''))
assert.throws(()=>saveSlot({...slot,time:'12:00'}))
b.status='cancelled';assert.equal(occupied(slot.id),false)
assert.doesNotThrow(()=>book(slot.id,'Next patient','09123456789',''))
assert.throws(()=>saveSlot({...slot,id:uid(),time:'10:15'}))
assert.throws(()=>saveSlot({...slot,id:uid(),date:'2000-01-01'}))
const blocked=state.slots[1];blocked.blocked=true
assert.throws(()=>book(blocked.id,'Test','09123456789',''))
blocked.blocked=false;state.doctors.find(d=>d.id===blocked.doctor).active=false
assert.throws(()=>book(blocked.id,'Test','09123456789',''))
const another=state.slots.find(s=>s.doctor!==slot.doctor)
assert.doesNotThrow(()=>saveSlot({...another,id:uid(),time:'18:00'}))
await new Promise(r=>setTimeout(r,0))
assert.equal(JSON.parse(values.get('mehregan-operations-v1')).bookings.length,baseline+2)
console.log('PASS: booking, duplicate prevention, cancellation, occupied-slot editing, overlap, past times, blocked slots, inactive doctors, independent schedules and persistence')
