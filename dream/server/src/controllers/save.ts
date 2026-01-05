import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const saveController = {
  save: async (req: Request, res: Response) => {
    try {
      const { saveData } = req.body
      const playerId = req.headers['x-player-id'] as string

      const save = await prisma.save.create({
        data: {
          playerId,
          saveName: saveData.saveName || `Save ${new Date().toLocaleString()}`,
          saveData
        }
      })

      res.json({
        success: true,
        data: {
          saveId: save.id,
          timestamp: save.createdAt.getTime()
        }
      })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  load: async (req: Request, res: Response) => {
    try {
      const save = await prisma.save.findUnique({
        where: { id: req.params.id }
      })

      if (!save) {
        return res.status(404).json({ success: false, message: 'Save not found' })
      }

      res.json({ success: true, data: save.saveData })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  list: async (req: Request, res: Response) => {
    try {
      const playerId = req.headers['x-player-id'] as string

      const saves = await prisma.save.findMany({
        where: { playerId },
        orderBy: { createdAt: 'desc' }
      })

      res.json({ success: true, data: saves })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await prisma.save.delete({
        where: { id: req.params.id }
      })

      res.json({ success: true, message: 'Save deleted successfully' })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}
