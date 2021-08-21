import {getLastBlock, getBlockByBlockNum} from '../../../service/block';
import {ApiPromise} from '@polkadot/api';
import grantWs from '../../../api/grant-ws';
import {filterRepeatData} from '../../../util';
main();
async function main() {
  const api: ApiPromise = await grantWs.connect('aa');
  const row = 100; //每页条数
  // const start: number = 2483840;//起始区块高度
  // const start: number = 2540296;//起始区块高度
  const start = 2534642; //起始区块高度
  const blockNums = getBlockNums(start, row);
  const blocks = await getBlockByBlockNum(blockNums, api);
  const allAccount = blocks
    .map(it => it.transfers)
    .reduce((prev, cur) => [...prev, ...cur], [])
    .reduce((prev: any, cur) => [...prev, cur.from, cur.to], []);
  console.log(allAccount);
  const ooo = filterRepeatData(allAccount);
  console.log(ooo);
  console.log(blocks);
  debugger;
  
  console.log(blocks);
  debugger;
}

function getBlockNums(start: number, row: number): number[] {
  const blockNums: number[] = []; //查询的区块高度列表
  for (let i = 0; i < row; i++) {
    if (start - i < 0) {
      break;
    }
    blockNums.push(start - i);
  }
  return blockNums;
}
