import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import './assets/css/none.css'
import './assets/css/tailwind.css'
import './assets/css/all.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhTW from 'element-plus/dist/locale/zh-tw.mjs'
import {i18n} from './lang'

const app = createApp(App)
const pinia = createPinia()

app.use(ElementPlus, {
    locale: zhTW,
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(i18n)
app.use(pinia)
app.use(router)
app.mount('#app')
