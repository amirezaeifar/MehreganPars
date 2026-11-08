<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronDown, Menu, X, Search, ArrowUpLeft, ArrowLeft, HeartPulse, Mail, Building2, Stethoscope, BookOpenText } from 'lucide-vue-next'
import { platforms } from './data'
import { t, language } from './i18n'
import { useArticles } from './store'
import HomeFooter from './components/HomeFooter.vue'
import SlidingIndicator from './components/SlidingIndicator.vue'
import LanguageButton from './components/LanguageButton.vue'
const route=useRoute(), opened=ref(''), mobile=ref(false), search=ref('')
const { published } = useArticles()
const corporate=computed(()=>route.path!=='/shop'&&!route.path.startsWith('/admin')&&!/^\/platforms\/[^/]+$/.test(route.path))
const groups=computed(()=>[{id:'brands',label:t('دنیای مهرگان','Our brands'),path:'/platforms'},{id:'stories',label:t('مجله سلامت','Health journal'),path:'/magazine'}])
const categories=computed(()=>[...new Set(published.value.map(article=>article.category))])
const normalizedSearch=computed(()=>search.value.trim().toLocaleLowerCase())
const results=computed(()=>normalizedSearch.value ? platforms.filter(p=>`${t(p.name)} ${t(p.eyebrow)} ${t(p.description)} ${p.services.map(s=>t(s)).join(' ')}`.toLocaleLowerCase().includes(normalizedSearch.value)) : [])
const articleResults=computed(()=>normalizedSearch.value ? published.value.filter(a=>`${t(a.title)} ${t(a.excerpt)} ${t(a.category)}`.toLocaleLowerCase().includes(normalizedSearch.value)).slice(0,4) : [])
watch(()=>route.fullPath,()=>{opened.value='';mobile.value=false;search.value=''})
let menuTrigger: HTMLElement | null = null
function closeMenu(restoreFocus = true) {
  opened.value = ''
  mobile.value = false
  if (restoreFocus) nextTick(() => menuTrigger?.focus())
}
function dismissMenu(event: KeyboardEvent) {
  if (event.key === 'Escape' && (opened.value || mobile.value)) closeMenu()
}
const narrowHeader = window.matchMedia('(max-width: 1150px)')
function resetHeader() { closeMenu(false) }
onMounted(() => {
  window.addEventListener('keydown', dismissMenu)
  narrowHeader.addEventListener('change', resetHeader)
})
onUnmounted(() => {
  window.removeEventListener('keydown', dismissMenu)
  narrowHeader.removeEventListener('change', resetHeader)
})
function toggle(id: string, event: MouseEvent) {
  menuTrigger = event.currentTarget as HTMLElement
  mobile.value = false
  opened.value = opened.value === id ? '' : id

  if (opened.value === 'search') {
    nextTick(() => {
      document
          .querySelector<HTMLInputElement>('.global-search input')
          ?.focus()
    })
  }
}
function toggleMobile(event: MouseEvent) {
  menuTrigger = event.currentTarget as HTMLElement
  opened.value = ''
  mobile.value = !mobile.value
}
let revealObserver: IntersectionObserver | undefined
let textObserver: MutationObserver | undefined
function normalizeHeadings() {
  document.querySelectorAll('.site-shell h1, .site-shell h2, .site-shell h3, .site-shell h4, .site-shell h5, .site-shell h6').forEach(heading => {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT)
    let node: Node | null
    while ((node = walker.nextNode())) {
      const text = node.textContent || ''
      const clean = text.replace(/[.۔]+(?=\s|$)/g, '')
      if (text !== clean) node.textContent = clean
    }
  })
}
function revealSections(){
  if(typeof IntersectionObserver==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return
  revealObserver?.disconnect()
  revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('revealed');revealObserver?.unobserve(entry.target)}
  }),{threshold:.09,rootMargin:'0px 0px -35px 0px'})
  document.querySelectorAll('main .editorial-heading, main .editorial-mission, main .journal-section .article-card, main .contact-grid > *, main .brand-services article, main .doctor-card, main .values-grid > *, main .article-body, main .brand-service-card, main .journey-strip, main .family-card').forEach(element=>{
    element.classList.add('reveal-ready');revealObserver?.observe(element)
  })
}
onMounted(()=>nextTick(()=>{revealSections();normalizeHeadings();textObserver=new MutationObserver(()=>normalizeHeadings());textObserver.observe(document.querySelector('.site-shell')!,{subtree:true,childList:true,characterData:true})}))
watch(()=>route.fullPath,()=>nextTick(()=>{revealSections();normalizeHeadings()}))
watch(language,()=>nextTick(normalizeHeadings))
onUnmounted(()=>{revealObserver?.disconnect();textObserver?.disconnect()})

