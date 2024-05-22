<template>
    <div class="w-[100vw] h-[100vh] flex flex-wrap justify-center items-center" style="	display: flex;">
        <div class="mb-5 m-lg-0 justify-center items-center">
            <div>發揮無限想像力，我的潮流我定義 <br>簡單幾步驟，輕鬆做出客製化小物 </div>
            <button @click="toCreatePage" class="min-w-[150px] w-[auto] h-[48px] mt-6 text-white bg-black rounded-3xl" tabindex="0" type="button">
                <span></span>
                <span class="w-full justify-center">開始設計 &gt;</span>
                <span></span>
            </button>
        </div>
    </div>
    <Teleport to="body">
      <dialogView v-if="dialogStatus" @close="cancel" type="auto">
        <template v-slot:title></template>
        <template v-slot:message>
          <div class="h-[20vh] text-2xl text-red-700 font-bold flex flex-wrap justify-center items-center">
            {{errorMessage}}
          </div>
        </template>
        <template v-slot:control></template>
      </dialogView>
    </Teleport>
  </template>

<script setup>
import { useRouter,useRoute } from "vue-router";
import { ref,computed,onMounted,watch,provide } from "vue";

const router = useRouter();
//設定背景
const toCreatePage = async(index) => {
    router.push({ name: 'create'});
}

onMounted(() => {
})
</script>
