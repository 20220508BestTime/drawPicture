<template>
    <div class="w-[100vw] h-[100vh] flex flex-wrap justify-center items-center" style="	display: flex;">
        <div class="mb-5 m-lg-0 justify-center items-center">
            <button @click="toPage(0)" class="min-w-[150px] w-[auto] h-[48px] mt-6 text-black rounded-3xl" tabindex="0" type="button">
                <img :src="img_mat" alt="" width="300px" height="auto" />
                圓形地毯 直徑60 (cm) NT$590
            </button>
            <button @click="toPage(1)" class="min-w-[150px] w-[auto] h-[48px] mt-6 text-black rounded-3xl" tabindex="0" type="button">
                <img :src="img_mat" alt="" width="300px" height="auto" />
                圓形地毯 直徑70 (cm) NT$690
            </button>
            <button @click="toPage(2)" class="min-w-[150px] w-[auto] h-[48px] mt-6 text-black rounded-3xl" tabindex="0" type="button">
                <img :src="img_mat" alt="" width="300px" height="auto" />
                圓形地毯 直徑80 (cm) NT$790
            </button>
            <button @click="toPage(3)" class="min-w-[150px] w-[auto] h-[48px] mt-6 text-black rounded-3xl" tabindex="0" type="button">
                <img :src="img_mat" alt="" width="300px" height="auto" />
                圓形地毯 直徑90 (cm) NT$890
            </button>
        </div>
    </div>
  </template>

<script setup>
import { useRouter,useRoute } from "vue-router";
import { ref,computed,onMounted,watch,provide } from "vue";
import img_mat from '@/assets/img/mat-1.png'

const router = useRouter();
//設定背景
const toPage = async(index) => {
    router.push({ name: 'detail', params: { id: index }});
}

onMounted(() => {
})
</script>
