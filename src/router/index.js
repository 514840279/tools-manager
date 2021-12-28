import { createRouter, createWebHashHistory } from "vue-router";

import Index from '../views/index.vue'
import Home0 from '../views/home/Home0'
import Home1 from '../views/home/Home1'
import Home2 from '../views/home/Home2'
import Home3 from '../views/home/Home3'
import Home4 from '../views/home/Home4'
import Home5 from '../views/home/Home5'
import Home6 from '../views/home/Home6'
import User from '../views/user'
import Err from '../views/error'


// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
  {
    path: '/',
    redirect: '/index'   //重定向
  }, {
    path: '/index',
    name: "index",
    component: Index,
  }, {
    path: '/home0',
    name: "home0",
    component: Home0,
  }, {
    path: '/home1',
    name: "home1",
    component: Home1,
  }, {
    path: '/home2',
    name: "home2",
    component: Home2,
  }, {
    path: '/home3',
    name: "home3",
    component: Home3,
  }, {
    path: '/home4',
    name: "home4",
    component: Home4,
  }, {
    path: '/home5',
    name: "home5",
    component: Home5,
  }, {
    path: '/home6',
    name: "home6",
    component: Home6,
  }, {
    path: '/user',
    name: "user",
    component: User,
  }, {
    path: '/database',
    name: "Database",
    component: () => import('../views/app/database/database/index'),
  }, {
    path: '/databasetype',
    name: "Databasetype",
    component: () => import('../views/app/database/databasetype/index'),
  }, {
    path: '/tables',
    name: "Tables",
    component: () => import('../views/app/database/table/index'),
  },{
    path: '/userindex',
    name: "UserIndex",
    component: () => import('../views/app/database/userindex/index'),
  }, {
    path: '/columns',
    name: "Column",
    component: () => import('../views/app/database/column/index'),
  },{
    path: '/error',
    name: "error",
    component: Err,
  },{
    path: '/:catchAll(.*)',
    redirect: '/error'   //重定向
  },
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
export const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})