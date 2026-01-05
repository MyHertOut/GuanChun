import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const petController = {
  getList: async (req: Request, res: Response) => {
    try {
      const playerId = req.headers['x-player-id'] as string

      const pets = await prisma.pet.findMany({
        where: { playerId },
        include: { species: true }
      })

      res.json({ success: true, data: pets })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  getDetail: async (req: Request, res: Response) => {
    try {
      const pet = await prisma.pet.findUnique({
        where: { uid: req.params.id },
        include: { species: true }
      })

      if (!pet) {
        return res.status(404).json({ success: false, message: 'Pet not found' })
      }

      res.json({ success: true, data: pet })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  evolve: async (req: Request, res: Response) => {
    try {
      const { evolutionId, items } = req.body

      // TODO: Implement evolution logic

      res.json({ success: true, message: 'Evolution not implemented yet' })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  levelUp: async (req: Request, res: Response) => {
    try {
      const { exp, items } = req.body

      // TODO: Implement level up logic

      res.json({ success: true, message: 'Level up not implemented yet' })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  getDex: async (req: Request, res: Response) => {
    try {
      const species = await prisma.petSpecies.findMany()

      res.json({ success: true, data: species })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}
