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

### 1. 创建新前端项目

```bash
# 语法示例
front <ProjectName>
```

**执行逻辑说明**:

1.  **源模板**: 锁定 `front/` 目录作为基准模板。
2.  **目标路径**: 在 `front/` 同级目录下创建新目录，命名格式为 `front-<ProjectName>`。
3.  **结果**: 新项目 `front-<ProjectName>` 将完整继承标准模板的所有架构、配置与依赖。

### 2. 创建新后端项目

```bash
# 语法示例
server <ProjectName>
```

**执行逻辑说明**:

1.  **源模板**: 锁定 `server/` 目录作为基准模板。
2.  **目标路径**: 在 `server/` 同级目录下创建新目录，命名格式为 `server-<ProjectName>`。
3.  **结果**: 新项目 `server-<ProjectName>` 将完整继承标准模板的所有架构、配置与依赖。

---

> **提示**: 所有的业务逻辑开发建议遵循各模板内的 **Clean Architecture** 开发流程。
