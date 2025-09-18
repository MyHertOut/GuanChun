/**
 * Soul.io 风格粒子效果实现
 * 使用 Three.js 创建动态粒子系统
 * 
 * @author GuanChun
 * @version 1.0.0
 */

class ParticleSystem {
    /**
     * 粒子系统构造函数
     * 初始化 Three.js 场景、相机、渲染器等基础组件
     */
    constructor() {
        // 场景基础配置
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.particleGeometry = null;
        this.particleMaterial = null;
        
        // 粒子系统参数
        this.particleCount = this.getOptimalParticleCount();
        this.particlePositions = null;
        this.particleVelocities = null;
        this.particleColors = null;
        
        // 鼠标交互
        this.mouse = { x: 0, y: 0 };
        this.mouseInfluence = 0.1;
        
        // 动画参数
        this.time = 0;
        this.animationId = null;
        
        this.init();
    }

    /**
     * 获取最优粒子数量
     * 根据设备性能调整粒子数量
     * 
     * @returns {number} 最优粒子数量
     */
    getOptimalParticleCount() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowEnd = navigator.hardwareConcurrency <= 4;
        
        if (isMobile) return 800;
        if (isLowEnd) return 1200;
        return 2000;
    }

    /**
     * 初始化粒子系统
     * 设置场景、相机、渲染器和粒子
     */
    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }

    /**
     * 设置 Three.js 场景
     * 创建基础场景并配置背景
     */
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        
        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // 添加点光源
        const pointLight = new THREE.PointLight(0x64ffda, 1, 100);
        pointLight.position.set(0, 0, 10);
        this.scene.add(pointLight);
    }

    /**
     * 设置相机
     * 配置透视相机的位置和参数
     */
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75, // 视野角度
            window.innerWidth / window.innerHeight, // 宽高比
            0.1, // 近裁剪面
            1000 // 远裁剪面
        );
        this.camera.position.z = 30;
    }

    /**
     * 设置渲染器
     * 配置 WebGL 渲染器的参数和样式
     */
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // 将渲染器添加到容器
        const container = document.getElementById('particle-container');
        container.appendChild(this.renderer.domElement);
    }

    /**
     * 创建粒子系统
     * 生成粒子几何体、材质和位置数据
     */
    createParticles() {
        this.particleGeometry = new THREE.BufferGeometry();
        
        // 初始化粒子位置、速度和颜色数组
        this.particlePositions = new Float32Array(this.particleCount * 3);
        this.particleVelocities = new Float32Array(this.particleCount * 3);
        this.particleColors = new Float32Array(this.particleCount * 3);
        this.particleSizes = new Float32Array(this.particleCount);
        
        // 为每个粒子设置随机位置、速度和颜色
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // 随机位置 (-50 到 50 的范围)
            this.particlePositions[i3] = (Math.random() - 0.5) * 100;
            this.particlePositions[i3 + 1] = (Math.random() - 0.5) * 100;
            this.particlePositions[i3 + 2] = (Math.random() - 0.5) * 50;
            
            // 随机速度
            this.particleVelocities[i3] = (Math.random() - 0.5) * 0.02;
            this.particleVelocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
            this.particleVelocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
            
            // 渐变颜色 (青色到蓝色)
            const colorVariation = Math.random();
            this.particleColors[i3] = 0.2 + colorVariation * 0.4; // R
            this.particleColors[i3 + 1] = 0.8 + colorVariation * 0.2; // G
            this.particleColors[i3 + 2] = 1.0; // B
            
            // 随机大小
            this.particleSizes[i] = Math.random() * 3 + 1;
        }
        
        // 设置几何体属性
        this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
        this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(this.particleColors, 3));
        this.particleGeometry.setAttribute('size', new THREE.BufferAttribute(this.particleSizes, 1));
        
        // 创建粒子材质
        this.particleMaterial = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        // 创建粒子系统
        this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);
        this.scene.add(this.particles);
        
        // 创建连线系统
        this.createConnections();
    }

    /**
     * 创建粒子间的连线效果
     * 当粒子距离较近时显示连线
     */
    createConnections() {
        this.connectionGeometry = new THREE.BufferGeometry();
        this.connectionMaterial = new THREE.LineBasicMaterial({
            color: 0x64ffda,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        this.connections = new THREE.LineSegments(this.connectionGeometry, this.connectionMaterial);
        this.scene.add(this.connections);
    }

    /**
     * 设置事件监听器
     * 监听鼠标移动和窗口大小变化事件
     */
    setupEventListeners() {
        // 鼠标移动事件
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // 窗口大小变化事件
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    /**
     * 处理窗口大小变化
     * 更新相机和渲染器的尺寸
     */
    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * 更新粒子位置和动画
     * 实现粒子的自然运动和鼠标交互效果
     * 
     * @param {number} deltaTime - 时间增量
     */
    updateParticles(deltaTime) {
        const positions = this.particleGeometry.attributes.position.array;
        const colors = this.particleGeometry.attributes.color.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // 获取当前粒子位置
            let x = positions[i3];
            let y = positions[i3 + 1];
            let z = positions[i3 + 2];
            
            // 基础运动
            x += this.particleVelocities[i3];
            y += this.particleVelocities[i3 + 1];
            z += this.particleVelocities[i3 + 2];
            
            // 添加复杂的波浪运动
            const waveX = Math.sin(this.time * 0.001 + i * 0.01) * 0.8;
            const waveY = Math.cos(this.time * 0.0008 + i * 0.015) * 0.6;
            const waveZ = Math.sin(this.time * 0.0012 + i * 0.008) * 0.4;
            x += waveX;
            y += waveY;
            z += waveZ;
            
            // 鼠标交互效果 - 增强版
            const mouseX = this.mouse.x * 50;
            const mouseY = this.mouse.y * 50;
            const distanceToMouse = Math.sqrt(
                Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2)
            );
            
            if (distanceToMouse < 20) {
                const force = (20 - distanceToMouse) / 20;
                const angle = Math.atan2(y - mouseY, x - mouseX);
                x += Math.cos(angle) * force * this.mouseInfluence * 2;
                y += Math.sin(angle) * force * this.mouseInfluence * 2;
            }
            
            // 边界检测和重置
            if (x > 50) x = -50;
            if (x < -50) x = 50;
            if (y > 50) y = -50;
            if (y < -50) y = 50;
            if (z > 25) z = -25;
            if (z < -25) z = 25;
            
            // 更新位置
            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;
            
            // 动态颜色变化 - 更丰富的颜色
            const colorIntensity = 0.6 + Math.sin(this.time * 0.003 + i * 0.1) * 0.4;
            const hueShift = Math.sin(this.time * 0.001 + i * 0.05) * 0.3;
            colors[i3] = (0.2 + hueShift) * colorIntensity; // R
            colors[i3 + 1] = (0.8 + hueShift * 0.2) * colorIntensity; // G
            colors[i3 + 2] = 1.0 * colorIntensity; // B
        }
        
        // 更新连线
        this.updateConnections();
        
        // 标记属性需要更新
        this.particleGeometry.attributes.position.needsUpdate = true;
        this.particleGeometry.attributes.color.needsUpdate = true;
    }

    /**
     * 更新粒子间的连线
     * 根据粒子距离动态创建和更新连线
     */
    updateConnections() {
        const positions = this.particleGeometry.attributes.position.array;
        const connectionPositions = [];
        const maxDistance = 15; // 最大连线距离
        
        // 检查每对粒子之间的距离
        for (let i = 0; i < this.particleCount; i++) {
            for (let j = i + 1; j < this.particleCount; j++) {
                const i3 = i * 3;
                const j3 = j * 3;
                
                const dx = positions[i3] - positions[j3];
                const dy = positions[i3 + 1] - positions[j3 + 1];
                const dz = positions[i3 + 2] - positions[j3 + 2];
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                // 如果距离小于阈值，创建连线
                if (distance < maxDistance) {
                    connectionPositions.push(
                        positions[i3], positions[i3 + 1], positions[i3 + 2],
                        positions[j3], positions[j3 + 1], positions[j3 + 2]
                    );
                }
            }
        }
        
        // 更新连线几何体
        this.connectionGeometry.setAttribute(
            'position', 
            new THREE.Float32BufferAttribute(connectionPositions, 3)
        );
        this.connectionGeometry.attributes.position.needsUpdate = true;
    }

    /**
     * 动画循环函数
     * 持续更新和渲染场景
     */
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const currentTime = performance.now();
        const deltaTime = currentTime - (this.lastTime || currentTime);
        this.lastTime = currentTime;
        this.time += deltaTime;
        
        // 更新粒子
        this.updateParticles(deltaTime);
        
        // 相机轻微旋转 - 更自然的运动
        this.camera.position.x = Math.sin(this.time * 0.0003) * 8 + this.mouse.x * 2;
        this.camera.position.y = Math.cos(this.time * 0.0002) * 5 + this.mouse.y * 2;
        this.camera.position.z = 30 + Math.sin(this.time * 0.0001) * 5;
        this.camera.lookAt(0, 0, 0);
        
        // 动态调整粒子材质
        this.particleMaterial.opacity = 0.7 + Math.sin(this.time * 0.001) * 0.2;
        
        // 渲染场景
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * 销毁粒子系统
     * 清理资源和停止动画
     */
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.particleGeometry) {
            this.particleGeometry.dispose();
        }
        
        if (this.particleMaterial) {
            this.particleMaterial.dispose();
        }
    }
}

/**
 * 页面加载完成后初始化粒子系统
 */
document.addEventListener('DOMContentLoaded', () => {
    // 创建粒子系统实例
    const particleSystem = new ParticleSystem();
    
    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
        particleSystem.destroy();
    });
    
    console.log('Soul.io 风格粒子效果已启动');
});