<template>
  <div>ffffffffffffffff</div>
</template>

<script setup lang="ts">
import { applStore } from "@store/appl";
// 使普通数据变响应式的函数
import { storeToRefs } from "pinia";
// 实例化仓库
const store = applStore();
// 解构并使数据具有响应式
const { indexParameters, startSearch } = storeToRefs(store);

// TODO ]
// 1 查询唯一表，
// 2 查询表结构
// 3 查询表数据
// 4 分析表结构中配置各项数据对应到card中
// 设置card点击效果跳转detail 并保存点击card的数据
</script>

<style scoped></style>
