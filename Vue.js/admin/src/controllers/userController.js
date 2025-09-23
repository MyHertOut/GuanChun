/**
 * 用户控制器
 * 
 * 处理用户相关的业务逻辑和API请求
 * 
 * @author GuanChun
 * @version 1.0.0
 */

const { validationResult } = require('express-validator')
const User = require('../models/User')
const { asyncHandler, createError } = require('../middleware/errorMiddleware')
const { generateToken } = require('../middleware/authMiddleware')

/**
 * 用户注册
 * 
 * @route POST /api/users/register
 * @access Public
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {Object} 注册成功的用户信息和令牌
 * @throws {Error} 验证失败或用户已存在时抛出错误
 */
const registerUser = asyncHandler(async (req, res) => {
  // 验证请求数据
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw createError('输入数据验证失败', 400)
  }
  
  const { username, email, password, firstName, lastName } = req.body
  
  // 检查用户是否已存在
  const existingUser = await User.findByEmailOrUsername(email)
  if (existingUser) {
    throw createError('用户已存在', 400)
  }
  
  // 创建新用户
  const user = await User.create({
    username,
    email,
    password,
    profile: {
      firstName,
      lastName
    }
  })
  
  // 生成JWT令牌
  const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role
  })
  
  res.status(201).json({
    success: true,
    message: '注册成功',
    data: {
      user: user.getPublicProfile(),
      token
    }
  })
})

/**
 * 用户登录
 * 
 * @route POST /api/users/login
 * @access Public
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {Object} 登录成功的用户信息和令牌
 * @throws {Error} 登录失败时抛出错误
 */
const loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw createError('输入数据验证失败', 400)
  }
  
  const { email, password } = req.body
  
  // 查找用户
  const user = await User.findByEmailOrUsername(email)
  if (!user) {
    throw createError('用户不存在', 401)
  }
  
  // 检查账户是否被锁定
  if (user.isLocked) {
    throw createError('账户已被锁定，请稍后再试', 423)
  }
  
  // 检查账户状态
  if (user.status !== 'active') {
    throw createError('账户已被禁用', 403)
  }
  
  // 验证密码
  const isPasswordValid = await user.matchPassword(password)
  if (!isPasswordValid) {
    // 增加登录失败次数
    await user.incLoginAttempts()
    throw createError('密码错误', 401)
  }
  
  // 重置登录失败次数并更新最后登录时间
  await user.resetLoginAttempts()
  await user.updateLastLogin()
  
  // 生成JWT令牌
  const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role
  })
  
  res.json({
    success: true,
    message: '登录成功',
    data: {
      user: user.getPublicProfile(),
      token
    }
  })
})

/**
 * 获取当前用户信息
 * 
 * @route GET /api/users/profile
 * @access Private
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {Object} 当前用户信息
 * @throws {Error} 用户不存在时抛出错误
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    throw createError('用户不存在', 404)
  }
  
  res.json({
    success: true,
    data: {
      user: user.getPublicProfile()
    }
  })
})

/**
 * 更新用户信息
 * 
 * @route PUT /api/users/profile
 * @access Private
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {Object} 更新后的用户信息
 * @throws {Error} 验证失败或用户不存在时抛出错误
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw createError('输入数据验证失败', 400)
  }
  
  const user = await User.findById(req.user.id)
  if (!user) {
    throw createError('用户不存在', 404)
  }
  
  const { firstName, lastName, phone, bio, preferences } = req.body
  
  // 更新用户信息
  if (firstName !== undefined) user.profile.firstName = firstName
  if (lastName !== undefined) user.profile.lastName = lastName
  if (phone !== undefined) user.profile.phone = phone
  if (bio !== undefined) user.profile.bio = bio
  if (preferences) {
    user.preferences = { ...user.preferences, ...preferences }
  }
  
  await user.save()
  
  res.json({
    success: true,
    message: '用户信息更新成功',
    data: {
      user: user.getPublicProfile()
    }
  })
})

/**
 * 修改密码
 * 
 * @route PUT /api/users/password
 * @access Private
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {Object} 修改成功消息
 * @throws {Error} 验证失败或密码错误时抛出错误
 */
const changePassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw createError('输入数据验证失败', 400)
  }
  
  const { currentPassword, newPassword } = req.body
  
  const user = await User.findById(req.user.id).select('+password')
  if (!user) {
    throw createError('用户不存在', 404)
  }
  
  // 验证当前密码
  const isCurrentPasswordValid = await user.matchPassword(currentPassword)
  if (!isCurrentPasswordValid) {
    throw createError('当前密码错误', 400)
  }
  
  // 更新密码
  user.password = newPassword
  await user.save()
  
  res.json({
    success: true,
    message: '密码修改成功'
  })
})

/**
 * 获取用户列表（管理员功能）
 * 
 * @route GET /api/users
 * @access Private (Admin only)
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {Object} 用户列表和分页信息
 */
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit
  
  // 构建查询条件
  const query = {}
  if (req.query.status) {
    query.status = req.query.status
  }
  if (req.query.role) {
    query.role = req.query.role
  }
  if (req.query.search) {
    query.$or = [
      { username: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
      { 'profile.firstName': { $regex: req.query.search, $options: 'i' } },
      { 'profile.lastName': { $regex: req.query.search, $options: 'i' } }
    ]
  }
  
  // 执行查询
  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(query)
  ])
  
  res.json({
    success: true,
    data: {
      users: users.map(user => user.getPublicProfile()),
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    }
  })
})

/**
 * 删除用户（管理员功能）
 * 
 * @route DELETE /api/users/:id
 * @access Private (Admin only)
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @returns {Object} 删除成功消息
 * @throws {Error} 用户不存在时抛出错误
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    throw createError('用户不存在', 404)
  }
  
  // 不能删除自己
  if (user._id.toString() === req.user.id) {
    throw createError('不能删除自己的账户', 400)
  }
  
  await User.findByIdAndDelete(req.params.id)
  
  res.json({
    success: true,
    message: '用户删除成功'
  })
})

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  changePassword,
  getUsers,
  deleteUser
}