<template>
    <div
        @click="close"
        class="transition-all fixed w-full h-full left-0 top-0 bg-slate-800 opacity-50 flex flex-wrap justify-center items-center"
        :style="{ 'z-index': layer }"
    >
    </div>
    <div
        @click.self="close"
        class="absolute left-0 top-0 w-full h-full flex flex-col justify-center items-center" 
        :style="{ 'z-index': layer }">
        <div 
            :class="{ 
                'w-[270px] h-[450px] md:w-[400px] md:h-[600px] ' : type == 'default',
                'w-[90vw] h-[450px] md:w-[700px] md:h-[600px] ' : type == 'large',
                'w-[270px] h-[280px] md:w-[500px] md:h-[300px] ' : type == 'small',
                'w-[90vw] md:w-[700px] h-auto max-h-[70vh]' : type == 'auto'
            }"
            class="animate__animated animate__bounceIn rounded-lg bg-white flex flex-col justify-center items-center "
        >
            <div
                v-if="closeStatus"
                @click="close" 
                class="absolute w-auto h-auto top-0 right-0 p-2 flex flex-wrap justify-center items-center cursor-pointer">
                <el-icon size="30"><Close /></el-icon>
            </div>
            <slot name="title"></slot>
            <slot name="message"></slot>
            <slot name="control"></slot>
        </div>
    </div>
</template>

<script setup>
/*eslint-disable*/
import 'animate.css';
import { ref,computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter()

const props = defineProps({
    type: {
        type: String,
        default: 'default'
    },
    closeStatus:{
        type:Boolean,
        default:true
    },
    layer:{
        type:String,
        default:'1000'
    },
})

const emit = defineEmits(['close'])

const isMobile = computed(() => {
    return store.state.isMobile
})

const close = () => {
    // console.log('close')
    emit('close')
}

</script>

<style lang="scss" scoped>

</style>