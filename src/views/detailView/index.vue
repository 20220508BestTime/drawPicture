<template>
    <div class="w-[100vw] h-[100vh] flex flex-wrap justify-center items-center">
        <div ref="canvasDiv" id="canvasDiv" class="grow w-[65%] h-[100%] bg-slate-100 flex flex-wrap relative justify-center items-center">
            <div v-show="isLineShow" class="top-[10px] flex flex-col absolute items-center z-10">
                <span class="text-slate-500 text-sm">灰色實線：圖稿預留出血框(11.4 x 11.4 cm)，若有滿版底色請務必填滿至此。</span>
                <span class="text-red-700 text-sm">紅色實線：成品外框(11 x 11 cm)。</span>
                <span class="text-Indigo-800 text-sm">虛線：安全範圍(10.4 x 10.4 cm)，請將重要圖文限制在此虛線框內。</span>
            </div>
            <canvas id="canvas"></canvas>
            <div class="w-[56px] right-[40px] bottom-[40px] flex flex-col absolute items-center">
                <div
                    v-for="(item, index) in modeData" :key="index"
                    @click="changeMode(index)"
                    class="w-full h-auto p-2 flex flex-col justify-center items-center">
                    <button class="w-[64px] h-[64px] bg-white rounded-full flex justify-center items-center shadow-md">
                        <el-icon :size="28"><component :is="item.icon"></component></el-icon>
                    </button>
                    <span>{{item.font}}</span>
                </div>
            </div>
        </div>
        <detailMenu />
    </div>
    <!-- <div class="w-full h-full flex flex-wrap justify-center items-center text-2xl font-bold" v-else>
        不能用手機
    </div> -->
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
import { jsPDF } from "jspdf";
import { useMobileStore } from '@/stores/index'
import { fabric } from "fabric";
import { useElementSize } from '@vueuse/core'
import { ref,computed,onMounted,watch,provide } from "vue";
import { useRouter,useRoute } from "vue-router";
import dialogView from "@/components/dialogView.vue";
import detailMenu from "@/components/detailMenu.vue";
import img_1 from '@/assets/img/mat-2.png'
import img_2 from '@/assets/img/mat-2.png'
import img_3 from '@/assets/img/mat-2.png'
import img_4 from '@/assets/img/mat-2.png'
import img_1_line from '@/assets/img/mat-2-line.png'
import img_2_line from '@/assets/img/mat-2-line.png'
import img_3_line from '@/assets/img/mat-2-line.png'
import img_4_line from '@/assets/img/mat-2-line.png'

const modeData = ref(
    [
        {
            icon:'Picture',
            font:'圖片'
        },
        {
            icon:'CirclePlus',
            font:'圖形'
        },
        {
            icon:'EditPen',
            font:'文字'
        },
    ]
);

/*
mode 1背景 2圖片 3文字 4匯出
sizeObj 尺寸細項
*/
const mobileStore = useMobileStore()
const loading = ref(false)
const canvasDiv = ref(null)
const filePictureList = ref([])
provide('filePictureList', filePictureList)

const { width: canvasDivWidth, height: canvasDivHeight } = useElementSize(canvasDiv)
let canvas = null
const mode = ref(0)
provide('mode', mode)
const backgronndImgUrl = ref([
    img_1,
    img_2,
    img_3,
    img_4
])
const lineImgUrl = ref([
    img_1_line,
    img_2_line,
    img_3_line,
    img_4_line
])
provide('backgronndImgUrl',backgronndImgUrl)
let sizeObj = {
    backgroundWidth:0,
    backgroundHeight:0,
    imgWidth:0,
    imgHeight:0,
}
let choseFile = ''
const dialogStatus = ref(false)
const errorMessage = ref('')

//設定圖片尺寸
const getImgSize = (index) => {
    return new Promise((resolve, reject) => {
        let countHeight = 0
        let countWidth = 0
        let image = new Image()
        let chose = backgronndImgUrl.value[index || 0]
        image.src = chose;
        image.onload = () => {
            if(image.height>image.width){
                countHeight = 600
                countWidth = parseInt((countHeight*(image.width/image.height)).toFixed())
            }else{
                countWidth = 600
                countHeight = parseInt((countWidth*(image.height/image.width)).toFixed())
            }
            resolve({width:countWidth,height:countHeight})            
        };
        image.onerror = reject
    })
}

