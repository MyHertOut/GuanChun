import { PetInstance } from './pet'

// 玩家
export interface Player {
  id: string
  name: string
  soulPower: number
  maxSoulPower: number
  level: SoulLevel
  pactSlots: PactSlot[]
  inventory: InventoryItem[]
  gold: number
}

// 魂力等级
export type SoulLevel = '魂徒' | '魂士' | '魂师' | '魂主' | '魂皇' | '魂帝' | '魂尊'

// 契约槽位
export interface PactSlot {
  slotId: number
  petUid: string | null
  isLocked: boolean
  unlockLevel?: SoulLevel
}

// 背包物品
export interface InventoryItem {
  itemId: string
  name: string
  type: 'soul_core' | 'item' | 'equipment'
  quantity: number
  description: string
}

// 物品
export interface Item {
  id: string
  name: string
  type: string
  effect: any
  value: number
  description: string
}

// 创建玩家请求
export interface CreatePlayerRequest {
  name: string
}

// 更新玩家请求
export interface UpdatePlayerRequest {
  soulPower?: number
  level?: SoulLevel
  gold?: number
}

// 存档数据
export interface SaveData {
  player: Player
  timestamp: number
  saveName: string
}
