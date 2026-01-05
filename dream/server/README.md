# 魂宠世界 - 后端项目

基于 Node.js + Express + Prisma + PostgreSQL 构建的后端服务。

## 技术栈

- **运行时**: Node.js 18+
- **框架**: Express
- **ORM**: Prisma
- **数据库**: MySQL
- **验证**: Joi
- **认证**: JWT (开发中)
- **语言**: TypeScript

## 项目结构

```
src/
├── controllers/      # 控制器
│   ├── battle.ts     # 战斗控制器
│   ├── pet.ts        # 魂宠控制器
│   ├── player.ts     # 玩家控制器
│   └── save.ts       # 存档控制器
├── routes/           # 路由
│   ├── index.ts      # 路由汇总
│   ├── battle.ts     # 战斗路由
│   ├── pet.ts        # 魂宠路由
│   ├── player.ts     # 玩家路由
│   └── save.ts       # 存档路由
├── middleware/       # 中间件 (待实现)
│   ├── auth.ts       # 认证中间件
│   └── error.ts      # 错误处理中间件
├── services/         # 业务逻辑 (待实现)
│   ├── battle.ts     # 战斗服务
│   ├── pet.ts        # 魂宠服务
│   └── player.ts     # 玩家服务
├── types/            # TypeScript类型
├── utils/            # 工具函数
└── index.ts          # 入口文件

prisma/
├── schema.prisma     # 数据库模型定义
└── seed.ts           # 数据库初始化脚本
```

## 开发指南

### 环境要求

- Node.js 18+
- MySQL 8.0+

### 安装依赖

```bash
npm install

# 首次安装后生成 Prisma Client
npx prisma generate
```

### 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
PORT=3000
NODE_ENV=development

# 数据库连接格式: mysql://用户名:密码@主机:端口/数据库名
DATABASE_URL="mysql://root:123456@localhost:3307/chongmei"

JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

**当前配置**:
- 主机: localhost
- 端口: 3307
- 数据库: chongmei
- 用户名: root
- 密码: 123456

### 数据库设置

1. 确保 MySQL 已安装并运行

2. 创建数据库：

```sql
CREATE DATABASE soul_pet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. 运行数据库迁移：

```bash
npm run prisma:migrate
```

4. 生成 Prisma Client：

```bash
npm run prisma:generate
```

5. 初始化数据（种子数据）：

```bash
npm run prisma:seed
```

### 启动开发服务器

```bash
npm run dev
```

服务将在 http://localhost:3000 启动

### 其他命令

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 打开 Prisma Studio (数据库可视化工具)
npm run prisma:studio
```

## API接口

### 基础信息

- 基础路径: `http://localhost:3000/api`
- 响应格式: JSON

### 主要接口

#### 玩家相关

```bash
POST   /api/player/create     # 创建玩家
GET    /api/player/info       # 获取玩家信息
PUT    /api/player/update     # 更新玩家信息
```

#### 魂宠相关

```bash
GET    /api/pets/list        # 获取玩家所有魂宠
GET    /api/pets/:id         # 获取魂宠详情
POST   /api/pets/:id/evolve  # 魂宠进化/异变
POST   /api/pets/:id/level-up # 魂宠升级
GET    /api/pets/dex/all     # 获取魂宠图鉴
```

#### 战斗相关

```bash
POST   /api/battle/start     # 开始战斗
POST   /api/battle/:id/action  # 提交行动
POST   /api/battle/:id/finish  # 结束战斗
```

#### 存档相关

```bash
POST   /api/save             # 保存游戏
GET    /api/save/:id         # 加载存档
GET    /api/saves/list       # 获取存档列表
DELETE /api/save/:id         # 删除存档
```

## 数据库模型

### 核心表

- `players`: 玩家表
- `pets`: 魂宠表
- `pet_species`: 魂宠品种表
- `skills`: 技能表
- `pact_slots`: 契约槽位表
- `inventories`: 背包表
- `saves`: 存档表

### 数据库关系

- 一个玩家可以拥有多个魂宠
- 一个魂宠属于一个玩家
- 一个魂宠品种可以被多个魂宠实例化
- 一个玩家可以有多个存档

**注意**: MySQL 的 JSON 字段需要 MySQL 5.7.8+ 或 8.0+

## 开发规范

### 控制器

使用 Express 风格的 Request/Response：

```typescript
import { Request, Response } from 'express'

export const playerController = {
  create: async (req: Request, res: Response) => {
    try {
      const { name } = req.body

      // 业务逻辑
      const player = await prisma.player.create({
        data: { name }
      })

      res.json({ success: true, data: player })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}
```

### 路由

使用 Express Router：

```typescript
import { Router } from 'express'
import { playerController } from '../controllers/player'

const router = Router()

router.post('/create', playerController.create)
router.get('/info', playerController.getInfo)

export default router
```

### 验证

使用 Joi 进行请求验证：

```typescript
import Joi from 'joi'

const schema = Joi.object({
  name: Joi.string().min(1).max(50).required()
})

const { error, value } = schema.validate(req.body)
if (error) {
  return res.status(400).json({ success: false, message: error.details[0].message })
}
```

## 注意事项

1. 确保 PostgreSQL 数据库正在运行
2. 首次运行前需要执行数据库迁移和初始化
3. 生产环境务必修改 `JWT_SECRET`
4. 使用 TypeScript 严格模式
5. API 调用需要添加认证 header（开发阶段可临时跳过）

## 数据库管理

### 查看数据库

```bash
npm run prisma:studio
```

### 重置数据库

```bash
# 删除所有数据
npx prisma migrate reset

# 重新迁移
npm run prisma:migrate

# 重新初始化数据
npm run prisma:seed
```

## 待开发功能

- [ ] JWT 认证中间件
- [ ] 战斗系统核心算法
- [ ] 魂宠进化/异变逻辑
- [ ] 魂宠升级逻辑
- [ ] 战斗AI
- [ ] 随机事件系统
- [ ] 探索系统
- [ ] 日志系统
- [ ] 性能监控

## 相关文档

- [Express 官方文档](https://expressjs.com/)
- [Prisma 官方文档](https://www.prisma.io/)
- [MySQL 官方文档](https://dev.mysql.com/doc/)
- [Joi 官方文档](https://joi.dev/)
