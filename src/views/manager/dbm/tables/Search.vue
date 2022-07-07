<template>
  <div id="searchTabs">
    <TypeCard :loading="loading" v-if="!loading" :typeSelect="typeSelect" :tablesList="tablesList"></TypeCard>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import http from "@plugins/http";
import { SelectOptions } from "@interface/Table";
import { SysDbmsTabsTableInfo } from "@interface/SysDbms";
import TypeCard from "./TypeCard.vue";
import { ElLoading } from "element-plus";

let typeSelect = ref<Array<SelectOptions>>([]);
let jdbcSelect = ref<Array<SelectOptions>>([]);
let tablesList = new Map<string, Array<SysDbmsTabsTableInfo>>();
let loading = ref<boolean>(true);

onBeforeMount(() => {
  loadType();
  loadJdbc();
  loadTable();
});

// 加载数据库信息
function loadJdbc() {
  http
    .post<any>("/serve/sysDbmsTabsJdbcInfo/findAll", {})
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((element: any) => {
          let op: SelectOptions = {
            value: element.uuid,
            label: element.appName,
          };
          jdbcSelect.value?.push(op);
        });
      }
    })
    .catch((err) => {
      // TODO
    });
}

// 加载类型信息
function loadType() {
  http
    .post<any>("/serve/sysDbmsTabsTypeInfo/findAll", {})
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((element: any) => {
          let op: SelectOptions = {
            value: element.typeCode,
            label: element.typeName,
          };
          typeSelect.value?.push(op);
        });
        typeSelect.value?.push({ value: "OTHERS", label: "其他", default: true });
      }
    })
    .catch((err) => {
      // TODO
    });
}

// 加载类型信息
function loadTable() {
  http
    .post<any>("/serve/sysDbmsTabsTableInfo/findAll", {})
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((table: SysDbmsTabsTableInfo) => {
          if (table.typeCode == null || table.typeCode == "") {
            table.typeCode = "OTHERS";
          }
          if (tablesList.get(String(table.typeCode)) == null) {
            tablesList.set(String(table.typeCode), []);
          }
          tablesList.get(String(table.typeCode))?.push(table);
        });
      }
      loading.value = false;
    })
    .catch((err) => {
      // TODO
    });
}
</script>

<style lang="scss" scoped>
#searchTabs {
}
</style>
