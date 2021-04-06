import {request} from './request'

// 获取用户列表数据
export function requestUsers(params) {
  return request('get', {
    url: 'users',
    params: params
  })
}

// 修改用户状态
export function requestChangeState(user) {
  return request('put', {
    url: `users/${user.id}/state/${user.mg_state}`
  })
}

// 添加新用户
export function requestAddUser(user) {
  return request('post', {
    url: 'users',
    data: user
  })
}

// 根据 ID 查询用户信息
export function requestUserById(user) {
  return request('get', {
    url: 'users/' + user.id
  })
}

// 修改用户信息
export function requestUpdateUserInfo(user) {
  return request('put', {
    url: 'users/' + user.id,
    data: {
      email: user.email,
      mobile: user.mobile
    }
  })
}