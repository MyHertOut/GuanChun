# MySQL 数据库设置指南

## 要求

- MySQL 8.0+
- Node.js 18+

## 安装 MySQL

### Windows

1. 下载 MySQL Installer: https://dev.mysql.com/downloads/mysql/
2. 运行安装程序，选择 "Server only"
3. 设置 root 密码
4. 确保端口 3306 开放

### Linux (Ubuntu)

```bash
sudo apt update
sudo apt install mysql-server

# 安全配置
sudo mysql_secure_installation
```

### macOS

```bash
brew install mysql

# 启动服务
brew services start mysql
```

## 创建数据库

### 方法 1: 使用 MySQL 命令行

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE soul_pet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 退出
EXIT;
```

### 方法 2: 使用 SQL 文件

创建 `init.sql`:

```sql
CREATE DATABASE IF NOT EXISTS soul_pet
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE soul_pet;

-- 显示数据库信息
SHOW VARIABLES LIKE 'character_set%';
SHOW VARIABLES LIKE 'collation%';
```

执行:

```bash
mysql -u root -p < init.sql
```

## 配置环境变量

编辑 `server/.env`:

```env
# MySQL 连接字符串格式
DATABASE_URL="mysql://用户名:密码@localhost:3306/soul_pet"

# 示例
DATABASE_URL="mysql://root:123456@localhost:3306/soul_pet"
```

### 连接字符串格式

```
mysql://[用户名]:[密码]@[主机]:[端口]/[数据库名]
```

参数说明:
- 用户名: MySQL 用户名（如 root）
- 密码: MySQL 用户密码
- 主机: localhost 或 IP 地址
- 端口: 默认 3306
- 数据库名: soul_pet

## 运行迁移

```bash
cd server

# 生成 Prisma Client
npx prisma generate

# 运行迁移
npm run prisma:migrate

# 初始化数据
npm run prisma:seed
```

## 验证数据库

### 1. 使用 Prisma Studio

```bash
cd server
npm run prisma:studio
```

浏览器会自动打开 http://localhost:5555

### 2. 使用 MySQL 命令行

```bash
mysql -u root -p soul_pet

# 查看所有表
SHOW TABLES;

# 查看某个表的数据
SELECT * FROM players LIMIT 10;

# 退出
EXIT;
```

## 常见问题

### 1. 连接被拒绝

**错误**:
```
Access denied for user 'root'@'localhost'
```

**解决**:

1. 检查用户名和密码
2. 确认 root 用户权限

```sql
-- 重置 root 密码（如果忘记）
ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
FLUSH PRIVILEGES;
```

### 2. 字符集问题

**错误**:
```
Incorrect string value
```

**解决**: 确保数据库使用 utf8mb4

```sql
ALTER DATABASE soul_pet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 权限问题

**错误**:
```
Access denied for user
```

**解决**: 授予权限

```sql
GRANT ALL PRIVILEGES ON soul_pet.* TO '用户名'@'localhost';
FLUSH PRIVILEGES;
```

### 4. 端口被占用

**错误**:
```
Can't connect to MySQL server on 'localhost:3306'
```

**解决**:

检查 MySQL 服务是否运行:

```bash
# Windows
netstat -an | findstr 3306

# 或检查服务
services.msc
```

### 5. Prisma 迁移失败

**错误**:
```
P3006
Migration failed to apply cleanly to the shadow database
```

**解决**:

```bash
# 重置数据库（会删除所有数据）
cd server
npx prisma migrate reset

# 然后重新运行
npm run prisma:migrate
```

## 性能优化

### 1. 索引

Prisma 会自动创建主键和外键索引。对于频繁查询的字段，可以手动添加索引:

```prisma
model Player {
  id    String @id @default(uuid())
  name  String

  @@index([name])
  @@map("players")
}
```

### 2. 连接池

在 `.env` 中配置连接池:

```env
DATABASE_URL="mysql://user:password@localhost:3306/soul_pet?connection_limit=10&pool_timeout=20"
```

### 3. 查询优化

使用 `select` 只查询需要的字段:

```typescript
const players = await prisma.player.findMany({
  select: {
    id: true,
    name: true,
    level: true
  }
})
```

## 备份与恢复

### 备份

```bash
mysqldump -u root -p soul_pet > backup.sql
```

### 恢复

```bash
mysql -u root -p soul_pet < backup.sql
```

## 监控

### 查看连接数

```sql
SHOW STATUS LIKE 'Threads_connected';
```

### 查看慢查询

```sql
SHOW VARIABLES LIKE 'slow_query_log';
```

### 查看表大小

```sql
SELECT
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'soul_pet'
ORDER BY (data_length + index_length) DESC;
```

## 更多资源

- [MySQL 官方文档](https://dev.mysql.com/doc/)
- [Prisma MySQL 文档](https://www.prisma.io/docs/concepts/database-connectors/mysql)
- [MySQL 性能优化](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
