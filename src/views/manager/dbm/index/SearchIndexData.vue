<template>
  <div id="search-index-data">
    <el-space :fill="fill" direction="horizontal" wrap style="width: 100%">
      <el-card class="box-card">
        <!-- 查询条件 -->
        <div>
          <el-row :gutter="20">
            <el-col :span="22">
              <el-row :gutter="10">
                <el-col :span="24 / indexSelect.length" v-for="(item, index) in indexSelect" :key="index">
                  <el-input v-model="item.data" :placeholder="item.indexPlaceholder" />
                </el-col>
              </el-row> </el-col
            ><el-col :span="1">
              <el-button type="success" :icon="Check" circle @click="toInitTable" />
            </el-col>
          </el-row>
        </div>
        <!-- 进度条 -->
        <el-progress v-if="startSearch" :percentage="progressParam.percentage" :indeterminate="progressParam.indeterminate" />
      </el-card>
      <!-- 查询表 -->
      <div v-for="(table, index) in tables" :key="index">
        <el-card class="box-card" v-show="table.deleteFlag == 2">
          <template #header>
            <div class="card-header">
              <span>{{ table.tabsDesc ? table.tabsDesc : table.tabsName }}</span>
              <el-button class="button" text style="float: right" @click="searchTable(table)">更多</el-button>
            </div>
          </template>
          <div>
            <!-- table -->
            <SearchTableData :indexSelect="indexSelect" :table="table" @complate="complate"></SearchTableData>
          </div>
        </el-card>
      </div>
    </el-space>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from "vue";
import { SearchIndexParameters } from "@interface/SearchIndex";
import { SysDbmsTabsTableInfo } from "@interface/SysDbms";
import { Check } from "@element-plus/icons-vue";
import http from "@plugins/http";
import { ElMessage } from "element-plus";
import SearchTableData from "./SearchTableData.vue";

import { searchIndexStore } from "@store/index";
// 使普通数据变响应式的函数
import { storeToRefs } from "pinia";
import { router } from "@/router";
import { searchTableStore } from "@store/search";
// 实例化仓库
const store = searchIndexStore();

// 解构并使数据具有响应式
const { indexParameters, startSearch } = storeToRefs(store);

// 实例化仓库
const searchStore = searchTableStore();
// 解构并使数据具有响应式
const { currentTable } = storeToRefs(searchStore);

let fill = ref(true);

let indexSelect = ref<Array<SearchIndexParameters>>([]);

let progressParam = ref({
  percentage: 0,
  indeterminate: true,
});

let tables = ref<Array<SysDbmsTabsTableInfo>>([]);
let complateSize = ref<number>(0);

onBeforeMount(() => {
  loadIndex();
});

onMounted(() => {});

// 加载数据类型信息
function loadIndex() {
  http
    .post<any>("/serve/sysDbmsTabsIndexInfo/findAll", {})
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((element: any) => {
          let op: SearchIndexParameters = {
            value: element.indexCode,
            label: element.indexName,
            indexPlaceholder: "请输入" + element.indexPlaceholder,
          };
          indexSelect.value?.push(op);
        });
        init();
      }
    })
    .catch((err) => {
      // TODO
    });
}

function init() {
  if (startSearch.value) {
    indexParameters.value.forEach((para) => {
      indexSelect.value.forEach((el) => {
        if (para.value == el.value) {
          el.data = para.data;
        }
      });
    });
    initTables();
  }
}
// 开始查询
function toInitTable() {
  startSearch.value = true;
  tables.value = [];
  initTables();
}

// 查询所有符合的表信息
function initTables() {
  let f = true;
  indexSelect.value.forEach((el) => {
    if (el.data != null && String(el.data).split(" ").join("").length > 0) {
      f = false;
    }
  });
  if (f) {
    ElMessage({
      message: "参数不能为空",
      type: "warning",
    });
    return;
  }
  let param = { list: indexSelect.value };

  http
    .post<any>("/serve/sysDbmsTabsTableInfo/findAllTablesByIndex", param)
    .then((response) => {
      if (response.data != null && response.code == 200) {
        tables.value = response.data;
      }
    })
    .catch((err) => {
      // TODO
      startSearch.value = false;
    });
}

// 调用结果
function complate(el: { uuid: string; deleteFlag: number; msg: string }) {
  tables.value.forEach((t) => {
    if (t.uuid == el.uuid) {
      t.deleteFlag = el.deleteFlag;
      t.discription = el.msg;
    }
  });
  complateSize.value = complateSize.value + 1;
  progressParam.value.percentage = Math.round(complateSize.value / tables.value.length) * 100;
  if (progressParam.value.percentage == 100) {
    progressParam.value.indeterminate = false;
    startSearch.value = false;
    complateSize.value = 0;
    progressParam.value.percentage = 0;
  }
}

// 跳转到表查询页面
function searchTable(table: SysDbmsTabsTableInfo) {
  currentTable.value = table;
  router.push({ path: "/searchData" });
}
</script>

<style lang="scss" scoped>
#search-index-data {
}
</style>
