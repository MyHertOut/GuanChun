/**
 * 错误处理中间件模块
 * 
 * 提供统一的错误处理和404处理中间件
 * 
 * @author GuanChun
 * @version 1.0.0
 */

/**
 * 404错误处理中间件
 * 
 * 处理未找到的路由请求
 * 
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const notFound = (req, res, next) => {
  const error = new Error(`未找到路由 - ${req.originalUrl}`)
  error.status = 404
  next(error)
}

/**
 * 全局错误处理中间件
 * 
 * 统一处理应用中的所有错误
 * 
 * @param {Error} err - 错误对象
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const errorHandler = (err, req, res, next) => {
  // 设置状态码
  let statusCode = err.status || err.statusCode || 500
  let message = err.message || '服务器内部错误'
  
  // 处理特定类型的错误
  if (err.name === 'ValidationError') {
    // Mongoose验证错误
    statusCode = 400
    message = Object.values(err.errors).map(val => val.message).join(', ')
  } else if (err.name === 'CastError') {
    // Mongoose类型转换错误
    statusCode = 400
    message = '无效的资源ID'
  } else if (err.code === 11000) {
    // MongoDB重复键错误
    statusCode = 400
    const field = Object.keys(err.keyValue)[0]
    message = `${field} 已存在`
  } else if (err.name === 'JsonWebTokenError') {
    // JWT错误
    statusCode = 401
    message = '无效的访问令牌'
  } else if (err.name === 'TokenExpiredError') {
    // JWT过期错误
    statusCode = 401
    message = '访问令牌已过期'
  }
  
  // 构建错误响应
  const errorResponse = {
    success: false,
    error: {
      message,
      status: statusCode
    }
  }
  
  // 在开发环境中包含错误堆栈
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack
    errorResponse.error.details = err
  }
  
  // 记录错误日志
  console.error(`❌ 错误 [${statusCode}]: ${message}`)
  if (process.env.NODE_ENV === 'development') {
    console.error('错误堆栈:', err.stack)
  }
  
  res.status(statusCode).json(errorResponse)
}

/**
 * 异步错误处理包装器
 * 
 * 包装异步路由处理函数，自动捕获Promise rejection
 * 
 * @param {Function} fn - 异步路由处理函数
 * @returns {Function} 包装后的函数
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * 创建自定义错误
 * 
 * @param {string} message - 错误消息
 * @param {number} statusCode - HTTP状态码
 * @returns {Error} 自定义错误对象
 */
const createError = (message, statusCode = 500) => {
  const error = new Error(message)
  error.status = statusCode
  return error
}

module.exports = {
  notFound,
  errorHandler,
  asyncHandler,
  createError
}