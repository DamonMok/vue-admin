import {request} from './request'

export function requestMenus() {
  return request('get', {
    url: 'menus'
  })
}