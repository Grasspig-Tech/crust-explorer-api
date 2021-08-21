import {ApiPromise} from '@polkadot/api';
import grantWs from '../../../api/grant-ws';
import got, {OptionsOfTextResponseBody} from 'got';
import {queryEras} from '../../../api/era';
import {filterRepeatData} from '../../../util';
main();
async function main() {
  const api: ApiPromise = await grantWs.connect('aa');
  // debugger;
  console.time('测试');
  const {response: res} = await queryEras({api});
  console.timeEnd('测试');
  console.log(res);
  debugger;
  const realNominators: any = [];
  res.nominators.forEach(it => {
    if (
      !realNominators.find(
        (item: any) => item.nominatorAddress === it.nominatorAddress
      )
    ) {
      realNominators.push(it);
    }
  });
  console.log('真实提名人数：', realNominators.length);
  console.log(res);
  // console.log(realNominators.map(it => it.nominatorAddress))
  debugger;
}
