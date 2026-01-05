-- CreateTable
CREATE TABLE `players` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `soulPower` INTEGER NOT NULL DEFAULT 100,
    `maxSoulPower` INTEGER NOT NULL DEFAULT 100,
    `level` ENUM('SOUL_TU', 'SOUL_SHI', 'SOUL_SHI_YI', 'SOUL_ZHU', 'SOUL_HUANG', 'SOUL_DI', 'SOUL_ZUN') NOT NULL DEFAULT 'SOUL_TU',
    `gold` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `players_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pact_slots` (
    `id` VARCHAR(191) NOT NULL,
    `slotId` INTEGER NOT NULL,
    `petUid` VARCHAR(191) NULL,
    `isLocked` BOOLEAN NOT NULL DEFAULT false,
    `unlockLevel` ENUM('SOUL_TU', 'SOUL_SHI', 'SOUL_SHI_YI', 'SOUL_ZHU', 'SOUL_HUANG', 'SOUL_DI', 'SOUL_ZUN') NULL,
    `playerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `pact_slots_petUid_key`(`petUid`),
    UNIQUE INDEX `pact_slots_playerId_slotId_key`(`playerId`, `slotId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pets` (
    `uid` VARCHAR(191) NOT NULL,
    `playerId` VARCHAR(191) NOT NULL,
    `speciesId` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NULL,
    `level` INTEGER NOT NULL DEFAULT 1,
    `exp` INTEGER NOT NULL DEFAULT 0,
    `hp` INTEGER NOT NULL,
    `maxHp` INTEGER NOT NULL,
    `stamina` INTEGER NOT NULL,
    `maxStamina` INTEGER NOT NULL,
    `loyalty` INTEGER NOT NULL DEFAULT 80,
    `mutationPoints` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pet_species` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `rank` ENUM('SLAVE', 'GENERAL', 'COMMANDER', 'MONARCH', 'EMPEROR', 'RULER', 'IMMORTAL') NOT NULL,
    `elements` JSON NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `baseStats` JSON NOT NULL,
    `skills` JSON NOT NULL,
    `evolutions` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skills` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `element` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `power` INTEGER NOT NULL,
    `cost` INTEGER NOT NULL,
    `accuracy` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `effect` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventories` (
    `id` VARCHAR(191) NOT NULL,
    `playerId` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `saves` (
    `id` VARCHAR(191) NOT NULL,
    `playerId` VARCHAR(191) NOT NULL,
    `saveName` VARCHAR(191) NOT NULL,
    `saveData` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pact_slots` ADD CONSTRAINT `pact_slots_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pact_slots` ADD CONSTRAINT `pact_slots_petUid_fkey` FOREIGN KEY (`petUid`) REFERENCES `pets`(`uid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pets` ADD CONSTRAINT `pets_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pets` ADD CONSTRAINT `pets_speciesId_fkey` FOREIGN KEY (`speciesId`) REFERENCES `pet_species`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `saves` ADD CONSTRAINT `saves_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
