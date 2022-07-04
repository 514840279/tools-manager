<template>
  <div>
    <Table :columns="columns" :rootUrl="rootUrl" />
  </div>
</template>

<script setup lang="ts">
import Table from "@components/table/Table.vue";
import { Column } from "@interface/Table";
// 修改请求地址
let rootUrl: String = "/serve/sysMenuInfo",
  columns: Array<Column> = [
    {
      name: "systemId",
      title: "SYSTEM_ID",
    },
    {
      name: "parentsId",
      title: "PARENTS_ID",
    },
    {
      name: "sort",
      title: "SORT",
    },
    {
      name: "homePage",
      title: "HOME_PAGE",
    },
    {
      name: "icon",
      title: "ICON",
    },
    {
      name: "iconSkin",
      title: "ICON_SKIN",
    },
    {
      name: "uuid",
      title: "UUID",
      show: false,
    },
    {
      name: "type",
      title: "TYPE",
    },
    {
      name: "name",
      title: "NAME",
    },
    {
      name: "checked",
      title: "CHECKED",
    },
    {
      name: "discription",
      title: "DISCRIPTION",
    },
    {
      name: "uri",
      title: "URI",
    },
    {
      name: "moveType",
      title: "MOVE_TYPE",
    },
  ];
</script>

<style lang="scss" scoped></style>
