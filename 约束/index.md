# Vue3 + TypeScript 前端自定义规则集
## 规则说明
本规则集适用于 TRAE 等支持用户自定义规则的工具，涵盖 Vue3 + TS 前端开发全流程，遵循官方最佳实践与工程化标准，跨项目切换时保持有效，无需额外适配。

---

### 一、核心原则（优先级最高，不可违背）
1.  始终遵循《Vue3 官方最佳实践指南》与《TypeScript 严格模式规范》，优先使用 `<script setup>` 语法糖的 Composition API，禁止使用 Options API（仅老项目兼容场景除外，需在代码中明确标注例外原因）。
2.  所有代码必须满足「可维护性、可扩展性、可复用性」三大要求，严格遵循「单一职责原则」，杜绝冗余逻辑、魔法值与晦涩难懂的代码写法。
3.  跨项目切换时，本规则集保持全局一致性，无需根据项目差异修改；特殊场景需偏离规则时，必须在代码中添加详细注释说明理由，且需通过团队评审。
4.  优先选用 Vue 生态官方推荐工具链（Vite、Pinia、Vue Router 4、Element Plus/Naive UI），禁止使用已废弃、小众无维护或存在安全漏洞的第三方依赖库。
5.  代码编写以「高可读性、低耦合度」为核心，注释需清晰简洁，关键业务逻辑、复杂算法必须附带详细说明，便于团队协作与后期维护。

### 二、编码规范（语法级约束，强制遵循）
#### （一）基础语法规则
1.  `<script setup>` 语法约束
    -  组件必须使用 `<script setup lang="ts">` 语法糖，禁止手动编写 `setup()` 函数（特殊兼容场景除外）。
    -  组件 Props 必须通过 `defineProps` 配合 TypeScript 接口/类型别名定义，禁止使用运行时声明方式，可选属性需明确标注，默认值通过 `withDefaults` 设置，示例：
      ```typescript
      interface ButtonProps {
        text: string;
        type?: 'primary' | 'success' | 'warning' | 'danger';
        size?: 'small' | 'default' | 'large';
      }
      const props = withDefaults(defineProps<ButtonProps>(), {
        type: 'default',
        size: 'default'
      });
      ```
    -  组件事件必须通过 `defineEmits` 进行类型标注，禁止隐式声明事件，示例：
      ```typescript
      const emit = defineEmits<{
        (e: 'click', payload: { id: number; value: string }): void;
        (e: 'blur'): void;
      }>();
      ```
    -  响应式数据使用：基础类型/独立复杂类型优先用 `ref`（命名需添加「Ref」后缀，如 `countRef = ref(0)`），关联复杂对象优先用 `reactive`；禁止使用 Vue2 中的 `Vue.observable`，避免响应式丢失问题。
    -  全局变量/方法注册：需通过 `defineExpose` 对外暴露组件内部属性/方法，禁止直接挂载到 `window` 对象上。

2.  TypeScript 语法约束
    -  必须在 `tsconfig.json` 中启用严格模式（`"strict": true`），包含 `noImplicitAny`、`strictNullChecks` 等子规则；禁止使用 `any` 类型，特殊场景需使用 `unknown` 类型并通过类型断言进行安全转换，且需添加注释说明。
    -  所有函数、组件、工具方法、接口必须定义完整的输入输出类型，箭头函数简单逻辑可依赖类型推导，复杂业务逻辑必须显式声明返回值类型。
    -  接口（`interface`）用于定义对象结构（如 Props、API 响应数据），类型别名（`type`）用于联合类型、交叉类型、字面量类型，禁止混用两者的使用场景；接口命名采用 `PascalCase` 格式，且以「I」开头（可选，如 `IUserInfo`）。
    -  枚举（`enum`）仅用于固定常量集合（如状态码、业务枚举值），禁止滥用枚举增加代码复杂度；简单常量优先使用 `as const` 定义只读常量对象。
    -  泛型使用：工具函数、组件需要支持多类型复用场景时，必须使用泛型（如 `useRequest<T>()`），禁止为适配多类型而使用 `any`。

