<template>
  <div>
    <Table :columns="columns" :rootUrl="rootUrl" />
  </div>
</template>

<script setup lang="ts">
import Table from "../../../../components/table/Table.vue";
import { SearchType, Column, SelectOptions } from "../../../../interface/Table";
import { ref, onBeforeMount } from "vue";
import http from "../../../../plugins/http";

let rootUrl: String = "/serve/sysDicKeyList",
  columns = ref<Array<Column>>([]),
  nameSelect = ref<Array<SelectOptions>>([]);

onBeforeMount(() => {
  loadNames();

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
      name: "nameCode",
      title: "字典名",
      align: "center",
      searchType: SearchType.SELECT,
      searchDataArray: nameSelect.value,
      sort: true,
      search: true,
    },
    {
      name: "keyword",
      title: "字典key",
      align: "left",
      sort: true,
      search: true,
    },
    {
      name: "keyValue",
      title: "字典值",
      align: "left",
      sort: true,
      search: true,
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
function loadNames() {
  http
    .post<any>("/serve/sysDicName/findAll", {})
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((element: any) => {
          let op: SelectOptions = {
            value: element.code,
            label: element.name,
          };
          nameSelect.value?.push(op);
        });
      }
    })
    .catch((err) => {
      // TODO
    });
}
</script>

<style scoped></style>
