# MySQL 连接问题解决指南

## 错误信息

```
Communications link failure
Connection refused
The driver has not received any packets from the server
The last packet sent successfully to the server was 0 milliseconds ago
```

## 问题分析

这些错误表示：
1. **Communications link failure** - 网络连接失败
2. **Connection refused** - 服务器拒绝连接
3. **未收到数据包** - 服务器可能未运行

## 解决步骤

### 步骤 1: 检查 MySQL 服务

#### Windows

1. 打开"服务管理器"（`services.msc`）
2. 查找 MySQL 服务（名称可能是：MySQL, MySQL80, MySQL57 等）
3. 确认服务状态为"正在运行"

如果未运行：
- 右键点击 MySQL 服务
- 选择"启动"

#### 命令行检查

```powershell
# 检查 MySQL 服务状态
Get-Service -Name MySQL* -ErrorAction SilentlyContinue

# 或检查端口
netstat -an | findstr 3307
```

### 步骤 2: 验证 MySQL 监听端口

#### 使用 netstat

```powershell
netstat -an | findstr 3307
```

应该看到类似输出：
```
TCP    0.0.0.0:3307           0.0.0.0:0              LISTENING
```

#### 使用 telnet 测试

```powershell
telnet localhost 3307
```

如果显示"连接成功"，说明端口正常。

### 步骤 3: 创建数据库

#### 方法 1: 使用命令行

```bash
mysql -u root -p123456 -e "CREATE DATABASE IF NOT EXISTS chongmei CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

如果提示"Access denied"，说明密码错误。

#### 方法 2: 使用 MySQL Workbench

1. 打开 MySQL Workbench
2. 连接到服务器（localhost:3307）
3. 执行 SQL：
```sql
CREATE DATABASE IF NOT EXISTS chongmei
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### 步骤 4: 测试数据库连接

#### 方法 1: 使用命令行

```bash
mysql -u root -p123456 -h localhost -P 3307 chongmei
```

应该成功连接并看到 MySQL 提示符：
```
mysql>
```

#### 方法 2: 使用连接字符串

```bash
# Windows (PowerShell)
$env:DATABASE_URL = "mysql://root:123456@localhost:3307/chongmei"

# 测试连接
node -e "const mysql = require('mysql2/promise'); (async () => { try { const conn = await mysql.createConnection(process.env.DATABASE_URL); await conn.end(); console.log('✓ 连接成功'); } catch(e) { console.error('✗ 连接失败:', e.message); } })();"
```

### 步骤 5: 检查防火墙设置

#### Windows 防火墙

1. 打开"Windows Defender 防火墙"
2. 选择"允许应用通过防火墙"
3. 添加 MySQL（端口 3307）到允许列表

#### 第三方防火墙

如果有其他防火墙（如 McAfee, Norton, 360 等）：
- 添加例外规则允许端口 3307
- 或临时关闭防火墙测试

### 步骤 6: 检查 MySQL 配置

#### 检查 my.ini 配置

MySQL 配置文件位置：
- Windows: `C:\ProgramData\MySQL\MySQL Server 8.0\my.ini`
- 或: `C:\Program Files\MySQL\MySQL Server 8.0\my.ini`

检查 `port` 配置：

```ini
[mysqld]
port=3307
```

#### 检查 bind-address

确保 `bind-address` 允许本地连接：

```ini
[mysqld]
bind-address=0.0.0.0  # 允许所有 IP
# 或
bind-address=127.0.0.1   # 仅允许本地（开发环境推荐）
```

**注意**: 修改配置后需要重启 MySQL 服务

### 步骤 7: 重启 MySQL 服务

```powershell
# 重启 MySQL 服务
Restart-Service -Name "MySQL80" -Force

# 或使用命令行
net stop MySQL80
net start MySQL80
```

### 步骤 8: 验证 .env 配置

检查 `server/.env` 文件：

```env
DATABASE_URL="mysql://root:123456@localhost:3307/chongmei"
```

