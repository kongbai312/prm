//引入封装好的axios
import request from '@/utils/request'

//获取角色列表
// 需要参数 Query
//参数名称	是否必须	示例	备注
// page	是	1	页码
// pagesize	是	10	每页条数
 export function getRoleList(params) {
  return request({
    url: '/sys/role',
    method:'GET',
    params
  })
}

//获取公司信息
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`,
    method:'GET'
  })
}


//删除角色
 export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'Delete'
  })
}

//修改角色
 export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })
}

//获取角色详情
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`,
    method:'GET'
  })
}

//新增角色
 export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}

// 给角色分配权限
// id	string	必须
// permIds	string []	必须			
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
