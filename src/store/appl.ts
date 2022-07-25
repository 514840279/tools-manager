import { defineStore } from 'pinia'
import { SearchIndexParameters } from "@interface/SearchIndex";
import {  SysDbmsTabsTableInfo } from '@/interface/SysDbms';
import {  SysApplTypeTabsColumnInfoVo } from '@/interface/SysApp';

let parameters :Array<SearchIndexParameters>;
let stab :SysDbmsTabsTableInfo;
let sapplColumns :Array<SysApplTypeTabsColumnInfoVo>;
// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const applStore = defineStore('appl', {
  // other options...
  state: () => {
    return {
      indexParameters: parameters,
      singleTable:stab,
      singleApplTableColumns:sapplColumns,
      searchCloumn:sapplColumns,
    }
},
persist: {
  enabled: true,
  // 自定义持久化参数
  strategies: [
      {
          // 自定义key
          key: 'appl_store',
          // 自定义存储方式，默认sessionStorage
          storage: localStorage,
          // 指定要持久化的数据，默认所有 state 都会进行缓存，可以通过 paths 指定要持久化的字段，其他的则不会进行持久化。
          paths: ['indexParameters','singleTable','singleApplTableColumns','searchCloumn'],
      }
  ]
},
getters: {},
actions: {}
})