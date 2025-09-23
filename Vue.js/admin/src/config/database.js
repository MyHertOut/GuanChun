/**
 * 数据库配置模块
 * 
 * 负责MongoDB数据库的连接和配置管理
 * 
 * @author GuanChun
 * @version 1.0.0
 */

const mongoose = require('mongoose')

/**
 * 连接MongoDB数据库
 * 
 * @returns {Promise<void>} 连接完成的Promise
 * @throws {Error} 数据库连接失败时抛出错误
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vue_admin_db'
    
    const options = {
      // 连接池配置
      maxPoolSize: 10, // 最大连接数
      serverSelectionTimeoutMS: 5000, // 服务器选择超时
      socketTimeoutMS: 45000, // Socket超时
      connectTimeoutMS: 10000,
      family: 4,
      heartbeatFrequencyMS: 10000
    }
    
    const conn = await mongoose.connect(mongoURI, options)
    
    console.log(`✅ MongoDB连接成功: ${conn.connection.host}`)
    
    // 监听连接事件
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB连接错误:', err)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB连接断开')
    })
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB重新连接成功')
    })
    
  } catch (error) {
    console.error('❌ MongoDB连接失败:', error.message)
    throw error
  }
}

/**
 * 断开数据库连接
 * 
 * @returns {Promise<void>} 断开连接完成的Promise
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close()
    console.log('📴 MongoDB连接已关闭')
  } catch (error) {
    console.error('❌ 关闭MongoDB连接时出错:', error.message)
    throw error
  }
}

/**
 * 获取数据库连接状态
 * 
 * @returns {string} 连接状态描述
 */
const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }
  
  return states[mongoose.connection.readyState] || 'unknown'
}

module.exports = {
  connectDB,
  disconnectDB,
  getConnectionStatus
}