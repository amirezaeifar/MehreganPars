<script setup lang="ts">
import { computed } from 'vue'
const props=defineProps<{variant:string}>()
const image=computed(()=>['back','neck','knee','essentials'].includes(props.variant)?props.variant:'back')
</script>
<template><img class="product-art product-photograph" :src="'/images/product-'+image+'.jpg'" alt="" width="1024" height="1024" loading="lazy"/></template>
