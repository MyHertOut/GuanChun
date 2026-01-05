# 全栈开发工作区 (Full Stack Workspace)

本仓库汇集了标准化的全栈开发模板与示例项目，旨在提供统一的工程规范与高效的开发体验。

## 📂 核心模板

### [前端标准模板](./front/README.md) (`front/`)

一个基于 **Vue 3 + TypeScript + Vite** 的企业级前端架构模板，采用 **Clean Architecture（整洁架构）** 设计思想。

- **核心技术**: Vue 3.5+, TypeScript 5.7+, Vite 6+, Pinia, Element Plus, UnoCSS
- **架构特点**: 领域层(Domain) -> 应用层(Application) -> 基础设施层(Infrastructure) -> 表现层(Presentation)
- **详细文档**: 请阅读 [front/README.md](./front/README.md)

### [后端标准模板](./server/README.md) (`server/`)

一个基于 **NestJS + TypeScript + MySQL** 的高性能后端架构模板，采用 **Clean Architecture** 与 **Fastify**。

- **核心技术**: NestJS 10+, Fastify, TypeORM, MySQL, Redis, Swagger
- **架构特点**: Domain Layer (核心业务) -> Application Layer (用例编排) -> Infrastructure Layer (持久化/适配器) -> Interface Layer (Controller)
- **详细文档**: 请阅读 [server/README.md](./server/README.md)

## 🚀 项目初始化指南

### 1. 交互式创建 (推荐)

直接运行脚本，按照提示选择项目类型（前端/后端/全栈）并输入项目名称：

```bash
node scripts/init.js
```

### 2. 命令行快速创建

如果你更喜欢命令行参数，也可以直接指定：

```bash
# 创建前端项目
node scripts/init.js front <ProjectName>

# 创建后端项目
node scripts/init.js server <ProjectName>
```

**执行逻辑说明**:

1.  **源模板**: 锁定 `front/` 或 `server/` 目录作为基准模板。
2.  **目标路径**: 在根目录下创建新目录，命名格式为 `front-<ProjectName>` 或 `server-<ProjectName>`。
3.  **结果**: 新项目将完整继承标准模板的所有架构、配置与依赖。
4.  **AI 辅助**: 脚本执行完毕后会输出一段 **[AI Context]**，你可以将其复制给 AI 助手，让其快速理解新项目的结构与依赖。

---

> **提示**: 所有的业务逻辑开发建议遵循各模板内的 **Clean Architecture** 开发流程。
