import axios from 'axios'

export function request(method, config) {

  const axiosRequest = axios.create({// 初始化axios实例
    method: method,
    baseURL: 'http://timemeetyou.com:8889/api/private/v1/',
    timeout: 5000
  })

  return axiosRequest(config)
}
