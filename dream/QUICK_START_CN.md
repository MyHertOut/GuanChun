# 🚀 快速启动指南

## 当前配置

### 数据库
- **主机**: localhost
- **端口**: 3307
- **数据库**: chongmei
- **用户**: root
- **密码**: 123456

### 服务器
- **后端端口**: 3000
- **前端端口**: 5173

## 方法 1: 一键启动（推荐）

### Windows PowerShell

1. 右键点击 `setup-and-start.ps1`
2. 选择 "使用 PowerShell 运行"

**脚本功能**:
- ✅ 检查环境（Node.js, MySQL）
- ✅ 自动安装依赖
- ✅ 自动配置数据库
- ✅ 运行数据库迁移
- ✅ 初始化数据

### 启动服务

完成设置后，使用 `start-both.ps1` 同时启动前后端：

```powershell
.\start-both.ps1
```

### 停止服务

```powershell
.\stop-both.ps1
```

## 方法 2: 手动启动

### 步骤 1: 安装后端依赖

```bash
cd server
npm install
```

### 步骤 2: 配置环境（已完成）

`.env` 文件已配置，内容如下：

```env
DATABASE_URL="mysql://root:123456@localhost:3307/chongmei"
PORT=3000
NODE_ENV=development
```

### 步骤 3: 初始化数据库

#### 创建数据库

```bash
mysql -u root -p123456 -e "CREATE DATABASE chongmei CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

#### 运行迁移

```bash
cd server
npm run prisma:migrate
```

#### 初始化数据

```bash
npm run prisma:seed
```

### 步骤 4: 安装前端依赖

```bash
cd web
npm install
```

### 步骤 5: 启动服务

**终端 1 - 后端**:
```bash
cd server
npm run dev
```

**终端 2 - 前端**:
```bash
cd web
npm run dev
```

## 访问应用

- **前端应用**: http://localhost:5173
- **后端 API**: http://localhost:3000
- **健康检查**: http://localhost:3000/api/health
- **数据库管理**: http://localhost:5555 (需要运行 `npm run prisma:studio`)

## 验证安装

### 1. 后端健康检查

访问 http://localhost:3000/api/health

应该看到：
```json
{
  "status": "ok",
  "message": "Soul Pet API is running"
}
```

### 2. 数据库连接

```bash
mysql -u root -p123456 -h localhost -P 3307 chongmei

# 查看表
SHOW TABLES;

# 退出
EXIT;
```

### 3. 前端页面

访问 http://localhost:5173，应该看到首页。

## 常见问题

### 问题 1: MySQL 连接失败

**错误**:
```
Can't reach database server at `localhost:3307`
```

**解决**:

1. 检查 MySQL 服务是否运行
```bash
# Windows
services.msc

# 或检查端口
netstat -an | findstr 3307
```

2. 确保数据库存在
```bash
mysql -u root -p123456 -e "SHOW DATABASES;"
```

如果不存在，创建数据库：
```bash
mysql -u root -p123456 -e "CREATE DATABASE chongmei CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 问题 2: 端口被占用

**错误**:
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决**:

1. 查看占用进程
```bash
netstat -ano | findstr :3000
netstat -ano | findstr :5173
```

2. 终止进程
```bash
taskkill /F /PID <进程ID>
```

3. 或修改 `.env` 中的端口

### 问题 3: Prisma 迁移失败

**错误**:
```
P1001: Can't reach database server
```

**解决**:

1. 检查 `.env` 配置
```bash
DATABASE_URL="mysql://root:123456@localhost:3307/chongmei"
```

2. 测试连接
```bash
mysql -u root -p123456 -h localhost -P 3307 chongmei
```

3. 重置数据库（会删除所有数据）
```bash
cd server
npx prisma migrate reset
```

## 下一步

服务启动后：

1. ✅ 访问前端创建玩家
2. ✅ 查看后端 API 文档（待实现）
3. ✅ 使用 Prisma Studio 管理数据

## 脚本说明

| 脚本 | 功能 |
|--------|------|
| `setup-and-start.ps1` | 环境检查 + 依赖安装 + 数据库初始化 |
| `start-both.ps1` | 同时启动前后端服务 |
| `stop-both.ps1` | 停止前后端服务 |

## 安全提示

⚠️ **生产环境**:

1. 修改数据库密码
2. 修改 JWT_SECRET
3. 使用强密码
4. 启用 HTTPS
5. 配置防火墙

## 更多帮助

- **完整配置**: `CURRENT_CONFIG.md`
- **问题解决**: `TROUBLESHOOTING.md`
- **MySQL 设置**: `MYSQL_SETUP.md`
- **前端文档**: `web/README.md`
- **后端文档**: `server/README.md`

---

**创建日期**: 2026-01-04
**版本**: v0.2.0 (MySQL)
