import { defineStore } from 'pinia'
import { ref } from 'vue'
import { playerApi } from '@/api/player'
import type { Player } from '@/types/player'
import type { ApiResponse } from '@/types/api'

export const usePlayerStore = defineStore('player', () => {
  // 状态
  const player = ref<Player | null>(null)
  const loading = ref(false)

  // 方法
  const createPlayer = async (name: string) => {
    loading.value = true
    try {
      // 强制类型断言，因为拦截器改变了返回值
      const result = await playerApi.create({ name }) as unknown as ApiResponse<Player>
      if (result.success && result.data) {
        localStorage.setItem('playerId', result.data.id)
        // TODO: 处理初始魂宠
        await fetchPlayerInfo()
        return result.data
      }
      return null
    } catch (error) {
      console.error('创建玩家失败', error)
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchPlayerInfo = async () => {
    loading.value = true
    try {
      const result = await playerApi.getInfo() as unknown as ApiResponse<Player>
      if (result.success && result.data) {
        player.value = result.data
        return result.data
      }
      return null
    } catch (error) {
      console.error('获取玩家信息失败', error)
      return null
    } finally {
      loading.value = false
    }
  }

  const updatePlayer = async (data: any) => {
    try {
      const result = await playerApi.update(data) as unknown as ApiResponse<Player>
      if (result.success && result.data) {
        player.value = result.data
        return result.data
      }
      return null
    } catch (error) {
      console.error('更新玩家信息失败', error)
      return null
    }
  }

  const logout = () => {
    player.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('playerId')
  }

  return {
    player,
    loading,
    createPlayer,
    fetchPlayerInfo,
    updatePlayer,
    logout
  }
})
