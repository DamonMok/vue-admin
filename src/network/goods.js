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

// 获取分类参数(attr_sel[many|only])
export function requestParams(catId, attr_sel) {
  return request('get', {
    url: `categories/${catId}/attributes`,
    params: {
      sel: attr_sel
    }
  })
}

// 添加分类参数
export function requestAddParams(catId, attr_name, attr_sel, attr_vals) {
  return request('post', {
    url: `categories/${catId}/attributes`,
    data: {
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}

// 根据 ID 查询参数
export function requestParamsById(catId, attrId, attr_sel) {
  return request('get', {
    url: `categories/${catId}/attributes/${attrId}`,
    params: {
      attr_sel
    }
  })
}

// 编辑提交参数
export function requestUpdateParams(catId, attrId, attr_name, attr_sel, attr_vals) {
  return request('put', {
    url: `categories/${catId}/attributes/${attrId}`,
    data: {
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}

// 删除参数
export function requestDeleteParams(catId, attrId) {
  return request('delete', {
    url: `categories/${catId}/attributes/${attrId}`
  })
}

// 商品列表数据
export function requestGoods(params) {
  return request('get', {
    url: `goods`,
    params
  })
}

// 添加商品
export function requestAddGoods(params) {
  return request('post', {
    url: "goods",
    data: params
  })
}