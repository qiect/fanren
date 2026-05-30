import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Character, Relationship, Faction, StoryEvent, RelationshipType } from '@/types'
import { characters as chars, relationships as rels, factions as facs, events as evts } from '@/data/knowledge'

export const useKnowledgeStore = defineStore('knowledge', () => {
  const characters = ref<Character[]>(chars)
  const relationships = ref<Relationship[]>(rels)
  const factions = ref<Faction[]>(facs)
  const events = ref<StoryEvent[]>(evts)

  const searchQuery = ref('')
  const selectedFactions = ref<string[]>([])
  const selectedCultivations = ref<string[]>([])
  const selectedRelationshipTypes = ref<RelationshipType[]>([])
  const selectedCharacterId = ref<string | null>(null)

  const getCharacterById = computed(() => {
    const map = new Map<string, Character>()
    characters.value.forEach(c => map.set(c.id, c))
    return (id: string) => map.get(id)
  })

  const getFactionById = computed(() => {
    const map = new Map<string, Faction>()
    factions.value.forEach(f => map.set(f.id, f))
    return (id: string) => map.get(id)
  })

  const getCharacterRelationships = computed(() => {
    return (charId: string) =>
      relationships.value.filter(r => r.sourceId === charId || r.targetId === charId)
  })

  const getCharacterEvents = computed(() => {
    return (charId: string) =>
      events.value.filter(e => e.participantIds.includes(charId))
  })

  const filteredCharacters = computed(() => {
    let result = characters.value

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.alias.some(a => a.toLowerCase().includes(q))
      )
    }

    if (selectedFactions.value.length > 0) {
      result = result.filter(c => selectedFactions.value.includes(c.factionId))
    }

    if (selectedCultivations.value.length > 0) {
      result = result.filter(c => selectedCultivations.value.includes(c.cultivation))
    }

    return result
  })

  const filteredRelationships = computed(() => {
    const charIds = new Set(filteredCharacters.value.map(c => c.id))
    let result = relationships.value.filter(r => charIds.has(r.sourceId) && charIds.has(r.targetId))

    if (selectedRelationshipTypes.value.length > 0) {
      result = result.filter(r => selectedRelationshipTypes.value.includes(r.type))
    }

    return result
  })

  const allCultivationLevels = computed(() => {
    const levels = new Set(characters.value.map(c => c.cultivation))
    return Array.from(levels)
  })

  const allRelationshipTypes = computed(() => {
    const types = new Set(relationships.value.map(r => r.type))
    return Array.from(types) as RelationshipType[]
  })

  const topLevelFactions = computed(() =>
    factions.value.filter(f => f.parentId === null)
  )

  const getFactionCharacters = computed(() => {
    return (factionId: string) =>
      characters.value.filter(c => c.factionId === factionId)
  })

  const getSubFactions = computed(() => {
    return (parentId: string) =>
      factions.value.filter(f => f.parentId === parentId)
  })

  function setSearchQuery(q: string) {
    searchQuery.value = q
  }

  function toggleFaction(factionId: string) {
    const idx = selectedFactions.value.indexOf(factionId)
    if (idx >= 0) selectedFactions.value.splice(idx, 1)
    else selectedFactions.value.push(factionId)
  }

  function toggleCultivation(level: string) {
    const idx = selectedCultivations.value.indexOf(level)
    if (idx >= 0) selectedCultivations.value.splice(idx, 1)
    else selectedCultivations.value.push(level)
  }

  function toggleRelationshipType(type: RelationshipType) {
    const idx = selectedRelationshipTypes.value.indexOf(type)
    if (idx >= 0) selectedRelationshipTypes.value.splice(idx, 1)
    else selectedRelationshipTypes.value.push(type)
  }

  function selectCharacter(id: string | null) {
    selectedCharacterId.value = id
  }

  function clearFilters() {
    searchQuery.value = ''
    selectedFactions.value = []
    selectedCultivations.value = []
    selectedRelationshipTypes.value = []
  }

  return {
    characters,
    relationships,
    factions,
    events,
    searchQuery,
    selectedFactions,
    selectedCultivations,
    selectedRelationshipTypes,
    selectedCharacterId,
    filteredCharacters,
    filteredRelationships,
    allCultivationLevels,
    allRelationshipTypes,
    topLevelFactions,
    getCharacterById,
    getFactionById,
    getCharacterRelationships,
    getCharacterEvents,
    getFactionCharacters,
    getSubFactions,
    setSearchQuery,
    toggleFaction,
    toggleCultivation,
    toggleRelationshipType,
    selectCharacter,
    clearFilters,
  }
})
