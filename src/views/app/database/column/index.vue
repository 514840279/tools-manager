<template>
    <div id="Column">
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
    name:'Column',
    components: {Table},
    data(){
        return{
            rootUrl:'/serve/sysDbmsTabsColsInfo',
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
                name:"tabsUuid",
                title:"表名",
                align:'left',
                show: false,
            },{
                name:"colsName",
                title:"字段名",
                align:'left',
                sort: true,
                search: true
            },{
                name:"colsDesc",
                title:"字段含义",
                align:'left',
                sort: true,
                search: true
            },{
                name:"colsLength",
                title:"字段长度",
                align:'center',
                sort: true,
                search: true
            },{
                name:"dataPrecision",
                title:"数据为空百分比",
                align:'center',
                sort: true,
                search: true
            },{
                name:"useful",
                title:"是否可用",
                align:'left',
                sort: true,
                search: true
            },{
                name:"userIndex",
                title:"索引列",
                align:'left',
                sort: true,
                search: true
            },{
                name:"colsOrder",
                title:"显示排序",
                align:'left',
                sort: true,
                search: true
            },{
                name:"colsType",
                title:"数据类型",
                align:'left',
                sort: true,
                search: true
            },{
                name:"nullable",
                title:"允许空",
                align:'left',
                sort: true,
                search: true
            },{
                name:"colsSort",
                title:"允许排序",
                align:'left',
                sort: true,
                search: true
            },{
                name:"dataScale",
                title:"数据精度",
                align:'left',
                sort: true,
                search: true
            },{
                name:"colsSwitchable",
                title:"可选择",
                align:'left',
                sort: true,
                search: true
            },{
                name:"colsValign",
                title:"水平位置",
                align:'left',
                sort: true,
                search: true
            },{
                name:"pageList",
                title:"列表显示",
                align:'left',
                sort: true,
                search: true
            },{
                name:"userIcon",
                title:"显示icon",
                align:'left',
                sort: true,
                search: true
            },{
                name:"colsWidth",
                title:"字段宽度",
                align:'left',
                sort: true,
                search: true
           
            },{
                name:"colsVisible",
                title:"隐藏列",
                align:'left',
                sort: true,
                search: true
            },{
                name:"colsDefault",
                title:"默认值",
                align:'left',
                sort: true,
                search: true
            },{
                name:"colsAlign",
                title:"水平对齐方式",
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
#Column{

}
</style>