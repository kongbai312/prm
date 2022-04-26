//设置公司设置部分的路由规则
import Layout from '@/layout'
export default {
  path:'/setting',
  name:'settings',
  component:Layout,
  children:[
    {
      path:'',//这里当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由
      component:()=>import('@/views/setting'),
      name:'settings',
      meta:{
        // meta属性的里面的属性 随意定义 但是这里为什么要用title呢
        //因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
        title:'公司设置',
        icon:'setting'
      }
    }
  ]
}
