<template>
  <div>
    <span style="color: red; margin-left: 15px">{{ indexParameters[0].data }}</span
    ><span style="float: right; margin-right: 15px">{{ page.totalElements }}</span>
  </div>
  <ul v-if="page.totalElements > 0 && showResult" v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
    <el-space :fill="true" wrap style="width: 100%">
      <li v-for="(item, index) in localdata" :key="index">
        <ResultCard :data="item" :index="index"></ResultCard>
      </li>
    </el-space>
  </ul>

  <div v-else-if="page.totalElements == 0 && showResult">
    <el-skeleton :rows="4" animated />
  </div>
  <div v-else-if="page.totalElements == 0 && !showResult">
    <el-empty description="没有数" />
  </div>
</template>

<script setup lang="ts">
import { TabsPageParams } from "@/interface/SearchIndex";
import { SysApplTypeTabsColumnInfoVo } from "@/interface/SysApp";
import ResultCard from "./ResultCard.vue";

import http from "@/plugins/http";
import { applStore } from "@store/appl";
// 使普通数据变响应式的函数
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
// 实例化仓库
const store = applStore();
// 解构并使数据具有响应式
const { indexParameters, singleTable, singleApplTableColumns, searchCloumn } = storeToRefs(store);

let page = ref<TabsPageParams>({
  pageNumber: 1,
  sizes: [8, 16, 24],
  pageSize: 8,
  totalElements: 0,
  searchList: [],
});

let localdata = ref<Array<any>>();
let showResult = ref<boolean>(true);

onBeforeMount(() => {
  initSingleTable();
});
// TODO
// 1 查询唯一表，
function initSingleTable() {
  http
    .post<any>("/serve/sysApplTypeTabsInfo/findSingleTable", { applCode: indexParameters.value[0].value })
    .then((response) => {
      if (response.data != null && response.code == 200) {
        singleTable.value = response.data;
        page.value.info = response.data;
        initTableColumn();
      }
    })
    .catch((err) => {
      // TODO
    });
}
// 2 查询表结构
function initTableColumn() {
  searchCloumn.value = [];
  http
    .post<any>("/serve/sysApplTypeTabsColumnInfo/findAllTables", { tabsUuid: singleTable.value.uuid })
    .then((response) => {
      if (response.data != null && response.code == 200) {
        singleApplTableColumns.value = response.data;
        page.value.cols = response.data;

        response.data.forEach((element: SysApplTypeTabsColumnInfoVo) => {
          if (element.searchCloumn == "Y") {
            searchCloumn.value.push(element);
            if (page.value.searchList == null || page.value.searchList.length == 0) {
              page.value.searchList = [
                {
                  operator: "and",
                  column: String(element.colsName),
                  title: String(element.colsDesc),
                  symbol: "like",
                  data: indexParameters.value[0].data,
                  subParameters: [],
                },
              ];
            } else if (page.value.searchList != null && page.value.searchList.length > 0) {
              if (page.value.searchList[0].subParameters != null) {
                page.value.searchList[0].subParameters.push({
                  operator: "or",
                  column: String(element.colsName),
                  title: String(element.colsDesc),
                  symbol: "like",
                  data: indexParameters.value[0].data,
                });
              }
            }
          }
        });

        initTabledata();
      }
    })
    .catch((err) => {
      // TODO
    });
}
// 3 查询表数据
function initTabledata() {
  http
    .post<any>("/serve/sysDbmsTabsColsInfo/searchData", page.value)
    .then((response) => {
      if (response.data != null && response.code == 200) {
        page.value.totalElements = response.data.totalElements;
        if (localdata.value == null || localdata.value.length == 0) {
          localdata.value = response.data.content;
        } else {
          localdata.value = localdata.value.concat(response.data.content);
        }
        debugger;
        if (page.value.totalElements == 0) {
          showResult.value = false;
        } else {
          showResult.value = true;
        }
      } else {
        showResult.value = false;
      }
    })
    .catch((err) => {
      // TODO
    });
}

function load() {
  if (page.value.totalElements > Number(localdata.value?.length)) {
    page.value.pageNumber = page.value.pageNumber++;
    initTabledata();
  }
}
// 4 分析表结构中配置各项数据对应到card中
// 设置card点击效果跳转detail 并保存点击card的数据
</script>

<style scoped>
.infinite-list {
  height: 700px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1500px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>
