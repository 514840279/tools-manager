<template>
  <div>
    <Table :columns="columns" :rootUrl="rootUrl" />
  </div>
</template>

<script setup lang="ts">
import Table from "@components/table/Table.vue";
import { Column } from "@interface/Table";
// 修改请求地址
let rootUrl: String = "/serve/sysDbmsTabsMergeInfo",
  columns: Array<Column> = [
    {
      name: "sort",
      title: "SORT",
    },
    {
      name: "colsName2",
      title: "表2列名",
    },
    {
      name: "colsUuid1",
      title: "表1列id",
    },
    {
      name: "colsDesc2",
      title: "表2列含义",
    },
    {
      name: "colsDesc1",
      title: "表1列含义",
    },
    {
      name: "tableUuid1",
      title: "表1id",
    },
    {
      name: "tableUuid2",
      title: "表二id",
    },
    {
      name: "discription",
      title: "DISCRIPTION",
    },
    {
      name: "uuid",
      title: "UUID",
      show: false,
    },
    {
      name: "colsName1",
      title: "表一列名",
    },
    {
      name: "colsUuid2",
      title: "表2列id",
    },
  ];
</script>

<style lang="scss" scoped></style>
