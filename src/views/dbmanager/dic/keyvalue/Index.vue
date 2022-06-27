<template>
    <div>
        <Table :columns="columns" :rootUrl="rootUrl" />
    </div>
</template>

<script setup lang="ts">
import Table from '../../../../components/table/Table.vue'
import { SearchType, Column } from '../../../../interface/Table'

let rootUrl: String = '/serve/sysDicKeyList',

    columns: Array<Column> = [{
        name: "uuid",
        title: "uuid",
        align: 'left',
        show: false,
    }, {
        name: "parentsUuid",
        title: "字典名",
        align: 'center',
        type: SearchType.SELECT ,
        searchDataArray:[],
        sort: true,
        search: true
    }, {
        name: "keyword",
        title: "字典key",
        align: 'left',
        sort: true,
        search: true
    }, {
        name: "keyValue",
        title: "字典值",
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