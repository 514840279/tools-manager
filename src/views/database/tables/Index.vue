<template>
    <div>
        <Table :columns="columns" :rootUrl="rootUrl">
            <template v-slot:rightBtn>
                <el-button title="导入" @click="handleImportTable()" type="primary" icon="BottomRight" circle size="small"></el-button>
            </template>
        </Table>
        <el-dialog v-model="dialogVisible" title="导入表" width="80%" :before-close="handleClose">
            <el-select v-model="jdbcSelectValue" placeholder="选择微服务" size="small" @change="toloadTables">
                <el-option v-for="item in jdbcSelect" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <Table v-if="reloadTabs" :columns="loadColumns" :optionBtn="localOptionBtn" :datas="localdata">
                <template v-slot:topSearch>
                </template>
            </Table>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handLoadTables">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import Table from '../../../components/table/Table.vue'
import { Column, SearchType, SelectOptions, OptionBtn } from '../../../interface/Table'
import { onBeforeMount, ref } from 'vue';
import http from '../../../plugins/http';


let rootUrl: String = '/serve/sysDbmsTabsTableInfo';

let columns = ref<Array<Column>>()
let loadColumns = ref<Array<Column>>()

let typeSelect = ref<Array<SelectOptions>>([]);
let jdbcSelect = ref<Array<SelectOptions>>([]);

let dialogVisible = ref<boolean>(false);

let localOptionBtn = ref<OptionBtn>({
    search: true, // 开启查询功能
    searchParam: false, // 开启查询功能
    sort: false, // 开启排序功能
    add: false, // 添加
    page: false, // 翻页
    opt: false, // 每条数据后端操作搭配optbtn使用

});

let jdbcSelectValue = ref<string>();
let localdata = ref<Array<any>>();

let reloadTabs = ref<boolean>(false);

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
        type: SearchType.INTEGER,
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


    loadColumns.value = [{
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
        search: true
    }, {
        name: "tabsRows",
        title: "数据量",
        align: 'left',
        type: SearchType.INTEGER,
        sort: true,
    }, {
        name: "typeUuid",
        title: "类型",
        align: 'left',
        type: SearchType.SELECT,
        searchDataArray: typeSelect.value
    }, {
        name: "jdbcUuid",
        title: "数据库",
        align: 'left',
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

    }];
}
// 加载数据库信息
function loadJdbc() {
    http.post<any>('/serve/sysDbmsTabsJdbcInfo/findAll', {}).then((response) => {
        if (response.data != null && response.code == 200) {
            response.data.forEach(element => {
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

// 加载类型信息
function loadType() {
    http.post<any>("/serve/sysDbmsTabsTypeInfo/findAll", {}).then((response) => {
        if (response.data != null && response.code == 200) {
            response.data.forEach(element => {
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

// 控制弹窗
function handleImportTable() {
    dialogVisible.value = true;
}


// 关闭前处理
function handleClose() {

}

function handLoadTables() {
    dialogVisible.value = false
}

function toloadTables(val: string) {
    http.post<any>('/serve/sysDbmsTabsTableInfo/findAllByJdbcUuid', { info: { jdbcUuid: val } }).then((response) => {
        if (response.data != null && response.code == 200) {
            localdata.value = response.data
            reloadTabs.value = true;
        }
    }).catch((err) => {
        // TODO
    });
}

</script>

<style scoped>
</style>