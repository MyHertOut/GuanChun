# Vue Admin Backend

一个基于 Node.js + Express + MongoDB 的现代化后端API服务，专为Vue.js前端应用设计的前后端分离演练场。

## 🚀 特性

- **现代化架构**: 基于Express.js构建的RESTful API
- **安全认证**: JWT令牌认证 + 角色权限控制
- **数据库**: MongoDB + Mongoose ODM
- **输入验证**: express-validator数据验证
- **安全防护**: Helmet安全头 + CORS跨域 + 请求限流
- **错误处理**: 统一错误处理和响应格式
- **环境配置**: 完善的环境变量管理
- **代码质量**: ESLint代码规范 + 详细注释
- **扩展性**: 模块化设计，易于扩展

## 📁 项目结构

```
vue-admin-backend/
├── src/                    # 源代码目录
│   ├── app.js             # 应用入口文件
│   ├── config/            # 配置文件
│   │   ├── database.js    # 数据库配置
│   │   └── env.js         # 环境变量配置
│   ├── controllers/       # 控制器
│   │   └── userController.js
│   ├── middleware/        # 中间件
│   │   ├── authMiddleware.js    # 认证中间件
│   │   └── errorMiddleware.js   # 错误处理中间件
│   ├── models/           # 数据模型
│   │   └── User.js       # 用户模型
│   ├── routes/           # 路由
│   │   ├── index.js      # 主路由
│   │   └── userRoutes.js # 用户路由
│   └── utils/            # 工具函数
│       ├── response.js   # 响应工具
│       └── validation.js # 验证工具
├── .env                  # 环境变量文件
├── .env.example         # 环境变量示例
├── .gitignore           # Git忽略文件
├── package.json         # 项目配置
└── README.md           # 项目文档
```

## 🛠️ 技术栈

- **运行时**: Node.js 16+
- **框架**: Express.js 4.x
- **数据库**: MongoDB 5.x
- **ODM**: Mongoose 8.x
- **认证**: JWT (jsonwebtoken)
- **验证**: express-validator
- **安全**: helmet, cors, bcryptjs
- **工具**: dotenv, morgan, compression

## 📦 安装

1. **克隆项目**
```bash
git clone <repository-url>
cd vue-admin-backend
```

2. **安装依赖**
```bash
pnpm install
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

4. **启动MongoDB**
确保MongoDB服务正在运行，或者修改`.env`文件中的数据库连接字符串。

## 🚀 运行

### 开发模式
```bash
pnpm run dev
```

### 生产模式
```bash
pnpm start
```

### 运行测试
```bash
pnpm test
```

### 代码检查
```bash
pnpm run lint
```

## 📡 API接口

### 基础接口

- `GET /health` - 健康检查
- `GET /api` - API信息
- `GET /api/status` - 服务状态

### 用户接口

#### 公开接口
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录

#### 需要认证的接口
- `GET /api/users/profile` - 获取当前用户信息
- `PUT /api/users/profile` - 更新用户信息
- `PUT /api/users/password` - 修改密码

#### 管理员接口
- `GET /api/users` - 获取用户列表
- `DELETE /api/users/:id` - 删除用户

## 🔐 认证说明

### JWT令牌
所有需要认证的接口都需要在请求头中包含JWT令牌：

```
Authorization: Bearer <your-jwt-token>
```

### 角色权限
- `user`: 普通用户
- `moderator`: 版主
- `admin`: 管理员

## 📝 API响应格式

### 成功响应
```json
{
  "success": true,
  "message": "操作成功",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "message": "错误信息",
    "status": 400
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 分页响应
```json
{
  "success": true,
  "message": "获取数据成功",
  "data": {
    "items": [],
    "pagination": {
      "current": 1,
      "pages": 10,
      "total": 100,
      "limit": 10,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## ⚙️ 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `PORT` | 服务器端口 | `3000` |
| `NODE_ENV` | 运行环境 | `development` |
| `MONGODB_URI` | MongoDB连接字符串 | `mongodb://localhost:27017/vue_admin_db` |
| `JWT_SECRET` | JWT密钥 | 必须设置 |
| `JWT_EXPIRES_IN` | JWT过期时间 | `7d` |
| `CORS_ORIGIN` | CORS允许的源 | `http://localhost:5173` |

## 🔧 开发指南

### 添加新的API接口

1. **创建模型** (如果需要)
```javascript
// src/models/YourModel.js
const mongoose = require('mongoose')

const yourSchema = new mongoose.Schema({
  // 定义字段
})

module.exports = mongoose.model('YourModel', yourSchema)
```

2. **创建控制器**
```javascript
// src/controllers/yourController.js
const { asyncHandler } = require('../middleware/errorMiddleware')

const yourFunction = asyncHandler(async (req, res) => {
  // 业务逻辑
})

module.exports = { yourFunction }
```

3. **创建路由**
```javascript
// src/routes/yourRoutes.js
const express = require('express')
const { yourFunction } = require('../controllers/yourController')

const router = express.Router()
router.get('/', yourFunction)

module.exports = router
```

4. **注册路由**
```javascript
// src/routes/index.js
const yourRoutes = require('./yourRoutes')
router.use('/your-endpoint', yourRoutes)
```

### 代码规范

- 使用ES6+语法
- 遵循ESLint规则
- 添加详细的JSDoc注释
- 使用async/await处理异步操作
- 统一使用工具函数处理响应

## 🧪 测试

项目使用Jest进行单元测试和集成测试。

```bash
# 运行所有测试
pnpm test

# 监听模式运行测试
pnpm run test:watch
```

## 📈 性能优化

- 使用compression中间件进行响应压缩
- 实现请求限流防止滥用
- MongoDB索引优化
- JWT令牌缓存
- 错误日志记录

## 🔒 安全特性

- Helmet安全头设置
- CORS跨域保护
- JWT令牌认证
- 密码加密存储
- 输入数据验证和清理
- 请求频率限制
- 账户锁定机制

## 🤝 贡献

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 作者: GuanChun
- 邮箱: your-email@example.com
- 项目链接: [https://github.com/your-username/vue-admin-backend](https://github.com/your-username/vue-admin-backend)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和开源社区。