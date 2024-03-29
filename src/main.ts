import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { createPinia } from 'pinia'
// 持久化存储pinia
import piniaPluginPersist from 'pinia-plugin-persist'
import { router } from './router'
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIcons from '@element-plus/icons'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
// md-editor-preview
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
// 可复制
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
// 行号
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';

// highlightjs
import hljs from 'highlight.js';
VMdPreview.use(githubTheme, {
	Hljs: hljs,
});
VMdPreview.use(createCopyCodePlugin());
VMdPreview.use(createLineNumbertPlugin());


import App from './App.vue'


const pinia = createPinia()
pinia.use(piniaPluginPersist)

const app = createApp(App)

for (const name in ElementPlusIcons) {
	app.component(name, (ElementPlusIcons as any)[name])
}

app.use(ElementPlus, { size: 'small', zIndex: 3000, locale });
app.use(VueAxios, axios);
app.use(router);
app.use(pinia);
app.use(VMdPreview);


app.mount('#app');
