<template>
  <!-- <keep-alive> -->
  <Admin v-if="viewF === ViewType.Admin" />
  <Index v-if="viewF === ViewType.User" />
  <Login v-if="viewF === ViewType.Login" />
  <Error v-if="viewF === ViewType.Error" />
  <!-- </keep-alive> -->
</template>
<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import Admin from "./views/Admin.vue";
import Index from "./views/index.vue";
import Login from "./views/Login.vue";
import Error from "./views/Error.vue";

import { ViewType } from "./interface/View";

import { userStore } from "@store/user";
// 使普通数据变响应式的函数
import { storeToRefs } from "pinia";
// 实例化仓库
const store = userStore();
// 获取数据
const { userinfo } = storeToRefs(store);

let viewF = ref<ViewType>(ViewType.Login);

onMounted(() => {
  init();
});

function init() {
  if (userinfo == null) {
    viewF.value = ViewType.Login;
  } else {
    // 判断登录后信息展示 默认登录页面
    if (userinfo.value.roles?.includes("god")) {
      viewF.value = ViewType.Admin;
    } else if (userinfo.value.roles?.includes("boss")) {
      viewF.value = ViewType.Admin;
    } else if (userinfo.value.roles?.includes("admin")) {
      viewF.value = ViewType.Admin;
    } else if (userinfo.value.roles?.includes("super")) {
      viewF.value = ViewType.Admin;
    } else if (userinfo.value.roles?.includes("user")) {
      viewF.value = ViewType.User;
    } else if (userinfo.value.roles?.includes("test")) {
      viewF.value = ViewType.User;
    } else {
      viewF.value = ViewType.Login;
    }
  }
}

watchEffect(() => {
  init();
});
</script>

<style>
html,
body {
  margin: 0px;
  padding: 0px;
}

.el-header {
  padding: 0px;
}
</style>
