<template>
    <div>
        <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
            <img src="@/assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
    </div>
    <div class="bg-red-600">test package</div>
    <div class="w-full flex flex-wrap justify-center items-center">
        <div>{{count}}</div>
        <button @click="addCount">add</button>
    </div>
    <div class="w-full h-[20px] bg-blue-400 mine-flex-center">center</div>
    <div class="w-full h-[20px] bg-green-300 mine-flex-center">{{t('header')}}</div>
    <div class="w-full h-[20px] bg-purple-300 mine-flex-center">
        <button @click="changeFont('en')">en</button>
        <button @click="changeFont('ja')">ja</button>
        <button @click="changeFont('zh_tw')">zh_tw</button>
    </div>
    <!-- <div>
        <el-input></el-input>
    </div> -->
    <HelloWorld msg="Vite + Vue" />
</template>

<script setup>
import { getLanguage, setLanguage } from "@/lang"
import {useCounterStore} from '../stores/counter'
import HelloWorld from '@/components/HelloWorld.vue'
import { ref,computed } from "vue";
import { useRouter,useRoute } from "vue-router";
import { useI18n } from 'vue-i18n'

const { t,locale } = useI18n()
console.log('messages',useI18n())

const counterStore = useCounterStore()
const count = computed(() => {
  return counterStore.count
})

const addCount = () => {
    counterStore.increment(2)
}

const changeFont = (value) => {
    locale.value = value
}

console.log('home page')
</script>