确认：
- ✅ 用户名：root
- ✅ 密码：123456
- ✅ 主机：localhost
- ✅ 端口：3307
- ✅ 数据库名：chongmei

### 步骤 9: 生成 Prisma Client

```bash
cd server

# 手动生成
npx prisma generate

# 或使用 npm 脚本
npm run prisma:generate
```

应该看到输出：
```
✔ Generated Prisma Client to .\node_modules\@prisma\client in 123ms
```

### 步骤 10: 运行数据库迁移

```bash
cd server

# 运行迁移
npm run prisma:migrate
```

应该看到输出：
```
Applying migration `20240104000000_init`

The following migration(s) have been applied:
```

## 常见问题

### 问题 1: Access denied for user 'root'@'localhost'

**原因**: 密码错误

**解决**:
1. 确认密码是 `123456`
2. 检查 MySQL root 密码：
```bash
mysql -u root -p
# 输入密码 123456
```

3. 修改密码（如果忘记）：
```sql
-- 登录 MySQL
mysql -u root -p

-- 重置密码（在新终端）
ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
FLUSH PRIVILEGES;
```

### 问题 2: Unknown database 'chongmei'

**原因**: 数据库不存在

**解决**:
```bash
# 创建数据库
mysql -u root -p123456 -e "CREATE DATABASE chongmei CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 验证
mysql -u root -p123456 -e "SHOW DATABASES;"
```

应该看到 `chongmei` 在列表中。

### 问题 3: Can't connect to MySQL server

**原因**: MySQL 服务未启动或端口错误

**解决**:

1. 确认 MySQL 正在运行
```powershell
Get-Service -Name MySQL80
```

2. 检查端口
```powershell
netstat -an | findstr 3307
```

3. 如果 MySQL 监听其他端口（如 3306）
   - 修改 `.env` 中的端口号
   - 或修改 MySQL 配置使其监听 3307

### 问题 4: Prisma 迁移失败

**错误**:
```
P1001: Can't reach database server at `localhost:3307`
```

**解决**:

1. 先手动测试连接
```bash
mysql -u root -p123456 -h localhost -P 3307 chongmei
```

2. 如果能连接，重新生成 Prisma Client
```bash
cd server
npx prisma generate
npm run prisma:migrate
```

3. 如果不能连接，按上述步骤排查

## 快速测试流程

### 1. MySQL 服务检查

```powershell
# 检查服务
Get-Service -Name MySQL* | Select-Object Name, Status, StartType

# 检查端口
netstat -an | findstr 3307
```

### 2. 数据库连接测试

```bash
# 连接数据库
mysql -u root -p123456 -h localhost -P 3307 chongmei

# 执行测试查询
SELECT VERSION();
```

### 3. Prisma 生成测试

```bash
cd server
npx prisma generate
```

### 4. 应用启动测试

```bash
# 启动后端
npm run dev

# 访问健康检查
curl http://localhost:3000/api/health
```

## 下一步

完成以上步骤后：

1. ✅ MySQL 服务正在运行
2. ✅ 端口 3307 正在监听
3. ✅ 数据库 chongmei 存在
4. ✅ 可以成功连接到数据库
5. ✅ Prisma Client 已生成
6. ✅ 数据库迁移已执行

然后可以正常启动项目了！

## 获取帮助

如果以上步骤都无法解决问题：

1. **查看 MySQL 日志**:
   - Windows: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err`
   - 事件查看器 → Windows 日志 → 应用程序

2. **重新安装 MySQL**（最后手段）:
   - 完全卸载 MySQL
   - 清理残留文件和注册表
   - 重新安装 MySQL 8.0

3. **使用默认端口**（3306）:
   - 修改 `.env` 为 `mysql://root:123456@localhost:3306/chongmei`
   - 确保 MySQL 监听 3306 端口

---

**文档版本**: v1.0
**更新日期**: 2026-01-04
