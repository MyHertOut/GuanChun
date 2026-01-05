#!/bin/bash

# 魂宠世界 - 快速启动脚本

echo "🎮 魂宠世界 - 启动脚本"
echo "================================"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未安装 Node.js，请先安装 Node.js 18+"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 检查 PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  未检测到 PostgreSQL，请确保数据库已安装并运行"
fi

# 安装后端依赖
echo ""
echo "📦 安装后端依赖..."
cd server
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ 后端依赖已安装"
fi

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "⚠️  未找到 .env 文件，从 .env.example 复制..."
    cp .env.example .env
    echo "📝 请编辑 server/.env 文件，配置数据库连接信息"
    exit 1
fi

# 运行数据库迁移
echo ""
echo "🗄️  运行数据库迁移..."
npm run prisma:migrate

# 初始化数据
echo ""
echo "🌱 初始化数据库数据..."
npm run prisma:seed

# 返回项目根目录
cd ..

# 安装前端依赖
echo ""
echo "📦 安装前端依赖..."
cd web
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✅ 前端依赖已安装"
fi

# 返回项目根目录
cd ..

echo ""
echo "✅ 环境准备完成！"
echo ""
echo "启动服务："
echo "  后端: cd server && npm run dev"
echo "  前端: cd web && npm run dev"
echo ""
echo "🌐 访问: http://localhost:5173"
