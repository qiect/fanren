<template>
  <div class="glass rounded-xl p-4 h-full overflow-y-auto scrollbar-thin">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-display text-sm tracking-wider" style="color: var(--accent-gold);">筛选</h3>
      <button
        class="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        @click="store.clearFilters()"
      >
        清除全部
      </button>
    </div>

    <div class="mb-5">
      <div class="text-xs text-gray-500 mb-2">搜索人物</div>
      <input
        :value="store.searchQuery"
        type="text"
        placeholder="输入姓名或别名..."
        class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-700/50 transition-colors"
        @input="store.setSearchQuery(($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="mb-5">
      <div class="text-xs text-gray-500 mb-2">势力</div>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="faction in store.topLevelFactions"
          :key="faction.id"
          class="px-2.5 py-1 rounded-md text-xs transition-all duration-200"
          :class="store.selectedFactions.includes(faction.id)
            ? 'text-amber-200 glass gold-glow'
            : 'text-gray-400 bg-white/5 hover:bg-white/10'"
          @click="store.toggleFaction(faction.id)"
        >
          {{ faction.name }}
        </button>
      </div>
    </div>

    <div class="mb-5">
      <div class="text-xs text-gray-500 mb-2">境界</div>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="level in store.allCultivationLevels"
          :key="level"
          class="px-2.5 py-1 rounded-md text-xs transition-all duration-200"
          :class="store.selectedCultivations.includes(level)
            ? 'text-green-300 glass'
            : 'text-gray-400 bg-white/5 hover:bg-white/10'"
          @click="store.toggleCultivation(level)"
        >
          {{ level }}
        </button>
      </div>
    </div>

    <div class="mb-5">
      <div class="text-xs text-gray-500 mb-2">关系类型</div>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="type in store.allRelationshipTypes"
          :key="type"
          class="px-2.5 py-1 rounded-md text-xs transition-all duration-200"
          :class="store.selectedRelationshipTypes.includes(type)
            ? 'text-white glass'
            : 'text-gray-400 bg-white/5 hover:bg-white/10'"
          :style="store.selectedRelationshipTypes.includes(type) ? { borderColor: RELATIONSHIP_COLORS[type] } : {}"
          @click="store.toggleRelationshipType(type)"
        >
          <span
            class="inline-block w-2 h-2 rounded-full mr-1"
            :style="{ backgroundColor: RELATIONSHIP_COLORS[type] }"
          ></span>
          {{ type }}
        </button>
      </div>
    </div>

    <div class="border-t border-white/5 pt-4">
      <div class="text-xs text-gray-500 mb-2">统计</div>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="bg-white/5 rounded-lg p-2 text-center">
          <div class="text-amber-400 font-bold text-lg">{{ store.filteredCharacters.length }}</div>
          <div class="text-gray-500">人物</div>
        </div>
        <div class="bg-white/5 rounded-lg p-2 text-center">
          <div class="text-amber-400 font-bold text-lg">{{ store.filteredRelationships.length }}</div>
          <div class="text-gray-500">关系</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useKnowledgeStore } from '@/stores/knowledge'
import { RELATIONSHIP_COLORS } from '@/types'

const store = useKnowledgeStore()
</script>
