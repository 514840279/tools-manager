<template>
    <div>
        <Table :columns="columns" :rootUrl="rootUrl">
            <template v-slot:rightBtn>
                <el-button title="导入" @click="handleImportTable()" type="primary" icon="BottomLeft" circle size="small"></el-button>
            </template>
        </Table>
        <el-dialog v-model="dialogVisible" title="导入表" width="80%" :before-close="handleClose">
            <Table v-loading="!reloadTabs" :columns="loadColumns" :page="page" :optionBtn="localOptionBtn" :datas="localdata" @onClickRow="onClickRow">
                <template v-slot:headSearch>
                    <el-select v-model="tabsSelectValue" placeholder="选择微服务" size="small" @change="toloadColumns">
                        <el-option v-for="item in tabsSelect" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </template>
            </Table>
            <el-row>
                <el-col :span="12" :offset="12">
                    <el-pagination class="pagex" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageNumber" :page-sizes="page.sizes" :page-size="page.pageSize" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="page.totalElements">
                    </el-pagination>
                </el-col>
            </el-row>
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
import Table from '../../../../components/table/Table.vue'
import { Column, SearchType, SelectOptions, OptionBtn, PageParam } from '../../../../interface/Table'
import { onBeforeMount, ref } from 'vue';
import http from '../../../../plugins/http';



let rootUrl: String = '/serve/sysDbmsTabsColsInfo';

let columns = ref<Array<Column>>()
let loadColumns = ref<Array<Column>>()

let typeSelect = ref<Array<SelectOptions>>([]);
let jdbcSelect = ref<Array<SelectOptions>>([]);
let tabsSelect = ref<Array<SelectOptions>>([]);

let dialogVisible = ref<boolean>(false);

let localOptionBtn = ref<OptionBtn>({
    search: false, // 开启查询功能
    searchParam: false, // 开启查询功能
    sort: false, // 开启排序功能
    add: false, // 添加
    page: false, // 翻页
    opt: false, // 每条数据后端操作搭配optbtn使用

});

let jdbcSelectValue = ref<string>();
let tabsSelectValue = ref<string>();
let localdata = ref<Array<any>>();

let reloadTabs = ref<boolean>(false);

let page = ref<PageParam>({
    pageNumber: 1,
    sizes: [10, 20, 50, 100],
    pageSize: 10,
    totalElements: 0,
});

onBeforeMount(() => {
    // loadType();
    // loadJdbc();
    loadTabs();
    init();
})

function init() {
    columns.value = [{
        name: "uuid",
        title: "uuid",
        align: 'left',
        show: false,
    }, {
        name: "tabsUuid",
        title: "表",
        align: 'left',
        sort: true,
        search: true,
        type: SearchType.SELECT,
        searchDataArray: tabsSelect.value
    }, {
        name: "colsName",
        title: "字段名",
        align: 'left',
        sort: true,
        search: true
    }, {
        name: "colsDesc",
        title: "字段含义",
        align: 'center',
        sort: true,
        search: true
    }, {
        name: "dataType",
        title: "数据类型",
        align: 'left',
        sort: true,
        search: true,
    }, {
        name: "colsLength",
        title: "字段长度",
        align: 'left',
        type: SearchType.INTEGER,
    }, {
        name: "nullable",
        title: "允许空",
        sort: true,
        search: true,
        type: SearchType.SELECT,
        searchDataArray: [{ value: "N", label: "否" }, { value: "Y", label: "是" }]
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
        name: "tabsUuid",
        title: "表",
        align: 'left',
        sort: true,
        search: true,
        type: SearchType.SELECT,
        searchDataArray: tabsSelect.value
    }, {
        name: "colsName",
        title: "字段名",
        align: 'left',
        sort: true,
        search: true
    }, {
        name: "colsDesc",
        title: "字段含义",
        align: 'center',
        sort: true,
        search: true
    }, {
        name: "colsLength",
        title: "字段长度",
        align: 'left',
        type: SearchType.INTEGER,
    }, {
        name: "dataType",
        title: "数据类型",
        align: 'left',
        sort: true,
        search: true,
    }, {
        name: "nullable",
        title: "允许空",
        sort: true,
        search: true,
        type: SearchType.SELECT,
        searchDataArray: [{ value: "N", label: "否" }, { value: "Y", label: "是" }]
    }, {
        name: "sort",
        title: "显示顺序",
        align: 'left',
        sort: true,
    }, {
        name: "discription",
        title: "描述",
        align: 'left',
    }, {
        name: "daoru",
        title: "导入",
        type: SearchType.OPERATION,

    }];
}

// 加载数据库信息
function loadJdbc() {
    http.post<any>('/serve/sysDbmsTabsJdbcInfo/findAll', {}).then((response) => {
        if (response.data != null && response.code == 200) {
            response.data.forEach((element: any) => {
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
            response.data.forEach((element: any) => {
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

// 加载表信息
function loadTabs() {
    http.post<any>("/serve/sysDbmsTabsTableInfo/findAll", { jdbcUuid: jdbcSelectValue.value }).then((response) => {
        if (response.data != null && response.code == 200) {
            response.data.forEach((element: any) => {
                let op: SelectOptions = {
                    value: element.uuid,
                    label: element.tabsName
                };
                tabsSelect.value?.push(op);
            });
        }
    }).catch((err) => {
        // TODO
    });
}

// 控制弹窗
function handleImportTable() {
    dialogVisible.value = true;
    reloadTabs.value = true
}

// 关闭前处理
function handleClose() {
    dialogVisible.value = false;
    
}

function handLoadTables() {
    dialogVisible.value = false
}

function toloadColumns() {
    page.value.info = { tabsUuid: tabsSelectValue.value };
    http.post<any>('/serve/sysDbmsTabsColsInfo/findAllByTabsUuid', page.value).then((response) => {
        if (response.data != null && response.code == 200) {
            localdata.value = response.data;
            // var size = response.data.totalElements;
            // page.value.totalElements = size;
            reloadTabs.value = true;
        }
    }).catch((err) => {
        // TODO
    });
}

// 每页大小
function handleSizeChange(val: number): void {
    reloadTabs.value = false;
    page.value.pageSize = val;
    toloadColumns();
}
// 翻页 
function handleCurrentChange(val: number): void {
    reloadTabs.value = false;
    page.value.pageNumber = val;
    toloadColumns();
}

// 自定义事件
function onClickRow(res: { index: number, row: any, column: string }) {
    console.log(res.index);
    // 处理不同事件
    if (res.column == "daoru") {
        http.post<any>('/serve/sysDbmsTabsColsInfo/importColums', res.row).then((response) => {
            if (response.data != null && response.code == 200) {
                reloadTabs.value = false;
                toloadColumns();
            }
        }).catch((err) => {
            // TODO
        });
    }
}

</script>

<style scoped>
</style>