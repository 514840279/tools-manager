<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-card>
          <div id="table-select">
            <div id="title">
              <b> 选择表</b>
            </div>
            <el-row>
              <el-col :span="12">
                <el-select v-model="tabeParam.jdbcUuid" placeholder="选择微服务" size="small" @change="loadTabs()" :clearable="true" :filterable="true">
                  <el-option v-for="item in jdbcSelect" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-select v-model="tabeParam.typeCode" placeholder="选择类型" size="small" @change="loadTabs()" :clearable="true" :filterable="true">
                  <el-option v-for="item in typeSelect" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-col>
            </el-row>
            <TableSelect v-if="showSelectTabs && tabsSelect.length > 0" :data="tabsSelect" title="选择表" @on-select="clickTable"></TableSelect>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>{{ title == "" ? "选择表" : title }}</span>
              <el-button class="button" type="info" plain style="text-align: right" @click="adviceHandle()">获取语句</el-button>
            </div>
          </template>
          <div :loading="loading">
            <v-md-preview v-if="showSql" :text="textAdvice"></v-md-preview>
            <el-empty v-if="!showSql" description="没有变更" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { SelectOptions } from "@/interface/Table";
import http from "@/plugins/http";
import { onBeforeMount, ref } from "vue";
import TableSelect from "@components/select/TableSelect.vue";
import { SysDbmsTabsTableInfo } from "@/interface/SysDbms";

let jdbcSelect = ref<Array<SelectOptions>>([]);
let typeSelect = ref<Array<SelectOptions>>([]);
let tabsSelect = ref<Array<SelectOptions>>([]);

let tabsSelectValue = ref<string>();
let showSelectTabs = ref<boolean>(false);
let showSql = ref<boolean>(false);
let loading = ref<boolean>(false);
let tabeParam = ref<SysDbmsTabsTableInfo>({});

let title = ref<string>("");
let textAdvice = ref<string>(" ```sql \nselect name from dual where 1=2 group by ssd  having ssd <12 order by ss ;\n```\n\n\n::: danger\n这是一个危险警告\n:::");

onBeforeMount(() => {
  loadType();
  loadJdbc();
  loadTabs();
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
      }
    })
    .catch((err) => {
      // TODO
    });
}

// 加载表信息
function loadTabs() {
  showSelectTabs.value = false;
  tabsSelect.value = [];
  if (tabeParam.value.jdbcUuid == "") {
    tabeParam.value.jdbcUuid = null;
  }
  if (tabeParam.value.typeCode == "") {
    tabeParam.value.typeCode = null;
  }
  http
    .post<any>("/serve/sysDbmsTabsTableInfo/findAll", tabeParam.value)
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((element: any) => {
          let op: SelectOptions = {
            value: element.uuid,
            label: element.tabsName,
            title: element.tabsDesc,
          };
          tabsSelect.value?.push(op);
        });

        showSelectTabs.value = true;
      }
    })
    .catch((err) => {
      // TODO
    });
}

// 绑定点击表名事件
function clickTable(item: SelectOptions) {
  if (item) {
    title.value = item.title ? item.title : item.label;
    tabsSelectValue.value = String(item.value);
    loadText();
  }
}

// 更新数据
function adviceHandle() {
  http
    .post<any>("/serve/sysAdviceMess/generateSql", { tabsUuid: tabsSelectValue.value })
    .then((response) => {
      if (response.code == 200) {
        loadText();
      }
    })
    .catch((err) => {
      // TODO
    });
}

//loadText
function loadText() {
  loading.value = true;
  showSql.value = false;
  http
    .post<any>("/serve/sysAdviceMess/findOneText", { tabsUuid: tabsSelectValue.value })
    .then((response) => {
      if (response.data != null && response.data != "" && response.code == 200) {
        textAdvice.value = response.data;
        showSql.value = true;
      }
      loading.value = false;
    })
    .catch((err) => {
      // TODO
    });
}
</script>

<style scoped></style>
