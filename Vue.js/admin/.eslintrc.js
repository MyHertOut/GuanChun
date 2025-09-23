/**
 * ESLint配置文件
 * 
 * 定义代码规范和检查规则
 * 
 * @author GuanChun
 * @version 1.0.0
 */

module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // 缩进规则
    'indent': ['error', 2],
    
    // 引号规则
    'quotes': ['error', 'single'],
    
    // 分号规则
    'semi': ['error', 'never'],
    
    // 逗号规则
    'comma-dangle': ['error', 'never'],
    
    // 空格规则
    'space-before-function-paren': ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    
    // 换行规则
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    
    // 变量规则
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-var': 'error',
    'prefer-const': 'error',
    
    // 函数规则
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    'arrow-spacing': 'error',
    
    // 对象规则
    'object-shorthand': 'error',
    'dot-notation': 'error',
    
    // 字符串规则
    'template-curly-spacing': 'error',
    'prefer-template': 'error',
    
    // 数组规则
    'array-callback-return': 'error',
    
    // 条件规则
    'eqeqeq': ['error', 'always'],
    'no-else-return': 'error',
    
    // 错误处理
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    
    // 注释规则
    'spaced-comment': ['error', 'always'],
    
    // 导入规则
    'import/order': ['error', {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index'
      ],
      'newlines-between': 'never'
    }],
    
    // Node.js特定规则
    'node/no-unpublished-require': 'off',
    'node/no-missing-require': 'error',
    
    // 安全规则
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    
    // 性能规则
    'no-loop-func': 'error',
    'no-await-in-loop': 'warn'
  },
  
  // 忽略特定文件
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*.min.js'
  ],
  
  // 覆盖特定文件的规则
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true
      },
      rules: {
        'no-unused-expressions': 'off'
      }
    }
  ]
}