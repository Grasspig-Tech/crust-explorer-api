import {ApiPromise} from '@polkadot/api';
// import { queryOneBlockByBlockNum } from "../../api/block"
// import { Block } from "../../api/block/interface/block"
import {queryNetworkOverview} from '../../api/network_overview';
/**
 * 通过区块头获取区块，支持多个
 *
 * @export
 */
export async function getNetworkOverviewInfo(api: ApiPromise) {
  try {
    const res = await queryNetworkOverview(api);
    return res;
  } catch (error) {
    throw new Error(error);
  }
}
