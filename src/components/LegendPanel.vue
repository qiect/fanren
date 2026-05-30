<template>
  <div class="glass rounded-xl p-4">
    <h3 class="font-display text-sm tracking-wider mb-3" style="color: var(--accent-gold);">图例</h3>

    <div class="mb-3">
      <div class="text-xs text-gray-500 mb-2">势力颜色</div>
      <div class="grid grid-cols-2 gap-1">
        <div
          v-for="faction in store.topLevelFactions"
          :key="faction.id"
          class="flex items-center gap-2 text-xs text-gray-400"
        >
          <span
            class="w-3 h-3 rounded-full flex-shrink-0"
            :style="{ backgroundColor: FACTION_COLORS[faction.id] || '#64748b' }"
          ></span>
          {{ faction.name }}
        </div>
      </div>
    </div>

    <div>
      <div class="text-xs text-gray-500 mb-2">关系类型</div>
      <div class="grid grid-cols-2 gap-1">
        <div
          v-for="type in store.allRelationshipTypes"
          :key="type"
          class="flex items-center gap-2 text-xs text-gray-400"
        >
          <span
            class="w-6 h-0.5 flex-shrink-0"
            :style="{ backgroundColor: RELATIONSHIP_COLORS[type] }"
          ></span>
          {{ type }}
        </div>
      </div>
    </div>

    <div class="mt-3 border-t border-white/5 pt-3">
      <div class="text-xs text-gray-500 mb-2">节点大小 = 境界高低</div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-gray-500"></span>
          <span class="text-xs text-gray-500">凡人</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="w-3 h-3 rounded-full bg-gray-400"></span>
          <span class="text-xs text-gray-500">筑基</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="w-4 h-4 rounded-full bg-gray-300"></span>
          <span class="text-xs text-gray-500">元婴</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="w-5 h-5 rounded-full bg-gray-200"></span>
          <span class="text-xs text-gray-500">化神</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKnowledgeStore } from '@/stores/knowledge'
import { RELATIONSHIP_COLORS, FACTION_COLORS } from '@/types'

const store = useKnowledgeStore()
</script>
