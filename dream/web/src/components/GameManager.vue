<script setup>
import { ref, computed } from 'vue';
import SoulPetCard from './SoulPetCard.vue';
import BattleArena from './BattleArena.vue';
import soulPetsData from '../data/soul_pets.json';
import itemsData from '../data/items.json';
import skillsData from '../data/skills.json';

// State
const gameState = ref('intro'); // 'intro' | 'creation' | 'hub' | 'battle' | 'inventory'
const player = ref(null);
const inputName = ref('');
const selectedStarterId = ref('');
const currentEnemy = ref(null);

// Data
const starterOptions = computed(() => {
  return soulPetsData.filter(p => ['1001', '3001', '4001'].includes(p.id));
});

// --- Initialization ---

const startNewGame = () => {
  gameState.value = 'creation';
  inputName.value = '';
  selectedStarterId.value = '';
};

const createCharacter = () => {
  if (!inputName.value || !selectedStarterId.value) return;

  const starterTemplate = soulPetsData.find(p => p.id === selectedStarterId.value);
  if (!starterTemplate) return;

  const starterPet = createPetInstance(starterTemplate, 5);

  player.value = {
    name: inputName.value,
    soulPower: 100,
    pets: [starterPet],
    inventory: [
        { ...itemsData.find(i => i.id === 'I001'), count: 5 }, // 5 Potions
        { ...itemsData.find(i => i.id === 'I101'), count: 1000 }  // 1 Core
    ],
    createdAt: Date.now()
  };

  saveGame();
  gameState.value = 'hub';
};

const createPetInstance = (template, level) => {
    const pet = JSON.parse(JSON.stringify(template));
    pet.level = level;
    // Simple stat scaling
    const scale = (val) => Math.floor(val * (1 + level * 0.1));
    pet.currentHealth = scale(pet.base_stats.health);
    
    // Assign skills based on level and merge with full skill data
    if (pet.skills) {
        pet.skills = pet.skills.map(petSkill => {
            const fullSkill = skillsData.find(s => s.id === petSkill.skill_id);
            if (fullSkill) {
                // Merge full skill data (power, cost, element, etc.)
                // Keep learn_level from petSkill
                return { ...fullSkill, ...petSkill };
            }
            return petSkill;
        });
    }

    return pet;
}

// --- Persistence ---

const saveGame = () => {
  if (player.value) {
    localStorage.setItem('chongmei_save', JSON.stringify(player.value));
    // alert('游戏已保存！'); // Remove alert for smoother UX
  }
};

const loadGame = () => {
  const save = localStorage.getItem('chongmei_save');
  if (save) {
    player.value = JSON.parse(save);
    gameState.value = 'hub';
  } else {
    alert('没有找到存档！');
  }
};

const resetGame = () => {
    if(confirm('确定要删除存档重新开始吗？')) {
        localStorage.removeItem('chongmei_save');
        gameState.value = 'intro';
        player.value = null;
    }
}

// --- Exploration & Battle ---

const startExploration = () => {
    // 1. Pick a random pet from DB (excluding evolved forms for now to keep it simple, or just random)
    // Let's pick from low rank pets
    const candidates = soulPetsData.filter(p => p.rank === '奴仆级' || p.rank === '战将级');
    const template = candidates[Math.floor(Math.random() * candidates.length)];
    
    // 2. Determine Level (Player Pet Level +/- 2)
    const playerLevel = player.value.pets[0].level;
    const enemyLevel = Math.max(1, playerLevel + Math.floor(Math.random() * 5) - 2);

    currentEnemy.value = createPetInstance(template, enemyLevel);
    gameState.value = 'battle';
};

const handleBattleEnd = (result) => {
    if (result.win) {
        // Grant Rewards
        const gold = Math.floor(Math.random() * 50) + 10;
        // player.value.gold += gold; // Gold not implemented yet
        
        // Chance for Item
        if (Math.random() > 0.7) {
            const item = itemsData[Math.floor(Math.random() * itemsData.length)];
            addToInventory(item.id, 1);
        }

        // Heal a bit (optional)
    }
    
    saveGame();
    gameState.value = 'hub';
    currentEnemy.value = null;
};

