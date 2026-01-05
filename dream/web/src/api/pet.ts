import api from './index'
import type { PetInstance, PetData, PetEvolutionRequest } from '@/types/pet'

export const petApi = {
  // 获取玩家所有魂宠
  getList: () => api.get<PetInstance[]>('/pets/list'),

  // 获取魂宠详情
  getDetail: (id: string) => api.get<PetInstance>(`/pets/${id}`),

  // 魂宠进化/异变
  evolve: (id: string, data: PetEvolutionRequest) => api.post<{ success: boolean; newPet: PetInstance; logs: string[] }>(`/pets/${id}/evolve`, data),

  // 魂宠升级
  levelUp: (id: string, data: { exp: number; items?: any[] }) =>
    api.post<{ success: boolean; newLevel: number; stats: any }>(`/pets/${id}/level-up`, data),

  // 获取魂宠图鉴
  getDex: () => api.get<PetData[]>('/pets/dex')
}
