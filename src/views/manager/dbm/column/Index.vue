<template>
  <el-row>
    <el-col :span="6">
      <TableSelect v-if="tabsSelect.length > 0" :data="tabsSelect" title="选择表" @on-select="clickTable"></TableSelect>
    </el-col>
    <el-col :span="18">
      <Table :columns="tablProp.columns" :rootUrl="tablProp.rootUrl" :optionBtn="localOptionBtn" :searchParameters="tablProp.searchParameters" :sortParameters="tablProp.sortParameters" style="margin-left: 15px">
        <template v-slot:rightBtn>
          <el-button title="导入" @click="handleImportTable()" type="primary" icon="BottomLeft" circle size="small"></el-button>
        </template>
      </Table>
    </el-col>
  </el-row>
  <el-dialog v-model="dialogVisible" title="导入表" width="80%" :before-close="handleClose">
    <Table v-loading="!reloadTabs" :columns="loadColumns" :page="page" :optionBtn="localLoadOptionBtn" :datas="localdata" @onClickRow="onClickRow">
      <template v-slot:headSearch>
        <el-select v-model="tabsSelectValue" placeholder="选择表" size="small" @change="toloadColumns">
          <el-option v-for="item in tabsSelect" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </template>
    </Table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handLoadTables">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import Table from "@components/table/Table.vue";
import { Column, SearchType, SelectOptions, OptionBtn, PageParam, TableProps } from "@interface/Table";
import { onBeforeMount, onMounted, ref } from "vue";
import http from "@plugins/http";
import TableSelect from "@components/select/TableSelect.vue";

// let columns = ref<Array<Column>>();
let loadColumns = ref<Array<Column>>();
// let LocalSearchTableParamters = ref<LocalSearchTableParamters>({ searchParameters: [] });
let tablProp = ref<TableProps<any>>({
  rootUrl: "/serve/sysDbmsTabsColsInfo",
  columns: [],
  searchParameters: [],
  sortParameters: [{ sortIndex: 2, sortName: "sort", sortOrder: "asc" }],
});

let typeSelect = ref<Array<SelectOptions>>([]);
let jdbcSelect = ref<Array<SelectOptions>>([]);
let tabsSelect = ref<Array<SelectOptions>>([]);
let indexSelect = ref<Array<SelectOptions>>([]);

let dialogVisible = ref<boolean>(false);

let localOptionBtn = ref<OptionBtn>({
  search: true, // 开启查询功能
  searchParam: false, // 开启查询功能
  sort: false, // 开启排序功能
  add: false, // 添加
  page: true, // 翻页
  opt: true, // 每条数据后端操作搭配optbtn使用
});

let localLoadOptionBtn = ref<OptionBtn>({
  search: false, // 开启查询功能
  searchParam: false, // 开启查询功能
  sort: false, // 开启排序功能
  add: false, // 添加
  page: false, // 翻页
  showColumn: false,
  opt: false, // 每条数据后端操作搭配optbtn使用
});

let jdbcSelectValue = ref<string>();
let tabsSelectValue = ref<string>();
let localdata = ref<Array<any>>();

let reloadTabs = ref<boolean>(false);

let showSelectTabs = ref<boolean>(false);

let page = ref<PageParam<any>>({
  pageNumber: 1,
  sizes: [10, 20, 50, 100],
  pageSize: 10,
  totalElements: 0,
});

onBeforeMount(() => {
  // loadType();
  // loadJdbc();
  loadIndex();
  loadTabs();
  init();
});

onMounted(() => {});

