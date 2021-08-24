import {typesBundleForPolkadot} from '@crustio/type-definitions';
import {ApiPromise, WsProvider} from '@polkadot/api';

// ws conn
class Conn {
  private api!: ApiPromise;
  IsLock!: boolean;
  // init api
  async Init(url: string): Promise<ApiPromise> {
    const wsProvider = new WsProvider(url);
    const api = await ApiPromise.create({
      provider: wsProvider,
      typesBundle: typesBundleForPolkadot,
    });
    this.api = api;
    this.IsLock = false;
    api.once('error', async () => {
      this.Lock();
      api.connect();
      await api.isReady;
      this.UnLock();
    });
    api.once('disconnected', async () => {
      this.Lock();
      api.connect();
      await api.isReady;
      this.UnLock();
    });
    return await this.api.isReady;
  }
  // get api
  async Api(): Promise<ApiPromise> {
    return this.api;
  }
  // lock api
  Lock() {
    this.IsLock = true;
  }
  // unlock api
  UnLock() {
    this.IsLock = false;
  }
}

export default Conn;
