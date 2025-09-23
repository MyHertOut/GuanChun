/**
 * 环境变量配置模块
 * 
 * 统一管理和验证环境变量配置
 * 
 * @author GuanChun
 * @version 1.0.0
 */

require('dotenv').config()

/**
 * 验证必需的环境变量
 * 
 * @param {string} name - 环境变量名称
 * @param {*} defaultValue - 默认值
 * @returns {*} 环境变量值或默认值
 * @throws {Error} 必需的环境变量未设置时抛出错误
 */
const getEnvVar = (name, defaultValue = null, required = false) => {
  const value = process.env[name]
  
  if (required && !value) {
    throw new Error(`环境变量 ${name} 是必需的，但未设置`)
  }
  
  return value || defaultValue
}

/**
 * 应用配置对象
 * 
 * 包含所有应用运行所需的配置项
 */
const config = {
  // 应用基础配置
  app: {
    name: getEnvVar('APP_NAME', 'Vue Admin Backend'),
    version: getEnvVar('APP_VERSION', '1.0.0'),
    port: parseInt(getEnvVar('PORT', '3000')),
    env: getEnvVar('NODE_ENV', 'development'),
    host: getEnvVar('HOST', 'localhost')
  },
  
  // 数据库配置
  database: {
    uri: getEnvVar('MONGODB_URI', 'mongodb://localhost:27017/vue_admin_db'),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: parseInt(getEnvVar('DB_MAX_POOL_SIZE', '10')),
      serverSelectionTimeoutMS: parseInt(getEnvVar('DB_SERVER_SELECTION_TIMEOUT', '5000')),
      socketTimeoutMS: parseInt(getEnvVar('DB_SOCKET_TIMEOUT', '45000'))
    }
  },
  
  // JWT配置
  jwt: {
    secret: getEnvVar('JWT_SECRET', 'your_jwt_secret_key_here', true),
    expiresIn: getEnvVar('JWT_EXPIRES_IN', '7d'),
    issuer: getEnvVar('JWT_ISSUER', 'vue-admin-backend'),
    audience: getEnvVar('JWT_AUDIENCE', 'vue-admin-frontend')
  },
  
  // CORS配置
  cors: {
    origin: getEnvVar('CORS_ORIGIN', 'http://localhost:5173'),
    credentials: getEnvVar('CORS_CREDENTIALS', 'true') === 'true',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  
  // 安全配置
  security: {
    bcryptRounds: parseInt(getEnvVar('BCRYPT_ROUNDS', '12')),
    maxLoginAttempts: parseInt(getEnvVar('MAX_LOGIN_ATTEMPTS', '5')),
    lockoutDuration: parseInt(getEnvVar('LOCKOUT_DURATION', '7200000')), // 2小时
    rateLimitWindow: parseInt(getEnvVar('RATE_LIMIT_WINDOW', '900000')), // 15分钟
    rateLimitMax: parseInt(getEnvVar('RATE_LIMIT_MAX', '100'))
  },
  
  // 日志配置
  logging: {
    level: getEnvVar('LOG_LEVEL', 'info'),
    format: getEnvVar('LOG_FORMAT', 'combined'),
    file: getEnvVar('LOG_FILE', null)
  },
  
  // 邮件配置
  email: {
    host: getEnvVar('EMAIL_HOST', 'smtp.gmail.com'),
    port: parseInt(getEnvVar('EMAIL_PORT', '587')),
    secure: getEnvVar('EMAIL_SECURE', 'false') === 'true',
    user: getEnvVar('EMAIL_USER'),
    password: getEnvVar('EMAIL_PASSWORD'),
    from: getEnvVar('EMAIL_FROM', 'noreply@vue-admin.com')
  },
  
  // 文件上传配置
  upload: {
    maxSize: parseInt(getEnvVar('UPLOAD_MAX_SIZE', '10485760')), // 10MB
    allowedTypes: getEnvVar('UPLOAD_ALLOWED_TYPES', 'image/jpeg,image/png,image/gif').split(','),
    destination: getEnvVar('UPLOAD_DESTINATION', 'uploads/')
  },
  
  // Redis配置（如果使用）
  redis: {
    host: getEnvVar('REDIS_HOST', 'localhost'),
    port: parseInt(getEnvVar('REDIS_PORT', '6379')),
    password: getEnvVar('REDIS_PASSWORD'),
    db: parseInt(getEnvVar('REDIS_DB', '0'))
  }
}

/**
 * 验证配置的有效性
 * 
 * @throws {Error} 配置无效时抛出错误
 */
const validateConfig = () => {
  const errors = []
  
  // 验证端口号
  if (config.app.port < 1 || config.app.port > 65535) {
    errors.push('端口号必须在1-65535之间')
  }
  
  // 验证JWT密钥
  if (config.jwt.secret.length < 32) {
    errors.push('JWT密钥长度至少32个字符')
  }
  
  // 验证数据库URI
  if (!config.database.uri.startsWith('mongodb://') && !config.database.uri.startsWith('mongodb+srv://')) {
    errors.push('数据库URI格式无效')
  }
  
  // 验证CORS源
  try {
    new URL(config.cors.origin)
  } catch (error) {
    errors.push('CORS源URL格式无效')
  }
  
  if (errors.length > 0) {
    throw new Error(`配置验证失败:\n${errors.join('\n')}`)
  }
}

/**
 * 获取当前环境是否为开发环境
 * 
 * @returns {boolean} 是否为开发环境
 */
const isDevelopment = () => config.app.env === 'development'

/**
 * 获取当前环境是否为生产环境
 * 
 * @returns {boolean} 是否为生产环境
 */
const isProduction = () => config.app.env === 'production'

/**
 * 获取当前环境是否为测试环境
 * 
 * @returns {boolean} 是否为测试环境
 */
const isTest = () => config.app.env === 'test'

// 在模块加载时验证配置
try {
  validateConfig()
  console.log('✅ 环境配置验证通过')
} catch (error) {
  console.error('❌ 环境配置验证失败:', error.message)
  process.exit(1)
}

module.exports = {
  config,
  isDevelopment,
  isProduction,
  isTest,
  validateConfig
}