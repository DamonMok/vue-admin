import {request} from './request'

export function requestRoles() {
  return request('get', {
    url: '/roles'
  })
}