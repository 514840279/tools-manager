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
          <el-col v-for="(table, ind) of item[1]" :key="ind" :span="6" class="text-item">
            <el-popover placement="bottom" :width="250" trigger="hover">
              <template #reference>
                <div class="table-item" @click="searchTable(table)">{{ table.tabsDesc == null || table.tabsDesc == "" ? table.tabsName : table.tabsDesc }}</div>
              </template>
              <template #default>
                <el-descriptions :title="table.tabsDesc == null || table.tabsDesc == '' ? table.tabsName : table.tabsDesc" :column="1">
                  <el-descriptions-item label="表名：">{{ table.tabsName }}</el-descriptions-item>
                  <el-descriptions-item label="表含义：">{{ table.tabsDesc }}</el-descriptions-item>
                  <el-descriptions-item label="表数据量：">{{ table.tabsRows }}</el-descriptions-item>
                  <el-descriptions-item label="表空间大小：">{{ table.tabsSpace }}</el-descriptions-item>
                  <el-descriptions-item label="表排序：">{{ table.sort }}</el-descriptions-item>
                  <el-descriptions-item label="是否隐藏：">{{ table.deleteFlag == 1 ? "是" : "否" }}</el-descriptions-item>
                </el-descriptions>
              </template>
            </el-popover>
          </el-col>
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

function searchTable(table: SysDbmsTabsTableInfo) {
  alert(table.tabsName);
}

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
    .table-item {
      height: 30px;
      font-size: 18px;
      border-radius: 5px;
      padding-left: 5px;
      align-content: center;
    }
    .table-item:hover {
      background-color: rgb(243, 237, 237);
    }
  }
}
</style>
