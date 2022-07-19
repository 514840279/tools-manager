<template>
  <div id="TableCheckBox">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>配置表选项</span>
          <span v-if="parents.selectValue.checkboxType == SearchType.REDIO" style="color: red"> 单选类型的表只能且只有一个表配置</span>
        </div>
      </template>
      <el-row>
        <el-col :span="18"></el-col>
        <el-col :span="6"><el-input v-model="input" placeholder="快速查找表" /></el-col>
      </el-row>
      <div style="float: right"></div>
      <el-row>
        <el-col :span="24">
          <el-radio-group v-model="selectRadio" class="ml-4" v-if="parents.selectValue.checkboxType == SearchType.REDIO">
            <el-radio v-for="(item, index) in nameFilter(tabsChecks)" :key="index" :label="item.tabsUuid">{{ item.tabsDesc == null || item.tabsDesc == "" ? item.tabsName : item.tabsDesc }}</el-radio>
          </el-radio-group>

          <el-checkbox-group v-model="checkList" v-if="parents.selectValue.checkboxType == SearchType.CHECKBOX && tabsChecks.length > 0">
            <el-checkbox v-for="(item, index) in nameFilter(tabsChecks)" :key="index" :label="item.tabsUuid">{{ item.tabsDesc == null || item.tabsDesc == "" ? item.tabsName : item.tabsDesc }}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22"></el-col>
        <el-col :span="2"><el-button type="primary" @click="toSave">确定</el-button></el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { SysApplTypeTabsInfo, SysApplTypeTabsInfoVo, TypeOptions } from "@/interface/SysApp";
import { SearchType } from "@/interface/Table";
import http from "@/plugins/http";
import { onBeforeMount, ref, watch } from "vue";
import { ElMessage } from "element-plus";

const parents = withDefaults(
  defineProps<{
    selectValue: TypeOptions;
  }>(),
  {
    selectValue: () => {
      return {
        checkboxType: "",
        uuid: "",
        value: "",
        label: "",
      };
    },
  }
);

let localType = ref<TypeOptions>();
let tabsChecks = ref<Array<SysApplTypeTabsInfoVo>>([]);
let selectRadio = ref<string>();
let checkList = ref<Array<string>>([]);
let input = ref<string>("");

onBeforeMount(() => {
  localType.value = parents.selectValue;
  initTables();
});

// 获取表名称
function initTables() {
  selectRadio.value = "";
  checkList.value = [];
  tabsChecks.value = [];
  http
    .post<any>("/serve/sysApplTypeTabsInfo/findAllTablesCheck", {
      info: { typeCode: localType.value?.value },
    })
    .then((response) => {
      if (response.data != null && response.code == 200) {
        tabsChecks.value = response.data;
        response.data.forEach((element: SysApplTypeTabsInfoVo) => {
          if (localType.value?.checkboxType == SearchType.REDIO && element.checkboxType == SearchType.REDIO && element.typeCode == localType.value.value) {
            selectRadio.value = element.tabsUuid;
          }
          if (localType.value?.checkboxType == SearchType.CHECKBOX && element.checkboxType == SearchType.CHECKBOX && element.typeCode == localType.value.value) {
            checkList.value.push(element.tabsUuid);
          }
        });
      }
    })
    .catch((err) => {
      // TODO
    });
}

// 过滤
function nameFilter(tabsChecks: Array<SysApplTypeTabsInfoVo>): Array<SysApplTypeTabsInfoVo> {
  if (input.value == "") {
    return tabsChecks;
  } else {
    let aa: Array<SysApplTypeTabsInfoVo> = [];
    tabsChecks.forEach((el: SysApplTypeTabsInfoVo) => {
      if (el.tabsName.toLowerCase().indexOf(input.value.toLowerCase()) > -1 || (el.tabsDesc != null && el.tabsDesc.toLowerCase().indexOf(input.value.toLowerCase()) > -1)) {
        aa.push(el);
      }
    });
    return aa;
  }
}

// 进行保存表配置信息
function toSave() {
  if (localType.value?.checkboxType == SearchType.REDIO) {
  } else if (localType.value?.checkboxType == SearchType.CHECKBOX) {
    saveChecks();
  }
}

// 保存多选的信息
function saveChecks() {
  let param: Array<SysApplTypeTabsInfo> = [];
  tabsChecks.value.forEach((tabs) => {
    checkList.value.forEach((checked) => {
      if (tabs.tabsUuid == checked) {
        debugger;
        param.push({
          uuid: tabs.uuid,
          typeCode: String(localType.value?.value),
          tabsUuid: tabs.tabsUuid,
          checkboxType: SearchType.CHECKBOX,
        });
      }
    });
  });

  http
    .post<any>("/serve/sysApplTypeTabsInfo/saveList", { list: param })
    .then((response) => {
      if (response.code == 200) {
        console.log(param, 4455);
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
