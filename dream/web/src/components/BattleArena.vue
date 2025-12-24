<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// Props: The player's active pet, enemy pet, and inventory
const props = defineProps<{
  playerPet: any,
  enemyPet: any,
  inventory: any[]
}>();

const emit = defineEmits(['battle-end', 'escape', 'capture', 'use-item']);

// --- Battle Logic & State ---
const logs = ref<string[]>([]);
const turnCount = ref(0);
const isPlayerTurn = ref(true);
const battleOver = ref(false);
const showInventory = ref(false); // Toggle for in-battle inventory

// Helper for type effectiveness
const TYPE_CHART: Record<string, Record<string, number>> = {
    '火': { '木': 2.0, '冰': 2.0, '虫': 2.0, '水': 0.5, '火': 0.5 },
    '水': { '火': 2.0, '土': 2.0, '木': 0.5, '水': 0.5 },
    '木': { '土': 2.0, '水': 2.0, '火': 0.5, '虫': 0.5, '木': 0.5 },
    '冰': { '木': 2.0, '龙': 2.0, '火': 0.5, '冰': 0.5 },
    '虫': { '木': 2.0, '火': 0.5, '飞': 0.5 },
    '龙': { '龙': 2.0 },
    '妖灵': { '妖灵': 2.0 },
};

const getTypeEffectiveness = (attackType: string, defenderTypes: string[]) => {
    let multiplier = 1.0;
    if (!TYPE_CHART[attackType]) return 1.0;
    for (const defType of defenderTypes) {
        if (TYPE_CHART[attackType][defType] !== undefined) {
            multiplier *= TYPE_CHART[attackType][defType];
        }
    }
    return multiplier;
};

const log = (msg: string) => {
    logs.value.unshift(msg); 
};

// Calculate stats 
const getStats = (pet: any) => {
    const scale = (val: number) => Math.floor(val * (1 + pet.level * 0.1));
    return {
        maxHp: scale(pet.base_stats.health),
        attack: scale(pet.base_stats.attack),
        defense: scale(pet.base_stats.defense),
        speed: scale(pet.base_stats.speed),
    };
};

// Ensure current stats exist
if (props.playerPet.currentHealth === undefined) props.playerPet.currentHealth = getStats(props.playerPet).maxHp;
if (props.enemyPet.currentHealth === undefined) props.enemyPet.currentHealth = getStats(props.enemyPet).maxHp;

const playerStats = computed(() => getStats(props.playerPet));
const enemyStats = computed(() => getStats(props.enemyPet));

const playerHpPercent = computed(() => Math.max(0, (props.playerPet.currentHealth / playerStats.value.maxHp) * 100));
const enemyHpPercent = computed(() => Math.max(0, (props.enemyPet.currentHealth / enemyStats.value.maxHp) * 100));

// --- Actions ---

const endPlayerTurn = () => {
    isPlayerTurn.value = false;
    showInventory.value = false;
    
    // Enemy Turn
    setTimeout(() => {
        if (battleOver.value) return;
        
        const enemyMoves = props.enemyPet.skills && props.enemyPet.skills.length > 0 
            ? props.enemyPet.skills 
            : [{ name: "撞击", power: 20, element: "兽" }];
        
        const move = enemyMoves[Math.floor(Math.random() * enemyMoves.length)];
        executeMove(props.enemyPet, props.playerPet, move, enemyStats.value, playerStats.value, false);

        if (props.playerPet.currentHealth <= 0) {
            endBattle(false);
        } else {
            isPlayerTurn.value = true;
        }
    }, 1000);
}

const useSkill = (skill: any) => {
    if (battleOver.value || !isPlayerTurn.value) return;

    executeMove(props.playerPet, props.enemyPet, skill, playerStats.value, enemyStats.value, true);

    if (props.enemyPet.currentHealth <= 0) {
        endBattle(true);
        return;
    }

    endPlayerTurn();
};

