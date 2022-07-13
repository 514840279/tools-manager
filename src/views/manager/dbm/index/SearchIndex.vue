<template>
  <div id="searchIndex">
    <el-row>
      <el-col :span="3"> </el-col>
      <el-col :span="18">
        <el-space :fill="fill" wrap>
          <el-card shadow="hover">
            <el-input v-model="input1" class="w-50 m-2" size="large" :placeholder="indexPlaceholder" :suffix-icon="Search" />
            <el-space :size="size" :spacer="spacer">
              <div v-for="(item, key) in indexSelect" :key="key">
                <el-button :type="item.value == indexSelectValue ? 'primary' : ''" text @click="selectIndex(item)"> {{ item.label }} </el-button>
              </div>
            </el-space>
          </el-card>

          <el-card shadow="hover">
            <el-input v-model="input1" :placeholder="indexPlaceholder" size="large" class="input-with-select" :suffix-icon="Search">
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
import { ElDivider } from "element-plus";
import { Column, SearchType, SelectOptions, OptionBtn, PageParam } from "@interface/Table";
import { Search } from "@element-plus/icons-vue";
import http from "@plugins/http";

interface ButtonOption extends SelectOptions {
  indexPlaceholder?: string;
}

const size = ref(1);
const fill = ref(true);
const input1 = ref("");
const spacer = h(ElDivider, { direction: "vertical" });

let indexSelect = ref<Array<ButtonOption>>([]);
let indexSelectValue = ref<string | number | boolean | undefined>("");

let indexPlaceholder = ref<string | undefined>("请输入数据进行查询");

onBeforeMount(() => {
  loadIndex();

  init();
});

// 加载数据库信息
function loadIndex() {
  http
    .post<any>("/serve/sysDbmsTabsIndexInfo/findAll", {})
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((element: any) => {
          let op: ButtonOption = {
            value: element.indexCode,
            label: element.indexName,
            indexPlaceholder: element.indexPlaceholder,
          };
          indexSelect.value?.push(op);
        });
        indexSelectValue.value = indexSelect.value[0].value;
        indexPlaceholder.value = indexSelect.value[0].indexPlaceholder;
      }
    })
    .catch((err) => {
      // TODO
    });
}

function init() {}

// 切换类型
function selectIndex(item: ButtonOption) {
  indexSelectValue.value = item.value;
  indexPlaceholder.value = item.indexPlaceholder;
}
// 下拉框修改值
function changeSelectIndex(val: any) {
  indexSelect.value.forEach((el) => {
    if (el.value == val) {
      indexSelectValue.value = el.value;
      indexPlaceholder.value = el.indexPlaceholder;
    }
  });
}
</script>

<style scoped>
#searchIndex {
}
</style>
