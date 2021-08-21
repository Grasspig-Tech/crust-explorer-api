import {ApiPromise} from '@polkadot/api';
import grantWs from '../../../api/grant-ws';
import got, {OptionsOfTextResponseBody} from 'got';
import {queryNetworkOverview} from '../../../api/network_overview';
main();
async function main() {
  const api: ApiPromise = await grantWs.connect('aa');
  const time = Date.now();
  const res = await queryNetworkOverview(api);
  console.log('时间：', (Date.now() - time) / 1e3);
  console.log(res);
  debugger;
}
