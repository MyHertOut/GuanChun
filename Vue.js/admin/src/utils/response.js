/**
 * API响应工具模块
 * 
 * 提供统一的API响应格式和工具函数
 * 
 * @author GuanChun
 * @version 1.0.0
 */

/**
 * 成功响应
 * 
 * @param {Object} res - Express响应对象
 * @param {*} data - 响应数据
 * @param {string} message - 响应消息
 * @param {number} statusCode - HTTP状态码
 * @returns {Object} JSON响应
 */
const success = (res, data = null, message = '操作成功', statusCode = 200) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  }
  
  if (data !== null) {
    response.data = data
  }
  
  return res.status(statusCode).json(response)
}

/**
 * 错误响应
 * 
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 * @param {number} statusCode - HTTP状态码
 * @param {*} details - 错误详情
 * @returns {Object} JSON响应
 */
const error = (res, message = '操作失败', statusCode = 500, details = null) => {
  const response = {
    success: false,
    error: {
      message,
      status: statusCode
    },
    timestamp: new Date().toISOString()
  }
  
  if (details && process.env.NODE_ENV === 'development') {
    response.error.details = details
  }
  
  return res.status(statusCode).json(response)
}

/**
 * 分页响应
 * 
 * @param {Object} res - Express响应对象
 * @param {Array} items - 数据项数组
 * @param {Object} pagination - 分页信息
 * @param {string} message - 响应消息
 * @returns {Object} JSON响应
 */
const paginated = (res, items, pagination, message = '获取数据成功') => {
  const response = {
    success: true,
    message,
    data: {
      items,
      pagination: {
        current: pagination.current || 1,
        pages: pagination.pages || 1,
        total: pagination.total || 0,
        limit: pagination.limit || 10,
        hasNext: pagination.current < pagination.pages,
        hasPrev: pagination.current > 1
      }
    },
    timestamp: new Date().toISOString()
  }
  
  return res.status(200).json(response)
}

/**
 * 创建响应
 * 
 * @param {Object} res - Express响应对象
 * @param {*} data - 创建的数据
 * @param {string} message - 响应消息
 * @returns {Object} JSON响应
 */
const created = (res, data, message = '创建成功') => {
  return success(res, data, message, 201)
}

/**
 * 无内容响应
 * 
 * @param {Object} res - Express响应对象
 * @param {string} message - 响应消息
 * @returns {Object} JSON响应
 */
const noContent = (res, message = '操作成功') => {
  return res.status(204).json({
    success: true,
    message,
    timestamp: new Date().toISOString()
  })
}

/**
 * 未找到响应
 * 
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 * @returns {Object} JSON响应
 */
const notFound = (res, message = '资源未找到') => {
  return error(res, message, 404)
}

/**
 * 未授权响应
 * 
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 * @returns {Object} JSON响应
 */
const unauthorized = (res, message = '未授权访问') => {
  return error(res, message, 401)
}

/**
 * 禁止访问响应
 * 
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 * @returns {Object} JSON响应
 */
const forbidden = (res, message = '禁止访问') => {
  return error(res, message, 403)
}

/**
 * 验证错误响应
 * 
 * @param {Object} res - Express响应对象
 * @param {Array} errors - 验证错误数组
 * @param {string} message - 错误消息
 * @returns {Object} JSON响应
 */
const validationError = (res, errors, message = '数据验证失败') => {
  const response = {
    success: false,
    error: {
      message,
      status: 400,
      validation: errors
    },
    timestamp: new Date().toISOString()
  }
  
  return res.status(400).json(response)
}

/**
 * 冲突响应
 * 
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 * @returns {Object} JSON响应
 */
const conflict = (res, message = '资源冲突') => {
  return error(res, message, 409)
}

/**
 * 请求过多响应
 * 
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 * @returns {Object} JSON响应
 */
const tooManyRequests = (res, message = '请求过于频繁') => {
  return error(res, message, 429)
}

/**
 * 服务器错误响应
 * 
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 * @param {*} details - 错误详情
 * @returns {Object} JSON响应
 */
const serverError = (res, message = '服务器内部错误', details = null) => {
  return error(res, message, 500, details)
}

/**
 * 自定义响应
 * 
 * @param {Object} res - Express响应对象
 * @param {number} statusCode - HTTP状态码
 * @param {Object} data - 响应数据
 * @returns {Object} JSON响应
 */
const custom = (res, statusCode, data) => {
  return res.status(statusCode).json({
    ...data,
    timestamp: new Date().toISOString()
  })
}

/**
 * 健康检查响应
 * 
 * @param {Object} res - Express响应对象
 * @param {Object} healthData - 健康检查数据
 * @returns {Object} JSON响应
 */
const health = (res, healthData = {}) => {
  const response = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    },
    ...healthData
  }
  
  return res.status(200).json(response)
}

module.exports = {
  success,
  error,
  paginated,
  created,
  noContent,
  notFound,
  unauthorized,
  forbidden,
  validationError,
  conflict,
  tooManyRequests,
  serverError,
  custom,
  health
}