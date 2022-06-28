<template>
    <div>
        <Table :columns="columns" :rootUrl="rootUrl" />
    </div>
</template>

<script setup lang="ts">
import Table from '../../../../components/table/Table.vue'
import { Column, SearchType } from '../../../../interface/Table'

let rootUrl: String = '/serve/sysDbmsTabsTypeInfo',
    columns: Array<Column> = [{
        name: "uuid",
        title: "uuid",
        align: 'left',
        show: false,
    }, {
        name: "typeCode",
        title: "类型代码",
        align: 'left',
        sort: true,
        search: true
    }, {
        name: "typeName",
        title: "类型名",
        align: 'left',
        sort: true,
        search: true
    }, {
        name: "typeIcon",
        title: "图标",
        align: 'center',
        searchType: SearchType.ICON,

    }, {
        name: "sort",
        title: "显示顺序",
        align: 'left',
        sort: true,
    }, {
        name: "discription",
        title: "描述",
        align: 'left',
    }];


</script>

<style scoped>
</style>