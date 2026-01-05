# MySQL 连接问题修复总结

## 问题描述

用户遇到 MySQL 连接错误：
```
Communications link failure
Connection refused
The driver has not received any packets from the server
```

## 已完成修复

### 1. 更新文档

#### 系统架构设计文档 (`2、设计阶段/系统架构设计.md`)
- ✅ 将所有 `PostgreSQL` 引用改为 `MySQL`
- ✅ 更新数据库选型说明
- ✅ 更新 SQL 语句为 MySQL 语法（UUID(), JSONB → JSON, ENGINE=InnoDB, CHARSET=utf8mb4）

#### README 文档
- ✅ 添加 MySQL 连接问题警告
- ✅ 添加快速诊断脚本链接

### 2. 新增文档

#### `MYSQL_CONNECTION_FIX.md`
详细的 MySQL 连接问题排查指南，包含：

**问题分析**
- 通信连接失败的原因
- 连接被拒绝的原因

**解决步骤**
1. 检查 MySQL 服务（Windows services.msc）
2. 验证 MySQL 监听端口（netstat, telnet）
3. 创建数据库（命令行或 MySQL Workbench）
4. 测试数据库连接（命令行或脚本）
5. 检查防火墙设置
6. 检查 MySQL 配置（my.ini）
7. 重启 MySQL 服务
8. 验证 .env 配置
9. 生成 Prisma Client
10. 运行数据库迁移

**常见问题**
- Access denied（密码错误）
- Unknown database（数据库不存在）
- Can't connect（服务未启动）
- Prisma 迁移失败

#### `CHECK_MYSQL.ps1`
自动化检查脚本，包含：

**检查项目**
- MySQL 服务状态
- 端口 3307 监听状态
- 数据库连接测试
- 配置文件验证

**功能**
- 自动启动 MySQL 服务（如果未运行）
- 显示详细连接信息
- 诊断常见问题
- 提供修复建议

## 当前配置

### 数据库连接
```env
DATABASE_URL="mysql://root:123456@localhost:3307/chongmei"
```

**连接参数**:
- 主机: localhost
- 端口: 3307
- 数据库名: chongmei
- 用户名: root
- 密码: 123456

### 快速诊断

运行诊断脚本：
```powershell
.\CHECK_MYSQL.ps1
```

这会自动检查：
1. MySQL 服务是否运行
2. 端口 3307 是否开放
3. 数据库连接是否正常
4. 配置是否正确

## 推荐排查流程

### 流程 1: 使用自动化脚本

```powershell
# 1. 运行诊断脚本
.\CHECK_MYSQL.ps1

# 2. 根据脚本提示操作
# - 如果服务未启动：手动启动
# - 如果数据库不存在：创建数据库
# - 如果连接失败：查看详细文档
```

### 流程 2: 手动排查

```bash
# 1. 检查 MySQL 服务
# Windows: services.msc
# Linux: sudo systemctl status mysql

# 2. 检查端口
netstat -an | findstr 3307

# 3. 测试连接
mysql -u root -p123456 -h localhost -P 3307

# 4. 如果数据库不存在，创建
mysql -u root -p123456 -h localhost -P 3307 -e "CREATE DATABASE chongmei CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 流程 3: 查看详细文档

```bash
# 查看详细排查指南
cat MYSQL_CONNECTION_FIX.md

# 或使用快速启动脚本（包含完整检查）
.\setup-and-start.ps1
```

## 关键检查点

### 必须满足的条件

- ✅ MySQL 服务正在运行
- ✅ 端口 3307 正在监听
- ✅ 数据库 `chongmei` 已存在
- ✅ 用户名和密码正确
- ✅ .env 配置正确
- ✅ Prisma Client 已生成
- ✅ 数据库迁移已执行

### 验证方法

#### 方法 1: 命令行连接
```bash
mysql -u root -p123456 -h localhost -P 3307 chongmei
```

成功标志：看到 MySQL 提示符 `mysql>`

#### 方法 2: 应用健康检查
访问: http://localhost:3000/api/health

成功响应：
```json
{
  "status": "ok",
  "message": "Soul Pet API is running"
}
```

#### 方法 3: Prisma Studio
```bash
cd server
npm run prisma:studio
```

成功标志：浏览器打开 Prisma Studio 并显示数据

## 常见错误和解决方案

### 错误 1: Connection refused

**原因**: MySQL 未监听该端口

**解决**:
1. 检查 MySQL 服务是否运行
2. 检查 MySQL 监听的端口（可能不是 3307）
3. 修改 .env 中的端口号以匹配

### 错误 2: Access denied

**原因**: 密码或用户名错误

**解决**:
1. 确认密码是 `123456`
2. 重置 MySQL root 密码
3. 修改 .env 中的密码

### 错误 3: Unknown database

**原因**: 数据库不存在

**解决**:
```bash
mysql -u root -p123456 -h localhost -P 3307 -e "CREATE DATABASE chongmei CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 错误 4: Client does not support authentication

**原因**: MySQL 认证插件问题

**解决**:
修改 MySQL 配置，使用原生密码：
```ini
[mysqld]
default_authentication_plugin=mysql_native_password
```

## 下一步操作

完成所有检查后：

### 1. 生成 Prisma Client
```bash
cd server
npx prisma generate
```

### 2. 运行数据库迁移
```bash
cd server
npm run prisma:migrate
```

### 3. 初始化数据
```bash
cd server
npm run prisma:seed
```

### 4. 启动服务
```powershell
.\start-both.ps1
```

或手动启动：
```bash
# 终端 1
cd server
npm run dev

# 终端 2
cd web
npm run dev
```

## 文档索引

| 文档 | 用途 |
|------|------|
| `MYSQL_CONNECTION_FIX.md` | 详细问题排查指南 |
| `CHECK_MYSQL.ps1` | 自动化诊断脚本 |
| `MYSQL_SETUP.md` | MySQL 安装和配置 |
| `CURRENT_CONFIG.md` | 当前配置说明 |
| `QUICK_START_CN.md` | 快速启动指南 |
| `README.md` | 项目主文档 |

## 支持的资源

- MySQL 官方文档: https://dev.mysql.com/doc/
- MySQL Workbench 下载: https://dev.mysql.com/downloads/workbench/
- Prisma MySQL 文档: https://www.prisma.io/docs/concepts/database-connectors/mysql

---

**更新日期**: 2026-01-04
**版本**: v1.0
**状态**: 已完成所有文档更新和问题排查指南
