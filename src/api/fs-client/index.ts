// server 酱
import got, { Got } from 'got';
import { FS_ROBOT_KEY, FS_ROBOT_REQUEST_URL } from '../../config';
import { CommitErrorMessage } from '../../interface';
import crypto from 'crypto';
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
export default class FSClient {
  private api: string = FS_ROBOT_REQUEST_URL; // server api 地址
  private token: string = FS_ROBOT_KEY; // server token
  private static instance: FSClient;
  public static getInstance(options: object = {}): FSClient {
    this.instance = this.instance || new FSClient(options);
    return this.instance;
  }
  public readonly client: Got; // 后面不可以修改
  constructor(options: object = {}) {
    this.client = got.extend({
      // prefixUrl: this.api,
      // dnsLookupIpVersion: 'ipv4',
      // responseType: 'json',
      // resolveBodyOnly: true,
      headers: {
        'Content-type': 'application/json',
      },
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
  public async send(context = ''): Promise<any> {
    const whenErrorTarget: CommitErrorMessage = {
      target: 'fs_client',
      code: 0,
      payload: context,
    };
    const jsonData = targetDataPackage(context, this.token);
    let res = await this.client.post(this.api, { json: jsonData }).catch(() => {
      whenErrorTarget.code = 2;
      throw whenErrorTarget;
    });
    res = JSON.parse(res.body);
    // throw { target: "fs_client", code: 0, payload: "测试文字" }
    if ((res as any).code) {
      whenErrorTarget.code = 1;
      throw whenErrorTarget;
    }
    return true;
  }
}

function targetDataPackage(text: string, token: string) {
  const curTimestamp = Math.round(Date.now() / 1e3);
  const data = {
    timestamp: curTimestamp,
    sign: crypto
      .createHmac('SHA256', `${curTimestamp}\n${token}`)
      .digest('base64'),
    msg_type: 'text',
    content: {
      text,
    },
  };
  return data;
}
