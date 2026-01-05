import api from './index'
import type { SaveData } from '@/types/player'

export const saveApi = {
  // 保存游戏
  save: (data: { saveData: SaveData }) => api.post<{ saveId: string; timestamp: number }>('/save', data),

  // 加载存档
  load: (id: string) => api.get<SaveData>(`/save/${id}`),

  // 获取存档列表
  list: () => api.get<any[]>('/saves/list'),

  // 删除存档
  delete: (id: string) => api.delete(`/save/${id}`)
}
