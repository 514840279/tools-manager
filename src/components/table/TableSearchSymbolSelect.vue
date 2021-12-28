<template>
    <div id="TableSearchSymbolSelect">
        <el-select v-model="row.symbol" size="mini" style="width:100%"  @change="handleChangeSymbol">
            <el-option
                v-for="(sy,idx) in symbols"
                :key="idx"
                :label="sy.label"
                :value="sy.value"
            >
            </el-option>
        </el-select>
    </div>
</template>
<script>


export default {
    name:'TableSearchSymbolSelect',
    components: {},
    props:{
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
            row: null,
            symbols:[
                {label:"相等",value:"eq"},
                {label:"不等",value:"notEq"},
                {label:"小于",value:"less"},
                {label:"小于等于",value:"lessAndEq"},
                {label:"大于",value:"great"},
                {label:"大于等于",value:"greatAndEq"},
                {label:"包含",value:"like"},
                {label:"为空",value:"isNull"},
                {label:"不为空",value:"isNotNull"},
            ],           
        }
    },
    created(){
        this.row = this.item;
    },
    mounted(){
        this.init();
    },
    methods:{
        init() {
        },
        handleChangeSymbol(va){
            switch(va){
                case"eq":
                case"notEq":
                case"less":
                case"lessAndEq":
                case"great":
                case"greatAndEq":
                case"like":
                    this.row.showdata = true;
                    break;
                case"isNull":
                case"isNotNull":
                case"isEmpty":
                case"isNotEmpty":
                    this.row.showdata = false;
                    break;
                default:
                    this.row.showdata = true;
                    break;
            }

        }
    }
}
</script>
<style scoped>
#TableSearchSymbolSelect{
    margin: 0px;
    padding: 0px;
    width: 100%;

}
</style>