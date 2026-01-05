import { Router, Request, Response } from 'express'
import { saveController } from '../controllers/save'

const router = Router()

router.post('/', (req: Request, res: Response) => saveController.save(req, res))
router.get('/:id', (req: Request, res: Response) => saveController.load(req, res))
router.get('/saves/list', (req: Request, res: Response) => saveController.list(req, res))
router.delete('/:id', (req: Request, res: Response) => saveController.delete(req, res))

export default router
