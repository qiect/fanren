<template>
  <div class="w-full h-full overflow-y-auto scrollbar-thin p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="font-display text-2xl mb-2" style="color: var(--accent-gold);">{{ character?.name }}</h1>
      <p v-if="character?.alias.length" class="text-sm text-gray-500 mb-6">
        别名：{{ character.alias.join('、') }}
      </p>

      <template v-if="character">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="glass rounded-xl p-4 text-center">
            <div class="text-xs text-gray-500 mb-1">境界</div>
            <div class="text-green-400 font-bold">{{ character.cultivation }}</div>
          </div>
          <div class="glass rounded-xl p-4 text-center">
            <div class="text-xs text-gray-500 mb-1">势力</div>
            <div class="text-amber-400 font-bold">{{ factionName }}</div>
          </div>
          <div class="glass rounded-xl p-4 text-center">
            <div class="text-xs text-gray-500 mb-1">首次出场</div>
            <div class="text-blue-400 font-bold">第{{ character.firstChapter }}章</div>
          </div>
          <div class="glass rounded-xl p-4 text-center">
            <div class="text-xs text-gray-500 mb-1">性别</div>
            <div class="text-purple-400 font-bold">{{ character.gender === 'male' ? '男' : character.gender === 'female' ? '女' : '未知' }}</div>
          </div>
        </div>

        <div class="glass rounded-xl p-6 mb-8">
          <h2 class="font-display text-lg mb-3" style="color: var(--accent-gold);">人物简介</h2>
          <p class="text-sm text-gray-300 leading-relaxed">{{ character.description }}</p>
        </div>

        <div class="glass rounded-xl p-6 mb-8">
          <h2 class="font-display text-lg mb-4" style="color: var(--accent-gold);">人际关系</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="rel in relationships"
              :key="rel.id"
              class="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              @click="router.push({ name: 'character', params: { id: rel.otherId } })"
            >
              <span
                class="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                :style="{ backgroundColor: RELATIONSHIP_COLORS[rel.type] }"
              ></span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs px-2 py-0.5 rounded-full" :style="{ backgroundColor: RELATIONSHIP_COLORS[rel.type] + '22', color: RELATIONSHIP_COLORS[rel.type] }">
                    {{ rel.type }}
                  </span>
                  <span class="text-sm text-amber-300">{{ rel.otherName }}</span>
                </div>
                <div class="text-xs text-gray-500">{{ rel.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="glass rounded-xl p-6">
          <h2 class="font-display text-lg mb-4" style="color: var(--accent-gold);">相关事件</h2>
          <div class="relative pl-6 border-l-2 border-amber-900/30 space-y-4">
            <div
              v-for="evt in charEvents"
              :key="evt.id"
              class="relative animate-fade-in"
            >
              <div class="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-amber-700/60 border-2 border-amber-900/40"></div>
              <div class="p-3 rounded-lg bg-white/5">
                <div class="text-sm text-amber-300 mb-1">第{{ evt.chapter }}章 · {{ evt.title }}</div>
                <div class="text-xs text-gray-400">{{ evt.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useKnowledgeStore } from '@/stores/knowledge'
import { RELATIONSHIP_COLORS } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useKnowledgeStore()

const character = computed(() => store.getCharacterById(route.params.id as string))

const factionName = computed(() => {
  if (!character.value) return ''
  const f = store.getFactionById(character.value.factionId)
  return f?.name || '无'
})

const relationships = computed(() => {
  if (!character.value) return []
  const charId = route.params.id as string
  return store.getCharacterRelationships(charId).map(r => {
    const isSource = r.sourceId === charId
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
  const charId = route.params.id as string
  return store.getCharacterEvents(charId).sort((a, b) => a.chapter - b.chapter)
})
</script>
