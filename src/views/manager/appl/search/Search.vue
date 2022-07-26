<template>
  <div id="searchIndex">
    <el-row>
      <el-col :span="3"> </el-col>
      <el-col :span="18">
        <el-space :fill="fill" wrap style="width: 100%">
          <el-card shadow="hover">
            <el-row>
              <el-col :span="8" :offset="10">
                <div>
                  <el-avatar src="favicon.ico" :size="120" shape="circle" />
                </div>
                <div style="font-size: 32px">{{ indexSelectValue.label }}</div>
              </el-col>
            </el-row>
            <el-input v-model="indexSelectValue.data" class="w-50 m-2" size="large" :placeholder="indexSelectValue.indexPlaceholder" :suffix-icon="Search" @keypress.enter="toSearchAllTable" />
            <el-space :size="size" :spacer="spacer">
              <div v-for="(item, key) in indexSelect" :key="key">
                <el-button :type="item.value == indexSelectValue.value ? 'primary' : ''" text @click="selectIndex(item)"> {{ item.label }} </el-button>
              </div>
            </el-space>
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

import { applStore } from "@store/appl";
// 使普通数据变响应式的函数
import { storeToRefs } from "pinia";
// 实例化仓库
const store = applStore();
// 解构并使数据具有响应式
const { indexParameters } = storeToRefs(store);

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
    .post<any>("/serve/sysApplInfo/findAllBySort", { sortList: [{ sortIndex: 1, sortName: "sort", sortOrder: "asc" }] })
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((element: any) => {
          let op: SearchIndexParameters = {
            value: element.applCode,
            label: element.applName,
            indexPlaceholder: "请输入" + element.applName + "信息",
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
    router.push({ path: "/resultList" });
  }
}
</script>

<style scoped>
#searchIndex {
}
</style>
