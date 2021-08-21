// 入口
import {ApiPromise} from '@polkadot/api';
import {CeNetworkOverview} from '../../model/ce_network_overview';
import {trillionCruFormat} from '../../util';
import CSClient from '../cs-client';

/**
 * @param accounts
 * @param api
 * @returns
 */
export async function queryNetworkOverview(
  api: ApiPromise
): Promise<CeNetworkOverview> {
  /*
        eras: 纪元详细信息
        blockHeight: 最新块高
     */
  // debugger;
  const csclient = new CSClient();
  // const [eras, blockHeight] = await Promise.all([
  //     queryEras({ api }),
  //     api.query.system.number().then(res => res?.toJSON()),
  // ]);
  /*
        totalCirculation: 总发行量
        概览
    */
  //   debugger;
  const [totalCirculation, merchants, activeEra]: any = await Promise.all([
    api.query.balances.totalIssuance().then(res => res.toString()),
    csclient.queryMerchants(),
    api.query.staking.activeEra().then(res => res.toJSON()),
  ]);
  // debugger;
  /* 当前纪元号 */
  const era: number = activeEra.index;
  /* 当前纪元的起始时间戳、单位秒 */
  const eraStartTimestamp: number = activeEra.start / 1000;
  // debugger
  /* 总存储量 */
  const totalStorage = merchants.data.totalStorage; //如659370.708984375TB
  /* 每T质押量 */
  const pledgePer = api.consts.staking.sPowerRatio?.toJSON();
  // debugger;

  // pledgeMinimum , pledgePer , pledgeAbleNum , pledgeAvg ,
  // debugger;
  /* Era倒计时 */
  // let countdownEra = ;
  /* session倒计时 */
  // let countdownSession = 0;
  /* 流通率 */
  // let rateFlow = 0;
  /* 通胀率 */
  // let rateInflation = 0;
  /* 当前手续费 */
  // let baseFee = '0';
  /* 有效否：1-生效；0-失效 */
  // let status = 0;

  const ceNetworkOverview: CeNetworkOverview = {
    era,
    eraStartTimestamp,
    totalStorage: String(totalStorage),
    pledgePer: String(pledgePer),
    totalCirculation: trillionCruFormat(totalCirculation),
    // countdownEra: '0',
    // countdownSession: '0',
    // rateFlow: '0',
    // rateInflation: '0',
    // baseFee: '0',
  };

  return ceNetworkOverview;
}