3.  模板与样式规则
    -  模板中禁止使用 `v-html` 指令（防止 XSS 攻击），特殊场景需使用安全过滤库（如 `dompurify`）处理内容后，再添加注释说明风险。
    -  样式必须使用 `<style scoped>` 进行组件隔离，全局样式统一存放于 `src/styles/` 目录下，禁止在组件内编写无 `scoped` 的全局样式；如需修改子组件样式，使用 `:deep()` 伪类，且需谨慎使用。
    -  样式命名遵循 BEM 规范（块-元素-修饰符，如 `button--primary`、`user-card__avatar`），或使用 CSS Modules/Tailwind CSS；禁止使用内联样式，特殊布局场景除外。
    -  模板指令使用：`v-if`/`v-else` 用于条件渲染，`v-for` 必须绑定唯一 `key`（优先使用业务唯一 ID，禁止使用 `index` 作为 `key`）；禁止在同一元素上同时使用 `v-for` 与 `v-if`，需将 `v-if` 提升到父元素或使用 `<template>` 包裹。
    -  模板插值：复杂逻辑禁止直接写在插值表达式中，需通过 `computed` 计算属性封装后使用。

#### （二）组件开发规则
1.  组件分层与目录规范
    -  组件按「原子设计」原则分层，目录结构严格遵循以下约定：
      -  原子组件：`src/components/atoms/`（如 Button、Input、Icon，无业务逻辑，纯 UI 组件，可全局复用）
      -  分子组件：`src/components/molecules/`（如 SearchBar、FormItem，由原子组件组合而成，具备简单交互逻辑）
      -  有机体组件：`src/components/organisms/`（如 UserCard、OrderList，包含完整业务逻辑，可跨页面复用）
      -  模板组件：`src/components/templates/`（如 PageLayout、ModalTemplate，负责页面布局与结构复用）
      -  页面组件：`src/views/`（对应路由页面，由有机体/分子组件组合而成，禁止作为公共组件复用）
    -  公共组件需在 `src/components/index.ts` 中统一注册导出，便于全局引入；页面组件按业务模块创建子目录（如 `src/views/user/`、`src/views/order/`）。

2.  组件设计规范
    -  原子组件必须具备高复用性，支持通过 `props` 自定义样式与行为，提供插槽（`slot`）与回调函数，禁止包含任何业务逻辑。
    -  组件文件命名采用 `PascalCase` 格式（如 `UserInfo.vue`、`SearchBar.vue`），禁止使用 `kebab-case` 命名组件文件；模板中使用组件时，可转为 `kebab-case` 格式（如 `<user-info />`）。
    -  组件内部逻辑：禁止直接调用 API 接口，需通过自定义 Hooks（`src/hooks/`）或服务层（`src/services/`）封装后调用；禁止在组件内定义过于复杂的业务逻辑，需拆分到 Hooks 中实现逻辑复用。
    -  组件注释：必须添加 JSDoc 注释，说明组件功能、`props` 含义、`emits` 事件，示例：
      ```vue
      /**
       * 通用按钮组件
       * @description 支持多种类型、尺寸的按钮，提供点击与失焦事件
       * @props text - 按钮显示文本（必填）
       * @props type - 按钮类型（可选，默认 default）
       * @props size - 按钮尺寸（可选，默认 default）
       * @emits click - 按钮点击事件，返回携带按钮信息的载荷
       * @emits blur - 按钮失焦事件
       */
      <template>
        <button :class="btnClass" @click="handleClick" @blur="emit('blur')">
          <slot>{{ text }}</slot>
        </button>
      </template>
      ```

