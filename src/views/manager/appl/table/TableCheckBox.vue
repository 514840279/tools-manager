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
      <el-radio-group v-model="selectRadio" v-if="parents.selectValue.checkboxType == SearchType.REDIO" style="width: 100%">
        <el-table :data="nameFilter(tabsChecks)" style="width: 100%" ref="singleTableRef" highlight-current-row @current-change="handleCurrentChange">
          <el-table-column prop="checkboxType" label="单选" width="80">
            <template #default="scope">
              <!-- <el-input-number v-model="scope.row.checkboxType" :min="1" :max="10" /> -->
              <el-radio :label="scope.row.tabsUuid">{{}}</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="tabsName" label="表名" width="260" />
          <el-table-column prop="tabsDesc" label="表含义" />
          <el-table-column prop="sort" label="排序" :align="'center'" :header-align="'center'">
            <template #default="scope">
              <el-input-number v-model="scope.row.sort" style="width: 100%" />
            </template>
          </el-table-column>
          <el-table-column label="操作" :align="'center'" :header-align="'center'">
            <template #default="scope">
              <el-button type="primary" v-if="scope.row.tabsUuid == selectRadio" @click="showColumn = true">列配置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-radio-group>

      <el-checkbox-group v-model="checkList" v-if="parents.selectValue.checkboxType == SearchType.CHECKBOX && tabsChecks.length > 0">
        <el-table :data="nameFilter(tabsChecks)" style="width: 100%" ref="multipleTableRef" @selection-change="handleSelectionChange">
          <el-table-column prop="checkboxType" label="单选" width="80">
            <template #default="scope">
              <el-checkbox :label="scope.row.tabsUuid">{{}} </el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="tabsName" label="表名" width="260" />
          <el-table-column prop="tabsDesc" label="表含义" />
          <el-table-column prop="sort" label="排序" :align="'center'" :header-align="'center'">
            <template #default="scope">
              <el-input-number v-model="scope.row.sort" width="80" />
            </template>
          </el-table-column>
          <el-table-column prop="tabsRowsType" label="列表行" :align="'center'" :header-align="'center'">
            <template #default="scope">
              <el-radio-group v-model="scope.row.tabsRowsType">
                <el-radio :label="TabsRowsType.MULTI_LINE">多行</el-radio>
                <el-radio :label="TabsRowsType.SINGLE_LINE">单行</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="操作" :align="'center'" :header-align="'center'" width="80">
            <template #default="scope">
              <el-button type="primary" @click="checkTabColumn(scope.row)">列配置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-checkbox-group>

      <el-row>
        <el-col :span="22"></el-col>
        <el-col :span="2"><el-button type="primary" @click="toSave">确定</el-button></el-col>
      </el-row>
    </el-card>
    <el-dialog v-model="showColumn" title="字段管理" width="95%">
      <ColumnsConfig v-if="selectRadio != '' && showColumn" :type="localType" :selectRadio="selectRadio" :selectTabsRowsType="selectTabsRowsType" @coloseColumns="showColumn = false"></ColumnsConfig>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { SysApplTypeTabsInfo, SysApplTypeTabsInfoVo, TypeOptions, TabsRowsType } from "@/interface/SysApp";
import { SearchType } from "@/interface/Table";
import http from "@/plugins/http";
import { onBeforeMount, ref, watch } from "vue";
import { ElMessage, ElTable } from "element-plus";
import ColumnsConfig from "./ColumnsConfig.vue";

const parents = withDefaults(
  defineProps<{
    selectValue: TypeOptions;
    applCode: string;
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
    applCode: () => "",
  }
);
const currentRow = ref();
const singleTableRef = ref<InstanceType<typeof ElTable>>();
const showColumn = ref(false);

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<SysApplTypeTabsInfoVo[]>([]);

const handleSelectionChange = (val: SysApplTypeTabsInfoVo[]) => {
  multipleSelection.value = val;
};

let localType = ref<TypeOptions>();
let tabsChecks = ref<Array<SysApplTypeTabsInfoVo>>([]);
let selectRadio = ref<string>();
let checkList = ref<Array<string>>([]);
let input = ref<string>("");
let selectTabsRowsType = ref<string>();

onBeforeMount(() => {
  localType.value = parents.selectValue;
  initTables();
});

const handleCurrentChange = (val: SysApplTypeTabsInfoVo | undefined) => {
  currentRow.value = val;
  selectRadio.value = val?.tabsUuid;
  selectTabsRowsType.value = val?.tabsRowsType;
};

// 获取表名称
function initTables() {
  selectRadio.value = "";
  checkList.value = [];
  tabsChecks.value = [];
  http
    .post<any>("/serve/sysApplTypeTabsInfo/findAllTablesCheck", { applCode: parents.applCode, typeCode: localType.value?.value })
    .then((response) => {
      if (response.data != null && response.code == 200) {
        tabsChecks.value = response.data;
        response.data.forEach((element: SysApplTypeTabsInfoVo) => {
          if (localType.value?.checkboxType == SearchType.REDIO && element.checkboxType == SearchType.REDIO && element.typeCode == localType.value.value) {
            selectRadio.value = element.tabsUuid;
            currentRow.value = element;
          }
          if (localType.value?.checkboxType == SearchType.CHECKBOX && element.checkboxType == SearchType.CHECKBOX && element.typeCode == localType.value.value) {
            checkList.value.push(element.tabsUuid);
            multipleSelection.value.push(element);
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
    saveColumns();
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
        param.push({
          uuid: tabs.uuid,
          typeCode: String(localType.value?.value),
          tabsUuid: tabs.tabsUuid,
          checkboxType: SearchType.CHECKBOX,
          sort: tabs.sort,
          tabsRowsType: tabs.tabsRowsType,
        });
      }
    });
  });

  http
    .post<any>("/serve/sysApplTypeTabsInfo/saveList", { list: param })
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

// 保存单选配置列
function saveColumns() {
  tabsChecks.value.forEach((tabs) => {
    if (tabs.tabsUuid == selectRadio.value) {
      let info: SysApplTypeTabsInfo = {
        uuid: tabs.uuid,
        typeCode: String(localType.value?.value),
        tabsUuid: tabs.tabsUuid,
        checkboxType: SearchType.REDIO,
        sort: tabs.sort,
      };
      http
        .post<any>("/serve/sysApplTypeTabsInfo/saveList", { list: [info] })
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
      return;
    }
  });
}

function checkTabColumn(vo: SysApplTypeTabsInfoVo) {
  selectRadio.value = vo.tabsUuid;
  selectTabsRowsType.value = vo.tabsRowsType;
  showColumn.value = true;
}
// 配置列选项
function toColumnConf(item: SysApplTypeTabsInfoVo) {
  selectRadio.value = item.tabsUuid;
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
