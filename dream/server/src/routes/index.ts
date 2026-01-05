import { Router } from 'express'

const router = Router()

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is healthy' })
})

// Mount routes
router.use('/player', require('./player').default)
router.use('/pets', require('./pet').default)
router.use('/battle', require('./battle').default)
router.use('/save', require('./save').default)

export default router
