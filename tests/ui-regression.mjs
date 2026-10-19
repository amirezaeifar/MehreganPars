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
async function click(selector) { await evaluate('document.querySelector(' + JSON.stringify(selector) + ').click()'); await wait(120) }
async function input(selector, value) {
  await evaluate('(()=>{const el=document.querySelector(' + JSON.stringify(selector) + ');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(el,' + JSON.stringify(value) + ');el.dispatchEvent(new Event("input",{bubbles:true}))})()')
  await wait(120)
}
async function capture(name, full = false) {
  if (!process.env.UI_SCREENSHOTS) return
  const { cssContentSize } = await command('Page.getLayoutMetrics')
  const clip = full ? { x: 0, y: 0, width: cssContentSize.width, height: cssContentSize.height, scale: 1 } : undefined
  const result = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full, ...(clip ? { clip } : {}) })
  fs.writeFileSync(path.join(process.env.UI_SCREENSHOTS, name), Buffer.from(result.data, 'base64'))
}
const pdf = path.join(os.tmpdir(), 'mehregan-attachment-check.pdf')
try {
  await command('Runtime.enable'); await command('Page.enable')
  await command('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
  await visit('/')
  await evaluate("localStorage.setItem('mehregan-language','fa')")
  await visit('/')
  const persian = await evaluate("document.querySelector('h1').innerText")
  for (let i = 0; i < 2; i++) {
    await click('.locale-button')
    assert.equal(await evaluate('document.documentElement.lang'), 'en')
    assert.match(await evaluate("document.querySelector('h1').innerText"), /By your side/)
    assert.equal(await evaluate("document.querySelector('.locale-button span').innerText"), 'English')
    await click('.locale-button')
    assert.equal(await evaluate("document.querySelector('h1').innerText"), persian)
  }
  assert.equal(await evaluate('!!document.querySelector(\'.global-links a[href="/shop"]\')'), false)
  await click('#brand-tab-4')
  assert.equal(await evaluate('!!document.querySelector(\'.shop-phone .app-visit a[href="/shop"]\')'), true)
  console.log('PASS language round trips, current-language label, main menu and shop phone')
  await visit('/platforms')
  const cards = await evaluate("Array.from(document.querySelectorAll('.family-card')).map(e=>({y:Math.round(e.getBoundingClientRect().y),width:e.getBoundingClientRect().width,featured:e.classList.contains('family-featured')}))")
  assert.equal(cards[3].y, cards[4].y)
  assert.equal(cards[4].featured, false)
  assert.equal(cards[5].featured, true)
  assert.ok(cards[5].width > cards[4].width * 1.8)
  await visit('/about')
  const grid = await evaluate("Array.from(document.querySelectorAll('.about-path-grid>a')).map(e=>({x:Math.round(e.getBoundingClientRect().x),y:Math.round(e.getBoundingClientRect().y)}))")
  assert.equal(new Set(grid.map(row => row.x)).size, 3)
  assert.equal(new Set(grid.map(row => row.y)).size, 2)
  console.log('PASS directory card order and three-column about grid')
  await visit('/shop')
  assert.equal(await evaluate("!!document.querySelector('.global-header')"), false)
  assert.equal(await evaluate("document.querySelectorAll('.shop-header,.shop-footer').length"), 2)
  assert.equal(await evaluate("document.querySelectorAll('.store-product-card').length"), 4)
  await capture('shop-desktop.png', true)
  await input('.shop-search input', 'گردن')
  assert.equal(await evaluate("document.querySelectorAll('.store-product-card').length"), 1)
  await evaluate('document.querySelector(".shop-search").dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}))')
  await wait(120)
  assert.equal(await evaluate("document.querySelectorAll('.store-product-card').length"), 1)
  await click('.product-detail-button')
  assert.equal(await evaluate("!!document.querySelector('.kit-contents')"), true)
  await input('.shop-search input', 'zzzzz')
  assert.equal(await evaluate("!!document.querySelector('.store-empty')"), true)
  await click('.store-empty button')
  assert.equal(await evaluate("document.querySelectorAll('.store-product-card').length"), 4)
  await click('.store-category-grid button:nth-child(3)')
  assert.equal(await evaluate("document.querySelectorAll('.store-product-card').length"), 1)
  console.log('PASS storefront search, filters, product previews and empty results')
  await visit('/contact')
  fs.writeFileSync(pdf, '%PDF-1.4\n%%EOF')
  const dom = await command('DOM.getDocument')
  const fileInput = await command('DOM.querySelector', { nodeId: dom.root.nodeId, selector: '.upload-zone input' })
  await command('DOM.setFileInputFiles', { nodeId: fileInput.nodeId, files: [pdf] })
  await wait(150)
  assert.equal(await evaluate("document.querySelector('.upload-copy strong').innerText"), path.basename(pdf))
  await evaluate("document.querySelector('.attachment-field').scrollIntoView({block:'center'})")
  await wait(150); await capture('contact-upload.png')
  await click('.remove-attachment')
  assert.equal(await evaluate("document.querySelector('.upload-zone input').files.length"), 0)
  console.log('PASS attachment selection, selected-file display and removal')
  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await visit('/shop'); await capture('shop-mobile.png', true)
  assert.ok(await evaluate('document.documentElement.scrollWidth<=window.innerWidth+1'))
  await visit('/')
  assert.ok(await evaluate('document.documentElement.scrollWidth<=window.innerWidth+1'))
  await click('.locale-button'); await click('.locale-button')
  assert.equal(await evaluate('document.documentElement.lang'), 'fa')
  assert.deepEqual(browserErrors, [])
  console.log('PASS mobile layout and language switching; no browser exceptions')
} finally {
  socket.close()
  fs.rmSync(pdf, { force: true })
}
