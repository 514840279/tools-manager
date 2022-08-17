import { defineStore } from 'pinia'
import { UserInfo } from "@interface/Login";

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const userStore = defineStore('user', {
  // other options...
  state: () => {
    return {
      userinfo: <UserInfo>{
        roles: ["admin"]
      }
    }
  },
  persist: {
    enabled: true,
    // 自定义持久化参数
    strategies: [
      {
        // 自定义key
        key: 'user_store',
        // 自定义存储方式，默认sessionStorage
        storage: localStorage,
        // 指定要持久化的数据，默认所有 state 都会进行缓存，可以通过 paths 指定要持久化的字段，其他的则不会进行持久化。
        paths: ['userinfo'],
      }
    ]
  },
  getters: {},
  actions: {}
})