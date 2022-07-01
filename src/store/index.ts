import { defineStore } from 'pinia'

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const mainStore = defineStore('main', {
  // other options...
  state: () => {
    return {
      currentIndex:""
    }
},
getters: {},
actions: {}
})