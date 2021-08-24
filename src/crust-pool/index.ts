import {ApiPromise} from '@polkadot/api';
import {WS_MAX_CONN, WS_NETWORK_URLS} from '../config';
import Conn from './conn';
// ws link
class CrustPool {
  private readonly urls: string[] = WS_NETWORK_URLS;
  private static instance: CrustPool;
  private conns: Conn[] = new Array<Conn>();
  static getInstance(): CrustPool {
    this.instance = this.instance || new CrustPool();
    return this.instance;
  }
  // 初始化
  async Init(): Promise<Conn[]> {
    const tmp: Array<Promise<Conn>> = [];
    this.urls.map(url => {
      for (let index = 0; index < WS_MAX_CONN; index++) {
        tmp.push(
          new Promise<Conn>((resolve, reject) => {
            const conn = new Conn();
            conn
              .Init(url)
              .then(() => {
                this.conns.push(conn);
                resolve(conn);
              })
              .catch(conn => {
                reject(conn);
              });
          })
        );
      }
    });
    return await Promise.all(tmp);
  }
  // 执行
  async Run<T>(func: (conn: ApiPromise) => Promise<T>): Promise<T> {
    let index = 0;
    let conn = this.conns.find((con, i) => {
      index = i;
      return con.IsLock === false;
    });
    if (conn === undefined) {
      const len = this.urls.length;
      if (this.conns.length <= len) {
        conn = new Conn();
        await conn.Init(this.urls[Math.floor(Math.random() * (len + 1))]);
        this.conns.push(conn);
      } else {
        conn = this.conns[Math.floor(Math.random() * (this.conns.length + 1))];
      }
    }
    const api = await conn.Api();
    this.conns[index].Lock();
    return func(api).finally(() => {
      if (this.conns[index] !== undefined) this.conns[index].UnLock();
    });
  }
}

export default CrustPool.getInstance();
