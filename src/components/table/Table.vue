<template>
<div style="margin-top:20px;">
    <transition name="el-zoom-in-top">
        <div :class="show =='page'?'transition-box':null"   v-show="show =='page'">
            <el-row>
                <el-col :span="24"  style="text-align: right;margin-right:10px;">
                    <el-button title="查询" @click="handleShowShearch()" icon="el-icon-search" circle size="mini"  ></el-button>
                    <el-button title="排序" @click="handleShowSort()" v-if="localOptionBtn.sort" icon="el-icon-sort" circle size="mini"  ></el-button>
                    <el-button title="重置" @click="resetTable()" icon="el-icon-setting" circle size="mini"  ></el-button> 
                    <el-button title="添加" v-if="localOptionBtn.add" @click="handleAdd()" type="success" icon="el-icon-circle-plus-outline" circle size="mini"  ></el-button> 
                    <el-button title="刷新" @click="initTable()" icon="el-icon-refresh" circle size="mini"  ></el-button> 
                    <!-- <el-button title="打印" @click="printTable()" icon="el-icon-printer" circle size="mini"  ></el-button> -->
                    <!-- <el-button title="导出" icon="el-icon-download" circle size="mini"  ></el-button> -->
                    <TableColumnSelect v-model:columns="showColumns" circle size="mini"></TableColumnSelect>
                </el-col>
            </el-row>
            <TableSearchParameters v-if="localOptionBtn.search&&showSearch" :searchColumns="searchColumns" v-model:searchParameters="searchParameters" @searchTable="initTable" ></TableSearchParameters>
            <TableSortParameters v-if="localOptionBtn.sort&&showSort" :sortColumns="sortColumns" v-model:sortParameters="sortParameters" @sortTable="initTable" ></TableSortParameters>
            <div id="Table" ref="print">
                <el-table id="tableid"   v-loading="loading" :data="dataList"  style="width: 100%">
                    <el-table-column v-for="(column,ind) in activeColumns" :key="ind.id" 
                        :prop="column.name"
                        :label="column.title"
                        :width="column.width==null?'':column.width"
                        :align="column.align==null?'left':column.align"
                        :resizable="column.resizable==null?false:column.resizable"
                        >
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="124">
                        <template #default="scope">
                            <el-button @click="handleUpd(scope.row)" type="success" icon="el-icon-edit" circle size="mini"  title="修改"></el-button>
                            <el-button @click="handleStateToDown(scope.row)" v-if="scope.row.deleteFlag == 0||scope.row.deleteFlag ==null" type="warning" icon="el-icon-star-off" circle size="mini" title="已启用"></el-button>
                            <el-button @click="handleStateToUp(scope.row)" v-if="scope.row.deleteFlag == 1" type="info" icon="el-icon-star-off" circle size="mini" title="已禁用"></el-button>
                            <el-button @click="handleDelete(scope.row)" type="danger" icon="el-icon-delete" circle size="mini" title="删除"></el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div v-if="localOptionBtn.page"> 
                    <el-pagination 
                        class="pagex"
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="param.pageNumber"
                        :page-sizes="page.sizes"
                        :page-size="param.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="param.totalElements"
                        :hide-on-single-page="true">
                    </el-pagination>
                </div>
            </div>
        </div>
    </transition>
    <transition name="el-zoom-in-top">
        <div :class="show =='edit'?'transition-box':null"  v-show="show =='edit'">
            <TableSave v-show="show =='edit'" :columns="columns"  v-model:info="currentRow"  @onSave="handleSave" @onCancel="initTable" > </TableSave>
        </div>
    </transition>
    </div>
</template>
<script>
import TableSave from './TableSave';
import TableColumnSelect from './TableColumnSelect'
import TableSearchParameters from "./TableSearchParameters"
import TableSortParameters from "./TableSortParameters"

