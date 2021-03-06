import {request} from './request'

// 获取角色列表
export function requestRoles() {
  return request('get', {
    url: '/roles'
  })
}

// 删除角色指定的权限
export function requestRemoveRight(roleId, rightId) {
  return request('delete', {
    url: `roles/${roleId}/rights/${rightId}`
  })
}

// 角色授权
export function requestAllotRight(roleId, rids) {
  return request('post', {
    url: `roles/${roleId}/rights`,
    data: {
      rids
    }
  })
}