<template>
  <div id="typeCard">
    <el-card class="box-card" v-for="(type, index) in parents.typeSelect" :key="index">
      <template #header>
        <div class="card-header">
          <span>{{ type.label }}</span>
        </div>
      </template>
      <div v-for="(item, key) in localTableList" :key="key">
        <el-row v-if="item[0] == type.value">
          <el-col v-for="(table, ind) of item[1]" :key="ind" :span="6" class="text item"> {{ table.tabsName }} </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { SelectOptions } from "@interface/Table";
import { SysDbmsTabsTableInfo } from "@interface/SysDbms";
import { onBeforeMount, ref, watch } from "vue";

const parents = defineProps<{
  typeSelect: Array<SelectOptions>;
  tablesList: Map<string, Array<SysDbmsTabsTableInfo>>;
  loading: boolean;
}>();

let localTypeSelect = ref<Array<SelectOptions> | undefined>([]);
let localTableList = ref<Map<string, Array<SysDbmsTabsTableInfo>>>();

onBeforeMount(() => {
  localTableList.value = parents.tablesList;
  localTypeSelect.value = parents.typeSelect;
  console.log(localTableList, localTypeSelect.value, "123456");
});

// 字段數據改變
watch(
  () => [parents.tablesList, parents.typeSelect],
  (newValue, oldValue) => {
    if (newValue[0] != null) {
      localTableList.value = newValue[0];
    } else if (newValue[1] != null) {
      localTypeSelect.value = newValue[1];
    }
    console.log(localTableList, localTypeSelect.value, "123456");
  }
);
</script>

<style scoped lang="scss">
#typeCard {
  .box-card {
    margin-top: 15px;
    margin-left: 0px;
  }
}
</style>
