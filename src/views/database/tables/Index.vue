<template>
    <div>
        <Table :columns="columns" :rootUrl="rootUrl" />
    </div>
</template>

<script setup lang="ts">
import Table from '../../../components/table/Table.vue'
import { Column, SearchType, SelectOptions } from '../../../interface/Table'
import { onBeforeMount, ref } from 'vue';
import http from '../../../plugins/http';


let rootUrl: String = '/serve/sysDbmsTabsTableInfo';
let columns = ref<Array<Column>>()

let typeSelect = ref<Array<SelectOptions>>([]);
let jdbcSelect = ref<Array<SelectOptions>>([]);


onBeforeMount(() => {
    loadType();
    loadJdbc();
    init();
})

function init() {
    columns.value = [{
        name: "uuid",
        title: "uuid",
        align: 'left',
        show: false,
    }, {
        name: "tabsName",
        title: "表名",
        align: 'left',
        sort: true,
        search: true
    }, {
        name: "tabsDesc",
        title: "表的含义",
        align: 'center',
    }, {
        name: "tabsRows",
        title: "数据量",
        align: 'left',
        sort: true,
        search: true
    }, {
        name: "typeUuid",
        title: "类型",
        align: 'left',
        sort: true,
        search: true,
        type: SearchType.SELECT,
        searchDataArray: typeSelect.value
    }, {
        name: "jdbcUuid",
        title: "数据库",
        align: 'left',
        sort: true,
        search: true,
        type: SearchType.SELECT,
        searchDataArray: jdbcSelect.value
    }, {
        name: "tabsSpace",
        title: "表空间",
        align: 'left',
        sort: true,
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
}

function loadJdbc() {
    http.post<any>('/serve/sysDbmsTabsJdbcInfo/findAll', {}).then((reponse) => {
        if (reponse.data != null && reponse.code == 200) {
            reponse.data.forEach(element => {
                let op: SelectOptions = {
                    value: element.uuid,
                    label: element.appName
                };
                jdbcSelect.value?.push(op);
            });

        }
    }).catch((err) => {
        // TODO
    });
}


function loadType() {
    http.post<any>("/serve/sysDbmsTabsTypeInfo/findAll", {}).then((reponse) => {
        if (reponse.data != null && reponse.code == 200) {
            reponse.data.forEach(element => {
                let op: SelectOptions = {
                    value: element.uuid,
                    label: element.typeName
                };
                typeSelect.value?.push(op);
            });
        }
    }).catch((err) => {
        // TODO
    });
}

</script>

<style scoped>
</style>