<template>
  <div>
    <el-row>
      <el-col :span="4">
        <div>
          <el-select v-model="applSelectValue" placeholder="选择应用" size="small" @change="toloadTypes" style="width: 100%">
            <el-option v-for="item in applSelect" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div style="margin-top: 5px">
          <TableSelect v-if="typeSelect.length > 0" :data="typeSelect" title="选择类型" @on-select="clickType"></TableSelect>
        </div>
      </el-col>
      <el-col :span="20">
        <TableCheckBox v-if="typeSelectValue" :selectValue="typeSelectValue"></TableCheckBox>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import http from "@/plugins/http";
import { Column, SearchType, SelectOptions } from "@interface/Table";
import { onBeforeMount, ref } from "vue";
import TableSelect from "@components/select/TableSelect.vue";
import { TypeOptions } from "@/interface/SysApp";
import TableCheckBox from "./TableCheckBox.vue";

let applSelect = ref<Array<SelectOptions>>([]);
let applSelectValue = ref<string>();

let typeSelect = ref<Array<TypeOptions>>([]);
let typeSelectValue = ref<TypeOptions>();

let columns = ref<Array<Column>>();
onBeforeMount(() => {
  loadAppl();
  init();
});

function init() {
  columns.value = [
    {
      name: "uuid",
      title: "uuid",
      align: "left",
      show: false,
    },
    {
      name: "applCode",
      title: "应用代码",
      align: "left",
      search: true,
      sort: true,
      searchType: SearchType.SELECT,
      searchDataArray: applSelect.value,
    },
    {
      name: "typeCode",
      title: "类型代码",
      align: "center",
      search: true,
    },
    {
      name: "typeName",
      title: "类型名称",
      align: "center",
      search: true,
    },
    {
      name: "checkboxType",
      title: "选择类型",
      subtitle: "单选类型，在同一个应用中有且仅有一个",
      align: "center",
      search: true,
      searchType: SearchType.REDIO,
      searchDataArray: [
        {
          value: SearchType.CHECKBOX,
          label: "多选",
        },
        {
          value: SearchType.REDIO,
          label: "单选",
        },
      ],
    },
    {
      name: "sort",
      title: "显示顺序",
      align: "left",
      sort: true,
    },
    {
      name: "discription",
      title: "描述",
      align: "left",
    },
  ];
}

// 加载类型信息
function loadAppl() {
  http
    .post<any>("/serve/sysApplInfo/findAll", {})
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((element: any) => {
          let op: SelectOptions = {
            value: element.applCode,
            label: element.applName,
          };
          applSelect.value?.push(op);
        });
      }
    })
    .catch((err) => {
      // TODO
    });
}
// 加载类型
function toloadTypes() {
  typeSelect.value = [];
  http
    .post<any>("/serve/sysApplTypeInfo/findAllBySort", {
      info: { applCode: applSelectValue.value },
      sortList: [
        {
          sortIndex: 1,
          sortTitle: "类型",
          sortOrder: "desc",
          sortName: "checkboxType",
        },
        {
          sortIndex: 2,
          sortTitle: "排序",
          sortOrder: "asc",
          sortName: "sort",
        },
      ],
    })
    .then((response) => {
      if (response.data != null && response.code == 200) {
        response.data.forEach((element: any) => {
          let op: TypeOptions = {
            value: element.typeCode,
            label: element.typeName,
            checkboxType: element.checkboxType,
            uuid: element.uuid,
          };
          typeSelect.value?.push(op);
        });
      }
    })
    .catch((err) => {
      // TODO
    });
}

function clickType(item: TypeOptions) {
  typeSelectValue.value = item;
}
</script>

<style scoped></style>
