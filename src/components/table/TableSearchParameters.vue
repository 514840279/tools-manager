<template>
    <div id="TableSearchParameters">
        <el-row v-for="(item,index) in parameters" :key="index+item.column" class="prow">
            <el-col :span="1">
                <el-button v-if="index>0" @click="handleSearchOperator(item,index)" size="mini">{{item.operator}}</el-button >
            </el-col>
            <el-col :span="4">
                <TableSearchColumnSelect :columns="columns" :item="item" :index="index" v-model:parameters="parameters"></TableSearchColumnSelect>
            </el-col>
             <el-col :span="3">
                 <TableSearchSymbolSelect :item="item" :index="index" v-model:parameters="parameters"></TableSearchSymbolSelect>
            </el-col>
             <el-col :span="6" v-if="item.showdata">
                <el-input size="mini" v-model="item.data"  :placeholder="item.searchPlaceholder" />
            </el-col>
            <el-col :span="1">
                <el-button @click="handleDelSearch(item,index)"  icon="el-icon-remove" circle size="mini"  title="删除"></el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12"> 
                <el-button @click="handleAddSearch"  type="success" icon="el-icon-plus" circle size="mini"  title="添加"></el-button>
                <el-button @click="handleSearch"  type="success" icon="el-icon-check" circle size="mini"  title="确定"></el-button>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import TableSearchColumnSelect from './TableSearchColumnSelect'
import TableSearchSymbolSelect from './TableSearchSymbolSelect'



export default {
    name:'TableSearchParameters',
    components: {TableSearchColumnSelect,TableSearchSymbolSelect},
    props:{
        searchColumns:{
            type: Array
        },
        searchParameters:{
            type: Array
        }
    },
    data(){
        return{
            columns: null,
            parameters: null,
            plusNum:0,
            columnsSize:0, 

        }
    },
    created(){
        this.columns = this.searchColumns;
        this.parameters = this.searchParameters;
    },
    mounted(){
        this.init();
    },
    methods:{
        init() {
           
        },
        // 添加新的筛选条件
        handleAddSearch(){
            // 防阻size为0
            if(this.columnsSize == 0){
                this.columnsSize  = this.searchColumns.length;
            }
            // 保证循环添加默认值数据
            if(this.columnsSize == this.plusNum){
                this.plusNum = 0;                
            }
            let column = this.columns[this.plusNum];
            this.parameters.push({
                "operator":'and',
                "column": column.searchName,
                "title": column.searchTitle,
                "symbol": "eq",
                "data": "",
                "searchPlaceholder": column.searchPlaceholder,
                "showdata": true,
            });

            this.plusNum++; 

        },
        // 查询筛选
        handleSearch(){
            this.$emit("searchTable");
        },
        // 修改连接符
        handleSearchOperator(item,index){
            if(item.operator == 'and'){
                item.operator = 'or';
            }else {
                item.operator = 'and';
            }
            this.parameters.splice(index, 1,item);
        },
        // 删除条件
        handleDelSearch(item,index){
            this.parameters.splice(index, 1);
        },
    }
}
</script>
<style scoped>
#TableSearchParameters{
    margin: 0px;
    padding: 8px;
    background: rgb(248, 248, 248);
    min-height: 150px;
    max-height: 320px;
}
</style>