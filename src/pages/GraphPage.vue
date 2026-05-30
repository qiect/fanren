<template>
  <div class="w-full h-full flex relative">
    <div
      class="absolute left-0 top-0 bottom-0 z-20 transition-all duration-300"
      :class="showFilter ? 'w-64' : 'w-0'"
    >
      <div class="w-64 h-full p-3 overflow-hidden">
        <FilterPanel />
      </div>
    </div>

    <div class="flex-1 relative">
      <ForceGraph @select-character="onSelectCharacter" />

      <button
        class="absolute left-3 top-3 z-30 glass rounded-lg px-3 py-2 text-xs text-gray-400 hover:text-gray-200 transition-colors"
        @click="showFilter = !showFilter"
      >
        {{ showFilter ? '◀ 隐藏筛选' : '▶ 筛选面板' }}
      </button>

      <div class="absolute right-3 bottom-3 z-20 w-52">
        <LegendPanel />
      </div>

      <div
        v-if="selectedCharId"
        class="absolute right-3 top-3 z-20 w-80 h-[calc(100%-1.5rem)]"
      >
        <CharacterPanel
          :character-id="selectedCharId"
          @close="selectedCharId = null"
          @select-character="onSelectCharacter"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ForceGraph from '@/components/ForceGraph.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import LegendPanel from '@/components/LegendPanel.vue'
import CharacterPanel from '@/components/CharacterPanel.vue'

const router = useRouter()
const showFilter = ref(true)
const selectedCharId = ref<string | null>(null)

function onSelectCharacter(id: string) {
  selectedCharId.value = id
}
</script>
