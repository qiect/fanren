<template>
  <div class="w-full h-full overflow-y-auto scrollbar-thin p-8">
    <div class="max-w-5xl mx-auto">
      <h1 class="font-display text-2xl mb-6" style="color: var(--accent-gold);">事件时间线</h1>

      <div class="relative">
        <div class="absolute left-[120px] top-0 bottom-0 w-px bg-gradient-to-b from-amber-700/40 via-amber-700/20 to-transparent"></div>

        <div
          v-for="(evt, index) in sortedEvents"
          :key="evt.id"
          class="relative flex gap-6 mb-8 animate-fade-in"
          :style="{ animationDelay: index * 50 + 'ms' }"
        >
          <div class="w-[104px] flex-shrink-0 text-right pt-1">
            <div class="text-xs text-amber-400/60">第{{ evt.chapter }}章</div>
          </div>

          <div class="relative flex-shrink-0">
            <div class="w-3 h-3 rounded-full border-2 bg-[var(--bg-primary)] mt-2"
              :class="index === 0 ? 'border-amber-400 animate-pulse-gold' : 'border-amber-700/40'"
            ></div>
          </div>

          <div
            class="flex-1 glass rounded-xl p-5 hover:gold-glow transition-all duration-300 cursor-pointer"
            @click="toggleEvent(evt.id)"
          >
            <div class="flex items-center gap-3 mb-2">
              <h3 class="font-display text-base" style="color: var(--accent-gold);">{{ evt.title }}</h3>
              <span v-if="evt.factionId" class="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                {{ getFactionName(evt.factionId) }}
              </span>
            </div>

            <div v-if="expandedEvents.has(evt.id)" class="animate-fade-in">
              <p class="text-sm text-gray-300 leading-relaxed mb-4">{{ evt.description }}</p>

              <div v-if="evt.participantIds.length" class="flex flex-wrap gap-2">
                <span class="text-xs text-gray-500">参与人物：</span>
                <router-link
                  v-for="pid in evt.participantIds"
                  :key="pid"
                  :to="{ name: 'character', params: { id: pid } }"
                  class="text-xs px-2 py-0.5 rounded-full bg-white/5 text-amber-300/80 hover:bg-white/10 hover:text-amber-200 transition-colors"
                >
                  {{ getCharName(pid) }}
                </router-link>
              </div>
            </div>

            <div v-else class="text-xs text-gray-500">
              {{ evt.description.slice(0, 60) }}{{ evt.description.length > 60 ? '...' : '' }}
              <span class="text-amber-700/50 ml-1">点击展开</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useKnowledgeStore } from '@/stores/knowledge'

const store = useKnowledgeStore()
const expandedEvents = ref<Set<string>>(new Set())

const sortedEvents = computed(() =>
  [...store.events].sort((a, b) => a.chapter - b.chapter)
)

function toggleEvent(id: string) {
  if (expandedEvents.value.has(id)) {
    expandedEvents.value.delete(id)
  } else {
    expandedEvents.value.add(id)
  }
}

function getFactionName(factionId: string) {
  return store.getFactionById(factionId)?.name || ''
}

function getCharName(charId: string) {
  return store.getCharacterById(charId)?.name || charId
}
</script>
