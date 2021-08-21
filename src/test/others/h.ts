import {ApiPromise} from '@polkadot/api';
import grantWs from '../../api/grant-ws';
import {SignedBlock} from '@polkadot/types/interfaces';
import {getBlockTimestamp} from '../../util';
import {getLocks} from '../../util';
test();

async function test() {
  // Construct
  // const wsProvider = new WsProvider('wss://api.decloudf.com/');
  const api: ApiPromise = await grantWs.connect('getBlock');
  // let rr = await api.rpc.payment.queryInfo('0xf9c5707c309b4c3c975b8b014e24175935a3dc3e1fde5e5e2d16e56ccb748e36', '0x7fba87d04bbfe4e4f730605e866235c784ce3175f324397d924a26f5e69208d2');
  // let rr2 = await api.query.balances.account('5G4ch9r3xoxUUGoWLbTGJzke419FbkhoNCVTxotCQQALp8tw')
  // let awe = await api.query.balances.locks.entries()
  const aa = await api.query.balances
    .totalIssuance()
    .then(res => res.toString());
  console.log(aa);
  debugger;

  // debugger;
}
