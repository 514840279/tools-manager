<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="code" label="代码" width="180" />
      <el-table-column prop="money" label="标准值" />
      <el-table-column prop="countMoney" label="累计金额" />
      <el-table-column prop="countFene" label="累计份额" />
      <el-table-column prop="pinjunjingzhi" label="标准净值" />
      <el-table-column prop="yingshou" label="总收入" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import http from "@/plugins/http";
import { onMounted, ref } from "vue";

let tableData = ref<Array<any>>([]);

onMounted(() => {
  init();
});

function init() {
  http
    .post<any>("/jijin/jijin/search", {})
    .then((response) => {
      if (response.data != null && response.code == 200) {
        debugger;
        tableData.value = response.data;
      }
    })
    .catch((err) => {
      // TODO
    });
}
</script>

<style lang="scss" scoped></style>
