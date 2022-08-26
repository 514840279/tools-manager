import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";

// import Index from '../views/index.vue'
// import Admin from '../views/Admin.vue'
import Home0 from '../views/home/Home0.vue'
import Home1 from '../views/home/Home1.vue'
import Home2 from '../views/home/Home2.vue'
import Home3 from '../views/home/Home3.vue'
import Home4 from '../views/home/Home4.vue'
import Home5 from '../views/home/Home5.vue'
import Home6 from '../views/home/Home6.vue'

import Err from '../views/Error.vue'



// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
  {
    //   path: '/',
    //   redirect: '/index'   //重定向
    // }, {
    //   path: '/index',
    //   name: "index",
    //   component: Index,
    // }, {
    //   path: '/admin',
    //   name: "admin",
    //   component: Admin,
    // }, {
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
    path: '/home7',
    name: "home7",
    component: () => import('../views/home/Home7.vue'),
  }, {
    path: '/databasetype',
    name: "databasetype",
    component: () => import('../views/manager/dbm/type/Index.vue'),
  }, {
    path: '/index',
    name: "index",
    component: () => import('../views/manager/dbm/index/Index.vue'),
  }, {
    path: '/database',
    name: "database",
    component: () => import('../views/manager/dbm/database/Index.vue'),
  }, {
    path: '/tables',
    name: "tables",
    component: () => import('../views/manager/dbm/tables/Index.vue'),
  }, {
    path: '/tabsSearch',
    name: 'tabsSearch',
    component: () => import('../views/manager/dbm/tables/Search.vue'),
  }, {
    path: '/searchData',
    name: 'searchData',
    component: () => import('../views/manager/dbm/tables/SearchData.vue'),
  }, {
    path: '/columns',
    name: "columns",
    component: () => import('../views/manager/dbm/column/Index.vue'),
  }, {
    path: '/generate',
    name: "generate",
    component: () => import('../views/manager/code/generate/Index.vue'),
  }, {
    path: '/dicName',
    name: "dicName",
    component: () => import('../views/manager/dic/name/Index.vue'),
  }, {
    path: '/dicValue',
    name: "dicValue",
    component: () => import('../views/manager/dic/keyvalue/Index.vue'),
  }, {
    path: '/sysMenuInfo',
    name: 'sysMenuInfo',
    component: () => import('../views/manager/softm/SysMenuInfo/Index.vue'),
  }, {
    path: '/tabsmergeinfo',
    name: 'tabsmergeinfo',
    component: () => import('../views/manager/dbm/SysDbmsTabsMergeInfo/Index.vue'),
  }, {
    path: '/searchIndex',
    name: 'searchIndex',
    component: () => import('../views/manager/dbm/index/SearchIndex.vue'),
  }, {
    path: '/searchIndexData',
    name: 'searchIndexData',
    component: () => import('../views/manager/dbm/index/SearchIndexData.vue'),
  }, {
    path: '/appl',
    name: 'appl',
    component: () => import('../views/manager/appl/appl/Index.vue'),
  }, {
    path: '/applType',
    name: 'applType',
    component: () => import('../views/manager/appl/type/Index.vue'),
  }, {
    path: '/applTypeTabs',
    name: 'applTypeTabs',
    component: () => import('../views/manager/appl/table/Index.vue'),
  }, {
    path: '/applDataType',
    name: 'applDataType',
    component: () => import('../views/manager/appl/datatype/Index.vue'),
  }, {
    path: '/applSearch',
    name: 'applSearch',
    component: () => import('../views/manager/appl/search/Search.vue'),
  }, {
    path: '/resultList',
    name: 'resultList',
    component: () => import('../views/manager/appl/search/ResultList.vue'),
  }, {
    path: '/resultDetail',
    name: 'resultDetail',
    component: () => import('../views/manager/appl/search/ResultDetail.vue'),
  }, {
    path: '/jijin',
    name: 'jijin',
    component: () => import('../views/manager/message/jijin/Index.vue'),
  }, {
    path: '/error',
    name: "error",
    component: Err,
  }, {
    path: '/:catchAll(.*)',
    redirect: '/error'   //重定向
  },
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
export const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  // history: createWebHashHistory(),
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
})

