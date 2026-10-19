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
 await command('Runtime.enable');await command('Page.enable')
 await command('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false})
 await visit('/');await evaluate("localStorage.setItem('mehregan-language','fa')");await visit('/')
 assert.equal(await evaluate("getComputedStyle(document.querySelector('.brand-rail')).borderRadius"),'18px')
 assert.equal(await evaluate("getComputedStyle(document.querySelector('.global-links a')).fontSize"),'13px')
 const brandColors={}
 for(let i=0;i<5;i++){await click('#brand-tab-'+i);const [slug,color]=await evaluate("[document.querySelector('.universe-stage').className.match(/brand-([\\w-]+)/)[1],getComputedStyle(document.querySelector('.universe-stage')).getPropertyValue('--product').trim()]");brandColors[slug]=color;assert.equal(await evaluate("getComputedStyle(document.querySelector('.universe-tabs .active')).color"),await evaluate("getComputedStyle(document.querySelector('.product-wordmark')).color"))}
 for(const [slug,color] of Object.entries(brandColors)){if(slug==='shop')continue;await visit('/platforms/'+slug);assert.equal(await evaluate("getComputedStyle(document.querySelector('.brand-site')).getPropertyValue('--accent').trim()"),color);await visit('/admin/platforms/'+slug);assert.equal(await evaluate("getComputedStyle(document.querySelector('.ops-page')).getPropertyValue('--accent').trim()"),color)}
 console.log('PASS consistent platform palettes, larger menu and rail shape')
 for(const audience of ['general','doctor','organization']){await visit('/contact?audience='+audience);const layout=await evaluate(`(()=>{const field=document.querySelector('.attachment-field');const message=document.querySelector('textarea');const subject=[...document.querySelectorAll('.form-grid label')].find(l=>l.textContent.includes('موضوع پیام'));return {before:!!(field.compareDocumentPosition(message)&Node.DOCUMENT_POSITION_FOLLOWING),top:field.getBoundingClientRect().top,subject:subject.getBoundingClientRect().top}})()`);assert(layout.before);assert(layout.top>layout.subject)}
 await capture('contact-organization-layout.png',true)
 await visit('/platforms/physiopars#booking');await evaluate("document.querySelector('.appointment-flow').scrollIntoView({behavior:'instant'})");await wait(400)
 assert.equal(await evaluate("document.querySelectorAll('.portrait-doctors .doctor-portrait img').length"),4)
 await evaluate("Promise.all([...document.querySelectorAll('.doctor-portrait img')].map(i=>i.decode()))")
 await click('.portrait-doctors button:nth-child(2)');assert.equal(await evaluate("document.querySelector('.portrait-doctors button:nth-child(2)').getAttribute('aria-pressed')"),'true')
 await input('.doctor-browser-tools input','نام ناموجود');assert.equal(await evaluate("document.querySelectorAll('.portrait-doctors button').length"),0);await input('.doctor-browser-tools input','');await capture('doctor-picker.png')
 await visit('/shop');assert.equal(await evaluate("document.querySelectorAll('.product-price').length"),4)
 console.log('PASS attachment positions, doctor photos/search/selection and sample prices')
 await visit('/admin?tab=users');await clickText('.governance-panel button','افزودن کاربر');await input('.governance-form input','کاربر آزمایشی');await input('.governance-form input[type=email]','preview-'+Date.now()+'@example.com');await clickText('.governance-form button','ذخیره کاربر');assert(await evaluate("document.querySelector('.governance-panel').textContent.includes('کاربر آزمایشی')"))
 assert.equal(await evaluate("document.querySelectorAll('.demo-role-switch').length"),0)
 assert(await evaluate("document.querySelector('.user-role').textContent.includes('نقش کاربر')"))
 await visit('/admin?tab=approvals');assert.equal(await evaluate("document.querySelectorAll('.approval-table tbody tr').length"),4);await click('.approval-table tbody tr button');await clickText('.review-actions button','تأیید و اعمال');assert(await evaluate("document.querySelector('.approval-table tbody tr .status-pill').textContent.includes('تأییدشده')"));await visit('/admin?tab=approvals');assert.equal(await evaluate("document.querySelectorAll('.approval-table tbody tr').length"),4);await capture('admin-approvals.png')
 await visit('/admin');assert.equal(await evaluate("document.querySelectorAll('.dashboard-previews>section').length"),4);await capture('admin-dashboard.png')
 await visit('/admin?tab=tickets');assert(await evaluate("!!document.querySelector('.inbox-table')"))
 await visit('/platforms/shop/overview');assert(await evaluate("!!document.querySelector('.overview-products')"));assert(await evaluate("!!document.querySelector('img[src=\"/images/directory-shop.jpg\"]')"))
 await visit('/platforms/hydrotherapy/overview');assert(await evaluate("!!document.querySelector('img[src=\"/images/directory-hydrotherapy.jpg\"]')"))
 await visit('/shop');await evaluate("Promise.all([...document.querySelectorAll('.product-photograph')].map(i=>i.decode()))");await capture('shop-real-products.png')
 console.log('PASS role display, approval samples/apply/history, dashboard, inbox and overview/product images')
 await visit('/admin/platforms/physiopars');await clickText('.ops-sidebar button','کیف پول');await capture('doctor-wallet.png',true);const requestCount=await evaluate("document.querySelectorAll('.wallet-history article').length");await clickText('.wallet-panel form button','ثبت درخواست نمایشی');assert.equal(await evaluate("document.querySelectorAll('.wallet-history article').length"),requestCount+1);await clickText('.wallet-history button','لغو');assert(await evaluate("document.querySelector('.wallet-history').textContent.includes('لغوشده')"))
 await command('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});await wait(300);assert.equal(await evaluate('document.documentElement.scrollWidth>innerWidth'),false);await capture('wallet-mobile.png',true)
 await visit('/platforms/physiopars#booking');assert.equal(await evaluate('document.documentElement.scrollWidth>innerWidth'),false);assert(await evaluate("document.querySelector('.portrait-doctors').scrollWidth>document.querySelector('.portrait-doctors').clientWidth"));await evaluate("document.querySelector('.appointment-flow').scrollIntoView({behavior:'instant'})");await wait(300);await capture('doctors-mobile.png');assert.equal(await evaluate("document.querySelectorAll('.doctor-demo-label').length"),0);const before=await evaluate("document.querySelector('.portrait-doctors').scrollLeft");await click('.doctor-carousel>button:last-child');await wait(700);assert.notEqual(await evaluate("document.querySelector('.portrait-doctors').scrollLeft"),before)
 assert.deepEqual(browserErrors,[]);console.log('PASS mock withdrawal/cancellation, mobile overflow and scrollable doctor list; no runtime exceptions')
} finally {socket.close()}
