import {WS_NETWORK_URL} from '../../config';
import {ApiPromise, WsProvider} from '@polkadot/api';
import {typesBundleForPolkadot} from '@crustio/type-definitions';
class GrantWs {
  private readonly WS_PATH: string = WS_NETWORK_URL;
  public api: {key: string; api: ApiPromise}[] = [];
  public getApi(key: string): undefined | ApiPromise {
    return this.api.find(it => it.key === key)?.api;
  }
  async connect(key: string) {
    let api: any = this.getApi(key);
    if (api) {
      return api;
    }
    const wsProvider = new WsProvider(this.WS_PATH);
    api = await ApiPromise.create({
      provider: wsProvider,
      typesBundle: typesBundleForPolkadot,
    });
    await api.isReady;
    this.api.push({
      key,
      api,
    });
    return api;
  }
}

export default new GrantWs();
