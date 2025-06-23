# Vue.js 3.0 核心源码学习基础提示词

## 概述
本文档作为Vue.js 3.0源码学习的基础参考，包含各个核心模块的关键知识点和学习要点。在学习具体模块时，可以引用此文档快速获取相关背景知识。

## 核心架构

### 1. 响应式系统 (Reactivity)
**核心概念：**
- Proxy-based响应式系统替代Vue 2的Object.defineProperty
- ref、reactive、computed、watch等API
- 依赖收集与触发更新机制
- effect函数和响应式副作用

**关键文件：**
- `packages/reactivity/src/reactive.ts`
- `packages/reactivity/src/ref.ts`
- `packages/reactivity/src/effect.ts`
- `packages/reactivity/src/computed.ts`

**学习要点：**
- Proxy与Reflect的使用
- 依赖收集的实现原理
- 响应式数据的嵌套处理
- 性能优化策略

### 2. 编译器 (Compiler)
**核心概念：**
- 模板编译为渲染函数
- AST抽象语法树的生成与转换
- 代码生成阶段
- 编译时优化（静态提升、补丁标记等）

**关键文件：**
- `packages/compiler-core/src/parse.ts`
- `packages/compiler-core/src/transform.ts`
- `packages/compiler-core/src/codegen.ts`
- `packages/compiler-dom/src/index.ts`

**学习要点：**
- 词法分析与语法分析
- AST节点类型与转换
- 编译时优化技术
- 指令与插槽的处理

### 3. 运行时核心 (Runtime Core)
**核心概念：**
- 虚拟DOM与diff算法
- 组件系统
- 生命周期管理
- 渲染器实现

**关键文件：**
- `packages/runtime-core/src/renderer.ts`
- `packages/runtime-core/src/component.ts`
- `packages/runtime-core/src/vnode.ts`
- `packages/runtime-core/src/scheduler.ts`

**学习要点：**
- 虚拟DOM的创建与更新
- 组件实例的创建与管理
- 异步更新队列
- 内存管理与性能优化

### 4. 运行时DOM (Runtime DOM)
**核心概念：**
- DOM操作的封装
- 事件处理系统
- 属性与样式处理
- 平台特定的渲染逻辑

**关键文件：**
- `packages/runtime-dom/src/index.ts`
- `packages/runtime-dom/src/patchProp.ts`
- `packages/runtime-dom/src/modules/`

**学习要点：**
- DOM节点操作API
- 事件委托与处理
- 属性更新策略
- 跨平台抽象

## 重要设计模式

### 1. 组合式API设计
- setup函数的执行时机
- 响应式引用的创建与使用
- 生命周期钩子的实现
- 依赖注入系统

### 2. 插件系统
- app.use()的实现机制
- 插件的注册与执行
- 全局属性与方法的添加

### 3. 指令系统
- 内置指令的实现
- 自定义指令的生命周期
- 指令的编译与运行时处理

## 性能优化技术

### 1. 编译时优化
- 静态提升 (Static Hoisting)
- 补丁标记 (Patch Flags)
- 块级优化 (Block Tree)
- 死代码消除

### 2. 运行时优化
- 异步组件与代码分割
- keep-alive缓存机制
- 虚拟滚动
- 内存泄漏防护

## 调试与开发工具

### 1. 开发模式特性
- 警告信息系统
- 开发工具集成
- HMR热更新支持

### 2. 源码映射
- TypeScript类型定义
- 源码结构导航
- 调试断点设置

## 学习路径建议

### 初级阶段
1. 理解响应式系统基础
2. 掌握组件生命周期
3. 熟悉模板编译过程

### 中级阶段
1. 深入虚拟DOM与diff算法
2. 理解编译时优化
3. 掌握异步更新机制

### 高级阶段
1. 自定义渲染器开发
2. 插件与指令开发
3. 性能调优与监控

## 常用调试技巧

### 1. 源码阅读
- 使用IDE的跳转功能
- 设置条件断点
- 观察调用栈

### 2. 实验验证
- 创建最小复现示例
- 对比不同版本行为
- 性能基准测试

---

**使用说明：**
在学习特定模块时，可以引用此文档的相关章节，快速回顾核心概念和关键文件位置。建议结合实际代码阅读和实验来加深理解。

**更新日期：** 2024年
**适用版本：** Vue.js 3.0+