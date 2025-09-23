/**
 * Vue Admin Backend - 主应用文件
 * 
 * 这是Express应用的入口文件，负责：
 * - 初始化Express应用
 * - 配置中间件
 * - 设置路由
 * - 启动服务器
 * 
 * @author GuanChun
 * @version 1.0.0
 */

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const { connectDB } = require('./config/database')
const testDatabase = require('./config/testDatabase')
const { errorHandler, notFound } = require('./middleware/errorMiddleware')
const routes = require('./routes')

/**
 * Express应用类
 * 
 * 负责创建和配置Express应用实例
 */
class App {
  constructor() {
    this.app = express()
    this.port = process.env.PORT || 3000
    
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializeErrorHandling()
  }

  /**
   * 初始化中间件
   * 
   * 配置应用所需的各种中间件：
   * - 安全中间件
   * - CORS配置
   * - 请求解析
   * - 日志记录
   * - 压缩
   * - 限流
   */
  initializeMiddlewares() {
    // 安全中间件
    this.app.use(helmet())
    
    // CORS配置
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }))
    
    // 请求体解析
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))
    
    // 日志记录
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan('combined'))
    }
    
    // 响应压缩
    this.app.use(compression())
    
    // API限流
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 100, // 限制每个IP 15分钟内最多100个请求
      message: {
        error: '请求过于频繁，请稍后再试'
      }
    })
    this.app.use('/api/', limiter)
  }

  /**
   * 初始化路由
   * 
   * 设置应用的路由配置
   */
  initializeRoutes() {
    // 健康检查端点
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'success',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      })
    })
    
    // API路由
    this.app.use('/api', routes)
  }

  /**
   * 初始化错误处理
   * 
   * 设置404和全局错误处理中间件
   */
  initializeErrorHandling() {
    this.app.use(notFound)
    this.app.use(errorHandler)
  }

  /**
   * 启动服务器
   * 
   * @returns {Promise<void>} 启动完成的Promise
   * @throws {Error} 服务器启动失败时抛出错误
   */
  async start() {
    try {
      // 尝试连接数据库
      try {
        await connectDB()
        console.log('✅ 使用MongoDB数据库')
      } catch (dbError) {
        console.log('⚠️ MongoDB连接失败，启用开发模式（无数据库）')
        console.log('💡 提示：你可以：')
        console.log('   1. 安装并启动本地MongoDB服务')
        console.log('   2. 使用MongoDB Atlas云数据库')
        console.log('   3. 当前将以无数据库模式运行（仅API结构测试）')
      }
      
      // 启动服务器
      this.server = this.app.listen(this.port, () => {
        console.log(`🚀 服务器运行在端口 ${this.port}`)
        console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`)
        console.log(`📊 健康检查: http://localhost:${this.port}/health`)
        console.log(`🔗 API地址: http://localhost:${this.port}/api`)
      })
    } catch (error) {
      console.error('❌ 服务器启动失败:', error.message)
      process.exit(1)
    }
  }

  /**
   * 停止服务器
   * 
   * @returns {Promise<void>} 停止完成的Promise
   */
  async stop() {
    if (this.server) {
      return new Promise((resolve) => {
        this.server.close(resolve)
      })
    }
  }
}

// 创建应用实例
const app = new App()

// 优雅关闭处理
process.on('SIGTERM', async () => {
  console.log('📴 收到SIGTERM信号，正在优雅关闭服务器...')
  await app.stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('📴 收到SIGINT信号，正在优雅关闭服务器...')
  await app.stop()
  process.exit(0)
})

// 启动应用
if (require.main === module) {
  app.start()
}

module.exports = app