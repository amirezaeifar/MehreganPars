<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { language } from '../i18n'
const props=defineProps<{activeKey:string|number;selector:string;interactive?:boolean}>()
const marker=ref<HTMLElement>()
const highlight=ref(false)
const moving=ref(false)
const position=ref({width:'0px',transform:'translateX(0px)',background:'',opacity:0})
let observer:ResizeObserver|undefined
let hovered:HTMLElement|null=null
let focused:HTMLElement|null=null
const events=new AbortController()
function track(event:Event){
 const el=event.target instanceof Element?event.target.closest<HTMLElement>('button,a'):null
 if(event.type==='pointerover')hovered=el
 if(event.type==='pointerleave')hovered=null
 if(event.type==='focusin') focused=el?.matches(':focus-visible') ? el : null
 if(event.type==='focusout')focused=null
 update(true)
}
function update(animate=false){
 const parent=marker.value?.parentElement
 highlight.value=!!(focused||hovered)
 const active=focused||hovered||parent?.querySelector<HTMLElement>(props.selector)
 if(!parent||!active){position.value.opacity=0;return}
 moving.value=animate&&position.value.opacity===1
 position.value={width:active.offsetWidth+'px',transform:`translateX(${active.offsetLeft}px)`,background:getComputedStyle(active).getPropertyValue('--complement').trim()||'var(--amber)',opacity:1}
}
watch(()=>props.activeKey,async()=>{hovered=null;await nextTick();update(true)})
watch(language,async()=>{await nextTick();update()})
onMounted(async()=>{observer=new ResizeObserver(()=>update());const parent=marker.value?.parentElement;if(parent){if(props.interactive){for(const name of ['pointerover','pointerleave','focusin','focusout'])parent.addEventListener(name,track,{signal:events.signal})}observer.observe(parent);Array.from(parent.children).filter(el=>el!==marker.value).forEach(el=>observer!.observe(el))}await document.fonts.ready;update()})
onUnmounted(()=>{observer?.disconnect();events.abort()})
</script>
<template><span ref="marker" class="sliding-indicator" :class="{'is-moving':moving}" :style="[position, props.interactive && {'--indicator-color': highlight ? 'currentColor' : '#f4b66d'}]" aria-hidden="true"/></template>
