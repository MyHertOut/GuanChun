import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  // 状态
  const loading = ref(false)
  const toastMessage = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const showModal = ref(false)
  const modalContent = ref<any>(null)

  // 方法
  const showLoading = () => {
    loading.value = true
  }

  const hideLoading = () => {
    loading.value = false
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    toastMessage.value = { message, type }
    setTimeout(() => {
      toastMessage.value = null
    }, 3000)
  }

  const openModal = (content: any) => {
    modalContent.value = content
    showModal.value = true
  }

  const closeModal = () => {
    showModal.value = false
    modalContent.value = null
  }

  return {
    loading,
    toastMessage,
    showModal,
    modalContent,
    showLoading,
    hideLoading,
    showToast,
    openModal,
    closeModal
  }
})