let imageLineObj = null;
const isLineShow = ref(false);
// 檢查是否選擇物件
const checkSelection = () => {
    let target = canvas.getActiveObject()
    if (target) {
        // 如果有選中的物件，顯示圖片
        if (imageLineObj) {
            isLineShow.value = true;
            imageLineObj.set('opacity', 1);
            canvas.renderAll();
        }
    } else {
        // 如果沒有選中的物件，隱藏圖片
        if (imageLineObj) {
            isLineShow.value = false;
            imageLineObj.set('opacity', 0);
            canvas.renderAll();
        }
    }
}
//渲染出血線
const setLine = async(index, imgData) => {
    // 加入出血線
    let chose_line = lineImgUrl.value[index || 0]
    fabric.Image.fromURL(chose_line, (img) => {
        let scale = Math.min(imgData.width / img.width, imgData.height / img.height);
        const oImg = img.set({
            left: 0,
            top: 0,
            scaleX: scale,
            scaleY: scale,
            selectable: false, // 設置圖片不可選擇 
            evented: false,
            opacity: 0 // 初始為隱藏
        });

        // 保存圖片對象但不添加到畫布
        imageLineObj = oImg;
        canvas.add(imageLineObj);
        canvas.renderAll();
    });

    canvas.on('selection:updated', checkSelection);
    canvas.on('selection:created', checkSelection);
    canvas.on('selection:cleared', checkSelection);
}

let imageBackgroundObj = null;
//渲染背景
const reBackground = async(index,imgData) => {
    let graphItem = new fabric.Rect({
        width: imgData.width, 
        height: imgData.height, 
        left: 0,
        top: 0,
        fill: "#FFFFFF",
        cornerStrokeColor: "#FFFFFF",
        borderColor:"#FFFFFF",
    })
    canvas.setBackgroundImage(graphItem).renderAll()

    let chose = backgronndImgUrl.value[index || 0]
    fabric.Image.fromURL(chose, (img) => {
        let scale = Math.min(imgData.width / img.width, imgData.height / img.height);
        const oImg = img.set({
            left: 0,
            top: 0,
            scaleX: scale,
            scaleY: scale,
            selectable: false, // 設置圖片不可選擇
            evented: false,
        })
        imageBackgroundObj = oImg;
        canvas.add(imageBackgroundObj);
        canvas.renderAll();
    })
}
//設定背景
const setBackground = async(index) => {

    if(loading.value){
        return false
    }
    loading.value = true

    await getImgSize(index).then((res)=> {

        sizeObj.backgroundWidth = canvasDivWidth.value
        sizeObj.backgroundHeight = canvasDivHeight.value
        sizeObj.imgWidth = res.width
        sizeObj.imgHeight = res.height

        createCanvas()
        reBackground(index, res)
        setLine(index, res)
    })
    loading.value = false
}
provide('setBackground', setBackground)
const route = useRoute()
const id = route.params.id
setBackground(id)

const bringLineToFront = () => {
    canvas.bringToFront(imageBackgroundObj);
    canvas.bringToFront(imageLineObj);
}

