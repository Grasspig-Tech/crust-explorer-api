// 工具类
import {TEMP_DIR} from '../config';
import fs from 'fs';
import path from 'path';
import Decimal from 'decimal.js';
import {ApiPromise} from '@polkadot/api';
import {
  ClassifyArg,
  ClassifyResult,
  AccountDisplay,
  Status,
} from '../interface';

/**
 * isExtrinsicSuccess((await api?.derive.chain.getBlock(blockHash)).extrinsics[0]  , api)
 * @param extrinsic
 * @param api
 * @returns
 */
export function isExtrinsicSuccess(extrinsic: any, api: ApiPromise): Status {
  if (!extrinsic || !extrinsic.events) {
    return Status.No;
  }
  for (let i = 0; i < extrinsic.events.length; i++) {
    // debugger;
    if (api.events.system.ExtrinsicFailed.is(extrinsic.events[i])) {
      // debugger;
      /* 走进这里，说明交易失败 */
      return Status.No;
    }
  }
  return Status.Yes;
}

/*
   一定要确保arr1和arr2各自中没有重复的数据
*/

export function compare(arr1: any[], arr2: any[], key?: string | string[]) {
  const arr1Only: any = [];
  const arr2Only: any = [];
  const common: any = [];
  const keys: string[] = (typeof key === 'string' ? [key] : key) as string[];
  arr1.forEach(it => {
    if (key) {
      // if (!arr2.find(item => item[key] === it[key])) {
      if (
        !arr2.find(item => {
          for (let i = 0; i < keys.length; i++) {
            if (it[keys[i]] !== item[keys[i]]) {
              return false;
            }
          }
          return true;
        })
      ) {
        arr1Only.push(it);
      } else {
        common.push(it);
      }
    } else {
      if (!arr2.includes(it)) {
        arr1Only.push(it);
      } else {
        common.push(it);
      }
    }
  });
  arr2.forEach(it => {
    if (key) {
      if (
        !arr1.find(item => {
          for (let i = 0; i < keys.length; i++) {
            if (it[keys[i]] !== item[keys[i]]) {
              return false;
            }
          }
          return true;
        })
      ) {
        arr2Only.push(it);
      }
    } else {
      if (!arr1.includes(it)) {
        arr2Only.push(it);
      }
    }
  });
  return {
    arr1Only,
    arr2Only,
    common,
  };
}

/**
 *
 *
 * @export
 * @param {string[]} stashAddress
 * @param {ApiPromise} api
 * id为0x7374616b696e6720的是质押
    id为0x706872656c656374的是选举锁定
    id为0x64656d6f63726163的是民主锁定
    解冻中的还不知道
 */
export async function getLocks(stashAddress: string[], api: ApiPromise) {
  let res: any = await api.queryMulti([
    ...(stashAddress.map(it => [api.query.balances.locks, it]) as any),
  ]);
  res = res.map((it: any) => it.toJSON());
  /* 质押锁定 */
  const stakingLock = res.map((it: any) => {
    const r = it.find((item: any) => item.id === '0x7374616b696e6720');
    return r ? Number(r.amount) : 0;
  });
  /* 选举锁定 */
  const electionLock = res.map((it: any) => {
    const r = it.find((item: any) => item.id === '0x706872656c656374');
    return r ? Number(r.amount) : 0;
  });
  /* 民主锁定 */
  const democracyLock = res.map((it: any) => {
    const r = it.find((item: any) => item.id === '0x706872656c656374');
    return r ? Number(r.amount) : 0;
  });
  return {
    stakingLock,
    electionLock,
    democracyLock,
  };
}

/**
 *
 * 暴力去重
 * @export
 * @param {any[]} repeatData
 * @param {string} [key]
 * @return {*}
 */
export function filterRepeatData(repeatData: any[], key?: string | string[]) {
  const filterData: any[] = [];
  if (key && typeof key === 'string') {
    key = [key] as string[];
  }
  if (key) {
    repeatData.forEach(item => {
      if (
        !filterData.find(it => {
          for (let i = 0; i < (key as string[]).length; i++) {
            if (it[(key as string[])[i]] !== item[(key as string[])[i]]) {
              return false;
            }
          }
          return true;
        })
      ) {
        filterData.push(item);
      }
    });
  } else {
    repeatData.forEach(item => {
      if (!filterData.includes(item)) {
        filterData.push(item);
      }
    });
  }
  return filterData;
}

