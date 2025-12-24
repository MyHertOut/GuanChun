const fs = require('fs');
const path = require('path');

// --- 1. Data Loading ---
function loadJson(filename) {
    const filePath = path.join(__dirname, '../data', filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const petsData = loadJson('soul_pets.json');
const skillsData = loadJson('skills.json');

// Helper Maps
const skillMap = new Map(skillsData.map(s => [s.id, s]));
const petDataMap = new Map(petsData.map(p => [p.id, p]));

// --- 2. Type Effectiveness Matrix (Simplified) ---
// 2.0 = Effective, 0.5 = Not Effective, 1.0 = Neutral
const TYPE_CHART = {
    '火': { '木': 2.0, '冰': 2.0, '虫': 2.0, '水': 0.5, '火': 0.5 },
    '水': { '火': 2.0, '土': 2.0, '木': 0.5, '水': 0.5 },
    '木': { '土': 2.0, '水': 2.0, '火': 0.5, '虫': 0.5, '木': 0.5 },
    '冰': { '木': 2.0, '龙': 2.0, '火': 0.5, '冰': 0.5 },
    '虫': { '木': 2.0, '火': 0.5, '飞': 0.5 },
    '龙': { '龙': 2.0 },
    '妖灵': { '妖灵': 2.0 }, // Assuming Ghost/Demon is effective against itself for now
    // Add more as needed
};

function getTypeEffectiveness(attackType, defenderTypes) {
    let multiplier = 1.0;
    if (!TYPE_CHART[attackType]) return 1.0;

    for (const defType of defenderTypes) {
        if (TYPE_CHART[attackType][defType] !== undefined) {
            multiplier *= TYPE_CHART[attackType][defType];
        }
    }
    return multiplier;
}

// --- 3. Classes ---

class SoulPetInstance {
    constructor(templateId, level = 5) {
        const template = petDataMap.get(templateId);
        if (!template) throw new Error(`Pet ID ${templateId} not found`);

        this.id = template.id;
        this.name = template.name;
        this.rank = template.rank;
        this.elements = template.elements;
        this.level = level;

        // Calculate Stats based on Level and Base Stats
        // Formula: Stat = Base * (Level / 50) + 5 (Very simplified for now)
        // Adjusting formula to make stats usable at level 5
        const scale = (val) => Math.floor(val * (1 + this.level * 0.1)); 

        this.maxHp = scale(template.base_stats.health);
        this.currentHp = this.maxHp;
        this.maxStamina = scale(template.base_stats.stamina);
        this.currentStamina = this.maxStamina;
        
        this.attack = scale(template.base_stats.attack);
        this.defense = scale(template.base_stats.defense);
        this.speed = scale(template.base_stats.speed);

        // Load Skills
        this.skills = [];
        if (template.skills) {
            template.skills.forEach(s => {
                if (s.learn_level <= this.level) {
                    const skillDetail = skillMap.get(s.skill_id);
                    if (skillDetail) this.skills.push(skillDetail);
                }
            });
        }
        // If no skills learned, give a basic struggle
        if (this.skills.length === 0) {
            this.skills.push({ name: "撞击", power: 20, cost: 0, element: "兽", type: "物理" });
        }
    }

    isAlive() {
        return this.currentHp > 0;
    }
}

class Battle {
    constructor(pet1, pet2) {
        this.pet1 = pet1;
        this.pet2 = pet2;
        this.turnCount = 0;
        this.logs = [];
    }

    log(message) {
        console.log(message);
        this.logs.push(message);
    }

    start() {
        this.log(`⚔️ 战斗开始！ ${this.pet1.name} (Lv.${this.pet1.level}) VS ${this.pet2.name} (Lv.${this.pet2.level})`);
        this.log(`--------------------------------------------------`);
        
        while (this.pet1.isAlive() && this.pet2.isAlive() && this.turnCount < 20) {
            this.turnCount++;
            this.log(`\n[第 ${this.turnCount} 回合]`);
            this.executeTurn();
        }

        this.log(`\n--------------------------------------------------`);
        if (this.pet1.isAlive() && this.pet2.isAlive()) {
            this.log(`🤝 战斗超时，平局！`);
        } else if (this.pet1.isAlive()) {
            this.log(`🏆 ${this.pet1.name} 获胜！ (剩余HP: ${this.pet1.currentHp})`);
        } else {
            this.log(`🏆 ${this.pet2.name} 获胜！ (剩余HP: ${this.pet2.currentHp})`);
        }
    }

    executeTurn() {
        // 1. Determine order based on speed
        // Random speed variance +/- 10%
        const speed1 = this.pet1.speed * (0.9 + Math.random() * 0.2);
        const speed2 = this.pet2.speed * (0.9 + Math.random() * 0.2);

        let first, second;
        if (speed1 >= speed2) {
            first = this.pet1;
            second = this.pet2;
        } else {
            first = this.pet2;
            second = this.pet1;
        }

        // 2. Execute moves
        this.performAction(first, second);
        if (second.isAlive()) {
            this.performAction(second, first);
        }
    }

    performAction(attacker, defender) {
        // Simple AI: Randomly choose a skill that can be afforded
        const availableSkills = attacker.skills.filter(s => s.cost <= attacker.currentStamina);
        
        if (availableSkills.length === 0) {
            this.log(`${attacker.name} 体力不支，只能休息！`);
            attacker.currentStamina += 20; // Recover some stamina
            return;
        }

        const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
        
        // Cost
        attacker.currentStamina -= skill.cost;

        // Damage Calculation
        // Formula: Damage = ( (Attacker_Level * 0.4 + 2) * Skill_Power * (Attacker_Attack / Defender_Defense) / 50 + 2 ) * Modifier
        
        if (skill.power === 0) {
            this.log(`${attacker.name} 使用了 【${skill.name}】！ (辅助技能暂无效果)`);
            return;
        }

        let damage = ((attacker.level * 0.4 + 2) * skill.power * (attacker.attack / defender.defense) / 50 + 2);

        // Modifiers
        // 1. Type Effectiveness
        const typeMod = getTypeEffectiveness(skill.element, defender.elements);
        
        // 2. STAB (Same Type Attack Bonus)
        const stabMod = attacker.elements.includes(skill.element) ? 1.5 : 1.0;

        // 3. Random Variance (0.85 - 1.0)
        const randomMod = 0.85 + Math.random() * 0.15;

        damage = Math.floor(damage * typeMod * stabMod * randomMod);

        // Apply Damage
        defender.currentHp -= damage;
        if (defender.currentHp < 0) defender.currentHp = 0;

        // Log
        let effectText = "";
        if (typeMod > 1) effectText = "效果拔群！🔥";
        if (typeMod < 1) effectText = "收效甚微...❄️";
        
        this.log(`${attacker.name} 使用了 【${skill.name}】！ ${effectText}`);
        this.log(`   -> 造成了 ${damage} 点伤害！ (${defender.name} HP: ${defender.currentHp}/${defender.maxHp})`);
    }
}

// --- 4. Main Simulation ---

// Create Pets
try {
    const moXie = new SoulPetInstance("1001", 10); // 月光狐 Level 10
    const iceElf = new SoulPetInstance("3001", 10); // 冰空精灵 Level 10

    const battle = new Battle(moXie, iceElf);
    battle.start();

} catch (e) {
    console.error("Simulation failed:", e);
}
