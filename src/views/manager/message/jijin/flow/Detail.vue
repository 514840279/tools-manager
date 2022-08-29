<template>
  <div>
    <el-descriptions class="margin-top" title="With border" :column="2" border>
      <template #extra>
        <el-button type="primary">Operation</el-button>
      </template>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">名称</div>
        </template>
        {{ jidata.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">标准值</div>
        </template>
        {{ jidata.money }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">累计金额</div>
        </template>
        {{ jidata.countMoney }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label> 累计份额 </template>
        {{ jidata.countFene }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label> 标准净值 </template>
        {{ jidata.pinjunjingzhi }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label> 标准营收 </template>
        {{ jidata.yingshou }}
      </el-descriptions-item>
      <!-- <el-descriptions-item>
        <template #label> 标准利润 </template>
        {{ jidata.lirun }}
      </el-descriptions-item> -->
    </el-descriptions>

    <el-row>
      <el-col :span="12"><el-input-number v-model="flow.danweijingzhi" :min="0.0001" :max="10" @change="handleChange" /></el-col>
      <el-col :span="12"><div class="grid-content ep-bg-purple-light" /></el-col>
    </el-row>
    <el-card shadow="always">
      <div v-if="maimai == 'mairu'">
        支付： <span style="color: red; font-size: 22px">{{ flow.zhifuMoney }} </span>,买入： {{ flow.mairuFene }} 份额
        <div>支付：<el-input-number v-model="flow.zhifuMoney" :min="0.01" :max="100000" precision="2" @change="handleChangeZhifuMoney" /> 手续费： <el-input-number v-model="flow.shouxufei" :min="0.0" :max="100000" precision="2" @change="handleChangeZhifuMoney" /></div>
        <div><el-button type="primary" @click="mairu">确认买入</el-button></div>
      </div>
      <div v-if="maimai == 'maichu'">
        卖出：<span style="color: red; font-size: 22px"> {{ flow.maichuFene }}</span> 份,赎回{{ flow.shuhuiMoney }}
        <div>卖出：<el-input-number v-model="flow.maichuFene" :min="0.01" :max="100000" precision="2" @change="handleChangeMaichuFene" /> 手续费： <el-input-number v-model="flow.shouxufei" :min="0.0" :max="100000" precision="2" @change="handleChangeMaichuFene" /></div>
        <div><el-button type="primary" @click="maichu">确认卖出</el-button></div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { JijinVo } from "@/interface/jijin";
import http from "@/plugins/http";
import { computed, onBeforeMount, ref } from "vue";

const parents = withDefaults(
  defineProps<{
    current: JijinVo;
  }>(),
  {
    current: () => {
      return {
        name: "",
        money: 0.01,
        pinjunjingzhi: 0.0001,
        shouxufei: 0,
        countMoney: 0,
        countFene: 0,
      };
    },
  }
);

const emit = defineEmits(["cancel", "success"]);

let jidata = ref<JijinVo>({ name: "", money: 0.01, pinjunjingzhi: 0.0001, shouxufei: 0, countMoney: 0, countFene: 0 });
let num = ref<number>(0);
let maimai = ref<string>("");

let flow = ref<any>({
  jiUuid: jidata.value.uuid,
  danweijingzhi: 0,
  zhifuMoney: 0,
  maichuFene: 0,
  shuhuiMoney: 0,
  shouxufei: 0,
});

onBeforeMount(() => {
  jidata.value = parents.current;
  console.log(jidata.value);
  flow.value.jiUuid = jidata.value.uuid;
});

function handleChange() {
  let cmoney = Number(jidata.value.countFene) * flow.value.danweijingzhi;
  let money = jidata.value.money;

  if (money > cmoney) {
    // 推荐买入
    let zhifuMoney = (Number(money) - cmoney).toFixed(2);
    let fene = (Number(zhifuMoney) / flow.value.danweijingzhi).toFixed(2);
    flow.value.zhifuMoney = zhifuMoney;
    flow.value.mairuFene = fene;
    maimai.value = "mairu";
  } else if (money < cmoney) {
    // 推荐卖出
    let shuhuiMoney = (cmoney - Number(money)).toFixed(2);
    let fene = (Number(shuhuiMoney) / flow.value.danweijingzhi).toFixed(2);
    flow.value.shuhuiMoney = shuhuiMoney;
    flow.value.maichuFene = fene;
    maimai.value = "maichu";
  }
}

function handleChangeZhifuMoney() {
  let fene = ((Number(flow.value.zhifuMoney) - flow.value.shouxufei) / flow.value.danweijingzhi).toFixed(2);
  flow.value.mairuFene = fene;
  maimai.value = "mairu";
}

function mairu() {
  http
    .post<any>("/jijin/jijin/mairu", flow.value)
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

function handleChangeMaichuFene() {
  let shuhuiMoney = (flow.value.maichuFene * flow.value.danweijingzhi - flow.value.shouxufei).toFixed(2);
  flow.value.shuhuiMoney = shuhuiMoney;
}
function maichu() {
  http
    .post<any>("/jijin/jijin/maichu", flow.value)
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
</script>

<style lang="scss" scoped></style>
