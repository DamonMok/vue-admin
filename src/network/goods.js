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

// 获取分类参数(type[many|only])
export function requestParams(catId, type) {
  return request('get', {
    url: `categories/${catId}/attributes`,
    params: {
      sel: type
    }
  })
}