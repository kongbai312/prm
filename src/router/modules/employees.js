//设置员工部分的路由规则
import Layout from '@/layout'
export default {
  path:'/employees',
  name:'employees',
  component:Layout,
  children:[
    {
      path:'',//这里当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由
      component:()=>import('@/views/employees'),
      name:'employees',
      meta:{
        // meta属性的里面的属性 随意定义 但是这里为什么要用title呢
        //因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
        title:'员工管理',
        icon:'people'
      }
    },
    {
      path:'detail/:id',
      component:()=>import('@/views/employees/detail.vue'),
      hidden:true,    //不显示在左边导航栏
      meta:{
        title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      }
    },
    {
      path: 'print/:id', // 二级默认路由
      component: () => import('@/views/employees/print'), // 按需加载
      hidden: true,
      meta: {
        title: '打印', // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
        icon: 'people'
      }
    }
  ]
}
