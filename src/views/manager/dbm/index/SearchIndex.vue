<template>
  <div id="searchIndex">
    <el-row>
      <el-col :span="3"> </el-col>
      <el-col :span="18">
        <el-space :fill="fill" wrap>
          <el-card shadow="hover">
            <el-input v-model="indexSelectValue.data" class="w-50 m-2" size="large" :placeholder="indexSelectValue.indexPlaceholder" :suffix-icon="Search" @keypress.enter="toSearchAllTable" />
            <el-space :size="size" :spacer="spacer">
              <div v-for="(item, key) in indexSelect" :key="key">
                <el-button :type="item.value == indexSelectValue.value ? 'primary' : ''" text @click="selectIndex(item)"> {{ item.label }} </el-button>
              </div>
            </el-space>
          </el-card>

          <el-card shadow="hover">
            <el-input v-model="indexSelectValue.data" :placeholder="indexSelectValue.indexPlaceholder" size="large" class="input-with-select" :suffix-icon="Search" @keypress.enter="toSearchAllTable">
              <template #prepend>
                <el-select v-model="indexSelectValue" placeholder="Select" size="large" style="width: 115px" @change="changeSelectIndex">
                  <el-option v-for="item in indexSelect" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
            </el-input>
          </el-card>
        </el-space>
      </el-col>
      <el-col :span="3"> </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { h, onBeforeMount, ref } from "vue";
import { ElDivider, ElMessage } from "element-plus";
import { SearchIndexParameters } from "@interface/SearchIndex";
import { Search } from "@element-plus/icons-vue";
import http from "@plugins/http";
import { router } from "@/router";

import { searchIndexStore } from "@store/index";
// 使普通数据变响应式的函数
import { storeToRefs } from "pinia";
// 实例化仓库
const store = searchIndexStore();
// 解构并使数据具有响应式
const { indexParameters, startSearch } = storeToRefs(store);

const size = ref(1);
const fill = ref(true);
const spacer = h(ElDivider, { direction: "vertical" });

let indexSelect = ref<Array<SearchIndexParameters>>([]);
let indexSelectValue = ref<SearchIndexParameters>({ label: "", value: "" });

onBeforeMount(() => {
  loadIndex();

  init();
});

// 加载数据类型信息
function loadIndex() {
  http
    .post<any>("/serve/sysDbmsTabsIndexInfo/findAll", {})
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((element: any) => {
          let op: SearchIndexParameters = {
            value: element.indexCode,
            label: element.indexName,
            indexPlaceholder: "请输入" + element.indexPlaceholder,
          };
          indexSelect.value?.push(op);
        });
        indexSelectValue.value = indexSelect.value[0];
      }
    })
    .catch((err) => {
      // TODO
    });
}

function init() {}

// 切换类型
function selectIndex(item: SearchIndexParameters) {
  indexSelectValue.value = item;
}
// 下拉框修改值
function changeSelectIndex(val: any) {
  indexSelect.value.forEach((el) => {
    if (el.value == val) {
      indexSelectValue.value = el;
    }
  });
}
// 开始查询表数据
function toSearchAllTable() {
  if (indexSelectValue.value.data == null || String(indexSelectValue.value.data).split(" ").join("").length === 0) {
    ElMessage({
      message: "参数不能为空",
      type: "warning",
    });
    return;
  } else {
    // TODO
    indexParameters.value = [indexSelectValue.value];
    startSearch.value = true;

    router.push({ path: "/searchIndexData" });
  }
}
</script>

<style scoped>
#searchIndex {
}
</style>
