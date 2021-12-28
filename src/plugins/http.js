import axios from 'axios'
import {router} from '../router'

// 创建 axios 实例
let service = axios.create({
  // headers: {'Content-Type': 'application/json'},
  // baseURL: 'http://chuxuezhe.wang:8001',
  timeout: 60000
})

// 设置 post、put 默认 Content-Type
service.defaults.headers.post['Content-Type'] = 'application/json';
service.defaults.headers.put['Content-Type'] = 'application/json';

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    config.data = JSON.stringify(config.data);
    // if(token){
    //   config.params = {'token':token}
    // }
    // 请求发送前进行处理
    return config;
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error);
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  response => {
    // 错误集合处理 TODO
    if(response.data.code == -1){
      router.push({
        path:"/login",
        query:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
      })
    }
    return response;
  },
  error => {
    return Promise.reject(error)
  }
)


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function fetch(url,params={}){
  return new Promise((resolve,reject) => {
    service.get(url,{
      params:params
    })
    .then(response => {
      resolve(response.data);
    })
    .catch(err => {
      reject(err)
    })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function post(url,data = {}){
   return new Promise((resolve,reject) => {
    service.post(url,data)
          .then(response => {
            resolve(response.data);
          },err => {
            reject(err)
          })
   })
 }

 /**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url,data = {}){
  return new Promise((resolve,reject) => {
    service.patch(url,data)
         .then(response => {
           resolve(response.data);
         },err => {
           reject(err)
         })
  })
}

 /**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url,data = {}){
  return new Promise((resolve,reject) => {
    service.put(url,data)
         .then(response => {
           resolve(response.data);
         },err => {
           reject(err)
         })
  })
}

 /**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */

  export function del(url,data = {}){
    return new Promise((resolve,reject) => {
      service.delete(url,data)
           .then(response => {
             resolve(response.data);
           },err => {
             reject(err)
           })
    })
  }
