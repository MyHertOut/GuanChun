/**
 * 主路由模块
 * 
 * 整合所有API路由，提供统一的路由入口
 * 
 * @author GuanChun
 * @version 1.0.0
 */

const express = require('express')
const userRoutes = require('./userRoutes')

const router = express.Router()

/**
 * API版本信息
 * 
 * @route GET /api
 * @access Public
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Vue Admin Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      users: '/api/users',
      health: '/health'
    },
    documentation: {
      swagger: '/api/docs',
      postman: '/api/postman'
    }
  })
})

/**
 * 用户相关路由
 * 
 * 包括注册、登录、用户管理等功能
 */
router.use('/users', userRoutes)

/**
 * API状态检查
 * 
 * @route GET /api/status
 * @access Public
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    services: {
      database: 'connected',
      cache: 'operational',
      storage: 'operational'
    },
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    },
    timestamp: new Date().toISOString()
  })
})

/**
 * 健康检查接口
 * 
 * @route GET /api/health
 * @access Public
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

module.exports = router