const handleEscape = () => {
    gameState.value = 'hub';
    currentEnemy.value = null;
}

const handleUseItem = (itemId) => {
    consumeItem(itemId, 1);
    saveGame();
}

const handleCapture = (enemyPet) => {
    // Clone and heal fully
    const newPet = JSON.parse(JSON.stringify(enemyPet));
    // Heal up
    const scale = (val) => Math.floor(val * (1 + newPet.level * 0.1));
    newPet.currentHealth = scale(newPet.base_stats.health);
    
    player.value.pets.push(newPet);
    
    // End battle
    gameState.value = 'hub';
    currentEnemy.value = null;
    saveGame();
}

// --- Inventory ---

const addToInventory = (itemId, count) => {
    const existing = player.value.inventory.find(i => i.id === itemId);
    if (existing) {
        existing.count += count;
    } else {
        const itemTemplate = itemsData.find(i => i.id === itemId);
        if (itemTemplate) {
            player.value.inventory.push({ ...itemTemplate, count });
        }
    }
}

const consumeItem = (itemId, count) => {
    const idx = player.value.inventory.findIndex(i => i.id === itemId);
    if (idx !== -1) {
        player.value.inventory[idx].count -= count;
        if (player.value.inventory[idx].count <= 0) {
            player.value.inventory.splice(idx, 1);
        }
    }
}

const useItemFromBag = (item) => {
    // Only support level up core for now in bag
    if (item.id === 'I101') { // Level 1 Core
        const pet = player.value.pets[0]; // Upgrade first pet for now
        pet.level += 1;
        // Recalculate stats? Ideally we should have a reactive stats getter or method
        // For now simple re-calc max HP heal
        const scale = (val) => Math.floor(val * (1 + pet.level * 0.1));
        pet.currentHealth = scale(pet.base_stats.health);
        
        consumeItem(item.id, 1);
        alert(`${pet.name} 升级到了 Lv.${pet.level}！`);
        saveGame();
    } else {
        alert('该物品只能在战斗中使用或暂未实装效果。');
    }
}

const toggleInventory = () => {
    if (gameState.value === 'inventory') gameState.value = 'hub';
    else gameState.value = 'inventory';
}

</script>

