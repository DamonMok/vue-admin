import {request} from './request'

// 获取用户列表数据
export function requestUsers(params) {
  return request('get', {
    url: 'users',
    params: params
  })
}

// 修改用户状态
export function requestChangeState(uId, type) {
  return request('put', {
    url: `users/${uId}/state/${type}`
  })
}