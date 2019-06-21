import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Main from '@/components/Home'
import Dashboard from '@/components/Dashboard'

Vue.use(Router)

// export default new Router({
//   routes: [
//     {
//       path: '/login',
//       name: 'Login',
//       component: Login
//     },
//     {
//       path: '/',
//       name: 'Home',
//       component: Home
//     }
//   ]
// })
let routes = [{
  path:'/',
  component: Main,
  hidden: true,
  children: [{
      path: '/',
      component:Dashboard,
      name:'首页'
  }]
}]

import {
  SystemRouter
} from './system'

for (let i in SystemRouter){
  routes.push(SystemRouter[i])
}

const router = new Router({
  routes: routes
})

export default router;