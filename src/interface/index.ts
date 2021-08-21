import {
  CeBlock,
  CeBondedPledge,
  CeEraStat,
  CeEvent,
  CeExtrinsic,
  CeMember,
  CeNominator,
  CeRewardSlash,
  CeTransfer,
} from '../model';

/* async函数或普通函数 */
export type PromiseFuncOrPlainFunc = (...args: any[]) => Promise<any> | any;
// 日志类型
export type LogType = 'ERROR' | 'INFO' | 'WARING' | 'DEBUG';
// 飞书机器人支持的请求方法
export type FsRobotSupportMethod = 'post' | 'POST';
// server酱支持类型
export type SMethod = 'post' | 'POST' | 'get' | 'GET';
// 报错返回格式
export interface CommitErrorMessage {
  target: string;
  code: number;
  payload?: any;
}

//
export type ErrorConfig = {
  /**
   * 错误标识码，0为正常
   *
   * @type {number}
   * @memberof ERROR_CONFIG
   */
  code: number;
  /**
   * 函数，
   * number：如task:1，表示执行code=1的task
   * null或undefined：不执行任务
   *
   * @type {(Function | number | null | undefined)}
   * @memberof ERROR_CONFIG
   */
  task: number | ((payload: any) => any | Promise<any>);
};

//
/**
 * 定时器任务里的配置
 * timeConfig：时间配置，如'0 30 5,11,17,23 * * *'
 * task：定时任务函数（支持async函数）
 * nodeCronConfig：nodeCron的第三个参数，默认是{scheduled:true}
 */
export interface NodecronTaskConfig {
  timeConfig: string;
  task: PromiseFuncOrPlainFunc;
  nodeCronConfig?: object; //node-cron的
}

/**
 * 请求数据类型
 */
export interface ResultInfo {
  poolName: string; // 节点名称
  poolAddress: string; // 节点地址
  earningsAddress: string; // 收益地址
  controlAddress: string; // 控制账户
  earningsAmount: number; // 收益余额
  totalSpace: number; // 存储总量
  pledgeLimit: number; // 质押上限
  totalPledge: number; // 质押总量
  activePledge: number; // 有效质押
  rate: number; // 担保费率
  earnings: number; // 收益
  blockNum: number; // 区块高度
  networkSpace: number; // 全网总量
  networkPledge: number; // 全网质押
}

/**
 * 响应结果
 */
export interface ResponseInfo {
  code?: string;
  msg?: string;
  data?: any;
}

/**
 * /api/account/index.ts中的参数类型
 */
export interface AccountArg {
  address: string;
  role?: Role; //1为验证人，2为候选验证人,3为提名人
  accountType: AccountType; //1为存储账户，2为控制账户
  rank?: number; //排名
  isCouncilMember?: number;
  isEvmContract?: number;
  isRegistrar?: number;
  isTechcommMember?: number;
}
/**
 * /api/block/index.ts中的返回的类型
 */
export interface Block extends CeBlock {
  events: CeEvent[];
  extrinsics: CeExtrinsic[];
  transfers: CeTransfer[];
  rewardSlashes: CeRewardSlash[];
}
/**
 * /api/block/index.ts中的返回的类型
 */
export interface EraResult {
  eraStat: CeEraStat;
  bondedPledges: CeBondedPledge[];
  members: CeMember[];
  nominators: CeNominator[];
  accounts: AccountArg[];
}

/**
 * /util/index.ts中classifyIdentify函数会用到
 */
export interface ClassifyArg {
  type: string;
  data: any[];
}
/**
 * /util/index.ts中classifyIdentify函数会用到
 */
export interface ClassifyResult {
  data: any;
  type: string[];
}
/**
 *  0失败1成功
 */
export enum Status {
  No = 0,
  Yes = 1,
}

/**
 * 1是验证人2是候选验证人3是提名人
 */
export enum Role {
  Validator = 1,
  WaitingValidator,
  Nominator,
}
/**
 * 1是存储账户2是控制账户
 */
export enum AccountType {
  Stash = 1,
  Controller = 2,
}
/**
 * 主要用在TinyInt类型
 */
// export type TinyInt<T> = T;

// export type TinyIs = TinyInt<0 | 1>;

// export type TinyRole = TinyInt<1 | 2 | 3>

// export type TinyAccountType = TinyInt<1 | 2>

/**
 * EraInfo
 */
export interface EraArg {
  activeEra: number;
  activeEraStart: number;
  validatorCount?: number;
}
/* 获取账户的display */
export interface AccountDisplay {
  address: string;
  accountIndex?: number;
  nickname?: string;
  display?: string;
  displayParent?: string;
  email?: string;
  image?: string;
  legal?: string;
  other?: Record<string, string>;
  parent?: string;
  pgp?: string;
  riot?: string;
  twitter?: string;
  web?: string;
  judgements: Object;
}
