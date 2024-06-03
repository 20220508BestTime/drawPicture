<template>
    <div class="relative w-[25%] h-[100%] max-w-[350px] bg-slate-50 overflow-y-auto overflow-x-hidden">
        <div class="relative w-full h-full p-2 flex flex-col justify-start items-start gap-[10px]">
            <div class="w-full text-3xl flex flex-wrap justify-center items-center">{{modeData[mode].font}}</div>
            <div class="w-full text-3xl flex flex-wrap justify-center items-center border-b-2"></div>
            <template v-if="mode == 0">
                <div class="w-full h-[7%] min-h-[56px] p-1 flex flex-wrap justify-center items-start overflow-y-auto overflow-x-hidden gap-[10px]">
                    <div class="w-auto h-auto flex flex-wrap justify-center items-center gap-[10px]">
                        <input class="w-full" @change="onFileChangedPicture($event)" ref="myFile" type="file" id="myFile" name="filename" style="display: none;">
                        <button @click="triggerMyFile()" class="min-w-[280px] w-[auto] h-[36px] mt-2 text-white bg-blue-500 rounded-sm shadow-md font-bold">
                            <el-icon :size="20"><UploadFilled /></el-icon> 上傳
                        </button>
                    </div>
                </div>
                <div class="w-full h-[42%] p-1 flex flex-wrap justify-center items-start overflow-y-auto overflow-x-hidden gap-[10px]">
                    <div class="w-auto h-auto flex flex-wrap justify-center items-center gap-[10px]">
                        <div
                            v-for="(item, index) in filePictureList" :key="index"
                            class="w-[120px] h-[200px] flex flex-col relative">
                            <div
                                @dragstart="choseImg(index)" 
                                class="w-[120px] min-h-[120px] max-h-[120px]">
                                <img class="w-full h-full object-cover" :src="item" alt="">
                            </div>
                            <button class="h-[28px] mt-6 text-white bg-slate-900 rounded-sm shadow-md font-bold" @click="delFile(index)">
                                刪除
                            </button>
                        </div>
                    </div>
                </div>
            </template>
            <template v-if="mode == 1">
                <div class="w-full h-[50%] p-1 flex flex-col justify-start items-start overflow-y-auto overflow-x-hidden gap-[10px]">
                    <div class="w-full h-auto px-4 flex flex-wrap justify-start items-center">
                        <div class="px-2">類型</div>
                    </div>
                    <div class="w-full h-auto px-4 flex flex-wrap justify-start items-center">
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
                    <div class="w-full h-auto px-4 flex flex-wrap justify-start items-center">
                        <div class="px-2">大小</div>
                    </div>
                    <template v-if="(graphForm.type == 'Ellipse') || (graphForm.type == 'Rect') || (graphForm.type == 'Triangle')">
                        <div class="w-full h-auto px-6 flex flex-wrap justify-start items-center">
                            <div class="w-[10%]">長</div>
                            <div class="w-[90%]">
                                <el-slider :min="30" :max="200" v-model="graphForm.height" />
                            </div>
                        </div>
                        <div class="w-full h-auto px-6 flex flex-wrap justify-start items-center">
                            <div class="w-[10%]">寬</div>
                            <div class="w-[90%]">
                                <el-slider :min="30" :max="200" v-model="graphForm.width" />
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="w-full h-auto px-6 flex flex-wrap justify-start items-center">
                            <el-slider :min="(graphForm.type == 'Line') ? 2 : 30" :max="(graphForm.type == 'Line') ? 10 : 200" v-model="graphForm.size" />
                        </div>
                    </template>
                    <div class="w-full h-auto px-4 flex flex-wrap justify-start items-center">
                        <div class="px-2">顏色</div>
                    </div>
                    <div class="w-full h-auto px-6 flex flex-wrap justify-start items-center">
                        <el-color-picker @active-change="changeGraphColor" v-model="graphForm.color" />
                    </div>
                    <div class="w-full h-auto flex flex-wrap justify-center items-center">
                        <button class="min-w-[280px] w-[auto] h-[36px] mt-2 text-white bg-blue-500 rounded-sm shadow-md font-bold" @click="addGraph(graphForm)">送出</button>
                    </div>
                </div>
            </template>
            <template v-if="mode == 2">
                <div class="w-full h-[50%] p-1 flex flex-col justify-start items-start overflow-y-auto overflow-x-hidden gap-[10px]">
                    <div class="w-full h-auto px-4 flex flex-wrap justify-start items-center">
                        <div class="px-2">文字</div>
                    </div>
                    <div class="w-full h-auto px-4 flex flex-wrap justify-start items-center">
                        <el-input class="m-2" type="text" v-model="textForm.text">
                        </el-input>
                    </div>
                    <div class="w-full h-auto px-4 flex flex-wrap justify-start items-center">
                        <div class="px-2">字型</div>
                    </div>
                    <div class="w-full h-auto px-4 flex flex-wrap justify-start items-center">
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
                    <div class="w-full h-auto px-4 flex flex-wrap justify-start items-center">
                        <div class="px-2">大小</div>
                    </div>
                    <div class="w-full h-auto px-6 flex flex-wrap justify-start items-center">
                        <el-slider :min="50" :max="300"  v-model="textForm.size" />
                    </div>
                    <div class="w-full h-auto px-4 flex flex-wrap justify-start items-center">
                        <div class="px-2">顏色</div>
                    </div>
                    <div class="w-full h-auto px-6 flex flex-wrap justify-start items-center">
                        <el-color-picker @active-change="changeColor" v-model="textForm.color" />
                    </div>
                    <div class="w-full h-auto flex flex-wrap justify-center items-center">
                        <button class="min-w-[280px] w-[auto] h-[36px] mt-2 text-white bg-blue-500 rounded-sm shadow-md font-bold" @click="addText(textForm)">送出</button>
                    </div>                    
                </div>
            </template>
            <template v-if="mode == 3">
                <div class="w-full h-[75%] flex flex-col justify-start items-center overflow-y-auto overflow-x-hidden gap-[10px]">
                </div>
                <div class="w-full h-[25%] mb-2 flex flex-col justify-end  items-center gap-[5px]">
                    <button class="min-w-[280px] w-[auto] h-[36px] mt-2 text-white bg-yellow-500 rounded-sm shadow-md font-bold" @click="exportJPG">匯出JPG</button>
                    <button class="min-w-[280px] w-[auto] h-[36px] mt-2 text-white bg-yellow-500 rounded-sm shadow-md font-bold" @click="exportPNG">匯出PNG</button>
                    <button class="min-w-[280px] w-[auto] h-[36px] mt-2 text-white bg-yellow-500 rounded-sm shadow-md font-bold" @click="exportPDF">匯出PDF</button>
                    <button class="min-w-[280px] w-[auto] h-[36px] mt-2 text-white bg-slate-500 rounded-sm shadow-md font-bold" @click="toPage()">上一頁</button>
                </div>
            </template>
            <div class="w-full text-3xl flex flex-wrap justify-center items-center border-b-2"></div>
            <template v-if="mode != 3">
                <div class="w-full h-[35%] flex flex-col justify-end items-center gap-[5px]">
                    <button class="min-w-[280px] w-[auto] h-[36px] mt-2 text-white bg-slate-900 rounded-sm shadow-md font-bold" @click="cancelSelect">取消選取物件</button>
                    <button class="min-w-[280px] w-[auto] h-[36px] mt-2 text-white bg-slate-900 rounded-sm shadow-md font-bold" @click="delSelectObj">刪除已選物件</button>
                    <button class="min-w-[280px] w-[auto] h-[36px] mt-2 text-white bg-slate-900 rounded-sm shadow-md font-bold" @click="up">移到上一層</button>
                    <button class="min-w-[280px] w-[auto] h-[36px] mt-2 text-white bg-slate-900 rounded-sm shadow-md font-bold" @click="finalUp">移到最上層</button>
                    <button class="min-w-[280px] w-[auto] h-[36px] mt-2 text-white bg-slate-900 rounded-sm shadow-md font-bold" @click="down">移到後一層</button>
                    <button class="min-w-[280px] w-[auto] h-[36px] mt-2 text-white bg-slate-900 rounded-sm shadow-md font-bold" @click="finalDown">移到最底層</button>
                    <button class="min-w-[280px] w-[auto] h-[36px] mt-2 text-white bg-slate-900 rounded-sm shadow-md font-bold" @click="delAll">刪除全部</button>
                </div>
                <div class="w-full h-[15%] mb-2 flex flex-col justify-end items-center gap-[5px]">
                    <button class="min-w-[280px] w-[auto] h-[36px] mt-2 text-white bg-yellow-500 rounded-sm shadow-md font-bold" @click="changeMode(3)">完成</button>
                    <button class="min-w-[280px] w-[auto] h-[36px] mt-2 text-white bg-slate-500 rounded-sm shadow-md font-bold" @click="toPage()">上一頁</button>
                </div>
            </template>        
        </div>        
    </div>
