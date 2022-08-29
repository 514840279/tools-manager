<template>
  <div>
    <el-form :model="form" label-width="120px">
      <el-form-item label="基金名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="买入金额">
        <el-input-number v-model="form.money" :precision="2" :step="0.1" :max="100000" />
      </el-form-item>
      <el-form-item label="买入净值">
        <el-input-number v-model="form.pinjunjingzhi" :precision="4" :step="0.0001" :max="1000" />
      </el-form-item>
      <el-form-item label="手续费">
        <el-input-number v-model="form.shouxufei" :precision="2" :step="0.01" :max="100" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { JijinVo } from "@/interface/jijin";
import http from "@/plugins/http";

import { ref } from "vue";

const emit = defineEmits(["cancel", "success"]);

let form = ref<JijinVo>({
  name: "",
  money: 10000,
  pinjunjingzhi: 1,
  shouxufei: 0,
});

function onSubmit() {
  http
    .post<any>("/jijin/jijin/create", form.value)
    .then((response) => {
      if (response.code == 200) {
        emit("success");
        emit("cancel");
      }
    })
    .catch((err) => {
      // TODO
    });
}

function cancel() {
  emit("cancel");
}
</script>

<style lang="scss" scoped></style>
