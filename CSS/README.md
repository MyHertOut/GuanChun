# CSS 底层原理深度解析

> 从浏览器渲染引擎到 CSSOM，全面理解 CSS 的工作机制

## 目录

1. [CSS 在浏览器中的位置](#1-css-在浏览器中的位置)
2. [CSSOM 构建过程](#2-cssom-构建过程)
3. [CSS 选择器引擎](#3-css-选择器引擎)
4. [层叠与继承机制](#4-层叠与继承机制)
5. [盒模型深入解析](#5-盒模型深入解析)
6. [视觉格式化模型](#6-视觉格式化模型)
7. [BFC 与 IFC](#7-bfc-与-ifc)
8. [层叠上下文](#8-层叠上下文)
9. [CSS 值的计算过程](#9-css-值的计算过程)
10. [CSS 性能优化](#10-css-性能优化)

---

## 1. CSS 在浏览器中的位置

### 渲染流程中的 CSS

```
网络请求 HTML/CSS
    ↓
HTML Parser → DOM Tree
CSS Parser  → CSSOM Tree
    ↓
Attachment: DOM + CSSOM → Render Tree
    ↓
Layout (Reflow) - 计算几何信息
    ↓
Paint - 转换为像素
    ↓
Composite - 合成显示
```

### 关键特性

- **渲染阻塞资源**：CSS 会阻塞渲染树的构建
- **并行下载**：CSS 文件可以并行下载（不同域名）
- **媒体查询优化**：使用 media 属性可以标记非阻塞 CSS

---

## 2. CSSOM 构建过程

### 解析流程

```
字节流 (Bytes)
  ↓ (Encoding: UTF-8)
字符流 (Characters)
  ↓ (Tokenization)
CSS 令牌 (Tokens)
  ↓ (Parsing)
CSS 对象模型 (CSSOM)
```

### CSSOM 树结构

```css
/* CSS 源代码 */
body {
  font-size: 16px;
}
div {
  margin: 10px;
}
.container {
  width: 100%;
}
```

```
CSSOM Tree:
  StyleSheetList
    └─ StyleSheet
        ├─ CSSRule: body { font-size: 16px }
        ├─ CSSRule: div { margin: 10px }
        └─ CSSRule: .container { width: 100% }
```

### 为什么 CSS 是渲染阻塞资源？

**核心原因：层叠（Cascade）特性**

CSS 的 "Cascading" 意味着后加载的样式可能覆盖之前的样式。如果浏览器提前渲染，会导致：

1. **FOUC (Flash of Unstyled Content)**：页面闪烁
2. **样式不完整**：用户看到错误的视觉效果
3. **二次重排**：后续样式加载后需要重新计算布局

因此，浏览器必须等待 CSSOM 构建完成。

---

## 3. CSS 选择器引擎

### 选择器匹配方向：从右到左 ⚡

**为什么？性能优化！**

```css
/* 示例 */
div .container p span {
  color: red;
}
```

#### ❌ 如果从左到右匹配：

1. 找到所有 `<div>` (可能很多)
2. 在每个 div 下找 `.container` (浪费时间)
3. 在每个 .container 下找 `<p>` (继续遍历)
4. 在每个 p 下找 `<span>` (大量无用遍历)

**问题**：需要遍历很多无关的 DOM 节点！

#### ✅ 从右到左匹配：

1. 找到所有 `<span>` (候选集合)
2. 检查父元素是否是 `<p>` (不是就排除)
3. 检查祖先是否有 `.container` (不是就排除)
4. 检查祖先是否有 `<div>` (不是就排除)

**优势**：快速排除不匹配的节点，减少遍历！

### 选择器性能排序（快 → 慢）

1. **ID 选择器** `#id` - O(1)
2. **类选择器** `.class` - O(n)
3. **标签选择器** `div` - O(n)
4. **后代选择器** `div p` - O(n²)
5. **通配符** `*` - O(n)

### 性能优化建议

```css
/* ❌ 避免：性能差 */
* {
  margin: 0;
}
div > div > div > span {
  color: red;
}

/* ✅ 推荐：使用类选择器 */
.reset {
  margin: 0;
}
.highlight {
  color: red;
}
```

---

## 4. 层叠与继承机制

### 层叠（Cascade）优先级计算

CSS 规则的优先级由以下因素决定（从高到低）：

```
1. !important 标记
2. 来源（Origin）
   - Transition (过渡动画)
   - User Agent !important (浏览器默认样式 + !important)
   - User !important (用户样式表 + !important)
   - Author !important (开发者样式 + !important)
   - Animation (CSS 动画)
   - Author (开发者样式)
   - User (用户样式表)
   - User Agent (浏览器默认样式)
3. 特异性（Specificity）
4. 出现顺序（Order）
```

### 特异性（Specificity）计算

**计算公式：(a, b, c, d)**

- `a`: 内联样式（1 或 0）
- `b`: ID 选择器数量
- `c`: 类选择器、属性选择器、伪类数量
- `d`: 标签选择器、伪元素数量

```css
/* 示例 */
#nav .list li:hover        /* (0, 1, 2, 1) */
div#sidebar ul li a        /* (0, 1, 0, 4) */
.container .item           /* (0, 0, 2, 0) */
div p                      /* (0, 0, 0, 2) */
```

**比较规则**：从左到右逐位比较

```
(0, 1, 2, 1) > (0, 1, 0, 4)  // ID 相同，类选择器 2 > 0
(0, 0, 2, 0) > (0, 0, 0, 2)  // 类选择器 2 > 0
```

### 继承（Inheritance）

**可继承属性**（主要是文本相关）：

- `color`, `font-*`, `line-height`, `text-*`
- `visibility`, `cursor`, `letter-spacing`

**不可继承属性**（主要是布局相关）：

- `width`, `height`, `margin`, `padding`, `border`
- `display`, `position`, `float`
- `background`, `overflow`

**强制继承**：

```css
.child {
  border: inherit; /* 强制继承父元素的 border */
}
```

---

## 5. 盒模型深入解析

### 标准盒模型 vs IE 盒模型

```
标准盒模型 (content-box):
  总宽度 = width + padding + border

IE 盒模型 (border-box):
  总宽度 = width (包含 padding 和 border)
```

**示例**：

```css
.box {
  width: 200px;
  padding: 20px;
  border: 5px solid;
}

/* content-box（默认） */
实际占用宽度 = 200 + 20*2 + 5*2 = 250px

/* border-box */
实际占用宽度 = 200px (padding和border包含在内)
内容区宽度 = 200 - 20*2 - 5*2 = 150px
```

### 推荐做法：全局使用 border-box

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

### 外边距折叠（Margin Collapse）

**发生条件**：

1. 垂直方向（上下 margin）
2. 非 BFC 容器内
3. 块级元素

**折叠规则**：

```css
/* 相邻兄弟元素 */
.a {
  margin-bottom: 20px;
}
.b {
  margin-top: 30px;
}
/* 实际间距：max(20px, 30px) = 30px */

/* 父子元素（无边界分隔） */
.parent {
  margin-top: 20px;
}
.child {
  margin-top: 30px;
}
/* 父元素实际 margin-top: 30px */
```

**阻止折叠的方法**：

- 创建 BFC
- 添加 border/padding
- 使用 inline-block
- 使用 flexbox/grid

---

## 6. 视觉格式化模型（Visual Formatting Model）

### 定位方案（Positioning Schemes）

#### 1. 正常流（Normal Flow）

- **块级盒子**：垂直排列，独占一行
- **行内盒子**：水平排列，直到换行

#### 2. 浮动（Float）

```css
.float-left {
  float: left;
  /* 元素脱离正常流，但仍占据原本的位置影响周围元素 */
}
```

**浮动特性**：

- 脱离文档流（部分）
- 形成 BFC
- 高度塌陷问题（父元素无法感知浮动子元素高度）

**清除浮动**：

```css
/* 方法1：clearfix */
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

/* 方法2：创建 BFC */
.parent {
  overflow: hidden; /* 或 auto */
}
```

#### 3. 绝对定位（Absolute Positioning）

```css
.absolute {
  position: absolute;
  top: 0;
  left: 0;
  /* 完全脱离文档流，相对于最近的已定位祖先元素 */
}

.fixed {
  position: fixed;
  /* 相对于视口定位 */
}
```

---

## 7. BFC 与 IFC

### BFC (Block Formatting Context) - 块级格式化上下文

**什么是 BFC？**
BFC 是一个独立的渲染区域，内部元素的布局不会影响外部，外部也不会影响内部。

**触发 BFC 的条件**：

1. `float` 不为 `none`
2. `position` 为 `absolute` 或 `fixed`
3. `display` 为 `inline-block`, `table-cell`, `flex`, `grid`
4. `overflow` 不为 `visible`

**BFC 的特性**：

1. ✅ 阻止外边距折叠
2. ✅ 包含浮动元素（解决高度塌陷）
3. ✅ 阻止元素被浮动元素覆盖

**实际应用**：

```css
/* 问题：高度塌陷 */
.container {
  /* 子元素浮动，父元素高度为 0 */
}

/* 解决：创建 BFC */
.container {
  overflow: hidden; /* 创建 BFC，包含浮动子元素 */
}
```

### IFC (Inline Formatting Context) - 行内格式化上下文

**特性**：

- 盒子水平排列
- `vertical-align` 控制垂直对齐
- `line-height` 决定行高

```css
.inline-box {
  display: inline-block;
  vertical-align: middle; /* 只在 IFC 中有效 */
}
```

---

## 8. 层叠上下文（Stacking Context）

### 什么是层叠上下文？

层叠上下文是 HTML 元素的三维概念，决定了元素在 z 轴上的显示顺序。

### 创建层叠上下文的条件：

1. 根元素 `<html>`
2. `position: relative/absolute` + `z-index` 不为 auto
3. `position: fixed/sticky`
4. `opacity` < 1
5. `transform` 不为 none
6. `filter` 不为 none
7. `will-change`
8. `isolation: isolate`

### 层叠顺序（从低到高）：

```
1. 层叠上下文的 background/border
2. z-index < 0 的子层叠上下文
3. 块级盒子
4. 浮动盒子
5. 行内盒子
6. z-index: 0 / auto
7. z-index > 0 的子层叠上下文
```

### 注意事项：

```css
/* ⚠️ transform 会创建层叠上下文 */
.parent {
  position: relative;
  transform: translateZ(0); /* 创建层叠上下文！ */
}

.child {
  position: absolute;
  z-index: 9999; /* 只在父元素的层叠上下文内有效 */
}
```

---

## 9. CSS 值的计算过程

### 值的处理阶段

```
Declared Value (声明值)
  ↓
Cascaded Value (层叠值) - 应用层叠规则
  ↓
Specified Value (指定值) - 应用继承或初始值
  ↓
Computed Value (计算值) - 相对值转绝对值
  ↓
Used Value (使用值) - 最终计算结果
  ↓
Actual Value (实际值) - 浏览器实际渲染
```

### 示例：

```css
.container {
  font-size: 16px;
}

.child {
  font-size: 2em; /* Declared */
}
```

**计算过程**：

1. **Declared**: `2em`
2. **Cascaded**: `2em` (层叠后保持)
3. **Specified**: `2em` (无继承)
4. **Computed**: `2em` (相对值)
5. **Used**: `32px` (2 × 16px)
6. **Actual**: `32px` (实际渲染)

### 相对单位的计算：

- `em` - 相对于父元素的 font-size
- `rem` - 相对于根元素的 font-size
- `%` - 相对于父元素对应属性
- `vh/vw` - 相对于视口
- `vmin/vmax` - 视口较小/较大尺寸

---

## 10. CSS 性能优化

### 1. 选择器优化

```css
/* ❌ 避免 */
.container div ul li a {
} /* 过深的后代选择器 */
* {
} /* 通配符 */

/* ✅ 推荐 */
.nav-link {
} /* 直接使用类 */
```

### 2. 减少重排（Reflow）

```css
/* ❌ 触发大量 reflow */
.box {
  width: 100px; /* Reflow */
  height: 100px; /* Reflow */
  margin: 10px; /* Reflow */
}

/* ✅ 使用 transform（只触发 composite） */
.box {
  transform: scale(1.5);
}
```

### 3. 使用 CSS Containment

```css
.card {
  contain: layout style paint;
  /* 告诉浏览器该元素的变化不会影响外部 */
}
```

### 4. 使用 content-visibility

```css
.list-item {
  content-visibility: auto;
  /* 跳过屏幕外元素的渲染 */
}
```

### 5. will-change 提示

```css
.animated {
  will-change: transform, opacity;
  /* 提前创建图层，但不要滥用 */
}
```

---

## 总结

CSS 的底层原理涉及：

1. **CSSOM 构建** - 理解 CSS 如何被解析
2. **选择器引擎** - 从右到左的匹配机制
3. **层叠与继承** - 样式覆盖和传递规则
4. **盒模型** - 元素尺寸的计算方式
5. **格式化上下文** - BFC/IFC 的工作原理
6. **层叠上下文** - z-index 的真正含义
7. **值计算** - CSS 值如何被处理
8. **性能优化** - 如何写出高效的 CSS

理解这些底层机制，能帮助你：

- ✅ 写出更高效的 CSS
- ✅ 快速定位和解决 CSS 问题
- ✅ 理解现代 CSS 架构（如 BEM、CSS-in-JS）
- ✅ 优化页面渲染性能
