<template>
  <div>
    <el-row>
      <el-col :span="4">
        <div style="margin-top: 5px">
          <TableSelect v-if="applSelect.length > 0" :data="applSelect" title="选择应用" @on-select="clickAppl"></TableSelect>
        </div>
      </el-col>
      <el-col :span="20">
        <TypeCheckBox v-if="applSelectValue" :selectValue="applSelectValue"></TypeCheckBox>
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
import TypeCheckBox from "./TypeCheckBox.vue";

let applSelect = ref<Array<SelectOptions>>([]);
let applSelectValue = ref<SelectOptions>();

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

function clickAppl(item: TypeOptions) {
  applSelectValue.value = item;
}
</script>

<style scoped></style>
