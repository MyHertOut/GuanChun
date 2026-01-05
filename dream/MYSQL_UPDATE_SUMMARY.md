# MySQL 迁移更新总结

## ✅ 已完成

### 1. 核心配置
- [x] `prisma/schema.prisma` - 数据库提供者改为 MySQL
- [x] `package.json` - 添加 mysql2 依赖
- [x] `.env.example` - 更新数据库连接字符串格式

### 2. 文档更新
- [x] `server/README.md` - 更新为 MySQL 相关内容
- [x] `README.md` - 更新前置要求和数据库设置命令
- [x] `QUICKSTART.md` - 更新数据库创建命令
- [x] `TROUBLESHOOTING.md` - 更新数据库连接问题解决方法

### 3. 新增文档
- [x] `MYSQL_SETUP.md` - MySQL 详细设置指南
- [x] `MIGRATE_TO_MYSQL.md` - 从 PostgreSQL 迁移到 MySQL 指南

## 📋 主要变更

### Prisma Schema
```diff
datasource db {
-  provider = "postgresql"
+  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### 环境变量
```diff
# 旧 (PostgreSQL)
- DATABASE_URL="postgresql://user:password@localhost:5432/soul_pet?schema=public"

# 新 (MySQL)
+ DATABASE_URL="mysql://user:password@localhost:3306/soul_pet"
```

### 依赖
```json
{
  "dependencies": {
    "@prisma/client": "^5.8.1",
    "mysql2": "^3.6.5"  // 新增
  }
}
```

### 数据库创建命令
```diff
# 旧 (PostgreSQL)
- createdb soul_pet

# 新 (MySQL)
+ mysql -u root -p -e "CREATE DATABASE soul_pet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

## 🚀 启动步骤

### 1. 安装 MySQL

确保安装 MySQL 8.0+:

- **Windows**: 下载 MySQL Installer
- **Linux**: `sudo apt install mysql-server`
- **macOS**: `brew install mysql`

### 2. 创建数据库

```bash
mysql -u root -p -e "CREATE DATABASE soul_pet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 3. 配置环境变量

```bash
cd server
cp .env.example .env

# 编辑 .env 文件，修改数据库连接信息
# DATABASE_URL="mysql://用户名:密码@localhost:3306/soul_pet"
```

### 4. 初始化数据库

```bash
cd server

# 生成 Prisma Client
npx prisma generate

# 运行迁移
npm run prisma:migrate

# 初始化数据
npm run prisma:seed
```

### 5. 启动服务

```bash
# 后端
cd server
npm run dev

# 前端
cd web
npm run dev
```

## ⚠️ 重要提示

### 字符集
必须使用 `utf8mb4` 以支持中文和特殊字符：

```sql
CREATE DATABASE soul_pet
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### JSON 字段
MySQL 需要 8.0+ 才能获得最佳的 JSON 支持：

```bash
mysql --version
# 推荐版本: 8.0.26+
```

### 连接字符串格式
```url
mysql://[用户名]:[密码]@[主机]:[端口]/[数据库名]
```

示例:
```
mysql://root:123456@localhost:3306/soul_pet
```

## 📚 文档索引

- **快速开始**: `QUICKSTART.md`
- **MySQL 设置**: `MYSQL_SETUP.md`
- **迁移指南**: `MIGRATE_TO_MYSQL.md`
- **问题解决**: `TROUBLESHOOTING.md`
- **前端文档**: `web/README.md`
- **后端文档**: `server/README.md`

## 🐛 已知问题

### 1. JSON 查询性能
- **影响**: MySQL 的 JSON 查询在某些场景下较慢
- **解决方案**: 使用 JSON 字段存储复杂对象，但避免深层查询

### 2. 外键约束
- **影响**: MySQL 的外键检查更严格
- **解决方案**: 确保 Prisma Schema 正确定义关系

### 3. 自增字段
- **影响**: MySQL 的 AUTO_INCREMENT 与 PostgreSQL 的 SERIAL 不同
- **解决方案**: 项目使用 UUID 作为主键，不依赖自增

## 🎯 下一步

1. ✅ 数据库已切换到 MySQL
2. ✅ 配置文件已更新
3. ✅ 文档已更新
4. ⬜ 启动服务测试
5. ⬜ 验证数据库连接
6. ⬜ 运行数据迁移
7. ⬜ 初始化测试数据

## 🔗 相关资源

- [MySQL 官方文档](https://dev.mysql.com/doc/)
- [Prisma MySQL 文档](https://www.prisma.io/docs/concepts/database-connectors/mysql)
- [MySQL 8.0 新特性](https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html)

---

**更新日期**: 2026-01-04
**版本**: v0.2.0 (MySQL)
