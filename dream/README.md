# 魂宠世界 (Soul Pet: Spiritual Bond)

基于《宠魅》小说世界观开发的文字策略养成游戏。

## 项目结构

```
dream/
├── web/              # 前端项目 (Vue 3 + TypeScript)
├── server/           # 后端项目 (Node.js + Express)
├── data/             # 游戏数据
│   ├── soul_pets.json  # 魂宠数据
│   ├── skills.json     # 技能数据
│   └── items.json     # 物品数据
├── 1、产品阶段/       # 产品需求文档
├── 2、设计阶段/       # 设计文档
└── README.md         # 本文件
```

## 技术架构

### 前端
- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **语言**: TypeScript
- **状态管理**: Pinia
- **路由**: Vue Router
- **UI**: TailwindCSS
- **HTTP**: Axios

### 后端
- **运行时**: Node.js 18+
- **框架**: Express
- **ORM**: Prisma
- **数据库**: MySQL
- **验证**: Joi
- **认证**: JWT (开发中)

## 快速开始

### ⚠️ MySQL 连接问题

如果遇到 MySQL 连接错误（如 "Connection refused"），请立即查看 **`MYSQL_CONNECTION_FIX.md`** 进行排查。

常见原因：
- MySQL 服务未运行
- 端口 3307 未开放
- 数据库 `chongmei` 不存在
- 密码或用户名错误

### 快速启动（推荐）

**Windows 用户**：使用 PowerShell 脚本

1. 环境设置：右键运行 `setup-and-start.ps1`
2. 启动服务：运行 `start-both.ps1`
3. 停止服务：运行 `stop-both.ps1`

详细说明：查看 `QUICK_START_CN.md`

### 前置要求

- Node.js 18+
- MySQL 8.0+
- npm 或 pnpm

### 安装依赖

```bash
# 前端
cd web
npm install

# 后端
cd ../server
npm install
```

### 配置后端环境

```bash
cd server
cp .env.example .env
# 编辑 .env 文件，配置数据库连接信息
```

### 数据库设置

```bash
# 1. 创建数据库（使用提供的配置）
mysql -u root -p -e "CREATE DATABASE chongmei CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. 运行迁移
cd server
npm run prisma:migrate

# 3. 初始化数据
npm run prisma:seed
```

**注意**: 当前数据库配置为 `chongmei`，端口 `3307`。如果需要修改，请编辑 `server/.env` 文件。

### 启动服务

```bash
# 终端1: 启动后端
cd server
npm run dev

# 终端2: 启动前端
cd web
npm run dev
```

访问 http://localhost:5173 查看前端应用。

### 🚀 快速启动（推荐）

**Windows 用户**：使用 PowerShell 脚本一键启动

```powershell
# 1. 环境设置 + 依赖安装
.\setup-and-start.ps1

# 2. 启动前后端服务
.\start-both.ps1

# 3. 停止服务
.\stop-both.ps1
```

详细说明：查看 `QUICK_START_CN.md`

### ⚙️ 当前配置

- **数据库**: chongmei (MySQL)
- **主机**: localhost:3307
- **用户**: root
- **前端**: http://localhost:5173
- **后端**: http://localhost:3000

完整配置：查看 `CURRENT_CONFIG.md`

## 开发文档

### 产品阶段
- `1、产品阶段/需求文档.md` - 完整的产品需求文档

### 设计阶段
- `2、设计阶段/系统架构设计.md` - 整体架构设计
- `2、设计阶段/前端架构设计.md` - 前端架构设计
- `2、设计阶段/数据库设计.md` - 数据库设计
- `2、设计阶段/API接口设计.md` - API接口设计
- `2、设计阶段/组件设计.md` - 组件设计

### 开发指南
- `web/README.md` - 前端开发指南
- `server/README.md` - 后端开发指南

## 核心功能

### 已实现
- [x] 项目基础架构搭建
- [x] 前端路由和状态管理
- [x] 后端API框架
- [x] 数据库模型设计
- [x] 基础页面和组件

### 开发中
- [ ] 战斗系统
- [ ] 魂宠管理系统
- [ ] 探索系统
- [ ] 存档系统

### 计划中
- [ ] 战斗AI
- [ ] 魂宠进化/异变
- [ ] 多人对战
- [ ] 排行榜
- [ ] 成就系统

## 游戏玩法

### 魂宠系统
- 11种不同物种的魂宠
- 7大物种等级（奴仆级 ~ 不朽级）
- 12种元素属性
- 技能系统（物理/魔法/辅助/防御/控制）

### 战斗系统
- 回合制战斗
- 元素克制系统
- 状态异常效果
- 战斗AI

### 成长系统
- 魂宠升级
- 技能学习
- 进化与异变

## 开发规范

### 前端
- 使用 TypeScript 严格模式
- 遵循 Vue 3 Composition API
- 组件使用 `<script setup lang="ts">`
- 使用 ESLint 和 Prettier 格式化代码

### 后端
- 遵循 RESTful API 设计
- 使用 Joi 进行参数验证
- 统一错误处理
- 添加必要的注释

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目仅供学习交流使用。

## 联系方式

如有问题或建议，欢迎提交 Issue。
