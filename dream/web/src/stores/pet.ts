import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { petApi } from '@/api/pet'
import type { PetInstance, PetData } from '@/types/pet'

export const usePetStore = defineStore('pet', () => {
  // 状态
  const pets = ref<PetInstance[]>([])
  const activePet = ref<PetInstance | null>(null)
  const petDex = ref<PetData[]>([])
  const loading = ref(false)

  // 计算属性
  const petCount = computed(() => pets.value.length)

  // 方法
  const fetchPets = async () => {
    loading.value = true
    try {
      const result = await petApi.getList()
      pets.value = result
    } catch (error) {
      console.error('获取魂宠列表失败', error)
    } finally {
      loading.value = false
    }
  }

  const fetchPetDetail = async (id: string) => {
    loading.value = true
    try {
      const result = await petApi.getDetail(id)
      return result
    } catch (error) {
      console.error('获取魂宠详情失败', error)
      return null
    } finally {
      loading.value = false
    }
  }

  const evolvePet = async (petId: string, evolutionId: string) => {
    try {
      const result = await petApi.evolve(petId, { evolutionId })
      if (result.success) {
        const index = pets.value.findIndex(p => p.uid === petId)
        if (index !== -1) {
          pets.value[index] = result.newPet
        }
      }
      return result
    } catch (error) {
      console.error('魂宠异变失败', error)
      return null
    }
  }

  const levelUpPet = async (petId: string, exp: number) => {
    try {
      const result = await petApi.levelUp(petId, { exp })
      if (result.success) {
        const index = pets.value.findIndex(p => p.uid === petId)
        if (index !== -1) {
          pets.value[index].level = result.newLevel
        }
      }
      return result
    } catch (error) {
      console.error('魂宠升级失败', error)
      return null
    }
  }

  const setActivePet = (pet: PetInstance | null) => {
    activePet.value = pet
  }

  const addPet = (pet: PetInstance) => {
    pets.value.push(pet)
  }

  const fetchPetDex = async () => {
    try {
      const result = await petApi.getDex()
      petDex.value = result
    } catch (error) {
      console.error('获取魂宠图鉴失败', error)
    }
  }

  return {
    pets,
    activePet,
    petDex,
    loading,
    petCount,
    fetchPets,
    fetchPetDetail,
    evolvePet,
    levelUpPet,
    setActivePet,
    addPet,
    fetchPetDex
  }
})
