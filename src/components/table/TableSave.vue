<template>
    <div id="TableSave">
        <el-form ref="form" :model="row" label-width="120px" :label-position="labelPosition">
            <el-form-item v-for="(item,index) in columns" :key="index"  :label="item.title">
                <el-input v-model="row[item.name]"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSave">保存</el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>


export default {
    name:'TableSave',
    components: {},
    props:{
        info:{
            type:Object
        },
        columns:{
            type:Array
        },
        labelPosition:{
            type:String,
            default(){
                return　'top'
            }
        }
    },
    data(){
        return{
           row:{}
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        init() {
            this.row = this.info;
        },
        onSave(){
            this.$emit('update:info', this.row);
            this.$emit('onSave');
        },
        onCancel(){
            this.$emit('onCancel');
        }
    },
    watch: {
        info: function (val) {
            this.row = val
        }
    }
}
</script>
<style scoped>
#Table{

}
</style>