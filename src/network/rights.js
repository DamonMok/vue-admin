import {request} from './request'

// 获取权限列表数据(type|list/tree)
export function requestRights(type) {
  return request('get', {
    url: `/rights/${type}`
  })
}