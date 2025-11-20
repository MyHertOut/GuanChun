# HTML 深度进阶学习指南

这份指南旨在帮助前端工程师从“会用”到“精通”，深入理解 HTML 的设计哲学、渲染机制和最佳实践。

## 模块 1：哲学与历史 (标准的“为什么”)

理解 HTML 的演变有助于我们理解浏览器的怪异行为和标准的重要性。

### 1.1 演变之路

- **SGML -> HTML**: HTML 最初是 SGML 的一个应用，非常灵活但也容易出错。
- **XHTML 的尝试**: 试图用 XML 的严格语法约束 HTML，但因过于严格而在 Web 上失败。
- **HTML5 的诞生**: 务实主义的胜利。它不再基于 SGML，而是定义了自己的解析规则，关注向后兼容。

### 1.2 标准之争：W3C vs WHATWG

- **W3C**: 倾向于版本化的标准（如 HTML 4.01, XHTML 1.0）。
- **WHATWG**: 提出了 **HTML Living Standard**（活的标准），意味着 HTML 是不断更新的，没有“最终版”。
- **现状**: 现在 W3C 和 WHATWG 已经统一，以 Living Standard 为准。

### 1.3 关键概念

- **Doctype**: `<!DOCTYPE html>` 告诉浏览器使用标准模式（Standard Mode）渲染，而不是怪异模式（Quirks Mode）。
- **Quirks Mode**: 为了兼容旧网页，浏览器会模拟旧浏览器的非标准行为（如盒模型计算不同）。

---

## 模块 2：浏览器与 DOM (渲染的“为什么”)

理解浏览器如何处理 HTML 是性能优化的基础。

### 2.1 解析流程

1.  **字节流 -> 字符**: 浏览器读取 HTML 文件的原始字节，根据编码（如 UTF-8）转换为字符。
2.  **令牌化 (Tokenization)**: 将字符串转换为 W3C 标准规定的令牌（如 `<html>`, `<body>`）。
3.  **树构建 (Tree Construction)**: 将令牌转换为 DOM 树。即使 HTML 语法有错误（如缺少闭合标签），浏览器也会尝试自动纠正（这也是 HTML 强大的容错性）。

### 2.2 关键渲染路径 (Critical Rendering Path)

1.  **DOM**: HTML 解析生成 DOM 树。
2.  **CSSOM**: CSS 解析生成 CSSOM 树。
3.  **Render Tree**: DOM + CSSOM 合并生成渲染树（不可见元素如 `<head>` 或 `display: none` 不在其中）。
4.  **Layout (Reflow)**: 计算每个节点在屏幕上的确切位置和大小。
5.  **Paint**: 绘制像素。
6.  **Composite**: 将图层合成。

### 2.3 脚本加载策略

- **`<script>`**: 立即下载并执行，阻塞 HTML 解析。
- **`<script defer>`**: **推荐**。并行下载，在 HTML 解析完成后、`DOMContentLoaded` 事件前执行。顺序有保证。
- **`<script async>`**: 并行下载，下载完立即执行，可能阻塞 HTML 解析。执行顺序不保证。

---

## 模块 3：语义化与无障碍性 (结构的“为什么”)

语义化不仅仅是为了代码可读性，更是为了机器可读性。

### 3.1 语义化标签 vs `<div>`

- **`<article>`**: 独立的内容块，可独立分发（如博客文章）。
- **`<section>`**: 文档的通用章节，通常有标题。
- **`<nav>`**: 导航链接部分。
- **`<aside>`**: 与周围内容间接相关的内容（侧边栏）。
- **价值**: 帮助搜索引擎理解页面结构（SEO），帮助屏幕阅读器导航（A11y）。

### 3.2 无障碍树 (Accessibility Tree)

浏览器会根据 DOM 树构建无障碍树，供辅助技术（如 NVDA, VoiceOver）使用。

- **ARIA (Accessible Rich Internet Applications)**: 当原生 HTML 无法满足需求时使用。
- **原则**: **No ARIA is better than bad ARIA**。尽量使用原生语义标签（如用 `<button>` 而不是 `<div onclick>`）。

---

## 模块 4：表单与交互 (原生控件的“为什么”)

原生表单控件提供了大量内置功能，减少了对 JavaScript 的依赖。

### 4.1 约束验证 API (Constraint Validation API)

- 使用 `required`, `pattern`, `min`, `max`, `type="email"` 等属性。
- CSS 伪类: `:valid`, `:invalid`, `:placeholder-shown`。
- JS 方法: `element.checkValidity()`, `element.setCustomValidity()`.

### 4.2 移动端体验

- **`input type`**: 决定了移动端弹出的虚拟键盘类型（如 `type="tel"` 弹出数字键盘，`type="email"` 包含 `@`）。
- **`enterkeyhint`**: 定制回车键的行为（如 "go", "done", "search"）。

---

## 模块 5：高级内容与 API

HTML5 不仅仅是标签，更是一套强大的 Web 应用平台。

### 5.1 多媒体

- **`<video>` / `<audio>`**: 原生播放支持。
- **`<track>`**: 字幕和标题支持，对无障碍性至关重要。

### 5.2 图形

- **`<canvas>`**: 位图（Raster），适合高性能游戏、像素处理。依赖 JS 绘制。
- **`<svg>`**: 矢量图（Vector），适合图标、图表。是 DOM 的一部分，可用 CSS 样式化。

### 5.3 Web Components

原生组件化标准，不依赖框架。

- **Custom Elements**: 定义新标签（如 `<my-card>`）。
- **Shadow DOM**: 样式隔离，避免全局 CSS 污染。
- **HTML Templates**: `<template>` 和 `<slot>`，用于定义结构。

---

## 模块 6：性能与 SEO

HTML 是性能优化的第一道关卡。

### 6.1 资源提示 (Resource Hints)

- **`preload`**: 告诉浏览器“这个资源稍后必须用到，现在就加载”。
- **`prefetch`**: “下个页面可能用到，空闲时加载”。
- **`preconnect`**: 提前进行 DNS 查找和 TCP 握手。

### 6.2 图片优化

- **`loading="lazy"`**: 原生懒加载。
- **`srcset` & `sizes`**: 响应式图片，根据屏幕宽度加载不同分辨率的图片。
- **`<picture>`**: 艺术指导（Art Direction），不同屏幕显示不同裁剪的图片。

### 6.3 元数据 (Metadata)

- **Open Graph (OG)**: 控制链接在社交媒体（Facebook, Twitter, 微信等）分享时的预览卡片。
- **JSON-LD**: 结构化数据，帮助 Google 理解内容（如产品价格、评分、活动时间），在搜索结果中展示富片段。
