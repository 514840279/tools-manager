<template>
  <div>
    <Table :columns="columns" :rootUrl="rootUrl">
      <template v-slot:rightBtn>
        <el-button title="查询" @click="handleShowShearch()" type="primary" icon="Search" circle size="small"></el-button>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import Table from '../../../../components/table/Table.vue'
import { Column, SearchType, SelectOptions, ColumnType, } from '../../../../interface/Table'
import { onBeforeMount, ref } from 'vue'
import http from '../../../../plugins/http'

let typeSelect = ref<Array<SelectOptions>>([])
let jdbcSelect = ref<Array<SelectOptions>>([])

let rootUrl: String = '/serve/sysDbmsGenerateCodeInfo'

let columns = ref<Array<Column>>()

const redio = [
  { value: 'Y', label: '是' },
  { value: 'N', label: '否' },
]

onBeforeMount(() => {
  loadType();
  loadJdbc();
  init();
})

function init() {
  columns.value = [
    {
      name: 'uuid',
      title: 'uuid',
      align: 'left',
      type: ColumnType.SELECTION,
    },
    {
      name: 'typeUuid',
      title: '类型',
      align: 'left',
      sort: true,
      search: true,
      searchType: SearchType.SELECT,
      searchDataArray: typeSelect.value,
    },
    {
      name: 'jdbcUuid',
      title: '数据库',
      align: 'left',
      sort: true,
      search: true,
      searchType: SearchType.SELECT,
      searchDataArray: jdbcSelect.value,
    },
    {
      name: 'classPath',
      title: '包路径',
      align: 'center',
      sort: true,
      search: true,
    },
    {
      name: 'className',
      title: '类名',
      align: 'left',
      sort: true,
      search: true,
    },
    {
      name: 'generateHtml',
      title: '生成Html',
      align: 'left',
      searchType: SearchType.REDIO,
      searchDataArray: redio,
      show: false,
    },
    {
      name: 'generateDetail',
      title: '生成详情页面',
      align: 'left',
      searchType: SearchType.REDIO,
      searchDataArray: redio,
      show: false,
    },
    {
      name: 'generateController',
      title: '生成控制层',
      align: 'left',
      searchType: SearchType.REDIO,
      searchDataArray: redio,
      show: false,
    },
    {
      name: 'generateService',
      title: '生成服务层',
      align: 'left',
      searchType: SearchType.REDIO,
      searchDataArray: redio,
      show: false,
    },
    {
      name: 'generateDao',
      title: '生成数据层',
      align: 'left',
      searchType: SearchType.REDIO,
      searchDataArray: redio,
      show: false,
    },
    {
      name: 'generateEntity',
      title: '生成实体类',
      align: 'left',
      searchType: SearchType.REDIO,
      searchDataArray: redio,
      show: false,
    },
    {
      name: 'generateSql',
      title: '生成数据文件',
      align: 'left',
      searchType: SearchType.REDIO,
      searchDataArray: redio,
      show: false,
    },
    {
      name: 'generateDoc',
      title: '生成数据文本文档',
      align: 'left',
      searchType: SearchType.REDIO,
      searchDataArray: redio,
      show: false,
    },
    {
      name: 'sort',
      title: '显示顺序',
      align: 'left',
      sort: true,
    },
    {
      name: 'discription',
      title: '描述',
      align: 'left',
    },
  ]
}

// 加载数据库信息
function loadJdbc() {
  http
    .post<any>('/serve/sysDbmsTabsJdbcInfo/findAll', {})
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((element: any) => {
          let op: SelectOptions = {
            value: element.uuid,
            label: element.appName,
          }
          jdbcSelect.value?.push(op)
        })
      }
    })
    .catch((err) => {
      // TODO
    })
}

// 加载类型信息
function loadType() {
  http
    .post<any>('/serve/sysDbmsTabsTypeInfo/findAll', {})
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((element: any) => {
          let op: SelectOptions = {
            value: element.uuid,
            label: element.typeName,
          }
          typeSelect.value?.push(op)
        })
      }
    })
    .catch((err) => {
      // TODO
    })
}
</script>

<style scoped>
</style>