/**
 * 归类
 * 如：传入[{type: 'aa',data: ['11','22']} , {type: 'bb',data: ['11','33']} , {type: 'cc',data: ['22','44']}]
 * 返回：[{data: 11,type: ['aa','bb']} , {data: 22,type: ['aa','cc']} ,... ]
 *
 * 现在主要是用来区分议会，技术委员会，身份注册商
 * @export
 */

// let res = classifyIdentify([{ type: 'aa', data: ['11', '22'] }, { type: 'bb', data: ['11', '33'] }, { type: 'cc', data: ['22', '44'] }]);
// debugger;
export function classifyIdentify(arg: ClassifyArg[]): ClassifyResult[] {
  const datas = arg
    .map(it => it.data)
    .reduce((prev, cur) => [...prev, ...cur], []);
  const filterRepeatDatas: any[] = [];
  datas.forEach(item => {
    if (!filterRepeatDatas.includes(item)) {
      filterRepeatDatas.push(item);
    }
  });
  const result: ClassifyResult[] = filterRepeatDatas.map(item => {
    const types = (arg.filter(it => it.data.includes(item)) as any).reduce(
      (prev: string[], cur: ClassifyArg) => [...prev, cur.type],
      []
    );
    const res: ClassifyResult = {
      data: item,
      type: types,
    };
    return res;
  });
  return result;
  // allTypes.forEach
}

/**
 *
 *
 * @export
 * @param {*} info
 * @param {*} type 1是blockNum，2是blockHash，3是extrinsic本身，必须是通过api.derive.chain.getBlock(blockHash)返回的extrinsic列表
 * @return {*}  {number}
 */
export async function getBlockTimestamp(
  info: any,
  type: number,
  api: ApiPromise
): Promise<number> {
  let extrinsics: any;
  if (type === 1) {
    /* 通过区块高度获取 */
    const blockHash = await api.rpc.chain.getBlockHash(info);
    extrinsics = (await api.derive.chain.getBlock(blockHash))?.extrinsics;
  } else if (type === 2) {
    extrinsics = (await api.derive.chain.getBlock(info))?.extrinsics;
  } else if (type === 3) {
    extrinsics = info;
  }
  let blockTimestamp = 0;
  extrinsics.find((it: any): any => {
    const {
      method: {section, method, args},
    } = it.extrinsic.toHuman();
    if (section === 'timestamp' && method === 'set') {
      blockTimestamp = ms2S(removeDot(args[0]));
      return true;
    }
  });
  return blockTimestamp;
}
/**
 * 获取事件，交易，奖惩，转账的排序索引
 * 规则：如2242969-2拼接2个0返回2242969002
 * 规则：如2242969-12拼接2个0返回2242969012
 * 规则：如2242969-123拼接2个0返回2242969123
 *
 * @export
 * @return {*}  {string}
 */
export function getSortIndex(indexStr: string): string {
  const [blockNum, theIndex] = indexStr.split('-');
  if (theIndex === undefined) {
    throw new Error('formatIndex传参格式不正确');
  }
  const baseFixNum = 4; //至少4位数
  let sortIndex = theIndex;
  for (let i = theIndex.length; i < baseFixNum; i++) {
    sortIndex = '0' + sortIndex;
  }
  return `${blockNum}${sortIndex}`;
}

/**
 * 通过地址获取提名人列表
 * @param address
 * @param curEra
 * @param api
 * @returns
 */
export async function getNominators(
  address: string[],
  curEra: number,
  api: ApiPromise
): Promise<{validatorAddress: string; nominators: any[]}[]> {
  const queryRes = await api.queryMulti([
    ...(address.map(it => [
      api.query.staking.erasStakers,
      [curEra, it],
    ]) as any),
  ]);
  const nominators = queryRes.map((it: any, index) => ({
    validatorAddress: address[index],
    nominators: it.toJSON().others,
  }));
  return nominators;
}

/* 获取account_display */
export async function getAccountDisplay(
  arr: {address: string}[],
  api: ApiPromise
): Promise<AccountDisplay[]> {
  /* api.derive.accounts.info(vs[0]) */
  /* api.query.identity.identityOf(accountid) */
  const pAll = arr.map(it => {
    return api.derive.accounts.info(it.address);
    // return api.derive.accounts.info
  });
  const querRes = await Promise.all(pAll);
  const res = querRes.map(it => {
    // debugger;
    const judgementsJson = (it.identity.judgements as any).toJSON
      ? (it.identity.judgements as any)?.toJSON()
      : it.identity.judgements;
    const {
      display,
      displayParent,
      email,
      image,
      legal,
      other,
      parent,
      pgp,
    }: any = it.identity;
    const accountDisplay: AccountDisplay = {
      address: it.accountId?.toJSON() as string,
      accountIndex: it.accountIndex as any,
      nickname: it.nickname,
      display,
      displayParent,
      email,
      image,
      judgements: judgementsJson,
      legal,
      other,
      parent,
      pgp,
    };
    return accountDisplay;
  });
  return res;
}

