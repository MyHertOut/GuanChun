# 后端标准模板

[![NestJS](https://img.shields.io/badge/NestJS-10.x-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## 📖 项目简介

本项目是一个基于 **NestJS** + **TypeScript** + **MySQL** 的企业级高性能后端应用模板。

项目采用了 **Clean Architecture（整洁架构）** 的设计思想，结合 **Domain-Driven Design (DDD)** 的战术模式，确保了系统的**高扩展性**、**高可用性**和**易维护性**。底层采用 **Fastify** 替代 Express 以获得极致的 I/O 性能。

## ✨ 核心特性

- **🛡️ 整洁架构 (Clean Arch)**：严格的分层设计，核心业务逻辑（Domain）不依赖于任何外部框架或工具。
- **⚡ 极致性能**: 基于 **Fastify** 适配器，比传统 Express 性能提升 2-3 倍。
- **🔌 模块化设计**: 遵循 NestJS 模块化最佳实践，支持插件式功能扩展。
- **💾 健壮的数据层**: 集成 **TypeORM**，支持数据库迁移 (Migrations)、事务管理和读写分离。
- **🚀 完整工程化**: 集成 Swagger 文档、Winston 日志系统、Jest 单元测试、Docker 容器化配置。
- **🔒 安全可靠**: 内置 Helmet 防护、Rate Limiting 限流、JWT 认证与 RBAC 权限控制。

## 🏗️ 技术架构

本项目严格遵循 **Clean Architecture** 原则，自内向外分为以下几层：

### 分层说明

| 层级 | 目录 | 职责 | 依赖规则 |
| :--- | :--- | :--- | :--- |
| **Domain Layer** (领域层) | `src/domain` | **[核心]** 定义业务实体 (Entities)、值对象 (VO)、领域服务 (Services) 和 抽象接口 (Ports/Repositories)。 | 不依赖任何层 |
| **Application Layer** (应用层) | `src/application` | **[编排]** 包含业务用例 (Use Cases/Command Handlers)。负责协调领域对象完成业务目标。 | 依赖 Domain 层 |
| **Infrastructure Layer** (基础设施层) | `src/infrastructure` | **[实现]** 实现 Domain 定义的接口。包括数据库适配器、第三方 API 调用、缓存实现等。 | 依赖 Domain 层 |
| **Interface Layer** (接口层) | `src/interface` | **[交互]** 处理外部输入 (HTTP Controller, GraphQL Resolver, WebSocket Gateway)。 | 依赖 Application 层 |

### 依赖注入 (DI) 关系

```mermaid
graph TD
    Controller[Interface Layer (Controller)] --> UseCase[Application Layer (Use Case)]
    UseCase --> DomainService[Domain Layer (Domain Service)]
    UseCase --> RepoInterface[Domain Layer (Repository Interface)]
    RepoImpl[Infrastructure Layer (Repository Impl)] -. implements .-> RepoInterface
    RepoImpl --> DB[(MySQL Database)]
```

## 🛠️ 技术栈

### 核心框架

- **Runtime**: `Node.js` >= 18.0.0
- **Framework**: `NestJS` ^10.0.0
- **Language**: `TypeScript` ~5.3.0
- **HTTP Adapter**: `Fastify` (高性能)

### 数据存储

- **Database**: `MySQL` 8.0+
- **ORM**: `TypeORM` (支持 Active Record 和 Data Mapper 模式)
- **Cache**: `Redis` (可选，用于缓存和队列)

### 工具与规范

- **Documentation**: `Swagger` (OpenAPI 3.0)
- **Logging**: `Winston` (支持按天滚动日志)
- **Testing**: `Jest` (单元测试) + `Supertest` (E2E 测试)
- **Linting**: `ESLint` + `Prettier`

## 📂 目录结构

```text
src/
├── domain/                 # [核心] 领域层
│   ├── model/              # 领域实体 (Entities)
│   ├── repository/         # 仓库接口定义 (Interfaces)
│   └── service/            # 领域服务 (纯业务逻辑)
├── application/            # [应用] 应用层
│   ├── use-case/           # 业务用例 (Use Cases)
│   └── dto/                # 数据传输对象 (DTO)
├── infrastructure/         # [基础] 基础设施层
│   ├── config/             # 全局配置
│   ├── persistence/        # 数据库持久化实现 (TypeORM Entities & Repositories)
│   └── common/             # 通用工具 (Filters, Interceptors, Pipes)
├── interface/              # [接口] 接口层
│   └── http/               # HTTP Controllers
├── main.ts                 # 应用入口
└── app.module.ts           # 根模块
```

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **MySQL**: >= 8.0
- **pnpm**: >= 8.0.0

<!-- 服务启动后，访问 Swagger 文档：`http://localhost:3000/api/docs` -->

## ⚙️ 环境变量说明

| 变量名 | 说明 | 默认值 |
| :--- | :--- | :--- |
| `PORT` | 服务端口 | `3000` |
| `DB_HOST` | 数据库主机 | `localhost` |
| `DB_PORT` | 数据库端口 | `3306` |
| `DB_USERNAME` | 数据库用户 | `root` |
| `DB_PASSWORD` | 数据库密码 | - |
| `DB_DATABASE` | 数据库名 | - |
| `JWT_SECRET` | JWT 密钥 | - |

## 📜 脚本说明

| 命令 | 说明 |
| :--- | :--- |
| `pnpm start:dev` | 启动本地开发服务器 (热更新) |
| `pnpm build` | 编译 TypeScript 代码 |
| `pnpm start:prod` | 启动生产环境代码 |
| `pnpm test` | 运行单元测试 |
| `pnpm typeorm` | 运行 TypeORM CLI 工具 |

## 💻 开发指南

### 新增 API 流程 (Clean Architecture)

1.  **Domain**: 在 `src/domain` 定义 Entity 和 Repository Interface。
2.  **Infrastructure**: 在 `src/infrastructure/persistence` 实现 Repository Interface (TypeORM)。
3.  **Application**: 在 `src/application/use-case` 编写 Use Case，注入 Repository Interface。
4.  **Interface**: 在 `src/interface/http` 编写 Controller，调用 Use Case。
5.  **Module**: 在对应的 Module 中注册 Provider 和 Controller。

## 📄 License

[MIT](./LICENSE) © 2026
