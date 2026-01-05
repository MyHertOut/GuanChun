<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'

const router = useRouter()
const playerStore = usePlayerStore()

const playerName = ref('')
const isCreating = ref(false)

// 使用 computed 确保安全访问
const hasPlayer = computed(() => playerStore.player !== null)

const startGame = async () => {
  if (!playerName.value.trim()) return

  isCreating.value = true
  try {
    await playerStore.createPlayer(playerName.value)
    router.push('/battle')
  } catch (error) {
    console.error('创建角色失败', error)
  } finally {
    isCreating.value = false
  }
}

const continueGame = () => {
  router.push('/battle')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">宠魅</h1>
        <p class="text-gray-600">魂宠世界 - 灵魂羁绊</p>
      </div>

      <div class="space-y-4">
        <div v-if="!hasPlayer">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">魂宠师姓名</label>
            <input
              v-model="playerName"
              type="text"
              placeholder="请输入你的名字"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              @keyup.enter="startGame"
            />
          </div>
          <button
            @click="startGame"
            :disabled="!playerName.trim() || isCreating"
            class="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isCreating ? '创建中...' : '开始旅程' }}
          </button>
        </div>

        <div v-else>
          <div class="text-center mb-6">
            <p class="text-lg font-medium text-gray-800">{{ playerStore.player?.name }}</p>
            <p class="text-sm text-gray-600">{{ playerStore.player?.level }} 魂宠师</p>
          </div>
          <button
            @click="continueGame"
            class="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            继续游戏
          </button>
        </div>
      </div>

      <div class="mt-6 text-center text-xs text-gray-500">
        <p>© 2026 魂宠世界 | 基于Vue 3 + TypeScript</p>
      </div>
    </div>
  </div>
</template>
