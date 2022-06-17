<template>
    <el-row>
        <el-col :span="Math.floor(20 / searchSize)" v-for="(item, index) in columns" :key="index" class="ainput">
            <template v-if="item.searchType == SearchType.TEXT">
                <el-input size="small" v-model="parents.searchParameters[index]['data']" :placeholder="item.searchPlaceholder" @input="handleSearch()" />
            </template>
            <template v-if="item.searchType == SearchType.INTEGER">
                <el-input-number class="full" size="small" v-model="parents.searchParameters[index]['data']" :placeholder="item.searchPlaceholder" @change="handleSearch()" />
            </template>
            <template v-else-if="item.searchType == SearchType.SELECT">
                <el-select v-model="parents.searchParameters[index]['data']" class="full" :placeholder="item.searchPlaceholder" size="small" @change="handleSearch()" :clearable="true">
                    <el-option v-for="op in item.searchDataArray" :key="op.value" :label="op.label" :value="op.value" />
                </el-select>
            </template>
        </el-col>
        <el-col :span="2">
            <el-button title="确定" @click="handleSearch()" type="success" icon="Check" circle size="small"></el-button>
            <el-button title="重置" @click="handleReset()" icon="CloseBold" circle size="small"></el-button>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { SearchColumn, SearchParamters, SearchType } from '../../interface/Table'


const parents = withDefaults(defineProps<{
    searchColumns?: Array<SearchColumn>,
    searchParameters?: Array<SearchParamters>
}>(), {
    searchColumns: () => [],
    searchParameters: () => []
});

let
    columns = ref<Array<SearchColumn>>([]),
    searchSize = ref<number>(0);

const emit = defineEmits(["searchTable"]);


onMounted(() => {
    columns.value = parents.searchColumns;
    init();
});

function init() {
    parents.searchColumns.forEach((column, index) => {
        if (index < 5) {
            if (column.searchType == SearchType.SELECT || column.searchType == SearchType.INTEGER) {
                parents.searchParameters.push({
                    operator: 'and',
                    column: column.searchName,
                    title: column.searchTitle,
                    symbol: "eq",
                    data: undefined,
                    searchPlaceholder: column.searchPlaceholder,
                    showdata: true,
                    searchDataArray: column.searchDataArray,
                    searchType: column.searchType
                })
            } else {
                parents.searchParameters.push({
                    operator: 'and',
                    column: column.searchName,
                    title: column.searchTitle,
                    symbol: "like",
                    data: "",
                    searchPlaceholder: column.searchPlaceholder,
                    showdata: true,
                    searchType: column.searchType
                })
            }
        }
    });
    searchSize.value = parents.searchParameters.length;
}
// 查询筛选
function handleSearch() {
    emit("searchTable");
}
function handleReset() {
    parents.searchParameters.forEach(item => {
        item.data = "";
    });
    handleSearch();
}
</script>

<style lang="scss" scoped>
.ainput {
    padding: 0px 5px;
}

.full {
    width: 100%;
}
</style>