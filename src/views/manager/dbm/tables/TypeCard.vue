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
                <el-link target="_blank" type="primary" class="table-item" @click="searchTable(table)">{{ table.tabsDesc == null || table.tabsDesc == "" ? table.tabsName : table.tabsDesc }}</el-link>
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
import { useRouter } from "vue-router";
import { searchTableStore } from "@store/search";

// 使普通数据变响应式的函数
import { storeToRefs } from "pinia";
// 实例化仓库
const store = searchTableStore();
// 解构并使数据具有响应式
const { currentTable } = storeToRefs(store);

const parents = defineProps<{
  typeSelect: Array<SelectOptions>;
  tablesList: Map<string, Array<SysDbmsTabsTableInfo>>;
  loading: boolean;
}>();

let localTypeSelect = ref<Array<SelectOptions> | undefined>([]);
let localTableList = ref<Map<string, Array<SysDbmsTabsTableInfo>>>();
const router = useRouter();

onBeforeMount(() => {
  localTableList.value = parents.tablesList;
  localTypeSelect.value = parents.typeSelect;
});

function searchTable(table: SysDbmsTabsTableInfo) {
  currentTable.value = table;
  // alert(table.tabsName);

  // const { href } = router.resolve("/searchData");
  // window.open(href, "_blank");

  router.push({ path: "/searchData" });
}

// 字段數據改變
watch([parents.tablesList, parents.typeSelect], ([tablesList, typeSelect], [otablesList, otypeSelect]) => {
  if (tablesList != null) {
    localTableList.value = tablesList;
  } else if (typeSelect != null) {
    localTypeSelect.value = typeSelect;
  }
});
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
