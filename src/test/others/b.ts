import {ApiPromise} from '@polkadot/api';
import grantWs from '../../api/grant-ws';
import {SignedBlock} from '@polkadot/types/interfaces';
test();

async function test() {
  // Construct
  // const wsProvider = new WsProvider('wss://api.decloudf.com/');
  const api: ApiPromise = await grantWs.connect('getBlock');
  const asd = await api.query.identity.identityOf(
    '5HoubEEVnhHr2ztBA23PwcMci5yHqvVfc2zrc7RLzfQTw79Y'
  );
  const asd2 = await api.query.staking.validators(
    '5HoubEEVnhHr2ztBA23PwcMci5yHqvVfc2zrc7RLzfQTw79Y'
  );
  const tmp: any = await api.query.staking.bonded(
    '5CJ2GyPuBsvJ5xYv7ZmLcH25WXJKGFJPFN2dhFUcMNBo97ss'
  );
  // let oop = await api.queryMulti([
  //     [api.query.staking.erasStakersClipped, [811, '5DvTCFuPUXb6Vzg5NB4mFu3Hz95GUqXTMLXib66e4KhF9wxW']],
  //     [api.query.staking.erasStakers, [811, '55']],
  //     [api.query.staking.ledger, tmp.toHuman()]
  // ])
  console.log(asd);
  debugger;

  // debugger;
}