</script>
<template>
  <div
      class="site-shell"
      :class="{
      english: language === 'en',
      'corporate-site': corporate,
      'home-reference': route.path === '/',
      'care-design': !/^\/(?:platforms\/shop|shop|admin)(?:\/|$)/.test(route.path),
      'public-care': !/^\/(shop|admin)(\/|$)/.test(route.path)
    }"
  >
    <header
        v-if="corporate"
        class="global-header"
        :class="{
        'panel-open': opened,
        'mobile-open': mobile
      }"
    >
      <!-- Desktop Header -->
      <div class="global-bar">

        <!-- Logo -->
        <RouterLink
            to="/"
            class="wordmark"
            :aria-label="t('صفحه اصلی مهرگان', 'Mehregan home')"
        >
          <img
              class="wordmark-icon"
              src="/images/icon.png"
              alt=""
              width="42"
              height="42"
          />
          <b>{{ t('مهرگان پارس', 'Mehregan Pars') }}</b>
        </RouterLink>

        <!-- Main Navigation -->
        <nav
            class="global-links"
            :aria-label="t('منوی اصلی', 'Main navigation')"
        >

          <!-- Home -->
          <RouterLink to="/">
            {{ t('خانه', 'Home') }}
          </RouterLink>

          <!-- Direct Links - No Submenus -->
          <RouterLink
              v-for="g in groups"
              :key="g.id"
              :to="g.path"
              :data-current="route.path.startsWith(g.path) || undefined"
          >
            {{ g.label }}
          </RouterLink>

          <!-- About -->
          <RouterLink to="/about">
            {{ t('درباره ما', 'About us') }}
          </RouterLink>

          <!-- Contact -->
          <RouterLink to="/contact">
            {{ t('ارتباط با ما', 'Contact') }}
          </RouterLink>

          <!-- Sliding Navigation Indicator -->
          <SlidingIndicator
              :active-key="route.path"
              interactive
              selector="[data-current], .router-link-exact-active, a.router-link-active:not([href='/'])"
          />

        </nav>

        <!-- Header Tools -->
        <div class="global-tools">

          <!-- Language Switcher -->
          <LanguageButton public-menu />

          <!-- Search Button -->
          <button
              class="nav-icon"
              @click="toggle('search', $event)"
              :aria-expanded="opened === 'search'"
              :aria-label="t('جست‌وجو', 'Search')"
          >
            <Search :size="18" />
          </button>

          <!-- Mobile Menu Button -->
          <button
              class="mobile-menu nav-icon"
              @click="toggleMobile($event)"
              aria-controls="mobile-navigation"
              :aria-expanded="mobile"
              :aria-label="t('منوی اصلی', 'Main navigation')"
          >
            <X v-if="mobile" :size="20" />
            <Menu v-else :size="20" />
          </button>

        </div>
      </div>

      <!-- Mobile Navigation -->
      <Transition name="mobile-reveal">
        <div
            v-if="mobile"
            class="mobile-global"
            id="mobile-navigation"
        >

          <RouterLink to="/">
            {{ t('خانه', 'Home') }}
          </RouterLink>

          <RouterLink
              v-for="g in groups"
              :key="g.id"
              :to="g.path"
          >
            {{ g.label }}
          </RouterLink>

          <RouterLink to="/about">
            {{ t('درباره ما', 'About us') }}
          </RouterLink>

          <RouterLink to="/contact">
            {{ t('ارتباط با ما', 'Contact') }}
          </RouterLink>

          <div class="mobile-actions">
            <LanguageButton public-menu />
          </div>

        </div>
      </Transition>

      <!-- Search Panel Only -->
      <Transition name="mega">
        <section
            v-if="opened === 'search'"
            id="menu-search"
            class="mega-panel"
        >
          <div class="mega-inner">

            <div class="global-search">

              <!-- Search Heading -->
              <div class="search-top">
                <span>
                  {{
                    t(
                        'در دنیای مهرگان جست‌وجو کنید',
                        'Search the Mehregan world'
                    )
                  }}
                </span>

                <small>
                  {{
                    t(
                        'خدمات، پلتفرم‌ها و مقاله‌ها',
                        'Services, brands and stories'
                    )
                  }}
                </small>
              </div>

              <!-- Search Input -->
              <label class="search-input">

                <Search :size="23" />

                <input
                    v-model="search"
                    :placeholder="
                    t(
                      'مثلاً فیزیوتراپی، تغذیه یا سلامت روان',
                      'Try physiotherapy, nutrition or mental wellbeing'
                    )
                  "
                    :aria-label="t('جست‌وجو', 'Search')"
                />

                <button
                    v-if="search"
                    type="button"
                    @click="search = ''"
                    :aria-label="t('پاک کردن جست‌وجو', 'Clear search')"
                >
                  <X :size="17" />
                </button>

              </label>

              <!-- Popular Search Suggestions -->
              <div
                  v-if="!normalizedSearch"
                  class="search-suggestions"
              >
                <span>
                  {{
                    t(
                        'پیشنهاد برای شروع',
                        'Popular searches'
                    )
                  }}
                </span>

                <button
                    v-for="term in ['فیزیوتراپی', 'سلامت روان', 'تغذیه']"
                    :key="term"
                    @click="search = t(term)"
                >
                  {{ t(term) }}
                  <ArrowUpLeft :size="14" />
                </button>

              </div>

              <!-- Search Results -->
              <div
                  v-else
                  class="search-results"
              >

                <!-- Services and Brands -->
                <div v-if="results.length">

                  <span class="search-result-heading">
                    <HeartPulse :size="17" />
                    {{
                      t(
                          'خدمات و برندها',
                          'Services & brands'
                      )
                    }}
                  </span>

                  <RouterLink
                      v-for="p in results"
                      :key="p.slug"
                      :to="`/platforms/${p.slug}`"
                  >
                    <span>
                      <strong>{{ t(p.name) }}</strong>
                      <small>{{ t(p.eyebrow) }}</small>
                    </span>

                    <ArrowUpLeft :size="18" />
                  </RouterLink>

                </div>

                <!-- Magazine Articles -->
                <div v-if="articleResults.length">

                  <span class="search-result-heading">
                    <BookOpenText :size="17" />
                    {{
                      t(
                          'از مجله سلامت',
                          'From the health journal'
                      )
                    }}
                  </span>

                  <RouterLink
                      v-for="a in articleResults"
                      :key="a.id"
                      :to="`/magazine/${a.slug}`"
                  >
                    <span>
                      <strong>{{ t(a.title) }}</strong>
                      <small>{{ t(a.category) }}</small>
                    </span>

                    <ArrowUpLeft :size="18" />
                  </RouterLink>

                </div>

                <!-- No Results -->
                <p
                    v-if="!results.length && !articleResults.length"
                >
                  {{
                    t(
                        'نتیجه‌ای پیدا نشد. عبارت دیگری امتحان کنید.',
                        'No results found. Try a different term.'
                    )
                  }}
                </p>

              </div>

            </div>

            <!-- Close Search -->
            <button
                class="mega-close nav-icon"
                @click="closeMenu()"
                :aria-label="t('بستن منو', 'Close menu')"
            >
              <X :size="20" />
            </button>

          </div>
        </section>
      </Transition>

    </header>

    <!-- Background Overlay -->
    <div
        v-if="opened === 'search' && corporate"
        class="menu-scrim"
        @click="closeMenu()"
        aria-hidden="true"
    ></div>

    <!-- Page Content -->
    <component
        :inert="mobile && corporate"
        :is="route.path === '/shop' ? 'div' : 'main'"
    >
      <RouterView v-slot="{ Component }">
        <Transition
            name="route-view"
            appear
            mode="out-in"
            @after-enter="revealSections"
        >
          <component
              :is="Component"
              :key="route.path"
          />
        </Transition>
      </RouterView>
    </component>

    <!-- Footer -->
    <HomeFooter :inert="mobile && corporate" />

  </div>
</template>





