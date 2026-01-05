const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rootDir = path.resolve(__dirname, '..');
const args = process.argv.slice(2);

const { execSync } = require('child_process');

// 主入口
if (args.length > 0) {
  handleCommandLineArgs(args);
} else {
  startInteractiveMode();
}

function handleCommandLineArgs(args) {
  if (args.length < 2) {
    console.error('Usage: node scripts/init.js <type> <project-name>');
    console.error('  type: front | server');
    console.error('  project-name: Name of the new project');
    process.exit(1);
  }

  const [type, name] = args;
  const validTypes = ['front', 'server'];

  if (!validTypes.includes(type)) {
    console.error(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
    process.exit(1);
  }

  createProject(type, name);
}

function startInteractiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n🌟 欢迎使用全栈项目初始化工具 🌟\n');
  console.log('请选择初始化模式:');
  console.log('  [1] 仅初始化前端 (Front-end only)');
  console.log('  [2] 仅初始化后端 (Back-end only)');
  console.log('  [3] 同时初始化 (Full Stack)');

  rl.question('\n请输入选项 (1-3): ', (choice) => {
    if (!['1', '2', '3'].includes(choice.trim())) {
      console.error('无效选项，退出。');
      rl.close();
      return;
    }

    rl.question('\n请输入项目名称 (例如 myapp): ', (name) => {
      name = name.trim();
      if (!name) {
        console.error('项目名称不能为空，退出。');
        rl.close();
        return;
      }

      console.log(''); // 空行

      try {
        if (choice === '1') {
          createProject('front', name);
        } else if (choice === '2') {
          createProject('server', name);
        } else if (choice === '3') {
          createProject('front', name);
          console.log('-'.repeat(30));
          createProject('server', name);
        }
      } catch (e) {
        // 错误已在 createProject 中处理
      }

      rl.close();
    });
  });
}

