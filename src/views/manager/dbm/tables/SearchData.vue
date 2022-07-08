<template>
  <div id="SearchData">aaaaa</div>
  <Table :columns="columns" :page="page" :optionBtn="localOptionBtn" :datas="localdata">
    <!-- <template v-slot:headSearch>
      <el-row>
        <el-col :span="6">
          <el-select v-model="info.jdbcUuid" placeholder="选择微服务" size="small" @change="toloadTables">
            <el-option v-for="item in jdbcSelect" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input v-model="info.tabsName" placeholder="筛选表" clearable @input="toloadTables" />
        </el-col>
      </el-row>
    </template> -->
  </Table>
  <el-row>
    <el-col :span="12" :offset="12">
      <!-- <el-pagination class="pagex" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageNumber" :page-sizes="page.sizes" :page-size="page.pageSize" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="page.totalElements"> </el-pagination> -->
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { searchTableStore } from "@store/search";
import { Column, SearchType, SelectOptions, OptionBtn, PageParam } from "@interface/Table";
import { SysDbmsTabsTableInfo } from "@interface/SysDbms";
import http from "@plugins/http";

// 使普通数据变响应式的函数
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
// 实例化仓库
const store = searchTableStore();
// 解构并使数据具有响应式
const { currentTable } = storeToRefs(store);
let localdata = ref<Array<any>>();

let localOptionBtn = ref<OptionBtn>({
  search: false, // 开启查询功能
  searchParam: false, // 开启查询功能
  sort: false, // 开启排序功能
  add: false, // 添加
  page: false, // 翻页
  opt: false, // 每条数据后端操作搭配optbtn使用
});

let page = ref<PageParam>({
  pageNumber: 1,
  sizes: [10, 20, 50, 100],
  pageSize: 10,
  totalElements: 0,
});

let columns = ref<Array<Column>>([]);

onMounted(() => {
  if (currentTable.value.uuid != null) {
    init(currentTable.value);
  }
});

function init(table: SysDbmsTabsTableInfo) {
  http
    .post<any>("/serve/sysDbmsTabsJdbcInfo/findAll", { tabsUuid: table.uuid })
    .then((response) => {
      if (response.data != null && response.code == 200) {
        columns.value = response.data;
      }
    })
    .catch((err) => {
      // TODO
    });
}
</script>

<style lang="scss" scoped>
#SearchData {
}
</style>
