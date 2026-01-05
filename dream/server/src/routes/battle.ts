import { Router, Request, Response } from 'express'
import { battleController } from '../controllers/battle'

const router = Router()

router.post('/start', (req: Request, res: Response) => battleController.start(req, res))
router.post('/:id/action', (req: Request, res: Response) => battleController.action(req, res))
router.post('/:id/finish', (req: Request, res: Response) => battleController.finish(req, res))

export default router
