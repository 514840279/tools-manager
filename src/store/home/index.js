// 创建 store 容器实例.
const home = {
  state :{
    count: 0
  },
  mutations: {
    increment (state, value) {
      state.count = value
    }
  },
  actions: {
    totalFunAdd(context, value) {
        context.commit('increment', value + 1)
    },
    totalFunDel(context, value) {
        context.commit('increment', value - 1)
    }
  }
}

export default home;
