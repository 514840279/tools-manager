<template>
  <div id="BaseCard">
    <el-card class="box-card">
      <el-row>
        <el-col :span="6">
          <div class="block">
            <el-avatar :size="200" style="font-size: 50px"> {{ firstName(title_text) }} </el-avatar>
          </div>
        </el-col>
        <el-col :span="18">
          <div>
            <el-descriptions>
              <template #title>
                <div style="font-size: 32px">
                  <el-link type="primary" @click="">{{ title_text }}</el-link>
                </div>
              </template>

              <template #extra>
                <el-button type="info" :title="'收藏，待开发'" :icon="Message" circle />
              </template>
              <el-descriptions-item :span="3">
                <el-tag v-for="(item, index) in label_text" :key="index" :color="item.color" style="margin-right: 8px" effect="dark">{{ item.data }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item v-for="(item, index) in tableData" :key="index" :label="item.name">{{ item.data }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Check, Delete, Edit, Message, Search, Star } from "@element-plus/icons-vue";
import { ColumnType, SysApplTypeTabsColumnInfoVo } from "@/interface/SysApp";

import { applStore } from "@store/appl";
// 使普通数据变响应式的函数
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
// 实例化仓库
const store = applStore();
// 解构并使数据具有响应式
const { singleApplTableColumns } = storeToRefs(store);

const parents = withDefaults(
  defineProps<{
    data: any;
    index: number;
  }>(),
  {
    data: () => {},
    index: () => 0,
  }
);

let title_text = ref<string>("");
let label_text = ref<Array<any>>([]);
let tableData = ref<Array<any>>([]);

onBeforeMount(() => {
  singleApplTableColumns.value.forEach((column: SysApplTypeTabsColumnInfoVo) => {
    switch (column.colsType) {
      case ColumnType.TITLE:
        title_text.value = parents.data[String(column.colsName)];
        break;
      case ColumnType.LABEL:
        label_text.value.push({
          name: column.colsDesc == null || column.colsDesc == "" ? column.colsName : column.colsDesc,
          data: parents.data[String(column.colsName)],
          color: column.colsTypeColor,
        });
        break;
      default:
        break;
    }

    if (column.deleteFlag == 0 || column.deleteFlag == null) {
      tableData.value.push({
        name: column.colsDesc == null || column.colsDesc == "" ? column.colsName : column.colsDesc,
        data: parents.data[String(column.colsName)],
      });
    }
  });
});

function firstName(text: string) {
  if (text.length > 6) {
    return text.substring(0, 3) + "\r\n" + text.substring(3, 6);
  } else if (text.length > 3) {
    return text.substring(0, 3) + "\r\n" + text.substring(3);
  } else {
    return text;
  }
}
</script>

<style lang="scss" scoped>
#BaseCard {
  width: 100%;
}
</style>
