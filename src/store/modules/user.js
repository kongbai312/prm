//引入设置token的函数
import {getToken,setToken,removeToken,setTimeStamp,getTimeStamp} from '@/utils/auth'
//引入api
import {login,getUserInfo,getUserDetailById} from '@/api/user'
//引入重置路由的方法
import {resetRouter} from '@/router'
const state = {
  token:getToken(),  //获取本地token
  userInfo:{},        //  用户信息
}

const mutations = {
  //设置token
  SET_TOKEN(state,token){
    state.token = token
    //同时更新本地
    setToken(token)
  },
  //清除token
  REMOVE_TOKEN(state){
    state.token = null
    //同时更新本地
    removeToken()
  },
  //设置用户信息
  SET_USERINFO(state,userInfo){
    state.userInfo = userInfo
  },
  //清除用户信息
  REMOVE_USERINFO(state){
    state.userInfo = {}
  }
}

const actions = {
  //登录
  async login({commit},data){
    const result = await login(data)
    // if(result.data.success){
    //   commit('SET_TOKEN',result.data.data)
    // }
    //经过响应拦截器统一处理后
    commit('SET_TOKEN',result)
    //存储时间戳
    setTimeStamp()
  },

  //获取用户信息
  async getUserInfo({commit}){
    const result = await getUserInfo()
    const baseInfo = await getUserDetailById(result.userId)
    //两部分数据解构统一存入
    commit('SET_USERINFO',{...result,...baseInfo})
    return result //为后期权限管理做准备
  },

  //退出登录
  logout({commit}){
    //清除token
    commit('REMOVE_TOKEN')
    //清除用户信息
    commit('REMOVE_USERINFO')
    //重置路由
    resetRouter()
    //重置routes
    //调用同为子模块的mutations actions 在第三个参数上加{root:true}
    commit('permission/setRoutes',[],{root:true})
  }

}
export default  {
  namespaced: true,
  state,
  mutations,
  actions
}
