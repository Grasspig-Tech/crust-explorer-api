// 入口
import {ApiPromise} from '@polkadot/api';
import {CeNetworkOverview} from '../../model/ce_network_overview';
import {trillionCruFormat} from '../../util';
import CSClient from '../cs-client';
import CrustPool from '../../crust-pool/';

/**
 * @param accounts
 * @param api
 * @returns
 */
export async function queryNetworkOverview(): Promise<CeNetworkOverview> {
  /*
        eras: 纪元详细信息
        blockHeight: 最新块高
     */

  const csclient = new CSClient();
  //   debugger;
  const [totalCirculation, merchants, activeEra]: any = await Promise.all([
    CrustPool.Run<any>((api: ApiPromise) => {
      return api.query.balances.totalIssuance().then(res => res.toString());
    }),
    csclient.queryMerchants(),
    CrustPool.Run<any>((api: ApiPromise) => {
      return api.query.staking.activeEra().then(res => res.toJSON());
    }),
  ]);
  /* 当前纪元号 */
  const era: number = activeEra.index;
  /* 当前纪元的起始时间戳、单位秒 */
  const eraStartTimestamp: number = activeEra.start / 1000;

  /* 总存储量 */
  const {totalStorage} = merchants.data; // 如659370.708984375TB
  /* 每T质押量 */
  const pledgePer = await CrustPool.Run<any>((api: ApiPromise) => {
    return Promise.resolve(api.consts.staking.sPowerRatio?.toJSON());
  });
  const ceNetworkOverview: CeNetworkOverview = {
    era,
    eraStartTimestamp,
    totalStorage: String(totalStorage),
    pledgePer: String(pledgePer),
    totalCirculation: trillionCruFormat(totalCirculation),
  };

  return ceNetworkOverview;
}
