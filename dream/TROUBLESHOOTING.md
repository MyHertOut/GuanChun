# 常见问题解决

## 前端问题

### 1. TypeError: Cannot read properties of undefined (reading 'value')

**原因**: Vue Router 在访问 store 时，store 尚未初始化。

**解决方案**:
- 使用 `computed` 和可选链操作符 `?.` 安全访问
- 已在 `Home.vue` 中修复，添加了 `hasPlayer` 计算属性

```typescript
const hasPlayer = computed(() => playerStore.player !== null)

// 使用时
<div v-if="!hasPlayer">
  <!-- ... -->
</div>
```

## 后端问题

### 1. Cannot find module '.prisma/client/default'

**原因**: Prisma Client 未生成。

**解决方案**:

方法1 - 运行生成命令：
```bash
cd server
npx prisma generate
```

方法2 - 直接启动（已自动处理）：
```bash
cd server
npm run dev  # 会自动运行 prisma generate
```

### 2. 数据库连接失败

**原因**: MySQL 未运行或配置错误。

**解决方案**:

1. 检查 MySQL 是否运行
```bash
# Windows
# 打开服务管理器检查 MySQL 服务

# 或检查端口
netstat -an | findstr 3306
```

2. 检查 `.env` 配置
```env
DATABASE_URL="mysql://用户名:密码@localhost:3306/soul_pet"
```

3. 确保数据库存在
```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE soul_pet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 迁移失败

**原因**: 数据库已存在表或连接问题。

**解决方案**:

1. 重置数据库
```bash
cd server
npx prisma migrate reset
```

2. 或手动删除表后重新迁移
```sql
USE soul_pet;
DROP TABLE IF EXISTS saves, inventories, pact_slots, pets, players, skills, pet_species;
```

**注意**: MySQL 需要先删除外键约束才能删除表，建议使用 Prisma 的 reset 命令。

2. 或手动删除表后重新迁移
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

## 安装问题

### 1. npm install 失败

**可能原因**:
- 网络问题
- Node.js 版本不兼容
- 缓存问题

**解决方案**:

1. 清除缓存
```bash
npm cache clean --force
```

2. 使用国内镜像
```bash
npm config set registry https://registry.npmmirror.com
```

3. 升级 Node.js 到 18+

## 启动问题

### 1. 端口已被占用

**错误信息**: `Error: listen EADDRINUSE: address already in use :::3000`

**解决方案**:

1. 修改 `.env` 端口
```env
PORT=3001
```

2. 或终止占用进程
```bash
# 查找占用 3000 端口的进程
netstat -ano | findstr :3000

# 终止进程（替换 PID）
taskkill /F /PID <PID>
```

### 2. TypeScript 编译错误

**解决方案**:

1. 安装 TypeScript
```bash
npm install -g typescript
```

2. 清理 node_modules 重新安装
```bash
rm -rf node_modules
npm install
```

## 开发环境问题

### 1. 热更新不生效

**解决方案**:

1. 重启开发服务器
2. 清除浏览器缓存
3. 检查 Vite 配置

### 2. CORS 错误

**错误信息**: `Access to XMLHttpRequest at 'http://localhost:3000' from origin 'http://localhost:5173' has been blocked by CORS policy`

**解决方案**:

后端已配置 CORS，如果仍有问题，检查：
- `server/src/index.ts` 中的 `app.use(cors())`
- 浏览器扩展是否拦截请求

## 获取帮助

如果以上方法都无法解决问题：

1. 检查日志
   - 前端: 浏览器控制台 (F12)
   - 后端: 终端输出

2. 查看文档
   - 前端: `web/README.md`
   - 后端: `server/README.md`
   - 整体: `README.md`

3. 提交 Issue
   - 描述问题详情
   - 提供错误信息
   - 说明环境配置
