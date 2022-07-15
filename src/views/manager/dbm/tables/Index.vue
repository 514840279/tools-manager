<template>
  <div>
    <Table :columns="columns" :rootUrl="rootUrl">
      <template v-slot:rightBtn>
        <el-button title="导入" @click="handleImportTable()" type="primary" icon="BottomLeft" circle size="small"></el-button>
      </template>
    </Table>
    <el-dialog v-model="dialogVisible" title="导入表" width="80%" :before-close="handleClose">
      <Table v-loading="!reloadTabs" :columns="loadColumns" :page="page" :optionBtn="localOptionBtn" :datas="localdata" @onClickRow="onClickRow">
        <template v-slot:headSearch>
          <el-row>
            <el-col :span="6">
              <el-select v-model="info.jdbcUuid" placeholder="选择微服务" size="small" @change="toloadTables" :clearable="true" :filterable="true">
                <el-option v-for="item in jdbcSelect" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input v-model="info.tabsName" placeholder="筛选表" clearable @input="toloadTables" />
            </el-col>
          </el-row>
        </template>
      </Table>
      <el-row>
        <el-col :span="12" :offset="12">
          <el-pagination class="pagex" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageNumber" :page-sizes="page.sizes" :page-size="page.pageSize" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="page.totalElements"> </el-pagination>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handLoadTables">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import Table from "@components/table/Table.vue";
import { Column, SearchType, SelectOptions, OptionBtn, PageParam } from "@interface/Table";
import { onBeforeMount, ref } from "vue";
import http from "@plugins/http";

let rootUrl: String = "/serve/sysDbmsTabsTableInfo";

let columns = ref<Array<Column>>();
let loadColumns = ref<Array<Column>>();

let typeSelect = ref<Array<SelectOptions>>([]);
let jdbcSelect = ref<Array<SelectOptions>>([]);

let dialogVisible = ref<boolean>(false);

let localOptionBtn = ref<OptionBtn>({
  search: false, // 开启查询功能
  searchParam: false, // 开启查询功能
  sort: false, // 开启排序功能
  add: false, // 添加
  page: false, // 翻页
  opt: false, // 每条数据后端操作搭配optbtn使用
});

let info = ref<any>({ jdbcUuid: "", tabsName: "" });
let localdata = ref<Array<any>>();

let reloadTabs = ref<boolean>(false);

let page = ref<PageParam<any>>({
  pageNumber: 1,
  sizes: [10, 20, 50, 100],
  pageSize: 10,
  totalElements: 0,
});

onBeforeMount(() => {
  loadType();
  loadJdbc();

  init();
});

function init() {
  columns.value = [
    {
      name: "uuid",
      title: "uuid",
      align: "left",
      show: false,
    },
    {
      name: "tabsName",
      title: "表名",
      align: "left",
      sort: true,
      search: true,
    },
    {
      name: "tabsDesc",
      title: "表的含义",
      align: "center",
    },
    {
      name: "tabsRows",
      title: "数据量",
      align: "left",
      searchType: SearchType.INTEGER,
      sort: true,
      // search: true
    },
    {
      name: "typeCode",
      title: "类型",
      align: "left",
      sort: true,
      search: true,
      searchType: SearchType.SELECT,
      searchDataArray: typeSelect.value,
    },
    {
      name: "jdbcUuid",
      title: "数据库",
      align: "left",
      sort: true,
      search: true,
      searchType: SearchType.SELECT,
      searchDataArray: jdbcSelect.value,
    },
    {
      name: "tabsSpace",
      title: "表空间",
      align: "left",
      sort: true,
    },
    {
      name: "sort",
      title: "显示顺序",
      align: "left",
      sort: true,
    },
    {
      name: "discription",
      title: "描述",
      align: "left",
    },
  ];

  loadColumns.value = [
    {
      name: "uuid",
      title: "uuid",
      align: "left",
      show: false,
    },
    {
      name: "tabsName",
      title: "表名",
      align: "left",
      sort: true,
      search: true,
    },
    {
      name: "tabsDesc",
      title: "表的含义",
      align: "center",
      search: true,
    },
    {
      name: "tabsRows",
      title: "数据量",
      align: "left",
      searchType: SearchType.INTEGER,
      sort: true,
    },
    {
      name: "typeCode",
      title: "类型",
      align: "left",
      searchType: SearchType.SELECT,
      searchDataArray: typeSelect.value,
    },
    {
      name: "jdbcUuid",
      title: "数据库",
      align: "left",
      searchType: SearchType.SELECT,
      searchDataArray: jdbcSelect.value,
    },
    {
      name: "tabsSpace",
      title: "表空间",
      align: "left",
      sort: true,
    },
    {
      name: "sort",
      title: "显示顺序",
      align: "left",
      sort: true,
    },
    {
      name: "daoru",
      title: "导入",
      searchType: SearchType.OPERATION,
    },
  ];
}

// 加载数据库信息
function loadJdbc() {
  http
    .post<any>("/serve/sysDbmsTabsJdbcInfo/findAll", {})
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((element: any) => {
          let op: SelectOptions = {
            value: element.uuid,
            label: element.appName,
          };
          jdbcSelect.value?.push(op);
        });
      }
    })
    .catch((err) => {
      // TODO
    });
}

// 加载类型信息
function loadType() {
  http
    .post<any>("/serve/sysDbmsTabsTypeInfo/findAll", {})
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((element: any) => {
          let op: SelectOptions = {
            value: element.typeCode,
            label: element.typeName,
          };
          typeSelect.value?.push(op);
        });
      }
    })
    .catch((err) => {
      // TODO
    });
}

// 控制弹窗
function handleImportTable() {
  dialogVisible.value = true;
  reloadTabs.value = true;
}

// 关闭前处理
function handleClose() {
  dialogVisible.value = false;
}

function handLoadTables() {
  dialogVisible.value = false;
}

function toloadTables(val: string) {
  page.value.info = info.value;
  page.value.totalElements = 0;
  http
    .post<any>("/serve/sysDbmsTabsTableInfo/findAllByJdbcUuid", page.value)
    .then((response) => {
      if (response.data != null && response.code == 200) {
        localdata.value = response.data.content;
        var size = response.data.totalElements;
        page.value.totalElements = size;
        reloadTabs.value = true;
      }
    })
    .catch((err) => {
      // TODO
    });
}

// 每页大小
function handleSizeChange(val: number): void {
  reloadTabs.value = false;
  page.value.pageSize = val;
  let id = page.value.info == null ? null : page.value.info.jdbcUuid;
  toloadTables(id);
}

// 翻页
function handleCurrentChange(val: number): void {
  reloadTabs.value = false;
  page.value.pageNumber = val;
  let id = page.value.info == null ? null : page.value.info.jdbcUuid;
  toloadTables(id);
}

// 自定义事件
function onClickRow(res: { index: number; row: any; column: string }) {
  console.log(res.index);
  // 处理不同事件
  if (res.column == "daoru") {
    http
      .post<any>("/serve/sysDbmsTabsTableInfo/importTable", res.row)
      .then((response) => {
        if (response.data != null && response.code == 200) {
          let id = page.value.info == null ? null : page.value.info.jdbcUuid;
          reloadTabs.value = false;
          toloadTables(id);
        }
      })
      .catch((err) => {
        // TODO
      });
  }
}
</script>

<style scoped></style>
