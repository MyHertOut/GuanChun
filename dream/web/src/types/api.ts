// API 响应错误类型
export interface ErrorResponse {
  message: string
  code?: string
  errors?: any[]
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  code?: string
}
