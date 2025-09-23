/**
 * 认证中间件模块
 * 
 * 提供JWT令牌验证和用户认证功能
 * 
 * @author GuanChun
 * @version 1.0.0
 */

const jwt = require('jsonwebtoken')
const { asyncHandler, createError } = require('./errorMiddleware')

/**
 * JWT令牌验证中间件
 * 
 * 验证请求头中的JWT令牌并提取用户信息
 * 
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 * @throws {Error} 令牌无效或过期时抛出错误
 */
const authenticate = asyncHandler(async (req, res, next) => {
  let token
  
  // 从请求头获取令牌
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 提取令牌
      token = req.headers.authorization.split(' ')[1]
      
      // 验证令牌
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // 将用户信息添加到请求对象
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      }
      
      next()
    } catch (error) {
      throw createError('访问令牌无效', 401)
    }
  }
  
  if (!token) {
    throw createError('未提供访问令牌', 401)
  }
})

/**
 * 角色权限验证中间件工厂
 * 
 * 创建基于角色的权限验证中间件
 * 
 * @param {...string} roles - 允许访问的角色列表
 * @returns {Function} 权限验证中间件
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw createError('请先登录', 401)
    }
    
    if (!roles.includes(req.user.role)) {
      throw createError('权限不足', 403)
    }
    
    next()
  }
}

/**
 * 可选认证中间件
 * 
 * 如果提供了令牌则验证，否则继续执行（用于可选登录的接口）
 * 
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      }
    } catch (error) {
      // 可选认证失败时不抛出错误，继续执行
      console.warn('可选认证失败:', error.message)
    }
  }
  
  next()
})

/**
 * 生成JWT令牌
 * 
 * @param {Object} payload - 令牌载荷数据
 * @param {string} payload.id - 用户ID
 * @param {string} payload.email - 用户邮箱
 * @param {string} payload.role - 用户角色
 * @returns {string} JWT令牌
 */
const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  )
}

/**
 * 验证JWT令牌
 * 
 * @param {string} token - JWT令牌
 * @returns {Object} 解码后的令牌数据
 * @throws {Error} 令牌无效时抛出错误
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    throw createError('令牌验证失败', 401)
  }
}

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  generateToken,
  verifyToken
}