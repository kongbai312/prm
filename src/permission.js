import router from '@/router'
import store from '@/store'

//进度条
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/404','/login']
//导航前置守卫
router.beforeEach(async (to,from,next)=>{
  //进度条开始
  NProgress.start()
  if(store.getters.token){//如果token存在
    if(to.path==='/login'){//如果是去登录页
      next('/')//跳转到主页
    }
    else{
      //判断用户资料是否存在
      if(!store.getters.userId){//如果不存在
        //获取用户资料
        const { roles } = await store.dispatch('user/getUserInfo')//注意开启了命名空间
        // routes就是筛选得到的路由
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // addRoutes  必须 用 next(地址) 不能用next()
        //404必须加在最后的路由上，否则刷新会出现404
        router.addRoutes([...routes,{ path: '*', redirect: '/404', hidden: true }])
        // 添加完动态路由之后
        next(to.path)
        // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
        //进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里
        //多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
      }
      else{
        next()//直接放行
      }
    }
  }
  else{//token不存在
    if(whiteList.indexOf(to.path)!==-1){//如果在白名单
      next()//通行
    }
    else{//如果不在白名单
      next('/login')//跳转到登录页
    }
  }
  //进度条结束
  NProgress.done()
})

//导航后置钩子
router.afterEach(()=>{
  NProgress.done()
})
