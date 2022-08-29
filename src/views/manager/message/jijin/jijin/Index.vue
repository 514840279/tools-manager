<template>
  <div>
    <el-row>
      <el-col :span="20"><div class="grid-content ep-bg-purple" /></el-col>
      <el-col :span="4" style="text-align: right">
        <el-button type="primary" round @click="create = true">新购基金</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="名称" width="180" />
      <!-- <el-table-column prop="code" label="代码" width="180" /> -->
      <el-table-column prop="money" label="标准值" />
      <el-table-column prop="countMoney" label="累计金额" />
      <el-table-column prop="countFene" label="累计份额" />
      <el-table-column prop="pinjunjingzhi" label="标准净值" />
      <el-table-column prop="yingshou" label="总收入" />
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleClickDetail(scope.$index, scope.row)">Detail</el-button>
          <el-button link type="primary" size="small">Edit</el-button>
          <el-button link type="danger" size="small" @click="handleClickDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="create" title="购买新基金" width="30%">
    <Create v-if="create" @success="init" @cancel="create = false"></Create>
  </el-dialog>

  <el-dialog v-model="detail" title="操作" width="50%">
    <Detail v-if="detail" :current="currentData" @success="init" @cancel="detail = false"></Detail>
  </el-dialog>
</template>

<script setup lang="ts">
import http from "@/plugins/http";
import { onMounted, ref } from "vue";
import Create from "./Creaate.vue";
import Detail from "../flow/Detail.vue";
import { JijinVo } from "@/interface/jijin";

let create = ref<boolean>(false);
let detail = ref<boolean>(false);

let tableData = ref<Array<any>>([]);

let currentData = ref<JijinVo>();

onMounted(() => {
  init();
});

function init() {
  http
    .post<any>("/jijin/jijin/search", {})
    .then((response) => {
      if (response.data != null && response.code == 200) {
        tableData.value = response.data;
      }
    })
    .catch((err) => {
      // TODO
    });
}

function handleClickDetail(index: number, row: JijinVo) {
  console.log(row);
  currentData.value = row;
  detail.value = true;
}

function handleClickDelete(index: number, row: JijinVo) {
  http
    .delete<any>("/jijin/jijin/deleteJi", row)
    .then((response) => {
      if (response.code == 200) {
        init();
      }
    })
    .catch((err) => {
      // TODO
    });
}
</script>

<style lang="scss" scoped></style>
