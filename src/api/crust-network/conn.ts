import {typesBundleForPolkadot} from '@crustio/type-definitions';
import {ApiPromise, WsProvider} from '@polkadot/api';

// ws conn
class Conn {
  private api!: ApiPromise;
  public IsLock!: boolean;
  // init api
  public async Init(url: string): Promise<ApiPromise> {
    const wsProvider = new WsProvider(url);
    const api = await ApiPromise.create({
      provider: wsProvider,
      typesBundle: typesBundleForPolkadot,
    });
    this.api = api;
    this.IsLock = false;
    return await api.isReadyOrError;
  }
  // get api
  public async Api(): Promise<ApiPromise> {
    // 等待解锁
    while (this.IsLock === true) {
      await this.api?.isReady;
    }
    return this.api;
  }
  // lock api
  public Lock() {
    this.IsLock = true;
  }
  // unlock api
  public UnLock() {
    this.IsLock = false;
  }
}

export default Conn;
