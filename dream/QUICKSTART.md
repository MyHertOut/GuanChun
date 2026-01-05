# 快速启动指南

## 前置要求

- Node.js 18+
- MySQL 8.0+

## 一键启动（推荐）

### Windows PowerShell

```powershell
# 1. 进入项目目录
cd D:\wk\GuanChun\dream

# 2. 安装依赖
Write-Host "安装后端依赖..." -ForegroundColor Yellow
cd server
npm install

Write-Host "安装前端依赖..." -ForegroundColor Yellow
cd ..\web
npm install

cd ..

# 3. 配置后端
Write-Host "配置后端环境..." -ForegroundColor Yellow
cd server
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "已创建 .env 文件，请编辑配置数据库连接" -ForegroundColor Red
    exit
}

# 4. 生成 Prisma Client
Write-Host "生成 Prisma Client..." -ForegroundColor Yellow
npx prisma generate

# 5. 运行迁移
Write-Host "运行数据库迁移..." -ForegroundColor Yellow
npm run prisma:migrate

# 6. 初始化数据
Write-Host "初始化数据库数据..." -ForegroundColor Yellow
npm run prisma:seed

Write-Host "环境准备完成！" -ForegroundColor Green
Write-Host ""
Write-Host "启动服务：" -ForegroundColor Cyan
Write-Host "  终端1 (后端): cd server && npm run dev" -ForegroundColor White
Write-Host "  终端2 (前端): cd web && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "访问: http://localhost:5173" -ForegroundColor Cyan
```

## 手动启动

### 步骤 1: 安装后端依赖

```bash
cd server
npm install
```

### 步骤 2: 配置环境变量

```bash
# 复制配置文件
cp .env.example .env

# 编辑 .env，修改数据库连接信息
# DATABASE_URL="mysql://用户名:密码@主机:端口/数据库名"
```

**当前配置**:
```env
DATABASE_URL="mysql://root:123456@localhost:3307/chongmei"
```

如果需要修改，请更新 `.env` 文件中的 `DATABASE_URL`。

### 步骤 3: 初始化数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 创建数据库表
npm run prisma:migrate

# 初始化数据
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

### 步骤 6: 访问应用

打开浏览器访问: http://localhost:5173

## 常见启动问题

### 问题 1: 后端启动失败 - 找不到 Prisma Client

**错误**:
```
Cannot find module '.prisma/client/default'
```

**解决**:
```bash
cd server
npx prisma generate
npm run dev
```

### 问题 2: 前端启动报错 - TypeError

**错误**:
```
Cannot read properties of undefined (reading 'value')
```

**解决**: 已修复，直接启动即可

### 问题 3: 数据库连接失败

**错误**:
```
Can't reach database server
```

**解决**:
1. 确保 PostgreSQL 正在运行
2. 检查 `.env` 中的数据库配置
3. 确保数据库已创建

```sql
-- 使用 psql 创建数据库
CREATE DATABASE soul_pet;
```

### 问题 4: 端口被占用

**错误**:
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决**: 修改 `.env` 中的端口
```env
PORT=3001
```

## 验证安装

### 后端验证

访问 http://localhost:3000/api/health

应该看到:
```json
{
  "status": "ok",
  "message": "Soul Pet API is running"
}
```

### 前端验证

访问 http://localhost:5173

应该看到首页界面

## 下一步

1. 创建玩家账号
2. 开始游戏
3. 查看项目文档了解功能

## 更多帮助

- 常见问题: `TROUBLESHOOTING.md`
- 项目状态: `PROJECT_STATUS.md`
- 前端文档: `web/README.md`
- 后端文档: `server/README.md`
