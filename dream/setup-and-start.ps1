# 快速启动脚本 - 魂宠世界

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  魂宠世界 - 一键启动脚本" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
Write-Host "检查环境..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js 版本: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ 未安装 Node.js" -ForegroundColor Red
    Write-Host "请先安装 Node.js 18+: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# 检查 MySQL
$mysqlRunning = Get-Process -Name mysql -ErrorAction SilentlyContinue
if ($mysqlRunning) {
    Write-Host "✓ MySQL 正在运行" -ForegroundColor Green
} else {
    Write-Host "⚠ MySQL 服务未检测到" -ForegroundColor Yellow
    Write-Host "请确保 MySQL 正在运行并监听 3307 端口" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "步骤 1: 安装后端依赖..." -ForegroundColor Cyan
cd server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 后端依赖安装失败" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 后端依赖安装完成" -ForegroundColor Green

Write-Host ""
Write-Host "步骤 2: 安装前端依赖..." -ForegroundColor Cyan
cd ..\web
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 前端依赖安装失败" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 前端依赖安装完成" -ForegroundColor Green

Write-Host ""
Write-Host "步骤 3: 配置数据库..." -ForegroundColor Cyan
cd ..\server
if (Test-Path ".env") {
    Write-Host "✓ .env 文件已存在" -ForegroundColor Green
} else {
    Write-Host "创建 .env 文件..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env 文件已创建" -ForegroundColor Green
}

Write-Host ""
Write-Host "当前数据库配置:" -ForegroundColor Cyan
Get-Content .env | Select-String "DATABASE_URL" | ForEach-Object {
    Write-Host "  $_" -ForegroundColor White
}

Write-Host ""
Write-Host "步骤 4: 生成 Prisma Client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Prisma Client 生成失败" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Prisma Client 生成完成" -ForegroundColor Green

Write-Host ""
Write-Host "步骤 5: 运行数据库迁移..." -ForegroundColor Cyan
npm run prisma:migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 数据库迁移失败" -ForegroundColor Red
    Write-Host ""
    Write-Host "可能的问题:" -ForegroundColor Yellow
    Write-Host "  1. MySQL 未运行" -ForegroundColor Yellow
    Write-Host "  2. 数据库连接信息错误" -ForegroundColor Yellow
    Write-Host "  3. 端口 3307 未开放" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "解决方法:" -ForegroundColor Yellow
    Write-Host "  1. 检查 MySQL 服务: services.msc" -ForegroundColor Yellow
    Write-Host "  2. 手动创建数据库: mysql -u root -p123456 -e 'CREATE DATABASE chongmei CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'" -ForegroundColor Yellow
    Write-Host "  3. 检查端口: netstat -an | findstr 3307" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ 数据库迁移完成" -ForegroundColor Green

Write-Host ""
Write-Host "步骤 6: 初始化数据..." -ForegroundColor Cyan
npm run prisma:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 数据初始化失败" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 数据初始化完成" -ForegroundColor Green

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  环境准备完成！" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "现在可以启动服务了！" -ForegroundColor Green
Write-Host ""
Write-Host "启动方式 1 (推荐):" -ForegroundColor Cyan
Write-Host "  在两个终端窗口中分别运行:" -ForegroundColor White
Write-Host ""
Write-Host "  终端 1 - 后端:" -ForegroundColor Yellow
Write-Host "    cd server" -ForegroundColor White
Write-Host "    npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "  终端 2 - 前端:" -ForegroundColor Yellow
Write-Host "    cd web" -ForegroundColor White
Write-Host "    npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "启动方式 2 (使用快捷脚本):" -ForegroundColor Cyan
Write-Host "  运行 .\start-both.ps1" -ForegroundColor White
Write-Host ""
Write-Host "访问地址:" -ForegroundColor Cyan
Write-Host "  前端: http://localhost:5173" -ForegroundColor Green
Write-Host "  后端: http://localhost:3000" -ForegroundColor Green
Write-Host "  数据库管理: http://localhost:5555 (Prisma Studio)" -ForegroundColor Green
Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
