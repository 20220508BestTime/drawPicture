import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(3)
  const doubleCount = computed(() => count.value * 2)
  function increment(value) {
    count.value+=value
  }

  return { count, doubleCount, increment }
})
