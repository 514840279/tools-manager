<template>
    <div style="margin-top:20px;">
        <transition name="el-zoom-in-top">
            <div :class="show == 'page' ? 'transition-box' : null" v-show="show == 'page'">
                <el-row class="arow">
                    <el-col :span="24">
                        <slot name="topSearch"></slot>
                    </el-col>
                </el-row>
                <el-row class="brow">
                    <el-col :span="18">
                        <TableSearch v-if="localOptionBtn.search" :searchColumns="searchColumns" v-model:searchParameters="searchParameters" @searchTable="initTable"></TableSearch>
                    </el-col>
                    <el-col :span="6">
                        <div style="text-align: right; margin-right: 10px;">
                            <slot name="rightBtn"></slot>
                            <el-button title="查询" v-if="localOptionBtn.searchParam" @click="handleShowShearch()" :type="searchBtnType" icon="Search" circle size="small"></el-button>
                            <el-button title="排序" v-if="localOptionBtn.sort" @click="handleShowSort()" :type="sortBtnType" icon="Sort" circle size="small"></el-button>
                            <el-button title="重置" @click="resetTable()" icon="Setting" circle size="small"></el-button>
                            <el-button title="添加" v-if="localOptionBtn.add" @click="handleAdd()" type="success" icon="CirclePlusFilled" circle size="small"></el-button>
                            <el-button title="刷新" @click="initTable()" icon="Refresh" circle size="small"></el-button>
                            <!-- <el-button title="打印" @click="printTable()" icon="Printer" circle size="small"  ></el-button> -->
                            <!-- <el-button title="导出" icon="Download" circle size="small"  ></el-button> -->
                            <TableColumnSelect v-model:columns="showColumns" circle size="small"></TableColumnSelect>
                        </div>
                    </el-col>
                </el-row>
                <TableSearchParameters v-if="localOptionBtn.searchParam && showSearch" :searchColumns="searchColumns" v-model:searchParameters="searchParameters" @searchTable="searchTable"></TableSearchParameters>
                <TableSortParameters v-if="localOptionBtn.sort && showSort" :sortColumns="sortColumns" v-model:sortParameters="sortParameters" @sortTable="initTable"></TableSortParameters>
                <div id="Table" ref="print">
                    <el-table id="tableid" v-loading="loading" :data="dataList" style="width: 100%">
                        <el-table-column v-for="(column, ind) in activeColumns" :key="ind" :prop="column.name" :label="column.title" :width="column.width == null ? '' : column.width" :align="column.align == null ? 'left' : column.align" :resizable="column.resizable == null ? false : column.resizable">
                            <template #default="scope">
                                <div v-if="column.type == SearchType.ICON">
                                    <el-icon :size="15" :title="scope.row[column.name]">
                                        <component :is="scope.row[column.name]"></component>
                                    </el-icon>
                                </div>
                                <div v-if="column.type == SearchType.SELECT">
                                    <template v-for="(opt, i) in column.searchDataArray" :key="i">
                                        <span v-if="showSelectText(opt, scope.row[column.name])">{{ opt.label }}</span>
                                    </template>
                                </div>
                                <div v-if="column.type == SearchType.OPERATION">
                                    <el-button @click="onClickRow(scope.$index, scope.row, column.name)" size="small">{{ column.title }}</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="124" v-if="localOptionBtn.opt">
                            <template #default="scope">
                                <el-button @click="handleUpd(scope.row)" v-if="localOptionBtn.opt && localOptionBtn.optbtn.upd" type="success" icon="Edit" circle size="small" title="修改"></el-button>
                                <el-button @click="handleStateToDown(scope.row)" v-if="localOptionBtn.opt && localOptionBtn.optbtn.state && scope.row.deleteFlag == 0 || scope.row.deleteFlag == null" type="warning" icon="View" circle size="small" title="已启用"></el-button>
                                <el-button @click="handleStateToUp(scope.row)" v-if="localOptionBtn.opt && localOptionBtn.optbtn.state && scope.row.deleteFlag == 1" type="info" icon="View" circle size="small" title="已禁用"></el-button>
                                <el-button @click="handleDelete(scope.row)" v-if="localOptionBtn.opt && localOptionBtn.optbtn.del" type="danger" icon="Delete" circle size="small" title="删除"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div v-if="localOptionBtn.page" class="apagination">
                        <el-row>
                            <el-col :span="12" :offset="12">
                                <el-pagination class="pagex" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="param.pageNumber" :page-sizes="page.sizes" :page-size="param.pageSize" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="param.totalElements">
                                </el-pagination>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="el-zoom-in-top">
            <div :class="show == 'edit' ? 'transition-box' : null" v-if="show == 'edit'">
                <TableSave v-if="show == 'edit'" :columns="columns" v-model:info="currentRow" @onSave="handleSave" @onCancel="initTable"> </TableSave>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, computed, watch } from 'vue';
