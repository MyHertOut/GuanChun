import api from './index'
import type { Player, CreatePlayerRequest, UpdatePlayerRequest } from '@/types/player'
import type { ApiResponse } from '@/types/api'

export const playerApi = {
  // 创建玩家
  create: (data: CreatePlayerRequest) => api.post<ApiResponse<Player>>('/player/create', data),

  // 获取玩家信息
  getInfo: () => api.get<ApiResponse<Player>>('/player/info'),

  // 更新玩家状态
  update: (data: UpdatePlayerRequest) => api.put<ApiResponse<Player>>('/player/update', data)
}
