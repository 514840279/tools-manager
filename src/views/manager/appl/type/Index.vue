<template>
  <div>
    <Table :columns="columns" :rootUrl="rootUrl" :sortParameters="sortParameters" />
  </div>
</template>

<script setup lang="ts">
import http from "@/plugins/http";
import Table from "@components/table/Table.vue";
import { Column, SearchType, SelectOptions, SortColumn } from "@interface/Table";
import { onBeforeMount, ref } from "vue";

let applSelect = ref<Array<SelectOptions>>([]);

let rootUrl: String = "/serve/sysApplTypeInfo";
let columns = ref<Array<Column>>();

let sortParameters = ref<Array<SortColumn>>([
  {
    sortIndex: 1,
    sortTitle: "类型",
    sortOrder: "desc",
    sortName: "checkboxType",
  },
  {
    sortIndex: 2,
    sortTitle: "排序",
    sortOrder: "asc",
    sortName: "sort",
  },
]);

onBeforeMount(() => {
  loadAppl();

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
      name: "applCode",
      title: "应用代码",
      align: "left",
      search: true,
      sort: true,
      searchType: SearchType.SELECT,
      searchDataArray: applSelect.value,
    },
    {
      name: "typeCode",
      title: "类型代码",
      align: "center",
      search: true,
    },
    {
      name: "typeName",
      title: "类型名称",
      align: "center",
      search: true,
    },
    {
      name: "checkboxType",
      title: "选择类型",
      subtitle: "单选类型，在同一个应用中有且仅有一个",
      align: "center",
      search: true,
      sort: true,
      searchType: SearchType.REDIO,
      searchDataArray: [
        {
          value: SearchType.CHECKBOX,
          label: "多选",
        },
        {
          value: SearchType.REDIO,
          label: "单选",
        },
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
  ];
}

// 加载类型信息
function loadAppl() {
  http
    .post<any>("/serve/sysApplInfo/findAll", {})
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((element: any) => {
          let op: SelectOptions = {
            value: element.applCode,
            label: element.applName,
          };
          applSelect.value?.push(op);
        });
      }
    })
    .catch((err) => {
      // TODO
    });
}
</script>

<style scoped></style>
