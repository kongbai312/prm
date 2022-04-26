//引入封装好的axios
import request from '@/utils/request'

//获取员工简单列表
export function getEmployeeSimple(){
  return request({
    url:'/sys/user/simple',
    method:'GET'
  })
}


//获取员工的综合列表数据
// Query
// 参数名称	是否必须	示例	备注
// page	是	1	页码
// size	是	10	每页条数
 export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    method:'GET',
    params
  })
}


//删除员工接口
 export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

//新增员工的接口
 export function addEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

//批量导入员工 data为数组
 export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

//保存员工的基本信息
 export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

//读取用户详情的基础信息
 export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

//更新用户详情的基础信息
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

//获取用户的岗位信息
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`,
    method:'get'
  })
}

//保存岗位信息
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

//给用户分配角色
// id	string	非必须
// roleIds	string []	非必须
 export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'put',
    data
  })
}
