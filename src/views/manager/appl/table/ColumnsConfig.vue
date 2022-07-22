<template>
  <div id="ColumnsConfig">
    <!-- <el-card class="box-card">
      <h3>表字段配置</h3> -->
    <!-- <el-divider /> -->
    <el-table :data="columnsData" style="width: 100%">
      <el-table-column prop="colsName" label="字段名" width="180" />
      <el-table-column prop="colsDesc" label="字段含义" width="180" />
      <el-table-column prop="colsType" label="展示类型" :align="'center'" :header-align="'center'">
        <template #default="scope">
          <el-select v-model="scope.row.colsType" class="m-2" placeholder="展示类型" size="small">
            <el-option v-for="item in sl" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column v-if="parents.type.checkboxType == SearchType.REDIO" prop="colsTypeColor" label="颜色" :align="'center'" :header-align="'center'">
        <template #default="scope"> <el-color-picker v-model="scope.row.colsTypeColor" show-alpha /> </template>
      </el-table-column>
      <el-table-column prop="deleteFlag" label="显示" :align="'center'" :header-align="'center'">
        <template #default="scope">
          <el-switch v-model="scope.row.deleteFlag" class="ml-2" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" inline-prompt active-text="是" inactive-text="否" :active-value="0" :inactive-value="1" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" :align="'center'" :header-align="'center'">
        <template #default="scope">
          <el-input-number v-model="scope.row.sort" />
        </template>
      </el-table-column>
      <el-table-column v-if="parents.type.checkboxType == SearchType.REDIO" prop="searchCloumn" label="作为查询条件" :align="'center'" :header-align="'center'">
        <template #default="scope">
          <el-switch v-model="scope.row.searchCloumn" class="ml-2" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" inline-prompt active-text="是" inactive-text="否" :active-value="'Y'" :inactive-value="'N'" />
        </template>
      </el-table-column>
    </el-table>
    <el-divider />
    <el-row>
      <el-col :span="22"></el-col>
      <el-col :span="2"><el-button type="primary" @click="toSave">保存字段</el-button></el-col>
    </el-row>
    <!-- </el-card> -->
  </div>
</template>

<script setup lang="ts">
import { ColumnType, SysApplTypeTabsColumnInfoVo, TypeOptions } from "@/interface/SysApp";
import { SearchType } from "@/interface/Table";
import http from "@/plugins/http";
import { onBeforeMount, ref, watch } from "vue";
import { SelectOptions } from "@/interface/Table";
import { ElMessage } from "element-plus";

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

const emit = defineEmits(["updateColumn", "coloseColumns"]);
const sl: Array<SelectOptions> = [
  {
    value: ColumnType.LABEL,
    label: "标签显示",
  },
  {
    value: ColumnType.TITLE,
    label: "标题显示",
  },
  {
    value: ColumnType.RELEASE,
    label: "关联关系",
  },
];

let selectTableUuid = ref<string>("");
let localType = ref<string>("");
let columnsData = ref<Array<SysApplTypeTabsColumnInfoVo>>([]);

onBeforeMount(() => {
  selectTableUuid.value = parents.selectRadio;
  localType.value = String(parents.type.value);
  console.log(parents.type, 123);
  initColumns();
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

// 进行保存表字段配置信息
function toSave() {
  http
    .post<any>("/serve/sysApplTypeTabsColumnInfo/saveAll", { list: columnsData.value })
    .then((response) => {
      if (response.code == 200) {
        ElMessage("字段修改成功");
        //关闭窗口
        emit("coloseColumns");
      }
    })
    .catch((err) => {
      // TODO
    });
}

// watch(
//   () => columnsData.value,
//   (ncolums, ocolums) => {
//     if (parents.type.checkboxType == SearchType.REDIO) {
//       emit("updateColumn", ncolums);
//     }
//   }
// );

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
