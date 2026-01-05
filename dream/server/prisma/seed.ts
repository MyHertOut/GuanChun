import { PrismaClient, SoulLevel, SpeciesRank } from '@prisma/client'
import soulPetsData from '../../data/soul_pets.json'
import skillsData from '../../data/skills.json'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.save.deleteMany()
  await prisma.inventory.deleteMany()
  await prisma.pet.deleteMany()
  await prisma.pactSlot.deleteMany()
  await prisma.player.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.petSpecies.deleteMany()
  console.log('✅ Cleared existing data')

  // Insert skills
  for (const skill of skillsData) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: {},
      create: {
        id: skill.id,
        name: skill.name,
        element: skill.element,
        type: skill.type,
        power: skill.power,
        cost: skill.cost,
        accuracy: skill.accuracy,
        description: skill.description,
        effect: skill.effect
      }
    })
  }
  console.log('✅ Inserted skills')

  // Insert pet species
  const rankMap: Record<string, SpeciesRank> = {
    '奴仆级': SpeciesRank.SLAVE,
    '战将级': SpeciesRank.GENERAL,
    '统领级': SpeciesRank.COMMANDER,
    '君主级': SpeciesRank.MONARCH,
    '帝皇级': SpeciesRank.EMPEROR,
    '主宰级': SpeciesRank.RULER,
    '不朽级': SpeciesRank.IMMORTAL
  }

  for (const pet of soulPetsData) {
    await prisma.petSpecies.upsert({
      where: { id: pet.id },
      update: {},
      create: {
        id: pet.id,
        name: pet.name,
        rank: rankMap[pet.rank] || SpeciesRank.SLAVE,
        elements: pet.elements,
        description: pet.description,
        baseStats: pet.base_stats,
        skills: pet.skills,
        evolutions: pet.evolutions
      }
    })
  }
  console.log('✅ Inserted pet species')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
