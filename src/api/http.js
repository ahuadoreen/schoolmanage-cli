import axios from 'axios'
import {MessageBox,Notification} from 'element-ui'
import router from '../router'
// 创建axios实例
const service = axios.create({
  baseURL: '/studentmanage', // api的base_url
  timeout: 10000 // 请求超时时间
})
// request拦截器
service.interceptors.request.use(config => {
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (user != null){
    console.log('test: ' + user.token)
    config.headers['token'] = user.token;
    config.headers['username'] = user.username;
  }
  // console.log(config.headers)
  return config
}, error => {
  // Do something with request error
  // console.log(error) // for debug
  Promise.reject(error)
})
// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    console.log('test: ' + res.code)
    if (res.code == 401) { //----------------------------------短期token超时
      sessionStorage.removeItem('user');
      router.replace({
        path: '/login',
        query: {redirect: router.currentRoute.fullPath}
      })
    }else if (res.code != 200) { //-----------------------------------------异常情况
        Notification({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return res
    },
    error => {
      console.log(error) // for debug
      Notification({
        message: '服务器异常,请稍后重试',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  )

export default service
