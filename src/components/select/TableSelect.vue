<template>
  <el-scrollbar height="540px">
    <span v-for="(item, key) in localData" :key="key" :class="selectData?.value == item.value ? 'scrollbar-demo-item' : 'scrollbar-select-item'" @click="clickOption(item)" :title="item.label + '(' + item.title + ')'">{{ item.title ? item.title : item.label }}</span>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { SelectOptions } from "@interface/Table";
import { onBeforeMount, ref } from "vue";

const parents = withDefaults(
  defineProps<{
    data: Array<SelectOptions>;
  }>(),
  {
    data: () => [],
  }
);

let localData = ref<Array<SelectOptions>>([]);
let selectData = ref<SelectOptions>();

const emit = defineEmits(["onSelect"]);

onBeforeMount(() => {
  localData.value = parents.data;
  clickOption(localData.value[0]);
});

function clickOption(item: SelectOptions) {
  selectData.value = item;
  emit("onSelect", item);
}
</script>

<style lang="scss" scoped>
#table-select {
  :hover {
    cursor: pointer;
  }
  .scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: left;
    height: 30px;
    // margin: 10px;
    text-align: left;
    // border-radius: 4px;
    border: solid 1px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }
  .scrollbar-select-item {
    display: flex;
    align-items: center;
    justify-content: left;
    height: 30px;
    // margin: 10px;
    text-align: left;
    border-radius: 4px;
    background: var(--el-color-primary-light-9) rgb(142, 194, 196);
    color: var(--el-color-primary);
  }
}
</style>
