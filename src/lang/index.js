/*eslint-disable*/
import { createI18n } from 'vue-i18n'
import twLocale from './zh_tw'
import enLocale from './en'
import jpLocale from './jp'
const messages = {
    en: enLocale,
    ja: jpLocale,
    zh_tw: twLocale
}

export const getLanguage = () => {
  return 'zh_tw' // 沒選擇語言的時候，預設轉到繁體中文
}

export const setLanguage = (language) => {
  i18n.locale = language
}

export const i18n = new createI18n ({
    globalInjection: true,
    legacy: false,
    // set locale
    // options: en | zh | es
    locale: getLanguage(),
    messages:messages,
    // 避免i18n會因為一點小事刷你整頁的console
    silentTranslationWarn: true,
})