### 三、架构约束（保障高扩展性，跨项目通用）
#### （一）项目目录结构（固定规范，不可随意修改）
```
src/
├── assets/          # 静态资源（按类型分类存放）
│   ├── images/      # 图片资源（WebP 格式优先，按业务模块子目录分类）
│   ├── styles/      # 全局样式（reset.scss、variables.scss、common.scss）
│   └── fonts/       # 字体文件（自定义字体、图标字体）
├── components/      # 通用组件（按原子/分子/有机体/模板分层）
│   ├── atoms/       # 原子组件
│   ├── molecules/   # 分子组件
│   ├── organisms/   # 有机体组件
│   ├── templates/   # 模板组件
│   └── index.ts     # 公共组件统一导出入口
├── hooks/           # 自定义 Hooks（按功能分类，命名以 use 开头）
│   ├── useRequest.ts # 网络请求 Hooks
│   ├── useAuth.ts    # 权限管理 Hooks
│   └── useResize.ts  # 窗口大小监听 Hooks
├── router/          # 路由配置（按业务模块拆分）
│   ├── index.ts     # 路由入口（创建 router 实例、全局守卫配置）
│   └── modules/     # 业务模块路由（如 user.ts、order.ts）
├── store/           # Pinia 状态管理（按业务模块拆分）
│   ├── index.ts     # Pinia 实例创建入口
│   ├── userStore.ts # 用户模块状态
│   └── appStore.ts  # 应用全局状态
├── services/        # API 服务（统一封装，按业务模块拆分）
│   ├── request.ts   # Axios 封装（拦截器、基础配置）
│   ├── user.ts      # 用户模块接口
│   └── order.ts     # 订单模块接口
├── utils/           # 工具函数（按功能分类，无业务逻辑）
│   ├── format.ts    # 格式化工具（时间、金额、字符串）
│   ├── validate.ts  # 校验工具（表单、数据格式）
│   └── storage.ts   # 本地存储工具（localStorage/sessionStorage 封装）
├── types/           # TypeScript 类型定义（按业务模块拆分）
│   ├── global.ts    # 全局类型（如全局接口、枚举）
│   ├── user.ts      # 用户模块类型
│   └── order.ts     # 订单模块类型
├── views/           # 页面组件（按业务模块子目录分类）
│   ├── user/        # 用户模块页面（如 UserList.vue、UserDetail.vue）
│   └── order/       # 订单模块页面（如 OrderList.vue、OrderDetail.vue）
├── directives/      # 自定义指令（全局注册，如 v-auth、v-lazy）
│   ├── index.ts     # 指令统一注册入口
│   └── auth.ts      # 权限指令
├── plugins/         # 插件配置（UI 库、第三方工具初始化）
│   ├── elementPlus.ts # Element Plus 按需引入配置
│   └── index.ts     # 插件统一注册入口
└── App.vue          # 根组件
```

#### （二）状态管理约束
1.  优先使用 Pinia 进行状态管理，禁止使用 Vuex（仅老项目兼容场景除外）；Pinia 模块按业务拆分，每个模块对应一个 `store` 文件，命名以「Store」结尾（如 `userStore.ts`）。
2.  全局状态仅存储跨组件、跨页面共享的数据（如用户信息、全局配置、主题设置），局部状态优先使用组件内 `ref`/`reactive`，禁止滥用全局状态导致数据冗余与维护困难。
3.  Pinia 中异步操作（如接口请求）必须封装在 `actions` 中，禁止在组件内直接修改 Pinia 状态，需通过 `actions` 方法进行操作；`getters` 用于派生状态，禁止在 `getters` 中执行异步操作。
4.  Pinia 状态持久化：如需持久化存储（如用户登录信息），使用 `pinia-plugin-persistedstate` 插件，禁止手动通过 `localStorage` 读写 Pinia 状态。

