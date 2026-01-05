// 魂宠品种数据
export interface PetData {
  id: string
  name: string
  rank: SpeciesRank
  elements: Element[]
  description: string
  baseStats: BaseStats
  skills: PetSkill[]
  evolutions: Evolution[]
}

// 魂宠实例
export interface PetInstance extends PetData {
  uid: string // 唯一实例ID
  nickname: string // 昵称
  level: number // 当前等级
  exp: number // 当前经验
  maxExp: number // 升级所需经验
  stats: BattleStats // 当前战斗属性
  hp: number // 当前HP
  maxHp: number // 最大HP
  stamina: number // 当前体力
  maxStamina: number // 最大体力
  learnedSkills: string[] // 已学习技能ID
  loyalty: number // 忠诚度
  mutationPoints: number // 异变积分
}

// 物种等级
export type SpeciesRank =
  | '奴仆级'
  | '战将级'
  | '统领级'
  | '君主级'
  | '帝皇级'
  | '主宰级'
  | '不朽级'

// 元素类型
export type Element =
  | '兽'
  | '妖灵'
  | '火'
  | '冰'
  | '雷'
  | '风'
  | '木'
  | '虫'
  | '鬼'
  | '龙'
  | '光'
  | '暗'

// 基础属性
export interface BaseStats {
  health: number
  stamina: number
  attack: number
  defense: number
  speed: number
}

// 战斗属性
export interface BattleStats {
  hp: number
  maxHp: number
  stamina: number
  maxStamina: number
  attack: number
  defense: number
  speed: number
}

// 魂宠技能
export interface PetSkill {
  learnLevel: number
  skillId: string
  name: string
}

// 进化/异变
export interface Evolution {
  targetId: string
  type: 'evolution' | 'mutation'
  condition: EvolutionCondition
}

// 进化条件
export interface EvolutionCondition {
  minLevel?: number
  itemNeeded?: string
  environment?: string
  description?: string
}

// 魂宠进化请求
export interface PetEvolutionRequest {
  evolutionId: string
  items?: any[]
}
