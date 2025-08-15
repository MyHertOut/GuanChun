import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  /* 处理错误 */
  console.error('Vue 错误:', err)
  console.error('组件实例:', instance)
  console.error('错误信息:', info)
}

app.use(createPinia())
app.use(router)

app.mount('#app')