#### （三）路由约束
1.  使用 Vue Router 4 版本，路由配置采用对象式写法，按业务模块拆分到 `router/modules/` 目录下，通过 `import.meta.glob` 自动导入模块路由，减少手动引入工作量。
2.  路由启用懒加载，通过动态 `import()` 加载页面组件，减少首屏加载时间，示例：
    ```typescript
    const UserList = () => import('@/views/user/UserList.vue');
    const routes = [
      {
        path: '/user/list',
        name: 'user-list',
        component: UserList,
        meta: { title: '用户列表', requiresAuth: true }
      }
    ];
    ```
3.  路由守卫使用：全局守卫仅用于权限控制、页面标题设置、加载状态管理，禁止在守卫中编写复杂业务逻辑；权限判断需封装在 `useAuth` Hooks 或 Pinia `store` 中，避免守卫逻辑臃肿。
4.  路由命名：`name` 属性采用 `kebab-case` 格式（如 `user-detail`），路由路径与页面组件路径保持一致；`meta` 字段统一配置页面标题、是否需要权限、缓存策略等信息。
5.  路由跳转：禁止使用 `window.location.href` 进行内部页面跳转，优先使用 `router.push`/`router.replace`；跳转带参数时，查询参数用 `query`，路径参数用 `params`，复杂参数建议通过 Pinia 暂存。

#### （四）API 与网络请求约束
1.  统一封装 Axios，配置请求拦截器（添加 Token、请求头、加载状态）与响应拦截器（统一错误处理、数据格式化、状态码判断），封装文件为 `src/services/request.ts`。
2.  API 接口按业务模块拆分到 `src/services/` 对应目录下，每个接口返回 `Promise` 类型，明确响应数据类型，禁止在组件内直接编写 Axios 请求，示例：
    ```typescript
    // src/services/user.ts
    import { request } from './request';
    import { UserInfo, UserListParams, UserListResponse } from '@/types/user';

    /**
     * 获取用户信息
     * @returns Promise<UserInfo>
     */
    export const getUserInfo = () => {
      return request<UserInfo>({
        url: '/api/user/info',
        method: 'get'
      });
    };

    /**
     * 获取用户列表
     * @param params - 查询参数
     * @returns Promise<UserListResponse>
     */
    export const getUserList = (params: UserListParams) => {
      return request<UserListResponse>({
        url: '/api/user/list',
        method: 'get',
        params
      });
    };
    ```
3.  错误处理：接口请求优先使用 `try/catch` 捕获异常，或通过响应拦截器统一处理通用错误（如 401 未授权、500 服务器错误）；禁止忽略接口错误，需给用户提供友好的错误提示。
4.  请求取消：针对频繁触发的请求（如搜索框输入），需使用 Axios 取消令牌（`CancelToken`）或 `AbortController` 取消重复请求，避免接口冗余请求导致的数据混乱。

### 四、工程化要求（工具链与流程约束）
#### （一）构建工具配置
1.  优先使用 Vite 作为构建工具，禁止使用 Webpack（仅老项目兼容场景除外）；Vite 配置统一在 `vite.config.ts` 中，包含别名配置、打包优化、环境变量配置、插件配置等。
2.  Vite 优化配置：
    -  别名配置：将 `@` 映射到 `src` 目录，方便模块导入，避免相对路径层级混乱。
    -  打包拆分：开启 `build.rollupOptions.output.manualChunks`，将第三方依赖与业务代码拆分打包，优化缓存策略。
    -  环境变量：区分开发、测试、生产环境，环境变量文件命名为 `.env.development`、`.env.test`、`.env.production`，环境变量必须以 `VITE_` 开头，通过 `import.meta.env` 访问。
    -  按需引入：UI 库（如 Element Plus）使用按需引入插件，禁止全量引入导致打包体积过大。

