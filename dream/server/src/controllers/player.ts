import { Request, Response } from 'express'
import Joi from 'joi'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const createSchema = Joi.object({
  name: Joi.string().min(1).max(50).required()
})

const updateSchema = Joi.object({
  soulPower: Joi.number().min(0).optional(),
  level: Joi.string().optional(),
  gold: Joi.number().min(0).optional()
})

export const playerController = {
  create: async (req: Request, res: Response) => {
    try {
      const { error, value } = createSchema.validate(req.body)
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message })
      }

      const player = await prisma.player.create({
        data: {
          name: value.name,
          // TODO: Create initial pet
          pactSlots: {
            create: [
              { slotId: 1, isLocked: false },
              { slotId: 2, isLocked: true, unlockLevel: 'SOUL_SHI' },
              { slotId: 3, isLocked: true, unlockLevel: 'SOUL_SHI' },
              { slotId: 4, isLocked: true, unlockLevel: 'SOUL_ZHU' }
            ]
          }
        },
        include: {
          pactSlots: true
        }
      })

      res.json({ success: true, data: player })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  getInfo: async (req: Request, res: Response) => {
    try {
      // TODO: Get player ID from JWT token
      const playerId = req.headers['x-player-id'] as string

      if (!playerId) {
        return res.status(400).json({ success: false, message: 'Missing player ID header' })
      }

      const player = await prisma.player.findUnique({
        where: { id: playerId },
        include: {
          pactSlots: { include: { pet: true } },
          pets: true,
          inventory: true
        }
      })

      if (!player) {
        return res.status(404).json({ success: false, message: 'Player not found' })
      }

      res.json({ success: true, data: player })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { error, value } = updateSchema.validate(req.body)
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message })
      }

      const playerId = req.headers['x-player-id'] as string

      const player = await prisma.player.update({
        where: { id: playerId },
        data: value
      })

      res.json({ success: true, data: player })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}
