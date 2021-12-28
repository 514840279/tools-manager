import { createApp } from 'vue'
import App from './App.vue'
import installElementPlus from './plugins/element'
import store from './store'
import {router} from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'



import {post,fetch,patch,put,del} from './plugins/http'

const app = createApp(App)
installElementPlus(app)
app.use(store);
app.use(router);
app.use(VueAxios,axios);

//定义全局变量
app.config.globalProperties.$post=post;
app.config.globalProperties.$fetch=fetch;
app.config.globalProperties.$patch=patch;
app.config.globalProperties.$put=put;
app.config.globalProperties.$del=del;

app.mount('#app')   