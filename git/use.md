


          
# Git 源代码管理命令详解与应用场景

## 1. 基础版本控制

### 初始化仓库
```bash
git init
```
**应用场景**: 开始新项目时，将普通文件夹转换为Git仓库

### 克隆仓库
```bash
git clone https://github.com/user/repo.git
git clone git@github.com:user/repo.git
```
**应用场景**: 下载开源项目、加入团队项目开发

### 添加文件到暂存区
```bash
git add file.txt          # 添加单个文件
git add .                 # 添加所有更改
git add *.js              # 添加所有JS文件
git add -A                # 添加所有更改（包括删除）
```
**应用场景**: 准备提交前选择要包含的更改

### 提交更改
```bash
git commit -m "提交信息"
git commit -am "添加并提交"    # 跳过暂存直接提交
git commit --amend           # 修改最后一次提交
```
**应用场景**: 保存代码快照、记录开发进度

### 查看状态和历史
```bash
git status                   # 查看工作区状态
git log                      # 查看提交历史
git log --oneline            # 简洁的历史记录
git log --graph              # 图形化显示分支
```
**应用场景**: 了解当前状态、追踪项目历史

## 2. 分支管理

### 分支操作
```bash
git branch                   # 查看所有分支
git branch feature-login     # 创建新分支
git checkout feature-login   # 切换分支
git checkout -b hotfix       # 创建并切换分支
git switch main              # 切换到主分支（新语法）
```
**应用场景**: 功能开发、bug修复、实验性功能

### 合并分支
```bash
git merge feature-login      # 合并分支
git merge --no-ff feature    # 强制创建合并提交
git merge --squash feature   # 压缩合并
```
**应用场景**: 将功能分支合并到主分支

### 删除分支
```bash
git branch -d feature-login  # 删除已合并分支
git branch -D feature-login  # 强制删除分支
```
**应用场景**: 清理完成的功能分支

## 3. 远程仓库操作

### 远程仓库管理
```bash
git remote add origin https://github.com/user/repo.git
git remote -v                # 查看远程仓库
git remote remove origin     # 删除远程仓库
```
**应用场景**: 连接GitHub、GitLab等远程仓库

### 同步操作
```bash
git fetch origin             # 获取远程更新
git pull origin main         # 拉取并合并
git pull --rebase origin main # 变基拉取
git push origin main         # 推送到远程
git push -u origin feature   # 推送新分支并设置跟踪
```
**应用场景**: 团队协作、代码同步

## 4. 高级操作

### 变基操作
```bash
git rebase main              # 将当前分支变基到main
git rebase -i HEAD~3         # 交互式变基最近3个提交
git rebase --continue        # 继续变基
git rebase --abort           # 中止变基
```
**应用场景**: 整理提交历史、解决冲突

### 樱桃挑选
```bash
git cherry-pick abc123       # 应用特定提交
git cherry-pick abc123..def456 # 应用提交范围
```
**应用场景**: 将bug修复应用到多个分支

### 重置操作
```bash
git reset --soft HEAD~1      # 软重置（保留更改）
git reset --mixed HEAD~1     # 混合重置（默认）
git reset --hard HEAD~1      # 硬重置（丢弃更改）
git reset HEAD file.txt      # 取消暂存文件
```
**应用场景**: 撤销提交、修正错误

### 还原提交
```bash
git revert abc123            # 还原特定提交
git revert HEAD              # 还原最新提交
```
**应用场景**: 安全地撤销已发布的更改

## 5. 暂存和存储

### 存储操作
```bash
git stash                    # 存储当前更改
git stash save "工作进度"     # 带消息存储
git stash list               # 查看存储列表
git stash apply              # 应用最新存储
git stash apply stash@{1}    # 应用特定存储
git stash drop               # 删除最新存储
git stash pop                # 应用并删除存储
```
**应用场景**: 临时切换分支、保存未完成工作

## 6. 差异和比较

### 查看差异
```bash
git diff                     # 工作区与暂存区差异
git diff --cached            # 暂存区与最新提交差异
git diff HEAD                # 工作区与最新提交差异
git diff abc123 def456       # 两个提交间差异
git diff main..feature       # 分支间差异
```
**应用场景**: 代码审查、了解更改内容

## 7. 标签管理

### 标签操作
```bash
git tag v1.0.0               # 创建轻量标签
git tag -a v1.0.0 -m "版本1.0" # 创建注释标签
git tag                      # 查看所有标签
git push origin v1.0.0       # 推送标签
git push origin --tags       # 推送所有标签
git tag -d v1.0.0            # 删除本地标签
```
**应用场景**: 版本发布、重要里程碑标记

## 8. 冲突解决

### 处理合并冲突
```bash
git status                   # 查看冲突文件
# 手动编辑冲突文件
git add conflicted-file.txt  # 标记冲突已解决
git commit                   # 完成合并
git merge --abort            # 中止合并
```
**应用场景**: 多人协作时解决代码冲突

## 9. 配置管理

### 用户配置
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git config --list            # 查看所有配置
git config user.name         # 查看特定配置
```
**应用场景**: 首次使用Git时的基础设置

### 别名设置
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
```
**应用场景**: 提高命令输入效率

## 10. 高级工具

### 子模块管理
```bash
git submodule add https://github.com/user/lib.git lib
git submodule init           # 初始化子模块
git submodule update         # 更新子模块
git submodule update --remote # 更新到最新版本
```
**应用场景**: 管理项目依赖、共享代码库

### 文件追踪
```bash
git blame file.txt           # 查看文件每行的作者
git log --follow file.txt    # 追踪文件历史（包括重命名）
git log -p file.txt          # 查看文件的详细更改历史
```
**应用场景**: 代码审查、问题追踪

### 清理操作
```bash
git clean -n                 # 预览要删除的文件
git clean -f                 # 删除未跟踪文件
git clean -fd                # 删除未跟踪文件和目录
git gc                       # 垃圾回收
git prune                    # 清理无用对象
```
**应用场景**: 清理工作目录、优化仓库大小

## 常用工作流示例

### 功能开发流程
```bash
# 1. 创建功能分支
git checkout -b feature-user-auth

# 2. 开发和提交
git add .
git commit -m "添加用户认证功能"

# 3. 推送分支
git push -u origin feature-user-auth

# 4. 合并到主分支
git checkout main
git pull origin main
git merge feature-user-auth
git push origin main

# 5. 清理分支
git branch -d feature-user-auth
git push origin --delete feature-user-auth
```

### 紧急修复流程
```bash
# 1. 从主分支创建热修复分支
git checkout main
git checkout -b hotfix-critical-bug

# 2. 修复并提交
git add .
git commit -m "修复关键bug"

# 3. 合并到主分支和开发分支
git checkout main
git merge hotfix-critical-bug
git checkout develop
git merge hotfix-critical-bug

# 4. 推送和清理
git push origin main
git push origin develop
git branch -d hotfix-critical-bug
```

这些命令和场景涵盖了Git的核心功能，可以满足从个人项目到大型团队协作的各种需求。
        