function init() {
  tablProp.value.columns = [
    {
      name: "uuid",
      title: "uuid",
      align: "left",
      show: false,
      disable: true,
    },
    {
      name: "colsName",
      title: "字段名",
      align: "left",
      sort: true,
      search: true,
      disable: true,
    },
    {
      name: "colsDesc",
      title: "字段含义",
      align: "center",
      sort: true,
      search: true,
    },
    {
      name: "indexCode",
      title: "查询列配置",
      align: "left",
      search: true,
      searchType: SearchType.SELECT,
      searchDataArray: indexSelect.value,
    },
    {
      name: "userIcon",
      title: "图标",
      align: "center",
      width: 40,
      searchType: SearchType.ICON,
    },
    {
      name: "colsSwitchable",
      title: "列表显示",
      align: "left",
      searchType: SearchType.REDIO,
      searchDataArray: [
        { value: false, label: "否" },
        { value: true, label: "是" },
      ],
    },
    {
      name: "dataType",
      title: "数据类型",
      align: "left",
    },
    {
      name: "colsLength",
      title: "字段长度",
      align: "left",
      searchType: SearchType.INTEGER,
    },
    {
      name: "colsWidth",
      title: "列表宽度",
      align: "left",
    },
    {
      name: "nullable",
      title: "允许空",
      searchType: SearchType.REDIO,
      searchDataArray: [
        { value: "N", label: "否" },
        { value: "Y", label: "是" },
      ],
    },
    {
      name: "colsAlign",
      title: "横对齐",
      searchType: SearchType.REDIO,
      searchDataArray: [
        { value: "left", label: "左" },
        { value: "center", label: "中" },
        { value: "right", label: "右" },
      ],
    },
    // {
    //   name: "colsValign",
    //   title: "纵对齐",
    //   searchType: SearchType.REDIO,
    //   searchDataArray: [
    //     { value: "top", label: "上" },
    //     { value: "middle", label: "中" },
    //     { value: "bottom", label: "下" },
    //   ],
    // },
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
      name: "tabsUuid",
      title: "表",
      align: "left",
      searchType: SearchType.SELECT,
      searchDataArray: tabsSelect.value,
    },
    {
      name: "colsName",
      title: "字段名",
      align: "left",
    },
    {
      name: "colsDesc",
      title: "字段含义",
      align: "center",
    },
    {
      name: "colsLength",
      title: "字段长度",
      align: "left",
      searchType: SearchType.INTEGER,
    },
    {
      name: "dataType",
      title: "数据类型",
      align: "left",
    },
    {
      name: "nullable",
      title: "允许空",
      searchType: SearchType.SELECT,
      searchDataArray: [
        { value: "N", label: "否" },
        { value: "Y", label: "是" },
      ],
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

// 加载表信息
function loadTabs() {
  http
    .post<any>("/serve/sysDbmsTabsTableInfo/findAll", { jdbcUuid: jdbcSelectValue.value })
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((element: any) => {
          let op: SelectOptions = {
            value: element.uuid,
            label: element.tabsName,
          };
          tabsSelect.value?.push(op);
        });

        showSelectTabs.value = true;
      }
    })
    .catch((err) => {
      // TODO
    });
}

// 加载数据库信息
function loadIndex() {
  http
    .post<any>("/serve/sysDbmsTabsIndexInfo/findAll", {})
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((element: any) => {
          let op: SelectOptions = {
            value: element.indexCode,
            label: element.indexName,
          };
          indexSelect.value?.push(op);
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

function toloadColumns() {
  page.value.info = { tabsUuid: tabsSelectValue.value };
  // page.value.totalElements = 0;
  http
    .post<any>("/serve/sysDbmsTabsColsInfo/findAllByTabsUuid", page.value)
    .then((response) => {
      if (response.data != null && response.code == 200) {
        localdata.value = response.data;
        // var size = response.data.totalElements;
        // page.value.totalElements = response.data.length;
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
  toloadColumns();
}
// 翻页
function handleCurrentChange(val: number): void {
  reloadTabs.value = false;
  page.value.pageNumber = val;
  toloadColumns();
}

// 自定义事件
function onClickRow(res: { index: number; row: any; column: string }) {
  console.log(res.index);
  // 处理不同事件
  if (res.column == "daoru") {
    http
      .post<any>("/serve/sysDbmsTabsColsInfo/importColums", res.row)
      .then((response) => {
        if (response.data != null && response.code == 200) {
          reloadTabs.value = false;
          toloadColumns();
        }
      })
      .catch((err) => {
        // TODO
      });
  }
}

// 绑定点击表名事件
function clickTable(item: SelectOptions) {
  if (item) {
    tablProp.value.searchParameters = [
      {
        operator: "and",
        column: "tabsUuid",
        title: item.label,
        symbol: "eq",
        searchType: SearchType.TEXT,
        data: item.value,
        showdata: true,
      },
    ];
  }
}
</script>

<style scoped></style>
