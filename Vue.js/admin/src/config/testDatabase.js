/**
 * 测试数据库配置
 * 
 * 使用内存数据库进行开发测试
 * 
 * @author GuanChun
 * @version 1.0.0
 */

const mongoose = require('mongoose')

/**
 * 内存数据库连接配置
 * 用于开发测试，无需安装MongoDB
 */
class TestDatabase {
  constructor () {
    this.connection = null
    this.isConnected = false
  }

  /**
   * 连接到内存数据库
   * @returns {Promise<void>}
   */
  async connect () {
    try {
      console.log('🔄 正在连接到内存数据库...')
      
      // 使用内存存储
      const options = {
        // 使用内存存储引擎
        dbName: 'vue_admin_test',
        // 连接超时配置
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        // 其他配置
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000
      }

      // 连接到内存数据库 (使用mongodb-memory-server)
      this.connection = await mongoose.connect('mongodb://127.0.0.1:27017/vue_admin_memory', options)
      
      this.isConnected = true
      console.log('✅ 内存数据库连接成功')
      
      // 监听连接事件
      mongoose.connection.on('error', (error) => {
        console.error('❌ 数据库连接错误:', error.message)
        this.isConnected = false
      })

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ 数据库连接断开')
        this.isConnected = false
      })

    } catch (error) {
      console.error('❌ 内存数据库连接失败:', error.message)
      this.isConnected = false
      throw error
    }
  }

  /**
   * 断开数据库连接
   * @returns {Promise<void>}
   */
  async disconnect () {
    try {
      if (this.connection) {
        await mongoose.connection.close()
        this.connection = null
        this.isConnected = false
        console.log('✅ 数据库连接已断开')
      }
    } catch (error) {
      console.error('❌ 断开数据库连接失败:', error.message)
      throw error
    }
  }

  /**
   * 获取连接状态
   * @returns {boolean} 连接状态
   */
  getConnectionStatus () {
    return this.isConnected && mongoose.connection.readyState === 1
  }

  /**
   * 清空所有集合数据
   * @returns {Promise<void>}
   */
  async clearDatabase () {
    try {
      if (this.isConnected) {
        const collections = await mongoose.connection.db.collections()
        
        for (const collection of collections) {
          await collection.deleteMany({})
        }
        
        console.log('✅ 数据库已清空')
      }
    } catch (error) {
      console.error('❌ 清空数据库失败:', error.message)
      throw error
    }
  }
}

// 创建单例实例
const testDatabase = new TestDatabase()

module.exports = testDatabase