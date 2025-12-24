<script setup>
import { computed } from 'vue';

const props = defineProps({
  pet: {
    type: Object,
    required: true
  }
});

const rankColor = computed(() => {
  switch (props.pet.rank) {
    case '奴仆级': return 'text-gray-500';
    case '战将级': return 'text-green-600';
    case '统领级': return 'text-blue-600';
    case '君主级': return 'text-purple-600';
    case '帝皇级': return 'text-orange-500';
    default: return 'text-gray-800';
  }
});

const elementColor = (ele) => {
    switch (ele) {
        case '火': return 'bg-red-100 text-red-800';
        case '冰': return 'bg-cyan-100 text-cyan-800';
        case '木': return 'bg-green-100 text-green-800';
        case '虫': return 'bg-lime-100 text-lime-800';
        case '妖灵': return 'bg-purple-100 text-purple-800';
        case '兽': return 'bg-yellow-100 text-yellow-800';
        case '龙': return 'bg-indigo-100 text-indigo-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}
</script>

<template>
  <div class="border rounded-lg p-4 shadow-md bg-white w-72">
    <div class="flex justify-between items-baseline mb-2">
      <h3 class="text-xl font-bold">{{ pet.name }}</h3>
      <span :class="['text-sm font-semibold', rankColor]">{{ pet.rank }}</span>
    </div>
    
    <div class="flex gap-2 mb-3">
      <span v-for="ele in pet.elements" :key="ele" 
        :class="['px-2 py-0.5 rounded text-xs', elementColor(ele)]">
        {{ ele }}
      </span>
    </div>

    <p class="text-gray-600 text-sm mb-4 italic">{{ pet.description }}</p>

    <div class="space-y-1 text-sm">
      <div class="flex justify-between">
        <span>HP:</span>
        <span class="font-mono">{{ pet.base_stats.health }}</span>
      </div>
      <div class="flex justify-between">
        <span>体力:</span>
        <span class="font-mono">{{ pet.base_stats.stamina }}</span>
      </div>
      <div class="flex justify-between">
        <span>攻击:</span>
        <span class="font-mono">{{ pet.base_stats.attack }}</span>
      </div>
      <div class="flex justify-between">
        <span>防御:</span>
        <span class="font-mono">{{ pet.base_stats.defense }}</span>
      </div>
      <div class="flex justify-between">
        <span>速度:</span>
        <span class="font-mono">{{ pet.base_stats.speed }}</span>
      </div>
    </div>

    <div class="mt-4">
      <h4 class="font-semibold text-sm mb-1">技能池:</h4>
      <ul class="text-xs space-y-1">
        <li v-for="skill in pet.skills" :key="skill.name">
           <span class="text-gray-500">[Lv.{{ skill.learn_level }}]</span> {{ skill.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
