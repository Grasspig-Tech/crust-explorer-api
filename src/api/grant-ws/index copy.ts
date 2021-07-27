import { WS_NETWORK_URL } from "../../config";
import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot } from '@crustio/type-definitions';
class GrantWs {
    private readonly WS_PATH: string = WS_NETWORK_URL;
    public api: ApiPromise | undefined;
    async connect() {
        const wsProvider = new WsProvider(this.WS_PATH);
        // const wsProvider = new WsProvider('wss://rpc.polkadot.io');
        const api = await ApiPromise.create({ provider: wsProvider, typesBundle: typesBundleForPolkadot });
        await api.isReady;
        this.api = api;
    }
}

export default new GrantWs();
