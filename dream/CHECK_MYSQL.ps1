# MySQL 检查和修复脚本

Write-Host "================================" -ForegroundColor Cyan
Write-Host " MySQL 连接检查脚本" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 检查 MySQL 服务
Write-Host "步骤 1: 检查 MySQL 服务..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name "*MySQL*" -ErrorAction SilentlyContinue

if ($mysqlService) {
    Write-Host "✓ MySQL 服务存在" -ForegroundColor Green
    Write-Host "  服务名: $($mysqlService.Name)" -ForegroundColor White
    Write-Host "  状态: $($mysqlService.Status)" -ForegroundColor White

    if ($mysqlService.Status -ne 'Running') {
        Write-Host ""
        Write-Host "⚠ MySQL 服务未运行，尝试启动..." -ForegroundColor Yellow

        try {
            Start-Service -InputObject $mysqlService -ErrorAction Stop
            Start-Sleep -Seconds 3

            $mysqlService = Get-Service -Name "*MySQL*" -ErrorAction SilentlyContinue
            if ($mysqlService.Status -eq 'Running') {
                Write-Host "✓ MySQL 服务已启动" -ForegroundColor Green
            }
        } catch {
            Write-Host "✗ 自动启动失败，请手动启动" -ForegroundColor Red
            Write-Host "  1. 打开 services.msc" -ForegroundColor Yellow
            Write-Host "  2. 找到 MySQL 服务" -ForegroundColor Yellow
            Write-Host "  3. 右键点击'启动'" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "✗ 未找到 MySQL 服务" -ForegroundColor Red
    Write-Host "  请确保已安装 MySQL" -ForegroundColor Yellow
}

Write-Host ""

# 检查端口
Write-Host "步骤 2: 检查端口 3307..." -ForegroundColor Yellow
$portResult = netstat -an | findstr ":3307"

if ($portResult) {
    Write-Host "✓ 端口 3307 正在监听" -ForegroundColor Green
    Write-Host "  $portResult" -ForegroundColor White
} else {
    Write-Host "✗ 端口 3307 未被监听" -ForegroundColor Red
    Write-Host "  可能的原因：" -ForegroundColor Yellow
    Write-Host "  1. MySQL 服务未启动" -ForegroundColor Yellow
    Write-Host "  2. MySQL 监听其他端口" -ForegroundColor Yellow
    Write-Host "  3. 端口被防火墙阻止" -ForegroundColor Yellow
}

Write-Host ""

# 测试数据库连接
Write-Host "步骤 3: 测试数据库连接..." -ForegroundColor Yellow

if (Test-Path "server\.env") {
    $envContent = Get-Content "server\.env"
    $dbUrl = ($envContent | Select-String "DATABASE_URL").Line.Trim().Replace('"', '')

    Write-Host "数据库连接字符串:" -ForegroundColor Cyan
    Write-Host "  $dbUrl" -ForegroundColor White
    Write-Host ""

    # 提取数据库信息
    if ($dbUrl -match "mysql://(.+)@(.+):(\d+)/(.+)") {
        $user = $matches[1]
        $host = $matches[2]
        $port = $matches[3]
        $dbName = $matches[4]

        Write-Host "连接信息:" -ForegroundColor Cyan
        Write-Host "  主机: $host" -ForegroundColor White
        Write-Host "  端口: $port" -ForegroundColor White
        Write-Host "  数据库: $dbName" -ForegroundColor White
        Write-Host ""

        # 检查数据库是否存在（使用 mysql 命令）
        Write-Host "尝试连接 MySQL..." -ForegroundColor Yellow

        # 提取密码
        $password = $user -split ":" | Select-Object -LastProperty

        try {
            $output = & mysql -u "$($user -split ':')[0]" -p$password -h $host -P $port -e "SELECT DATABASE();" 2>&1

            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ 数据库连接成功！" -ForegroundColor Green
                Write-Host "  数据库 '$dbName' 存在" -ForegroundColor White
            } else {
                Write-Host "✗ 数据库连接失败" -ForegroundColor Red
                Write-Host "  错误信息: $output" -ForegroundColor Yellow

                # 检查数据库是否存在
                Write-Host ""
                Write-Host "尝试检查数据库列表..." -ForegroundColor Yellow
                $databases = & mysql -u "$($user -split ':')[0]" -p$password -h $host -P $port -e "SHOW DATABASES;" 2>&1

                if ($LASTEXITCODE -eq 0) {
                    Write-Host "当前数据库列表:" -ForegroundColor Cyan
                    $databases
                }
            }
        } catch {
            Write-Host "✗ 无法执行 mysql 命令" -ForegroundColor Red
            Write-Host "  请确保已安装 MySQL 客户端" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "✗ 未找到 .env 配置文件" -ForegroundColor Red
    Write-Host "  请先运行 setup-and-start.ps1" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host " 检查完成" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "下一步操作：" -ForegroundColor Cyan
Write-Host "  1. 如果 MySQL 未启动：services.msc 手动启动" -ForegroundColor Yellow
Write-Host "  2. 如果数据库不存在：查看 MYSQL_CONNECTION_FIX.md" -ForegroundColor Yellow
Write-Host "  3. 如果一切正常：运行 start-both.ps1 启动服务" -ForegroundColor Green
Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
