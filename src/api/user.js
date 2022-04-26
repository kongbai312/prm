import request from '@/utils/request'

//用户登录
export function login(data) {
  return request({
    url:'/sys/login',
    method:'POST',
    data
  })
}

//获取用户信息
export function getUserInfo() {
  return request({
    url:'/sys/profile',
    method:'POST'
  })
}

//获取员工的基本信息
export function getUserDetailById(id){
  return request({
    url:`/sys/user/${id}`,
    method:'GET'
  })
}

