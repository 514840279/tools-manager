<template>
    <div>
        <Table :columns="columns" :rootUrl="rootUrl" />
    </div>
</template>

<script setup lang="ts">
import Table from '../../../../components/table/Table.vue'
import { Column } from '../../../../interface/Table'

let rootUrl: String = '/serve/sysDicName',

    columns: Array<Column> = [{
        name: "uuid",
        title: "uuid",
        align: 'left',
        show: false,
    }, {
        name: "name",
        title: "字典名",
        align: 'center',
        sort: true,
        search: true
    }, {
        name: "code",
        title: "名称代码",
        align: 'left',
        sort: true,
        search: true
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