<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { language } from '../i18n'
const props=defineProps<{activeKey:string|number;selector:string}>()
const marker=ref<HTMLElement>()
const moving=ref(false)
const position=ref({width:'0px',transform:'translateX(0px)',background:'',opacity:0})
let observer:ResizeObserver|undefined
function update(animate=false){
 const parent=marker.value?.parentElement
 const active=parent?.querySelector<HTMLElement>(props.selector)
 if(!parent||!active){position.value.opacity=0;return}
 moving.value=animate&&position.value.opacity===1
 position.value={width:active.offsetWidth+'px',transform:`translateX(${active.offsetLeft}px)`,background:getComputedStyle(active).getPropertyValue('--complement').trim()||'var(--amber)',opacity:1}
}
watch(()=>props.activeKey,async()=>{await nextTick();update(true)})
watch(language,async()=>{await nextTick();update()})
onMounted(async()=>{observer=new ResizeObserver(()=>update());const parent=marker.value?.parentElement;if(parent){observer.observe(parent);Array.from(parent.children).filter(el=>el!==marker.value).forEach(el=>observer!.observe(el))}await document.fonts.ready;update()})
onUnmounted(()=>observer?.disconnect())
</script>
<template><span ref="marker" class="sliding-indicator" :class="{'is-moving':moving}" :style="position" aria-hidden="true"/></template>
