export interface JijinVo {
  uuid?: string,
  // 基金名称
  name: string;
  // 基金代码
  code?: string;
  // 标准值
  money: number;
  // 累计金额
  countMoney?: number;
  // 累计份额
  countFene?: number;
  // 标准净值
  pinjunjingzhi: number;
  // 标准营收
  yingshou?: number;
  // 标准利润
  lirun?: number;
  shouxufei?: number;
}
