<template>
    <div id="Tables">
        <el-row>
            <el-col :span="24"  style="text-align: right;margin-right:10px;">
                <el-button v-for="(item,index) in showConfig"  :key="index" :title="item.label" plain @click="handleShowTable(item,index)" :type="item.type" size="mini"  >{{item.label}}</el-button>
            </el-col>
        </el-row>
        <Table v-if="showTable==1"
            :columns="columns"
            :rootUrl="rootUrl"
            :optionBtn="optionBtn"
        >
        </Table>

        <AddTable v-if="showTable==3" >
        </AddTable>
    </div>
</template>
<script>
import Table from '../../../../components/table/Table'
import AddTable  from './AddTable'

export default {
    name:'Tables',
    components: {Table,AddTable},
    data(){
        return{
            rootUrl:'/serve/sysDbmsTabsInfo',
            optionBtn:{ // 操作控制按钮显示
                search: true, // 开启查询功能
                sort:true, // 开启排序功能
                add:false, // 添加
                page:true, // 翻页
                opt:true, // 每条数据后端操作搭配optbtn使用
                optbtn:{ // 
                    info:true, // 详细
                    upd:true, // 修改
                    state:true, // 修改表中应有固定字段 delete_flag 默认值为0 逻辑删除字段 执行update 
                    del:true, // 删除 执行delete sql
                }
            },
            columns:[{
                name:"uuid",
                title:"uuid",
                align:'left',
                show: false,
            },{
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
            showConfig:[{label:"管理",type:"warning",value:1},{label:"新建",type:"success",value:2},{label:"导入",type:"success",value:3}],
            showTable: 1,
        }
        
    },
    created(){
        this.init();
    },
    mounted(){
        this.init();
    },
    methods:{
        init() {
                       
        },
        handleShowTable(item,index){
            this.showConfig.forEach(row =>{
                 row.type = "success";
            });
            this.showTable=item.value;
            item.type = "warning";
            // this.showConfig.splice(index,1,item);
        }
    }
}
</script>
<style scoped>
#Tables{

}
</style>