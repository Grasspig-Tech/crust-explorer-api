import {ApiPromise} from '@polkadot/api';
import grantWs from '../../api/grant-ws';

test();

async function test() {
  const api: ApiPromise = await grantWs.connect('getBlock');

  const __blockHash = [
    '0x7754d5dc5f74208f0956377976899b97c85066881281179b22972812c206a577', //2369651含有奖励staking(Reaward)事件
    '0x95281e12ea00b7de7ee76516e58e9373aba006899bbb855490542f28378407e2', //2369654含有转账
  ];
  const __blockNum = [
    2369502,
    2369497,
    2356855, //含有失败的交易
    (await api?.query.system.number()).toJSON(), //最新区块高度，不一定是确认的
  ];
  // debugger;
  const blockHash11 = await api.rpc.chain.getBlockHash(__blockNum[2]);
  const block11: any = await api.derive.chain.getBlock(blockHash11);

  debugger;
}
