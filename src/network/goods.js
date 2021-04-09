import { request } from './request'

// 获取商品分类
export function requestGoodsCategories(params) {
  return request('get', {
    url: '/categories',
    params
  })
}

// 添加商品分类
export function requestAddCategory(params) {
  return request('post', {
    url: '/categories',
    params
  })
}