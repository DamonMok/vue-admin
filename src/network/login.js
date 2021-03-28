import { request } from './request'

export function requestLogin(username, password) {
  return request('post', {
    url: 'login',
    data: {
      username,
      password
    }
  })
}