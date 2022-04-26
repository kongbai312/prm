import Vue from 'vue'
import VueI18n from 'vue-i18n' // 引入国际化的包
import Cookie from 'js-cookie' // 引入cookie包
import elementEN from 'element-ui/lib/locale/lang/en' // 引入element的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入element的中文包
import elementJA from 'element-ui/lib/locale/lang/ja' // 引入element的日文包
import customZH from './zh' // 引入自定义中文包
import customEN from './en' // 引入自定义英文包
Vue.use(VueI18n)

export default new VueI18n({
  locale:Cookie.get('language') || 'en', // 从cookie中获取语言类型 获取不到就是中文
  messages:{
    en: {
      ...elementEN, // 将element的英文语言包引入
      ...customEN
    },
    zh: {
      ...elementZH, // 将element的中文语言包引入
      ...customZH
    },
    ja:{
      ...elementJA // 将element的日文语言包引入
    }
  }
})