const executeMove = (attacker: any, defender: any, skill: any, attStats: any, defStats: any, isPlayer: boolean) => {
    let damage = 0;
    let effectMsg = "";

    if (skill.power) {
        const raw = ((attacker.level * 0.4 + 2) * skill.power * (attStats.attack / defStats.defense) / 50 + 2);
        const typeMod = getTypeEffectiveness(skill.element, defender.elements);
        const stabMod = attacker.elements.includes(skill.element) ? 1.5 : 1.0;
        const randomMod = 0.85 + Math.random() * 0.15;

        damage = Math.floor(raw * typeMod * stabMod * randomMod);
        if (typeMod > 1) effectMsg = "效果拔群！🔥";
        if (typeMod < 1) effectMsg = "收效甚微...❄️";
    }

    defender.currentHealth -= damage;
    if (defender.currentHealth < 0) defender.currentHealth = 0;

    log(`${attacker.name} 使用了 ${skill.name}！ ${effectMsg}`);
    if (damage > 0) {
        log(` -> 造成了 ${damage} 点伤害！`);
    }
};

const endBattle = (win: boolean) => {
    battleOver.value = true;
    if (win) {
        log(`🏆 战斗胜利！${props.enemyPet.name} 倒下了。`);
        log(`获得了一级灵核 x1`);
    } else {
        log(`💀 战斗失败... ${props.playerPet.name} 失去了战斗能力。`);
    }
    
    setTimeout(() => {
        emit('battle-end', { win });
    }, 2000);
};

const tryEscape = () => {
    if (Math.random() > 0.5) {
        log("逃跑成功！");
        setTimeout(() => emit('escape'), 1000);
    } else {
        log("逃跑失败！");
        endPlayerTurn();
    }
};

// --- Inventory & Capture ---

const useItem = (item: any) => {
    if (battleOver.value || !isPlayerTurn.value) return;

    if (item.effect && item.effect.type === 'restore_health') {
        const healAmount = item.effect.value;
        props.playerPet.currentHealth = Math.min(playerStats.value.maxHp, props.playerPet.currentHealth + healAmount);
        log(`使用了 ${item.name}，恢复了 ${healAmount} 点生命值。`);
        
        emit('use-item', item.id);
        endPlayerTurn();
    } else {
        log("这个物品现在无法使用。");
    }
};

const attemptCapture = () => {
    if (battleOver.value || !isPlayerTurn.value) return;

    log(`念起了魂约咒语，尝试与 ${props.enemyPet.name} 建立灵魂羁绊...`);
    
    // Capture formula: (MaxHP * 3 - CurrentHP * 2) * Rate / (MaxHP * 3)
    // Simplified: Lower HP = Higher Chance
    const hpFactor = (enemyStats.value.maxHp * 3 - props.enemyPet.currentHealth * 2) / (enemyStats.value.maxHp * 3);
    const catchRate = 0.5; // Base rate
    const finalChance = hpFactor * catchRate;

    setTimeout(() => {
        if (Math.random() < finalChance) {
            log(`✨ 成功捕捉了 ${props.enemyPet.name}！`);
            battleOver.value = true;
            setTimeout(() => emit('capture', props.enemyPet), 2000);
        } else {
            log(`💔 捕捉失败！${props.enemyPet.name} 挣脱了魂约的束缚。`);
            endPlayerTurn();
        }
    }, 1000);
};

// Initial log
log(`遭遇了野生 ${props.enemyPet.name} (Lv.${props.enemyPet.level})！`);

</script>

