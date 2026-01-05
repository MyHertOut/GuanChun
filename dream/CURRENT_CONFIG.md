# 当前配置

## 数据库配置

### MySQL 连接信息

```env
DATABASE_URL="mysql://root:123456@localhost:3307/chongmei"
```

**详细信息**:
- **主机**: localhost
- **端口**: 3307
- **数据库名**: chongmei
- **用户名**: root
- **密码**: 123456

### 字符集

```sql
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci
```

### 创建数据库命令

```bash
mysql -u root -p123456 -e "CREATE DATABASE chongmei CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

## 服务器配置

```env
PORT=3000
NODE_ENV=development
```

- **后端端口**: 3000
- **前端端口**: 5173

## 启动命令

### 后端

```bash
cd server
npm run dev
```

访问: http://localhost:3000/api/health

### 前端

```bash
cd web
npm run dev
```

访问: http://localhost:5173

## 验证数据库连接

### 方法 1: 使用 MySQL 命令行

```bash
mysql -u root -p123456 -h localhost -P 3307 chongmei

# 查看数据库
SHOW DATABASES;

# 选择数据库
USE chongmei;

# 查看表
SHOW TABLES;

# 退出
EXIT;
```

### 方法 2: 使用 Prisma Studio

```bash
cd server
npm run prisma:studio
```

访问: http://localhost:5555

### 方法 3: 测试后端 API

访问 http://localhost:3000/api/health

应该看到：
```json
{
  "status": "ok",
  "message": "Soul Pet API is running"
}
```

## 配置文件位置

- `server/.env` - 后端环境配置（已配置）
- `server/.env.example` - 环境配置模板
- `server/prisma/schema.prisma` - 数据库模型定义

## 连接字符串格式

```
mysql://[用户名]:[密码]@[主机]:[端口]/[数据库名]
```

示例:
```
mysql://root:123456@localhost:3307/chongmei
```

## 安全提示

⚠️ **生产环境注意事项**:

1. **修改数据库密码**: 当前使用的是开发密码
   ```env
   DATABASE_URL="mysql://root:your-strong-password@localhost:3307/chongmei"
   ```

2. **修改 JWT_SECRET**:
   ```env
   JWT_SECRET=your-very-secure-secret-key-change-in-production
   ```

3. **使用环境变量**: 不要将 `.env` 文件提交到 git

## 常用数据库命令

### 连接数据库

```bash
mysql -u root -p123456 -h localhost -P 3307 chongmei
```

### 查看所有数据库

```sql
SHOW DATABASES;
```

### 查看表结构

```sql
DESCRIBE players;
```

### 查看表数据

```sql
SELECT * FROM players LIMIT 10;
```

### 重置数据库

```sql
USE chongmei;
DROP DATABASE chongmei;
CREATE DATABASE chongmei CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

或使用 Prisma:

```bash
cd server
npx prisma migrate reset
```

---

**最后更新**: 2026-01-04
**环境**: Development