export default {
    name:'Table',
    components: {TableSave,TableColumnSelect,TableSearchParameters,TableSortParameters},
    props:{
        rootUrl:{
            type:String
        },
        columns:{
            type:Array
        },
        page:{
            type:Object,
            default() {
                return {
                    pageNumber: 1,
                    sizes: [10, 20, 50, 100],
                    pageSize: 10,
                    totalElements: 0,
                    info:{},
                }
            }
        },
        optionBtn:{
            type:Object,
            default: ()=>({
                search: true, // 开启查询功能
                sort:true, // 开启排序功能
                add: true, // 添加
                page: true, // 翻页
                opt: true, // 每条数据后端操作搭配optbtn使用
                optbtn:{ // 
                    info: true, // 详细
                    upd: true, // 修改
                    state: true, // 修改表中应有固定字段 delete_flag 默认值为0 逻辑删除字段 执行update 
                    del: true, // 删除 执行delete sql
                }
            })
        }
    },
    data(){
        return{
            //  连接地址 
            url: {},
            // 按钮控制
            localOptionBtn: null,
            // 请求参数
            param: {},
            // 表加载
            loading: false,
            // 表格数据
            dataList: [],
            // 编辑的数据
            currentRow:{},
            // 默认展示页面信息
            show:'page',
            // 绑定显示隐藏columns名称
            showColumns:[],
            // 搜索columns名称 类型有type: text integer integerrange date datetime  daterange select redio checkbox 
            /*{
                name: name,                                 
                search:true,
                search-type: text/integer/integerrange
                // search-type: date/datetime/daterange
                // search-data-formatter: 'yyyy-MM-dd'/'yyyy-MM-dd HH:mm:ss'
                // search-type: select/redio/checkbox
                // search-data-default: ''  // default value in array
                // search-data-array: ['','']
             }*/
            searchColumns:[],
            searchParameters:[],
            showSearch: false,
            // 排序columns名称
            /*{
                name:name,
                sort: true, // 允许选择排序
                sort-index: 1 // 默认排序优先序
                sort-order：'asc'/desc 
            } */
            sortColumns:[],
            sortParameters:[],
            showSort:false,
        }
    },
    created(){
        this.showColumns = this.columns;
        this.localOptionBtn = this.optionBtn;
    },
    mounted(){
        // innt
        this.init();
        // befor
        this.initTable();
    },
    methods:{
        // 初始化参数
        init() {
            this.url={
               page:this.rootUrl+"/page",
               findAll:this.rootUrl+"/findAll",
               add:this.rootUrl+"/save",
               upd:this.rootUrl+"/save",
               del:this.rootUrl+"/delete",
               delAll:this.rootUrl+"/deleteAll",
            }
            // 查询条件
            this.param=this.page;
            this.showColumns.forEach((item,index)=>{
                // 排序查询条件
                if(item.sort != null){
                    // 默认值是 “asc” 
                    let sortOrder = item.sortOrder == null? 'asc':item.sortOrder;
                    // 添加可排序字段
                    this.sortColumns.push({
                        "sortIndex": index,
                        "sortName": item.name,
                        "sortTitle": item.title,
                        "sortOrder": sortOrder
                    });
                }
                
                // 准备查询条件
                if(item.search != null){
                    // 默认值设置
                    let searchType = item.searchType == null? 'text':item.searchType;
                    // 添加可选条件
                    this.searchColumns.push({
                        "searchName": item.name,
                        "searchTitle": item.title,
                        "searchType": searchType,
                        "searchDataFormatter": item.searchDataFormatter,
                        "searchDataDefault": item.searchDataDefault,
                        "searchDataArray": item.searchDataArray,
                        "searchPlaceholder": "请输入"+item.title,
                    });
                }

            });
            // 查询框可选控制
            if(this.searchColumns.length == 0){
                this.localOptionBtn.search = false;
            }
            // 排序区域可选控制
            if(this.sortColumns.length == 0){
                this.localOptionBtn.sort = false;
            }
        },
        // 异步查询表格
        initTable(){
            var _this = this;
            this.show = 'page';
            this.loading=true;
            this.param.sortList = this.sortParameters;
            this.param.searchList = this.searchParameters;
            this.$post(this.url.page,this.param).then((reponse)=>{
                if(reponse.code == 200){
                    _this.dataList= reponse.data.content;
                    var size = reponse.data.totalElements;
                    if(size>0&&_this.dataList.length==0){
                        _this.param.pageNumber = _this.param.pageNumber-1;
                        _this.initTable();
                    }
                    _this.param.totalElements = reponse.data.totalElements;
                }
            }).catch((err)=>{
                // TODO
            });
            this.loading=false;
        },
        // 显示 、隐藏 收索条件框
        handleShowShearch(){
            this.showSort = false;
            this.showSearch = !this.showSearch;
        },
        // 显示 、隐藏 排序条件框
        handleShowSort(){
            this.showSearch = false;
            this.showSort = !this.showSort;
        },
        // 每页大小
        handleSizeChange(val) {
            this.param.pageSize = val;
            this.initTable();
        },
        // 翻页
        handleCurrentChange(val) {
            this.param.pageNumber = val;
            this.initTable();
        },
        // 更新行> 更新页面数据传递
        handleUpd(row) {
            this.currentRow = row;
            this.show = 'edit';
        },
        // 添加行
        handleAdd(){
            this.currentRow = {};
            this.show = 'edit';
        },
        // 修改数据
        handleSave(){
            this.upd(this.currentRow);
        },
        // 删除单行数据
        handleDelete(row){
            var _this = this;
            this.loading=true;
            this.$post(this.url.del,row).then((reponse)=>{
                if(reponse.code == 200){
                    _this.initTable();
                }
            }).catch((err)=>{
                // TODO
            });
        },
        // 修改状态  “显示”
        handleStateToUp(row){
            row.deleteFlag = 0;
            this.upd(row);
        },
        // 修改状态 “隐藏”
        handleStateToDown(row){
            row.deleteFlag = 1;
            this.upd(row);
        },
        // 数据更新
        upd(row){
            var _this = this;
            this.loading=true;
            this.$post(this.url.upd,row).then((reponse)=>{
                if(reponse.code == 200){
                    _this.initTable();
                }
            }).catch((err)=>{
                // TODO
            });
        },
        // 参数重置
        resetTable(){
            this.loading=true;
            this.showSearch = false;
            this.showSort = false;
            this.param=this.page;
            this.sortParameters=[];
            this.searchParameters=[];
            this.initTable();
            // this.showSort = true;
            this.showSearch = true;
        },
        // 打印表格
        printTable(){
            // this.$refs.print
        }
    },
    computed: {
        activeColumns: function () {
            return this.showColumns.filter(function (column) {
                if(column.show){
                    return column;
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>

#Table{
    .pagex{
        text-align: right;
        margin-top: 15px;
        margin-right: 10px;
    }

    .abs-box{
        margin: 0px ,0px ;
    }
    .transition-box {
        margin-bottom: 10px;
        width: 100%;
        color: #fff;
        padding: 20px 0px;
    }
}


</style>