import {ApiPromise} from '@polkadot/api';
import grantWs from '../../api/grant-ws';
import {getAccountDisplay} from '../../util';

main();
async function main() {
  const api: ApiPromise = await grantWs.connect('aa');
  const arg = [
    {
      accountType: 1,
      address: '5CJ2GyPuBsvJ5xYv7ZmLcH25WXJKGFJPFN2dhFUcMNBo97ss',
    },
    {
      accountType: 2,
      address: '5FBs3aqYmyBREyrW9CDsUKARbwsPPffniPPCDmQonTaMLqb2',
    },
    {
      accountType: 1,
      address: '5F98z3EwEGKhGip2dm6QU1fTw1YPb5puTPPhZkZvoZcYrLkL',
    },
    {
      accountType: 2,
      address: '5F98z3EwEGKhGip2dm6QU1fTw1YPb5puTPPhZkZvoZcYrLkL',
    },
    {
      accountType: 1,
      address: '5D9eg14ywGZopvbaXvs5bp9NA3XhocaErDjaFUepGVghjxD6',
    },
  ];
  const res = await getAccountDisplay(
    arg.map(it => ({address: it.address})),
    api
  );
  console.log(res);

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
