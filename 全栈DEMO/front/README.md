# 当我需要创建一个新的前端项目时，我会使用这个标准模板。我们需要确保模板中用到的技术不过时。
# 使用 pnpm 安装依赖
# 使用 pnpm create vue@latest 初始项目
# 根据 前端标准模板 建立项目架构

[![Vue 3](https://img.shields.io/badge/Vue-3.x-green.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## 📖 项目简介

本项目是一个基于 **Vue 3** + **TypeScript** + **Vite** 的现代化前端应用，专注于 **[项目名称]** 的管理与协作。

项目采用了 **Clean Architecture（整洁架构）** 的设计思想，将业务逻辑与 UI 框架解耦，确保了代码的可维护性、可测试性和可扩展性。

## ✨ 核心特性

- **🛡️ 整洁架构设计**：严格遵循分层架构，核心业务逻辑独立于 UI 框架。
- **🖥️ 高效工作台**：提供分栏布局的项目工作台，支持多任务并行处理。
- **📝 富文本与 Markdown**：集成 Tiptap 和 Markdown-it，提供强大的文档编辑体验。
- **🔄 实时协作**：基于 Socket.io 实现数据的实时同步与通信。
- **🎨 现代化 UI**：使用 Element Plus 结合 UnoCSS 原子化引擎，构建美观且响应式的界面。
- **🔧 完整工程化**：包含 ESLint、Prettier 代码规范检查，以及完整的构建流程。

## 🏗️ 技术架构

本项目遵循 **Clean Architecture** 原则，主要分为以下几层：

### 分层说明

| 层级 | 目录 | 职责 | 依赖关系 |
| :--- | :--- | :--- | :--- |
| **Domain Layer** (领域层) | `src/domain` | 定义核心业务实体 (Entities) 和业务规则。定义 Repository 接口。 | 不依赖任何其他层 |
| **Application Layer** (应用层) | `src/application` | 包含具体的业务用例 (Use Cases)。编排领域对象以完成特定的业务目标。 | 依赖 Domain 层 |
| **Infrastructure Layer** (基础设施层) | `src/infrastructure` | 实现 Domain 层接口。处理 API、数据库、WebSocket 等外部交互。 | 依赖 Domain 层 |
| **Presentation Layer** (表现层) | `src/views`, `src/components` | 负责 UI 展示和用户交互。使用 Pinia 管理状态。 | 依赖 Application 层 |

### 数据流向

```mermaid
graph LR
    UI[UI (Vue Components)] --> Store[Pinia Store]
    Store --> UseCase[Use Case (Application)]
    UseCase --> RepoInterface[Repository Interface (Domain)]
    RepoImpl[Repository Implementation (Infrastructure)] -. implements .-> RepoInterface
    RepoImpl --> External[API / Socket]
```

> 如果无法查看流程图，请参考下方文本描述：
> `UI -> Pinia -> Use Case -> Repository Interface <- Repository Impl -> API`

## 🛠️ 技术栈

### 核心框架

- **Vue 3**: `^3.5.21`
- **TypeScript**: `~5.7.3`
- **Vite**: `8.0.0-beta.5`

### UI 与 样式

- **Element Plus**: `^2.11.8`
- **UnoCSS**: `66.1.0-beta.10`
- **Sass**: `^1.92.1`

### 状态与通信

- **Pinia**: `^3.0.3`
- **Axios**: `^1.12.2`
- **Socket.io-client**: `^4.8.1`

## 📂 目录结构

```text
src/
├── api/                # 通用 API 接口
├── application/        # [核心] 应用层：业务用例 (Use Cases)
├── assets/             # 静态资源
├── components/         # 组件库
├── composables/        # Vue Composables
├── domain/             # [核心] 领域层：实体与接口
├── infrastructure/     # [核心] 基础设施层：实现与配置
├── router/             # 路由配置
├── stores/             # Pinia 状态管理
├── styles/             # 全局样式
├── types/              # 全局类型
├── utils/              # 工具函数
├── views/              # 页面视图
├── App.vue             # 根组件
└── main.ts             # 入口文件
├── .env                # 环境变量
├── package.json        # 依赖与脚本
├── tsconfig.json       # TypeScript 配置
├── uno.config.ts       # UnoCSS 配置
└── vite.config.ts      # Vite 配置
```

## 🚀 快速开始

### 环境准备

- **Node.js**: >= 18.0.0 (推荐 LTS)
- **pnpm**: >= 8.0.0

### 安装步骤

1.  **克隆项目**

    ```bash
    git clone <repository-url>
    cd <project-name>
    ```

2.  **安装依赖**

    ```bash
    pnpm install
    ```

3.  **配置环境变量**

    复制 `.env.example` 为 `.env` 并修改配置：

    ```bash
    cp .env.example .env
    ```

4.  **启动开发服务器**

    ```bash
    pnpm dev
    ```

## ⚙️ 环境变量说明

| 变量名 | 说明 | 默认值 |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | 后端 API 接口地址 | `/api` |
| `VITE_SOCKET_URL` | WebSocket 服务地址 | - |
| `VITE_APP_TITLE` | 应用标题 | `My App` |

## 📜 脚本说明

| 命令 | 说明 |
| :--- | :--- |
| `pnpm dev` | 启动本地开发服务器 |
| `pnpm build` | 构建生产环境代码 |
| `pnpm preview` | 预览构建后的应用 |
| `pnpm lint` | 执行代码检查并修复 |

## 💻 开发指南

### 新增功能流程 (Clean Architecture)

1.  **Domain**: 在 `src/domain` 定义 Entity 和 Repository Interface。
2.  **Infrastructure**: 在 `src/infrastructure` 实现 Repository Interface。
3.  **Application**: 在 `src/application` 编写 Use Case。
4.  **DI**: 注册 Use Case。
5.  **UI**: 调用 Use Case。

### Git 提交规范

请遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档变更
- `style`: 代码格式调整
- `refactor`: 代码重构
- `chore`: 构建过程或辅助工具的变动

## 📄 License

[MIT](./LICENSE) © 2026
