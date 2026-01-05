import api from './index'
import type { BattleState, BattleAction, BattleResult } from '@/types/battle'

export const battleApi = {
  // 开始战斗
  start: (data: { playerPetId: string; enemyPetId: string }) =>
    api.post<{ battleId: string; initialState: BattleState }>('/battle/start', data),

  // 提交行动
  action: (battleId: string, data: { action: BattleAction }) =>
    api.post<{ result: any; battleState: BattleState; logs: any[] }>(`/battle/${battleId}/action`, data),

  // 结束战斗
  finish: (battleId: string) => api.post<BattleResult>(`/battle/${battleId}/finish`, {})
}
