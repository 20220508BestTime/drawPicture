<template>
    <div class="w-[10%] h-[100%] max-w-[120px] bg-blue-300">
        <div class="relative w-full h-auto p-2 flex flex-col justify-start items-center gap-[10px]">
            <div
                v-for="(item, index) in modeData" :key="index"
                @click="changeMode(index)"
                class="relative w-full h-auto p-2 flex flex-col justify-center items-center">
                <el-icon :size="80"><component :is="item.icon"></component></el-icon>
                <div>{{item.font}}</div>
            </div>
            
        </div>
    </div>
    <div class="relative w-[25%] h-[100%] max-w-[350px] bg-green-300 overflow-y-auto overflow-x-hidden">
        <div class="relative w-full h-full p-2 flex flex-col justify-start items-start gap-[10px]">
            <div class="w-full text-3xl flex flex-wrap justify-center items-center">{{modeData[mode-1].font}}</div>
            <template v-if="mode == 1">
                <div class="w-full h-auto flex flex-wrap justify-start items-center overflow-y-auto overflow-x-hidden gap-[10px]">
                    <input class="w-full" @change="onFileChangedBackground($event)" type="file" id="myFile" name="filename">
                    <div
                        v-for="(item, index) in backgronndImgUrl" :key="index"
                        class="w-auto h-auto flex flex-col justify-center items-center ">
                        <div
                            @click="setBackground(index)" 
                            class="w-[10vw] h-[10vw] max-w-[150px] max-h-[150px]">
                            <img class="w-full h-full" :src="item" alt="">
                        </div>
                        <button @click="delBackgroundFile(index)">刪除</button>
                    </div>
                </div>
            </template>
            <template v-if="mode == 2">
                <div class="w-full h-[45%] p-1 flex flex-wrap justify-start items-start overflow-y-auto overflow-x-hidden gap-[10px] bg-red-200">
                    <div class="w-auto h-auto flex flex-wrap justify-start items-start gap-[10px]">
                        <input class="w-full" @change="onFileChangedPicture($event)" type="file" id="myFile" name="filename">
                        <div
                            v-for="(item, index) in filePictureList" :key="index"
                            class="w-auto h-auto flex flex-col justify-center items-center ">
                            <div
                                @dragstart="choseImg(index)" 
                                class="w-[10vw] h-[10vw] max-w-[150px] max-h-[150px]">
                                <img class="w-full h-full" :src="item" alt="">
                            </div>
                            <button @click="delFile(index)">刪除</button>
                        </div>
                    </div>
                </div>
                
                <div class="w-full h-[45%] flex flex-col justify-start items-center bg-orange-400 gap-[5px]">
                    <button @click="cancelSelect">取消選取物件</button>
                    <button @click="delSelectObj">刪除已選物件</button>
                    <button @click="up">移到上一層</button>
                    <button @click="finalUp">移到最上層</button>
                    <button @click="down">移到後一層</button>
                    <button @click="finalDown">移到最底層</button>
                    <button @click="delAll">刪除全部</button>
                </div>
            </template>
            <template v-if="mode == 3">
                <div class="w-full h-[45%] p-1 flex flex-col justify-start items-start overflow-y-auto overflow-x-hidden gap-[10px] bg-red-200">
                    <div class="w-full h-auto px-2 flex flex-wrap justify-start items-center">
                        <div class="px-2">類型</div>
                        <div class="w-[70%]">
                            <el-select
                                v-model="graphForm.type"
                                class="m-2"
                                placeholder=""
                                @change="changeGraphOptions"
                            >
                                <el-option
                                    v-for="item in graphOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </div>
                    </div>
                    <div class="w-full h-auto px-2 flex flex-wrap justify-start items-center">
                        <template v-if="(graphForm.type == 'Ellipse') || (graphForm.type == 'Rect') || (graphForm.type == 'Triangle')">
                            <div class="px-2">大小</div>
                            <div class="grow w-[70%] flex flex-wrap justify-start items-center">
                                <div class="w-full flex flex-wrap justify-start items-center">
                                    <div class="w-[10%]">長</div>
                                    <div class="w-[90%]">
                                        <el-slider :min="30" :max="200" v-model="graphForm.height" />
                                    </div>
                                </div>
                                <div class="w-full flex flex-wrap justify-start items-center">
                                    <div class="w-[10%]">寬</div>
                                    <div class="w-[90%]">
                                        <el-slider :min="30" :max="200" v-model="graphForm.width" />
                                    </div>
                                </div>

                            </div>
                        </template>
                        <template v-else>
                            <div class="px-2">大小</div>
                            <div class="grow w-[70%]">
                                <el-slider :min="(graphForm.type == 'Line') ? 2 : 30" :max="(graphForm.type == 'Line') ? 10 : 200" v-model="graphForm.size" />
                            </div>
                        </template>
                        
                    </div>
                    <div class="w-full h-auto px-2 flex flex-wrap justify-start items-center">
                        <div class="px-2">顏色</div>
                        <el-color-picker @active-change="changeGraphColor" v-model="graphForm.color" />
                    </div>
                    
                    <div class="w-full h-auto flex flex-wrap justify-start items-center">
                        <button @click="addGraph(graphForm)" class="w-full">送出</button>
                    </div>
                    
                </div>
                
                <div class="w-full h-[45%] flex flex-col justify-start items-center bg-orange-400 gap-[5px]">
                    <button @click="cancelSelect">取消選取物件</button>
                    <button @click="delSelectObj">刪除已選物件</button>
                    <button @click="up">移到上一層</button>
                    <button @click="finalUp">移到最上層</button>
                    <button @click="down">移到後一層</button>
                    <button @click="finalDown">移到最底層</button>
                    <button @click="delAll">刪除全部</button>
                </div>
            </template>
            <template v-if="mode == 4">
                <div class="w-full h-[45%] p-1 flex flex-col justify-start items-start overflow-y-auto overflow-x-hidden gap-[10px] bg-red-200">
                    <div class="w-full h-auto flex flex-wrap justify-start items-center">
                        <input class="w-full px-1" type="text" v-model="textForm.text">
                    </div>
                    <div class="w-full h-auto px-2 flex flex-wrap justify-start items-center">
                        <div class="px-2">大小</div>
                        <div class="w-[70%]">
                            <el-slider :min="50" :max="300"  v-model="textForm.size" />
                        </div>
                    </div>
                    <div class="w-full h-auto px-2 flex flex-wrap justify-start items-center">
                        <div class="px-2">顏色</div>
                        <el-color-picker @active-change="changeColor" v-model="textForm.color" />
                    </div>
                    <div class="w-full h-auto px-2 flex flex-wrap justify-start items-center">
                        <div class="px-2">字型</div>
                        <div class="w-[70%]">
                            <el-select
                                v-model="textForm.fontFamily"
                                class="m-2"
                                placeholder=""
                            >
                                <el-option
                                    v-for="item in fontFamilyOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </div>
                    </div>
                    <div class="w-full h-auto flex flex-wrap justify-start items-center">
                        <button @click="addText(textForm)" class="w-full">送出</button>
                    </div>
                    
                </div>
                
                <div class="w-full h-[45%] flex flex-col justify-start items-center bg-orange-400 gap-[5px]">
                    <button @click="cancelSelect">取消選取物件</button>
                    <button @click="delSelectObj">刪除已選物件</button>
                    <button @click="up">移到上一層</button>
                    <button @click="finalUp">移到最上層</button>
                    <button @click="down">移到後一層</button>
                    <button @click="finalDown">移到最底層</button>
                    <button @click="delAll">刪除全部</button>
                </div>
            </template>
            <template v-if="mode == 5">
                <div class="w-full h-full flex flex-col justify-start items-center overflow-y-auto overflow-x-hidden gap-[10px]">
                    <button @click="exportJPG">匯出JPG</button>
                    <button @click="exportPNG">匯出PNG</button>
                    <button @click="exportPDF">匯出PDF</button>        
                </div>
            </template>
            
        </div>
        
    </div>
    
