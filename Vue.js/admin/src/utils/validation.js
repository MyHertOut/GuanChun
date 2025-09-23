/**
 * 验证工具模块
 * 
 * 提供通用的数据验证功能
 * 
 * @author GuanChun
 * @version 1.0.0
 */

/**
 * 验证邮箱格式
 * 
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否为有效邮箱
 */
const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  return emailRegex.test(email)
}

/**
 * 验证手机号格式（中国大陆）
 * 
 * @param {string} phone - 手机号码
 * @returns {boolean} 是否为有效手机号
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证密码强度
 * 
 * @param {string} password - 密码
 * @returns {Object} 验证结果和强度信息
 */
const validatePassword = (password) => {
  const result = {
    isValid: false,
    strength: 'weak',
    errors: []
  }
  
  // 长度检查
  if (password.length < 6) {
    result.errors.push('密码至少6个字符')
  }
  
  if (password.length > 128) {
    result.errors.push('密码最多128个字符')
  }
  
  // 复杂度检查
  const hasLowerCase = /[a-z]/.test(password)
  const hasUpperCase = /[A-Z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  let strengthScore = 0
  
  if (hasLowerCase) strengthScore++
  if (hasUpperCase) strengthScore++
  if (hasNumbers) strengthScore++
  if (hasSpecialChar) strengthScore++
  if (password.length >= 8) strengthScore++
  if (password.length >= 12) strengthScore++
  
  // 设置强度等级
  if (strengthScore >= 5) {
    result.strength = 'strong'
  } else if (strengthScore >= 3) {
    result.strength = 'medium'
  } else {
    result.strength = 'weak'
  }
  
  // 基本要求检查
  if (password.length >= 6 && hasLowerCase && hasUpperCase && hasNumbers) {
    result.isValid = true
  } else {
    if (!hasLowerCase) result.errors.push('密码必须包含小写字母')
    if (!hasUpperCase) result.errors.push('密码必须包含大写字母')
    if (!hasNumbers) result.errors.push('密码必须包含数字')
  }
  
  return result
}

/**
 * 验证用户名格式
 * 
 * @param {string} username - 用户名
 * @returns {Object} 验证结果
 */
const validateUsername = (username) => {
  const result = {
    isValid: false,
    errors: []
  }
  
  // 长度检查
  if (username.length < 3) {
    result.errors.push('用户名至少3个字符')
  }
  
  if (username.length > 20) {
    result.errors.push('用户名最多20个字符')
  }
  
  // 格式检查
  const usernameRegex = /^[a-zA-Z0-9_]+$/
  if (!usernameRegex.test(username)) {
    result.errors.push('用户名只能包含字母、数字和下划线')
  }
  
  // 不能以数字开头
  if (/^\d/.test(username)) {
    result.errors.push('用户名不能以数字开头')
  }
  
  // 保留用户名检查
  const reservedNames = ['admin', 'root', 'user', 'test', 'api', 'www', 'mail', 'ftp']
  if (reservedNames.includes(username.toLowerCase())) {
    result.errors.push('该用户名为保留用户名，不可使用')
  }
  
  result.isValid = result.errors.length === 0
  return result
}

/**
 * 验证MongoDB ObjectId格式
 * 
 * @param {string} id - ObjectId字符串
 * @returns {boolean} 是否为有效ObjectId
 */
const isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/
  return objectIdRegex.test(id)
}

/**
 * 验证URL格式
 * 
 * @param {string} url - URL字符串
 * @returns {boolean} 是否为有效URL
 */
const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

/**
 * 验证日期格式
 * 
 * @param {string} dateString - 日期字符串
 * @returns {boolean} 是否为有效日期
 */
const isValidDate = (dateString) => {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date)
}

/**
 * 验证文件类型
 * 
 * @param {string} filename - 文件名
 * @param {Array} allowedTypes - 允许的文件类型数组
 * @returns {boolean} 是否为允许的文件类型
 */
const isValidFileType = (filename, allowedTypes) => {
  const extension = filename.split('.').pop().toLowerCase()
  return allowedTypes.includes(extension)
}

/**
 * 验证文件大小
 * 
 * @param {number} fileSize - 文件大小（字节）
 * @param {number} maxSize - 最大允许大小（字节）
 * @returns {boolean} 文件大小是否符合要求
 */
const isValidFileSize = (fileSize, maxSize) => {
  return fileSize <= maxSize
}

/**
 * 清理和验证输入字符串
 * 
 * @param {string} input - 输入字符串
 * @param {Object} options - 验证选项
 * @returns {Object} 清理后的字符串和验证结果
 */
const sanitizeAndValidate = (input, options = {}) => {
  const {
    maxLength = 255,
    minLength = 0,
    allowHtml = false,
    trim = true
  } = options
  
  let sanitized = input
  const result = {
    value: sanitized,
    isValid: true,
    errors: []
  }
  
  // 去除首尾空格
  if (trim) {
    sanitized = sanitized.trim()
  }
  
  // 长度验证
  if (sanitized.length < minLength) {
    result.errors.push(`内容至少${minLength}个字符`)
    result.isValid = false
  }
  
  if (sanitized.length > maxLength) {
    result.errors.push(`内容最多${maxLength}个字符`)
    result.isValid = false
  }
  
  // HTML标签处理
  if (!allowHtml) {
    sanitized = sanitized.replace(/<[^>]*>/g, '')
  }
  
  // XSS防护
  sanitized = sanitized
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
  
  result.value = sanitized
  return result
}

module.exports = {
  isValidEmail,
  isValidPhone,
  validatePassword,
  validateUsername,
  isValidObjectId,
  isValidUrl,
  isValidDate,
  isValidFileType,
  isValidFileSize,
  sanitizeAndValidate
}