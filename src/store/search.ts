import { defineStore } from 'pinia'

import { SysDbmsTabsTableInfo } from "@interface/SysDbms";

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const searchTableStore = defineStore('searchTable', {
  // other options...
  state: () => {
    return {
      currentTable: <SysDbmsTabsTableInfo>{}
    }
  },
  getters: {},
  actions: {}
})