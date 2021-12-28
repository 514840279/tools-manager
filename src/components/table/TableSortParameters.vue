<template>
    <div id="TableSortParameters">
        <el-row v-for="(item,index) in parameters" :key="index+item.sortName" class="prow">
            <el-col :span="1">
                <el-button v-if="index>0" @click="handleTopSort(item,index)"  icon="el-icon-caret-top" circle size="mini"  title="添加"></el-button >
            </el-col>
            <el-col :span="6">
                <TableSortColumnSelect :sortColumns="sortColumns" :item="item" :index="index" v-model:parameters="parameters"></TableSortColumnSelect>
            </el-col>
             <el-col :span="1">
                <el-button @click="handleSortOrder(item,index)" size="mini" >{{item.sortOrder}}</el-button>
            </el-col>
            <el-col :span="1">
                <el-button @click="handleDelSort(item,index)"  icon="el-icon-remove" circle size="mini"  title="删除"></el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8"> 
                <el-button @click="handleAddSort" type="success" icon="el-icon-plus" circle size="mini"  title="添加"></el-button>
                <el-button @click="handleSort" type="success" icon="el-icon-check" circle size="mini"  title="确定"></el-button>
            </el-col>
        </el-row>

    </div>
</template>
<script>
import TableSortColumnSelect from './TableSortColumnSelect'


export default {
    name:'TableSortParameters',
    components: {TableSortColumnSelect},
    props:{
        sortColumns:{
            type:Array
        },
        sortParameters:{
            type:Array
        }
    },
    data(){
        return{
            columns:null,
            parameters:null,
            orderSize:0,  
            plusNum:0,
            columnsSize:0, 
        }
    },
    created(){
        this.columns = this.sortColumns;
        this.parameters = this.sortParameters;
    },
    mounted(){

    },
    methods:{
        // 添加新的排序条件
        handleAddSort(){
            // 防阻size为0
            if(this.columnsSize == 0){
                this.columnsSize  = this.sortColumns.length;
            }
            // 保证循环添加默认值数据
            if(this.columnsSize == this.plusNum){
                this.plusNum = 0;                
            }
            // 添加新的排序条件
            this.parameters.push(this.columns[this.plusNum]);
            // 计算数量的
            this.orderSize++;
            // 循环下标控制
            this.plusNum++;
            this.handleSortIndex();
        },
        // 删除排序条件
        handleDelSort(item,index){
            this.parameters.splice(index, 1);
            this.orderSize--;
            this.handleSortIndex();
        },
        // 条件前移
        handleTopSort(item,index){
            this.parameters.splice(index, 1);
            this.parameters.splice(index-1, 0,item);
            this.handleSortIndex();
        },
        // 排序
        handleSortIndex(){
            let a = 1;
            this.parameters.forEach(item => {
                item.sortIndex = a;
                this.parameters.splice(a-1, 1,item);
                a++;
            });
        },
        // 取排序
        handleSort(){
            this.$emit("sortTable");
        },
        // 排序顺序控制
        handleSortOrder(item,index){
            if(item.sortOrder == 'asc'){
                item.sortOrder = "desc";
            }else{
                item.sortOrder = "asc";
            }
            this.parameters.splice(index, 1,item);
        }
    }
}
</script>
<style lang="scss" scoped >
#TableSortParameters{
    margin: 0px;
    padding: 8px;
    background: rgb(248, 248, 248);
    min-height: 150px;
    max-height: 320px;
    overflow-y: auto;
}
</style>