export async function getControllerAddressByStashAddress(
  stashAddress: string[],
  api: ApiPromise
): Promise<string[]> {
  const multi: any = stashAddress.map(it => {
    return [api.query.staking.bonded, it];
  });
  const res = await api.queryMulti([...multi]);
  // debugger;
  const result = res.map(it => {
    // debugger;
    return it.toJSON();
  });
  // debugger;
  return result as string[];
}

/* 将万亿单位CRU数量转为正常cru数量
    不能直接 num / 1e12，如果num过小，会异常，如：50000 / 1e12返回5e-8

    1000 000 000 000 = 1cru

*/

export function trillionCruFormat(
  trillionCru: string | number,
  formatBasic = 12
): string {
  if (Number.isNaN(Number(trillionCru))) {
    throw new Error(`${trillionCru}转化失败`);
  }
  const n = new Decimal(trillionCru);
  const res = n.div(`1e${formatBasic}`).toJSON();
  return res;
}

/**
 * 去掉逗号，如：1,200 -> 1200
 *
 * @export
 */
export function removeDot(str: string | number) {
  if (typeof str === 'number') {
    return str;
  }
  return Number(str.replace(/,/g, ''));
}

/**
 * 定时器，参数单位是ms
 *
 * @export
 * @param {number} [time=1000]
 * @return {*}
 */
export function delay(time = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(time);
    }, time);
  });
}
/**
 * 毫秒转为秒，截取
 *
 * @export
 */
export function ms2S(ms: number) {
  const msStr = String(ms);
  return Number(msStr.slice(0, msStr.length - 3));
}
/**
 * @description 时间格式化
 * @author huazhuangnan
 * @date 2021/09/04
 * @export
 * @param {Date} date
 * @param {string} fmt
 * @return {*}  {string}
 */
export function dateFormat(date: Date, fmt: string): string {
  const o: any = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (const k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
}

/**
 * @description 去除空字符串
 * @author huazhuangnan
 * @date 2021/09/04
 * @export
 * @param {string} str
 * @return {*}  {string}
 */
export function strAllTrim(str: string): string {
  return str.trim().replace(/\s*/g, '');
}

/**
 * @description 暂停时间 mm
 * @author huazhuangnan
 * @date 2021/09/04
 * @export
 * @param {number} mm
 */
export function sleep(mm: number): void {
  const start = Date.now();
  /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
  while (1) {
    const nowTime = Date.now();
    const offset = nowTime - start;
    if (offset >= mm) break;
  }
}

/**
 * @description 写缓存文件
 * @author huazhuangnan
 * @date 2021/09/04
 * @export
 * @param {string} filename
 * @param {string} context
 */
export function tempFileWrite(filename: string, context: string): void {
  const time = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
  }
  fs.writeFile(
    path.resolve(TEMP_DIR, filename),
    context.trim(),
    'utf8',
    err => {
      if (err) console.error(time, '写缓存出错：', 'err: ', err);
    }
  );
}

/**
 * @description 读取缓存文件
 * @author huazhuangnan
 * @date 2021/09/04
 * @export
 * @param {type} params
 */
export function tempFileRead(filename: string): string {
  return fs.readFileSync(path.resolve(TEMP_DIR, filename), {encoding: 'utf-8'});
}

/**
 * @description 判断缓存文件是否存在
 * @author huazhuangnan
 * @date 2021/09/04
 * @export
 * @param {string} filename
 * @return {*}  {boolean}
 */
export function isHaveTempFile(filename: string): boolean {
  return fs.existsSync(path.resolve(TEMP_DIR, filename));
}

/**
 * @description 删除文件
 * @author huazhuangnan
 * @date 2021/09/04
 * @export
 * @param {string} filename
 */
export function tempFileDelete(filename: string): void {
  if (isHaveTempFile(filename)) fs.unlinkSync(path.resolve(TEMP_DIR, filename));
}
