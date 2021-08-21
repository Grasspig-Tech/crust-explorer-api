import {ApiPromise} from '@polkadot/api';
import grantWs from '../../api/grant-ws';
// import { SignedBlock } from "@polkadot/types/interfaces"
test();

async function test() {
  // Construct
  // const wsProvider = new WsProvider('wss://api.decloudf.com/');
  const api: ApiPromise = await grantWs.connect('getBlock');
  const aa = await api.query.staking.guarantors(
    '5DvTCFuPUXb6Vzg5NB4mFu3Hz95GUqXTMLXib66e4KhF9wxW'
  );

  debugger;
}
