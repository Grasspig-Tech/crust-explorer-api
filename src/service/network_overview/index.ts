import {queryNetworkOverview} from '../../api/network_overview';
/**
 * 通过区块头获取区块，支持多个
 *
 * @export
 */
export async function getNetworkOverviewInfo() {
  return await queryNetworkOverview()
    .then(res => {
      return res;
    })
    .catch(err => {
      throw err;
    });
}
