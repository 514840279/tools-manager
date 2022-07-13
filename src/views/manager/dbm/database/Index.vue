<template>
  <div>
    <Table :columns="columns" :rootUrl="rootUrl" />
  </div>
</template>

<script setup lang="ts">
import Table from "@components/table/Table.vue";
import { Column } from "@interface/Table";

let rootUrl: String = "/serve/sysDbmsTabsJdbcInfo",
  columns: Array<Column> = [
    {
      name: "uuid",
      title: "uuid",
      align: "left",
      show: false,
    },
    {
      name: "appName",
      title: "微服务名称",
      align: "center",
      search: true,
    },
    {
      name: "platform",
      title: "数据库平台",
      align: "left",
      search: true,
    },
    {
      name: "databaseName",
      title: "数据库名称",
      align: "left",
      sort: true,
      search: true,
    },
    {
      name: "ip",
      title: "数据库ip",
      align: "left",
      sort: true,
      show: false,
    },
    {
      name: "port",
      title: "数据库端口",
      align: "left",
      sort: true,
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
</script>

<style scoped></style>
