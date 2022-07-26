<template>
  <div>
    <ResultCard :data="selectDetail" :index="0"></ResultCard>
    <div style="height: 35px">
      <!-- <el-divider /> -->
    </div>
    <el-tabs v-model="typeCode" class="demo-tabs" :stretch="true" @tab-click="handleClickTabs">
      <el-tab-pane v-for="(type, index) in types" :key="index" :label="type.typeName" :name="type.typeCode">
        <div v-for="(tabs, tind) in typeTables" :key="tind">
          <div v-if="tabs.typeCode == type.typeCode">
            <div v-if="tabs.tabsRowsType == TabsRowsType.SINGLE_LINE">
              <ResultDetailSingle :table="tabs"></ResultDetailSingle>
            </div>
            <div v-else-if="tabs.tabsRowsType == TabsRowsType.MULTI_LINE">
              <ResultDetailMulti :table="tabs"></ResultDetailMulti>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { SysApplTypeTabsInfoVo, TabsRowsType } from "@/interface/SysApp";
import http from "@/plugins/http";
import { applStore } from "@store/appl";
// 使普通数据变响应式的函数
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import ResultCard from "./ResultCard.vue";
import ResultDetailSingle from "./ResultDetailSingle.vue";
import ResultDetailMulti from "./ResultDetailMulti.vue";

// 实例化仓库
const store = applStore();
// 解构并使数据具有响应式
const { indexParameters, selectDetail, types } = storeToRefs(store);
let typeCode = ref<string>();
let typeTables = ref<Array<SysApplTypeTabsInfoVo>>();

onBeforeMount(() => {
  typeCode.value = types.value[0].typeCode;
  loadTables();
});
// 默认加载类型表
function loadTables() {
  http
    .post<any>("/serve/sysApplTypeTabsInfo/findMultityTable", { applCode: indexParameters.value[0].value })
    .then((response) => {
      if (response.data != null && response.code == 200) {
        typeTables.value = response.data;
      }
    })
    .catch((err) => {
      // TODO
    });
}
// tabs 标签点击事件
function handleClickTabs() {}
</script>

<style scoped></style>
