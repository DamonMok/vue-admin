import axios from 'axios'

export function request(method, config) {

  const axiosRequest = axios.create({// 初始化axios实例
    method: method,
    baseURL: 'http://timemeetyou.com:8889/api/private/v1/',
    timeout: 5000
  })

  // 请求拦截器
  axiosRequest.interceptors.request.use(config => {
    // 在发送请求之前为请求头拼接token
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config;
  });

  return axiosRequest(config)
}
