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
    const len = this.urls.length;
    const maxLen = WS_MAX_CONN * len;
    return new Promise<Conn[]>((resolve, reject) => {
      let index = 0; // 当前 conns 索引
      let allCount = 0; // urls 总循环次数
      // 遍历所有链接
      this.urls.forEach(url => {
        let count = 0; // url 总次数
        let sucCount = 0; // url 成功次数
        const next = () => {
          count++; // url 总次数增加
          allCount++; // urls 总数增加
          // 新建一个 Conn
          index = this.conns.push(new Conn()) - 1;
          this.conns[index]
            .Init(url)
            .then(() => {
              // 成功
              sucCount++;
              // 如果总次数还没超过最大限制，继续 next
              if (count < WS_MAX_CONN) {
                next();
              } else {
                Log.info(
                  `conn crust server ${url} , set count: ${WS_MAX_CONN} - suc: ${sucCount}`
                );
                // 相等了退出
                if (allCount === maxLen && index >= 1) {
                  Log.info(
                    `conn crust server set count: ${maxLen} - suc: ${allCount}`
                  );
                  resolve(this.conns);
                }
              }
            })
            .catch(err => {
              // 如果总次数还没超过最大限制，继续 next
              if (count <= WS_MAX_CONN) {
                // 出错了，把最后一个删除,索引等下自动更新
                this.conns.pop();
                // 继续 next()
                next();
              } else {
                Log.info(
                  `conn crust server ${url} , set count: ${WS_MAX_CONN} - suc: ${sucCount}`
                );
                // 如果全都错误
                if (allCount === maxLen && index === 0) {
                  Log.info(
                    `conn crust server set count: ${maxLen} - suc: ${index + 1}`
                  );
                  reject(err);
                }
              }
            });
        };
        next(); // 开始逐次执行数组中的函数
      });
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
