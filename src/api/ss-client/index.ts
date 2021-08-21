// server 酱
import got, {Got} from 'got';
import {SERVER_SS_API, SERVER_SS_TOKEN} from '../../config';
import {CommitErrorMessage, SMethod} from '../../interface';

/* example
const ss = new SSClient()
~(async function(){
  // console.log(await ss.send('66666'))
})()
*/
/**
 * @description server 酱类
 * @author huazhuangnan
 * @date 09/04/2021
 * @export
 * @class SSClient
 */
export default class SSClient {
  private api: string = SERVER_SS_API; // server api 地址
  private token: string = SERVER_SS_TOKEN; // server token
  public readonly client: Got; // 后面不可以修改
  private static instance: SSClient;
  public static getInstance(options: object = {}): SSClient {
    this.instance = this.instance || new SSClient(options);
    return this.instance;
  }
  constructor(options: object = {}) {
    this.client = got.extend({
      prefixUrl: `${this.api}/${this.token}.send`,
      dnsLookupIpVersion: 'ipv4',
      responseType: 'json',
      resolveBodyOnly: true,
      // http2: true
      ...options,
    });
  }
  /**
   * @description 发送消息
   * @author huazhuangnan
   * @date 09/04/2021
   * @param {string} title
   * @param {string} [context='']
   * @param {SMethod} [type='post']
   * @return {*}  {Promise<any>}
   * @memberof SSClient
   */
  public async send(
    config: {
      title: string;
      context: string;
      type?: SMethod;
    } = {title: '', context: '', type: 'post'}
  ): Promise<any> {
    const {title, context, type = 'post'} = config;
    const data = {title: title, desp: context};
    const whenErrorTarget: CommitErrorMessage = {
      target: 'ss_client',
      code: 0,
      payload: {title, context},
    };
    let res;
    try {
      res =
        type.toLowerCase() === 'get'
          ? await this.client.get('', {searchParams: data})
          : await this.client.post('', {form: data});
    } catch (error) {
      whenErrorTarget.code = 2;
      throw whenErrorTarget;
    }
    if ((res as any).code) {
      /* 发生错误，重新发送 */
      whenErrorTarget.code = 1;
      throw whenErrorTarget;
    }
    return res;
  }
}
