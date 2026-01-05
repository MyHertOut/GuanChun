import { PetInstance } from './pet'

// 战斗状态
export interface BattleState {
  battleId: string
  round: number
  playerPet: PetInstance
  enemyPet: PetInstance
  battleLogs: BattleLog[]
  isPlayerTurn: boolean
  battleStatus: BattleStatus
  environment?: string
}

// 战斗状态
export type BattleStatus = 'idle' | 'active' | 'finished'

// 战斗日志
export interface BattleLog {
  id: string
  round: number
  source: 'player' | 'enemy' | 'system'
  type: 'attack' | 'skill' | 'damage' | 'heal' | 'status' | 'evolution' | 'system'
  message: string
  value?: number
  timestamp: number
}

// 战斗行动
export interface BattleAction {
  type: 'attack' | 'skill' | 'item' | 'defend' | 'switch'
  skillId?: string
  itemId?: string
  petId?: string
}

// 战斗结果
export interface BattleResult {
  winner: 'player' | 'enemy'
  exp: number
  items: any[]
  gold: number
}
