<template>
  <div>
    <Table :columns="columns" :rootUrl="rootUrl" @onMultipleSelected="onMultipleSelected">
      <template v-slot:topSearch>
        <el-row>
          <el-col :span="4">
            <el-select v-model="param.typeUuid" class="full" placeholder="类型" size="small" @change="handleSearch" :clearable="true" :filterable="true">
              <el-option v-for="op in typeSelect" :key="op.value" :label="op.label" :value="op.value" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="param.jdbcUuid" class="full" placeholder="微服务" size="small" @change="handleSearch" :clearable="true" :filterable="true">
              <el-option v-for="op in jdbcSelect" :key="op.value" :label="op.label" :value="op.value" />
            </el-select>
          </el-col>
        </el-row>
      </template>
      <template v-slot:rightBtn>
        <el-button title="查询" @click="handleExport()" type="primary" icon="Download" circle size="small"></el-button>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import Table from "../../../../components/table/Table.vue";
import { Column, SearchType, SelectOptions, ColumnType, SearchParamters } from "../../../../interface/Table";
import { onBeforeMount, ref } from "vue";
import http from "../../../../plugins/http";

let typeSelect = ref<Array<SelectOptions>>([]);
let jdbcSelect = ref<Array<SelectOptions>>([]);
let tableSelect = ref<Array<SelectOptions>>([]);

let rootUrl: String = "/serve/sysDbmsGenerateCodeInfo";

let columns = ref<Array<Column>>();
let multipleSelected = ref<Array<any>>([]);
let param = ref<{ typeUuid?: string | null | undefined; jdbcUuid?: string | null | undefined }>({});

const redio = [
  { value: "Y", label: "是" },
  { value: "N", label: "否" },
];

onBeforeMount(() => {
  loadType();
  loadJdbc();
  handleSearch();
});

function init() {
  columns.value = [
    {
      name: "uuid",
      title: "uuid",
      align: "left",
      type: ColumnType.SELECTION,
    },
    {
      name: "tableUuid",
      title: "数据表",
      align: "left",
      sort: true,
      search: true,
      searchType: SearchType.SELECT,
      searchDataArray: tableSelect.value,
    },

    {
      name: "classPath",
      title: "包路径",
      align: "center",
      sort: true,
      search: true,
    },
    {
      name: "className",
      title: "类名",
      align: "left",
      sort: true,
      search: true,
    },
    {
      name: "generateHtml",
      title: "生成Html",
      align: "left",
      searchType: SearchType.REDIO,
      searchDataArray: redio,
      show: false,
    },
    {
      name: "generateDetail",
      title: "生成详情页面",
      align: "left",
      searchType: SearchType.REDIO,
      searchDataArray: redio,
      show: false,
    },
    {
      name: "generateController",
      title: "生成控制层",
      align: "left",
      searchType: SearchType.REDIO,
      searchDataArray: redio,
      show: false,
    },
    {
      name: "generateService",
      title: "生成服务层",
      align: "left",
      searchType: SearchType.REDIO,
      searchDataArray: redio,
      show: false,
    },
    {
      name: "generateDao",
      title: "生成数据层",
      align: "left",
      searchType: SearchType.REDIO,
      searchDataArray: redio,
      show: false,
    },
    {
      name: "generateEntity",
      title: "生成实体类",
      align: "left",
      searchType: SearchType.REDIO,
      searchDataArray: redio,
      show: false,
    },
    {
      name: "generateSql",
      title: "生成数据文件",
      align: "left",
      searchType: SearchType.REDIO,
      searchDataArray: redio,
      show: false,
    },
    {
      name: "generateDoc",
      title: "生成数据文本文档",
      align: "left",
      searchType: SearchType.REDIO,
      searchDataArray: redio,
      show: false,
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
            value: element.uuid,
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

// 修改column
function handleSearch() {
  tableSelect.value = [];
  let p: { typeUuid?: string | null | undefined; jdbcUuid?: string | null | undefined } = {
    typeUuid: param.value?.typeUuid == "" ? null : param.value?.typeUuid,
    jdbcUuid: param.value?.jdbcUuid == "" ? null : param.value?.jdbcUuid,
  };
  http
    .post<any>("/serve/sysDbmsTabsTableInfo/findAll", param.value)
    .then((response) => {
      if (response.data != null && response.code == 200) {
        debugger;
        response.data.forEach((element: any) => {
          let op: SelectOptions = {
            value: element.uuid,
            label: element.tabsName,
          };
          tableSelect.value?.push(op);
        });
      }
    })
    .catch((err) => {
      // TODO
    });
  init();
}

// 多選數據接收
function onMultipleSelected(el: Array<any>) {
  multipleSelected.value = el;
}

// 生成代碼
function handleExport() {
  let param = {
    list: multipleSelected.value,
    username: "",
  };
  debugger;
  http
    .post("/serve/sysDbmsGenerateCodeInfo/generate", param)
    .then((reponse: any) => {
      if (reponse.data != null && reponse.code == 200) {
        debugger;
        toDownload(reponse.data);
      }
    })
    .catch((err) => {
      // TODO
    });
}

// 下載代碼
function toDownload(path: string) {
  http
    .get("/serve/sysDbmsGenerateCodeInfo/downloadCode" + path)
    .then((reponse: any) => {
      // TODO download
    })
    .catch((err) => {
      // TODO
    });
}
</script>

<style scoped></style>
