<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { UserRound } from 'lucide-vue-next'
import type { Doctor } from '../operations'
const props=defineProps<{doctor:Doctor}>()
const failed=ref(false)
const source=computed(()=>{
 if(props.doctor.photo&&(/^(https:\/\/|\/images\/)/.test(props.doctor.photo)))return props.doctor.photo
 const sample=props.doctor.id.match(/^(health-center|physiopars|oncopars|psychopars|hydrotherapy)-([0-3])$/)
 return sample?`/images/doctor-demo-${sample[2]}.jpg`:''
})
watch(source,()=>failed.value=false)
</script>
<template><span class="doctor-portrait"><img v-if="source&&!failed" :src="source" alt="" loading="lazy" @error="failed=true"/><UserRound v-else :size="34"/></span></template>
