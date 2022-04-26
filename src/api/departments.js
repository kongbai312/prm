//引入封装好的axios
import request from '@/utils/request'

//查询企业的部门列表
export function getDepartments(){
  return request({
    url:'/company/department',
    method:'GET'
  })
}

//添加部门
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

//根据ID删除部门
export function delDepartments(id){
  return request({
    url:`/company/department/${id}`,
    method:'Delete'
  })
}

//根据id查询部门信息
export function getDepartDetail(id){
  return request({
    url:`/company/department/${id}`,
    method:'GET'
  })
}

//根据ID修改部门详情
export function updateDepartments(data){
  return request({
    url:`/company/department/${data.id}`,
    method:'PUT',
    data
  })
}
