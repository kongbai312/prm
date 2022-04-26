import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import Components from '@/components'

import * as directive from '@/directives'

import checkPermission from '@/mixin/checkPermission'
//引入过滤器
import * as filters from '@/filters'
//引入语言切换
import i18n from '@/lang/index'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

//因为如果存在多个自定义指令，得一次性导入
Object.keys(directive).forEach((key)=>{
  Vue.directive(key,directive[key])
})

//注册全局过滤器
Object.keys(filters).forEach(key=>{
  Vue.filter(key,filters[key])
})

//注册全局mixin
Vue.mixin(checkPermission)

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI,{
  i18n: (key, value) => i18n.t(key, value)
})

//组测全局组件
Vue.use(Components)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
