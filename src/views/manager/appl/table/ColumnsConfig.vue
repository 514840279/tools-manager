<template>
  <div id="ColumnsConfig">
    <el-card class="box-card">
      <h3>表字段配置</h3>

      <el-table :data="columnsData" style="width: 100%">
        <el-table-column prop="colsName" label="字段名" width="180" />
        <el-table-column prop="colsDesc" label="字段含义" width="180" />
        <el-table-column prop="colsType" label="展示类型">
          <template #default="scope">
            <el-select v-model="scope.row.colsType" class="m-2" placeholder="展示类型" size="small">
              <el-option v-for="item in sl" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="colsTypeColor" label="颜色">
          <template #default="scope"> <el-color-picker v-model="scope.row.colsTypeColor" show-alpha /> </template>
        </el-table-column>
        <el-table-column prop="deleteFlag" label="显示">
          <template #default="scope">
            <el-switch v-model="scope.row.deleteFlag" class="ml-2" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" inline-prompt active-text="是" inactive-text="否" :active-value="0" :inactive-value="1" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序">
          <template #default="scope">
            <el-input-number v-model="scope.row.sort" :min="1" :max="10" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ColumnType, SysApplTypeTabsColumnInfoVo, TypeOptions } from "@/interface/SysApp";
import http from "@/plugins/http";
import { onBeforeMount, ref, watch } from "vue";
import { SelectOptions } from "@/interface/Table";

const parents = withDefaults(
  defineProps<{
    selectRadio: string;
    type: TypeOptions;
  }>(),
  {
    selectRadio: () => "",
    type: () => {
      return { checkboxType: "", uuid: "", value: "", label: "" };
    },
  }
);

const emit = defineEmits(["updateColumn"]);
const sl: Array<SelectOptions> = [
  {
    value: ColumnType.LABEL,
    label: ColumnType.LABEL,
  },
  {
    value: ColumnType.TITLE,
    label: ColumnType.TITLE,
  },
];

let selectTableUuid = ref<string>("");
let localType = ref<string>("");
let columnsData = ref<Array<SysApplTypeTabsColumnInfoVo>>([]);

onBeforeMount(() => {
  selectTableUuid.value = parents.selectRadio;
  localType.value = String(parents.type.value);
});

function initColumns() {
  http
    .post<any>("/serve/sysApplTypeTabsColumnInfo/findAllTablesCheck", { tabsUuid: selectTableUuid.value, typeCode: localType.value })
    .then((response) => {
      if (response.data != null && response.code == 200) {
        columnsData.value = response.data;
      }
    })
    .catch((err) => {
      // TODO
    });
}

watch(
  () => columnsData.value,
  (ncolums, ocolums) => {
    emit("updateColumn", ncolums);
  }
);

watch(
  () => parents.selectRadio,
  (nselectRadio, oselectRadio) => {
    selectTableUuid.value = String(nselectRadio);
    initColumns();
  }
);
</script>

<style lang="scss" scoped>
#ColumnsConfig {
  width: 100%;
}
</style>
