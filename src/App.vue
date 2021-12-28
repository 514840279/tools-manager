<template>
  <div>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <div class="app">{{store.state.home.count}}
    <button @click="add">+值</button> <button @click="del">-值</button> 
    </div> -->
    <Index />
    <Login />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Index from './views/index.vue'
import Login from './views/login/index.vue'


import { useStore } from 'vuex';

export default {
  name: 'App',
  components: {
    // HelloWorld,
    Index,
    Login
  },
  setup() {
		const store = useStore();
		const add = () => {
      store.dispatch('totalFunAdd',store.state.home.count)
    }
    const del = () => {
      store.dispatch('totalFunDel', store.state.home.count)
    }
    return {
      add,
      del,
      store
    }
	},

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
body{
  padding: 0px;
  margin: 0px;
}

</style>
