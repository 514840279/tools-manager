<template>
  <div>
    <el-card v-if="showData" class="box-card">
      <el-descriptions class="margin-top" :title="title" :column="parents.column" :border="true">
        <template #extra>
          <el-button type="primary">收藏，待开发</el-button>
        </template>
        <el-descriptions-item v-for="(column, index) in applColumns" :key="index" :span="column.span == null ? 1 : column.span">
          <template #label>
            <div class="cell-item">
              <!-- <el-icon :style="column.icon">
              <user />
            </el-icon> -->
              {{ column.colsDesc == null || column.colsDesc == "" ? column.colsName : column.colsDesc }}
            </div>
          </template>
          {{ localdata[String(column.colsName)] }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

import { SysApplTypeTabsColumnInfoVo, SysApplTypeTabsInfoVo } from "@/interface/SysApp";

import { applStore } from "@store/appl";
// 使普通数据变响应式的函数
import { storeToRefs } from "pinia";
import http from "@/plugins/http";
import { SearchType } from "@/interface/Table";

import { ElMessage } from "element-plus";
import { TabsPageParams } from "@/interface/SearchIndex";

// 实例化仓库
const store = applStore();
// 解构并使数据具有响应式
const { selectDetailRel } = storeToRefs(store);

const parents = withDefaults(
  defineProps<{
    table: SysApplTypeTabsInfoVo;
    column?: number;
  }>(),
  {
    table: () => {
      return { tabsName: "", tabsUuid: "", typeCode: "" };
    },
    column: () => {
      return 3;
    },
  }
);
let showData = ref<boolean>(false);
let title = ref<string>();
let applColumns = ref<Array<SysApplTypeTabsColumnInfoVo>>([]);

let page = ref<TabsPageParams<SysApplTypeTabsInfoVo>>({
  pageNumber: 1,
  sizes: [5, 10, 15],
  pageSize: 6,
  totalElements: 0,
});

let localdata = ref<any>();

const emit = defineEmits(["nodata", "complate"]);

onBeforeMount(() => {
  console.log(selectDetailRel.value);
  let tabl = parents.table;
  title.value = tabl.tabsDesc == null || tabl.tabsDesc == "" ? tabl.tabsName : tabl.tabsDesc;

  loadColumns();
});

function loadColumns() {
  http
    .post<any>("/serve/sysApplTypeTabsColumnInfo/findAllColumns", { tabsUuid: parents.table.uuid, typeCode: parents.table.typeCode, checkboxType: SearchType.CHECKBOX })
    .then((response) => {
      if (response.data != null && response.code == 200) {
        applColumns.value = response.data;
        initTableData();
      }
    })
    .catch((err) => {
      // TODO
    });
}
function initTableData() {
  page.value.info = parents.table;
  page.value.cols = applColumns.value;
  page.value.searchList = [];

  applColumns.value.forEach((column) => {
    if (column.isRelation) {
      page.value.searchList?.push({
        operator: "and",
        column: String(column.colsName),
        title: column.colsDesc ? column.colsDesc : "",
        symbol: "eq",
        data: selectDetailRel.value,
      });
    }
  });

  if (page.value.searchList == null || page.value.searchList.length === 0) {
    ElMessage({
      message: title.value + "参数不能为空",
      type: "warning",
    });
    return;
  }
  http
    .post<any>("/serve/sysDbmsTabsColsInfo/searchData", page.value)
    .then((response) => {
      if (response.data != null && response.code == 200) {
        if (response.data.content == null || response.data.content.length == 0) {
          emit("complate", { uuid: parents.table.uuid, deleteFlag: 1, msg: "没有匹配结果" });
        } else {
          localdata.value = response.data.content[0];
          page.value.totalElements = response.data.totalElements;
          showData.value = true;
          emit("complate", { uuid: parents.table.uuid, deleteFlag: 2, msg: "" });
        }
      } else {
        emit("complate", { uuid: parents.table.uuid, deleteFlag: -2, msg: response.data.msg });
      }
    })
    .catch((err) => {
      // TODO
      emit("complate", { uuid: parents.table.uuid, deleteFlag: -2, msg: err.message });
    });
}
</script>

<style scoped>
.el-descriptions {
  margin-top: 20px;
}
.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}
</style>
