//用来管理路由权限

//静态路由
import {constantRoutes} from '@/router'
//动态路由
import asyncRoutes from '@/router/modules'
const state = {
  routes:constantRoutes       // 所有人默认拥有静态路由
}

const mutations = {
  // newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部分
  setRoutes(state,newRoutes){
    // 每次更新 都应该在静态路由的基础上进行追加
    state.routes = [...constantRoutes,...newRoutes]
  }
}

const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户的所拥有的菜单权限
  // menus: ["settings","permissions"]
  // asyncRoutes是所有的动态路由
  // asyncRoutes  [{path: 'setting',name: 'setting'},{}]
  filterRoutes({commit},menus){
    const routes = []
    menus.forEach(key=>{
      const arr = asyncRoutes.filter(item=>{
        //asyncRoutes 找 有没有对象中的name属性等于 key的 如果找不到就没权限 如果找到了 要筛选出来
        return item.name === key
      })
      // 得到的routes是所有模块中满足权限要求的路由数组
      routes.push(...arr)
    })
    commit('setRoutes', routes) // 将动态路由提交给mutations
    return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
  }
}

export default{
  namespaced:true,
  state,
  mutations,
  actions
}
