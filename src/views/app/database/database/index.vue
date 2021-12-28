<template>
    <div id="Database">
        <Table
            :columns="columns"
            :rootUrl="rootUrl"
            :optionBtn="optionBtn"
        >
        </Table>
    </div>
</template>
<script>
import Table from '../../../../components/table/Table.vue'

export default {
    name:'Database',
    components: {Table},
    data(){
        return{
            rootUrl:'/serve/sysDbmsTabsJdbcInfo',
            optionBtn:{ // 操作控制按钮显示
                search: true, // 开启查询功能
                sort:true, // 开启排序功能
                add:true, // 添加
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
                name:"driver",
                title:"驱动",
                align:'left',
                show: false,
            },{
                name:"platform",
                title:"平台",
                align:'left',
                sort: true,
                search: true
            },{
                name:"type",
                title:"分类",
                align:'left',
                sort: true,
                search: true
            },{
                name:"ip",
                title:"数据库地址",
                align:'left',
                sort: true,
                search: true
            },{
                name:"port",
                title:"端口",
                align:'right',
                sort: true,
                search: true,
                searchType: "text"
            },{
                name:"databaseName",
                title:"数据库名称",
                align:'right',
                search: true,
                sort: true,
                sortOrder: "desc",
            }],
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        init() {
           
        }
    }
}
</script>
<style scoped>
#Database{

}
</style>