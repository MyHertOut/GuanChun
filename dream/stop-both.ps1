# 停止前后端服务

Write-Host "停止魂宠世界服务..." -ForegroundColor Cyan
Write-Host ""

$stopped = $false

# 停止后端服务
$backendJob = Get-Job -Name "BackendServer" -ErrorAction SilentlyContinue
if ($backendJob) {
    Write-Host "正在停止后端服务..." -ForegroundColor Yellow
    Remove-Job -Name "BackendServer" -Force
    Write-Host "✓ 后端服务已停止" -ForegroundColor Green
    $stopped = $true
} else {
    Write-Host "✗ 后端服务未运行" -ForegroundColor Gray
}

# 停止前端服务
$frontendJob = Get-Job -Name "FrontendServer" -ErrorAction SilentlyContinue
if ($frontendJob) {
    Write-Host "正在停止前端服务..." -ForegroundColor Yellow
    Remove-Job -Name "FrontendServer" -Force
    Write-Host "✓ 前端服务已停止" -ForegroundColor Green
    $stopped = $true
} else {
    Write-Host "✗ 前端服务未运行" -ForegroundColor Gray
}

Write-Host ""
if ($stopped) {
    Write-Host "所有服务已停止" -ForegroundColor Green
} else {
    Write-Host "没有运行中的服务" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
