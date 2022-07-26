<template>
  <div id="multi">
    <el-card v-if="showData" class="box-card">
      <h5>{{ title }}</h5>
      <Table v-if="showData" :columns="columns" :page="page" :optionBtn="localOptionBtn" :datas="localdata"> </Table>
      <el-row style="margin-top: 8px">
        <el-col :span="12" :offset="12">
          <el-pagination class="pagex" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageNumber" :page-sizes="page.sizes" :page-size="page.pageSize" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="page.totalElements" :hide-on-single-page="true"> </el-pagination>
        </el-col>
      </el-row>
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
import { Column, OptionBtn, SearchType } from "@/interface/Table";

import { ElMessage } from "element-plus";
import { TabsPageParams } from "@/interface/SearchIndex";
import Table from "@components/table/Table.vue";

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
  sizes: [6, 12, 18],
  pageSize: 6,
  totalElements: 0,
});

let localdata = ref<Array<any>>();

let localOptionBtn = ref<OptionBtn>({
  search: false, // 开启查询功能
  searchParam: false, // 开启查询功能
  sort: false, // 开启排序功能
  add: false, // 添加
  page: false, // 翻页
  refresh: false,
  showColumn: false,
  opt: false, // 每条数据后端操作搭配optbtn使用
});
// 表格字段信息
let columns = ref<Array<Column>>([]);

const emit = defineEmits(["nodata", "complate"]);

onBeforeMount(() => {
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
        columns.value = [];
        response.data.forEach((el: SysApplTypeTabsColumnInfoVo) => {
          if (el.show) {
            let column: Column = {
              name: String(el.colsName),
              title: String(el.colsDesc == null || el.colsDesc == "" ? el.colsName : el.colsDesc),
              width: el.colsWidth,
              // resizable: el.,
              show: (el.deleteFlag == null || el.deleteFlag == 0) && (el.colsSwitchable == null || el.colsSwitchable) ? true : false,
              search: el.indexCode != null ? true : false,
              align: el.colsAlign == null ? "left" : el.colsAlign,
            };
            columns.value.push(column);
          }
        });
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
  console.log(selectDetailRel.value, title.value, page.value);
  http
    .post<any>("/serve/sysDbmsTabsColsInfo/searchData", page.value)
    .then((response) => {
      if (response.data != null && response.code == 200) {
        if (response.data.content == null || response.data.content.length == 0) {
          emit("complate", { uuid: parents.table.uuid, deleteFlag: 1, msg: "没有匹配结果" });
        } else {
          localdata.value = response.data.content;
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

// 每页大小
function handleSizeChange(val: number): void {
  page.value.pageSize = val;
  initTableData();
}
// 翻页
function handleCurrentChange(val: number): void {
  page.value.pageNumber = val;
  initTableData();
}
</script>

<style lang="scss" scoped>
#multi {
  margin-top: 20px;
}
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
