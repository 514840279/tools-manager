<template>
    <div id="AddTable">
        <el-form :inline="true" size="mini">
            <el-form-item>
                <el-select v-model="database"  style="width:100%"  @change="handleChangeSelectDatabase">
                    <el-option
                        v-for="(cl,idx) in databaseSelect"
                        :key="idx"
                        :label="cl.label"
                        :value="cl.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="tableName" placeholder="表名" @keyup="handleInputTableName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="tabsDesc" placeholder="表翻译" @keyup="handleInputTableDesc"></el-input>
            </el-form-item>
        </el-form>
        <el-table  v-loading="loading" :data="dataList"  style="width: 100%">
            <el-table-column v-for="(column,ind) in columns" :key="ind.id" 
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
                    <el-button @click="handleAdd(scope.row)" type="success" icon="el-icon-edit" circle size="mini"  title="添加"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <div> 
            <el-pagination 
                class="pagex"
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.pageNumber"
                :page-sizes="page.sizes"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.totalElements"
                :hide-on-single-page="true">
            </el-pagination>
        </div>
    </div>
</template>
<script>


export default {
    name:'AddTable',
    components: {},
    data(){
        return{
            databaseSelect:[],
            databaseList:[],
            database:'',
            tableName:null,
            tabsDesc:null,
            page:{
                pageNumber: 1,
                sizes: [10, 20, 50, 100],
                pageSize: 10,
                totalElements: 0,
                info:{}
            },
            // 表加载
            loading: false,
            // 表格数据
            dataList: [],
            columns:[{
                name:"tabsName",
                title:"表名",
                align:'left',
                sort: true,
                search: true
            },{
                name:"tabsDesc",
                title:"表含义",
                align:'left',
                sort: true,
                search: true
            },{
                name:"tabsRows",
                title:"数据量",
                align:'left',
                sort: true,
                search: true
            },{
                name:"tabsOrder",
                title:"显示顺序",
                align:'left',
                sort: true,
                search: true
            }],
        }
    },
    created(){
        this.init();
    },
    mounted(){

    },
    methods:{
        // 初始化
        init() {
            // 调用据库信息
            let _this = this;
            this.$post("/serve/sysDbmsTabsJdbcInfo/findAll",{}).then((reponse)=>{
                if(reponse.code == 200){
                    //  _this.databaseList =  reponse.data;
                    reponse.data.forEach(element => {
                        _this.databaseSelect.push({
                            "label": element.ip+':'+element.port+'-('+element.type+')'+element.databaseName,
                            "value": element.uuid
                        });
                    });
                }
            }).catch((err)=>{
                // TODO
            });
            
        },
        initTable(){
            let _this = this;
            this.$post("/serve/sysDbmsTabsInfo/findAllByTableUuid", this.page).then((reponse)=>{
                if(reponse.code == 200){
                    _this.dataList = reponse.data.content;
                    _this.page.totalElements = reponse.data.totalElements;
                    _this.loading = false;
                }
                
            }).catch((err)=>{
                // TODO
            });
        },
        // 切换数据查询平台
        handleChangeSelectDatabase(el){
            this.page.info.jdbcUuid = el;
            this.initTable();
        },
        // 每页大小
        handleSizeChange(val) {
            this.page.pageSize = val;
            this.initTable();
        },
        // 翻页
        handleCurrentChange(val) {
            this.page.pageNumber = val;
            this.initTable();
        },
        // 表名称查询
        handleInputTableName(){
            this.page.info.tabsName = this.tableName==''?null:this.tableName;
            this.initTable();
        },
        // 表翻译查询
        handleInputTableDesc(){
            this.page.info.tabsDesc = this.tabsDesc==''?null:this.tabsDesc;
            this.initTable();
        }
    }
}
</script>
<style scoped>
#AddTable{

}
</style>