<template>
  <div class="max-w-4xl mx-auto p-6 font-sans text-gray-800 min-h-screen">
    <!-- Header -->
    <header class="mb-8 text-center border-b pb-4">
      <h1 class="text-4xl font-bold text-indigo-900 mb-2 cursor-pointer" @click="gameState='intro'">宠魅：灵魂羁绊</h1>
      <p class="text-gray-500">Soul Pet: Spiritual Bond</p>
    </header>

    <!-- INTRO SCREEN -->
    <div v-if="gameState === 'intro'" class="text-center space-y-4 py-12">
      <h2 class="text-2xl font-semibold mb-6">欢迎来到魂宠世界</h2>
      <div class="space-x-4">
        <button @click="startNewGame" 
          class="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition shadow-lg">
          开始新征程
        </button>
        <button @click="loadGame" 
          class="px-6 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition shadow">
          读取存档
        </button>
      </div>
    </div>

    <!-- CREATION SCREEN -->
    <div v-if="gameState === 'creation'" class="space-y-6 animate-fade-in">
      <h2 class="text-2xl font-bold">创建角色</h2>
      
      <div class="space-y-2">
        <label class="block font-medium">魂宠师姓名</label>
        <input v-model="inputName" type="text" placeholder="请输入你的名字" 
          class="w-full max-w-md px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" />
      </div>

      <div class="space-y-2">
        <label class="block font-medium">选择你的初始魂宠</label>
        <div class="flex flex-wrap gap-4">
          <div v-for="pet in starterOptions" :key="pet.id" 
            @click="selectedStarterId = pet.id"
            :class="['cursor-pointer border-2 rounded-lg transition p-1 transform hover:scale-105', 
              selectedStarterId === pet.id ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent hover:border-gray-300']">
            <SoulPetCard :pet="pet" />
          </div>
        </div>
      </div>

      <div class="pt-6">
        <button @click="createCharacter" :disabled="!inputName || !selectedStarterId"
          class="px-8 py-3 bg-indigo-600 text-white rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
          签订魂约
        </button>
        <button @click="gameState = 'intro'" class="ml-4 text-gray-500 hover:text-gray-700">
          返回
        </button>
      </div>
    </div>

    <!-- HUB SCREEN -->
    <div v-if="gameState === 'hub' && player" class="space-y-8 animate-fade-in">
      <!-- Player Info -->
      <div class="bg-indigo-50 p-6 rounded-lg flex justify-between items-center shadow-sm border border-indigo-100">
        <div>
          <h2 class="text-2xl font-bold text-indigo-900">{{ player.name }}</h2>
          <p class="text-indigo-700">魂念等级: 魂徒 (Lv.1)</p>
        </div>
        <div class="text-right">
            <p class="font-mono font-bold text-xl text-indigo-600">{{ player.soulPower }} / 100</p>
            <p class="text-sm text-gray-500">魂力</p>
        </div>
      </div>

      <!-- Main Actions -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button @click="startExploration" class="p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg shadow hover:from-red-600 hover:to-orange-600 transition font-bold text-lg">
           ⚔️ 外出探险
        </button>
        <button @click="toggleInventory" class="p-4 bg-white border border-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-50 transition font-medium">
           🎒 背包
        </button>
        <button @click="saveGame" class="p-4 bg-white border border-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-50 transition font-medium">
           💾 保存进度
        </button>
        <button @click="resetGame" class="p-4 bg-white border border-red-200 text-red-600 rounded-lg shadow hover:bg-red-50 transition font-medium">
           🚫 重置
        </button>
      </div>

      <!-- Pets List -->
      <div>
        <h3 class="text-xl font-bold mb-4 border-l-4 border-indigo-600 pl-3">我的魂宠队伍</h3>
        <div class="flex flex-wrap gap-6">
          <SoulPetCard v-for="pet in player.pets" :key="pet.id" :pet="pet" />
        </div>
      </div>
    </div>

    <!-- BATTLE SCREEN -->
    <div v-if="gameState === 'battle'" class="py-4 animate-fade-in">
        <BattleArena 
            :player-pet="player.pets[0]" 
            :enemy-pet="currentEnemy"
            :inventory="player.inventory"
            @battle-end="handleBattleEnd"
            @escape="handleEscape"
            @use-item="handleUseItem"
            @capture="handleCapture"
        />
    </div>

    <!-- INVENTORY SCREEN -->
    <div v-if="gameState === 'inventory'" class="space-y-6 animate-fade-in">
        <h2 class="text-2xl font-bold flex items-center gap-2">
            <span class="cursor-pointer hover:text-indigo-600" @click="gameState='hub'">⬅️</span>
            背包
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="item in player.inventory" :key="item.id" class="bg-white p-4 rounded shadow border flex justify-between items-center">
                <div>
                    <h3 class="font-bold">{{ item.name }}</h3>
                    <p class="text-sm text-gray-500">{{ item.description }}</p>
                </div>
                <div class="flex items-center gap-2">
                    <div class="bg-gray-100 px-3 py-1 rounded font-mono">
                        x{{ item.count }}
                    </div>
                    <button @click="useItemFromBag(item)" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm">
                        使用
                    </button>
                </div>
            </div>
            <div v-if="player.inventory.length === 0" class="text-gray-500 col-span-2 text-center py-8">
                背包是空的...
            </div>
        </div>
    </div>

  </div>
</template>

<style>
.animate-fade-in {
    animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
