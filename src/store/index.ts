import { defineStore } from 'pinia'

import { SearchIndexParameters } from "@interface/SearchIndex";

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const searchIndexStore = defineStore('searchIndex', {
  // other options...
  state: () => {
    return {
      indexParameters: <Array<SearchIndexParameters>>[],
      startSearch: false,
    }
  },
  getters: {},
  actions: {}
})