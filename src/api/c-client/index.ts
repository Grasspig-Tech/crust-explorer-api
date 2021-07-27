import got, {Got} from 'got';
import {CRUST_SUBSCAN_API, CRUST_SUBSCAN_TOKEN} from '../../config';

/**
 * @description crust subscan api
 * @author huazhuangnan
 * @date 09/04/2021
 * @class CClient
 */
export default class CClient {
  private api: string = CRUST_SUBSCAN_API; // server api 地址
  private token: string = CRUST_SUBSCAN_TOKEN; // server token
  public readonly client: Got; // 后面不可以修改
  constructor(options: object = {}) {
    this.client = got.extend({
      prefixUrl: this.api,
      dnsLookupIpVersion: 'ipv4',
      responseType: 'json',
      resolveBodyOnly: true,
      // http2: true
      headers: {
        'X-API-Key': this.token,
      },
      ...options,
    });
  }

  /**
   * @description 查询 地址的区块奖励
   * @author huazhuangnan
   * @date 09/04/2021
   * @param {string} address
   * @param {number} [page=0]
   * @param {number} [row=20]
   * @return {*}  {Promise<any>}
   * @memberof CClient
   */
  public async queryAccountRewards(
    address: string,
    page = 0,
    row = 20
  ): Promise<any> {
    return await this.client.post('./scan/account/reward_slash', {
      json: {
        address,
        page,
        row,
      },
    });
  }
  public async queryToken(): Promise<any> {
    return await this.client.get('./scan/token');
  }
}
