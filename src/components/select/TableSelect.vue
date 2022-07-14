<template>
  <el-card>
    <div id="table-select">
      <div id="title">
        <b>{{ parents.title }}</b>
      </div>
      <el-scrollbar height="540px">
        <div v-for="(item, key) in localData" :key="key" :class="selectData?.value == item.value ? 'scrollbar-demo-item' : 'scrollbar-select-item'" @click="clickOption(item)">{{ item.label }}</div>
      </el-scrollbar>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { SelectOptions } from "@interface/Table";
import { onBeforeMount, ref } from "vue";

const parents = withDefaults(
  defineProps<{
    data: Array<SelectOptions>;
    title?: string;
  }>(),
  {
    data: () => [],
    title: "",
  }
);

let localData = ref<Array<SelectOptions>>([]);
let selectData = ref<SelectOptions>();

const emit = defineEmits(["onSelect"]);

onBeforeMount(() => {
  localData.value = parents.data;
  debugger;
});
function clickOption(item: SelectOptions) {
  selectData.value = item;
  emit("onSelect", item);
}
</script>

<style lang="scss" scoped>
#table-select {
  .scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: left;
    height: 30px;
    margin: 10px;
    text-align: left;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }
  .scrollbar-select-item {
    display: flex;
    align-items: center;
    justify-content: left;
    height: 30px;
    margin: 10px;
    text-align: left;
    border-radius: 4px;
    background: var(--el-color-primary-light-9) rgb(142, 194, 196);
    color: var(--el-color-primary);
  }
}
</style>
