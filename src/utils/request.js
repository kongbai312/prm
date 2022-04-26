import axios from 'axios';
import store from '@/store'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'
import {Message} from 'element-ui'

const TimeOut = 3600 // 定义超时时间

const service = axios.create({
  baseURL:process.env.VUE_APP_BASE_API,//在env.development文件中配置的开发环境路径
  //npm run serve 是/api 而npm run build是/prod-api
  timeout: 5000 // 定义5秒超时
})

//请求拦截器
service.interceptors.request.use(
  (config)=>{
    if(store.getters.token){//如果token存在，注入token到请求中
      //token存在，检查时间戳是否过期
      //调用函数判断是否超时
      if(IsCheckTimeOut()){//如果超时
        //调用登出
        store.dispatch('user/logout')
        //跳转至登录页
        router.push('/login')
        //报出token超时
        return Promise.reject(new Error('token超时了'))
      }
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }

    return config
  },
  (error)=>{
    //
    return Promise.reject(error)
  }
)

//响应拦截器
service.interceptors.response.use(
  response=>{
    // console.log(response)
    const {success,message,data} = response.data
    //   要根据success的成功与否决定下面的操作
    if(success){
      return data
    }
    else{
      Message.error(message) // 提示错误消息
      return Promise.reject(new Error(message))
    }
  },
  error=>{
    // error 信息 里面 response的对象
    if (error.response && error.response.data && error.response.data.code === 10002) {
      // 当等于10002的时候 表示 后端告诉我token超时了
      store.dispatch('user/logout') // 登出action 删除token
      router.push('/login')
    }
    else{
      //弹出错误信息
      Message.error(error.message)
    }
    return Promise.reject(error)
  }
)

//判断时间戳是否超时
function IsCheckTimeOut(){
  const current = Date.now()
  const timeStamp = getTimeStamp()
  return (current - timeStamp)/1000 > TimeOut
}
export default service
