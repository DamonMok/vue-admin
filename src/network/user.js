import {request} from './request'

export function requestUsers(params) {
  return request('get', {
    url: 'users',
    params: params
  })
}