</template>

<script setup>
import { ref,computed,inject } from "vue";
import { useMobileStore } from '@/stores/index'

const mobileStore = useMobileStore()
const isMobile = computed(() => {
    return mobileStore.isMobile
})
const modeData = ref(
    [
        {
            icon:'PictureFilled',
            font:'背景'
        },
        {
            icon:'Picture',
            font:'圖片'
        },
        {
            icon:'PictureRounded',
            font:'圖形'
        },
        {
            icon:'Document',
            font:'文字'
        },
        {
            icon:'Files',
            font:'匯出'
        },
    ]
)
const graphForm = ref({
    type:'Circle',
    size:50,
    width:50,
    height:50,
    color:'#000000',
})
const graphOptions = [
    {
        value: 'Circle',
        label: '圓形',
    },
    {
        value: 'Ellipse',
        label: '橢圓',
    },
    {
        value: 'Line',
        label: '線條',
    },
    {
        value: 'Rect',
        label: '矩形',
    },
    {
        value: 'Triangle',
        label: '三角形',
    },

]
const textForm = ref({
    text:'',
    size:100,
    color:'#000000',
    fontWeight:400,
    fontFamily:'Arial'
})
const fontFamilyOptions = [
    {
        value: 'Arial',
        label: 'Arial',
    },
    {
        value: 'Verdana',
        label: 'Verdana',
    },
    {
        value: 'Tahoma',
        label: 'Tahoma',
    },
    {
        value: 'Trebuchet MS',
        label: 'Trebuchet MS',
    },
    {
        value: 'Times New Roman',
        label: 'Times New Roman',
    },
    {
        value: 'Georgia',
        label: 'Georgia',
    },
    {
        value: 'Garamond',
        label: 'Garamond',
    },
    {
        value: 'Courier New',
        label: 'Courier New',
    },
    {
        value: 'Brush Script MT',
        label: 'Brush Script MT',
    },
]
const mode = inject('mode')
const changeMode = inject('changeMode')
const onFileChangedBackground = inject('onFileChangedBackground')
const backgronndImgUrl = inject('backgronndImgUrl')
const setBackground = inject('setBackground')
const onFileChangedPicture = inject('onFileChangedPicture')
const filePictureList = inject('filePictureList')
const choseImg = inject('choseImg')
const delFile = inject('delFile')
const cancelSelect = inject('cancelSelect')
const delSelectObj = inject('delSelectObj')
const up = inject('up')
const finalUp = inject('finalUp')
const down = inject('down')
const finalDown = inject('finalDown')
const delAll = inject('delAll')
const addText = inject('addText')
const exportJPG = inject('exportJPG')
const exportPNG = inject('exportPNG')
const exportPDF = inject('exportPDF')
const delBackgroundFile = inject('delBackgroundFile')
const addGraph = inject('addGraph')
//文字顏色改變
const changeColor = (val) => {
    if(!val){
        textForm.value.color = '#000000'
    }
}
//文字顏色改變
const changeGraphColor = (val) => {
    if(!val){
        graphForm.value.color = '#000000'
    }
}
//選擇圖形改變
const changeGraphOptions = (val) => {
    if(val == 'Line'){
        graphForm.value.size = 3
    }else {
        graphForm.value.size = 50
    }
}
</script>
