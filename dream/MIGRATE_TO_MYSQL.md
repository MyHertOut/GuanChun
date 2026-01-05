# 从 PostgreSQL 迁移到 MySQL

本项目已将数据库从 PostgreSQL 迁移到 MySQL。

## 主要变更

### 1. 数据库类型
- **旧**: PostgreSQL
- **新**: MySQL 8.0+

### 2. 依赖更新
- 添加了 `mysql2` 驱动

### 3. 配置文件变更

#### Prisma Schema
```diff
datasource db {
-  provider = "postgresql"
+  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

#### 环境变量
```diff
- DATABASE_URL="postgresql://user:password@localhost:5432/soul_pet?schema=public"
+ DATABASE_URL="mysql://user:password@localhost:3306/soul_pet"
```

### 4. 数据库初始化

#### PostgreSQL (旧)
```bash
createdb soul_pet
```

#### MySQL (新)
```bash
mysql -u root -p -e "CREATE DATABASE soul_pet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

## 迁移步骤

如果你已经有 PostgreSQL 数据，需要手动迁移数据：

### 步骤 1: 导出 PostgreSQL 数据

```bash
# 安装 pg_dump
sudo apt install postgresql-client  # Linux
# 或使用 pgAdmin GUI 工具

# 导出数据
pg_dump -U postgres -h localhost soul_pet > postgres_dump.sql
```

### 步骤 2: 转换 SQL 语法

PostgreSQL 和 MySQL 的 SQL 语法有一些差异，需要手动转换：

主要差异：
1. **数据类型转换**:
   - `TEXT` → `LONGTEXT`
   - `SERIAL` → `AUTO_INCREMENT`
   - `BOOLEAN` → `TINYINT(1)`
   - `JSONB` → `JSON`

2. **函数转换**:
   - `NOW()` (PostgreSQL) → `NOW()` (MySQL) - 相同
   - `CURRENT_TIMESTAMP` (PostgreSQL) → `CURRENT_TIMESTAMP` (MySQL) - 相同

3. **字符串拼接**:
   - `string1 || string2` (PostgreSQL) → `CONCAT(string1, string2)` (MySQL)

### 步骤 3: 导入 MySQL

```bash
# 修复后的 SQL 文件导入
mysql -u root -p soul_pet < mysql_dump.sql
```

### 步骤 4: 使用 Prisma 迁移

```bash
cd server

# 生成 Prisma Client
npx prisma generate

# 运行迁移
npm run prisma:migrate

# 初始化数据
npm run prisma:seed
```

## 注意事项

### JSON 字段

MySQL 的 JSON 支持:
- 需要 MySQL 5.7.8+ 或 8.0+
- 推荐使用 MySQL 8.0+ 以获得更好的 JSON 性能

### 字符集

为了支持中文和特殊字符，确保使用 `utf8mb4`:

```sql
CREATE DATABASE soul_pet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 外键约束

MySQL 的外键约束比 PostgreSQL 更严格，确保：
1. 引用表的字段类型完全匹配
2. 引用表的字段有索引
3. 数据类型兼容

### 自动递增

PostgreSQL 使用 `SERIAL` 类型，MySQL 使用 `AUTO_INCREMENT`:

```prisma
model Player {
  id String @id @default(uuid())  // 使用 UUID，不依赖自动递增
  name String

  @@map("players")
}
```

## 测试迁移

运行迁移后，验证数据：

```bash
# 使用 Prisma Studio
cd server
npm run prisma:studio

# 或使用 MySQL 命令行
mysql -u root -p soul_pet

# 查看所有表
SHOW TABLES;

# 检查记录数
SELECT
    TABLE_NAME,
    TABLE_ROWS
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'soul_pet';
```

## 性能对比

### PostgreSQL 优势
- 更强的 SQL 兼容性
- 更好的 JSON 支持
- 更丰富的数据类型

### MySQL 优势
- 更广泛的云服务支持
- 更简单的配置
- 更好的读写性能（某些场景）

选择 MySQL 的原因：
1. 更容易找到托管服务
2. 更多的在线资源
3. 成熟的 Prisma 支持
4. 适合中小型项目

## 回滚到 PostgreSQL

如果需要回滚：

### 1. 修改 Prisma Schema
```diff
datasource db {
+  provider = "postgresql"
-  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### 2. 修改 .env
```diff
+ DATABASE_URL="postgresql://user:password@localhost:5432/soul_pet?schema=public"
- DATABASE_URL="mysql://user:password@localhost:3306/soul_pet"
```

### 3. 重新安装依赖
```bash
# 移除 MySQL 驱动
npm uninstall mysql2

# 运行迁移
cd server
npm run prisma:migrate
npm run prisma:seed
```

## 常见问题

### 1. JSON 字段查询失败

**错误**:
```
Invalid JSON text in argument
```

**解决**: 确保 MySQL 版本支持 JSON

```bash
mysql --version
# 应该是 5.7.8+ 或 8.0+
```

### 2. 外键约束错误

**错误**:
```
Cannot add foreign key constraint
```

**解决**: 检查字段类型是否匹配

```sql
-- 查看表结构
DESCRIBE pets;

-- 查看外键
SELECT
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'soul_pet';
```

### 3. 字符编码错误

**错误**:
```
Incorrect string value
```

**解决**: 确保使用 utf8mb4

```sql
-- 检查数据库字符集
SHOW CREATE DATABASE soul_pet;

-- 修改字符集
ALTER DATABASE soul_pet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 更多资源

- [MySQL 官方文档](https://dev.mysql.com/doc/)
- [Prisma MySQL Guide](https://www.prisma.io/docs/concepts/database-connectors/mysql)
- [PostgreSQL to MySQL Migration](https://www.percona.com/blog/migrating-from-postgresql-to-mysql)
