import got, {Got} from 'got';
import * as cryptoJS from 'crypto-js';
import {SERVER_API, SERVER_TOKEN} from '../../config';

/**
 * @description server 端
 * @author huazhuangnan
 * @date 09/04/2021
 * @class SClient
 */
export default class SClient {
  private api: string = SERVER_API; // server api 地址
  private token: string = SERVER_TOKEN; // server token
  public readonly client: Got; // 后面不可以修改
  constructor(options: object = {}) {
    // console.log("-----------")
    this.client = got.extend({
      prefixUrl: this.api,
      dnsLookupIpVersion: 'ipv4',
      responseType: 'json',
      resolveBodyOnly: true,
      // http2: true
      ...options,
    });
    // console.log("00")
  }

  /**
   * @description 查询矿池列表
   * @author huazhuangnan
   * @date 2021/09/04
   * @return {*}  {Promise<any>}
   * @memberof SClient
   */

  public async queryList(): Promise<any> {
    return await this.client.get('./pool/list', {
      searchParams: {
        sign: cryptoJS.SHA256(this.token).toString(),
      },
    });
  }
  /**
   * @description 提交数据
   * @author huazhuangnan
   * @date 2021/09/04
   * @return {*}  {Promise<any>}
   * @memberof SClient
   */
  public async pullData(data: Record<string, any>): Promise<any> {
    // console.log("pullData")
    return '测试';
    // return await this.client.post('./pool/detail', {
    //   form: {
    //     sign: cryptoJS.SHA256(this.token).toString(),
    //     body: JSON.stringify(data),
    //   },
    // });
  }
}
