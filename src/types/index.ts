export interface Character {
  id: string
  name: string
  alias: string[]
  cultivation: string
  factionId: string
  description: string
  firstChapter: number
  gender: 'male' | 'female' | 'unknown'
}

export interface Relationship {
  id: string
  sourceId: string
  targetId: string
  type: '师徒' | '同门' | '夫妻' | '盟友' | '敌对' | '亲属' | '主仆' | '知己'
  description: string
}

export interface Faction {
  id: string
  name: string
  type: '门派' | '家族' | '帮派' | '组织' | '势力'
  description: string
  parentId: string | null
}

export interface StoryEvent {
  id: string
  title: string
  description: string
  chapter: number
  participantIds: string[]
  factionId: string | null
}

export type RelationshipType = Relationship['type']

export const RELATIONSHIP_COLORS: Record<RelationshipType, string> = {
  '师徒': '#f59e0b',
  '同门': '#3b82f6',
  '夫妻': '#ec4899',
  '盟友': '#10b981',
  '敌对': '#ef4444',
  '亲属': '#8b5cf6',
  '主仆': '#6366f1',
  '知己': '#14b8a6',
}

export const FACTION_COLORS: Record<string, string> = {
  'qixuanmen': '#ef4444',
  'qixuanmen_wai': '#f97316',
  'qixuanmen_nei': '#dc2626',
  'yelaobang': '#6b7280',
  'huangfenggu': '#22c55e',
  'luoyunzong': '#3b82f6',
  'yanyuezong': '#a855f7',
  'yulingshan': '#f59e0b',
  'guiyuanzong': '#84cc16',
  'tianquebao': '#06b6d4',
  'jujianmen': '#f43f5e',
  'xuanjiange': '#6366f1',
  'gujianmen': '#e11d48',
  'baiqiaoyuan': '#d97706',
  'hanjia': '#8b5cf6',
  'mojia': '#ec4899',
  'tianxingzong': '#0ea5e9',
  'xinggong': '#c084fc',
  'nixingmeng': '#991b1b',
  'wanfamen': '#2563eb',
  'shengmodao': '#7c3aed',
  'jiyindao': '#475569',
  'miaoyinmen': '#f472b6',
  'other': '#64748b',
}

export const CULTIVATION_LEVELS = [
  '凡人', '炼气期', '筑基期', '结丹期', '元婴期', '化神期',
] as const

export type CultivationLevel = typeof CULTIVATION_LEVELS[number]