</template>

<script setup>
import { ref,computed,inject } from "vue";
import { useRouter,useRoute } from "vue-router";

const modeData = ref(
    [
        {
            icon:'Picture',
            font:'上傳圖片'
        },
        {
            icon:'CirclePlus',
            font:'新增圖形'
        },
        {
            icon:'EditPen',
            font:'新增文字'
        },
        {
            icon:'',
            font:'匯出'
        },
    ]
);

const graphForm = ref({
    type:'Circle',
    size:50,
    width:50,
    height:50,
    color:'#000000',
});

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
];

const textForm = ref({
    text:'',
    size:100,
    color:'#000000',
    fontWeight:400,
    fontFamily:'Arial'
});

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
];

const mode = inject('mode');
const changeMode = inject('changeMode');
const onFileChangedBackground = inject('onFileChangedBackground');
const backgronndImgUrl = inject('backgronndImgUrl');
const setBackground = inject('setBackground');
const onFileChangedPicture = inject('onFileChangedPicture');
const filePictureList = inject('filePictureList');
const choseImg = inject('choseImg');
const delFile = inject('delFile');
const cancelSelect = inject('cancelSelect');
const delSelectObj = inject('delSelectObj');
const up = inject('up');
const finalUp = inject('finalUp');
const down = inject('down');
const finalDown = inject('finalDown');
const delAll = inject('delAll');
const addText = inject('addText');
const exportJPG = inject('exportJPG');
const exportPNG = inject('exportPNG');
const exportPDF = inject('exportPDF');
const delBackgroundFile = inject('delBackgroundFile');
const addGraph = inject('addGraph');

const myFile = ref(null);
const triggerMyFile = () => {
    myFile.value.click();
}
//文字顏色改變
const changeColor = (val) => {
    if(!val){
        textForm.value.color = '#000000';
    }
}
//文字顏色改變
const changeGraphColor = (val) => {
    if(!val){
        graphForm.value.color = '#000000';
    }
}
//選擇圖形改變
const changeGraphOptions = (val) => {
    if(val == 'Line'){
        graphForm.value.size = 3;
    }else {
        graphForm.value.size = 50;
    }
}
const router = useRouter();
const toPage = async(index) => {
    router.push({ name: 'mat'});
}
</script>