import { PageParam, Column, SortColumn, SearchColumn, SearchParamters, OptionBtn, SearchType, SelectOptions } from '../../interface/Table'
// import axios from 'axios';
import http from '../../plugins/http';
import TableSave from './TableSave.vue'
import TableColumnSelect from './TableColumnSelect.vue'
import TableSearchParameters from './TableSearchParameters.vue'
import TableSortParameters from './TableSortParameters.vue'
import TableSearch from './TableSearch.vue'


const emit = defineEmits(["onClickRow"]);

const parents = withDefaults(defineProps<{
    rootUrl: String,
    columns: Array<Column>,
    page?: PageParam,
    optionBtn?: OptionBtn,
    datas?: Array<any>
}>(), {
    rootUrl: () => "",
    columns: () => [],
    page: () => {
        return {
            pageNumber: 1,
            sizes: [10, 20, 50, 100],
            pageSize: 10,
            totalElements: 0,
        }
    },
    optionBtn: () => {
        return {
        }
    },
    datas: () => {
        return []
    },

});

//  连接地址 
let url = {
    page: parents.rootUrl + "/page",
    findAll: parents.rootUrl + "/findAll",
    add: parents.rootUrl + "/save",
    upd: parents.rootUrl + "/save",
    del: parents.rootUrl + "/delete",
    delAll: parents.rootUrl + "/deleteAll",
};
// 按钮控制
let localOptionBtn = ref<OptionBtn>({
    search: true, // 开启查询功能
    searchParam: false, // 开启查询功能
    sort: false, // 开启排序功能
    add: true, // 添加
    page: true, // 翻页
    opt: true, // 每条数据后端操作搭配optbtn使用
    optbtn: { // 
        info: true, // 详细 暂时无用
        upd: true, // 修改
        state: true, // 修改表中应有固定字段 delete_flag 默认值为0 逻辑删除字段 执行update 
        del: true, // 删除 执行delete sql
    },
    // ... 放在最后去覆盖前面的参数
    ...parents.optionBtn

}),
    // 请求参数
    param = ref<PageParam>(parents.page),
    // 表加载
    loading = ref<boolean>(true);
// 表格数据
let dataList = ref<Array<any>>([]),
    // 编辑的数据
    currentRow = ref<any>({}),
    // 默认展示页面信息
    show = ref<string>('page'),
    // 绑定显示隐藏columns名称
    showColumns = ref<Array<Column>>(parents.columns),
    // 搜索columns名称 类型有type= text integer integerrange date datetime  daterange select redio checkbox 
    /*{
        name= name,                                 
        search=true,
        search-type= text/integer/integerrange/icon/color
        // search-type= date/datetime/daterange
        // search-data-formatter= 'yyyy-MM-dd'/'yyyy-MM-dd HH=mm=ss'
        // search-type= select/redio/checkbox
        // search-data-default= ''  // default value in array
        // search-data-array= ['','']
     }*/
    searchColumns: Array<SearchColumn> = [],
    searchParameters = ref<Array<SearchParamters>>([]),
    showSearch = ref<Boolean>(false),
    searchBtnType = ref<String>(),
    // 排序columns名称
    /*{
        name=name,
        sort= true, // 允许选择排序
        sort-index= 1 // 默认排序优先序
        sort-order：'asc'/desc 
    } */
    sortColumns: Array<SortColumn> = [],
    sortParameters = ref<Array<SortColumn>>([]),
    sortBtnType = ref<String>(),
    showSort = ref<Boolean>(false);


onBeforeMount(() => {
    // innt
    init();
    // befor
    initTable();
});


