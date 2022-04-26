//用来组测全局组件
import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/UploadExcel'
import ImageUpload from '@/components/ImageUpload'
import Print from 'vue-print-nb'
import ScreenFull from '@/components/ScreenFull'
import ThemePicker from '@/components/ThemePicker'
import Lang from '@/components/lang'
import TagsView from '@/components/TagsView'
//因为Vue.use()会默认调用install函数
export default {
  install(Vue){
    Vue.component('PageTools',PageTools)
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component('ImageUpload',ImageUpload)
    Vue.use(Print);                       //注册打印
    Vue.component('ScreenFull',ScreenFull)    //注册使用全屏组件
    Vue.component('ThemePicker',ThemePicker)  //注册更改主题色的组件
    Vue.component('Lang',Lang)  //注册切换语言的组件
    Vue.component('TagsView', TagsView) //注册多页签组件
  }
}