//切換模式
const changeMode = (val) => {
    mode.value = val
}
provide('changeMode', changeMode)
//從背景選單新增圖片
const onFileChangedBackground = async(event) => {
    if(checkFileType(event.target.files[0].type)){
        errorMessage.value = '請上傳正確圖片格式'
        dialogStatus.value = true
        return false
    }
    backgronndImgUrl.value.push(await toBase64(event.target.files[0]))
}
provide('onFileChangedBackground', onFileChangedBackground)
//刪除背景
const delBackgroundFile = (val) => {
    backgronndImgUrl.value.splice(val,1)
}
provide('delBackgroundFile', delBackgroundFile)
//從圖片選單新增圖片
const onFileChangedPicture = async(event) => {
    if(checkFileType(event.target.files[0].type)){
        errorMessage.value = '請上傳正確圖片格式'
        dialogStatus.value = true
        return false
    }
    filePictureList.value.push(await toBase64(event.target.files[0]))
}
provide('onFileChangedPicture', onFileChangedPicture)
//檢查檔案
const checkFileType = (type) => {
    let checkArr = ['png','jpeg','jpg']
    for(let item of checkArr){
        if(type.includes(item)){
            return false
        }
    }
    return true
}
//轉換檔案格式
const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});
//從圖片選單刪除圖片
const delFile = (val) => {
    filePictureList.value.splice(val,1)
}
provide('delFile', delFile)
//從圖片選單選擇圖片
const choseImg = (index) => {
    choseFile = filePictureList.value[index]
}
provide('choseImg', choseImg)
//拖曳事件處理
const dropImg = (e) => {
    if(mode.value !== 0){
        return false
    }

    let dropPosition = {
        left:e.e.offsetX,
        height:e.e.offsetY
    }
    
    fabric.Image.fromURL(choseFile, (myImg) => {
        let countHeight = 0
        let countWidth = 0

        if(myImg.height>myImg.width){
            countHeight = 200
            countWidth = parseInt((countHeight*(myImg.width/myImg.height)).toFixed())
        }else{
            countWidth = 200
            countHeight = parseInt((countWidth*(myImg.height/myImg.width)).toFixed())
        }

        const img = myImg.set({
            left: dropPosition.left,
            top: dropPosition.height,
            cornerStrokeColor: "#8A2BE2",
            borderColor:"#8A2BE2",
            // width:150,
            // height:150
        });
        
        img.scaleToHeight(countHeight)

        canvas.add(img).renderAll(); 
        bringLineToFront();
    });
}
//刪除已選物件
const delSelectObj = () => {
    let target = canvas.getActiveObject()

    if(target){
        canvas.remove(target);
        canvas.renderAll()
    }
    
    if(target?._objects?.length){
        for(let item of target?._objects){
            canvas.remove(item)
        }
        canvas.renderAll()
    }
}
provide('delSelectObj',delSelectObj)
//新增文字
const addText = (textObj) => {
    const text = new fabric.Text(textObj.text, {
        left: sizeObj.imgWidth/2,
        top: sizeObj.imgHeight/2,
        // left: 0,
        // top: 0,
        fill: textObj.color,
        fontFamily: textObj.fontFamily,// 字型
        fontSize: textObj.size, // 字體大小
        fontWeight: textObj.fontWeight,// 字體粗細
        cornerStrokeColor: "#8A2BE2",//設定框限控制方框顏色
        borderColor:"#8A2BE2",
    })
    canvas.add(text)
    cancelSelect()
    bringLineToFront()
}
provide('addText',addText)
//把物件往上一層
const up = () => {
    let target = canvas.getActiveObject()
    if(target){
        canvas.bringForward(target)
        canvas.renderAll()
        cancelSelect()
    }
}
provide('up',up)
//把物件移置最上層
const finalUp = () => {
    let target = canvas.getActiveObject()
    if(target){
        canvas.moveTo(target, canvas.getObjects().length - 1 - 2);
        // canvas.bringToFront(target)
        canvas.renderAll()
        cancelSelect()
    }
}
provide('finalUp',finalUp)
//把物件往下一層
const down = () => {
    let target = canvas.getActiveObject()
    if(target){
        let index = canvas.getObjects().indexOf(target);
        index++;
        if (index > canvas.getObjects().length - 1 - 2) {
            index = canvas.getObjects().length - 1 - 2;
        }
        canvas.moveTo(target, index);
        canvas.renderAll()
        cancelSelect()
    }
}
provide('down',down)
//把物件移置最底層
const finalDown = () => {
    let target = canvas.getActiveObject()
    if(target){
        canvas.sendToBack(target)
        canvas.renderAll()
        cancelSelect()
    }
}
provide('finalDown',finalDown)
//刪除畫布所有物件
const delAll = () => {
    let target = canvas.getObjects();

    if(target.length){
        for(let i = 0; i < (target.length - 2); i++){
            canvas.remove(target[i])
        }
        canvas.renderAll()
    }
}
provide('delAll',delAll)
//下載檔案
const downFile = (data) => {
    let downItem = document.createElement('a')
    downItem.download = '測試圖片'+ Date.now()
    downItem.href = data;
    downItem.click()
}
//輸出檔案
const exportJPG = () => {
    if (imageLineObj) {
        imageLineObj.set('opacity', 1);
        canvas.renderAll();
    }
    if (imageBackgroundObj) {
        imageBackgroundObj.set('opacity', 0);
        canvas.renderAll();
    }
    let data = canvas.toDataURL().replace('image/png','image/jpeg');
    if (imageLineObj) {
        imageLineObj.set('opacity', 0);
        canvas.renderAll();
    }
    if (imageBackgroundObj) {
        imageBackgroundObj.set('opacity', 1);
        canvas.renderAll();
    }
    downFile(data);
}
provide('exportJPG',exportJPG)
//輸出檔案
const exportPNG = () => {
    if (imageLineObj) {
        imageLineObj.set('opacity', 1);
        canvas.renderAll();
    }
    if (imageBackgroundObj) {
        imageBackgroundObj.set('opacity', 0);
        canvas.renderAll();
    }
    let data = canvas.toDataURL();
    if (imageLineObj) {
        imageLineObj.set('opacity', 0);
        canvas.renderAll();
    }
    if (imageBackgroundObj) {
        imageBackgroundObj.set('opacity', 1);
        canvas.renderAll();
    }
    downFile(data);
}
provide('exportPNG',exportPNG)
//輸出檔案
const exportPDF = () => {
    if (imageLineObj) {
        imageLineObj.set('opacity', 1);
        canvas.renderAll();
    }
    if (imageBackgroundObj) {
        imageBackgroundObj.set('opacity', 0);
        canvas.renderAll();
    }
    let data = canvas.toDataURL();
    if (imageLineObj) {
        imageLineObj.set('opacity', 0);
        canvas.renderAll();
    }
    if (imageBackgroundObj) {
        imageBackgroundObj.set('opacity', 1);
        canvas.renderAll();
    }
    const doc = new jsPDF('portrait','','a4');
    doc.addImage(data, "PNG", 5, 10);
    doc.save('測試圖片'+ Date.now() +".pdf");
}
provide('exportPDF',exportPDF)
//初始畫布
const createCanvas = () => {
    if(canvas){
        recoverCanvasDom()
    }

    canvas = new fabric.Canvas('canvas', {
        height: sizeObj.imgHeight, // 讓畫布以圖片比例縮放
        width: sizeObj.imgWidth, // 讓畫布以圖片比例縮放
        isDrawingMode: false, // 設置成 true 一秒變身小畫家
        hoverCursor: 'progress', // 移動時鼠標顯示
        freeDrawingCursor: 'all-scroll', // 畫畫模式時鼠標模式
        backgroundColor: 'rgb(244,244,244)', // 背景色,
    })

    canvas.on('drop', dropImg)
}