function createProject(type, name) {
  const sourceDir = path.join(rootDir, type);
  const targetName = `${type}-${name}`;
  const targetDir = path.join(rootDir, targetName);

  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Source template not found: ${sourceDir}`);
    return;
  }

  if (fs.existsSync(targetDir)) {
    console.error(`⚠️  Target directory already exists: ${targetDir} (Skipped)`);
    return;
  }

  console.log(`🚀 Initializing [${type}] project: ${targetName}...`);

  try {
    // 1. Scaffold using official tools
    if (type === 'front') {
      console.log('   Running scaffold: create-vue (Vue 3 + TS + Vite)...');
      try {
        // Flags: --typescript --router --pinia --eslint --prettier --force
        execSync(`npx create-vue@latest ${targetName} --typescript --router --pinia --eslint --prettier --force`, {
          cwd: rootDir,
          stdio: 'inherit'
        });
      } catch (e) {
        console.warn('⚠️  Scaffold command failed, falling back to simple copy.');
      }
    } else if (type === 'server') {
      console.log('   Running scaffold: NestJS CLI...');
      try {
        // Flags: --package-manager pnpm --strict --skip-git --skip-install
        execSync(`npx @nestjs/cli new ${targetName} --package-manager pnpm --strict --skip-git --skip-install`, {
          cwd: rootDir,
          stdio: 'inherit'
        });
      } catch (e) {
         console.warn('⚠️  Scaffold command failed, falling back to simple copy.');
      }
    }

    // 2. Copy Template Files (Overlay/Overwrite)
    console.log('   Applying template files...');
    copyDir(sourceDir, targetDir);
    
    // 3. Adjust Project Structure (Clean Architecture)
    console.log('   Adjusting project structure...');
    adjustProjectStructure(targetDir, type);

    // Update package.json name
    const pkgPath = path.join(targetDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      pkg.name = targetName;
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }

    // 3. Install Dependencies
    console.log('   Installing base dependencies (pnpm)...');
    try {
        execSync('pnpm install', { cwd: targetDir, stdio: 'inherit' });
    } catch (e) {
        console.error('❌ Failed to install base dependencies.');
    }

    // 4. Install Additional Stack Dependencies
    console.log('   Installing extended stack dependencies...');
    installExtendedDependencies(targetDir, type);

    // 5. Setup Environment Variables
    const envExample = path.join(targetDir, '.env.example');
    const envTarget = path.join(targetDir, '.env');
    if (fs.existsSync(envExample) && !fs.existsSync(envTarget)) {
        console.log('   Creating .env from .env.example...');
        fs.copyFileSync(envExample, envTarget);
    }

    console.log(`✅ Created successfully at: ${targetDir}`);
    
    // 生成 AI 上下文信息
    printAIContext(targetDir, type, targetName);

    // [New] Write metadata for AI automation
    try {
      const metaPath = path.join(rootDir, '.latest-project.json');
      fs.writeFileSync(metaPath, JSON.stringify({
        name: targetName,
        type: type,
        path: targetDir,
        readme: path.join(targetDir, 'README.md'),
        createdAt: new Date().toISOString()
      }, null, 2));
    } catch (e) {
      // Ignore write error
    }

  } catch (error) {
    console.error(`❌ Failed to initialize ${type}:`, error);
  }
}

function adjustProjectStructure(targetDir, type) {
  const srcDir = path.join(targetDir, 'src');
  
  if (!fs.existsSync(srcDir)) {
      // NestJS might be src, but just in case
      fs.mkdirSync(srcDir, { recursive: true });
  }

  let dirsToCreate = [];

  if (type === 'front') {
      // Vue 3 + Clean Architecture
      dirsToCreate = [
          'api',
          'application',
          'assets',
          'components',
          'composables',
          'domain',
          'infrastructure',
          'router',
          'stores',
          'styles',
          'types',
          'utils',
          'views'
      ];
  } else if (type === 'server') {
      // NestJS + Clean Architecture
      dirsToCreate = [
          'domain/model',
          'domain/repository',
          'domain/service',
          'application/use-case',
          'application/dto',
          'infrastructure/config',
          'infrastructure/persistence',
          'infrastructure/common',
          'interface/http'
      ];
  }

  dirsToCreate.forEach(dir => {
      const fullPath = path.join(srcDir, dir);
      if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
          // Add a .gitkeep to ensure the folder is kept
          fs.writeFileSync(path.join(fullPath, '.gitkeep'), '');
      }
  });
}

function installExtendedDependencies(targetDir, type) {
  const { execSync } = require('child_process');
  
  try {
      if (type === 'front') {
          const deps = [
              'element-plus',
              'axios',
              'socket.io-client',
              '@vueuse/core',
              'dayjs'
          ];
          const devDeps = [
              'unocss',
              'sass',
              'unplugin-auto-import',
              'unplugin-vue-components'
          ];
          
          console.log(`     + Dependencies: ${deps.join(', ')}`);
          execSync(`pnpm add ${deps.join(' ')}`, { cwd: targetDir, stdio: 'inherit' });
          
          console.log(`     + DevDependencies: ${devDeps.join(', ')}`);
          execSync(`pnpm add -D ${devDeps.join(' ')}`, { cwd: targetDir, stdio: 'inherit' });

      } else if (type === 'server') {
          const deps = [
              '@nestjs/platform-fastify',
              '@nestjs/typeorm',
              '@nestjs/swagger',
              'typeorm',
              'mysql2',
              'class-validator',
              'class-transformer',
              'winston',
              'helmet'
          ];
           // Remove default platform-express to avoid conflicts if needed, but Nest CLI usually handles it.
           // We'll just add fastify.
           
          console.log(`     + Dependencies: ${deps.join(', ')}`);
          execSync(`pnpm add ${deps.join(' ')}`, { cwd: targetDir, stdio: 'inherit' });
      }
  } catch (e) {
      console.error('❌ Failed to install extended dependencies:', e.message);
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === '.DS_Store') {
      continue;
    }

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function printAIContext(targetDir, type, projectName) {
  console.log(`\n📄 [AI Context] 以下信息可直接复制给 AI 助手以开始开发:`);
  console.log(`===========================================================`);
  console.log(`Project: ${projectName}`);
  console.log(`Type: ${type}`);
  console.log(`Path: ${targetDir}`);
  
  // 读取 package.json 依赖
  const pkgPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    console.log(`\nDependencies:`);
    console.log(JSON.stringify(pkg.dependencies || {}, null, 2));
    console.log(`DevDependencies:`);
    console.log(JSON.stringify(pkg.devDependencies || {}, null, 2));
  }

  // 简单列出 src 目录结构 (前两层)
  console.log(`\nDocumentation:`);
  printReadme(targetDir);
  console.log(`===========================================================\n`);
}

/**
 * 打印项目文档路径
 * @param {string} targetDir - 项目目录路径
 */
function printReadme(targetDir) {
  const readmePath = path.join(targetDir, 'README.md');
  if (fs.existsSync(readmePath)) {
    console.log(readmePath);
  }
}
