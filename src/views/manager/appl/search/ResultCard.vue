<template>
  <div id="BaseCard">
    <el-row>
      <el-col :span="6">
        <div class="block">
          <el-avatar :size="180" style="font-size: 50px"> {{ firstName(title_text) }} </el-avatar>
        </div>
      </el-col>
      <el-col :span="18">
        <el-descriptions>
          <!-- 标题 -->
          <template #title>
            <el-link @click="toSearchDetail" style="font-size: 32px">{{ title_text }}</el-link>
          </template>
          <!-- 控件 -->
          <template #extra>
            <el-button type="info" :title="'收藏，待开发'" :icon="Message" circle />
          </template>
          <!-- labels -->
          <el-descriptions-item :span="3">
            <el-tag v-for="(item, index) in label_text" :key="index" :color="item.color" style="margin-right: 8px" effect="dark" :title="item.name">{{ item.data }}</el-tag>
          </el-descriptions-item>
          <!-- 列表展示 -->
          <el-descriptions-item v-for="(item, index) in tableData" :key="index" :label="item.name">{{ item.data }}</el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Message } from "@element-plus/icons-vue";
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

let rel_data = ref<any>();

const emit = defineEmits(["onSearchDetail"]);

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
    if (column.isRelation) {
      rel_data.value = parents.data[String(column.colsName)];
    }
    if ((column.deleteFlag == 0 || column.deleteFlag == null) && column.show) {
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

function toSearchDetail() {
  emit("onSearchDetail", { data: parents.data, rel: rel_data.value });
}
</script>

<style lang="scss" scoped>
#BaseCard {
  width: 100%;
  .block {
    text-align: center;
    height: 100%;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
}
</style>
