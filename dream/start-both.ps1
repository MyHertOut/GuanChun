# 启动前后端服务 - 魂宠世界

Write-Host "启动魂宠世界服务..." -ForegroundColor Cyan
Write-Host ""

# 检查是否已安装依赖
if (-not (Test-Path "server\node_modules") -or -not (Test-Path "web\node_modules")) {
    Write-Host "⚠ 未检测到 node_modules，请先运行 setup-and-start.ps1" -ForegroundColor Yellow
    exit 1
}

# 启动后端
Write-Host "启动后端服务..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    cd server
    npm run dev
} -Name "BackendServer"

Start-Sleep -Seconds 3

# 检查后端是否启动
if (Get-Job -Name "BackendServer" -ErrorAction SilentlyContinue) {
    Write-Host "✓ 后端服务已启动" -ForegroundColor Green
} else {
    Write-Host "✗ 后端服务启动失败" -ForegroundColor Red
    exit 1
}

# 启动前端
Write-Host "启动前端服务..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    cd web
    npm run dev
} -Name "FrontendServer"

Start-Sleep -Seconds 3

# 检查前端是否启动
if (Get-Job -Name "FrontendServer" -ErrorAction SilentlyContinue) {
    Write-Host "✓ 前端服务已启动" -ForegroundColor Green
} else {
    Write-Host "✗ 前端服务启动失败" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  服务已全部启动！" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "访问地址:" -ForegroundColor Cyan
Write-Host "  前端应用: http://localhost:5173" -ForegroundColor Green
Write-Host "  后端 API:  http://localhost:3000" -ForegroundColor Green
Write-Host "  健康检查:  http://localhost:3000/api/health" -ForegroundColor Green
Write-Host ""
Write-Host "停止服务: 按 Ctrl+C 或运行 stop-both.ps1" -ForegroundColor Yellow
Write-Host ""

# 等待用户停止
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host ""
    Write-Host "正在停止服务..." -ForegroundColor Yellow

    if (Get-Job -Name "BackendServer" -ErrorAction SilentlyContinue) {
        Remove-Job -Name "BackendServer" -Force
        Write-Host "✓ 后端服务已停止" -ForegroundColor Green
    }

    if (Get-Job -Name "FrontendServer" -ErrorAction SilentlyContinue) {
        Remove-Job -Name "FrontendServer" -Force
        Write-Host "✓ 前端服务已停止" -ForegroundColor Green
    }

    Write-Host "所有服务已停止" -ForegroundColor Green
}
