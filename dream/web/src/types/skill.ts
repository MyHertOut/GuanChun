import { Element } from './pet'

// 技能数据
export interface SkillData {
  id: string
  name: string
  element: Element
  type: SkillType
  power: number
  cost: number
  accuracy: number
  description: string
  effect?: SkillEffect
}

// 技能类型
export type SkillType = '物理' | '魔法' | '辅助' | '防御' | '控制'

// 技能效果
export interface SkillEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'status'
  value?: number
  statusType?: StatusType
  duration?: number
}

// 状态类型
export type StatusType = 'burn' | 'freeze' | 'poison' | 'sleep'
