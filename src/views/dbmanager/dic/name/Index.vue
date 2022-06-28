<template>
    <div>
        <Table :columns="columns" :rootUrl="rootUrl" />
    </div>
</template>

<script setup lang="ts">
import Table from '../../../../components/table/Table.vue'
import { Column,SearchType } from '../../../../interface/Table'

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
        name: "buttonType",
        title: "控件类型",
        align: 'left',
        searchType: SearchType.SELECT ,
        searchDataArray: [{value: SearchType.SELECT,label:SearchType.SELECT},{value: SearchType.REDIO,label:SearchType.REDIO},{value: SearchType.CHECKBOX,label:SearchType.CHECKBOX},],
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