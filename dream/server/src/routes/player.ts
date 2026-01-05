import { Router, Request, Response } from 'express'
import { playerController } from '../controllers/player'

const router = Router()

router.post('/create', (req: Request, res: Response) => playerController.create(req, res))
router.get('/info', (req: Request, res: Response) => playerController.getInfo(req, res))
router.put('/update', (req: Request, res: Response) => playerController.update(req, res))

export default router
