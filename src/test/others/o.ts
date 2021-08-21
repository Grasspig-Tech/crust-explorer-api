import {ApiPromise} from '@polkadot/api';
import grantWs from '../../api/grant-ws';
import {SignedBlock} from '@polkadot/types/interfaces';
import {
  compare,
  filterRepeatData,
  getBlockTimestamp,
  getControllerAddressByStashAddress,
} from '../../util';
import {getLocks} from '../../util';
import got from 'got';
import {queryEras} from '../../api/era';
test();

async function test() {
  // Construct
  // const wsProvider = new WsProvider('wss://api.decloudf.com/');
  // debugger;
  const api: ApiPromise = await grantWs.connect('getBlock');

  // let rr = await api.rpc.payment.queryInfo('0xf4727ff4fbc3b3985e3f5f75f8889672e08c5ab62ed5f2d1ca5665b69b89cf7b', '0x00f14cd95a0a0c436ec402c4a61ec5f851131f7b3005fbbfdc1625b7afcecccf')
  // console.log(rr)

  debugger;

  // debugger;
}
