<template>
    <div id="Databasetype">
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
    name:'Databasetype',
    components: {Table},
    data(){
        return{
            rootUrl:'/serve/sysDbmsTabsTypeInfo',
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
                name:"typeName",
                title:"类型名",
                align:'left',
                sort: true,
                search: true
            },{
                name:"typeIcon",
                title:"icon",
                align:'center',
                sort: true,
                search: true
            },{
                name:"typeClass",
                title:"class",
                align:'left',
                sort: true,
                search: true
            },{
                name:"typeOrder",
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
        this.init();
    },
    methods:{
        init() {
                       
        }
    }
}
</script>
<style scoped>
#Databasetype{

}
</style>