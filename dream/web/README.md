# 魂宠世界 - 前端项目

基于 Vue 3 + TypeScript + Vite 构建的前端应用。

## 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **语言**: TypeScript
- **状态管理**: Pinia
- **路由**: Vue Router
- **UI框架**: TailwindCSS
- **HTTP客户端**: Axios
- **工具库**: Day.js

## 项目结构

```
src/
├── api/              # API接口定义
│   ├── index.ts      # Axios实例配置
│   ├── battle.ts     # 战斗相关接口
│   ├── pet.ts        # 魂宠相关接口
│   ├── player.ts     # 玩家相关接口
│   └── save.ts       # 存档相关接口
├── assets/           # 静态资源
├── components/       # UI组件
├── composables/      # 组合式函数
├── router/           # 路由配置
├── stores/           # Pinia状态
│   ├── battle.ts     # 战斗状态
│   ├── pet.ts        # 魂宠状态
│   ├── player.ts     # 玩家状态
│   └── ui.ts         # UI状态
├── types/            # TypeScript类型定义
│   ├── api.ts        # API类型
│   ├── battle.ts     # 战斗类型
│   ├── pet.ts        # 魂宠类型
│   ├── player.ts     # 玩家类型
│   └── skill.ts      # 技能类型
├── utils/            # 工具函数
├── views/            # 页面视图
│   ├── Home.vue      # 首页
│   ├── Battle.vue    # 战斗页面
│   ├── PetManagement.vue  # 魂宠管理
│   ├── Exploration.vue   # 探索页面
│   └── Settings.vue      # 设置页面
├── App.vue           # 根组件
├── main.ts           # 入口文件
└── style.css         # 全局样式
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问: http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 代码规范

```bash
# ESLint 检查
npm run lint

# Prettier 格式化
npm run format
```

## 配置说明

### 环境变量

创建 `.env.local` 文件（可选）：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### API代理

开发环境下，Vite 会自动代理 `/api` 请求到 `http://localhost:3000`。

## 核心功能

### 状态管理

使用 Pinia 进行状态管理，主要包括：
- `battleStore`: 战斗状态管理
- `petStore`: 魂宠状态管理
- `playerStore`: 玩家状态管理
- `uiStore`: UI状态管理（Loading、Toast、Modal）

### 路由

使用 Vue Router 进行页面路由，包含：
- `/`: 首页
- `/battle`: 战斗页面（需要认证）
- `/pets`: 魂宠管理（需要认证）
- `/exploration`: 探索页面（需要认证）
- `/settings`: 设置页面（需要认证）

### API调用

所有API调用通过 `api/` 目录下的模块进行，已配置：
- 统一错误处理
- 自动添加 Authorization header
- 响应拦截器处理

## 开发规范

### 组件开发

1. 使用 `<script setup>` 和 `lang="ts"`
2. Props 使用 TypeScript 接口定义
3. Emits 使用 `defineEmits<T>()`
4. 使用组合式 API (Composition API)

示例：

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  pet: PetInstance
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [id: string]
}>()

const isHovered = ref(false)

const displayName = computed(() => {
  return props.pet.nickname || props.pet.name
})
</script>
```

### 命名规范

- 组件文件: PascalCase (e.g., `BattleView.vue`)
- 组件名: PascalCase (e.g., `BattleView`)
- 变量/函数: camelCase (e.g., `playerHealth`)
- 常量: SCREAMING_SNAKE_CASE (e.g., `MAX_SOUL_POWER`)
- 类型/接口: PascalCase (e.g., `PetInstance`)

### API接口

使用定义好的 API 模块调用接口：

```typescript
import { petApi } from '@/api/pet'

// 获取魂宠列表
const pets = await petApi.getList()

// 获取魂宠详情
const pet = await petApi.getDetail(petId)
```

## 注意事项

1. 确保后端服务已启动在 `http://localhost:3000`
2. 首次运行需要安装依赖
3. TypeScript 类型检查通过后再提交代码
4. 使用 Prettier 格式化代码

## 相关文档

- [Vue 3 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [TailwindCSS 官方文档](https://tailwindcss.com/)
