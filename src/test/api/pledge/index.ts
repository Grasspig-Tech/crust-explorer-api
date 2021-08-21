import {ApiPromise} from '@polkadot/api';
import grantWs from '../../../api/grant-ws';
import got, {OptionsOfTextResponseBody} from 'got';
import {queryPledge} from '../../../api/pledge';
main();
async function main() {
  const api: ApiPromise = await grantWs.connect('aa');
  const accountAddress = [
    {
      address: '5DvTCFuPUXb6Vzg5NB4mFu3Hz95GUqXTMLXib66e4KhF9wxW',
      role: 1,
      // accountType: 1,
    }, //德坤数矿(DKSK)星城的账户
    // {
    //     address: '5FBs3aqYmyBREyrW9CDsUKARbwsPPffniPPCDmQonTaMLqb2',
    //     role: 1,
    //     accountType:2,
    // },//德坤数矿(DKSK)星城的控制账户
  ];
  let curEra: any = await api.query.staking.activeEra();
  curEra = curEra.toJSON();

  debugger;
  const res = await queryPledge(accountAddress, api, {
    activeEra: curEra.index,
    activeEraStart: curEra.start,
  });
  console.log(res);
  debugger;
}
