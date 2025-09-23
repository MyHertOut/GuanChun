/**
 * 用户路由模块
 * 
 * 定义用户相关的API路由和验证规则
 * 
 * @author GuanChun
 * @version 1.0.0
 */

const express = require('express')
const { body, param } = require('express-validator')
const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  changePassword,
  getUsers,
  deleteUser
} = require('../controllers/userController')
const { authenticate, authorize } = require('../middleware/authMiddleware')

const router = express.Router()

/**
 * 用户注册验证规则
 */
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名长度必须在3-20个字符之间')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('用户名只能包含字母、数字和下划线'),
  
  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('密码至少6个字符')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('密码必须包含大小写字母和数字'),
  
  body('firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('名字最多50个字符')
    .trim(),
  
  body('lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('姓氏最多50个字符')
    .trim()
]

/**
 * 用户登录验证规则
 */
const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('邮箱或用户名不能为空'),
  
  body('password')
    .notEmpty()
    .withMessage('密码不能为空')
]

/**
 * 更新用户信息验证规则
 */
const updateProfileValidation = [
  body('firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('名字最多50个字符')
    .trim(),
  
  body('lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('姓氏最多50个字符')
    .trim(),
  
  body('phone')
    .optional()
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('请输入有效的手机号码'),
  
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('个人简介最多500个字符'),
  
  body('preferences.language')
    .optional()
    .isIn(['zh-CN', 'en-US'])
    .withMessage('语言设置无效'),
  
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('主题设置无效')
]

/**
 * 修改密码验证规则
 */
const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('当前密码不能为空'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('新密码至少6个字符')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('新密码必须包含大小写字母和数字'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('确认密码与新密码不匹配')
      }
      return true
    })
]

/**
 * ID参数验证规则
 */
const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('无效的用户ID')
]

// 公开路由
/**
 * @route   POST /api/users/register
 * @desc    用户注册
 * @access  Public
 */
router.post('/register', registerValidation, registerUser)

/**
 * @route   POST /api/users/login
 * @desc    用户登录
 * @access  Public
 */
router.post('/login', loginValidation, loginUser)

// 需要认证的路由
/**
 * @route   GET /api/users/profile
 * @desc    获取当前用户信息
 * @access  Private
 */
router.get('/profile', authenticate, getCurrentUser)

/**
 * @route   PUT /api/users/profile
 * @desc    更新用户信息
 * @access  Private
 */
router.put('/profile', authenticate, updateProfileValidation, updateUserProfile)

/**
 * @route   PUT /api/users/password
 * @desc    修改密码
 * @access  Private
 */
router.put('/password', authenticate, changePasswordValidation, changePassword)

// 管理员路由
/**
 * @route   GET /api/users
 * @desc    获取用户列表
 * @access  Private (Admin only)
 */
router.get('/', authenticate, authorize('admin'), getUsers)

/**
 * @route   DELETE /api/users/:id
 * @desc    删除用户
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, authorize('admin'), idValidation, deleteUser)

module.exports = router