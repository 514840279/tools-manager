<template>
  <div id="TableCheckBox">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>配置类型选项</span>
        </div>
      </template>
      <el-row>
        <el-col :span="18"></el-col>
        <el-col :span="6"><el-input v-model="input" placeholder="快速查找类型" /></el-col>
      </el-row>
      <div style="float: right"></div>
      <el-row>
        <el-col :span="24">
          <el-checkbox-group v-model="checkList" v-if="tabsChecks.length > 0">
            <el-checkbox v-for="(item, index) in nameFilter(tabsChecks)" :key="index" :label="item.typeCode">{{ item.typeName }}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22"></el-col>
        <el-col :span="2"><el-button type="primary" @click="saveChecks">确定</el-button></el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { SysApplDataTypeInfoVo, SysApplDataTypeInfo } from "@/interface/SysApp";
import { SearchType, SelectOptions } from "@/interface/Table";
import http from "@/plugins/http";
import { onBeforeMount, ref, watch } from "vue";
import { ElMessage } from "element-plus";

const parents = withDefaults(
  defineProps<{
    selectValue: SelectOptions;
  }>(),
  {
    selectValue: () => {
      return {
        uuid: "",
        value: "",
        label: "",
      };
    },
  }
);

let localType = ref<SelectOptions>();
let tabsChecks = ref<Array<SysApplDataTypeInfoVo>>([]);
let checkList = ref<Array<string>>([]);
let input = ref<string>("");

onBeforeMount(() => {
  localType.value = parents.selectValue;
  initTables();
});

// 获取表名称
function initTables() {
  checkList.value = [];
  tabsChecks.value = [];
  http
    .post<any>("/serve/sysApplDataTypeInfo/findAllTablesCheck", { applCode: localType.value?.value })
    .then((response) => {
      if (response.data != null && response.code == 200) {
        tabsChecks.value = response.data;
        response.data.forEach((element: SysApplDataTypeInfoVo) => {
          if (element.checkboxType == SearchType.CHECKBOX && element.applCode == localType.value?.value) {
            checkList.value.push(element.typeCode);
          }
        });
      }
    })
    .catch((err) => {
      // TODO
    });
}

// 过滤
function nameFilter(tabsChecks: Array<SysApplDataTypeInfoVo>): Array<SysApplDataTypeInfoVo> {
  if (input.value == "") {
    return tabsChecks;
  } else {
    let aa: Array<SysApplDataTypeInfoVo> = [];
    tabsChecks.forEach((el: SysApplDataTypeInfoVo) => {
      if (el.typeCode.toLowerCase().indexOf(input.value.toLowerCase()) > -1 || (el.typeName != null && el.typeName.toLowerCase().indexOf(input.value.toLowerCase()) > -1)) {
        aa.push(el);
      }
    });
    return aa;
  }
}

// 保存多选的信息
function saveChecks() {
  let param: Array<SysApplDataTypeInfo> = [];
  tabsChecks.value.forEach((tabs) => {
    checkList.value.forEach((checked) => {
      if (tabs.typeCode == checked) {
        param.push({
          uuid: tabs.uuid,
          typeCode: tabs.typeCode,
          applCode: String(localType.value?.value),
          checkboxType: SearchType.CHECKBOX,
        });
      }
    });
  });

  http
    .post<any>("/serve/sysApplDataTypeInfo/saveList", { list: param })
    .then((response) => {
      if (response.code == 200) {
        ElMessage("修改成功");
        initTables();
      }
    })
    .catch((err) => {
      // TODO
      ElMessage.error(err);
    });
}

watch(
  () => parents.selectValue,
  (nselectValue, oselectValue) => {
    localType.value = nselectValue;
    initTables();
  }
);
</script>

<style lang="scss" scoped>
#TableCheckBox {
}
</style>
