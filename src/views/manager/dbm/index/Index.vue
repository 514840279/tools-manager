<template>
  <div>
    <Table :columns="columns" :rootUrl="rootUrl" />
  </div>
</template>

<script setup lang="ts">
import Table from "@components/table/Table.vue";
import { Column } from "@interface/Table";

let rootUrl: String = "/serve/sysDbmsTabsIndexInfo",
  columns: Array<Column> = [
    {
      name: "uuid",
      title: "uuid",
      align: "left",
      show: false,
    },
    {
      name: "indexCode",
      title: "索引代码",
      align: "left",
      sort: true,
      search: true,
    },
    {
      name: "indexName",
      title: "索引描述",
      align: "center",
      search: true,
    },
    {
      name: "indexPlaceholder",
      title: "组件提醒信息",
      align: "left",
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
</script>

<style scoped></style>
