<script setup lang="ts">
import { language, setLanguage } from '../i18n'
import { ref, onMounted, onUnmounted } from 'vue'
defineProps<{ publicMenu?: boolean }>()
const names = { fa: 'فارسی', en: 'English', ar: 'العربية' }
const open = ref(false)
const root = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()
function outside(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node)) open.value = false
}
function close() {
  open.value = false
  trigger.value?.focus()
}
onMounted(() => { if (root.value) document.addEventListener('pointerdown', outside) })
onUnmounted(() => document.removeEventListener('pointerdown', outside))
</script>
<template><div v-if="publicMenu" class="locale-picker public-locale" ref="root" @focusout="!root?.contains($event.relatedTarget as Node) && (open=false)" @keydown.esc="open && ($event.stopPropagation(), close())"><button type="button" ref="trigger" :aria-expanded="open" aria-label="Language / زبان / اللغة" @keydown.enter.prevent="open=!open" @click="open=!open"><span>{{ names[language] }}</span><svg aria-hidden="true" width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="m1 1 5 5 5-5" stroke="currentColor" stroke-width="1.6"/></svg></button><div v-if="open" class="locale-options"><button v-for="(name, code) in names" :key="code" :lang="code" type="button" :aria-pressed="code===language" @keydown.enter.prevent="setLanguage(code); close()" @click="setLanguage(code); close()">{{ name }} <span aria-hidden="true">{{ code===language ? '✓' : '' }}</span></button></div></div><label v-else class="locale-picker"><span class="sr-only">Language / زبان / اللغة</span><select :value="language" aria-label="Language / زبان / اللغة" @change="setLanguage(($event.target as HTMLSelectElement).value as 'fa'|'en'|'ar')"><option value="fa">فارسی</option><option value="en">English</option><option value="ar">العربية</option></select></label></template>

<style scoped>
.public-locale{position:relative}
.public-locale > button{display:inline-flex;align-items:center;justify-content:center;gap:8px;white-space:nowrap}
.public-locale button{color:inherit;font:inherit;cursor:pointer;background:transparent;border:0;min-height:44px;padding:0 12px}
.locale-options{position:absolute;z-index:4;inset-inline-end:0;top:100%;width:156px;padding:5px;border-radius:10px;background:#113c30;color:white;box-shadow:0 8px 28px #0003}
.locale-options button{display:flex;align-items:center;justify-content:space-between;width:100%;border-radius:6px}
.locale-options button:is(:hover,:focus-visible){background:#315c4f}
.locale-options span{color:#f4b66d}
@media(max-width:1150px){.locale-options{inset-inline-start:0;inset-inline-end:auto;top:auto;bottom:100%}}
</style>
