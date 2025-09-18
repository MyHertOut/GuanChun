# Soul.io 风格粒子效果

这是一个使用 Three.js 实现的类似 Soul.io 网站的动态粒子效果项目。

## 功能特性

- ✨ 动态粒子系统，包含 800-2000 个粒子
- 🎨 渐变色彩效果，青色到蓝色的过渡
- 🖱️ 鼠标交互，粒子会响应鼠标移动
- 🔗 动态连线效果，近距离粒子间会显示连线
- 📱 响应式设计，适配不同设备
- ⚡ 性能优化，根据设备性能调整粒子数量

## 技术栈

- Three.js - 3D 图形库
- HTML5 Canvas - 渲染载体
- CSS3 - 样式和动画
- JavaScript ES6+ - 核心逻辑

## 快速开始

1. 安装依赖：
```bash
pnpm install
```

2. 启动开发服务器：
```bash
pnpm run dev
```

3. 在浏览器中访问 `http://localhost:3000`

## 项目结构

```
treejs/
├── index.html          # 主页面
├── style.css           # 样式文件
├── particles.js        # 粒子效果核心代码
├── package.json        # 项目配置
└── README.md          # 项目说明
```

## 自定义配置

你可以在 `particles.js` 中调整以下参数：

- `particleCount`: 粒子数量
- `mouseInfluence`: 鼠标影响强度
- `maxDistance`: 连线最大距离
- 颜色、速度、大小等参数

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

支持 WebGL 的现代浏览器均可正常运行。