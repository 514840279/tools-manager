<template>
    <div id="TableSortColumnSelect">
        <el-select v-model="value" size="mini" style="width:100%"  @change="handleChange">
            <el-option
                v-for="(cl,idx) in sortColumns"
                :key="idx"
                :label="cl.sortTitle"
                :value="cl.sortName"
            >
            </el-option>
        </el-select>
    </div>
</template>
<script>


export default {
    name:'TableSortColumnSelect',
    components: {},
    props:{
        sortColumns:{
            type: Array
        },
        item:{
            type: Object
        },
        index:{
            type: Number
        },
        parameters:{
            type: Array
        },
    },
    data(){
        return{
           row:null,
           value:null,
           pdata:null,
        }
    },
    created(){
        this.value = this.item.sortName;
        this.pdata = this.parameters;
    },
    mounted(){
        this.value = this.item.sortName;
        this.pdata = this.parameters;
    },
    methods:{
        handleChange(va){
            this.sortColumns.forEach(item =>{
                if(item.sortName == va){
                    item.sortIndex = this.index+1;
                    this.pdata.splice(this.index, 1,item);
                }
            });
        }
    }
}
</script>
<style scoped>
#TableSortColumnSelect{
    margin: 0px;
    padding: 0px;
    width: 100%;
}
</style>