<template>
  <nav class="glass flex items-center justify-between px-6 py-3 z-50 relative">
    <router-link to="/" class="flex items-center gap-3 group">
      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center text-sm font-bold group-hover:shadow-lg group-hover:shadow-amber-900/30 transition-shadow">
        仙
      </div>
      <span class="font-display text-lg tracking-wider" style="color: var(--accent-gold);">凡人修仙传 · 知识图谱</span>
    </router-link>

    <div class="flex items-center gap-1">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="px-4 py-2 rounded-lg text-sm transition-all duration-200"
        :class="isActive(item.path) ? 'text-amber-300 glass gold-glow' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'"
      >
        <component :is="item.icon" class="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
        {{ item.label }}
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { h } from 'vue'

const route = useRoute()

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const navItems = [
  { path: '/', label: '图谱', icon: { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('circle', { cx: '12', cy: '12', r: '2' }), h('path', { d: 'M12 2v4' }), h('path', { d: 'M12 18v4' }), h('path', { d: 'M4.93 4.93l2.83 2.83' }), h('path', { d: 'M16.24 16.24l2.83 2.83' }), h('path', { d: 'M2 12h4' }), h('path', { d: 'M18 12h4' }), h('path', { d: 'M4.93 19.07l2.83-2.83' }), h('path', { d: 'M16.24 7.76l2.83-2.83' })]) } },
  { path: '/factions', label: '势力', icon: { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('path', { d: 'M3 3h18v18H3z' }), h('path', { d: 'M3 9h18' }), h('path', { d: 'M3 15h18' }), h('path', { d: 'M9 3v18' })]) } },
  { path: '/timeline', label: '时间线', icon: { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [h('circle', { cx: '12', cy: '12', r: '10' }), h('polyline', { points: '12 6 12 12 16 14' })]) } },
]
</script>
