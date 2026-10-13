<script setup lang="ts">
import { Activity, HeartPulse, Sparkles, Flower2, Leaf } from 'lucide-vue-next'
defineProps<{ name: string; size?: number }>()
</script>

<template>
  <HeartPulse v-if="name === 'heart'" :size="size || 30" :stroke-width="1.55" />
  <Activity v-else-if="name === 'activity'" :size="size || 30" :stroke-width="1.55" />
  <Sparkles v-else-if="name === 'sparkles'" :size="size || 30" :stroke-width="1.55" />
  <Flower2 v-else-if="name === 'flower'" :size="size || 30" :stroke-width="1.55" />
  <Leaf v-else :size="size || 30" :stroke-width="1.55" />
</template>
