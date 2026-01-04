# Vue3 + TypeScript 简明开发规范

## 核心原则
1. **技术栈**: Vue3 (Composition API + `<script setup>`) + TypeScript (Strict Mode)。
2. **工具链**: Vite + Pinia + Vue Router 4 + Element Plus/Naive UI。
3. **代码质量**: 单一职责，高内聚低耦合，禁止冗余逻辑与魔法值。

## 编码规范
1. **组件**: 
   - 必须用 `<script setup lang="ts" name="XXX">`。
   - Props/Emits 必须定义完整 TS 类型 (`defineProps<Props>()`, `defineEmits<{...}>`)。
   - 优先使用 `ref` (基础/独立类型) 和 `reactive` (关联对象)。
   - 禁止 Options API。
2. **TypeScript**:
   - 启用 `strict: true`，禁止 `any` (必要时用 `unknown` + 断言)。
   - 所有函数/组件必须显式定义输入输出类型。
   - 接口用 `interface` (PascalCase, 可加 `I` 前缀)，联合类型用 `type`。
3. **样式**:
   - 使用 `<style scoped>`，遵循 BEM 或使用 Tailwind CSS。
   - 禁止 `v-html` (防XSS)。
   - `v-for` 必须绑定唯一 `key` (禁止用 index)。

## 架构规范
1. **目录结构**:
   - `components/`: atoms (原子), molecules (分子), organisms (有机体), templates (模板)。
   - `views/`: 页面组件。
   - `store/`: Pinia 模块化状态 (禁止 Vuex)。
   - `services/`: Axios 封装与 API 模块。
   - `hooks/`: 业务逻辑复用。
2. **状态管理**: 
   - 全局状态用 Pinia，局部状态用 `ref/reactive`。
   - 异步操作封装在 `actions`。
3. **路由**:
   - 懒加载组件 (`() => import(...)`)。
   - 命名路由 (kebab-case)。

## 工程化
1. **规范**: ESLint + Prettier + Stylelint。
2. **提交**: Conventional Commits (`feat`, `fix`, `docs`, etc.)。
3. **环境**: 开发/测试/生产环境分离 (`.env.development` 等)。

## 性能优化
1. **渲染**: 长列表用虚拟滚动，图片懒加载/WebP。
2. **构建**: 第三方库按需引入或 CDN，代码拆分。
3. **网络**: 接口缓存，批量请求，超时重试。

## AI 协作
1. 生成代码需带 TS 类型和 JSDoc 注释。
2. 优先复用现有结构与工具。
3. 确保代码通过 Lint 校验。