// 初始化参数
function init(): void {


    // 查询条件
    showColumns.value.forEach((item, index) => {

        item.type = item.type == null ? SearchType.TEXT : item.type
        // 排序查询条件
        if (item.sort != null) {
            // 默认值是 “asc” 
            let sortOrder = item.sortOrder == null ? 'asc' : item.sortOrder;
            // 添加可排序字段
            sortColumns.push({
                "sortIndex": index,
                "sortName": item.name,
                "sortTitle": item.title,
                "sortOrder": sortOrder
            });
        }

        // 准备查询条件
        if (item.search != null) {
            // 添加可选条件
            searchColumns.push({
                "searchName": item.name,
                "searchTitle": item.title,
                "searchType": item.type,
                "searchDataFormatter": item.searchDataFormatter,
                "searchDataDefault": item.searchDataDefault,
                "searchDataArray": item.searchDataArray,
                "searchPlaceholder": item.searchPlaceholder == null ? "请输入" + item.title : item.searchPlaceholder,
            });
        }
        // 默认值设置
        item.show = item.show == null ? true : item.show;
    });
    // 查询框可选控制
    if (searchColumns.length == 0) {
        localOptionBtn.value.search = false;
    }
    // 排序区域可选控制
    if (sortColumns.length == 0) {
        localOptionBtn.value.sort = false;
    }
}
// 异步查询表格
function initTable(): void {
    show.value = 'page';
    loading.value = true;

    if (parents.rootUrl != '') {
        param.value.sortList = sortParameters.value;
        param.value.searchList = searchParameters.value;

        http.post<any>(url.page, param.value).then((reponse) => {
            if (reponse.data != null && reponse.code == 200) {
                dataList.value = reponse.data.content;
                var size = reponse.data.totalElements;
                if (size > 0 && dataList.value.length == 0) {
                    param.value.pageNumber = param.value.pageNumber - 1;
                    initTable();
                }
                param.value.totalElements = size;
                // param.value.pageNumber = reponse.data.
                loading.value = false;
            }
        }).catch((err) => {
            // TODO
        });
    } else {

        if (parents.datas === undefined) {

        } else {
            dataList.value = parents.datas;
            loading.value = false;
        }

    }
}
// 显示 、隐藏 收索条件框
function handleShowShearch(): void {
    showSort.value = false;
    sortBtnType.value = "";
    showSearch.value = !showSearch.value;
    if (showSearch.value) {
        searchBtnType.value = "success";
    } else {
        searchBtnType.value = "";
    }
}

// 显示 、隐藏 排序条件框
function handleShowSort(): void {
    showSearch.value = false;
    searchBtnType.value = "";
    showSort.value = !showSort.value;
    if (showSort.value) {
        sortBtnType.value = "success";
    } else {
        sortBtnType.value = "";
    }
}
// 每页大小
function handleSizeChange(val: number): void {
    param.value.pageSize = val;
    initTable();
}
// 翻页 
function handleCurrentChange(val: number): void {
    param.value.pageNumber = val;
    initTable();
}
// 更新行> 更新页面数据传递
function handleUpd(row: any): void {
    currentRow.value = row;
    show.value = 'edit';
}
// 添加行
function handleAdd(): void {
    currentRow.value = {};
    show.value = 'edit';
}
// 修改数据
function handleSave(): void {
    upd(currentRow.value);
}
// 删除单行数据
function handleDelete(row: Object): void {
    loading.value = true;
    http.delete(url.del, row).then((reponse: any) => {
        if (reponse.data != null && reponse.code == 200) {
            initTable();
        }
    }).catch((err) => {
        // TODO
    });
}
// 修改状态  “显示”
function handleStateToUp(row: any): void {
    row.deleteFlag = 0;
    upd(row);
}
// 修改状态 “隐藏”
function handleStateToDown(row: any): void {
    row.deleteFlag = 1;
    upd(row);
}
// 数据更新
function upd(row: any): void {
    loading.value = true;
    http.post(url.upd, row).then((reponse: any) => {
        if (reponse.code == 200) {
            initTable();
        }
    }).catch((err) => {
        // TODO
    });
}
// 参数重置
function resetTable(): void {
    loading.value = true;
    // showSearch.value = false;
    // showSort.value = false;
    // param = parents.page;
    sortParameters.value = [];
    searchParameters.value = [];
    searchColumns.forEach((column, index) => {
        if (index < 5) {
            searchParameters.value.push({
                operator: 'and',
                column: column.searchName,
                title: column.searchTitle,
                searchType: column.searchType,
                symbol: "like",
                data: "",
                searchPlaceholder: column.searchPlaceholder,
                showdata: true,
            })
        }
    });
    initTable();
    // showSort = true;
    // showSearch.value = false;
}
// 打印表格
function printTable(): void {
    // $refs.print
}

//
function searchTable(param: Array<SearchParamters>) {
    searchParameters.value = param;
    initTable();
}
//
function showSelectText(opt: SelectOptions, column: string): boolean {
    if (opt == null) {
        return false;
    }
    if (opt.value == column) {
        return true;
    }
    return false;
}

function onClickRow(index: number, row: any, column: string) {
    let res = {
        index: index,
        row: row,
        column: column
    }
    emit("onClickRow", res);
}

const activeColumns = computed<Column[]>(() => {
    let temp: Column[] = new Array();
    showColumns.value.forEach(column => {
        if (column.show) {
            temp.push(column);
        }
    });
    return temp;
})

watch(() => parents.datas, (newValue, oldValue) => {
    // 因为watch被观察的对象只能是getter/effect函数、ref、active对象或者这些类型是数组
    // 所以需要将state.count变成getter函数
    dataList.value = newValue;
})

</script>

<style lang="scss" scoped>
.arow {
    padding-left: 5px;
}

.brow {
    margin-top: 8px;
}


.apagination {
    margin-top: 8px;

    .pagex {
        float: right;
        margin-right: 15px;
    }
}
</style>