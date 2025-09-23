/**
 * 用户数据模型
 * 
 * 定义用户的数据结构和相关方法
 * 
 * @author GuanChun
 * @version 1.0.0
 */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

/**
 * 用户Schema定义
 * 
 * 包含用户的基本信息、认证信息和权限信息
 */
const userSchema = new mongoose.Schema({
  // 基本信息
  username: {
    type: String,
    required: [true, '用户名是必填项'],
    unique: true,
    trim: true,
    minlength: [3, '用户名至少3个字符'],
    maxlength: [20, '用户名最多20个字符'],
    validate: {
      validator: function (username) {
        return /^[a-zA-Z0-9_]+$/.test(username)
      },
      message: '用户名只能包含字母、数字和下划线'
    }
  },
  
  email: {
    type: String,
    required: [true, '邮箱不能为空'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      '请输入有效的邮箱地址'
    ]
  },
  
  password: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: [6, '密码至少6个字符'],
    select: false // 默认查询时不返回密码字段
  },
  
  // 个人信息
  profile: {
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, '名字最多50个字符']
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, '姓氏最多50个字符']
    },
    avatar: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      match: [/^1[3-9]\d{9}$/, '请输入有效的手机号码']
    },
    bio: {
      type: String,
      maxlength: [500, '个人简介最多500个字符']
    }
  },
  
  // 权限和状态
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  
  // 认证相关
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // 登录信息
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // 偏好设置
  preferences: {
    language: {
      type: String,
      enum: ['zh-CN', 'en-US'],
      default: 'zh-CN'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true, // 自动添加createdAt和updatedAt字段
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// 虚拟字段：全名
userSchema.virtual('profile.fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`
  }
  return this.username
})

// 虚拟字段：账户是否被锁定
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

// 索引
userSchema.index({ 'profile.phone': 1 })
userSchema.index({ createdAt: -1 })

/**
 * 密码加密中间件
 * 
 * 在保存用户前自动加密密码
 */
userSchema.pre('save', async function(next) {
  // 只有密码被修改时才加密
  if (!this.isModified('password')) {
    return next()
  }
  
  try {
    // 生成盐值并加密密码
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

/**
 * 密码验证方法
 * 
 * @param {string} candidatePassword - 待验证的密码
 * @returns {Promise<boolean>} 密码是否匹配
 */
userSchema.methods.matchPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

/**
 * 增加登录失败次数
 * 
 * @returns {Promise<void>}
 */
userSchema.methods.incLoginAttempts = async function() {
  // 如果之前有锁定且已过期，重置计数器
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    })
  }
  
  const updates = { $inc: { loginAttempts: 1 } }
  
  // 如果达到最大尝试次数且未被锁定，则锁定账户
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 } // 锁定2小时
  }
  
  return this.updateOne(updates)
}

/**
 * 重置登录失败次数
 * 
 * @returns {Promise<void>}
 */
userSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  })
}

/**
 * 更新最后登录时间
 * 
 * @returns {Promise<void>}
 */
userSchema.methods.updateLastLogin = async function() {
  return this.updateOne({ lastLogin: new Date() })
}

/**
 * 获取用户的公开信息
 * 
 * @returns {Object} 用户公开信息
 */
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    profile: this.profile,
    role: this.role,
    status: this.status,
    emailVerified: this.emailVerified,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt
  }
}

// 静态方法：根据邮箱或用户名查找用户
userSchema.statics.findByEmailOrUsername = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ]
  }).select('+password')
}

module.exports = mongoose.model('User', userSchema)