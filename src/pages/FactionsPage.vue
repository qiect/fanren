<template>
  <div class="w-full h-full overflow-y-auto scrollbar-thin p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="font-display text-2xl mb-6" style="color: var(--accent-gold);">势力总览</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="faction in store.topLevelFactions"
          :key="faction.id"
          class="glass rounded-xl p-5 hover:gold-glow transition-all duration-300 animate-fade-in"
        >
          <div class="flex items-center gap-3 mb-3">
            <span
              class="w-4 h-4 rounded-full"
              :style="{ backgroundColor: FACTION_COLORS[faction.id] || '#64748b' }"
            ></span>
            <h2 class="font-display text-lg" style="color: var(--accent-gold);">{{ faction.name }}</h2>
            <span class="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">{{ faction.type }}</span>
          </div>

          <p class="text-xs text-gray-400 mb-4 leading-relaxed">{{ faction.description }}</p>

          <div class="mb-3">
            <div class="text-xs text-gray-500 mb-2">境界分布</div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(count, level) in getCultivationDistribution(faction.id)"
                :key="level"
                class="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-300"
              >
                {{ level }}: {{ count }}
              </span>
            </div>
          </div>

          <div>
            <div class="text-xs text-gray-500 mb-2">核心人物</div>
            <div class="space-y-1.5">
              <div
                v-for="char in getTopCharacters(faction.id)"
                :key="char.id"
                class="flex items-center gap-2 p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                @click="router.push({ name: 'character', params: { id: char.id } })"
              >
                <span
                  class="w-2 h-2 rounded-full"
                  :style="{ backgroundColor: FACTION_COLORS[faction.id] || '#64748b' }"
                ></span>
                <span class="text-xs text-gray-200">{{ char.name }}</span>
                <span class="text-xs text-green-400/70 ml-auto">{{ char.cultivation }}</span>
              </div>
            </div>
          </div>

          <template v-if="store.getSubFactions(faction.id).length">
            <div class="mt-3 border-t border-white/5 pt-3">
              <div class="text-xs text-gray-500 mb-2">下属组织</div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="sub in store.getSubFactions(faction.id)"
                  :key="sub.id"
                  class="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400"
                >
                  {{ sub.name }}
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useKnowledgeStore } from '@/stores/knowledge'
import { FACTION_COLORS } from '@/types'

const router = useRouter()
const store = useKnowledgeStore()

function getCultivationDistribution(factionId: string): Record<string, number> {
  const chars = store.getFactionCharacters(factionId)
  const dist: Record<string, number> = {}
  chars.forEach(c => {
    dist[c.cultivation] = (dist[c.cultivation] || 0) + 1
  })
  return dist
}

function getTopCharacters(factionId: string) {
  const order = ['化神期', '元婴期', '结丹期', '筑基期', '炼气期', '凡人']
  return store.getFactionCharacters(factionId)
    .sort((a, b) => order.indexOf(a.cultivation) - order.indexOf(b.cultivation))
    .slice(0, 6)
}
</script>