// 解決套件刪除問題
const recoverCanvasDom = () => {
    let canvasContainerCanvasDom = document.getElementsByClassName("canvas-container");
    if(canvasContainerCanvasDom.length){
        canvasContainerCanvasDom[0].remove();
        let canvasDivDom = document.getElementById("canvasDiv");
        let newCanvasDom = document.createElement('canvas');
        newCanvasDom.id = 'canvas'
        canvasDivDom.append(newCanvasDom);
    }
}
// 取消選取物件
const cancelSelect = () => {
    canvas.discardActiveObject().renderAll();
}
provide('cancelSelect',cancelSelect)
//關閉彈出視窗
const cancel = () => {
    dialogStatus.value = false
}
//新增圖形
const addGraph = (obj) => {
    let graphItem = null
    if(obj.type == "Circle"){
        graphItem = new fabric.Circle({
            radius: obj.size,
            fill: obj.color,
            left: sizeObj.imgWidth/2,
            top: sizeObj.imgHeight/2,
            cornerStrokeColor: "#8A2BE2",
            borderColor:"#8A2BE2",
        })
        
    }else if(obj.type == "Ellipse"){
        graphItem = new fabric.Ellipse({
            rx: obj.width, // 必有欄位
            ry: obj.height, // 必有欄位
            left: sizeObj.imgWidth/2,
            top: sizeObj.imgHeight/2,
            fill: obj.color,
            cornerStrokeColor: "#8A2BE2",
            borderColor:"#8A2BE2",
        })
    }else if(obj.type == "Line"){
        graphItem = new fabric.Line(
            [
                (sizeObj.imgWidth/2-100), (sizeObj.imgHeight/2), // 開始座標
                (sizeObj.imgWidth/2+100), (sizeObj.imgHeight/2) // 結束座標
            ], {
            stroke: obj.color,
            strokeWidth: obj.size, // 必有欄位
            left: sizeObj.imgWidth/2,
            top: sizeObj.imgHeight/2,
            cornerStrokeColor: "#8A2BE2",
            borderColor:"#8A2BE2",
        })
    }else if(obj.type == 'Rect'){
        graphItem = new fabric.Rect({
            width: obj.width, // 必有欄位
            height: obj.height, // 必有欄位
            left: sizeObj.imgWidth/2,
            top: sizeObj.imgHeight/2,
            fill: obj.color,
            cornerStrokeColor: "#8A2BE2",
            borderColor:"#8A2BE2",
        })
    }else if(obj.type == 'Triangle'){
        graphItem = new fabric.Triangle({
            width: obj.width, // 必有欄位
            height: obj.height, // 必有欄位
            left: sizeObj.imgWidth/2,
            top: sizeObj.imgHeight/2,
            fill: obj.color,
            cornerStrokeColor: "#8A2BE2",
            borderColor:"#8A2BE2",
        })
    }

    if(graphItem){
        canvas.add(graphItem).renderAll()
        bringLineToFront()
    }
    
}
provide('addGraph',addGraph)

onMounted(() => {

    // // 變更所有物件畫出的控制項
    // fabric.Object.prototype.drawControls = function (ctx, styleOverride) {
    //     // 複寫他，改成什麼都不畫
    // }
    
    setBackground()
    
})

</script>
