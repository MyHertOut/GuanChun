const fs = require('fs');
const path = require('path');

function loadJson(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error loading ${filePath}: ${err.message}`);
        process.exit(1);
    }
}

function verifyData() {
    const baseDir = path.dirname(__dirname); // parent of scripts/ is dream/
    const petsPath = path.join(baseDir, 'data', 'soul_pets.json');
    const skillsPath = path.join(baseDir, 'data', 'skills.json');

    console.log(`Loading data from:\n  ${petsPath}\n  ${skillsPath}\n`);

    const pets = loadJson(petsPath);
    const skills = loadJson(skillsPath);

    // 1. Verify Skill IDs
    const skillMap = new Map(skills.map(s => [s.id, s]));
    console.log(`Loaded ${skills.length} skills.`);

    let skillErrors = 0;
    
    pets.forEach(pet => {
        if (pet.skills) {
            pet.skills.forEach(petSkill => {
                const skillId = petSkill.skill_id;
                if (!skillId) {
                    console.warn(`Warning: Pet ${pet.name} (${pet.id}) has a skill without an ID.`);
                    return;
                }

                if (!skillMap.has(skillId)) {
                    console.error(`Error: Pet ${pet.name} (${pet.id}) references unknown skill ID: ${skillId}`);
                    skillErrors++;
                } else {
                    const dbName = skillMap.get(skillId).name;
                    if (petSkill.name && petSkill.name !== dbName) {
                        console.log(`Note: Pet ${pet.name} calls skill ${skillId} '${petSkill.name}', but DB name is '${dbName}'.`);
                    }
                }
            });
        }
    });

    // 2. Verify Evolution Target IDs
    const petMap = new Map(pets.map(p => [p.id, p]));
    console.log(`Loaded ${pets.length} soul pets.`);

    let evoErrors = 0;
    pets.forEach(pet => {
        if (pet.evolutions) {
            pet.evolutions.forEach(evo => {
                const targetId = evo.target_id;
                if (!targetId || !petMap.has(targetId)) {
                    console.error(`Error: Pet ${pet.name} (${pet.id}) evolves into unknown ID: ${targetId}`);
                    evoErrors++;
                }
            });
        }
    });

    console.log("\n--- Verification Summary ---");
    if (skillErrors === 0 && evoErrors === 0) {
        console.log("✅ Data verification PASSED! All references are valid.");
    } else {
        console.error(`❌ Data verification FAILED with ${skillErrors} skill errors and ${evoErrors} evolution errors.`);
        process.exit(1);
    }
}

verifyData();
