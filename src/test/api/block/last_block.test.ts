import {getLastBlock, getBlockByBlockNum} from '../../../service/block';
import {ApiPromise} from '@polkadot/api';
import grantWs from '../../../api/grant-ws';
import {filterRepeatData} from '../../../util';
main();
async function main() {
  const api: ApiPromise = await grantWs.connect('aa');
  const row = 100;

  const blocks = await getLastBlock({row, api});
  const allAccount = blocks
    .map(it => it.transfers)
    .reduce((prev, cur) => [...prev, ...cur], [])
    .reduce((prev: any, cur) => [...prev, cur.from, cur.to], []);
  console.log(allAccount);
  console.time('cccc');
  const ooo = filterRepeatData(allAccount);
  console.timeEnd('cccc');
  console.log(ooo);
  console.log(blocks);
  debugger;
}
