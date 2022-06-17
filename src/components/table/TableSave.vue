<template>
    <div id="TableSave">
        <el-form ref="form" :model="row" label-width="120px" :label-position="parents.labelPosition">
            <el-form-item v-for="(item, index) in parents.columns" :key="index" :label="item.title">
                <Icon v-if="item.type == SearchType.ICON" :columnName="item.name" :icon="row[item.name]" type="info" @onSelect="selectIcon"></Icon>
                <el-select v-else-if="item.type == SearchType.SELECT" v-model="row[item.name]" class="m-2" placeholder="Select" size="small">
                    <el-option v-for="op in item.searchDataArray" :key="op.value" :label="op.label" :value="op.value" />
                </el-select>
                <el-input-number v-else-if="item.type == SearchType.INTEGER" v-model="row[item.name]"></el-input-number>
                <el-input v-else v-model="row[item.name]"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSave">保存</el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { Column, SearchType } from '../../interface/Table'
import Icon from '../select/icon/Index.vue'

const parents = withDefaults(defineProps<{
    info?: any,
    columns: Array<Column>,
    labelPosition?: String
}>(), {
    info: () => { },
    columns: () => [],
    labelPosition: () => "top"
});


const emit = defineEmits(["onSave", "update:info", "onCancel"]);

let row = ref<any>({});

onBeforeMount(() => {
    row.value = parents.info;
})


function onSave() {
    emit('update:info', row.value);
    emit('onSave');
}
function onCancel() {
    emit('onCancel');
}

function selectIcon(param: any) {
    row.value[param.columnName] = param.icon;

}



</script>
<style scoped>
#Table {}
</style>