<template>
  <div class="glass rounded-xl p-5 h-full overflow-y-auto scrollbar-thin animate-fade-in">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-display text-base tracking-wider" style="color: var(--accent-gold);">
        {{ character?.name }}
      </h3>
      <button
        class="text-gray-500 hover:text-gray-300 transition-colors text-sm"
        @click="$emit('close')"
      >
        ✕
      </button>
    </div>

    <template v-if="character">
      <div class="space-y-3 mb-5">
        <div v-if="character.alias.length" class="flex items-start gap-2">
          <span class="text-xs text-gray-500 w-12 flex-shrink-0">别名</span>
          <span class="text-xs text-gray-300">{{ character.alias.join('、') }}</span>
        </div>
        <div class="flex items-start gap-2">
          <span class="text-xs text-gray-500 w-12 flex-shrink-0">境界</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-green-900/40 text-green-300">{{ character.cultivation }}</span>
        </div>
        <div class="flex items-start gap-2">
          <span class="text-xs text-gray-500 w-12 flex-shrink-0">势力</span>
          <span class="text-xs text-gray-300">{{ factionName }}</span>
        </div>
        <div class="flex items-start gap-2">
          <span class="text-xs text-gray-500 w-12 flex-shrink-0">性别</span>
          <span class="text-xs text-gray-300">{{ character.gender === 'male' ? '男' : character.gender === 'female' ? '女' : '未知' }}</span>
        </div>
        <div class="flex items-start gap-2">
          <span class="text-xs text-gray-500 w-12 flex-shrink-0">出场</span>
          <span class="text-xs text-gray-300">第{{ character.firstChapter }}章</span>
        </div>
      </div>

      <div class="text-xs text-gray-400 leading-relaxed mb-5 p-3 rounded-lg bg-white/5">
        {{ character.description }}
      </div>

      <div class="mb-5">
        <h4 class="text-xs text-gray-500 mb-2">人际关系</h4>
        <div class="space-y-2">
          <div
            v-for="rel in relationships"
            :key="rel.id"
            class="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            @click="$emit('selectCharacter', rel.otherId)"
          >
            <span
              class="w-1.5 h-1.5 rounded-full flex-shrink-0"
              :style="{ backgroundColor: RELATIONSHIP_COLORS[rel.type] }"
            ></span>
            <span class="text-xs text-gray-400">{{ rel.type }}</span>
            <span class="text-xs text-amber-300/80">{{ rel.otherName }}</span>
            <span class="text-xs text-gray-600 truncate flex-1 text-right">{{ rel.description }}</span>
          </div>
        </div>
      </div>

      <div>
        <h4 class="text-xs text-gray-500 mb-2">相关事件</h4>
        <div class="space-y-2">
          <div
            v-for="evt in charEvents"
            :key="evt.id"
            class="p-2 rounded-lg bg-white/5"
          >
            <div class="text-xs text-amber-300/80 mb-1">第{{ evt.chapter }}章 · {{ evt.title }}</div>
            <div class="text-xs text-gray-500">{{ evt.description }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useKnowledgeStore } from '@/stores/knowledge'
import { RELATIONSHIP_COLORS } from '@/types'

const props = defineProps<{
  characterId: string
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'selectCharacter', id: string): void
}>()

const store = useKnowledgeStore()

const character = computed(() => store.getCharacterById(props.characterId))

const factionName = computed(() => {
  if (!character.value) return ''
  const f = store.getFactionById(character.value.factionId)
  return f?.name || '无'
})

const relationships = computed(() => {
  if (!character.value) return []
  return store.getCharacterRelationships(props.characterId).map(r => {
    const isSource = r.sourceId === props.characterId
    const otherId = isSource ? r.targetId : r.sourceId
    const other = store.getCharacterById(otherId)
    return {
      id: r.id,
      type: r.type,
      otherId,
      otherName: other?.name || otherId,
      description: r.description,
    }
  })
})

const charEvents = computed(() => {
  if (!character.value) return []
  return store.getCharacterEvents(props.characterId).sort((a, b) => a.chapter - b.chapter)
})
</script>
