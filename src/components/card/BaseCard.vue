<template>
  <div id="BaseCard">
    <el-card class="box-card">
      <el-row>
        <el-col :span="6">
          <div class="block">
            <el-avatar> {{ firstName(title) }} </el-avatar>
          </div>
        </el-col>
        <el-col :span="18">
          <div>
            <el-tag v-for="(item, index) in lebels" :key="index" :color="item.color" effect="dark">{{ item.value }}</el-tag>
          </div>
          <div>
            <el-descriptions :title="title">
              <el-descriptions-item v-for="(item, index) in tableData" :key="index" :label="item.name">{{ item.value }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ColumnType, SysApplTypeTabsColumnInfoVo } from "@/interface/SysApp";

import { onBeforeMount, ref } from "vue";

const parents = withDefaults(
  defineProps<{
    columns: Array<SysApplTypeTabsColumnInfoVo>;
    datas?: any;
  }>(),
  {
    title: () => "",
    columns: () => [],
    datas: () => {},
  }
);

let title = ref<string>("");
let lebels = ref<Array<any>>([]);
let tableData = ref<Array<any>>([]);

onBeforeMount(() => {
  parents.columns.forEach((column: SysApplTypeTabsColumnInfoVo) => {
    switch (column.colsType) {
      case ColumnType.TITLE:
        title.value = datas[column.colsName];
        break;
      case ColumnType.LABEL:
        lebels.value.push({
          name: column.colsDesc == null || column.colsDesc == "" ? column.colsName : column.colsDesc,
          value: datas[column.colsName],
          color: column.colsTypeColor,
        });
        break;
      default:
        break;
    }
    if (column.deleteFlag == 0 || column.deleteFlag == null) {
      tableData.value.push({
        name: column.colsDesc == null || column.colsDesc == "" ? column.colsName : column.colsDesc,
        value: datas[column.colsName],
      });
    }
  });
});

function firstName(text: string) {
  if (text.length > 1) {
    return text.substring(0, 1);
  } else {
    return "空";
  }
}
</script>

<style lang="scss" scoped>
#BaseCard {
  width: 100%;
}
</style>
