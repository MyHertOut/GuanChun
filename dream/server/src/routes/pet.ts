import { Router, Request, Response } from 'express'
import { petController } from '../controllers/pet'

const router = Router()

router.get('/list', (req: Request, res: Response) => petController.getList(req, res))
router.get('/:id', (req: Request, res: Response) => petController.getDetail(req, res))
router.post('/:id/evolve', (req: Request, res: Response) => petController.evolve(req, res))
router.post('/:id/level-up', (req: Request, res: Response) => petController.levelUp(req, res))
router.get('/dex/all', (req: Request, res: Response) => petController.getDex(req, res))

export default router
