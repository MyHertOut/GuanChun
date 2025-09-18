/**
 * 螺旋粒子效果系统
 * 实现类似图片中的环形/螺旋粒子动画
 * 
 * @author GuanChun
 * @version 1.0.0
 */

class SpiralParticleSystem {
    /**
     * 螺旋粒子系统构造函数
     * 初始化 Three.js 场景和粒子系统
     */
    constructor() {
        // 基础组件
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        // 粒子系统
        this.particleCount = 5000;
        this.particles = null;
        this.particleGeometry = null;
        this.particleMaterial = null;
        
        // 中心发光球
        this.centerSphere = null;
        
        // 动画参数
        this.time = 0;
        this.rotationSpeed = 1;
        this.spiralDensity = 3;
        
        // 鼠标交互
        this.mouse = { x: 0, y: 0 };
        this.raycaster = new THREE.Raycaster();
        
        this.init();
    }

    /**
     * 初始化系统
     * 设置场景、相机、渲染器和粒子
     */
    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.createSpiralParticles();
        this.createCenterSphere();
        this.setupControls();
        this.setupEventListeners();
        this.animate();
    }

    /**
     * 设置 Three.js 场景
     * 创建深空背景和光照
     */
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
        this.scene.add(ambientLight);
        
        // 添加点光源（中心发光）
        this.centerLight = new THREE.PointLight(0xff6600, 2, 100);
        this.centerLight.position.set(0, 0, 0);
        this.scene.add(this.centerLight);
    }

    /**
     * 设置相机
     * 配置透视相机的位置和参数
     */
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 50);
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * 设置渲染器
     * 配置 WebGL 渲染器
     */
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        const container = document.getElementById('canvas-container');
        container.appendChild(this.renderer.domElement);
    }

    /**
     * 创建螺旋粒子系统
     * 生成环形/螺旋分布的粒子，模拟图片中的效果
     */
    createSpiralParticles() {
        this.particleGeometry = new THREE.BufferGeometry();
        
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const phases = new Float32Array(this.particleCount);
        const spiralTypes = new Float32Array(this.particleCount); // 不同螺旋臂
        
        // 创建多个螺旋臂
        const spiralArms = 3;
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // 确定属于哪个螺旋臂
            const armIndex = i % spiralArms;
            spiralTypes[i] = armIndex;
            
            // 螺旋参数
            const progress = (i / this.particleCount);
            const armOffset = (armIndex / spiralArms) * Math.PI * 2;
            const t = progress * Math.PI * 2 * this.spiralDensity + armOffset;
            
            // 创建不均匀分布 - 模拟图片中的聚集效果
            let radius;
            if (progress < 0.2) {
                // 内圈密集
                radius = 3 + progress * 8;
            } else if (progress < 0.6) {
                // 中圈稀疏
                radius = 11 + (progress - 0.2) * 15;
            } else {
                // 外圈又密集
                radius = 26 + (progress - 0.6) * 10;
            }
            
            // 添加随机扰动和聚集效果
            const clusterNoise = Math.random() < 0.7 ? 1 : 0.3; // 70% 粒子聚集
            const noise = (Math.random() - 0.5) * 3 * clusterNoise;
            const finalRadius = radius + noise;
            
            // 计算位置
            const x = Math.cos(t) * finalRadius;
            const y = Math.sin(t) * finalRadius;
            const z = Math.sin(t * 2) * 2 + (Math.random() - 0.5) * 5;
            
            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;
            
            // 设置颜色 - 更真实的渐变
            const distanceFromCenter = Math.sqrt(x * x + y * y);
            const normalizedDistance = Math.min(distanceFromCenter / 35, 1);
            
            if (normalizedDistance < 0.15) {
                // 核心区域 - 亮橙色
                colors[i3] = 1.0;     // R
                colors[i3 + 1] = 0.4; // G
                colors[i3 + 2] = 0.0; // B
            } else if (normalizedDistance < 0.4) {
                // 内圈 - 橙黄色
                colors[i3] = 1.0;     // R
                colors[i3 + 1] = 0.7; // G
                colors[i3 + 2] = 0.3; // B
            } else if (normalizedDistance < 0.7) {
                // 中圈 - 白色
                colors[i3] = 0.9;     // R
                colors[i3 + 1] = 0.9; // G
                colors[i3 + 2] = 1.0; // B
            } else {
                // 外圈 - 蓝白色
                colors[i3] = 0.6;     // R
                colors[i3 + 1] = 0.8; // G
                colors[i3 + 2] = 1.0; // B
            }
            
            // 设置大小 - 中心更大
            const sizeMultiplier = normalizedDistance < 0.2 ? 2 : 1;
            sizes[i] = (Math.random() * 2 + 1) * sizeMultiplier;
            
            // 设置相位（用于动画）
            phases[i] = Math.random() * Math.PI * 2;
        }
        
        this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // 存储原始数据用于动画
        this.originalPositions = positions.slice();
        this.phases = phases;
        this.spiralTypes = spiralTypes;
        
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
    }

    /**
     * 创建中心发光球
     * 实现图片中的橙色发光核心
     */
    createCenterSphere() {
        const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0.9
        });
        
        this.centerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(this.centerSphere);
        
        // 添加发光效果
        const glowGeometry = new THREE.SphereGeometry(3, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        this.glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(this.glowSphere);
    }

    /**
     * 设置控制面板
     * 允许实时调整粒子效果参数
     */
    setupControls() {
        const particleCountSlider = document.getElementById('particle-count');
        const particleCountValue = document.getElementById('particle-count-value');
        const rotationSpeedSlider = document.getElementById('rotation-speed');
        const rotationSpeedValue = document.getElementById('rotation-speed-value');
        const spiralDensitySlider = document.getElementById('spiral-density');
        const spiralDensityValue = document.getElementById('spiral-density-value');
        
        particleCountSlider.addEventListener('input', (e) => {
            this.particleCount = parseInt(e.target.value);
            particleCountValue.textContent = this.particleCount;
            this.recreateParticles();
        });
        
        rotationSpeedSlider.addEventListener('input', (e) => {
            this.rotationSpeed = parseFloat(e.target.value);
            rotationSpeedValue.textContent = this.rotationSpeed;
        });
        
        spiralDensitySlider.addEventListener('input', (e) => {
            this.spiralDensity = parseFloat(e.target.value);
            spiralDensityValue.textContent = this.spiralDensity;
            this.recreateParticles();
        });
    }

    /**
     * 重新创建粒子系统
     * 当参数改变时重新生成粒子
     */
    recreateParticles() {
        if (this.particles) {
            this.scene.remove(this.particles);
            this.particleGeometry.dispose();
            this.particleMaterial.dispose();
        }
        this.createSpiralParticles();
    }

    /**
     * 设置事件监听器
     * 监听鼠标移动和窗口大小变化
     */
    setupEventListeners() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    /**
     * 更新粒子动画
     * 实现螺旋旋转和动态效果，模拟图片中的流动感
     */
    updateParticles() {
        const positions = this.particleGeometry.attributes.position.array;
        const colors = this.particleGeometry.attributes.color.array;
        const spiralArms = 3;
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const armIndex = this.spiralTypes[i];
            
            // 螺旋参数
            const progress = (i / this.particleCount);
            const armOffset = (armIndex / spiralArms) * Math.PI * 2;
            const baseT = progress * Math.PI * 2 * this.spiralDensity + armOffset;
            
            // 添加时间偏移 - 不同螺旋臂不同速度
            const timeOffset = this.time * 0.0008 * this.rotationSpeed * (1 + armIndex * 0.2);
            const t = baseT + timeOffset;
            
            // 计算基础半径
            let baseRadius;
            if (progress < 0.2) {
                baseRadius = 3 + progress * 8;
            } else if (progress < 0.6) {
                baseRadius = 11 + (progress - 0.2) * 15;
            } else {
                baseRadius = 26 + (progress - 0.6) * 10;
            }
            
            // 添加多层波动效果
            const wave1 = Math.sin(this.time * 0.002 + this.phases[i]) * 0.4;
            const wave2 = Math.cos(this.time * 0.003 + i * 0.1) * 0.3;
            const wave3 = Math.sin(this.time * 0.001 + armIndex) * 0.2;
            const radiusModifier = 1 + wave1 + wave2 + wave3;
            
            const radius = baseRadius * radiusModifier;
            
            // 计算位置
            let x = Math.cos(t) * radius;
            let y = Math.sin(t) * radius;
            let z = Math.sin(t * 3 + this.time * 0.001) * 4;
            
            // 添加螺旋臂之间的相互作用
            const armInteraction = Math.sin(this.time * 0.001 + armIndex * 2) * 2;
            x += armInteraction;
            y += armInteraction * 0.5;
            
            // 鼠标交互 - 增强版
            const mouseX = this.mouse.x * 40;
            const mouseY = this.mouse.y * 40;
            const distanceToMouse = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
            
            if (distanceToMouse < 20) {
                const force = (20 - distanceToMouse) / 20;
                const angle = Math.atan2(y - mouseY, x - mouseX);
                x += Math.cos(angle) * force * 15;
                y += Math.sin(angle) * force * 15;
            }
            
            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;
            
            // 动态颜色变化 - 更丰富的效果
            const distanceFromCenter = Math.sqrt(x * x + y * y);
            const normalizedDistance = Math.min(distanceFromCenter / 35, 1);
            const colorIntensity = 0.8 + Math.sin(this.time * 0.004 + this.phases[i]) * 0.2;
            const fireEffect = Math.sin(this.time * 0.01 + i * 0.1) * 0.3;
            
            if (normalizedDistance < 0.15) {
                // 核心区域 - 动态橙色火焰效果
                colors[i3] = 1.0 * colorIntensity;
                colors[i3 + 1] = (0.4 + fireEffect) * colorIntensity;
                colors[i3 + 2] = 0.0;
            } else if (normalizedDistance < 0.4) {
                // 内圈 - 橙黄过渡
                colors[i3] = 1.0 * colorIntensity;
                colors[i3 + 1] = (0.7 + fireEffect * 0.2) * colorIntensity;
                colors[i3 + 2] = (0.3 + fireEffect * 0.1) * colorIntensity;
            } else if (normalizedDistance < 0.7) {
                // 中圈 - 白色
                colors[i3] = 0.9 * colorIntensity;
                colors[i3 + 1] = 0.9 * colorIntensity;
                colors[i3 + 2] = 1.0 * colorIntensity;
            } else {
                // 外圈 - 蓝白色
                colors[i3] = 0.6 * colorIntensity;
                colors[i3 + 1] = 0.8 * colorIntensity;
                colors[i3 + 2] = 1.0 * colorIntensity;
            }
        }
        
        this.particleGeometry.attributes.position.needsUpdate = true;
        this.particleGeometry.attributes.color.needsUpdate = true;
    }

    /**
     * 更新中心发光球
     * 实现脉冲和发光效果
     */
    updateCenterSphere() {
        if (this.centerSphere && this.glowSphere) {
            // 脉冲效果
            const pulse = 1 + Math.sin(this.time * 0.005) * 0.3;
            this.centerSphere.scale.setScalar(pulse);
            
            // 发光球脉冲
            const glowPulse = 1 + Math.sin(this.time * 0.003) * 0.5;
            this.glowSphere.scale.setScalar(glowPulse);
            
            // 旋转
            this.centerSphere.rotation.y += 0.01;
            this.glowSphere.rotation.x += 0.005;
            this.glowSphere.rotation.z += 0.008;
        }
    }

    /**
     * 动画循环函数
     * 持续更新和渲染场景
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 16;
        
        // 更新粒子
        this.updateParticles();
        
        // 更新中心球
        this.updateCenterSphere();
        
        // 整体旋转
        if (this.particles) {
            this.particles.rotation.z += 0.002 * this.rotationSpeed;
        }
        
        // 相机轻微运动
        this.camera.position.x = Math.sin(this.time * 0.0003) * 5;
        this.camera.position.y = Math.cos(this.time * 0.0002) * 3;
        this.camera.lookAt(0, 0, 0);
        
        // 渲染场景
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * 销毁系统
     * 清理资源
     */
    destroy() {
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
 * 页面加载完成后初始化螺旋粒子系统
 */
document.addEventListener('DOMContentLoaded', () => {
    const spiralSystem = new SpiralParticleSystem();
    
    window.addEventListener('beforeunload', () => {
        spiralSystem.destroy();
    });
    
    console.log('螺旋粒子效果已启动');
});