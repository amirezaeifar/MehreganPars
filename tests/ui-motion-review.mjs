// Run against a local preview and a headless Chromium browser with CDP enabled.
// UI_BASE_URL and UI_CDP_URL override the defaults; UI_SCREENSHOTS is optional.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const base = process.env.UI_BASE_URL || 'http://127.0.0.1:5181'
const tabs = await (await fetch((process.env.UI_CDP_URL || 'http://127.0.0.1:9226') + '/json')).json()
const socket = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl)
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject })
let sequence = 0
const pending = new Map(), browserErrors = []
socket.onmessage = event => {
  const message = JSON.parse(event.data)
  if (message.id) {
    const request = pending.get(message.id)
    pending.delete(message.id)
    message.error ? request.reject(message.error) : request.resolve(message.result)
  } else if (message.method === 'Runtime.exceptionThrown') browserErrors.push(message.params.exceptionDetails.text)
}
const command = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence
  pending.set(id, { resolve, reject })
  socket.send(JSON.stringify({ id, method, params }))
})
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
async function evaluate(expression) {
  const response = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text)
  return response.result.value
}
async function visit(route) {
  await command('Page.navigate', { url: base + route })
  for (let attempt = 0; attempt < 50; attempt++) {
    await wait(150)
    if (await evaluate("document.readyState==='complete' && !!document.querySelector('h1')")) { await wait(250); return }
  }
  throw new Error('Navigation timed out: ' + route)
}
async function click(selector) { await evaluate('document.querySelector(' + JSON.stringify(selector) + ').click()'); await wait(450) }
async function input(selector, value) {
  await evaluate('(()=>{const el=document.querySelector(' + JSON.stringify(selector) + ');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(el,' + JSON.stringify(value) + ');el.dispatchEvent(new Event("input",{bubbles:true}))})()')
  await wait(120)
}
async function capture(name, full = false) {
  if (!process.env.UI_SCREENSHOTS) return
  await wait(800)
  const { cssContentSize } = await command('Page.getLayoutMetrics')
  const clip = full ? { x: 0, y: 0, width: cssContentSize.width, height: cssContentSize.height, scale: 1 } : undefined
  const result = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full, ...(clip ? { clip } : {}) })
  fs.writeFileSync(path.join(process.env.UI_SCREENSHOTS, name), Buffer.from(result.data, 'base64'))
}
async function select(selector,value){await evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('change',{bubbles:true}))})()`);await wait(150)}
async function clickText(selector,text){await evaluate(`([...document.querySelectorAll(${JSON.stringify(selector)})].find(el=>el.textContent.includes(${JSON.stringify(text)}))).click()`);await wait(180)}
try {
 await command('Runtime.enable');await command('Page.enable');await command('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await visit('/');
 const start=await evaluate("document.querySelector('.global-links .sliding-indicator').style.transform");await click('.global-links a[href="/about"]');await wait(600);assert.notEqual(await evaluate("document.querySelector('.global-links .sliding-indicator').style.transform"),start);
 await visit('/');const tab=await evaluate("document.querySelector('.universe-tabs .sliding-indicator').style.transform");await click('#brand-tab-2');await wait(600);assert.notEqual(await evaluate("document.querySelector('.universe-tabs .sliding-indicator').style.transform"),tab);await evaluate("document.querySelector('.universe-tabs').scrollIntoView()");await capture('platform-palette-motion.png');
 await visit('/shop');assert.equal(await evaluate("document.querySelectorAll('.store-category-grid button>svg').length"),0);
 await visit('/admin');assert(await evaluate("document.querySelector('.user-role').textContent.includes('امیر رضایی')"));const labels=await evaluate("[...document.querySelectorAll('.ops-sidebar nav:first-of-type>*')].map(x=>x.textContent.replace(/[0-9۰-۹]/g,'').trim())");assert.deepEqual(labels,['نمای کلی','صندوق ارتباط','تأیید اصلاحات','مجله سلامت','کاربران']);
 await visit('/platforms/physiopars');await evaluate("Promise.all([...document.querySelectorAll('.doctor-profile-top img')].map(i=>i.decode()))");assert.equal(await evaluate("document.querySelectorAll('.doctor-profile-top img').length"),4);await evaluate("document.querySelector('#doctors').scrollIntoView()");await capture('specialist-card-photos.png');
 await command('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});await visit('/');assert.equal(await evaluate('document.documentElement.scrollWidth>innerWidth'),false);await command('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});assert.equal(await evaluate("getComputedStyle(document.querySelector('.sliding-indicator')).transitionDuration"),'0s');assert.deepEqual(browserErrors,[]);console.log('PASS navigation and ecosystem moving indicators, reduced motion, admin name/order, category icons, doctor photos and mobile width')
} finally {socket.close()}
