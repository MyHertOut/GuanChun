/**
 * API测试脚本
 * 
 * 用于测试API接口的基本功能
 * 
 * @author GuanChun
 * @version 1.0.0
 */

const http = require('http')

/**
 * 发送HTTP请求
 * @param {Object} options 请求选项
 * @param {string} data 请求数据
 * @returns {Promise<Object>} 响应结果
 */
function makeRequest (options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = ''
      
      res.on('data', (chunk) => {
        body += chunk
      })
      
      res.on('end', () => {
        try {
          const result = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          }
          resolve(result)
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          })
        }
      })
    })
    
    req.on('error', (error) => {
      reject(error)
    })
    
    if (data) {
      req.write(JSON.stringify(data))
    }
    
    req.end()
  })
}

/**
 * 测试API接口
 */
async function testAPI () {
  console.log('🧪 开始API测试...\n')
  
  const baseURL = 'localhost'
  const port = 3000
  
  // 测试用例
  const tests = [
    {
      name: '健康检查',
      options: {
        hostname: baseURL,
        port: port,
        path: '/api/health',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    },
    {
      name: 'API根路径',
      options: {
        hostname: baseURL,
        port: port,
        path: '/api',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    },
    {
      name: '用户注册接口结构测试',
      options: {
        hostname: baseURL,
        port: port,
        path: '/api/users/register',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      data: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123456!'
      }
    }
  ]
  
  // 执行测试
  for (const test of tests) {
    try {
      console.log(`📋 测试: ${test.name}`)
      console.log(`🔗 ${test.options.method} ${test.options.path}`)
      
      const result = await makeRequest(test.options, test.data)
      
      console.log(`✅ 状态码: ${result.statusCode}`)
      if (result.body) {
        console.log(`📄 响应:`, JSON.stringify(result.body, null, 2))
      }
      console.log('---\n')
      
    } catch (error) {
      console.log(`❌ 测试失败: ${error.message}`)
      console.log('---\n')
    }
  }
  
  console.log('🎉 API测试完成！')
}

// 运行测试
if (require.main === module) {
  testAPI().catch(console.error)
}

module.exports = { testAPI, makeRequest }