#### （二）代码校验工具配置
1.  ESLint 配置：
    -  安装依赖：`eslint`、`eslint-plugin-vue`、`@typescript-eslint/eslint-plugin`、`@typescript-eslint/parser`、`eslint-config-prettier`。
    -  遵循规则：`vue/recommended`、`@typescript-eslint/recommended`、`prettier`，禁止手动关闭核心规范规则（如 `no-console`、`@typescript-eslint/no-explicit-any`），特殊场景需在代码中添加单行注释忽略（如 `// eslint-disable-next-line no-console`）。
2.  Prettier 配置：
    -  核心规则：打印宽度 120、使用单引号、尾随逗号为 `es5`、不使用分号、括号间距开启、箭头函数参数始终带括号。
    -  集成 ESLint：使用 `eslint-config-prettier` 禁用 ESLint 中与 Prettier 冲突的规则，使用 `eslint-plugin-prettier` 将 Prettier 作为 ESLint 规则运行。
3.  Stylelint 配置：
    -  安装依赖：`stylelint`、`stylelint-config-standard`、`stylelint-config-prettier`、`stylelint-config-vue`。
    -  核心规则：遵循 CSS 标准规范，禁止使用 `!important`（特殊场景需添加注释说明），禁止空规则集，样式属性按顺序排列（布局属性、盒模型属性、样式属性、动画属性）。
4.  校验流程：配置 `package.json` 脚本，提供 `lint`（校验代码）、`lint:fix`（自动修复可修复问题）命令，集成到 Git Hooks 中，提交代码前自动执行校验，禁止不符合规范的代码提交。

#### （三）版本控制与提交规范
1.  `.gitignore` 配置：完整忽略无用文件（`node_modules`、`dist`、`*.env.local`、`*.log`、`.vscode/`、`npm-debug.log` 等），参考 Vue3 官方 Vite 模板的 `.gitignore` 配置。
2.  提交规范：遵循 Conventional Commits 规范，提交信息格式为 `<type>(<scope>): <message>`，其中：
    -  `type`：提交类型（feat：新增功能；fix：修复 bug；docs：文档更新；style：代码格式修改；refactor：代码重构；test：添加测试；chore：构建/工具配置修改）。
    -  `scope`：提交影响范围（如 user、order、router），可选。
    -  `message`：提交描述，简洁明了，使用中文或英文均可，首字母小写，无需结尾标点。
    -  示例：`feat(user): 新增用户头像上传功能`、`fix(order): 修复订单列表分页异常问题`。
3.  版本管理：使用 `standard-version` 或 `semantic-release` 进行语义化版本管理，版本号遵循「MAJOR.MINOR.PATCH」格式，禁止手动修改版本号。

#### （四）环境配置约束
1.  区分三个核心环境：开发环境（development）、测试环境（test）、生产环境（production），每个环境对应独立的 `.env` 文件，禁止在代码中硬编码环境相关配置（如接口域名、接口前缀）。
2.  环境变量命名规范：公共环境变量（如接口前缀 `VITE_API_BASE_URL`）在所有环境文件中配置，环境专属变量仅在对应环境文件中配置；禁止在生产环境中暴露敏感信息（如密钥、测试接口地址）。
3.  环境切换：通过 Vite 命令行参数切换环境（如 `vite --mode test`），禁止手动修改 `.env` 文件切换环境。

### 五、性能优化规则（提升前端体验，强制遵循）
#### （一）组件优化
1.  大型列表渲染（数据量超过 10 条）必须使用虚拟滚动技术，推荐使用 `vue-virtual-scroller`、`Naive UI VirtualList` 等组件，禁止直接渲染大量 DOM 节点导致页面卡顿。
2.  异步组件加载：非首屏组件、大型组件（如富文本编辑器、图表组件）使用 `defineAsyncComponent` 进行异步加载，按需引入，减少首屏打包体积。
3.  避免无用渲染：
    -  使用 `computed` 缓存推导值，避免在模板中重复计算。
    -  使用 `watch` 精准监听数据变化，禁止使用 `watch` 监听复杂对象，可通过 `watchEffect` 简化简单监听逻辑。
    -  高频更新组件（如表格、表单）使用 `v-memo` 指令缓存渲染结果，仅在依赖数据变化时重新渲染。
