<template>
  <div>
    <Table :columns="columns" :rootUrl="rootUrl" />
  </div>
</template>

<script setup lang="ts">
import Table from "@components/table/Table.vue";
import { Column } from "@interface/Table";

let rootUrl: String = "/serve/sysApplInfo",
  columns: Array<Column> = [
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
    },
    {
      name: "applName",
      title: "应用名称",
      align: "center",
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
