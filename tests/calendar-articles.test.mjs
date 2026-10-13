import assert from 'node:assert/strict'
import {build} from 'esbuild'
async function moduleFrom(path){const {outputFiles}=await build({entryPoints:[path],bundle:true,format:'esm',write:false});return import('data:text/javascript;base64,'+Buffer.from(outputFiles[0].text).toString('base64'))}
const {monthStart,moveMonth,monthDays,weekStart,shiftDate,persianDay}=await moduleFrom('src/calendarDates.ts')
let anchor='2026-10-12'
for(let i=0;i<30;i++) {const start=monthStart(anchor);assert.equal(persianDay(start),1);const next=moveMonth(start,1);assert.equal(moveMonth(next,-1),start);const days=monthDays(start);assert.equal(days.length%7,0);assert.equal(new Date(days[0]+'T12:00:00').getDay(),6);assert.equal(new Set(days).size,days.length);assert.ok(days.includes(start));assert.ok(days.includes(shiftDate(next,-1)));assert.equal(weekStart(start),days[0]);anchor=next}
const {parseArticle}=await moduleFrom('src/articleStructure.ts')
const blocks=parseArticle('## عنوان\nیک پاراگراف\n\n### زیرعنوان\n\n<script>alert(1)</script>')
assert.deepEqual(blocks.map(b=>b.kind),['h2','p','h3','p']);assert.equal(new Set(blocks.filter(b=>b.id).map(b=>b.id)).size,2);assert.equal(blocks[3].text,'<script>alert(1)</script>')
console.log('PASS: 30 Persian month boundaries, Saturday-first grids, week alignment, article headings and plain-text content')
