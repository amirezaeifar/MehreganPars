<script setup lang="ts">
import { Globe2 } from 'lucide-vue-next'
import { language, setLanguage } from '../i18n'
</script>

<template>
  <button type="button" class="locale-button" :lang="language" :aria-label="language === 'fa' ? 'زبان فعلی فارسی؛ تغییر به انگلیسی' : 'Current language English; switch to Persian'" :title="language === 'fa' ? 'Switch to English' : 'تغییر به فارسی'" @click="setLanguage(language === 'fa' ? 'en' : 'fa')">
    <Globe2 :size="16" :stroke-width="1.5" aria-hidden="true" />
    <span>{{ language === 'fa' ? 'فارسی' : 'English' }}</span>
  </button>
</template>
