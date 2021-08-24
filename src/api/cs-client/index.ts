import got, {Got} from 'got';
import {SPLORER_API, SPLORER_AUTHORIZATION} from '../../config';

/**
 * @description crust storage api
 * @author huazhuangnan
 * @date 09/04/2021
 * @class CSClient
 */
export default class CSClient {
  private api: string = SPLORER_API; // crust storage api 地址
  private authorization: string = SPLORER_AUTHORIZATION; // crust storage authorization
  readonly client: Got; // 后面不可以修改
  constructor(options: object = {}) {
    this.client = got.extend({
      prefixUrl: this.api,
      dnsLookupIpVersion: 'ipv4',
      responseType: 'json',
      resolveBodyOnly: true,
      headers: {
        Authorization: this.authorization,
      },
      ...options,
    });
  }

  /**
   * @description 查询 地址的存储信息
   * @author huazhuangnan
   * @date 09/04/2021
   * @param {string} address
   * @param {number} [page=0]
   * @param {number} [row=20]
   * @return {*}  {Promise<any>}
   * @memberof CSClient
   */
  async queryOwners(
    address: string,
    pageSize = 20,
    pageIndex = 1
  ): Promise<any> {
    return await this.client.get('./owners', {
      searchParams: {
        pageSize,
        pageIndex,
        condition: address,
      },
    });
  }
  async queryMerchants(): Promise<any> {
    return await this.client.get('./merchantsOverview');
  }
}
