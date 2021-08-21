import {WS_MAX_CONN, WS_NETWORK_URLS} from './../../config';
import Conn from './conn';
import Log from '../../util/log';
// ws link
class CrustWsPool {
  private readonly urls: Array<string> = WS_NETWORK_URLS;
  private static instance: CrustWsPool;
  private conns: Array<Conn> = new Array<Conn>();
  public static getInstance(): CrustWsPool {
    this.instance = this.instance || new CrustWsPool();
    return this.instance;
  }
  // 初始化
  public async Init(): Promise<Conn[]> {
    return new Promise<Conn[]>((resolve, reject) => {
      let allNum = 0;
      let err: any = null;
      this.urls.forEach(url => {
        let index = 0; // 保证链接成功一个以上链接
        let sucNum = 0; // 记录所有链接
        const next = () => {
          index++;
          allNum = this.conns.push(new Conn());
          this.conns[allNum - 1]
            .Init(url)
            .then(() => {
              sucNum++;
              if (index <= WS_MAX_CONN) {
                next();
              }
            })
            .catch(er => {
              this.conns.pop();
              next();
              err = er;
            });
        };
        next(); // 开始逐次执行数组中的函数
        Log.info(
          `conn crust server ${url} , set count: ${WS_MAX_CONN} - suc: ${sucNum}`
        );
        allNum += sucNum;
      });
      // TODO BUG
      // end
      Log.info(
        `conn crust server set count: ${
          WS_MAX_CONN * this.urls.length
        } - suc: ${allNum}`
      );
      if (allNum === 0) reject(err);
      else {
        resolve(this.conns);
      }
    });
  }
  // 获取 conn
  public async Conn(): Promise<Conn> {
    let conn = this.conns.find(con => con.IsLock === false);
    while (conn === undefined) {
      conn = this.conns.find(con => con.IsLock === false);
    }
    return conn;
  }
}

export default CrustWsPool.getInstance();
