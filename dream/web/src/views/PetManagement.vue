<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePetStore } from '@/stores/pet'

const petStore = usePetStore()

onMounted(() => {
  petStore.fetchPets()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">魂宠管理</h1>

      <div v-if="petStore.loading" class="text-center py-12">
        <p class="text-gray-600">加载中...</p>
      </div>

      <div v-else-if="petStore.pets.length === 0" class="bg-white rounded-lg shadow p-6 text-center">
        <p class="text-gray-600">暂无魂宠</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="pet in petStore.pets"
          :key="pet.uid"
          class="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
        >
          <h3 class="text-lg font-bold text-gray-800 mb-2">{{ pet.nickname || pet.name }}</h3>
          <p class="text-sm text-gray-600">等级: {{ pet.level }}</p>
          <p class="text-sm text-gray-600">生命: {{ pet.hp }} / {{ pet.maxHp }}</p>
          <div class="mt-2">
            <span
              v-for="element in pet.elements"
              :key="element"
              class="inline-block px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-800 mr-1"
            >
              {{ element }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
