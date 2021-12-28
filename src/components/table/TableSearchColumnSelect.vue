<template>
    <div id="TableSearchColumnSelect">
        <el-select v-model="value" size="mini" style="width:100%"  @change="handleChange">
            <el-option
                v-for="(cl,idx) in columns"
                :key="idx"
                :label="cl.searchTitle"
                :value="cl.searchName"
            >
            </el-option>
        </el-select>
    </div>
</template>
<script>


export default {
    name:'TableSearchColumnSelect',
    components: {},
    props:{
        columns:{
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
        this.row = this.item;
        this.value = this.row.column;
        this.pdata = this.parameters;
    },
    mounted(){
    },
    methods:{
        handleChange(va){
            this.columns.forEach(item =>{
                if(item.searchName == va){
                    this.row.column= item.searchName;
                    this.row.title= item.searchTitle,
                    this.pdata.splice(this.index, 1,this.row);
                }
            });
        }
    }
}
</script>
<style scoped>
#TableSearchColumnSelect{
    margin: 0px;
    padding: 0px;
    width: 100%;
}
</style>