<template>
  <div class="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-gray-800 max-w-2xl mx-auto">
    <!-- Battle Scene -->
    <div class="relative h-64 bg-gradient-to-b from-blue-300 to-green-200 p-6 flex flex-col justify-between">
      
      <!-- Enemy (Top Right) -->
      <div class="flex justify-end items-start animate-bounce-slow">
        <div class="text-center">
            <div class="bg-gray-800 text-white text-xs px-2 py-1 rounded mb-1">
                Lv.{{ enemyPet.level }} {{ enemyPet.name }}
            </div>
            <div class="w-32 bg-gray-200 rounded-full h-2 border border-gray-600 overflow-hidden">
                <div class="bg-red-500 h-full transition-all duration-500" :style="{ width: enemyHpPercent + '%' }"></div>
            </div>
            <div class="mt-2 text-6xl">👾</div> 
        </div>
      </div>

      <!-- Player (Bottom Left) -->
      <div class="flex justify-start items-end">
        <div class="text-center">
            <div class="mb-2 text-6xl scale-x-[-1]">🦊</div>
            <div class="bg-gray-800 text-white text-xs px-2 py-1 rounded mb-1">
                Lv.{{ playerPet.level }} {{ playerPet.name }}
            </div>
             <div class="w-32 bg-gray-200 rounded-full h-2 border border-gray-600 overflow-hidden">
                <div class="bg-green-500 h-full transition-all duration-500" :style="{ width: playerHpPercent + '%' }"></div>
            </div>
             <div class="text-xs font-bold mt-1">{{ playerPet.currentHealth }}/{{ playerStats.maxHp }}</div>
        </div>
      </div>
    </div>

    <!-- Controls & Logs -->
    <div class="grid grid-cols-2 gap-4 p-4 bg-gray-100 relative">
      
      <!-- Action Menu -->
      <div class="space-y-2">
        <div class="font-bold text-gray-700 mb-2">战斗指令</div>
        <div class="grid grid-cols-2 gap-2">
            <button v-for="skill in playerPet.skills" :key="skill.name"
                @click="useSkill(skill)"
                :disabled="!isPlayerTurn || battleOver"
                class="bg-white border-2 border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 py-2 rounded text-sm font-medium transition disabled:opacity-50">
                {{ skill.name }}
            </button>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-2">
            <button @click="showInventory = !showInventory" 
                :disabled="!isPlayerTurn || battleOver"
                class="bg-yellow-100 text-yellow-800 py-1 rounded text-sm hover:bg-yellow-200 disabled:opacity-50">
                {{ showInventory ? '返回' : '背包' }}
            </button>
            <button @click="attemptCapture"
                :disabled="!isPlayerTurn || battleOver"
                class="bg-purple-100 text-purple-800 py-1 rounded text-sm hover:bg-purple-200 disabled:opacity-50">
                捕捉
            </button>
            <button @click="tryEscape" :disabled="!isPlayerTurn || battleOver" class="bg-gray-200 text-gray-800 py-1 rounded text-sm hover:bg-gray-300 disabled:opacity-50 col-span-2">
                逃跑
            </button>
        </div>
      </div>

      <!-- Inventory Overlay -->
      <div v-if="showInventory" class="absolute inset-0 bg-white bg-opacity-95 p-4 z-10 flex flex-col">
          <h3 class="font-bold mb-2">选择物品</h3>
          <div class="flex-1 overflow-y-auto space-y-2">
              <div v-for="item in inventory" :key="item.id" class="flex justify-between items-center border p-2 rounded">
                  <span class="text-sm">{{ item.name }} (x{{ item.count }})</span>
                  <button @click="useItem(item)" class="bg-green-500 text-white px-2 py-1 rounded text-xs">使用</button>
              </div>
              <div v-if="inventory.length === 0" class="text-center text-gray-500 text-sm mt-4">
                  背包是空的
              </div>
          </div>
          <button @click="showInventory = false" class="mt-2 text-center text-sm text-gray-500">取消</button>
      </div>

      <!-- Battle Log -->
      <div class="bg-black text-green-400 p-3 rounded font-mono text-xs h-40 overflow-y-auto border-2 border-gray-600 shadow-inner">
        <div v-for="(line, i) in logs" :key="i" class="mb-1">
            > {{ line }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-bounce-slow {
  animation: bounce 3s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(-5%); }
  50% { transform: translateY(5%); }
}
</style>
