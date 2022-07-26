<template>
  <div>
    <Table v-if="showData" :columns="columns" :page="page" :optionBtn="localOptionBtn" :datas="localdata"> </Table>
  </div>
</template>

<script setup lang="ts">
import { Column, OptionBtn } from "@/interface/Table";
import { SearchIndexParameters, TabsPageParams } from "@interface/SearchIndex";
import { SysDbmsTabsCols, SysDbmsTabsTableInfo } from "@interface/SysDbms";
import { onBeforeMount, ref } from "vue";
import http from "@plugins/http";
import { ElMessage } from "element-plus";
import Table from "@components/table/Table.vue";

const parents = withDefaults(
  defineProps<{
    indexSelect: Array<SearchIndexParameters>;
    table: SysDbmsTabsTableInfo;
  }>(),
  {
    indexSelect: () => [],
    table: () => {
      return {};
    },
  }
);

// 表格字段信息
let columns = ref<Array<Column>>([]);
// 字段信息
let columnsResult = ref<Array<SysDbmsTabsCols>>([]);

let page = ref<TabsPageParams<SysDbmsTabsTableInfo>>({
  pageNumber: 1,
  sizes: [5, 10, 15],
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

// 控制显示
let showData = ref<boolean>(false);

const emit = defineEmits(["nodata", "complate"]);

onBeforeMount(() => {
  init();
});

function init() {
  showData.value = false;
  page.value.totalElements = 0;

  let param = {
    info: { tabsUuid: parents.table.uuid },
    sortList: [{ sortIndex: 1, sortName: "sort", sortOrder: "asc" }],
  };
  http
    .post<any>("/serve/sysDbmsTabsColsInfo/findAllBySort", param)
    .then((response) => {
      if (response.data != null && response.code == 200) {
        columnsResult.value = response.data;
        columns.value = [];
        response.data.forEach((el: SysDbmsTabsCols) => {
          let column: Column = {
            name: el.colsName,
            title: el.colsDesc == null || el.colsDesc == "" ? el.colsName : el.colsDesc,
            width: el.colsWidth,
            // resizable: el.,
            show: (el.deleteFlag == null || el.deleteFlag == 0) && (el.colsSwitchable == null || el.colsSwitchable) ? true : false,
            search: el.indexCode != null ? true : false,
            align: el.colsAlign == null ? "left" : el.colsAlign,
          };
          columns.value.push(column);
        });
        searchData();

        // showData.value = true;
      }
    })
    .catch((err) => {
      // TODO
    });
}

function searchData() {
  page.value.info = parents.table;
  page.value.cols = columnsResult.value;
  page.value.searchList = [];
  parents.indexSelect.forEach((para) => {
    if (para.data != null && String(para.data).split(" ").join("").length > 0)
      columnsResult.value.forEach((column) => {
        if (column.indexCode == para.value) {
          page.value.searchList?.push({
            operator: "and",
            column: column.colsName,
            title: column.colsDesc ? column.colsDesc : "",
            symbol: "eq",
            data: para.data,
          });
        }
      });
  });

  if (page.value.searchList == null || page.value.searchList.length === 0) {
    ElMessage({
      message: "参数不能为空",
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
</script>

<style scoped></style>
