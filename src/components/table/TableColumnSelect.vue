<template>
    <div id="TableColumnSelect">
        <el-popover placement="bottom"  title="列筛选" trigger="click" >
            <template #reference>
                <el-button icon="el-icon-caret-bottom" circle size="mini"  title="列选择"></el-button>
            </template>
            <el-checkbox-group v-model="checkList" @change="filter" style="max-width:1500px;">
                <ul  class="infinite-list" style="overflow: auto">
                    <li v-for="(item, index) in tableList" :key="index" class="infinite-list-item">
                        <el-checkbox   :label="item.title"></el-checkbox>
                    </li>
                </ul>
            </el-checkbox-group>
        </el-popover>
    </div>
</template>
<script>
export default {
    name:'TableColumnSelect',
    components: {},
    data(){
        return{
            tableList:[],
            checkList:[],
            list:[],
            result:[],
        }
    },
    props:{
        columns:{
            type:Array
        }
    },
    created(){
        this.tableList = this.columns;
    },
    mounted(){
        var _this = this;
        this.tableList.forEach((item,index)=>{
            if(item.show==null){
                item.show=true;
            }
            if(item.show){
                _this.checkList.push(item.title);
            }
            _this.list.push(item.title)
        });
    },
    methods:{
        filter(val) {
            this.result = this.list.filter(number => !val.includes(number))
            // console.log('result',result)
            if(this.result.length>=1){
                this.result.forEach((item,index)=>{
                    this.tableList.forEach((items,indexs)=>{
                        if(items.title == item){
                            items.show = false;
                        }
                    });
                });
            }
            val.forEach((item,index)=>{
                this.tableList.forEach((items,indexs)=>{
                    if(items.title == item){
                        items.show = true;
                    }
                });
            });
            this.$emit('update:columns', this.tableList);
        },

    }
}
</script>
<style scoped  lang="scss">
#TableColumnSelect{
    font-size: 18px;
    padding:0px;
    margin: 0px;
    margin-left: 10px;
    white-space: nowrap;
    display: inline-block;
    min-height: 40px;

}

.infinite-list {
  height: 180px;
  padding: 0;
  margin: 0;
  list-style: none;

  .infinite-list-item {
    display: flex;
    justify-content: left;
    height: 20px;
    background: var(--el-color-primary-light-9);
    margin: 2px;
    color: var(--el-color-primary);
    & + .list-item {
      margin-top: 10px;
    }
  }
}
</style>