4.  组件拆分：复杂页面组件（代码行数超过 200 行）必须按业务逻辑拆分为子组件，禁止单个组件包含过多业务逻辑与 DOM 结构。

#### （二）资源优化
1.  图片优化：
    -  优先使用 WebP 格式图片，相比 JPG/PNG 格式体积更小，兼容性不足时提供备用格式。
    -  开启图片懒加载，使用 `v-lazy` 指令或原生 `loading="lazy"` 属性，禁止首屏加载非可视区域图片。
    -  大体积图片（超过 200KB）优先使用 CDN 加载，禁止直接将大图片放入项目源码中；使用图标时，优先使用 SVG 图标或字体图标，禁止使用图片图标。
2.  打包优化：
    -  Vite 配置中开启 `build.cssCodeSplit` 拆分 CSS 代码，开启 `build.sourcemap` 仅在开发/测试环境生成 sourcemap，生产环境关闭。
    -  第三方依赖优化：体积较大的第三方库（如 echarts、xlsx）采用 CDN 引入或按需引入，禁止全量打包进入项目。
    -  静态资源压缩：使用 Vite 内置压缩插件或 `terser` 压缩 JS/CSS 代码，图片资源通过在线工具或插件进行压缩。
3.  字体优化：自定义字体使用 `font-display: swap` 属性，避免字体加载导致的页面闪烁；优先使用系统默认字体，减少自定义字体加载数量。

#### （三）路由与页面优化
1.  首屏优化：首屏路由组件尽量简化，减少不必要的组件与接口请求；可通过骨架屏（Skeleton）提升用户体验，避免白屏等待。
2.  路由缓存：使用 `keep-alive` 缓存频繁切换的页面组件（如列表页面），避免重复渲染与重复请求；通过 `include`/`exclude` 精准控制缓存范围，禁止全局缓存所有页面。
3.  预加载：对用户可能跳转的页面（如列表页跳转详情页），使用 `router.resolve` 或 `<link rel="prefetch">` 进行预加载，提升页面跳转速度。

#### （四）网络请求优化
1.  接口缓存：对不常变化的数据（如全局配置、分类列表），使用 `localStorage` 或 Pinia 进行缓存，设置缓存过期时间，避免重复请求。
2.  批量请求：多个无关接口并行请求时，使用 `Promise.all` 批量处理，减少请求等待时间；相关接口按依赖顺序请求，避免无效请求。
3.  超时设置：为 Axios 请求设置合理的超时时间（默认 10 秒），避免因网络问题导致页面长时间等待；超时后提供重试机制，提升用户体验。

### 六、AI 协作补充规则（适配 TRAE 聊天交互）
1.  生成 Vue3 + TS 代码时，必须附带完整的 TypeScript 类型定义、JSDoc 注释（组件、函数、接口），代码格式符合 Prettier 规范，无需手动格式化。
2.  生成代码时，优先复用项目现有目录结构、工具函数、公共组件，禁止重复造轮子；如需新增工具函数/组件，必须存放于对应目录，并遵循现有命名规范。
3.  切换项目时，若项目存在特殊配置（如自定义 UI 库、特殊打包需求），可在代码中添加注释说明，但核心规则保持不变，无需修改整体约束逻辑。
4.  生成复杂业务逻辑代码时，需提供详细的注释说明与使用示例；遇到兼容性问题时，优先提供 Vue3 + TS 现代浏览器兼容方案，禁止推荐 Vue2 或低版本浏览器兼容写法（特殊场景除外）。
5.  生成的代码必须通过 ESLint、Stylelint 校验，禁止包含语法错误、规范违规问题；若生成测试代码，优先使用 Vitest + Vue Test Utils 框架，遵循单元测试规范。