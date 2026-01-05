import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BattleState, BattleLog, BattleStatus } from '@/types/battle'

export const useBattleStore = defineStore('battle', () => {
  // 状态
  const state = ref<BattleState | null>(null)
  const logs = ref<BattleLog[]>([])
  const currentRound = ref(0)

  // 计算属性
  const battleStatus = computed(() => state.value?.battleStatus ?? 'idle')
  const isPlayerTurn = computed(() => state.value?.isPlayerTurn ?? false)
  const playerPet = computed(() => state.value?.playerPet ?? null)
  const enemyPet = computed(() => state.value?.enemyPet ?? null)

  // 方法
  const setState = (newState: BattleState) => {
    state.value = newState
    logs.value = newState.battleLogs || []
    currentRound.value = newState.round
  }

  const addLog = (log: BattleLog) => {
    logs.value.push(log)
  }

  const reset = () => {
    state.value = null
    logs.value = []
    currentRound.value = 0
  }

  return {
    state,
    logs,
    currentRound,
    battleStatus,
    isPlayerTurn,
    playerPet,
    enemyPet,
    setState,
    addLog,
    reset
  }
})
