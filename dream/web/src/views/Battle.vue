<script setup lang="ts">
import { ref } from 'vue'
import { useBattleStore } from '@/stores/battle'
import { usePetStore } from '@/stores/pet'

const battleStore = useBattleStore()
const petStore = usePetStore()

const inBattle = ref(false)

// 暂时创建一个模拟战斗
const startBattle = () => {
  inBattle.value = true
  // TODO: 实现战斗逻辑
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">战斗系统</h1>

      <div v-if="!inBattle" class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">战斗系统开发中...</p>
        <button
          @click="startBattle"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          开始模拟战斗
        </button>
      </div>

      <div v-else class="bg-white rounded-lg shadow p-6">
        <p>战斗中...</p>
      </div>
    </div>
  </div>
</template>
