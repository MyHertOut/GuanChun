import json
import os
import sys

def load_json(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Failed to decode JSON from {file_path}: {e}")
        sys.exit(1)

def verify_data():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    pets_path = os.path.join(base_dir, 'data', 'soul_pets.json')
    skills_path = os.path.join(base_dir, 'data', 'skills.json')

    print(f"Loading data from:\n  {pets_path}\n  {skills_path}\n")

    pets = load_json(pets_path)
    skills = load_json(skills_path)

    # 1. Verify Skill IDs
    skill_map = {s['id']: s for s in skills}
    print(f"Loaded {len(skills)} skills.")

    skill_errors = 0
    for pet in pets:
        if 'skills' in pet:
            for pet_skill in pet['skills']:
                skill_id = pet_skill.get('skill_id')
                if not skill_id:
                    print(f"Warning: Pet {pet['name']} ({pet['id']}) has a skill without an ID.")
                    continue
                
                if skill_id not in skill_map:
                    print(f"Error: Pet {pet['name']} ({pet['id']}) references unknown skill ID: {skill_id}")
                    skill_errors += 1
                else:
                    # Optional: Check if name matches (just a warning if not)
                    db_name = skill_map[skill_id]['name']
                    if pet_skill.get('name') != db_name:
                        print(f"Note: Pet {pet['name']} calls skill {skill_id} '{pet_skill.get('name')}', but DB name is '{db_name}'.")

    # 2. Verify Evolution Target IDs
    pet_map = {p['id']: p for p in pets}
    print(f"Loaded {len(pets)} soul pets.")

    evo_errors = 0
    for pet in pets:
        if 'evolutions' in pet:
            for evo in pet['evolutions']:
                target_id = evo.get('target_id')
                if target_id not in pet_map:
                    print(f"Error: Pet {pet['name']} ({pet['id']}) evolves into unknown ID: {target_id}")
                    evo_errors += 1

    print("\n--- Verification Summary ---")
    if skill_errors == 0 and evo_errors == 0:
        print("✅ Data verification PASSED! All references are valid.")
    else:
        print(f"❌ Data verification FAILED with {skill_errors} skill errors and {evo_errors} evolution errors.")

if __name__ == "__main__":
    verify_data()
